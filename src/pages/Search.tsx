import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { searchMovies } from '../services/api'; 
import MovieCard from '../components/MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
}
function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const Search = () => {
  const params = useQuery();
  const q = params.get('q') || '';   
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  
  const fetchInitialSearch = async (query: string) => {    
      if (!query) {
        setMovies([]);
        setTotalResults(0);
        setHasMore(false);
        return;
      }
      try {
        const data = await searchMovies(1, query); 
        setMovies(data.results || []);
        setPage(1); 
        setTotalResults(data.total_results || 0); 
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        setHasMore(false);
      }
   }; 
  const loadMoreMovies = async () => {
      const nextPage = page + 1;
      try {      
        const data = await searchMovies(nextPage, q); 
        setMovies((prev) => [...prev, ...data.results]);
        setPage(nextPage);
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error("Erro ao buscar mais filmes:", error);
        setHasMore(false);
      }
  };

    useEffect(() => {    
      fetchInitialSearch(q);
    }, [q]); 
  
  return (
    <div className="">      
          <div className="ml-6 mb-6 border-b border-gray-700 pb-4 mt-6">
            <h2 className="text-3xl font-semibold mb-1">
              Resultados para: "<span className="text-yellow-500">{q}</span>"
            </h2>
            <p className="text-gray-400">
              Encontrados {totalResults} filmes
            </p>
          </div>
          <InfiniteScroll            
            dataLength={movies.length}           
            next={loadMoreMovies}            
            hasMore={hasMore}           
            loader={<h4 className="text-white text-center col-span-full py-4">Carregando...</h4>}            
            endMessage={
              <p className="text-gray-400 text-center col-span-full py-4">
                <b>Você já viu tudo!</b>
              </p>
            }            
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6"
          >           
            {movies.map((movie) => (              
              <MovieCard key={movie.id} movie={movie} enableLink={true} highlightQuery={q} />
            ))}
          </InfiniteScroll>
        </div>
  );
};

export default Search;