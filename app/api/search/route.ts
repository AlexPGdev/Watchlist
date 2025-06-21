import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  try {
    // This would search for users in your database
    // For now, we'll return mock usernames
    const mockUsers = ["alice", "bob", "charlie", "diana", "eve"]
    const filteredUsers = mockUsers.filter((user) => user.toLowerCase().includes(query.toLowerCase()))

    return NextResponse.json(filteredUsers.slice(0, 5))
  } catch (error) {
    console.error("User search error:", error)
    return NextResponse.json([])
  }
}
