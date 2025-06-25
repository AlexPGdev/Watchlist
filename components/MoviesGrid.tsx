"use client"

import { memo, useCallback } from "react"
import { MovieCard } from "./MovieCard"
import type { Movie } from "@/types/movie"

interface MoviesGridProps {
  movies: Movie[]
  isLoggedIn: boolean
  isOwner: boolean
  onMovieClick: (movie: Movie) => void
  onDuplicateMovie: (movie: Movie, movieId: number) => void
  onMovieRemoved?: () => void
  onMovieAdded?: () => void
  updatedExternalRatings?: { [movieId: number]: { imdbRating: number; rtRating: number } }
  onExternalRatingsUpdated?: (ratings: any) => void
  onStreamingPopup?: (streamingServices: any, movieTitle: string, position: { x: number; y: number }) => void
  movieRatings?: { [movieId: number]: number }
  onRatingsUpdate?: (movieId: number, rating: number) => void
}

export const MoviesGrid = memo(function MoviesGrid({ movies, isLoggedIn, isOwner, onMovieClick, onDuplicateMovie, onMovieRemoved, onMovieAdded, updatedExternalRatings, onExternalRatingsUpdated, onStreamingPopup, movieRatings, onRatingsUpdate }: MoviesGridProps) {
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

  const handleMovieClick = useCallback((movie: Movie) => {
    onMovieClick(movie)
  }, [onMovieClick])

  const handleDuplicateClick = useCallback((movie: Movie, movieId: number) => {
    onDuplicateMovie(movie, movieId)
  }, [onDuplicateMovie])

  return (
    <div id="movies-grid" className="movies-grid grid-size-3">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isOwner={isOwner}
          isLoggedIn={isLoggedIn}
          onClick={() => handleMovieClick(movie)}
          onDuplicateMovie={handleDuplicateClick}
          onMovieRemoved={onMovieRemoved}
          onMovieAdded={onMovieAdded}
          updatedExternalRatings={updatedExternalRatings}
          onStreamingPopup={onStreamingPopup}
          movieRatings={movieRatings}
          onRatingsUpdate={onRatingsUpdate}
        />
      ))}
    </div>
  )
})