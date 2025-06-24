"use client"

import type React from "react"

import { useState } from "react"
import type { Movie } from "@/types/movie"
import { useMovieActions } from "@/hooks/useMovieActions"
import Button from "./button/Button"

// import imdb from "@/img/streaming-services/imdb.svg"
// import rt from "@/img/streaming-services/rt.png"

interface MovieCardProps {
  movie: Movie
  isOwner: boolean
  isLoggedIn: boolean
  onClick: () => void
  onDuplicateMovie: (movie: Movie) => void
  onMovieRemoved?: () => void
  updatedRatings?: { [movieId: number]: { imdbRating: number; rtRating: number } }
  onStreamingPopup?: (streamingServices: any, movieTitle: string, position: { x: number; y: number }) => void
}

export function MovieCard({ movie, isOwner, isLoggedIn, onClick, onDuplicateMovie, onMovieRemoved, updatedRatings, onStreamingPopup }: MovieCardProps) {
  const { useToggleWatched, useRemoveMovie, useRateMovie, useAddToWatchlist } = useMovieActions()
  const [isRemoving, setIsRemoving] = useState(false)
  const [toggleWatched, setToggleWatched] = useState(movie.watched);
  const [selectedRating, setSelectedRating] = useState(movie.rating ?? -1);

  // Get the current ratings (either from updatedRatings or from movie)
  const currentRatings = updatedRatings?.[movie.id] || { imdbRating: movie.imdbRating, rtRating: movie.rtRating };
  
  // Check if ratings are loading (imdbRating is 0 or rtRating is null)
  const isRatingsLoading = currentRatings.imdbRating === 0 || currentRatings.rtRating === null;

  const handleToggleWatched = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setToggleWatched(!toggleWatched);
    await useToggleWatched(movie.id)
  }

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRemoving(true)
    setTimeout(async () => {
      try {
        await useRemoveMovie(movie.id)
        if (onMovieRemoved) {
          onMovieRemoved()
        }
      } catch (error) {
        console.error("Error removing movie:", error)
        setIsRemoving(false)
      }
    }, 300)
  }

  const handleStreamingAvailability = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const button = e.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()
    
    try {
      const response = await fetch(`http://localhost:8080/api/movies/streaming-availability?id=${movie.tmdbId}`)
      const data = await response.json()
      if (onStreamingPopup) {
        onStreamingPopup(data, movie.title, { x: rect.right + 10 + window.scrollX, y: rect.top + window.scrollY })
      }
    } catch (error) {
      console.error("Error fetching streaming services:", error)
    }
  }

  const handleRate = async (e: React.MouseEvent, rating: number) => {
    e.stopPropagation();

    if (selectedRating === rating) {
      setSelectedRating(-1);
      await useRateMovie(movie.id, -1);
    } else {
      setSelectedRating(rating);
      await useRateMovie(movie.id, rating);
    }
  };

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await useAddToWatchlist(movie.tmdbId)
      e.currentTarget.setAttribute("disabled", "true")
      e.currentTarget.textContent = "Added to Watchlist"
    } catch (error) {
      console.log(error)
      if (error === "duplicate") {
        onDuplicateMovie(movie)
      }
    }
  }

  const formatWatchDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-GB")
  }

  return (
    <div className={`movie-card ${toggleWatched ? "watched" : ""} ${isRemoving ? "removing" : ""}`} onClick={onClick}>
      {toggleWatched && (
        <div className="watched-badge">
          ✓ Watched on {movie.watchDate ? formatWatchDate(movie.watchDate) : formatWatchDate(Date.now())}
        </div>
      )}

      <div className="movie-header">
        <div className="movie-poster">
          <img src={movie.posterPath || "/placeholder.svg"} alt={movie.title} />
        </div>
        <div className="movie-info">
          <div className="movie-title" title={movie.title}>
            {movie.title}
          </div>
          <div className="movie-year">{movie.year}</div>
          <div className="movie-genres">
            {movie.genres.map((genre) => (
              <span key={genre} className="genre-tag" title={genre}>
                {genre}
              </span>
            ))}
          </div>

          <button className="movie-external-ratings" data-movie-imdbid="${movie.imdbId}">
              <span className="imdbRating">
                <img src="/imdb.svg"></img> 
                {isRatingsLoading ? ( <div className ='rating-loader-spinner' style={{ marginBottom: 0, width: "20px", height: "20px" }}></div> ) : currentRatings.imdbRating}/10
              </span>
              <span className="rtRating">
                <img src={"/rt.png"}></img> 
                {isRatingsLoading ? ( <div className ='rating-loader-spinner' style={{ marginBottom: 0, width: "20px", height: "20px" }}></div> ) : currentRatings.rtRating}
              </span>
          </button>

          <div className="movie-streaming-service">
              <Button id="watch-movie-btn" onClick={handleStreamingAvailability}><span>🎬</span><p>Watch</p></Button>
          </div>

          {toggleWatched && (
            <div className="movie-ratings">
              {selectedRating === -1 ? (
                <>
                  <button
                    className="rating-btn"
                    onClick={(e) => handleRate(e, 0)}
                    disabled={!isOwner}
                  >
                    <span>👎</span>
                  </button>
                  <button
                    className="rating-btn"
                    onClick={(e) => handleRate(e, 1)}
                    disabled={!isOwner}
                  >
                    <span>👍</span>
                  </button>
                  <button
                    className="rating-btn"
                    onClick={(e) => handleRate(e, 2)}
                    disabled={!isOwner}
                  >
                    <span>❤️</span>
                  </button>
                </>
              ) : (
                // Show only the selected one
                <button
                  className="rating-btn selected"
                  onClick={(e) => handleRate(e, selectedRating)}
                  disabled={!isOwner}
                >
                  <span>
                    {selectedRating === 0 && '👎'}
                    {selectedRating === 1 && '👍'}
                    {selectedRating === 2 && '❤️'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="movie-description">{movie.description}</div>

      <div className="movie-actions">
        {isOwner && (
          <>
            <Button onClick={handleToggleWatched}>
              {toggleWatched ? "Mark Unwatched" : "Mark Watched"}
            </Button>
            <Button variant="danger" onClick={handleRemove}>
              Remove
            </Button>
          </>
        )}
        {!isOwner && isLoggedIn && (
          <Button onClick={handleAddToWatchlist}>
            Add to Watchlist
          </Button>
        )}
      </div>
    </div>
  )
}
