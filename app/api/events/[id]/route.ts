import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { Event, EventsData } from "@/lib/types";

const eventsFilePath = path.join(process.cwd(), "data", "events.json");

async function getEventsData(): Promise<EventsData> {
  const fileContents = await fs.readFile(eventsFilePath, "utf8");
  return JSON.parse(fileContents);
}

async function saveEventsData(data: EventsData): Promise<void> {
  await fs.writeFile(eventsFilePath, JSON.stringify(data, null, 2), "utf8");
}

// GET - Get single event (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id);
    const data = await getEventsData();

    const event = data.events.find(e => e.id === eventId);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error getting event:", error);
    return NextResponse.json(
      { error: "Failed to get event" },
      { status: 500 }
    );
  }
}

// PUT - Update event (requires authentication)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const eventId = parseInt(id);
    const updatedEvent: Event = await request.json();
    const data = await getEventsData();

    const index = data.events.findIndex(e => e.id === eventId);
    if (index === -1) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    data.events[index] = { ...updatedEvent, id: eventId };
    await saveEventsData(data);

    return NextResponse.json(data.events[index]);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE event (requires authentication)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const eventId = parseInt(id);
    const data = await getEventsData();

    const index = data.events.findIndex(e => e.id === eventId);
    if (index === -1) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    data.events.splice(index, 1);
    await saveEventsData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
