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
  const [show, setShow] = useState(false)
  const [ AIRecommendation, setAIRecommendation ] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
    } else {
      // Delay unmount for animation
      const timeout = setTimeout(() => setShow(false), 250)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

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
        setAIRecommendation(null)
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
      const response = await fetch("http://localhost:8080/api/movies/recommendations", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to get AI recommendations")
      }

      const data = await response.json()
      console.log(data)
      setAIRecommendation(data)

      setIsLoading(false)
    } catch (error) {
      console.error("Error getting AI recommendations:", error)
    }
  }

  if (!show && !isOpen) return null

  return (
    <div className={`modal show${isOpen ? " modal-fade-in" : " modal-fade-out"}`} onClick={onClose} id="add-movie-modal">
      <div className={`modal-content active${isOpen ? " modal-content-fade-in" : " modal-content-fade-out"}`} onClick={(e) => e.stopPropagation()}>
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
        {AIRecommendation && (
          <div className="movie-cards-container" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
            {/* <h3>AI Recommendation</h3> */}
            {AIRecommendation.slice(0, 3).map((movie: any) => (
              <div className="movie-card" style={{ padding: "0.5rem", width: "165px", height: "230px", cursor: "pointer" }} key={movie.id} onClick={() => handleMovieSelect(movie)}>
                <div className="movie-poster" style={{width: "100px", height: "150px", marginLeft: "auto", marginRight: "auto" }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                  ></img>
                </div>
                <div className="movie-info">
                  <div className="movie-title" style={{ fontSize: "0.9rem", marginTop: "20px", lineHeight: "18px", marginBottom: "5px" }}>{movie.title}</div>
                  <div className="movie-year" style={{ fontSize: "0.8rem" }}>{movie.release_date.split("-")[0]}</div>
                </div>
              </div>
            ))}
            
            {/* {AIRecommendation.map((movie: any) => (
              <div className="ai-recommendation-movie" key={movie.id}>
                <div className="ai-recommendation-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                  ></img>
                </div>
                <div className="ai-recommendation-info">
                  <div className="ai-recommendation-title">{movie.title}</div>
                  <div className="ai-recommendation-year">{movie.release_date.split("-")[0]}</div>
                </div>
              </div>
            ))} */}
          </div>
        )}
      </div>
    </div>
  )
})
