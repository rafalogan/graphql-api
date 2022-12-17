import { Knex } from 'knex';

export interface IKnexFile extends Knex.Config {
  client: string;
  connection: string | IknexConnection;
  migrations?: IKnexMigrationConfig;
  pool?: IKnexPoolConfig;
}

export interface IknexConnection {
  database?: string;
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  filename?: string;
  domain?: string;
  instanceName?: string;
  debug?: boolean;
  requestTimeout?: number;
}

export interface IKnexMigrationConfig {
  database?: string;
  directory?: string | readonly string[];
  extension?: string;
  stub?: string;
  tableName?: string;
  schemaName?: string;
  disableTransactions?: boolean;
  disableMigrationsListValidation?: boolean;
  sortDirsSeparately?: boolean;
  loadExtensions?: readonly string[];
  migrationSource?: IKnexMigrationSource<unknown>;
  name?: string;
}

export interface IKnexPoolConfig {
  name?: string;
  afterCreate?: Function;
  min?: number;
  max?: number;
  refreshIdle?: boolean;
  idleTimeoutMillis?: number;
  reapIntervalMillis?: number;
  returnToHead?: boolean;
  priorityRange?: number;
  log?: (message: string, logLevel: string) => void;

  // tarn configs
  propagateCreateError?: boolean;
  createRetryIntervalMillis?: number;
  createTimeoutMillis?: number;
  destroyTimeoutMillis?: number;
  acquireTimeoutMillis?: number;
}

export interface IKnexMigrationSource<TMigrationSpec> {
  getMigrations(loadExtensions: readonly string[]): Promise<TMigrationSpec[]>;
  getMigrationName(migration: TMigrationSpec): string;
  getMigration(migration: TMigrationSpec): Promise<IKnexMigrationConf>;
}

export interface IKnexMigrationConf {
  up: (knex: Knex) => PromiseLike<any>;
  down?: (kenx: Knex) => PromiseLike<any>;
}
