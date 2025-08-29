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
import { ContextMenu } from "@/components/ContextMenu"

export default function Home() {
  const { user, isLoggedIn } = useAuth()
  const {
    movies,
    stats,
    searchQuery,
    setSearchQuery,
    loadMovies
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
  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    streamingServices: any;
    movie: Movie;
    position: { x: number; y: number };
  }>({
    isVisible: false,
    streamingServices: null,
    movie: null,
    position: { x: 0, y: 0 }
  })
  const [movieRatings, setMovieRatings] = useState<{ [movieId: number]: number }>({})

  const [currentSort, setCurrentSort] = useState("addeddate-asc")
  const [filter, setFilter] = useState("all")

  // Compute filtered movies locally
  const filtered = useMemo(() => {
    let result = [...movies];
    if (filter === "watched") result = result.filter(m => m.watched)
    else if (filter === "to-watch") result = result.filter(m => !m.watched)
    if (searchQuery && searchQuery.trim() !== "") {
      result = result.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    console.log('aa')
    if (currentSort === "addeddate-asc") {
      result.sort((a, b) => {
        const aTime = a.addedDate ? new Date(a.addedDate).getTime() : 0;
        const bTime = b.addedDate ? new Date(b.addedDate).getTime() : 0;
        return aTime - bTime;
      });
    } else if (currentSort === "addeddate-desc") {
      result.sort((a, b) => {
        const aTime = a.addedDate ? new Date(a.addedDate).getTime() : 0;
        const bTime = b.addedDate ? new Date(b.addedDate).getTime() : 0;
        return bTime - aTime;
      });
    } else if (currentSort === "title-asc") {
      result.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
    } else if (currentSort === "title-desc") {
      result.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()))
    } else if (currentSort === "year-desc") {
      result.sort((a, b) => Number(b.year) - Number(a.year))
    } else if (currentSort === "year-asc") {
      result.sort((a, b) => Number(a.year) - Number(b.year))
    } else if (currentSort === "rating-desc") {
      result.sort((a, b) => Number(b.imdbRating) - Number(a.imdbRating))
    } else if (currentSort === "rating-asc") {
      result.sort((a, b) => Number(a.imdbRating) - Number(b.imdbRating))
    } else if (currentSort === "watchdate-desc") {
      result.sort((a, b) => {
        const aTime = a.watchDate ? new Date(a.watchDate).getTime() : 0;
        const bTime = b.watchDate ? new Date(b.watchDate).getTime() : 0;
        return bTime - aTime;
      });
    } else if (currentSort === "watchdate-asc") {
      result.sort((a, b) => {
        const aTime = a.watchDate ? new Date(a.watchDate).getTime() : 0;
        const bTime = b.watchDate ? new Date(b.watchDate).getTime() : 0;
        return aTime - bTime;
      });
    }

    console.log("SORTED!!!")
    return result;

  }, [movies, filter, searchQuery, currentSort])

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

  const handleSearchChange = useCallback((searchQuery: string) => {
    setSearchQuery(searchQuery)
  }, [])

  const handleFilterChange = useCallback((filter: string) => {
    setFilter(filter)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    console.log(sort)
    setCurrentSort(sort)
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

  const handleContextMenu = useCallback((movieId: number, movie: Movie, position: { x: number; y: number }) => {
    setContextMenu({
      isVisible: true,
      streamingServices: null,
      movie: movie,
      position: position
    })
  }, [])

  const handlePageClick = useCallback(() => {
    console.log("ALMNDKANFJWBJFRBAJKWBFJRKBWJFRBAHJ")
    setContextMenu({
      isVisible: false,
      streamingServices: null,
      movie: null,
      position: { x: 0, y: 0 }
    })

    setStreamingPopup({
      isVisible: false,
      streamingServices: null,
      movieTitle: "",
      position: { x: 0, y: 0 }
    })
  }, [])

  const handleScroll = () => {
    let watchedGridElement = document.getElementById('watchedHeader') as HTMLElement
    let toWatchGridElement = document.getElementById('toWatchHeader') as HTMLElement

    let watchedButton = document.getElementById('watched-btn') as HTMLElement
    let toWatchButton = document.getElementById('to-watch-btn') as HTMLElement

    if (Math.abs(document.body.getBoundingClientRect().top) > toWatchGridElement?.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 70) {
      toWatchButton?.classList.add('btn-filter-active')
      watchedButton?.classList.remove('btn-filter-active')
    } else {
      toWatchButton?.classList.remove('btn-filter-active')
      watchedButton?.classList.add('btn-filter-active')
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)
  }, [])


  return (
    <div>
      <div className="container" onClick={handlePageClick}>
        <Header onLoginClick={handleLoginClick} isLoggedIn={isLoggedIn} user={user} />

        <Stats stats={stats} />

        <h2 id="watchlist-title">{user ? "My Watchlist" : "Watchlist"}</h2>
        <br />

        <Controls
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onAddMovieClick={handleAddMovieClick}
          showAddButton={isLoggedIn}
        />

        <FilterTabs isOwner={true} currentFilter={filter} currentSort={currentSort} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />

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
          onLoginClick={handleLoginClick}
          onContextMenu={handleContextMenu}
        />

        <AboutCredits />

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

        <AddMovieModal
          isOpen={showAddMovieModal}
          onClose={() => setShowAddMovieModal(false)}
          onDuplicateMovie={(movie: Partial<Movie>) => handleDuplicateMovie(movie as Movie, (movie as Movie).id)}
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
          onDuplicateMovie={handleDuplicateMovie}
        />
      </div>
        <StreamingPopup 
          isVisible={streamingPopup.isVisible}
          streamingServices={streamingPopup.streamingServices}
          movieTitle={streamingPopup.movieTitle}
          position={streamingPopup.position}
          onClose={() => setStreamingPopup(prev => ({ ...prev, isVisible: false }))}
        />

        <ContextMenu 
          isVisible={contextMenu.isVisible}
          movie={contextMenu.movie}
          position={contextMenu.position}
          onMovieRemoved={loadMovies}
          onClose={() => setContextMenu(prev => ({ ...prev, isVisible: false }))}
        />

      <Footer />
    </div>
  )
}
