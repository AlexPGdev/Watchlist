"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import Button from "../button/Button"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })
  const { login, signup } = useAuth()

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      alert("Please enter both username and password")
      return
    }

    try {
      await login(loginData.username, loginData.password)
      onClose()
    } catch (error) {
      alert("Login failed. Please check your credentials.")
    }
  }

  const handleSignup = async () => {
    if (!signupData.username || !signupData.password || !signupData.confirmPassword) {
      alert("Please fill in all fields")
      return
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (signupData.username.length < 2 || signupData.username.length > 20) {
      alert("Username must be between 2 and 20 characters")
      return
    }

    if (signupData.password.length < 8) {
      alert("Password must be at least 8 characters")
      return
    }

    try {
      await signup(signupData.username, signupData.password)
      onClose()
    } catch (error) {
      if (error.message === "Username already exists") {
        alert("Username already exists. Please try a different username.")
      } else {
        alert("Signup failed.")
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content active" onClick={(e) => e.stopPropagation()}>
        <div className="auth-tabs">
          <Button className={`auth-tab ${activeTab === "login" ? "active" : ""}`} onClick={() => setActiveTab("login")}>
            Login
          </Button>
          <Button
            className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </Button>
        </div>

        {activeTab === "login" ? (
          <div className="auth-form">
            <h3>Login</h3>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <Button variant="danger" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleLogin}>
                Login
              </Button>
            </div>
          </div>
        ) : (
          <div className="auth-form">
            <h3>Sign Up</h3>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Choose a password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <Button variant="danger" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSignup}>
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
