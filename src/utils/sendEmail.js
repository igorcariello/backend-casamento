const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, html, imageBase64 }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"Beatriz e Iago" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "ticket.png",
        content: imageBase64.split("base64,")[1],
        encoding: "base64",
        cid: "ticketimage123",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado:", info.response);
    return info;
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    throw error;
  }
}

module.exports = sendEmail;
