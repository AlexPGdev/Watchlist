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
}

export function MovieDetailsModal({ isOpen, onClose, movie, isOwner, movieRating, onRatingUpdate }: MovieDetailsModalProps) {
  const [streamingServices, setStreamingServices] = useState<any>(null)
  const [allServices, setAllServices] = useState<any>(null)
  const [loadingStreaming, setLoadingStreaming] = useState(false)
  const { useRateMovie } = useMovieActions()

  const selectedRating = movieRating !== undefined ? movieRating : (movie?.rating ?? -1)

  console.log(movie)

  useEffect(() => {
    if (isOpen && movie) {
      fetchStreamingServices()
    }
  }, [isOpen, movie])

  const fetchStreamingServices = async () => {
    if (!movie) return

    setLoadingStreaming(true)
    try {
      const response = await fetch(`http://localhost:8080/api/movies/streaming-availability?id=${movie.tmdbId}`)
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

  if (!isOpen || !movie) return null

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content movie-details-content active" onClick={(e) => e.stopPropagation()}>
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
            
          </div>
        </div>

        <div className="movie-details-body">
          <div className="movie-details-description">{movie.description}</div>
        </div>
      </div>
    </div>
  )
}
