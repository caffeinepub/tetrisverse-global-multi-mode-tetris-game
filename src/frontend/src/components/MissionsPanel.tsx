import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Layers,
  Star,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { useGameTheme } from "../contexts/GameThemeContext";
import { type Translations, useLanguage } from "../contexts/LanguageContext";
import { DEFAULT_MISSIONS, type MissionData } from "../types/missions";

function getMissionDescription(missionId: number, t: Translations): string {
  switch (missionId) {
    case 1:
      return t.mission1Desc;
    case 2:
      return t.mission2Desc;
    case 3:
      return t.mission3Desc;
    case 4:
      return t.mission4Desc;
    case 5:
      return t.mission5Desc;
    case 6:
      return t.mission6Desc;
    case 7:
      return t.mission7Desc;
    case 8:
      return t.mission8Desc;
    default:
      return "";
  }
}

function getMissionReward(missionId: number, t: Translations): string {
  switch (missionId) {
    case 1:
      return t.rewardRetroTheme;
    case 2:
      return t.rewardScoreMultiplier;
    case 3:
      return t.rewardSpaceTheme;
    case 4:
      return t.rewardComboRushBadge;
    case 5:
      return t.rewardOceanTheme;
    case 6:
      return t.rewardGravityBadge;
    case 7:
      return t.rewardMirrorBadge;
    case 8:
      return t.rewardInsanityBadge;
    default:
      return "";
  }
}

function getMissionModeLabel(mode: string, t: Translations): string {
  switch (mode) {
    case "classic":
      return t.classic;
    case "timeAttack":
      return t.timeAttack;
    case "endless":
      return t.endless;
    case "challenge":
      return t.challenge;
    case "puzzle":
      return t.puzzle;
    case "insanity":
      return t.insanity;
    case "mirror":
      return t.mirror;
    case "mirrorMode":
      return t.mirrorMode;
    case "gravityShift":
      return t.gravityShift;
    case "comboRush":
      return t.comboRush;
    case "any":
      return t.anyMode;
    default:
      return mode;
  }
}

interface MissionsPanelProps {
  onBack: () => void;
}

function MissionIcon({
  missionId,
  accentColor,
}: { missionId: number; accentColor: string }) {
  const iconProps = { size: 22, style: { color: accentColor } };
  switch (missionId) {
    case 1:
      return <Layers {...iconProps} />;
    case 2:
      return <Trophy {...iconProps} />;
    case 3:
      return <Timer {...iconProps} />;
    case 4:
      return <Zap {...iconProps} />;
    case 5:
      return <Star {...iconProps} />;
    case 6:
      return <Target {...iconProps} />;
    case 7:
      return <Award {...iconProps} />;
    case 8:
      return <Zap {...iconProps} />;
    default:
      return <Target {...iconProps} />;
  }
}

function loadMissionsFromStorage(): MissionData[] {
  try {
    const saved = localStorage.getItem("tetrisverse-missions");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge saved progress into DEFAULT_MISSIONS so new missions are always present
        return DEFAULT_MISSIONS.map((def) => {
          const found = (parsed as MissionData[]).find((m) => m.id === def.id);
          return found
            ? {
                ...def,
                progress: found.progress ?? 0,
                completed: found.completed ?? false,
              }
            : { ...def };
        });
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_MISSIONS.map((m) => ({ ...m }));
}

export default function MissionsPanel({ onBack }: MissionsPanelProps) {
  const { theme } = useGameTheme();
  const { t } = useLanguage();

  const [missions, setMissions] = useState<MissionData[]>(
    loadMissionsFromStorage,
  );

  // Reload missions from localStorage every time the panel mounts so progress is always fresh
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect
  React.useEffect(() => {
    setMissions(loadMissionsFromStorage());
  }, []);

  const completedCount = missions.filter((m) => m.completed).length;

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
          <div className="flex-1">
            <h2
              className="text-xl font-bold flex items-center gap-2"
              style={{ color: theme.textColor }}
            >
              <Target size={20} style={{ color: theme.accentColor }} />
              {t.missionsTitle}
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{
                color: theme.isDark
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(0,0,0,0.4)",
              }}
            >
              {completedCount}/{missions.length} {t.completed}
            </p>
          </div>
        </div>

        {/* Overall progress */}
        <div
          className="py-3 border-b"
          style={{ borderColor: theme.borderColor }}
        >
          <div
            className="flex justify-between text-xs mb-1.5"
            style={{
              color: theme.isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
            }}
          >
            <span>{t.progress}</span>
            <span>{Math.round((completedCount / missions.length) * 100)}%</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{
              background: theme.isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completedCount / missions.length) * 100}%`,
                background: theme.accentColor,
                boxShadow: `0 0 8px ${theme.glowColor}`,
              }}
            />
          </div>
        </div>

        {/* Missions list */}
        <div className="flex-1 overflow-auto py-3">
          <div className="flex flex-col gap-3">
            {missions.map((mission) => {
              const progressPct = Math.min(
                100,
                Math.round((mission.progress / mission.goal) * 100),
              );
              return (
                <div
                  key={mission.id}
                  className="rounded-lg p-4"
                  style={{
                    background: theme.isDark
                      ? "rgba(0,0,0,0.65)"
                      : "rgba(255,255,255,0.88)",
                    border: `1px solid ${mission.completed ? theme.accentColor : theme.borderColor}`,
                    opacity: mission.completed ? 0.85 : 1,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {mission.completed ? (
                        <CheckCircle2
                          size={22}
                          style={{ color: theme.accentColor }}
                        />
                      ) : (
                        <MissionIcon
                          missionId={mission.id}
                          accentColor={
                            theme.isDark
                              ? "rgba(255,255,255,0.35)"
                              : "rgba(0,0,0,0.35)"
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: theme.textColor }}
                        >
                          {getMissionDescription(mission.id, t)}
                        </p>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{
                            background: theme.isDark
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.06)",
                            color: theme.isDark
                              ? "rgba(255,255,255,0.5)"
                              : "rgba(0,0,0,0.5)",
                          }}
                        >
                          {getMissionModeLabel(mission.mode, t)}
                        </span>
                      </div>

                      {/* Progress bar */}
                      {!mission.completed && (
                        <div className="mb-2">
                          <div
                            className="flex justify-between text-xs mb-1"
                            style={{
                              color: theme.isDark
                                ? "rgba(255,255,255,0.4)"
                                : "rgba(0,0,0,0.4)",
                            }}
                          >
                            <span>
                              {mission.progress}/{mission.goal}
                            </span>
                            <span>{progressPct}%</span>
                          </div>
                          <div
                            className="h-1.5 rounded-full overflow-hidden"
                            style={{
                              background: theme.isDark
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.1)",
                            }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${progressPct}%`,
                                background: theme.accentColor,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Reward */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-xs"
                          style={{
                            color: theme.isDark
                              ? "rgba(255,255,255,0.4)"
                              : "rgba(0,0,0,0.4)",
                          }}
                        >
                          {t.reward}:
                        </span>
                        <span
                          className="text-xs font-medium"
                          style={{ color: theme.accentColor }}
                        >
                          {getMissionReward(mission.id, t)}
                        </span>
                        {mission.completed && (
                          <CheckCircle2
                            size={12}
                            style={{ color: theme.accentColor }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
