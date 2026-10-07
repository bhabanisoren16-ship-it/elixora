import { createPortal } from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import partyBg from '../assets/party-background.jpg';
import desktopBg from '../assets/desktop-background.jpg';
import { 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  Crown, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  Copy, 
  Check, 
  Upload, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  User, 
  Hash, 
  Phone, 
  Quote,
  X,
  CheckCheck
} from 'lucide-react';
import { EVENT_DETAILS } from '../utils/calendar';
import { soundController } from '../utils/audio';
import { adminStore } from '../utils/adminStore';
import { scrollToTarget } from '../utils/smoothScroll';

// Official authorized roster of registered seniors (Verified from official college roster)
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
  '25110059': { name: 'Manas Pritam Sahoo', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110060': { name: 'Manoswani Lenka', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110061': { name: 'Nirup Sundar Muduli', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110062': { name: 'Paurnamashi Samal', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110063': { name: 'Prateek Sahu', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110064': { name: 'Priyadarshani Malik', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110065': { name: 'S Saiman Satyajit', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110066': { name: 'S Shubhashree Swain', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110067': { name: 'Sai Sourav Khandual', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110068': { name: 'Samikshya Padhy', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110069': { name: 'Sangram Kumar Sahu', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110070': { name: 'Shradhashine Parida', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110071': { name: 'Soumyajeet Panda', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110072': { name: 'Soyal Parija', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110073': { name: 'Swagat Panda', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110074': { name: 'Swatiprava Sahoo', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110075': { name: 'Turvi Bhuyan', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110076': { name: 'Bhaswati Mishra', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '25110077': { name: 'Prabhuprasad Jena', branch: 'Biotechnology', batch: "Batch of '25 • Senior" },
  '24110033': { name: 'Subrat Dhal', branch: 'Biotechnology', batch: "Batch of '24 • Senior" }
};

const SENIOR_TICKET_PRICE = EVENT_DETAILS.seniorTicketPrice || 600;

function getInitialSeniorState() {
  if (typeof window === 'undefined') {
    return { isUnlocked: false, isPortalOpen: false, rollNo: '', profile: null };
  }
  try {
    const isHash = window.location.hash === '#senior-portal';
    const storedRoll = (
      sessionStorage.getItem('elixora_senior_roll') ||
      localStorage.getItem('elixora_senior_roll') ||
      ''
    ).trim().toUpperCase();

    const storedOpen = (
      sessionStorage.getItem('elixora_senior_portal_open') === 'true' ||
      localStorage.getItem('elixora_senior_portal_open') === 'true' ||
      isHash
    );

    const dynamicRoster = adminStore?.getSeniorRoster?.() || {};
    const found = (storedRoll && (REGISTERED_SENIORS[storedRoll] || dynamicRoster[storedRoll])) || null;

    if (storedRoll && found) {
      const profile = {
        name: found.name,
        branch: found.branch || 'Biotechnology',
        batch: found.batch || "Batch of '25 • Senior",
        role: 'Senior VIP Pass (Full Access + Red Carpet)',
        phone: '',
        email: ''
      };
      return {
        isUnlocked: true,
        isPortalOpen: storedOpen,
        rollNo: storedRoll,
        profile
      };
    } else if (storedRoll) {
      const profile = {
        name: 'Senior Student',
        branch: 'Biotechnology',
        batch: "Batch of '25 • Senior",
        role: 'Senior VIP Pass (Full Access + Red Carpet)',
        phone: '',
        email: ''
      };
      return {
        isUnlocked: true,
        isPortalOpen: storedOpen,
        rollNo: storedRoll,
        profile
      };
    }
  } catch (e) {}
  return { isUnlocked: false, isPortalOpen: false, rollNo: '', profile: null };
}

export default function SeniorSection({ onPassGenerated, onPortalToggle }) {
  const [initialSeniorState] = useState(getInitialSeniorState);
  const [accessRegNo, setAccessRegNo] = useState(initialSeniorState.rollNo || '');
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(initialSeniorState.isUnlocked);
  const [isPortalOpen, setIsPortalOpen] = useState(initialSeniorState.isPortalOpen);
  const [accessError, setAccessError] = useState('');

  // Senior Form State
  const [formData, setFormData] = useState(() => {
    const base = {
      fullName: initialSeniorState.profile?.name || '',
      rollNo: initialSeniorState.rollNo || '',
      branch: initialSeniorState.profile?.branch || 'Biotechnology',
      batch: initialSeniorState.profile?.batch || "Batch of '25 • Senior",
      role: 'Senior VIP Pass (Full Access + Red Carpet)',
      phone: '',
      email: '',
      diet: 'Veg',
      seniorQuote: '',
      utrNumber: '',
    };
    try {
      const saved = sessionStorage.getItem('elixora_senior_form') || localStorage.getItem('elixora_senior_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...base, ...parsed };
      }
    } catch (e) {}
    return base;
  });

  // UI state
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [isMintingPass, setIsMintingPass] = useState(false);
  const [mintingStep, setMintingStep] = useState(0);

  const qrCanvasRef = useRef(null);


  // Synchronize Senior Portal modal state, session persistence, and URL hash
  useEffect(() => {
    onPortalToggle?.(isPortalOpen);
    if (isPortalOpen) {
      document.body.classList.add('senior-portal-open');
      try {
        sessionStorage.setItem('elixora_senior_portal_open', 'true');
        localStorage.setItem('elixora_senior_portal_open', 'true');
        if (formData.rollNo) {
          sessionStorage.setItem('elixora_senior_roll', formData.rollNo);
          localStorage.setItem('elixora_senior_roll', formData.rollNo);
        }
      } catch (e) {}
      if (window.location.hash !== '#senior-portal') {
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search + '#senior-portal');
        } catch (e) {}
      }
    } else {
      document.body.classList.remove('senior-portal-open');
      try {
        sessionStorage.removeItem('elixora_senior_portal_open');
        localStorage.removeItem('elixora_senior_portal_open');
      } catch (e) {}
      if (window.location.hash === '#senior-portal') {
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) {}
      }
    }
    return () => {
      document.body.classList.remove('senior-portal-open');
    };
  }, [isPortalOpen, onPortalToggle, formData.rollNo]);

  // Listen for hashchange to open portal if URL contains #senior-portal
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#senior-portal') {
        const storedRoll = (
          sessionStorage.getItem('elixora_senior_roll') ||
          localStorage.getItem('elixora_senior_roll') ||
          formData.rollNo ||
          ''
        ).trim().toUpperCase();

        if (storedRoll) {
          setIsUnlocked(true);
          setIsPortalOpen(true);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [formData.rollNo]);

  // Persist form inputs in both sessionStorage and localStorage during active session
  useEffect(() => {
    if (isUnlocked && formData.rollNo) {
      try {
        sessionStorage.setItem('elixora_senior_roll', formData.rollNo);
        localStorage.setItem('elixora_senior_roll', formData.rollNo);
        const formPayload = JSON.stringify({
          phone: formData.phone,
          seniorQuote: formData.seniorQuote,
          utrNumber: formData.utrNumber,
          batch: formData.batch,
          diet: formData.diet,
        });
        sessionStorage.setItem('elixora_senior_form', formPayload);
        localStorage.setItem('elixora_senior_form', formPayload);
      } catch (e) {}
    }
  }, [isUnlocked, formData.rollNo, formData.phone, formData.seniorQuote, formData.utrNumber, formData.batch, formData.diet]);

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

      // STRICT CHECK: Match with registered registration numbers (static or admin roster)
      const dynamicRoster = adminStore?.getSeniorRoster?.() || {};
      const found = REGISTERED_SENIORS[cleaned] || dynamicRoster[cleaned];

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
        localStorage.setItem('elixora_senior_roll', cleaned);
        sessionStorage.setItem('elixora_senior_portal_open', 'true');
        localStorage.setItem('elixora_senior_portal_open', 'true');
      } catch (err) {}
    }, 450);
  };

  const handleClosePortal = () => {
    soundController.playClick?.();
    setIsPortalOpen(false);
    try {
      sessionStorage.removeItem('elixora_senior_portal_open');
      localStorage.removeItem('elixora_senior_portal_open');
      if (typeof window !== 'undefined') {
        if (window.location.hash === '#senior-portal') {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        scrollToTarget(0);
      }
    } catch (err) {}
  };

  const handleLockAgain = () => {
    soundController.playClick?.();
    setIsPortalOpen(false);
    setIsUnlocked(false);
    setAccessRegNo('');
    setFormData({
      fullName: '',
      rollNo: '',
      branch: 'Biotechnology',
      batch: "Batch of '25 • Senior",
      role: 'Senior VIP Pass (Full Access + Red Carpet)',
      phone: '',
      email: '',
      diet: 'Veg',
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
      localStorage.removeItem('elixora_senior_form');
      if (typeof window !== 'undefined') {
        if (window.location.hash === '#senior-portal' || window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        scrollToTarget('#seniors');
      }
    } catch (err) {}
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
          width: 165,
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
    scrollToTarget('#' + boxId);
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
    const dynamicRoster = adminStore?.getSeniorRoster?.() || {};
    if (!cleanRoll || (!REGISTERED_SENIORS[cleanRoll] && !dynamicRoster[cleanRoll])) {
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
    const dynamicRoster = adminStore?.getSeniorRoster?.() || {};
    if (!cleanRoll || (!REGISTERED_SENIORS[cleanRoll] && !dynamicRoster[cleanRoll])) {
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

      const seniorPass = {
        ticketId,
        fullName: formData.fullName,
        rollNo: cleanRoll,
        branch: 'Biotechnology',
        batch: formData.batch,
        role: formData.role,
        seniorQuote: formData.seniorQuote || 'Welcome Freshers to the Legacy of Elixora!',
        phone: formData.phone,
        email: formData.email,
        diet: formData.diet || 'Veg',
        utrNumber: formData.utrNumber.trim(),
        isSenior: true,
        ticketPrice: SENIOR_TICKET_PRICE,
        screenshot: screenshotPreview,
        tier: 'SENIOR VIP COUNCIL ACCESS',
        entryGate: 'Gate 1 (Presidential Arch)',
        tableZone: 'VIP Lounge',
        issuedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        generatedAt: new Date().toISOString(),
      };

      adminStore.addRegistration(seniorPass);
      onPassGenerated?.(seniorPass);
    }, 3600);
  };

  const seniorUpiNote = formData.rollNo
    ? `ELX26-SR-${formData.rollNo.toUpperCase().trim()}`
    : 'ELX26-SENIOR';
  const seniorUpiLink = `upi://pay?pa=${EVENT_DETAILS.upiId}&pn=ELIXORA%20SENIORS&am=${SENIOR_TICKET_PRICE}&cu=INR&tn=${encodeURIComponent(seniorUpiNote)}`;

  return (
    <section id="seniors" className="relative py-8 sm:py-14 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 scroll-mt-20 sm:scroll-mt-24">
      
      {/* Section Header */}
      <div className="text-center mb-5 sm:mb-8">
        <h2 className="font-outfit font-extrabold text-2xl sm:text-4xl md:text-5xl text-white tracking-tight">
          Senior Registration &amp; Pass
        </h2>
        <p className="mt-2 text-white max-w-2xl mx-auto text-xs sm:text-base font-outfit font-bold subheading-readable tracking-wide">
          Exclusively reserved for college seniors and council leaders. Verification of registered registration number is mandatory to unlock access.
        </p>
      </div>

      {/* STATE 1: LOCKED GATEWAY (ENTER REGISTRATION NUMBER) */}
      {!isUnlocked ? (
        <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 border border-cyan-500/35 bg-obsidian-950/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden transition-all duration-300">
          
          {/* Subtle Background Poster Artwork */}
          <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
            <picture className="w-full h-full block">
              <source media="(min-width: 768px)" srcSet={desktopBg} />
              <img src={partyBg} alt="" className="w-full h-full object-cover object-center filter brightness-75 contrast-125" />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/80 to-obsidian-950/70" />
          </div>

          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-center">
            
            {/* Left Column: Lock Badge, Title & Context */}
            <div className="md:col-span-6 text-left">
              <div className="flex flex-row items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3 justify-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-sky-600 p-[2px] shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0">
                  <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center text-cyan-300">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-cyan-400" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[10.5px] sm:text-xs font-outfit font-bold uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AUTHENTICATION GATEWAY</span>
                </div>
              </div>

              <h3 className="font-outfit font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight mb-1.5 sm:mb-2 text-left">
                Restricted Senior Access
              </h3>
              <p className="text-xs sm:text-sm text-white font-outfit font-bold leading-relaxed subheading-readable text-left">
                Senior portal can be accessed through matched registration number only. Enter your official college registration number to verify against the council roster and unlock portal.
              </p>
            </div>

            {/* Right Column: Input Box & Verification Action */}
            <div className="md:col-span-6 w-full">
              <form onSubmit={handleVerifyAccess} className="space-y-3 w-full bg-black/45 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={accessRegNo}
                    onChange={(e) => {
                      setAccessRegNo(e.target.value);
                      if (accessError) setAccessError('');
                    }}
                    placeholder="ENTER PASS"
                    className="w-full pl-10 pr-3.5 py-3 sm:py-3.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-slate-500 text-xs sm:text-sm font-outfit font-semibold uppercase tracking-wider focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-xs sm:placeholder:text-sm"
                  />
                </div>

                {/* Error Message */}
                {accessError && (
                  <div className="p-2.5 sm:p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-outfit flex items-start gap-2 text-left">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{accessError}</span>
                  </div>
                )}

                {/* Verify CTA */}
                <button
                  type="submit"
                  disabled={isVerifyingAccess}
                  className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-cyber-violet text-white font-outfit font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            </div>

          </div>
        </div>
      ) : (
        /* STATE 2: UNLOCKED SENIOR ACCESS CARD (CLICK TO OPEN DEDICATED PORTAL) */
        <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-emerald-500/40 bg-obsidian-950/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          {/* Subtle Background Poster Artwork */}
          <div className="absolute inset-0 pointer-events-none opacity-25" aria-hidden="true">
            <picture className="w-full h-full block">
              <source media="(min-width: 768px)" srcSet={desktopBg} />
              <img src={partyBg} alt="" className="w-full h-full object-cover object-center filter brightness-75 contrast-125" />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/85 to-obsidian-950/70" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-row items-center text-left gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] sm:text-xs font-outfit font-bold uppercase mb-1">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>REGISTRATION VERIFIED</span>
                </div>
                <h3 className="font-outfit font-extrabold text-xl sm:text-2xl text-white">
                  Senior Portal Unlocked
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] sm:text-xs font-mono text-cyan-300 font-bold uppercase">Pass Fee:</span>
                  <span className="font-outfit font-extrabold text-white text-xs sm:text-sm">₹{SENIOR_TICKET_PRICE}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 font-mono mt-0.5">
                  Registration ID: <span className="text-cyan-300 font-bold">{formData.rollNo}</span> • <span className="text-emerald-300">{formData.fullName}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  soundController.playClick?.();
                  setIsPortalOpen(true);
                }}
                className="w-full sm:w-auto py-3 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-cyber-violet text-white font-outfit font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>OPEN SENIOR PORTAL (DETAILS &amp; PAYMENT)</span>
              </button>

              <button
                type="button"
                onClick={handleLockAgain}
                className="w-full sm:w-auto py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 text-xs font-outfit font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
      {isPortalOpen && isUnlocked && Boolean(formData.rollNo) && typeof document !== 'undefined' && createPortal(
        <div 
          id="senior-portal"
          data-lenis-prevent
          className="fixed inset-0 z-[100] w-full h-full bg-obsidian-950 text-slate-100 flex flex-col overflow-y-auto overscroll-contain scroll-smooth senior-portal-scroll animate-in fade-in duration-300"
        >
          {/* Fullscreen Backdrop Poster Background with Ambient Cyber Lighting */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            <picture className="w-full h-full block">
              <source media="(min-width: 768px)" srcSet={desktopBg} />
              <img 
                src={partyBg} 
                alt="Senior Portal Backdrop" 
                className="w-full h-full object-cover object-center filter brightness-[0.30] contrast-[1.18] saturate-[1.20]" 
              />
            </picture>
            {/* Multi-layered dark gradient & vignette overlay to guarantee maximum readability and contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/92 via-obsidian-950/75 to-obsidian-950/95" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,18,0.75)_100%)]" />
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          {/* Sticky Fullscreen Top Bar Header */}
          <header className="shrink-0 sticky top-0 z-50 px-3 sm:px-8 py-2.5 sm:py-4 border-b border-white/10 flex items-center justify-between bg-obsidian-950/95 backdrop-blur-xl">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-sky-600 p-[2px] shadow-[0_0_15px_rgba(6,182,212,0.4)] shrink-0">
                <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center text-cyan-300">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-outfit font-extrabold text-xs min-[360px]:text-sm sm:text-lg text-white truncate">
                    <span className="hidden min-[420px]:inline">ELIXORA 2.0 • </span>SENIOR VIP PORTAL
                  </span>
                  <span className="hidden min-[480px]:inline-block text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shrink-0">
                    {formData.rollNo}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300 font-outfit font-bold truncate max-w-[190px] min-[360px]:max-w-[220px] sm:max-w-none">
                  Fill Details, Pay Barcode &amp; Attach Proof
                </p>
              </div>
            </div>

            {/* Quick Back to Home Button */}
            <button
              type="button"
              onClick={handleClosePortal}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 via-sky-500/25 to-cyan-500/20 hover:from-cyan-500/40 hover:to-sky-500/40 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer text-xs sm:text-sm font-outfit font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:scale-105 active:scale-95 shrink-0 ml-2"
              title="Return to Festival Home Page"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
              <span>Back to Home</span>
            </button>
          </header>

          {/* Sticky Step Navigation Pill Jump Bar */}
          <nav className="shrink-0 sticky top-[53px] sm:top-[73px] z-40 px-2 sm:px-8 py-1.5 sm:py-2.5 bg-obsidian-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-center gap-1.5 sm:gap-8 text-[11px] sm:text-xs font-outfit font-semibold text-slate-400 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => scrollToBox('senior-box-1')}
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer shrink-0 px-2 py-1 rounded-lg bg-white/5 sm:bg-transparent"
            >
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-[9px] sm:text-[10px] font-bold">
                1
              </span>
              <span><span className="hidden sm:inline">1. </span>Senior Details</span>
            </button>

            <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />

            <button
              type="button"
              onClick={() => scrollToBox('senior-box-2')}
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer shrink-0 px-2 py-1 rounded-lg bg-white/5 sm:bg-transparent"
            >
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-[9px] sm:text-[10px] font-bold">
                2
              </span>
              <span><span className="hidden sm:inline">2. </span>Pay on Barcode</span>
            </button>

            <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />

            <button
              type="button"
              onClick={() => scrollToBox('senior-box-3')}
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer shrink-0 px-2 py-1 rounded-lg bg-white/5 sm:bg-transparent"
            >
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-[9px] sm:text-[10px] font-bold">
                3
              </span>
              <span><span className="hidden sm:inline">3. </span>Proof &amp; Mint</span>
            </button>
          </nav>

          {/* Minimalist 3-Column Sideways Dashboard Layout */}
          <main className="w-full shrink-0 min-h-screen pt-4 sm:pt-10 pb-28 sm:pb-40 px-3 sm:px-6 lg:px-8 flex justify-center items-start relative z-10">
            <form onSubmit={handleSubmit} className="w-full max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-7 items-stretch">
                
                {/* ================================================================= */}
                {/* BOX 1: SENIOR PERSONAL DETAILS */}
                {/* ================================================================= */}
                <div id="senior-box-1" className="flex flex-col justify-between scroll-mt-6 bg-obsidian-950/85 backdrop-blur-xl p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-cyan-400/30 transition-all">
                  <div>
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-3.5 sm:mb-4">
                      <h4 className="font-outfit font-extrabold text-sm sm:text-lg text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-cyan-400" />
                        <span>Senior Personal Details</span>
                      </h4>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                        STEP 1
                      </span>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {/* Senior Full Name */}
                      <div>
                        <label className="block text-[10.5px] sm:text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Senior Full Name <span className="text-cyan-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="e.g. Aarav Sharma"
                            className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-obsidian-900 border ${
                              errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15'
                            } text-white placeholder-slate-500 text-xs sm:text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all`}
                          />
                          <User className="absolute right-3.5 top-3 sm:top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                        {errors.fullName && <p className="text-rose-400 text-[10px] sm:text-[11px] mt-1 font-outfit">{errors.fullName}</p>}
                      </div>

                      {/* College Roll / Reg. No. */}
                      <div>
                        <label className="block text-[10.5px] sm:text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          College Reg. No. <span className="text-emerald-400 font-bold">✓ (Verified)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="rollNo"
                            value={formData.rollNo}
                            readOnly
                            disabled
                            className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-black/60 border border-emerald-500/50 text-emerald-300 font-mono text-xs sm:text-sm uppercase cursor-not-allowed select-none"
                          />
                          <CheckCircle2 className="absolute right-3.5 top-3 sm:top-3.5 w-4 h-4 text-emerald-400" />
                        </div>
                      </div>

                      {/* WhatsApp Contact */}
                      <div>
                        <label className="block text-[10.5px] sm:text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          WhatsApp Contact <span className="text-cyan-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-obsidian-900 border ${
                              errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15'
                            } text-white placeholder-slate-500 text-xs sm:text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all`}
                          />
                          <Phone className="absolute right-3.5 top-3 sm:top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                        {errors.phone && <p className="text-rose-400 text-[10px] sm:text-[11px] mt-1 font-outfit">{errors.phone}</p>}
                      </div>

                      {/* Refreshment Preference (Veg / Non-Veg) */}
                      <div>
                        <label className="block text-[10.5px] sm:text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Refreshment Preference <span className="text-cyan-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                          <label
                            className={`flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl border cursor-pointer text-xs sm:text-sm transition-all ${
                              formData.diet === 'Veg'
                                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                                : 'bg-obsidian-900 border-white/15 text-slate-300 hover:border-white/30'
                            }`}
                          >
                            <input
                              type="radio"
                              name="diet"
                              value="Veg"
                              checked={formData.diet === 'Veg'}
                              onChange={handleInputChange}
                              className="hidden"
                            />
                            <span>🟢 Pure Veg</span>
                          </label>

                          <label
                            className={`flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl border cursor-pointer text-xs sm:text-sm transition-all ${
                              formData.diet === 'Non-Veg'
                                ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                                : 'bg-obsidian-900 border-white/15 text-slate-300 hover:border-white/30'
                            }`}
                          >
                            <input
                              type="radio"
                              name="diet"
                              value="Non-Veg"
                              checked={formData.diet === 'Non-Veg'}
                              onChange={handleInputChange}
                              className="hidden"
                            />
                            <span>🔴 Non-Veg</span>
                          </label>
                        </div>
                      </div>

                      {/* Senior Advice / Wisdom Quote */}
                      <div>
                        <label className="block text-[10.5px] sm:text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Senior Advice for Freshers (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="seniorQuote"
                            value={formData.seniorQuote}
                            onChange={handleInputChange}
                            placeholder="e.g. Cherish every single moment!"
                            className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-obsidian-900 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm font-outfit focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                          />
                          <Quote className="absolute right-3.5 top-3 sm:top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================================================================= */}
                {/* ================================================================= */}
                {/* BOX 2: PAY ON GIVEN BARCODE */}
                {/* ================================================================= */}
                <div id="senior-box-2" className="flex flex-col justify-between scroll-mt-6 bg-obsidian-950/85 backdrop-blur-xl p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-cyan-400/30 transition-all">
                  <div>
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-3.5 sm:mb-4">
                      <h4 className="font-outfit font-extrabold text-sm sm:text-lg text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-cyan-400" />
                        <span>Pay on Barcode</span>
                      </h4>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                        STEP 2
                      </span>
                    </div>

                    {/* Amount & Privilege Tag + Copy UPI Bar */}
                    <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-3.5 sm:mb-4">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-wider">VIP PASS FEE</span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-outfit font-extrabold text-xl sm:text-2xl text-white">₹{SENIOR_TICKET_PRICE}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(EVENT_DETAILS.upiId)}
                        className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-outfit text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
                    <div className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                      <div className="p-2 sm:p-2.5 bg-white rounded-2xl shadow-xl relative inline-block">
                        <canvas ref={qrCanvasRef} className="rounded-lg max-w-full block" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-7 h-7 rounded-lg bg-obsidian-950 border border-cyan-400 flex items-center justify-center shadow-lg">
                            <Crown className="w-3.5 h-3.5 text-cyan-400" />
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 sm:mt-2.5 text-xs font-semibold text-white">
                        Scan with GPay, PhonePe, Paytm, or BHIM
                      </p>
                      <div className="text-[10.5px] sm:text-[11px] font-mono text-slate-400 mt-1">
                        <span>UPI ID: <strong className="text-slate-200">{EVENT_DETAILS.upiId}</strong></span>
                      </div>

                      {/* 1-Tap Mobile UPI App Trigger */}
                      <a
                        href={seniorUpiLink}
                        className="mt-3 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-outfit font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95 sm:hidden"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Tap to Pay with UPI App</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* ================================================================= */}
                {/* BOX 3: ATTACH PAYMENT PROOF & MINT PASS */}
                {/* ================================================================= */}
                <div id="senior-box-3" className="flex flex-col justify-between scroll-mt-6 bg-obsidian-950/85 backdrop-blur-xl p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-cyan-400/30 transition-all">
                  <div>
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-3.5 sm:mb-4">
                      <h4 className="font-outfit font-extrabold text-sm sm:text-lg text-white flex items-center gap-2">
                        <Upload className="w-4 h-4 text-cyan-400" />
                        <span>Proof &amp; Mint Pass</span>
                      </h4>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                        STEP 3
                      </span>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {/* Screenshot File Upload */}
                      <div>
                        <label className="block text-[10.5px] sm:text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Payment Screenshot / Receipt <span className="text-cyan-400">*</span>
                        </label>
                        
                        {!screenshotPreview ? (
                          <label className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border-2 border-dashed ${
                            errors.screenshot ? 'border-rose-500 bg-rose-500/5' : 'border-white/20 hover:border-cyan-400/60 bg-white/5 hover:bg-white/10'
                          } cursor-pointer transition-all text-center group`}>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-1.5 group-hover:scale-110 transition-transform">
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
                          <div className="p-2.5 sm:p-3 rounded-xl bg-obsidian-900 border border-emerald-500/40 relative">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={screenshotPreview}
                                alt="Payment Proof"
                                className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover border border-white/20"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-outfit font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Receipt Attached ✓</span>
                                </div>
                                <p className="text-[10px] sm:text-[11px] text-slate-300 font-mono truncate mt-0.5">
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
                        {errors.screenshot && <p className="text-rose-400 text-[10px] sm:text-[11px] mt-1 font-outfit">{errors.screenshot}</p>}
                      </div>

                      {/* 12-Digit UTR */}
                      <div>
                        <label className="block text-[10.5px] sm:text-[11px] font-outfit font-bold uppercase tracking-wider text-slate-300 mb-1">
                          12-Digit UPI Transaction UTR <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="utrNumber"
                          value={formData.utrNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. 427819234812"
                          maxLength={18}
                          className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-obsidian-900 border ${
                            errors.utrNumber ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15'
                          } text-white font-mono text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all`}
                        />
                        {errors.utrNumber && <p className="text-rose-400 text-[10px] sm:text-[11px] mt-1 font-outfit">{errors.utrNumber}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Mint Pass CTA & Security */}
                  <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-white/10 space-y-2.5">
                    <button
                      type="submit"
                      disabled={isMintingPass}
                      className={`w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-outfit font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 border transition-all duration-300 ${
                        isMintingPass
                          ? 'bg-cyan-500/30 border-cyan-500/50 text-slate-300 cursor-wait'
                          : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-cyber-violet text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:scale-[1.02] active:scale-95 border-cyan-300/50 cursor-pointer'
                      }`}
                    >
                      {isMintingPass ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                          <span className="text-[11px] sm:text-xs">
                            {mintingStep === 1 && 'VERIFYING UTR ON SENIOR LEDGER...'}
                            {mintingStep === 2 && 'AUTHENTICATING ATTACHED PAYMENT PROOF...'}
                            {mintingStep === 3 && 'MINTING 3D SENIOR VIP PASS...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 text-white" />
                          <span>SUBMIT PROOF &amp; MINT SENIOR PASS</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </form>

            {/* Floating Back to Home in Senior Portal */}
            <div className="fixed bottom-3.5 right-3 sm:bottom-6 sm:right-6 z-50 pointer-events-auto">
              <button
                type="button"
                onClick={handleClosePortal}
                className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-obsidian-950/90 hover:bg-obsidian-900 border border-cyan-400/60 hover:border-cyan-300 text-cyan-200 hover:text-white shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-xl text-xs font-outfit font-extrabold tracking-wide transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Return to Festival Home Page"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 group-hover:-translate-x-0.5 transition-transform" />
                <span>Home Page</span>
              </button>
            </div>
          </main>
        </div>,
        document.body
      )}

    </section>
  );
}
