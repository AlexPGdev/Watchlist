"use client"

import type { Movie } from "@/types/movie"
import { useMovieActions } from "@/hooks/useMovieActions"
import Button from "../button/Button"
import { useEffect, useState } from "react"

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
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
    } else {
      // Delay unmount for animation
      const timeout = setTimeout(() => setShow(false), 250)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

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

  if (!show && !isOpen) return null

  return (
    <div className={`modal show${isOpen ? " modal-fade-in" : " modal-fade-out"}`} onClick={onClose} id="duplicate-modal">
      <div className={`modal-content active${isOpen ? " modal-content-fade-in" : " modal-content-fade-out"}`} onClick={(e) => e.stopPropagation()}>
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
