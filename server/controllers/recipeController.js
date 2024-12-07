const pool = require("../config/database");

const recipeController = {
  getRecipeDetails: async (req, res) => {
    try {
      const { id_ricetta } = req.body;

      const query = "SELECT * FROM ricetta WHERE id_ricetta =  ?";
      const [rows] = await pool.query(query, [id_ricetta]);

      const query2 =
        "SELECT * FROM ingrediente i, ingrediente_ricetta ir WHERE ir.id_ingrediente = i.id_ingrediente AND ir.id_ricetta =  ?";
      const [rows2] = await pool.query(query2, [id_ricetta]);
      // Send all rows as response
      res.status(200).json({
        recipe: rows[0], // Assumendo che rows contenga un solo record
        ingredients: rows2,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        message: "Error fetching categories",
        error: error.message,
      });
    }
  },
};

module.exports = recipeController;
