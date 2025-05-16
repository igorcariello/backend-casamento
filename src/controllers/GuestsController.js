const knex = require("../database/connection");

const AppError = require("../utils/AppError");

class GuestsController {
  async create(request, response) {
    const { name, allowed_guests } = request.body;

    if (!name) {
      throw new AppError("O nome do convidado é obrigatório!");
    }

    await knex("guests").insert({
      name,
      allowed_guests: allowed_guests ?? 0,
    });

    return response
      .status(201)
      .json({ message: "Convidado cadastrado com sucesso" });
  }

  async index(request, response) {
    const guests = await knex("guests").select("*");
    return response.json(guests);
  }

  async confirm(request, response) {
    const { name, confirmed_guests, email } = request.body;

    if (!name || !email) {
      throw new AppError("Nome e e-mail são obrigatórios!");
    }

    const existingConfirmation = await knex("guests")
      .where({ email, is_confirmed: true })
      .first();

    if (existingConfirmation) {
      throw new AppError(
        "Este e-mail já foi utilizado para confirmar presença."
      );
    }

    const guest = await knex("guests").where({ name }).first();

    if (!guest) {
      throw new AppError("Convidado não encontrado!", 404);
    }

    if (guest.is_confirmed) {
      throw new AppError("Presença já confirmada para este nome!");
    }

    if (confirmed_guests > guest.allowed_guests) {
      throw new AppError(
        `Número de convidados excede o permitido! (máximo de ${guest.allowed_guests})`
      );
    }

    await knex("guests").where({ id: guest.id }).update({
      is_confirmed: true,
      confirmed_guests,
      email,
    });

    return response
      .status(200)
      .json({ message: "Presença confirmada com sucesso!" });
  }

  async listConfirmed(request, response) {
    const guests = await knex("guests")
      .where("is_confirmed", true)
      .select("name", "confirmed_guests");

    const totalPeople = guests.reduce(
      (sum, guest) => sum + guest.confirmed_guests + 1,
      0
    );

    return response.json({ totalPeople, guests });
  }
}

module.exports = GuestsController;
