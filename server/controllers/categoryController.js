const pool = require("../config/database");

const categoryController = {
  getRecipe: async (req, res) => {
    try {
      const { id_categoria } = req.body;

      const [rows] = await pool.query(
        "SELECT * FROM ricetta WHERE id_categoria = ?",
        [id_categoria]
      );

      // Send all rows as response
      res.status(200).json(rows);
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

      const randomRecipe = parseInt(nrRandomRecipe);

      const [rows] = await pool.query(
        'SELECT * FROM ricetta ORDER BY RAND() LIMIT ?',
        [randomRecipe]
      );

      // Send all rows as response
      res.status(200).json(rows);
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
      
      const [rows] = await pool.query(
        "SELECT * FROM categoria WHERE id_categoria = ?",
        [id_categorias]
      );

      // Send all rows as response
      res.status(200).json(rows);
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
