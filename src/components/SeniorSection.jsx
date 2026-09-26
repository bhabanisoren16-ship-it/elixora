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
  Quote,
  X,
  ExternalLink,
  Image as ImageIcon,
  CheckCheck
} from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { soundController } from '../utils/audio';

// Official authorized roster of registered seniors
const REGISTERED_SENIORS = {
  '25110039': { name: 'Anandita Mohanty', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110040': { name: 'Ankita Priyadarshini', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110041': { name: 'Anwesha Mishra', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110042': { name: 'Arpita Sahoo', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110043': { name: 'Astha Agrawalla', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110044': { name: 'Ayushman Mahapatra', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110045': { name: 'Barenya Ranjan Acharya', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110046': { name: 'Bhabani Shankar Soren', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior Lead" },
  '25110047': { name: 'Bishnupriya Sahu', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110048': { name: 'Biswaranjan Sahoo', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110049': { name: 'D Niharika Patra', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110050': { name: 'Deepsikha Biswal', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110051': { name: 'Devika Tripathy', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110052': { name: 'Dipesh Behera', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110053': { name: 'Ipsita Bhol', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110054': { name: 'Jayasmita Rout', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110055': { name: 'Jigyansha Mishra', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110056': { name: 'Lipsita Dash', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110057': { name: 'Lokesh Kumar Nayak', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110058': { name: 'Mahek Habib', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110059': { name: 'Manas Pritam Sahoo', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110060': { name: 'Manoswani Lenka', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110061': { name: 'Nirup Sundar Muduli', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110062': { name: 'Paurnamashi Samal', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110063': { name: 'Prateek Sahu', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110064': { name: 'Priyadarshani Malik', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110065': { name: 'S Saiman Satyajit', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110066': { name: 'S Shubhashree Swain', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110067': { name: 'Sai Sourav Khandual', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110068': { name: 'Samikshya Padhy', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110069': { name: 'Sangram Kumar Sahu', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110070': { name: 'Shradhashine Parida', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110071': { name: 'Soumyajeet Panda', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110072': { name: 'Soyal Parija', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110073': { name: 'Swagat Panda', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110074': { name: 'Swatiprava Sahoo', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110075': { name: 'Turvi Bhuyan', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110076': { name: 'Bhaswati Mishra', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '25110077': { name: 'Prabhuprasad Jena', branch: 'Computer Science & Engineering', batch: "Batch of '25 • Senior" },
  '24110033': { name: 'Subrat Dhal', branch: 'Computer Science & Engineering', batch: "Batch of '24 • Senior" }
};

const SENIOR_TICKET_PRICE = 499;

export default function SeniorSection({ onPassGenerated }) {
  // Authentication Gate State
  const [accessRegNo, setAccessRegNo] = useState('');
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [accessError, setAccessError] = useState('');
  const [verifiedSeniorProfile, setVerifiedSeniorProfile] = useState(null);

  // Senior Form State
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    branch: 'Computer Science & Engineering',
    batch: "Batch of '25 • Senior",
    role: 'Senior VIP Pass (Full Access + Red Carpet)',
    phone: '',
    email: '',
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

  const branches = [
    'Computer Science & Engineering',
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
    "Batch of '25 • Senior",
    "Batch of '24 • Senior",
    "Batch of '23 • Senior",
    "Student Council Senior Executive"
  ];

  const seniorRoles = [
    'Senior VIP Pass (Full Access + Red Carpet)',
    'Senior Mentor & Freshers Guide',
    'Organizing Committee Senior Lead',
    'Council Senior Patron'
  ];

  // Helper: Verify Senior Registration Number strictly against the authorized roster
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

      // STRICT CHECK: Only match with the registered registration numbers provided
      const found = REGISTERED_SENIORS[cleaned];

      if (!found) {
        soundController.playError?.();
        setAccessError(`Registration number "${cleaned}" is not on the official senior list. Access is strictly restricted to registered seniors.`);
        return;
      }

      soundController.playSuccess?.();

      const profile = {
        name: found.name,
        branch: found.branch || 'Computer Science & Engineering',
        batch: found.batch || "Batch of '25 • Senior",
        role: 'Senior VIP Pass (Full Access + Red Carpet)',
        phone: '',
        email: ''
      };

      setVerifiedSeniorProfile(profile);
      setFormData((prev) => ({
        ...prev,
        rollNo: cleaned,
        fullName: profile.name,
        branch: profile.branch,
        batch: profile.batch,
        role: profile.role,
      }));

      setIsUnlocked(true);
      setIsPortalOpen(true);
    }, 500);
  };

  const handleLockAgain = () => {
    soundController.playClick();
    setIsUnlocked(false);
    setIsPortalOpen(false);
    setAccessRegNo('');
    setVerifiedSeniorProfile(null);
  };

  // Generate UPI QR Code dynamically for Senior Pass
  useEffect(() => {
    if (!isPortalOpen) return;

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
          width: 220,
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
    }, 60);

    return () => clearTimeout(timer);
  }, [isPortalOpen, formData.rollNo]);

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
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB limit');
        return;
      }
      setScreenshotFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
        soundController.playClick();
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
    soundController.playClick();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your WhatsApp contact number';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.utrNumber.trim()) {
      newErrors.utrNumber = 'Please enter the UPI Transaction / UTR number';
    } else if (formData.utrNumber.trim().length < 6) {
      newErrors.utrNumber = 'Please enter a valid 12-digit UPI UTR reference number';
    }

    if (!screenshotPreview) {
      newErrors.screenshot = 'Please attach your payment screenshot / receipt proof';
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
      setIsPortalOpen(false); // Close portal modal
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

          </div>
        </div>
      ) : (
        /* STATE 2: UNLOCKED SENIOR ACCESS CARD (CLICK TO OPEN DEDICATED PORTAL) */
        <div className="max-w-3xl mx-auto rounded-3xl p-6 sm:p-8 border border-emerald-500/40 bg-obsidian-950/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-outfit font-bold uppercase mb-1">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>REGISTRATION VERIFIED</span>
                </div>
                <h3 className="font-outfit font-extrabold text-2xl text-white">
                  Senior Portal Unlocked
                </h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Registration ID: <span className="text-amber-300 font-bold">{formData.rollNo}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  soundController.playClick();
                  setIsPortalOpen(true);
                }}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-obsidian-950 font-outfit font-extrabold text-sm tracking-wide shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-obsidian-950" />
                <span>OPEN SENIOR PORTAL (DETAILS &amp; PAYMENT)</span>
              </button>

              <button
                type="button"
                onClick={handleLockAgain}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 text-xs font-outfit font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Switch ID</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* DEDICATED SENIOR VIP PORTAL MODAL (DETAILS + BARCODE PAYMENT + PROOF ATTACH) */}
      {/* ========================================================================= */}
      {isPortalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
          
          <div className="relative w-full max-w-5xl bg-obsidian-950/95 border border-amber-500/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.25)] overflow-hidden my-auto">
            
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Portal Top Bar */}
            <div className="relative z-10 px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 p-[2px] shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center text-amber-300">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-outfit font-extrabold text-lg sm:text-xl text-white">
                      ELIXORA 2.0 • SENIOR VIP PORTAL
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      VERIFIED: {formData.rollNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-outfit">
                    Fill Senior Dossier, Pay on Barcode, and Attach Payment Proof
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  soundController.playClick();
                  setIsPortalOpen(false);
                }}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Close Portal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Navigation Pill Indicator */}
            <div className="px-6 py-3 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-outfit font-semibold text-slate-400">
              <div className="flex items-center gap-2 text-amber-300">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-300 font-bold">1</span>
                <span>Fill Senior Details</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
              <div className="flex items-center gap-2 text-amber-300">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-300 font-bold">2</span>
                <span>Pay Money on Given Barcode</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
              <div className="flex items-center gap-2 text-amber-300">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-300 font-bold">3</span>
                <span>Attach Payment Proof &amp; Mint Pass</span>
              </div>
            </div>

            {/* Portal Main Body Grid */}
            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* ================================================================= */}
                {/* SECTION 1: SENIOR DETAILS FORM (7 Columns) */}
                {/* ================================================================= */}
                <div className="lg:col-span-7 space-y-5 bg-white/[0.02] p-5 sm:p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="font-outfit font-bold text-lg text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" />
                      <span>Senior Personal Details</span>
                    </h4>
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                      STEP 1 OF 3
                    </span>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
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
                    <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Registered College Roll / Registration No. <span className="text-emerald-400 font-bold">✓ (Verified)</span>
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

                  {/* Senior Batch & Branch in Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Senior Batch / Year
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

                    <div>
                      <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Department / Branch
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
                  </div>

                  {/* Senior Access Designation */}
                  <div>
                    <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Senior Access Privilege
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

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        WhatsApp Contact <span className="text-amber-400">*</span>
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
                      <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        College Email (Optional)
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

                  {/* Senior Advice / Wisdom Quote */}
                  <div>
                    <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Senior Advice / Message for Freshers (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="seniorQuote"
                        value={formData.seniorQuote}
                        onChange={handleInputChange}
                        placeholder="e.g. Dream big, stay focused, and cherish every single moment!"
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/15 text-white placeholder-slate-500 text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                      />
                      <Quote className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* ================================================================= */}
                {/* SECTION 2 & 3: PAY ON GIVEN BARCODE & ATTACH PAYMENT PROOF (5 Cols) */}
                {/* ================================================================= */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* BARCODE CARD */}
                  <div className="bg-white/[0.02] p-5 sm:p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                      <h4 className="font-outfit font-bold text-lg text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span>Pay on Given Barcode</span>
                      </h4>
                      <span className="text-[11px] font-mono text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                        STEP 2
                      </span>
                    </div>

                    {/* Amount & Privilege Tag */}
                    <div className="flex items-baseline justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">SENIOR PASS AMOUNT</span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-outfit font-extrabold text-2xl text-white">₹{SENIOR_TICKET_PRICE}</span>
                          <span className="text-xs text-slate-400 line-through">₹999</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        VIP PASS
                      </span>
                    </div>

                    {/* Given Barcode (QR Code) Canvas Container */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 text-center mb-4">
                      <div className="p-2.5 bg-white rounded-2xl shadow-xl relative inline-block">
                        <canvas ref={qrCanvasRef} className="rounded-lg max-w-full block" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-8 h-8 rounded-lg bg-obsidian-950 border border-amber-400 flex items-center justify-center shadow-lg">
                            <Crown className="w-4 h-4 text-amber-400" />
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-white">
                        Scan with GPay, PhonePe, Paytm, or BHIM
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Ref: ELX26-SR-{formData.rollNo}
                      </span>
                    </div>

                    {/* Copy UPI ID */}
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
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
                  </div>

                  {/* ATTACH PAYMENT PROOF CARD */}
                  <div className="bg-white/[0.02] p-5 sm:p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                      <h4 className="font-outfit font-bold text-lg text-white flex items-center gap-2">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>Attach Payment Proof</span>
                      </h4>
                      <span className="text-[11px] font-mono text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                        STEP 3
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Screenshot File Upload */}
                      <div>
                        <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Payment Screenshot / Receipt Proof <span className="text-amber-400">*</span>
                        </label>
                        
                        {!screenshotPreview ? (
                          <label className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed ${
                            errors.screenshot ? 'border-rose-500 bg-rose-500/5' : 'border-white/20 hover:border-amber-400/60 bg-white/5 hover:bg-white/10'
                          } cursor-pointer transition-all text-center group`}>
                            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-2 group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-outfit font-bold text-white mb-0.5">
                              Click to browse or drop payment receipt
                            </span>
                            <span className="text-[11px] text-slate-400 font-outfit">
                              Supports JPG, PNG (Max 8MB)
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleScreenshotChange}
                              className="hidden"
                            />
                          </label>
                        ) : (
                          <div className="p-3 rounded-xl bg-obsidian-900 border border-emerald-500/40 relative">
                            <div className="flex items-center gap-3">
                              <img
                                src={screenshotPreview}
                                alt="Payment Proof"
                                className="w-14 h-14 rounded-lg object-cover border border-white/20"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-outfit font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Proof Attached</span>
                                </div>
                                <p className="text-xs text-slate-300 font-mono truncate mt-0.5">
                                  {screenshotFileName || 'receipt_screenshot.png'}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveScreenshot}
                                className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                                title="Remove screenshot"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        {errors.screenshot && <p className="text-rose-400 text-xs mt-1 font-outfit">{errors.screenshot}</p>}
                      </div>

                      {/* UTR / Transaction ID */}
                      <div>
                        <label className="block text-xs font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          12-Digit UPI Transaction UTR / Ref ID <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="utrNumber"
                          value={formData.utrNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. 427819234812"
                          className={`w-full px-4 py-3 rounded-xl bg-obsidian-900 border ${
                            errors.utrNumber ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15'
                          } text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all`}
                        />
                        {errors.utrNumber && <p className="text-rose-400 text-xs mt-1 font-outfit">{errors.utrNumber}</p>}
                      </div>

                      {/* Mint Pass Submit Button */}
                      <button
                        type="submit"
                        disabled={isMintingPass}
                        className={`w-full py-4 rounded-xl font-outfit font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 border transition-all duration-300 ${
                          isMintingPass
                            ? 'bg-amber-500/30 border-amber-500/50 text-slate-300 cursor-wait'
                            : 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-obsidian-950 hover:shadow-[0_0_25px_rgba(251,191,36,0.7)] hover:scale-[1.02] active:scale-95 border-amber-300/50'
                        }`}
                      >
                        {isMintingPass ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                            <span>
                              {mintingStep === 1 && 'VERIFYING UTR ON SENIOR LEDGER...'}
                              {mintingStep === 2 && 'AUTHENTICATING ATTACHED PAYMENT PROOF...'}
                              {mintingStep === 3 && 'MINTING 3D SENIOR VIP PASS...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 text-obsidian-950" />
                            <span>SUBMIT PROOF &amp; MINT SENIOR PASS</span>
                          </>
                        )}
                      </button>

                    </div>
                  </div>

                </div>

              </form>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}
