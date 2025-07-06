const { Router } = require("express");
const { celebrate, Segments, Joi, errors } = require("celebrate");
const CheckInController = require("../controllers/CheckInController");

const checkinRoutes = Router();
const checkinController = new CheckInController();

checkinRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      code: Joi.string().required(),
    }),
  }),
  checkinController.handleCheckIn
);

checkinRoutes.get("/checkedin", checkinController.listCheckedInGuests);
module.exports = checkinRoutes;
