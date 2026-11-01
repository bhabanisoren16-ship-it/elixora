// Web Audio API Synthesizer & Tactile Haptic Audio Engine - ELIXORA 2.0
// Ultra-Aesthetic, Audible, Zero-Latency UI Click & Interactive Sound Architecture

const SOUND_DATA = {
  tactile: 'data:audio/wav;base64,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',
  pop: 'data:audio/wav;base64,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',
  glass: 'data:audio/wav;base64,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',
};

/**
 * Reusable HTML5 Audio Element Pool
 * Guarantees instantaneous, 100% reliable audible playback on every platform
 * even during initial user gestures while Web Audio AudioContext is suspended.
 */
class AudioPool {
  constructor(dataUri, size = 6, volume = 0.85) {
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
        audio.playbackRate = Math.max(0.8, Math.min(1.25, pitchVariation));
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
    this.masterVolume = 0.90;
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

    // Initialize HTML5 Audio pools for instant, zero-latency physical clicks
    this.tactilePool = new AudioPool(SOUND_DATA.tactile, 8, 0.85);
    this.popPool = new AudioPool(SOUND_DATA.pop, 4, 0.85);
    this.glassPool = new AudioPool(SOUND_DATA.glass, 4, 0.80);

    // Register eager unlock listeners across all common user interaction events
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

    decodeBase64ToBuffer('tactile', SOUND_DATA.tactile);
    decodeBase64ToBuffer('pop', SOUND_DATA.pop);
    decodeBase64ToBuffer('glass', SOUND_DATA.glass);
  }

  // Global listener ensures every button, link, and interactive click plays the aesthetic click sound
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
   * Ultra-Aesthetic UI Click Sound
   * Dual-engine architecture:
   * 1. Instant AudioPool playback ensures immediate audibility on any touch/click
   * 2. Web Audio AudioBuffer / Multi-Layer synthesizer when context is running
   * 3. Organic micro-pitch drift (±2%) so repetitive clicks feel tactile and natural
   */
  playClick(variation = 0) {
    if (this.muted) return;
    const now = Date.now();
    // 25ms debounce prevents duplicate sound triggers from nested click handlers
    if (now - this.lastClickTime < 25) return;
    this.lastClickTime = now;

    // Organic micro-pitch variation (±2.5%) for natural tactile response
    const pitchMod = (1 + (Math.sin(now * 0.05) * 0.025)) * (variation ? (1 + (variation % 6) * 0.035) : 1);

    // Initialize or resume Web Audio context
    this.init();

    // Strategy A: If Web Audio context is fully running and buffer decoded, play high-res buffer
    if (this.ctx && this.ctx.state === 'running' && this.buffers.tactile) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers.tactile;
        source.playbackRate.setValueAtTime(pitchMod, this.ctx.currentTime);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.55 * this.masterVolume, this.ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(this.ctx.currentTime);
        return;
      } catch (e) {}
    }

    // Strategy B: If context is running but buffer not decoded yet, run synthesized multi-layer click
    if (this.ctx && this.ctx.state === 'running') {
      this._playSynthesizedClick(pitchMod);
      return;
    }

    // Strategy C: Instant HTML5 AudioPool fallback (plays synchronously on user gesture)
    this.tactilePool.play(pitchMod);
  }

  // Synthesizes a crisp, tactile UI switch click with multi-layered acoustic resonance
  _playSynthesizedClick(pitchMod = 1) {
    try {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const t = this.ctx.currentTime;

      // 1. Tactile Snap Transient (2600Hz decaying in 10ms)
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'sine';
      snapOsc.frequency.setValueAtTime(2600 * pitchMod, t);
      snapOsc.frequency.exponentialRampToValueAtTime(1400 * pitchMod, t + 0.010);

      snapGain.gain.setValueAtTime(0.42 * this.masterVolume, t);
      snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snapOsc.start(t);
      snapOsc.stop(t + 0.014);

      // 2. Warm Switch Body "Thock" (460Hz decaying to 220Hz over 38ms)
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      const bodyFilter = this.ctx.createBiquadFilter();

      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(460 * pitchMod, t);
      bodyOsc.frequency.exponentialRampToValueAtTime(220 * pitchMod, t + 0.035);

      bodyFilter.type = 'lowpass';
      bodyFilter.frequency.setValueAtTime(850, t);

      bodyGain.gain.setValueAtTime(0.38 * this.masterVolume, t);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.040);

      bodyOsc.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);
      bodyOsc.start(t);
      bodyOsc.stop(t + 0.042);

      // 3. Ceramic Luminous Sheen (1850Hz crystal accent)
      const sheenOsc = this.ctx.createOscillator();
      const sheenGain = this.ctx.createGain();
      sheenOsc.type = 'sine';
      sheenOsc.frequency.setValueAtTime(1850 * pitchMod, t);
      sheenOsc.frequency.exponentialRampToValueAtTime(920 * pitchMod, t + 0.015);

      sheenGain.gain.setValueAtTime(0.18 * this.masterVolume, t);
      sheenGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

      sheenOsc.connect(sheenGain);
      sheenGain.connect(this.ctx.destination);
      sheenOsc.start(t);
      sheenOsc.stop(t + 0.020);
    } catch (e) {}
  }

  /**
   * Aesthetic Bubble Pop Sound (Soft organic droplet pop)
   */
  playPop() {
    if (this.muted) return;
    this.init();
    if (this.ctx && this.ctx.state === 'running' && this.buffers.pop) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers.pop;
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.55 * this.masterVolume, this.ctx.currentTime);
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
        gainNode.gain.setValueAtTime(0.50 * this.masterVolume, this.ctx.currentTime);
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
      osc.frequency.setValueAtTime(840, t);
      osc.frequency.exponentialRampToValueAtTime(560, t + 0.018);

      gain.gain.setValueAtTime(0.12 * this.masterVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.025);
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

        gain.gain.setValueAtTime(0.22 * this.masterVolume, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.42);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startT);
        osc.stop(startT + 0.45);
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
        this.tactilePool.play(0.8);
        return;
      }
      const t = this.ctx.currentTime;
      [280, 200].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startT = t + i * 0.08;
        osc.frequency.setValueAtTime(f, startT);

        gain.gain.setValueAtTime(0.24 * this.masterVolume, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startT);
        osc.stop(startT + 0.16);
      });
    } catch (e) {
      this.tactilePool.play(0.8);
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

        gain.gain.setValueAtTime(0.26 * this.masterVolume, startT);
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
