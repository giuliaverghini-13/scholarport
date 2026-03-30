import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import BarraRicerca from '../BarraRicerca';
import CardArticolo from '../CardArticolo';

// Wrapper per i componenti che usano React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// ==================== TEST HEADER ====================

describe('Header', () => {
  test('deve mostrare il logo e i link di navigazione', () => {
    render(<Header />, { wrapper: RouterWrapper });
    expect(screen.getByText('ScholarPort')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('+ Nuovo Articolo')).toBeInTheDocument();
  });

  test('i link devono puntare alle pagine corrette', () => {
    render(<Header />, { wrapper: RouterWrapper });
    const linkPortfolio = screen.getByText('Portfolio');
    expect(linkPortfolio.closest('a')).toHaveAttribute('href', '/');
    const linkNuovo = screen.getByText('+ Nuovo Articolo');
    expect(linkNuovo.closest('a')).toHaveAttribute('href', '/nuovo');
  });
});

// ==================== TEST BARRA RICERCA ====================

describe('BarraRicerca', () => {
  test('deve mostrare il campo di ricerca e i pulsanti', () => {
    render(<BarraRicerca onRicerca={() => {}} />);
    expect(screen.getByPlaceholderText(/cerca articoli/i)).toBeInTheDocument();
    expect(screen.getByText('Cerca')).toBeInTheDocument();
    expect(screen.getByText('Filtri')).toBeInTheDocument();
  });

  test('deve mostrare/nascondere i filtri avanzati', () => {
    render(<BarraRicerca onRicerca={() => {}} />);
    expect(screen.queryByText('Autore')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Filtri'));
    expect(screen.getByText('Autore')).toBeInTheDocument();
    expect(screen.getByText('Anno')).toBeInTheDocument();
  });

  test('deve chiamare onRicerca al submit', () => {
    const mockRicerca = jest.fn();
    render(<BarraRicerca onRicerca={mockRicerca} />);
    const input = screen.getByPlaceholderText(/cerca articoli/i);
    fireEvent.change(input, { target: { value: 'machine learning' } });
    fireEvent.click(screen.getByText('Cerca'));
    expect(mockRicerca).toHaveBeenCalledWith(
      expect.objectContaining({ cerca: 'machine learning' })
    );
  });
});

// ==================== TEST CARD ARTICOLO ====================

describe('CardArticolo', () => {
  const articoloMock = {
    _id: '123',
    titolo: 'Test Article Title',
    autori: ['Mario Rossi', 'Luigi Bianchi'],
    abstract: 'Questo è un abstract di test per verificare il rendering.',
    dataPubblicazione: '2024-06-15T00:00:00.000Z',
    doi: '10.1234/test.001'
  };

  test('deve mostrare titolo, autori e DOI', () => {
    render(<CardArticolo articolo={articoloMock} onElimina={() => {}} />, {
      wrapper: RouterWrapper
    });
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('Mario Rossi, Luigi Bianchi')).toBeInTheDocument();
    expect(screen.getByText(/10\.1234\/test\.001/)).toBeInTheDocument();
  });

  test('deve mostrare i pulsanti modifica ed elimina', () => {
    render(<CardArticolo articolo={articoloMock} onElimina={() => {}} />, {
      wrapper: RouterWrapper
    });
    expect(screen.getByText(/modifica/i)).toBeInTheDocument();
    expect(screen.getByText(/elimina/i)).toBeInTheDocument();
  });

  test('deve chiamare onElimina al click', () => {
    const mockElimina = jest.fn();
    render(<CardArticolo articolo={articoloMock} onElimina={mockElimina} />, {
      wrapper: RouterWrapper
    });
    fireEvent.click(screen.getByText(/elimina/i));
    expect(mockElimina).toHaveBeenCalledWith('123');
  });

  test('il titolo deve essere un link al dettaglio', () => {
    render(<CardArticolo articolo={articoloMock} onElimina={() => {}} />, {
      wrapper: RouterWrapper
    });
    const link = screen.getByText('Test Article Title').closest('a');
    expect(link).toHaveAttribute('href', '/articolo/123');
  });

  test('deve mostrare l\'abstract', () => {
    render(<CardArticolo articolo={articoloMock} onElimina={() => {}} />, {
      wrapper: RouterWrapper
    });
    expect(screen.getByText(/abstract di test/i)).toBeInTheDocument();
  });
});