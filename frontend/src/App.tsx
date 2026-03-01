import React, { useState } from 'react';
import { GameThemeProvider } from './contexts/GameThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { TetrisAudioProvider } from './contexts/TetrisAudioContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import MainMenu from './components/MainMenu';
import ModeSelector from './components/ModeSelector';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';
import MissionsPanel from './components/MissionsPanel';
import SettingsPanel from './components/SettingsPanel';
import MissionNotification from './components/MissionNotification';
import { GameMode } from './types/game';
import { Toaster } from '@/components/ui/sonner';

export type Screen = 'menu' | 'modeSelect' | 'game' | 'leaderboard' | 'missions' | 'settings';

const queryClient = new QueryClient();

function AppContent() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [showModeSelector, setShowModeSelector] = useState(false);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setShowModeSelector(false);
    setScreen('game');
  };

  const handlePlayClick = () => {
    setShowModeSelector(true);
  };

  const handleBackToMenu = () => {
    setScreen('menu');
    setShowModeSelector(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-game-bg text-foreground">
      <Header onNavigate={setScreen} currentScreen={screen} />
      <main className="flex-1 flex flex-col relative">
        {screen === 'menu' && (
          <MainMenu
            onPlay={handlePlayClick}
            onLeaderboard={() => setScreen('leaderboard')}
            onMissions={() => setScreen('missions')}
            onSettings={() => setScreen('settings')}
          />
        )}
        {screen === 'game' && (
          <GameBoard
            mode={selectedMode}
            onMenu={handleBackToMenu}
            onLeaderboard={() => setScreen('leaderboard')}
          />
        )}
        {screen === 'leaderboard' && (
          <Leaderboard onBack={handleBackToMenu} />
        )}
        {screen === 'missions' && (
          <MissionsPanel onBack={handleBackToMenu} />
        )}
        {screen === 'settings' && (
          <SettingsPanel onBack={handleBackToMenu} />
        )}

        {/* Mode selector modal */}
        {showModeSelector && (
          <ModeSelector
            onSelect={handleModeSelect}
            onClose={() => setShowModeSelector(false)}
          />
        )}
      </main>
      {screen !== 'game' && <Footer />}
      <MissionNotification />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameThemeProvider>
        <LanguageProvider>
          <TetrisAudioProvider>
            <AppContent />
          </TetrisAudioProvider>
        </LanguageProvider>
      </GameThemeProvider>
    </QueryClientProvider>
  );
}
