'use client';

import { useEffect } from 'react';

// Redirect /admin → /#/admin (hash-based routing for the SPA)
export default function AdminPage() {
  useEffect(() => {
    window.location.replace('/#/admin');
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0a0f1e',
      color: '#d4af6a',
      fontFamily: 'serif',
      fontSize: '1.5rem',
    }}>
      Redirecting to admin...
    </div>
  );
}
