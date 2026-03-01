import { useState, useRef, useCallback, useEffect } from 'react';
import {
  GameMode,
  GameState,
  Tetromino,
  TetrominoType,
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  MODE_CONFIGS,
} from '../types/game';
import { useTetrisAudioContext } from '../contexts/TetrisAudioContext';

const TETROMINO_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

function randomTetromino(insanityMode = false): Tetromino {
  const type = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  const rotation = insanityMode ? Math.floor(Math.random() * 4) : 0;
  return {
    type,
    position: { x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 },
    rotation,
    cells: TETROMINO_SHAPES[type][rotation],
  };
}

function createEmptyBoard(): (string | null)[][] {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

function createObstacleRow(): (string | null)[] {
  const row: (string | null)[] = Array(BOARD_WIDTH).fill(null);
  const holes = Math.floor(Math.random() * 3) + 1;
  const holePositions = new Set<number>();
  while (holePositions.size < holes) {
    holePositions.add(Math.floor(Math.random() * BOARD_WIDTH));
  }
  for (let x = 0; x < BOARD_WIDTH; x++) {
    if (!holePositions.has(x)) {
      row[x] = '#888888';
    }
  }
  return row;
}

function createPuzzleBoard(): (string | null)[][] {
  const board = createEmptyBoard();
  // Fill bottom 4 rows with partial blocks
  for (let y = BOARD_HEIGHT - 4; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (Math.random() > 0.4) {
        board[y][x] = '#666666';
      }
    }
  }
  // Ensure at least one full row to clear
  for (let x = 0; x < BOARD_WIDTH; x++) {
    board[BOARD_HEIGHT - 1][x] = '#666666';
  }
  return board;
}

function isValidPosition(board: (string | null)[][], piece: Tetromino, offsetX = 0, offsetY = 0): boolean {
  const cells = piece.cells;
  for (let row = 0; row < cells.length; row++) {
    for (let col = 0; col < cells[row].length; col++) {
      if (cells[row][col]) {
        const newX = piece.position.x + col + offsetX;
        const newY = piece.position.y + row + offsetY;
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return false;
        if (newY >= 0 && board[newY][newX]) return false;
      }
    }
  }
  return true;
}

function rotatePiece(piece: Tetromino, direction: 1 | -1 = 1): Tetromino {
  const newRotation = ((piece.rotation + direction) + 4) % 4;
  return {
    ...piece,
    rotation: newRotation,
    cells: TETROMINO_SHAPES[piece.type][newRotation],
  };
}

// SRS wall kicks
const WALL_KICKS: Record<string, [number, number][]> = {
  '0->1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '1->0': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  '1->2': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  '2->1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '2->3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  '3->2': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '3->0': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '0->3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
};

const I_WALL_KICKS: Record<string, [number, number][]> = {
  '0->1': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
  '1->0': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
  '1->2': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
  '2->1': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
  '2->3': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
  '3->2': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
  '3->0': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
  '0->3': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
};

function tryRotate(board: (string | null)[][], piece: Tetromino, direction: 1 | -1 = 1): Tetromino | null {
  const rotated = rotatePiece(piece, direction);
  const key = `${piece.rotation}->${rotated.rotation}`;
  const kicks = piece.type === 'I' ? I_WALL_KICKS[key] : WALL_KICKS[key];

  if (!kicks) {
    if (isValidPosition(board, rotated)) return rotated;
    return null;
  }

  for (const [dx, dy] of kicks) {
    const kicked = { ...rotated, position: { x: rotated.position.x + dx, y: rotated.position.y + dy } };
    if (isValidPosition(board, kicked)) return kicked;
  }
  return null;
}

function placePiece(board: (string | null)[][], piece: Tetromino): (string | null)[][] {
  const newBoard = board.map(row => [...row]);
  const color = TETROMINO_COLORS[piece.type];
  piece.cells.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (cell) {
        const y = piece.position.y + rowIdx;
        const x = piece.position.x + colIdx;
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          newBoard[y][x] = color;
        }
      }
    });
  });
  return newBoard;
}

function clearLines(board: (string | null)[][]): { newBoard: (string | null)[][], linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => !cell));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  return { newBoard, linesCleared };
}

function calculateScore(linesCleared: number, level: number, combo: number, multiplier: number): number {
  const baseScores = [0, 100, 300, 500, 800];
  const base = baseScores[Math.min(linesCleared, 4)] * (level + 1);
  const comboBonus = combo > 1 ? combo * 50 : 0;
  return Math.floor((base + comboBonus) * multiplier);
}

function getGhostPosition(board: (string | null)[][], piece: Tetromino): Tetromino {
  let ghost = { ...piece };
  while (isValidPosition(board, ghost, 0, 1)) {
    ghost = { ...ghost, position: { ...ghost.position, y: ghost.position.y + 1 } };
  }
  return ghost;
}

export interface GameLogicReturn {
  gameState: GameState;
  ghostPiece: Tetromino | null;
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotate: () => void;
  hardDrop: () => void;
  togglePause: () => void;
  startGame: (mode: GameMode) => void;
  currentMode: GameMode;
}

export function useGameLogic(): GameLogicReturn {
  const audio = useTetrisAudioContext();
  const [currentMode, setCurrentMode] = useState<GameMode>('classic');

  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPieces: [],
    score: 0,
    level: 0,
    lines: 0,
    combo: 0,
    gameOver: false,
    paused: false,
    won: false,
    gravityDirection: 'down',
    comboMultiplier: 1,
  });

  const stateRef = useRef(gameState);
  const modeRef = useRef<GameMode>('classic');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gravityTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const obstacleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  const clearAllTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (gravityTimerRef.current) clearInterval(gravityTimerRef.current);
    if (timeTimerRef.current) clearInterval(timeTimerRef.current);
    if (obstacleTimerRef.current) clearInterval(obstacleTimerRef.current);
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
  }, []);

  const spawnPiece = useCallback((board: (string | null)[][], nextPieces: Tetromino[], mode: GameMode): { piece: Tetromino, nextPieces: Tetromino[] } => {
    const config = MODE_CONFIGS[mode];
    const isInsanity = mode === 'insanity';

    let piece: Tetromino;
    let newNextPieces: Tetromino[];

    if (nextPieces.length > 0) {
      piece = { ...nextPieces[0], position: { x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 } };
      newNextPieces = [...nextPieces.slice(1)];
    } else {
      piece = randomTetromino(isInsanity);
      newNextPieces = [];
    }

    while (newNextPieces.length < 3) {
      newNextPieces.push(randomTetromino(isInsanity));
    }

    return { piece, nextPieces: newNextPieces };
  }, []);

  const lockPiece = useCallback((state: GameState, mode: GameMode): GameState => {
    const config = MODE_CONFIGS[mode];
    if (!state.currentPiece) return state;

    audio.playSound('land');

    const newBoard = placePiece(state.board, state.currentPiece);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

    let newCombo = linesCleared > 0 ? state.combo + 1 : 0;
    let newComboMultiplier = state.comboMultiplier;

    if (mode === 'comboRush') {
      if (linesCleared > 0) {
        newComboMultiplier = Math.min(8, 1 + newCombo * 0.5);
      } else {
        newComboMultiplier = 1;
        newCombo = 0;
      }
    }

    if (linesCleared > 0) {
      if (linesCleared >= 4) {
        audio.playSound('multiLineClear');
      } else {
        audio.playSound('lineClear');
      }
    }

    const scoreGained = calculateScore(linesCleared, state.level, newCombo, config.scoreMultiplier * newComboMultiplier);
    const newScore = state.score + scoreGained;
    const newLines = state.lines + linesCleared;
    const newLevel = Math.floor(newLines / config.levelUpLines);

    if (newLevel > state.level) {
      audio.playSound('levelUp');
    }

    const { piece: nextPiece, nextPieces: newNextPieces } = spawnPiece(clearedBoard, state.nextPieces, mode);

    // Check game over
    if (!isValidPosition(clearedBoard, nextPiece)) {
      if (config.infinitePlay) {
        // In endless mode, just clear the board
        audio.playSound('gameOver');
        return {
          ...state,
          board: createEmptyBoard(),
          currentPiece: nextPiece,
          nextPieces: newNextPieces,
          score: newScore,
          level: newLevel,
          lines: newLines,
          combo: newCombo,
          comboMultiplier: newComboMultiplier,
        };
      }
      audio.playSound('gameOver');
      return {
        ...state,
        board: clearedBoard,
        currentPiece: null,
        nextPieces: newNextPieces,
        score: newScore,
        level: newLevel,
        lines: newLines,
        combo: newCombo,
        comboMultiplier: newComboMultiplier,
        gameOver: true,
      };
    }

    // Puzzle win condition
    if (config.puzzleMode) {
      const isEmpty = clearedBoard.every(row => row.every(cell => !cell));
      if (isEmpty) {
        return {
          ...state,
          board: clearedBoard,
          currentPiece: null,
          score: newScore,
          level: newLevel,
          lines: newLines,
          combo: newCombo,
          comboMultiplier: newComboMultiplier,
          won: true,
          gameOver: true,
        };
      }
      // Check moves
      const newMovesLeft = (state.movesLeft ?? config.movesLimit ?? 30) - 1;
      if (newMovesLeft <= 0) {
        audio.playSound('gameOver');
        return {
          ...state,
          board: clearedBoard,
          currentPiece: null,
          score: newScore,
          level: newLevel,
          lines: newLines,
          combo: newCombo,
          comboMultiplier: newComboMultiplier,
          movesLeft: 0,
          gameOver: true,
        };
      }
      return {
        ...state,
        board: clearedBoard,
        currentPiece: nextPiece,
        nextPieces: newNextPieces,
        score: newScore,
        level: newLevel,
        lines: newLines,
        combo: newCombo,
        comboMultiplier: newComboMultiplier,
        movesLeft: newMovesLeft,
      };
    }

    return {
      ...state,
      board: clearedBoard,
      currentPiece: nextPiece,
      nextPieces: newNextPieces,
      score: newScore,
      level: newLevel,
      lines: newLines,
      combo: newCombo,
      comboMultiplier: newComboMultiplier,
    };
  }, [audio, spawnPiece]);

  const tick = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.paused || !prev.currentPiece) return prev;

      const mode = modeRef.current;
      const config = MODE_CONFIGS[mode];
      const direction = config.gravityShiftMode ? prev.gravityDirection : 'down';
      const dy = direction === 'down' ? 1 : -1;

      if (isValidPosition(prev.board, prev.currentPiece, 0, dy)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: { ...prev.currentPiece.position, y: prev.currentPiece.position.y + dy },
          },
        };
      } else {
        // Lock piece
        return lockPiece(prev, mode);
      }
    });
  }, [lockPiece]);

  const getSpeed = useCallback((level: number, mode: GameMode): number => {
    const config = MODE_CONFIGS[mode];
    if (mode === 'insanity') {
      return Math.max(50, config.initialSpeed - level * config.speedIncrement * 2);
    }
    return Math.max(100, config.initialSpeed - level * config.speedIncrement);
  }, []);

  const startGame = useCallback((mode: GameMode) => {
    clearAllTimers();
    audio.stopMusic();

    const config = MODE_CONFIGS[mode];
    modeRef.current = mode;
    setCurrentMode(mode);

    const isInsanity = mode === 'insanity';
    const initialBoard = config.puzzleMode ? createPuzzleBoard() : createEmptyBoard();

    // Add obstacle rows for challenge mode
    let board = initialBoard;
    if (config.hasObstacles) {
      for (let i = 0; i < 3; i++) {
        board = [...board.slice(1), createObstacleRow()];
      }
    }

    const firstPiece = randomTetromino(isInsanity);
    const nextPieces = [
      randomTetromino(isInsanity),
      randomTetromino(isInsanity),
      randomTetromino(isInsanity),
    ];

    const initialState: GameState = {
      board,
      currentPiece: { ...firstPiece, position: { x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 } },
      nextPieces,
      score: 0,
      level: 0,
      lines: 0,
      combo: 0,
      gameOver: false,
      paused: false,
      won: false,
      timeLeft: config.timeLimit,
      movesLeft: config.movesLimit,
      gravityDirection: 'down',
      comboMultiplier: 1,
    };

    setGameState(initialState);
    stateRef.current = initialState;

    // Start drop interval
    const speed = getSpeed(0, mode);
    intervalRef.current = setInterval(tick, speed);

    // Time attack countdown
    if (config.timeLimit) {
      timeTimerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.gameOver || prev.paused) return prev;
          const newTime = (prev.timeLeft ?? 0) - 1;
          if (newTime <= 0) {
            audio.playSound('gameOver');
            return { ...prev, timeLeft: 0, gameOver: true };
          }
          return { ...prev, timeLeft: newTime };
        });
      }, 1000);
    }

    // Gravity shift timer
    if (config.gravityShiftMode) {
      gravityTimerRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          gravityDirection: prev.gravityDirection === 'down' ? 'up' : 'down',
        }));
      }, 5000);
    }

    // Obstacle spawner for challenge mode
    if (config.hasObstacles) {
      obstacleTimerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.gameOver || prev.paused) return prev;
          const newBoard = [...prev.board.slice(1), createObstacleRow()];
          return { ...prev, board: newBoard };
        });
      }, 15000);
    }
  }, [clearAllTimers, audio, tick, getSpeed]);

  // Update interval speed when level changes
  useEffect(() => {
    if (gameState.gameOver || gameState.paused) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, getSpeed(gameState.level, currentMode));
    }
  }, [gameState.level, gameState.paused, gameState.gameOver, currentMode, tick, getSpeed]);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const moveLeft = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.paused || !prev.currentPiece) return prev;
      const config = MODE_CONFIGS[modeRef.current];
      const dx = config.mirrorMode ? 1 : -1;
      if (!isValidPosition(prev.board, prev.currentPiece, dx, 0)) return prev;
      return {
        ...prev,
        currentPiece: {
          ...prev.currentPiece,
          position: { ...prev.currentPiece.position, x: prev.currentPiece.position.x + dx },
        },
      };
    });
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.paused || !prev.currentPiece) return prev;
      const config = MODE_CONFIGS[modeRef.current];
      const dx = config.mirrorMode ? -1 : 1;
      if (!isValidPosition(prev.board, prev.currentPiece, dx, 0)) return prev;
      return {
        ...prev,
        currentPiece: {
          ...prev.currentPiece,
          position: { ...prev.currentPiece.position, x: prev.currentPiece.position.x + dx },
        },
      };
    });
  }, []);

  const moveDown = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.paused || !prev.currentPiece) return prev;
      if (isValidPosition(prev.board, prev.currentPiece, 0, 1)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: { ...prev.currentPiece.position, y: prev.currentPiece.position.y + 1 },
          },
        };
      }
      return lockPiece(prev, modeRef.current);
    });
  }, [lockPiece]);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.paused || !prev.currentPiece) return prev;
      const config = MODE_CONFIGS[modeRef.current];
      const direction = config.mirrorMode ? -1 : 1;
      const rotated = tryRotate(prev.board, prev.currentPiece, direction as 1 | -1);
      if (!rotated) return prev;
      audio.playSound('rotate');
      return { ...prev, currentPiece: rotated };
    });
  }, [audio]);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.paused || !prev.currentPiece) return prev;
      const ghost = getGhostPosition(prev.board, prev.currentPiece);
      const dropped = { ...prev, currentPiece: ghost };
      return lockPiece(dropped, modeRef.current);
    });
  }, [lockPiece]);

  const togglePause = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver) return prev;
      const newPaused = !prev.paused;
      if (newPaused) {
        clearAllTimers();
      } else {
        const speed = getSpeed(prev.level, modeRef.current);
        intervalRef.current = setInterval(tick, speed);
      }
      return { ...prev, paused: newPaused };
    });
  }, [clearAllTimers, getSpeed, tick]);

  const ghostPiece = gameState.currentPiece && !gameState.gameOver
    ? getGhostPosition(gameState.board, gameState.currentPiece)
    : null;

  return {
    gameState,
    ghostPiece,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    togglePause,
    startGame,
    currentMode,
  };
}
