const { Router } = require("express");

const GuestsController = require("../controllers/GuestsController");
const QrCodeController = require("../controllers/QrCodeController");
const EmailController = require("../controllers/EmailController");

const guestsRoutes = Router();

const guestsController = new GuestsController();
const qrCodeController = new QrCodeController();
const emailController = new EmailController();

guestsRoutes.post("/", guestsController.create);
guestsRoutes.get("/", guestsController.index);
guestsRoutes.get("/confirmed", guestsController.listConfirmed);

guestsRoutes.post("/confirm", guestsController.confirm);

//ROTAS RELACIONADAS COM QRCODE!!!
guestsRoutes.get("/:id/qrcode", qrCodeController.show);

//ROTAS RELACIONADAS COM ENVIO DE E-MAIL!
guestsRoutes.post("/send-email", emailController.send);

module.exports = guestsRoutes;
