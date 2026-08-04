import { useState } from 'react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface VisualizerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  arraySize: number;
  onArraySizeChange: (n: number) => void;
  onCustomInput: (values: number[]) => void;
  isDone: boolean;
}

const ACCENT = '#4fd1a5';

function ControlBtn({ id, icon, label, onClick, disabled, accent }: {
  id: string; icon: string; label: string; onClick: () => void; disabled: boolean; accent?: boolean;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '40px', height: '40px',
        background: accent ? 'rgba(79, 209, 165, 0.2)' : 'rgba(18, 19, 26, 0.8)',
        border: `1px solid ${accent ? ACCENT : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '50%',
        color: accent ? ACCENT : '#a0a0b0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s ease',
        boxShadow: accent && !disabled ? `0 0 15px ${ACCENT}66` : 'none',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.1)';
          if (!accent) e.currentTarget.style.color = '#fff';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
          if (!accent) e.currentTarget.style.color = '#a0a0b0';
        }
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{icon}</span>
    </button>
  );
}

export default function VisualizerControls({
  isPlaying, onPlay, onPause, onStep, onReset,
  speed, onSpeedChange,
  arraySize, onArraySizeChange,
  onCustomInput,
  isDone,
}: VisualizerControlsProps) {
  const [customVal, setCustomVal] = useState('');
  const [customError, setCustomError] = useState('');

  useKeyboardShortcuts({
    onTogglePlay: () => {
      if (isPlaying) onPause();
      else if (!isDone) onPlay();
    },
    onStep: () => {
      if (!isPlaying && !isDone) onStep();
    },
    onReset,
    onSpeed: onSpeedChange,
  });

  const handleCustomInput = () => {
    const parts = customVal.split(',').map((s) => parseInt(s.trim(), 10));
    if (parts.some(isNaN) || parts.length < 2) {
      setCustomError('Enter ≥ 2 comma-separated integers.');
      return;
    }
    if (parts.some((v) => v < 1 || v > 999)) {
      setCustomError('Values must be 1 - 999.');
      return;
    }
    setCustomError('');
    onCustomInput(parts);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Circular Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isPlaying ? (
            <ControlBtn id="ctrl-pause" icon="pause" label="Pause (Space)" onClick={onPause} disabled={isDone} accent />
          ) : (
            <ControlBtn id="ctrl-play" icon="play_arrow" label="Play (Space)" onClick={onPlay} disabled={isDone} accent={!isDone} />
          )}
          <ControlBtn id="ctrl-step" icon="skip_next" label="Step (→)" onClick={onStep} disabled={isPlaying || isDone} />
          <ControlBtn id="ctrl-reset" icon="replay" label="Reset (R)" onClick={onReset} disabled={false} />
        </div>

        {/* Speed Pill Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 1rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#94a3b8' }}>speed</span>
          <input
            id="ctrl-speed"
            type="range"
            min={0.25} max={4} step={0.25}
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            style={{ width: '80px', accentColor: ACCENT }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: ACCENT, minWidth: '32px', textAlign: 'right', fontWeight: 600 }}>{speed}x</span>
        </div>

      </div>

      {/* Row 2: Array Size + Custom Input */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#94a3b8' }}>Size:</span>
          <input
            id="ctrl-array-size"
            type="range"
            min={4} max={60} step={1}
            value={arraySize}
            onChange={(e) => onArraySizeChange(parseInt(e.target.value, 10))}
            style={{ width: 90, accentColor: ACCENT }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: ACCENT, fontWeight: 600 }}>{arraySize}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 200 }}>
          <input
            id="ctrl-custom-input"
            type="text"
            placeholder="Custom: 42, 15, 8, 73, 31"
            value={customVal}
            onChange={(e) => { setCustomVal(e.target.value); setCustomError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomInput()}
            style={{ flex: 1, padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
          />
          <button
            id="ctrl-set-input"
            onClick={handleCustomInput}
            style={{ padding: '0.35rem 0.75rem', background: 'rgba(79,209,165,0.15)', border: '1px solid rgba(79,209,165,0.3)', borderRadius: '0.4rem', color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Row 3: Hotkeys Hint Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', paddingTop: '0.2rem' }}>
        <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 3, color: '#94a3b8' }}>Space</kbd> Play/Pause</span>
        <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 3, color: '#94a3b8' }}>→</kbd> Step</span>
        <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 3, color: '#94a3b8' }}>R</kbd> Reset</span>
        <span><kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 3, color: '#94a3b8' }}>1-4</kbd> Speed</span>
      </div>

      {customError && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ef6461', margin: 0 }}>{customError}</p>}
    </div>
  );
}

