import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useUIStore } from '@/stores/useUIStore';

// We'll import these later when we build them
import { MiniPlayer } from '@/features/player/components/MiniPlayer';
import { FullscreenPlayer } from '@/features/player/components/FullscreenPlayer';
import { PandaChatModal } from '@/features/panda/components/PandaChatModal';

export function MobileLayout() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isChatOpen = useUIStore((state) => state.isChatOpen);
  const closeChat = useUIStore((state) => state.closeChat);
  const chatInitialMessage = useUIStore((state) => state.chatInitialMessage);

  return (
    <div className="flex flex-col h-screen w-full bg-surface-base overflow-hidden relative">
      <TopBar />
      
      {/* 
        Main scrollable area.
        Padding top accounts for TopBar + safe area.
        Padding bottom accounts for BottomNav + MiniPlayer + safe area.
      */}
      <main className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden scroll-container pt-[calc(var(--top-bar-height)+var(--safe-area-top))] pb-nav">
        {/* AnimatePresence for page transitions can go here later */}
        <Outlet />
      </main>

      {/* 
        MiniPlayer sits right above the BottomNav.
        We conditionally render a placeholder for now until we build it.
      */}
      {currentTrack && (
        <div className="fixed bottom-[calc(var(--bottom-nav-height)+var(--safe-area-bottom))] left-0 right-0 z-[400] px-2 pb-2">
           <MiniPlayer />
        </div>
      )}

      <BottomNav />

      <FullscreenPlayer />

      {/* Global Panda Chat Modal — mobile bottom sheet */}
      <PandaChatModal
        isOpen={isChatOpen}
        onClose={closeChat}
        initialMessage={chatInitialMessage}
      />
    </div>
  );
}
