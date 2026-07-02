'use client';
import { useEffect } from 'react';
export default function FleetPage() {
  useEffect(() => { window.location.replace('/#/fleet'); }, []);
  return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0a0f1e',color:'#d4af6a',fontFamily:'serif',fontSize:'1.5rem' }}>Redirecting to fleet...</div>;
}
