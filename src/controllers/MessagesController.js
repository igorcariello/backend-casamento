const knex = require("../database/connection");

const AppError = require("../utils/AppError");

class MessagesController {
  async create(request, response) {
    const { sender, content } = request.body;

    if (!sender || !content) {
      throw new AppError("Nome e recado são obrigatórios!");
    }

    const [message_id] = await knex("messages")
      .insert({
        sender,
        content,
      })
      .returning("id");

    return response
      .status(201)
      .json({ message: "Recado enviado com sucesso!", message_id });
  }

  async index(request, response) {
    const messages = await knex("messages").orderBy("created_at", "desc");

    return response.json(messages);
  }
}

module.exports = MessagesController;
