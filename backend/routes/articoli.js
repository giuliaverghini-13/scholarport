// Importa le librerie necessarie
const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Articolo = require('../models/Articolo');
const Citazione = require('../models/Citazione');

// =====================================================
// GET /api/articoli
// Recupera tutti gli articoli con ricerca, filtri e paginazione
// =====================================================
router.get('/', async (req, res) => {
  try {
    // Legge i parametri dalla query string (es: ?cerca=machine&anno=2024)
    const {
      cerca,
      autore,
      anno,
      pagina = 1,
      limite = 10,
      ordina = '-dataPubblicazione'
    } = req.query;

    // Costruisce il filtro per la query MongoDB
    let filtro = {};

    // Ricerca testuale su titolo, autori e abstract
    if (cerca) {
      filtro.$or = [
        { titolo: { $regex: cerca, $options: 'i' } },
        { autori: { $regex: cerca, $options: 'i' } },
        { abstract: { $regex: cerca, $options: 'i' } }
      ];
    }

    // Filtro per autore specifico
    if (autore) {
      filtro.autori = { $regex: autore, $options: 'i' };
    }

    // Filtro per anno di pubblicazione
    if (anno) {
      const inizioAnno = new Date(`${anno}-01-01`);
      const fineAnno = new Date(`${anno}-12-31`);
      filtro.dataPubblicazione = { $gte: inizioAnno, $lte: fineAnno };
    }

    // Calcola quanti documenti saltare per la paginazione
    const skip = (parseInt(pagina) - 1) * parseInt(limite);
    const totale = await Articolo.countDocuments(filtro);

    // Esegue la query con filtri, ordinamento e paginazione
    const articoli = await Articolo.find(filtro)
      .sort(ordina)
      .skip(skip)
      .limit(parseInt(limite));

    // Risponde con i dati e le info di paginazione
    res.json({
      successo: true,
      dati: articoli,
      paginazione: {
        totale,
        pagina: parseInt(pagina),
        pagine: Math.ceil(totale / parseInt(limite)),
        limite: parseInt(limite)
      }
    });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

// =====================================================
// GET /api/articoli/:id
// Recupera un singolo articolo con le sue citazioni
// =====================================================
router.get('/:id', async (req, res) => {
  try {
    // Cerca l'articolo per ID
    const articolo = await Articolo.findById(req.params.id);

    if (!articolo) {
      return res.status(404).json({ successo: false, errore: 'Articolo non trovato' });
    }

    // Recupera le citazioni associate a questo articolo
    const citazioni = await Citazione.find({ articolo: req.params.id });

    // Risponde con l'articolo e le sue citazioni
    res.json({
      successo: true,
      dati: { ...articolo.toObject(), citazioni }
    });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

// =====================================================
// POST /api/articoli
// Crea un nuovo articolo
// =====================================================
router.post('/',
  [
    // Regole di validazione
    body('titolo').notEmpty().withMessage('Il titolo è obbligatorio'),
    body('autori').isArray({ min: 1 }).withMessage('Inserire almeno un autore'),
    body('dataPubblicazione').isISO8601().withMessage('Data di pubblicazione non valida')
  ],
  async (req, res) => {
    // Controlla se ci sono errori di validazione
    const errori = validationResult(req);
    if (!errori.isEmpty()) {
      return res.status(400).json({ successo: false, errori: errori.array() });
    }

    try {
      // Crea l'articolo nel database
      const articolo = await Articolo.create(req.body);
      res.status(201).json({ successo: true, dati: articolo });
    } catch (error) {
      // Gestisce il caso di DOI già esistente
      if (error.code === 11000) {
        return res.status(400).json({
          successo: false,
          errore: 'Un articolo con questo DOI esiste già'
        });
      }
      res.status(500).json({ successo: false, errore: error.message });
    }
  }
);

// =====================================================
// PUT /api/articoli/:id
// Aggiorna un articolo esistente
// =====================================================
router.put('/:id',
  [
    body('titolo').optional().notEmpty().withMessage('Il titolo non può essere vuoto'),
    body('autori').optional().isArray({ min: 1 }).withMessage('Inserire almeno un autore'),
    body('dataPubblicazione').optional().isISO8601().withMessage('Data non valida')
  ],
  async (req, res) => {
    const errori = validationResult(req);
    if (!errori.isEmpty()) {
      return res.status(400).json({ successo: false, errori: errori.array() });
    }

    try {
      // Trova e aggiorna l'articolo, restituendo la versione aggiornata
      const articolo = await Articolo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!articolo) {
        return res.status(404).json({ successo: false, errore: 'Articolo non trovato' });
      }

      res.json({ successo: true, dati: articolo });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ successo: false, errore: 'DOI già in uso' });
      }
      res.status(500).json({ successo: false, errore: error.message });
    }
  }
);

// =====================================================
// DELETE /api/articoli/:id
// Elimina un articolo e tutte le sue citazioni
// =====================================================
router.delete('/:id', async (req, res) => {
  try {
    const articolo = await Articolo.findById(req.params.id);

    if (!articolo) {
      return res.status(404).json({ successo: false, errore: 'Articolo non trovato' });
    }

    // Prima elimina tutte le citazioni associate
    await Citazione.deleteMany({ articolo: req.params.id });
    // Poi elimina l'articolo
    await Articolo.findByIdAndDelete(req.params.id);

    res.json({ successo: true, messaggio: 'Articolo e citazioni eliminate con successo' });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

module.exports = router;
