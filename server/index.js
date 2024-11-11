const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fattoincasadadebora",
  password: "admin",
  port: "5432",
});


// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    // const saltRounds = 10;
    
    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    // const hash2 = await bcrypt.hash(password, saltRounds);
    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
      [name, surname, email, password]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
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
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Logout endpoint
app.post('/api/logout', (req, res) => {
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
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
