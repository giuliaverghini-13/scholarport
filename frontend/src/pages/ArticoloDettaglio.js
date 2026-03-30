import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticolo, eliminaArticolo } from '../services/api';
import PannelloCitazioni from '../components/PannelloCitazioni';
import { toast } from 'react-toastify';

function ArticoloDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articolo, setArticolo] = useState(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  // Carica l'articolo dal backend
  const caricaArticolo = useCallback(async () => {
    try {
      setCaricamento(true);
      const risposta = await getArticolo(id);
      setArticolo(risposta.dati);
      setErrore(null);
    } catch (error) {
      setErrore('Articolo non trovato');
      toast.error('Errore nel caricamento dell\'articolo');
    } finally {
      setCaricamento(false);
    }
  }, [id]);

  useEffect(() => {
    caricaArticolo();
  }, [caricaArticolo]);

  // Gestisce l'eliminazione
  const handleElimina = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questo articolo e tutte le sue citazioni?')) {
      try {
        await eliminaArticolo(id);
        toast.success('Articolo eliminato con successo');
        navigate('/');
      } catch (error) {
        toast.error('Errore nell\'eliminazione');
      }
    }
  };

  // Formatta la data in formato esteso italiano
  const formattaData = (data) => {
    return new Date(data).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (caricamento) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Caricamento articolo...</p>
      </div>
    );
  }

  if (errore) {
    return (
      <div className="error-state">
        <h3>{errore}</h3>
        <Link to="/" className="btn btn-primary">Torna al Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="dettaglio-page">
      <div className="breadcrumb">
        <Link to="/">Portfolio</Link> / <span>{articolo.titolo}</span>
      </div>

      <div className="dettaglio-container">
        <article className="dettaglio-articolo">
          <h2 className="dettaglio-titolo">{articolo.titolo}</h2>

          <div className="dettaglio-autori">
            <strong>Autori:</strong>
            <div className="autori-tags">
              {articolo.autori.map((autore, index) => (
                <span key={index} className="autore-tag">{autore}</span>
              ))}
            </div>
          </div>

          <div className="dettaglio-meta">
            <p><strong>Data di pubblicazione:</strong> {formattaData(articolo.dataPubblicazione)}</p>
            {articolo.doi && (
              <p><strong>DOI:</strong> <span className="doi-value">{articolo.doi}</span></p>
            )}
          </div>

          {articolo.abstract && (
            <div className="dettaglio-abstract">
              <h3>Abstract</h3>
              <p>{articolo.abstract}</p>
            </div>
          )}

          <div className="dettaglio-actions">
            <Link to={`/modifica/${articolo._id}`} className="btn btn-secondary">
              ✏️ Modifica Articolo
            </Link>
            <button className="btn btn-danger" onClick={handleElimina}>
              🗑️ Elimina Articolo
            </button>
          </div>
        </article>

        <PannelloCitazioni
          articoloId={articolo._id}
          citazioni={articolo.citazioni || []}
          onAggiorna={caricaArticolo}
        />
      </div>
    </div>
  );
}

export default ArticoloDettaglio;
