import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { onError, onInfo } from "src/utils";

export class CacheConfig {
  private readonly _connection: RedisClientType
  private _cacheEnabled = process.env.ENABLE_CACHE === 'true';
  constructor() {
    const url = process.env.CACHE_URL || '';
    this._connection = createClient({ url })
  }


  get connection() {
    return this._connection
  }

  get cacheEnabled() {
    return this._cacheEnabled;
  }

  isConnected() {
    if (!this.cacheEnabled) return onInfo('Cache is Disabled');

    return this.connection
      .on('connect', () => onInfo('Redis is connected'))
      .on('ready', () => onInfo('Cache is ready'))
      .on('error', err => onError('Connect redis is failed', err));
  }

  disconnect() {
    if (this.connection) return this.connection.quit();
    return;
  }
}
