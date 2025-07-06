// utils/generateQRCode.js
const QRCode = require("qrcode");
const AppError = require("./AppError");

async function generateQRCodeBuffer(data) {
  try {
    return await QRCode.toBuffer(data, { type: "png" });
  } catch (err) {
    throw new AppError("Erro ao gerar QRCode", 500);
  }
}

module.exports = generateQRCodeBuffer;
