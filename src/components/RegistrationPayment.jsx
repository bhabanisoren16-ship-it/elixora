import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  User, 
  Phone, 
  Loader2,
  Crown
} from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { soundController } from '../utils/audio';
import { adminStore } from '../utils/adminStore';
import { scrollToTarget } from '../utils/smoothScroll';

export default function RegistrationPayment({ onPassGenerated }) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    phone: '',
    diet: 'Veg',
    utrNumber: '',
  });

  // UI state
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);

  const qrCanvasRef = useRef(null);

  // Generate UPI QR Code dynamically whenever Roll No or Name changes
  useEffect(() => {
    if (!qrCanvasRef.current) return;

    const note = formData.rollNo
      ? `ELX26-${formData.rollNo.toUpperCase().trim()}`
      : 'ELX26-FRESHERS';

    // Standard NPCI UPI URI string
    const upiString = `upi://pay?pa=${EVENT_DETAILS.upiId}&pn=ELIXORA%20FRESHERS&am=${EVENT_DETAILS.ticketPrice}&cu=INR&tn=${encodeURIComponent(note)}`;

    QRCode.toCanvas(
      qrCanvasRef.current,
      upiString,
      {
        width: 125,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      },
      (error) => {
        if (error) console.error('QR generation error:', error);
      }
    );
  }, [formData.rollNo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    soundController.playClick();
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
        setErrors((prev) => ({ ...prev, screenshot: null }));
      };
      reader.readAsDataURL(file);
    }
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.rollNo.trim()) newErrors.rollNo = 'College Roll / Student ID is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.utrNumber.trim()) {
      newErrors.utrNumber = 'UPI Reference / UTR Number is compulsory to proceed';
    } else if (formData.utrNumber.trim().length < 8) {
      newErrors.utrNumber = 'Please enter a valid 12-digit UPI UTR / Ref Number';
    }
    if (!screenshotPreview) {
      newErrors.screenshot = 'Payment screenshot is compulsory to proceed. Please upload receipt proof.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      if (soundController.playError) soundController.playError();
      else soundController.playClick();
      return;
    }

    soundController.playClick();
    setIsVerifying(true);
    setVerificationStep(1);

    // Simulated 3-stage banking & college roster verification
    setTimeout(() => {
      setVerificationStep(2);
    }, 1000);

    setTimeout(() => {
      setVerificationStep(3);
    }, 2000);

    setTimeout(() => {
      setIsVerifying(false);
      soundController.playPassCelebration();

      // Generate ticket data
      const randomTicketId = `ELX-26-${Math.floor(1000 + Math.random() * 9000)}`;
      const generatedPass = {
        ...formData,
        ticketId: randomTicketId,
        issuedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        tier: 'VIP FRESHER ACCESS',
        entryGate: 'Gate 2 (Aurora North Arch)',
        tableZone: 'Arena Floor A-14',
        screenshot: screenshotPreview,
        isSenior: false,
        ticketPrice: EVENT_DETAILS.ticketPrice || 399,
        branch: 'Biotechnology',
        batch: "Batch of '26 • Fresher",
        role: 'VIP Fresher Attendee',
      };

      adminStore.addRegistration(generatedPass);
      onPassGenerated(generatedPass);
      setFormData({
        fullName: '',
        rollNo: '',
        phone: '',
        diet: 'Veg',
        utrNumber: '',
      });
      setScreenshotPreview(null);
      setErrors({});
    }, 2800);
  };

  return (
    <section id="register" className="relative py-8 sm:py-12 px-3 sm:px-5 lg:px-6 max-w-[92rem] 2xl:max-w-[98rem] mx-auto z-10 scroll-mt-20 sm:scroll-mt-24">
      
      {/* Header */}
      <div className="text-center mb-5 sm:mb-7">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan text-xs font-outfit font-bold uppercase mb-2.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <span>PORTAL GATEWAY • BIOTECHNOLOGY FRESHERS '26</span>
        </div>
        <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Registration &amp; Pass Checkout
        </h2>
        <p className="mt-1.5 text-white max-w-2xl mx-auto text-sm sm:text-base font-outfit font-bold subheading-readable tracking-wide">
          Fill your student details, complete payment via dynamic UPI QR, and your personalized 3D VIP pass will be rendered instantly.
        </p>
      </div>

      {/* Pass Type Switcher Tabs (Direct Link Back to Senior VIP Pass Default) */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="inline-flex p-1 rounded-2xl bg-obsidian-900/90 border border-white/15 backdrop-blur-xl shadow-2xl">
          <a
            href="#seniors"
            onClick={(e) => {
              e.preventDefault();
              soundController.playClick?.();
              scrollToTarget('#seniors');
            }}
            className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-outfit font-semibold text-xs sm:text-sm transition-all"
          >
            <Crown className="w-4 h-4 text-cyan-400" />
            <span>Senior VIP Pass (Default)</span>
            <span className="text-[10px] text-cyan-400 hidden sm:inline">↑</span>
          </a>
          <button
            type="button"
            className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-cyber-violet text-white font-outfit font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all cursor-default"
          >
            <span>Freshers Pass</span>
          </button>
        </div>
      </div>

      {/* UNIFIED WIDESCREEN RECTANGLE CARD CONTAINER (FULL WIDTH WITH COMPACT HEIGHT) */}
      <div className="w-full max-w-[86rem] xl:max-w-[90rem] 2xl:max-w-[94rem] mx-auto rounded-3xl py-4 sm:py-5 px-5 sm:px-8 border border-white/20 bg-obsidian-950/60 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(6,182,212,0.12)] relative overflow-hidden transition-all duration-300">
        
        {/* Subtle Ambient Glow Blobs inside the card */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyber-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} noValidate className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* ========================================= */}
          {/* LEFT COLUMN: STEP 1 - Student Details */}
          {/* ========================================= */}
          <div className="flex flex-col justify-between lg:border-r lg:border-white/10 lg:pr-6 xl:pr-8">
            <div>
              {/* Step 1 Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/25 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-outfit font-extrabold text-cyan-300 uppercase tracking-wider block leading-tight">STEP 1 OF 2</span>
                    <h3 className="font-outfit font-extrabold text-lg text-white tracking-tight">Student Details</h3>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 px-2 py-0.5 rounded">
                  FRESHER
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Row 1: Full Name & Roll / Student ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-200 mb-0.5">
                      Full Name <span className="text-cyber-cyan">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Aarav Sharma"
                        className={`w-full px-3 py-2 rounded-xl bg-obsidian-900/90 border ${
                          errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15 focus:border-cyber-cyan'
                        } text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all`}
                      />
                    </div>
                    {errors.fullName && <p className="mt-0.5 text-[11px] text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-200 mb-0.5">
                      Roll / Student ID <span className="text-cyber-cyan">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="rollNo"
                        value={formData.rollNo}
                        onChange={handleInputChange}
                        placeholder="e.g. 26CS084"
                        className={`w-full px-3 py-2 rounded-xl bg-obsidian-900/90 border ${
                          errors.rollNo ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15 focus:border-cyber-cyan'
                        } text-white placeholder-slate-500 text-xs uppercase font-mono focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all`}
                      />
                    </div>
                    {errors.rollNo && <p className="mt-0.5 text-[11px] text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.rollNo}</p>}
                  </div>
                </div>

                {/* Row 2: Contact Number & Refreshment Preference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-200 mb-0.5">
                      Contact Number (WhatsApp) <span className="text-cyber-cyan">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile"
                        className={`w-full px-3 py-2 rounded-xl bg-obsidian-900/90 border ${
                          errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15 focus:border-cyber-cyan'
                        } text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all`}
                      />
                    </div>
                    {errors.phone && <p className="mt-0.5 text-[11px] text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-200 mb-0.5">
                      Refreshment Preference
                    </label>
                    <div className="flex gap-2">
                      {['Veg', 'Non-Veg', 'Jain/Vegan'].map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => setFormData({ ...formData, diet: item })}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            formData.diet === item
                              ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================= */}
          {/* RIGHT COLUMN: STEP 2 - UPI Payment */}
          {/* ========================================= */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Step 2 Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/25 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)] shrink-0">
                    <CreditCard className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-outfit font-extrabold text-cyan-300 uppercase tracking-wider block leading-tight">STEP 2 OF 2</span>
                    <h3 className="font-outfit font-extrabold text-lg text-white tracking-tight">UPI Payment</h3>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-purple-300 bg-purple-500/15 border border-purple-400/30 px-2 py-0.5 rounded">
                  INSTANT QR
                </span>
              </div>

              {/* Compact Payment Info: QR Code + Price & UPI ID */}
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 mb-2.5 flex flex-col sm:flex-row items-center gap-3">
                {/* QR Code Canvas */}
                <div className="p-1.5 bg-white rounded-xl shadow-lg shrink-0 relative transition-transform hover:scale-[1.02]">
                  <canvas ref={qrCanvasRef} className="rounded-lg block" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-6 rounded-md bg-obsidian-950 border border-cyber-cyan flex items-center justify-center shadow-md">
                      <QrCode className="w-3 h-3 text-cyber-cyan" />
                    </div>
                  </div>
                </div>

                {/* Price & UPI Details */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-0.5">
                    <span className="font-outfit font-extrabold text-xl sm:text-2xl text-white">₹{EVENT_DETAILS.ticketPrice}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-1 mb-1.5">
                    <Smartphone className="w-3 h-3 text-cyber-cyan shrink-0" />
                    <span>Scan with GPay, PhonePe, Paytm</span>
                  </p>
                  {/* Official UPI ID Copy Widget */}
                  <div className="flex items-center gap-1.5 bg-obsidian-950/80 px-2 py-1 rounded-lg border border-white/10 text-xs">
                    <span className="font-mono text-slate-300 truncate flex-1 text-[11px]">{EVENT_DETAILS.upiId}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(EVENT_DETAILS.upiId)}
                      className="p-1 rounded-md bg-white/10 hover:bg-cyber-cyan/20 text-slate-200 hover:text-cyber-cyan transition-colors cursor-pointer"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Form fields: UTR & Screenshot paired side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mb-2.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-0.5">
                    UPI Reference / UTR (12 Digits) <span className="text-cyber-cyan">*</span>
                  </label>
                  <input
                    type="text"
                    name="utrNumber"
                    value={formData.utrNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 427189035124"
                    maxLength={18}
                    className={`w-full px-3 py-2 rounded-xl bg-obsidian-900/90 border ${
                      errors.utrNumber ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15 focus:border-cyber-cyan'
                    } text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all`}
                  />
                  {errors.utrNumber && <p className="mt-0.5 text-[11px] text-rose-400 flex items-center gap-1 font-mono"><AlertCircle className="w-3 h-3 shrink-0"/>{errors.utrNumber}</p>}
                </div>

                {/* Payment Screenshot Upload */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-0.5">
                    Payment Screenshot <span className="text-cyber-cyan">*</span>
                  </label>
                  <div className="relative">
                    <label className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-dashed transition-all cursor-pointer ${
                      errors.screenshot
                        ? 'border-rose-500 bg-rose-500/10'
                        : screenshotPreview
                        ? 'border-emerald-500/60 bg-emerald-500/10'
                        : 'border-white/20 hover:border-cyber-cyan/60 bg-white/5 hover:bg-white/10'
                    }`}>
                      <Upload className={`w-3.5 h-3.5 ${screenshotPreview ? 'text-emerald-400' : errors.screenshot ? 'text-rose-400' : 'text-cyber-cyan'} shrink-0`} />
                      <span className={`text-xs truncate ${screenshotPreview ? 'text-emerald-300 font-semibold' : 'text-slate-300'}`}>
                        {screenshotPreview ? 'Slip Attached ✓' : 'Upload Receipt *'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {errors.screenshot && (
                    <p className="mt-0.5 text-[11px] text-rose-400 flex items-center gap-1 font-mono">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{errors.screenshot}</span>
                    </p>
                  )}
                  {screenshotPreview && (
                    <div className="mt-1 flex items-center justify-between p-1 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <img src={screenshotPreview} alt="Screenshot slip" className="w-5 h-5 rounded object-cover border border-emerald-500/40 shrink-0" />
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 truncate">
                          <CheckCircle2 className="w-3 h-3 shrink-0" /> Receipt attached
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setScreenshotPreview(null)}
                        className="text-[10px] text-slate-400 hover:text-rose-400 font-mono shrink-0 ml-2 underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA & Council Verified Note */}
            <div className="mt-1">
              <button
                type="submit"
                disabled={isVerifying}
                className={`w-full py-2.5 rounded-xl font-outfit font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 border transition-all duration-300 cursor-pointer ${
                  isVerifying
                    ? 'bg-cyber-violet/40 border-cyber-violet/60 text-slate-300 cursor-wait'
                    : 'bg-gradient-to-r from-cyber-cyan via-purple-600 to-cyber-violet text-white hover:shadow-neon-violet hover:scale-[1.01] active:scale-95 border-white/20'
                }`}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyber-cyan" />
                    <span>
                      {verificationStep === 1 && 'VERIFYING UTR ON BANK LEDGER...'}
                      {verificationStep === 2 && 'AUTHENTICATING FRESHER DETAILS...'}
                      {verificationStep === 3 && 'MINTING 3D HOLOGRAPHIC PASS...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span>VERIFY &amp; GENERATE PASS</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-200" />
                  </>
                )}
              </button>

            </div>
          </div>

        </form>
      </div>

    </section>
  );
}
