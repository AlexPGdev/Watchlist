"use client"

import React, { memo, useEffect } from "react"

import { useState } from "react"
import type { Movie } from "@/types/movie"
import { useMovieActions } from "@/hooks/useMovieActions"
import Button from "./button/Button"

// import imdb from "@/img/streaming-services/imdb.svg"
// import rt from "@/img/streaming-services/rt.png"

interface MovieCardProps {
  movie: Movie
  isOwner: boolean
  isLoggedIn: boolean
  onClick: (e: React.MouseEvent) => void
  onDuplicateMovie: (movie: Movie, movieId: number) => void
  onMovieRemoved?: () => void
  updatedExternalRatings?: { [movieId: number]: { imdbRating: number; rtRating: number } }
  onStreamingPopup?: (streamingServices: any, movieTitle: string, position: { x: number; y: number }) => void
  movieRatings?: { [movieId: number]: number }
  onRatingsUpdate?: (movieId: number, rating: number) => void
  onContextMenu?: (movieId: number, movie: Movie, position: { x: number; y: number }) => void
  // isSelected?: number[]
  onSelectMovie?: (movieId: number) => void
  selectedMoviesList?: number[]
  isSelectionMode?: boolean
  index?: number
}

export function MovieCard({ movie, isOwner, isLoggedIn, onClick, onDuplicateMovie, onMovieRemoved, updatedExternalRatings, onStreamingPopup, movieRatings, onRatingsUpdate, onContextMenu, onSelectMovie, selectedMoviesList, isSelectionMode, index }: MovieCardProps) {
  const { useToggleWatched, useRemoveMovie, useRateMovie, useAddToWatchlist } = useMovieActions()
  const [isRemoving, setIsRemoving] = useState(false)
  const [toggleWatched, setToggleWatched] = useState(movie.watched);

  const selectedRating = movieRatings?.[movie.id] ?? movie.rating ?? -1

  // Get the current ratings (either from updatedRatings or from movie)
  const currentRatings = updatedExternalRatings?.[movie.id] || { imdbRating: movie.imdbRating, rtRating: movie.rtRating };
  
  // Check if ratings are loading (imdbRating is 0 or rtRating is null)
  const isRatingsLoading = currentRatings.imdbRating === 0 || currentRatings.rtRating === null;

  const [selectedMovies, setSelectedMovies] = useState<number[]>([]);

  const [isSelected, setIsSelected] = useState(false);

  const seen = new Set();
  selectedMoviesList = selectedMoviesList?.filter(item => {
    if(seen.has(item)) return false;
    seen.add(item);
    return true;
  })

  // useEffect(() => {
  //   if (isSelected) {
  //     setSelectedMovies(isSelected)
  //   }
  // }, [isSelected])

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail.movieId === movie.id) {
        console.log('TeeeeeeeST')
        setIsSelected(prev => {
          console.log('maaawe')
          const next = !prev;
      
          // notify parent AFTER state is decided
          setTimeout(() => {
            const event = new CustomEvent("selection-changed", {
              detail: { movieId: movie.id, selected: next }
            });
            window.dispatchEvent(event);
          }, 0);
      
          return next;
        });
      }

      handleToggleSelected;
    };
  
    window.addEventListener("toggle-movie-select", handler);
    
    return () => window.removeEventListener("toggle-movie-select", handler);

  }, [movie.id]);

  const handleToggleWatched = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setToggleWatched(!toggleWatched);
    await useToggleWatched(movie.id)
  }

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRemoving(true)
    setTimeout(async () => {
      try {
        await useRemoveMovie(movie.id)
        if (onMovieRemoved) {
          onMovieRemoved()
        }
      } catch (error) {
        console.error("Error removing movie:", error)
        setIsRemoving(false)
      }
    }, 300)
  }

  const handleStreamingAvailability = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const button = e.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()
    
    try {
      const response = await fetch(`https://api.alexpg.dev/watchlist/api/movies/streaming-availability?id=${movie.tmdbId}`)
      const data = await response.json()
      if (onStreamingPopup) {
        onStreamingPopup(data, movie.title, { x: rect.right + 10 + window.scrollX, y: rect.top + window.scrollY })
      }
    } catch (error) {
      console.error("Error fetching streaming services:", error)
    }
  }

  const handleRate = async (e: React.MouseEvent, rating: number) => {
    e.stopPropagation();

    const newRating = selectedRating === rating ? -1 : rating

    if(onRatingsUpdate){
      onRatingsUpdate(movie.id, newRating)
    }

    await useRateMovie(movie.id, newRating);

    // if (selectedRating === rating) {
    //   setSelectedRating(-1);
    //   await useRateMovie(movie.id, -1);
    // } else {
    //   setSelectedRating(rating);
    //   await useRateMovie(movie.id, rating);
    // }
  };

  const handleAddToWatchlist =  async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await useAddToWatchlist(movie.tmdbId, movie.id, onDuplicateMovie)
      e.currentTarget.setAttribute("disabled", "true")
      e.currentTarget.textContent = "Added to Watchlist"
    } catch (error) {
      console.log(error)
    }
  }

  const handleRightClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    console.log("RIGHT CLICK!")

    //console.log(selectedMovies)

    onContextMenu?.(movie.id, movie, { x: e.clientX + 10 + window.scrollX, y: e.clientY + window.scrollY })
  }

  const formatWatchDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-GB")
  }

  const handleSelectMovie = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectMovie?.(movie.id)

    console.log(selectedMovies)
  }

  
  const handleToggleSelected = (e: React.MouseEvent, movieId?: number) => {
    console.log('aaaaww')
    e.stopPropagation()
    setIsSelected(prev => {
      console.log('maaawe')
      const next = !prev;
  
      // notify parent AFTER state is decided
      setTimeout(() => {
        const event = new CustomEvent("selection-changed", {
          detail: { movieId: movieId ? movieId : movie.id, selected: movieId ? true : next }
        });
        window.dispatchEvent(event);
      }, 0);
  
      return next;
    });
  };

  const handleOnClick = (e: React.MouseEvent) => {
    // e.stopPropagation()
    // e.preventDefault()
    if(e.ctrlKey) {
      e.stopPropagation()
      handleToggleSelected(e)
    } else if(e.shiftKey){
      // e.stopPropagation()
      // e.preventDefault()
      console.log(selectedMoviesList)

      document.getSelection()?.removeAllRanges()

      let movieCards = [];
      selectedMoviesList?.forEach(id => {
        movieCards.push(document.querySelector(`[data-movie-id="${id}"]`)?.dataset.movieIndex)
      })

      let lastSelected = movieCards[movieCards.length - 1]

      if(document.querySelector(`[data-movie-id="${movie.id}"]`)?.dataset.movieIndex > lastSelected) {
        for(let i = lastSelected+1; i <= document.querySelector(`[data-movie-id="${movie.id}"]`)?.dataset.movieIndex; i++) {
          console.log(document.querySelector(`[data-movie-index="${i}"]`)?.dataset.movieId)

          handleToggleSelected(e, document.querySelector(`[data-movie-index="${i}"]`)?.dataset.movieId)
        }
      }

      console.log(lastSelected)
      console.log(document.querySelector(`[data-movie-id="${movie.id}"]`)?.dataset.movieIndex)
      console.log(movieCards)
      console.log(movie.id)
    } else {
      onClick(e)
    }
  }

  return (
    <div className={`movie-card ${toggleWatched ? "watched" : ""} ${isRemoving ? "removing" : ""} ${isSelected ? "selected" : ""}`} onClick={handleOnClick} onContextMenu={handleRightClick} data-movie-id={movie.id} data-movie-index={index} style={{ background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), rgba(${movie.ambientColor},${parseInt(String(movie.ambientColor).split(",")[0]) + parseInt(String(movie.ambientColor).split(",")[1]) + parseInt(String(movie.ambientColor).split(",")[2]) < 180 ? 0.8 : parseInt(String(movie.ambientColor).split(",")[0]) + parseInt(String(movie.ambientColor).split(",")[1]) + parseInt(String(movie.ambientColor).split(",")[2]) > 500 ? 0.2 : 0.4})` }}>
      
      {isSelected && (
        <div className="selected-mark" onClick={handleToggleSelected}>
          <img src="/select-filled.png"></img>
        </div>
      )}

      {!isSelected && isSelectionMode && (
        <div className="selected-mark" onClick={handleToggleSelected}>
          <img src="/select-not-filled.png"></img>
        </div>
      )}

      {toggleWatched && (
        <div className="watched-badge">
          ✓ Watched on {movie.watchDate ? formatWatchDate(movie.watchDate) : formatWatchDate(Date.now())}
        </div>
      )}

      <div className="movie-header">
        <div className="movie-poster">
          <img src={movie.posterPath || "/placeholder.svg"} alt={movie.title} />
        </div>
        <div className="movie-info">
          <div className="movie-title" title={movie.title}>
            {movie.title}
          </div>
          <div className="movie-year">{movie.year}</div>
          <div className="movie-genres">
            {movie.genres.map((genre) => (
              <span key={genre} className="genre-tag" title={genre}>
                {genre}
              </span>
            ))}
          </div>

          <div className="movie-streaming-service">
              <Button id="watch-movie-btn" onClick={handleStreamingAvailability}><span>🎬</span><p>Watch</p></Button>
          </div>

          {toggleWatched && (
            <div className="movie-ratings">
              {selectedRating === -1 ? (
                <>
                  <button
                    className="rating-btn"
                    onClick={(e) => handleRate(e, 0)}
                    disabled={!isOwner}
                  >
                    <span>👎</span>
                  </button>
                  <button
                    className="rating-btn"
                    onClick={(e) => handleRate(e, 1)}
                    disabled={!isOwner}
                  >
                    <span>👍</span>
                  </button>
                  <button
                    className="rating-btn"
                    onClick={(e) => handleRate(e, 2)}
                    disabled={!isOwner}
                  >
                    <span>❤️</span>
                  </button>
                </>
              ) : (
                // Show only the selected one
                <button
                  className="rating-btn selected"
                  onClick={(e) => handleRate(e, selectedRating as number)}
                  disabled={!isOwner}
                >
                  <span>
                    {selectedRating === 0 && '👎'}
                    {selectedRating === 1 && '👍'}
                    {selectedRating === 2 && '❤️'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <button className="movie-external-ratings" data-movie-imdbid="${movie.imdbId}">
        <span className="imdbRating">
          <img src="/imdb.svg"></img> 
          {isRatingsLoading ? ( <div className ='rating-loader-spinner' style={{ marginBottom: 0, width: "20px", height: "20px" }}></div> ) : currentRatings.imdbRating}/10
        </span>
        <span className="rtRating">
          <img src={"/rt.png"}></img> 
          {isRatingsLoading ? ( <div className ='rating-loader-spinner' style={{ marginBottom: 0, width: "20px", height: "20px" }}></div> ) : currentRatings.rtRating}
        </span>
      </button>

      <div className="movie-description">{movie.description}</div>

      <div className="movie-actions">
        {isOwner && (
          <>
            <Button onClick={handleToggleWatched}>
              {toggleWatched ? "Mark Unwatched" : "Mark Watched"}
            </Button>
            <Button variant="danger" onClick={handleRemove}>
              Remove
            </Button>
          </>
        )}
        {!isOwner && isLoggedIn && (
          <Button onClick={handleAddToWatchlist}>
            Add to Watchlist
          </Button>
        )}
      </div>
    </div>
  )
}

const areEqual = (prev: MovieCardProps, next: MovieCardProps) => {
  // Only rerender if the movie's id, rating, watched, or relevant props change
  const prevRating = prev.movieRatings?.[prev.movie.id] ?? prev.movie.rating ?? -1;
  const nextRating = next.movieRatings?.[next.movie.id] ?? next.movie.rating ?? -1;

  const prevWatched = prev.movie.watched;
  const nextWatched = next.movie.watched;

  // Compare updatedExternalRatings for this movie
  const prevExternal = prev.updatedExternalRatings?.[prev.movie.id];
  const nextExternal = next.updatedExternalRatings?.[next.movie.id];
  const externalChanged = JSON.stringify(prevExternal) !== JSON.stringify(nextExternal);

  return (
    prev.movie.id === next.movie.id &&
    // prev.isSelected === next.isSelected &&
    prev.isSelectionMode === next.isSelectionMode &&
    prev.selectedMoviesList === next.selectedMoviesList &&
    prev.movie.watched === next.movie.watched &&
    prev.isOwner === next.isOwner &&
    prev.isLoggedIn === next.isLoggedIn &&
    JSON.stringify(prev.updatedExternalRatings?.[prev.movie.id]) ===
      JSON.stringify(next.updatedExternalRatings?.[next.movie.id]) &&
    (prev.movieRatings?.[prev.movie.id] ?? -1) ===
      (next.movieRatings?.[next.movie.id] ?? -1)
  );
};

// export const MemorizedMovieCard = memo(MovieCard, areEqual);
export const MemorizedMovieCard = memo(MovieCard, areEqual);
