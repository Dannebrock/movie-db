import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { getMoviesDetails } from '../services/api'; 
import { Heart} from 'lucide-react'
import { useFavorites } from "../contexts/FavoritesContext";

// (Opcional, mas recomendado) Crie uma interface para os detalhes
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
  // 3. Pegue o 'id' da URL. Ele vem como string!
  const { id } = useParams<{ id: string }>(); 

  // 4. Crie estados para guardar os dados e o carregamento
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const isMovieFavorited = movie ? isFavorited(movie.id) : false;

  // 5. Use 'useEffect' para buscar os dados quando a página carregar
  useEffect(() => {
    // Crie uma função async dentro do useEffect
    const fetchDetails = async () => {
      // Verifique se o ID existe
      if (id) {
        try {
          setLoading(true); // Começa a carregar
          // Converta o 'id' (string) para 'number'
          const data = await getMoviesDetails(Number(id)); 
          setMovie(data); // Salva os dados no estado
        } catch (error) {
          console.error("Erro ao buscar detalhes do filme:", error);
          // (Opcional) Você pode redirecionar para uma página de erro aqui
        } finally {
          setLoading(false); // Termina de carregar (com sucesso ou erro)
        }
      }
    };
    fetchDetails(); // Chame a função
  }, [id]); // O 'useEffect' vai rodar de novo se o ID na URL mudar


  if (loading) {
    return <div className="text-white text-center p-10">Carregando...</div>;
  }

  if (!movie) {
    return <div className="text-white text-center p-10">Filme não encontrado.</div>;
  }

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

  // Se passou, temos o filme!
const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` // Usamos w1280 para maior resolução
    : "/placeholder-backdrop.png"; // (Use o mesmo placeholder do seu card)

  return (
    // Container principal que centraliza o conteúdo
    <div className="container mx-auto p-4 md:p-8 text-white">
      
      {/* Grid de 2 colunas: 1 no mobile (stack), 2 no desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* IMAGEM */}
        <div className="md:col-span-6 ">
          <img
            src={imageUrl}
            alt={`Poster do ${movie.title}`}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/*  INFORMAÇÕES  */}
        <div className="md:col-span-6">
          
          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {movie.title}
          </h1>

          {/* Gêneros (Tags) */}
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

          {/* Data de Lançamento */}
          <p className="text-gray-300 mb-2">
            <strong>Data de lançamento:</strong> {
              // Formata a data para pt-BR
              new Date(movie.release_date).toLocaleDateString('pt-BR', {
                timeZone: 'UTC', 
              })
            }
          </p>

          {/* Nota */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-gray-300">Nota TMDB:</span>
            <div className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-black">
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          {/* Sinopse */}
          <h2 className="text-2xl font-bold mb-2">Sinopse</h2>
          <p className="text-gray-300 leading-relaxed">
            {movie.overview || "Este filme não possui sinopse disponível."}
          </p>

          {/* Botão de Favoritos */}

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
    </div>
  );
}

export default MovieDetails;