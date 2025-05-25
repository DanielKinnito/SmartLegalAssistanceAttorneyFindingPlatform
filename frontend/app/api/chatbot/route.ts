import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let query: string;
  try {
    const body = await req.json();
    query = body.query;
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", ""); // Extract token from Authorization header
    if (!token) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Pass token to FastAPI
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}