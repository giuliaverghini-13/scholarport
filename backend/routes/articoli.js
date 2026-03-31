const express = require('express');
const router = express.Router();
const Articolo = require('../models/Articolo');
const Citazione = require('../models/Citazione');
const auth = require('../middleware/auth');

// GET /api/articoli - PUBBLICA: tutti possono vedere gli articoli
router.get('/', async (req, res) => {
  try {
    const { cerca, autore, anno, pagina = 1, limite = 10, ordina = '-dataPubblicazione' } = req.query;
    let filtro = {};

    if (cerca) {
      filtro.$or = [
        { titolo: { $regex: cerca, $options: 'i' } },
        { autori: { $regex: cerca, $options: 'i' } },
        { abstract: { $regex: cerca, $options: 'i' } }
      ];
    }

    if (autore) {
      filtro.autori = { $regex: autore, $options: 'i' };
    }

    if (anno) {
      const inizioAnno = new Date(`${anno}-01-01`);
      const fineAnno = new Date(`${anno}-12-31`);
      filtro.dataPubblicazione = { $gte: inizioAnno, $lte: fineAnno };
    }

    const skip = (parseInt(pagina) - 1) * parseInt(limite);
    const totale = await Articolo.countDocuments(filtro);

    const articoli = await Articolo.find(filtro)
      .sort(ordina)
      .skip(skip)
      .limit(parseInt(limite))
      .populate('utente', 'username');

    const articoliConCitazioni = await Promise.all(
      articoli.map(async (art) => {
        const numeroCitazioni = await Citazione.countDocuments({ articolo: art._id });
        return { ...art.toObject(), numeroCitazioni };
      })
    );

    res.json({
      successo: true,
      dati: articoliConCitazioni,
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

// GET /api/articoli/:id - PUBBLICA: tutti possono vedere il dettaglio
router.get('/:id', async (req, res) => {
  try {
    const articolo = await Articolo.findById(req.params.id).populate('utente', 'username');
    if (!articolo) {
      return res.status(404).json({ successo: false, errore: 'Articolo non trovato' });
    }
    const citazioni = await Citazione.find({ articolo: req.params.id });
    res.json({ successo: true, dati: { ...articolo.toObject(), citazioni } });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

// POST /api/articoli - PROTETTA: solo utenti autenticati
router.post('/', auth, async (req, res) => {
  try {
    const { titolo, autori, dataPubblicazione } = req.body;
    if (!titolo) {
      return res.status(400).json({ successo: false, errore: 'Il titolo è obbligatorio' });
    }
    if (!autori || !Array.isArray(autori) || autori.length === 0) {
      return res.status(400).json({ successo: false, errore: 'Inserire almeno un autore' });
    }
    if (!dataPubblicazione) {
      return res.status(400).json({ successo: false, errore: 'La data è obbligatoria' });
    }
    const articolo = await Articolo.create({
      ...req.body,
      utente: req.utente._id
    });
    res.status(201).json({ successo: true, dati: articolo });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ successo: false, errore: 'Un articolo con questo DOI esiste già' });
    }
    res.status(500).json({ successo: false, errore: error.message });
  }
});

// PUT /api/articoli/:id - PROTETTA: solo il proprietario può modificare
router.put('/:id', auth, async (req, res) => {
  try {
    const articolo = await Articolo.findOneAndUpdate(
      { _id: req.params.id, utente: req.utente._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!articolo) {
      return res.status(404).json({ successo: false, errore: 'Articolo non trovato o non autorizzato' });
    }
    res.json({ successo: true, dati: articolo });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ successo: false, errore: 'DOI già in uso' });
    }
    res.status(500).json({ successo: false, errore: error.message });
  }
});

// DELETE /api/articoli/:id - PROTETTA: solo il proprietario può eliminare
router.delete('/:id', auth, async (req, res) => {
  try {
    const articolo = await Articolo.findOne({ _id: req.params.id, utente: req.utente._id });
    if (!articolo) {
      return res.status(404).json({ successo: false, errore: 'Articolo non trovato o non autorizzato' });
    }
    await Citazione.deleteMany({ articolo: req.params.id });
    await Articolo.findByIdAndDelete(req.params.id);
    res.json({ successo: true, messaggio: 'Articolo e citazioni eliminate con successo' });
  } catch (error) {
    res.status(500).json({ successo: false, errore: error.message });
  }
});

module.exports = router;