import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const movie = await request.json()

    // This would save the movie to your database
    // For now, we'll just return a success response

    return NextResponse.json({
      id: Math.floor(Math.random() * 10000), // Mock ID
      ...movie,
    })
  } catch (error) {
    console.error("Add movie error:", error)
    return NextResponse.json({ error: "Failed to add movie" }, { status: 500 })
  }
}
