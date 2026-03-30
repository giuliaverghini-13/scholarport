# ScholarPort - Gestore di Portfolio Accademico

## Descrizione

ScholarPort è una piattaforma web per ricercatori accademici che permette di gestire il proprio portfolio di pubblicazioni. L'applicazione consente di organizzare articoli, tracciare citazioni e presentare il proprio lavoro in un formato professionale.

## Tecnologie Utilizzate

### Frontend
- React 18 (Single Page Application)
- React Router v6 (navigazione)
- Axios (chiamate HTTP)
- React Toastify (notifiche)
- CSS custom responsive

### Backend
- Node.js con Express.js (API REST)
- MongoDB con Mongoose (database)
- Express Validator (validazione dati)

### Testing
- Jest e Supertest (test backend)
- React Testing Library (test frontend)
- MongoDB Memory Server (database in memoria per i test)

## Prerequisiti

- Node.js (v16 o superiore)
- MongoDB (v6 o superiore) installato in locale
- Visual Studio Code (consigliato)

## Installazione

### 1. Estrarre il file zip e aprire la cartella

### 2. Installare le dipendenze del Backend
```bash
cd backend
npm install
```

### 3. Configurare il Backend

Creare un file `.env` nella cartella `backend/` con:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scholarport
NODE_ENV=development
```

### 4. Installare le dipendenze del Frontend
```bash
cd ../frontend
npm install
```

## Avvio dell'Applicazione

### 1. Avviare MongoDB

Assicurarsi che il servizio MongoDB sia in esecuzione.

### 2. Avviare il Backend
```bash
cd backend
npm run dev
```

Il server partirà su http://localhost:5000

### 3. Avviare il Frontend

In un altro terminale:
```bash
cd frontend
npm start
```

L'app si aprirà su http://localhost:3000

## Esecuzione dei Test

### Test Backend (10 test)
```bash
cd backend
npm test
```

Copre: CRUD articoli, CRUD citazioni, ricerca, filtri, validazione.

### Test Frontend (10 test)
```bash
cd frontend
npm test
```

Copre: rendering componenti, navigazione, ricerca, filtri, azioni utente.

## Struttura del Progetto
```
scholarport/
├── backend/
│   ├── config/
│   │   └── db.js              # Connessione MongoDB
│   ├── models/
│   │   ├── Articolo.js        # Schema articolo
│   │   └── Citazione.js       # Schema citazione
│   ├── routes/
│   │   ├── articoli.js        # API articoli
│   │   └── citazioni.js       # API citazioni
│   ├── test/
│   │   └── api.test.js        # Test backend
│   ├── server.js              # Server Express
│   └── .env                   # Configurazione
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Header.js
│       │   ├── BarraRicerca.js
│       │   ├── CardArticolo.js
│       │   └── PannelloCitazioni.js
│       ├── pages/
│       │   ├── HomePage.js
│       │   ├── ArticoloDettaglio.js
│       │   └── ArticoloForm.js
│       ├── services/
│       │   └── api.js
│       └── styles/
│           └── App.css
└── README.md
```

## API REST

### Articoli

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | /api/articoli | Lista articoli (con filtri e paginazione) |
| GET | /api/articoli/:id | Dettaglio articolo con citazioni |
| POST | /api/articoli | Crea nuovo articolo |
| PUT | /api/articoli/:id | Aggiorna articolo |
| DELETE | /api/articoli/:id | Elimina articolo e citazioni |

### Citazioni

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | /api/citazioni/articolo/:id | Citazioni di un articolo |
| POST | /api/citazioni | Crea nuova citazione |
| PUT | /api/citazioni/:id | Aggiorna citazione |
| DELETE | /api/citazioni/:id | Elimina citazione |

### Parametri di ricerca (GET /api/articoli)

| Parametro | Descrizione |
|-----------|-------------|
| cerca | Ricerca su titolo, autore, abstract |
| autore | Filtra per autore |
| anno | Filtra per anno di pubblicazione |
| pagina | Numero pagina (default: 1) |
| limite | Risultati per pagina (default: 10) |

## Scelte Implementative

- **MongoDB** scelto per la flessibilità con documenti a struttura variabile
- **Architettura separata frontend/backend** per sviluppo indipendente e scalabilità
- **API REST** come interfaccia standard tra client e server
- **React SPA** per navigazione fluida senza ricaricamento pagina
- **Relazione Articolo-Citazione** gestita con ObjectId e riferimenti tra collezioni
