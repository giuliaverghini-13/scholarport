import React, { useState } from 'react';
import { login, registrazione } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function LoginPage() {
  // Usa il context invece di ricevere onLogin come prop
  const { effettuaLogin } = useAuth();
  const [isRegistrazione, setIsRegistrazione] = useState(false);
  const [formDati, setFormDati] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [caricamento, setCaricamento] = useState(false);

  const handleChange = (e) => {
    setFormDati({ ...formDati, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCaricamento(true);

    try {
      let risposta;

      if (isRegistrazione) {
        risposta = await registrazione(formDati);
        toast.success('Registrazione completata! Benvenuto!');
      } else {
        risposta = await login({
          email: formDati.email,
          password: formDati.password
        });
        toast.success('Login effettuato!');
      }

      // Usa il context per salvare i dati
      effettuaLogin(risposta.dati.utente, risposta.dati.token);
    } catch (error) {
      const messaggio = error.response?.data?.errore || 'Errore durante l\'autenticazione';
      toast.error(messaggio);
    } finally {
      setCaricamento(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 8C5 6 6.5 4.5 8.5 4.5H14C16 4.5 17.5 5.5 18 7.5C18.5 5.5 20 4.5 22 4.5H27.5C29.5 4.5 31 6 31 8V14C31 16.5 29 18.5 27 19.5L19.5 23.5C18.5 24 17.5 24 16.5 23.5L9 19.5C7 18.5 5 16.5 5 14V8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="10" y="17.5" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="white" letterSpacing="1">SP</text>
            <path d="M18 24V31" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 28.5H24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h1>ScholarPort</h1>
          <p>{isRegistrazione ? 'Crea il tuo account' : 'Accedi al tuo portfolio'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegistrazione && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formDati.username}
                onChange={handleChange}
                placeholder="Scegli uno username"
                required
                minLength={3}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formDati.email}
              onChange={handleChange}
              placeholder="La tua email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formDati.password}
              onChange={handleChange}
              placeholder={isRegistrazione ? 'Minimo 6 caratteri' : 'La tua password'}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={caricamento}>
            {caricamento
              ? 'Caricamento...'
              : isRegistrazione ? 'Registrati' : 'Accedi'}
          </button>
        </form>

        <div className="login-switch">
          {isRegistrazione ? (
            <p>
              Hai già un account?{' '}
              <button onClick={() => setIsRegistrazione(false)} className="link-btn">
                Accedi
              </button>
            </p>
          ) : (
            <p>
              Non hai un account?{' '}
              <button onClick={() => setIsRegistrazione(true)} className="link-btn">
                Registrati
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;