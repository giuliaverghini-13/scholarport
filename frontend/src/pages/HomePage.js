import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticoli, eliminaArticolo } from '../services/api';
import BarraRicerca from '../components/BarraRicerca';
import CardArticolo from '../components/CardArticolo';
import { toast } from 'react-toastify';

function HomePage() {
  const [articoli, setArticoli] = useState([]);
  const [paginazione, setPaginazione] = useState({ totale: 0, pagina: 1, pagine: 1 });
  const [caricamento, setCaricamento] = useState(true);
  const [filtri, setFiltri] = useState({});
  const navigate = useNavigate();

  const caricaArticoli = useCallback(async (nuoviFiltri = {}, pagina = 1) => {
    setCaricamento(true);
    try {
      const parametri = {
        ...nuoviFiltri,
        pagina,
        limite: 10
      };
      Object.keys(parametri).forEach(key => {
        if (!parametri[key]) delete parametri[key];
      });

      const risposta = await getArticoli(parametri);
      setArticoli(risposta.dati);
      setPaginazione(risposta.paginazione);
    } catch (error) {
      toast.error('Errore nel caricamento degli articoli');
      console.error('Errore:', error);
    } finally {
      setCaricamento(false);
    }
  }, []);

  useEffect(() => {
    caricaArticoli();
  }, [caricaArticoli]);

  const handleRicerca = (nuoviFiltri) => {
    setFiltri(nuoviFiltri);
    caricaArticoli(nuoviFiltri, 1);
  };

  const handleElimina = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo articolo? Verranno eliminate anche tutte le citazioni associate.')) {
      try {
        await eliminaArticolo(id);
        toast.success('Articolo eliminato con successo');
        caricaArticoli(filtri, paginazione.pagina);
      } catch (error) {
        toast.error('Errore nell\'eliminazione dell\'articolo');
      }
    }
  };

  const handlePagina = (nuovaPagina) => {
    caricaArticoli(filtri, nuovaPagina);
  };

  // useMemo: memorizza il testo del conteggio, lo ricalcola solo se il totale cambia
  const testoConteggio = useMemo(() => {
    return `${paginazione.totale} ${paginazione.totale === 1 ? 'articolo' : 'articoli'} nel portfolio`;
  }, [paginazione.totale]);

  return (
    <div className="home-page">
      <div className="page-header">
        <div>
          <h2>Il Mio Portfolio Accademico</h2>
          <p className="subtitle">{testoConteggio}</p>
        </div>
      </div>

      <BarraRicerca onRicerca={handleRicerca} />

      {caricamento ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Caricamento articoli...</p>
        </div>
      ) : articoli.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📄</span>
          <h3>Nessun articolo trovato</h3>
          <p>
            {Object.keys(filtri).length > 0
              ? 'Prova a modificare i filtri di ricerca.'
              : 'Inizia aggiungendo il tuo primo articolo accademico.'}
          </p>
          {Object.keys(filtri).length === 0 && (
            <button className="btn btn-primary" onClick={() => navigate('/nuovo')}>
              Aggiungi Articolo
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="articoli-grid">
            {articoli.map((articolo) => (
              <CardArticolo
                key={articolo._id}
                articolo={articolo}
                onElimina={handleElimina}
              />
            ))}
          </div>

          {paginazione.pagine > 1 && (
            <div className="paginazione">
              <button
                className="btn btn-secondary btn-sm"
                disabled={paginazione.pagina <= 1}
                onClick={() => handlePagina(paginazione.pagina - 1)}
              >
                ← Precedente
              </button>
              <span className="pagina-info">
                Pagina {paginazione.pagina} di {paginazione.pagine}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={paginazione.pagina >= paginazione.pagine}
                onClick={() => handlePagina(paginazione.pagina + 1)}
              >
                Successiva →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;