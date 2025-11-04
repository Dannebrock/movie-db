// components/MovieCard.tsx
import { Link } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";
import {Trash2} from 'lucide-react'

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
}

interface MovieCardProps {
  movie: Movie;
  enableLink?: boolean;
  highlightQuery?: string;
  trashIcon?: boolean;
}


const MovieCard = ({ movie, enableLink = true, highlightQuery = "" , trashIcon = false}: MovieCardProps) => {

  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const isMovieFavorited = isFavorited(movie.id);
  
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "/placeholder-poster.png";

  // 1. === CRIA A FUNÇÃO DE CLIQUE DO FAVORITO ===
  // Ela precisa receber o 'event' do React
  const handleFavoriteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // 7. A lógica agora é simples:
    if (isMovieFavorited) {
      // Se já é favorito, remova
      removeFavorite(movie.id);
    } else {
      // Se não é, adicione
      addFavorite(movie); 
    }
  };

  const CardContent = (
    <div className="bg-gray-700 rounded-lg">
      <div className="relative overflow-hidden rounded-lg shadow-md">
        <img
          src={poster}
          alt={movie.title}
          className="
            w-full 
            aspect-[2/3] 
            object-cover 
            transition-transform duration-300 
            group-hover:scale-105
          "
        />               
        <button
          onClick={handleFavoriteClick}
          className="
            absolute top-2 right-2 z-10
            w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-black/40 
            flex items-center justify-center
            hover:bg-black/60 transition-colors
            text-white
          "
          aria-label="Adicionar aos favoritos"
        >          
          {trashIcon === false ? (
            
            <span
            className={`
              text-lg md:text-3x1 lg:text-4xl
              ${isMovieFavorited ? "text-red-500" : "text-white"}
            `}
            >
            {isMovieFavorited ? "♥" : "♡"}
          </span>) : (
            
            <span>
              <Trash2 className="w-4 h-4 lg:w-6 lg:h-6 hover:stroke-red-500" />
            </span>
          )}
        </button>
               
        {enableLink && (
          <div 
            className="
              absolute inset-0 
              bg-black/60 
              flex items-center justify-center 
              text-white text-lg font-bold 
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-300
            "
          >           
          </div>
        )}
      </div>
      {/* Informações (Título e Nota) */}
      <div className="mt-2 text-sm text-gray-200 pl-3 pb-3">
        <div className="font-semibold leading-tight text-white truncate">
          {!highlightQuery ? movie.title : (
            <>
              {movie.title.split(new RegExp(`(${highlightQuery})`, 'gi')).map((part, index) => 
                part.toLowerCase() === highlightQuery.toLowerCase() ? (
                  // Estilo de destaque (igual ao da sua imagem)
                  <span key={index} className="bg-yellow-500 text-black px-1 rounded-sm">
                    {part}
                  </span>
                ) : (
                  // Parte normal do texto
                  <span key={index}>{part}</span>
                )
              )}
            </>
          )}
        </div>
        <div className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-black mt-2">
          <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "—"}</span>
        </div>
      </div>
    </div>
  );

  // Esta lógica permanece a mesma: o Link envolve tudo
  return enableLink ? (
    <Link to={`/movie/${movie.id}`} className="group block">
      {CardContent}
    </Link>
  ) : (
    <div className="group">
      {CardContent}
    </div>
  );
};

export default MovieCard;
