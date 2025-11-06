import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FavoritesProvider, useFavorites } from '../contexts/FavoritesContext';
import type { ReactNode } from 'react';

const createLocalStorageMock = () => {
  let store: { [key: string]: string } = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
};

Object.defineProperty(window, 'localStorage', {
  value: createLocalStorageMock(),
  writable: true,
});

const movie1 = {
  id: 1,
  title: "Filme Teste 1",
  poster_path: "/path1.jpg",
  vote_average: 8.0,
};

const movie2 = {
  id: 2,
  title: "Filme Teste 2",
  poster_path: "/path2.jpg",
  vote_average: 9.0,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

describe('FavoritesContext', () => {

  beforeEach(() => {
    window.localStorage.clear();
    (window.localStorage.setItem as any).mockClear();
    (window.localStorage.getItem as any).mockClear();
  });

  it('deve adicionar um favorito corretamente', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.addFavorite(movie1);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].id).toBe(1);
    
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'movie-favorites',
      JSON.stringify([movie1])
    );
  });

  it('deve remover um favorito corretamente', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.addFavorite(movie1);
      result.current.addFavorite(movie2);
    });

    expect(result.current.favorites).toHaveLength(2);

    act(() => {
      result.current.removeFavorite(1);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].id).toBe(2);

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'movie-favorites',
      JSON.stringify([movie2])
    );
  });

  it('não deve adicionar filmes duplicados', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.addFavorite(movie1);
      result.current.addFavorite(movie1);
    });

    expect(result.current.favorites).toHaveLength(1);
  });

  it('deve checar corretamente se um filme é favorito (isFavorited)', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.addFavorite(movie1);
    });

    expect(result.current.isFavorited(1)).toBe(true);
    expect(result.current.isFavorited(999)).toBe(false);
  });

  it('deve carregar os favoritos do localStorage no início', () => {
    window.localStorage.setItem('movie-favorites', JSON.stringify([movie2]));

    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].id).toBe(2);
  }); 
});
