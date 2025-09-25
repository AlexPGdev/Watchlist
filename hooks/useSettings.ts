"use client"

import { useEffect, useState } from "react"

interface Settings {
  gridSize: number
  view: number
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:8080/api/settings", {
        credentials: "include"
      })
      if (!response.ok) {
        const defaultSettings = {
          gridSize: localStorage.getItem("gridSize") || 3,
          view: localStorage.getItem("viewMode") || 1
        }
        setSettings(defaultSettings)
        return
      }
      const data = await response.json()
      setSettings(data)
    } catch (err: any) {
      // setError(err.message)
      const defaultSettings = {
        gridSize: 3,
        view: 1
      }
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const updateGridSize = async (newSize: number) => {
    console.log(newSize)
    try {
      const response = await fetch("http://localhost:8080/api/settings", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gridSize: newSize }),
      })
      if (!response.ok) {
        localStorage.setItem("gridSize", newSize.toString())
      }
      await fetchSettings()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const updateViewMode = async (newMode: number) => {
    try {
      const response = await fetch("http://localhost:8080/api/settings", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ view: newMode }),
      })
      if (!response.ok) {
        localStorage.setItem("viewMode", newMode.toString())
      }
      await fetchSettings()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return { settings, loading, error, updateGridSize, updateViewMode }
} 