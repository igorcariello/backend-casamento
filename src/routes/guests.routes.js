const { Router } = require("express");

const GuestsController = require("../controllers/GuestsController");

const guestsRoutes = Router();

const guestsController = new GuestsController();

guestsRoutes.post("/", guestsController.create);
guestsRoutes.get("/", guestsController.index);
guestsRoutes.get("/confirmed", guestsController.listConfirmed);

guestsRoutes.post("/confirm", guestsController.confirm);

module.exports = guestsRoutes;
