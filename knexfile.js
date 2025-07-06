const path = require("path");

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db"),
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations"),
    },
    seeds: {
      directory: "./seeds",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations"),
    },
    seeds: {
      directory: "./seeds",
    },
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
