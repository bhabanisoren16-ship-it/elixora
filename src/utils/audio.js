// Audio is completely disabled per user request
class SoundController {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
  }

  init() {}
  toggleAmbient() { return false; }
  startAmbient() {}
  stopAmbient() {}
  playClick() {}
  playSuccess() {}
  playError() {}
  playLaserSweep() {}
  playGlitch() {}
  playPassCelebration() {}
  playLightningThunder() {}
}

export const soundController = new SoundController();
