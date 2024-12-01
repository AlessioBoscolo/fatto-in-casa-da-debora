const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes

app.use('/api/user', userRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/category', categoryRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
