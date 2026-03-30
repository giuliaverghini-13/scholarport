// Importa mongoose
const mongoose = require('mongoose');

// Definisce la struttura di una Citazione
const CitazioneSchema = new mongoose.Schema({
  // Riferimento all'articolo che riceve la citazione
  articolo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Articolo',
    required: [true, 'L\'articolo di riferimento è obbligatorio']
  },
  autoriCitazione: {
    type: String,
    required: [true, 'Gli autori della citazione sono obbligatori'],
    trim: true
  },
  titoloCitazione: {
    type: String,
    required: [true, 'Il titolo della citazione è obbligatorio'],
    trim: true
  },
  annoCitazione: {
    type: Number,
    required: [true, 'L\'anno della citazione è obbligatorio']
  },
  fonte: {
    type: String,
    trim: true
  },
  doi: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Citazione', CitazioneSchema);
