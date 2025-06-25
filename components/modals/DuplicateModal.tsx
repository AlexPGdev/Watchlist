"use client"

import type { Movie } from "@/types/movie"
import { useMovieActions } from "@/hooks/useMovieActions"
import Button from "../button/Button"

interface DuplicateModalProps {
  isOpen: boolean
  onClose: () => void
  movie: Movie | null
  movieId: number
  onMovieAdded?: () => void
  onExternalRatingsUpdated?: (ratings: any) => void
}

export function DuplicateModal({ isOpen, onClose, movie, movieId, onMovieAdded, onExternalRatingsUpdated} : DuplicateModalProps) {
  const { useAddMovieToWatchlist } = useMovieActions()

  const handleForceAdd = async () => {
    if (movie) {
      console.log(movie)
      console.log(movieId)
      console.log("ADSAADASD")
      let movieCardButton = document.querySelector(`[data-movie-id="${movieId}"] > .movie-actions > button`)
      movieCardButton?.setAttribute("disabled", "true")
      if (movieCardButton) movieCardButton.textContent = "Added to Watchlist"
      try {
        await useAddMovieToWatchlist(movie, true, onExternalRatingsUpdated)
        onClose()
        if (onMovieAdded) {
          onMovieAdded()
        }
      } catch (error) {
        console.error("Error force adding movie:", error)
      }
    }
  }

  console.log(movie)

  if (!isOpen) return null

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content active" onClick={(e) => e.stopPropagation()}>
        <h3>Duplicate Movie</h3>
        <p>This movie is already in your watchlist</p>
        <div className="modal-actions" style={{ marginTop: "10px" }}>
          <Button variant="danger" onClick={onClose}>
            Don't Add
          </Button>
          <Button onClick={handleForceAdd}>
            Add Anyway
          </Button>
        </div>
      </div>
    </div>
  )
}
