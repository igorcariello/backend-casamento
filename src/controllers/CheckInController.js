const knex = require("../database/connection");

class CheckInController {
  async handleCheckIn(req, res) {
    const { code } = req.body;

    console.log("Código recebido do QRCode:", code);

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Código ausente." });
    }

    const match = code.match(/ID:\s*(\d+)/i);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Código inválido. ID não encontrado no QRCode.",
      });
    }

    const id = Number(match[1]);

    const guest = await knex("guests").where({ id }).first();
    if (!guest) {
      return res
        .status(404)
        .json({ success: false, message: "Convidado não encontrado." });
    }

    if (!guest.is_confirmed) {
      return res.status(400).json({
        success: false,
        message: `${guest.name} não confirmou presença.`,
      });
    }

    if (guest.has_arrived) {
      return res.json({
        success: true,
        alreadyCheckedIn: true,
        message: `${guest.name} já realizou check-in.`,
      });
    }

    await knex("guests")
      .where({ id })
      .update({ has_arrived: true, arrived_at: knex.fn.now() });

    return res.json({
      success: true,
      message: `✅ Check-in realizado para ${guest.name}!`,
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
