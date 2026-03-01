import React, { useState } from 'react';
import { useGameTheme } from '../contexts/GameThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DEFAULT_MISSIONS, MissionData } from '../types/missions';
import { ArrowLeft, Target, CheckCircle2, Circle } from 'lucide-react';

interface MissionsPanelProps {
  onBack: () => void;
}

export default function MissionsPanel({ onBack }: MissionsPanelProps) {
  const { theme } = useGameTheme();
  const { t } = useLanguage();

  const [missions] = useState<MissionData[]>(() => {
    try {
      const saved = localStorage.getItem('tetrisverse-missions');
      return saved ? JSON.parse(saved) : DEFAULT_MISSIONS;
    } catch {
      return DEFAULT_MISSIONS;
    }
  });

  const completedCount = missions.filter(m => m.completed).length;

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden relative"
      style={{
        background: theme.background,
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 'calc(100vh - 48px)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: theme.isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.75)' }}
      />

      <div className="relative z-10 flex flex-col h-full max-w-2xl mx-auto w-full px-4">
        {/* Header */}
        <div className="flex items-center gap-3 py-4 border-b" style={{ borderColor: theme.borderColor }}>
          <button
            onClick={onBack}
            className="p-2 rounded transition-all hover:opacity-70"
            style={{ color: theme.accentColor, border: `1px solid ${theme.borderColor}` }}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.textColor }}>
              <Target size={20} style={{ color: theme.accentColor }} />
              {t.missionsTitle}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
              {completedCount}/{missions.length} {t.completed}
            </p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="py-3 border-b" style={{ borderColor: theme.borderColor }}>
          <div className="flex justify-between text-xs mb-1.5" style={{ color: theme.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
            <span>{t.progress}</span>
            <span>{Math.round((completedCount / missions.length) * 100)}%</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
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
            {missions.map(mission => {
              const progressPct = Math.min(100, Math.round((mission.progress / mission.goal) * 100));
              return (
                <div
                  key={mission.id}
                  className="rounded-lg p-4"
                  style={{
                    background: theme.isDark ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.88)',
                    border: `1px solid ${mission.completed ? theme.accentColor : theme.borderColor}`,
                    opacity: mission.completed ? 0.85 : 1,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {mission.completed ? (
                        <img
                          src="/assets/generated/mission-complete-icon-transparent.dim_64x64.png"
                          alt="Complete"
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <Circle size={20} style={{ color: theme.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold" style={{ color: theme.textColor }}>
                          {mission.description}
                        </p>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{
                            background: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                            color: theme.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                          }}
                        >
                          {mission.mode}
                        </span>
                      </div>

                      {/* Progress bar */}
                      {!mission.completed && (
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1" style={{ color: theme.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                            <span>{mission.progress}/{mission.goal}</span>
                            <span>{progressPct}%</span>
                          </div>
                          <div
                            className="h-1.5 rounded-full overflow-hidden"
                            style={{ background: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
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
                        <span className="text-xs" style={{ color: theme.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                          {t.reward}:
                        </span>
                        <span className="text-xs font-medium" style={{ color: theme.accentColor }}>
                          {mission.reward}
                        </span>
                        {mission.completed && (
                          <CheckCircle2 size={12} style={{ color: theme.accentColor }} />
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
