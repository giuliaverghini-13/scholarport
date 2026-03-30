# ScholarPort - Gestore di Portfolio Accademico

## Descrizione

ScholarPort è una piattaforma web full-stack per ricercatori accademici che permette di gestire il proprio portfolio di pubblicazioni. L'applicazione consente di organizzare articoli, tracciare citazioni, effettuare ricerche avanzate e presentare il proprio lavoro in un formato professionale. Include un sistema di autenticazione per proteggere i dati di ogni utente.

## Tecnologie Utilizzate (Stack MERN)

### Frontend
- React 18 (Single Page Application)
- React Router v6 (navigazione client-side)
- Context API / useContext (gestione stato globale autenticazione)
- Axios con interceptors (chiamate HTTP + gestione automatica token JWT)
- React Toastify (notifiche)
- CSS custom responsive con variabili CSS e dark mode

### Backend
- Node.js con Express.js (API REST)
- MongoDB con Mongoose (database NoSQL)
- JWT - JSON Web Token (autenticazione)
- bcryptjs (crittografia password)
- Express Validator (validazione dati)

### Testing
- Jest e Supertest (test backend API)
- React Testing Library (test frontend componenti)
- MongoDB Memory Server (database in memoria per i test)

## Funzionalità

- Autenticazione utente (registrazione, login, logout) con JWT
- CRUD completo articoli accademici (titolo, autori, abstract, data, DOI)
- CRUD completo citazioni associate agli articoli
- Ricerca testuale su titolo, autore e abstract
- Filtri avanzati per autore e anno di pubblicazione
- Paginazione dei risultati
- Contatore citazioni visibile nelle card
- Layout responsive (desktop, tablet, mobile)
- Dark mode con design moderno
- Dati protetti per utente (ogni utente vede solo i propri articoli)

## React Hooks Utilizzati

- **useState**: gestione dello stato locale dei componenti
- **useEffect**: caricamento dati al montaggio e side effects
- **useCallback**: memorizzazione delle funzioni per ottimizzare le performance
- **useMemo**: memorizzazione dei risultati di calcoli
- **useContext**: stato globale per l'autenticazione (evita il Prop Drilling)
- **React.memo**: prevenzione re-render inutili dei componenti

## Prerequisiti

- Node.js (v16 o superiore)
- MongoDB (v6 o superiore) installato in locale
- Visual Studio Code (consigliato)

## Installazione

### 1. Clonare il repository
```bash
git clone https://github.com/giuliaverghini-13/scholarport.git
cd scholarport
```

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
JWT_SECRET=scholarport_secret_key_2024_molto_sicura
```

### 4. Installare le dipendenze del Frontend
```bash
cd ../frontend
npm install
```

## Avvio dell'Applicazione

### 1. Assicurarsi che MongoDB sia in esecuzione

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

### 4. Caricare i dati demo (opzionale)

Prima registrarsi nel sito, poi:
```bash
cd backend
npm run seed
```

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
│   │   └── db.js                    # Configurazione connessione MongoDB
│   ├── middleware/
│   │   └── auth.js                  # Middleware verifica token JWT
│   ├── models/
│   │   ├── Articolo.js              # Schema Mongoose articolo
│   │   ├── Citazione.js             # Schema Mongoose citazione
│   │   └── Utente.js                # Schema Mongoose utente con bcrypt
│   ├── routes/
│   │   ├── articoli.js              # API REST articoli (protette)
│   │   ├── citazioni.js             # API REST citazioni
│   │   └── auth.js                  # API REST autenticazione
│   ├── test/
│   │   └── api.test.js              # 10 test funzionali backend
│   ├── server.js                    # Entry point server Express
│   ├── seed.js                      # Script caricamento dati demo
│   ├── .env                         # Variabili d'ambiente
│   ├── package.json                 # Dipendenze backend
│   └── package-lock.json
├── frontend/
│   ├── public/
│   │   └── index.html               # Template HTML principale
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js            # Navigazione con useAuth()
│   │   │   ├── BarraRicerca.js      # Ricerca e filtri avanzati
│   │   │   ├── CardArticolo.js      # Card articolo con React.memo
│   │   │   ├── PannelloCitazioni.js # CRUD citazioni con modifica
│   │   │   └── __tests__/
│   │   │       └── components.test.js # 10 test funzionali frontend
│   │   ├── context/
│   │   │   └── AuthContext.js       # Context API per autenticazione
│   │   ├── pages/
│   │   │   ├── HomePage.js          # Lista articoli con useMemo/useCallback
│   │   │   ├── ArticoloDettaglio.js # Dettaglio con pannello citazioni
│   │   │   ├── ArticoloForm.js      # Form creazione/modifica articolo
│   │   │   └── LoginPage.js         # Login e registrazione
│   │   ├── services/
│   │   │   └── api.js               # Chiamate API con interceptors JWT
│   │   ├── styles/
│   │   │   └── App.css              # Stili dark mode responsive
│   │   ├── App.js                   # Root component con AuthProvider
│   │   ├── index.js                 # Entry point React
│   │   └── setupTests.js            # Configurazione test
│   ├── package.json                 # Dipendenze frontend
│   └── package-lock.json
├── .gitignore                       # File/cartelle escluse da Git
└── README.md                        # Documentazione del progetto
```

## API REST

### Autenticazione

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | /api/auth/registrazione | Registra un nuovo utente |
| POST | /api/auth/login | Effettua il login |
| GET | /api/auth/me | Dati utente autenticato |

### Articoli (protette da JWT)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | /api/articoli | Lista articoli con filtri e paginazione |
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

## Architettura e Scelte Implementative

### Perché MongoDB?
MongoDB è stato scelto per la flessibilità nella gestione di documenti con struttura variabile (es. numero di autori diverso per ogni articolo) e per la naturale integrazione con Node.js tramite Mongoose (ODM).

### Autenticazione JWT
Il sistema utilizza JSON Web Token per l'autenticazione stateless. Il token viene generato al login, salvato nel localStorage del browser e inviato automaticamente con ogni richiesta tramite gli interceptors di Axios.

### Context API (useContext)
L'autenticazione è gestita tramite React Context API per evitare il Prop Drilling. Il componente AuthProvider avvolge l'intera applicazione e rende i dati dell'utente accessibili da qualsiasi componente tramite l'hook personalizzato useAuth().

### Ottimizzazione Performance
- React.memo su CardArticolo per evitare re-render inutili
- useCallback per memorizzare le funzioni di caricamento dati
- useMemo per memorizzare calcoli derivati dallo stato

### Sicurezza
- Password criptate con bcrypt (salt rounds: 10)
- Token JWT con scadenza a 7 giorni
- Ogni utente può vedere e modificare solo i propri articoli
- Validazione server-side di tutti gli input