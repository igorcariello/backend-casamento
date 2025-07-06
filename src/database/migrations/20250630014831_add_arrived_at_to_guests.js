exports.up = function (knex) {
  return knex.schema.table("guests", (table) => {
    table.timestamp("arrived_at");
  });
};

exports.down = function (knex) {
  return knex.schema.table("guests", (table) => {
    table.dropColumn("arrived_at");
  });
};
