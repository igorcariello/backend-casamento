const knex = require("../database/connection");
const AppError = require("../utils/AppError");

class CheckInController {
  async handleCheckIn(req, res) {
    const { code } = req.body;
    const id = Number(code);

    if (!code || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Código inválido ou ausente.",
      });
    }

    const guest = await knex("guests").where({ id }).first();

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Convidado não encontrado.",
      });
    }

    if (!guest.is_confirmed) {
      return res.status(400).json({
        success: false,
        message: `${guest.name} não confirmou presença.`,
        guest: { id: guest.id, name: guest.name },
      });
    }

    if (guest.has_arrived) {
      return res.status(200).json({
        success: true,
        alreadyCheckedIn: true,
        message: `${guest.name} já entrou.`,
        guest: { id: guest.id, name: guest.name },
      });
    }

    await knex("guests")
      .where({ id })
      .update({ has_arrived: true, arrived_at: knex.fn.now() });

    return res.status(200).json({
      success: true,
      message: `Entrada liberada para ${guest.name}!`,
      guest: {
        id: guest.id,
        name: guest.name,
        confirmed_guests: guest.confirmed_guests,
      },
    });
  }

  async listCheckedInGuests(req, res) {
    const guests = await knex("guests")
      .where({ has_arrived: true })
      .select("id", "name", "confirmed_guests", "arrived_at")
      .orderBy("arrived_at", "desc");

    return res.status(200).json({
      success: true,
      guests,
    });
  }
}

module.exports = CheckInController;
