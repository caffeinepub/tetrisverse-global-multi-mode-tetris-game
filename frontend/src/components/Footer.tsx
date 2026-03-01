import React from 'react';
import { useGameTheme } from '../contexts/GameThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart } from 'lucide-react';

export default function Footer() {
  const { theme } = useGameTheme();
  const { t } = useLanguage();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'tetrisverse'
  );

  return (
    <footer
      className="py-3 px-4 text-center text-xs border-t"
      style={{
        background: theme.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)',
        borderColor: theme.borderColor,
        color: theme.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap">
        <span>© {new Date().getFullYear()} TetrisVerse</span>
        <span className="hidden sm:inline">·</span>
        <a
          href="/app-ads.txt"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
          style={{ color: theme.accentColor }}
        >
          app-ads.txt
        </a>
        <span className="hidden sm:inline">·</span>
        <a
          href="#"
          className="hover:opacity-80 transition-opacity"
          style={{ color: theme.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
        >
          {t.privacyPolicy}
        </a>
        <span className="hidden sm:inline">·</span>
        <span className="flex items-center gap-1">
          Built with{' '}
          <Heart size={10} style={{ color: theme.accentColor }} fill={theme.accentColor} />
          {' '}using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            style={{ color: theme.accentColor }}
          >
            caffeine.ai
          </a>
        </span>
      </div>
    </footer>
  );
}
