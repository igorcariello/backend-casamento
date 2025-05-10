const QRCode = require("qrcode");
const AppError = require("./AppError");

async function generateQRCode(data) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data);
    return qrCodeDataURL;
  } catch (error) {
    throw new AppError("Erro ao gerar QRCode", 500);
  }
}

module.exports = generateQRCode;
