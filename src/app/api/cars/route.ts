import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/cars — list all cars (optionally filter by ?category=&brand=&featured=)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const brand = url.searchParams.get('brand');
    const featured = url.searchParams.get('featured');

    const where: any = {};
    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (featured === 'true') where.featured = true;

    const cars = await db.car.findMany({
      where,
      include: { brand: true, category: true, images: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ cars });
  } catch (e: any) {
    console.error('GET /api/cars error', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/cars — admin only (check header x-admin-token)
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token');
    const settings = await db.siteSettings.findFirst();
    if (!token || !settings || token !== settings.adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { images, ...data } = body;

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = `${data.brandId}-${data.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const car = await db.car.create({
      data: {
        ...data,
        features: typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []),
        images: images?.length ? { create: images.map((img: any, i: number) => ({ url: img.url, caption: img.caption, order: i })) } : undefined,
      },
      include: { brand: true, category: true, images: true },
    });

    return NextResponse.json({ car });
  } catch (e: any) {
    console.error('POST /api/cars error', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
