import { NextRequest, NextResponse } from 'next/server';

async function makeBackendRequest(endpoint: string, method: string, token: string | null, body?: object) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`FastAPI request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

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

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
  }

  return makeBackendRequest("/chat", "POST", token, { query });
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
  }

  return makeBackendRequest("/chat/history", "GET", token);
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chat_id");

  if (chatId) {
    return makeBackendRequest(`/chat/${chatId}`, "DELETE", token);
  } else {
    return makeBackendRequest("/chat/history", "DELETE", token);
  }
}