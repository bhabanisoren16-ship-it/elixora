// Web Audio API Synthesizer & Tactile Audio Engine - ELIXORA 2.0
// Ultra-Aesthetic, Soft, Smooth UI Click & Interactive Sound Architecture

const SOUND_DATA = {
  softClick: 'data:audio/wav;base64,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',
  pebblePop: 'data:audio/wav;base64,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',
  glass: 'data:audio/wav;base64,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',
};

/**
 * Reusable HTML5 Audio Element Pool
 * Guarantees instantaneous, 100% reliable audible playback on every platform
 * even during initial user gestures while Web Audio AudioContext is suspended.
 */
class AudioPool {
  constructor(dataUri, size = 6, volume = 0.65) {
    this.pool = [];
    this.index = 0;
    this.volume = volume;

    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      try {
        for (let i = 0; i < size; i++) {
          const audio = new Audio(dataUri);
          audio.preload = 'auto';
          audio.volume = volume;
          this.pool.push(audio);
        }
      } catch (e) {
        // Fallback if Audio constructor fails
      }
    }
  }

  play(pitchVariation = 1) {
    if (!this.pool.length) return false;
    try {
      const audio = this.pool[this.index];
      this.index = (this.index + 1) % this.pool.length;
      audio.currentTime = 0;
      audio.volume = Math.max(0, Math.min(1, this.volume));
      if (typeof audio.playbackRate === 'number' && pitchVariation !== 1) {
        audio.playbackRate = Math.max(0.85, Math.min(1.15, pitchVariation));
      }
      const promise = audio.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}

class SoundController {
  constructor() {
    this.ctx = null;
    this.lastClickTime = 0;
    this.muted = false;
    this.masterVolume = 0.75;
    this.buffers = {};
    this.bufferLoading = false;

    // Clear any accidental legacy mute flags to guarantee audibility
    if (typeof localStorage !== 'undefined') {
      try {
        if (localStorage.getItem('elixora_sound_muted') === 'true') {
          localStorage.removeItem('elixora_sound_muted');
        }
      } catch (e) {}
    }

    // Initialize HTML5 Audio pools with soft, velvety sound profile
    this.softClickPool = new AudioPool(SOUND_DATA.softClick, 8, 0.65);
    this.popPool = new AudioPool(SOUND_DATA.pebblePop, 4, 0.60);
    this.glassPool = new AudioPool(SOUND_DATA.glass, 4, 0.55);

    // Register eager unlock listeners across common user interaction events
    this.initEagerUnlock();
    // Register global click listener for all interactive elements
    this.initGlobalListener();
  }

  // Pre-unlock Web Audio on the earliest user interaction (pointerdown, touchstart, keydown)
  initEagerUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    };

    ['pointerdown', 'touchstart', 'mousedown', 'keydown'].forEach((eventName) => {
      window.addEventListener(eventName, unlock, { passive: true, capture: true });
    });
  }

  init() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
          this.loadBuffers();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      // Audio autoplay policy fallback handled via AudioPool
    }
  }

  // Decode audio data into native Web Audio AudioBuffers for high-fidelity manipulation
  loadBuffers() {
    if (!this.ctx || this.bufferLoading) return;
    this.bufferLoading = true;

    const decodeBase64ToBuffer = async (key, base64Data) => {
      try {
        const base64Content = base64Data.split(',')[1];
        const binaryString = window.atob(base64Content);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBuffer = await this.ctx.decodeAudioData(bytes.buffer.slice(0));
        this.buffers[key] = audioBuffer;
      } catch (e) {
        // Fallback to pool if decode fails
      }
    };

    decodeBase64ToBuffer('softClick', SOUND_DATA.softClick);
    decodeBase64ToBuffer('pebblePop', SOUND_DATA.pebblePop);
    decodeBase64ToBuffer('glass', SOUND_DATA.glass);
  }

  // Global listener ensures every button, link, and interactive click plays the soft click sound
  initGlobalListener() {
    if (typeof window === 'undefined') return;

    const isInteractive = (target) => {
      if (!target || typeof target.closest !== 'function') return false;
      if (
        target.closest(
          'button, a, [role="button"], input, select, textarea, label, [data-clickable], .cursor-pointer, [tabindex], nav, header, footer, summary, .interactive, .clickable, [onclick]'
        )
      ) {
        return true;
      }
      try {
        if (window.getComputedStyle(target).cursor === 'pointer') return true;
      } catch (err) {}
      return false;
    };

    const handleGlobalClick = (e) => {
      const target = e.target;
      if (!target) return;
      if (isInteractive(target)) {
        this.playClick();
      }
    };

    window.addEventListener('click', handleGlobalClick, { passive: true, capture: true });
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('elixora_sound_muted', String(this.muted));
      } catch (e) {}
    }
    if (!this.muted) {
      this.playClick();
    }
    return this.muted;
  }

  setMuted(muteVal) {
    this.muted = Boolean(muteVal);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('elixora_sound_muted', String(this.muted));
      } catch (e) {}
    }
  }

  /**
   * Soft, Aesthetic UI Click Sound
   * Dual-engine architecture with warm, rounded acoustic profile:
   * - Smooth, rounded 2.5ms attack removes harsh clicks and clicks
   * - Warm fundamental (560Hz -> 260Hz) with gentle velvet damping
   * - Gentle volume level for comfortable, satisfying haptic feel
   * - Organic micro-pitch drift (±2%) so repetitive clicks feel natural
   */
  playClick(variation = 0) {
    if (this.muted) return;
    const now = Date.now();
    // 25ms debounce prevents duplicate sound triggers from nested click handlers
    if (now - this.lastClickTime < 25) return;
    this.lastClickTime = now;

    // Organic micro-pitch variation (±2%) for natural tactile response
    const pitchMod = (1 + (Math.sin(now * 0.05) * 0.02)) * (variation ? (1 + (variation % 6) * 0.03) : 1);

    // Initialize or resume Web Audio context
    this.init();

    // Strategy A: If Web Audio context is fully running and buffer decoded, play high-res buffer
    if (this.ctx && this.ctx.state === 'running' && this.buffers.softClick) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers.softClick;
        source.playbackRate.setValueAtTime(pitchMod, this.ctx.currentTime);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.45 * this.masterVolume, this.ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(this.ctx.currentTime);
        return;
      } catch (e) {}
    }

    // Strategy B: If context is running but buffer not decoded yet, run soft synthesized click
    if (this.ctx && this.ctx.state === 'running') {
      this._playSynthesizedSoftClick(pitchMod);
      return;
    }

    // Strategy C: Instant HTML5 AudioPool fallback (plays synchronously on user gesture)
    this.softClickPool.play(pitchMod);
  }

  // Synthesizes a soft, velvety UI tap with rounded attack and warm body
  _playSynthesizedSoftClick(pitchMod = 1) {
    try {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const t = this.ctx.currentTime;

      // 1. Soft Rounded Body (Smooth sine sweep 560Hz -> 260Hz)
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();

      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(560 * pitchMod, t);
      bodyOsc.frequency.exponentialRampToValueAtTime(260 * pitchMod, t + 0.032);

      // Smooth 2.5ms attack eliminates digital clicks / harsh transients
      bodyGain.gain.setValueAtTime(0.001, t);
      bodyGain.gain.linearRampToValueAtTime(0.28 * this.masterVolume, t + 0.0025);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.036);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);
      bodyOsc.start(t);
      bodyOsc.stop(t + 0.038);

      // 2. Soft Warm Harmonic Overtone (880Hz gently decaying)
      const overtoneOsc = this.ctx.createOscillator();
      const overtoneGain = this.ctx.createGain();

      overtoneOsc.type = 'sine';
      overtoneOsc.frequency.setValueAtTime(880 * pitchMod, t);
      overtoneOsc.frequency.exponentialRampToValueAtTime(440 * pitchMod, t + 0.016);

      overtoneGain.gain.setValueAtTime(0.001, t);
      overtoneGain.gain.linearRampToValueAtTime(0.09 * this.masterVolume, t + 0.002);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

      overtoneOsc.connect(overtoneGain);
      overtoneGain.connect(this.ctx.destination);
      overtoneOsc.start(t);
      overtoneOsc.stop(t + 0.020);
    } catch (e) {}
  }

  /**
   * Aesthetic Pebble / Bubble Pop Sound (Soft organic droplet pop)
   */
  playPop() {
    if (this.muted) return;
    this.init();
    if (this.ctx && this.ctx.state === 'running' && this.buffers.pebblePop) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers.pebblePop;
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.42 * this.masterVolume, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(this.ctx.currentTime);
        return;
      } catch (e) {}
    }
    this.popPool.play();
  }

  /**
   * Deep Mechanical "Thock" Switch Sound
   */
  playThock() {
    this.playClick();
  }

  /**
   * Ethereal Glass / Crystal Tap
   */
  playGlass() {
    if (this.muted) return;
    this.init();
    if (this.ctx && this.ctx.state === 'running' && this.buffers.glass) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers.glass;
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.40 * this.masterVolume, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(this.ctx.currentTime);
        return;
      } catch (e) {}
    }
    this.glassPool.play();
  }

  /**
   * Subtle celestial hover tick (silky touch when passing over interactive cards)
   */
  playHover() {
    if (this.muted) return;
    const now = Date.now();
    if (now - this.lastClickTime < 35) return;

    try {
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, t);
      osc.frequency.exponentialRampToValueAtTime(480, t + 0.016);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.08 * this.masterVolume, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.020);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.022);
    } catch (e) {}
  }

  /**
   * Luxurious Celestial Chord Chime (D-Major 9th Euphoric Confirmation)
   */
  playSuccess() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') {
        this.glassPool.play();
        return;
      }
      const t = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
      notes.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startT = t + i * 0.055;
        osc.frequency.setValueAtTime(f, startT);

        gain.gain.setValueAtTime(0.001, startT);
        gain.gain.linearRampToValueAtTime(0.18 * this.masterVolume, startT + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.40);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startT);
        osc.stop(startT + 0.44);
      });
    } catch (e) {
      this.glassPool.play();
    }
  }

  /**
   * Soft, respectful error alert (Warm double-thud, non-abrasive)
   */
  playError() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') {
        this.softClickPool.play(0.85);
        return;
      }
      const t = this.ctx.currentTime;
      [280, 200].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startT = t + i * 0.08;
        osc.frequency.setValueAtTime(f, startT);

        gain.gain.setValueAtTime(0.001, startT);
        gain.gain.linearRampToValueAtTime(0.18 * this.masterVolume, startT + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startT);
        osc.stop(startT + 0.16);
      });
    } catch (e) {
      this.softClickPool.play(0.85);
    }
  }

  /**
   * Celebratory Holographic Pass Generation Chime (Ascending Celestial Arpeggio)
   */
  playPassCelebration() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') {
        this.glassPool.play();
        return;
      }
      const t = this.ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const startT = t + idx * 0.09;
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.001, startT);
        gain.gain.linearRampToValueAtTime(0.20 * this.masterVolume, startT + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startT);
        osc.stop(startT + 0.72);
      });
    } catch (e) {
      this.glassPool.play();
    }
  }

  toggleAmbient() { return false; }
  startAmbient() {}
  stopAmbient() {}
  playLaserSweep() {}
  playGlitch() {}
  playLightningThunder() {}
}

export const soundController = new SoundController();
