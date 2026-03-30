const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UtenteSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Lo username è obbligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'Lo username deve avere almeno 3 caratteri'],
    maxlength: [30, 'Lo username non può superare i 30 caratteri']
  },
  email: {
    type: String,
    required: [true, 'L\'email è obbligatoria'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Inserire un\'email valida']
  },
  password: {
    type: String,
    required: [true, 'La password è obbligatoria'],
    minlength: [6, 'La password deve avere almeno 6 caratteri']
  }
}, {
  timestamps: true
});

// Cripta la password prima di salvarla
UtenteSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Metodo per verificare la password al login
UtenteSchema.methods.confrontaPassword = async function(passwordInserita) {
  return await bcrypt.compare(passwordInserita, this.password);
};

module.exports = mongoose.model('Utente', UtenteSchema);