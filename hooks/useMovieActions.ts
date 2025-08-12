"use client"

import type { Movie } from "@/types/movie"
import { getColor } from "color-thief-react"

export function useMovieActions() {
  const useToggleWatched = async (movieId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies/${movieId}/watch`, {
        method: "PATCH",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to update watch status")
      }

      // Trigger a page reload or state update
      //window.location.reload()
    } catch (error) {
      console.error("Error toggling watched status:", error)
    }
  }

  const removeAllMovies = async () => {
    try {
      console.log("ASMLDFNANKRFAJ")
      const response = await fetch(`http://localhost:8080/api/movies`, {
        method: "GET",
        credentials: "include",
      }).then(function(response) {
        return response.json()
      }).then(function(data) {
        console.log(data)
        data.forEach(m => {
          fetch(`http://localhost:8080/api/movies/${m.id}`, {
            method: "DELETE",
            credentials: "include",
          })
        })
        return data
      })

      if (!response.ok) {
        throw new Error("Failed to remove movie")
      }

      // Trigger a page reload or state update
      //window.location.reload()
    } catch (error) {
      console.error("Error removing all movies:", error)
    }
  }

  const useRemoveMovie = async (movieId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies/${movieId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to remove movie")
      }

      // Trigger a page reload or state update
      //window.location.reload()
    } catch (error) {
      console.error("Error removing movie:", error)
    }
  }

  const useRateMovie = async (movieId: number, rating: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies/${movieId}/rating?rating=${rating}`, {
        method: "PATCH",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to rate movie")
      }

    } catch (error) {
      console.error("Error rating movie:", error)
    }
  }

  const loadAmbientColor = async (movieId: number, posterPath: string) => {

    getColor(`/api/proxy-image?url=https://image.tmdb.org/t/p/w500/${posterPath}`, "rgbArray").then( async (data) => {
      await fetch(`http://localhost:8080/api/movies/ambient-color?id=${movieId}&color=${data}`, {
        method: "PATCH",
        credentials: "include",
      })

      let movieCard = document.querySelector(`[data-movie-id="${movieId}"]`) as HTMLElement

      if(movieCard) movieCard.style.backgroundColor = `rgba(${data},0.3)`

    })

  }

  const loadExtraDetails = async (movieId: number, imdbId: string, posterPath: string, onRatingsUpdated?: (ratings: any) => void) => {
    getColor(`/api/proxy-image?url=https://image.tmdb.org/t/p/w500/${posterPath}`, "rgbArray").then( async (data) => {

      await fetch(`http://localhost:8080/api/movies/ambient-color?id=${movieId}&color=${data}`, {
        method: "PATCH",
        credentials: "include",
      })

      let movieCard = document.querySelector(`[data-movie-id="${movieId}"]`) as HTMLElement

      if(movieCard) movieCard.style.backgroundColor = `rgba(${data},0.3)`

      try {
        const response = await fetch(`http://localhost:8080/api/movies/ratings?imdbId=${imdbId}&id=${movieId}`, {
          credentials: "include",
          method: "PATCH"
        })
        const ratings = await response.json()
        
        // Call the callback if provided
        if (onRatingsUpdated) {
          onRatingsUpdated(ratings)
        }
        
        return ratings
      } catch (error) {
        console.error("Error loading external ratings:", error)
        throw error
      }

    })
  }

  const loadExternalRatings = async (movieImdbId: string, movieId: number, onRatingsUpdated?: (ratings: any) => void) => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies/ratings?imdbId=${movieImdbId}&id=${movieId}`, {
        credentials: "include",
        method: "PATCH"
      })
      const ratings = await response.json()
      
      // Call the callback if provided
      if (onRatingsUpdated) {
        onRatingsUpdated(ratings)
      }
      
      return ratings
    } catch (error) {
      console.error("Error loading external ratings:", error)
      throw error
    }
  }

  const useAddMovieToWatchlist = async (movie: Partial<Movie>, force = false, onRatingsUpdated?: (ratings: any) => void) => {
    console.log(movie)
    try {
      const response = await fetch("http://localhost:8080/api/movies", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...movie, force }),
      })

      if (!response.ok) {
        if (response.status === 409) {
          const error = new Error("duplicate") as any
          error.movie = movie
          throw error
        }
        throw new Error("Failed to add movie")
      }

      
      const addedMovie = await response.json()

      loadExtraDetails(addedMovie.id, addedMovie.imdbId, addedMovie.posterPath, onRatingsUpdated)

      // loadAmbientColor(addedMovie.id, addedMovie.posterPath)

      // loadExternalRatings(addedMovie.imdbId, addedMovie.id, onRatingsUpdated)

      return addedMovie
    } catch (error) {
      throw error
    }
  }

  const useAddToWatchlist = async (tmdbId: number, movieId: number, onDuplicate?: (movie: Partial<Movie>, movieId: number) => void) => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies/details?id=${tmdbId}`)
      const movieDetails = await response.json()

      const newMovie: Partial<Movie> = {
        title: movieDetails.title,
        description: movieDetails.overview,
        watched: false,
        year: movieDetails.release_date.split("-")[0],
        genres: movieDetails.genres.map((g: any) => g.name),
        posterPath: `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`,
        imdbId: movieDetails.imdb_id,
        tmdbId: movieDetails.id,
        streamingServices: [],
        imdbRating: 0,
        rtRating: null,
      }

      const userMovies = await fetch(`http://localhost:8080/api/page`, {
        credentials: "include",
      })
      const userMoviesData = await userMovies.json()

      if (userMoviesData.movies.find((m: Movie) => m.imdbId && newMovie.imdbId && m.imdbId === newMovie.imdbId)) {
        if (onDuplicate) onDuplicate(newMovie, movieId);
        return;
      }
      
      let movieCardButton = document.querySelector(`[data-movie-id="${movieId}"] > .movie-actions > button`)
      movieCardButton?.setAttribute("disabled", "true")
      if (movieCardButton) movieCardButton.textContent = "Added to Watchlist"

      // Actually add the movie to the watchlist
      const addResponse = await fetch("http://localhost:8080/api/movies", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newMovie, force: false }),
      })

      
      
      if (!addResponse.ok) {
        throw new Error("Failed to add movie")
      }
      
      const addedMovie = await addResponse.json()

      loadExtraDetails(addedMovie.id, addedMovie.imdbId, addedMovie.posterPath)

      return addedMovie // <-- Return the added movie (with id, imdbId, etc)
    } catch (error) {
      console.error("Error adding to watchlist:", error)
    }
  }

  const useGetAIRecommendations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/movies/recommendations", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to get AI recommendations")
      }

      const recommendations = await response.json()
      return recommendations
    } catch (error) {
        console.error("Error getting AI recommendations:", error)
      throw error
    }
  }

  return {
    useToggleWatched,
    useRemoveMovie,
    useRateMovie,
    useAddMovieToWatchlist,
    useAddToWatchlist,
    useGetAIRecommendations,
    loadExternalRatings,
    loadAmbientColor,
    removeAllMovies
  }
}
