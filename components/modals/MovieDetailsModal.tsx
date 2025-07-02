"use client"

import { useState, useEffect } from "react"
import type { Movie } from "@/types/movie"
import { useMovieActions } from "@/hooks/useMovieActions"
import { set } from "react-hook-form"

interface MovieDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  movie: Movie | null
  isOwner: boolean
  movieRating?: number
  onRatingUpdate?: (movieId: number, rating: number) => void
  onMovieAdded?: () => void,
  onExternalRatingsUpdated?: (ratings: any) => void
}

export function MovieDetailsModal({ isOpen, onClose, movie, isOwner, movieRating, onRatingUpdate, onMovieAdded, onExternalRatingsUpdated }: MovieDetailsModalProps) {
  const [streamingServices, setStreamingServices] = useState<any>(null)
  const [allServices, setAllServices] = useState<any>(null)
  const [loadingStreaming, setLoadingStreaming] = useState(false)
  const { useRateMovie, useAddToWatchlist, loadExternalRatings } = useMovieActions()
  const [show, setShow] = useState(false)
  const [alsoWatch, setAlsoWatch] = useState<any>(null)

  const selectedRating = movieRating !== undefined ? movieRating : (movie?.rating ?? -1)

  console.log(movie)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
    } else {
      // Delay unmount for animation
      const timeout = setTimeout(() => setShow(false), 250)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && movie) {
      fetchStreamingServices()
      fetchAlsoWatch()
    }
  }, [isOpen, movie])

  const fetchStreamingServices = async () => {
    if (!movie) return

    setLoadingStreaming(true)
    try {
      const response = await fetch(`http://localhost:8080/api/movies/streaming-availability?id=${movie?.tmdbId}`)
      const data = await response.json()

      let allServices = [];
      if(data.DE.flatrate){
        data.DE.flatrate.sort((a: { display_priority: number }, b: { display_priority: number }) => a.display_priority - b.display_priority)
        allServices.push(...data.DE.flatrate)
      }
      if(data.DE.buy){
        data.DE.buy.sort((a: { display_priority: number }, b: { display_priority: number }) => a.display_priority - b.display_priority)
        allServices.push(...data.DE.buy)
      }
      if(data.DE.rent){
        data.DE.rent.sort((a: { display_priority: number }, b: { display_priority: number }) => a.display_priority - b.display_priority)
        allServices.push(...data.DE.rent)
      }

      // Sort by the lowest display_priority


      console.log(allServices)

      setStreamingServices(data)
      setAllServices(allServices)
    } catch (error) {
      console.error("Error fetching streaming services:", error)
    } finally {
      setLoadingStreaming(false)
    }
  }

  const fetchAlsoWatch = async () => {
    if (!movie) return
    try {
      const response = await fetch(`http://localhost:8080/api/movies/alsowatch?id=${movie.tmdbId}`)

      if (response.ok) {
        const data = await response.json()
        console.log(data.results[0])
        setAlsoWatch(data)
      }
    } catch (error) {
      console.error("Error fetching also watch:", error)
    }
  }

  const handleRate = async (rating: number) => {
    if (!movie) return

    const newRating = selectedRating === rating ? -1 : rating

    try {
      if(onRatingUpdate){
        onRatingUpdate(movie.id, newRating)
      }
      
      await useRateMovie(movie.id, newRating)
    } catch (error) {
      console.error("Error rating movie:", error)
    }
  }

  const handleAlsoWatchClick = async (movieId: number) => {
    try {
      // Add to watchlist and get the added movie (with id, imdbId)
      const addedMovie = await useAddToWatchlist(movieId, 0)
      // Update external ratings using the new id and imdbId
      if (addedMovie?.imdbId && addedMovie?.id && onExternalRatingsUpdated) {
        const ratings = await loadExternalRatings(addedMovie.imdbId, addedMovie.id, onExternalRatingsUpdated)
        onExternalRatingsUpdated(ratings)
      }
      onClose()
      if (onMovieAdded) {
        onMovieAdded()
      }
    } catch (error) {
      console.error("Error adding movie from Also Watch:", error)
    }
  }

  if (!show && !isOpen) return null
  if (!movie) return null

  return (
    <div className={`modal show${isOpen ? " modal-fade-in" : " modal-fade-out"}`} onClick={onClose} id="movie-details-modal">
      <div className={`modal-content movie-details-content active${isOpen ? " modal-content-fade-in" : " modal-content-fade-out"}`} onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>
          ×
        </button>

        <div className="movie-details-header">
          <div className="movie-details-poster">
            <img src={movie.posterPath || "/placeholder.svg"} alt={movie.title} />
          </div>
          <div className="movie-details-info">
            <h2>{movie.title}</h2>
            <div className="movie-details-year">{movie.year}</div>
            <div className="movie-details-genres">
              {movie.genres.map((genre) => (
                <span key={genre} className="movie-details-genre-tag">
                  {genre}
                </span>
              ))}
            </div>

            {isOwner && (
              <div className="movie-details-actions">
                <h3>Rate</h3>
                <div className="movie-details-ratings">
                  <button
                    className={`rating-btn movie-details-rating ${selectedRating === 0 ? "selected" : ""}`}
                    onClick={() => handleRate(0)}
                  >
                    <span>👎 Did not like it</span>
                  </button>
                  <button
                    className={`rating-btn movie-details-rating ${selectedRating === 1 ? "selected" : ""}`}
                    onClick={() => handleRate(1)}
                  >
                    <span>👍 Liked it</span>
                  </button>
                  <button
                    className={`rating-btn movie-details-rating ${selectedRating === 2 ? "selected" : ""}`}
                    onClick={() => handleRate(2)}
                  >
                    <span>❤️ Loved it</span>
                  </button>
                </div>
              </div>
            )}

            <div className="movie-details-external-ratings">
              <h3>Ratings</h3>
              <table className="ratings-table">
                <tbody>                  
                  <tr>
                    <td>
                      <img src={"/imdb.svg"} alt="IMDb" className="icon" />
                    </td>
                    <td>IMDb</td>
                    <td>{movie.imdbRating}/10</td>
                  </tr>
                  <tr>
                    <td>
                      <img src={"rt.png"} alt="Rotten Tomatoes" className="icon" />
                    </td>
                    <td>Rotten Tomatoes</td>
                    <td>{movie.rtRating}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="movie-details-streaming">
              <h3>Available on</h3>
              <div className="streaming-services">
                {loadingStreaming ? (
                  <div>Loading streaming services...</div>
                ) : streamingServices?.DE ? (
                  <div className="streaming-section">
                    <div className="streaming-grid">
                      <a
                        href={streamingServices.DE.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="streaming-grid-link"
                      >
                        {allServices?.slice(0, 5).map((service: any) => (
                          <div key={service.provider_id} className="streaming-service-item">
                            <img
                              src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
                              alt={service.provider_name}
                            />
                          </div>
                        ))}
                        {
                          allServices?.length > 5 &&
                          <div className="streaming-service-item more-item">
                            <div className="streaming-more-btn">
                              <span>+{allServices.length - 5}</span>
                            </div>
                          </div>
                        }
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="no-streaming">No streaming services available</div>
                )}
              </div>
            </div>
            <a 
              className="justwatch-link" 
              href="https://www.justwatch.com/" 
              target="_blank" 
              aria-label="Visit JustWatch website"
            >
                <img 
                  src="https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg" 
                  alt="JustWatch logo"
                  className="justwatch-logo"
                />
            </a>
            
          </div>
        </div>

        <div style={{position: "fixed", top: "430px", width: "92%"}}>          
          <div className="movie-details-body">
            <div className="movie-details-description">{movie.description}</div>
          </div>

          <div>
              <h3 style={{color: "#00ffff", marginBottom: "0"}}>Also Watch</h3>
              <div className="also-watch-movies">
                  {alsoWatch?.results.slice(0, 3).map((movie: any) => (
                      <div className="also-watch-movie" key={movie.id} onClick={() => handleAlsoWatchClick(movie.id)}>
                          <div className="also-watch-poster">
                              <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title}></img>
                          </div>
                          <div className="also-watch-info">
                              <h4>{movie.title}</h4>
                              <span>{movie.release_date.split("-")[0]}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        </div>

      </div>
    </div>
  )
}
