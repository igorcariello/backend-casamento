const knex = require("../database/connection");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

const { hash, compare } = require("bcryptjs");

class AdminController {
  async signUp(request, response) {
    const { name, email, password } = request.body;

    const allowedAdminEmail = process.env.ALLOWED_ADMIN_EMAILS.split(",");

    if (!allowedAdminEmail.includes(email)) {
      return response
        .status(403)
        .json({ error: "Você não tem permissão para criar um admin" });
    }

    const existingAdmin = await knex("admins").where({ email }).first();

    if (existingAdmin) {
      return response.status(400).json({
        error: "Este e-mail já está cadastrado como admin",
      });
    }

    const hashedPassword = await hash(password, 8);

    await knex("admins").insert({
      name,
      email,
      password_hash: hashedPassword,
    });

    return response
      .status(201)
      .json({ message: "Administrador criado com sucesso!" });
  }

  async signIn(request, response) {
    const { email, password } = request.body;

    const admin = await knex("admins").where({ email }).first();

    if (!admin) {
      return response
        .status(401)
        .json({ error: "E-mail e/ou senha inválida." });
    }

    const passwordMatched = await compare(password, admin.password_hash);

    if (!passwordMatched) {
      return response
        .status(401)
        .json({ error: "E-mail e/ou senha inválidas." });
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({ id: admin.id }, secret, { expiresIn });

    return response.json({
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
      token,
    });
  }
}

module.exports = AdminController;
