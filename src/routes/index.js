const { Router } = require("express");

const messagesRouter = require("./messages.routes");
const guestsRouter = require("./guests.routes");

const routes = Router();

routes.use("/messages", messagesRouter);
routes.use("/guests", guestsRouter);

module.exports = routes;
