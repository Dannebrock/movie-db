import { useState, useEffect, useRef } from "react";
import { getPopularMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { isAxiosError } from 'axios';

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
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchInitialMovies = async () => {
    try {
      const data = await getPopularMovies(1); 
      setPopularMovies(data.results || []);
      setPage(1); 
      setHasMore(data.page < data.total_pages); 
    } catch (error) {      
        if (isAxiosError(error)) {     
            if (error.response) {         
          const status = error.response.status;
          if (status === 401 || status === 403) {
            console.error("Erro de Autenticação (401/403): Não autorizado. Verifique sua chave de API.");
            } else if (status === 404) {
            console.error("Erro 404: Endpoint não encontrado.");
            } else {
            console.error(`Erro de Servidor: Status ${status}`, error.response.data);
            }
            } else if (error.request) {          
              console.error("Erro de Rede: A API está fora do ar ou a URL está incorreta.");        
            } else {         
              console.error("Erro ao preparar a requisição:", error.message);
            }

          } else {        
        console.error("Erro inesperado (não relacionado à API):", error);
      }    
      setPopularMovies([]); // Garante que a lista está vazia se der erro
    } finally {      
      setIsLoading(false); 
    }   
  };
  // Função para carregar mais filmes (Página 2, 3...)
  const loadMoreMovies = async () => {
    const nextPage = page + 1;
    try {
      const data = await getPopularMovies(nextPage);    
      setPopularMovies((prevMovies) => [...prevMovies, ...data.results]);
      setPage(nextPage); 
      setHasMore(data.page < data.total_pages); 

    } catch (error) {      
        if (isAxiosError(error)) {     
            if (error.response) {         
          const status = error.response.status;
          if (status === 401 || status === 403) {
            console.error("Erro de Autenticação (401/403): Não autorizado. Verifique sua chave de API.");
            } else if (status === 404) {
            console.error("Erro 404: Endpoint não encontrado.");
            } else {
            console.error(`Erro de Servidor: Status ${status}`, error.response.data);
            }
            } else if (error.request) {          
              console.error("Erro de Rede: A API está fora do ar ou a URL está incorreta.");        
            } else {         
              console.error("Erro ao preparar a requisição:", error.message);
            }

          } else {        
        console.error("Erro inesperado (não relacionado à API):", error);
      }    
      setHasMore(false);
    }
  };  
    useEffect(() => {
      if (!initialLoadCalled.current) {
        initialLoadCalled.current = true;
        fetchInitialMovies(); 
      } 
    }, []); 

  return (
    <div className=""> {/* Seu container pai */}
    {isLoading ? (   
    <div className="text-white text-center p-10">      
      <svg className="animate-spin h-8 w-8 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="mt-2 block">Carregando...</span>
    </div>
   ) : popularMovies.length === 0 ?(
          <div className="text-white text-center p-10">Tente novamente mais tarde...</div>
      ) : (
      <InfiniteScroll        
        dataLength={popularMovies.length}         
        next={loadMoreMovies}        
        hasMore={hasMore}        
        loader={
           <svg className="animate-spin h-8 w-8 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        }        
        endMessage={
          <p className="text-gray-400 text-center col-span-full py-4">
            <b>Você já viu tudo!</b>
          </p>
        }       
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6"
      >        
        {popularMovies.map((movie) => (          
          <MovieCard key={movie.id} movie={movie} enableLink={true} />
        ))}
      </InfiniteScroll>
      )}
    </div>
  );
}

export default Home;