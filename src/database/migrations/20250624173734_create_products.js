exports.up = (knex) =>
  knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("src").notNullable();
    table.string("title").notNullable();
    table.text("description");
    table.integer("price").notNullable();
    table.integer("stock").notNullable();
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTable("products");
