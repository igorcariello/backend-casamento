const knex = require("knex");

exports.up = (knex) =>
  knex.schema.createTable("guests", (table) => {
    table.increments("id");

    table.string("name").notNullable();
    table.integer("allowed_guests").defaultTo(0);
    table.boolean("is_confirmed").defaultTo(false);
    table.integer("confirmed_guests").defaultTo(0);

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("guests");
