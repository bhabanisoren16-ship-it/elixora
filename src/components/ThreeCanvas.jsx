import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { soundController } from '../utils/audio';
import { Disc3, Music2, Plane, Sparkles, Zap, Radio, Volume2 } from 'lucide-react';

export default function ThreeCanvas() {
  const mountRef = useRef(null);
  const [viewMode, setViewMode] = useState('festival'); // 'festival' | 'dj' | 'sky'
  const [isScratching, setIsScratching] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isAutoLightning, setIsAutoLightning] = useState(true);
  const [isStriking, setIsStriking] = useState(false);

  const viewModeRef = useRef('festival');
  const triggerScratchRef = useRef(null);
  const triggerLightningRef = useRef(null);
  const isAutoLightningRef = useRef(true);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    isAutoLightningRef.current = isAutoLightning;
  }, [isAutoLightning]);

  const handleViewChange = useCallback((mode) => {
    setViewMode(mode);
    soundController.playClick();
  }, []);

  const handleScratch = useCallback(() => {
    if (triggerScratchRef.current) {
      triggerScratchRef.current();
    }
  }, []);

  const handleManualLightning = useCallback(() => {
    if (triggerLightningRef.current) {
      triggerLightningRef.current();
      setIsStriking(true);
      setTimeout(() => setIsStriking(false), 400);
    }
  }, []);

  const toggleAutoLightning = useCallback(() => {
    setIsAutoLightning((prev) => !prev);
    soundController.playClick();
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060814, 0.008);

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Master World Group for Parallax
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Group for dynamic procedural lightning bolts & sparks
    const lightningGroup = new THREE.Group();
    worldGroup.add(lightningGroup);

    // =============================================================
    // 2. TEXTURED MUSIC FESTIVAL BACKDROP & LIGHTNING FLASH QUAD
    // =============================================================
    const textureLoader = new THREE.TextureLoader();
    let bgMesh = null;
    let bgGeo = null;
    let bgMat = null;
    let flashMesh = null;
    let flashGeo = null;
    let flashMat = null;

    textureLoader.load('/music-fest-bg.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      const imgAspect = texture.image.width / texture.image.height;
      const dist = 25;
      const vFov = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFov / 2) * dist;
      const visibleWidth = visibleHeight * (width / height);

      let planeW = visibleWidth * 1.15;
      let planeH = planeW / imgAspect;
      if (planeH < visibleHeight * 1.15) {
        planeH = visibleHeight * 1.15;
        planeW = planeH * imgAspect;
      }

      bgGeo = new THREE.PlaneGeometry(planeW, planeH, 16, 16);
      bgMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.98,
      });

      bgMesh = new THREE.Mesh(bgGeo, bgMat);
      bgMesh.position.set(0, 0.5, -10);
      worldGroup.add(bgMesh);

      // Atmospheric Strobe / Lightning Flash Plane over the Festival Arena
      flashGeo = new THREE.PlaneGeometry(planeW * 1.05, planeH * 1.05);
      flashMat = new THREE.MeshBasicMaterial({
        color: 0x93c5fd, // Electric ice-blue
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      flashMesh = new THREE.Mesh(flashGeo, flashMat);
      flashMesh.position.set(0, 0.5, -9.92);
      worldGroup.add(flashMesh);
    });

    // Particle Texture Generator
    const createSparkTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(147, 197, 253, 0.9)');
      grad.addColorStop(0.65, 'rgba(56, 189, 248, 0.35)');
      grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };
    const sparkTexture = createSparkTexture();

    // =============================================================
    // 3. 3D INTERACTIVE VINYL TURNTABLE (DJ DECK)
    // =============================================================
    const djDeckGroup = new THREE.Group();
    djDeckGroup.position.set(0.1, -4.6, 5.2);
    djDeckGroup.rotation.x = -Math.PI / 4.4;
    worldGroup.add(djDeckGroup);

    // Turntable Plinth (Chassis)
    const plinthGeo = new THREE.BoxGeometry(4.6, 0.45, 3.8);
    const plinthMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.8,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    djDeckGroup.add(plinthMesh);

    // Neon Cyan Faceplate Trim
    const trimGeo = new THREE.BoxGeometry(4.7, 0.1, 3.9);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.35,
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.y = 0.24;
    djDeckGroup.add(trimMesh);

    // Platter Rim (Aluminum)
    const platterGeo = new THREE.CylinderGeometry(1.65, 1.68, 0.18, 48);
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.95,
      roughness: 0.15,
    });
    const platterMesh = new THREE.Mesh(platterGeo, platterMat);
    platterMesh.position.set(-0.6, 0.32, 0.1);
    djDeckGroup.add(platterMesh);

    // Procedural Vinyl Texture with Grooves & Festival Hologram Center Label
    const createVinylTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');

      // Dark vinyl base
      ctx.fillStyle = '#080a10';
      ctx.fillRect(0, 0, 512, 512);

      // Microgroove concentric rings
      for (let r = 70; r < 250; r += 2.5) {
        ctx.beginPath();
        ctx.arc(256, 256, r, 0, Math.PI * 2);
        ctx.strokeStyle = (r % 6 === 0) ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Center Label
      ctx.beginPath();
      ctx.arc(256, 256, 68, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Label text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ELIXORA 2.0', 256, 238);
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('⚡ LIVE FESTIVAL ⚡', 256, 256);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '9px monospace';
      ctx.fillText('33⅓ RPM • STEREO', 256, 274);

      // Spindle Hole
      ctx.beginPath();
      ctx.arc(256, 256, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      return new THREE.CanvasTexture(c);
    };
    const vinylTexture = createVinylTexture();

    // The Spinning Vinyl Record Mesh
    const recordGroup = new THREE.Group();
    recordGroup.position.set(-0.6, 0.42, 0.1);
    djDeckGroup.add(recordGroup);

    const recordGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.05, 48);
    const recordMat = new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      map: vinylTexture,
      roughness: 0.15,
      metalness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.95,
    });
    const recordMesh = new THREE.Mesh(recordGeo, recordMat);
    recordGroup.add(recordMesh);

    // Center Spindle Pin
    const spindleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 16);
    const spindleMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.95,
      roughness: 0.1,
    });
    const spindleMesh = new THREE.Mesh(spindleGeo, spindleMat);
    spindleMesh.position.set(-0.6, 0.55, 0.1);
    djDeckGroup.add(spindleMesh);

    // Tone Arm Assembly
    const armPivotGroup = new THREE.Group();
    armPivotGroup.position.set(1.4, 0.38, -0.9);
    djDeckGroup.add(armPivotGroup);

    const armBaseGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.4, 16);
    const armBaseMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    const armBase = new THREE.Mesh(armBaseGeo, armBaseMat);
    armPivotGroup.add(armBase);

    const armTubeGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.2, 12);
    armTubeGeo.rotateZ(Math.PI / 2);
    armTubeGeo.translate(-1.1, 0.25, 0.4);
    const armTube = new THREE.Mesh(armTubeGeo, armBaseMat);
    armPivotGroup.add(armTube);
    armPivotGroup.rotation.y = -Math.PI / 8;

    // Mixer Knobs & Faders
    for (let k = 0; k < 3; k++) {
      const knobGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.16, 16);
      const knobMat = new THREE.MeshStandardMaterial({
        color: k === 1 ? 0x00f2fe : 0xa855f7,
        metalness: 0.8,
        emissive: k === 1 ? 0x00f2fe : 0xa855f7,
        emissiveIntensity: 0.2,
      });
      const knob = new THREE.Mesh(knobGeo, knobMat);
      knob.position.set(1.2 + (k % 2) * 0.45, 0.32, 0.4 + Math.floor(k / 2) * 0.5);
      djDeckGroup.add(knob);
    }

    // Soundwave Bass Pulse Rings (Emanating from turntable)
    const pulseRingGeo = new THREE.RingGeometry(1.65, 1.75, 48);
    pulseRingGeo.rotateX(-Math.PI / 2);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRing.position.set(-0.6, 0.45, 0.1);
    djDeckGroup.add(pulseRing);

    let pulseScale = 1;
    let pulseActive = false;

    // Scratch Web Audio Synthesizer
    const playScratchFX = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        const startFreq = 220 + Math.random() * 450;
        const endFreq = 90 + Math.random() * 180;
        osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.14);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.value = 3;

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } catch (e) {}
    };

    let scratchVelocity = 0;
    const triggerScratch = () => {
      scratchVelocity = (Math.random() > 0.5 ? 1 : -1) * 0.45;
      pulseActive = true;
      pulseScale = 1.0;
      setIsScratching(true);
      playScratchFX();
      setTimeout(() => setIsScratching(false), 300);
    };
    triggerScratchRef.current = triggerScratch;

    // =============================================================
    // 4. 3D FLYING AIRPLANE WITH FESTIVAL NEON BANNER
    // =============================================================
    const planeGroup = new THREE.Group();
    planeGroup.position.set(4.8, 4.2, -1.5);
    worldGroup.add(planeGroup);

    const planeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7, // Cyber blue fuselage
      metalness: 0.6,
      roughness: 0.25,
      clearcoat: 0.9,
    });
    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.5,
      roughness: 0.25,
      clearcoat: 0.9,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.15,
    });

    const fuselageGeo = new THREE.CylinderGeometry(0.22, 0.08, 2.4, 16);
    fuselageGeo.rotateZ(Math.PI / 2);
    const fuselage = new THREE.Mesh(fuselageGeo, planeMat);
    planeGroup.add(fuselage);

    const noseGeo = new THREE.ConeGeometry(0.24, 0.55, 16);
    noseGeo.rotateZ(-Math.PI / 2);
    noseGeo.translate(1.35, 0, 0);
    const nose = new THREE.Mesh(noseGeo, chromeMat);
    planeGroup.add(nose);

    const propGroup = new THREE.Group();
    propGroup.position.set(1.65, 0, 0);
    planeGroup.add(propGroup);

    const propBladeGeo = new THREE.BoxGeometry(0.04, 1.4, 0.1);
    const propBlade = new THREE.Mesh(propBladeGeo, chromeMat);
    propGroup.add(propBlade);

    const upperWingGeo = new THREE.BoxGeometry(0.58, 0.05, 3.2);
    upperWingGeo.translate(0.3, 0.42, 0);
    const upperWing = new THREE.Mesh(upperWingGeo, wingMat);
    planeGroup.add(upperWing);

    const lowerWingGeo = new THREE.BoxGeometry(0.55, 0.05, 2.9);
    lowerWingGeo.translate(0.3, -0.22, 0);
    const lowerWing = new THREE.Mesh(lowerWingGeo, wingMat);
    planeGroup.add(lowerWing);

    for (let s of [-1.1, 1.1]) {
      const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8);
      const strut = new THREE.Mesh(strutGeo, chromeMat);
      strut.position.set(0.3, 0.1, s);
      planeGroup.add(strut);
    }

    const rudderGeo = new THREE.BoxGeometry(0.45, 0.65, 0.05);
    rudderGeo.translate(-1.1, 0.35, 0);
    const rudder = new THREE.Mesh(rudderGeo, planeMat);
    planeGroup.add(rudder);

    const stabilizerGeo = new THREE.BoxGeometry(0.35, 0.04, 1.2);
    stabilizerGeo.translate(-1.05, 0.05, 0);
    const stabilizer = new THREE.Mesh(stabilizerGeo, wingMat);
    planeGroup.add(stabilizer);

    // Glowing Festival Banner
    const createBannerTexture = () => {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 160;
      const ctx = c.getContext('2d');

      // Night dark banner with neon cyan borders
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, 1024, 160);

      // Neon cyan border glow
      ctx.fillStyle = '#00f2fe';
      ctx.fillRect(0, 0, 1024, 8);
      ctx.fillRect(0, 152, 1024, 8);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡  ELIXORA 2.0  •  LIVE FESTIVAL NIGHT  ⚡', 512, 98);

      return new THREE.CanvasTexture(c);
    };
    const bannerTexture = createBannerTexture();

    const bannerW = 6.2;
    const bannerH = 1.0;
    const bannerCols = 42;
    const bannerGeo = new THREE.PlaneGeometry(bannerW, bannerH, bannerCols, 1);
    bannerGeo.translate(-bannerW / 2 - 1.4, 0, 0);

    const bannerMat = new THREE.MeshBasicMaterial({
      map: bannerTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    });
    const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
    planeGroup.add(bannerMesh);

    const ropeMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 });
    const ropeGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.2, 0, 0),
      new THREE.Vector3(-1.4, 0.45, 0),
      new THREE.Vector3(-1.2, 0, 0),
      new THREE.Vector3(-1.4, -0.45, 0),
    ]);
    const ropeLines = new THREE.LineSegments(ropeGeo, ropeMat);
    planeGroup.add(ropeLines);

    // =============================================================
    // 5. FESTIVAL MOVING HEAD LASERS, STROBE & CONFETTI
    // =============================================================
    const laserGroup = new THREE.Group();
    laserGroup.position.set(0, -2, -6);
    worldGroup.add(laserGroup);
    const laserColors = [0x00f2fe, 0xf43f5e, 0x38bdf8, 0xa855f7, 0xfbbf24];
    const laserMeshes = [];

    for (let i = 0; i < 6; i++) {
      const lGeo = new THREE.CylinderGeometry(0.04, 0.16, 40, 8);
      lGeo.translate(0, 20, 0);
      const lMat = new THREE.MeshBasicMaterial({
        color: laserColors[i % laserColors.length],
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const laser = new THREE.Mesh(lGeo, lMat);
      laser.position.set((i - 2.5) * 3.8, 0, 0);
      laser.rotation.z = (i - 2.5) * 0.2;
      laserGroup.add(laser);
      laserMeshes.push(laser);
    }

    // Drifting Glowing Sparks & Festival Confetti
    const confettiCount = 450;
    const confettiGeo = new THREE.BufferGeometry();
    const confettiPos = new Float32Array(confettiCount * 3);
    const confettiColors = new Float32Array(confettiCount * 3);
    const confettiSpeeds = new Float32Array(confettiCount);

    const confettiPalette = [
      new THREE.Color(0x00f2fe), // Electric Cyan
      new THREE.Color(0x38bdf8), // Sky Blue
      new THREE.Color(0xa855f7), // Violet
      new THREE.Color(0xfbbf24), // Gold
      new THREE.Color(0xffffff), // Pure White
    ];

    for (let i = 0; i < confettiCount; i++) {
      confettiPos[i * 3] = (Math.random() - 0.5) * 32;
      confettiPos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      confettiPos[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const c = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];
      confettiColors[i * 3] = c.r;
      confettiColors[i * 3 + 1] = c.g;
      confettiColors[i * 3 + 2] = c.b;

      confettiSpeeds[i] = 0.5 + Math.random() * 0.9;
    }

    confettiGeo.setAttribute('position', new THREE.BufferAttribute(confettiPos, 3));
    confettiGeo.setAttribute('color', new THREE.BufferAttribute(confettiColors, 3));

    const confettiMat = new THREE.PointsMaterial({
      size: 0.5,
      map: sparkTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const confettiPoints = new THREE.Points(confettiGeo, confettiMat);
    worldGroup.add(confettiPoints);

    // =============================================================
    // 6. PROCEDURAL 3D LIGHTNING SYSTEM WITH MULTI-STROKE DISCHARGE
    // =============================================================
    // Ambient Lightning Flash Light
    const lightningFlashLight = new THREE.PointLight(0xa5f3fc, 0, 90, 1.4);
    lightningFlashLight.position.set(0, 6, 2);
    scene.add(lightningFlashLight);

    // Recursive Midpoint Displacement Algorithm for Branching Bolts
    function generateLightningBranches(start, end, maxLevels = 5, branchProb = 0.36) {
      const segments = [];

      function subdivide(p1, p2, level, roughness) {
        if (level >= maxLevels) {
          segments.push([p1, p2]);
          return;
        }

        const dir = new THREE.Vector3().subVectors(p2, p1);
        const length = dir.length();
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        // Orthogonal displacement
        const up = new THREE.Vector3(0, 1, 0);
        let perp = new THREE.Vector3().crossVectors(dir, up).normalize();
        if (perp.lengthSq() < 0.001) {
          perp = new THREE.Vector3(1, 0, 0);
        }
        const perp2 = new THREE.Vector3().crossVectors(dir, perp).normalize();

        const angle = Math.random() * Math.PI * 2;
        const dispScale = length * roughness * (Math.random() - 0.5);
        const displacement = new THREE.Vector3()
          .addScaledVector(perp, Math.cos(angle) * dispScale)
          .addScaledVector(perp2, Math.sin(angle) * dispScale);

        mid.add(displacement);

        // Fork sub-branches
        if (level >= 1 && level < maxLevels - 1 && Math.random() < branchProb && segments.length < 180) {
          const branchDir = dir.clone().multiplyScalar(0.55);
          branchDir.applyAxisAngle(perp, (Math.random() - 0.5) * 0.9);
          branchDir.applyAxisAngle(perp2, (Math.random() - 0.5) * 0.9);
          const branchEnd = mid.clone().add(branchDir);
          subdivide(mid.clone(), branchEnd, level + 1, roughness * 0.75);
        }

        subdivide(p1, mid, level + 1, roughness * 0.72);
        subdivide(mid, p2, level + 1, roughness * 0.72);
      }

      subdivide(start, end, 0, 0.42);
      return segments;
    }

    // Active Strikes Tracker
    let activeStrikes = [];

    // Impact Sparks Pool
    const MAX_IMPACT_SPARKS = 80;
    const impactSparksGeo = new THREE.BufferGeometry();
    const impactSparksPos = new Float32Array(MAX_IMPACT_SPARKS * 3);
    const impactSparksVelo = [];
    let impactSparksLife = 0;

    for (let s = 0; s < MAX_IMPACT_SPARKS; s++) {
      impactSparksPos[s * 3] = 0;
      impactSparksPos[s * 3 + 1] = -100;
      impactSparksPos[s * 3 + 2] = 0;
      impactSparksVelo.push(new THREE.Vector3());
    }
    impactSparksGeo.setAttribute('position', new THREE.BufferAttribute(impactSparksPos, 3));

    const impactSparksMat = new THREE.PointsMaterial({
      size: 0.65,
      map: sparkTexture,
      transparent: true,
      color: 0x93c5fd,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const impactSparksMesh = new THREE.Points(impactSparksGeo, impactSparksMat);
    worldGroup.add(impactSparksMesh);

    function spawnImpactSparks(target) {
      impactSparksLife = 1.0;
      const posArr = impactSparksGeo.attributes.position.array;
      for (let s = 0; s < MAX_IMPACT_SPARKS; s++) {
        posArr[s * 3] = target.x;
        posArr[s * 3 + 1] = target.y;
        posArr[s * 3 + 2] = target.z;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.6;
        const speed = 2.5 + Math.random() * 6.5;

        impactSparksVelo[s].set(
          Math.cos(theta) * Math.sin(phi) * speed,
          Math.cos(phi) * speed * 0.8 + 1.5,
          Math.sin(theta) * Math.sin(phi) * speed
        );
      }
      impactSparksGeo.attributes.position.needsUpdate = true;
    }

    // Main Lightning Strike Trigger Function
    function triggerLightningStrike(targetWorldPos = null) {
      // 1. Determine origin high in stormy clouds
      const startX = (Math.random() - 0.5) * 16;
      const startY = 8.5 + Math.random() * 3.5;
      const startZ = -5.5 + (Math.random() - 0.5) * 3;
      const start = new THREE.Vector3(startX, startY, startZ);

      // 2. Determine target impact point
      let end;
      if (targetWorldPos) {
        end = targetWorldPos.clone();
      } else {
        // Strike towards festival stage truss or arena horizon
        const endX = (Math.random() - 0.5) * 12;
        const endY = -1.2 + Math.random() * 2.8;
        const endZ = -5.5 + (Math.random() - 0.5) * 2;
        end = new THREE.Vector3(endX, endY, endZ);
      }

      // 3. Generate segments
      const segments = generateLightningBranches(start, end, 5, 0.38);

      const positions = [];
      const haloPositions = [];
      for (let i = 0; i < segments.length; i++) {
        const [p1, p2] = segments[i];
        positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);

        // Jitter for outer aura
        const jitter = 0.08;
        haloPositions.push(
          p1.x + (Math.random() - 0.5) * jitter,
          p1.y + (Math.random() - 0.5) * jitter,
          p1.z + (Math.random() - 0.5) * jitter,
          p2.x + (Math.random() - 0.5) * jitter,
          p2.y + (Math.random() - 0.5) * jitter,
          p2.z + (Math.random() - 0.5) * jitter
        );
      }

      // Core Line Segments (Pure blazing white)
      const coreGeo = new THREE.BufferGeometry();
      coreGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const coreMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const coreLine = new THREE.LineSegments(coreGeo, coreMat);

      // Cyan / Ice-Blue Glow Halo
      const haloGeo = new THREE.BufferGeometry();
      haloGeo.setAttribute('position', new THREE.Float32BufferAttribute(haloPositions, 3));
      const haloMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const haloLine = new THREE.LineSegments(haloGeo, haloMat);

      // Violet Electric Corona
      const coronaMat = new THREE.LineBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const coronaLine = new THREE.LineSegments(haloGeo, coronaMat);

      const boltGroup = new THREE.Group();
      boltGroup.add(coronaLine);
      boltGroup.add(haloLine);
      boltGroup.add(coreLine);
      lightningGroup.add(boltGroup);

      // Audio & Impact effects
      soundController.playLightningThunder();
      spawnImpactSparks(end);

      // Position point light along the midpoint of bolt
      const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      lightningFlashLight.position.copy(midPoint);
      lightningFlashLight.position.z += 1.5;

      activeStrikes.push({
        group: boltGroup,
        coreMat,
        haloMat,
        coronaMat,
        geometries: [coreGeo, haloGeo],
        progress: 0,
        duration: 0.38, // 380ms full duration
      });
    }

    triggerLightningRef.current = triggerLightningStrike;

    // =============================================================
    // 7. LIGHTING & PARALLAX TRACKING
    // =============================================================
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const stageLighting = new THREE.DirectionalLight(0x38bdf8, 2.2);
    stageLighting.position.set(-4, 7, 7);
    scene.add(stageLighting);

    const djSpotlight = new THREE.PointLight(0x00f2fe, 5, 25);
    djSpotlight.position.set(0, -3.2, 7.5);
    scene.add(djSpotlight);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Interactive Click on Canvas triggers Precision Lightning Strike
    const handlePointerDown = (e) => {
      if (e.target && e.target.closest('button, a, input, [role="button"], aside, nav, main')) {
        return;
      }
      // Calculate 3D target coordinates from click
      const rect = renderer.domElement.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const clickVector = new THREE.Vector3(ndcX, ndcY, 0.5);
      clickVector.unproject(camera);
      clickVector.sub(camera.position).normalize();
      const dist = (0 - camera.position.z) / clickVector.z;
      const worldClickPos = camera.position.clone().add(clickVector.multiplyScalar(dist));

      triggerLightningStrike(worldClickPos);
    };
    window.addEventListener('pointerdown', handlePointerDown);

    // Audio status check
    const audioInterval = setInterval(() => {
      setIsAudioActive(!!soundController.isPlaying);
    }, 400);

    // Auto-Lightning Timer (Periodic strikes every 4-7 seconds)
    let nextAutoLightningTime = 3.5;

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };
    window.addEventListener('resize', handleResize);

    // =============================================================
    // 8. ANIMATION LOOP
    // =============================================================
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Mouse lerping for 3D parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.055;
      currentMouseY += (targetMouseY - currentMouseY) * 0.055;

      worldGroup.rotation.y = currentMouseX * 0.08;
      worldGroup.rotation.x = currentMouseY * 0.06;

      // Audio 128 BPM electronic tempo pulse
      const bpm = 128;
      const bpmPulse = soundController.isPlaying
        ? Math.pow(Math.sin(elapsedTime * (bpm / 60) * Math.PI * 2), 6) * 1.5
        : Math.sin(elapsedTime * 1.5) * 0.2;

      // Camera view transitions
      const curView = viewModeRef.current;
      if (curView === 'festival' || curView === 'street') {
        camera.position.lerp(new THREE.Vector3(0, 0, 15), 0.06);
        camera.lookAt(0, 0, 0);
      } else if (curView === 'dj') {
        camera.position.lerp(new THREE.Vector3(0.1, -3.2, 9.2), 0.06);
        camera.lookAt(0.1, -4.6, 5.2);
      } else if (curView === 'sky') {
        camera.position.lerp(new THREE.Vector3(1.5, 3.2, 11), 0.05);
        camera.lookAt(2.8, 4.5, -3.5);
      }

      // Vinyl Record rotation & scratch
      const baseSpinSpeed = 3.5;
      scratchVelocity *= 0.88;
      recordGroup.rotation.y += (baseSpinSpeed + scratchVelocity * 25 + bpmPulse * 2.0) * delta;

      // Pulse Ring Expansion from turntable
      if (pulseActive || soundController.isPlaying) {
        pulseScale += delta * 4.5;
        pulseRing.scale.set(pulseScale, pulseScale, 1);
        pulseRingMat.opacity = Math.max(0, 1 - (pulseScale / 3.8));
        if (pulseScale > 3.8) {
          pulseScale = 1;
          if (!soundController.isPlaying) pulseActive = false;
        }
      }

      // Airplane Flight in Sky
      propGroup.rotation.x += 0.85;
      const planeFlightY = Math.sin(elapsedTime * 1.8) * 0.22;
      const planeFlightX = Math.cos(elapsedTime * 0.9) * 0.35;
      const planeBank = Math.sin(elapsedTime * 1.2) * 0.08;

      planeGroup.position.set(4.8 + planeFlightX, 4.2 + planeFlightY, -1.5);
      planeGroup.rotation.z = planeBank - currentMouseX * 0.04;
      planeGroup.rotation.y = -Math.PI / 18 + currentMouseY * 0.03;

      // Banner cloth wave physics
      const bPos = bannerGeo.attributes.position;
      const waveTime = elapsedTime * 9.5;
      for (let i = 0; i < bPos.count; i++) {
        const vx = bPos.getX(i);
        const distFromTail = Math.abs(vx);
        const waveAmp = Math.min(distFromTail * 0.055, 0.32);
        const waveZ = Math.sin(waveTime - distFromTail * 1.4) * waveAmp;
        bPos.setZ(i, waveZ);
      }
      bPos.needsUpdate = true;

      // Festival Moving Head Lasers
      laserMeshes.forEach((laser, idx) => {
        const sweepSpeed = 1.3 + idx * 0.35;
        laser.rotation.z = Math.sin(elapsedTime * sweepSpeed + idx * 1.2) * 0.55 + (idx - 2.5) * 0.22;
        laser.rotation.x = Math.sin(elapsedTime * 0.9 + idx) * 0.18;
      });

      // Drifting Confetti & Golden Sparkles
      const cArr = confettiGeo.attributes.position.array;
      for (let i = 0; i < confettiCount; i++) {
        cArr[i * 3 + 1] -= confettiSpeeds[i] * 1.8 * delta;
        cArr[i * 3] += Math.sin(elapsedTime * 2 + i) * 0.015;

        if (cArr[i * 3 + 1] < -11) {
          cArr[i * 3 + 1] = 11;
          cArr[i * 3] = (Math.random() - 0.5) * 32;
        }
      }
      confettiGeo.attributes.position.needsUpdate = true;

      // Auto-Lightning Scheduler
      if (isAutoLightningRef.current && elapsedTime > nextAutoLightningTime) {
        triggerLightningStrike();
        nextAutoLightningTime = elapsedTime + 4.5 + Math.random() * 4.0;
      }

      // --- DISCHARGE CURVE & STROBE FLICKER ---
      let maxFlashIntensity = 0;
      for (let i = activeStrikes.length - 1; i >= 0; i--) {
        const strike = activeStrikes[i];
        strike.progress += delta / strike.duration;

        let strokeBrightness = 0;
        const p = strike.progress;

        // Realistic multi-stroke discharge flickers
        if (p < 0.12) {
          strokeBrightness = 1.0; // Primary return stroke
        } else if (p < 0.22) {
          strokeBrightness = 0.25; // Inter-stroke pause
        } else if (p < 0.42) {
          strokeBrightness = 0.85; // Secondary return stroke
        } else if (p < 0.55) {
          strokeBrightness = 0.2; // Second dip
        } else if (p < 0.72) {
          strokeBrightness = 0.65; // Tertiary stroke
        } else {
          // Afterglow fade
          strokeBrightness = Math.max(0, (1 - p) / 0.28) * 0.65;
        }

        strike.coreMat.opacity = strokeBrightness;
        strike.haloMat.opacity = strokeBrightness * 0.85;
        strike.coronaMat.opacity = strokeBrightness * 0.6;

        if (strokeBrightness > maxFlashIntensity) {
          maxFlashIntensity = strokeBrightness;
        }

        if (p >= 1.0) {
          lightningGroup.remove(strike.group);
          strike.geometries.forEach((g) => g.dispose());
          strike.coreMat.dispose();
          strike.haloMat.dispose();
          strike.coronaMat.dispose();
          activeStrikes.splice(i, 1);
        }
      }

      // Update atmospheric lightning strobe light
      lightningFlashLight.intensity = maxFlashIntensity * 26;

      // Update festival backdrop strobe plane
      if (flashMat) {
        flashMat.opacity = maxFlashIntensity * 0.48;
      }

      // Update Impact Sparks Physics
      if (impactSparksLife > 0) {
        impactSparksLife -= delta * 2.2;
        impactSparksMat.opacity = Math.max(0, impactSparksLife);
        const sArr = impactSparksGeo.attributes.position.array;
        for (let s = 0; s < MAX_IMPACT_SPARKS; s++) {
          impactSparksVelo[s].y -= 9.8 * delta; // Gravity
          sArr[s * 3] += impactSparksVelo[s].x * delta;
          sArr[s * 3 + 1] += impactSparksVelo[s].y * delta;
          sArr[s * 3 + 2] += impactSparksVelo[s].z * delta;
        }
        impactSparksGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      clearInterval(audioInterval);
      cancelAnimationFrame(animationFrameId);

      // Clean up Three.js resources
      if (bgGeo) bgGeo.dispose();
      if (bgMat) bgMat.dispose();
      if (flashGeo) flashGeo.dispose();
      if (flashMat) flashMat.dispose();
      sparkTexture.dispose();
      vinylTexture.dispose();
      bannerTexture.dispose();

      plinthGeo.dispose();
      plinthMat.dispose();
      trimGeo.dispose();
      trimMat.dispose();
      platterGeo.dispose();
      platterMat.dispose();
      recordGeo.dispose();
      recordMat.dispose();
      spindleGeo.dispose();
      spindleMat.dispose();
      armBaseGeo.dispose();
      armBaseMat.dispose();
      armTubeGeo.dispose();
      pulseRingGeo.dispose();
      pulseRingMat.dispose();

      fuselageGeo.dispose();
      planeMat.dispose();
      wingMat.dispose();
      chromeMat.dispose();
      noseGeo.dispose();
      propBladeGeo.dispose();
      upperWingGeo.dispose();
      lowerWingGeo.dispose();
      rudderGeo.dispose();
      stabilizerGeo.dispose();
      bannerGeo.dispose();
      bannerMat.dispose();
      ropeGeo.dispose();
      ropeMat.dispose();

      laserMeshes.forEach((l) => {
        l.geometry.dispose();
        l.material.dispose();
      });
      confettiGeo.dispose();
      confettiMat.dispose();

      impactSparksGeo.dispose();
      impactSparksMat.dispose();

      activeStrikes.forEach((strike) => {
        lightningGroup.remove(strike.group);
        strike.geometries.forEach((g) => g.dispose());
        strike.coreMat.dispose();
        strike.haloMat.dispose();
        strike.coronaMat.dispose();
      });

      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* 3D WebGL Music Festival Canvas */}
      <div
        ref={mountRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      />

      {/* Floating Music Fest & Lightning HUD Controls */}
      <aside
        className="fixed bottom-5 left-4 sm:left-6 z-40 pointer-events-auto"
        aria-label="Festival Lighting & 3D Controls"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl glass-panel bg-obsidian-950/90 border border-white/15 shadow-2xl backdrop-blur-xl">
          
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono font-semibold tracking-wider text-slate-300 border-r border-white/10">
            <span className={`w-2 h-2 rounded-full ${isStriking ? 'bg-amber-300 animate-ping' : isAudioActive ? 'bg-cyber-cyan animate-ping' : 'bg-cyber-violet animate-pulse'}`} />
            <span>FESTIVAL 3D:</span>
          </div>

          {/* Interactive Lightning Strike Button */}
          <button
            onClick={handleManualLightning}
            title="Unleash an electric lightning bolt across the festival sky!"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-outfit font-bold transition-all duration-300 ${
              isStriking
                ? 'bg-amber-300 text-obsidian-950 scale-110 shadow-[0_0_20px_rgba(251,191,36,0.9)]'
                : 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 text-obsidian-950 shadow-neon-gold hover:scale-105 active:scale-95'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 fill-current ${isStriking ? 'animate-bounce' : ''}`} />
            <span>Strike</span>
          </button>

          {/* Auto Lightning Toggle */}
          <button
            onClick={toggleAutoLightning}
            title={isAutoLightning ? 'Auto Lightning: Enabled (Strikes every 4-7s)' : 'Auto Lightning: Paused'}
            className={`hidden xs:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 ${
              isAutoLightning
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Radio className={`w-3 h-3 ${isAutoLightning ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Auto</span>
          </button>

          {/* View 1: Festival Arena View */}
          <button
            onClick={() => handleViewChange('festival')}
            title="Cinematic Music Festival Arena View"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-outfit transition-all duration-300 ${
              viewMode === 'festival' || viewMode === 'street'
                ? 'bg-gradient-to-r from-cyber-cyan to-blue-600 text-white font-bold shadow-neon-cyan border border-white/30 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="hidden sm:inline">Festival</span>
          </button>

          {/* View 2: DJ Turntable Focus */}
          <button
            onClick={() => handleViewChange('dj')}
            title="Focus on DJ Vinyl Turntable"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-outfit transition-all duration-300 ${
              viewMode === 'dj'
                ? 'bg-gradient-to-r from-cyber-violet to-purple-600 text-white shadow-neon-violet border border-white/30 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5 text-cyber-gold" />
            <span className="hidden sm:inline">DJ Deck</span>
          </button>

          {/* View 3: Sky & Lasers */}
          <button
            onClick={() => handleViewChange('sky')}
            title="Sky Lasers & Lightning Banner View"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-outfit transition-all duration-300 ${
              viewMode === 'sky'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-neon-violet border border-white/30 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Plane className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Sky</span>
          </button>

          {/* Interactive Scratch Vinyl Button */}
          <button
            onClick={handleScratch}
            title="Click to scratch the vinyl record!"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-purple-500/40 text-purple-300 hover:text-white hover:border-purple-400 hover:scale-105 active:scale-95 transition-all text-xs font-mono font-semibold"
          >
            <Music2 className={`w-3.5 h-3.5 text-pink-400 ${isScratching ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">Scratch</span>
          </button>

        </div>
      </aside>
    </>
  );
}
