import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/settings — public site settings
export async function GET() {
  try {
    const settings = await db.siteSettings.findFirst();
    if (!settings) return NextResponse.json({});
    // Strip the adminPassword for public consumption
    const { adminPassword, ...safe } = settings;
    return NextResponse.json({ settings: safe });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/settings — admin update
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token');
    const settings = await db.siteSettings.findFirst();
    if (!token || !settings || token !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const updated = await db.siteSettings.update({ where: { id: settings.id }, data: body });
    const { adminPassword, ...safe } = updated;
    return NextResponse.json({ settings: safe });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
