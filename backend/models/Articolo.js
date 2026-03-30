// Importa mongoose per definire lo schema dei dati
const mongoose = require('mongoose');

// Definisce la struttura di un Articolo Accademico
const ArticoloSchema = new mongoose.Schema({
  titolo: {
    type: String,
    required: [true, 'Il titolo è obbligatorio'],
    trim: true,
    maxlength: [500, 'Il titolo non può superare i 500 caratteri']
  },
  autori: {
    type: [String],
    required: [true, 'Almeno un autore è obbligatorio'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Inserire almeno un autore'
    }
  },
  abstract: {
    type: String,
    trim: true,
    maxlength: [5000, 'L\'abstract non può superare i 5000 caratteri']
  },
  dataPubblicazione: {
    type: Date,
    required: [true, 'La data di pubblicazione è obbligatoria']
  },
  doi: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: collega le citazioni a questo articolo senza salvarle qui dentro
ArticoloSchema.virtual('citazioni', {
  ref: 'Citazione',
  localField: '_id',
  foreignField: 'articolo'
});

// Esporta il modello per usarlo nelle route API
module.exports = mongoose.model('Articolo', ArticoloSchema);