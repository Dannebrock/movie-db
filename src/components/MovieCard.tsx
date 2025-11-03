// components/MovieCard.tsx
import { Link } from "react-router-dom";
import { useState } from "react";

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
}


const MovieCard = ({ movie, enableLink = true }: MovieCardProps) => {

  const [isFavorited, setIsFavorited] = useState(false);

  
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-poster.png";

  // 1. === CRIA A FUNÇÃO DE CLIQUE DO FAVORITO ===
  // Ela precisa receber o 'event' do React
  const handleFavoriteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // 3. Atualize o estado a cada clique
    setIsFavorited((prev) => !prev); // Inverte o estado (true -> false -> true)

    // Sua lógica de API (adicionar/remover favorito) iria aqui
    if (!isFavorited) {
      console.log("Adicionando aos favoritos:", movie.id);
      // ex: addToFavorites(movie.id);
    } else {
      console.log("Removendo dos favoritos:", movie.id);
      // ex: removeFromFavorites(movie.id);
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
            w-8 h-8 rounded-full bg-black/40 
            flex items-center justify-center
            hover:bg-black/60 transition-colors
          "
          aria-label="Adicionar aos favoritos"
        >          
          <span
            className={`
              text-lg 
              ${isFavorited ? "text-red-500" : "text-white"}
            `}
          >
            {isFavorited ? "♥" : "♡"}
          </span>
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
          {movie.title}
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
