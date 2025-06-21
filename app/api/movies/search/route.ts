import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ Error: "No query provided" })
  }

  try {
    // This would connect to your actual movie search API (TMDB)
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
    )
    const data = await response.json()

    return NextResponse.json(data.results || [])
  } catch (error) {
    console.error("Movie search error:", error)
    return NextResponse.json({ Error: "Search failed" })
  }
}
