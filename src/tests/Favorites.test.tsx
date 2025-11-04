// src/pages/Favorites/Favorites.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Favorites from '../pages/Favorites';
import { useFavorites } from '../contexts/FavoritesContext';
import '@testing-library/jest-dom';


vi.mock('../contexts/FavoritesContext');
const mockedUseFavorites = vi.mocked(useFavorites);

vi.mock('../components/MovieCard', () => ({
  default: (props: any) => (
    <div data-testid="movie-card" data-trash-icon={props.trashIcon}>
      {props.movie.title}
    </div>
  )
}));

vi.mock('lucide-react', () => ({
  Clapperboard: () => <svg data-testid="clapperboard-icon" />,
}));

const MOCK_MOVIES = [
  { id: 1, title: 'B Movie', vote_average: 8.0, poster_path: '/b.jpg' },
  { id: 2, title: 'C Movie', vote_average: 9.0, poster_path: '/c.jpg' },
  { id: 3, title: 'A Movie', vote_average: 7.0, poster_path: '/a.jpg' },
];

const renderComponent = (favorites: any[]) => {
  mockedUseFavorites.mockReturnValue({
    favorites: favorites,
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    isFavorited: vi.fn(),
  });

  return render(
    <MemoryRouter>
      <Favorites />
    </MemoryRouter>
  );
};

describe('Página Favorites', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o estado vazio se não houver favoritos', () => {
    renderComponent([]);
    
    expect(screen.getByText('Nenhum filme favorito ainda')).toBeInTheDocument();
    expect(screen.getByTestId('clapperboard-icon')).toBeInTheDocument();
    
    const link = screen.getByRole('link', { name: /Explorar Filmes/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
    
    expect(screen.queryByTestId('movie-card')).not.toBeInTheDocument();
  });

  it('deve renderizar a lista de filmes e o seletor de ordenação se houver favoritos', () => {
    renderComponent(MOCK_MOVIES);

    expect(screen.getByText('Meus Filmes Favoritos')).toBeInTheDocument();
    expect(screen.getByLabelText(/Ordenar por/i)).toBeInTheDocument();
    
    const cards = screen.getAllByTestId('movie-card');
    expect(cards).toHaveLength(3);
    
    expect(screen.queryByText('Nenhum filme favorito ainda')).not.toBeInTheDocument();
  });

  it('deve passar a prop trashIcon=true para os MovieCards', () => {
    renderComponent(MOCK_MOVIES);
    
    const cards = screen.getAllByTestId('movie-card');
    expect(cards[0]).toHaveAttribute('data-trash-icon', 'true');
  });

  it('deve ordenar os filmes por Título (A-Z) por padrão', () => {
    renderComponent(MOCK_MOVIES);
    
    const cards = screen.getAllByTestId('movie-card');
    const titles = cards.map(card => card.textContent);
    
    expect(titles).toEqual(['A Movie', 'B Movie', 'C Movie']);
  });

  it('deve reordenar os filmes por Título (Z-A) ao mudar o seletor', () => {
    renderComponent(MOCK_MOVIES);

    const select = screen.getByLabelText(/Ordenar por/i);
    fireEvent.change(select, { target: { value: 'Z-A' } });

    const cards = screen.getAllByTestId('movie-card');
    const titles = cards.map(card => card.textContent);
    
    expect(titles).toEqual(['C Movie', 'B Movie', 'A Movie']);
  });

  it('deve reordenar os filmes por Nota (Maior) ao mudar o seletor', () => {
    renderComponent(MOCK_MOVIES);

    const select = screen.getByLabelText(/Ordenar por/i);
    fireEvent.change(select, { target: { value: 'nota-desc' } });

    const cards = screen.getAllByTestId('movie-card');
    const titles = cards.map(card => card.textContent);
    
    expect(titles).toEqual(['C Movie', 'B Movie', 'A Movie']);
  });
});