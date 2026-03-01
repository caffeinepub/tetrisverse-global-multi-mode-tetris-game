import React, { createContext, useContext, ReactNode } from 'react';
import { useTetrisAudio as _useTetrisAudio, TetrisAudioSystem } from '../hooks/useTetrisAudio';

const TetrisAudioContext = createContext<TetrisAudioSystem | null>(null);

export function TetrisAudioProvider({ children }: { children: ReactNode }) {
  const audio = _useTetrisAudio();

  return (
    <TetrisAudioContext.Provider value={audio}>
      {children}
    </TetrisAudioContext.Provider>
  );
}

export function useTetrisAudioContext(): TetrisAudioSystem {
  const ctx = useContext(TetrisAudioContext);
  if (!ctx) throw new Error('useTetrisAudioContext must be used within TetrisAudioProvider');
  return ctx;
}

/** Backward-compat alias — same as useTetrisAudioContext */
export function useTetrisAudio(): TetrisAudioSystem {
  return useTetrisAudioContext();
}
