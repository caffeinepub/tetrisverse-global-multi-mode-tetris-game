import { ArrowLeft, Check, Volume2, VolumeX } from "lucide-react";
import React from "react";
import { THEMES, useGameTheme } from "../contexts/GameThemeContext";
import {
  LANGUAGE_NAMES,
  type Language,
  useLanguage,
} from "../contexts/LanguageContext";
import { useTetrisAudio } from "../contexts/TetrisAudioContext";

interface SettingsPanelProps {
  onBack: () => void;
}

export default function SettingsPanel({ onBack }: SettingsPanelProps) {
  const { theme, themeName, setTheme, allThemes } = useGameTheme();
  const { t, language, setLanguage, allLanguages } = useLanguage();
  const { isMuted, toggleMute } = useTetrisAudio();

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden relative"
      style={{
        background: theme.background,
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "calc(100vh - 48px)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: theme.isDark
            ? "rgba(0,0,0,0.75)"
            : "rgba(255,255,255,0.75)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full max-w-2xl mx-auto w-full px-4 overflow-auto">
        {/* Header */}
        <div
          className="flex items-center gap-3 py-4 border-b flex-shrink-0"
          style={{ borderColor: theme.borderColor }}
        >
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded transition-all hover:opacity-70"
            style={{
              color: theme.accentColor,
              border: `1px solid ${theme.borderColor}`,
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-bold" style={{ color: theme.textColor }}>
            {t.settings}
          </h2>
        </div>

        <div className="flex flex-col gap-6 py-4">
          {/* Audio section */}
          <section>
            <h3
              className="text-sm font-semibold mb-3 uppercase tracking-wider"
              style={{ color: theme.accentColor }}
            >
              {t.audio}
            </h3>
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                background: theme.isDark
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(255,255,255,0.85)",
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              <div className="flex items-center gap-3">
                {isMuted ? (
                  <VolumeX
                    size={20}
                    style={{
                      color: theme.isDark
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(0,0,0,0.4)",
                    }}
                  />
                ) : (
                  <Volume2 size={20} style={{ color: theme.accentColor }} />
                )}
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.textColor }}
                >
                  {isMuted ? t.mute : t.unmute}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleMute}
                className="relative w-12 h-6 rounded-full transition-all duration-300"
                style={{
                  background: isMuted
                    ? theme.isDark
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.15)"
                    : theme.accentColor,
                }}
              >
                <span
                  className="absolute top-1 w-4 h-4 rounded-full transition-all duration-300"
                  style={{
                    background: "#ffffff",
                    left: isMuted ? 4 : 28,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                />
              </button>
            </div>
          </section>

          {/* Theme section */}
          <section>
            <h3
              className="text-sm font-semibold mb-3 uppercase tracking-wider"
              style={{ color: theme.accentColor }}
            >
              {t.theme}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allThemes.map((t2) => (
                <button
                  type="button"
                  key={t2.id}
                  onClick={() => setTheme(t2.id)}
                  className="relative rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
                  style={{
                    border: `2px solid ${themeName === t2.id ? t2.accentColor : "transparent"}`,
                    boxShadow:
                      themeName === t2.id
                        ? `0 0 12px ${t2.glowColor}66`
                        : "none",
                    aspectRatio: "4/3",
                  }}
                >
                  {t2.backgroundImage && (
                    <img
                      src={t2.backgroundImage}
                      alt={t2.displayName}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-end pb-1"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <span className="text-white text-xs font-semibold drop-shadow">
                      {t2.displayName}
                    </span>
                  </div>
                  {themeName === t2.id && (
                    <div
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: t2.accentColor }}
                    >
                      <Check size={10} color="#000" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Language section */}
          <section>
            <h3
              className="text-sm font-semibold mb-3 uppercase tracking-wider"
              style={{ color: theme.accentColor }}
            >
              {t.language}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allLanguages.map((lang) => (
                <button
                  type="button"
                  key={lang}
                  onClick={() => setLanguage(lang as Language)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all hover:opacity-80"
                  style={
                    language === lang
                      ? {
                          background: theme.accentColor,
                          color: theme.isDark ? "#000" : "#fff",
                          border: `1px solid ${theme.accentColor}`,
                        }
                      : {
                          background: theme.isDark
                            ? "rgba(0,0,0,0.5)"
                            : "rgba(255,255,255,0.8)",
                          color: theme.textColor,
                          border: `1px solid ${theme.borderColor}`,
                        }
                  }
                >
                  <span>{LANGUAGE_NAMES[lang as Language]}</span>
                  {language === lang && <Check size={14} />}
                </button>
              ))}
            </div>
          </section>

          {/* App info */}
          <section>
            <h3
              className="text-sm font-semibold mb-3 uppercase tracking-wider"
              style={{ color: theme.accentColor }}
            >
              About
            </h3>
            <div
              className="p-4 rounded-lg text-sm"
              style={{
                background: theme.isDark
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(255,255,255,0.85)",
                border: `1px solid ${theme.borderColor}`,
                color: theme.isDark
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(0,0,0,0.6)",
              }}
            >
              <p
                className="font-semibold mb-1"
                style={{ color: theme.textColor }}
              >
                TetrisVerse v1.0.0
              </p>
              <p className="text-xs mb-2">
                The ultimate multi-mode Tetris experience with 9 game modes and
                8 themes.
              </p>
              <a
                href="/app-ads.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:opacity-80 transition-opacity"
                style={{ color: theme.accentColor }}
              >
                app-ads.txt (AdMob Verification)
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
