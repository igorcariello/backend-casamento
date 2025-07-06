const { Router } = require("express");

const AdminsController = require("../controllers/AdminsController");

const adminsRoutes = Router();

const adminsController = new AdminsController();

adminsRoutes.post("/signup", adminsController.signUp);
adminsRoutes.post("/signin", adminsController.signIn);

module.exports = adminsRoutes;
