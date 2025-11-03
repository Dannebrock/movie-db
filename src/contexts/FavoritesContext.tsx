// src/contexts/FavoritesContext.tsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

// (Sua interface Movie)
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
}

interface FavoritesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorited: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// --- Funções Auxiliares (fora do componente) ---

// Função para carregar do localStorage (só roda 1 vez)
const getInitialFavorites = (): Movie[] => {
  try {
    const storedFavorites = localStorage.getItem('movie-favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("Erro ao carregar favoritos do localStorage:", error);
    return [];
  }
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  
  // 1. O useState fica mais limpo, passando a função de 'lazy init'
  const [favorites, setFavorites] = useState<Movie[]>(getInitialFavorites);

  // 2. O useEffect fica igual, mas é bom para persistência
  useEffect(() => {
    try {
      localStorage.setItem('movie-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error("Erro ao salvar favoritos no localStorage:", error);
    }
  }, [favorites]);

  // --- Funções de Ação (podem ser 'useCallback' mas vamos manter simples) ---
  
  const addFavorite = (movie: Movie) => {
    // 3. Lógica 'add' ficou mais enxuta (ternário)
    setFavorites((prev) => 
      prev.some(fav => fav.id === movie.id) 
        ? prev // Se já existe, retorna o array anterior
        : [...prev, movie] // Se não, adiciona
    );
  };

  const removeFavorite = (movieId: number) => {
    setFavorites((prev) => prev.filter(fav => fav.id !== movieId));
  };

  const isFavorited = (movieId: number) => {
    // 4. 'useMemo' aqui não é necessário, 
    //    pois 'favorites.some' já é muito rápido.
    return favorites.some(fav => fav.id === movieId);
  };

  // 5. Otimização: useMemo
  // Isso garante que o objeto 'value' SÓ seja recriado
  // se a lista 'favorites' realmente mudar.
  // Evita re-renderizações desnecessárias nos componentes.
  const value = useMemo(() => ({
    favorites,
    addFavorite,
    removeFavorite,
    isFavorited
  }), [favorites]); // O 'value' só muda se 'favorites' mudar

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// O Hook customizado fica igual
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
};