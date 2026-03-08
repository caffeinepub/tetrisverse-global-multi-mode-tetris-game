export interface MissionData {
  id: number;
  title: string;
  description: string;
  mode: string;
  goal: number;
  progress: number;
  completed: boolean;
  reward: string;
  icon: string;
  type: "lines" | "score" | "level" | "combo" | "games";
}

export const DEFAULT_MISSIONS: MissionData[] = [
  {
    id: 1,
    title: "Line Clearer",
    description: "Clear 50 lines in Classic mode",
    mode: "classic",
    goal: 50,
    progress: 0,
    completed: false,
    reward: "Retro Theme Unlock",
    icon: "/assets/generated/achievement-badge-icon-transparent.dim_64x64.png",
    type: "lines",
  },
  {
    id: 2,
    title: "Score Hunter",
    description: "Reach 10,000 points in any mode",
    mode: "any",
    goal: 10000,
    progress: 0,
    completed: false,
    reward: "Score Multiplier x2",
    icon: "/assets/generated/score-multiplier-icon-transparent.dim_64x64.png",
    type: "score",
  },
  {
    id: 3,
    title: "Speed Demon",
    description: "Complete 1 Time Attack game",
    mode: "timeAttack",
    goal: 1,
    progress: 0,
    completed: false,
    reward: "Space Theme Unlock",
    icon: "/assets/generated/theme-unlock-icon-transparent.dim_64x64.png",
    type: "games",
  },
  {
    id: 4,
    title: "Combo King",
    description: "Achieve a 5x combo in Combo Rush",
    mode: "comboRush",
    goal: 5,
    progress: 0,
    completed: false,
    reward: "Combo Rush Badge",
    icon: "/assets/generated/combo-rush-mode-icon-transparent.dim_64x64.png",
    type: "combo",
  },
  {
    id: 5,
    title: "Puzzle Master",
    description: "Complete 3 Puzzle levels",
    mode: "puzzle",
    goal: 3,
    progress: 0,
    completed: false,
    reward: "Ocean Theme Unlock",
    icon: "/assets/generated/theme-unlock-icon-transparent.dim_64x64.png",
    type: "games",
  },
  {
    id: 6,
    title: "Gravity Defier",
    description: "Clear 20 lines in Gravity Shift mode",
    mode: "gravityShift",
    goal: 20,
    progress: 0,
    completed: false,
    reward: "Gravity Shift Badge",
    icon: "/assets/generated/gravity-shift-mode-icon-transparent.dim_64x64.png",
    type: "lines",
  },
  {
    id: 7,
    title: "Mirror Warrior",
    description: "Score 5,000 points in Mirror Mode",
    mode: "mirror", // matches GameMode "mirror"
    goal: 5000,
    progress: 0,
    completed: false,
    reward: "Mirror Mode Badge",
    icon: "/assets/generated/mirror-mode-icon-transparent.dim_64x64.png",
    type: "score",
  },
  {
    id: 8,
    title: "Insanity Survivor",
    description: "Survive to level 5 in Insanity mode",
    mode: "insanity",
    goal: 5,
    progress: 0,
    completed: false,
    reward: "Insanity Badge",
    icon: "/assets/generated/achievement-badge-icon-transparent.dim_64x64.png",
    type: "level",
  },
];
