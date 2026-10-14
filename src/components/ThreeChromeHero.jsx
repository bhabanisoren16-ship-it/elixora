import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeChromeHero: 3D Metallic Chrome Visual Centerpiece for ELIXORA
 * Features:
 * - High-refraction metallic chrome shaders & reflections
 * - Dual cyan & violet rim spotlights that respond to mouse pointer movement
 * - Scroll-linked camera depth & perspective tilt
 * - Lightweight particle cloud orbiting the centerpiece
 * - Mobile responsive with automatic low-power fallback
 */
export default function ThreeChromeHero({ className = '' }) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let canvas;
    try {
      canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return;
    } catch (e) {
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 420;
    const isMobile = width < 768;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    // Cyan Key Rim Light (Top Left)
    const cyanLight = new THREE.PointLight(0x00e5ff, isMobile ? 2.5 : 4.0, 25);
    cyanLight.position.set(-5, 4, 4);
    scene.add(cyanLight);

    // Violet Rim Light (Bottom Right)
    const violetLight = new THREE.PointLight(0xa855f7, isMobile ? 2.5 : 4.0, 25);
    violetLight.position.set(5, -3, 3);
    scene.add(violetLight);

    // Cursor Follow Spotlight
    const pointerLight = new THREE.PointLight(0xffffff, 2.0, 15);
    pointerLight.position.set(0, 0, 5);
    scene.add(pointerLight);

    // Chrome Material with Metallic Luster
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    // Gold Accent Material
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfacc15,
      metalness: 0.9,
      roughness: 0.18,
      clearcoat: 0.8,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Centerpiece Geometries: Sculpted Holographic Rings & Prisms
    const ringGeom1 = new THREE.TorusGeometry(2.2, 0.08, 16, 64);
    const ring1 = new THREE.Mesh(ringGeom1, chromeMaterial);
    ring1.rotation.x = Math.PI / 3;
    rootGroup.add(ring1);

    const ringGeom2 = new THREE.TorusGeometry(1.6, 0.06, 16, 64);
    const ring2 = new THREE.Mesh(ringGeom2, goldMaterial);
    ring2.rotation.y = Math.PI / 4;
    rootGroup.add(ring2);

    // Floating Geometric Nexus Core (Octahedron crystal)
    const coreGeom = new THREE.OctahedronGeometry(0.85, 1);
    const coreMesh = new THREE.Mesh(coreGeom, chromeMaterial);
    rootGroup.add(coreMesh);

    // Subtle Particle Swarm
    const particleCount = isMobile ? 35 : 85;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 5;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: isMobile ? 0.05 : 0.07,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeom, particleMaterial);
    scene.add(particleSystem);

    // Mouse Parallax Listeners
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY || window.pageYOffset || 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Render Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.05;
      m.y += (m.targetY - m.y) * 0.05;

      // Pointer Light follow
      pointerLight.position.x = m.x * 4;
      pointerLight.position.y = -m.y * 3;

      // Centerpiece rotations
      ring1.rotation.z = elapsedTime * 0.25;
      ring2.rotation.x = elapsedTime * 0.35;
      coreMesh.rotation.y = elapsedTime * 0.5;
      coreMesh.rotation.x = elapsedTime * 0.3;

      // Parallax & Scroll Depth
      const scrollOffset = scrollRef.current * 0.0015;
      rootGroup.rotation.y = m.x * 0.45;
      rootGroup.rotation.x = m.y * 0.35 + scrollOffset;
      rootGroup.position.y = -scrollOffset * 1.5;

      // Particle subtle drifting
      particleSystem.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      ringGeom1.dispose();
      ringGeom2.dispose();
      coreGeom.dispose();
      chromeMaterial.dispose();
      goldMaterial.dispose();
      particleGeom.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[280px] xs:h-[340px] sm:h-[400px] md:h-[460px] flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
}
