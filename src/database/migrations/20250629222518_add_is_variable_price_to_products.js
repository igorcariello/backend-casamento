exports.up = (knex) => {
  return knex.schema.table("products", function (table) {
    table.boolean("is_variable_price").defaultTo(false);
  });
};

exports.down = (knex) => {
  return knex.schema.table("products", function (table) {
    table.dropColumn("is_variable_price");
  });
};
