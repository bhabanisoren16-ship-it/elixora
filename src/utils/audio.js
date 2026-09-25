// Web Audio API ambient synth & sound effects
class SoundController {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.gainNode = null;
    this.oscillators = [];
    this.filter = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleAmbient() {
    this.init();
    if (this.isPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  startAmbient() {
    if (this.isPlaying) return;
    this.init();

    // Master ambient gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 3);

    // Low pass filter for ethereal warm party ambiance
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // Chord frequencies (Atmospheric E minor / Cyber Nexus: E2, B2, G3, D4)
    const freqs = [82.41, 123.47, 196.00, 293.66];
    
    this.oscillators = freqs.map((f, i) => {
      const osc = this.ctx.createOscillator();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      
      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      // Subtle detune for lush chorus effect
      osc.detune.setValueAtTime((i - 1.5) * 8, this.ctx.currentTime);

      if (panner) {
        panner.pan.value = (i / freqs.length) * 1.6 - 0.8;
        osc.connect(panner);
        panner.connect(this.filter);
      } else {
        osc.connect(this.filter);
      }

      osc.start();
      return osc;
    });

    this.filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    this.isPlaying = true;
  }

  stopAmbient() {
    if (!this.isPlaying || !this.gainNode) return;
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      this.isPlaying = false;
    }, 1300);
  }

  // Sci-fi click sound effect
  playClick() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {
      // Audio autoplay policy fallback
    }
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
      [300, 200].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t + i * 0.1);
        gain.gain.setValueAtTime(0.08, t + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.1);
        osc.stop(t + i * 0.1 + 0.16);
      });
    } catch (e) {}
  }

  // Celebratory Holographic Pass Generation Chime
  playPassCelebration() {
    try {
      this.init();
      const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Bright Victory Arpeggio)
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.12 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.12);
        osc.stop(this.ctx.currentTime + idx * 0.12 + 0.8);
      });
    } catch (e) {}
  }

  // Realistic Electric Zap & Rolling Thunder Rumble FX
  playLightningThunder() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Initial High-Frequency Electric Zap / Snap
      const zapOsc = this.ctx.createOscillator();
      const zapGain = this.ctx.createGain();
      const zapFilter = this.ctx.createBiquadFilter();

      zapOsc.type = 'sawtooth';
      zapOsc.frequency.setValueAtTime(1600, t);
      zapOsc.frequency.exponentialRampToValueAtTime(70, t + 0.14);

      zapFilter.type = 'bandpass';
      zapFilter.frequency.setValueAtTime(2000, t);
      zapFilter.Q.value = 3.5;

      zapGain.gain.setValueAtTime(0.35, t);
      zapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      zapOsc.connect(zapFilter);
      zapFilter.connect(zapGain);
      zapGain.connect(this.ctx.destination);

      zapOsc.start(t);
      zapOsc.stop(t + 0.18);

      // 2. White/Pink Noise Crackle Burst
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1100, t);
      noiseFilter.frequency.exponentialRampToValueAtTime(220, t + 0.4);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseSource.start(t);
      noiseSource.stop(t + 0.45);

      // 3. Deep Sub-Bass Rolling Thunder Rumble (35-85Hz)
      const rumbleOsc1 = this.ctx.createOscillator();
      const rumbleOsc2 = this.ctx.createOscillator();
      const rumbleGain = this.ctx.createGain();
      const rumbleFilter = this.ctx.createBiquadFilter();

      rumbleOsc1.type = 'triangle';
      rumbleOsc1.frequency.setValueAtTime(75, t + 0.04);
      rumbleOsc1.frequency.linearRampToValueAtTime(35, t + 1.8);

      rumbleOsc2.type = 'sawtooth';
      rumbleOsc2.frequency.setValueAtTime(58, t + 0.04);
      rumbleOsc2.frequency.linearRampToValueAtTime(28, t + 2.0);

      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(160, t);
      rumbleFilter.frequency.linearRampToValueAtTime(60, t + 2.0);

      rumbleGain.gain.setValueAtTime(0.001, t);
      rumbleGain.gain.linearRampToValueAtTime(0.42, t + 0.08);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, t + 2.3);

      rumbleOsc1.connect(rumbleFilter);
      rumbleOsc2.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(this.ctx.destination);

      rumbleOsc1.start(t + 0.04);
      rumbleOsc2.start(t + 0.04);
      rumbleOsc1.stop(t + 2.4);
      rumbleOsc2.stop(t + 2.4);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // DJ Turntable Vinyl Scratch & Fresh Beat Drop Sound FX
  playVinylScratch() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Vinyl pitch scratch curve (forward & back needle sweep)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.linearRampToValueAtTime(1400, t + 0.06);
      osc.frequency.linearRampToValueAtTime(320, t + 0.12);
      osc.frequency.linearRampToValueAtTime(880, t + 0.18);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t);
      filter.Q.value = 4.0;

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.23);

      // 2. Punchy 808 Sub-Bass Kick Thump
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();

      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(160, t + 0.16);
      kickOsc.frequency.exponentialRampToValueAtTime(42, t + 0.55);

      kickGain.gain.setValueAtTime(0.38, t + 0.16);
      kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      kickOsc.connect(kickGain);
      kickGain.connect(this.ctx.destination);

      kickOsc.start(t + 0.16);
      kickOsc.stop(t + 0.62);
    } catch (e) {}
  }
}

export const soundController = new SoundController();
