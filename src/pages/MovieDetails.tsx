import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { getMoviesDetails } from '../services/api'; 
import { Heart} from 'lucide-react'
import { useFavorites } from "../contexts/FavoritesContext";
interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];  
}
function MovieDetails() {  
  const { id } = useParams<{ id: string }>();   
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const isMovieFavorited = movie ? isFavorited(movie.id) : false;
 
    useEffect(() => {
      const fetchDetails = async () => {     
        if (id) {
          try {
            setLoading(true);
            const data = await getMoviesDetails(Number(id)); 
            setMovie(data); 
          } catch (error) {
            console.error("Erro ao buscar detalhes do filme:", error);          
          } finally {
            setLoading(false); 
          }
        }
      };
      fetchDetails(); 
    }, [id]); 

    if (loading) {
      return <div className="text-white text-center p-10">Carregando...</div>;
    }

    if (!movie) {
      return <div className="text-white text-center p-10">Filme não encontrado.</div>;
    }

  const handleFavoriteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();    
    
    if (isMovieFavorited) {      
      removeFavorite(movie.id);
    } else {      
      addFavorite(movie); 
    }
  };
  
const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : "/placeholder-backdrop.png"; 
  return (    
    <div className="container mx-auto p-4 md:p-8 text-white">
      {!movie || !movie.id ? (
          <div className="text-white text-center p-10">Tente novamente mais tarde...</div>
      ) : (      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">       
       
        <div className="md:col-span-6 ">
          <img
            src={imageUrl}
            alt={`Poster do ${movie.title}`}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        
        <div className="md:col-span-6">          
         
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {movie.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre) => (
              <span 
                key={genre.id} 
                className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
          
          <p className="text-gray-300 mb-2">
            <strong>Data de lançamento:</strong> {             
              new Date(movie.release_date).toLocaleDateString('pt-BR', {
                timeZone: 'UTC', 
              })
            }
          </p>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="text-gray-300">Nota TMDB:</span>
            <div className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-black">
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Sinopse</h2>
          <p className="text-gray-300 leading-relaxed">
            {movie.overview || "Este filme não possui sinopse disponível."}
          </p>

          
           <button
              onClick={handleFavoriteClick}
              className={`
                mt-6 flex items-center justify-center gap-2 
                px-5 py-3 rounded-lg font-semibold
                transition-colors duration-200
                ${isMovieFavorited 
                  ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'   
                }
              `}
            >
              {isMovieFavorited ? (
                <>                  
                  <Heart className="w-5 h-5 fill-white-700"  />
                  <span>Remover dos Favoritos!</span>
                </>
              ) : (
                <>                 
                  <Heart className="w-5 h-5" />
                  <span>Adicionar aos Favoritos</span>
                </>
              )}
            </button>        
        </div>        
      </div> 
      )}     
    </div>
  );
}

export default MovieDetails;