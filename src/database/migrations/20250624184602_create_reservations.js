exports.up = (knex) =>
  knex.schema.createTable("reservations", (table) => {
    table.increments("id").primary();
    table
      .integer("product_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products");
    table.timestamp("reserved_at").defaultTo(knex.fn.now());
    table.boolean("confirmed").defaultTo(false); // false = ainda não pagou
  });

exports.down = (knex) => knex.schema.dropTable("reservations");
