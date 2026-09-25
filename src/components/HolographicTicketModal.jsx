import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { 
  Download, 
  Share2, 
  RotateCw, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Shirt, 
  Printer, 
  Clock, 
  Hash, 
  FileCheck 
} from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { soundController } from '../utils/audio';

export default function HolographicTicketModal({ passData, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [ticketQrUrl, setTicketQrUrl] = useState('');
  
  // 3D Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  
  const cardRef = useRef(null);
  const ticketExportRef = useRef(null);

  // Trigger Confetti upon initial open
  useEffect(() => {
    // Fireworks / Confetti
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#8b5cf6', '#06b6d4', '#fbbf24', '#ec4899', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Generate dynamic QR code for ticket verification
    const qrData = JSON.stringify({
      event: 'ELIXORA-2.0',
      ticketId: passData.ticketId,
      name: passData.fullName,
      roll: passData.rollNo,
      branch: passData.branch,
      status: 'VERIFIED_VIP'
    });

    QRCode.toDataURL(qrData, {
      margin: 1,
      width: 140,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }).then(url => {
      setTicketQrUrl(url);
    }).catch(err => console.error(err));

  }, [passData]);

  // Mouse Parallax & 3D Interactive Tilt on VIP Badge
  const handleMouseMove = (e) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -16;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);

    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.65,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  const handleFlipCard = () => {
    soundController.playClick();
    setIsFlipped(!isFlipped);
    setRotateX(0);
    setRotateY(0);
  };

  // High-Resolution PNG Download via html2canvas
  const downloadTicketPng = async () => {
    if (!ticketExportRef.current) return;
    soundController.playClick();
    setIsDownloading(true);

    try {
      // Temporary make sure front is visible for render
      const previousFlip = isFlipped;
      setIsFlipped(false);
      setRotateX(0);
      setRotateY(0);

      // Brief delay to allow DOM transform reset
      await new Promise(r => setTimeout(r, 150));

      const canvas = await html2canvas(ticketExportRef.current, {
        scale: 3, // Crisp Retina 3x DPI
        useCORS: true,
        backgroundColor: '#070913',
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `ELIXORA-2.0-VIP-PASS-${passData.rollNo || 'PASS'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (previousFlip) {
        setIsFlipped(true);
      }
    } catch (err) {
      console.error('Failed to export ticket:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // WhatsApp Share Helper
  const shareOnWhatsApp = () => {
    soundController.playClick();
    const text = encodeURIComponent(
      `🎉 I just got my Official VIP Pass for ELIXORA 2.0 Freshers' Party!\n\n` +
      `👤 Name: ${passData.fullName}\n` +
      `🎟️ Ticket ID: ${passData.ticketId}\n` +
      `📅 Date: ${EVENT_DETAILS.humanDate}\n` +
      `📍 Venue: ${EVENT_DETAILS.location}\n\n` +
      `See you on the neon dancefloor! Grab your pass here: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    soundController.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      {/* Background ambient neon pulse */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-gradient-to-tr from-cyber-violet/20 via-cyber-cyan/20 to-cyber-gold/20 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative w-full max-w-4xl mx-auto my-auto z-10 flex flex-col items-center">
        
        {/* Top Floating Modal Bar */}
        <div className="w-full flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-outfit text-xs sm:text-sm font-bold text-emerald-400 tracking-wider">
              PASS AUTHENTICATED & ISSUED
            </span>
          </div>

          <button
            onClick={() => {
              soundController.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Personalized Welcome Header */}
        <div className="text-center mb-6">
          <h2 className="font-outfit font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Welcome to ELIXORA 2.0, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-purple-300 to-cyber-gold">{passData.fullName}</span>!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Your interactive 3D VIP credential is ready. Tilt with mouse to reveal holographic sheen or flip to view entry rules.
          </p>
        </div>

        {/* 3D BADGE CONTAINER */}
        <div className="relative flex flex-col items-center perspective-1000 my-2 select-none">
          
          {/* LANYARD RIBBON & METALLIC CLIP */}
          <div className="flex flex-col items-center -mb-3 z-20">
            {/* Lanyard neck strap loop */}
            <div className="w-16 h-8 bg-gradient-to-b from-purple-900 to-cyber-violet border-x-2 border-white/20 shadow-lg flex items-center justify-center">
              <span className="text-[7px] font-outfit font-extrabold text-white tracking-widest uppercase rotate-90">
                ELIXORA 2.0
              </span>
            </div>
            {/* Silver Carabiner Clip */}
            <div className="w-8 h-5 rounded-md bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 border border-white/60 shadow-md flex items-center justify-center">
              <div className="w-4 h-1.5 rounded-full bg-slate-900/60" />
            </div>
            {/* Badge Punch Slot */}
            <div className="w-12 h-2.5 rounded-full bg-obsidian-950 border border-white/30 -mb-1 shadow-inner z-20" />
          </div>

          {/* FLIPPABLE 3D CARD WRAPPER */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-[340px] sm:w-[410px] min-h-[580px] preserve-3d transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transform: isFlipped
                ? 'rotateY(180deg)'
                : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
          >
            {/* === FRONT OF PASS (TICKET EXPORTABLE NODE) === */}
            <div
              ref={ticketExportRef}
              className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden glass-panel border-2 border-white/20 shadow-2xl backface-hidden flex flex-col justify-between p-6 bg-gradient-to-b from-obsidian-900 via-obsidian-950 to-[#070917]"
            >
              {/* Dynamic Holographic Foil Overlay */}
              <div
                className="holographic-foil absolute inset-0 z-10 transition-opacity duration-300"
                style={{
                  opacity: glarePosition.opacity,
                  backgroundPosition: `${glarePosition.x}% ${glarePosition.y}%`,
                }}
              />

              {/* Dynamic Light Sheen Glare */}
              <div
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-200"
                style={{
                  opacity: glarePosition.opacity,
                  background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.35) 0%, transparent 60%)`,
                }}
              />

              {/* Top Bar of VIP Badge */}
              <div className="relative z-20 flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyber-violet to-cyber-cyan p-[2px]">
                    <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center font-outfit font-black text-xs text-white">
                      E
                    </div>
                  </div>
                  <div>
                    <span className="font-outfit font-extrabold text-sm tracking-wider text-white">
                      ELIXORA 2.0
                    </span>
                    <span className="block text-[8px] font-mono text-cyber-cyan uppercase">
                      Official Freshers' Pass
                    </span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-cyber-gold/20 border border-cyber-gold/50 flex items-center gap-1 shadow-neon-gold">
                  <Sparkles className="w-3 h-3 text-cyber-gold animate-spin-slow" />
                  <span className="font-outfit font-bold text-[9px] text-cyber-gold tracking-wider">
                    VIP BADGE
                  </span>
                </div>
              </div>

              {/* Middle Section: Student Avatar & Details */}
              <div className="relative z-20 my-auto py-4">
                
                {/* Holographic Avatar Initials Ring */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyber-cyan via-purple-500 to-cyber-gold p-[2px] shadow-neon-cyan">
                      <div className="w-full h-full rounded-[14px] bg-obsidian-900 flex items-center justify-center font-outfit font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-white">
                        {passData.fullName
                          ? passData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                          : 'EX'}
                      </div>
                    </div>
                    {/* Verified Hologram Badge */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    </div>
                  </div>
                </div>

                {/* Student Full Name */}
                <div className="text-center">
                  <h3 className="font-outfit font-bold text-2xl text-white tracking-tight leading-tight">
                    {passData.fullName}
                  </h3>
                  <div className="mt-1 flex items-center justify-center gap-2 text-xs font-mono text-cyber-cyan">
                    <span>ID: <strong>{passData.rollNo}</strong></span>
                    <span>•</span>
                    <span className="truncate max-w-[190px]">{passData.branch}</span>
                  </div>
                </div>

                {/* Ticket Key Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 mt-5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">DATE & TIME</span>
                    <span className="font-semibold text-white text-[11px] block mt-0.5">24 OCT 2026 • 6:30 PM</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">VENUE</span>
                    <span className="font-semibold text-white text-[11px] block mt-0.5">Grand Aurora Arena</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">ACCESS TIER</span>
                    <span className="font-semibold text-cyber-gold text-[11px] block mt-0.5">VIP All-Access</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">GATE & ZONE</span>
                    <span className="font-semibold text-cyber-cyan text-[11px] block mt-0.5">Gate 2 • Sector A</span>
                  </div>
                </div>

              </div>

              {/* Bottom Section: Scannable QR & Barcode */}
              <div className="relative z-20 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-mono text-slate-400 uppercase">TICKET NUMBER</div>
                  <div className="font-outfit font-black text-sm text-cyber-gold tracking-widest">
                    {passData.ticketId}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-1">
                    UTR: {passData.utrNumber ? `${passData.utrNumber.slice(0, 6)}••••` : 'VERIFIED'}
                  </div>
                </div>

                {/* Scannable Verification QR */}
                <div className="p-1.5 bg-white rounded-xl shadow-lg">
                  {ticketQrUrl ? (
                    <img src={ticketQrUrl} alt="Pass QR" className="w-14 h-14 block" />
                  ) : (
                    <div className="w-14 h-14 bg-slate-900 rounded" />
                  )}
                </div>
              </div>

              {/* Fake Security Hologram Strip at very bottom */}
              <div className="relative z-20 mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyber-cyan" />
                  <span>STUDENT COUNCIL AUTHENTICATED</span>
                </span>
                <span>SEC-HASH #8942-E</span>
              </div>

            </div>

            {/* === BACK OF PASS (SAFETY & ENTRY GUIDELINES) === */}
            <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden glass-panel border-2 border-cyber-cyan/40 shadow-2xl backface-hidden rotate-y-180 flex flex-col justify-between p-6 bg-gradient-to-b from-[#0b0f24] via-obsidian-950 to-[#04060d]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-cyber-cyan">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-outfit font-bold text-xs uppercase tracking-wider">
                      ENTRY PROTOCOL & TERMS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">GATE 2 ONLY</span>
                </div>

                <div className="mt-4 space-y-3 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <strong className="text-white block mb-0.5">1. Mandatory ID Verification</strong>
                    This digital pass must be shown alongside your original physical College ID or admission letter.
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <strong className="text-white block mb-0.5">2. Dress Code Compliance</strong>
                    Theme is Cyber Glam & Ethereal Neon. Comfortable sneakers recommended for arena dance floor.
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <strong className="text-white block mb-0.5">3. Non-Transferable Security</strong>
                    Each QR code is uniquely encrypted to your Roll Number ({passData.rollNo}) and permits one-time scan only.
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <strong className="text-white block mb-0.5">4. Safe Campus Event</strong>
                    Zero tolerance for prohibited substances or disruptive behavior. Helpdesk: +91 98765 00000.
                  </div>
                </div>
              </div>

              {/* Big Barcode at bottom of back */}
              <div className="pt-4 border-t border-white/10 text-center">
                <div className="h-10 w-full flex items-center justify-center gap-1 opacity-80 px-4">
                  {[4,2,6,1,3,5,2,4,7,1,3,2,6,4,2,5,3,1,7,2,4,3,6,2,5,1,4,2,7,3].map((w, i) => (
                    <div
                      key={i}
                      className="bg-white h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] tracking-[0.3em] text-slate-400 mt-1 block">
                  *{passData.ticketId}*
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* CONTROLS & ACTIONS BAR */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          {/* Flip Pass Toggle */}
          <button
            onClick={handleFlipCard}
            className="flex-1 py-3 px-4 rounded-xl glass-panel border border-white/20 text-white font-medium text-xs sm:text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4 text-cyber-cyan" />
            <span>{isFlipped ? 'View Front Badge' : 'Flip to Guidelines'}</span>
          </button>

          {/* Download Ticket PNG via html2canvas */}
          <button
            onClick={downloadTicketPng}
            disabled={isDownloading}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-violet text-white font-bold font-outfit text-xs sm:text-sm hover:shadow-neon-violet hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Exporting HD...' : 'Download Pass (PNG)'}</span>
          </button>
        </div>

        {/* Secondary Sharing Actions */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={shareOnWhatsApp}
            className="py-2 px-3.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2 px-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass / PDF</span>
          </button>
        </div>

      </div>

    </div>
  );
}
