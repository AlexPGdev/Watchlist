"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
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
import { useAuth } from "@/hooks/useAuth"
import { useUserMovies } from "@/hooks/useUserMovies"
import type { Movie } from "@/types/movie"
import '../../cyberpunk.css'
import { Footer } from "@/components/Footer"

export default function UserProfile() {
  const params = useParams()
  const username = params.username as string
  const { user, isLoggedIn } = useAuth()
  const {
    movies,
    filteredMovies,
    stats,
    currentFilter,
    searchQuery,
    setSearchQuery,
    // setCurrentFilter,
    sortMovies,
    loadUserMovies,
    error,
    ownerName,
  } = useUserMovies(username)

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAddMovieModal, setShowAddMovieModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showMovieDetailsModal, setShowMovieDetailsModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [duplicateMovie, setDuplicateMovie] = useState<Movie | null>(null)
  const [duplicateMovieId, setDuplicateMovieId] = useState<number | null>(null)
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

  const isOwner = user === username

  useEffect(() => {
    loadUserMovies()
  }, [username, loadUserMovies])

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setShowMovieDetailsModal(true)
  }

  const handleDuplicateMovie = (movie: Movie, movieId: number) => {
    setDuplicateMovie(movie)
    setDuplicateMovieId(movieId)
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

  if (error === "notFound") {
    return (
      <div className="container">
        <Header onLoginClick={() => setShowLoginModal(true)} isLoggedIn={isLoggedIn} user={user} />
        <div style={{ textAlign: "center", color: "#b8b8d1", padding: "2rem" }}>
          User <strong>{username}</strong> not found.
        </div>
      </div>
    )
  }

  if (error === "notPublic") {
    return (
      <div className="container">
        <Header onLoginClick={() => setShowLoginModal(true)} isLoggedIn={isLoggedIn} user={user} />
        <div style={{ textAlign: "center", color: "#b8b8d1", padding: "2rem" }}>
          User <strong>{username}</strong> has not made their page public.
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="container">
        <Header onLoginClick={() => setShowLoginModal(true)} isLoggedIn={isLoggedIn} user={user} />

        <Stats stats={stats} />

        <h2 id="watchlist-title">{isOwner ? "My Watchlist" : `${ownerName}'s Watchlist`}</h2>
        <br />

        <Controls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddMovieClick={() => setShowAddMovieModal(true)}
          showAddButton={isOwner}
        />

        <FilterTabs currentFilter={currentFilter} onSortChange={sortMovies} />

        <MoviesGrid
          movies={filteredMovies}
          isLoggedIn={isLoggedIn}
          isOwner={isOwner}
          onMovieClick={handleMovieClick}
          onDuplicateMovie={handleDuplicateMovie}
          onMovieRemoved={loadUserMovies}
          updatedExternalRatings={updatedRatings}
          onRatingsUpdated={handleRatingsUpdated}
          onStreamingPopup={handleStreamingPopup}
        />

        <AboutCredits />

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

        {isOwner && (
          <AddMovieModal
            isOpen={showAddMovieModal}
            onClose={() => setShowAddMovieModal(false)}
            onDuplicateMovie={handleDuplicateMovie}
            onMovieAdded={loadUserMovies}
            onRatingsUpdated={handleRatingsUpdated}
          />
        )}

        <DuplicateModal
          isOpen={showDuplicateModal} 
          onClose={() => setShowDuplicateModal(false)} 
          movie={duplicateMovie}
          movieId={duplicateMovieId}
          />

        <MovieDetailsModal
          isOpen={showMovieDetailsModal}
          onClose={() => setShowMovieDetailsModal(false)}
          movie={selectedMovie}
          isOwner={isOwner}
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
