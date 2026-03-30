const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Articolo = require('./models/Articolo');
const Citazione = require('./models/Citazione');
const Utente = require('./models/Utente');

const articoliDemo = [
  {
    titolo: 'Deep Learning per il Riconoscimento di Immagini Mediche',
    autori: ['Marco Bianchi', 'Laura Verdi'],
    abstract: 'Questo studio presenta un approccio basato su reti neurali convoluzionali per il riconoscimento automatico di patologie in immagini radiografiche. I risultati mostrano una precisione del 94.7% nella classificazione di tumori polmonari.',
    dataPubblicazione: '2024-01-15',
    doi: '10.1234/deepmed.2024.001'
  },
  {
    titolo: 'Analisi del Sentiment nei Social Media durante le Elezioni Europee',
    autori: ['Giuseppe Rossi', 'Anna Colombo', 'Federico Ricci'],
    abstract: 'Lo studio analizza oltre 2 milioni di tweet relativi alle elezioni europee del 2024, utilizzando tecniche di NLP per identificare trend di opinione pubblica e polarizzazione del dibattito politico online.',
    dataPubblicazione: '2024-03-22',
    doi: '10.1234/sentiment.2024.002'
  },
  {
    titolo: 'Blockchain e Tracciabilità nella Filiera Agroalimentare Italiana',
    autori: ['Sofia Marchetti', 'Roberto Ferrari'],
    abstract: 'Proponiamo un framework basato su blockchain per garantire la tracciabilità dei prodotti DOP e IGP italiani, dalla produzione al consumatore finale. Il sistema è stato testato con successo su tre filiere in Emilia-Romagna.',
    dataPubblicazione: '2023-11-08',
    doi: '10.1234/blockchain.2023.003'
  },
  {
    titolo: 'Impatto dei Cambiamenti Climatici sulla Biodiversità Marina del Mediterraneo',
    autori: ['Elena Moretti', 'Luca Conti', 'Maria Greco'],
    abstract: 'Una ricerca decennale che documenta le variazioni nella biodiversità marina del Mediterraneo centrale, evidenziando la migrazione di specie tropicali e la riduzione delle popolazioni autoctone.',
    dataPubblicazione: '2024-06-10',
    doi: '10.1234/climate.2024.004'
  },
  {
    titolo: 'Ottimizzazione degli Algoritmi di Routing per Reti 5G',
    autori: ['Alessandro Russo', 'Chiara Fontana'],
    abstract: 'Presentiamo un nuovo algoritmo di routing adattivo per reti 5G che riduce la latenza del 35% rispetto agli approcci tradizionali, mantenendo un throughput elevato anche in condizioni di carico intenso.',
    dataPubblicazione: '2023-09-14',
    doi: '10.1234/routing.2023.005'
  }
];

const citazioniDemo = [
  {
    indiceArticolo: 0,
    autoriCitazione: 'Zhang W., Chen L.',
    titoloCitazione: 'A Survey on AI Applications in Medical Imaging',
    annoCitazione: 2024,
    fonte: 'IEEE Transactions on Medical Imaging',
    doi: '10.5678/ieee.2024.101'
  },
  {
    indiceArticolo: 0,
    autoriCitazione: 'Patel R., Singh A.',
    titoloCitazione: 'Comparative Study of CNN Architectures for Lung Cancer Detection',
    annoCitazione: 2024,
    fonte: 'Nature Medicine',
    doi: '10.5678/nature.2024.102'
  },
  {
    indiceArticolo: 0,
    autoriCitazione: 'Kim S., Park J.',
    titoloCitazione: 'Transfer Learning in Radiology: Current State and Future Directions',
    annoCitazione: 2025,
    fonte: 'Artificial Intelligence in Medicine'
  },
  {
    indiceArticolo: 1,
    autoriCitazione: 'Mueller T., Weber K.',
    titoloCitazione: 'Political Polarization in European Digital Spaces',
    annoCitazione: 2024,
    fonte: 'Journal of Political Communication',
    doi: '10.5678/polcom.2024.201'
  },
  {
    indiceArticolo: 1,
    autoriCitazione: 'Lopez M., Garcia P.',
    titoloCitazione: 'NLP Methods for Social Media Analysis: A Review',
    annoCitazione: 2025,
    fonte: 'Computational Linguistics'
  },
  {
    indiceArticolo: 2,
    autoriCitazione: 'Anderson J., Brown M.',
    titoloCitazione: 'Blockchain for Food Safety: Lessons from Europe',
    annoCitazione: 2024,
    fonte: 'Food Control',
    doi: '10.5678/food.2024.301'
  },
  {
    indiceArticolo: 3,
    autoriCitazione: 'Thompson R., Davis S.',
    titoloCitazione: 'Mediterranean Ecosystem Changes Under Climate Pressure',
    annoCitazione: 2025,
    fonte: 'Marine Ecology Progress Series',
    doi: '10.5678/marine.2025.401'
  },
  {
    indiceArticolo: 3,
    autoriCitazione: 'Nakamura Y., Tanaka H.',
    titoloCitazione: 'Global Patterns of Marine Species Migration',
    annoCitazione: 2024,
    fonte: 'Science'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connesso');

    // Cerca il tuo utente nel database
    const utente = await Utente.findOne({ email: 'giulia_verghini_13@libero.it' });

    if (!utente) {
      console.log('Utente non trovato! Registrati prima nel sito, poi esegui di nuovo questo script.');
      process.exit(1);
    }

    console.log(`Utente trovato: ${utente.username}`);

    // Pulisce solo articoli e citazioni (NON gli utenti)
    await Articolo.deleteMany({});
    await Citazione.deleteMany({});
    console.log('Articoli e citazioni puliti');

    // Inserisce gli articoli collegati al tuo utente
    const articoliConUtente = articoliDemo.map(art => ({
      ...art,
      utente: utente._id
    }));

    const articoliCreati = await Articolo.insertMany(articoliConUtente);
    console.log(`${articoliCreati.length} articoli inseriti`);

    // Inserisce le citazioni
    const citazioniDaInserire = citazioniDemo.map(cit => ({
      articolo: articoliCreati[cit.indiceArticolo]._id,
      autoriCitazione: cit.autoriCitazione,
      titoloCitazione: cit.titoloCitazione,
      annoCitazione: cit.annoCitazione,
      fonte: cit.fonte,
      doi: cit.doi
    }));

    const citazioniCreate = await Citazione.insertMany(citazioniDaInserire);
    console.log(`${citazioniCreate.length} citazioni inserite`);

    console.log('\nDati demo caricati con successo per ' + utente.username + '!');
    process.exit(0);
  } catch (error) {
    console.error('Errore:', error.message);
    process.exit(1);
  }
};

seedDB();
