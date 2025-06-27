"use client"

import { useState, useEffect, createContext } from "react"

interface AuthContextType {
  user: string | null
  isLoggedIn: boolean
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const [user, setUser] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/user", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.username)
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setIsLoggedIn(false)
      setUser(null)
    }
  }

  const login = async (username: string, password: string) => {
    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    const data = await response.json()
    setUser(data.username)
    setIsLoggedIn(true)
    window.location.reload()
  }

  const signup = async (username: string, password: string) => {
    const response = await fetch("http://localhost:8080/api/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("Username already exists")
      }
      throw new Error("Signup failed")
    }

    // Auto-login after signup
    await login(username, password)
  }

  const logout = async () => {
    await fetch("http://localhost:8080/api/logout", {
      method: "POST",
      credentials: "include",
    })

    setUser(null)
    setIsLoggedIn(false)
    window.location.reload()
  }

  return {
    user,
    isLoggedIn,
    login,
    signup,
    logout,
  }
}
