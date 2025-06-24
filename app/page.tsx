"use client"

import { useEffect, useState } from "react"
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
    filteredMovies,
    stats,
    currentFilter,
    searchQuery,
    setSearchQuery,
    setCurrentFilter,
    sortMovies,
    loadMovies,
  } = useMovies()
  
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAddMovieModal, setShowAddMovieModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showMovieDetailsModal, setShowMovieDetailsModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [duplicateMovie, setDuplicateMovie] = useState<Movie | null>(null)
  const [updatedRatings, setUpdatedRatings] = useState<{ [movieId: number]: { imdbRating: number; rtRating: number } }>({})
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

  useEffect(() => {
    if (isLoggedIn) {
      loadMovies()
    }
  }, [isLoggedIn, loadMovies])

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setShowMovieDetailsModal(true)
  }

  const handleDuplicateMovie = (movie: Movie) => {
    setDuplicateMovie(movie)
    setShowDuplicateModal(true)
  }

  const handleRatingsUpdated = (ratings: any) => {
    if (ratings && ratings.id) {
      setUpdatedRatings(prev => ({
        ...prev,
        [ratings.id]: {
          imdbRating: ratings.imdbRating,
          rtRating: ratings.rtRating
        }
      }))
    }
  }

  const handleStreamingPopup = (streamingServices: any, movieTitle: string, position: { x: number; y: number }) => {
    setStreamingPopup({
      isVisible: true,
      streamingServices,
      movieTitle,
      position
    })
  }

  return (
    <div>
      <div className="container">
        <Header onLoginClick={() => setShowLoginModal(true)} isLoggedIn={isLoggedIn} user={user} />

        <Stats stats={stats} />

        <h2 id="watchlist-title">{user ? "My Watchlist" : "Watchlist"}</h2>
        <br />

        <Controls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddMovieClick={() => setShowAddMovieModal(true)}
          showAddButton={isLoggedIn}
        />

        <FilterTabs currentFilter={currentFilter} onFilterChange={setCurrentFilter} onSortChange={sortMovies} />

        <MoviesGrid
          movies={filteredMovies}
          isLoggedIn={isLoggedIn}
          isOwner={true}
          onMovieClick={handleMovieClick}
          onDuplicateMovie={handleDuplicateMovie}
          onMovieRemoved={loadMovies}
          updatedRatings={updatedRatings}
          onRatingsUpdated={handleRatingsUpdated}
          onStreamingPopup={handleStreamingPopup}
        />

        <AboutCredits />

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

        <AddMovieModal
          isOpen={showAddMovieModal}
          onClose={() => setShowAddMovieModal(false)}
          onDuplicateMovie={handleDuplicateMovie}
          onMovieAdded={loadMovies}
          onRatingsUpdated={handleRatingsUpdated}
        />

        <DuplicateModal isOpen={showDuplicateModal} onClose={() => setShowDuplicateModal(false)} movie={duplicateMovie} />

        <MovieDetailsModal
          isOpen={showMovieDetailsModal}
          onClose={() => setShowMovieDetailsModal(false)}
          movie={selectedMovie}
          isOwner={true}
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
