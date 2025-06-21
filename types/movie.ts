export interface Movie {
  id: number
  title: string
  description: string
  watched: boolean
  year: string
  genres: string[]
  posterPath: string
  imdbId: string
  tmdbId: number
  streamingServices: string[]
  imdbRating: number | string
  rtRating: string | null
  rating?: number | null
  watchDate?: number
  addedDate?: number
}

export interface MovieStats {
  total: number
  watched: number
  toWatch: number
}
