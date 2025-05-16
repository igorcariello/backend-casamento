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

    const base64 = qrCode.split("base64")[1];
    const imgBuffer = Buffer.from(base64, "base64");

    response.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": imgBuffer.length,
    });

    return response.end(imgBuffer);
  }
}

module.exports = QrCodeController;
