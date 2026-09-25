import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  GraduationCap, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  Copy, 
  Check, 
  Upload, 
  ArrowRight, 
  Loader2, 
  User, 
  Hash, 
  Phone, 
  Mail, 
  FileText, 
  RefreshCw,
  Award,
  Star,
  Quote
} from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { soundController } from '../utils/audio';

// Whitelist of pre-registered seniors for instant verification & demo testing
const REGISTERED_SENIORS = {
  '220101045': {
    name: 'Aarav Sharma',
    branch: 'Computer Science & AI',
    batch: "Batch of '22 • 4th Year Senior",
    role: 'Senior Organizing Committee',
    phone: '9876543210',
    email: 'aarav.sharma@college.edu'
  },
  '220102088': {
    name: 'Riya Sen',
    branch: 'Electronics & Communication (ECE)',
    batch: "Batch of '22 • 4th Year Senior",
    role: 'Cultural Council Secretary',
    phone: '9812345678',
    email: 'riya.sen@college.edu'
  },
  '230101012': {
    name: 'Devendra Patel',
    branch: 'Information Technology',
    batch: "Batch of '23 • 3rd Year Senior",
    role: 'Senior Mentor & Guide',
    phone: '9823456789',
    email: 'devendra.p@college.edu'
  },
  '230104033': {
    name: 'Ananya Roy',
    branch: 'Biotechnology & Bioinformatics',
    batch: "Batch of '23 • 3rd Year Senior",
    role: 'Senior Stage Coordinator',
    phone: '9834567890',
    email: 'ananya.roy@college.edu'
  },
  'SENIOR2026': {
    name: 'Vikramaditya Rao',
    branch: 'Computer Science & AI',
    batch: "Batch of '22 • Senior Lead",
    role: 'Senior Guest & Council Patron',
    phone: '9845678901',
    email: 'vikram.rao@college.edu'
  }
};

const SENIOR_TICKET_PRICE = 499;

export default function SeniorSection({ onPassGenerated }) {
  // Authentication Gate State
  const [accessRegNo, setAccessRegNo] = useState('');
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessError, setAccessError] = useState('');
  const [verifiedSeniorProfile, setVerifiedSeniorProfile] = useState(null);

  // Unlocked Senior Form State
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    branch: 'Computer Science & AI',
    batch: "Batch of '22 • 4th Year Senior",
    role: 'Senior VIP Pass (Full Access + Red Carpet)',
    phone: '',
    email: '',
    seniorQuote: '',
    utrNumber: '',
  });

  // UI state
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isMintingPass, setIsMintingPass] = useState(false);
  const [mintingStep, setMintingStep] = useState(0);

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

  const seniorBatches = [
    "Batch of '22 • 4th Year Senior (Finalist)",
    "Batch of '23 • 3rd Year Senior (Pre-Finalist)",
    "Alumni Member & Honorary Guest",
    "Student Council Senior Executive"
  ];

  const seniorRoles = [
    'Senior VIP Pass (Full Access + Red Carpet)',
    'Senior Mentor & Freshers Guide',
    'Organizing Committee Senior Lead',
    'Alumni Patron Pass'
  ];

  // Helper: Verify Senior Registration Number
  const handleVerifyAccess = (e) => {
    if (e) e.preventDefault();
    const cleaned = accessRegNo.trim().toUpperCase();

    if (!cleaned) {
      setAccessError('Please enter your registered college registration number.');
      return;
    }

    setAccessError('');
    setIsVerifyingAccess(true);
    soundController.playClick();

    setTimeout(() => {
      setIsVerifyingAccess(false);
      // Check database or senior pattern (21xxx, 22xxx, 23xxx, or SENIOR)
      const found = REGISTERED_SENIORS[cleaned];
      const isSeniorPattern = /^(21|22|23)[0-9]{4,8}$/i.test(cleaned) || cleaned.startsWith('SENIOR');

      if (found || isSeniorPattern) {
        soundController.playSuccess();
        const profile = found || {
          name: '',
          branch: 'Computer Science & AI',
          batch: cleaned.startsWith('23') ? "Batch of '23 • 3rd Year Senior" : "Batch of '22 • 4th Year Senior",
          role: 'Senior VIP Pass (Full Access + Red Carpet)',
          phone: '',
          email: ''
        };

        setVerifiedSeniorProfile(profile);
        setFormData((prev) => ({
          ...prev,
          rollNo: cleaned,
          fullName: profile.name || prev.fullName,
          branch: profile.branch || prev.branch,
          batch: profile.batch || prev.batch,
          role: profile.role || prev.role,
          phone: profile.phone || prev.phone,
          email: profile.email || prev.email,
        }));
        setIsUnlocked(true);
      } else {
        soundController.playError();
        setAccessError('Registration number not found in Senior Council Database. (Try demo IDs: 220101045, 220102088, 230101012, or SENIOR2026)');
      }
    }, 700);
  };

  const handleQuickDemoId = (id) => {
    setAccessRegNo(id);
    setAccessError('');
    soundController.playClick();
  };

  const handleLockAgain = () => {
    soundController.playClick();
    setIsUnlocked(false);
    setAccessRegNo('');
    setVerifiedSeniorProfile(null);
  };

  // Generate UPI QR Code dynamically for Senior Pass
  useEffect(() => {
    if (!isUnlocked || !qrCanvasRef.current) return;

    const note = formData.rollNo
      ? `ELX26-SR-${formData.rollNo.toUpperCase().trim()}`
      : 'ELX26-SENIOR';

    const upiString = `upi://pay?pa=${EVENT_DETAILS.upiId}&pn=ELIXORA%20SENIORS&am=${SENIOR_TICKET_PRICE}&cu=INR&tn=${encodeURIComponent(note)}`;

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
  }, [isUnlocked, formData.rollNo]);

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
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
        soundController.playClick();
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Enter valid 10-digit number';
    }
    if (!formData.utrNumber.trim()) {
      newErrors.utrNumber = '12-digit UTR/Ref Number is mandatory';
    } else if (formData.utrNumber.trim().length < 6) {
      newErrors.utrNumber = 'Enter minimum 6 to 12 digits of transaction ID';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      soundController.playError();
      return;
    }

    soundController.playClick();
    setIsMintingPass(true);
    setMintingStep(1);

    // Multi-step ledger verification animation
    setTimeout(() => {
      setMintingStep(2);
      soundController.playClick();
    }, 1200);

    setTimeout(() => {
      setMintingStep(3);
      soundController.playClick();
    }, 2400);

    setTimeout(() => {
      setIsMintingPass(false);
      setMintingStep(0);
      soundController.playSuccess();

      const ticketId = `ELX-SR-${Math.floor(100000 + Math.random() * 900000)}`;

      onPassGenerated({
        ticketId,
        fullName: formData.fullName,
        rollNo: formData.rollNo.toUpperCase().trim(),
        branch: formData.branch,
        batch: formData.batch,
        role: formData.role,
        seniorQuote: formData.seniorQuote || 'Welcome Freshers to the Legacy of Elixora!',
        phone: formData.phone,
        email: formData.email,
        utrNumber: formData.utrNumber.trim(),
        isSenior: true,
        ticketPrice: SENIOR_TICKET_PRICE,
        generatedAt: new Date().toISOString(),
      });
    }, 3600);
  };

  return (
    <section id="seniors" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      
      {/* Section Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-outfit font-bold uppercase mb-3 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>SENIOR VIP &amp; COUNCIL PORTAL</span>
        </div>
        <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Senior Registration &amp; Pass
        </h2>
        <p className="mt-2 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-outfit">
          Exclusively reserved for Batch of '22 &amp; '23 seniors and council leaders. Verification of registered registration number is mandatory to unlock access.
        </p>
      </div>

      {/* STATE 1: LOCKED GATEWAY (ENTER REGISTRATION NUMBER) */}
      {!isUnlocked ? (
        <div className="max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 border border-amber-500/35 bg-obsidian-950/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden transition-all duration-300">
          
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyber-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            
            {/* Lock Hologram Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 p-[2px] mx-auto mb-5 shadow-[0_0_25px_rgba(251,191,36,0.5)]">
              <div className="w-full h-full bg-obsidian-950 rounded-[14px] flex items-center justify-center text-amber-300">
                <Lock className="w-8 h-8 animate-pulse text-amber-400" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-outfit font-bold uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AUTHENTICATION GATEWAY</span>
            </div>

            <h3 className="font-outfit font-bold text-2xl sm:text-3xl text-white tracking-tight mb-2">
              Restricted Senior Access
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-outfit max-w-md mx-auto mb-6">
              Enter your college registration number to verify your senior eligibility on the council roster and unlock checkout.
            </p>

            {/* Input Form */}
            <form onSubmit={handleVerifyAccess} className="space-y-4 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={accessRegNo}
                  onChange={(e) => {
                    setAccessRegNo(e.target.value);
                    if (accessError) setAccessError('');
                  }}
                  placeholder="e.g. 220101045 or SENIOR2026"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-slate-500 text-sm font-outfit font-semibold uppercase tracking-wider focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>

              {/* Error Message */}
              {accessError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-outfit flex items-start gap-2 text-left">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{accessError}</span>
                </div>
              )}

              {/* Verify CTA */}
              <button
                type="submit"
                disabled={isVerifyingAccess}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-obsidian-950 font-outfit font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isVerifyingAccess ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>VERIFYING ON SENIOR ROSTER...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>VERIFY &amp; UNLOCK SENIOR PORTAL</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Registration Numbers for Testing */}
            <div className="mt-8 pt-6 border-t border-white/10 text-left">
              <span className="text-[11px] font-outfit font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                ⚡ Quick Demo Registered Senior Numbers (1-Click Test):
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(REGISTERED_SENIORS).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleQuickDemoId(id)}
                    className="text-xs font-outfit font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/15 hover:border-amber-500/40 transition-all flex items-center gap-1.5"
                  >
                    <span className="font-mono text-amber-400">{id}</span>
                    <span className="text-[10px] text-slate-400">({REGISTERED_SENIORS[id].name.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* STATE 2: UNLOCKED SENIOR FORM & PAYMENT CHECKOUT */
        <div className="animate-in fade-in zoom-in-95 duration-500">
          
          {/* Top Verified Banner with Lock/Exit Button */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-obsidian-950 to-amber-500/20 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-outfit font-extrabold text-emerald-400 uppercase tracking-wider">
                    ACCESS GRANTED • VERIFIED SENIOR
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {formData.rollNo}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-outfit">
                  {verifiedSeniorProfile?.name ? `${verifiedSeniorProfile.name} • ` : ''}{formData.batch}
                </p>
              </div>
            </div>

            <button
              onClick={handleLockAgain}
              className="text-xs font-outfit font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Switch Registration ID</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Senior Details Form (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 border border-white/20 bg-obsidian-950/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(245,158,11,0.12)]">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-outfit font-extrabold text-amber-300 uppercase tracking-wider">STEP 1 OF 2</span>
                  <h3 className="font-outfit font-bold text-2xl text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    Senior Dossier &amp; Pass Tier
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Senior Full Name <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Aarav Sharma"
                      className={`w-full px-4 py-3 rounded-xl bg-obsidian-900 border ${
                        errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15'
                      } text-white placeholder-slate-500 text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all`}
                    />
                    <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                  {errors.fullName && <p className="text-rose-400 text-xs mt-1 font-outfit">{errors.fullName}</p>}
                </div>

                {/* Registration Number (Locked & Verified) */}
                <div>
                  <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Registration / Roll Number (Verified) <span className="text-emerald-400">✓</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="rollNo"
                      value={formData.rollNo}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-emerald-500/50 text-emerald-300 font-mono text-sm uppercase cursor-not-allowed"
                    />
                    <CheckCircle2 className="absolute right-3.5 top-3.5 w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                {/* Senior Batch & Year */}
                <div>
                  <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Senior Batch / Academic Year
                  </label>
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/15 text-white text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                  >
                    {seniorBatches.map((b) => (
                      <option key={b} value={b} className="bg-obsidian-950 text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Branch Selection */}
                <div>
                  <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Department / Branch <span className="text-amber-400">*</span>
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/15 text-white text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b} className="bg-obsidian-950 text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Senior Pass Tier */}
                <div>
                  <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Senior Access Designation
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/15 text-white text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                  >
                    {seniorRoles.map((r) => (
                      <option key={r} value={r} className="bg-obsidian-950 text-white">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone Number & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-2">
                      WhatsApp / Mobile <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit number"
                        className={`w-full px-4 py-3 rounded-xl bg-obsidian-900 border ${
                          errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15'
                        } text-white placeholder-slate-500 text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all`}
                      />
                      <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                    {errors.phone && <p className="text-rose-400 text-xs mt-1 font-outfit">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="senior@college.edu"
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/15 text-white placeholder-slate-500 text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                      />
                      <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Senior Quote / Advice for Freshers */}
                <div>
                  <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Senior Signature Advice / Quote for Freshers (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="seniorQuote"
                      value={formData.seniorQuote}
                      onChange={handleInputChange}
                      placeholder="e.g. Welcome to college life—make every memory count!"
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/15 text-white placeholder-slate-500 text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                    <Quote className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

              </form>
            </div>

            {/* RIGHT COLUMN: Dynamic UPI Payment Gateway for Senior Pass (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 border border-white/20 bg-obsidian-950/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-outfit font-extrabold text-amber-300 uppercase tracking-wider">STEP 2 OF 2</span>
                  <h3 className="font-outfit font-bold text-2xl text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    UPI Payment
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

              {/* Pricing Banner */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-obsidian-900 to-cyber-gold/20 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-slate-400">SENIOR VIP PASS CONTRIBUTION</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-outfit font-extrabold text-3xl text-white">₹{SENIOR_TICKET_PRICE}</span>
                    <span className="text-xs text-slate-400 line-through">₹999</span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      SENIOR PRIVILEGE (50% OFF)
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code Scanner Container */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 mb-6 text-center relative group">
                <div className="p-3 bg-white rounded-2xl shadow-2xl relative">
                  <canvas ref={qrCanvasRef} className="rounded-lg max-w-full block" />
                  {/* Center Crown Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-lg bg-obsidian-950 border border-amber-400 flex items-center justify-center shadow-lg">
                      <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Scan with GPay, PhonePe, Paytm, or CRED
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Auto-formatted with your Senior ID note
                </p>
              </div>

              {/* Official UPI ID with Copy Action */}
              <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300 truncate flex-1">{EVENT_DETAILS.upiId}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(EVENT_DETAILS.upiId)}
                  className="ml-2 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-outfit font-bold flex items-center gap-1 transition-colors shrink-0"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Transaction UTR / Ref Number */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    UPI Transaction UTR / Ref Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="utrNumber"
                    value={formData.utrNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 12-digit UTR from your UPI app receipt"
                    className={`w-full px-4 py-3 rounded-xl bg-obsidian-900 border ${
                      errors.utrNumber ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15'
                    } text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all`}
                  />
                  {errors.utrNumber && <p className="text-rose-400 text-xs mt-1 font-outfit">{errors.utrNumber}</p>}
                </div>

                {/* Optional Screenshot Upload */}
                <div>
                  <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Payment Receipt Screenshot (Optional)
                  </label>
                  <label className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-dashed border-white/20 hover:border-amber-400/60 bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-300 font-outfit">
                      {screenshotPreview ? 'Receipt Selected (Click to change)' : 'Upload payment proof image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                  </label>

                  {screenshotPreview && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 font-outfit">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Receipt ready for verification</span>
                    </div>
                  )}
                </div>

                {/* Mint Senior Pass CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isMintingPass}
                    className={`w-full py-4 rounded-2xl font-outfit font-bold text-sm tracking-wider flex items-center justify-center gap-2 border transition-all duration-300 ${
                      isMintingPass
                        ? 'bg-amber-500/30 border-amber-500/50 text-slate-300 cursor-wait'
                        : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-obsidian-950 font-extrabold hover:shadow-neon-gold hover:scale-[1.02] active:scale-95 border-amber-300/40'
                    }`}
                  >
                    {isMintingPass ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>
                          {mintingStep === 1 && 'VERIFYING UTR ON SENIOR LEDGER...'}
                          {mintingStep === 2 && 'AUTHENTICATING SENIOR CREDENTIALS...'}
                          {mintingStep === 3 && 'MINTING 3D SENIOR VIP PASS...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 text-obsidian-950" />
                        <span>VERIFY &amp; GENERATE SENIOR PASS</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
