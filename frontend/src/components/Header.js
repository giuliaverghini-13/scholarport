import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { utente, isAutenticato, effettuaLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    effettuaLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 8C5 6 6.5 4.5 8.5 4.5H14C16 4.5 17.5 5.5 18 7.5C18.5 5.5 20 4.5 22 4.5H27.5C29.5 4.5 31 6 31 8V14C31 16.5 29 18.5 27 19.5L19.5 23.5C18.5 24 17.5 24 16.5 23.5L9 19.5C7 18.5 5 16.5 5 14V8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="10" y="17.5" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="white" letterSpacing="1">SP</text>
            <path d="M18 24V31" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 28.5H24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h1>ScholarPort</h1>
        </Link>
        <nav>
          <Link to="/" className="nav-link">Portfolio</Link>
          {isAutenticato ? (
            <>
              <Link to="/nuovo" className="btn btn-primary">+ Nuovo Articolo</Link>
              <div className="user-info">
                <span className="username-badge">{utente.username}</span>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">Esci</button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Accedi</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;