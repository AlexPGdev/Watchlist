"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useMemo } from "react"

interface StreamingPopupState {
    isVisible: boolean
    streamingServices: any
    movieTitle: string
    position: { x: number; y: number }
}

interface StreamingPopupContextType {
    streamingPopup: StreamingPopupState
    showStreamingPopup: (streamingServices: any, movieTitle: string, position: { x: number; y: number }) => void
    hideStreamingPopup: () => void
}

const StreamingPopupContext = createContext<StreamingPopupContextType | undefined>(undefined)

export function StreamingPopupProvider({ children }: { children: React.ReactNode }) {
    const [streamingPopup, setStreamingPopup] = useState<StreamingPopupState>({
        isVisible: false,
        streamingServices: null,
        movieTitle: "",
        position: { x: 0, y: 0 },
    })

    const showStreamingPopup = useCallback(
        (streamingServices: any, movieTitle: string, position: { x: number; y: number }) => {
        setStreamingPopup({
            isVisible: true,
            streamingServices,
            movieTitle,
            position,
        })
        },
        [],
    )

    const hideStreamingPopup = useCallback(() => {
        setStreamingPopup((prev) => ({ ...prev, isVisible: false }))
    }, [])

    const value = useMemo(
        () => ({
        streamingPopup,
        showStreamingPopup,
        hideStreamingPopup,
        }),
        [streamingPopup, showStreamingPopup, hideStreamingPopup],
    )

    return <StreamingPopupContext.Provider value={value}>{children}</StreamingPopupContext.Provider>
}

export function useStreamingPopup() {
    const context = useContext(StreamingPopupContext)
    if (!context) {
        throw new Error("useStreamingPopup must be used within a StreamingPopupProvider")
    }
    return context
}
