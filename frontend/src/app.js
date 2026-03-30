import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ArticoloDettaglio from './pages/ArticoloDettaglio';
import ArticoloForm from './pages/ArticoloForm';
import LoginPage from './pages/LoginPage';
import './styles/App.css';

/**
 * AppContent - Contenuto dell'app che usa il context.
 * Separato da App perché useAuth() può essere usato
 * solo dentro un AuthProvider.
 */
function AppContent() {
  const { isAutenticato, caricamento } = useAuth();

  if (caricamento) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!isAutenticato) {
    return (
      <div className="app">
        <LoginPage />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articolo/:id" element={<ArticoloDettaglio />} />
            <Route path="/nuovo" element={<ArticoloForm />} />
            <Route path="/modifica/:id" element={<ArticoloForm />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

/**
 * App - Componente root che avvolge tutto con l'AuthProvider.
 * L'AuthProvider rende i dati di autenticazione disponibili
 * a tutti i componenti figli tramite useContext.
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;