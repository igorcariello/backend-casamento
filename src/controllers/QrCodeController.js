const knex = require("../database/connection");
const generateQRCodeBuffer = require("../utils/generateQRCode");
const AppError = require("../utils/AppError");

class QrCodeController {
  async show(req, res) {
    const { id } = req.params;
    const guest = await knex("guests").where({ id }).first();
    if (!guest) throw new AppError("Convidado não encontrado.", 404);

    const buffer = await generateQRCodeBuffer(String(guest.id));

    res.status(200).type("png").send(buffer);
  }
}

module.exports = QrCodeController;
