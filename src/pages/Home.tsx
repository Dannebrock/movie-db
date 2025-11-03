import { useState, useEffect, useRef } from "react";
import { getPopularMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import InfiniteScroll from "react-infinite-scroll-component";

// (Opcional, mas recomendado) Defina uma interface para o Movie
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
}

function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const initialLoadCalled = useRef(false);

  // 1. Função para carregar os filmes iniciais (Página 1)
  const fetchInitialMovies = async () => {
    try {
      const data = await getPopularMovies(1); // Busca página 1
      setPopularMovies(data.results || []);
      setPage(1); // Garante que a página é 1
      setHasMore(data.page < data.total_pages); // Verifica se há mais páginas
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setHasMore(false);
    }
  };

  // 2. Função para carregar MAIS filmes (Página 2, 3...)
  const loadMoreMovies = async () => {
    const nextPage = page + 1;
    try {
      const data = await getPopularMovies(nextPage);
      // Adiciona os novos filmes à lista existente
      setPopularMovies((prevMovies) => [...prevMovies, ...data.results]);
      setPage(nextPage); // Atualiza o estado da página
      setHasMore(data.page < data.total_pages); // Verifica se ainda há mais
    } catch (error) {
      console.error("Erro ao buscar mais filmes:", error);
      setHasMore(false);
    }
    //colocar um catch para caso a url da api eesta incorreta ou fora do ar
  };

  // 3. useEffect chama a carga inicial (Página 1)
  useEffect(() => {
    if (!initialLoadCalled.current) {
      initialLoadCalled.current = true; // 4. Marca como "chamado"
      fetchInitialMovies(); // 5. Chama a função
    } 
  }, []); // O array vazio [] faz com que rode apenas na montagem

  return (
    <div className=""> {/* Seu container pai */}
      {popularMovies.length === 0 ?(
          <div className="text-white text-center p-10">Tente novamente mais tarde...</div>
      ) : (
      <InfiniteScroll
        // dataLength é o número de itens atuais
        dataLength={popularMovies.length} 
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
        {popularMovies.map((movie) => (
          // Adicionei o 'key', que é essencial para o React
          <MovieCard key={movie.id} movie={movie} enableLink={true} />
        ))}
      </InfiniteScroll>
      )}
    </div>
  );
}

export default Home;