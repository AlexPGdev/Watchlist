"use client"

import type React from "react"

import { useState, useEffect, useRef, memo } from "react"
import { useRouter } from "next/navigation"

export const UserSearch = memo(function UserSearch() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const debounceTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(query)}`)
        const usernames = await response.json()
        setSuggestions(usernames)
        setShowSuggestions(usernames.length > 0)
      } catch (error) {
        console.error("Search error:", error)
      }
    }, 300)

    return () => clearTimeout(debounceTimeout)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setCurrentIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setCurrentIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter" && currentIndex >= 0) {
      e.preventDefault()
      router.push(`/${suggestions[currentIndex]}`)
      setQuery("")
      setShowSuggestions(false)
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setCurrentIndex(-1)
    }
  }

  const handleSuggestionClick = (username: string) => {
    router.push(`/${username}`)
    setQuery("")
    setShowSuggestions(false)
  }

  return (
    <div className="search-user">
      <input
        ref={inputRef}
        type="text"
        className="search-user-input"
        placeholder="Search user"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />

      {showSuggestions && (
        <ul id="autocomplete-list" className={`${showSuggestions ? "show" : ""}`}>
          {suggestions.map((username, index) => (
            <li
              key={username}
              className={`autocomplete-item ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleSuggestionClick(username)}
            >
              {username}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})