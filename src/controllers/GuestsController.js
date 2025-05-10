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
    const { name, confirmed_guests } = request.body;

    if (!name) {
      throw new AppError("Nome do convidado é obrigatório!");
    }

    const guest = await knex("guests").where({ name }).first();

    if (!guest) {
      throw new AppError("Convidado não encontrado!");
    }

    if (guest.is_confirmed) {
      throw new AppError("Presença já confirmada!");
    }

    if (confirmed_guests > guest.allowed_guests) {
      throw new AppError(
        `Número de convidados excede o permitido! (máximo de ${guest.allowed_guests})`
      );
    }

    await knex("guests").where({ id: guest.id }).update({
      is_confirmed: true,
      confirmed_guests,
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
