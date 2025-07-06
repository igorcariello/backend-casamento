const knex = require("knex");

exports.up = (knex) =>
  knex.schema.createTable("admins", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTable("admins");
