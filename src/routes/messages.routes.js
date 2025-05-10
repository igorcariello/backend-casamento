const { Router } = require("express");

const MessagesController = require("../controllers/MessagesController");

const messageRoutes = Router();

const messagesController = new MessagesController();

messageRoutes.post("/", messagesController.create);
messageRoutes.get("/", messagesController.index);

module.exports = messageRoutes;
