"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Header } from "@/components/Header"
import { Stats } from "@/components/Stats"
import { Controls } from "@/components/Controls"
import { FilterTabs } from "@/components/FilterTabs"
import { MoviesGrid } from "@/components/MoviesGrid"
import { LoginModal } from "@/components/modals/LoginModal"
import { AddMovieModal } from "@/components/modals/AddMovieModal"
import { DuplicateModal } from "@/components/modals/DuplicateModal"
import { MovieDetailsModal } from "@/components/modals/MovieDetailsModal"
import { StreamingPopup } from "@/components/StreamingPopup"
import { AboutCredits } from "@/components/AboutCredits"
import { Footer } from "@/components/Footer"
import { useAuth } from "@/hooks/useAuth"
import { useMovies } from "@/hooks/useMovies"
import type { Movie } from "@/types/movie"
import '../cyberpunk.css'

export default function Home() {
  const { user, isLoggedIn } = useAuth()
  const {
    movies,
    stats,
    searchQuery,
    setSearchQuery,
    sortMovies,
    loadMovies,
    settings,
  } = useMovies()
  
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAddMovieModal, setShowAddMovieModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showMovieDetailsModal, setShowMovieDetailsModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [duplicateMovie, setDuplicateMovie] = useState<Movie | null>(null)
  const [duplicateMovieId, setDuplicateMovieId] = useState<number | null>(null)
  const [updatedExternalRatings, setUpdatedExternalRatings] = useState<{ [movieId: number]: { imdbRating: number; rtRating: number } }>({})
  const [streamingPopup, setStreamingPopup] = useState<{
    isVisible: boolean;
    streamingServices: any;
    movieTitle: string;
    position: { x: number; y: number };
  }>({
    isVisible: false,
    streamingServices: null,
    movieTitle: "",
    position: { x: 0, y: 0 }
  })
  const [movieRatings, setMovieRatings] = useState<{ [movieId: number]: number }>({})

  // Local filter state
  const [filter, setFilter] = useState("all")

  // Compute filtered movies locally
  const filtered = useMemo(() => {
    if (filter === "all") return movies
    if (filter === "watched") return movies.filter(m => m.watched)
    if (filter === "to-watch") return movies.filter(m => !m.watched)
    return movies
  }, [movies, filter])

  useEffect(() => {
    if (isLoggedIn) {
      loadMovies()
    }
  }, [isLoggedIn, loadMovies])

  const handleLoginClick = useCallback(() => {
    setShowLoginModal(true)
  }, [])

  const handleAddMovieClick = useCallback(() => {
    setShowAddMovieModal(true)
  }, [])

  const handleFilterChange = useCallback((filter: string) => {
    setFilter(filter)
  }, [])

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie)
    setShowMovieDetailsModal(true)
  }, [])

  const handleDuplicateMovie = useCallback((movie: Movie, movieId: number) => {
    setDuplicateMovie(movie)
    setDuplicateMovieId(movieId)
    setShowDuplicateModal(true)
  }, [])

  const handleExternalRatingsUpdated = useCallback((ratings: any) => {
    if (ratings && ratings.id) {
      setUpdatedExternalRatings(prev => ({
        ...prev,
        [ratings.id]: {
          imdbRating: ratings.imdbRating,
          rtRating: ratings.rtRating
        }
      }))
    }
  }, [])

  const handleStreamingPopup = useCallback((streamingServices: any, movieTitle: string, position: { x: number; y: number }) => {
    setStreamingPopup({
      isVisible: true,
      streamingServices,
      movieTitle,
      position
    })
  }, [])

  const handleRatingsUpdate = useCallback((movieId: number, rating: number) => {
    setMovieRatings((prev: any) => ({
      ...prev, 
      [movieId]: rating 
    }))
  }, [])

  return (
    <div>
      <div className="container">
        <Header onLoginClick={handleLoginClick} isLoggedIn={isLoggedIn} user={user} />

        <Stats stats={stats} />

        <h2 id="watchlist-title">{user ? "My Watchlist" : "Watchlist"}</h2>
        <br />

        <Controls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddMovieClick={handleAddMovieClick}
          showAddButton={isLoggedIn}
        />

        <FilterTabs currentFilter={filter} onFilterChange={handleFilterChange} onSortChange={sortMovies} />

        <MoviesGrid
          movies={filtered}
          isLoggedIn={isLoggedIn}
          isOwner={true}
          onMovieClick={handleMovieClick}
          onDuplicateMovie={handleDuplicateMovie}
          onMovieRemoved={loadMovies}
          updatedExternalRatings={updatedExternalRatings}
          onExternalRatingsUpdated={handleExternalRatingsUpdated}
          onStreamingPopup={handleStreamingPopup}
          movieRatings={movieRatings}
          onRatingsUpdate={handleRatingsUpdate}
        />

        <AboutCredits />

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

        <AddMovieModal
          isOpen={showAddMovieModal}
          onClose={() => setShowAddMovieModal(false)}
          onDuplicateMovie={(movie: { id: Movie }) => handleDuplicateMovie(movie, movie.id)}
          onMovieAdded={loadMovies}
          onExternalRatingsUpdated={handleExternalRatingsUpdated}
        />

        <DuplicateModal 
          isOpen={showDuplicateModal} 
          onClose={() => setShowDuplicateModal(false)} 
          movie={duplicateMovie}
          movieId={duplicateMovieId ?? 0}
          onMovieAdded={loadMovies}
          onExternalRatingsUpdated={handleExternalRatingsUpdated}
        />

        <MovieDetailsModal
          isOpen={showMovieDetailsModal}
          onClose={() => setShowMovieDetailsModal(false)}
          movie={selectedMovie}
          isOwner={true}
          movieRating={selectedMovie ? movieRatings[selectedMovie.id] : undefined}
          onRatingUpdate={handleRatingsUpdate}
          onMovieAdded={loadMovies}
          onExternalRatingsUpdated={handleExternalRatingsUpdated}
        />
      </div>
        <StreamingPopup 
          isVisible={streamingPopup.isVisible}
          streamingServices={streamingPopup.streamingServices}
          movieTitle={streamingPopup.movieTitle}
          position={streamingPopup.position}
          onClose={() => setStreamingPopup(prev => ({ ...prev, isVisible: false }))}
        />

      <Footer />
    </div>
  )
}
