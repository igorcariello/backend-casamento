exports.up = (knex) =>
  knex.schema.table("guests", (table) => {
    table.string("email");
  });

exports.down = (knex) =>
  knex.schema.table("guests", (table) => {
    table.dropColumn("email");
  });
