// src/components/MovieCarousel.tsx
import MovieCard from "./MovieCard";

interface MovieCarouselProps {
  title: string;
  movies: any[];
}

function MovieCarousel({ title, movies }: MovieCarouselProps) {
  return (
    <div className="my-6">
      <h2 className="text-white text-xl font-bold mb-3">{title}</h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-1">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            rating={movie.vote_average}
            poster={movie.poster_path}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieCarousel;
