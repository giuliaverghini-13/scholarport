/**
 * Middleware di autenticazione.
 * Verifica che la richiesta contenga un token JWT valido.
 * Se il token è valido, aggiunge i dati dell'utente alla richiesta.
 * Se non è valido, blocca la richiesta con errore 401.
 */
const jwt = require('jsonwebtoken');
const Utente = require('../models/Utente');

const auth = async (req, res, next) => {
  try {
    // Cerca il token nell'header Authorization
    const header = req.header('Authorization');

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({
        successo: false,
        errore: 'Accesso negato. Token non fornito.'
      });
    }

    // Estrae il token (rimuove "Bearer " dall'inizio)
    const token = header.replace('Bearer ', '');

    // Verifica e decodifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cerca l'utente nel database
    const utente = await Utente.findById(decoded.id).select('-password');

    if (!utente) {
      return res.status(401).json({
        successo: false,
        errore: 'Token non valido.'
      });
    }

    // Aggiunge l'utente alla richiesta così le route possono usarlo
    req.utente = utente;
    next();
  } catch (error) {
    res.status(401).json({
      successo: false,
      errore: 'Token non valido o scaduto.'
    });
  }
};

module.exports = auth;