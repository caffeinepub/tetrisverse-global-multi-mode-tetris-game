import { X } from "lucide-react";
import React from "react";
import { useGameTheme } from "../contexts/GameThemeContext";
import { type Translations, useLanguage } from "../contexts/LanguageContext";
import { type GameMode, MODE_CONFIGS } from "../types/game";

interface ModeSelectorProps {
  onSelect: (mode: GameMode) => void;
  onClose: () => void;
}

const MODE_ICONS: Partial<Record<GameMode, string>> = {
  comboRush: "/assets/generated/combo-rush-mode-icon-transparent.dim_64x64.png",
  gravityShift:
    "/assets/generated/gravity-shift-mode-icon-transparent.dim_64x64.png",
  mirror: "/assets/generated/mirror-mode-icon-transparent.dim_64x64.png",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#00ff88",
  Medium: "#ffd700",
  Hard: "#ff8800",
  Expert: "#ff3366",
  Insane: "#bf00ff",
};

// Map mode key to translated name key
const MODE_NAME_KEY: Record<GameMode, keyof Translations> = {
  classic: "classic",
  timeAttack: "timeAttack",
  endless: "endless",
  challenge: "challenge",
  puzzle: "puzzle",
  insanity: "insanity",
  mirror: "mirrorMode",
  gravityShift: "gravityShift",
  comboRush: "comboRush",
};

// Map mode key to translated description key
const MODE_DESC_KEY: Record<GameMode, keyof Translations> = {
  classic: "classicDesc",
  timeAttack: "timeAttackDesc",
  endless: "endlessDesc",
  challenge: "challengeDesc",
  puzzle: "puzzleDesc",
  insanity: "insanityDesc",
  mirror: "mirrorDesc",
  gravityShift: "gravityShiftDesc",
  comboRush: "comboRushDesc",
};

// Map difficulty value to translated key
const DIFF_KEY: Record<string, keyof Translations> = {
  Easy: "diffEasy",
  Medium: "diffMedium",
  Hard: "diffHard",
  Expert: "diffExpert",
  Insane: "diffInsane",
};

export default function ModeSelector({ onSelect, onClose }: ModeSelectorProps) {
  const { theme } = useGameTheme();
  const { t } = useLanguage();

  const isLight = !theme.isDark;
  const bg = isLight ? "rgba(255,255,255,0.98)" : "rgba(10,10,30,0.98)";
  const text = theme.textColor;
  const border = theme.borderColor;
  const primary = theme.primaryColor;

  const modes = Object.entries(MODE_CONFIGS) as [
    GameMode,
    (typeof MODE_CONFIGS)[GameMode],
  ][];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <div
        className="rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        style={{ background: bg, border: `2px solid ${border}`, color: text }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold" style={{ color: primary }}>
            {t.selectMode}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: text }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modes.map(([modeKey, config]) => (
            <button
              type="button"
              key={modeKey}
              onClick={() => onSelect(modeKey)}
              className="rounded-xl p-4 text-left transition-all hover:scale-105 active:scale-95"
              style={{
                background: isLight
                  ? "rgba(0,0,0,0.04)"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${border}`,
                color: text,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {MODE_ICONS[modeKey] ? (
                  <img
                    src={MODE_ICONS[modeKey]}
                    alt={t[MODE_NAME_KEY[modeKey]] as string}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <span className="text-2xl">{config.icon}</span>
                )}
                <div>
                  <div className="font-bold text-sm">
                    {t[MODE_NAME_KEY[modeKey]] as string}
                  </div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: DIFFICULTY_COLORS[config.difficulty] }}
                  >
                    {t[DIFF_KEY[config.difficulty]] as string}
                  </div>
                </div>
              </div>
              <p className="text-xs opacity-60 leading-relaxed">
                {t[MODE_DESC_KEY[modeKey]] as string}
              </p>
              <div className="mt-2 text-xs" style={{ color: primary }}>
                ×{config.scoreMultiplier} {t.score}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
