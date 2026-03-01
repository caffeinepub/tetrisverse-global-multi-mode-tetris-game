# Specification

## Summary
**Goal:** Make the TetrisVerse game layout fully responsive for mobile devices by moving the Next Pieces panel above the game board and ensuring all game elements fit within small/vertical screen viewports without overflow or scrolling.

**Planned changes:**
- Move the `NextPiecePreview` panel from the side column to above the game canvas in `GameBoard.tsx`
- On mobile viewports (≤640px), render the Next Pieces panel horizontally centered above the game board
- On larger screens, keep the layout visually balanced with the panel still accessible
- Scale the game canvas proportionally using viewport-relative sizing so it never exceeds available width or height
- Ensure touch control buttons remain fully visible and do not overlap the game board
- Prevent horizontal and vertical overflow/scrolling on all screen widths from 320px upward
- Verify all existing features (game modes, themes, audio, i18n) continue to work after layout changes

**User-visible outcome:** Players on mobile devices (e.g., iPhone SE at 375×667px) can see and interact with the entire game — board, next pieces, stats, and touch controls — without any scrolling or elements being cut off.
