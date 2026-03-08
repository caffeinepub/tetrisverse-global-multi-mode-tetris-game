import { useCallback } from "react";
import type { GameMode } from "../types/game";
import { DEFAULT_MISSIONS, type MissionData } from "../types/missions";

const STORAGE_KEY = "tetrisverse-missions";

function loadMissions(): MissionData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === DEFAULT_MISSIONS.length) {
        return parsed as MissionData[];
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_MISSIONS.map((m) => ({ ...m }));
}

function saveMissions(missions: MissionData[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
  } catch {
    // ignore
  }
}

/** Maps mission reward strings to theme IDs that should be unlocked */
const REWARD_THEME_MAP: Record<string, string> = {
  "Retro Theme Unlock": "retro",
  "Space Theme Unlock": "space",
  "Ocean Theme Unlock": "ocean",
};

const UNLOCKED_THEMES_KEY = "tetrisverse-unlocked-themes";

export function getUnlockedThemes(): Set<string> {
  try {
    const saved = localStorage.getItem(UNLOCKED_THEMES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return new Set(parsed as string[]);
    }
  } catch {
    // ignore
  }
  // neon, minimal, pixelCity, candy, sunrise are always unlocked
  return new Set(["neon", "minimal", "pixelCity", "candy", "sunrise"]);
}

function saveUnlockedThemes(themes: Set<string>) {
  try {
    localStorage.setItem(UNLOCKED_THEMES_KEY, JSON.stringify([...themes]));
  } catch {
    // ignore
  }
}

function dispatchMissionComplete(mission: MissionData) {
  // Unlock theme if reward maps to one
  const themeId = REWARD_THEME_MAP[mission.reward];
  if (themeId) {
    const unlocked = getUnlockedThemes();
    unlocked.add(themeId);
    saveUnlockedThemes(unlocked);
    // Notify context listeners
    window.dispatchEvent(
      new CustomEvent("themeUnlocked", { detail: { themeId } }),
    );
  }

  window.dispatchEvent(
    new CustomEvent("missionComplete", {
      detail: { title: mission.description, reward: mission.reward, themeId },
    }),
  );
}

/**
 * Called at the end of a game session to update mission progress.
 */
export function updateMissionProgress(params: {
  mode: GameMode;
  score: number;
  lines: number;
  level: number;
  maxCombo: number;
  won?: boolean;
}) {
  const { mode, score, lines, level, maxCombo, won } = params;
  const missions = loadMissions();
  let changed = false;

  for (const mission of missions) {
    if (mission.completed) continue;

    const modeMatches =
      mission.mode === "any" ||
      mission.mode === mode ||
      (mission.mode === "mirrorMode" && mode === "mirror");

    if (!modeMatches) continue;

    let newProgress = mission.progress;

    switch (mission.type) {
      case "lines":
        newProgress = Math.min(mission.goal, mission.progress + lines);
        break;
      case "score":
        newProgress = Math.max(mission.progress, score);
        break;
      case "level":
        newProgress = Math.max(mission.progress, level);
        break;
      case "combo":
        newProgress = Math.max(mission.progress, maxCombo);
        break;
      case "games":
        if (mode === "puzzle" && won) {
          newProgress = mission.progress + 1;
        } else if (mode !== "puzzle") {
          newProgress = mission.progress + 1;
        }
        break;
    }

    if (newProgress !== mission.progress) {
      mission.progress = newProgress;
      changed = true;
    }

    if (mission.progress >= mission.goal && !mission.completed) {
      mission.completed = true;
      changed = true;
      dispatchMissionComplete(mission);
    }
  }

  if (changed) {
    saveMissions(missions);
  }
}

/** React hook that provides a function to record game results into missions */
export function useMissions() {
  const recordGameResult = useCallback(
    (params: {
      mode: GameMode;
      score: number;
      lines: number;
      level: number;
      maxCombo: number;
      won?: boolean;
    }) => {
      updateMissionProgress(params);
    },
    [],
  );

  return { recordGameResult };
}
