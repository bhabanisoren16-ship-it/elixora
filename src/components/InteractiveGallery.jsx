import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles, Camera } from 'lucide-react';
import { createPortal } from 'react-dom';

/**
 * InteractiveGallery: Editorial-style photographic showcase using official ELIXORA event imagery.
 * Features:
 * - Large editorial cards with hover zoom & dark vignette
 * - Subtle 3D tilt interaction on desktop
 * - Fullscreen Lightbox modal with captions and keyboard navigation (Esc, Left, Right)
 * - Uses only verified local event assets without unrelated stock photography
 */
export default function InteractiveGallery() {
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const galleryItems = [
    {
      id: 1,
      src: '/desktop-background.jpg',
      title: 'Grand Aurora Arena Stage & Concert Lights',
      category: 'STAGE & PRODUCTION',
      description: 'Volumetric arena spotlights and dual-tone laser beams over the central performance amphitheatre.',
      aspect: 'col-span-1 md:col-span-2 row-span-1',
    },
    {
      id: 2,
      src: '/party-background.jpg',
      title: 'Crowd Euphoria & Neon Haze',
      category: 'NIGHTLIFE ATMOSPHERE',
      description: 'The electric pulse of the crowd as beats drop and laser beams sweep across the arena ceiling.',
      aspect: 'col-span-1 row-span-1',
    },
    {
      id: 3,
      src: '/costume-girls.jpg',
      title: 'Women’s Indo-Western & Cyber Glamour',
      category: 'OFFICIAL STYLE GUIDE',
      description: 'Curated fashion guide: Fusion sarees, formal evening silhouettes, metallic accents, and elegant evening wear.',
      aspect: 'col-span-1 row-span-1',
    },
    {
      id: 4,
      src: '/costume-boys.jpg',
      title: 'Men’s Indo-Western Fusion & Tailored Suits',
      category: 'OFFICIAL STYLE GUIDE',
      description: 'Curated fashion guide: Modern structured kurtas, tailored tuxedos, dark obsidian blazers, and fusion formal wear.',
      aspect: 'col-span-1 md:col-span-2 row-span-1',
    },
  ];

  // Lightbox keyboard controls
  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % galleryItems.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeImageIndex, galleryItems.length]);

  return (
    <section id="gallery" className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 scroll-mt-20 sm:scroll-mt-24">
      
      {/* Background Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/35 text-purple-300 text-xs font-outfit font-extrabold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <Camera className="w-3.5 h-3.5 text-purple-400" />
          <span>VISUAL STORYTELLING</span>
        </div>

        <h2 className="font-outfit font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
          Visual Atmosphere &amp; Style
        </h2>

        <p className="mt-3 text-white max-w-2xl mx-auto text-sm sm:text-base font-outfit font-bold subheading-readable tracking-wide">
          An editorial glimpse into the arena production, music festival atmosphere, and curated fashion blueprints.
        </p>
      </div>

      {/* Asymmetric Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {galleryItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setActiveImageIndex(index)}
            className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-obsidian-950 shadow-2xl cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/50 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.25)] ${item.aspect}`}
          >
            {/* Image with Zoom */}
            <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden relative">
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.92] contrast-[1.05]"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              {/* Top Category Badge & Expand Icon */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-cyan-300 text-[10px] sm:text-[11px] font-outfit font-black tracking-widest uppercase">
                  {item.category}
                </span>

                <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-300" />
                </div>
              </div>

              {/* Bottom Editorial Caption */}
              <div className="absolute bottom-4 inset-x-4 z-10">
                <h3 className="font-outfit font-extrabold text-lg sm:text-xl md:text-2xl text-white group-hover:text-cyan-200 transition-colors tracking-tight leading-snug drop-shadow-md">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-outfit leading-relaxed line-clamp-2 drop-shadow">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal (Portaled) */}
      {activeImageIndex !== null && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setActiveImageIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all cursor-pointer shadow-xl hover:scale-110"
            title="Close viewer (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all cursor-pointer shadow-xl hover:scale-110"
            title="Previous image (Left arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev + 1) % galleryItems.length);
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all cursor-pointer shadow-xl hover:scale-110"
            title="Next image (Right arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content Box */}
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl max-h-[75vh]">
              <img
                src={galleryItems[activeImageIndex].src}
                alt={galleryItems[activeImageIndex].title}
                className="w-full h-full max-h-[75vh] object-contain mx-auto"
              />
            </div>

            {/* Lightbox Caption */}
            <div className="mt-4 text-center max-w-2xl px-2">
              <span className="text-[11px] font-outfit font-black tracking-widest text-cyan-300 uppercase block mb-1">
                {galleryItems[activeImageIndex].category} • {activeImageIndex + 1} OF {galleryItems.length}
              </span>
              <h4 className="font-outfit font-extrabold text-xl sm:text-2xl text-white">
                {galleryItems[activeImageIndex].title}
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 font-outfit">
                {galleryItems[activeImageIndex].description}
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
