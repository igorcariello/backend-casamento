const knex = require("../database/connection");

class ReservationsController {
  async create(request, response) {
    const { product_id } = request.body;

    if (!product_id) {
      return response.status(400).json({ error: "product_id é obrigatório." });
    }

    const product = await knex("products").where({ id: product_id }).first();

    if (!product) {
      return response.status(404).json({ error: "Produto não encontrado." });
    }

    if (product.stock <= 0) {
      return response.status(400).json({ error: "Produto esgotado." });
    }

    const now = new Date();
    const reserved_at = now.toISOString().slice(0, 19).replace("T", " ");

    await knex("products").where({ id: product_id }).decrement("stock", 1);

    const [reservation_id] = await knex("reservations")
      .insert({
        product_id,
        reserved_at,
        confirmed: 0,
      })
      .returning("id");

    return response.status(201).json({ reservation_id });
  }

  async cleanExpiredReservations(request, response) {
    try {
      const expirationDate = new Date(Date.now() - 0.5 * 60 * 1000);
      const formattedExpiration = expirationDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const expiredReservations = await knex("reservations")
        .where("confirmed", 0)
        .andWhere("reserved_at", "<", formattedExpiration)
        .select("id", "product_id");

      for (const reservation of expiredReservations) {
        await knex("products")
          .where({ id: reservation.product_id })
          .increment("stock", 1);
        await knex("reservations").where({ id: reservation.id }).del();
      }

      return response.json({
        message: `${expiredReservations.length} reservas expiradas limpas.`,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao limpar reservas." });
    }
  }

  async confirmReservation(request, response) {
    const { id } = request.params;

    try {
      const reservation = await knex("reservations").where({ id }).first();

      if (!reservation) {
        return response.status(404).json({ error: "Reserva não encontrada." });
      }

      if (reservation.confirmed) {
        return response.status(400).json({ error: "Reserva já confirmada." });
      }

      await knex("reservations").where({ id }).update({ confirmed: true });

      return response.json({ message: "Reserva confirmada com sucesso." });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao confirmar reserva." });
    }
  }

  async listPending(request, response) {
    try {
      const reservations = await knex("reservations as r")
        .join("products as p", "r.product_id", "p.id")
        .select(
          "r.id",
          "r.product_id",
          "r.reserved_at",
          "r.confirmed",
          "p.title",
          "p.price",
          "p.stock"
        )
        .where("r.confirmed", false);

      return response.json(reservations);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ error: "Erro ao buscar reservas pendentes." });
    }
  }

  async confirm(request, response) {
    const { id } = request.params;

    try {
      const reservation = await knex("reservations").where({ id }).first();

      if (!reservation) {
        return response.status(404).json({ error: "Reserva não encontrada." });
      }

      if (reservation.confirmed) {
        return response
          .status(400)
          .json({ error: "Reserva já está confirmada." });
      }

      await knex("reservations").where({ id }).update({
        confirmed: true,
      });

      return response.json({ message: "Reserva confirmada com sucesso." });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao confirmar reserva." });
    }
  }

  async index(request, response) {
    try {
      const reservations = await knex("reservations")
        .join("products", "reservations.product_id", "products.id")
        .select(
          "reservations.id",
          "reservations.product_id",
          "products.title as product_name",
          "products.price",
          "reservations.confirmed",
          "reservations.reserved_at"
        );

      return response.json(reservations);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao buscar reservas." });
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    try {
      const reservation = await knex("reservations").where({ id }).first();

      if (!reservation) {
        return response.status(404).json({ error: "Reserva não encontrada." });
      }

      await knex("products")
        .where({ id: reservation.product_id })
        .increment("stock", 1);

      await knex("reservations").where({ id }).del();

      return response.json({
        message: "Reserva excluída e produto devolvido ao estoque com sucesso.",
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao excluir reserva." });
    }
  }
}

module.exports = ReservationsController;
