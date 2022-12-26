import { RedisClientType } from '@redis/client';
import { Knex } from 'knex';

import { Filter, IUser, IUserFilter, Update } from 'src/schema/types';
import { existsOrError } from 'src/utils';

import { DatabaseService } from './database.service';
import { ProfileService } from './profile.service';

export class UserService extends DatabaseService {
	constructor(conn: Knex, cache: RedisClientType, private profileService: ProfileService) {
		super(conn, cache, 'users');
	}

	async create(item: IUser): Promise<any> {
		try {
			const profilesIds = [];
			if (item.profiles) {
				for (const filter of item.profiles) {
					const profile = await this.profileService.findOne(filter);
					profilesIds.push(profile.id);
				}
			}

			Reflect.deleteProperty(item, 'profiles');
			const user = (await super.create(item)) as IUser;

			for (const profile_id of profilesIds) {
				await this.instance('users_profiles').insert({ user_id: user.id, profile_id });
			}

			return user;
		} catch (err) {
			return err;
		}
	}

	async update(params: Update<IUserFilter, IUser>): Promise<any> {
		try {
			const { filter, data } = params;
			const fromDB = (await this.findOne(filter)) as IUser;

			existsOrError(fromDB, 'Not found user!');
			const { id, email } = fromDB;

			if (data.profiles) {
				await this.instance('users_profiles').where({ user_id: id }).del();
				for (const filter of data.profiles) {
					const profile = await this.profileService.findOne(filter);
					if (profile) await this.instance('users_profiles').insert({ profile_id: profile.id, user_id: id });
				}
			}

			const result = { ...fromDB, ...data };

			if (this.enableCache) return super.remove(['GET:content', this.findOne.name, `${id || email}`], () => this.update(params));

			await this.instance(this.table).update(data).where({ id });
			return result;
		} catch (err) {
			return err;
		}
	}

	findOne(filter: Filter<IUserFilter>): any {
		if (!filter) return null;
		const { id, email } = filter;

		if (this.enableCache) return this.find(['GET:content', this.findOne.name, `${id || email}`], () => this.findOne(filter));

		if (id) return this.instance(this.table).where({ id }).first();
		if (email) return this.instance(this.table).where({ email }).first();

		return null;
	}

	async delete(filter: Filter<IUserFilter>): Promise<IUser | any> {
		try {
			if (!filter) return null;
			const fromDB = (await this.findOne(filter)) as IUser;

			existsOrError(fromDB, 'User, not found');
			const { id, email } = fromDB;
			if (this.enableCache) return super.remove(['GET:content', this.findOne.name, `${id || email}`], () => this.delete(filter));

			await this.instance('users_profiles').where({ user_id: id }).del();
			await this.instance(this.table).where({ id }).del();

			return fromDB;
		} catch (err) {
			return err;
		}
	}
}
