const knex = require("../database/connection");

async function cancelExpiredReservations() {
  const THIRTY_MINUTES = 30 * 60 * 1000;
  const now = new Date();

  const expiredReservations = await knex("reservations")
    .where("confirmed", false)
    .andWhere("created_at", "<", new Date(now - THIRTY_MINUTES));

  for (const reservation of expiredReservations) {
    await knex("products")
      .where("id", reservation.product_id)
      .increment("stock", 1);

    await knex("reservations").where("id", reservation.id).del();
  }

  console.log(`Canceladas ${expiredReservations.length} reservas expiradas.`);
}

module.exports = cancelExpiredReservations;
