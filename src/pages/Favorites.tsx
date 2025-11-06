import { useState, useMemo } from 'react';
import { useFavorites } from '../contexts/FavoritesContext'; 
import MovieCard from '../components/MovieCard';
import { Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';

type SortOrder = 'A-Z' | 'Z-A' | 'nota-desc';

const Favorites = () => {  
  const { favorites } = useFavorites(); 
  const [sortOrder, setSortOrder] = useState<SortOrder>('A-Z');  
  const sortedFavorites = useMemo(() => {
    const sorted = [...favorites];
    switch (sortOrder) {
      case 'A-Z':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'Z-A':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'nota-desc':
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      default:
        return sorted;
    }
  }, [favorites, sortOrder]);
  
  return (    
    <div>    
      <div className="mb-6 flex flex-col  items-start ml-6 ">
        <h1 className="text-xl md:text-4xl font-bold mt-5">
          Meus Filmes Favoritos
        </h1>
        <div className="flex items-center gap-3 mt-5">
          <label htmlFor="sort-order" className="text-gray-300">
            Ordenar por:
          </label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}            
            className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="A-Z">Título (A-Z)</option>
            <option value="Z-A">Título (Z-A)</option>
            <option value="nota-desc">Nota (Maior)</option>
          </select>
        </div>
      </div>
      {favorites.length === 0 ? (      
          <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
          <Clapperboard size={64} className="mb-6" />
          <h2 className="text-2xl font-semibold mb-2 text-white">
            Nenhum filme favorito ainda
          </h2>
          <p className="text-lg mb-6">
           Comece explorando filmes populares e adicione seus favoritos.
          </p>
          <Link 
            to="/" 
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors button-search"
          >
            Explorar Filmes
          </Link>
        </div>
      ) : (       
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6">          
          {sortedFavorites.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              enableLink={true}               
              trashIcon={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;