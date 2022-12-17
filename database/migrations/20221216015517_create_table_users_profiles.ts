import { Knex } from "knex";
import TableBuilder = Knex.TableBuilder;

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users_profiles', (table: TableBuilder) => {
    table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
    table.integer('profile_id').unsigned().references('id').inTable('profiles').notNullable();
    table.primary(['user_id', 'profile_id']);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users_profiles');
}

