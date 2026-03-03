import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface GameTheme {
  id: string;
  name: string;
  background: string;
  backgroundImage?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  blockColors: string[];
  gridColor: string;
  textColor: string;
  surfaceColor: string;
  borderColor: string;
  musicFile?: string;
  isDark: boolean;
  // Legacy aliases for backward compat
  glowColor: string;
  displayName: string;
}

export type ThemeName =
  | "neon"
  | "retro"
  | "minimal"
  | "space"
  | "ocean"
  | "candy"
  | "sunrise"
  | "pixelCity";

export const THEMES: Record<string, GameTheme> = {
  neon: {
    id: "neon",
    name: "neon",
    displayName: "Neon",
    background: "#0a0a1a",
    backgroundImage: "/assets/generated/neon-theme-bg.dim_1024x768.jpg",
    primaryColor: "#00f5ff",
    secondaryColor: "#bf00ff",
    accentColor: "#00f5ff",
    blockColors: [
      "#00f5ff",
      "#bf00ff",
      "#ff3366",
      "#00ff88",
      "#ffd700",
      "#ff8800",
      "#0066ff",
    ],
    gridColor: "rgba(0,245,255,0.1)",
    textColor: "#e0e0ff",
    surfaceColor: "rgba(10,10,40,0.9)",
    borderColor: "rgba(0,245,255,0.3)",
    glowColor: "#00f5ff",
    musicFile: "/assets/generated/neon-theme-music.mp3",
    isDark: true,
  },
  retro: {
    id: "retro",
    name: "retro",
    displayName: "Retro",
    background: "#1a0a00",
    backgroundImage: "/assets/generated/retro-theme-bg.dim_1024x768.jpg",
    primaryColor: "#ff8c00",
    secondaryColor: "#ff4500",
    accentColor: "#ff8c00",
    blockColors: [
      "#ff8c00",
      "#ff4500",
      "#ffd700",
      "#ff6347",
      "#ff1493",
      "#dc143c",
      "#ff69b4",
    ],
    gridColor: "rgba(255,140,0,0.1)",
    textColor: "#ffe4b5",
    surfaceColor: "rgba(26,10,0,0.9)",
    borderColor: "rgba(255,140,0,0.3)",
    glowColor: "#ff8c00",
    musicFile: "/assets/generated/retro-theme-music.mp3",
    isDark: true,
  },
  minimal: {
    id: "minimal",
    name: "minimal",
    displayName: "Minimal",
    background: "#f5f5f5",
    backgroundImage: "/assets/generated/minimal-theme-bg.dim_1024x768.jpg",
    primaryColor: "#333333",
    secondaryColor: "#666666",
    accentColor: "#0066cc",
    blockColors: [
      "#333333",
      "#555555",
      "#0066cc",
      "#cc3300",
      "#006633",
      "#663300",
      "#330066",
    ],
    gridColor: "rgba(0,0,0,0.08)",
    textColor: "#1a1a1a",
    surfaceColor: "rgba(245,245,245,0.95)",
    borderColor: "rgba(0,0,0,0.15)",
    glowColor: "#0066cc",
    musicFile: "/assets/generated/minimal-theme-music.mp3",
    isDark: false,
  },
  space: {
    id: "space",
    name: "space",
    displayName: "Space",
    background: "#000011",
    backgroundImage: "/assets/generated/space-theme-bg.dim_1024x768.jpg",
    primaryColor: "#4488ff",
    secondaryColor: "#8844ff",
    accentColor: "#44ffcc",
    blockColors: [
      "#4488ff",
      "#8844ff",
      "#44ffcc",
      "#ff4488",
      "#ffcc44",
      "#44ff88",
      "#ff8844",
    ],
    gridColor: "rgba(68,136,255,0.08)",
    textColor: "#cce0ff",
    surfaceColor: "rgba(0,0,17,0.92)",
    borderColor: "rgba(68,136,255,0.25)",
    glowColor: "#4488ff",
    musicFile: "/assets/generated/space-theme-music.mp3",
    isDark: true,
  },
  ocean: {
    id: "ocean",
    name: "ocean",
    displayName: "Ocean",
    background: "#001a2e",
    backgroundImage: "/assets/generated/ocean-theme-bg.dim_1024x768.jpg",
    primaryColor: "#00bcd4",
    secondaryColor: "#0288d1",
    accentColor: "#00e5ff",
    blockColors: [
      "#00bcd4",
      "#0288d1",
      "#00e5ff",
      "#26c6da",
      "#4dd0e1",
      "#006064",
      "#00838f",
    ],
    gridColor: "rgba(0,188,212,0.1)",
    textColor: "#b2ebf2",
    surfaceColor: "rgba(0,26,46,0.92)",
    borderColor: "rgba(0,188,212,0.3)",
    glowColor: "#00bcd4",
    musicFile: "/assets/generated/ocean-theme-music.mp3",
    isDark: true,
  },
  candy: {
    id: "candy",
    name: "candy",
    displayName: "Candy",
    background: "#1a0022",
    backgroundImage: "/assets/generated/candy-theme-bg.dim_1024x768.jpg",
    primaryColor: "#e91e8c",
    secondaryColor: "#9c27b0",
    accentColor: "#ff44cc",
    blockColors: [
      "#e91e8c",
      "#9c27b0",
      "#ff5722",
      "#e53935",
      "#8e24aa",
      "#d81b60",
      "#c62828",
    ],
    gridColor: "rgba(233,30,140,0.1)",
    textColor: "#ffccee",
    surfaceColor: "rgba(26,0,34,0.92)",
    borderColor: "rgba(233,30,140,0.3)",
    glowColor: "#e91e8c",
    isDark: true,
  },
  sunrise: {
    id: "sunrise",
    name: "sunrise",
    displayName: "Sunrise",
    background: "#1a0800",
    backgroundImage: "/assets/generated/sunrise-theme-bg.dim_1024x768.jpg",
    primaryColor: "#ff6600",
    secondaryColor: "#e64a19",
    accentColor: "#ff6600",
    blockColors: [
      "#ff6600",
      "#ff8800",
      "#ffaa00",
      "#ff3300",
      "#ffcc00",
      "#ff0000",
      "#ffdd00",
    ],
    gridColor: "rgba(255,102,0,0.1)",
    textColor: "#ffddaa",
    surfaceColor: "rgba(26,8,0,0.92)",
    borderColor: "rgba(255,102,0,0.3)",
    glowColor: "#ff6600",
    isDark: true,
  },
  pixelCity: {
    id: "pixelCity",
    name: "pixelCity",
    displayName: "Pixel City",
    background: "#0d1117",
    backgroundImage: "/assets/generated/pixel-city-theme-bg.dim_1024x768.jpg",
    primaryColor: "#58a6ff",
    secondaryColor: "#f78166",
    accentColor: "#44ff44",
    blockColors: [
      "#58a6ff",
      "#f78166",
      "#3fb950",
      "#d2a8ff",
      "#ffa657",
      "#79c0ff",
      "#56d364",
    ],
    gridColor: "rgba(88,166,255,0.08)",
    textColor: "#aaffaa",
    surfaceColor: "rgba(13,17,23,0.92)",
    borderColor: "rgba(68,255,68,0.25)",
    glowColor: "#44ff44",
    isDark: true,
  },
};

interface GameThemeContextType {
  currentTheme: GameTheme;
  /** Alias for currentTheme — backward compat */
  theme: GameTheme;
  setTheme: (themeId: string) => void;
  themeId: string;
  /** Alias for themeId — backward compat */
  themeName: string;
  allThemes: GameTheme[];
}

const GameThemeContext = createContext<GameThemeContextType>({
  currentTheme: THEMES.neon,
  theme: THEMES.neon,
  setTheme: () => {},
  themeId: "neon",
  themeName: "neon",
  allThemes: Object.values(THEMES),
});

export function GameThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem("tetrisverse-theme") || "neon";
  });

  const setTheme = (id: string) => {
    if (THEMES[id]) {
      setThemeId(id);
      localStorage.setItem("tetrisverse-theme", id);
    }
  };

  const currentTheme = THEMES[themeId] || THEMES.neon;
  const allThemes = Object.values(THEMES);

  return (
    <GameThemeContext.Provider
      value={{
        currentTheme,
        theme: currentTheme,
        setTheme,
        themeId,
        themeName: themeId,
        allThemes,
      }}
    >
      {children}
    </GameThemeContext.Provider>
  );
}

export function useGameTheme() {
  return useContext(GameThemeContext);
}
