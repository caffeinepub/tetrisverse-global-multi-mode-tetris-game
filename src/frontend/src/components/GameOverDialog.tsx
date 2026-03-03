import { Home, List, RotateCcw, Trophy } from "lucide-react";
import React, { useState } from "react";
import type { GameTheme } from "../contexts/GameThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useSubmitScore } from "../hooks/useQueries";
import { type GameMode, MODE_CONFIGS } from "../types/game";

interface GameOverDialogProps {
  score: number;
  lines: number;
  level: number;
  won: boolean;
  mode: GameMode;
  theme: GameTheme;
  onRestart: () => void;
  onMenu: () => void;
  onLeaderboard: () => void;
}

export default function GameOverDialog({
  score,
  lines,
  level,
  won,
  mode,
  theme,
  onRestart,
  onMenu,
  onLeaderboard,
}: GameOverDialogProps) {
  const { t } = useLanguage();
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitScore = useSubmitScore();

  const isLight = !theme.isDark;
  const bg = theme.surfaceColor;
  const border = theme.borderColor;
  const text = theme.textColor;
  const primary = theme.primaryColor;

  const handleSubmit = async () => {
    if (!playerName.trim()) return;
    await submitScore.mutateAsync({ name: playerName.trim(), score, mode });
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <div
        className="rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl"
        style={{ background: bg, border: `2px solid ${border}`, color: text }}
      >
        {/* Title */}
        <div className="text-center mb-6">
          {won ? (
            <div className="flex flex-col items-center gap-2">
              <Trophy size={48} style={{ color: "#ffd700" }} />
              <h2 className="text-3xl font-bold" style={{ color: "#ffd700" }}>
                {t.youWin}
              </h2>
            </div>
          ) : (
            <h2 className="text-3xl font-bold" style={{ color: primary }}>
              {t.gameOver}
            </h2>
          )}
          <p className="text-sm mt-1 opacity-70">{MODE_CONFIGS[mode].name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: t.finalScore, value: score.toLocaleString() },
            { label: t.linesCleared, value: lines },
            { label: t.level, value: level },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="text-center rounded-xl p-3"
              style={{
                background: isLight
                  ? "rgba(0,0,0,0.05)"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${border}`,
              }}
            >
              <div className="text-xl font-bold" style={{ color: primary }}>
                {value}
              </div>
              <div className="text-xs opacity-60">{label}</div>
            </div>
          ))}
        </div>

        {/* Score submission */}
        {!submitted ? (
          <div className="mb-4">
            <input
              type="text"
              placeholder={t.enterName}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              className="w-full rounded-lg px-3 py-2 text-sm mb-2 outline-none"
              style={{
                background: isLight
                  ? "rgba(0,0,0,0.05)"
                  : "rgba(255,255,255,0.1)",
                border: `1px solid ${border}`,
                color: text,
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!playerName.trim() || submitScore.isPending}
              className="w-full rounded-lg py-2 text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{
                background: primary,
                color: theme.isDark ? "#000" : "#fff",
              }}
            >
              {submitScore.isPending ? "..." : t.submitScore}
            </button>
          </div>
        ) : (
          <div className="text-center text-sm mb-4 opacity-70">
            ✓ Score submitted!
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg py-2 text-sm font-semibold"
            style={{
              background: primary,
              color: theme.isDark ? "#000" : "#fff",
            }}
          >
            <RotateCcw size={14} /> {t.restart}
          </button>
          <button
            type="button"
            onClick={onLeaderboard}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg py-2 text-sm font-semibold"
            style={{
              background: isLight
                ? "rgba(0,0,0,0.08)"
                : "rgba(255,255,255,0.1)",
              border: `1px solid ${border}`,
              color: text,
            }}
          >
            <List size={14} /> {t.leaderboard}
          </button>
          <button
            type="button"
            onClick={onMenu}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg py-2 text-sm font-semibold"
            style={{
              background: isLight
                ? "rgba(0,0,0,0.08)"
                : "rgba(255,255,255,0.1)",
              border: `1px solid ${border}`,
              color: text,
            }}
          >
            <Home size={14} /> {t.menu}
          </button>
        </div>
      </div>
    </div>
  );
}
