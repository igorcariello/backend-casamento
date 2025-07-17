const { Router } = require("express");

const ReservationsController = require("../controllers/ReservationsController");

const reservationsRoutes = Router();

const reservationsController = new ReservationsController();

reservationsRoutes.patch(
  "/confirm/:id",
  reservationsController.confirmReservation
);
reservationsRoutes.post("/", reservationsController.create);
reservationsRoutes.get(
  "/cleanup",
  reservationsController.cleanExpiredReservations
);

reservationsRoutes.get("/pending", reservationsController.listPending);
reservationsRoutes.get("/", reservationsController.index);
reservationsRoutes.delete("/:id", reservationsController.delete);
module.exports = reservationsRoutes;
