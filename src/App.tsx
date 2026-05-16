import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DesktopLayout } from '@/components/layout/DesktopLayout';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAudioEngine } from '@/features/player/hooks/useAudioEngine';
import { useMediaSession } from '@/hooks/useMediaSession';

import { HomePage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { LibraryPage } from '@/pages/LibraryPage';
import { ProfilePage } from '@/pages/ProfilePage';

export function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Mount singleton hooks
  useAudioEngine();
  useMediaSession();

  // Initialize Supabase session on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!isInitialized) {
    // Show splash screen or spinner while checking session
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface-base">
        <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<DesktopLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
