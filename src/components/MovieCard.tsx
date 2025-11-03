import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface MovieCardProps {
  movie: Movie;
  enableLink?: boolean; // opcional
}

const MovieCard = ({ movie, enableLink = true }: MovieCardProps) => {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />

      <div className="movie-info">
        <h2>{movie.title}</h2>
        <h3>{movie.vote_average}</h3>
      </div>

      {enableLink && <Link to={`/movie/${movie.id}`}>Detalhes</Link>}
    </div>
  );
};

export default MovieCard;
