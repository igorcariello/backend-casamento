const { Router } = require("express");

const ensureAuthenticatedAdmin = require("../middlewares/ensureAuthenticatedAdmin");

const MessagesController = require("../controllers/MessagesController");

const messageRoutes = Router();

const messagesController = new MessagesController();

messageRoutes.post("/", messagesController.create);
messageRoutes.get("/", ensureAuthenticatedAdmin, messagesController.index);

module.exports = messageRoutes;
