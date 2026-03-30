// Importa le librerie
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Crea l'applicazione Express
const app = express();

// =====================================================
// MIDDLEWARE
// I middleware sono funzioni che processano ogni richiesta
// PRIMA che arrivi alle route
// =====================================================

// CORS: permette al frontend (porta 3000) di parlare col backend (porta 5000)
app.use(cors());

// Permette di leggere i dati JSON nel body delle richieste
app.use(express.json());

// =====================================================
// ROUTE
// Collega gli endpoint alle route che abbiamo creato
// =====================================================

// Tutte le richieste a /api/articoli vanno al file routes/articoli.js
app.use('/api/articoli', require('./routes/articoli'));

// Tutte le richieste a /api/citazioni vanno al file routes/citazioni.js
app.use('/api/citazioni', require('./routes/citazioni'));

// Route di benvenuto (per verificare che il server funzioni)
app.get('/', (req, res) => {
  res.json({
    messaggio: 'Benvenuto nell\'API di ScholarPort',
    versione: '1.0.0',
    endpoints: {
      articoli: '/api/articoli',
      citazioni: '/api/citazioni'
    }
  });
});

// =====================================================
// GESTIONE ERRORI GLOBALE
// Cattura qualsiasi errore non gestito nelle route
// =====================================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    successo: false,
    errore: 'Errore interno del server'
  });
});

// =====================================================
// AVVIO DEL SERVER
// =====================================================
const PORT = process.env.PORT || 5000;

// Avvia solo se NON siamo in modalità test
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server ScholarPort in esecuzione sulla porta ${PORT}`);
    });
  });
}

// Esporta app per i test
module.exports = app;
