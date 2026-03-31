import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ArticoloDettaglio from './pages/ArticoloDettaglio';
import ArticoloForm from './pages/ArticoloForm';
import LoginPage from './pages/LoginPage';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/articolo/:id" element={<ArticoloDettaglio />} />
              <Route path="/nuovo" element={<ArticoloForm />} />
              <Route path="/modifica/:id" element={<ArticoloForm />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;