/**
 * Route per l'autenticazione.
 * POST /api/auth/registrazione - Registra un nuovo utente
 * POST /api/auth/login - Effettua il login
 * GET  /api/auth/me - Restituisce i dati dell'utente autenticato
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Utente = require('../models/Utente');
const auth = require('../middleware/auth');

/**
 * Genera un token JWT.
 * Il token contiene l'ID dell'utente e scade dopo 7 giorni.
 */
const generaToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/registrazione
router.post('/registrazione',
  [
    body('username').isLength({ min: 3 }).withMessage('Username minimo 3 caratteri'),
    body('email').isEmail().withMessage('Email non valida'),
    body('password').isLength({ min: 6 }).withMessage('Password minimo 6 caratteri')
  ],
  async (req, res) => {
    const errori = validationResult(req);
    if (!errori.isEmpty()) {
      return res.status(400).json({ successo: false, errori: errori.array() });
    }

    try {
      const { username, email, password } = req.body;

      // Controlla se username o email esistono già
      const utenteEsistente = await Utente.findOne({
        $or: [{ email }, { username }]
      });

      if (utenteEsistente) {
        return res.status(400).json({
          successo: false,
          errore: 'Username o email già in uso'
        });
      }

      // Crea il nuovo utente (la password viene criptata automaticamente)
      const utente = await Utente.create({ username, email, password });

      // Genera il token e risponde
      const token = generaToken(utente._id);

      res.status(201).json({
        successo: true,
        dati: {
          token,
          utente: {
            id: utente._id,
            username: utente.username,
            email: utente.email
          }
        }
      });
    } catch (error) {
      res.status(500).json({ successo: false, errore: error.message });
    }
  }
);

// POST /api/auth/login
router.post('/login',
  [
    body('email').isEmail().withMessage('Email non valida'),
    body('password').notEmpty().withMessage('Password obbligatoria')
  ],
  async (req, res) => {
    const errori = validationResult(req);
    if (!errori.isEmpty()) {
      return res.status(400).json({ successo: false, errori: errori.array() });
    }

    try {
      const { email, password } = req.body;

      // Cerca l'utente per email
      const utente = await Utente.findOne({ email });

      if (!utente) {
        return res.status(401).json({
          successo: false,
          errore: 'Credenziali non valide'
        });
      }

      // Verifica la password
      const passwordCorretta = await utente.confrontaPassword(password);

      if (!passwordCorretta) {
        return res.status(401).json({
          successo: false,
          errore: 'Credenziali non valide'
        });
      }

      // Genera il token e risponde
      const token = generaToken(utente._id);

      res.json({
        successo: true,
        dati: {
          token,
          utente: {
            id: utente._id,
            username: utente.username,
            email: utente.email
          }
        }
      });
    } catch (error) {
      res.status(500).json({ successo: false, errore: error.message });
    }
  }
);

// GET /api/auth/me - Dati utente autenticato
router.get('/me', auth, async (req, res) => {
  res.json({
    successo: true,
    dati: req.utente
  });
});

module.exports = router;