import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/cars/[id] — fetch single car by slug OR id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const car = await db.car.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { brand: true, category: true, images: { orderBy: { order: 'asc' } } },
    });
    if (!car) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ car });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/cars/[id] — admin update
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('x-admin-token');
    const settings = await db.siteSettings.findFirst();
    if (!token || !settings || token !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { images, ...data } = body;

    if (data.features && typeof data.features !== 'string') {
      data.features = JSON.stringify(data.features);
    }

    // Replace images if provided
    if (Array.isArray(images)) {
      await db.carImage.deleteMany({ where: { carId: id } });
      if (images.length) {
        await db.carImage.createMany({
          data: images.map((img: any, i: number) => ({ url: img.url, caption: img.caption || '', order: i, carId: id })),
        });
      }
    }

    const car = await db.car.update({
      where: { id },
      data,
      include: { brand: true, category: true, images: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ car });
  } catch (e: any) {
    console.error('PUT /api/cars/[id] error', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/cars/[id] — admin delete
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('x-admin-token');
    const settings = await db.siteSettings.findFirst();
    if (!token || !settings || token !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await db.car.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
