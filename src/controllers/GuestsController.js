const knex = require("../database/connection");

const AppError = require("../utils/AppError");
const generateQRCodeBuffer = require("../utils/generateQRCode");

class GuestsController {
  async create(request, response) {
    const { name, allowed_guests } = request.body;

    if (!name) {
      throw new AppError("O nome do convidado é obrigatório!");
    }

    const [guest_id] = await knex("guests")
      .insert({
        name,
        allowed_guests: allowed_guests ?? 0,
      })
      .returning("id");

    return response
      .status(201)
      .json({ message: "Convidado cadastrado com sucesso", guest_id });
  }

  async index(request, response) {
    const guests = await knex("guests").select("*").orderBy("id", "asc");
    return response.json(guests);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, email, allowed_guests, confirmed_guests, is_confirmed } =
      request.body;

    const guest = await knex("guests").where({ id }).first();

    if (!guest) {
      throw new AppError("Convidado não encontrado!", 404);
    }

    const newAllowedGuests = allowed_guests ?? guest.allowed_guests;
    const newConfirmedGuests = confirmed_guests ?? guest.confirmed_guests;

    if (newConfirmedGuests > newAllowedGuests) {
      throw new AppError(
        `Número de acompanhantes confirmados (${newConfirmedGuests}) não pode ser maior que o permitido (${newAllowedGuests}).`
      );
    }

    const fieldsToUpdate = {
      name: name ?? guest.name,
      allowed_guests: newAllowedGuests,
      confirmed_guests: newConfirmedGuests,
      is_confirmed: is_confirmed ?? guest.is_confirmed,
      email: email === "" ? null : email, // <-- linha ajustada aqui
    };

    await knex("guests").where({ id }).update(fieldsToUpdate);

    return response
      .status(200)
      .json({ message: "Convidado atualizado com sucesso!" });
  }

  async unconfirm(request, response) {
    const { id } = request.params;

    const guest = await knex("guests").where({ id }).first();

    if (!guest) {
      return response
        .status(404)
        .json({ message: "Convidado não encontrado." });
    }

    if (!guest.is_confirmed) {
      return response
        .status(404)
        .json({ message: "Convidado já não está confirmado." });
    }

    await knex("guests").where({ id }).update({
      is_confirmed: false,
      confirmed_guests: 0,
      email: null,
    });

    return response
      .status(200)
      .json({ message: "Convidado desconfirmado com sucesso!" });
  }

  async show(request, response) {
    const { id } = request.params;

    const guest = await knex("guests").where({ id }).first();

    if (!guest) {
      return response.status(404).json({ message: "Convidado não encontrado" });
    }

    return response.json(guest);
  }

  async delete(request, response) {
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({ message: "ID não fornecido." });
    }

    const guest = await knex("guests").where({ id }).first();

    if (!guest) {
      return response
        .status(404)
        .json({ message: "Convidado não encontrado!" });
    }

    await knex("guests").where({ id }).delete();

    return response
      .status(200)
      .json({ message: "Convidado excluído com sucesso!" });
  }

  async search(request, response) {
    const { nameSearch } = request.query;

    if (!nameSearch) {
      return response
        .status(400)
        .json({ error: "Necessário ter umtermo de busca" });
    }

    try {
      const guests = await knex("guests")
        .where("name", "ilike", `%${nameSearch}%`)
        .select("id", "name");

      response.json(guests);
    } catch (error) {
      response.status(500).json({ error: "Erro ao buscar convidados" });
    }
  }

  async getQrCode(request, response) {
    const { id } = request.params;

    const guest = await knex("guests")
      .select("id", "name", "ticket_image")
      .where({ id })
      .first();

    if (!guest) {
      return response.status(404).json({ message: "Convidado não encontrado" });
    }

    if (!guest.ticket_image) {
      return response
        .status(404)
        .json({ message: "Ticket não encontrado para este convidado" });
    }

    return response.json(guest);
  }
}

module.exports = GuestsController;
