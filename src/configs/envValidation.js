function checkEnvVariables() {
  const requiredVars = [
    "MAIL_USER",
    "MAIL_PASS",
    "JWT_SECRET",
    "ALLOWED_ADMIN_EMAILS",
    "DATABASE_URL",
    "NODE_ENV",
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error("❌ Variáveis de ambiente faltando:", missing.join(", "));
    process.exit(1);
  }
}

module.exports = checkEnvVariables;
