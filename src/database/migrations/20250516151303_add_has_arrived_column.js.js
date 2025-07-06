const knex = require("knex");

exports.up = (knex) =>
  knex.schema.table("guests", (table) => {
    table.boolean("has_arrived").defaultTo(false);
  });

exports.down = (knex) =>
  knex.schema.table("guests", (table) => {
    table.dropColumn("has_arrived");
  });
