import { RedisClientType } from '@redis/client';
import { Knex } from 'knex';
import { Filter, IProfile, ProfileFilter, Update } from 'src/schema/types';
import { existsOrError } from 'src/utils';

import { DatabaseService } from './database.service';

export class ProfileService extends DatabaseService {
	constructor(conn: Knex, cache: RedisClientType) {
		super(conn, cache, 'profiles');
	}

	findOne(filter: Filter<ProfileFilter>): IProfile | any {
		if (!filter) return null;
		const { id, name } = filter;

		if (this.enableCache) return super.find(['GET:Content', this.findOne.name, `${id || name}`], () => this.findOne(filter));
		if (id) return this.instance(this.table).where({ id }).first();
		if (name) return this.instance(this.table).where({ name }).first();

		return null;
	}

	async update(params: Update<ProfileFilter, IProfile>): Promise<IProfile | any> {
		try {
			const { filter, data } = params;
			const fromDB = await this.findOne(filter);

			existsOrError(fromDB, 'Prodfile, not found');
			const { id, name } = fromDB;

			if (this.enableCache) return super.remove(['GET:Content', this.findOne.name, `${id || name}`], () => this.update(params));

			await this.instance(this.table).update(data).where({ id });
			return { ...fromDB, ...data };
		} catch (err) {
			return err;
		}
	}

	async delete(filter: Filter<ProfileFilter>): Promise<IProfile | any> {
		try {
			const fromDB = await this.findOne(filter);

			existsOrError(fromDB, 'Profile, not found');
			const { id, name } = fromDB;

			if (this.enableCache) return super.remove(['GET:Content', this.findOne.name, `${id || name}`], () => this.delete(filter));
			await this.instance(this.table).where({ id }).del();
			return fromDB;
		} catch (err) {
			return err;
		}
	}
}
