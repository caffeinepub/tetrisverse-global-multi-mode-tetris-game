import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameTheme } from '../contexts/GameThemeContext';
import { useTetrisAudioContext } from '../contexts/TetrisAudioContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTouchControls } from '../hooks/useTouchControls';
import { GameMode, MODE_CONFIGS, BOARD_WIDTH, BOARD_HEIGHT } from '../types/game';
import GameCanvas from './GameCanvas';
import NextPiecePreview from './NextPiecePreview';
import TouchControlButtons from './TouchControlButtons';
import GameOverDialog from './GameOverDialog';

interface GameBoardProps {
  mode: GameMode;
  onMenu: () => void;
  onLeaderboard: () => void;
}

function useViewportCellSize() {
  const [cellSize, setCellSize] = useState(28);

  useEffect(() => {
    function calculate() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // On mobile (≤640px), layout is vertical:
      // top bar ~44px, next-pieces row ~80px, stats row ~52px, touch controls ~130px, padding ~24px
      // Available height for canvas = vh - 44 - 80 - 52 - 130 - 24 = vh - 330
      // Available width for canvas = vw - 16px padding
      const isMobile = vw <= 640;

      let maxH: number;
      let maxW: number;

      if (isMobile) {
        maxH = vh - 330;
        maxW = vw - 16;
      } else {
        // Desktop: sidebar layout, stats panel ~88px wide, next panel ~100px wide, gaps ~32px
        maxH = vh - 120;
        maxW = vw - 88 - 100 - 64;
      }

      const byHeight = Math.floor(maxH / BOARD_HEIGHT);
      const byWidth = Math.floor(maxW / BOARD_WIDTH);
      const size = Math.max(14, Math.min(byHeight, byWidth, isMobile ? 28 : 34));
      setCellSize(size);
    }

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  return cellSize;
}

export default function GameBoard({ mode, onMenu, onLeaderboard }: GameBoardProps) {
  const { currentTheme } = useGameTheme();
  const audio = useTetrisAudioContext();
  const { t } = useLanguage();
  const {
    gameState, ghostPiece,
    moveLeft, moveRight, moveDown, rotate, hardDrop, togglePause, startGame, currentMode
  } = useGameLogic();

  const boardRef = useRef<HTMLDivElement>(null);
  const config = MODE_CONFIGS[mode];
  const cellSize = useViewportCellSize();

  // Start game on mount
  useEffect(() => {
    startGame(mode);
    if (currentTheme.musicFile) {
      audio.startMusic(currentTheme.musicFile);
    }
    return () => {
      audio.stopMusic();
    };
  }, [mode]);

  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState.gameOver) return;
    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); moveLeft(); break;
      case 'ArrowRight': e.preventDefault(); moveRight(); break;
      case 'ArrowDown': e.preventDefault(); moveDown(); break;
      case 'ArrowUp': e.preventDefault(); rotate(); break;
      case ' ': e.preventDefault(); hardDrop(); break;
      case 'p': case 'P': case 'Escape': togglePause(); break;
    }
  }, [gameState.gameOver, moveLeft, moveRight, moveDown, rotate, hardDrop, togglePause]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const touchControls = useTouchControls({
    onMoveLeft: moveLeft,
    onMoveRight: moveRight,
    onMoveDown: moveDown,
    onRotate: rotate,
    onHardDrop: hardDrop,
  });

  const text = currentTheme.textColor;
  const primary = currentTheme.primaryColor;
  const surface = currentTheme.surfaceColor;
  const border = currentTheme.borderColor;

  const formatTime = (seconds?: number) => {
    if (seconds === undefined) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const stats = [
    { label: t.score, value: gameState.score.toLocaleString() },
    { label: t.level, value: gameState.level },
    { label: t.lines, value: gameState.lines },
    ...(gameState.combo > 1 ? [{ label: t.combo, value: `x${gameState.combo}` }] : []),
    ...(gameState.timeLeft !== undefined ? [{ label: t.time, value: formatTime(gameState.timeLeft) }] : []),
    ...(gameState.movesLeft !== undefined ? [{ label: t.moves, value: gameState.movesLeft }] : []),
  ];

  return (
    <div
      className="flex flex-col items-center w-full overflow-hidden"
      style={{
        color: text,
        height: '100dvh',
        maxHeight: '100dvh',
        padding: '6px 8px',
        boxSizing: 'border-box',
      }}
      onTouchStart={touchControls.handleTouchStart}
      onTouchEnd={touchControls.handleTouchEnd}
      ref={boardRef}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between w-full mb-1" style={{ flexShrink: 0 }}>
        <button
          onClick={onMenu}
          className="text-xs px-2 py-1 rounded-lg font-medium"
          style={{ background: surface, border: `1px solid ${border}`, color: text }}
        >
          ← {t.menu}
        </button>
        <div className="text-center">
          <div className="text-xs font-bold" style={{ color: primary }}>{config.name}</div>
          <div className="text-xs opacity-60" style={{ fontSize: '10px' }}>{config.difficulty}</div>
        </div>
        <button
          onClick={togglePause}
          className="text-xs px-2 py-1 rounded-lg font-medium"
          style={{ background: surface, border: `1px solid ${border}`, color: text }}
        >
          {gameState.paused ? t.resume : t.paused}
        </button>
      </div>

      {/* ── MOBILE LAYOUT (≤640px): vertical stack ── */}
      <div className="flex flex-col items-center w-full sm:hidden" style={{ flexShrink: 0 }}>
        {/* Next pieces + mode indicators in a horizontal row above the board */}
        <div className="flex items-center justify-center gap-2 w-full mb-1">
          <div
            className="rounded-lg px-2 py-1"
            style={{ background: surface, border: `1px solid ${border}` }}
          >
            <div className="text-center mb-1" style={{ fontSize: '9px', opacity: 0.6, color: text }}>NEXT</div>
            <NextPiecePreview
              pieces={gameState.nextPieces}
              theme={currentTheme}
              horizontal
              maxPieces={3}
            />
          </div>

          {/* Mode-specific indicators */}
          {config.gravityShiftMode && (
            <div
              className="text-xs text-center rounded-lg px-2 py-1"
              style={{ background: surface, border: `1px solid ${border}`, color: primary, fontSize: '11px' }}
            >
              {gameState.gravityDirection === 'down' ? '↓' : '↑'}<br />
              <span style={{ fontSize: '9px' }}>Gravity</span>
            </div>
          )}
          {config.comboRushMode && gameState.comboMultiplier > 1 && (
            <div
              className="text-xs text-center rounded-lg px-2 py-1"
              style={{ background: surface, border: `1px solid ${border}`, color: primary, fontSize: '11px' }}
            >
              x{gameState.comboMultiplier.toFixed(1)}
            </div>
          )}
        </div>

        {/* Stats row above canvas */}
        <div className="flex gap-1 w-full justify-center mb-1" style={{ flexWrap: 'wrap' }}>
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="rounded px-2 py-0.5 text-center"
              style={{ background: surface, border: `1px solid ${border}`, minWidth: '44px' }}
            >
              <div style={{ fontSize: '9px', opacity: 0.6 }}>{label}</div>
              <div className="font-bold" style={{ fontSize: '11px', color: primary }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (>640px): horizontal with sidebars ── */}
      {/* This is handled below in the main game area */}

      {/* Main game area */}
      <div className="flex gap-3 items-start justify-center" style={{ flexShrink: 0 }}>
        {/* Stats panel — desktop only */}
        <div className="hidden sm:flex flex-col gap-1.5" style={{ width: '72px' }}>
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg p-1.5 text-center"
              style={{ background: surface, border: `1px solid ${border}` }}
            >
              <div className="text-xs opacity-60">{label}</div>
              <div className="text-sm font-bold" style={{ color: primary }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: `2px solid ${border}`, boxShadow: `0 0 20px ${primary}33`, flexShrink: 0 }}
        >
          <GameCanvas
            gameState={gameState}
            ghostPiece={ghostPiece}
            theme={currentTheme}
            cellSize={cellSize}
          />
        </div>

        {/* Next pieces — desktop only */}
        <div className="hidden sm:flex flex-col gap-2">
          <div className="text-xs opacity-60 text-center">NEXT</div>
          <div
            className="rounded-lg p-2"
            style={{ background: surface, border: `1px solid ${border}` }}
          >
            <NextPiecePreview pieces={gameState.nextPieces} theme={currentTheme} maxPieces={3} />
          </div>

          {/* Mode indicator */}
          {config.gravityShiftMode && (
            <div
              className="text-xs text-center rounded-lg p-2"
              style={{ background: surface, border: `1px solid ${border}`, color: primary }}
            >
              {gameState.gravityDirection === 'down' ? '↓' : '↑'} Gravity
            </div>
          )}
          {config.comboRushMode && gameState.comboMultiplier > 1 && (
            <div
              className="text-xs text-center rounded-lg p-2"
              style={{ background: surface, border: `1px solid ${border}`, color: primary }}
            >
              x{gameState.comboMultiplier.toFixed(1)}
            </div>
          )}
        </div>
      </div>

      {/* Touch controls */}
      <div className="mt-1" style={{ flexShrink: 0 }}>
        <TouchControlButtons
          onMoveLeft={moveLeft}
          onMoveRight={moveRight}
          onMoveDown={moveDown}
          onRotate={rotate}
          onHardDrop={hardDrop}
          theme={currentTheme}
        />
      </div>

      {/* Controls hint — desktop only */}
      <div className="hidden md:flex gap-4 mt-2 text-xs opacity-40">
        <span>← → Move</span>
        <span>↑ Rotate</span>
        <span>↓ Soft Drop</span>
        <span>Space Hard Drop</span>
        <span>P Pause</span>
      </div>

      {/* Game Over Dialog */}
      {gameState.gameOver && (
        <GameOverDialog
          score={gameState.score}
          lines={gameState.lines}
          level={gameState.level}
          won={gameState.won}
          mode={currentMode}
          theme={currentTheme}
          onRestart={() => startGame(mode)}
          onMenu={onMenu}
          onLeaderboard={onLeaderboard}
        />
      )}
    </div>
  );
}
