const { poolGallanz } = require("../../config/database");

const eventsController = {
    getEvents: async (req, res) => {
        try {
            const query = "SELECT * FROM evento_calendario";
            const [rows] = await poolGallanz.query(query);
            // Send all rows as response
            res.status(200).json(rows);
        } catch (error) {
            console.error("Error fetching events:", error);
            res.status(500).json({
                message: "Error fetching events",
                error: error.message,
            });
        }
    },

    saveEvent: async (req, res) => {
        try {
            const { giorno_evento_calendario, momento_evento_calendario, descrizione_evento_calendario } = req.body;

            const query = `
                INSERT INTO evento_calendario 
                (giorno_evento_calendario, momento_evento_calendario, descrizione_evento_calendario) 
                VALUES (?, ?, ?)
            `;

            const [rows] = await poolGallanz.query(query, [
                giorno_evento_calendario,
                momento_evento_calendario,
                descrizione_evento_calendario
            ]);

            res.status(200).json(rows);
        } catch (error) {
            console.error("Error saving event:", error);
            res.status(500).json({
                message: "Error saving event",
                error: error.message,
            });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const { id_evento_calendario } = req.body;

            const query = `DELETE FROM evento_calendario WHERE id_evento_calendario = ?`;

            const [rows] = await poolGallanz.query(query, [
                id_evento_calendario,
            ]);

            res.status(200).json(rows);
        } catch (error) {
            console.error("Error deleting event:", error);
            res.status(500).json({
                message: "Error deleting event",
                error: error.message,
            });
        }




    }
}

module.exports = eventsController;


