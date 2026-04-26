# Habit Tracker PWA

A mobile-first, clean, and intuitive habit tracking Progressive Web App built with Next.js and Tailwind CSS. This application allows users to manage their daily habits with full offline support and local persistence.

## Project Overview
This project is a technical implementation of a Habit Tracker PWA. It features a neutral, clean UI (strictly avoiding blue as requested) and focuses on deterministic behavior, testability, and a seamless mobile experience.

## Setup Instructions
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Jaymi-01/habit-tracker-pwa.git
    cd habit-tracker
    ```
2.  **Install dependencies**:
    ```bash
    pnpm install
    ```
3.  **Install Playwright browsers**:
    ```bash
    pnpm exec playwright install chromium
    ```

## Run Instructions
To start the development server:
```bash
pnpm run dev
```
The app will be available at `http://localhost:3000`.

To build for production:
```bash
pnpm run build
pnpm run start
```

## Test Instructions
The project includes a comprehensive test suite covering unit, integration, and end-to-end tests.

- **Run all tests**: `pnpm run test`
- **Unit tests**: `pnpm run test:unit` (includes coverage report)
- **Integration tests**: `pnpm run test:integration`
- **E2E tests**: `pnpm run test:e2e`

## Local Persistence Structure
The application uses `localStorage` for deterministic persistence. The following keys are used:

- `habit-tracker-users`: Stores an array of `User` objects (id, email, password, createdAt).
- `habit-tracker-session`: Stores the current `Session` object (userId, email) or `null`.
- `habit-tracker-habits`: Stores an array of `Habit` objects.
  - `completions`: An array of strings in `YYYY-MM-DD` format representing the dates the habit was completed.

## PWA Implementation
PWA support is implemented using a standard manifest and a custom Service Worker:
- **`public/manifest.json`**: Defines the app name, icons, theme colors, and display mode.
- **`public/sw.js`**: A Service Worker that caches the "App Shell" (core routes and assets) to ensure the application loads even when offline. It uses a "stale-while-revalidate" or "cache-first" strategy for static assets.
- **Registration**: The Service Worker is registered in `app/layout.tsx` for client-side activation.

## Trade-offs and Limitations
- **Local Persistence**: Since the app relies on `localStorage`, data is scoped to the specific browser and device. Clearing browser data will remove all habit history.
- **Daily Frequency**: The current implementation strictly supports daily habits as per the TRD.
- **Offline Writes**: While the app shell is cached, the TRD focuses on basic offline rendering. Persistent writes (like creating a habit) while offline are supported locally in `localStorage` and will persist across reloads on the same device.

## Test Mapping
The following test files verify specific behaviors:

### Unit Tests (`tests/unit/`)
- `slug.test.ts`: Verifies `getHabitSlug` logic (hyphenation, sanitization).
- `validators.test.ts`: Verifies `validateHabitName` (required field, length limits).
- `streaks.test.ts`: Verifies `calculateCurrentStreak` (consecutive days, duplicate handling, missing days).
- `habits.test.ts`: Verifies `toggleHabitCompletion` (adding/removing dates without mutation).

### Integration Tests (`tests/integration/`)
- `auth-flow.test.tsx`: Verifies signup, duplicate email prevention, login validation, and session creation.
- `habit-form.test.tsx`: Verifies habit creation, editing, deletion confirmation, and completion toggling.

### E2E Tests (`tests/e2e/`)
- `app.spec.ts`: Verifies the complete user journey, including splash screen redirects, authenticated routing, persistence after reload, logout flow, and basic offline PWA capability.
