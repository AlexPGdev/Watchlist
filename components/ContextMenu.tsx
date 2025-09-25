"use client"

import type React from "react"

import { useState, useEffect, memo, useCallback } from "react"
import Button from "./button/Button"
import { Movie } from "@/types/movie"
import { useMovieActions } from "@/hooks/useMovieActions"

interface ContextMenuProps {
    isVisible?: boolean
    movie?: Movie
    position?: { x: number; y: number }
    onMovieRemoved?: () => void
    onClose?: () => void
    onSelectMovie?: (movieId: number) => void
}

export const ContextMenu = memo(function ContextMenu({ isVisible = false, movie, position, onMovieRemoved, onClose, onSelectMovie }: ContextMenuProps) {
    const [hovered, setHovered] = useState(false)
    const { useRemoveMovie, useEditWatchdate, useRefreshMovie } = useMovieActions()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.closest(".context-menu")) {
                if (onClose) {
                    onClose()
                }
            }
        }

        if (isVisible) {
            document.addEventListener("click", handleClickOutside)
            return () => document.removeEventListener("click", handleClickOutside)
        }
    }, [isVisible, onClose])

    if (!isVisible) return null

    console.log(movie)

    const handleRemoveClick = async (movieId: number) => {
        document.querySelector(`[data-movie-id="${movieId}"]`)?.classList.add("removing")
        setTimeout(async () => {
            try {
                await useRemoveMovie(movieId)
                if (onMovieRemoved) {
                    onMovieRemoved()
                }
            } catch (error) {
                console.error("Error removing movie:", error)
                document.querySelector(`[data-movie-id="${movieId}"]`)?.classList.remove("removing")
            }
        }, 300)
    }

    const handleSelectMovie = (e: React.MouseEvent, movieId?: number) => {
        e.stopPropagation()
        if (!movieId) return;

        console.log('tesstinggg')

        // // fire a custom event
        const event = new CustomEvent("toggle-movie-select", { detail: { movieId } });
        window.dispatchEvent(event);

        if (onClose) onClose();

        // setTimeout(() => {
        //     const event = new CustomEvent("selection-changed", {
        //         detail: { movieId: movieId, selected: true }
        //     });
        //     window.dispatchEvent(event);
        // }, 0);

        //   return true;
    };

    const handleEditWatchdateClick = async (movieId: number) => {
        if (onClose) onClose();
        const currentDate = movie?.watchDate ? new Date(movie?.watchDate) : new Date();
        const dateString = currentDate.toISOString().split('T')[0];

        const badgeElement = document.querySelector(`[data-movie-id="11"] > .watched-badge`)

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'date-input';
        dateInput.value = dateString;
        // dateInput.locale = 'en-GB';

        const originalContent = badgeElement?.innerHTML;

        badgeElement.innerHTML = '';
        badgeElement?.appendChild(dateInput);

        dateInput.focus();

        const saveDate = () => {
            const newDate = dateInput.value;
            if (newDate) {
                movie.watchDate = new Date(newDate).getTime();

                // Send API request to update watch date
                fetch(`http://localhost:8080/api/page-movies/${movieId}/watch-date?watchDate=${new Date(newDate).getTime()}`, {
                    method: 'PATCH',
                    credentials: "include"
                })
                    .then(response => {
                        if (!response.ok) {
                            console.error('Failed to update watch date');
                            badgeElement.innerHTML = originalContent;
                            return;
                        }

                        // Update badge with new date
                        const formattedDate = new Date(movie.watchDate).toLocaleDateString('en-GB');
                        badgeElement.innerHTML = `✓ Watched on ${formattedDate}`;
                    })
                    .catch(error => {
                        console.error('Error updating watch date:', error);
                        // Revert on error
                        badgeElement.innerHTML = originalContent;
                    });
            } else {
                // Revert if no date selected
                badgeElement.innerHTML = originalContent;
            }
        };

        // Handle cancel on Escape
        const cancelEdit = () => {
            badgeElement.innerHTML = originalContent;
        };
    
        dateInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveDate();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
            }
        });
    
        dateInput.addEventListener('blur', saveDate);
    
        // Prevent event bubbling to avoid triggering other handlers
        dateInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // useEditWatchdate(movieId, new Date().toISOString())
    }

    const handleRefreshMovie = (movieId: number, movieTmdbId: number) => {
        return async () => {
            if (onClose) onClose();
            try {
                await useRefreshMovie(movieId, movieTmdbId)
                if (onMovieRemoved) {
                    onMovieRemoved()
                }
            } catch (error) {
                console.error("Error refreshing movie:", error)
            }
        }
    }

    return (
        <div
            className="context-menu"
            style={{
                left: `${position?.x}px`,
                top: `${position?.y}px`,
                display: "block",
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="context-menu-buttons" style={{cursor: "pointer", opacity: hovered ? "0.8" : "1"}} onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
                <Button onClick={(e: React.MouseEvent) =>  handleSelectMovie(e, movie?.id)}>
                    <div className="context-menu-mark-watched-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="white"
                            style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
                            viewBox="0 0 32 32"
                        >
                            <path d="M16 0a16 16 0 1 0 16 16A16 16 0 0 0 16 0zm0 30a14 14 0 1 1 14-14 14 14 0 0 1-14 14z"/><path d="m13 20.59-4.29-4.3-1.42 1.42 5 5a1 1 0 0 0 1.41 0l11-11-1.41-1.41z"/>
                        </svg>
                        <span style={{verticalAlign: "middle"}}>Select Movie</span>
                    </div>
                </Button>

                <Button onClick={handleRefreshMovie(movie?.id, movie?.tmdbId)}>
                    <div className="context-menu-mark-watched-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="white"
                            style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 4v2.339A9 9 0 0 0 3 12h2a6.987 6.987 0 0 1 12.725-4H15v2h6V4zM12 19a6.957 6.957 0 0 1-5.726-3H9v-2H3v6h2v-2.339A9 9 0 0 0 21 12h-2a7.009 7.009 0 0 1-7 7z"/>
                        </svg>
                        <span style={{verticalAlign: "middle"}}>Refresh</span>
                    </div>
                </Button>

                <Button onClick={() => handleEditWatchdateClick(movie?.id)}>
                    <div className="context-menu-mark-watched-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="white"
                            style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
                            viewBox="0 0 24 24"
                        >
                            <path d="m7 18.264 10-10 5 5V2h-4V0h-2v2H6V0H4v2H0v19h7zM2 4h2v2h2V4h10v2h2V4h2v3H2zM22 14.92 15.92 21H22v-6.08z"/><path d="M8 18.678v4.414h4.414l9-9L17 9.678zm2 2.414v-1.586l1.586 1.586zm3-1.414-1.586-1.586L17 12.506l1.586 1.586z"/>
                        </svg>
                        <span style={{verticalAlign: "middle"}}>Edit Watch Date</span>
                    </div>
                </Button>
                
                <Button>
                    <div className="context-menu-mark-watched-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="white"
                            style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
                            viewBox="0 0 16 16"
                        >
                            {
                                (movie?.watched === false ? 
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                    :
                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                                )
                            }
                            {
                                (movie?.watched === false ? 
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                    :
                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                                )
                            }
                        </svg>
                        {
                            (movie?.watched === false ?
                                <span style={{verticalAlign: "middle"}}>Mark Watched</span>
                                :
                                <span style={{verticalAlign: "middle"}}>Mark Unwatched</span>
                            )
                        }
                    </div>
                </Button>

                {/* <Button onClick={() => handleEditWatchdateClick(movie?.id)}>
                    <div className="context-menu-mark-watched-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="white"
                            style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
                            viewBox="0 0 24 24"
                        >
                            <path d="m7 18.264 10-10 5 5V2h-4V0h-2v2H6V0H4v2H0v19h7zM2 4h2v2h2V4h10v2h2V4h2v3H2zM22 14.92 15.92 21H22v-6.08z"/><path d="M8 18.678v4.414h4.414l9-9L17 9.678zm2 2.414v-1.586l1.586 1.586zm3-1.414-1.586-1.586L17 12.506l1.586 1.586z"/>
                        </svg>
                        <span style={{verticalAlign: "middle"}}>Edit Watch Date</span>
                    </div>
                </Button> */}
                
                <Button variant="danger" onClick={() => handleRemoveClick(movie?.id)}>
                    <div className="context-menu-remove-button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#ff00ff"
                            style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
                            viewBox="0 0 16 16"
                        >
                        {
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                        }
                        </svg>
                        <span style={{verticalAlign: "middle"}}>Remove</span>
                    </div>
                </Button>

            </div>
        </div>
    )
})