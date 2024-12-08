const pool = require("../config/database");

const recipeController = {
  getRecipeDetails: async (req, res) => {
    try {
      const { id_ricetta } = req.body;

      const query = "SELECT * FROM ricetta WHERE id_ricetta =  ?";
      const [rows] = await pool.query(query, [id_ricetta]);

      const query2 =
        "SELECT * FROM ingrediente i, ingrediente_ricetta ir, unita_misura uom WHERE ir.id_ingrediente = i.id_ingrediente AND uom.id_unita_misura = ir.id_unita_misura AND ir.id_ricetta =  ?";
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

  getIngredients: async (req, res) => {
    try {
      const query = "SELECT * FROM ingrediente ORDER BY nome_ingrediente ASC";
      const [rows] = await pool.query(query);
      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        message: "Error fetching categories",
        error: error.message,
      });
    }
  },

  getUoM: async (req, res) => {
    try {
      const query = "SELECT * FROM unita_misura ORDER BY nome_unita_misura ASC";
      const [rows] = await pool.query(query);
      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        message: "Error fetching categories",
        error: error.message,
      });
    }
  },

  insertRecipe: async (req, res) => {
    try {
      const { recipeDetails, ingredientDetails } = req.body;
      const query =
        "INSERT INTO ricetta(nome_ricetta, porzioni_ricetta, preparazione_ricetta, note_ricetta, image_path_ricetta, id_categoria) VALUES(?, ?, ?, ?, ?, ?)";
      const [rows] = await pool.query(query, [
        recipeDetails.name,
        recipeDetails.servings,
        recipeDetails.instructions,
        recipeDetails.notes,
        recipeDetails.image,
        recipeDetails.category,
      ]);

      const lastIdInserted = rows.insertId;

      // Insert ingredients for the recipe
      const query2 =
        "INSERT INTO ingrediente_ricetta(quantita_ingrediente, id_ingrediente, id_ricetta, id_unita_misura) VALUES(?, ?, ?, ?)";

      // Insert each ingredient
      for (const ingredient of ingredientDetails) {
        await pool.query(query2, [
          ingredient.quantity,
          ingredient.name,
          lastIdInserted,
          ingredient.unit,
        ]);
      }

      res.status(200).json({
        message: "Recipe and ingredients inserted successfully",
        recipeId: lastIdInserted,
      });
    } catch (error) {
      console.error("Error inserting recipe:", error);
      res.status(500).json({
        message: "Error inserting recipe",
        error: error.message,
      });
    }
  },

  insertIngredient: async (req, res) => {
    try {
      const { newIngredient } = req.body;

      // Insert ingredients for the recipe
      const query = "INSERT INTO ingrediente(nome_ingrediente) VALUES(?)";

      // Insert each ingredient
      for (const ingredient of newIngredient) {
        await pool.query(query, [ingredient.name]);
      }

      res.status(200).json({
        message: "New ingredients inserted successfully",
      });
    } catch (error) {
      console.error("Error inserting ingredients:", error);
      res.status(500).json({
        message: "Error inserting ingredients",
        error: error.message,
      });
    }
  },
};

module.exports = recipeController;
