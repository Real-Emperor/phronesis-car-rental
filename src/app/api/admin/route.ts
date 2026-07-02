import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/admin/login — verify password
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const settings = await db.siteSettings.findFirst();
    if (!settings || password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ token: settings.adminPassword, ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
