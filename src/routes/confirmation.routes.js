const { Router } = require("express");

const ConfirmationController = require("../controllers/ConfirmationController");
const ensureAuthenticatedAdmin = require("../middlewares/ensureAuthenticatedAdmin");

const confirmationRoutes = Router();

const confirmationController = new ConfirmationController();

confirmationRoutes.get(
  "/confirmed",
  ensureAuthenticatedAdmin,
  confirmationController.listConfirmed
);
confirmationRoutes.post("/", confirmationController.confirm);

module.exports = confirmationRoutes;
