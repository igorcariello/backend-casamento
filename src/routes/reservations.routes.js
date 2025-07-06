const { Router } = require("express");

const ReservationsController = require("../controllers/ReservationsController");

const reservationsRoutes = Router();

const reservationsController = new ReservationsController();

reservationsRoutes.post("/", reservationsController.create);
reservationsRoutes.get(
  "/cleanup",
  reservationsController.cleanExpiredReservations
);
reservationsRoutes.post(
  "/:id/confirm",
  reservationsController.confirmReservation
);
reservationsRoutes.get("/pending", reservationsController.listPending);
reservationsRoutes.patch("/confirm/:id", reservationsController.confirm);
reservationsRoutes.get("/", reservationsController.index);
reservationsRoutes.delete("/:id", reservationsController.delete);
module.exports = reservationsRoutes;
