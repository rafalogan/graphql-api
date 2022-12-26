import knex, { Knex } from "knex";
import Config = Knex.Config;
import MigratorConfig = Knex.MigratorConfig;

import { onError, onInfo } from "src/utils";

export class DatabaseConfig {
  connection: Knex
  constructor(private file: Config) {
    this.connection = knex(this.file);
  }


  async isConnected() {
    return this.connection
      .raw('SELECT 1+1 AS result')
      .then(res => onInfo('Database is connected', `Status: ${!!res ? 'active' : 'inactive'}`))
      .catch(err => onError('Error on connection of database', err));
  }

  async latest() {
    return this.connection.migrate
      .latest(this.file as MigratorConfig)
      .then(() => onInfo('Database is Updated'))
      .catch((err) => onError('Falied on update database', err));
  }


  async rollback() {
    return this.connection.migrate
      .rollback(this.file as MigratorConfig)
      .then(() => onInfo('Rollback is execulte with successs'))
      .catch(err => onError('Rollback is Falied', err))
  }
}
