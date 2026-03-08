import React from "react";
import { useGameTheme } from "../contexts/GameThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { theme } = useGameTheme();
  const { t } = useLanguage();

  return (
    <footer
      className="py-3 px-4 text-center text-xs border-t"
      style={{
        background: theme.isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)",
        borderColor: theme.borderColor,
        color: theme.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap">
        <span>© {new Date().getFullYear()} TetrisVerse</span>
        <span className="hidden sm:inline">·</span>
        <a
          href="https://sites.google.com/view/tetrisverse/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
          style={{
            color: theme.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
          }}
        >
          {t.privacyPolicy}
        </a>
      </div>
    </footer>
  );
}
