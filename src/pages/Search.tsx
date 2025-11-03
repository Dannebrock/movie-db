import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { searchMovies } from '../services/api'; // Importe a função corrigida
import MovieCard from '../components/MovieCard';

// (Opcional, mas recomendado) Defina a interface Movie
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
}

// Hook para ler os parâmetros da URL (o seu já estava correto)
function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const Search = () => {
  const params = useQuery();
  const q = params.get('q') || ''; // Pega o termo de busca 'q' da URL

  // Estados para os resultados da busca
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // 1. Função para carregar a PRIMEIRA PÁGINA de uma nova busca
  const fetchInitialSearch = async (query: string) => {
    // Se a busca for vazia, limpa tudo
    if (!query) {
      setMovies([]);
      setTotalResults(0);
      setHasMore(false);
      return;
    }

    try {
      const data = await searchMovies(1, query); // Busca página 1
      setMovies(data.results || []);
      setPage(1); // Reseta a página para 1
      setTotalResults(data.total_results || 0); // Salva o total
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setHasMore(false);
    }
  };

  // 2. Função para carregar MAIS páginas (scroll infinito)
  const loadMoreMovies = async () => {
    const nextPage = page + 1;
    try {
      // 'q' vem do hook 'useQuery' e está disponível aqui
      const data = await searchMovies(nextPage, q); 
      setMovies((prev) => [...prev, ...data.results]);
      setPage(nextPage);
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error("Erro ao buscar mais filmes:", error);
      setHasMore(false);
    }
  };

  // 3. useEffect que RODA QUANDO O 'q' (termo da URL) MUDA
  useEffect(() => {
    // Quando 'q' mudar, faça uma nova busca inicial
    fetchInitialSearch(q);
  }, [q]); // A dependência é o 'q'

  // 4. Renderização (Layout da Imagem + Grid Infinito)
  return (


    <div className=""> {/* Seu container pai */}
     
          <div className="ml-6 mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-3xl font-semibold mb-1">
              Resultados para: "<span className="text-yellow-500">{q}</span>"
            </h2>
            <p className="text-gray-400">
              Encontrados {totalResults} filmes
            </p>
          </div>
          <InfiniteScroll
            // dataLength é o número de itens atuais
            dataLength={movies.length} 
            // next é a função a ser chamada quando chegar ao fim
            next={loadMoreMovies}
            // hasMore diz se ainda há mais dados para buscar
            hasMore={hasMore}
            // O que mostrar enquanto carrega
            loader={<h4 className="text-white text-center col-span-full py-4">Carregando...</h4>}
            // Mensagem de fim
            endMessage={
              <p className="text-gray-400 text-center col-span-full py-4">
                <b>Você já viu tudo!</b>
              </p>
            }
            // Aplicamos as classes do seu grid DIRETAMENTE aqui
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6"
          >
            {/* Não precisamos mais do 'popularMovies.length === 0', 
              o 'loader' e 'endMessage' cuidam disso.
            */}
            {movies.map((movie) => (
              // Adicionei o 'key', que é essencial para o React
              <MovieCard key={movie.id} movie={movie} enableLink={true} highlightQuery={q} />
            ))}
          </InfiniteScroll>
        </div>
  );
};

export default Search;