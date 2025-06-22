const {pool} = require("../../config/database");

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
      console.log(recipeDetails.image);
      
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

  saveUpdateRecipe: async (req, res) => {
    try {
      const {
        id_ricetta,
        porzioni_recipe,
        ingredienti_recipe,
        recipe_details,
      } = req.body;

      const query =
        "UPDATE ricetta SET porzioni_ricetta = ?, preparazione_ricetta = ?, note_ricetta = ?, nome_ricetta = ?, image_path_ricetta = ? WHERE id_ricetta = ?";
      await pool.query(query, [
        porzioni_recipe,
        recipe_details.preparazione_ricetta,
        recipe_details.note_ricetta,
        recipe_details.nome_ricetta,
        recipe_details.image_path_ricetta,
        id_ricetta,
      ]);

      // Prima elimina tutti gli ingredienti esistenti per questa ricetta
      const deleteQuery =
        "DELETE FROM ingrediente_ricetta WHERE id_ricetta = ?";
      await pool.query(deleteQuery, [id_ricetta]);

      // Poi inserisci i nuovi ingredienti
      const insertQuery =
        "INSERT INTO ingrediente_ricetta(quantita_ingrediente, id_ingrediente, id_ricetta, id_unita_misura) VALUES(?, ?, ?, ?)";
      for (const ingredient of ingredienti_recipe) {
        await pool.query(insertQuery, [
          ingredient.quantita_ingrediente,
          ingredient.id_ingrediente,
          id_ricetta,
          ingredient.id_unita_misura,
        ]);
      }

      const query2 =
        "UPDATE ingrediente SET nome_ingrediente = ? WHERE id_ingrediente = ?";
      for (const ingredient of ingredienti_recipe) {
        await pool.query(query2, [
          ingredient.nome_ingrediente,
          ingredient.id_ingrediente,
        ]);
      }
      res.status(200).json({
        message: "Recipe updated successfully",
      });
    } catch (error) {
      console.error("Error inserting ingredients:", error);
      res.status(500).json({
        message: "Error inserting ingredients",
        error: error.message,
      });
    }
  },

  deleteRecipe: async (req, res) => {
    
    try{
      const { id_ricetta } = req.body;


      let deleteQuery =
      "DELETE FROM ingrediente_ricetta WHERE id_ricetta = ?";
      await pool.query(deleteQuery, [id_ricetta]);
  
      deleteQuery = "DELETE FROM ricetta WHERE id_ricetta = ?";
      await pool.query(deleteQuery, [id_ricetta]);
      res.status(200).json({
        message: "Recipe deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({
        message: "Error deleting recipe",
        error: error.message,
      });
    }


  },

  search: async (req, res) => {
    try {
      const { searchedTerm } = req.body;

      const [rows] = await pool.query(
        "SELECT * FROM ricetta WHERE LOWER(nome_ricetta) LIKE LOWER(?)",
        [`%${searchedTerm}%`]
      );

      const [rows2] = await pool.query(
        "SELECT * FROM ricetta r, ingrediente_ricetta ir, ingrediente i WHERE LOWER(i.nome_ingrediente) LIKE LOWER(?) AND i.id_ingrediente = ir.id_ingrediente AND ir.id_ricetta = r.id_ricetta",
        [`%${searchedTerm}%`]
      );
      const combinedResults = [...rows, ...rows2];
      const uniqueResults = Array.from(
        new Map(combinedResults.map((item) => [item.id_ricetta, item])).values()
      );

      res.status(200).json({ recipes: uniqueResults });
    } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  searchCategory: async (req, res) => {
    try {
      const { searchedTerm, category } = req.body;

      const [rows] = await pool.query(
        "SELECT * FROM ricetta WHERE ricetta.id_categoria = ? AND LOWER(nome_ricetta) LIKE LOWER(?)",
        [category, `%${searchedTerm}%`]
      );

      const [rows2] = await pool.query(
        "SELECT * FROM ricetta r, ingrediente_ricetta ir, ingrediente i WHERE r.id_categoria = ? AND LOWER(i.nome_ingrediente) LIKE LOWER(?) AND i.id_ingrediente = ir.id_ingrediente AND ir.id_ricetta = r.id_ricetta",
        [category, `%${searchedTerm}%`]
      );
      const combinedResults = [...rows, ...rows2];
      const uniqueResults = Array.from(
        new Map(combinedResults.map((item) => [item.id_ricetta, item])).values()
      );

      res.status(200).json({ recipes: uniqueResults });
    } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

};

module.exports = recipeController;
