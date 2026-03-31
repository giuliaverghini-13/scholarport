import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

/**
 * Interceptor: aggiunge automaticamente il token JWT
 * a ogni richiesta, se presente nel localStorage.
 * Così non dobbiamo aggiungerlo manualmente ogni volta.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor: se il server risponde 401 (non autorizzato),
 * rimuove il token e ricarica la pagina (torna al login).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('utente');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTENTICAZIONE ====================

export const registrazione = async (dati) => {
  const response = await api.post('/auth/registrazione', dati);
  return response.data;
};

export const login = async (dati) => {
  const response = await api.post('/auth/login', dati);
  return response.data;
};

export const getUtente = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ==================== ARTICOLI ====================

export const getArticoli = async (params = {}) => {
  const response = await api.get('/articoli', { params });
  return response.data;
};

export const getArticolo = async (id) => {
  const response = await api.get(`/articoli/${id}`);
  return response.data;
};

export const creaArticolo = async (dati) => {
  const response = await api.post('/articoli', dati);
  return response.data;
};

export const aggiornaArticolo = async (id, dati) => {
  const response = await api.put(`/articoli/${id}`, dati);
  return response.data;
};

export const eliminaArticolo = async (id) => {
  const response = await api.delete(`/articoli/${id}`);
  return response.data;
};

// ==================== CITAZIONI ====================

export const getCitazioni = async (articoloId) => {
  const response = await api.get(`/citazioni/articolo/${articoloId}`);
  return response.data;
};

export const creaCitazione = async (dati) => {
  const response = await api.post('/citazioni', dati);
  return response.data;
};

export const aggiornaCitazione = async (id, dati) => {
  const response = await api.put(`/citazioni/${id}`, dati);
  return response.data;
};

export const eliminaCitazione = async (id) => {
  const response = await api.delete(`/citazioni/${id}`);
  return response.data;
};