exports.up = async function (knex) {
  const hasConfirmed = await knex.schema.hasColumn("reservations", "confirmed");
  if (!hasConfirmed) {
    await knex.schema.table("reservations", (table) => {
      table.boolean("confirmed").defaultTo(false);
    });
  }

  const hasCreatedAt = await knex.schema.hasColumn(
    "reservations",
    "created_at"
  );
  if (!hasCreatedAt) {
    await knex.schema.table("reservations", (table) => {
      table.timestamp("created_at").nullable();
    });

    await knex("reservations").update("created_at", knex.fn.now());
  }
};

exports.down = async function (knex) {
  await knex.schema.table("reservations", (table) => {
    table.dropColumn("confirmed");
    table.dropColumn("created_at");
  });
};
