import { IknexConnection, IKnexFile, IKnexMigrationConfig, IKnexPoolConfig } from "src/schema/types/knex";

export class KnexfileConfig implements IKnexFile {
  client: string;
  connection: string | IknexConnection;
  pool?: IKnexPoolConfig;
  migrations?: IKnexMigrationConfig;
  useNullAsDefault = true;

  constructor() {
    this.client = process.env.DB_CLIENT || '';
    this.connection = this.setConnection();
    this.pool = this.setPool();
    this.migrations = this.setMigrations();
  }

  private setConnection(): string | IknexConnection {
    if (!!process.env.DB_CONNECTION) return process.env.DB_CONNECTION;
    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || undefined,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      filename: process.env.DB_FILENAME,
    }
  }

  private setPool = (): IKnexPoolConfig => ({
    min: Number(process.env.DB_POOL_MIN) || 2,
    max: Number(process.env.DB_POOL_MAX) || 10,
  });

  private setMigrations = (): IKnexMigrationConfig => ({
    tableName: process.env.BR_MIGRATION_TABLENAME || 'knex_migrations',
    directory: process.env.BR_MIGRATION_DIRECTORY || './database/migrations',
    extension: process.env.BR_MIGRATION_EXTENSION || 'ts',
  });
}
