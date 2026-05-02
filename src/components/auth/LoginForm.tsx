'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@/src/types/auth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const usersJson = localStorage.getItem('habit-tracker-users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    const session: Session = {
      userId: user.id,
      email: user.email,
    };
    localStorage.setItem('habit-tracker-session', JSON.stringify(session));

    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md p-8 bg-background rounded-lg shadow-sm border border-border">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="auth-login-email"
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-ring focus:border-ring outline-none"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="auth-login-password"
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-ring focus:border-ring outline-none"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
        <button
          type="submit"
          data-testid="auth-login-submit"
          className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};
