const mysql = require('mysql2/promise');
const { isDevelopment } = require("./apiConfig");
require("dotenv").config();

var config = {};

if (!isDevelopment()) {
  //use the main database
  config = {
    host: '31.11.39.189', // o l'indirizzo del tuo server MySQL
    user: process.env.DB_USERNAME, // l'utente MySQL
    password: process.env.DB_PASSWORD, // la password dell'utente
    database: 'Sql1831185_1', // il nome del tuo database
  };
} else {
  //use test database
  config = {
    host: 'localhost', // o l'indirizzo del tuo server MySQL
    user: "root", // l'utente MySQL
    password: "", // la password dell'utente
    database: 'incucinacondebora', // il nome del tuo database
  };
}

const pool = mysql.createPool(config);
// Funzione per testare la connessione
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connesso con successo!");
    connection.release();
  } catch (error) {
    console.error("Errore di connessione al database:", error);
  }
};

// Test della connessione all'avvio
testConnection();

module.exports = pool;
