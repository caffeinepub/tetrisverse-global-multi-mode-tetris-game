import React, { useState } from 'react';
import { useGameTheme } from '../contexts/GameThemeContext';
import { useLanguage, LANGUAGE_NAMES, Language } from '../contexts/LanguageContext';
import { useTetrisAudio } from '../contexts/TetrisAudioContext';
import { Volume2, VolumeX, Globe, Palette } from 'lucide-react';
import { Screen } from '../App';

interface HeaderProps {
  onNavigate: (screen: Screen) => void;
  currentScreen: Screen;
}

export default function Header({ onNavigate, currentScreen }: HeaderProps) {
  const { theme } = useGameTheme();
  const { t, language, setLanguage, allLanguages } = useLanguage();
  const { isMuted, toggleMute } = useTetrisAudio();
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header
      className="relative z-50 flex items-center justify-between px-4 py-2 border-b"
      style={{
        background: theme.isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.92)',
        borderColor: theme.borderColor,
        backdropFilter: 'blur(10px)',
      }}
    >
      <button
        onClick={() => onNavigate('menu')}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <img
          src="/assets/generated/tetrisverse-logo-transparent.dim_200x200.png"
          alt="TetrisVerse"
          className="h-8 w-8 object-contain"
          style={{ filter: `drop-shadow(0 0 6px ${theme.glowColor})` }}
        />
        <span
          className="font-bold text-lg hidden sm:block"
          style={{ color: theme.accentColor, textShadow: `0 0 10px ${theme.glowColor}` }}
        >
          TetrisVerse
        </span>
      </button>

      <nav className="flex items-center gap-1 sm:gap-2">
        {currentScreen !== 'game' && (
          <>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="px-2 py-1 text-xs sm:text-sm rounded transition-all hover:opacity-80"
              style={{ color: theme.textColor, border: `1px solid ${theme.borderColor}` }}
            >
              {t.leaderboard}
            </button>
            <button
              onClick={() => onNavigate('missions')}
              className="px-2 py-1 text-xs sm:text-sm rounded transition-all hover:opacity-80"
              style={{ color: theme.textColor, border: `1px solid ${theme.borderColor}` }}
            >
              {t.missions}
            </button>
          </>
        )}

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(v => !v)}
            className="p-1.5 rounded transition-all hover:opacity-80"
            style={{ color: theme.accentColor, border: `1px solid ${theme.borderColor}` }}
            title={t.language}
          >
            <Globe size={16} />
          </button>
          {showLangMenu && (
            <div
              className="absolute right-0 top-full mt-1 rounded shadow-lg z-50 min-w-[130px]"
              style={{
                background: theme.isDark ? '#0d0d20' : '#ffffff',
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              {allLanguages.map(lang => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang as Language); setShowLangMenu(false); }}
                  className="block w-full text-left px-3 py-1.5 text-xs hover:opacity-70 transition-opacity"
                  style={{
                    color: lang === language ? theme.accentColor : theme.textColor,
                    background: lang === language
                      ? (theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')
                      : 'transparent',
                  }}
                >
                  {LANGUAGE_NAMES[lang as Language]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => onNavigate('settings')}
          className="p-1.5 rounded transition-all hover:opacity-80"
          style={{ color: theme.accentColor, border: `1px solid ${theme.borderColor}` }}
          title={t.settings}
        >
          <Palette size={16} />
        </button>

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded transition-all hover:opacity-80"
          style={{
            color: isMuted ? (theme.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)') : theme.accentColor,
            border: `1px solid ${theme.borderColor}`,
          }}
          title={isMuted ? t.unmute : t.mute}
        >
          <span className={`transition-all duration-300 ${isMuted ? 'opacity-50' : 'opacity-100'}`}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </span>
        </button>
      </nav>
    </header>
  );
}
