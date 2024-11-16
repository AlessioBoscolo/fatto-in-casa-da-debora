const pool = require('../config/database');

const userController = {
    registerUser: async (req, res) => {
        try {
          const { name, surname, email, password } = req.body;
          // const saltRounds = 10;
          
          // Check if user already exists
          const userExists = await pool.query(
            'SELECT * FROM utente WHERE email_utente = $1',
            [email]
          );
      
          if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
          }
      
          // Hash password
          // const hash2 = await bcrypt.hash(password, saltRounds);
          // Insert new user
          const result = await pool.query(
            'INSERT INTO utente (nome_utente, cognome_utente, email_utente, password_utente) VALUES ($1, $2, $3, $4) RETURNING id_utente, nome_utente, email_utente',
            [name, surname, email, password]
          );
      
          res.json(result.rows[0]);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
        }
      },
      
      // Login endpoint
      loginUser: async (req, res) => {
        try {
          const { email, password } = req.body;
          
          console.log(email, password);
          
          // Find user
          const result = await pool.query(
            'SELECT * FROM utente WHERE email_utente = $1 AND password_utente = $2',
            [email, password]
          );
      
          if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }

      
          // Check password
          // const validPassword = await bcrypt.compare(password, result.rows[0].password);
          // if (!validPassword) {
          //   return res.status(401).json({ error: 'Invalid credentials' });
          // }
      
          // Don't send password back to client
          const { password: _, ...user } = result.rows[0];
          res.json(user);
        } catch (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Server error' });
        }
      },
      
      
      // Logout endpoint
      logoutUser: (req, res) => {
        // If using sessions
        if (req.session) {
          req.session.destroy(err => {
            if (err) {
              res.status(500).json({ error: 'Could not log out' });
            } else {
              res.json({ message: 'Logout successful' });
            }
          });
        } else {
          res.json({ message: 'Logout successful' });
        }
      },
}

module.exports = userController;