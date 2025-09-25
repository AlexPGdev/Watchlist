import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { MoviesProvider } from "@/hooks/useMovies"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Watchlist",
  icons: "/tl.png",
  description: "Keep track of movies you want to watch and share your movie journey with others.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MoviesProvider>
        <ThemeProvider>{children}</ThemeProvider>
        </MoviesProvider>
      </body>
    </html>
  )
}
