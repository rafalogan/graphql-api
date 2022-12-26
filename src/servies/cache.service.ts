import { RedisClientType } from '@redis/client';
import md5 from 'md5';
import { existsOrError, isDev, onError, onInfo, onLog, onWarn } from 'src/utils';
import isEmpty from 'is-empty';
import { stringify } from 'querystring';

export abstract class CacheService {
	client: RedisClientType;
	enableCache = process.env.CACHE_ENABLE === 'true';
	timeDefault = Number(process.env.CACHE_TIME) || 0;

	constructor(conn: RedisClientType) {
		this.client = conn;
	}

	async find(args: string[], fn: () => Promise<any>, time?: number) {
		try {
			if (!this.enableCache) return await fn();
			const key = this.generateKey(args) as string;

			onInfo(`Search cache ${key}, waiting...`);
			const data = await this.client.get(key);

			if (!data || isEmpty(data)) return this.createCache(key, fn, time);
			return JSON.parse(data);
		} catch (err) {
			return err;
		}
	}

	async remove(args: string[], fn: () => Promise<any>): Promise<any> {
		try {
			if (!this.enableCache) return onInfo('Cache is disabled');
			const key = this.generateKey(args) as string;
			const data = await this.client.get(key);

			if (!data || isEmpty(data)) {
				onWarn(`Cache key ${key} is not exists.`);
				return fn();
			}

			await this.client.del(key);
			onInfo(`Cache key ${key} is deleted with success.`);

			return fn();
		} catch (err) {
			return err;
		}
	}

	private async set(key: string, data: any, time?: number) {
		const EX = (time ?? this.timeDefault) * (isDev() ? 10 : 60);
		const dataToString = stringify(data);

		return this.client
			.set(key, dataToString, { EX, NX: true })
			.then(() => onLog(`Cache ${key}, created with success!`, 'info'))
			.catch(err => err);
	}

	private generateKey(ags: string[]) {
		try {
			existsOrError(ags, 'To generate the data key, the arguments must be filled in correctly');
			return md5(ags.join('-'));
		} catch (msg) {
			return onError(msg);
		}
	}

	private async createCache(key: string, fn: () => Promise<any>, time?: number) {
		try {
			const data = await fn();

			if (data) await this.set(key, data, time);
			return data;
		} catch (err) {
			return err;
		}
	}
}
