import { RedisClientType } from "@redis/client";
import { Knex } from "knex";
import { CacheService } from "./cache.service";

export abstract class DatabaseService extends CacheService {
  protected instance: Knex;
  protected table: string;

  constructor(conn: Knex, client: RedisClientType, table: string) {
    super(client);

    this.instance = conn;
    this.table = table;
  }

  async create(item: any) {
    try {
      const [id] = await this.instance(this.table).insert(item);

      return this.instance(this.table).select().where({ id });
    } catch (err) {
      return err;
    }
  }

  findAll(): any {
    if (this.enableCache) return this.find(['GET:AllContent', this.findAll.name], () => this.findAll());
    return this.instance(this.table);
  }
};
