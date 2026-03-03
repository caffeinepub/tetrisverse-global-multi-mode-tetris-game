import { CheckCircle2, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useGameTheme } from "../contexts/GameThemeContext";

interface Notification {
  id: number;
  title: string;
  reward: string;
}

export default function MissionNotification() {
  const { theme } = useGameTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleMissionComplete = (e: CustomEvent) => {
      const { title, reward } = e.detail;
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, title, reward }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 4000);
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
      {notifications.map((n) => (
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
          <img
            src="/assets/generated/mission-complete-icon-transparent.dim_64x64.png"
            alt="Mission Complete"
            className="w-10 h-10 object-contain flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <CheckCircle2 size={14} style={{ color: theme.accentColor }} />
              <span
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: theme.accentColor }}
              >
                Mission Complete!
              </span>
            </div>
            <p
              className="text-sm font-semibold truncate"
              style={{ color: theme.textColor }}
            >
              {n.title}
            </p>
            <p
              className="text-xs opacity-60"
              style={{ color: theme.textColor }}
            >
              Reward: {n.reward}
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
      ))}
    </div>
  );
}
