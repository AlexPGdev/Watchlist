"use client"

import { memo, use, useCallback, useEffect, useMemo } from "react"
import { MemorizedMovieCard } from "./MovieCard"
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
  selectedMoviesList?: number[]
  onSelectMovie?: (movieId: number) => void
}

export const MoviesGrid = memo(function MoviesGrid({ movies, isLoggedIn, isOwner, onMovieClick, onDuplicateMovie, onMovieRemoved, onMovieAdded, updatedExternalRatings, onExternalRatingsUpdated, onStreamingPopup, movieRatings, onRatingsUpdate, onContextMenu, selectedMoviesList, onSelectMovie }: MoviesGridProps) {  
  const { settings, loading: settingsLoading, error: settingsError } = useSettings()
  const [watchedCollapsed, setWatchedCollapsed] = useState(false)
  const [toWatchCollapsed, setToWatchCollapsed] = useState(false)

  // const [selectedMovies, setSelectedMovies] = useState<number[]>([]);

  // const handleSelectMovie = (movieId: number) => {
  //   setSelectedMovies((prev) =>
  //     prev.includes(movieId)
  //       ? prev.filter((id) => id !== movieId)
  //       : [...prev, movieId]
  //   );
  // };

  useEffect(() => {
    if(watchedCollapsed) {
      const content = document.getElementById('watchedContent') as HTMLElement;
      if(content) content.style.maxHeight = content.scrollHeight + 'px';
      if(content) content.offsetHeight;
      if(content) content.style.maxHeight = '0px';
    } else {
      const content = document.getElementById('watchedContent') as HTMLElement;
      if(content) content.style.maxHeight = content.scrollHeight + 'px';
    }

    if(toWatchCollapsed) {
      const content = document.getElementById('toWatchContent') as HTMLElement;
      if(content) content.style.maxHeight = content.scrollHeight + 'px';
      if(content) content.offsetHeight;
      if(content) content.style.maxHeight = '0px';
    } else {
      const content = document.getElementById('toWatchContent') as HTMLElement;
      if(content) content.style.maxHeight = content.scrollHeight + 'px';
    }
  })

  const handleMovieClick = useCallback(( movie: Movie) => {
      onMovieClick(movie)
  }, [onMovieClick])

  const handleDuplicateClick = useCallback((movie: Movie, movieId: number) => {
    onDuplicateMovie(movie, movieId)
  }, [onDuplicateMovie])

  const handleWatchedCollapsed = () => {
    setWatchedCollapsed(!watchedCollapsed)

    if(!watchedCollapsed) {
      const content = document.getElementById('watchedContent') as HTMLElement;
      content.style.maxHeight = '0px';
    } else {
      const content = document.getElementById('watchedContent') as HTMLElement;
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }

  const handleToWatchCollapsed = () => {
    setToWatchCollapsed(!toWatchCollapsed)

    if(!toWatchCollapsed) {
      const content = document.getElementById('toWatchContent') as HTMLElement;
      content.style.maxHeight = '0px';
    } else {
      const content = document.getElementById('toWatchContent') as HTMLElement;
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }

  const watchedMovies = useMemo(
    () => movies
      .filter((m) => m.watched)
      .sort((a, b) => (a.watchDate ? new Date(a.watchDate).getTime() : 0) - (b.watchDate ? new Date(b.watchDate).getTime() : 0)),
    [movies]
  );
  
  const toWatchMovies = useMemo(
    () => movies
      .filter((m) => !m.watched)
      .sort((a, b) => (a.addedDate ? new Date(a.addedDate).getTime() : 0) - (b.addedDate ? new Date(b.addedDate).getTime() : 0)),
    [movies]
  );

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
    <div id="movies-grid-container">
      <div id="movies-grid-watched">
        {watchedMovies.length > 0 && (
          <div className="watched-section">
            <div className="watched-header" onClick={handleWatchedCollapsed} id="watchedHeader">
                <span className={`expand-arrow ${watchedCollapsed ? "collapsed" : ""}`} id="watchedArrow">▼</span>
                <div className="watched-line"></div>
                <span className="watched-text">Watched</span>
                <div className="watched-line"></div>
            </div>
            <div className={`watched-content ${watchedCollapsed ? "collapsed" : ""}`} id="watchedContent">
              <div id="movies-grid" className={`movies-${viewMode === 1 ? "grid" : "list"} grid-size-${gridSize}`} style={{ marginBottom: "0px" }}>
                {watchedMovies.map((movie, index) => (
                  <MemorizedMovieCard
                    key={movie.id}
                    index={index}
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
                    selectedMoviesList={selectedMoviesList}
                    isSelectionMode={selectedMoviesList?.length > 0}
                    onSelectMovie={onSelectMovie}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {toWatchMovies.length > 0 && (
          <div className="watched-section">
            <div className="watched-header" onClick={handleToWatchCollapsed} id="toWatchHeader">
                <span className={`expand-arrow ${toWatchCollapsed ? "collapsed" : ""}`} id="watchedArrow">▼</span>
                <div className="watched-line"></div>
                <span className="watched-text">To Watch</span>
                <div className="watched-line"></div>
            </div>
            <div className={`watched-content ${toWatchCollapsed ? "collapsed" : ""}`} id="toWatchContent">
              <div id="movies-grid2" className={`movies-${viewMode === 1 ? "grid" : "list"} grid-size-${gridSize}`}>
                {toWatchMovies.map((movie, index) => (
                  <MemorizedMovieCard
                    key={movie.id}
                    index={watchedMovies.length + index}
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
                    selectedMoviesList={selectedMoviesList}
                    isSelectionMode={selectedMoviesList?.length > 0}
                    onSelectMovie={onSelectMovie}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})