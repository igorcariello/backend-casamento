const { Router } = require("express");

const GuestsController = require("../controllers/GuestsController");
const QrCodeController = require("../controllers/QrCodeController");
const EmailController = require("../controllers/EmailController");

const ensureAuthenticatedAdmin = require("../middlewares/ensureAuthenticatedAdmin");

const guestsRoutes = Router();

const guestsController = new GuestsController();
const qrCodeController = new QrCodeController();
const emailController = new EmailController();

guestsRoutes.post("/", ensureAuthenticatedAdmin, guestsController.create);
guestsRoutes.get("/", ensureAuthenticatedAdmin, guestsController.index);
guestsRoutes.put("/:id", ensureAuthenticatedAdmin, guestsController.update);
guestsRoutes.patch(
  "/unconfirm/:id",
  ensureAuthenticatedAdmin,
  guestsController.unconfirm
);
guestsRoutes.get("/:id", ensureAuthenticatedAdmin, guestsController.show);
guestsRoutes.delete("/:id", ensureAuthenticatedAdmin, guestsController.delete);
guestsRoutes.get("/", guestsController.search);

//ROTAS RELACIONADAS COM QRCODE!!!
guestsRoutes.get("/:id/qrcode", qrCodeController.show);
guestsRoutes.get("/:id/ticket", guestsController.getQrCode);
//ROTAS RELACIONADAS COM ENVIO DE E-MAIL!
guestsRoutes.post("/send-email", emailController.send);

module.exports = guestsRoutes;
