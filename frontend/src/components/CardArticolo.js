import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CardArticolo({ articolo, onElimina }) {
  const { utente, isAutenticato } = useAuth();

  // Controlla se l'utente autenticato è il proprietario dell'articolo
  const isProprietario = isAutenticato && utente &&
    articolo.utente && (
      articolo.utente._id === utente.id ||
      articolo.utente === utente.id
    );

  const formattaData = (data) => {
    return new Date(data).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const troncaTesto = (testo, maxLength = 200) => {
    if (!testo || testo.length <= maxLength) return testo;
    return testo.substring(0, maxLength) + '...';
  };

  return (
    <div className="card-articolo">
      <div className="card-body">
        <div className="card-top-row">
          <Link to={`/articolo/${articolo._id}`} className="card-titolo">
            <h3>{articolo.titolo}</h3>
          </Link>
          {articolo.numeroCitazioni > 0 && (
            <span className="badge-citazioni">
              {articolo.numeroCitazioni} {articolo.numeroCitazioni === 1 ? 'citazione' : 'citazioni'}
            </span>
          )}
        </div>

        <p className="card-autori">
          {articolo.autori.join(', ')}
        </p>

        <p className="card-data">
          📅 {formattaData(articolo.dataPubblicazione)}
        </p>

        {articolo.abstract && (
          <p className="card-abstract">{troncaTesto(articolo.abstract)}</p>
        )}

        {articolo.doi && (
          <p className="card-doi">
            <span className="doi-label">DOI:</span> {articolo.doi}
          </p>
        )}
      </div>

      {isProprietario && (
        <div className="card-actions">
          <Link to={`/modifica/${articolo._id}`} className="btn btn-secondary btn-sm">
            ✏️ Modifica
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onElimina(articolo._id)}
          >
            🗑️ Elimina
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(CardArticolo);