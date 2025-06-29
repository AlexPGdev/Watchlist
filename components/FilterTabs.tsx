"use client"

import { memo, useCallback, useState, useEffect } from "react"
import Button from "./button/Button"
import { useSettings } from "@/hooks/useSettings"

interface FilterTabsProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
  onSortChange: (sort: string) => void
}

export const FilterTabs = memo(function FilterTabs({ currentFilter, onFilterChange, onSortChange }: FilterTabsProps) {
  const { settings, loading: settingsLoading, error: settingsError, updateGridSize, updateViewMode } = useSettings()
  const [currentView, setCurrentView] = useState<"grid" | "list">("list")

  useEffect(() => {
    if (settings?.view === 1) {
      setCurrentView("grid")
    } else if (settings?.view === 0) {
      setCurrentView("list")
    }
  }, [settings?.view])

  const gridSize = settings?.gridSize || 3

  const handleGridSizeIncrease = useCallback(() => {
    const newSize = gridSize + 1
    const gridSizeBtn = document.getElementById("movies-grid") as HTMLElement
    if (gridSizeBtn) {
      gridSizeBtn.classList.remove(`grid-size-${gridSize}`)
      gridSizeBtn.classList.add(`grid-size-${newSize}`)
    }
    updateGridSize(newSize)
  }, [gridSize, updateGridSize])

  const handleGridSizeDecrease = useCallback(() => {
    const newSize = gridSize - 1
    const gridSizeBtn = document.getElementById("movies-grid") as HTMLElement
    if (gridSizeBtn) {
      gridSizeBtn.classList.remove(`grid-size-${gridSize}`)
      gridSizeBtn.classList.add(`grid-size-${newSize}`)
    }
    updateGridSize(newSize)
  }, [gridSize, updateGridSize])

  const handleViewModeChange = useCallback((newMode: number) => {
    if(currentView === "list" && newMode === 0 || currentView === "grid" && newMode === 1) return
    newMode === 1 ? setCurrentView("grid") : setCurrentView("list")
    if(newMode === 1) {
      document.getElementById("movies-grid")?.classList.remove("movies-list")
      document.getElementById("movies-grid")?.classList.add("movies-grid")
    } else {
      document.getElementById("movies-grid")?.classList.remove("movies-grid")
      document.getElementById("movies-grid")?.classList.add("movies-list")
    }
    updateViewMode(newMode)
  }, [updateViewMode])
  

  if (settingsLoading) {
    return <div className="filter-tabs">Loading settings...</div>
  }
  if (settingsError) {
    return <div className="filter-tabs">Error loading settings: {settingsError}</div>
  }

  return (
    <div className="filter-tabs">
      <Button variant="filter" className={`${currentFilter === "all" ? "btn-filter-active" : ""}`} onClick={() => onFilterChange("all")}>
        All Movies
      </Button>
      <Button
        variant="filter"
        className={`${currentFilter === "to-watch" ? "btn-filter-active" : ""}`}
        onClick={() => onFilterChange("to-watch")}
      >
        To Watch
      </Button>
      <Button
        variant="filter"
        className={`${currentFilter === "watched" ? "btn-filter-active" : ""}`}
        onClick={() => onFilterChange("watched")}
      >
        Watched
      </Button>

      <div className="view-controls">
        <div className="sort-container">
          <div className="sort-wrapper">
            <select className="sort-select" onChange={(e) => onSortChange(e.target.value)} title="Sort movies">
              <option value="addeddate-asc">Added Date (Oldest)</option>
              <option value="addeddate-desc">Added Date (Newest)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="year-desc">Year (Newest)</option>
              <option value="year-asc">Year (Oldest)</option>
              <option value="rating-desc">IMDB Rating (High-Low)</option>
              <option value="rating-asc">IMDB Rating (Low-High)</option>
              <option value="watchdate-desc">Watch Date (Recent)</option>
              <option value="watchdate-asc">Watch Date (Oldest)</option>
            </select>
          </div>
        </div>

        <Button
          className={`view-btn ${currentView === "grid" ? "active" : ""}`}
          onClick={() => handleViewModeChange(1)}
          title="Grid View"
        >
          ⊞
        </Button>
        <Button
          className={`view-btn ${currentView === "list" ? "active" : ""}`}
          onClick={() => handleViewModeChange(0)}
          title="List View"
        >
          ≡
        </Button>

        <div className="grid-size-control">
          <Button
            className="grid-size-btn"
            onClick={handleGridSizeDecrease}
            title="Decrease Grid Size"
          >
            -
          </Button>
          <span id="grid-size-value">{gridSize}</span>
          <Button
            className="grid-size-btn"
            onClick={handleGridSizeIncrease}
            title="Increase Grid Size"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  )
})