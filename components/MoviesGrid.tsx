"use client"

import { MovieCard } from "./MovieCard"
import type { Movie } from "@/types/movie"

interface MoviesGridProps {
  movies: Movie[]
  isLoggedIn: boolean
  isOwner: boolean
  onMovieClick: (movie: Movie) => void
  onDuplicateMovie: (movie: Movie) => void
  onMovieRemoved?: () => void
  onMovieAdded?: () => void
  updatedRatings?: { [movieId: number]: { imdbRating: number; rtRating: number } }
  onRatingsUpdated?: (ratings: any) => void
  onStreamingPopup?: (streamingServices: any, movieTitle: string, position: { x: number; y: number }) => void
}

export function MoviesGrid({ movies, isLoggedIn, isOwner, onMovieClick, onDuplicateMovie, onMovieRemoved, onMovieAdded, updatedRatings, onRatingsUpdated, onStreamingPopup }: MoviesGridProps) {
  if (!isLoggedIn && !movies.length) {
    return (
      <div className="movies-grid">
        <div style={{ textAlign: "center", color: "#b8b8d1", gridColumn: "1/-1", padding: "2rem" }}>
          Log in to view your movies.
        </div>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="movies-grid">
        <div style={{ textAlign: "center", color: "#b8b8d1", gridColumn: "1/-1", padding: "2rem" }}>
          No movies found matching your criteria.
        </div>
      </div>
    )
  }

  return (
    <div id="movies-grid" className="movies-grid grid-size-3">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isOwner={isOwner}
          isLoggedIn={isLoggedIn}
          onClick={() => onMovieClick(movie)}
          onDuplicateMovie={onDuplicateMovie}
          onMovieRemoved={onMovieRemoved}
          onMovieAdded={onMovieAdded}
          updatedRatings={updatedRatings}
          onStreamingPopup={onStreamingPopup}
        />
      ))}
    </div>
  )
}
