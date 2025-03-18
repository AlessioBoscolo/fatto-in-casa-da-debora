const {pool} = require("../../config/database");

const menuController = {
  getWeekDay: async (req, res) => {
    try {
      const query = "SELECT * FROM giorno_settimana";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching week's day:", error);
      res.status(500).json({
        message: "Error fetching week's day",
        error: error.message,
      });
    }
  },

  getDayMoment: async (req, res) => {
    try {
      const query = "SELECT * FROM momento_giornata";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching day moment:", error);
      res.status(500).json({
        message: "Error fetching day moment",
        error: error.message,
      });
    }
  },

  getAllRecipe: async (req, res) => {
    try {
      const query =
        "SELECT id_ricetta, nome_ricetta FROM ricetta ORDER BY nome_ricetta ASC";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching day moment:", error);
      res.status(500).json({
        message: "Error fetching day moment",
        error: error.message,
      });
    }
  },

  getPeople: async (req, res) => {
    try {
      const query = "SELECT * FROM persona";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching day moment:", error);
      res.status(500).json({
        message: "Error fetching day moment",
        error: error.message,
      });
    }
  },

  getMenu: async (req, res) => {
    try {
      const query =
        "SELECT m.*, r.nome_ricetta FROM menu m, ricetta r WHERE m.id_ricetta = r.id_ricetta";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching menu element:", error);
      res.status(500).json({
        message: "Error fetching menu element",
        error: error.message,
      });
    }
  },

  getDayConfiguration: async (req, res) => {
    try {
      const query = "SELECT * FROM giorno_settimana";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching day configuration:", error);
      res.status(500).json({
        message: "Error fetching day configuration",
        error: error.message,
      });
    }
  },

  getDaysElement: async (req, res) => {
    try {
      const { id_giorno, id_momento } = req.body;

      const query =
        "SELECT * FROM menu m, ricetta r, persona p WHERE m.id_ricetta = r.id_ricetta AND m.id_persona = p.id_persona AND id_giorno_settimana = ? AND id_momento_giornata = ?";
      const [rows] = await pool.query(query, [id_giorno, id_momento]);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching day configuration:", error);
      res.status(500).json({
        message: "Error fetching day configuration",
        error: error.message,
      });
    }
  },

  getMenuArchiviati: async (req, res) => {
    try {
      const query = "SELECT * FROM archivio_nome";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching menu name:", error);
      res.status(500).json({
        message: "Error fetching menu name",
        error: error.message,
      });
    }
  },

  getMenuName: async (req, res) => {
    try {
      const { id_archivied } = req.body;

      const query = "SELECT * FROM archivio_nome WHERE id_archivio_nome = ?";
      const [rows] = await pool.query(query, [id_archivied]);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching menu name:", error);
      res.status(500).json({
        message: "Error fetching menu name",
        error: error.message,
      });
    }
  },

  getArchiviedElement: async (req, res) => {
    try {
      const { id_archivied } = req.body;

      const query =
        "SELECT am.*, r.nome_ricetta FROM archivio_menu am, ricetta r WHERE am.id_ricetta = r.id_ricetta AND id_archivio_nome = ?";
      const [rows] = await pool.query(query, [id_archivied]);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching menu name:", error);
      res.status(500).json({
        message: "Error fetching menu name",
        error: error.message,
      });
    }
  },

  //Insert
  insertMenu: async (req, res) => {
    try {
      const {
        nome_personalizzato,
        id_ricetta,
        id_persona,
        id_giorno,
        id_momento,
      } = req.body;

      // Insert ingredients for the recipe
      const query =
        "INSERT INTO menu(nome_ricetta_personalizzata, id_giorno_settimana, id_ricetta, id_persona, id_momento_giornata) VALUES(?, ?, ?, ?, ?)";
      await pool.query(query, [
        nome_personalizzato,
        id_giorno,
        id_ricetta,
        id_persona,
        id_momento,
      ]);

      res.status(200).json({
        message: "New menu inserted successfully",
      });
    } catch (error) {
      console.error("Error inserting menu:", error);
      res.status(500).json({
        message: "Error inserting menu",
        error: error.message,
      });
    }
  },

  saveMenu: async (req, res) => {
    try {
      const { nome_menu } = req.body;

      // Insert into archivio_nome and get the ID
      const query = "INSERT INTO archivio_nome(nome_archivio_nome) VALUES(?)";
      const [result] = await pool.query(query, [nome_menu]);
      const archivioId = result.insertId; // Get the auto-generated ID

      const query2 = "SELECT * FROM menu";
      const [rows] = await pool.query(query2);

      const query3 =
        "INSERT INTO archivio_menu(ricetta_personalizzata_archivio_menu, id_giorno_settimana, id_ricetta, id_persona, id_momento_giornata, id_archivio_nome) VALUES(?, ?, ?, ?, ?, ?)";

      for (const element of rows) {
        await pool.query(query3, [
          element.nome_ricetta_personalizzata,
          element.id_giorno_settimana,
          element.id_ricetta,
          element.id_persona,
          element.id_momento_giornata,
          archivioId,
        ]);
      }

      res.status(200).json({
        message: "Menu saving goes successfully",
        archivioId: archivioId, // Include the ID in the response
      });
    } catch (error) {
      console.error("Error saving menu:", error);
      res.status(500).json({
        message: "Error saving menu",
        error: error.message,
      });
    }
  },

  uploadMenuArchivied: async (req, res) => {
    try {
      const { id_archivied } = req.body;
      
      const query =
        "SELECT am.*, r.nome_ricetta FROM archivio_menu am, ricetta r WHERE am.id_ricetta = r.id_ricetta AND id_archivio_nome = ?";
      const [archiviedElements] = await pool.query(query, [id_archivied]);

      // Inserire gli elementi archiviati nel menu corrente
      const insertQuery = 
        "INSERT INTO menu(nome_ricetta_personalizzata, id_giorno_settimana, id_ricetta, id_persona, id_momento_giornata) VALUES(?, ?, ?, ?, ?)";
      
      for (const element of archiviedElements) {
        await pool.query(insertQuery, [
          element.ricetta_personalizzata_archivio_menu,
          element.id_giorno_settimana,
          element.id_ricetta,
          element.id_persona,
          element.id_momento_giornata
        ]);
      }

      res.status(200).json({
        message: "Menu archived uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading archived menu:", error);
      res.status(500).json({
        message: "Error uploading archived menu",
        error: error.message,
      });
    }
  },

  //Update
  updateMenuElement: async (req, res) => {
    try {
      const { id_menu, id_persona, id_ricetta, nome_personalizzato } = req.body;

      const query =
        "UPDATE menu SET id_persona = ?, id_ricetta = ?, nome_ricetta_personalizzata = ? WHERE id_menu = ?";
      const [rows] = await pool.query(query, [
        id_persona,
        id_ricetta,
        nome_personalizzato,
        id_menu,
      ]);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error updating menu element:", error);
      res.status(500).json({
        message: "Error updating menu element",
        error: error.message,
      });
    }
  },

  updateDayConfiguration: async (req, res) => {
    try {
      const configuration = req.body;

      for (const element of configuration) {
        const query =
          "UPDATE giorno_settimana SET numero_giorno_settimana = ? WHERE id_giorno_settimana = ?";
        await pool.query(query, [
          element.numero_giorno_settimana,
          element.id_giorno_settimana,
        ]);
      }

      // // Send all rows as response
      res.status(200).json({ message: "Configuration updated successfully" });
    } catch (error) {
      console.error("Error updating menu configuration:", error);
      res.status(500).json({
        message: "Error updating menu configuration",
        error: error.message,
      });
    }
  },

  //Delete

  clearMenu: async (req, res) => {
    try {
      const query = "DELETE FROM menu";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error deleting menu element:", error);
      res.status(500).json({
        message: "Error deleteing menu element",
        error: error.message,
      });
    }
  },

  deleteMenuElement: async (req, res) => {
    try {
      const { id_menu } = req.body;

      const query = "DELETE FROM menu WHERE id_menu = ?";
      const [rows] = await pool.query(query, [id_menu]);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error deleteing menu element:", error);
      res.status(500).json({
        message: "Error deleteing menu element",
        error: error.message,
      });
    }
  },

  clearMenuArchivied: async (req, res) => {
    try {
      const { id_archivied } = req.body;

      const query = "DELETE FROM archivio_menu WHERE id_archivio_nome = ?";
      await pool.query(query, [id_archivied]);

      const query2 = "DELETE FROM archivio_nome WHERE id_archivio_nome = ?";
      const [rows2] = await pool.query(query2, [id_archivied]);

      // Send all rows as response
      res.status(200).json(rows2);
    } catch (error) {
      console.error("Error deleteing menu archivied:", error);
      res.status(500).json({
        message: "Error deleteing menu archivied",
        error: error.message,
      });
    }
  },
};

module.exports = menuController;
