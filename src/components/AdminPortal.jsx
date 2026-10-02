import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  CreditCard, 
  QrCode, 
  UserCheck, 
  AlertTriangle, 
  ExternalLink, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Ticket, 
  FileSpreadsheet, 
  Bell, 
  Eye, 
  LogOut, 
  X, 
  Check, 
  Copy, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  ArrowUpRight, 
  Radio, 
  Settings, 
  Megaphone, 
  BadgeCheck, 
  SlidersHorizontal,
  GraduationCap,
  KeyRound,
  FileText,
  UserPlus,
  Send,
  Zap
} from 'lucide-react';
import { adminStore } from '../utils/adminStore';
import { soundController } from '../utils/audio';

export default function AdminPortal({ isOpen, onClose, onOpenTicket }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => adminStore.isAuthenticated());
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Active Tab: 'overview' | 'registrations' | 'gate' | 'roster' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Live Data State
  const [registrations, setRegistrations] = useState(() => adminStore.getRegistrations());
  const [roster, setRoster] = useState(() => adminStore.getSeniorRoster());
  const [settings, setSettings] = useState(() => adminStore.getSettings());
  const [stats, setStats] = useState(() => adminStore.getStats());

  // Real-time Clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-IN', { hour12: true }));

  // Registration Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, FRESHER, SENIOR
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, VERIFIED, PENDING, REJECTED
  const [filterCheckIn, setFilterCheckIn] = useState('ALL'); // ALL, CHECKED_IN, NOT_CHECKED_IN
  const [filterDiet, setFilterDiet] = useState('ALL'); // ALL, VEG, NON_VEG

  // Modals & Drawers
  const [selectedProof, setSelectedProof] = useState(null); // Registration object for receipt modal
  const [isAddPassOpen, setIsAddPassOpen] = useState(false);
  const [isAddSeniorOpen, setIsAddSeniorOpen] = useState(false);
  const [rejectingItem, setRejectingItem] = useState(null); // ticketId for rejection prompt
  const [rejectionReason, setRejectionReason] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Gate Scanner state
  const [gateInput, setGateInput] = useState('');
  const [gateResult, setGateResult] = useState(null);
  const [gateRecentEntries, setGateRecentEntries] = useState([]);

  // New Pass Manual Form
  const [manualPass, setManualPass] = useState({
    fullName: '',
    rollNo: '',
    phone: '',
    email: '',
    isSenior: false,
    diet: 'Veg',
    utrNumber: '',
    ticketPrice: 399,
    status: 'VERIFIED'
  });

  // New Senior Roster Form
  const [newSenior, setNewSenior] = useState({
    rollNo: '',
    name: '',
    branch: 'Biotechnology',
    batch: "Batch of '25 • Senior"
  });

  // Broadcast settings draft
  const [broadcastDraft, setBroadcastDraft] = useState(settings.broadcastMessage || '');
  const [broadcastActiveDraft, setBroadcastActiveDraft] = useState(settings.broadcastActive ?? false);

  // Google Sheets & Excel Online Sync State
  const [sheetsWebhookDraft, setSheetsWebhookDraft] = useState(settings.sheetsWebhookUrl || '');
  const [sheetsSpreadsheetDraft, setSheetsSpreadsheetDraft] = useState(settings.sheetsSpreadsheetUrl || '');
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);

  // Sync with storage changes and tick clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour12: true }));
    }, 1000);

    const handleStorageUpdate = () => {
      setRegistrations(adminStore.getRegistrations());
      setRoster(adminStore.getSeniorRoster());
      const newSettings = adminStore.getSettings();
      setSettings(newSettings);
      setSheetsWebhookDraft(newSettings.sheetsWebhookUrl || '');
      setSheetsSpreadsheetDraft(newSettings.sheetsSpreadsheetUrl || '');
      setStats(adminStore.getStats());
    };

    window.addEventListener('elixora_admin_update', handleStorageUpdate);
    return () => {
      clearInterval(timer);
      window.removeEventListener('elixora_admin_update', handleStorageUpdate);
    };
  }, []);

  // Update stats whenever registrations change
  useEffect(() => {
    setStats(adminStore.getStats());
  }, [registrations]);

  // Flash action notification
  const notifySuccess = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  // Login handler
  const handleLogin = (e) => {
    e?.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Please enter the administrative master passcode.');
      return;
    }

    setAuthError('');
    setIsVerifyingAuth(true);

    setTimeout(() => {
      setIsVerifyingAuth(false);
      const ok = adminStore.login(passcode, rememberMe);
      if (ok) {
        setIsAuthenticated(true);
        soundController.playSuccess?.();
        notifySuccess('Authenticated successfully. Welcome to Command Nexus!');
      } else {
        setAuthError('Invalid Master Passcode. Access Denied.');
        soundController.playError?.();
      }
    }, 400);
  };

  const handleLogout = () => {
    adminStore.logout();
    setIsAuthenticated(false);
    setPasscode('');
    soundController.playClick?.();
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundController.playClick?.();
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Action handlers
  const handleApprove = (ticketId) => {
    adminStore.approveRegistration(ticketId);
    setRegistrations(adminStore.getRegistrations());
    notifySuccess(`Pass ${ticketId} approved & verified!`);
    soundController.playSuccess?.();
  };

  const handleInitiateReject = (item) => {
    setRejectingItem(item);
    setRejectionReason('Payment reference or screenshot could not be verified.');
  };

  const handleConfirmReject = () => {
    if (!rejectingItem) return;
    adminStore.rejectRegistration(rejectingItem.ticketId, rejectionReason);
    setRegistrations(adminStore.getRegistrations());
    setRejectingItem(null);
    setRejectionReason('');
    notifySuccess(`Pass ${rejectingItem.ticketId} marked as Rejected.`);
    soundController.playError?.();
  };

  const handleToggleCheckIn = (ticketId) => {
    const updated = adminStore.toggleCheckIn(ticketId, 'Gate 2 (Aurora North Arch)');
    setRegistrations(adminStore.getRegistrations());
    if (updated?.checkedIn) {
      soundController.playSuccess?.();
      notifySuccess(`Check-In Confirmed for ${updated.fullName} (${updated.ticketId})`);
    } else {
      soundController.playClick?.();
      notifySuccess(`Check-In Reverted for ${ticketId}`);
    }
  };

  const handleDelete = (ticketId, name) => {
    if (window.confirm(`Permanently remove registration for "${name}" (${ticketId})?`)) {
      adminStore.deleteRegistration(ticketId);
      setRegistrations(adminStore.getRegistrations());
      notifySuccess(`Registration ${ticketId} deleted.`);
      soundController.playClick?.();
    }
  };

  // Gate Check-in verification
  const handleGateScan = (e) => {
    e?.preventDefault();
    if (!gateInput.trim()) return;

    const result = adminStore.verifyTicket(gateInput);
    setGateResult(result);

    if (result.found && result.isValid && !result.alreadyCheckedIn) {
      // Auto check in
      const updated = adminStore.toggleCheckIn(result.ticket.ticketId, 'Gate 2 (Main)');
      setRegistrations(adminStore.getRegistrations());
      setGateRecentEntries((prev) => [
        {
          ticketId: result.ticket.ticketId,
          name: result.ticket.fullName,
          time: new Date().toLocaleTimeString('en-IN', { hour12: true }),
          isSenior: result.ticket.isSenior,
          rollNo: result.ticket.rollNo
        },
        ...prev.slice(0, 7)
      ]);
      soundController.playSuccess?.();
    } else if (result.alreadyCheckedIn) {
      soundController.playError?.();
    } else {
      soundController.playError?.();
    }
  };

  // Add Manual Pass
  const handleCreateManualPass = (e) => {
    e.preventDefault();
    if (!manualPass.fullName.trim() || !manualPass.rollNo.trim()) {
      alert('Please fill at least the Full Name and Roll Number.');
      return;
    }

    const newPass = adminStore.addRegistration({
      ...manualPass,
      ticketPrice: manualPass.isSenior ? 499 : 399,
      tier: manualPass.isSenior ? 'SENIOR VIP COUNCIL ACCESS' : 'VIP FRESHER ACCESS',
      entryGate: manualPass.isSenior ? 'Gate 1 (Presidential Arch)' : 'Gate 2 (Aurora North Arch)',
      tableZone: manualPass.isSenior ? 'VIP Lounge' : 'Arena Floor',
      issuedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    });

    setRegistrations(adminStore.getRegistrations());
    setIsAddPassOpen(false);
    setManualPass({
      fullName: '',
      rollNo: '',
      phone: '',
      email: '',
      isSenior: false,
      diet: 'Veg',
      utrNumber: '',
      ticketPrice: 399,
      status: 'VERIFIED'
    });
    notifySuccess(`Created official pass ${newPass.ticketId} for ${newPass.fullName}!`);
  };

  // Add Senior to Roster
  const handleAddSenior = (e) => {
    e.preventDefault();
    if (!newSenior.rollNo.trim() || !newSenior.name.trim()) {
      alert('Please enter Roll Number and Senior Name.');
      return;
    }

    adminStore.addSeniorToRoster(newSenior.rollNo, newSenior);
    setRoster(adminStore.getSeniorRoster());
    setIsAddSeniorOpen(false);
    setNewSenior({
      rollNo: '',
      name: '',
      branch: 'Biotechnology',
      batch: "Batch of '25 • Senior"
    });
    notifySuccess(`Senior ${newSenior.name} (${newSenior.rollNo}) added to authorized roster.`);
  };

  // Save broadcast announcement
  const handleSaveBroadcast = () => {
    adminStore.saveSettings({
      broadcastMessage: broadcastDraft,
      broadcastActive: broadcastActiveDraft,
    });
    setSettings(adminStore.getSettings());
    notifySuccess('Website broadcast banner updated live!');
  };

  // Save Google Sheets & Excel Online configuration
  const handleSaveSheetsConfig = () => {
    adminStore.saveSettings({
      sheetsWebhookUrl: sheetsWebhookDraft.trim(),
      sheetsSpreadsheetUrl: sheetsSpreadsheetDraft.trim(),
    });
    setSettings(adminStore.getSettings());
    notifySuccess('Google Sheets & Excel sync configuration saved!');
  };

  const handleSyncAllToSheets = async () => {
    if (!sheetsWebhookDraft.trim()) {
      alert('Please enter your Google Apps Script Webhook URL first.');
      return;
    }
    setIsSyncingSheets(true);
    const count = await adminStore.syncAllToOnlineSheet();
    setIsSyncingSheets(false);
    notifySuccess(`Sync signal sent! Processed ${count} attendee registrations to online sheet.`);
  };

  // Reset all attendee and transaction data
  const handleResetData = () => {
    if (window.confirm('⚠️ Are you sure you want to RESET ALL REGISTRATION DATA? All attendee tickets, check-in statuses, and revenue records will be wiped back to 0.')) {
      adminStore.clearAllRegistrations();
      setRegistrations([]);
      setStats(adminStore.getStats());
      notifySuccess('All attendee data and revenue records have been wiped clean (0 registrations). Ready for live launch!');
    }
  };

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.fullName?.toLowerCase().includes(q);
        const matchesRoll = item.rollNo?.toLowerCase().includes(q);
        const matchesTicket = item.ticketId?.toLowerCase().includes(q);
        const matchesPhone = item.phone?.toLowerCase().includes(q);
        const matchesUtr = item.utrNumber?.toLowerCase().includes(q);
        if (!matchesName && !matchesRoll && !matchesTicket && !matchesPhone && !matchesUtr) {
          return false;
        }
      }

      // Filter Category
      if (filterType === 'FRESHER' && item.isSenior) return false;
      if (filterType === 'SENIOR' && !item.isSenior) return false;

      // Filter Status
      if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;

      // Filter CheckIn
      if (filterCheckIn === 'CHECKED_IN' && !item.checkedIn) return false;
      if (filterCheckIn === 'NOT_CHECKED_IN' && item.checkedIn) return false;

      // Filter Diet
      if (filterDiet !== 'ALL' && item.diet !== filterDiet) return false;

      return true;
    });
  }, [registrations, searchQuery, filterType, filterStatus, filterCheckIn, filterDiet]);

  // Senior roster list augmented with registration state
  const seniorRosterList = useMemo(() => {
    return Object.entries(roster).map(([roll, data]) => {
      const reg = registrations.find((r) => r.rollNo === roll);
      return {
        rollNo: roll,
        name: data.name,
        branch: data.branch,
        batch: data.batch,
        isRegistered: Boolean(reg),
        ticketId: reg?.ticketId,
        status: reg?.status || 'UNREGISTERED',
        checkedIn: reg?.checkedIn || false,
      };
    });
  }, [roster, registrations]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-obsidian-950/95 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200"
      data-lenis-prevent
    >
      {/* Background Neon Grid Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]" />
        <div className="w-full h-full bg-[radial-gradient(#00f2fe_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-7xl h-[95vh] max-h-[920px] bg-obsidian-900/90 border border-cyan-500/30 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden text-slate-100">
        
        {/* ========================================================================= */}
        {/* CASE A: ADMIN NOT AUTHENTICATED -> RENDER CYBER SECURITY GATEWAY */}
        {/* ========================================================================= */}
        {!isAuthenticated ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center z-10">
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
              title="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Cyber Shield */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-cyber-violet p-[2px] shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-pulse-glow">
                <div className="w-full h-full bg-obsidian-950 rounded-[22px] flex items-center justify-center">
                  <ShieldCheck className="w-12 h-12 text-cyan-300" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cyan-400 text-obsidian-950 flex items-center justify-center font-bold text-xs shadow-neon-cyan animate-bounce">
                🔒
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-outfit font-bold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SECURITY LEVEL 4 • RESTRICTED ACCESS</span>
            </div>

            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              ELIXORA 2.0 Command Nexus
            </h2>
            <p className="mt-2 text-slate-400 max-w-md text-sm font-outfit">
              Enter authorized administrator passcode to access event ledger, approvals, gate check-in, and guest rosters.
            </p>

            {/* Passcode Form */}
            <form onSubmit={handleLogin} className="mt-8 w-full max-w-sm flex flex-col gap-4">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/80" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Master Passcode..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-obsidian-950 border border-cyan-500/40 focus:border-cyan-400 text-white placeholder-slate-500 font-mono tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-semibold bg-rose-500/10 border border-rose-500/30 py-2 px-3 rounded-lg animate-shake">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-obsidian-950 text-cyan-500 focus:ring-cyan-500/40"
                  />
                  <span>Keep Session Active</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPasscode('ELIXORA2026');
                    soundController.playClick?.();
                  }}
                  className="text-cyan-400 hover:text-cyan-300 underline font-medium"
                >
                  Autofill Default PIN
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifyingAuth}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-cyber-violet hover:from-cyan-400 hover:to-purple-500 text-white font-outfit font-bold text-sm tracking-wider uppercase transition-all shadow-neon-cyan flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {isVerifyingAuth ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>AUTHENTICATING KEY...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>AUTHENTICATE PORTAL</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-500/60" />
              <span>Default Master Key: <code className="text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">ELIXORA2026</code></span>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CASE B: AUTHENTICATED -> FULL ADMIN DASHBOARD */
          /* ========================================================================= */
          <>
            {/* Top Navigation & Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-white/10 bg-obsidian-950/70 backdrop-blur-md shrink-0">
              
              {/* Title & Live Status */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-cyber-violet p-[1.5px] shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                  <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-outfit font-extrabold text-base sm:text-lg tracking-wide text-white">
                      ELIXORA 2.0 <span className="text-cyan-400 text-xs font-mono font-normal">ADMIN NEXUS</span>
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{currentTime} IST</span>
                    <span>•</span>
                    <span className="text-cyan-300 font-semibold">{stats.total} Passes Issued</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Export, Add Pass, Reset, Logout, Close */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => adminStore.exportToCSV()}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)] cursor-pointer"
                  title="Export complete attendee manifest to CSV / Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>

                <button
                  onClick={() => setIsAddPassOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-neon-cyan cursor-pointer"
                  title="Generate a manual VIP ticket for a walk-in or guest"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Pass</span>
                </button>

                <button
                  onClick={handleResetData}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 border border-white/10 transition-colors"
                  title="Reset to initial sample demo data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                  title="Log out of Admin Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
                  title="Close Portal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Flash Message Banner */}
            {actionSuccessMsg && (
              <div className="bg-cyan-500/20 border-b border-cyan-400/40 text-cyan-200 px-4 py-2 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200 shrink-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{actionSuccessMsg}</span>
                </div>
                <button onClick={() => setActionSuccessMsg('')} className="text-cyan-300 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 border-b border-white/10 bg-obsidian-950/40 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'overview', label: 'Overview & Stats', icon: Users, badge: null },
                { id: 'registrations', label: 'Registrations', icon: Ticket, badge: registrations.length },
                { id: 'gate', label: 'Gate Fast Check-In', icon: QrCode, badge: `${stats.checkedIn}/${stats.total}` },
                { id: 'roster', label: 'Senior VIP Roster', icon: GraduationCap, badge: Object.keys(roster).length },
                { id: 'settings', label: 'Broadcast & Config', icon: Settings, badge: null },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      soundController.playClick?.();
                    }}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-cyber-violet/20 border border-cyan-400/60 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== null && (
                      <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                        isActive ? 'bg-cyan-400 text-obsidian-950 font-bold' : 'bg-white/10 text-slate-300'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Tab Body Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* ================================================================= */}
              {/* TAB 1: OVERVIEW & ANALYTICS */}
              {/* ================================================================= */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Stats Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {/* 1. Total Revenue */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 relative overflow-hidden">
                      <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-1">
                        <span>Total Revenue</span>
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white font-outfit">
                        ₹{stats.totalRevenue.toLocaleString('en-IN')}
                      </div>
                      <p className="text-[10px] text-emerald-300/80 mt-1 font-mono">
                        +₹{stats.pendingRevenue} in review
                      </p>
                    </div>

                    {/* 2. Total Registrations */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 relative overflow-hidden">
                      <div className="flex items-center justify-between text-cyan-400 text-xs font-semibold mb-1">
                        <span>Total Passes</span>
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white font-outfit">
                        {stats.total}
                      </div>
                      <p className="text-[10px] text-cyan-300/80 mt-1 font-mono">
                        {stats.freshers} Freshers • {stats.seniors} Seniors
                      </p>
                    </div>

                    {/* 3. Verified Passes */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-transparent border border-sky-500/30 relative overflow-hidden">
                      <div className="flex items-center justify-between text-sky-400 text-xs font-semibold mb-1">
                        <span>Verified</span>
                        <BadgeCheck className="w-4 h-4" />
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white font-outfit">
                        {stats.verified}
                      </div>
                      <p className="text-[10px] text-sky-300/80 mt-1 font-mono">
                        {Math.round((stats.verified / (stats.total || 1)) * 100)}% approval rate
                      </p>
                    </div>

                    {/* 4. Pending Review */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 relative overflow-hidden">
                      <div className="flex items-center justify-between text-amber-400 text-xs font-semibold mb-1">
                        <span>Pending UTR</span>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-amber-300 font-outfit">
                        {stats.pending}
                      </div>
                      <p className="text-[10px] text-amber-300/80 mt-1 font-mono">
                        {stats.pending > 0 ? 'Requires attention' : 'All clear'}
                      </p>
                    </div>

                    {/* 5. Gate Attendance */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 relative overflow-hidden">
                      <div className="flex items-center justify-between text-purple-400 text-xs font-semibold mb-1">
                        <span>Gate Check-Ins</span>
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white font-outfit">
                        {stats.checkedIn}
                      </div>
                      <p className="text-[10px] text-purple-300/80 mt-1 font-mono">
                        {stats.total - stats.checkedIn} yet to arrive
                      </p>
                    </div>

                    {/* 6. Food Catering */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/30 relative overflow-hidden">
                      <div className="flex items-center justify-between text-pink-400 text-xs font-semibold mb-1">
                        <span>Food Count</span>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white font-outfit">
                        {stats.veg} <span className="text-xs text-slate-400 font-normal">Veg</span> / {stats.nonVeg} <span className="text-xs text-slate-400 font-normal">Non</span>
                      </div>
                      <p className="text-[10px] text-pink-300/80 mt-1 font-mono">
                        Catering headcount
                      </p>
                    </div>
                  </div>

                  {/* Mid Row: Action Quicklaunch & Live Broadcast Banner Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Quick Actions Panel */}
                    <div className="lg:col-span-2 p-5 rounded-2xl bg-obsidian-950/60 border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-outfit font-bold text-base text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-cyan-400" />
                            Event Operations Launchpad
                          </h3>
                          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                            Fast Access
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            onClick={() => setActiveTab('gate')}
                            className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-500/15 to-transparent border border-cyan-400/30 hover:border-cyan-400 text-left transition-all group cursor-pointer"
                          >
                            <QrCode className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-sm text-white font-outfit">Gate Scanner</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Live check-in &amp; ticket validator</div>
                          </button>

                          <button
                            onClick={() => {
                              setFilterStatus('PENDING');
                              setActiveTab('registrations');
                            }}
                            className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/15 to-transparent border border-amber-400/30 hover:border-amber-400 text-left transition-all group cursor-pointer"
                          >
                            <Clock className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-sm text-white font-outfit">Review Pending ({stats.pending})</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Approve UTR &amp; screenshots</div>
                          </button>

                          <button
                            onClick={() => setActiveTab('roster')}
                            className="p-3.5 rounded-xl bg-gradient-to-br from-purple-500/15 to-transparent border border-purple-400/30 hover:border-purple-400 text-left transition-all group cursor-pointer"
                          >
                            <GraduationCap className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-sm text-white font-outfit">Senior Roster</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">34 authorized VIP senior slots</div>
                          </button>
                        </div>
                      </div>

                      {/* Live Broadcast Notice Preview */}
                      <div className="mt-5 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <Megaphone className="w-4 h-4 text-cyan-400 shrink-0" />
                          <div className="text-xs text-cyan-200 truncate">
                            <span className="font-bold text-cyan-300 mr-2">LIVE WEBSITE BROADCAST:</span>
                            {settings.broadcastActive ? settings.broadcastMessage : '(Broadcast currently muted)'}
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('settings')}
                          className="text-xs text-cyan-300 hover:text-white font-semibold underline shrink-0 cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Right: Progress & Capacity Card */}
                    <div className="p-5 rounded-2xl bg-obsidian-950/60 border border-white/10 flex flex-col justify-between">
                      <div>
                        <h3 className="font-outfit font-bold text-base text-white mb-3 flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-cyber-violet" />
                          Ballroom Capacity Gauge
                        </h3>
                        
                        {/* Attendance Progress Bar */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Gate Check-in Ratio</span>
                            <span className="text-cyan-300 font-mono font-bold">
                              {stats.checkedIn} / {stats.total} ({Math.round((stats.checkedIn / (stats.total || 1)) * 100)}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-obsidian-900 rounded-full overflow-hidden border border-white/10">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-cyber-violet rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.round((stats.checkedIn / (stats.total || 1)) * 100))}%` }}
                            />
                          </div>
                        </div>

                        {/* Payment Verification Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Payment Verification Rate</span>
                            <span className="text-emerald-300 font-mono font-bold">
                              {stats.verified} / {stats.total} ({Math.round((stats.verified / (stats.total || 1)) * 100)}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-obsidian-900 rounded-full overflow-hidden border border-white/10">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.round((stats.verified / (stats.total || 1)) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                        <span>Target Arena Cap: <strong>250 Guests</strong></span>
                        <span className="text-cyan-400 font-mono font-bold">{Math.round((stats.total / 250) * 100)}% Booked</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Registrations Table Snapshot */}
                  <div className="p-5 rounded-2xl bg-obsidian-950/60 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-outfit font-bold text-base text-white">Recent Guest Registrations</h3>
                        <p className="text-xs text-slate-400">Latest ticket mints across Freshers and Seniors</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('registrations')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All ({registrations.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-outfit">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">Roll No</th>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3">Ticket ID</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Gate</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {registrations.slice(0, 5).map((item) => (
                            <tr key={item.ticketId} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-3 font-semibold text-white">
                                {item.fullName}
                              </td>
                              <td className="py-3 px-3 font-mono text-cyan-300">
                                {item.rollNo}
                              </td>
                              <td className="py-3 px-3">
                                {item.isSenior ? (
                                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold">
                                    SENIOR VIP
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/40 text-purple-300 text-[10px] font-bold">
                                    FRESHER
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 font-mono text-slate-300">
                                {item.ticketId}
                              </td>
                              <td className="py-3 px-3">
                                {item.status === 'VERIFIED' && (
                                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Verified
                                  </span>
                                )}
                                {item.status === 'PENDING' && (
                                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                                    <Clock className="w-3.5 h-3.5" />
                                    Pending
                                  </span>
                                )}
                                {item.status === 'REJECTED' && (
                                  <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                                    <XCircle className="w-3.5 h-3.5" />
                                    Rejected
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                {item.checkedIn ? (
                                  <span className="text-emerald-400 font-mono text-[11px] font-bold">Checked In</span>
                                ) : (
                                  <span className="text-slate-500 font-mono text-[11px]">Pending Entry</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => onOpenTicket?.(item)}
                                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-white/10 text-[11px] font-medium transition-colors cursor-pointer"
                                >
                                  View 3D Pass
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* TAB 2: FULL REGISTRATIONS & APPROVALS LEDGER */}
              {/* ================================================================= */}
              {activeTab === 'registrations' && (
                <div className="space-y-4">
                  {/* Filters & Search Toolbar */}
                  <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Name, Roll, Ticket ID, Phone, UTR..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Category Filter */}
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-obsidian-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        <option value="ALL">All Categories</option>
                        <option value="FRESHER">VIP Freshers</option>
                        <option value="SENIOR">Senior VIPs</option>
                      </select>

                      {/* Status Filter */}
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-obsidian-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="VERIFIED">Verified Only</option>
                        <option value="PENDING">Pending Review</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      {/* Check-In Filter */}
                      <select
                        value={filterCheckIn}
                        onChange={(e) => setFilterCheckIn(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-obsidian-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        <option value="ALL">All Gate States</option>
                        <option value="CHECKED_IN">Checked In</option>
                        <option value="NOT_CHECKED_IN">Awaiting Entry</option>
                      </select>

                      {/* Diet Filter */}
                      <select
                        value={filterDiet}
                        onChange={(e) => setFilterDiet(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-obsidian-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        <option value="ALL">All Diets</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                      </select>
                    </div>
                  </div>

                  {/* Summary bar */}
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>
                      Showing <strong>{filteredRegistrations.length}</strong> of <strong>{registrations.length}</strong> registrations
                    </span>
                    {filteredRegistrations.length < registrations.length && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterType('ALL');
                          setFilterStatus('ALL');
                          setFilterCheckIn('ALL');
                          setFilterDiet('ALL');
                        }}
                        className="text-cyan-400 hover:underline"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>

                  {/* Table View */}
                  <div className="rounded-2xl bg-obsidian-950/70 border border-white/10 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-outfit border-collapse">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-3.5">Student / Attendee</th>
                            <th className="py-3 px-3.5">Pass Category</th>
                            <th className="py-3 px-3.5">Ticket ID</th>
                            <th className="py-3 px-3.5">Payment &amp; UTR</th>
                            <th className="py-3 px-3.5">Diet</th>
                            <th className="py-3 px-3.5">Approval Status</th>
                            <th className="py-3 px-3.5">Gate Entry</th>
                            <th className="py-3 px-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredRegistrations.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-12 text-center text-slate-400">
                                <Search className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                <p className="font-semibold">No matching guest registrations found</p>
                                <p className="text-[11px] text-slate-500 mt-1">Try relaxing search terms or filter criteria</p>
                              </td>
                            </tr>
                          ) : (
                            filteredRegistrations.map((item) => (
                              <tr key={item.ticketId} className="hover:bg-white/5 transition-colors group">
                                
                                {/* 1. Student Name & Roll */}
                                <td className="py-3 px-3.5">
                                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                    <span>{item.fullName}</span>
                                    {item.seniorQuote && (
                                      <span title={`Quote: "${item.seniorQuote}"`} className="text-cyan-400 cursor-help">
                                        💬
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] font-mono text-cyan-300 mt-0.5">
                                    Roll: {item.rollNo}
                                  </div>
                                  {item.phone && (
                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                      📞 {item.phone}
                                    </div>
                                  )}
                                </td>

                                {/* 2. Category */}
                                <td className="py-3 px-3.5">
                                  {item.isSenior ? (
                                    <div className="inline-flex flex-col">
                                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-extrabold tracking-wide">
                                        SENIOR VIP
                                      </span>
                                      <span className="text-[10px] text-slate-400 mt-0.5">{item.batch || "Batch of '25"}</span>
                                    </div>
                                  ) : (
                                    <div className="inline-flex flex-col">
                                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] font-extrabold tracking-wide">
                                        FRESHER VIP
                                      </span>
                                      <span className="text-[10px] text-slate-400 mt-0.5">Batch of '26</span>
                                    </div>
                                  )}
                                </td>

                                {/* 3. Ticket ID */}
                                <td className="py-3 px-3.5">
                                  <div className="flex items-center gap-1">
                                    <code className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-cyan-200 font-mono text-[11px]">
                                      {item.ticketId}
                                    </code>
                                    <button
                                      onClick={() => handleCopy(item.ticketId, item.ticketId)}
                                      className="text-slate-400 hover:text-white p-1 transition-colors"
                                      title="Copy Ticket ID"
                                    >
                                      {copiedId === item.ticketId ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                  <span className="text-[10px] text-slate-500 block mt-0.5">{item.issuedAt || 'Recent'}</span>
                                </td>

                                {/* 4. Payment Info */}
                                <td className="py-3 px-3.5">
                                  <div className="font-bold text-white text-xs">
                                    ₹{item.ticketPrice || (item.isSenior ? 499 : 399)}
                                  </div>
                                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 mt-0.5">
                                    <span>UTR:</span>
                                    <span className="text-cyan-400 font-semibold">{item.utrNumber || 'N/A'}</span>
                                  </div>
                                  {item.screenshot && (
                                    <button
                                      onClick={() => setSelectedProof(item)}
                                      className="mt-1 text-[10px] text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>View Receipt</span>
                                    </button>
                                  )}
                                </td>

                                {/* 5. Diet */}
                                <td className="py-3 px-3.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    item.diet === 'Veg'
                                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                                      : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                                  }`}>
                                    {item.diet || 'Veg'}
                                  </span>
                                </td>

                                {/* 6. Status */}
                                <td className="py-3 px-3.5">
                                  {item.status === 'VERIFIED' && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-[11px]">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>VERIFIED</span>
                                    </div>
                                  )}
                                  {item.status === 'PENDING' && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-[11px]">
                                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                                      <span>REVIEW</span>
                                    </div>
                                  )}
                                  {item.status === 'REJECTED' && (
                                    <div className="inline-flex flex-col">
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-bold text-[11px]">
                                        <XCircle className="w-3.5 h-3.5" />
                                        <span>REJECTED</span>
                                      </span>
                                      {item.rejectionReason && (
                                        <span className="text-[10px] text-rose-400 mt-1 max-w-[140px] truncate" title={item.rejectionReason}>
                                          {item.rejectionReason}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </td>

                                {/* 7. Gate Entry */}
                                <td className="py-3 px-3.5">
                                  <button
                                    onClick={() => handleToggleCheckIn(item.ticketId)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                      item.checkedIn
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                        : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    <Check className={`w-3 h-3 ${item.checkedIn ? 'text-emerald-400' : 'text-slate-500'}`} />
                                    <span>{item.checkedIn ? 'Checked In' : 'Check In'}</span>
                                  </button>
                                  {item.checkedInAt && (
                                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{item.checkedInAt}</span>
                                  )}
                                </td>

                                {/* 8. Actions */}
                                <td className="py-3 px-3.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {/* Approve Button (if not already verified) */}
                                    {item.status !== 'VERIFIED' && (
                                      <button
                                        onClick={() => handleApprove(item.ticketId)}
                                        className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 transition-colors"
                                        title="Verify & Approve Payment"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    {/* Reject Button (if not rejected) */}
                                    {item.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => handleInitiateReject(item)}
                                        className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-colors"
                                        title="Reject / Flag Registration"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    {/* View 3D Holographic Pass */}
                                    <button
                                      onClick={() => onOpenTicket?.(item)}
                                      className="p-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 transition-colors"
                                      title="Open Interactive 3D Holographic Ticket"
                                    >
                                      <Ticket className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      onClick={() => handleDelete(item.ticketId, item.fullName)}
                                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                                      title="Delete Registration"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* TAB 3: FAST GATE QR & TICKET SCANNER */}
              {/* ================================================================= */}
              {activeTab === 'gate' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase mb-2">
                      <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>GATE OPERATIONS KIOSK • LIVE VERIFICATION</span>
                    </div>
                    <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl text-white">
                      Fast Entry Gate Scanner
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      Scan QR code or enter Ticket ID / Roll Number to instantly grant entry and prevent duplicates.
                    </p>
                  </div>

                  {/* Scanner Simulation Card */}
                  <div className="p-6 rounded-3xl bg-obsidian-950/80 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
                    
                    {/* Simulated Laser Line Scanner Frame */}
                    <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl border-2 border-dashed border-cyan-400/60 p-3 mb-6 flex flex-col items-center justify-center bg-obsidian-900/60">
                      {/* Laser Line Animation */}
                      <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f2fe] animate-[floatSlow_3s_ease-in-out_infinite]" />
                      <QrCode className="w-24 h-24 text-cyan-400/40" />
                      <span className="text-[10px] font-mono text-cyan-300/80 uppercase mt-2">
                        Target Ticket QR
                      </span>
                    </div>

                    {/* Fast Search Input Form */}
                    <form onSubmit={handleGateScan} className="flex gap-2 max-w-md mx-auto">
                      <input
                        type="text"
                        value={gateInput}
                        onChange={(e) => setGateInput(e.target.value)}
                        placeholder="e.g. ELX-26-8812 or 25110046"
                        className="flex-1 px-4 py-3 rounded-xl bg-obsidian-900 border border-cyan-500/40 text-white font-mono text-center text-sm focus:outline-none focus:border-cyan-400"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-bold text-xs uppercase tracking-wider shadow-neon-cyan transition-all cursor-pointer"
                      >
                        Verify
                      </button>
                    </form>

                    {/* Instant Result Box */}
                    {gateResult && (
                      <div className="mt-6 max-w-md mx-auto animate-in zoom-in-95 duration-200">
                        {gateResult.found ? (
                          <div className={`p-4 rounded-2xl border ${
                            gateResult.alreadyCheckedIn
                              ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                              : gateResult.isValid
                              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200'
                              : 'bg-rose-500/15 border-rose-500/50 text-rose-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              {gateResult.alreadyCheckedIn ? (
                                <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
                              ) : gateResult.isValid ? (
                                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                              ) : (
                                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                              )}
                              <div>
                                <div className="font-extrabold text-base text-white">
                                  {gateResult.alreadyCheckedIn
                                    ? 'ALREADY SCANNED AT GATE'
                                    : gateResult.isValid
                                    ? 'ACCESS GRANTED • VALID VIP PASS'
                                    : 'UNAUTHORIZED / UNVERIFIED'}
                                </div>
                                <div className="text-xs font-semibold mt-0.5">
                                  {gateResult.ticket.fullName} ({gateResult.ticket.rollNo})
                                </div>
                                <div className="text-[11px] font-mono opacity-80 mt-1">
                                  Gate: {gateResult.ticket.entryGate || 'Gate 2 (North Arch)'} • Zone: {gateResult.ticket.tableZone || 'Floor'}
                                </div>
                                {gateResult.alreadyCheckedIn && (
                                  <div className="text-[10px] text-amber-300 font-bold mt-1">
                                    ⚠️ Checked in at {gateResult.ticket.checkedInAt || 'Earlier'}. Duplicate entry rejected!
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/50 text-rose-200 flex items-center gap-3">
                            <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                            <div>
                              <div className="font-bold text-white text-sm">NO TICKET FOUND</div>
                              <div className="text-xs text-rose-300">
                                Identifier "{gateResult.query}" not recognized in guest ledger.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Live Stream of Gate Check-Ins */}
                  <div className="p-5 rounded-2xl bg-obsidian-950/60 border border-white/10">
                    <h3 className="font-outfit font-bold text-sm text-white mb-3 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      Live Gate Entry Stream
                    </h3>

                    {gateRecentEntries.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No entries logged this session yet. Scan tickets above.</p>
                    ) : (
                      <div className="space-y-2">
                        {gateRecentEntries.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span className="font-bold text-white">{entry.name}</span>
                              <span className="font-mono text-cyan-300">({entry.rollNo})</span>
                              {entry.isSenior && (
                                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                                  SENIOR
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">{entry.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* TAB 4: OFFICIAL SENIOR VIP ROSTER */}
              {/* ================================================================= */}
              {activeTab === 'roster' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-obsidian-950/70 border border-white/10">
                    <div>
                      <h2 className="font-outfit font-extrabold text-lg text-white flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-cyan-400" />
                        Authorized Senior Roster (Batch of '25)
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Students on this roster are permitted to unlock and mint the VIP Senior Council Pass.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddSeniorOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add Senior to Roster</span>
                    </button>
                  </div>

                  {/* Senior Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {seniorRosterList.map((senior) => (
                      <div
                        key={senior.rollNo}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          senior.isRegistered
                            ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                            : 'bg-obsidian-950/40 border-white/10 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-white text-sm">
                              {senior.name}
                            </div>
                            <div className="text-xs font-mono text-cyan-400 font-semibold mt-0.5">
                              {senior.rollNo}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {senior.batch}
                            </div>
                          </div>

                          {senior.isRegistered ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                              PASS MINTED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px]">
                              UNREGISTERED
                            </span>
                          )}
                        </div>

                        {senior.isRegistered && (
                          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                            <span className="text-cyan-300 font-mono text-[11px]">
                              {senior.ticketId}
                            </span>
                            <span className={`text-[10px] font-bold ${
                              senior.checkedIn ? 'text-emerald-400' : 'text-slate-400'
                            }`}>
                              {senior.checkedIn ? '● Checked In' : '○ Not At Gate'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* TAB 5: PORTAL SETTINGS & LIVE BROADCAST NEXUS */}
              {/* ================================================================= */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  
                  {/* Broadcast Banner Config */}
                  <div className="p-5 rounded-2xl bg-obsidian-950/70 border border-white/10">
                    <h3 className="font-outfit font-bold text-base text-white mb-1 flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-cyan-400" />
                      Live Website Broadcast Marquee
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Broadcast real-time announcements, urgent gate advisories, or artist schedule updates directly across the top banner of the website.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Announcement Message
                        </label>
                        <textarea
                          rows={2}
                          value={broadcastDraft}
                          onChange={(e) => setBroadcastDraft(e.target.value)}
                          placeholder="e.g. ✨ Gates Open at 6:00 PM • Bring College ID • DJ VORTEX at 8:30 PM"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={broadcastActiveDraft}
                            onChange={(e) => setBroadcastActiveDraft(e.target.checked)}
                            className="rounded border-slate-700 bg-obsidian-900 text-cyan-500 focus:ring-cyan-500/30"
                          />
                          <span>Show Announcement Bar on Website</span>
                        </label>

                        <button
                          onClick={handleSaveBroadcast}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Publish Broadcast
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Live Google Sheets & Excel Cloud Integration */}
                  <div className="p-5 rounded-2xl bg-obsidian-950/70 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.1)]">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                      <div>
                        <h3 className="font-outfit font-bold text-base text-white flex items-center gap-2">
                          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                          <span>Google Sheets &amp; Excel Online Real-Time Sync</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Stores: Payment Time, Full Name, Registration No, Category, Amount Paid, Phone Number, Refreshment Preference (Veg/Non-Veg), UTR No, Ticket ID.
                        </p>
                      </div>

                      {settings.sheetsSpreadsheetUrl && (
                        <a
                          href={settings.sheetsSpreadsheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Open Live Sheet</span>
                        </a>
                      )}
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Viewable Spreadsheet Link (Google Sheets or OneDrive Excel)
                        </label>
                        <input
                          type="url"
                          value={sheetsSpreadsheetDraft}
                          onChange={(e) => setSheetsSpreadsheetDraft(e.target.value)}
                          placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Paste your online Google Sheets or Excel Online link here to easily view payments in 1 click.
                        </span>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Google Apps Script Webhook URL (For Automatic Real-Time Row Appending)
                        </label>
                        <input
                          type="url"
                          value={sheetsWebhookDraft}
                          onChange={(e) => setSheetsWebhookDraft(e.target.value)}
                          placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Every new ticket generated from the Fresher or Senior checkout will automatically POST to this webhook URL.
                        </span>
                      </div>

                      <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setShowScriptModal(true)}
                          className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>How to set up Google Sheets Webhook in 2 minutes (Click for Code)</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSyncAllToSheets}
                            disabled={isSyncingSheets || !sheetsWebhookDraft}
                            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                            title="Sends all current attendee records to your online sheet"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncingSheets ? 'animate-spin' : ''}`} />
                            <span>{isSyncingSheets ? 'Syncing...' : 'Sync All Records Now'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleSaveSheetsConfig}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Save Sheet Settings
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Ticket Config */}
                  <div className="p-5 rounded-2xl bg-obsidian-950/70 border border-white/10">
                    <h3 className="font-outfit font-bold text-base text-white mb-1 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      Event Pricing &amp; Bank UPI Details
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Parameters used for dynamic QR codes and checkout ledger.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Fresher VIP Ticket Price (INR)</label>
                        <input
                          type="number"
                          value={settings.fresherPrice}
                          readOnly
                          className="w-full px-3 py-2 rounded-xl bg-obsidian-900/60 border border-white/10 text-slate-300 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Senior VIP Ticket Price (INR)</label>
                        <input
                          type="number"
                          value={settings.seniorPrice}
                          readOnly
                          className="w-full px-3 py-2 rounded-xl bg-obsidian-900/60 border border-white/10 text-slate-300 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Receiving UPI VPA</label>
                        <input
                          type="text"
                          value={settings.upiId}
                          readOnly
                          className="w-full px-3 py-2 rounded-xl bg-obsidian-900/60 border border-white/10 text-slate-300 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Payee Name</label>
                        <input
                          type="text"
                          value={settings.payeeName}
                          readOnly
                          className="w-full px-3 py-2 rounded-xl bg-obsidian-900/60 border border-white/10 text-slate-300 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Admin Security Passcode Info */}
                  <div className="p-5 rounded-2xl bg-obsidian-950/70 border border-white/10">
                    <h3 className="font-outfit font-bold text-base text-white mb-1 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyber-violet" />
                      Portal Security Keys
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">
                      Authorized passkeys for ELIXORA administrator access.
                    </p>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-slate-400">Master Passcode:</span>
                      <code className="px-2 py-1 rounded bg-black/40 border border-cyan-500/30 text-cyan-300 font-bold">
                        {settings.adminPin}
                      </code>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">Emergency Backup:</span>
                      <code className="px-2 py-1 rounded bg-black/40 border border-purple-500/30 text-purple-300 font-bold">
                        {settings.backupPin}
                      </code>
                    </div>
                  </div>

                  {/* Data Reset & Export */}
                  <div className="p-5 rounded-2xl bg-obsidian-950/70 border border-rose-500/30">
                    <h3 className="font-outfit font-bold text-base text-rose-300 mb-1 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Danger Zone &amp; Data Maintenance
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Restore default demo datasets or download full offline backup.
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => adminStore.exportToCSV()}
                        className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        Download Full CSV Backup
                      </button>

                      <button
                        onClick={handleResetData}
                        className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        Wipe All Attendee Data (Reset to 0)
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: VIEW PAYMENT SCREENSHOT PROOF */}
      {/* ===================================================================== */}
      {selectedProof && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-obsidian-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-5 text-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-outfit font-bold text-base text-white">Payment Receipt Proof</h3>
                <p className="text-xs text-cyan-300 font-mono">
                  {selectedProof.fullName} • UTR: {selectedProof.utrNumber || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedProof(null)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 flex items-center justify-center">
              {selectedProof.screenshot ? (
                <img
                  src={selectedProof.screenshot}
                  alt="Payment Receipt"
                  className="max-h-[60vh] max-w-full object-contain rounded-xl border border-white/10"
                />
              ) : (
                <div className="py-16 text-center text-slate-500 text-xs">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                  <span>No image screenshot attached with this transaction.</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-400">
                Amount: <strong>₹{selectedProof.ticketPrice || 399}</strong>
              </span>

              <div className="flex items-center gap-2">
                {selectedProof.status !== 'VERIFIED' && (
                  <button
                    onClick={() => {
                      handleApprove(selectedProof.ticketId);
                      setSelectedProof(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold text-xs cursor-pointer"
                  >
                    Approve Payment
                  </button>
                )}

                {selectedProof.status !== 'REJECTED' && (
                  <button
                    onClick={() => {
                      handleInitiateReject(selectedProof);
                      setSelectedProof(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 font-bold text-xs cursor-pointer"
                  >
                    Reject Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: MANUAL ISSUE PASS */}
      {/* ===================================================================== */}
      {isAddPassOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-obsidian-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-outfit font-bold text-base text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-cyan-400" />
                Issue Manual VIP Pass
              </h3>
              <button
                onClick={() => setIsAddPassOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualPass} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualPass.fullName}
                  onChange={(e) => setManualPass({ ...manualPass, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">College Roll / Student ID *</label>
                <input
                  type="text"
                  required
                  value={manualPass.rollNo}
                  onChange={(e) => setManualPass({ ...manualPass, rollNo: e.target.value })}
                  placeholder="e.g. 26110099"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={manualPass.phone}
                    onChange={(e) => setManualPass({ ...manualPass, phone: e.target.value })}
                    placeholder="10-digit phone"
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dietary Preference</label>
                  <select
                    value={manualPass.diet}
                    onChange={(e) => setManualPass({ ...manualPass, diet: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category / Role</label>
                <select
                  value={manualPass.isSenior ? 'SENIOR' : 'FRESHER'}
                  onChange={(e) => setManualPass({ ...manualPass, isSenior: e.target.value === 'SENIOR' })}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="FRESHER">VIP Fresher (₹399)</option>
                  <option value="SENIOR">Senior VIP Pass (₹499)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">UPI Transaction / UTR (Optional)</label>
                <input
                  type="text"
                  value={manualPass.utrNumber}
                  onChange={(e) => setManualPass({ ...manualPass, utrNumber: e.target.value })}
                  placeholder="e.g. 429100000000 or CASH_DESK"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPassOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold shadow-neon-cyan cursor-pointer"
                >
                  Generate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: ADD SENIOR TO AUTHORIZED ROSTER */}
      {/* ===================================================================== */}
      {isAddSeniorOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-obsidian-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-outfit font-bold text-base text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                Authorize New Senior
              </h3>
              <button
                onClick={() => setIsAddSeniorOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSenior} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Registration / Roll No *</label>
                <input
                  type="text"
                  required
                  value={newSenior.rollNo}
                  onChange={(e) => setNewSenior({ ...newSenior, rollNo: e.target.value })}
                  placeholder="e.g. 25110073"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Senior Full Name *</label>
                <input
                  type="text"
                  required
                  value={newSenior.name}
                  onChange={(e) => setNewSenior({ ...newSenior, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Batch / Designation</label>
                <input
                  type="text"
                  value={newSenior.batch}
                  onChange={(e) => setNewSenior({ ...newSenior, batch: e.target.value })}
                  placeholder="Batch of '25 • Senior"
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSeniorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold shadow-neon-cyan cursor-pointer"
                >
                  Add to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: REJECTION REASON PROMPT */}
      {/* ===================================================================== */}
      {rejectingItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-obsidian-900 border border-rose-500/40 rounded-2xl shadow-2xl p-5 text-slate-100">
            <h3 className="font-outfit font-bold text-base text-rose-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Reject Registration
            </h3>
            <p className="text-xs text-slate-300 mb-3">
              Mark pass <strong>{rejectingItem.ticketId}</strong> ({rejectingItem.fullName}) as rejected. Provide reason for attendee reference:
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. UTR number not found in college bank ledger or invalid receipt screenshot."
              className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-400 mb-4"
            />

            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 5: GOOGLE APPS SCRIPT WEBHOOK SETUP GUIDE */}
      {/* ===================================================================== */}
      {showScriptModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-obsidian-900 border border-emerald-500/50 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-outfit font-bold text-base text-white">
                  Google Sheets &amp; Excel Live Webhook Setup Guide
                </h3>
              </div>
              <button
                onClick={() => setShowScriptModal(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs font-outfit">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                ✨ <strong>Zero server required!</strong> Every ticket payment will be appended as a new row in your Google Sheet in real-time. You can view or download it as an Excel (.xlsx) file at any moment.
              </div>

              <div className="space-y-3 text-slate-300">
                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                  <span>Open <a href="https://docs.google.com/spreadsheets/d/1K5EIJ0YWwLzctCVlQHbAu212kaiYvKIOB53HMm6RKLQ/edit?hl=en-GB&gid=0#gid=0" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-bold">your ELIXORA Google Sheet</a> in your browser.</span>
                </div>

                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                  <span>In the top menu, click <strong>Extensions</strong> → <strong>Apps Script</strong>.</span>
                </div>

                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                  <span>Delete any existing code in the editor, and paste this script:</span>
                </div>

                <div className="relative">
                  <pre className="p-3.5 rounded-xl bg-black/70 border border-white/10 font-mono text-[11px] text-cyan-200 overflow-x-auto select-all max-h-72">
{`function getOrCreateSheet() {
  var ss;
  try {
    ss = SpreadsheetApp.openById("1K5EIJ0YWwLzctCVlQHbAu212kaiYvKIOB53HMm6RKLQ");
  } catch (e) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  return ss.getActiveSheet();
}

function setupProperTable(sheet) {
  var headers = [
    "Payment Time / Date",
    "Name of Student",
    "Registration / Roll Number",
    "Pass Category",
    "Amount Paid (INR)",
    "Phone Number",
    "Refreshment Preference",
    "UPI UTR / Ref Number",
    "Ticket ID",
    "Verification Status",
    "Gate Check-In",
    "Senior Quote / Notes"
  ];
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  // Format Header Row (Executive Navy + Cyan + Bold + 38px height)
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#0F172A");
  headerRange.setFontColor("#38BDF8");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment("center");
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
  
  // Format Currency column (Column E)
  sheet.getRange("E2:E").setNumberFormat("₹#,##0");
}

function initialSetup() {
  var sheet = getOrCreateSheet();
  setupProperTable(sheet);
}

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    if (sheet.getLastRow() === 0) {
      setupProperTable(sheet);
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.paymentTime || new Date().toLocaleString("en-IN", {timeZone: "Asia/Kolkata"}),
      data.fullName || "",
      data.rollNo || "",
      data.category || "Pass",
      data.ticketPrice || 0,
      data.phone || "",
      data.diet || "Veg",
      data.utrNumber || "N/A",
      data.ticketId || "",
      data.status || "VERIFIED",
      data.gateCheckIn || "NO",
      data.seniorQuote || ""
    ]);
    
    var lastRow = sheet.getLastRow();
    var rowBg = (lastRow % 2 === 0) ? "#F8FAFC" : "#FFFFFF";
    var dataRange = sheet.getRange(lastRow, 1, 1, 12);
    dataRange.setBackground(rowBg);
    dataRange.setFontSize(10);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}
                  </pre>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`function getOrCreateSheet() {\n  var ss;\n  try {\n    ss = SpreadsheetApp.openById("1K5EIJ0YWwLzctCVlQHbAu212kaiYvKIOB53HMm6RKLQ");\n  } catch (e) {\n    ss = SpreadsheetApp.getActiveSpreadsheet();\n  }\n  return ss.getActiveSheet();\n}\n\nfunction setupProperTable(sheet) {\n  var headers = [\n    "Payment Time / Date",\n    "Name of Student",\n    "Registration / Roll Number",\n    "Pass Category",\n    "Amount Paid (INR)",\n    "Phone Number",\n    "Refreshment Preference",\n    "UPI UTR / Ref Number",\n    "Ticket ID",\n    "Verification Status",\n    "Gate Check-In",\n    "Senior Quote / Notes"\n  ];\n  if (sheet.getLastRow() === 0) {\n    sheet.appendRow(headers);\n  } else {\n    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);\n  }\n  var headerRange = sheet.getRange(1, 1, 1, headers.length);\n  headerRange.setBackground("#0F172A");\n  headerRange.setFontColor("#38BDF8");\n  headerRange.setFontWeight("bold");\n  headerRange.setFontSize(11);\n  headerRange.setHorizontalAlignment("center");\n  sheet.setRowHeight(1, 38);\n  sheet.setFrozenRows(1);\n  sheet.getRange("E2:E").setNumberFormat("₹#,##0");\n}\n\nfunction initialSetup() {\n  var sheet = getOrCreateSheet();\n  setupProperTable(sheet);\n}\n\nfunction doPost(e) {\n  try {\n    var sheet = getOrCreateSheet();\n    if (sheet.getLastRow() === 0) {\n      setupProperTable(sheet);\n    }\n    var data = JSON.parse(e.postData.contents);\n    sheet.appendRow([\n      data.paymentTime || new Date().toLocaleString("en-IN", {timeZone: "Asia/Kolkata"}),\n      data.fullName || "",\n      data.rollNo || "",\n      data.category || "Pass",\n      data.ticketPrice || 0,\n      data.phone || "",\n      data.diet || "Veg",\n      data.utrNumber || "N/A",\n      data.ticketId || "",\n      data.status || "VERIFIED",\n      data.gateCheckIn || "NO",\n      data.seniorQuote || ""\n    ]);\n    var lastRow = sheet.getLastRow();\n    var rowBg = (lastRow % 2 === 0) ? "#F8FAFC" : "#FFFFFF";\n    var dataRange = sheet.getRange(lastRow, 1, 1, 12);\n    dataRange.setBackground(rowBg);\n    dataRange.setFontSize(10);\n    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))\n      .setMimeType(ContentService.MimeType.JSON);\n  } catch (err) {\n    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))\n      .setMimeType(ContentService.MimeType.JSON);\n  }\n}`);
                      notifySuccess('Enhanced Google Apps Script copied to clipboard!');
                    }}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Script</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0">4</span>
                  <span>Click <strong>Deploy</strong> (top right) → <strong>New deployment</strong> → Select <strong>Web app</strong>.</span>
                </div>

                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0">5</span>
                  <span>Set <strong>Who has access</strong> to <strong>"Anyone"</strong> (crucial so the website can post data), then click <strong>Deploy</strong>.</span>
                </div>

                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0">6</span>
                  <span>Copy the generated <strong>Web app URL</strong> (starts with <code>https://script.google.com/macros/s/...</code>) and paste it into the <strong>Google Apps Script Webhook URL</strong> box in settings!</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowScriptModal(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
