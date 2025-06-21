"use client"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"

interface ProfileDropdownProps {
  user: string | null
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false)
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setShowThemeSubmenu(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const getProfilePicture = () => {
    if (!user) return ""

    const firstLetter = user.charAt(0).toUpperCase()

    // Get current theme colors
    const isDarkTheme = document.body.classList.contains("theme-cyberpunk")
    const bgColor = isDarkTheme ? "%23ff00ff" : "%234ecdc4" // URL-encoded colors
    const textColor = isDarkTheme ? "%2300ffff" : "white"

    // Dynamic font size based on letter
    const fontSize = firstLetter.length === 1 ? "18" : "14"

    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="${bgColor}"/><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="${textColor}" fontFamily="Arial" fontSize="${fontSize}" fontWeight="bold">${firstLetter}</text></svg>`
  }

  return (
    <div className="profile-container" ref={dropdownRef}>
      <button
        className="profile-btn"
        onClick={(e) => {
          e.stopPropagation()
          setShowDropdown(!showDropdown)
        }}
      >
        <img src={getProfilePicture() || "/placeholder.svg"} alt="Profile" className="profile-pic" />
      </button>

      {showDropdown && (
        <div className="profile-dropdown show">
          <div
            className="dropdown-item theme-item"
            onClick={(e) => {
              e.stopPropagation()
              setShowThemeSubmenu(!showThemeSubmenu)
            }}
          >
            Change Theme
            {showThemeSubmenu && (
              <div className="theme-submenu show">
                <button
                  className="theme-option theme-default"
                  onClick={(e) => {
                    e.stopPropagation()
                    setTheme("default")
                    setShowDropdown(false)
                    setShowThemeSubmenu(false)
                  }}
                >
                  Default
                </button>
                <button
                  className="theme-option theme-cyberpunk"
                  onClick={(e) => {
                    e.stopPropagation()
                    setTheme("cyberpunk")
                    setShowDropdown(false)
                    setShowThemeSubmenu(false)
                  }}
                >
                  Cyberpunk
                </button>
              </div>
            )}
          </div>
          <button
            className="dropdown-item"
            onClick={() => {
              logout()
              setShowDropdown(false)
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
