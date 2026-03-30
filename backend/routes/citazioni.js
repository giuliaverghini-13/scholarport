// Importa le librerie necessarie
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Citazione = require('../models/Citazione');
const Articolo = require('../models/Articolo');

// =====================================================
// GET /api/citazioni/articolo/:articoloId
// Recupera tutte le citazioni di un determinato articolo
// =====================================================
router.get('/articolo/:articoloId', async (req, res) => {
  try {
    // Cerca tutte le citazioni che hanno quell'articolo come riferimento
    const citazioni = await Citazione.find({ articolo: req.params.articoloId })
      .sort('-annoCitazione');

    res.json({ successo: true, dati: citazioni, totale: citazioni.length });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

// =====================================================
// POST /api/citazioni
// Crea una nuova citazione associata a un articolo
// =====================================================
router.post('/',
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
      // Verifica che l'articolo di riferimento esista davvero
      const articolo = await Articolo.findById(req.body.articolo);
      if (!articolo) {
        return res.status(404).json({ successo: false, errore: 'Articolo non trovato' });
      }

      // Crea la citazione
      const citazione = await Citazione.create(req.body);
      res.status(201).json({ successo: true, dati: citazione });
    } catch (error) {
      res.status(500).json({ successo: false, errore: error.message });
    }
  }
);

// =====================================================
// PUT /api/citazioni/:id
// Aggiorna una citazione esistente
// =====================================================
router.put('/:id', async (req, res) => {
  try {
    const citazione = await Citazione.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!citazione) {
      return res.status(404).json({ successo: false, errore: 'Citazione non trovata' });
    }

    res.json({ successo: true, dati: citazione });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

// =====================================================
// DELETE /api/citazioni/:id
// Elimina una citazione specifica
// =====================================================
router.delete('/:id', async (req, res) => {
  try {
    const citazione = await Citazione.findByIdAndDelete(req.params.id);

    if (!citazione) {
      return res.status(404).json({ successo: false, errore: 'Citazione non trovata' });
    }

    res.json({ successo: true, messaggio: 'Citazione eliminata con successo' });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

module.exports = router;
