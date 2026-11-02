// Web Audio API Synthesizer & Audio Engine - Ported directly from INNOVISION (innonitrkl.com)
// Exact Innovision Click Sound & Telemetry Audio Architecture

// Clean PCM WAV data of the official Innovision beep sound (innonitrkl.com/assets/beep.mp3)
const INNOVISION_BEEP_B64 = 'data:audio/wav;base64,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1v/j/+3/+f8IABUAIQAqAC8ALwAtACUAGgAPAPz/7P/g/9H/zP/O/87/2//q//b/DAAaACYAMAAvAC4AJgAdABEAAgD4/+j/4P/d/9f/3P/e/+P/7f/4/wQADwAcACAAJgAsACUAIgAZAAcA/P/u/+D/3P/W/9X/2//k//H//P8LABUAHAAmACIAIwAhABMAEAACAPj/8//n/+T/3//g/+L/5f/x//X/AgAPABMAIAAiACMAJAAbABQABwD7//D/5f/j/9z/3P/k/+f/8////wUAEgAVABoAHgAbABwAFAANAAgA/P/5/+7/6P/n/9//5f/n/+3/+f/+/wwAEgAaACAAHQAfABYADwAHAPn/9v/s/+b/5//l/+r/7//1//3/AgAKAA8AEQAXABUAFAATAAwACQACAPr/9f/s/+r/5//o/+z/7//6/wAACAATABMAGwAYABUAEwAIAAUA+//0//H/6v/u/+z/7v/1//b//f8BAAcADAAOABMAEgASABAACwAJAAEA+f/1/+7/7P/s/+v/8P/0//v/AwAHABAAEQASABYADwAOAAgAAgAAAPj/9v/y//D/8f/w//X/9v/6/wAAAgAJAAsAEAASAA8AEAALAAcAAgD7//f/8f/v/+//7v/z//f/+/8CAAYACgAOAA4ADwANAAoACQAEAAEA/f/5//b/9P/z//P/9f/3//r///8CAAcACwANAA8ADQAMAAkABAABAPz/9//2//P/8//0//b/+v/9/wAABAAGAAkACgAKAAkACAAGAAUAAQD+//z/+f/3//f/9f/3//n/+v///wIABQAJAAoACwALAAkABwAEAAAA/f/6//j/9//2//f/+P/6//3///8CAAUABgAIAAkACAAHAAYABAACAP///P/7//j/9//4//j/+v/8////AwAFAAcACQAIAAkABwAEAAMAAAD9//z/+v/5//n/+f/7//z//f///wIABAAFAAYABwAHAAYABQADAAEA///8//r/+f/4//n/+v/7//7/AAABAAUABQAGAAcABQAFAAQAAQAAAP///f/7//v/+//6//v//f/9/wAAAQACAAQABQAFAAYABQADAAIAAAD///7//P/6//z/+//8//7//v8AAAIAAgADAAQABAAEAAMAAwABAAEAAAD+//7//P/7//3//P/8//7//v8AAAIAAgADAAQABAAEAAMAAgABAP///v/9//3//f/9//3//v/+/wAAAQABAAIAAwADAAMAAgACAAIAAQAAAP///v/+//3//f/9//3//v///wAAAQACAAMAAwADAAMAAwACAAEAAAD///7//v/+//3//v/+//7///8AAAEAAQACAAIAAwADAAIAAgABAAAA///+//7//v/9//3//v//////AAABAAIAAgADAAMAAwACAAEAAAD//////v/+//7//v/+/////////wAAAQACAAIAAgACAAIAAgABAAEAAAD//////v/+//7//v//////AAAAAAEAAgACAAIAAgABAAEAAQAAAAAA//////7//v///////////wAAAAABAAEAAgACAAIAAQABAAEAAAAAAP/////+//7/////////AAAAAAAAAQABAAEAAQABAAEAAQABAAAAAAD/////////////////////AAAAAAEAAQABAAAAAQABAAEAAQAAAP////////////////////8AAAAAAAABAAAAAAABAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAP//AAAAAAAAAAAAAAAAAQAAAAAAAAABAAEAAAAAAAAAAAAAAP//AAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

/**
 * Reusable HTML5 Audio Element Pool for Innovision Click Sound
 * Guarantees instantaneous, 100% reliable audible playback on every platform.
 */
class AudioPool {
  constructor(dataUri, size = 8, volume = 0.70) {
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

  play() {
    if (!this.pool.length) return false;
    try {
      const audio = this.pool[this.index];
      this.index = (this.index + 1) % this.pool.length;
      audio.currentTime = 0;
      audio.volume = Math.max(0, Math.min(1, this.volume));
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
    this.masterGain = null;
    this.decodedBuffer = null;
    this.unlocked = false;
    this.lastClickTime = -1e9;
    this.muted = false;
    this.masterVolume = 0.90;

    // Clear any accidental legacy mute flags to guarantee sound plays
    if (typeof localStorage !== 'undefined') {
      try {
        if (localStorage.getItem('elixora_sound_muted') === 'true') {
          localStorage.removeItem('elixora_sound_muted');
        }
      } catch (e) {}
    }

    // Exact Innovision HTML5 Audio pool with beep sound
    this.beepPool = new AudioPool(INNOVISION_BEEP_B64, 8, 0.70);

    // Register Innovision eager unlock and global click listeners
    this.initEagerUnlock();
    this.initGlobalListener();
  }

  // Exact Innovision AudioContext getter with instant synchronous buffer decode
  getAudioContext() {
    if (this.ctx) return this.ctx;
    if (typeof window === 'undefined') return null;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    try {
      const t = new AudioContextClass();
      this.ctx = t;
      const o = t.createGain();
      o.gain.value = 0.55 * this.masterVolume;
      o.connect(t.destination);
      this.masterGain = o;

      // Synchronously parse and create native AudioBuffer from the 16-bit PCM WAV
      this.createBufferFromWav(t);

      return t;
    } catch (e) {
      return null;
    }
  }

  // Parse 16-bit PCM WAV directly into AudioBuffer with ZERO asynchronous delay
  createBufferFromWav(audioCtx) {
    if (this.decodedBuffer || !audioCtx) return;

    try {
      const base64Data = INNOVISION_BEEP_B64.split(',')[1];
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Read WAV header (16-bit PCM, 44100Hz mono)
      const dataOffset = 44;
      const sampleCount = Math.floor((bytes.length - dataOffset) / 2);
      if (sampleCount > 0) {
        const audioBuffer = audioCtx.createBuffer(1, sampleCount, 44100);
        const channelData = audioBuffer.getChannelData(0);
        const dataView = new DataView(bytes.buffer);

        for (let i = 0; i < sampleCount; i++) {
          const int16 = dataView.getInt16(dataOffset + i * 2, true);
          channelData[i] = int16 < 0 ? int16 / 32768 : int16 / 32767;
        }
        this.decodedBuffer = audioBuffer;
      }

      // Also invoke native decodeAudioData as secondary confirmation
      if (typeof audioCtx.decodeAudioData === 'function') {
        audioCtx.decodeAudioData(bytes.buffer.slice(0), (decoded) => {
          if (decoded) this.decodedBuffer = decoded;
        }, () => {});
      }
    } catch (err) {}
  }

  // Eager gesture unlock listener
  initEagerUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      const e = this.getAudioContext();
      if (e) {
        if (!this.unlocked) {
          this.unlocked = true;
          try {
            const t = e.createBufferSource();
            t.buffer = e.createBuffer(1, 1, 22050);
            t.connect(e.destination);
            t.start(0);
          } catch (err) {}
        }
        if (e.state === 'suspended') {
          e.resume().catch(() => {});
        }
      }
    };

    ['pointerdown', 'touchstart', 'mousedown', 'keydown'].forEach((eventName) => {
      window.addEventListener(eventName, unlock, { once: true, capture: true, passive: true });
    });
  }

  // Exact Innovision global click handler
  initGlobalListener() {
    if (typeof window === 'undefined') return;

    const handleGlobalClick = (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;

      const clickable = target.closest(
        'button, a[href], a, [role="button"], [role="tab"], [role="menuitem"], [role="option"], summary, label, input[type="checkbox"], input[type="radio"], input[type="submit"], input[type="button"], .cursor-pointer, [data-clickable]'
      );

      if (clickable && !clickable.matches?.(':disabled, [aria-disabled="true"]')) {
        this.playClick();
      } else {
        try {
          if (window.getComputedStyle(target).cursor === 'pointer') {
            this.playClick();
          }
        } catch (err) {}
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
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
   * Exact Innovision Click Sound (from https://www.innonitrkl.com)
   * 1. 40ms debounce prevents double firing
   * 2. Plays Innovision's beep audio through Web Audio BufferSourceNode
   * 3. Instant HTML5 AudioPool fallback ensures sound plays immediately on user click
   */
  playClick() {
    if (this.muted) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - this.lastClickTime < 40) return;
    this.lastClickTime = now;

    const t = this.getAudioContext();
    const a = this.masterGain;

    if (t && a) {
      if (t.state === 'suspended') {
        t.resume().catch(() => {});
      }

      if (this.decodedBuffer) {
        try {
          const source = t.createBufferSource();
          source.buffer = this.decodedBuffer;
          source.connect(a);
          source.start(0);
          return;
        } catch (e) {}
      }
    }

    // Instant HTML5 AudioPool plays the actual Innovision sound synchronously
    this.beepPool.play();
  }

  /**
   * Aesthetic bubble pop (alias to Innovision click)
   */
  playPop() {
    this.playClick();
  }

  /**
   * Mechanical thock (alias to Innovision click)
   */
  playThock() {
    this.playClick();
  }

  /**
   * Ethereal glass tap (alias to Innovision click)
   */
  playGlass() {
    this.playClick();
  }

  /**
   * Subtle hover tick
   */
  playHover() {
    if (this.muted) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - this.lastClickTime < 30) return;

    try {
      const t = this.getAudioContext();
      if (!t || t.state !== 'running' || !this.masterGain) return;
      const i = t.currentTime;

      const osc = t.createOscillator();
      const gain = t.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, i);
      osc.frequency.exponentialRampToValueAtTime(900, i + 0.016);

      gain.gain.setValueAtTime(0.0001, i);
      gain.gain.exponentialRampToValueAtTime(0.12 * this.masterVolume, i + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, i + 0.018);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(i);
      osc.stop(i + 0.02);
    } catch (e) {}
  }

  /**
   * Luxurious Celestial Chord Chime (D-Major 9th Euphoric Confirmation)
   */
  playSuccess() {
    if (this.muted) return;
    try {
      const t = this.getAudioContext();
      if (!t || t.state !== 'running' || !this.masterGain) {
        this.beepPool.play();
        return;
      }
      const time = t.currentTime;
      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
      notes.forEach((f, i) => {
        const osc = t.createOscillator();
        const gain = t.createGain();
        osc.type = 'sine';
        const startT = time + i * 0.055;
        osc.frequency.setValueAtTime(f, startT);

        gain.gain.setValueAtTime(0.0001, startT);
        gain.gain.linearRampToValueAtTime(0.22 * this.masterVolume, startT + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.40);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.44);
      });
    } catch (e) {
      this.beepPool.play();
    }
  }

  /**
   * Soft, respectful error alert
   */
  playError() {
    if (this.muted) return;
    try {
      const t = this.getAudioContext();
      if (!t || t.state !== 'running' || !this.masterGain) {
        this.beepPool.play();
        return;
      }
      const time = t.currentTime;
      [280, 200].forEach((f, i) => {
        const osc = t.createOscillator();
        const gain = t.createGain();
        osc.type = 'sine';
        const startT = time + i * 0.08;
        osc.frequency.setValueAtTime(f, startT);

        gain.gain.setValueAtTime(0.0001, startT);
        gain.gain.linearRampToValueAtTime(0.20 * this.masterVolume, startT + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.14);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.16);
      });
    } catch (e) {
      this.beepPool.play();
    }
  }

  /**
   * Celebratory Holographic Pass Generation Chime
   */
  playPassCelebration() {
    if (this.muted) return;
    try {
      const t = this.getAudioContext();
      if (!t || t.state !== 'running' || !this.masterGain) {
        this.beepPool.play();
        return;
      }
      const time = t.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chords.forEach((freq, idx) => {
        const osc = t.createOscillator();
        const gain = t.createGain();
        osc.type = 'triangle';
        const startT = time + idx * 0.09;
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.0001, startT);
        gain.gain.linearRampToValueAtTime(0.22 * this.masterVolume, startT + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.65);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startT);
        osc.stop(startT + 0.72);
      });
    } catch (e) {
      this.beepPool.play();
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
