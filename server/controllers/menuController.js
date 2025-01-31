const pool = require("../config/database");

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
      const query = "SELECT id_ricetta, nome_ricetta FROM ricetta";
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
      const query = "SELECT m.*, r.nome_ricetta FROM menu m, ricetta r WHERE m.id_ricetta = r.id_ricetta";
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


  //Insert
  insertMenu: async (req, res) => {
    try {
      const { nome_personalizzato, id_ricetta, id_persona, id_giorno, id_momento } = req.body;

      // Insert ingredients for the recipe
      const query = "INSERT INTO menu(nome_ricetta_personalizzata, id_giorno_settimana, id_ricetta, id_persona, id_momento_giornata) VALUES(?, ?, ?, ?, ?)";
      await pool.query(query,[nome_personalizzato, id_giorno, id_ricetta, id_persona, id_momento]);

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

  //Delete

  clearMenu: async (req, res) => {
    try {
      const query = "DELETE FROM menu";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error deleting mwnu element:", error);
      res.status(500).json({
        message: "Error deleteing menu element",
        error: error.message,
      });
    }
  },


};

module.exports = menuController;
