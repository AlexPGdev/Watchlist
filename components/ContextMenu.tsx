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
    const { useRemoveMovie } = useMovieActions()

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