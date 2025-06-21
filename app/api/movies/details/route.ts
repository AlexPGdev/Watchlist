import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "No movie ID provided" }, { status: 400 })
  }

  try {
    // This would connect to your actual movie details API (TMDB)
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Movie details error:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
