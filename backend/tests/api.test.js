/**
 * Test funzionali per l'API ScholarPort.
 * Usa mongodb-memory-server per creare un database MongoDB finto in memoria,
 * così non serve avere MongoDB acceso per eseguire i test.
 */
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Articolo = require('../models/Articolo');
const Citazione = require('../models/Citazione');

let mongoServer;

// Prima di tutti i test: avvia il database in memoria
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Dopo ogni test: pulisci il database
afterEach(async () => {
  await Articolo.deleteMany({});
  await Citazione.deleteMany({});
});

// Dopo tutti i test: chiudi le connessioni
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Dati di esempio da usare nei test
const articoloEsempio = {
  titolo: 'Machine Learning per la Diagnostica Medica',
  autori: ['Mario Rossi', 'Luigi Bianchi'],
  abstract: 'Questo studio esplora l\'uso del machine learning nella diagnostica.',
  dataPubblicazione: '2024-03-15',
  doi: '10.1234/test.2024.001'
};

const citazioneEsempio = {
  autoriCitazione: 'Anna Verdi',
  titoloCitazione: 'Advances in AI-Driven Healthcare',
  annoCitazione: 2024,
  fonte: 'Journal of Medical AI',
  doi: '10.5678/cite.2024.001'
};

// ==================== TEST ARTICOLI ====================

describe('API Articoli', () => {

  // Test 1: Creazione articolo
  test('POST /api/articoli - Deve creare un nuovo articolo', async () => {
    const res = await request(app)
      .post('/api/articoli')
      .send(articoloEsempio);

    expect(res.statusCode).toBe(201);
    expect(res.body.successo).toBe(true);
    expect(res.body.dati.titolo).toBe(articoloEsempio.titolo);
    expect(res.body.dati.autori).toHaveLength(2);
  });

  // Test 2: Lettura lista articoli
  test('GET /api/articoli - Deve restituire la lista degli articoli', async () => {
    await Articolo.create(articoloEsempio);

    const res = await request(app).get('/api/articoli');

    expect(res.statusCode).toBe(200);
    expect(res.body.successo).toBe(true);
    expect(res.body.dati).toHaveLength(1);
    expect(res.body.paginazione.totale).toBe(1);
  });

  // Test 3: Aggiornamento articolo
  test('PUT /api/articoli/:id - Deve aggiornare un articolo', async () => {
    const articolo = await Articolo.create(articoloEsempio);

    const res = await request(app)
      .put(`/api/articoli/${articolo._id}`)
      .send({ titolo: 'Titolo Aggiornato' });

    expect(res.statusCode).toBe(200);
    expect(res.body.dati.titolo).toBe('Titolo Aggiornato');
  });

  // Test 4: Eliminazione articolo
  test('DELETE /api/articoli/:id - Deve eliminare un articolo', async () => {
    const articolo = await Articolo.create(articoloEsempio);

    const res = await request(app).delete(`/api/articoli/${articolo._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.successo).toBe(true);

    const trovato = await Articolo.findById(articolo._id);
    expect(trovato).toBeNull();
  });

  // Test 5: Ricerca articoli
  test('GET /api/articoli?cerca=... - Deve filtrare per ricerca', async () => {
    await Articolo.create(articoloEsempio);

    await Articolo.create({
      ...articoloEsempio,
      titolo: 'Quantum Computing Overview',
      abstract: 'Introduzione ai principi del calcolo quantistico.',
      doi: '10.1234/test.2024.002'
    });

    const res = await request(app).get('/api/articoli?cerca=Machine');

    expect(res.statusCode).toBe(200);
    expect(res.body.dati).toHaveLength(1);
    expect(res.body.dati[0].titolo).toContain('Machine');
  });

  // Test 6: Validazione - rifiuta articolo senza titolo
  test('POST /api/articoli - Deve rifiutare senza titolo', async () => {
    const res = await request(app)
      .post('/api/articoli')
      .send({ autori: ['Test'], dataPubblicazione: '2024-01-01' });

    expect(res.statusCode).toBe(400);
    expect(res.body.successo).toBe(false);
  });

  // Test 7: Dettaglio articolo con citazioni
  test('GET /api/articoli/:id - Deve restituire articolo con citazioni', async () => {
    const articolo = await Articolo.create(articoloEsempio);
    await Citazione.create({ ...citazioneEsempio, articolo: articolo._id });

    const res = await request(app).get(`/api/articoli/${articolo._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.dati.citazioni).toHaveLength(1);
  });
});

// ==================== TEST CITAZIONI ====================

describe('API Citazioni', () => {

  // Test 8: Creazione citazione
  test('POST /api/citazioni - Deve creare una nuova citazione', async () => {
    const articolo = await Articolo.create(articoloEsempio);

    const res = await request(app)
      .post('/api/citazioni')
      .send({ ...citazioneEsempio, articolo: articolo._id });

    expect(res.statusCode).toBe(201);
    expect(res.body.successo).toBe(true);
    expect(res.body.dati.titoloCitazione).toBe(citazioneEsempio.titoloCitazione);
  });

  // Test 9: Lettura citazioni per articolo
  test('GET /api/citazioni/articolo/:id - Deve restituire le citazioni', async () => {
    const articolo = await Articolo.create(articoloEsempio);
    await Citazione.create({ ...citazioneEsempio, articolo: articolo._id });

    const res = await request(app)
      .get(`/api/citazioni/articolo/${articolo._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.dati).toHaveLength(1);
    expect(res.body.totale).toBe(1);
  });

  // Test 10: Eliminazione citazione
  test('DELETE /api/citazioni/:id - Deve eliminare una citazione', async () => {
    const articolo = await Articolo.create(articoloEsempio);
    const citazione = await Citazione.create({
      ...citazioneEsempio,
      articolo: articolo._id
    });

    const res = await request(app).delete(`/api/citazioni/${citazione._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.successo).toBe(true);
  });
});