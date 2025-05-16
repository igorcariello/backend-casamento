const AppError = require("../utils/AppError");

const resend = require("../services/resend");

async function sendEmail({ to, subject, html, imageBase64 }) {
  if (typeof to !== "string") {
    throw new AppError('O Campo "to" precisa ser uma string', 400);
  }

  try {
    const response = await resend.emails.send({
      from: "Beatriz e Iago <onboarding@resend.dev>",
      to,
      subject,
      html,
      attachments: [
        {
          filename: "ticket.png",
          content: imageBase64.split("base64,")[1],
          contentType: "image/png",
          cid: "ticketimage123",
        },
      ],
    });

    console.log("E-mail enviado:", response);
    return response;
  } catch (error) {
    throw new AppError("Erro ao enviar o e-mail", 500);
  }
}

module.exports = sendEmail;
