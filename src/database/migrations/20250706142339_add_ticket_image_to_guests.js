exports.up = (knex) => {
  return knex.schema.table("guests", function (table) {
    table.text("ticket_image");
  });
};

exports.down = (knex) => {
  return knex.schema.table("guests", function (table) {
    table.dropColumn("ticket_image");
  });
};
