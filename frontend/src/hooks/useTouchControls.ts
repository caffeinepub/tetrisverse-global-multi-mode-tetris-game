import { useRef, useCallback } from 'react';

interface TouchControlsOptions {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
}

const SWIPE_THRESHOLD = 33;
const TAP_THRESHOLD = 10;

function isInteractiveElement(el: EventTarget | null): boolean {
  if (!el || !(el instanceof Element)) return false;
  const tag = el.tagName.toLowerCase();
  if (['button', 'input', 'select', 'textarea', 'a'].includes(tag)) return true;
  if (el.closest('button, input, select, textarea, a, [role="button"]')) return true;
  return false;
}

export function useTouchControls(options: TouchControlsOptions) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isInteractiveElement(e.target)) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    if (isInteractiveElement(e.target)) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    touchStartRef.current = null;

    if (absDx < TAP_THRESHOLD && absDy < TAP_THRESHOLD) {
      // Tap = rotate
      options.onRotate();
      return;
    }

    if (absDx > absDy) {
      // Horizontal swipe
      if (absDx > SWIPE_THRESHOLD) {
        if (dx > 0) options.onMoveRight();
        else options.onMoveLeft();
      }
    } else {
      // Vertical swipe
      if (absDy > SWIPE_THRESHOLD) {
        if (dy > 0) {
          if (dt < 200) options.onHardDrop();
          else options.onMoveDown();
        }
      }
    }
  }, [options]);

  return { handleTouchStart, handleTouchEnd };
}
