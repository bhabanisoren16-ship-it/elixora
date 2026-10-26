// Web Audio API Synthesizer - Ultra-crisp, tactile UI Click & Interactive Sound Effects
class SoundController {
  constructor() {
    this.ctx = null;
    this.lastClickTime = 0;
    this.isPlaying = false;
    this.initGlobalListener();
  }

  init() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Global listener ensures every button, link, and interactive click plays a tactile click sound
  initGlobalListener() {
    if (typeof window === 'undefined') return;
    const handleGlobalClick = (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;
      const clickable = target.closest('button, a, [role="button"], input[type="submit"], input[type="button"], .cursor-pointer, [data-clickable]');
      if (clickable) {
        this.playClick();
      }
    };
    window.addEventListener('click', handleGlobalClick, { passive: true, capture: true });
  }

  // Crisp, tactile, modern UI mechanical/switch click sound
  playClick(variation = 0) {
    const now = Date.now();
    // 35ms debounce prevents double clicks when button has both local onClick and global listener
    if (now - this.lastClickTime < 35) return;
    this.lastClickTime = now;

    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Crisp Transient Impulse (Mechanical Snap)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startFreq = variation ? 850 + variation * 80 : 960;
      const endFreq = 180;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.045);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.055);

      // 2. High-Frequency Tactile "Switch" Click Pop
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(1800, t);
      popOsc.frequency.exponentialRampToValueAtTime(380, t + 0.016);

      popGain.gain.setValueAtTime(0.09, t);
      popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);

      popOsc.start(t);
      popOsc.stop(t + 0.02);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Subtle acoustic hover tick
  playHover() {
    const now = Date.now();
    if (now - this.lastClickTime < 25) return;

    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.022);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.025);
    } catch (e) {}
  }

  // Pleasant success chime
  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + i * 0.08);
        gain.gain.setValueAtTime(0.001, t + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, t + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.08);
        osc.stop(t + i * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  // Subtle error notification sound
  playError() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      [320, 220].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t + i * 0.09);
        gain.gain.setValueAtTime(0.08, t + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.09);
        osc.stop(t + i * 0.09 + 0.15);
      });
    } catch (e) {}
  }

  // Celebratory Holographic Pass Generation Chime
  playPassCelebration() {
    try {
      this.init();
      if (!this.ctx) return;
      const chords = [523.25, 659.25, 783.99, 1046.50];
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.16, this.ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.12 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.12);
        osc.stop(this.ctx.currentTime + idx * 0.12 + 0.8);
      });
    } catch (e) {}
  }

  toggleAmbient() { return false; }
  startAmbient() {}
  stopAmbient() {}
  playLaserSweep() {}
  playGlitch() {}
  playLightningThunder() {}
}

export const soundController = new SoundController();
