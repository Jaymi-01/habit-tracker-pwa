'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';
import { SplashScreen } from './SplashScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace(ROUTES.LOGIN);
    } else {
      setIsAuthorized(true);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return isAuthorized ? <>{children}</> : null;
};
