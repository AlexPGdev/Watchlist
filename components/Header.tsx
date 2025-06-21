"use client"
import Link from "next/link"
import { UserSearch } from "./UserSearch"
import { ProfileDropdown } from "./ProfileDropdown"

interface HeaderProps {
  onLoginClick: () => void
  isLoggedIn: boolean
  user: string | null
}

export function Header({ onLoginClick, isLoggedIn, user }: HeaderProps) {
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
}
