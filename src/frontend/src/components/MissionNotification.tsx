import { CheckCircle2, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useGameTheme } from "../contexts/GameThemeContext";
import { type Translations, useLanguage } from "../contexts/LanguageContext";

interface Notification {
  id: number;
  missionId: number;
  title: string;
  reward: string;
}

function getMissionDesc(missionId: number, t: Translations): string {
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
      return t.missions;
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

export default function MissionNotification() {
  const { theme } = useGameTheme();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleMissionComplete = (e: CustomEvent) => {
      const { missionId, title, reward } = e.detail;
      const id = Date.now();
      setNotifications((prev) => [
        ...prev,
        { id, missionId: missionId ?? 0, title, reward },
      ]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 4500);
    };

    window.addEventListener(
      "missionComplete",
      handleMissionComplete as EventListener,
    );
    return () =>
      window.removeEventListener(
        "missionComplete",
        handleMissionComplete as EventListener,
      );
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((n) => {
        const desc = n.missionId > 0 ? getMissionDesc(n.missionId, t) : n.title;
        const rewardText =
          n.missionId > 0 ? getMissionReward(n.missionId, t) : n.reward;
        return (
          <div
            key={n.id}
            className="flex items-start gap-3 rounded-xl px-4 py-3 shadow-2xl pointer-events-auto animate-in slide-in-from-right"
            style={{
              background: theme.isDark
                ? "rgba(10,10,30,0.97)"
                : "rgba(255,255,255,0.97)",
              border: `2px solid ${theme.accentColor}`,
              boxShadow: `0 0 20px ${theme.glowColor}66`,
              minWidth: "240px",
              maxWidth: "300px",
            }}
          >
            <CheckCircle2
              size={36}
              className="flex-shrink-0 mt-0.5"
              style={{ color: theme.accentColor }}
            />
            <div className="flex-1 min-w-0">
              <span
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: theme.accentColor }}
              >
                {t.completed}!
              </span>
              <p
                className="text-sm font-semibold mt-0.5"
                style={{ color: theme.textColor }}
              >
                {desc}
              </p>
              <p
                className="text-xs mt-0.5 opacity-60"
                style={{ color: theme.textColor }}
              >
                {t.reward}: {rewardText}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setNotifications((prev) => prev.filter((x) => x.id !== n.id))
              }
              className="opacity-40 hover:opacity-80 flex-shrink-0"
              style={{ color: theme.textColor }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
