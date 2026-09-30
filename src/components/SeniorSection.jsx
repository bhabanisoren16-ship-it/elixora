import { createPortal } from 'react-dom';
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

// Helper: Check and restore active senior verification session across refreshes
function getStoredSeniorSession() {
  try {
    if (typeof window === 'undefined') return { unlocked: false, open: false, roll: '', form: {} };
    const savedRoll = (sessionStorage.getItem('elixora_senior_roll') || localStorage.getItem('elixora_senior_roll') || '').trim().toUpperCase();
    const wasPortalOpen = 
      sessionStorage.getItem('elixora_senior_portal_open') === 'true' || 
      localStorage.getItem('elixora_senior_portal_open') === 'true' || 
      (typeof window !== 'undefined' && window.location.hash === '#senior-portal');

    if (savedRoll && REGISTERED_SENIORS[savedRoll]) {
      let savedFields = {};
      try {
        const raw = sessionStorage.getItem('elixora_senior_form');
        if (raw) savedFields = JSON.parse(raw);
      } catch (e) {}

      return {
        unlocked: true,
        open: wasPortalOpen,
        roll: savedRoll,
        form: savedFields
      };
    }
  } catch (e) {
    console.warn('Error reading senior session storage:', e);
  }
  return { unlocked: false, open: false, roll: '', form: {} };
}

export default function SeniorSection({ onPassGenerated, onPortalToggle }) {
  const initialSession = useRef(getStoredSeniorSession());

  // Authentication Gate State
  const [accessRegNo, setAccessRegNo] = useState(() => initialSession.current.roll || '');
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => initialSession.current.unlocked);
  const [isPortalOpen, setIsPortalOpen] = useState(() => initialSession.current.open);
  const [accessError, setAccessError] = useState('');
  const [verifiedSeniorProfile, setVerifiedSeniorProfile] = useState(() => {
    const roll = initialSession.current.roll;
    if (roll && REGISTERED_SENIORS[roll]) {
      const found = REGISTERED_SENIORS[roll];
      return {
        name: found.name,
        branch: found.branch || 'Biotechnology',
        batch: found.batch || "Batch of '25 • Senior",
        role: 'Senior VIP Pass (Full Access + Red Carpet)',
        phone: '',
        email: ''
      };
    }
    return null;
  });

  // Senior Form State
  const [formData, setFormData] = useState(() => {
    const roll = initialSession.current.roll;
    if (roll && REGISTERED_SENIORS[roll]) {
      const found = REGISTERED_SENIORS[roll];
      const form = initialSession.current.form || {};
      return {
        fullName: found.name,
        rollNo: roll,
        branch: found.branch || 'Biotechnology',
        batch: form.batch || found.batch || "Batch of '25 • Senior",
        role: 'Senior VIP Pass (Full Access + Red Carpet)',
        phone: form.phone || '',
        email: '',
        seniorQuote: form.seniorQuote || '',
        utrNumber: form.utrNumber || '',
      };
    }
    return {
      fullName: '',
      rollNo: '',
      branch: 'Biotechnology',
      batch: "Batch of '25 • Senior",
      role: 'Senior VIP Pass (Full Access + Red Carpet)',
      phone: '',
      email: '',
      seniorQuote: '',
      utrNumber: '',
    };
  });

  // UI state
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [isMintingPass, setIsMintingPass] = useState(false);
  const [mintingStep, setMintingStep] = useState(0);

  const qrCanvasRef = useRef(null);

  const seniorBatches = [
    "Batch of '25 • Senior",
    "Batch of '24 • Senior",
    "Batch of '23 • Senior",
    "Student Council Senior Executive"
  ];

  // Synchronize Senior Portal session state and URL hash across refresh
  useEffect(() => {
    onPortalToggle?.(isPortalOpen);
    if (isPortalOpen) {
      document.body.classList.add('senior-portal-open');
      try {
        sessionStorage.setItem('elixora_senior_portal_open', 'true');
        localStorage.setItem('elixora_senior_portal_open', 'true');
      } catch (e) {}
      if (window.location.hash !== '#senior-portal') {
        history.replaceState(null, '', window.location.pathname + window.location.search + '#senior-portal');
      }
    } else {
      document.body.classList.remove('senior-portal-open');
      try {
        sessionStorage.setItem('elixora_senior_portal_open', 'false');
        localStorage.setItem('elixora_senior_portal_open', 'false');
      } catch (e) {}
      if (window.location.hash === '#senior-portal') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    return () => {
      document.body.classList.remove('senior-portal-open');
    };
  }, [isPortalOpen, onPortalToggle]);

  // Persist form inputs so user data is never lost on refresh
  useEffect(() => {
    if (isUnlocked && formData.rollNo) {
      try {
        sessionStorage.setItem('elixora_senior_roll', formData.rollNo);
        localStorage.setItem('elixora_senior_roll', formData.rollNo);
        sessionStorage.setItem('elixora_senior_form', JSON.stringify({
          phone: formData.phone,
          seniorQuote: formData.seniorQuote,
          utrNumber: formData.utrNumber,
          batch: formData.batch
        }));
      } catch (e) {}
    }
  }, [isUnlocked, formData.rollNo, formData.phone, formData.seniorQuote, formData.utrNumber, formData.batch]);

  // Helper: Verify Senior Registration Number strictly against the authorized roster
  const handleVerifyAccess = (e) => {
    if (e) e.preventDefault();
    const cleaned = accessRegNo.trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

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
        setAccessError(`Access Denied: Registration number "${cleaned}" is not on the official senior list. Senior portal can be accessed through matched registration number only.`);
        setIsUnlocked(false);
        setIsPortalOpen(false);
        return;
      }

      soundController.playSuccess?.();

      const profile = {
        name: found.name,
        branch: found.branch || 'Biotechnology',
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

      try {
        sessionStorage.setItem('elixora_senior_roll', cleaned);
        sessionStorage.setItem('elixora_senior_portal_open', 'true');
        localStorage.setItem('elixora_senior_roll', cleaned);
        localStorage.setItem('elixora_senior_portal_open', 'true');
      } catch (err) {}
    }, 450);
  };

  const handleClosePortal = () => {
    soundController.playClick?.();
    setIsPortalOpen(false);
    setIsUnlocked(false);
    setAccessRegNo('');
    setVerifiedSeniorProfile(null);
    setFormData({
      fullName: '',
      rollNo: '',
      branch: 'Biotechnology',
      batch: "Batch of '25 • Senior",
      role: 'Senior VIP Pass (Full Access + Red Carpet)',
      phone: '',
      email: '',
      seniorQuote: '',
      utrNumber: '',
    });
    setScreenshotPreview(null);
    setScreenshotFileName('');
    setErrors({});
    try {
      sessionStorage.removeItem('elixora_senior_roll');
      sessionStorage.removeItem('elixora_senior_portal_open');
      sessionStorage.removeItem('elixora_senior_form');
      localStorage.removeItem('elixora_senior_roll');
      localStorage.removeItem('elixora_senior_portal_open');
      if (typeof window !== 'undefined' && window.location.hash === '#senior-portal') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (err) {}
  };

  const handleLockAgain = () => {
    handleClosePortal();
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
          width: 150,
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
    }, 60);

    return () => clearTimeout(timer);
  }, [isPortalOpen, formData.rollNo]);

  // Lock body scroll and listen for Escape key when Senior Portal modal is open
  useEffect(() => {
    if (!isPortalOpen) return;

    const originalOverflow = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClosePortal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPortalOpen]);

  const scrollToBox = (boxId) => {
    soundController.playClick?.();
    const el = document.getElementById(boxId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

    // 1. Strict Gate Check: Registration number MUST match an authorized senior on the official list
    const cleanRoll = (formData.rollNo || '').trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!cleanRoll || !REGISTERED_SENIORS[cleanRoll]) {
      newErrors.rollNo = 'Access Denied: Senior portal can be accessed through matched registration number only.';
    }

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

    // Security Gate: Ensure only matched registration number can submit
    const cleanRoll = (formData.rollNo || '').trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!cleanRoll || !REGISTERED_SENIORS[cleanRoll]) {
      soundController.playError?.();
      setAccessError('Access Denied: Senior portal can be accessed through matched registration number only.');
      handleClosePortal();
      return;
    }

    if (!validateForm()) {
      soundController.playError?.();
      return;
    }

    soundController.playClick?.();
    setIsMintingPass(true);
    setMintingStep(1);

    // Multi-step ledger verification animation
    setTimeout(() => {
      setMintingStep(2);
      soundController.playClick?.();
    }, 1200);

    setTimeout(() => {
      setMintingStep(3);
      soundController.playClick?.();
    }, 2400);

    setTimeout(() => {
      setIsMintingPass(false);
      setMintingStep(0);
      handleClosePortal();
      soundController.playSuccess?.();

      const ticketId = `ELX-SR-${Math.floor(100000 + Math.random() * 900000)}`;

      onPassGenerated?.({
        ticketId,
        fullName: formData.fullName,
        rollNo: cleanRoll,
        branch: 'Biotechnology',
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
    <section id="seniors" className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8">
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
        <div className="max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 border border-amber-500/35 bg-obsidian-950/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden transition-all duration-300">
          
          {/* Subtle Background Poster Artwork */}
          <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
            <img src="/background-desktop.jpg" alt="" className="w-full h-full object-cover object-[center_35%] filter brightness-75 contrast-125" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/80 to-obsidian-950/70" />
          </div>

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
              Senior portal can be accessed through matched registration number only. Enter your official college registration number to verify against the council roster and unlock portal.
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
                  placeholder="Enter Senior Registration No."
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
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-obsidian-950 font-outfit font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifyingAccess ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CHECKING SENIOR ROSTER...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>VERIFY &amp; UNLOCK SENIOR PORTAL</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-slate-400 font-outfit mt-4">
              * Senior portal is strictly gated. Only pre-registered seniors (Batch '25 Biotechnology) with matching registration numbers can enter.
            </p>

          </div>
        </div>
      ) : (
        /* STATE 2: UNLOCKED SENIOR ACCESS CARD (CLICK TO OPEN DEDICATED PORTAL) */
        <div className="max-w-3xl mx-auto rounded-3xl p-6 sm:p-8 border border-emerald-500/40 bg-obsidian-950/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          {/* Subtle Background Poster Artwork */}
          <div className="absolute inset-0 pointer-events-none opacity-25" aria-hidden="true">
            <img src="/background-desktop.jpg" alt="" className="w-full h-full object-cover object-[center_35%] filter brightness-75 contrast-125" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/85 to-obsidian-950/70" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
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
                  Registration ID: <span className="text-amber-300 font-bold">{formData.rollNo}</span> • <span className="text-emerald-300">{formData.fullName}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  soundController.playClick?.();
                  setIsPortalOpen(true);
                }}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-obsidian-950 font-outfit font-extrabold text-sm tracking-wide shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-obsidian-950" />
                <span>OPEN SENIOR PORTAL (DETAILS &amp; PAYMENT)</span>
              </button>

              <button
                type="button"
                onClick={handleLockAgain}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 text-xs font-outfit font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Lock &amp; Switch ID</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* DEDICATED SENIOR VIP PORTAL MODAL (DETAILS + BARCODE PAYMENT + PROOF ATTACH) */}
      {/* ========================================================================= */}
      {isPortalOpen && isUnlocked && formData.rollNo && REGISTERED_SENIORS[formData.rollNo] && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[100] w-full h-full bg-obsidian-950 text-slate-100 flex flex-col overflow-y-auto overscroll-contain scroll-smooth senior-portal-scroll animate-in fade-in duration-300"
        >
          {/* Fullscreen Backdrop Poster Background with Ambient Cyber Lighting */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            <picture className="w-full h-full block">
              <source media="(min-width: 768px)" srcSet="/background-desktop.jpg" />
              <img 
                src="/background-mobile.jpg" 
                alt="Senior Portal Backdrop" 
                className="w-full h-full object-cover object-[center_28%] filter brightness-[0.30] contrast-[1.18] saturate-[1.20]" 
              />
            </picture>
            {/* Multi-layered dark gradient & vignette overlay to guarantee maximum readability and contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/92 via-obsidian-950/75 to-obsidian-950/95" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,18,0.75)_100%)]" />
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyber-gold/10 rounded-full blur-3xl" />
          </div>

          {/* Sticky Fullscreen Top Bar Header */}
          <header className="shrink-0 sticky top-0 z-50 px-4 sm:px-8 py-3.5 sm:py-4 border-b border-white/10 flex items-center justify-between bg-obsidian-950/95 backdrop-blur-xl">
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
                  Fill Senior Details, Pay on Barcode, and Attach Payment Proof
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClosePortal}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-outfit font-medium"
              title="Close & Lock Portal (Esc)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close &amp; Lock</span>
            </button>
          </header>

          {/* Sticky Step Navigation Pill Jump Bar */}
          <nav className="shrink-0 sticky top-[69px] sm:top-[73px] z-40 px-4 sm:px-8 py-2 sm:py-2.5 bg-obsidian-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between sm:justify-center gap-3 sm:gap-8 text-xs font-outfit font-semibold text-slate-400">
            <button
              type="button"
              onClick={() => scrollToBox('senior-box-1')}
              className="flex items-center gap-2 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span>1. Senior Details</span>
            </button>

            <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />

            <button
              type="button"
              onClick={() => scrollToBox('senior-box-2')}
              className="flex items-center gap-2 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span>2. Pay on Barcode</span>
            </button>

            <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />

            <button
              type="button"
              onClick={() => scrollToBox('senior-box-3')}
              className="flex items-center gap-2 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span>3. Proof &amp; Mint</span>
            </button>
          </nav>

          {/* Minimalist 3-Column Sideways Dashboard Layout */}
          <main className="w-full shrink-0 min-h-[calc(100vh+320px)] pt-8 sm:pt-12 pb-32 sm:pb-44 px-4 sm:px-6 lg:px-8 flex justify-center items-start relative z-10">
            <form onSubmit={handleSubmit} className="w-full max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-7 items-stretch">
                
                {/* ================================================================= */}
                {/* BOX 1: SENIOR PERSONAL DETAILS */}
                {/* ================================================================= */}
                <div id="senior-box-1" className="flex flex-col justify-between scroll-mt-6 bg-obsidian-950/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-amber-400/30 transition-all">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                      <h4 className="font-outfit font-bold text-base sm:text-lg text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-400" />
                        <span>Senior Personal Details</span>
                      </h4>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded border border-amber-500/30 font-bold">
                        STEP 1
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Senior Full Name */}
                      <div>
                        <label className="block text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
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
                        {errors.fullName && <p className="text-rose-400 text-[11px] mt-1 font-outfit">{errors.fullName}</p>}
                      </div>

                      {/* College Roll / Reg. No. */}
                      <div>
                        <label className="block text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          College Reg. No. <span className="text-emerald-400 font-bold">✓ (Verified)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="rollNo"
                            value={formData.rollNo}
                            readOnly
                            disabled
                            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-emerald-500/50 text-emerald-300 font-mono text-sm uppercase cursor-not-allowed select-none"
                          />
                          <CheckCircle2 className="absolute right-3.5 top-3.5 w-4 h-4 text-emerald-400" />
                        </div>
                      </div>

                      {/* Department / Branch */}
                      <div>
                        <label className="block text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Department / Branch <span className="text-emerald-400 font-bold">✓ (Biotechnology)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="branch"
                            value={formData.branch || 'Biotechnology'}
                            readOnly
                            disabled
                            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-emerald-500/50 text-emerald-300 font-outfit text-sm cursor-not-allowed select-none"
                          />
                          <CheckCircle2 className="absolute right-3.5 top-3.5 w-4 h-4 text-emerald-400" />
                        </div>
                      </div>

                      {/* Senior Batch */}
                      <div>
                        <label className="block text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Senior Batch / Year
                        </label>
                        <select
                          name="batch"
                          value={formData.batch}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/15 text-white text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer"
                        >
                          {seniorBatches.map((b) => (
                            <option key={b} value={b} className="bg-obsidian-950 text-white">
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* WhatsApp Contact */}
                      <div>
                        <label className="block text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
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
                        {errors.phone && <p className="text-rose-400 text-[11px] mt-1 font-outfit">{errors.phone}</p>}
                      </div>

                      {/* Senior Advice / Wisdom Quote */}
                      <div>
                        <label className="block text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Senior Advice for Freshers (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="seniorQuote"
                            value={formData.seniorQuote}
                            onChange={handleInputChange}
                            placeholder="e.g. Cherish every single moment!"
                            className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/15 text-white placeholder-slate-500 text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                          />
                          <Quote className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-300/80 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Biotechnology</span>
                    </span>
                    <span className="text-slate-400">VIP Red Carpet Pass</span>
                  </div>
                </div>

                {/* ================================================================= */}
                {/* ================================================================= */}
                {/* BOX 2: PAY ON GIVEN BARCODE */}
                {/* ================================================================= */}
                <div id="senior-box-2" className="flex flex-col justify-between scroll-mt-6 bg-obsidian-950/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-amber-400/30 transition-all">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                      <h4 className="font-outfit font-bold text-base sm:text-lg text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span>Pay on Barcode</span>
                      </h4>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded border border-amber-500/30 font-bold">
                        STEP 2
                      </span>
                    </div>

                    {/* Amount & Privilege Tag + Copy UPI Bar */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-wider">VIP PASS FEE</span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-outfit font-extrabold text-2xl text-white">₹{SENIOR_TICKET_PRICE}</span>
                          <span className="text-xs text-slate-400 line-through">₹999</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(EVENT_DETAILS.upiId)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-outfit text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
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

                    {/* Given Barcode (QR Code) Canvas Container */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                      <div className="p-2.5 bg-white rounded-2xl shadow-xl relative inline-block">
                        <canvas ref={qrCanvasRef} className="rounded-lg max-w-full block" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-7 h-7 rounded-lg bg-obsidian-950 border border-amber-400 flex items-center justify-center shadow-lg">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                        </div>
                      </div>
                      <p className="mt-2.5 text-xs font-semibold text-white">
                        Scan with GPay, PhonePe, Paytm, or BHIM
                      </p>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        <span className="text-amber-400/90 font-medium">Ref: ELX26-SR-{formData.rollNo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 text-center">
                    <p className="text-[11px] font-mono text-slate-400">
                      UPI ID: <strong className="text-slate-200">{EVENT_DETAILS.upiId}</strong>
                    </p>
                  </div>
                </div>

                {/* ================================================================= */}
                {/* BOX 3: ATTACH PAYMENT PROOF & MINT PASS */}
                {/* ================================================================= */}
                <div id="senior-box-3" className="flex flex-col justify-between scroll-mt-6 bg-obsidian-950/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-amber-400/30 transition-all">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                      <h4 className="font-outfit font-bold text-base sm:text-lg text-white flex items-center gap-2">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>Proof &amp; Mint Pass</span>
                      </h4>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded border border-amber-500/30 font-bold">
                        STEP 3
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Screenshot File Upload */}
                      <div>
                        <label className="block text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Payment Screenshot / Receipt <span className="text-amber-400">*</span>
                        </label>
                        
                        {!screenshotPreview ? (
                          <label className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed ${
                            errors.screenshot ? 'border-rose-500 bg-rose-500/5' : 'border-white/20 hover:border-amber-400/60 bg-white/5 hover:bg-white/10'
                          } cursor-pointer transition-all text-center group`}>
                            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-1.5 group-hover:scale-110 transition-transform">
                              <Upload className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-outfit font-bold text-white mb-0.5">
                              Attach Payment Receipt / Slip
                            </span>
                            <span className="text-[10px] text-slate-400 font-outfit">
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
                            <div className="flex items-center gap-2.5">
                              <img
                                src={screenshotPreview}
                                alt="Payment Proof"
                                className="w-12 h-12 rounded-lg object-cover border border-white/20"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-outfit font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Receipt Attached ✓</span>
                                </div>
                                <p className="text-[11px] text-slate-300 font-mono truncate mt-0.5">
                                  {screenshotFileName || 'receipt_screenshot.png'}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveScreenshot}
                                className="p-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
                                title="Remove screenshot"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                        {errors.screenshot && <p className="text-rose-400 text-[11px] mt-1 font-outfit">{errors.screenshot}</p>}
                      </div>

                      {/* 12-Digit UTR */}
                      <div>
                        <label className="block text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          12-Digit UPI Transaction UTR <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="utrNumber"
                          value={formData.utrNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. 427819234812"
                          maxLength={18}
                          className={`w-full px-4 py-3 rounded-xl bg-obsidian-900 border ${
                            errors.utrNumber ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15'
                          } text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all`}
                        />
                        {errors.utrNumber && <p className="text-rose-400 text-[11px] mt-1 font-outfit">{errors.utrNumber}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Mint Pass CTA & Security */}
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5">
                    <button
                      type="submit"
                      disabled={isMintingPass}
                      className={`w-full py-4 rounded-2xl font-outfit font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 border transition-all duration-300 ${
                        isMintingPass
                          ? 'bg-amber-500/30 border-amber-500/50 text-slate-300 cursor-wait'
                          : 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-obsidian-950 hover:shadow-[0_0_25px_rgba(251,191,36,0.7)] hover:scale-[1.02] active:scale-95 border-amber-300/50 cursor-pointer'
                      }`}
                    >
                      {isMintingPass ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          <span className="text-xs">
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
                    <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 font-mono">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Official Student Council Verified • Instant Pass Generation</span>
                    </p>

                    <button
                      type="button"
                      onClick={handleClosePortal}
                      className="w-full py-2 text-center text-xs text-slate-400 hover:text-rose-300 font-outfit transition-colors cursor-pointer"
                    >
                      ← Exit &amp; Lock Senior Portal
                    </button>
                  </div>
                </div>

              </div>
            </form>
          </main>
        </div>,
        document.body
      )}

    </section>
  );
}
