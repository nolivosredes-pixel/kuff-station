import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { Event, EventsData } from "@/lib/types";

const eventsFilePath = path.join(process.cwd(), "data", "events.json");

async function getEventsData(): Promise<EventsData> {
  try {
    const fileContents = await fs.readFile(eventsFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    // If file doesn't exist, return empty events array
    return { events: [] };
  }
}

async function saveEventsData(data: EventsData): Promise<void> {
  await fs.writeFile(eventsFilePath, JSON.stringify(data, null, 2), "utf8");
}

// GET all events
export async function GET() {
  try {
    const data = await getEventsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading events:", error);
    return NextResponse.json(
      { error: "Failed to read events" },
      { status: 500 }
    );
  }
}

// POST new event (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const newEvent: Event = await request.json();
    const data = await getEventsData();

    // Generate new ID
    const maxId = data.events.length > 0
      ? Math.max(...data.events.map(e => e.id))
      : 0;
    newEvent.id = maxId + 1;

    data.events.push(newEvent);
    await saveEventsData(data);

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
