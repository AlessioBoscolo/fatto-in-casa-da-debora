const mysql = require('mysql2/promise');

const connectionConfig = {
  host: '31.11.39.189', // o l'indirizzo del tuo server MySQL
  user: 'Sql1831185', // l'utente MySQL
  password: 'Kalkeraanni90!', // la password dell'utente
  database: 'Sql1831185_1', // il nome del tuo database
};

const pool = mysql.createPool(connectionConfig);
module.exports = pool;