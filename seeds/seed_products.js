const presents = require("../src/lib/presents.json");

exports.seed = async function (knex) {
  await knex("products").del();

  await knex("products").insert(presents);

  console.log("Seed de products executado com sucesso");
};
