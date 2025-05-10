const knex = require("../database/connection");
const generateQRCode = require("../utils/generateQRCode");
const AppError = require("../utils/AppError");

class QrCodeController {
  async show(request, response) {
    const { id } = request.params;

    const guest = await knex("guests").where({ id }).first();

    if (!guest) {
      throw new AppError("Convidado não encontrado.", 404);
    }

    const qrCode = await generateQRCode(
      `Convidado: ${guest.name} | ID: ${guest.id} | Acompanhantes: ${guest.confirmed_guests}`
    );

    return response.json({ qrCode });
  }
}

module.exports = QrCodeController;
