'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { PublicSite } from '@/components/site/public-site';
import { AdminPanel } from '@/components/admin/admin-panel';

// ---------- Hash router ----------
// Routes: #/, #/fleet, #/car/:slug, #/about, #/contact, #/admin
type Route =
  | { name: 'home' }
  | { name: 'fleet'; query?: string }
  | { name: 'car'; slug: string }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'admin' };

function parseHash(): Route {
  if (typeof window === 'undefined') return { name: 'home' };
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path, queryStr] = hash.split('?');
  const parts = path.split('/').filter(Boolean);
  const query = new URLSearchParams(queryStr || '');

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'fleet') return { name: 'fleet', query: query.get('q') || undefined };
  if (parts[0] === 'car' && parts[1]) return { name: 'car', slug: parts[1] };
  if (parts[0] === 'about') return { name: 'about' };
  if (parts[0] === 'contact') return { name: 'contact' };
  if (parts[0] === 'admin') return { name: 'admin' };
  return { name: 'home' };
}

export default function Home() {
  const [route, setRoute] = useState<Route>({ name: 'home' });

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route.name === 'admin') {
    return <AdminPanel />;
  }
  return <PublicSite route={route} />;
}
