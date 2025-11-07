import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const STATUS_FILE = path.join(process.cwd(), 'data', 'streaming-status.json');

// GET - Get current streaming status (public)
export async function GET() {
  try {
    const data = await fs.readFile(STATUS_FILE, 'utf-8');
    const status = JSON.parse(data);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error reading streaming status:', error);
    // Return default offline status if file doesn't exist
    return NextResponse.json({
      isLive: false,
      platform: null,
      streamUrl: null,
      embedUrl: null,
      startedAt: null,
      title: 'KUFF Live Stream',
      description: 'Watch KUFF perform live!',
    });
  }
}

// POST - Update streaming status (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simple auth check - in production, use proper authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Read current status
    let currentStatus;
    try {
      const data = await fs.readFile(STATUS_FILE, 'utf-8');
      currentStatus = JSON.parse(data);
    } catch {
      currentStatus = {};
    }

    // Update with new data
    const updatedStatus = {
      ...currentStatus,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // If going live, set startedAt
    if (body.isLive && !currentStatus.isLive) {
      updatedStatus.startedAt = new Date().toISOString();
    }

    // If going offline, clear startedAt
    if (!body.isLive) {
      updatedStatus.startedAt = null;
    }

    // Write to file
    await fs.writeFile(STATUS_FILE, JSON.stringify(updatedStatus, null, 2));

    return NextResponse.json(updatedStatus);
  } catch (error) {
    console.error('Error updating streaming status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
