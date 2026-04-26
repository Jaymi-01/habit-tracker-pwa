'use client';

import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div 
      data-testid="splash-screen"
      className="fixed inset-0 flex items-center justify-center bg-background z-50"
    >
      <div className="text-center animate-pulse">
        <h1 className="text-4xl font-bold text-primary">Habit Tracker</h1>
        <p className="mt-2 text-foreground/60">Your journey starts here</p>
      </div>
    </div>
  );
};
