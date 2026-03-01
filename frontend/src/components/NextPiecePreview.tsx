import React, { useRef, useEffect } from 'react';
import { Tetromino, TETROMINO_COLORS } from '../types/game';
import { GameTheme } from '../contexts/GameThemeContext';
import { adjustBrightness } from '../utils/color';

interface NextPiecePreviewProps {
  pieces: Tetromino[];
  theme: GameTheme;
  /** When true, pieces are laid out side-by-side horizontally (for mobile above-board layout) */
  horizontal?: boolean;
  /** Max number of pieces to show (default 3) */
  maxPieces?: number;
}

const PREVIEW_CELL_VERTICAL = 18;
const PREVIEW_CELL_HORIZONTAL = 14;
const PREVIEW_COLS = 4;
const PREVIEW_ROWS = 4;

export default function NextPiecePreview({ pieces, theme, horizontal = false, maxPieces = 3 }: NextPiecePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const PREVIEW_CELL = horizontal ? PREVIEW_CELL_HORIZONTAL : PREVIEW_CELL_VERTICAL;
  const previewW = PREVIEW_COLS * PREVIEW_CELL;
  const previewH = PREVIEW_ROWS * PREVIEW_CELL;
  const count = Math.min(pieces.length, maxPieces);
  const GAP = horizontal ? 4 : 8;

  // Canvas dimensions
  const canvasWidth = horizontal
    ? count * previewW + (count - 1) * GAP
    : previewW;
  const canvasHeight = horizontal
    ? previewH
    : count * previewH + (count - 1) * GAP;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    pieces.slice(0, count).forEach((piece, idx) => {
      const offsetX = horizontal ? idx * (previewW + GAP) : 0;
      const offsetY = horizontal ? 0 : idx * (previewH + GAP);

      const color = TETROMINO_COLORS[piece.type];

      // Background
      ctx.fillStyle = theme.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';
      ctx.fillRect(offsetX, offsetY, previewW, previewH);

      // Center the piece
      let minX = 4, maxX = 0, minY = 4, maxY = 0;
      piece.cells.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            minX = Math.min(minX, c);
            maxX = Math.max(maxX, c);
            minY = Math.min(minY, r);
            maxY = Math.max(maxY, r);
          }
        });
      });

      const pieceW = (maxX - minX + 1) * PREVIEW_CELL;
      const pieceH = (maxY - minY + 1) * PREVIEW_CELL;
      const startX = offsetX + Math.floor((previewW - pieceW) / 2) - minX * PREVIEW_CELL;
      const startY = offsetY + Math.floor((previewH - pieceH) / 2) - minY * PREVIEW_CELL;

      piece.cells.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            const x = startX + c * PREVIEW_CELL;
            const y = startY + r * PREVIEW_CELL;
            const pad = 1;
            const inner = PREVIEW_CELL - pad * 2;

            const gradient = ctx.createLinearGradient(x + pad, y + pad, x + PREVIEW_CELL - pad, y + PREVIEW_CELL - pad);
            gradient.addColorStop(0, adjustBrightness(color, 40));
            gradient.addColorStop(1, adjustBrightness(color, -20));
            ctx.fillStyle = gradient;
            ctx.fillRect(x + pad, y + pad, inner, inner);

            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(x + pad, y + pad, inner, 2);
            ctx.fillRect(x + pad, y + pad, 2, inner);

            ctx.shadowColor = color;
            ctx.shadowBlur = 4;
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x + pad, y + pad, inner, inner);
            ctx.shadowBlur = 0;
          }
        });
      });
    });
  }, [pieces, theme, horizontal, count, canvasWidth, canvasHeight, previewW, previewH, GAP, PREVIEW_CELL]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth || previewW}
      height={canvasHeight || previewH}
      style={{ display: 'block' }}
    />
  );
}
