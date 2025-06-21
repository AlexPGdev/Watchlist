import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  const username = params.username

  // This would fetch the specified user's movies from the database
  // For now, we'll return mock data or errors

  // Mock user not found
  if (username === "notfound") {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Mock private profile
  if (username === "private") {
    return NextResponse.json({ error: "Profile is private" }, { status: 403 })
  }

  return NextResponse.json({
    movies: [],
    ownerName: username,
  })
}
