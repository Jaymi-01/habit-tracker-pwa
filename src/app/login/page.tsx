'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/src/components/auth/LoginForm';
import Link from 'next/link';
import { getSession } from '@/src/lib/auth';
import { ROUTES } from '@/src/lib/constants';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      Promise.resolve().then(() => {
        router.replace(ROUTES.DASHBOARD);
      });
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <h1 className="text-3xl font-bold text-primary mb-8">Habit Tracker</h1>
      <LoginForm />
      <p className="mt-4 text-sm text-foreground/60">
        Don't have an account?{' '}
        <Link href={ROUTES.SIGNUP} className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
