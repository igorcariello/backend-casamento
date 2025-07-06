const knex = require("../database/connection");

class ProductsController {
  async index(request, response) {
    try {
      const products = await knex("products").select("*");
      return response.json(products);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return response.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async show(request, response) {
    const { id } = request.params;
    try {
      const product = await knex("products")
        .where({ id })
        .first(
          "id",
          "title",
          "price",
          "stock",
          "src",
          "description",
          "is_variable_price"
        );

      if (!product) {
        return response.status(404).json({ error: "Produto não encontrado." });
      }
      return response.json(product);
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      return response.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}

module.exports = ProductsController;
