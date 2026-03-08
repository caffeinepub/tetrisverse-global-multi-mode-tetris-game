import { ArrowLeft, Medal, Trophy } from "lucide-react";
import React, { useState } from "react";
import { useGameTheme } from "../contexts/GameThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useGetTopScores } from "../hooks/useQueries";
import { type GameMode, MODE_CONFIGS } from "../types/game";

interface LeaderboardProps {
  onBack: () => void;
}

const ALL_MODES: GameMode[] = [
  "classic",
  "timeAttack",
  "endless",
  "challenge",
  "puzzle",
  "insanity",
  "mirror",
  "gravityShift",
  "comboRush",
];

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const { theme } = useGameTheme();
  const { t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<GameMode>("classic");

  const { data: scores, isLoading, isError } = useGetTopScores(selectedMode);

  const isLight = !theme.isDark;
  const text = theme.textColor;
  const primary = theme.primaryColor;
  const border = theme.borderColor;

  const getModeLabel = (mode: GameMode): string => {
    const labels: Record<GameMode, string> = {
      classic: t.classic,
      timeAttack: t.timeAttack,
      endless: t.endless,
      challenge: t.challenge,
      puzzle: t.puzzle,
      insanity: t.insanity,
      mirror: t.mirrorMode,
      gravityShift: t.gravityShift,
      comboRush: t.comboRush,
    };
    return labels[mode] || mode;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy size={18} style={{ color: "#ffd700" }} />;
    if (rank === 1) return <Medal size={18} style={{ color: "#c0c0c0" }} />;
    if (rank === 2) return <Medal size={18} style={{ color: "#cd7f32" }} />;
    return <span className="text-sm font-bold opacity-50">#{rank + 1}</span>;
  };

  const formatDate = (timestamp: bigint) => {
    try {
      return new Date(Number(timestamp) / 1_000_000).toLocaleDateString();
    } catch {
      return "-";
    }
  };

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

      <div className="relative z-10 flex flex-col h-full max-w-2xl mx-auto w-full px-4">
        {/* Header */}
        <div
          className="flex items-center gap-3 py-4 border-b"
          style={{ borderColor: border }}
        >
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded transition-all hover:opacity-70"
            style={{ color: primary, border: `1px solid ${border}` }}
          >
            <ArrowLeft size={18} />
          </button>
          <h2
            className="text-xl font-bold flex items-center gap-2"
            style={{ color: text }}
          >
            <Trophy size={20} style={{ color: "#ffd700" }} />
            {t.leaderboard}
          </h2>
        </div>

        {/* Mode tabs */}
        <div
          className="flex gap-1.5 flex-wrap py-3 border-b"
          style={{ borderColor: border }}
        >
          {ALL_MODES.map((mode) => (
            <button
              type="button"
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className="px-2.5 py-1 rounded text-xs font-medium transition-all"
              style={
                selectedMode === mode
                  ? {
                      background: primary,
                      color: isLight ? "#fff" : "#000",
                    }
                  : {
                      background: isLight
                        ? "rgba(0,0,0,0.06)"
                        : "rgba(255,255,255,0.08)",
                      color: text,
                      border: `1px solid ${border}`,
                    }
              }
            >
              {MODE_CONFIGS[mode].icon} {getModeLabel(mode)}
            </button>
          ))}
        </div>

        {/* Scores list */}
        <div className="flex-1 overflow-auto py-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-sm opacity-50">{t.leaderboard}...</div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Trophy
                size={40}
                style={{
                  color: isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
                }}
              />
              <p className="text-sm opacity-50 text-center px-4">
                {t.noScores}
              </p>
            </div>
          ) : !scores || scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Trophy
                size={40}
                style={{
                  color: isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
                }}
              />
              <p className="text-sm opacity-50">{t.noScores}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {scores.map((entry, idx) => (
                <div
                  key={`${entry.playerName}-${idx}`}
                  className="flex items-center gap-3 rounded-lg px-4 py-3"
                  style={{
                    background: isLight
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(0,0,0,0.6)",
                    border: `1px solid ${border}`,
                  }}
                >
                  <div className="w-8 flex justify-center flex-shrink-0">
                    {getRankIcon(idx)}
                  </div>
                  <div className="flex-1 font-medium" style={{ color: text }}>
                    {entry.playerName}
                  </div>
                  <div className="font-bold text-lg" style={{ color: primary }}>
                    {Number(entry.score).toLocaleString()}
                  </div>
                  <div className="text-xs opacity-50" style={{ color: text }}>
                    {formatDate(entry.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
