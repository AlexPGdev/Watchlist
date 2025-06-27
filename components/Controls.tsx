"use client"

import { memo } from "react"
import Button from "./button/Button"

interface ControlsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddMovieClick: () => void
  showAddButton: boolean
}

export const Controls = memo(function Controls({ searchQuery, onSearchChange, onAddMovieClick, showAddButton }: ControlsProps) {
  return (
    <div className="controls">
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {showAddButton && (
        <Button variant="main" onClick={onAddMovieClick}>
          + Add Movie
        </Button>
      )}
    </div>
  )
})
