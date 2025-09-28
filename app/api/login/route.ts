import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Forward the request to your existing backend
    const response = await fetch("https://api.alexpg.dev/watchlist/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })

    const data = await response.json()

    // Create the Next.js response
    const nextResponse = NextResponse.json(data, { status: response.status })

    // Forward any Set-Cookie headers from your backend
    const setCookieHeaders = response.headers.get("set-cookie")
    if (setCookieHeaders) {
      nextResponse.headers.set("Set-Cookie", setCookieHeaders)
    }

    return nextResponse
  } catch (error) {
    console.error("Login proxy error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
