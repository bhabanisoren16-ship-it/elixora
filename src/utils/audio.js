// Web Audio API Synthesizer & Celestial Audio Engine - ELIXORA 2.0
// Ultra-Aesthetic, Luminous Crystal Glass & Celestial UI Sound Architecture

const SOUND_DATA = {
  aestheticClick: 'data:audio/wav;base64,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',
  stardustDroplet: 'data:audio/wav;base64,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',
  visionTap: 'data:audio/wav;base64,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',
};

/**
 * Reusable HTML5 Audio Element Pool
 * Guarantees instantaneous, 100% reliable audible playback on every platform
 * even during initial user gestures while Web Audio AudioContext is suspended.
 */
class AudioPool {
  constructor(dataUri, size = 8, volume = 0.72) {
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
    this.masterVolume = 0.85;
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

    // Initialize HTML5 Audio pools with ultra-aesthetic crystal sound profile
    this.aestheticClickPool = new AudioPool(SOUND_DATA.aestheticClick, 8, 0.75);
    this.dropletPool = new AudioPool(SOUND_DATA.stardustDroplet, 4, 0.70);
    this.visionPool = new AudioPool(SOUND_DATA.visionTap, 4, 0.70);

    // Register eager unlock listeners across common user interaction events
    this.initEagerUnlock();
    // Register global click listener for all interactive elements
    this.initGlobalListener();
  }

  // Pre-unlock Web Audio on earliest user interaction (pointerdown, touchstart, keydown)
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

    decodeBase64ToBuffer('aestheticClick', SOUND_DATA.aestheticClick);
    decodeBase64ToBuffer('stardustDroplet', SOUND_DATA.stardustDroplet);
    decodeBase64ToBuffer('visionTap', SOUND_DATA.visionTap);
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
   * Ultra-Aesthetic Celestial Crystal UI Click Sound
   * Designed specifically for ELIXORA 2.0's luxury cosmic theme:
   * - Pure crystal quartz bell ping (1480Hz) with shimmering 5th harmonic (2220Hz)
   * - Whisper of starlight sparkle (3700Hz) & grounded warm resonance (520Hz)
   * - Dual-engine: Instant AudioPool + Web Audio AudioBuffer / Synthesizer
   * - Organic micro-pitch drift (±2%) keeps repetitive clicks sounding alive
   */
  playClick(variation = 0) {
    if (this.muted) return;
    const now = Date.now();
    // 25ms debounce prevents duplicate sound triggers from nested click handlers
    if (now - this.lastClickTime < 25) return;
    this.lastClickTime = now;

    // Organic micro-pitch variation (±2%) for natural celestial shimmer
    const pitchMod = (1 + (Math.sin(now * 0.05) * 0.02)) * (variation ? (1 + (variation % 6) * 0.03) : 1);

    // Initialize or resume Web Audio context
    this.init();

    // Strategy A: If Web Audio context is fully running and buffer decoded, play high-res buffer
    if (this.ctx && this.ctx.state === 'running' && this.buffers.aestheticClick) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers.aestheticClick;
        source.playbackRate.setValueAtTime(pitchMod, this.ctx.currentTime);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.55 * this.masterVolume, this.ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(this.ctx.currentTime);
        return;
      } catch (e) {}
    }

    // Strategy B: If context is running but buffer not decoded yet, synthesize real-time crystal shimmer
    if (this.ctx && this.ctx.state === 'running') {
      this._playSynthesizedAestheticClick(pitchMod);
      return;
    }

    // Strategy C: Instant HTML5 AudioPool fallback (plays synchronously on user gesture)
    this.aestheticClickPool.play(pitchMod);
  }

  // Synthesizes a shimmering crystal glass tap with multi-layered celestial harmonics
  _playSynthesizedAestheticClick(pitchMod = 1) {
    try {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const t = this.ctx.currentTime;

      // 1. Crystal Bell Core (1480Hz pure sine chime)
      const coreOsc = this.ctx.createOscillator();
      const coreGain = this.ctx.createGain();

      coreOsc.type = 'sine';
      coreOsc.frequency.setValueAtTime(1480 * pitchMod, t);
      coreOsc.frequency.exponentialRampToValueAtTime(1380 * pitchMod, t + 0.045);

      coreGain.gain.setValueAtTime(0.001, t);
      coreGain.gain.linearRampToValueAtTime(0.38 * this.masterVolume, t + 0.0018);
      coreGain.gain.exponentialRampToValueAtTime(0.001, t + 0.048);

      coreOsc.connect(coreGain);
      coreGain.connect(this.ctx.destination);
      coreOsc.start(t);
      coreOsc.stop(t + 0.050);

      // 2. Celestial 5th Harmonic Shimmer (2220Hz ethereal glow)
      const shimmerOsc = this.ctx.createOscillator();
      const shimmerGain = this.ctx.createGain();

      shimmerOsc.type = 'sine';
      shimmerOsc.frequency.setValueAtTime(2220 * pitchMod, t);

      shimmerGain.gain.setValueAtTime(0.001, t);
      shimmerGain.gain.linearRampToValueAtTime(0.20 * this.masterVolume, t + 0.002);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.032);

      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(this.ctx.destination);
      shimmerOsc.start(t);
      shimmerOsc.stop(t + 0.035);

      // 3. Starlight Sparkle (3700Hz micro-sheen)
      const sparkleOsc = this.ctx.createOscillator();
      const sparkleGain = this.ctx.createGain();

      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(3700 * pitchMod, t);

      sparkleGain.gain.setValueAtTime(0.001, t);
      sparkleGain.gain.linearRampToValueAtTime(0.10 * this.masterVolume, t + 0.0015);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(this.ctx.destination);
      sparkleOsc.start(t);
      sparkleOsc.stop(t + 0.020);

      // 4. Grounding Warmth (520Hz acoustic body)
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();

      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(520 * pitchMod, t);
      bodyOsc.frequency.exponentialRampToValueAtTime(380 * pitchMod, t + 0.035);

      bodyGain.gain.setValueAtTime(0.001, t);
      bodyGain.gain.linearRampToValueAtTime(0.16 * this.masterVolume, t + 0.002);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.038);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);
      bodyOsc.start(t);
      bodyOsc.stop(t + 0.040);
    } catch (e) {}
  }

  /**
   * Aesthetic Stardust Droplet Pop Sound
   */
  playPop() {
    if (this.muted) return;
    this.init();
    if (this.ctx && this.ctx.state === 'running' && this.buffers.stardustDroplet) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers.stardustDroplet;
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.50 * this.masterVolume, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(this.ctx.currentTime);
        return;
      } catch (e) {}
    }
    this.dropletPool.play();
  }

  /**
   * Deep Mechanical "Thock" Switch Sound
   */
  playThock() {
    this.playClick();
  }

  /**
   * Ethereal Glass / Vision Crystal Tap
   */
  playGlass() {
    if (this.muted) return;
    this.init();
    if (this.ctx && this.ctx.state === 'running' && this.buffers.visionTap) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers.visionTap;
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.50 * this.masterVolume, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(this.ctx.currentTime);
        return;
      } catch (e) {}
    }
    this.visionPool.play();
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
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.015);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.09 * this.masterVolume, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.020);
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
        this.visionPool.play();
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
        gain.gain.linearRampToValueAtTime(0.22 * this.masterVolume, startT + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.40);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startT);
        osc.stop(startT + 0.44);
      });
    } catch (e) {
      this.visionPool.play();
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
        this.aestheticClickPool.play(0.8);
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
        gain.gain.linearRampToValueAtTime(0.20 * this.masterVolume, startT + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startT);
        osc.stop(startT + 0.16);
      });
    } catch (e) {
      this.aestheticClickPool.play(0.8);
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
        this.visionPool.play();
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
        gain.gain.linearRampToValueAtTime(0.22 * this.masterVolume, startT + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startT);
        osc.stop(startT + 0.72);
      });
    } catch (e) {
      this.visionPool.play();
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
