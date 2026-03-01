import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, RotateCw, ChevronsDown } from 'lucide-react';
import { GameTheme } from '../contexts/GameThemeContext';

interface TouchControlButtonsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  theme: GameTheme;
}

const GUARD_MS = 300;

export default function TouchControlButtons({
  onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop, theme
}: TouchControlButtonsProps) {
  const lastTouchRef = useRef<Record<string, number>>({});

  function makeHandler(key: string, fn: () => void) {
    return {
      onPointerDown: (e: React.PointerEvent) => {
        e.preventDefault();
        const now = Date.now();
        if (now - (lastTouchRef.current[key] || 0) < GUARD_MS) return;
        lastTouchRef.current[key] = now;
        fn();
      },
    };
  }

  const btnBase: React.CSSProperties = {
    background: theme.isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
    border: `2px solid ${theme.primaryColor}`,
    color: theme.primaryColor,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  };

  // Responsive button size: smaller on very narrow screens
  const btnSize = typeof window !== 'undefined' && window.innerWidth <= 360 ? '44px' : '50px';
  const iconSize = typeof window !== 'undefined' && window.innerWidth <= 360 ? 18 : 20;

  const btnStyle: React.CSSProperties = {
    ...btnBase,
    width: btnSize,
    height: btnSize,
  };

  return (
    <div className="flex flex-col items-center gap-1.5 md:hidden select-none" style={{ touchAction: 'none' }}>
      {/* Top row: rotate + hard drop */}
      <div className="flex gap-3">
        <button style={btnStyle} {...makeHandler('rotate', onRotate)} aria-label="Rotate">
          <RotateCw size={iconSize} />
        </button>
        <button style={btnStyle} {...makeHandler('hardDrop', onHardDrop)} aria-label="Hard Drop">
          <ChevronsDown size={iconSize} />
        </button>
      </div>
      {/* Bottom row: left + down + right */}
      <div className="flex gap-3">
        <button style={btnStyle} {...makeHandler('left', onMoveLeft)} aria-label="Move Left">
          <ChevronLeft size={iconSize} />
        </button>
        <button style={btnStyle} {...makeHandler('down', onMoveDown)} aria-label="Soft Drop">
          <ChevronDown size={iconSize} />
        </button>
        <button style={btnStyle} {...makeHandler('right', onMoveRight)} aria-label="Move Right">
          <ChevronRight size={iconSize} />
        </button>
      </div>
    </div>
  );
}
