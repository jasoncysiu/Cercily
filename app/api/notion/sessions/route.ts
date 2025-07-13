import { type NextRequest, NextResponse } from "next/server";
import { saveSessionToNotion, getSessionsFromNotion, deleteSessionFromNotion, getSingleSessionFromNotion } from "@/services/notion-service";

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json();
    const response = await saveSessionToNotion(sessionData);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // console.error("API Error saving session:", error);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('id');

    if (sessionId) {
      const session = await getSingleSessionFromNotion(sessionId);
      if (session) {
        return NextResponse.json(session, { status: 200 });
      } else {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
    } else {
      const sessions = await getSessionsFromNotion();
      return NextResponse.json(sessions, { status: 200 });
    }
  } catch (error) {
    // console.error("API Error fetching sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json(); // 'id' here is the Notion page ID
    if (!id) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }
    const response = await deleteSessionFromNotion(id);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // console.error("API Error deleting session:", error);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}