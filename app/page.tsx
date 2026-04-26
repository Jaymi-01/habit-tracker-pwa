'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/shared/SplashScreen';

/**
 * Boot Route (/)
 * - Renders Splash Screen immediately.
 * - Waits 1.5s (per TRD requirement for testability).
 * - Redirects to /dashboard if session exists, else /login.
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = localStorage.getItem('habit-tracker-session');
      if (session && session !== 'null') {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
