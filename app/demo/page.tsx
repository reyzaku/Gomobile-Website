'use client';
/**
 * /demo route — activates Demo Mode and redirects to homepage.
 * Share this URL with stakeholders to show the site with lorem ipsum.
 * To deactivate: click the "DEMO MODE: ON" badge bottom-left, or visit /demo/off.
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoActivatePage() {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.setItem('gm-demo-unlocked', '1');
    sessionStorage.setItem('gm-demo-active', '1');
    router.replace('/');
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        opacity: 0.4,
      }}
    >
      Activating demo mode…
    </div>
  );
}
