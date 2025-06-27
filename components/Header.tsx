"use client"
import Link from "next/link"
import { UserSearch } from "./UserSearch"
import { ProfileDropdown } from "./ProfileDropdown"
import React from "react"

interface HeaderProps {
  onLoginClick: () => void
  isLoggedIn: boolean
  user: string | null
}

export const Header = React.memo(function Header({ onLoginClick, isLoggedIn, user }: HeaderProps) {
  return (
    <div className="header">
      <UserSearch />

      <h1>
        <Link href="/">🎬 Watchlist</Link>
      </h1>

      <div className="header-actions">
        {!isLoggedIn ? (
          <button onClick={onLoginClick} className="login-btn">
            Login
          </button>
        ) : (
          <ProfileDropdown user={user} />
        )}
      </div>
    </div>
  )
})
