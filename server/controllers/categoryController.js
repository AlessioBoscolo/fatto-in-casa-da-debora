const pool = require("../config/database");

const categoryController = {
  getRecipe: async (req, res) => {
    try {
      const { id_categoria } = req.body;

      const result = await pool.query(
        "SELECT * FROM ricetta WHERE id_categoria = $1",
        [id_categoria]
      );

      // Send all rows as response
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({
        message: "Error fetching recipes",
        error: error.message,
      });
    }
  },
  getRandomRecipe: async (req, res) => {
    try {
      const { nrRandomRecipe } = req.body;

      const result = await pool.query(
        "SELECT * FROM ricetta ORDER BY RANDOM() LIMIT $1",
        [nrRandomRecipe]
      );

      // Send all rows as response
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({
        message: "Error fetching recipes",
        error: error.message,
      });
    }
  },
  getNameCategory: async (req, res) => {
    try {
      const { id_categorias } = req.body;
      
      const result = await pool.query(
        "SELECT * FROM categoria WHERE id_categoria = $1",
        [id_categorias]
      );

      // Send all rows as response
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({
        message: "Error fetching recipes",
        error: error.message,
      });
    }
  },
};

module.exports = categoryController;
