// Shared types and API client for MERIDIAN

export interface Brand { id: string; name: string; slug: string; logo?: string | null; _count?: { cars: number } }
export interface Category { id: string; name: string; slug: string; description?: string | null; _count?: { cars: number } }
export interface CarImage { id: string; url: string; caption?: string | null; order: number }

export interface Car {
  id: string;
  slug: string;
  brandId: string;
  brand: Brand;
  model: string;
  year: number;
  categoryId: string;
  category: Category;
  priceDaily: number;
  priceWeekly: number;
  priceMonthly: number;
  engine: string;
  power: string;
  topSpeed: string;
  acceleration: string;
  transmission: string;
  seats: number;
  fuelType: string;
  drivetrain: string;
  tagline: string;
  description: string;
  features: string;        // JSON string
  color?: string | null;
  available: boolean;
  status: string; // available | rented | maintenance | sold
  featured: boolean;
  mileageLimit?: string | null;
  deposit?: string | null;
  heroImage: string;
  images: CarImage[];
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  brandName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  heroHeadline: string;
  heroSubtext: string;
  aboutText: string;
}

export interface Booking {
  id: string;
  carId: string;
  car?: Car;
  customerName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  packageType: string;
  notes?: string | null;
  status: string;
  createdAt: string;
}

// ---------- API helpers ----------
const API = {
  async get<T>(url: string): Promise<T> {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})).error) || `HTTP ${r.status}`);
    return r.json();
  },
  async post<T>(url: string, body: any, token?: string): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['x-admin-token'] = token;
    const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})).error) || `HTTP ${r.status}`);
    return r.json();
  },
  async put<T>(url: string, body: any, token?: string): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['x-admin-token'] = token;
    const r = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})).error) || `HTTP ${r.status}`);
    return r.json();
  },
  async patch<T>(url: string, body: any, token?: string): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['x-admin-token'] = token;
    const r = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})).error) || `HTTP ${r.status}`);
    return r.json();
  },
  async del<T>(url: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) headers['x-admin-token'] = token;
    const r = await fetch(url, { method: 'DELETE', headers });
    if (!r.ok) throw new Error((await r.json().catch(() => ({})).error) || `HTTP ${r.status}`);
    return r.json();
  },
};

export const api = API;

// ---------- Formatters ----------
export const formatAED = (n: number) =>
  new Intl.NumberFormat('en-AE', { style: 'decimal', maximumFractionDigits: 0 }).format(n);

export const parseFeatures = (s: string): string[] => {
  try { return JSON.parse(s); } catch { return []; }
};
