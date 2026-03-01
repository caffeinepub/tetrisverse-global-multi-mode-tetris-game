import { useState, useRef, useCallback, useEffect } from 'react';

export interface TetrisAudioSystem {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: 'land' | 'lineClear' | 'multiLineClear' | 'rotate' | 'levelUp' | 'gameOver') => void;
  startMusic: (musicFile?: string) => void;
  stopMusic: () => void;
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
    return localStorage.getItem('tetrisverse-muted') === 'true';
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const musicBufferRef = useRef<AudioBuffer | null>(null);
  const soundBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(isMuted ? 0 : 1, masterGainRef.current.context.currentTime, 0.01);
    }
  }, [isMuted]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = isMutedRef.current ? 0 : 1;
      masterGainRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, []);

  const loadBuffer = useCallback(async (url: string): Promise<AudioBuffer | null> => {
    try {
      const ctx = getAudioContext();
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      return await ctx.decodeAudioData(arrayBuffer);
    } catch {
      return null;
    }
  }, [getAudioContext]);

  const playSound = useCallback(async (type: 'land' | 'lineClear' | 'multiLineClear' | 'rotate' | 'levelUp' | 'gameOver') => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      let buffer = soundBuffersRef.current.get(type);
      if (!buffer) {
        const url = SOUND_FILES[type];
        if (!url) return;
        const loaded = await loadBuffer(url);
        if (!loaded) return;
        buffer = loaded;
        soundBuffersRef.current.set(type, buffer);
      }

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
  }, [getAudioContext, loadBuffer]);

  const startMusic = useCallback(async (musicFile?: string) => {
    try {
      if (!musicFile) return;
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Stop existing music
      if (musicSourceRef.current) {
        try { musicSourceRef.current.stop(); } catch {}
        musicSourceRef.current = null;
      }

      let buffer = musicBufferRef.current;
      if (!buffer || (musicSourceRef.current as any)?._musicFile !== musicFile) {
        const loaded = await loadBuffer(musicFile);
        if (!loaded) return;
        buffer = loaded;
        musicBufferRef.current = buffer;
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
      (musicSourceRef.current as any)._musicFile = musicFile;
    } catch {
      // Silently fail
    }
  }, [getAudioContext, loadBuffer]);

  const stopMusic = useCallback(() => {
    if (musicSourceRef.current) {
      try { musicSourceRef.current.stop(); } catch {}
      musicSourceRef.current = null;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      localStorage.setItem('tetrisverse-muted', String(next));
      return next;
    });
  }, []);

  return { isMuted, toggleMute, playSound, startMusic, stopMusic };
}
