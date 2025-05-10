const { Router } = require("express");

const GuestsController = require("../controllers/GuestsController");
const QrCodeController = require("../controllers/QrCodeController");

const guestsRoutes = Router();

const qrCodeController = new QrCodeController();
const guestsController = new GuestsController();

guestsRoutes.post("/", guestsController.create);
guestsRoutes.get("/", guestsController.index);
guestsRoutes.get("/confirmed", guestsController.listConfirmed);

guestsRoutes.post("/confirm", guestsController.confirm);

//ROTA RELACIONADO COM QRCODE!!!
guestsRoutes.get("/:id/qrcode", qrCodeController.show);

module.exports = guestsRoutes;
