import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  User, 
  Hash, 
  GraduationCap, 
  Phone, 
  Mail, 
  FileText,
  Clock,
  Loader2
} from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { soundController } from '../utils/audio';

export default function RegistrationPayment({ onPassGenerated }) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    branch: 'Computer Science & AI',
    phone: '',
    email: '',
    diet: 'Veg',
    songRequest: '',
    utrNumber: '',
  });

  // UI state
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);

  const qrCanvasRef = useRef(null);

  const branches = [
    'Computer Science & AI',
    'Information Technology',
    'Electronics & Communication (ECE)',
    'Electrical & Electronics (EEE)',
    'Mechanical Engineering',
    'Biotechnology & Bioinformatics',
    'Aerospace & Robotics',
    'Architecture & Planning',
    'Design & Digital Media',
    'Management Studies (MBA/BBA)',
  ];

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
        width: 200,
        margin: 1.5,
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
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Mock Demo Filler for instant testing
  const fillDemoData = () => {
    soundController.playClick();
    setFormData({
      fullName: 'Aarav Sharma',
      rollNo: '26CS084',
      branch: 'Computer Science & AI',
      phone: '9876543210',
      email: 'aarav.sharma26@college.edu',
      diet: 'Veg',
      songRequest: 'Starboy - The Weeknd',
      utrNumber: '427189035124',
    });
    setScreenshotPreview('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80');
    setErrors({});
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
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.utrNumber.trim()) {
      newErrors.utrNumber = 'Transaction ID / UTR is required';
    } else if (formData.utrNumber.trim().length < 6) {
      newErrors.utrNumber = 'Enter a valid 12-digit UPI UTR / Ref ID';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      soundController.playClick();
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
      };

      onPassGenerated(generatedPass);
    }, 2800);
  };

  return (
    <section id="register" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan text-xs font-outfit font-bold uppercase mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>PORTAL GATEWAY</span>
        </div>
        <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Registration &amp; Pass Checkout
        </h2>
        <p className="mt-2 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-outfit">
          Fill your student dossier, complete payment via dynamic UPI QR, and your personalized 3D VIP pass will be rendered instantly.
        </p>

        {/* Demo Fast-Fill Button */}
        <button
          type="button"
          onClick={fillDemoData}
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-violet/20 hover:bg-cyber-violet/30 border border-cyber-violet/40 text-cyber-violet text-xs font-mono transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Fill Sample Data (Fast Demo)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Student Details Form (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 border border-white/20 bg-obsidian-950/45 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(6,182,212,0.1)]">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-outfit font-extrabold text-cyan-300 uppercase tracking-wider">STEP 1 OF 2</span>
              <h3 className="font-outfit font-bold text-2xl text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">Student Dossier</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/25 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <User className="w-5 h-5" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Full Name <span className="text-cyber-cyan">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full px-4 py-3.5 rounded-xl bg-obsidian-900/90 border ${
                    errors.fullName ? 'border-rose-500' : 'border-white/15 focus:border-cyber-cyan'
                  } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all`}
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.fullName}</p>}
            </div>

            {/* Roll Number & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Roll / Student ID <span className="text-cyber-cyan">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    placeholder="e.g. 26CS084"
                    className={`w-full px-4 py-3.5 rounded-xl bg-obsidian-900/90 border ${
                      errors.rollNo ? 'border-rose-500' : 'border-white/15 focus:border-cyber-cyan'
                    } text-white placeholder-slate-500 text-sm uppercase font-mono focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all`}
                  />
                </div>
                {errors.rollNo && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.rollNo}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Department / Branch <span className="text-cyber-cyan">*</span>
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-obsidian-900/90 border border-white/15 focus:border-cyber-cyan text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all"
                >
                  {branches.map((b) => (
                    <option key={b} value={b} className="bg-obsidian-900 text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Number & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Contact Number (WhatsApp) <span className="text-cyber-cyan">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile"
                    className={`w-full px-4 py-3.5 rounded-xl bg-obsidian-900/90 border ${
                      errors.phone ? 'border-rose-500' : 'border-white/15 focus:border-cyber-cyan'
                    } text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  College / Personal Email <span className="text-cyber-cyan">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@college.edu"
                    className={`w-full px-4 py-3.5 rounded-xl bg-obsidian-900/90 border ${
                      errors.email ? 'border-rose-500' : 'border-white/15 focus:border-cyber-cyan'
                    } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.email}</p>}
              </div>
            </div>

            {/* Diet & Song Request */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Refreshment Preference
                </label>
                <div className="flex gap-2">
                  {['Veg', 'Non-Veg', 'Jain/Vegan'].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setFormData({ ...formData, diet: item })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        formData.diet === item
                          ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  DJ Track Request (Optional)
                </label>
                <input
                  type="text"
                  name="songRequest"
                  value={formData.songRequest}
                  onChange={handleInputChange}
                  placeholder="Song name & artist"
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-900/90 border border-white/15 focus:border-cyber-cyan text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all"
                />
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Dynamic UPI Payment Gateway (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 border border-white/20 bg-obsidian-950/45 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-outfit font-extrabold text-amber-300 uppercase tracking-wider">STEP 2 OF 2</span>
              <h3 className="font-outfit font-bold text-2xl text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">UPI Payment</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyber-violet/20 via-obsidian-900 to-cyber-cyan/20 border border-white/15 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-slate-400">JUNIOR VIP PASS FEE</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-outfit font-extrabold text-3xl text-white">₹{EVENT_DETAILS.ticketPrice}</span>
                <span className="text-xs text-slate-400 line-through">₹799</span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  EARLY BIRD (50% OFF)
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic QR Code Scanner Container */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 mb-6 text-center relative group">
            <div className="p-3 bg-white rounded-2xl shadow-2xl relative">
              <canvas ref={qrCanvasRef} className="rounded-lg max-w-full block" />
              {/* Center Hologram Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-9 h-9 rounded-lg bg-obsidian-950 border border-cyber-cyan flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-cyber-cyan animate-pulse" />
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold text-white flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Scan with any UPI App</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Google Pay • PhonePe • Paytm • BHIM • CRED
            </p>

            {/* Official UPI ID Copy Widget */}
            <div className="mt-4 flex items-center gap-2 w-full max-w-xs bg-obsidian-950/80 px-3 py-2 rounded-xl border border-white/10 text-xs">
              <span className="font-mono text-slate-300 truncate flex-1">{EVENT_DETAILS.upiId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(EVENT_DETAILS.upiId)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-cyber-cyan/20 text-slate-200 hover:text-cyber-cyan transition-colors"
                title="Copy UPI ID"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Payment Verification Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                UPI Reference / UTR Number (12 Digits) <span className="text-cyber-gold">*</span>
              </label>
              <input
                type="text"
                name="utrNumber"
                value={formData.utrNumber}
                onChange={handleInputChange}
                placeholder="e.g. 427189035124"
                maxLength={18}
                className={`w-full px-4 py-3 rounded-xl bg-obsidian-900/90 border ${
                  errors.utrNumber ? 'border-rose-500' : 'border-white/15 focus:border-cyber-gold'
                } text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-gold transition-all`}
              />
              {errors.utrNumber && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.utrNumber}</p>}
            </div>

            {/* Payment Screenshot Upload */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Payment Screenshot (Optional / Instant Verification)
              </label>
              <div className="relative">
                <label className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-dashed border-white/20 hover:border-cyber-cyan/60 bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-xs text-slate-300 truncate">
                    {screenshotPreview ? 'Screenshot Attached ✓' : 'Upload Receipt / Slip'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {screenshotPreview && (
                <div className="mt-2 flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                  <img src={screenshotPreview} alt="Screenshot slip" className="w-8 h-8 rounded object-cover" />
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Receipt ready for verification
                  </span>
                </div>
              )}
            </div>

            {/* Verify & Generate Pass CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isVerifying}
                className={`w-full py-4 rounded-2xl font-outfit font-bold text-sm tracking-wider flex items-center justify-center gap-2 border transition-all duration-300 ${
                  isVerifying
                    ? 'bg-cyber-violet/40 border-cyber-violet/60 text-slate-300 cursor-wait'
                    : 'bg-gradient-to-r from-cyber-cyan via-purple-600 to-cyber-violet text-white hover:shadow-neon-violet hover:scale-[1.02] active:scale-95 border-white/20'
                }`}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyber-cyan" />
                    <span>
                      {verificationStep === 1 && 'VERIFYING UTR ON BANK LEDGER...'}
                      {verificationStep === 2 && 'AUTHENTICATING FRESHER DOSSIER...'}
                      {verificationStep === 3 && 'MINTING 3D HOLOGRAPHIC PASS...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyber-gold" />
                    <span>VERIFY & GENERATE PASS</span>
                    <ArrowRight className="w-4 h-4 text-cyan-200" />
                  </>
                )}
              </button>
            </div>

            {/* Security Guarantee Note */}
            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Official Student Council Verified • Instant Ticket Download</span>
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
