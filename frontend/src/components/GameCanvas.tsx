import React, { useRef, useEffect } from 'react';
import { GameState, Tetromino, TETROMINO_COLORS, BOARD_WIDTH, BOARD_HEIGHT } from '../types/game';
import { GameTheme } from '../contexts/GameThemeContext';
import { adjustBrightness } from '../utils/color';

interface GameCanvasProps {
  gameState: GameState;
  ghostPiece: Tetromino | null;
  theme: GameTheme;
  cellSize?: number;
}

export default function GameCanvas({ gameState, ghostPiece, theme, cellSize = 28 }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const width = BOARD_WIDTH * cellSize;
  const height = BOARD_HEIGHT * cellSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = theme.isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = theme.gridColor;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, height);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(width, y * cellSize);
      ctx.stroke();
    }

    // Draw board cells
    gameState.board.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (cell) {
          drawCell(ctx, colIdx * cellSize, rowIdx * cellSize, cellSize, cell, false);
        }
      });
    });

    // Draw ghost piece
    if (ghostPiece && gameState.currentPiece) {
      const ghostColor = TETROMINO_COLORS[ghostPiece.type];
      ghostPiece.cells.forEach((row, rowIdx) => {
        row.forEach((cell, colIdx) => {
          if (cell) {
            const x = (ghostPiece.position.x + colIdx) * cellSize;
            const y = (ghostPiece.position.y + rowIdx) * cellSize;
            ctx.fillStyle = `${ghostColor}33`;
            ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            ctx.strokeStyle = `${ghostColor}66`;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
          }
        });
      });
    }

    // Draw current piece
    if (gameState.currentPiece) {
      const color = TETROMINO_COLORS[gameState.currentPiece.type];
      gameState.currentPiece.cells.forEach((row, rowIdx) => {
        row.forEach((cell, colIdx) => {
          if (cell) {
            const x = (gameState.currentPiece!.position.x + colIdx) * cellSize;
            const y = (gameState.currentPiece!.position.y + rowIdx) * cellSize;
            if (y >= 0) {
              drawCell(ctx, x, y, cellSize, color, true);
            }
          }
        });
      });
    }

    // Pause overlay
    if (gameState.paused) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = theme.primaryColor;
      ctx.font = `bold ${Math.max(14, cellSize * 1.0)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', width / 2, height / 2);
    }
  }, [gameState, ghostPiece, theme, cellSize, width, height]);

  function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, isActive: boolean) {
    const padding = 1;
    const innerSize = size - padding * 2;

    // Main fill
    const gradient = ctx.createLinearGradient(x + padding, y + padding, x + size - padding, y + size - padding);
    gradient.addColorStop(0, adjustBrightness(color, 40));
    gradient.addColorStop(1, adjustBrightness(color, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(x + padding, y + padding, innerSize, innerSize);

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x + padding, y + padding, innerSize, 3);
    ctx.fillRect(x + padding, y + padding, 3, innerSize);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x + padding, y + size - padding - 3, innerSize, 3);
    ctx.fillRect(x + size - padding - 3, y + padding, 3, innerSize);

    // Glow for active piece
    if (isActive) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + padding, y + padding, innerSize, innerSize);
      ctx.shadowBlur = 0;
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ pointerEvents: 'none', display: 'block' }}
    />
  );
}
