const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const { apiUrl, isDevelopment } = require('./config/apiConfig');

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
if(!isDevelopment){
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.incucinacondebora.it/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/api.incucinacondebora.it/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/api.incucinacondebora.it/chain.pem', 'utf8');
  
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  https.createServer(credentials, app).listen(PORT, () => {
    console.log(`Server in ascolto su ${apiUrl}:${PORT}`);
  });
  
}else{
  app.listen(PORT, () => {
    console.log(`Server in ascolto su ${apiUrl}:${PORT}`);
  });
}

