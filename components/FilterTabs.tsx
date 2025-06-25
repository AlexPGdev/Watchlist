"use client"

import { memo, useState } from "react"
import Button from "./button/Button"

interface FilterTabsProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
  onSortChange: (sort: string) => void
}

export const FilterTabs = memo(function FilterTabs({ currentFilter, onFilterChange, onSortChange }: FilterTabsProps) {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")
  const [gridSize, setGridSize] = useState(3)

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
          onClick={() => setCurrentView("grid")}
          title="Grid View"
        >
          ⊞
        </Button>
        <Button
          className={`view-btn ${currentView === "list" ? "active" : ""}`}
          onClick={() => setCurrentView("list")}
          title="List View"
        >
          ≡
        </Button>

        <div className="grid-size-control">
          <Button
            className="grid-size-btn"
            onClick={() => setGridSize(Math.max(2, gridSize - 1))}
            title="Decrease Grid Size"
          >
            -
          </Button>
          <span id="grid-size-value">{gridSize}</span>
          <Button
            className="grid-size-btn"
            onClick={() => setGridSize(Math.min(5, gridSize + 1))}
            title="Increase Grid Size"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  )
})