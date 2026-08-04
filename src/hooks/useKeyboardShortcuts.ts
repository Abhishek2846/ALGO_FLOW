import { useEffect } from 'react';

interface ShortcutHandlers {
  onTogglePlay?: () => void;
  onStep?: () => void;
  onReset?: () => void;
  onSpeed?: (speed: number) => void;
}

export function useKeyboardShortcuts({
  onTogglePlay,
  onStep,
  onReset,
  onSpeed,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keypresses inside input fields or textareas
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay?.();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onStep?.();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        onReset?.();
      } else if (e.code === 'Digit1') {
        onSpeed?.(1);
      } else if (e.code === 'Digit2') {
        onSpeed?.(2);
      } else if (e.code === 'Digit3') {
        onSpeed?.(3);
      } else if (e.code === 'Digit4') {
        onSpeed?.(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onStep, onReset, onSpeed]);
}
