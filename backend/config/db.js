// Importa la libreria mongoose per comunicare con MongoDB
const mongoose = require('mongoose');

// Funzione asincrona che si connette al database
const connectDB = async () => {
  try {
    // Tenta la connessione usando l'URL dal file .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connesso: ${conn.connection.host}`);
  } catch (error) {
    // Se la connessione fallisce, mostra l'errore e chiude l'app
    console.error(`Errore connessione MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Esporta la funzione così altri file possono usarla
module.exports = connectDB;