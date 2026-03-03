import { Play, Settings, Target, Trophy } from "lucide-react";
import React from "react";
import { useGameTheme } from "../contexts/GameThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

interface MainMenuProps {
  onPlay: () => void;
  onLeaderboard: () => void;
  onMissions: () => void;
  onSettings: () => void;
}

export default function MainMenu({
  onPlay,
  onLeaderboard,
  onMissions,
  onSettings,
}: MainMenuProps) {
  const { theme } = useGameTheme();
  const { t } = useLanguage();

  const menuButtons = [
    { label: t.play, icon: <Play size={20} />, onClick: onPlay, primary: true },
    {
      label: t.leaderboard,
      icon: <Trophy size={20} />,
      onClick: onLeaderboard,
      primary: false,
    },
    {
      label: t.missions,
      icon: <Target size={20} />,
      onClick: onMissions,
      primary: false,
    },
    {
      label: t.settings,
      icon: <Settings size={20} />,
      onClick: onSettings,
      primary: false,
    },
  ];

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center min-h-0 relative overflow-hidden"
      style={{
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "calc(100vh - 48px)",
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: theme.isDark
            ? "rgba(0,0,0,0.65)"
            : "rgba(255,255,255,0.6)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 py-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <img
            src="/assets/generated/tetrisverse-logo.dim_400x200.png"
            alt="TetrisVerse"
            className="w-48 sm:w-64 object-contain"
            style={{ filter: `drop-shadow(0 0 20px ${theme.glowColor})` }}
          />
          <p
            className="text-sm sm:text-base text-center max-w-xs"
            style={{
              color: theme.isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
            }}
          >
            The ultimate Tetris experience — 9 modes, 8 themes
          </p>
        </div>

        {/* Menu buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {menuButtons.map((btn) => (
            <button
              type="button"
              key={btn.label}
              onClick={btn.onClick}
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 active:scale-95"
              style={
                btn.primary
                  ? {
                      background: theme.accentColor,
                      color: theme.isDark ? "#000" : "#fff",
                      boxShadow: `0 0 20px ${theme.glowColor}88`,
                    }
                  : {
                      background: theme.isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)",
                      color: theme.textColor,
                      border: `1px solid ${theme.borderColor}`,
                    }
              }
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        {/* Version */}
        <p
          className="text-xs"
          style={{
            color: theme.isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
          }}
        >
          v1.0.0
        </p>
      </div>
    </div>
  );
}
