"use client"

import { useState, useEffect, memo } from "react"
import type { Movie } from "@/types/movie"
import { useMovieActions } from "@/hooks/useMovieActions"
import { useMovies } from "@/hooks/useMovies"
import Button from "../button/Button"

interface AddMovieModalProps {
  isOpen: boolean
  onClose: () => void
  onDuplicateMovie: (movie: Partial<Movie>) => void
  onMovieAdded?: () => void
  onExternalRatingsUpdated?: (ratings: any) => void
}

interface SearchResult {
  id: number
  title: string
  release_date: string
  poster_path: string
  overview: string
}

export const AddMovieModal = memo(function AddMovieModal({ isOpen, onClose, onDuplicateMovie, onMovieAdded, onExternalRatingsUpdated }: AddMovieModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { useAddMovieToWatchlist, useGetAIRecommendations } = useMovieActions()
  const { movies } = useMovies()

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const debounceTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/movies/search?query=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()

        if (data.Error) {
          setSearchResults([])
        } else {
          setSearchResults(data.slice(0, 5))
        }
        setShowResults(true)
      } catch (error) {
        console.error("Error searching movies:", error)
      }
    }, 300)

    return () => clearTimeout(debounceTimeout)
  }, [searchQuery])

  const handleMovieSelect = async (movie: SearchResult) => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies/details?id=${movie.id}`)
      const movieDetails = await response.json()

      const newMovie: Partial<Movie> = {
        title: movieDetails.title,
        description: movieDetails.overview,
        watched: false,
        year: movieDetails.release_date.split("-")[0],
        genres: movieDetails.genres.map((g: any) => g.name),
        posterPath: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        imdbId: movieDetails.imdb_id,
        tmdbId: movieDetails.id,
        streamingServices: [],
        imdbRating: 0,
        rtRating: null,
      }

      if (movies.some((m) => m.imdbId && newMovie.imdbId && m.imdbId === newMovie.imdbId)) {
        onDuplicateMovie(newMovie);
        onClose();
        return;
      }

      await useAddMovieToWatchlist(newMovie, false, onExternalRatingsUpdated)
      onClose()
      setSearchQuery("")
      setShowResults(false)
      if (onMovieAdded) {
        onMovieAdded()
      }
    } catch (error) {
      if (error instanceof Error && error.message === "duplicate") {
        onDuplicateMovie((error as any).movie)
        onClose()
      } else {
        console.error("Error adding movie:", error)
      }
    }
  }

  const handleAIRecommendations = async () => {
    setIsLoading(true)
    try {
      await useGetAIRecommendations()
    } catch (error) {
      console.error("Error getting AI recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content active" onClick={(e) => e.stopPropagation()}>
        <h3>Add New Movie</h3>
        <div className="form-group">
          <label>Search Movie</label>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for a movie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {showResults && (
              <div className="search-results active">
                {searchResults.length === 0 ? (
                  <div className="search-result-item">No movies found</div>
                ) : (
                  searchResults.map((movie) => (
                    <div key={movie.id} className="search-result-item" onClick={() => handleMovieSelect(movie)}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        className="search-result-poster"
                        alt="🎬"
                      />
                      <div className="search-result-info">
                        <div className="search-result-title">{movie.title}</div>
                        <div className="search-result-year">{movie.release_date.split("-")[0]}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            <div style={{ width: "100%", textAlign: "end", fontSize: "15px" }}>
              Source:{" "}
              <a href="https://www.themoviedb.org" style={{ color: "white" }}>
                <img
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                  style={{ width: "80px", marginLeft: "5px" }}
                  alt="TMDB"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <Button
            onClick={handleAIRecommendations}
            disabled={isLoading}
          >
            AI Recommendations
          </Button>
          <Button variant="danger" onClick={onClose}>
            Cancel
          </Button>
        </div>

        {isLoading && (
          <div className="ai-loader" style={{ display: "flex" }}>
            <div className="loader-spinner"></div>
          </div>
        )}
      </div>
    </div>
  )
})
