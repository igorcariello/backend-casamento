const knex = require("../database/connection");
const generateQRCode = require("../utils/generateQRCode");
const sendEmail = require("../utils/sendEmail");
const AppError = require("../utils/AppError");
const generateTicketImage = require("../utils/generateTicketImage");

class EmailController {
  async send(request, response) {
    const { id, email } = request.body;

    const guest = await knex("guests").where({ id }).first();

    if (!guest) {
      throw new AppError("Convidado não encontrado", 404);
    }

    const qrCode = await generateQRCode(
      `Convidado: ${guest.name} | ID: ${guest.id} | Acompanhantes: ${guest.confirmed_guests}`
    );

    const ticketImage = await generateTicketImage({
      name: guest.name,
      qrData: `Convidado: ${guest.name} | ID: ${guest.id} | Acompanhantes: ${guest.confirmed_guests}`,
    });

    const htmlContent = `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>Olá, ${guest.name},</h2>
        <p>Seu cartão de confirmação está abaixo:</p>
        <img src="cid:ticketimage123" alt="Cartão de Confirmação" style="max-width: 100%; height: auto;" />
        <p>Apresente-o na entrada do evento.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Confirmação de Presença - QR Code",
      html: htmlContent,
      imageBase64: ticketImage,
    });

    return response.json({ message: "E-mail enviado com sucesso." });
  }
}

module.exports = EmailController;
