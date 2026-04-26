import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    const splash = page.getByTestId('splash-screen');
    await expect(splash).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@example.com' }));
    });
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('new@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    await page.evaluate(() => {
      const user = { id: '1', email: 'user1@example.com', password: 'password', createdAt: new Date().toISOString() };
      const habit = { 
        id: 'h1', 
        userId: '1', 
        name: 'User 1 Habit', 
        description: '', 
        frequency: 'daily', 
        createdAt: new Date().toISOString(), 
        completions: [] 
      };
      localStorage.setItem('habit-tracker-users', JSON.stringify([user]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));
    });

    await page.goto('/login');
    await page.getByTestId('auth-login-email').fill('user1@example.com');
    await page.getByTestId('auth-login-password').fill('password');
    await page.getByTestId('auth-login-submit').click();
    
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('habit-card-user-1-habit')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@example.com' }));
    });
    await page.goto('/dashboard');
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Morning Run');
    await page.getByTestId('habit-description-input').fill('5km run');
    await page.getByTestId('habit-save-button').click();
    
    await expect(page.getByTestId('habit-card-morning-run')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@example.com' }));
      const habit = { 
        id: 'h1', 
        userId: '1', 
        name: 'Daily Yoga', 
        description: '', 
        frequency: 'daily', 
        createdAt: new Date().toISOString(), 
        completions: [] 
      };
      localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));
    });

    await page.goto('/dashboard');
    const streak = page.getByTestId('habit-streak-daily-yoga');
    await expect(streak).toHaveText('0d streak');
    
    await page.getByTestId('habit-complete-daily-yoga').click();
    await expect(streak).toHaveText('1d streak');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@example.com' }));
      const habit = { 
        id: 'h1', 
        userId: '1', 
        name: 'Meditation', 
        description: '', 
        frequency: 'daily', 
        createdAt: new Date().toISOString(), 
        completions: [] 
      };
      localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));
    });

    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-card-meditation')).toBeVisible();
    
    await page.reload();
    await expect(page.getByTestId('habit-card-meditation')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'test@example.com' }));
    });
    await page.goto('/dashboard');
    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL(/\/login/);
    
    const session = await page.evaluate(() => localStorage.getItem('habit-tracker-session'));
    expect(session).toBeNull();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await page.goto('/');
    
    await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.ready;
      }
    });
    
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    
    await context.setOffline(true);
    await page.reload();
    
    await expect(page.getByTestId('splash-screen').or(page.getByTestId('auth-login-email'))).toBeVisible();
  });
});
