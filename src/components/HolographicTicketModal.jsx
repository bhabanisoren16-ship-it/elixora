import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { 
  Download, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  Lock,
  Check
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
  const mouseRafRef = useRef(null);

  // Trigger Confetti upon initial open
  useEffect(() => {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#f59e0b', '#06b6d4', '#c084fc', '#ec4899', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
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
      branch: passData.branch || 'Biotechnology',
      status: 'VERIFIED_VIP'
    });

    QRCode.toDataURL(qrData, {
      margin: 1,
      width: 180,
      color: {
        dark: '#0a0e1a',
        light: '#ffffff'
      }
    }).then(url => {
      setTicketQrUrl(url);
    }).catch(err => console.error(err));

    return () => {
      if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
    };
  }, [passData]);

  // Mouse Parallax & 3D Interactive Tilt on VIP Badge
  const handleMouseMove = (e) => {
    if (!cardRef.current || isFlipped) return;
    if (mouseRafRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    mouseRafRef.current = requestAnimationFrame(() => {
      mouseRafRef.current = null;
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -12;
      const rotY = ((x - centerX) / centerX) * 12;

      setRotateX(rotX);
      setRotateY(rotY);

      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.75,
      });
    });
  };

  const handleMouseLeave = () => {
    if (mouseRafRef.current) {
      cancelAnimationFrame(mouseRafRef.current);
      mouseRafRef.current = null;
    }
    setRotateX(0);
    setRotateY(0);
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  const handleFlipCard = () => {
    soundController.playClick?.();
    setIsFlipped(!isFlipped);
    setRotateX(0);
    setRotateY(0);
  };

  // High-Resolution PNG Download via html2canvas
  const downloadTicketPng = async () => {
    if (!ticketExportRef.current) return;
    soundController.playClick?.();
    setIsDownloading(true);

    try {
      const previousFlip = isFlipped;
      setIsFlipped(false);
      setRotateX(0);
      setRotateY(0);

      await new Promise(r => setTimeout(r, 160));

      const canvas = await html2canvas(ticketExportRef.current, {
        scale: 3, // Crisp Retina 3x DPI
        useCORS: true,
        backgroundColor: '#070913',
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `ELIXORA-2.0-VIP-TICKET-${passData.rollNo || 'PASS'}.png`;
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
    soundController.playClick?.();
    const text = encodeURIComponent(
      `🎉 I just got my Official VIP Ticket for ELIXORA 2.0 Concert & Freshers' Night!\n\n` +
      `👤 Attendee: ${passData.fullName}\n` +
      `🎟️ Ticket ID: ${passData.ticketId}\n` +
      `📅 Date: ${EVENT_DETAILS.humanDate}\n` +
      `📍 Venue: ${EVENT_DETAILS.location}\n\n` +
      `See you at the grand arena! Grab your pass: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    soundController.playClick?.();
    window.print();
  };

  // Format Attendee Name to Title Case if user typed lowercase
  const formattedName = passData.fullName
    ? passData.fullName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : 'VIP Attendee';

  return (
    <div 
      data-lenis-prevent
      className="fixed inset-0 z-[100] overflow-y-auto bg-obsidian-950/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none"
    >
      {/* Background ambient concert lights */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[680px] h-[680px] bg-gradient-to-tr from-amber-500/15 via-purple-600/20 to-cyan-400/20 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Floating Top-Left Back Button */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[120]">
        <button
          type="button"
          onClick={() => {
            soundController.playClick?.();
            onClose();
          }}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-obsidian-950/90 hover:bg-obsidian-900 border border-white/20 hover:border-amber-400/60 shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-xl text-slate-200 hover:text-white text-xs font-outfit font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Back to Festival Home"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="relative w-full max-w-4xl mx-auto my-auto z-10 flex flex-col items-center pt-8 sm:pt-4">
        
        {/* Top Floating Modal Bar */}
        <div className="w-full flex items-center justify-end mb-2 px-2 max-w-[430px]">
          <button
            onClick={() => {
              soundController.playClick?.();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Personalized Welcome Header */}
        <div className="text-center mb-3">
          <h2 className="font-outfit font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Welcome to the Stage, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-cyan-300">{formattedName}</span>!
          </h2>
        </div>

        {/* ========================================================= */}
        {/* 3D TICKET CONTAINER                                       */}
        {/* ========================================================= */}
        <div className="relative flex flex-col items-center perspective-1000 my-2 select-none">
          
          {/* FLIPPABLE 3D CARD WRAPPER */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-[340px] sm:w-[420px] min-h-[640px] sm:min-h-[660px] preserve-3d transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing relative ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transform: isFlipped
                ? 'rotateY(180deg)'
                : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
          >

            {/* ========================================================= */}
            {/* === FRONT OF CONCERT TICKET (EXPORTABLE NODE)          === */}
            {/* ========================================================= */}
            <div
              ref={ticketExportRef}
              className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-[0_25px_65px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.25)] backface-hidden flex flex-col justify-between bg-gradient-to-b from-[#101426] via-[#090d1a] to-[#04060d]"
            >
              {/* Dynamic Holographic Foil Overlay */}
              <div
                className="holographic-foil absolute inset-0 z-10 transition-opacity duration-300 pointer-events-none"
                style={{
                  opacity: glarePosition.opacity,
                  backgroundPosition: `${glarePosition.x}% ${glarePosition.y}%`,
                }}
              />

              {/* Dynamic Specular Light Glare */}
              <div
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-200"
                style={{
                  opacity: glarePosition.opacity,
                  background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(254, 240, 138, 0.45) 0%, transparent 65%)`,
                }}
              />

              {/* Subtle Gold Dust Grid Watermark */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* ===================================================== */}
              {/* UPPER MAIN SECTION: CONCERT PASS (70% HEIGHT)         */}
              {/* ===================================================== */}
              <div className="relative z-20 p-5 sm:p-6 pb-4 flex flex-col justify-between flex-1">
                
                {/* 1. TOP HEADER & BRANDING */}
                <div className="border-b border-amber-400/20 pb-3">
                  <h1 className="font-innovision-serif text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-400">
                    ELIXORA 2.0
                  </h1>
                  <span className="text-[10px] font-outfit font-bold text-cyan-300 tracking-widest uppercase block mt-0.5">
                    {passData.isSenior ? 'SENIOR VIP COUNCIL EDITION' : "ANNUAL FRESHERS' FESTIVAL"}
                  </span>
                </div>

                {/* 3. ATTENDEE BIOMETRIC SPOTLIGHT */}
                <div className="my-auto py-2 text-center">
                  
                  {/* Holographic Avatar Medallion */}
                  <div className="flex justify-center mb-2.5">
                    <div className="relative">
                      <div className={`w-18 h-18 p-[2px] rounded-2xl shadow-xl ${
                        passData.isSenior
                          ? 'bg-gradient-to-tr from-amber-400 via-yellow-200 to-purple-600 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                          : 'bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      }`}>
                        <div className="w-full h-full rounded-[14px] bg-obsidian-950 flex items-center justify-center font-outfit font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-cyan-300">
                          {passData.fullName
                            ? passData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                            : 'EX'}
                        </div>
                      </div>
                      
                      {/* Verified Badge */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg border border-white/30">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                  </div>

                  {/* Student Full Name */}
                  <h2 className="font-outfit font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight uppercase drop-shadow-[0_2px_12px_rgba(251,191,36,0.3)]">
                    {formattedName}
                  </h2>

                  {/* Student Credentials Pill */}
                  <div className="mt-1 flex items-center justify-center gap-2 text-xs font-mono flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 font-bold tracking-wider">
                      ROLL: {passData.rollNo}
                    </span>
                    {passData.branch && (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 text-[11px] truncate max-w-[190px]">
                        {passData.branch}
                      </span>
                    )}
                  </div>

                  {passData.batch && (
                    <div className="mt-1">
                      <span className="text-[10px] font-mono text-slate-400">
                        {passData.batch}
                      </span>
                    </div>
                  )}

                  {passData.seniorQuote && (
                    <p className="mt-2 text-[11px] text-amber-200/90 italic px-3 py-1 rounded-lg bg-white/5 border border-white/10 max-w-xs mx-auto line-clamp-1">
                      "{passData.seniorQuote}"
                    </p>
                  )}
                </div>

                {/* 4. CONCERT BOARDING SPECIFICATIONS GRID */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-obsidian-950/80 border border-amber-400/20 text-center text-xs mt-2">
                  <div className="border-r border-white/10 pr-1">
                    <span className="text-[8px] font-mono text-slate-400 block uppercase tracking-wider">DATE</span>
                    <span className="font-bold text-white text-[11px] block mt-0.5">24 OCT 2026</span>
                  </div>
                  <div className="border-r border-white/10 pr-1">
                    <span className="text-[8px] font-mono text-slate-400 block uppercase tracking-wider">GATE</span>
                    <span className="font-bold text-cyan-300 text-[11px] block mt-0.5 truncate">
                      {passData.isSenior ? 'Gate 1 (VIP)' : 'Gate 2 (North)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 block uppercase tracking-wider">ZONE</span>
                    <span className="font-bold text-amber-300 text-[11px] block mt-0.5 truncate">
                      {passData.isSenior ? 'VIP Lounge' : 'Arena Floor'}
                    </span>
                  </div>
                </div>

              </div>

              {/* LOWER ADMISSION QR & BARCODE SECTION */}
              <div className="relative z-20 p-5 sm:p-6 pt-3.5 bg-obsidian-950/70 border-t border-amber-400/20">
                
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Ticket Pass ID & Verification info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-mono text-amber-400 uppercase tracking-widest">
                      TICKET PASS ID
                    </div>
                    
                    {/* Ticket ID */}
                    <div className="font-outfit font-black text-xl text-white tracking-widest mt-0.5 truncate">
                      {passData.ticketId}
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      UTR: <span className="text-slate-300">{passData.utrNumber ? `${passData.utrNumber.slice(0, 6)}••••` : 'VERIFIED'}</span>
                    </div>
                  </div>

                  {/* Right: High-Density Admission QR Code with Animated Scanline */}
                  <div className="relative p-1.5 bg-white rounded-xl shadow-xl shrink-0 overflow-hidden border border-amber-400/40">
                    {ticketQrUrl ? (
                      <img src={ticketQrUrl} alt="Pass QR" className="w-16 h-16 sm:w-20 sm:h-20 block" />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 rounded" />
                    )}

                    {/* Animated Neon Cyan Laser Scan Beam */}
                    <div className="absolute inset-x-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_#00f2fe] animate-laser-scan pointer-events-none" />
                  </div>
                </div>

                {/* Security Hologram Strip at bottom */}
                <div className="mt-2.5 pt-1.5 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-amber-300">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>AUTHENTICATED FESTIVAL PASS</span>
                  </span>
                  <span className="font-mono text-cyan-300">SEC-HASH #8942-ELX</span>
                </div>

              </div>

            </div>

            {/* ========================================================= */}
            {/* === BACK OF TICKET (CONCERT TERMS & GUIDELINES)         === */}
            {/* ========================================================= */}
            <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-[0_25px_65px_rgba(0,0,0,0.9)] backface-hidden rotate-y-180 flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-[#140e28] via-[#0b0816] to-[#04020a]">
              <div>
                {/* Back Header */}
                <div className="flex items-center justify-between pb-3 border-b border-amber-400/20">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="font-outfit font-extrabold text-xs uppercase tracking-wider text-white">
                      ENTRY PROTOCOL &amp; VENUE TERMS
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    GATE 2 // SEC-A
                  </span>
                </div>

                {/* 4 Concert Guidelines */}
                <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-amber-400/20 flex items-start gap-2.5">
                    <span className="font-mono font-black text-amber-400 text-xs mt-0.5">01</span>
                    <div>
                      <strong className="text-white block font-outfit text-xs">Mandatory ID Verification</strong>
                      <span className="text-[11px] text-slate-300 leading-tight block">
                        Present this digital pass alongside your original College Student ID or admission slip.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-cyan-400/20 flex items-start gap-2.5">
                    <span className="font-mono font-black text-cyan-400 text-xs mt-0.5">02</span>
                    <div>
                      <strong className="text-white block font-outfit text-xs">Dress Code Protocol</strong>
                      <span className="text-[11px] text-slate-300 leading-tight block">
                        Theme is Cyber Glam &amp; Ethereal Indo-Western Fusion. Comfortable footwear recommended.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-amber-400/20 flex items-start gap-2.5">
                    <span className="font-mono font-black text-amber-400 text-xs mt-0.5">03</span>
                    <div>
                      <strong className="text-white block font-outfit text-xs">Non-Transferable Security</strong>
                      <span className="text-[11px] text-slate-300 leading-tight block">
                        QR token is strictly linked to Roll ID ({passData.rollNo}). Permits one-time entry scan.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-cyan-400/20 flex items-start gap-2.5">
                    <span className="font-mono font-black text-cyan-400 text-xs mt-0.5">04</span>
                    <div>
                      <strong className="text-white block font-outfit text-xs">Safe Campus Directive</strong>
                      <span className="text-[11px] text-slate-300 leading-tight block">
                        Zero tolerance for prohibited substances. Event security concierge active at Gate 2.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stub Barcode */}
              <div className="pt-3 border-t border-amber-400/10 text-center">
                <div className="h-8 w-full flex items-center justify-center gap-1 opacity-80 px-4">
                  {[4,2,6,1,3,5,2,4,7,1,3,2,6,4,2,5,3,1,7,2,4,3,6,2,5,1,4,2,7,3].map((w, i) => (
                    <div
                      key={i}
                      className="bg-white h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] tracking-[0.3em] text-amber-300 mt-1 block">
                  *{passData.ticketId}*
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* CONTROLS & ACTIONS BAR                                    */}
        {/* ========================================================= */}
        <div className="mt-5 flex items-center justify-center w-full max-w-md">
          {/* Download Ticket PNG via html2canvas */}
          <button
            onClick={downloadTicketPng}
            disabled={isDownloading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300 text-slate-950 font-black font-outfit text-sm hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/30 cursor-pointer shadow-lg"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>{isDownloading ? 'Exporting HD...' : 'Download Ticket (PNG)'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
