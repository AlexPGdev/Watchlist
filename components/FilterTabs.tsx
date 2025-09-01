"use client"

import { memo, useCallback, useState, useEffect } from "react"
import Button from "./button/Button"
import { useSettings } from "@/hooks/useSettings"
import { useMovieActions } from "@/hooks/useMovieActions"

interface FilterTabsProps {
  isOwner: boolean
  currentFilter: string
  currentSort: string
  onFilterChange: (filter: string) => void
  onSortChange: (sort: string) => void
  selectedMoviesList?: number[]
}

export const FilterTabs = memo(function FilterTabs({ isOwner, currentFilter, currentSort, onFilterChange, onSortChange, selectedMoviesList }: FilterTabsProps) {
  const { settings, loading: settingsLoading, error: settingsError, updateGridSize, updateViewMode } = useSettings()
  const { removeAllMovies } = useMovieActions()
  const [currentView, setCurrentView] = useState<"grid" | "list">("list")

  const seen = new Set();
  selectedMoviesList = selectedMoviesList?.filter(item => {
    if(seen.has(item)) return false;
    seen.add(item);
    return true;
  })

  useEffect(() => {
    if (settings?.view === 1) {
      setCurrentView("grid")
    } else if (settings?.view === 0) {
      setCurrentView("list")
    }
  }, [settings?.view])

  const gridSize = settings?.gridSize || 3

  const handleGridSizeIncrease = useCallback(() => {
    const newSize = parseInt(gridSize) + 1
    const gridSizeBtn = document.getElementById("movies-grid") as HTMLElement
    const gridSizeBtn2 = document.getElementById("movies-grid2") as HTMLElement

    if (gridSizeBtn) {
      gridSizeBtn.classList.remove(`grid-size-${gridSize}`)
      gridSizeBtn.classList.add(`grid-size-${newSize}`)
    }

    if (gridSizeBtn2) {
      gridSizeBtn2.classList.remove(`grid-size-${gridSize}`)
      gridSizeBtn2.classList.add(`grid-size-${newSize}`)
    }

    updateGridSize(newSize)
  }, [gridSize, updateGridSize])

  const handleGridSizeDecrease = useCallback(() => {
    const newSize = parseInt(gridSize) - 1
    const gridSizeBtn = document.getElementById("movies-grid") as HTMLElement
    const gridSizeBtn2 = document.getElementById("movies-grid2") as HTMLElement

    if (gridSizeBtn) {
    gridSizeBtn.classList.remove(`grid-size-${gridSize}`)
      gridSizeBtn.classList.add(`grid-size-${newSize}`)
    }
    if (gridSizeBtn2) {
      gridSizeBtn2.classList.remove(`grid-size-${gridSize}`)
      gridSizeBtn2.classList.add(`grid-size-${newSize}`)
    }

    updateGridSize(newSize)
  }, [gridSize, updateGridSize])

  const handleViewModeChange = useCallback((newMode: number) => {
    if(currentView === "list" && newMode === 0 || currentView === "grid" && newMode === 1) return
    newMode === 1 ? setCurrentView("grid") : setCurrentView("list")
    if(newMode === 1) {
      document.getElementById("movies-grid")?.classList.remove("movies-list")
      document.getElementById("movies-grid")?.classList.add("movies-grid")

      document.getElementById("movies-grid2")?.classList.remove("movies-list")
      document.getElementById("movies-grid2")?.classList.add("movies-grid")
    } else {
      document.getElementById("movies-grid")?.classList.remove("movies-grid")
      document.getElementById("movies-grid")?.classList.add("movies-list")

      document.getElementById("movies-grid2")?.classList.remove("movies-grid")
      document.getElementById("movies-grid2")?.classList.add("movies-list")
    }
    updateViewMode(newMode)
  }, [updateViewMode])

  const handleRemoveAllMovies = useCallback(() => {
    alert("Are you sure you want to remove all movies? This action cannot be undone.")
    if (!confirm("Are you sure you want to remove all movies? This action cannot be undone.")) return
    removeAllMovies()
  }, [removeAllMovies])
  
  const handleWatched = useCallback(() => {
    let moviesGridElement = document.querySelector('#movies-grid-watched > div:nth-child(1) > div.watched-header') as HTMLElement
    window.scrollTo({ behavior: 'smooth', top: moviesGridElement?.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 70 })
  }, [])

  const handleToWatch = () => {
    let moviesGridElement = document.querySelector("#movies-grid-watched > div:nth-child(2) > div.watched-header") as HTMLElement
    window.scrollTo({ behavior: 'smooth', top: moviesGridElement?.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 70 })
  }

  if (settingsLoading) {
    return <div className="filter-tabs">Loading settings...</div>
  }
  if (settingsError) {
    return <div className="filter-tabs">Error loading settings: {settingsError}</div>
  }

  return (
    <div className="filter-tabs">
      {/* <Button variant="filter" className={`${currentFilter === "all" ? "btn-filter-active" : ""}`} onClick={() => onFilterChange("all")}>
        All Movies
      </Button> */}
      <Button
        variant="filter"
        className={`${currentFilter === "watched" ? "btn-filter-active" : ""}`}
        id="watched-btn"
        // onClick={() => onFilterChange("watched")}
        onClick={handleWatched}
      >
        Watched
      </Button>
      <Button
        variant="filter"
        id="to-watch-btn"
        className={`${currentFilter === "to-watch" ? "btn-filter-active" : ""}`}
        // onClick={() => onFilterChange("to-watch")}
        onClick={handleToWatch}
      >
        To Watch
      </Button>
      {isOwner && (
        <Button variant="danger" onClick={handleRemoveAllMovies} style={{ marginLeft: "1rem" }}>
          Remove All Movies
        </Button>
      )}
      <div>
        Selected {selectedMoviesList?.length || 0} movies
      </div>

      <div className="view-controls">
        <div className="sort-container">
          <div className="sort-wrapper">
            <select className="sort-select" value={currentSort} onChange={(e) => onSortChange(e.target.value)} title="Sort movies">
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
            disabled={parseInt(settings?.view) === 0 || parseInt(settings?.gridSize) === 2}
          >
            -
          </Button>
          <span id="grid-size-value" aria-disabled={parseInt(settings?.view) === 0}>{gridSize}</span>
          <Button
            className="grid-size-btn"
            onClick={handleGridSizeIncrease}
            title="Increase Grid Size"
            disabled={parseInt(settings?.view) === 0 || parseInt(settings?.gridSize) === 5}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  )
})