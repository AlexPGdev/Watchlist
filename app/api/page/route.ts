import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // This would fetch the user's movies from the database
  // For now, we'll return mock data

  return NextResponse.json({
    movies: [],
    ownerName: "Current User",
  })
}
