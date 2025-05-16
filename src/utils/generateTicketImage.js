const { createCanvas, loadImage } = require("canvas");
const QRCode = require("qrcode");

async function generateTicketImage({ name, qrData }) {
  const width = 400;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Fundo
  ctx.fillStyle = "#F0F2F5";
  ctx.fillRect(0, 0, width, height);

  // Borda
  ctx.strokeStyle = "#8C9082";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, width - 4, height - 4);

  // Nome do evento (centralizado)
  ctx.fillStyle = "#444C35";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Casamento Beatriz e Iago", width / 2, 60);

  // Linha separadora
  ctx.strokeStyle = "#efefed";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 80);
  ctx.lineTo(width - 40, 80);
  ctx.stroke();

  // Título
  ctx.fillStyle = "#444C35";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("Cartão de Confirmação", width / 2, 120);

  // Nome do convidado
  ctx.font = "17px sans-serif";
  ctx.fillText(`Convidado: ${name}`, width / 2, 160);

  // Mensagem
  ctx.font = "16px sans-serif";
  ctx.fillText("Apresente este QR Code", width / 2, 200);
  ctx.fillText("na entrada do evento", width / 2, 225);

  // QR Code centralizado
  const qrCodeDataURL = await QRCode.toDataURL(qrData);
  const qrImage = await loadImage(qrCodeDataURL);
  const qrSize = 200;
  ctx.drawImage(qrImage, (width - qrSize) / 2, 260, qrSize, qrSize);

  // Rodapé
  ctx.font = "14px sans-serif";
  ctx.fillStyle = "#888";
  ctx.fillText("Aguardamos você!", width / 2, 500);

  return canvas.toDataURL("image/png");
}

module.exports = generateTicketImage;
