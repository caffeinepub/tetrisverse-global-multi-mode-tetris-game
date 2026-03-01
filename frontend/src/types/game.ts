export type GameMode =
  | 'classic'
  | 'timeAttack'
  | 'endless'
  | 'challenge'
  | 'puzzle'
  | 'insanity'
  | 'mirror'
  | 'gravityShift'
  | 'comboRush';

export interface ModeConfig {
  name: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Insane';
  initialSpeed: number;
  speedIncrement: number;
  timeLimit?: number;
  movesLimit?: number;
  hasObstacles?: boolean;
  puzzleMode?: boolean;
  mirrorMode?: boolean;
  gravityShiftMode?: boolean;
  comboRushMode?: boolean;
  scoreMultiplier: number;
  levelUpLines: number;
  infinitePlay?: boolean;
}

export const MODE_CONFIGS: Record<GameMode, ModeConfig> = {
  classic: {
    name: 'Classic',
    description: 'The original Tetris experience. Clear lines to score points and level up.',
    icon: '🎮',
    difficulty: 'Easy',
    initialSpeed: 800,
    speedIncrement: 50,
    scoreMultiplier: 1,
    levelUpLines: 10,
  },
  timeAttack: {
    name: 'Time Attack',
    description: 'Race against the clock! Clear as many lines as possible before time runs out.',
    icon: '⏱️',
    difficulty: 'Medium',
    initialSpeed: 600,
    speedIncrement: 30,
    timeLimit: 120,
    scoreMultiplier: 1.5,
    levelUpLines: 8,
  },
  endless: {
    name: 'Endless',
    description: 'Play forever with no game over. Relax and enjoy the flow.',
    icon: '♾️',
    difficulty: 'Easy',
    initialSpeed: 800,
    speedIncrement: 40,
    scoreMultiplier: 0.8,
    levelUpLines: 10,
    infinitePlay: true,
  },
  challenge: {
    name: 'Challenge',
    description: 'Overcome obstacles! Random garbage rows appear to test your skills.',
    icon: '💪',
    difficulty: 'Hard',
    initialSpeed: 700,
    speedIncrement: 60,
    hasObstacles: true,
    scoreMultiplier: 2,
    levelUpLines: 12,
  },
  puzzle: {
    name: 'Puzzle',
    description: 'Solve the puzzle! Clear all blocks with a limited number of moves.',
    icon: '🧩',
    difficulty: 'Medium',
    initialSpeed: 999999,
    speedIncrement: 0,
    movesLimit: 30,
    puzzleMode: true,
    scoreMultiplier: 2.5,
    levelUpLines: 5,
  },
  insanity: {
    name: 'Insanity',
    description: 'Extreme speed and random piece orientations. Only the best survive!',
    icon: '🔥',
    difficulty: 'Insane',
    initialSpeed: 200,
    speedIncrement: 20,
    scoreMultiplier: 3,
    levelUpLines: 15,
  },
  mirror: {
    name: 'Mirror Mode',
    description: 'Controls are reversed! Left is right and right is left.',
    icon: '🪞',
    difficulty: 'Hard',
    initialSpeed: 750,
    speedIncrement: 45,
    mirrorMode: true,
    scoreMultiplier: 2,
    levelUpLines: 10,
  },
  gravityShift: {
    name: 'Gravity Shift',
    description: 'Gravity alternates direction! Pieces fall up and down alternately.',
    icon: '🌀',
    difficulty: 'Expert',
    initialSpeed: 700,
    speedIncrement: 40,
    gravityShiftMode: true,
    scoreMultiplier: 2.5,
    levelUpLines: 10,
  },
  comboRush: {
    name: 'Combo Rush',
    description: 'Chain combos for massive multipliers! Keep the streak alive.',
    icon: '⚡',
    difficulty: 'Hard',
    initialSpeed: 650,
    speedIncrement: 35,
    comboRushMode: true,
    scoreMultiplier: 1.5,
    levelUpLines: 8,
  },
};

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  position: Position;
  rotation: number;
  cells: number[][];
}

export interface GameState {
  board: (string | null)[][];
  currentPiece: Tetromino | null;
  nextPieces: Tetromino[];
  score: number;
  level: number;
  lines: number;
  combo: number;
  gameOver: boolean;
  paused: boolean;
  won: boolean;
  timeLeft?: number;
  movesLeft?: number;
  gravityDirection: 'down' | 'up';
  comboMultiplier: number;
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINO_SHAPES: Record<TetrominoType, number[][][]> = {
  I: [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ],
  O: [
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
  ],
  T: [
    [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]],
    [[0,0,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0]],
    [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
  ],
  S: [
    [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]],
    [[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],
    [[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
  ],
  Z: [
    [[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]],
    [[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],
    [[0,1,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]],
  ],
  J: [
    [[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
    [[0,0,0,0],[1,1,1,0],[0,0,1,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]],
  ],
  L: [
    [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]],
    [[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]],
    [[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
  ],
};

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f5ff',
  O: '#ffd700',
  T: '#bf00ff',
  S: '#00ff88',
  Z: '#ff3366',
  J: '#0066ff',
  L: '#ff8800',
};
