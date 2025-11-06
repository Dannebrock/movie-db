import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

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

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

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
    const [favorites, setFavorites] = useState<Movie[]>(getInitialFavorites);  
      useEffect(() => {
        try {
          localStorage.setItem('movie-favorites', JSON.stringify(favorites));
        } catch (error) {
          console.error("Erro ao salvar favoritos no localStorage:", error);
        }
      }, [favorites]);  
    const addFavorite = (movie: Movie) => {    
        setFavorites((prev) => 
          prev.some(fav => fav.id === movie.id) 
            ? prev 
            : [...prev, movie] 
        );
    };
    const removeFavorite = (movieId: number) => {
      setFavorites((prev) => prev.filter(fav => fav.id !== movieId));
    };

    const isFavorited = (movieId: number) => {    
        return favorites.some(fav => fav.id === movieId);
      };  
    const value = useMemo(() => ({
        favorites,
        addFavorite,
        removeFavorite,
        isFavorited
    }), [favorites]); 

    return (
      <FavoritesContext.Provider value={value}>
        {children}
      </FavoritesContext.Provider>
    );
};
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
     throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
};