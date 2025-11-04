// src/components/MovieCard/MovieCard.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { FavoritesContext } from '../contexts/FavoritesContext';
import '@testing-library/jest-dom';


vi.mock('lucide-react', () => ({
  Trash2: () => <svg data-testid="trash-icon" />,
}));

const mockAddFavorite = vi.fn();
const mockRemoveFavorite = vi.fn();
let isFavoritedValue = false;
const mockIsFavorited = vi.fn(() => isFavoritedValue);

const mockContextValue = {
  favorites: [], 
  addFavorite: mockAddFavorite,
  removeFavorite: mockRemoveFavorite,
  isFavorited: mockIsFavorited,
};

const MOCK_MOVIE = {
  id: 1,
  title: 'Filme de Teste',
  poster_path: '/poster.jpg',
  vote_average: 8.5,
  release_date: '2025-01-01',
};

const renderComponent = (props = {}) => {
  const combinedProps = {
    movie: MOCK_MOVIE,
    ...props,
  };

  return render(
    <FavoritesContext.Provider value={mockContextValue}>
      <MemoryRouter>
        <MovieCard {...combinedProps} />
      </MemoryRouter>
    </FavoritesContext.Provider>
  );
};

describe('Componente MovieCard', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    isFavoritedValue = false;
    mockIsFavorited.mockImplementation(() => isFavoritedValue);
  });

  it('deve renderizar o título, nota e poster corretamente', () => {
    renderComponent();

    expect(screen.getByText('Filme de Teste')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    
    const img = screen.getByRole('img', { name: /Filme de Teste/i });
    expect(img).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/poster.jpg');
  });

  it('deve usar um poster placeholder se poster_path for nulo', () => {
    renderComponent({ movie: { ...MOCK_MOVIE, poster_path: null } });

    const img = screen.getByRole('img', { name: /Filme de Teste/i });
    expect(img).toHaveAttribute('src', '/placeholder-poster.png');
  });

  it('deve estar envolvido em um Link por padrão', () => {
    renderComponent();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/1');
  });

  it('não deve estar envolvido em um Link se enableLink for false', () => {
    renderComponent({ enableLink: false });
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('deve mostrar o ícone de coração vazio se não for favorito', () => {
    isFavoritedValue = false;
    renderComponent();
    expect(screen.getByText('♡')).toBeInTheDocument();
    expect(screen.queryByText('♥')).not.toBeInTheDocument();
  });

  it('deve mostrar o ícone de coração preenchido se for favorito', () => {
    isFavoritedValue = true;
    renderComponent();
    expect(screen.getByText('♥')).toBeInTheDocument();
    expect(screen.queryByText('♡')).not.toBeInTheDocument();
  });

  it('deve chamar addFavorite ao clicar no botão quando não for favorito', () => {
    isFavoritedValue = false;
    renderComponent();

    const favButton = screen.getByRole('button', { name: /Adicionar aos favoritos/i });
    fireEvent.click(favButton);

    expect(mockAddFavorite).toHaveBeenCalledTimes(1);
    expect(mockAddFavorite).toHaveBeenCalledWith(MOCK_MOVIE);
    expect(mockRemoveFavorite).not.toHaveBeenCalled();
  });

  it('deve chamar removeFavorite ao clicar no botão quando já for favorito', () => {
    isFavoritedValue = true;
    renderComponent();

    const favButton = screen.getByRole('button', { name: /Adicionar aos favoritos/i });
    fireEvent.click(favButton);

    expect(mockRemoveFavorite).toHaveBeenCalledTimes(1);
    expect(mockRemoveFavorite).toHaveBeenCalledWith(MOCK_MOVIE.id);
    expect(mockAddFavorite).not.toHaveBeenCalled();
  });

  it('deve destacar o texto da busca no título', () => {
    renderComponent({ highlightQuery: 'Teste' });
    
    const highlightedPart = screen.getByText('Teste');
    expect(highlightedPart).toHaveClass('bg-yellow-500');
    expect(screen.getByText(/Filme de/i)).toBeInTheDocument();
  });

  it('deve mostrar o ícone de lixeira se trashIcon for true', () => {
    renderComponent({ trashIcon: true });

    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
    expect(screen.queryByText('♡')).not.toBeInTheDocument();
    expect(screen.queryByText('♥')).not.toBeInTheDocument();
  });

  it('deve chamar a função de favoritar/remover mesmo com o ícone de lixeira', () => {
    isFavoritedValue = true;
    renderComponent({ trashIcon: true });

    const favButton = screen.getByRole('button', { name: /Adicionar aos favoritos/i });
    fireEvent.click(favButton);

    expect(mockRemoveFavorite).toHaveBeenCalledTimes(1);
    expect(mockRemoveFavorite).toHaveBeenCalledWith(MOCK_MOVIE.id);
  });
});