import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/bookings — admin only (list all)
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token');
    const settings = await db.siteSettings.findFirst();
    if (!token || !settings || token !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const bookings = await db.booking.findMany({
      include: { car: { include: { brand: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ bookings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/bookings — public: anyone can submit a booking request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { carId, customerName, email, phone, startDate, endDate, packageType, notes } = body;
    if (!carId || !customerName || !phone || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const booking = await db.booking.create({
      data: { carId, customerName, email, phone, startDate, endDate, packageType: packageType || 'daily', notes },
    });
    return NextResponse.json({ booking });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH /api/bookings — admin update booking status
export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token');
    const settings = await db.siteSettings.findFirst();
    if (!token || !settings || token !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id, status } = await req.json();
    const booking = await db.booking.update({ where: { id }, data: { status } });
    return NextResponse.json({ booking });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
