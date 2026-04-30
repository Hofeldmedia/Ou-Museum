import { useEffect } from 'react';

export function AudioAura({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return undefined;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return undefined;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 82;
    gain.gain.value = 0.006;
    oscillator.connect(gain);
    gain.connect(context.destination);
    void context.resume();
    oscillator.start();

    return () => {
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
      oscillator.stop(context.currentTime + 0.14);
      setTimeout(() => void context.close(), 180);
    };
  }, [enabled]);

  return null;
}
