// Ultra-soothing, warm ambient audio synthesizer for ALGO FLOW
// Uses pentatonic scale quantization, lowpass filtering, and soft organic envelopes

const PENTATONIC_SCALE = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
  1046.50,// C6
  1174.66 // D6
];

class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private lastPlayTime: number = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Play a soft, warm pentatonic marimba tap mapped to array value
  public playCompare(val: number = 50, min: number = 0, max: number = 100) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Rate-limit consecutive compare sounds to prevent harsh overlapping
    const now = this.ctx.currentTime;
    if (now - this.lastPlayTime < 0.025) return;
    this.lastPlayTime = now;

    try {
      const normalized = Math.max(0, Math.min(1, (val - min) / Math.max(1, max - min)));
      const scaleIdx = Math.floor(normalized * (PENTATONIC_SCALE.length - 1));
      const freq = PENTATONIC_SCALE[scaleIdx];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Soft sine wave through a warm lowpass filter
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      // Micro-envelope: 2ms attack, 40ms exponential decay
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore audio errors
    }
  }

  // Play a gentle, organic wooden swap sound (low double-tap)
  public playSwap() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    try {
      const freqs = [220, 330]; // Low A3 and E4
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.02);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now + idx * 0.02);

        gain.gain.setValueAtTime(0, now + idx * 0.02);
        gain.gain.linearRampToValueAtTime(0.03, now + idx * 0.02 + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.02 + 0.06);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.02);
        osc.stop(now + idx * 0.02 + 0.07);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Play a soothing ambient completion chord (Cmaj9) with soft decay
  public playComplete() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    try {
      // Cmaj9 frequencies: C4, G4, B4, E5, G5, C6
      const chord = [261.63, 392.00, 493.88, 659.25, 783.99, 1046.50];

      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        const startTime = now + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.025, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.2);
      });
    } catch {
      // Ignore audio errors
    }
  }
}

export const soundFX = new SoundFX();
