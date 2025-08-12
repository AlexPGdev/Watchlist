"use client";

import { useState, useEffect } from "react";
import type { Movie } from "@/types/movie";
import { useMovieActions } from "@/hooks/useMovieActions";
import { set } from "react-hook-form";
import { Vibrant } from "node-vibrant/browser";
import { Color, getColor, useColor } from "color-thief-react";

interface MovieDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
  isOwner: boolean;
  movieRating?: number;
  onRatingUpdate?: (movieId: number, rating: number) => void;
  onMovieAdded?: () => void;
  onExternalRatingsUpdated?: (ratings: any) => void;
  onDuplicateMovie: (movie: Movie, movieId: number) => void;
}

export function MovieDetailsModal({
  isOpen,
  onClose,
  movie,
  isOwner,
  movieRating,
  onRatingUpdate,
  onMovieAdded,
  onExternalRatingsUpdated,
  onDuplicateMovie,
}: MovieDetailsModalProps) {
  const [streamingServices, setStreamingServices] = useState<any>(null);
  const [allServices, setAllServices] = useState<any>(null);
  const [loadingStreaming, setLoadingStreaming] = useState(false);
  const { useRateMovie, useAddToWatchlist, loadExternalRatings } =
    useMovieActions();
  const [show, setShow] = useState(false);
  const [alsoWatch, setAlsoWatch] = useState<any>(null);
  const [cast, setCast] = useState<any>(null);
  const [crew, setCrew] = useState<any>(null);
  const [images, setImages] = useState<any>(null);
  const [productionCompanies, setProductionCompanies] = useState<any>(null);
  const [dominantColor, setDominantColor] = useState<Array<number> | null>(null);


  const selectedRating =
    movieRating !== undefined ? movieRating : movie?.rating ?? -1;

  console.log(movie);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      // Delay unmount for animation
      const timeout = setTimeout(() => setShow(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && movie) {
      fetchStreamingServices();
      fetchExtendedDetails();
      // fetchAlsoWatch();
      // fetchCredits();
      // fetchImages();
    }
  }, [isOpen, movie]);

  useEffect(() => {
      if (movie?.posterPath) {
        const imgUrl = `/api/proxy-image?url=${movie?.posterPath}`;

        getColor(imgUrl, "rgbArray").then((data) => {
          console.log(data)
          setDominantColor(data);
        });

      }
    }, [movie]);

  const fetchStreamingServices = async () => {
    if (!movie) return;

    setLoadingStreaming(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/movies/streaming-availability?id=${movie?.tmdbId}`
      );
      const data = await response.json();

      let allServices = [];
      if (data.DE.flatrate) {
        data.DE.flatrate.sort(
          (a: { display_priority: number }, b: { display_priority: number }) =>
            a.display_priority - b.display_priority
        );
        allServices.push(...data.DE.flatrate);
      }
      if (data.DE.buy) {
        data.DE.buy.sort(
          (a: { display_priority: number }, b: { display_priority: number }) =>
            a.display_priority - b.display_priority
        );
        allServices.push(...data.DE.buy);
      }
      if (data.DE.rent) {
        data.DE.rent.sort(
          (a: { display_priority: number }, b: { display_priority: number }) =>
            a.display_priority - b.display_priority
        );

        allServices.push(...data.DE.rent);
      }

      const seen = new Set();
      allServices = allServices.filter(item => {
        if(seen.has(item.provider_id)) return false;
        seen.add(item.provider_id);
        return true;
      })

      // Sort by the lowest display_priority

      console.log(allServices);

      setStreamingServices(data);
      setAllServices(allServices);
    } catch (error) {
      console.error("Error fetching streaming services:", error);
    } finally {
      setLoadingStreaming(false);
    }
  };

  const fetchExtendedDetails = async () => {
    if (!movie) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/movies/extended-details?id=${movie?.tmdbId}`
      );
      const data = await response.json();
      console.log(data.credits.crew)
      let writing = data.credits.crew.filter((c: any) => c.department === "Writing");
      console.log(writing);
      setAlsoWatch(data.recommendations);
      setCast(data.credits.cast);
      setCrew(data.credits.crew);
      setImages(data.images);
      console.log(data.production_companies)
      setProductionCompanies(data.production_companies);
      // setExtendedDetails(data);
    } catch (error) {
      console.error("Error fetching extended details:", error);
    }
  };

  const handleRate = async (rating: number) => {
    if (!movie) return;

    const newRating = selectedRating === rating ? -1 : rating;

    try {
      if (onRatingUpdate) {
        onRatingUpdate(movie.id, newRating);
      }

      await useRateMovie(movie.id, newRating);
    } catch (error) {
      console.error("Error rating movie:", error);
    }
  };

  const handleAlsoWatchClick = async (movieId: number) => {
    try {
      // Add to watchlist and get the added movie (with id, imdbId)
      const addedMovie = await useAddToWatchlist(movieId, 0, onDuplicateMovie);
      // Update external ratings using the new id and imdbId
      if (onMovieAdded) {
        onMovieAdded();
        onClose();
        if (addedMovie?.imdbId && addedMovie?.id && onExternalRatingsUpdated) {
          const ratings = await loadExternalRatings(
            addedMovie.imdbId,
            addedMovie.id,
            onExternalRatingsUpdated
          );
          onExternalRatingsUpdated(ratings);
        }
      }
    } catch (error) {
      console.error("Error adding movie from Also Watch:", error);
    }
  };

  const handleOnClose = () => {
    onClose();
    //setDominantColor([0,0,0]);
  }

  if (!show && !isOpen) return null;
  if (!movie) return null;

  return (
    <div
      className={`modal show${isOpen ? " modal-fade-in" : " modal-fade-out"}`}
      onClick={handleOnClose}
      id="movie-details-modal"
      style={{ backgroundColor: `rgb(${dominantColor?.map(c => Math.floor(c * 0.2))}, 0.8)` }}
    >
      <div
        className={`modal-content movie-details-content active${
          isOpen ? " modal-content-fade-in" : " modal-content-fade-out"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: `rgba(${dominantColor},0.4)`,
          transition: "background-color 0.4s ease"
        }}
      >
        <button className="close-modal-btn" onClick={onClose}>
          ×
        </button>

        <div className="movie-details-header">
          <div>
            <h2>{movie.title}</h2>
            <div className="movie-details-year">{movie.year}</div>
            <div className="movie-details-genres">
              {movie.genres.map((genre) => (
                <span key={genre} className="movie-details-genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="movie-details-ratings-container">
            <div className="movie-details-external-ratings">
              <span className="imdbRating">
                <img src="/imdb.svg"></img>
                {movie.imdbRating}/10
              </span>
              <span className="rtRating">
                <img src={"/rt.png"}></img>
                {movie.rtRating}
              </span>
            </div>
          </div>
        </div>

        <div className="movie-details-info">
          <div className="movie-details-media-container">
            <div className="movie-details-poster-container">
              <div className="movie-details-poster">
                <img
                  src={movie.posterPath || "/placeholder.svg"}
                  alt={movie.title}
                />
              </div>
            </div>

            <div className="movie-details-trailer">
              <iframe
                width="600"
                height="338"
                src={`https://www.youtube.com/embed/${movie.trailerPath}?autoplay=1&mute=1`}
              ></iframe>
            </div>
          </div>

          <div className="movie-details-description">{movie.description}</div>

          <div className="movie-details-additional-info">
            <div>
              {isOwner && (
                <div className="movie-details-actions">
                  <h3>Rate</h3>
                  <div className="movie-details-ratings">
                    <button
                      className={`rating-btn movie-details-rating ${
                        selectedRating === 0 ? "selected" : ""
                      }`}
                      onClick={() => handleRate(0)}
                    >
                      <span>👎 Did not like it</span>
                    </button>
                    <button
                      className={`rating-btn movie-details-rating ${
                        selectedRating === 1 ? "selected" : ""
                      }`}
                      onClick={() => handleRate(1)}
                    >
                      <span>👍 Liked it</span>
                    </button>
                    <button
                      className={`rating-btn movie-details-rating ${
                        selectedRating === 2 ? "selected" : ""
                      }`}
                      onClick={() => handleRate(2)}
                    >
                      <span>❤️ Loved it</span>
                    </button>
                  </div>
                </div>
              )}

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
                          {allServices?.slice(0, 7).map((service: any) => (
                            <div
                              key={service.provider_id}
                              className="streaming-service-item"
                            >
                              <img
                                src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
                                alt={service.provider_name}
                              />
                            </div>
                          ))}
                          {allServices?.length > 5 && (
                            <div className="streaming-service-item more-item">
                              <div className="streaming-more-btn">
                                <span>+{allServices.length - 5}</span>
                              </div>
                            </div>
                          )}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="no-streaming">
                      No streaming services available
                    </div>
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

              <div className="movie-details-cast">
                <h3>Cast</h3>
                <div className="movie-details-cast-list-wrapper">
                  <div className="movie-details-cast-list">
                    {cast?.map((cast: any) => (
                      <div className="movie-details-cast-item" key={cast.id}>
                        <div className="movie-details-cast-image">
                          {cast.profile_path !== null ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w500/${cast.profile_path}`}
                              alt={cast.name}
                            />
                          ) : (
                            <img
                              src="/placeholder-user.jpg"
                              alt={cast.name}
                              style={{ width: "100%", height: "100%" }}
                            />
                          )}
                        </div>
                        <div className="movie-details-cast-name" title={cast.name}>{cast.name}</div>
                        <div className="movie-details-cast-character" title={cast.character}>{cast.character}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="movie-details-crew">
                <h3>Crew</h3>
                <div className="movie-details-crew-list">
                  <div className="movie-details-crew-director">
                    {(() => {
                      const directors = crew?.filter((c: { job: string; name: string }) => c.job === 'Director') || [];

                      return (
                        <>
                          <h4>{directors.length > 1 ? 'Directors' : 'Director'}</h4>
                          <span>{directors.map((c : { name: string; }) => c.name).join(', ')}</span>
                        </>
                      );
                    })()}
                  </div>

                    
                      {(() => {
                        const novel = crew?.filter((c: { name: string; job: string }) => c.job === "Novel") || [];
                        const uniqueNovelNames = Array.from(new Set(novel.map((c : any) => c.name)));

                        return (
                          <>
                            {uniqueNovelNames.length > 0 && (
                              <>
                                <div className="movie-details-crew-novel">
                                  <h4>{uniqueNovelNames.length > 1 ? 'Novels' : 'Novel'}</h4>
                                  <span>{uniqueNovelNames.join(', ')}</span>
                                </div>
                              </>
                            )}
                          </>
                        );
                      })()}
                    

                  <div className="movie-details-crew-writer">
                    {(() => {
                        const writing = crew?.filter((c: { department: string; name: string; job: string }) => c.department === 'Writing' && c.job !== "Novel") || [];
                        const writers = writing?.filter((c: { job: string; name: string }) => c.job === 'Writer' || c.job === "Story") || [];

                        const uniqueWritingNames = Array.from(new Set(writing.map((c : any) => c.name)));
                        const uniqueWriterNames = Array.from(new Set(writers.map((c : any) => c.name)));

                        return (
                          <>
                            {uniqueWriterNames.length > 0 ? (
                              <>
                                <h4>{uniqueWriterNames.length > 1 ? 'Writers' : 'Writer'}</h4>
                                <span>{uniqueWriterNames.join(', ')}</span>
                              </>
                            ) : (
                              <>
                                <h4>{uniqueWritingNames.length > 1 ? 'Writers' : 'Writer'}</h4>
                                <span>{uniqueWritingNames.join(', ')}</span>
                              </>
                            )}

                          </>
                        );
                      })()}
                  </div>

                  <div className="movie-details-production-companies">
                      {(() => {
                        const production = productionCompanies?.map((c: any) => c.name) || [];

                        return (
                          <>
                            {production.length > 0 && (
                              <>
                                <h4>{production.length > 1 ? 'Production Companies' : 'Production Company'}</h4>
                                <span>{production.join(', ')}</span>
                              </>
                            )}
                          </>
                        );
                      })()}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ top: "540px", width: "fit-content" }}>
              <div>
                <h3 style={{ color: "#00ffff", marginBottom: "0" }}>
                  Also Watch
                </h3>
                <div className="also-watch-movies">
                  {alsoWatch?.results.slice(0, 3).map((movie: any) => (
                    <div
                      className="also-watch-movie"
                      key={movie.id}
                      onClick={() => handleAlsoWatchClick(movie.id)}
                    >
                      <div className="also-watch-poster">
                        <img
                          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                          alt={movie.title}
                        ></img>
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
      </div>
    </div>
  );
}
