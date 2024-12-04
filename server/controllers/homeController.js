const pool = require("../config/database");

const homeController = {
  getCategory: async (req, res) => {
    try {
      const query = "SELECT * FROM categoria ORDER BY id_categoria ASC";
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
};

module.exports = homeController;
