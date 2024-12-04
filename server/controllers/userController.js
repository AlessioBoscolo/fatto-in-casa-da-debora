const pool = require("../config/database");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const userController = {
  registerUser: async (req, res) => {
    try {
      const { name, surname, email, password } = req.body;

      // Check if user already exists
      const [userExists] = await pool.query(
        "SELECT nome_utente, cognome_utente FROM utente WHERE email_utente = ?",
        [email]
      );


      if (userExists.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // var passwordHashed = hashingPassword(password);
      const hash = await bcrypt.hash(password, saltRounds);

      // Hash password
      // const hash2 = await bcrypt.hash(password, saltRounds);
      // Insert new user
      const result = await pool.query(
        "INSERT INTO utente (nome_utente, cognome_utente, email_utente, password_utente, permesso_utente) VALUES (?, ?, ?, ?, ?)",
        [name, surname, email, hash, 0]
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  // Login endpoint
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      var validPassword = false;

      // Find user
      const result = await pool.query(
        "SELECT * FROM utente WHERE email_utente = ?",
        [email]
      );

      if (result.rows.length === 1) {
        if(result.rows[0].permesso_utente != null){
          validPassword = await bcrypt.compare(password, result.rows[0].password_utente);
        }else{
          return res.status(401).json({ error: "Not yet authorized" });
        }
      } else if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      // Don't send password back to client
      const {password_utente: _, ...user } = result.rows[0];
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Logout endpoint
  logoutUser: (req, res) => {
    // If using sessions
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          res.status(500).json({ error: "Could not log out" });
        } else {
          res.json({ message: "Logout successful" });
        }
      });
    } else {
      res.json({ message: "Logout successful" });
    }
  },
  test: async (req, res) => {
    try {
      // Find user
      //const [rows] = await pool.query("SELECT * FROM utente");
      //console.log(rows)
      res.json("test");
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  },

};

module.exports = userController;
