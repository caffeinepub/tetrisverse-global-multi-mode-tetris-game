import { useCallback, useEffect, useRef, useState } from "react";

export interface TetrisAudioSystem {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (
    type:
      | "land"
      | "lineClear"
      | "multiLineClear"
      | "rotate"
      | "levelUp"
      | "gameOver",
  ) => void;
  startMusic: (musicFile?: string) => void;
  stopMusic: () => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  unlockAudio: () => Promise<void>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getOrCreateContext(
  ref: React.MutableRefObject<AudioContext | null>,
): AudioContext {
  if (!ref.current || ref.current.state === "closed") {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ref.current = new AudioCtx();
  }
  return ref.current;
}

async function ensureRunning(ctx: AudioContext): Promise<boolean> {
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return false;
    }
  }
  return ctx.state === "running";
}

// ─── Sound synthesisers ──────────────────────────────────────────────────────

function synthLand(ctx: AudioContext, master: GainNode) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(master);
  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

function synthRotate(ctx: AudioContext, master: GainNode) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.connect(gain);
  gain.connect(master);
  osc.start();
  osc.stop(ctx.currentTime + 0.09);
}

function synthLineClear(ctx: AudioContext, master: GainNode) {
  const freqs = [523, 659, 784, 1047];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.06;
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.15);
  });
}

function synthMultiLineClear(ctx: AudioContext, master: GainNode) {
  const freqs = [523, 659, 784, 1047, 1319];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.05;
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.22);
  });
  const sweep = ctx.createOscillator();
  const sweepGain = ctx.createGain();
  sweep.type = "sine";
  sweep.frequency.setValueAtTime(300, ctx.currentTime);
  sweep.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.35);
  sweepGain.gain.setValueAtTime(0.15, ctx.currentTime);
  sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  sweep.connect(sweepGain);
  sweepGain.connect(master);
  sweep.start();
  sweep.stop(ctx.currentTime + 0.45);
}

function synthLevelUp(ctx: AudioContext, master: GainNode) {
  const melody = [523, 659, 784, 1047, 1319];
  melody.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.09;
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.2);
  });
}

function synthGameOver(ctx: AudioContext, master: GainNode) {
  const freqs = [494, 440, 392, 330, 262];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
    osc.frequency.exponentialRampToValueAtTime(
      freq * 0.5,
      ctx.currentTime + i * 0.15 + 0.2,
    );
    gain.gain.setValueAtTime(0.22, ctx.currentTime + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + i * 0.15 + 0.25,
    );
    osc.connect(gain);
    gain.connect(master);
    osc.start(ctx.currentTime + i * 0.15);
    osc.stop(ctx.currentTime + i * 0.15 + 0.28);
  });
}

// ─── Background music generator ──────────────────────────────────────────────

interface MusicState {
  playing: boolean;
  stopFn: () => void;
}

function startBackgroundMusic(ctx: AudioContext, master: GainNode): MusicState {
  let stopped = false;
  let nextNoteTime = ctx.currentTime + 0.1;

  const notes = [262, 330, 392, 523, 392, 330, 262, 196];
  let noteIndex = 0;
  const noteDuration = 0.18;
  const noteGap = 0.22;

  const bassNotes = [131, 165, 131, 196];
  let bassIndex = 0;
  let nextBassTime = ctx.currentTime + 0.1;
  const bassDuration = 0.44;
  const bassGap = 0.88;

  function scheduleNote() {
    if (stopped) return;
    if (nextNoteTime < ctx.currentTime + 0.3) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = notes[noteIndex % notes.length];
      gain.gain.setValueAtTime(0.09, nextNoteTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        nextNoteTime + noteDuration,
      );
      osc.connect(gain);
      gain.connect(master);
      osc.start(nextNoteTime);
      osc.stop(nextNoteTime + noteDuration + 0.02);
      noteIndex++;
      nextNoteTime += noteGap;

      if (noteIndex % 4 === 0 && nextBassTime < ctx.currentTime + 0.5) {
        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bass.type = "sawtooth";
        bass.frequency.value = bassNotes[bassIndex % bassNotes.length];
        bassGain.gain.setValueAtTime(0.12, nextBassTime);
        bassGain.gain.exponentialRampToValueAtTime(
          0.001,
          nextBassTime + bassDuration,
        );
        bass.connect(bassGain);
        bassGain.connect(master);
        bass.start(nextBassTime);
        bass.stop(nextBassTime + bassDuration + 0.02);
        bassIndex++;
        nextBassTime += bassGap;
      }
    }

    if (!stopped) {
      requestAnimationFrame(scheduleNote);
    }
  }

  scheduleNote();

  return {
    playing: true,
    stopFn: () => {
      stopped = true;
    },
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTetrisAudio(): TetrisAudioSystem {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("tetrisverse-muted") === "true";
    } catch {
      return false;
    }
  });

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const musicStateRef = useRef<MusicState | null>(null);
  const isMutedRef = useRef(isMuted);
  const unlockedRef = useRef(false);
  const musicRequestedRef = useRef(false);
  // Track whether music is "paused" (game paused) vs fully stopped
  const musicPausedRef = useRef(false);

  // Keep ref in sync + apply gain immediately + handle mute/unmute for music
  useEffect(() => {
    isMutedRef.current = isMuted;
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.setTargetAtTime(
        isMuted ? 0 : 1,
        ctxRef.current.currentTime,
        0.05,
      );
    }
    // When unmuting: if music was requested and not paused, restart it
    if (
      !isMuted &&
      unlockedRef.current &&
      musicRequestedRef.current &&
      !musicPausedRef.current
    ) {
      if (!musicStateRef.current) {
        try {
          const ctx = ctxRef.current;
          const master = masterRef.current;
          if (ctx && master && ctx.state === "running") {
            musicStateRef.current = startBackgroundMusic(ctx, master);
          }
        } catch {
          // silent fail
        }
      }
    }
    // When muting: stop the music loop (gain is already 0, but stop scheduling)
    if (isMuted && musicStateRef.current) {
      musicStateRef.current.stopFn();
      musicStateRef.current = null;
    }
  }, [isMuted]);

  const ensureContext = useCallback((): AudioContext => {
    const ctx = getOrCreateContext(ctxRef);
    if (!masterRef.current || masterRef.current.context !== ctx) {
      masterRef.current = ctx.createGain();
      masterRef.current.gain.value = isMutedRef.current ? 0 : 1;
      masterRef.current.connect(ctx.destination);
    }
    return ctx;
  }, []);

  const unlockAudio = useCallback(async (): Promise<void> => {
    try {
      const ctx = ensureContext();
      const running = await ensureRunning(ctx);
      if (running && !unlockedRef.current) {
        unlockedRef.current = true;
        // If music was requested before unlock, start it now (unless muted or paused)
        if (
          musicRequestedRef.current &&
          !musicStateRef.current &&
          !isMutedRef.current &&
          !musicPausedRef.current
        ) {
          musicStateRef.current = startBackgroundMusic(ctx, masterRef.current!);
        }
      } else if (running && unlockedRef.current) {
        // Already unlocked — if music was requested but not running, start it
        if (
          musicRequestedRef.current &&
          !musicStateRef.current &&
          !isMutedRef.current &&
          !musicPausedRef.current
        ) {
          musicStateRef.current = startBackgroundMusic(ctx, masterRef.current!);
        }
      }
    } catch {
      // Silent fail
    }
  }, [ensureContext]);

  const playSound = useCallback(
    async (
      type:
        | "land"
        | "lineClear"
        | "multiLineClear"
        | "rotate"
        | "levelUp"
        | "gameOver",
    ) => {
      if (isMutedRef.current) return;
      try {
        const ctx = ensureContext();
        const running = await ensureRunning(ctx);
        if (!running) return;
        // Mark as unlocked on first successful sound
        if (!unlockedRef.current) {
          unlockedRef.current = true;
          if (
            musicRequestedRef.current &&
            !musicStateRef.current &&
            !musicPausedRef.current
          ) {
            musicStateRef.current = startBackgroundMusic(
              ctx,
              masterRef.current!,
            );
          }
        }
        const master = masterRef.current!;
        switch (type) {
          case "land":
            synthLand(ctx, master);
            break;
          case "rotate":
            synthRotate(ctx, master);
            break;
          case "lineClear":
            synthLineClear(ctx, master);
            break;
          case "multiLineClear":
            synthMultiLineClear(ctx, master);
            break;
          case "levelUp":
            synthLevelUp(ctx, master);
            break;
          case "gameOver":
            synthGameOver(ctx, master);
            break;
        }
      } catch {
        // Silent fail
      }
    },
    [ensureContext],
  );

  const startMusic = useCallback(
    async (_musicFile?: string) => {
      musicRequestedRef.current = true;
      musicPausedRef.current = false;

      // Stop existing music
      if (musicStateRef.current) {
        musicStateRef.current.stopFn();
        musicStateRef.current = null;
      }

      if (!unlockedRef.current || isMutedRef.current) {
        // Will be started when unlockAudio is called or when unmuted
        return;
      }

      try {
        const ctx = ensureContext();
        const running = await ensureRunning(ctx);
        if (!running) return;
        musicStateRef.current = startBackgroundMusic(ctx, masterRef.current!);
      } catch {
        // Silent fail
      }
    },
    [ensureContext],
  );

  const stopMusic = useCallback(() => {
    if (musicStateRef.current) {
      musicStateRef.current.stopFn();
      musicStateRef.current = null;
    }
    musicRequestedRef.current = false;
    musicPausedRef.current = false;
  }, []);

  /** Pause music (game paused) — keeps musicRequested true so it can resume */
  const pauseMusic = useCallback(() => {
    if (musicStateRef.current) {
      musicStateRef.current.stopFn();
      musicStateRef.current = null;
    }
    musicPausedRef.current = true;
  }, []);

  /** Resume music after pause */
  const resumeMusic = useCallback(async () => {
    if (!musicRequestedRef.current || isMutedRef.current) return;
    musicPausedRef.current = false;
    if (musicStateRef.current) return; // already playing

    try {
      const ctx = ensureContext();
      const running = await ensureRunning(ctx);
      if (!running) return;
      if (unlockedRef.current) {
        musicStateRef.current = startBackgroundMusic(ctx, masterRef.current!);
      }
    } catch {
      // Silent fail
    }
  }, [ensureContext]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("tetrisverse-muted", String(next));
      } catch {
        /* ignore */
      }
      isMutedRef.current = next;
      if (masterRef.current && ctxRef.current) {
        masterRef.current.gain.setTargetAtTime(
          next ? 0 : 1,
          ctxRef.current.currentTime,
          0.05,
        );
      }
      // Stop music loop when muting
      if (next && musicStateRef.current) {
        musicStateRef.current.stopFn();
        musicStateRef.current = null;
      }
      // Restart music loop when unmuting (if music was requested and not paused)
      if (
        !next &&
        unlockedRef.current &&
        musicRequestedRef.current &&
        !musicPausedRef.current &&
        !musicStateRef.current
      ) {
        try {
          const ctx = ctxRef.current;
          const master = masterRef.current;
          if (ctx && master && ctx.state === "running") {
            musicStateRef.current = startBackgroundMusic(ctx, master);
          }
        } catch {
          // silent fail
        }
      }
      return next;
    });
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (musicStateRef.current) musicStateRef.current.stopFn();
      if (ctxRef.current) {
        try {
          ctxRef.current.close();
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  return {
    isMuted,
    toggleMute,
    playSound,
    startMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    unlockAudio,
  };
}
