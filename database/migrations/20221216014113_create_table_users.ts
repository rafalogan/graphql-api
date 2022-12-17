import { Knex } from "knex";
import TableBuilder = Knex.TableBuilder;

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table: TableBuilder) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('email', 100).notNullable().unique();
    table.string('password', 60).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}

