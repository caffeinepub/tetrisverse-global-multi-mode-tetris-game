import { useState, useRef, useCallback, useEffect } from 'react';

export interface TetrisAudioSystem {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: 'land' | 'lineClear' | 'multiLineClear' | 'rotate' | 'levelUp' | 'gameOver') => void;
  startMusic: (musicFile?: string) => void;
  stopMusic: () => void;
  unlockAudio: () => Promise<void>;
}

const SOUND_FILES: Record<string, string> = {
  land: '/assets/generated/land-sound.mp3',
  lineClear: '/assets/generated/line-clear-sound.mp3',
  multiLineClear: '/assets/generated/multi-line-clear-sound.mp3',
  rotate: '/assets/generated/rotate-sound.mp3',
  levelUp: '/assets/generated/level-up-sound.mp3',
  gameOver: '/assets/generated/game-over-sound.mp3',
};

export function useTetrisAudio(): TetrisAudioSystem {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tetrisverse-muted') === 'true';
    } catch {
      return false;
    }
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentMusicFileRef = useRef<string | null>(null);
  const musicBufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const soundBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const isMutedRef = useRef(isMuted);
  const audioUnlockedRef = useRef(false);
  const pendingMusicFileRef = useRef<string | null>(null);

  // Keep isMutedRef in sync and update master gain
  useEffect(() => {
    isMutedRef.current = isMuted;
    if (masterGainRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      masterGainRef.current.gain.setTargetAtTime(isMuted ? 0 : 1, now, 0.02);
    }
  }, [isMuted]);

  /**
   * Lazily create (or return existing) AudioContext + master gain node.
   * Must be called from within a user-gesture handler or after unlock.
   */
  const ensureContext = useCallback((): AudioContext => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = isMutedRef.current ? 0 : 1;
      masterGainRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, []);

  /**
   * Resume the AudioContext if it is suspended (required by autoplay policy).
   */
  const resumeContext = useCallback(async (): Promise<boolean> => {
    try {
      const ctx = ensureContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      return ctx.state === 'running';
    } catch {
      return false;
    }
  }, [ensureContext]);

  /**
   * Fetch and decode an audio file, with per-URL caching.
   */
  const loadBuffer = useCallback(async (url: string, cache: Map<string, AudioBuffer>): Promise<AudioBuffer | null> => {
    const cached = cache.get(url);
    if (cached) return cached;
    try {
      const ctx = ensureContext();
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await ctx.decodeAudioData(arrayBuffer);
      cache.set(url, buffer);
      return buffer;
    } catch {
      return null;
    }
  }, [ensureContext]);

  /**
   * Internal: actually start playing music (assumes context is running).
   */
  const _playMusic = useCallback(async (musicFile: string) => {
    try {
      const ctx = ensureContext();
      if (ctx.state !== 'running') return;

      // Stop any currently playing music source
      if (musicSourceRef.current) {
        try { musicSourceRef.current.stop(); } catch { /* already stopped */ }
        musicSourceRef.current = null;
      }

      const buffer = await loadBuffer(musicFile, musicBufferCacheRef.current);
      if (!buffer) return;

      // Context might have been suspended while loading — check again and resume if needed
      if (ctx.state !== 'running') {
        try { await ctx.resume(); } catch { /* ignore */ }
        if (ctx.state !== 'running') return;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.4;
      source.connect(gainNode);
      gainNode.connect(masterGainRef.current!);
      source.start();

      musicSourceRef.current = source;
      currentMusicFileRef.current = musicFile;
    } catch {
      // Silently fail
    }
  }, [ensureContext, loadBuffer]);

  /**
   * Unlock audio on first user interaction.
   * Creates the AudioContext, resumes it, and starts any pending music.
   */
  const unlockAudio = useCallback(async (): Promise<void> => {
    if (audioUnlockedRef.current) {
      // Already unlocked — just make sure context is running
      await resumeContext();
      return;
    }
    try {
      const running = await resumeContext();
      if (running) {
        audioUnlockedRef.current = true;
        // Start pending music if any
        if (pendingMusicFileRef.current) {
          const file = pendingMusicFileRef.current;
          pendingMusicFileRef.current = null;
          await _playMusic(file);
        }
      }
    } catch {
      // Silently fail
    }
  }, [resumeContext, _playMusic]);

  const playSound = useCallback(async (type: 'land' | 'lineClear' | 'multiLineClear' | 'rotate' | 'levelUp' | 'gameOver') => {
    // Don't play if muted
    if (isMutedRef.current) return;

    try {
      const running = await resumeContext();
      if (!running) return;

      const url = SOUND_FILES[type];
      if (!url) return;

      const buffer = await loadBuffer(url, soundBuffersRef.current);
      if (!buffer) return;

      const ctx = audioContextRef.current!;
      if (ctx.state !== 'running') return;

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.7;
      source.connect(gainNode);
      gainNode.connect(masterGainRef.current!);
      source.start();
    } catch {
      // Silently fail
    }
  }, [resumeContext, loadBuffer]);

  const startMusic = useCallback(async (musicFile?: string) => {
    if (!musicFile) return;

    // If same file is already playing, do nothing
    if (currentMusicFileRef.current === musicFile && musicSourceRef.current) return;

    if (!audioUnlockedRef.current) {
      // Queue the music — it will start after first user interaction
      pendingMusicFileRef.current = musicFile;
      return;
    }

    await _playMusic(musicFile);
  }, [_playMusic]);

  const stopMusic = useCallback(() => {
    if (musicSourceRef.current) {
      try { musicSourceRef.current.stop(); } catch { /* already stopped */ }
      musicSourceRef.current = null;
    }
    currentMusicFileRef.current = null;
    pendingMusicFileRef.current = null;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      try {
        localStorage.setItem('tetrisverse-muted', String(next));
      } catch { /* ignore */ }
      // Apply immediately via ref (the useEffect will also fire but this is instant)
      isMutedRef.current = next;
      if (masterGainRef.current && audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        masterGainRef.current.gain.setTargetAtTime(next ? 0 : 1, now, 0.02);
      }
      return next;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (musicSourceRef.current) {
        try { musicSourceRef.current.stop(); } catch { /* ignore */ }
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch { /* ignore */ }
      }
    };
  }, []);

  return { isMuted, toggleMute, playSound, startMusic, stopMusic, unlockAudio };
}
