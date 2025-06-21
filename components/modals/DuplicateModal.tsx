"use client"

import type { Movie } from "@/types/movie"
import { useMovieActions } from "@/hooks/useMovieActions"

interface DuplicateModalProps {
  isOpen: boolean
  onClose: () => void
  movie: Movie | null
}

export function DuplicateModal({ isOpen, onClose, movie }: DuplicateModalProps) {
  const { addMovieToWatchlist } = useMovieActions()

  const handleForceAdd = async () => {
    if (movie) {
      try {
        await addMovieToWatchlist(movie, true) // Force add
        onClose()
      } catch (error) {
        console.error("Error force adding movie:", error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content active" onClick={(e) => e.stopPropagation()}>
        <h3>Duplicate Movie</h3>
        <p>This movie is already in your watchlist</p>
        <div className="modal-actions" style={{ marginTop: "10px" }}>
          <button className="modal-action-btn remove-btn" onClick={onClose}>
            Don't Add
          </button>
          <button className="modal-action-btn watch-btn" onClick={handleForceAdd}>
            Add Anyway
          </button>
        </div>
      </div>
    </div>
  )
}
