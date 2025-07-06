const knex = require("../database/connection");
const AppError = require("../utils/AppError");

class CheckInController {
  async handleCheckIn(req, res) {
    const { code } = req.body;

    const id = Number(code);
    const guest = await knex("guests").where({ id }).first();
    if (!guest) throw new AppError("Convidado não encontrado.", 404);
    if (!guest.is_confirmed)
      throw new AppError(`${guest.name} não confirmou presença.`, 400);
    if (guest.has_arrived)
      return res.json({ message: `${guest.name} já entrou.` });

    await knex("guests")
      .where({ id })
      .update({ has_arrived: true, arrived_at: knex.fn.now() });

    return res.json({
      message: `Entrada liberada para ${guest.name}!`,
      guest: { id, name: guest.name },
    });
  }

  async listCheckedInGuests(req, res) {
    const guests = await knex("guests")
      .where({ has_arrived: true })
      .select("id", "name", "confirmed_guests", "arrived_at")
      .orderBy("arrived_at", "desc");

    return res.json(guests);
  }
}

module.exports = CheckInController;
