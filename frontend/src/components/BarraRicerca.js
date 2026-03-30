import React, { useState } from 'react';

function BarraRicerca({ onRicerca }) {
  const [cerca, setCerca] = useState('');
  const [autore, setAutore] = useState('');
  const [anno, setAnno] = useState('');
  const [filtriAperti, setFiltriAperti] = useState(false);

  // Gestisce l'invio del form di ricerca
  const handleSubmit = (e) => {
    e.preventDefault();
    onRicerca({ cerca, autore, anno });
  };

  // Reset di tutti i filtri
  const handleReset = () => {
    setCerca('');
    setAutore('');
    setAnno('');
    onRicerca({});
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-main">
          <input
            type="text"
            placeholder="Cerca articoli per titolo, autore o parola chiave..."
            value={cerca}
            onChange={(e) => setCerca(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Cerca</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFiltriAperti(!filtriAperti)}
          >
            {filtriAperti ? 'Nascondi Filtri' : 'Filtri'}
          </button>
        </div>

        {filtriAperti && (
          <div className="search-filters">
            <div className="filter-group">
              <label>Autore</label>
              <input
                type="text"
                placeholder="Nome autore..."
                value={autore}
                onChange={(e) => setAutore(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Anno</label>
              <input
                type="number"
                placeholder="es. 2024"
                value={anno}
                onChange={(e) => setAnno(e.target.value)}
                min="1900"
                max="2099"
              />
            </div>
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              Cancella filtri
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default BarraRicerca;