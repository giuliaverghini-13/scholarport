/**
 * AuthContext - Context per la gestione dell'autenticazione.
 * 
 * Utilizza useContext (Context API) per rendere i dati dell'utente
 * accessibili da qualsiasi componente senza dover passare le props
 * manualmente attraverso ogni livello (evita il "Prop Drilling").
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Crea il Context (il "contenitore" globale)
const AuthContext = createContext(null);

/**
 * 2. Il Provider: avvolge l'app e fornisce i dati a tutti i figli.
 * Gestisce: login, logout, registrazione, stato utente.
 */
export function AuthProvider({ children }) {
  const [utente, setUtente] = useState(null);
  const [token, setToken] = useState(null);
  const [caricamento, setCaricamento] = useState(true);

  // Al montaggio, controlla se c'è una sessione salvata
  useEffect(() => {
    const tokenSalvato = localStorage.getItem('token');
    const utenteSalvato = localStorage.getItem('utente');

    if (tokenSalvato && utenteSalvato) {
      setToken(tokenSalvato);
      setUtente(JSON.parse(utenteSalvato));
    }
    setCaricamento(false);
  }, []);

  // Funzione di login: salva token e utente
  const effettuaLogin = (datiUtente, tokenRicevuto) => {
    localStorage.setItem('token', tokenRicevuto);
    localStorage.setItem('utente', JSON.stringify(datiUtente));
    setToken(tokenRicevuto);
    setUtente(datiUtente);
  };

  // Funzione di logout: pulisce tutto
  const effettuaLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utente');
    setToken(null);
    setUtente(null);
  };

  // Controlla se l'utente è autenticato
  const isAutenticato = Boolean(utente && token);

  // Il "value" è quello che tutti i componenti figli potranno leggere
  return (
    <AuthContext.Provider value={{
      utente,
      token,
      isAutenticato,
      caricamento,
      effettuaLogin,
      effettuaLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 3. Hook personalizzato: semplifica l'accesso al context.
 * Invece di scrivere useContext(AuthContext) ovunque,
 * basta scrivere useAuth().
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato dentro un AuthProvider');
  }
  return context;
}
