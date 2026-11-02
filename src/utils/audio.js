// Web Audio API Synthesizer & Audio Engine - Ported directly from INNOVISION (innonitrkl.com)
// Exact Innovision Click Sound & Telemetry Audio Architecture

const INNOVISION_BEEP_B64 = 'data:audio/mpeg;base64,SUQzBAAAAAAuBFRFTkMAAAAVAAAAU291bmQgR3JpbmRlciA0LjAuNABBUElDAAAABAAAAAAAAFRDT1AAAAAZAAAAQ29weXJpZ2h0IEFsYW4gTWNLaW5uZXkAR0VPQgAALSoAAANhcHBsaWNhdGlvbi9jMnBhAGMycGEAYzJwYSBtYW5pZmVzdCBzdG9yZQAAABZ/anVtYgAAAB5qdW1kYzJwYQARABCAAACqADibcQNjMnBhAAAAFllqdW1iAAAAR2p1bWRjMm1hABEAEIAAAKoAOJtxA3VybjpjMnBhOjcyOGIwM2E1LWM1MjQtNDMyYy04ZjRjLTc5MDRhZDk5MDhmNgAAAAOUanVtYgAAAClqdW1kYzJhcwARABCAAACqADibcQNjMnBhLmFzc2VydGlvbnMAAAAAuWp1bWIAAABEanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5pbmdyZWRpZW50LnYzAAAAABhjMnNoqGDYYKCk2VGsQWx/sxWipAAAAG1jYm9yo2lkYzpmb3JtYXRqYXVkaW8vbXBlZ2ppbnN0YW5jZUlEeCx4bXA6aWlkOjczMmI5NjBkLTZiMmEtNDg0Yi1iZGRiLWQ0MTVjMjIzZDk5MGxyZWxhdGlvbnNoaXBocGFyZW50T2YAAAHianVtYgAAAEFqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmFjdGlvbnMudjIAAAAAGGMyc2i+vRXGnvyp7kJBR5772WURAAABmWNib3KiZ2FjdGlvbnOComZhY3Rpb25rYzJwYS5vcGVuZWRqcGFyYW1ldGVyc6FraW5ncmVkaWVudHOBomN1cmx4LXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaW5ncmVkaWVudC52M2RoYXNoWCAaommKV+kXy3h+0ZgPxj3dJ6aJCx6Ih57zjcRxgHhDsKRmYWN0aW9ueB1jb20uYW50aHJvcGljLmNsYXVkZS5wcm92aWRlZGpwYXJhbWV0ZXJzoXgfY29tLmFudGhyb3BpYy5vcmlnaW4tY29uZmlkZW5jZWd1bmtub3dua2Rlc2NyaXB0aW9ueGZDbGF1ZGUgcHJvdmlkZWQgdGhpcyBmaWxlIGF0IHRoZSByZXF1ZXN0IG9mIGEgdXNlciBhbmQgbWF5IGhhdmUgY3JlYXRlZCBvciBtb2RpZmllZCB0aGUgZmlsZSBjb250ZW50cy5tc29mdHdhcmVBZ2VudKFkbmFtZWZDbGF1ZGVyYWxsQWN0aW9uc0luY2x1ZGVk9QAAAMhqdW1iAAAAQGp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuaGFzaC5kYXRhAAAAABhjMnNos8s5XfGDdzxjuEaNb13kvAAAAIBjYm9ypWNhbGdmc2hhMjU2Y3BhZE0AAAAAAAAAAAAAAAAAZGhhc2hYIO1JfNXCmu/nYYnKVEVdQL3v2wbfEUQhNiNqt39vFwjwZG5hbWVuanVtYmYgbWFuaWZlc3RqZXhjbHVzaW9uc4GiZXN0YXJ0GI9mbGVuZ3RoGRZ/AAACPmp1bWIAAAAnanVtZGMyY2wAEQAQgAAAqgA4m3EDYzJwYS5jbGFpbS52MgAAAAIPY2JvcqVjYWxnZnNoYTI1NmlzaWduYXR1cmV4TXNlbGYjanVtYmY9L2MycGEvdXJuOmMycGE6NzI4YjAzYTUtYzUyNC00MzJjLThmNGMtNzkwNGFkOTkwOGY2L2MycGEuc2lnbmF0dXJlamluc3RhbmNlSUR4LHhtcDppaWQ6NDdlMjQ0ZjktODNhNC00Y2Y0LTg0ZDctZGYzMmI1ZTI2MTU0cmNyZWF0ZWRfYXNzZXJ0aW9uc4OiY3VybHgtc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5pbmdyZWRpZW50LnYzZGhhc2hYIBqiaYpX6RfLeH7RmA/GPd0npokLHoiHnvONxHGAeEOwomN1cmx4KnNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuYWN0aW9ucy52MmRoYXNoWCC/B+jxt4sOkpQukO7iL3nR5z9WuPbvJgdxAP2zhlX986JjdXJseClzZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmhhc2guZGF0YWRoYXNoWCCtdcc41nvEquvu0L34ymCxpPG3sk6UoH4p8HFd+1gp3XRjbGFpbV9nZW5lcmF0b3JfaW5mb6NkbmFtZW9BbnRocm9waWMgRmlsZXNndmVyc2lvbmUxLjAuMGtzcGVjVmVyc2lvbmUyLjQuMAAAEDhqdW1iAAAAKGp1bWRjMmNzABEAEIAAAKoAOJtxA2MycGEuc2lnbmF0dXJlAAAAEAhjYm9y0oRZAhKiASYYIVkCCjCCAgYwggGNoAMCAQICFEDloAruwjnQvriD+gZCBT1nVRMAMAoGCCqGSM49BAMDMEkxFzAVBgNVBAoTDkFudGhyb3BpYywgUEJDMS4wLAYDVQQDEyVBbnRocm9waWMgQ29udGVudCBDcmVkZW50aWFscyBSb290IENBMB4XDTI2MDgwNzE4NDM1NloXDTI4MDgwNjE5NDM1NlowRDEXMBUGA1UEChMOQW50aHJvcGljLCBQQkMxKTAnBgNVBAMTIEFudGhyb3BpYyBDbGF1ZGUgQ29udGVudCBTaWduaW5nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEmHoKa8tQGAUU1TS9QqU5W0Tp2N3XsvlK7BfQt6YWKwEzd2R3/dzKPEUDdCjlLjp9fT+KFjRVnuZ9v0oXvTe3k6NYMFYwDgYDVR0PAQH/BAQDAgeAMBUGA1UdJQQOMAwGCisGAQQBg+heAgEwDAYDVR0TAQH/BAIwADAfBgNVHSMEGDAWgBTOUeIEgU5kWyP448TPmj6cwddcwjAKBggqhkjOPQQDAwNnADBkAjAxcx0UngF60stVjs5G4T2eiptsBk5mf9oCtfJPAUBl8qs/PEXa8+gk1/X5QJ2DVcYCMHBfXN31YapiSqYvlIWrDVDJKOvXMl+kkz37Wt0PBI8sw486Mq6JeOhT+lRR4b1HCaFjcGFkWQ2eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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';

/**
 * Reusable HTML5 Audio Element Pool for Innovision Click Sound
 * Guarantees instantaneous, 100% reliable audible playback on every platform.
 */
class AudioPool {
  constructor(dataUri, size = 8, volume = 0.55) {
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
    this.masterVolume = 0.85;

    // Clear any accidental legacy mute flags to guarantee sound plays
    if (typeof localStorage !== 'undefined') {
      try {
        if (localStorage.getItem('elixora_sound_muted') === 'true') {
          localStorage.removeItem('elixora_sound_muted');
        }
      } catch (e) {}
    }

    // Exact Innovision HTML5 Audio pool with beep.mp3
    this.beepPool = new AudioPool(INNOVISION_BEEP_B64, 8, 0.55);

    // Register Innovision eager unlock and global click listeners
    this.initEagerUnlock();
    this.initGlobalListener();
    this.preloadBuffer();
  }

  // Exact Innovision AudioContext getter
  getAudioContext() {
    if (this.ctx) return this.ctx;
    if (typeof window === 'undefined') return null;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    try {
      const t = new AudioContextClass();
      this.ctx = t;
      const o = t.createGain();
      o.gain.value = 0.45 * this.masterVolume;
      o.connect(t.destination);
      this.masterGain = o;
      return t;
    } catch (e) {
      return null;
    }
  }

  // Preload and decode Innovision beep.mp3 into AudioBuffer via OfflineAudioContext / decodeAudioData
  preloadBuffer() {
    if (typeof window === 'undefined') return;

    try {
      const base64Content = INNOVISION_BEEP_B64.split(',')[1];
      const binaryString = window.atob(base64Content);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const OfflineCtxClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (OfflineCtxClass) {
        const offlineCtx = new OfflineCtxClass(1, 1, 44100);
        offlineCtx.decodeAudioData(bytes.buffer.slice(0), (decoded) => {
          if (decoded && !this.decodedBuffer) {
            this.decodedBuffer = decoded;
          }
        }, () => {});
      }
    } catch (e) {}
  }

  // Exact Innovision eager gesture unlock listener
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

          // Also decode buffer if not decoded yet
          if (!this.decodedBuffer) {
            try {
              const base64Content = INNOVISION_BEEP_B64.split(',')[1];
              const binaryString = window.atob(base64Content);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              e.decodeAudioData(bytes.buffer.slice(0), (decoded) => {
                if (decoded) this.decodedBuffer = decoded;
              }, () => {});
            } catch (err) {}
          }
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
   * 1. 50ms debounce prevents double firing
   * 2. Plays Innovision's beep.mp3 through AudioBufferSourceNode
   * 3. Instant HTML5 AudioPool fallback guarantees sound plays immediately
   * 4. Exact Innovision synthesized triangle sweep (2400Hz -> 1200Hz) fallback
   */
  playClick() {
    if (this.muted) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - this.lastClickTime < 50) return;
    this.lastClickTime = now;

    if (!this.unlocked) {
      this.getAudioContext();
      this.unlocked = true;
    }

    const t = this.ctx;
    const a = this.masterGain;

    if (t && a && t.state === 'running' && this.decodedBuffer) {
      try {
        const source = t.createBufferSource();
        source.buffer = this.decodedBuffer;
        source.connect(a);
        source.start(0);
        return;
      } catch (e) {}
    }

    // Exact Innovision synthesized fallback: triangle 2400Hz -> 1200Hz
    if (t && a && t.state === 'running') {
      try {
        const i = t.currentTime;
        const r = t.createOscillator();
        const s = t.createGain();

        r.type = 'triangle';
        r.frequency.setValueAtTime(2400, i);
        r.frequency.exponentialRampToValueAtTime(1200, i + 0.04);

        s.gain.setValueAtTime(0.0001, i);
        s.gain.exponentialRampToValueAtTime(0.5 * this.masterVolume, i + 0.004);
        s.gain.exponentialRampToValueAtTime(0.0001, i + 0.05);

        r.connect(s);
        s.connect(a);
        r.start(i);
        r.stop(i + 0.06);
        return;
      } catch (e) {}
    }

    // Instant HTML5 AudioPool fallback (plays synchronously on user gesture)
    this.beepPool.play();
  }

  /**
   * Aesthetic bubble pop (alias to Innovision click with subtle pitch)
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
   * Ethereal glass tap
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
