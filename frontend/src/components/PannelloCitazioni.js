import React, { useState } from 'react';
import { creaCitazione, eliminaCitazione, aggiornaCitazione } from '../services/api';
import { toast } from 'react-toastify';

function PannelloCitazioni({ articoloId, citazioni, isProprietario, onAggiorna }) {
  const [mostraForm, setMostraForm] = useState(false);
  const [modificaId, setModificaId] = useState(null);
  const [formDati, setFormDati] = useState({
    autoriCitazione: '',
    titoloCitazione: '',
    annoCitazione: '',
    fonte: '',
    doi: ''
  });

  const handleChange = (e) => {
    setFormDati({ ...formDati, [e.target.name]: e.target.value });
  };

  const apriFormNuovo = () => {
    setModificaId(null);
    setFormDati({
      autoriCitazione: '',
      titoloCitazione: '',
      annoCitazione: '',
      fonte: '',
      doi: ''
    });
    setMostraForm(true);
  };

  const apriFormModifica = (citazione) => {
    setModificaId(citazione._id);
    setFormDati({
      autoriCitazione: citazione.autoriCitazione,
      titoloCitazione: citazione.titoloCitazione,
      annoCitazione: citazione.annoCitazione.toString(),
      fonte: citazione.fonte || '',
      doi: citazione.doi || ''
    });
    setMostraForm(true);
  };

  const chiudiForm = () => {
    setMostraForm(false);
    setModificaId(null);
    setFormDati({
      autoriCitazione: '',
      titoloCitazione: '',
      annoCitazione: '',
      fonte: '',
      doi: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modificaId) {
        await aggiornaCitazione(modificaId, {
          ...formDati,
          annoCitazione: parseInt(formDati.annoCitazione)
        });
        toast.success('Citazione aggiornata con successo!');
      } else {
        await creaCitazione({
          ...formDati,
          articolo: articoloId,
          annoCitazione: parseInt(formDati.annoCitazione)
        });
        toast.success('Citazione aggiunta con successo!');
      }
      chiudiForm();
      onAggiorna();
    } catch (error) {
      toast.error(modificaId ? 'Errore nell\'aggiornamento' : 'Errore nell\'aggiungere la citazione');
    }
  };

  const handleElimina = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa citazione?')) {
      try {
        await eliminaCitazione(id);
        toast.success('Citazione eliminata');
        onAggiorna();
      } catch (error) {
        toast.error('Errore nell\'eliminare la citazione');
      }
    }
  };

  return (
    <div className="pannello-citazioni">
      <div className="citazioni-header">
        <h3>Citazioni ({citazioni.length})</h3>
        {isProprietario && (
          <button
            className="btn btn-primary btn-sm"
            onClick={mostraForm ? chiudiForm : apriFormNuovo}
          >
            {mostraForm ? 'Annulla' : '+ Aggiungi Citazione'}
          </button>
        )}
      </div>

      {mostraForm && isProprietario && (
        <form className="form-citazione" onSubmit={handleSubmit}>
          <h4 className="form-citazione-titolo">
            {modificaId ? '✏️ Modifica Citazione' : '➕ Nuova Citazione'}
          </h4>
          <div className="form-row">
            <div className="form-group">
              <label>Autori *</label>
              <input
                type="text"
                name="autoriCitazione"
                value={formDati.autoriCitazione}
                onChange={handleChange}
                placeholder="es. Smith J., Doe A."
                required
              />
            </div>
            <div className="form-group">
              <label>Anno *</label>
              <input
                type="number"
                name="annoCitazione"
                value={formDati.annoCitazione}
                onChange={handleChange}
                placeholder="es. 2024"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Titolo opera citante *</label>
            <input
              type="text"
              name="titoloCitazione"
              value={formDati.titoloCitazione}
              onChange={handleChange}
              placeholder="Titolo dell'opera che cita questo articolo"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fonte (rivista/conferenza)</label>
              <input
                type="text"
                name="fonte"
                value={formDati.fonte}
                onChange={handleChange}
                placeholder="es. Nature, IEEE Conference..."
              />
            </div>
            <div className="form-group">
              <label>DOI</label>
              <input
                type="text"
                name="doi"
                value={formDati.doi}
                onChange={handleChange}
                placeholder="es. 10.1234/esempio"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            {modificaId ? 'Salva Modifiche' : 'Salva Citazione'}
          </button>
        </form>
      )}

      {citazioni.length === 0 ? (
        <p className="nessun-risultato">Nessuna citazione registrata per questo articolo.</p>
      ) : (
        <div className="citazioni-lista">
          {citazioni.map((cit) => (
            <div key={cit._id} className="citazione-item">
              <div className="citazione-info">
                <p className="citazione-autori">{cit.autoriCitazione} ({cit.annoCitazione})</p>
                <p className="citazione-titolo">{cit.titoloCitazione}</p>
                {cit.fonte && <p className="citazione-fonte">{cit.fonte}</p>}
                {cit.doi && <p className="citazione-doi">DOI: {cit.doi}</p>}
              </div>
              {isProprietario && (
                <div className="citazione-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => apriFormModifica(cit)}
                    title="Modifica citazione"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleElimina(cit._id)}
                    title="Elimina citazione"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PannelloCitazioni;