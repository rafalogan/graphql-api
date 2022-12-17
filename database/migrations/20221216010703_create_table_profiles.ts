import { Knex } from "knex";
import TableBuilder = Knex.TableBuilder;

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('profiles', (table: TableBuilder) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.string('label').notNullable();
  }).then(function() {
    return knex('perfis').insert([
      { name: 'common', label: 'Common' },
      { name: 'admin', label: 'Administrator' },
      { name: 'master', label: 'Master' },
    ])
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('profiles');
}

