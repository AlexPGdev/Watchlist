"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, memo } from "react"
import type { Movie } from "@/types/movie"

interface MoviesContextType {
  movies: Movie[]
  filteredMovies: Movie[]
  stats: {
    total: number
    watched: number
    toWatch: number
  }
  currentFilter: string
  searchQuery: string
  setSearchQuery: (q: string) => void
  setCurrentFilter: (f: string) => void
  sortMovies: (s: string) => void
  loadMovies: () => Promise<void>
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined)

export const MoviesProvider = memo(function MoviesProvider({ children }: { children: React.ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [currentFilter, setCurrentFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentSort, setCurrentSort] = useState("addeddate-asc")

  function useDailyStreak(movies) {
    return useMemo(() => {
      if (!movies || movies.length === 0) return 0;
  
      const watchedDays = Array.from(
        new Set(
          movies
            .filter((m) => m.watched && m.watchDate)
            .map((m) => {
              const d = new Date(m.watchDate);
              d.setHours(0, 0, 0, 0);
              return d.getTime();
            })
        )
      );
  
      if (watchedDays.length === 0) return 0;
  
      let streak = 0;
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      let currentDay = new Date(today);
  
      if (!watchedDays.includes(today.getTime())) {
        currentDay.setDate(currentDay.getDate() - 1);
      }
  
      while (watchedDays.includes(currentDay.getTime())) {
        streak++;
        currentDay.setDate(currentDay.getDate() - 1);
      }
  
      return streak;
    }, [movies]);
  }

  const dailyStreak = useDailyStreak(movies);

  const stats = useMemo(
    () => ({
      total: movies.length,
      watched: movies.filter((m) => m.watched).length,
      toWatch: movies.filter((m) => !m.watched).length,
      dailyStreak,
    }),
    [movies, dailyStreak]
  );

  // const stats = {
  //   total: movies.length,
  //   watched: movies.filter((m) => m.watched).length,
  //   toWatch: movies.filter((m) => !m.watched).length,
  // }

  const loadMovies = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/page-movies", {
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json()
        setMovies(data || [])
      }
    } catch (error) {
      console.error("Error loading movies:", error)
    }
  }, [])

  const filterAndSortMovies = useCallback(() => {
    let filtered = movies

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply status filter
    if (currentFilter === "watched") {
      filtered = filtered.filter((m) => m.watched)
    } else if (currentFilter === "to-watch") {
      filtered = filtered.filter((m) => !m.watched)
    }

    // Apply sorting
    const [field, direction] = currentSort.split("-")
    const isAsc = direction === "asc"

    filtered.sort((a, b) => {
      let valueA: any, valueB: any

      switch (field) {
        case "title":
          valueA = a.title.toLowerCase()
          valueB = b.title.toLowerCase()
          break
        case "year":
          valueA = Number.parseInt(a.year) || 0
          valueB = Number.parseInt(b.year) || 0
          break
        case "rating":
          valueA = Number.parseFloat(a.imdbRating?.toString() || "0") || 0
          valueB = Number.parseFloat(b.imdbRating?.toString() || "0") || 0
          break
        case "watchdate":
          valueA = a.watchDate ? new Date(a.watchDate).getTime() : 0
          valueB = b.watchDate ? new Date(b.watchDate).getTime() : 0
          break
        case "addeddate":
          valueA = a.addedDate ? new Date(a.addedDate).getTime() : 0
          valueB = b.addedDate ? new Date(b.addedDate).getTime() : 0
          break
        default:
          return 0
      }

      if (valueA < valueB) return isAsc ? -1 : 1
      if (valueA > valueB) return isAsc ? 1 : -1
      return 0
    })

    setFilteredMovies(filtered)
  }, [movies, searchQuery, currentFilter, currentSort])

  useEffect(() => {
    filterAndSortMovies()
  }, [filterAndSortMovies])

  const sortMovies = (sort: string) => {
    setCurrentSort(sort)
  }

  const value = useMemo<MoviesContextType>(() => ({
    movies,
    filteredMovies,
    stats,
    currentFilter,
    searchQuery,
    setSearchQuery,
    setCurrentFilter,
    sortMovies,
    loadMovies,
    setMovies,
  }), [movies, filteredMovies, currentFilter, searchQuery, currentSort, setMovies])

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>
})

export function useMovies() {
  const context = useContext(MoviesContext)
  if (!context) {
    throw new Error("useMovies must be used within a MoviesProvider")
  }
  return context
}
