const knex = require("../database/connection");
const generateTicketImage = require("../utils/generateTicketImage");

const AppError = require("../utils/AppError");
const sendEmail = require("../utils/sendEmail");

class ConfirmationController {
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

    const qrData = `Convidado: ${guest.name} | ID: ${guest.id} | Acompanhantes: ${confirmed_guests}`;
    const ticketImage = await generateTicketImage({
      name: guest.name,
      qrData,
    });

    await knex("guests").where({ id: guest.id }).update({
      is_confirmed: true,
      confirmed_guests,
      email,
      ticket_image: ticketImage,
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

    return response
      .status(200)
      .json({ message: "Presença confirmada e e-mail enviado com sucesso!" });
  }

  async listConfirmed(request, response) {
    const guests = await knex("guests")
      .where("is_confirmed", true)
      .select("id", "name", "email", "allowed_guests", "confirmed_guests");

    const totalPeople = guests.reduce(
      (sum, guest) => sum + guest.confirmed_guests + 1,
      0
    );

    return response.json({ totalPeople, guests });
  }
}

module.exports = ConfirmationController;
