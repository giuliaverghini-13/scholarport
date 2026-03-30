import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { creaArticolo, getArticolo, aggiornaArticolo } from '../services/api';
import { toast } from 'react-toastify';

function ArticoloForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isModifica = Boolean(id);

  const [formDati, setFormDati] = useState({
    titolo: '',
    autori: [''],
    abstract: '',
    dataPubblicazione: '',
    doi: ''
  });

  const [caricamento, setCaricamento] = useState(false);
  const [invio, setInvio] = useState(false);

  useEffect(() => {
    if (isModifica) {
      const caricaDati = async () => {
        setCaricamento(true);
        try {
          const risposta = await getArticolo(id);
          const art = risposta.dati;

          setFormDati({
            titolo: art.titolo || '',
            autori: art.autori && art.autori.length > 0 ? art.autori : [''],
            abstract: art.abstract || '',
            dataPubblicazione: art.dataPubblicazione
              ? new Date(art.dataPubblicazione).toISOString().split('T')[0]
              : '',
            doi: art.doi || ''
          });
        } catch (error) {
          toast.error("Errore nel caricamento dell'articolo");
          navigate('/');
        } finally {
          setCaricamento(false);
        }
      };

      caricaDati();
    }
  }, [id, isModifica, navigate]);

  const handleChange = (e) => {
    setFormDati({
      ...formDati,
      [e.target.name]: e.target.value
    });
  };

  const handleAutoreChange = (index, valore) => {
    const nuoviAutori = [...formDati.autori];
    nuoviAutori[index] = valore;

    setFormDati({
      ...formDati,
      autori: nuoviAutori
    });
  };

  const aggiungiAutore = () => {
    setFormDati({
      ...formDati,
      autori: [...formDati.autori, '']
    });
  };

  const rimuoviAutore = (index) => {
    if (formDati.autori.length > 1) {
      const nuoviAutori = formDati.autori.filter((_, i) => i !== index);
      setFormDati({
        ...formDati,
        autori: nuoviAutori
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInvio(true);

    try {
      const datiPuliti = {
        ...formDati,
        autori: formDati.autori.filter((a) => a.trim() !== '')
      };

      if (datiPuliti.autori.length === 0) {
        toast.error('Inserire almeno un autore');
        setInvio(false);
        return;
      }

      if (isModifica) {
        await aggiornaArticolo(id, datiPuliti);
        toast.success('Articolo aggiornato con successo!');
        navigate(`/articolo/${id}`);
      } else {
        const risposta = await creaArticolo(datiPuliti);
        toast.success('Articolo creato con successo!');
        navigate(`/articolo/${risposta.dati._id}`);
      }
    } catch (error) {
      const messaggio =
        error.response?.data?.errore || 'Errore nel salvataggio';
      toast.error(messaggio);
    } finally {
      setInvio(false);
    }
  };

  if (caricamento) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="breadcrumb">
        <Link to="/">Portfolio</Link> /{' '}
        <span>{isModifica ? 'Modifica Articolo' : 'Nuovo Articolo'}</span>
      </div>

      <div className="form-container">
        <h2>{isModifica ? 'Modifica Articolo' : 'Nuovo Articolo'}</h2>
        <p className="form-subtitle">
          {isModifica
            ? "Modifica i dati dell'articolo accademico."
            : 'Inserisci i dati del nuovo articolo accademico.'}
        </p>

        <form onSubmit={handleSubmit} className="articolo-form">
          <div className="form-group">
            <label htmlFor="titolo">Titolo *</label>
            <input
              type="text"
              id="titolo"
              name="titolo"
              value={formDati.titolo}
              onChange={handleChange}
              placeholder="Inserisci il titolo dell'articolo"
              required
            />
          </div>

          <div className="form-group">
            <label>Autori *</label>

            {formDati.autori.map((autore, index) => (
              <div key={index} className="autore-input-row">
                <input
                  type="text"
                  value={autore}
                  onChange={(e) => handleAutoreChange(index, e.target.value)}
                  placeholder={`Autore ${index + 1}`}
                  required={index === 0}
                />

                {formDati.autori.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => rimuoviAutore(index)}
                    title="Rimuovi autore"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={aggiungiAutore}
            >
              + Aggiungi autore
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="abstract">Abstract</label>
            <textarea
              id="abstract"
              name="abstract"
              value={formDati.abstract}
              onChange={handleChange}
              placeholder="Inserisci l'abstract dell'articolo..."
              rows="6"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dataPubblicazione">Data di Pubblicazione *</label>
              <input
                type="date"
                id="dataPubblicazione"
                name="dataPubblicazione"
                value={formDati.dataPubblicazione}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="doi">DOI</label>
              <input
                type="text"
                id="doi"
                name="doi"
                value={formDati.doi}
                onChange={handleChange}
                placeholder="es. 10.1234/esempio.2024"
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-secondary">
              Annulla
            </Link>

            <button type="submit" className="btn btn-primary" disabled={invio}>
              {invio
                ? isModifica
                  ? 'Aggiornamento...'
                  : 'Creazione...'
                : isModifica
                ? 'Aggiorna Articolo'
                : 'Crea Articolo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ArticoloForm;