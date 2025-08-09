"use client"

import { memo, useCallback } from "react"
import { MemoizedMovieCard } from "./MovieCard"
import type { Movie } from "@/types/movie"
import { useState } from "react"
import { useSettings } from "@/hooks/useSettings"

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
  onContextMenu?: (movieId: number, movie: Movie, position: { x: number; y: number }) => void
}

export const MoviesGrid = memo(function MoviesGrid({ movies, isLoggedIn, isOwner, onMovieClick, onDuplicateMovie, onMovieRemoved, onMovieAdded, updatedExternalRatings, onExternalRatingsUpdated, onStreamingPopup, movieRatings, onRatingsUpdate, onContextMenu }: MoviesGridProps) {  
  const { settings, loading: settingsLoading, error: settingsError } = useSettings()

  const handleMovieClick = useCallback((movie: Movie) => {
    onMovieClick(movie)
  }, [onMovieClick])

  const handleDuplicateClick = useCallback((movie: Movie, movieId: number) => {
    onDuplicateMovie(movie, movieId)
  }, [onDuplicateMovie])

  if (settingsLoading) {
    return (
      <div className="movies-grid">
        <div style={{ textAlign: "center", color: "#b8b8d1", gridColumn: "1/-1", padding: "2rem" }}>
          Loading settings...
        </div>
      </div>
    )
  }

  if (settingsError) {
    return (
      <div className="movies-grid">
        <div style={{ textAlign: "center", color: "#b8b8d1", gridColumn: "1/-1", padding: "2rem" }}>
          Error loading settings: {settingsError}
        </div>
      </div>
    )
  }

  const gridSize = settings?.gridSize || 3;
  const viewMode = settings?.view;

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
    <div id="movies-grid" className={`movies-${viewMode === 1 ? "grid" : "list"} grid-size-${gridSize}`}>
      {movies.map((movie) => (
        <MemoizedMovieCard
          key={movie.id}
          movie={movie}
          isOwner={isOwner}
          isLoggedIn={isLoggedIn}
          onClick={() => handleMovieClick(movie)}
          onDuplicateMovie={handleDuplicateClick}
          onMovieRemoved={onMovieRemoved}
          updatedExternalRatings={updatedExternalRatings}
          onStreamingPopup={onStreamingPopup}
          movieRatings={movieRatings}
          onRatingsUpdate={onRatingsUpdate}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  )
})