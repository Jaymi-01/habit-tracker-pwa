'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/src/components/auth/SignupForm';
import Link from 'next/link';
import { getSession } from '@/src/lib/auth';
import { ROUTES } from '@/src/lib/constants';

export default function SignupPage() {
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
      <SignupForm />
      <p className="mt-4 text-sm text-foreground/60">
        Already have an account?{' '}
        <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
