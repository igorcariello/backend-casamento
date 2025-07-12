const sendEmail = require("../utils/sendEmail");
const generateTicketImage = require("../utils/generateTicketImage");

class EmailController {
  async send(request, response) {
    const { id, email } = request.body;

    try {
      const guest = await knex("guests").where({ id }).first();

      if (!guest) {
        return response
          .status(404)
          .json({ error: "Convidado não encontrado." });
      }

      const ticketImage = await generateTicketImage({
        name: guest.name,
        qrData: `Convidado: ${guest.name} | ID: ${guest.id} | Acompanhantes: ${guest.confirmed_guests}`,
      });

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
          <h1 style="color: #6B46C1;">Confirmação de Presença</h1>
          <p>Olá, <strong>${guest.name}</strong>,</p>
          <p>Seu cartão de confirmação está logo abaixo.</p>
          <p>Caso prefira, pode fazer o download do cartão de confirmação que está em anexo.</p>
          <img 
            src="cid:ticketimage123" 
            alt="Cartão de Confirmação" 
            style="width: 250px; height: auto; margin: 20px 0;" 
          />
          <p style="font-size: 14px; color: #666;">Apresente este QR Code na entrada do evento.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">Casamento Beatriz e Iago &copy; 2025</p>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: "Confirmação de Presença - QR Code",
        html: htmlContent,
        imageBase64: ticketImage,
      });

      return response.json({ message: "E-mail enviado com sucesso." });
    } catch (error) {
      console.error("Erro no envio de e-mail:", error);
      return response.status(500).json({ error: "Erro ao enviar e-mail." });
    }
  }
}

module.exports = EmailController;
