'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/auth';
import { ROUTES, SPLASH_DURATION } from '@/lib/constants';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getSession();
      // Use a microtask to ensure router is ready
      Promise.resolve().then(() => {
        if (session) {
          router.replace(ROUTES.DASHBOARD);
        } else {
          router.replace(ROUTES.LOGIN);
        }
      });
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
