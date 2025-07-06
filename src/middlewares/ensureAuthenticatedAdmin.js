const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticatedAdmin(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT Token não informado", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { id } = decoded;

    request.adminId = id;

    return next();
  } catch {
    return response.status(401).json({ error: "Token inválido." });
  }
}

module.exports = ensureAuthenticatedAdmin;
