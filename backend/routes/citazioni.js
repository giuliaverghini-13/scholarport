const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Citazione = require('../models/Citazione');
const Articolo = require('../models/Articolo');
const auth = require('../middleware/auth');

// GET /api/citazioni/articolo/:articoloId - PUBBLICA
router.get('/articolo/:articoloId', async (req, res) => {
  try {
    const citazioni = await Citazione.find({ articolo: req.params.articoloId })
      .sort('-annoCitazione');
    res.json({ successo: true, dati: citazioni, totale: citazioni.length });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

// POST /api/citazioni - PROTETTA: solo il proprietario dell'articolo
router.post('/', auth,
  [
    body('articolo').notEmpty().withMessage('L\'ID dell\'articolo è obbligatorio'),
    body('autoriCitazione').notEmpty().withMessage('Gli autori sono obbligatori'),
    body('titoloCitazione').notEmpty().withMessage('Il titolo è obbligatorio'),
    body('annoCitazione').isNumeric().withMessage('L\'anno deve essere un numero')
  ],
  async (req, res) => {
    const errori = validationResult(req);
    if (!errori.isEmpty()) {
      return res.status(400).json({ successo: false, errori: errori.array() });
    }

    try {
      // Verifica che l'articolo esista e appartenga all'utente
      const articolo = await Articolo.findOne({
        _id: req.body.articolo,
        utente: req.utente._id
      });
      if (!articolo) {
        return res.status(404).json({ successo: false, errore: 'Articolo non trovato o non autorizzato' });
      }

      const citazione = await Citazione.create(req.body);
      res.status(201).json({ successo: true, dati: citazione });
    } catch (error) {
      res.status(500).json({ successo: false, errore: error.message });
    }
  }
);

// PUT /api/citazioni/:id - PROTETTA: solo il proprietario dell'articolo
router.put('/:id', auth, async (req, res) => {
  try {
    const citazione = await Citazione.findById(req.params.id);
    if (!citazione) {
      return res.status(404).json({ successo: false, errore: 'Citazione non trovata' });
    }

    // Verifica che l'articolo associato appartenga all'utente
    const articolo = await Articolo.findOne({
      _id: citazione.articolo,
      utente: req.utente._id
    });
    if (!articolo) {
      return res.status(403).json({ successo: false, errore: 'Non autorizzato' });
    }

    const citazioneAggiornata = await Citazione.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ successo: true, dati: citazioneAggiornata });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

// DELETE /api/citazioni/:id - PROTETTA: solo il proprietario dell'articolo
router.delete('/:id', auth, async (req, res) => {
  try {
    const citazione = await Citazione.findById(req.params.id);
    if (!citazione) {
      return res.status(404).json({ successo: false, errore: 'Citazione non trovata' });
    }

    // Verifica che l'articolo associato appartenga all'utente
    const articolo = await Articolo.findOne({
      _id: citazione.articolo,
      utente: req.utente._id
    });
    if (!articolo) {
      return res.status(403).json({ successo: false, errore: 'Non autorizzato' });
    }

    await Citazione.findByIdAndDelete(req.params.id);
    res.json({ successo: true, messaggio: 'Citazione eliminata con successo' });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

module.exports = router;