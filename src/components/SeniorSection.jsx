import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  Copy, 
  Check, 
  Upload, 
  ArrowRight, 
  Loader2, 
  User, 
  Hash, 
  Smartphone,
  AlertCircle,
  X
} from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { soundController } from '../utils/audio';

// Official authorized roster of registered seniors
const REGISTERED_SENIORS = {
  '25110039': { name: 'Anandita Mohanty', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110040': { name: 'Ankita Priyadarshini', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110041': { name: 'Anwesha Mishra', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110042': { name: 'Arpita Sahoo', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110043': { name: 'Astha Agrawalla', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110044': { name: 'Ayushman Mahapatra', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110045': { name: 'Barenya Ranjan Acharya', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110046': { name: 'Bhabani Shankar Soren', branch: 'Biotechnology', batch: "Batch of '25 • Senior Lead" },
  '25110047': { name: 'Bishnupriya Sahu', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110048': { name: 'Biswaranjan Sahoo', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110049': { name: 'D Niharika Patra', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110050': { name: 'Deepsikha Biswal', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110051': { name: 'Devika Tripathy', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110052': { name: 'Dipesh Behera', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110053': { name: 'Ipsita Bhol', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110054': { name: 'Jayasmita Rout', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110055': { name: 'Jigyansha Mishra', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110056': { name: 'Lipsita Dash', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110057': { name: 'Lokesh Kumar Nayak', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110058': { name: 'Mahek Habib', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110059': { name: 'Minati Soren', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110060': { name: 'Omm Prakash Sahoo', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110061': { name: 'Piyush Kumar Dash', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110062': { name: 'Prachiranjan Biswal', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110063': { name: 'Prateek Kumar Mallick', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110064': { name: 'Pratik Priyadarshan Nayak', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110065': { name: 'Priyambada Acharya', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110066': { name: 'Ritesh Seth', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110067': { name: 'Rohan Kumar Rana', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110068': { name: 'Rohan Pradhan', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110069': { name: 'Rohit Kumar Sahoo', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110070': { name: 'Ruturaj Singh', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110071': { name: 'Sahil Agrawal', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110072': { name: 'Sambit Kumar Sahu', branch: 'Biotechnology', batch: "Batch of '25 • Senior" }
};

const SENIOR_TICKET_PRICE = 499;

export default function SeniorSection({ onPassGenerated, onPortalToggle }) {
  // Authentication Gate State
  const [accessRegNo, setAccessRegNo] = useState('');
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessError, setAccessError] = useState('');
  const [verifiedSeniorProfile, setVerifiedSeniorProfile] = useState(null);

  // Senior Form State
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    phone: '',
    diet: 'Veg',
    branch: 'Biotechnology',
    batch: "Batch of '25 • Senior",
    role: 'Senior VIP Pass (Full Access + Red Carpet)',
    seniorQuote: '',
    utrNumber: '',
  });

  // UI state
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [isMintingPass, setIsMintingPass] = useState(false);
  const [mintingStep, setMintingStep] = useState(0);

  const qrCanvasRef = useRef(null);

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedRoll = sessionStorage.getItem('elixora_senior_roll');
      if (savedRoll && REGISTERED_SENIORS[savedRoll]) {
        const found = REGISTERED_SENIORS[savedRoll];
        setVerifiedSeniorProfile(found);
        setFormData((prev) => ({
          ...prev,
          rollNo: savedRoll,
          fullName: found.name,
          branch: found.branch || 'Biotechnology',
          batch: found.batch || "Batch of '25 • Senior",
          role: 'Senior VIP Pass (Full Access + Red Carpet)',
        }));
        setIsUnlocked(true);
      }
    } catch (e) {
      console.warn('Session storage read error:', e);
    }
  }, []);

  // Ensure active senior profile data (branch, batch, name) stays synced with official roster
  useEffect(() => {
    if (formData.rollNo && REGISTERED_SENIORS[formData.rollNo]) {
      const senior = REGISTERED_SENIORS[formData.rollNo];
      setVerifiedSeniorProfile(senior);
      setFormData((prev) => {
        if (prev.branch !== senior.branch || prev.batch !== senior.batch) {
          return {
            ...prev,
            branch: senior.branch,
            batch: senior.batch || prev.batch,
            fullName: senior.name || prev.fullName,
          };
        }
        return prev;
      });
    }
  }, [formData.rollNo]);

  // Notify parent if portal toggle callback provided
  useEffect(() => {
    onPortalToggle?.(isUnlocked);
  }, [isUnlocked, onPortalToggle]);

  // Generate UPI QR Code dynamically whenever rollNo or isUnlocked changes
  useEffect(() => {
    if (!isUnlocked || !qrCanvasRef.current) return;

    const timer = setTimeout(() => {
      if (!qrCanvasRef.current) return;

      const note = formData.rollNo
        ? `ELX26-SR-${formData.rollNo.toUpperCase().trim()}`
        : 'ELX26-SENIOR';

      const upiString = `upi://pay?pa=${EVENT_DETAILS.upiId}&pn=ELIXORA%20SENIORS&am=${SENIOR_TICKET_PRICE}&cu=INR&tn=${encodeURIComponent(note)}`;

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
    }, 50);

    return () => clearTimeout(timer);
  }, [isUnlocked, formData.rollNo]);

  // Handle Verify Senior Access
  const handleVerifyAccess = (e) => {
    if (e) e.preventDefault();
    const cleaned = accessRegNo.trim().toUpperCase();

    if (!cleaned) {
      setAccessError('Please enter your registered college registration number.');
      soundController.playError?.();
      return;
    }

    setAccessError('');
    setIsVerifyingAccess(true);
    soundController.playClick?.();

    setTimeout(() => {
      setIsVerifyingAccess(false);

      const found = REGISTERED_SENIORS[cleaned];
      if (!found) {
        soundController.playError?.();
        setAccessError(`Registration number "${cleaned}" is not on the official senior list. Access is strictly restricted to registered seniors.`);
        return;
      }

      soundController.playSuccess?.();
      setVerifiedSeniorProfile(found);
      setFormData((prev) => ({
        ...prev,
        rollNo: cleaned,
        fullName: found.name,
        branch: found.branch || 'Biotechnology',
        batch: found.batch || "Batch of '25 • Senior",
        role: 'Senior VIP Pass (Full Access + Red Carpet)',
      }));

      try {
        sessionStorage.setItem('elixora_senior_roll', cleaned);
      } catch (err) {}

      setIsUnlocked(true);
    }, 500);
  };

  const handleLockAgain = () => {
    soundController.playClick?.();
    setIsUnlocked(false);
    setAccessRegNo('');
    setVerifiedSeniorProfile(null);
    try {
      sessionStorage.removeItem('elixora_senior_roll');
    } catch (err) {}
  };

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
    soundController.playClick?.();
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
        soundController.playClick?.();
        if (errors.screenshot) {
          setErrors((prev) => ({ ...prev, screenshot: null }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotPreview(null);
    setScreenshotFileName('');
    soundController.playClick?.();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.rollNo.trim()) {
      newErrors.rollNo = 'College Roll / Student ID is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
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
    if (e) e.preventDefault();

    if (!validateForm()) {
      soundController.playError?.();
      return;
    }

    soundController.playClick?.();
    setIsMintingPass(true);
    setMintingStep(1);

    setTimeout(() => {
      setMintingStep(2);
      soundController.playClick?.();
    }, 1000);

    setTimeout(() => {
      setMintingStep(3);
      soundController.playClick?.();
    }, 2000);

    setTimeout(() => {
      setIsMintingPass(false);
      setMintingStep(0);
      soundController.playPassCelebration?.();

      const ticketId = `ELX-SR-${Math.floor(100000 + Math.random() * 900000)}`;

      const generatedPass = {
        ...formData,
        branch: (formData.rollNo && REGISTERED_SENIORS[formData.rollNo]?.branch) || verifiedSeniorProfile?.branch || 'Biotechnology',
        batch: (formData.rollNo && REGISTERED_SENIORS[formData.rollNo]?.batch) || verifiedSeniorProfile?.batch || formData.batch,
        ticketId,
        tier: 'VIP SENIOR ACCESS',
        entryGate: 'Red Carpet Arch (Senior Gate 1)',
        tableZone: 'Senior Executive Lounge & Floor VIP',
        issuedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        seniorQuote: formData.seniorQuote || 'Welcome Freshers to the Legacy of OUTR!',
        screenshot: screenshotPreview,
        isSenior: true,
        ticketPrice: SENIOR_TICKET_PRICE,
        generatedAt: new Date().toISOString(),
      };

      onPassGenerated?.(generatedPass);
    }, 3000);
  };

  // Real-time resolved senior branch & batch guaranteed to match official roster
  const displayBranch = (formData.rollNo && REGISTERED_SENIORS[formData.rollNo]?.branch) 
    || verifiedSeniorProfile?.branch 
    || (formData.branch && !formData.branch.includes('Computer') ? formData.branch : 'Biotechnology');
  const displayBatch = (formData.rollNo && REGISTERED_SENIORS[formData.rollNo]?.batch)
    || verifiedSeniorProfile?.batch
    || formData.batch;

  return (
    <section id="seniors" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-outfit font-bold uppercase mb-3 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>SENIOR VIP &amp; COUNCIL PORTAL</span>
        </div>
        <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Senior Registration &amp; Pass
        </h2>
        <p className="mt-2 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-outfit">
          Exclusively reserved for college seniors and council leaders. Verification of registered registration number is mandatory to unlock access.
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
                  placeholder="Enter Registration No."
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-slate-500 text-sm font-outfit font-semibold uppercase tracking-wider focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>

              {/* Error Message */}
              {accessError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-outfit flex items-start gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{accessError}</span>
                </div>
              )}

              {/* Verify CTA */}
              <button
                type="submit"
                disabled={isVerifyingAccess}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-obsidian-950 font-outfit font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
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

          </div>
        </div>
      ) : (
        /* STATE 2: UNLOCKED SENIOR PAYMENT INTERFACE (MATCHES TWO-COLUMN FRESHERS DESIGN) */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Senior Verified Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-obsidian-950/60 border border-emerald-500/30 backdrop-blur-xl max-w-5xl mx-auto shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    SENIOR VERIFIED
                  </span>
                  <span className="text-sm font-outfit font-bold text-white">
                    {formData.fullName} ({formData.rollNo})
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-outfit">
                  {displayBranch} • {displayBatch}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLockAgain}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-outfit font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Switch Roll No</span>
            </button>
          </div>

          {/* TWO-COLUMN SIDE-BY-SIDE PAYMENT GRID (EXACT LAYOUT FROM SCREENSHOT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto">
            
            {/* LEFT COLUMN: Senior Details Form (50% Width) */}
            <div className="flex flex-col justify-between rounded-3xl p-5 sm:p-6 border border-white/20 bg-obsidian-950/45 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(6,182,212,0.1)] h-full">
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
                <div>
                  <span className="text-xs font-outfit font-extrabold text-cyan-300 uppercase tracking-wider">STEP 1 OF 2</span>
                  <h3 className="font-outfit font-bold text-2xl text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">Student Details</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/25 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                  <User className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div className="flex-1 flex flex-col justify-between space-y-3.5 lg:space-y-0">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                      Full Name <span className="text-cyber-cyan">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Aarav Sharma"
                        className={`w-full px-4 py-2.5 rounded-xl bg-obsidian-900/90 border ${
                          errors.fullName ? 'border-rose-500' : 'border-white/15 focus:border-cyber-cyan'
                        } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all`}
                      />
                    </div>
                    {errors.fullName && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.fullName}</p>}
                  </div>

                  {/* Roll / Student ID */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                      Roll / Student ID <span className="text-cyber-cyan">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="rollNo"
                        value={formData.rollNo}
                        readOnly
                        placeholder="e.g. 26CS084"
                        className="w-full px-4 py-2.5 rounded-xl bg-obsidian-900/90 border border-emerald-500/40 text-emerald-300 placeholder-slate-500 text-sm uppercase font-mono focus:outline-none transition-all cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        ✓ Verified
                      </span>
                    </div>
                    {errors.rollNo && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.rollNo}</p>}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                      Contact Number (WhatsApp) <span className="text-cyber-cyan">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile"
                        className={`w-full px-4 py-2.5 rounded-xl bg-obsidian-900/90 border ${
                          errors.phone ? 'border-rose-500' : 'border-white/15 focus:border-cyber-cyan'
                        } text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all`}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.phone}</p>}
                  </div>

                  {/* Refreshment Preference */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                      Refreshment Preference
                    </label>
                    <div className="flex gap-2">
                      {['Veg', 'Non-Veg', 'Jain/Vegan'].map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => {
                            soundController.playClick?.();
                            setFormData((prev) => ({ ...prev, diet: item }));
                          }}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
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
              </form>
            </div>

            {/* RIGHT COLUMN: Dynamic UPI Payment Gateway (50% Width) */}
            <div className="flex flex-col justify-between rounded-3xl p-5 sm:p-6 border border-white/20 bg-obsidian-950/45 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden h-full">
              
              <div>
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
                  <div>
                    <span className="text-xs font-outfit font-extrabold text-amber-300 uppercase tracking-wider">STEP 2 OF 2</span>
                    <h3 className="font-outfit font-bold text-2xl text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">UPI Payment</h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/25 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>

                {/* Compact Payment Info: QR Code + Price & UPI ID */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-3 flex flex-col sm:flex-row items-center gap-3.5">
                  {/* QR Code Canvas */}
                  <div className="p-2 bg-white rounded-xl shadow-xl shrink-0 relative">
                    <canvas ref={qrCanvasRef} className="rounded-lg block" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-6 h-6 rounded-lg bg-obsidian-950 border border-cyber-cyan flex items-center justify-center shadow-lg">
                        <Sparkles className="w-3 h-3 text-cyber-cyan animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Price & UPI Details */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="font-outfit font-extrabold text-2xl text-white">₹{SENIOR_TICKET_PRICE}</span>
                      <span className="text-xs text-slate-400 line-through">₹799</span>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        50% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-1 mb-2">
                      <Smartphone className="w-3 h-3 text-cyber-cyan shrink-0" />
                      <span>Scan with GPay, PhonePe, Paytm</span>
                    </p>
                    {/* Official UPI ID Copy Widget */}
                    <div className="flex items-center gap-2 bg-obsidian-950/80 px-2.5 py-1 rounded-xl border border-white/10 text-xs">
                      <span className="font-mono text-slate-300 truncate flex-1 text-[11px]">{EVENT_DETAILS.upiId}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(EVENT_DETAILS.upiId)}
                        className="p-1 rounded-lg bg-white/10 hover:bg-cyber-cyan/20 text-slate-200 hover:text-cyber-cyan transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Verification Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    UPI Reference / UTR Number (12 Digits) <span className="text-cyber-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="utrNumber"
                    value={formData.utrNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 427189035124"
                    maxLength={18}
                    className={`w-full px-4 py-2.5 rounded-xl bg-obsidian-900/90 border ${
                      errors.utrNumber ? 'border-rose-500' : 'border-white/15 focus:border-cyber-gold'
                    } text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-gold transition-all`}
                  />
                  {errors.utrNumber && <p className="mt-1 text-xs text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.utrNumber}</p>}
                </div>

                {/* Payment Screenshot Upload */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Payment Screenshot (Optional / Instant Verification)
                  </label>
                  <div className="relative">
                    <label className="flex items-center justify-center gap-3 w-full py-2 px-4 rounded-xl border border-dashed border-white/20 hover:border-cyber-cyan/60 bg-white/5 hover:bg-white/10 cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-cyber-cyan" />
                      <span className="text-xs text-slate-300 truncate">
                        {screenshotPreview ? 'Screenshot Attached ✓' : 'Upload Receipt / Slip'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {screenshotPreview && (
                    <div className="mt-1.5 flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={screenshotPreview} alt="Screenshot slip" className="w-7 h-7 rounded object-cover" />
                        <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Receipt ready for verification
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveScreenshot}
                        className="p-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 cursor-pointer text-xs"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Verify & Generate Pass CTA Button */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isMintingPass}
                    className={`w-full py-2.5 rounded-2xl font-outfit font-bold text-sm tracking-wider flex items-center justify-center gap-2 border transition-all duration-300 cursor-pointer ${
                      isMintingPass
                        ? 'bg-cyber-violet/40 border-cyber-violet/60 text-slate-300 cursor-wait'
                        : 'bg-gradient-to-r from-cyber-cyan via-purple-600 to-cyber-violet text-white hover:shadow-neon-violet hover:scale-[1.02] active:scale-95 border-white/20 shadow-lg'
                    }`}
                  >
                    {isMintingPass ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-cyber-cyan" />
                        <span>
                          {mintingStep === 1 && 'VERIFYING UTR ON SENIOR LEDGER...'}
                          {mintingStep === 2 && 'AUTHENTICATING SENIOR DETAILS...'}
                          {mintingStep === 3 && 'MINTING 3D SENIOR VIP PASS...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-cyber-gold" />
                        <span>VERIFY &amp; GENERATE PASS</span>
                        <ArrowRight className="w-4 h-4 text-cyan-200" />
                      </>
                    )}
                  </button>
                </div>

                {/* Security Guarantee Note */}
                <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyber-cyan" />
                  <span>Official Student Council Verified • Instant Ticket Download</span>
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}
