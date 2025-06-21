import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // This would create a new user in your database
    // For now, we'll just return a mock success

    if (username && password) {
      return NextResponse.json({ message: "User created successfully" })
    }

    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
