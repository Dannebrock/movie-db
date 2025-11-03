import { useState, useEffect } from "react";
import { getPopularMovies } from "../services/api";
import MovieCard from "../components/MovieCard";


function Home() {
  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getPopularMovies();
        console.log(data); 
        setPopularMovies(data || []);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    };

    fetchMovies();
  }, []);

  return (

    <div className="container">
      <h2 className="title">Filmes Populares</h2>
      <div className="moveis-container">
        {popularMovies.length === 0 && <p>Carregando filmes...</p>}
        {popularMovies && popularMovies.length > 0 ? (
          popularMovies.map((movie: any) => <MovieCard movie={movie} enableLink={true} />)
        ) : (
          <p>Nenhum filme encontrado.</p>
        )}
      </div>      
      </div>
  );
}

export default Home;
