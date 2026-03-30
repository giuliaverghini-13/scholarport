const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articoli', require('./routes/articoli'));
app.use('/api/citazioni', require('./routes/citazioni'));

// Route di benvenuto
app.get('/', (req, res) => {
  res.json({
    messaggio: 'Benvenuto nell\'API di ScholarPort',
    versione: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      articoli: '/api/articoli',
      citazioni: '/api/citazioni'
    }
  });
});

// Gestione errori globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    successo: false,
    errore: 'Errore interno del server'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server ScholarPort in esecuzione sulla porta ${PORT}`);
    });
  });
}

module.exports = app;
