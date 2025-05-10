const knex = require("knex");
const { text } = require("express");

exports.up = (knex) =>
  knex.schema.createTable("messages", (table) => {
    table.increments("id");
    table.text("sender").notNullable();
    table.text("content").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("messages");
