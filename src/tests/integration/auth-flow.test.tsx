import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '../../components/auth/SignupForm';
import { LoginForm } from '../../components/auth/LoginForm';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('auth flow', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    window.localStorage.clear();
  });

  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);
    
    const emailInput = screen.getByTestId('auth-signup-email');
    const passwordInput = screen.getByTestId('auth-signup-password');
    const submitButton = screen.getByTestId('auth-signup-submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const session = JSON.parse(window.localStorage.getItem('habit-tracker-session') || 'null');
      expect(session).not.toBeNull();
      expect(session.email).toBe('test@example.com');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    const existingUser = {
      id: '1',
      email: 'test@example.com',
      password: 'password',
      createdAt: new Date().toISOString(),
    };
    window.localStorage.setItem('habit-tracker-users', JSON.stringify([existingUser]));

    render(<SignupForm />);
    
    const emailInput = screen.getByTestId('auth-signup-email');
    const passwordInput = screen.getByTestId('auth-signup-password');
    const submitButton = screen.getByTestId('auth-signup-submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('submits the login form and stores the active session', async () => {
    const existingUser = {
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
    };
    window.localStorage.setItem('habit-tracker-users', JSON.stringify([existingUser]));

    render(<LoginForm />);
    
    const emailInput = screen.getByTestId('auth-login-email');
    const passwordInput = screen.getByTestId('auth-login-password');
    const submitButton = screen.getByTestId('auth-login-submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const session = JSON.parse(window.localStorage.getItem('habit-tracker-session') || 'null');
      expect(session).not.toBeNull();
      expect(session.email).toBe('test@example.com');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByTestId('auth-login-email');
    const passwordInput = screen.getByTestId('auth-login-password');
    const submitButton = screen.getByTestId('auth-login-submit');

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
