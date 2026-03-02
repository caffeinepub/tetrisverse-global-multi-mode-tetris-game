# Specification

## Summary
**Goal:** Fix the Web Audio API sound system in TetrisVerse so that all sound effects and background music play correctly across all game modes.

**Planned changes:**
- Defer AudioContext creation until the first user interaction (click/touch/keypress) to comply with browser autoplay policy
- Resume a suspended AudioContext on each user interaction before playing any sound
- Fix the mute toggle to correctly suspend/resume both music and effects without destroying the AudioContext
- Ensure background music loops without interruption once started
- Wire the audio hook's play functions correctly into `useGameLogic.ts` so sound effects trigger on the appropriate game events (piece placement, line clear, level up, game over)

**User-visible outcome:** All sound effects and background music play correctly during gameplay. The mute toggle works as expected, and no browser autoplay errors appear in the console.
