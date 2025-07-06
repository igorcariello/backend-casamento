const { Router } = require("express");

const messagesRouter = require("./messages.routes");
const guestsRouter = require("./guests.routes");
const checkinRouter = require("./checkin.routes");
const confirmationRouter = require("./confirmation.routes");
const adminsRouter = require("./admin.routes");
const productsRoutes = require("./products.routes");
const reservationsRoutes = require("./reservations.routes");

const routes = Router();

routes.use("/messages", messagesRouter);
routes.use("/guests", guestsRouter);
routes.use("/checkin", checkinRouter);
routes.use("/confirmation", confirmationRouter);
routes.use("/admin", adminsRouter);
routes.use("/products", productsRoutes);
routes.use("/reservations", reservationsRoutes);

module.exports = routes;
