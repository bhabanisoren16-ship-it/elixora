// Central Store & State Manager for ELIXORA 2.0 Admin Portal
import { EVENT_DETAILS } from './calendar.js';
import { isSupabaseConfigured } from '../lib/supabase.js';
import { 
  saveRegistrationToSupabase, 
  fetchRegistrationsFromSupabase, 
  updateRegistrationStatusInSupabase, 
  updateAttendanceInSupabase, 
  deleteRegistrationFromSupabase,
  subscribeToSupabaseRegistrations,
  syncAllRegistrationsToSupabase 
} from '../services/supabaseService.js';

// Initial official registered seniors roster (Verified from official college roster)
export const DEFAULT_SENIOR_ROSTER = {
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

// Initial registrations start empty for clean live launch
const INITIAL_SAMPLE_REGISTRATIONS = [];

const STORAGE_KEYS = {
  REGISTRATIONS: 'elixora_registrations_v4',
  DELETED_IDS: 'elixora_deleted_registrations_v1',
  ROSTER: 'elixora_senior_roster_v3',
  SETTINGS: 'elixora_admin_settings_v3',
  AUTH: 'elixora_admin_auth_v3',
};

const DEFAULT_SETTINGS = {
  adminPin: 'ELIXORA2026',
  backupPin: 'ADMIN@ELX26',
  fresherPrice: 399,
  seniorPrice: 600,
  upiId: EVENT_DETAILS.upiId || 'elixora2026@okhdfcbank',
  payeeName: 'ELIXORA FRESHERS 2026',
  venue: 'Grand Aurora Ballroom & Open Air Arena, Tech Campus',
  gateStatus: 'ACTIVE',
  broadcastMessage: '✨ Gates Open at 6:00 PM • Dress Code: Cyber Glam & Neon Ethereal • Keep Pass QR Ready at Gate 2',
  broadcastActive: false,
  sheetsWebhookUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHEETS_WEBHOOK_URL) || 'https://script.google.com/macros/s/AKfycbxOLPdN4zOgfweS5W9HUsmmVatNIUp6D72YSW23YD_fW0doyUwKGBlOvSOhkgWPtZGc6g/exec',
  sheetsSpreadsheetUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHEETS_SPREADSHEET_URL) || 'https://docs.google.com/spreadsheets/d/1K5EIJ0YWwLzctCVlQHbAu212kaiYvKIOB53HMm6RKLQ/edit?hl=en-GB&gid=0#gid=0',

  // Official Schedule & Venue Public Blueprint Controls
  isDateVenueAnnounced: false, // false = locked behind "Yet to be announced" teaser, true = unlocked
  eventHumanDate: 'Saturday, October 24, 2026',
  eventDateIso: '2026-10-24T18:30:00+05:30',
  eventTimeRange: '06:30 PM - 07:45 PM',
  eventTimingLabel: 'Entry & Red Carpet',
  venueTitle: 'Grand Aurora Arena',
  venueSubtitle: 'Tech Campus Main Quadrangle & Open Air Amphitheatre.',
  venueSectorTag: 'AURORA ARENA • SECTOR 4',
  venueCoordinates: '28.5355° N, 77.3910° E',
  venueGateTag: 'NORTH GATE',
  transitPoint1: 'Metro Line 3',
  transitPoint2: 'Gate 2 Drop',
  venueMapsUrl: 'https://maps.google.com/?q=Tech+Campus+Grand+Arena',
  teaserBadge: 'OFFICIAL SCHEDULE & VENUE',
  teaserTitle: 'Yet to be announced',
  teaserMessage: 'The official event date, red carpet timings, and secret venue coordinates will be revealed soon.',
  teaserPill: 'Dropping Soon • Keep An Eye Out',
};

// Safe storage utilities
function safeGet(key, defaultVal) {
  try {
    if (typeof localStorage === 'undefined') return defaultVal;
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Storage read failed:', err);
    return defaultVal;
  }
}

function safeSet(key, val) {
  try {
    if (typeof localStorage === 'undefined') return;
    const newJson = JSON.stringify(val);
    const existingJson = localStorage.getItem(key);
    if (existingJson === newJson) {
      // Data is unchanged; do not dispatch redundant events or trigger re-render loops
      return;
    }
    localStorage.setItem(key, newJson);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('elixora_admin_update', { detail: { key } }));
    }
  } catch (err) {
    console.warn('Storage write failed:', err);
  }
}

function isValidIdentifier(val) {
  if (!val || typeof val !== 'string') return false;
  const s = val.trim();
  if (!s || s === '-' || s === 'N/A' || s === 'null' || s === 'undefined' || s === '[DELETED]' || s === 'DELETED') return false;
  return s.length >= 2;
}

function getCleanDeletedIds() {
  const rawDeleted = safeGet(STORAGE_KEYS.DELETED_IDS, []);
  if (!Array.isArray(rawDeleted)) return new Set();
  return new Set(rawDeleted.filter(isValidIdentifier));
}

function generateStableId(item, idx = 0) {
  if (item && item._id && isValidIdentifier(item._id) && item._id !== '-' && item._id !== 'N/A') {
    return item._id;
  }
  if (item && isValidIdentifier(item.ticketId)) {
    return item.ticketId.trim();
  }
  if (item && isValidIdentifier(item.id)) {
    return item.id.trim();
  }
  if (item && isValidIdentifier(item.rollNo)) {
    return 'reg_roll_' + item.rollNo.trim().toUpperCase();
  }
  const name = (item && item.fullName ? item.fullName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') : 'guest');
  const price = (item && item.ticketPrice) || '0';
  const time = (item && item.issuedAt ? item.issuedAt.replace(/[^a-zA-Z0-9]/g, '_') : 'time');
  return `reg_${idx}_${name}_${price}_${time}`;
}

function sanitizeRegistrations(list) {
  if (!Array.isArray(list)) return [];
  const deletedIds = getCleanDeletedIds();
  return list.filter((r) => {
    if (!r || typeof r !== 'object') return false;
    if (r.branch === 'DELETED' || r.fullName === '[DELETED]') return false;
    if (r.fullName?.trim() === '[DELETED]') return false;

    // Strictly check against deletedIds with valid identifiers
    if (isValidIdentifier(r._id) && deletedIds.has(r._id)) return false;
    if (isValidIdentifier(r.id) && deletedIds.has(r.id)) return false;
    if (isValidIdentifier(r.ticketId) && deletedIds.has(r.ticketId)) return false;
    if (isValidIdentifier(r.rollNo) && (deletedIds.has(r.rollNo) || deletedIds.has(r.rollNo.toUpperCase()))) return false;
    return true;
  });
}

// Real-time backend synchronization manager
let isRealtimeStarted = false;
let sseConnection = null;

export function getAdminAuthHeaders() {
  const token = 
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('elixora_admin_token')) || 
    (typeof localStorage !== 'undefined' && localStorage.getItem('elixora_admin_token')) || 
    'ELIXORA2026';
  return {
    'Content-Type': 'application/json',
    'x-admin-key': token,
  };
}

async function fetchRegistrationsFromBackend() {
  if (typeof window === 'undefined') return [];
  try {
    // 1. Prioritize Cloud Supabase if configured
    if (isSupabaseConfigured()) {
      const supaList = await fetchRegistrationsFromSupabase();
      if (Array.isArray(supaList)) {
        const deletedIds = getCleanDeletedIds();

        // Filter out any deleted items from supaList
        const activeSupaList = supaList.filter(
          (s) => !deletedIds.has(s.ticketId) && 
                 !deletedIds.has(s.rollNo) && 
                 !(s.rollNo && deletedIds.has(s.rollNo.toUpperCase())) && 
                 !deletedIds.has(s.id) &&
                 !deletedIds.has(s._id)
        );

        safeSet(STORAGE_KEYS.REGISTRATIONS, activeSupaList);
        return activeSupaList;
      }
    }

    // 2. Fall back to local Express backend if Supabase not configured
    const res = await fetch('/api/registrations', {
      headers: getAdminAuthHeaders(),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        safeSet(STORAGE_KEYS.REGISTRATIONS, json.data);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[ELIXORA Real-Time] Backend sync notice:', err.message);
  }
  return safeGet(STORAGE_KEYS.REGISTRATIONS, []);
}

async function sendRegistrationToBackend(record) {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Sync to Supabase Cloud if configured
    if (isSupabaseConfigured()) {
      const supaResult = await saveRegistrationToSupabase(record, record.screenshot);
      if (supaResult) return supaResult;
    }

    // 2. Fall back to local Express server
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('[ELIXORA Real-Time] Backend sync offline, stored locally:', err.message);
  }
  return null;
}

function startRealTimeSync() {
  if (isRealtimeStarted || typeof window === 'undefined') return;
  isRealtimeStarted = true;

  // 1. Initial backend sync
  fetchRegistrationsFromBackend();

  // 2. Connect to Supabase Real-Time Broadcast if configured
  if (isSupabaseConfigured()) {
    try {
      subscribeToSupabaseRegistrations(
        (newRecord) => {
          if (!newRecord) return;
          const current = safeGet(STORAGE_KEYS.REGISTRATIONS, []);
          const cleanRoll = (newRecord.rollNo || '').trim().toUpperCase();
          const exists = current.some((r) => 
            (r.id && newRecord.id && r.id === newRecord.id) ||
            (cleanRoll && r.rollNo && r.rollNo.trim().toUpperCase() === cleanRoll) ||
            (r.ticketId && newRecord.ticketId && r.ticketId === newRecord.ticketId)
          );
          if (!exists) {
            safeSet(STORAGE_KEYS.REGISTRATIONS, [newRecord, ...current]);
          } else {
            const updated = current.map((r) => 
              (r.id && newRecord.id && r.id === newRecord.id) ||
              (cleanRoll && r.rollNo && r.rollNo.trim().toUpperCase() === cleanRoll) ||
              (r.ticketId && newRecord.ticketId && r.ticketId === newRecord.ticketId)
                ? { ...r, ...newRecord }
                : r
            );
            safeSet(STORAGE_KEYS.REGISTRATIONS, updated);
          }
        },
        (updatedRecord) => {
          if (!updatedRecord) return;
          const current = safeGet(STORAGE_KEYS.REGISTRATIONS, []);
          const cleanRoll = (updatedRecord.rollNo || '').trim().toUpperCase();
          const updated = current.map((r) => 
            (r.id && updatedRecord.id && r.id === updatedRecord.id) ||
            (cleanRoll && r.rollNo && r.rollNo.trim().toUpperCase() === cleanRoll) ||
            (r.ticketId && updatedRecord.ticketId && r.ticketId === updatedRecord.ticketId)
              ? { ...r, ...updatedRecord }
              : r
          );
          safeSet(STORAGE_KEYS.REGISTRATIONS, updated);
        },
        (deletedTicketId) => {
          if (!isValidIdentifier(deletedTicketId)) return;
          const current = safeGet(STORAGE_KEYS.REGISTRATIONS, []);
          const cleanDeleted = (deletedTicketId + '').trim().toUpperCase();
          const updated = current.filter((r) => 
            r.ticketId !== deletedTicketId && 
            (r.rollNo || '').trim().toUpperCase() !== cleanDeleted && 
            r.id !== deletedTicketId && 
            r._id !== deletedTicketId
          );
          // Persist to DELETED_IDS so background fetches never resurrect it
          const oldDeleted = safeGet(STORAGE_KEYS.DELETED_IDS, []);
          if (!oldDeleted.includes(deletedTicketId)) {
            safeSet(STORAGE_KEYS.DELETED_IDS, [...oldDeleted, deletedTicketId]);
          }
          safeSet(STORAGE_KEYS.REGISTRATIONS, updated);
        }
      );
    } catch (err) {
      console.warn('[ELIXORA Supabase] Realtime listener error:', err);
    }
  }

  // 3. Connect to Server-Sent Events (SSE) for local dev server
  try {
    if (typeof EventSource !== 'undefined') {
      sseConnection = new EventSource('/api/events');

      sseConnection.addEventListener('new_registration', (e) => {
        try {
          const newRecord = JSON.parse(e.data);
          const current = safeGet(STORAGE_KEYS.REGISTRATIONS, []);
          const exists = current.some((r) => r.ticketId === newRecord.ticketId || (newRecord.rollNo && r.rollNo === newRecord.rollNo));
          if (!exists) {
            safeSet(STORAGE_KEYS.REGISTRATIONS, [newRecord, ...current]);
          }
        } catch (err) {}
      });

      sseConnection.addEventListener('update_registration', (e) => {
        try {
          const updatedRecord = JSON.parse(e.data);
          const current = safeGet(STORAGE_KEYS.REGISTRATIONS, []);
          const updated = current.map((r) => (r.ticketId === updatedRecord.ticketId ? updatedRecord : r));
          safeSet(STORAGE_KEYS.REGISTRATIONS, updated);
        } catch (err) {}
      });

      sseConnection.addEventListener('delete_registration', (e) => {
        try {
          const { ticketId } = JSON.parse(e.data);
          const current = safeGet(STORAGE_KEYS.REGISTRATIONS, []);
          const updated = current.filter((r) => r.ticketId !== ticketId);
          safeSet(STORAGE_KEYS.REGISTRATIONS, updated);
        } catch (err) {}
      });

      sseConnection.onerror = () => {
        // SSE auto-reconnects natively; polling ensures reliable backup
      };
    }
  } catch (err) {
    console.warn('[ELIXORA Real-Time] SSE not supported, using periodic polling:', err);
  }

  // 4. Fallback periodic sync every 8 seconds
  setInterval(() => {
    fetchRegistrationsFromBackend();
  }, 8000);
}

export const adminStore = {
  // Initialize storage with defaults if not present
  init() {
    if (typeof localStorage === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
      safeSet(STORAGE_KEYS.REGISTRATIONS, INITIAL_SAMPLE_REGISTRATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROSTER)) {
      safeSet(STORAGE_KEYS.ROSTER, DEFAULT_SENIOR_ROSTER);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      safeSet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    // Clean out invalid entries like '-', 'N/A', '', '[DELETED]' from DELETED_IDS
    const rawDeleted = safeGet(STORAGE_KEYS.DELETED_IDS, []);
    if (Array.isArray(rawDeleted)) {
      const cleanDeleted = rawDeleted.filter(isValidIdentifier);
      if (cleanDeleted.length !== rawDeleted.length) {
        safeSet(STORAGE_KEYS.DELETED_IDS, cleanDeleted);
      }
    }
    startRealTimeSync();
  },

  // 1. Registrations
  getRegistrations() {
    this.init();
    const raw = safeGet(STORAGE_KEYS.REGISTRATIONS, INITIAL_SAMPLE_REGISTRATIONS);
    let mutated = false;
    const withIds = raw.map((item, idx) => {
      if (!item || typeof item !== 'object') return null;
      if (!item._id || !isValidIdentifier(item._id) || item._id === '-' || item._id === 'N/A') {
        item._id = generateStableId(item, idx);
        mutated = true;
      }
      return item;
    }).filter(Boolean);

    const sanitized = sanitizeRegistrations(withIds);
    if (mutated || sanitized.length !== raw.length) {
      safeSet(STORAGE_KEYS.REGISTRATIONS, sanitized);
    }
    return sanitized;
  },

  purgeGhostRegistrations() {
    this.init();
    const raw = safeGet(STORAGE_KEYS.REGISTRATIONS, []);
    const cleaned = raw.filter((r) => {
      if (!r || typeof r !== 'object') return false;
      const name = (r.fullName || '').trim();
      const roll = (r.rollNo || '').trim();
      return Boolean(name || roll) && name !== '[DELETED]' && r.branch !== 'DELETED';
    });
    safeSet(STORAGE_KEYS.REGISTRATIONS, cleaned);
    return cleaned;
  },

  addRegistration(pass) {
    this.init();
    const current = this.getRegistrations();
    // Normalize roll
    const cleanRoll = (pass.rollNo || '').trim().toUpperCase();

    // Check if already registered
    const existingIndex = current.findIndex(
      (r) => (r.ticketId && r.ticketId === pass.ticketId) || (cleanRoll && r.rollNo === cleanRoll)
    );

    const record = {
      _id: pass._id || generateStableId(pass),
      ticketId: pass.ticketId || `ELX-${pass.isSenior ? 'SR' : '26'}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: pass.fullName || '',
      rollNo: cleanRoll,
      branch: pass.branch || 'Biotechnology',
      batch: pass.batch || (pass.isSenior ? "Batch of '25 • Senior" : "Batch of '26 • Fresher"),
      role: pass.role || (pass.isSenior ? 'Senior VIP Pass' : 'VIP Fresher Access'),
      phone: pass.phone || '',
      email: pass.email || '',
      seniorQuote: pass.seniorQuote || '',
      diet: pass.diet || 'Veg',
      utrNumber: pass.utrNumber || '',
      isSenior: Boolean(pass.isSenior),
      ticketPrice: pass.ticketPrice || (pass.isSenior ? 600 : 399),
      tier: pass.tier || (pass.isSenior ? 'SENIOR VIP COUNCIL ACCESS' : 'VIP FRESHER ACCESS'),
      entryGate: pass.entryGate || (pass.isSenior ? 'Gate 1 (Presidential Arch)' : 'Gate 2 (Aurora North Arch)'),
      tableZone: pass.tableZone || (pass.isSenior ? 'VIP Lounge' : 'Arena Floor'),
      screenshot: pass.screenshot || null,
      status: pass.status || 'VERIFIED',
      checkedIn: Boolean(pass.checkedIn),
      checkedInAt: pass.checkedInAt || null,
      issuedAt: pass.issuedAt || new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      createdAt: new Date().toISOString(),
    };

    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...record };
    } else {
      updated = [record, ...current];
    }

    safeSet(STORAGE_KEYS.REGISTRATIONS, updated);
    this.syncToOnlineSheet(record);

    // Save to real-time backend database immediately!
    sendRegistrationToBackend(record).then((saved) => {
      if (saved && saved.screenshot && saved.screenshot !== record.screenshot) {
        this.updateRegistration(record.ticketId, { screenshot: saved.screenshot });
      }
    }).catch((err) => {
      console.warn('[ELIXORA] Background registration sync notice:', err);
    });

    return record;
  },

  updateRegistration(ticketId, updates) {
    const list = this.getRegistrations();
    let updatedRecord = null;
    const updated = list.map((item) => {
      if (item.ticketId === ticketId || (item.rollNo && item.rollNo === ticketId)) {
        updatedRecord = { ...item, ...updates };
        return updatedRecord;
      }
      return item;
    });
    safeSet(STORAGE_KEYS.REGISTRATIONS, updated);

    // Sync update to Supabase Cloud
    if (isSupabaseConfigured() && updatedRecord) {
      saveRegistrationToSupabase(updatedRecord, updatedRecord.screenshot).catch(() => {});
    }

    // Sync update to backend
    fetch(`/api/registrations/${ticketId}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(updates),
    }).catch(() => {});

    return updatedRecord;
  },

  async clearAllRegistrations() {
    safeSet(STORAGE_KEYS.REGISTRATIONS, []);
    safeSet(STORAGE_KEYS.DELETED_IDS, []);
    if (isSupabaseConfigured()) {
      const client = supabaseAdmin || supabase;
      if (client) {
        try {
          await client.from('registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        } catch (e) {
          console.warn('[ELIXORA Supabase] Clear all warning:', e);
        }
      }
    }
    fetch('/api/registrations', { 
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    }).catch(() => {});
  },

  approveRegistration(ticketId) {
    this.updateRegistration(ticketId, {
      status: 'VERIFIED',
      rejectionReason: null,
      reviewedAt: new Date().toISOString(),
    });
  },

  rejectRegistration(ticketId, reason) {
    this.updateRegistration(ticketId, {
      status: 'REJECTED',
      rejectionReason: reason || 'UTR or receipt proof mismatch',
      reviewedAt: new Date().toISOString(),
    });
  },

  toggleCheckIn(ticketId, gate = 'Gate 2 (Aurora North Arch)') {
    const list = this.getRegistrations();
    let result = null;
    const updated = list.map((item) => {
      if (item.ticketId === ticketId) {
        const nextState = !item.checkedIn;
        result = {
          ...item,
          checkedIn: nextState,
          checkedInAt: nextState ? new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : null,
          checkedInGate: nextState ? gate : null,
        };
        return result;
      }
      return item;
    });
    safeSet(STORAGE_KEYS.REGISTRATIONS, updated);

    // Sync check-in to Supabase
    if (result && isSupabaseConfigured()) {
      updateAttendanceInSupabase(ticketId, result.checkedIn).catch(() => {});
    }

    return result;
  },

  async deleteRegistration(targetOrTicketId, rollNo = null, explicitIndex = -1) {
    const list = this.getRegistrations();
    let targetIndex = -1;

    // 1. If target is an object, match by unique _id first!
    if (targetOrTicketId && typeof targetOrTicketId === 'object') {
      const target = targetOrTicketId;
      if (target._id && isValidIdentifier(target._id)) {
        targetIndex = list.findIndex((item) => item._id === target._id);
      }
      if (targetIndex === -1 && isValidIdentifier(target.ticketId)) {
        targetIndex = list.findIndex((item) => item.ticketId === target.ticketId);
      }
      if (targetIndex === -1 && isValidIdentifier(target.id)) {
        targetIndex = list.findIndex((item) => item.id === target.id);
      }
      if (targetIndex === -1 && isValidIdentifier(target.rollNo)) {
        const cleanRoll = target.rollNo.trim().toUpperCase();
        targetIndex = list.findIndex((item) => item.rollNo && item.rollNo.trim().toUpperCase() === cleanRoll);
      }
      if (targetIndex === -1) {
        targetIndex = list.findIndex((item) => 
          item === target ||
          (item.issuedAt && item.issuedAt === target.issuedAt && item.ticketPrice === target.ticketPrice && item.batch === target.batch)
        );
      }
    }

    // 2. If target is string (could be _id, ticketId, or rollNo)
    if (targetIndex === -1 && typeof targetOrTicketId === 'string' && targetOrTicketId.trim()) {
      const strId = targetOrTicketId.trim();
      targetIndex = list.findIndex((item) => 
        item._id === strId ||
        (isValidIdentifier(item.ticketId) && item.ticketId === strId) ||
        (isValidIdentifier(item.rollNo) && item.rollNo.trim().toUpperCase() === strId.toUpperCase()) ||
        (isValidIdentifier(item.id) && item.id === strId)
      );
    }

    // 3. Fallback to explicit index if verified
    if (targetIndex === -1 && typeof explicitIndex === 'number' && explicitIndex >= 0 && explicitIndex < list.length) {
      targetIndex = explicitIndex;
    }

    if (targetIndex === -1) {
      console.warn('[ELIXORA] deleteRegistration: Target not found', targetOrTicketId);
      return false;
    }

    const itemToDelete = list[targetIndex];

    // Add ONLY valid, unique keys to DELETED_IDS
    const cleanDeleted = safeGet(STORAGE_KEYS.DELETED_IDS, []).filter(isValidIdentifier);
    const keysToAdd = [
      isValidIdentifier(itemToDelete._id) ? itemToDelete._id : null,
      isValidIdentifier(itemToDelete.ticketId) ? itemToDelete.ticketId : null,
      isValidIdentifier(itemToDelete.rollNo) ? itemToDelete.rollNo.trim().toUpperCase() : null,
      isValidIdentifier(itemToDelete.id) ? itemToDelete.id : null,
    ].filter(Boolean);

    if (keysToAdd.length > 0) {
      const newDeleted = Array.from(new Set([...cleanDeleted, ...keysToAdd]));
      safeSet(STORAGE_KEYS.DELETED_IDS, newDeleted);
    }

    // Remove strictly ONLY this single item from list
    const updated = [...list];
    updated.splice(targetIndex, 1);
    safeSet(STORAGE_KEYS.REGISTRATIONS, updated);

    // Sync delete to Supabase Cloud in real time
    if (isSupabaseConfigured()) {
      try {
        await deleteRegistrationFromSupabase(itemToDelete);
        console.info('[ELIXORA Real-Time] Deleted registration from Supabase:', itemToDelete.fullName || itemToDelete.rollNo);
      } catch (err) {
        console.warn('[ELIXORA Supabase] Real-time delete sync warning:', err);
      }
    }

    // Sync delete to backend
    const apiId = isValidIdentifier(itemToDelete.ticketId) 
      ? itemToDelete.ticketId 
      : (isValidIdentifier(itemToDelete.rollNo) ? itemToDelete.rollNo : itemToDelete.id);
    if (apiId) {
      fetch(`/api/registrations/${encodeURIComponent(apiId)}`, { 
        method: 'DELETE',
        headers: getAdminAuthHeaders(),
      }).catch(() => {});
    }

    return true;
  },

  async refreshFromBackend() {
    return await fetchRegistrationsFromBackend();
  },


  // 3. Analytics / Statistics
  getStats(providedList = null) {
    const list = Array.isArray(providedList) 
      ? providedList 
      : (typeof localStorage !== 'undefined' ? safeGet(STORAGE_KEYS.REGISTRATIONS, []) : []);
    const total = list.length;
    const seniors = list.filter((r) => r.isSenior).length;
    const freshers = total - seniors;
    const verified = list.filter((r) => r.status === 'VERIFIED').length;
    const pending = list.filter((r) => r.status === 'PENDING').length;
    const rejected = list.filter((r) => r.status === 'REJECTED').length;
    const checkedIn = list.filter((r) => r.checkedIn).length;
    const veg = list.filter((r) => r.diet === 'Veg').length;
    const nonVeg = list.filter((r) => r.diet === 'Non-Veg').length;

    // Calculate revenue from verified registrations
    const totalRevenue = list
      .filter((r) => r.status === 'VERIFIED')
      .reduce((sum, r) => sum + (Number(r.ticketPrice) || (r.isSenior ? 600 : 399)), 0);

    const pendingRevenue = list
      .filter((r) => r.status === 'PENDING')
      .reduce((sum, r) => sum + (Number(r.ticketPrice) || (r.isSenior ? 600 : 399)), 0);

    return {
      total,
      seniors,
      freshers,
      verified,
      pending,
      rejected,
      checkedIn,
      veg,
      nonVeg,
      totalRevenue,
      pendingRevenue,
    };
  },

  // 4. Senior Roster Management
  getSeniorRoster() {
    this.init();
    return safeGet(STORAGE_KEYS.ROSTER, DEFAULT_SENIOR_ROSTER);
  },

  addSeniorToRoster(rollNo, seniorData) {
    const roster = this.getSeniorRoster();
    const cleanRoll = rollNo.trim().toUpperCase();
    const updated = {
      ...roster,
      [cleanRoll]: {
        name: seniorData.name,
        branch: seniorData.branch || 'Biotechnology',
        batch: seniorData.batch || "Batch of '25 • Senior",
      },
    };
    safeSet(STORAGE_KEYS.ROSTER, updated);
  },

  updateSeniorInRoster(oldRoll, newRoll, seniorData) {
    const roster = this.getSeniorRoster();
    const cleanOld = (oldRoll + '').trim().toUpperCase();
    const cleanNew = (newRoll + '').trim().toUpperCase();
    const updated = { ...roster };
    if (cleanOld !== cleanNew) {
      delete updated[cleanOld];
    }
    updated[cleanNew] = {
      name: seniorData.name,
      branch: seniorData.branch || 'Biotechnology',
      batch: seniorData.batch || "Batch of '25 • Senior",
    };
    safeSet(STORAGE_KEYS.ROSTER, updated);
  },

  deleteSeniorFromRoster(rollNo) {
    const roster = this.getSeniorRoster();
    const cleanRoll = (rollNo + '').trim().toUpperCase();
    const updated = { ...roster };
    delete updated[cleanRoll];
    safeSet(STORAGE_KEYS.ROSTER, updated);
  },

  // 5. Settings & Config
  getSettings() {
    this.init();
    const stored = safeGet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS) || {};
    const seniorPrice = (!stored.seniorPrice || stored.seniorPrice === 499) ? 600 : stored.seniorPrice;
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      seniorPrice,
      sheetsSpreadsheetUrl: stored.sheetsSpreadsheetUrl || DEFAULT_SETTINGS.sheetsSpreadsheetUrl,
      sheetsWebhookUrl: stored.sheetsWebhookUrl || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHEETS_WEBHOOK_URL) || DEFAULT_SETTINGS.sheetsWebhookUrl,
    };
  },

  saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    safeSet(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  toggleDateVenueAnnounced() {
    const current = this.getSettings();
    const nextState = !current.isDateVenueAnnounced;
    this.saveSettings({ isDateVenueAnnounced: nextState });
    return nextState;
  },

  // 6. Authentication
  isAuthenticated() {
    try {
      const auth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
      return auth === 'AUTHORIZED_ADMIN';
    } catch (e) {
      return false;
    }
  },

  // Security: Check brute-force lockout status
  getLockoutStatus() {
    if (typeof localStorage === 'undefined') return { isLocked: false, remainingSeconds: 0, attemptsLeft: 5 };
    try {
      const record = JSON.parse(localStorage.getItem('elixora_admin_lockout') || '{}');
      const now = Date.now();
      const LOCKOUT_DURATION = 10 * 60 * 1000; // 10 minutes
      if (record.isLocked && now - record.lockTime < LOCKOUT_DURATION) {
        const remainingSeconds = Math.ceil((LOCKOUT_DURATION - (now - record.lockTime)) / 1000);
        return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
      }
      // Lockout expired or not locked
      if (record.isLocked && now - record.lockTime >= LOCKOUT_DURATION) {
        localStorage.removeItem('elixora_admin_lockout');
      }
      const attempts = record.attempts || 0;
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: Math.max(0, 5 - attempts) };
    } catch (e) {
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: 5 };
    }
  },

  login(pin, remember = false) {
    const lockout = this.getLockoutStatus();
    if (lockout.isLocked) {
      return { 
        success: false, 
        isLocked: true, 
        remainingSeconds: lockout.remainingSeconds,
        message: `Security Lockout: Too many failed passcode attempts. Please wait ${Math.ceil(lockout.remainingSeconds / 60)} minute(s).` 
      };
    }

    const settings = this.getSettings();
    const input = (pin || '').trim();

    const isValid =
      input === settings.adminPin ||
      input === settings.backupPin ||
      input === 'ELIXORA2026' ||
      input === 'ADMIN@ELX26';

    if (isValid) {
      try {
        // Reset failed attempt counter on success
        localStorage.removeItem('elixora_admin_lockout');
        sessionStorage.setItem(STORAGE_KEYS.AUTH, 'AUTHORIZED_ADMIN');
        sessionStorage.setItem('elixora_admin_token', input);
        if (remember) {
          localStorage.setItem(STORAGE_KEYS.AUTH, 'AUTHORIZED_ADMIN');
          localStorage.setItem('elixora_admin_token', input);
        }
      } catch (e) {}
      return { success: true };
    }

    // Record failed attempt
    try {
      const record = JSON.parse(localStorage.getItem('elixora_admin_lockout') || '{}');
      const attempts = (record.attempts || 0) + 1;
      const MAX_ATTEMPTS = 5;
      if (attempts >= MAX_ATTEMPTS) {
        localStorage.setItem('elixora_admin_lockout', JSON.stringify({
          isLocked: true,
          lockTime: Date.now(),
          attempts,
        }));
        return {
          success: false,
          isLocked: true,
          remainingSeconds: 600,
          message: 'Security Alert: 5 consecutive failed attempts. Admin Portal temporarily locked for 10 minutes.'
        };
      } else {
        localStorage.setItem('elixora_admin_lockout', JSON.stringify({
          isLocked: false,
          attempts,
        }));
        return {
          success: false,
          isLocked: false,
          attemptsLeft: MAX_ATTEMPTS - attempts,
          message: `Invalid Master Passcode. ${MAX_ATTEMPTS - attempts} attempt(s) remaining before security lockout.`
        };
      }
    } catch (e) {
      return { success: false, message: 'Invalid Master Passcode. Access Denied.' };
    }
  },

  logout() {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
      sessionStorage.removeItem('elixora_admin_token');
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem('elixora_admin_token');
    } catch (e) {}
  },

  // 7. Real-Time Online Google Sheets / Excel Cloud Sync
  async syncToOnlineSheet(record) {
    const settings = this.getSettings();
    const webhook = settings.sheetsWebhookUrl || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHEETS_WEBHOOK_URL) || '';
    if (!webhook) return false;

    try {
      const payload = {
        paymentTime: record.issuedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        fullName: record.fullName || '',
        rollNo: record.rollNo || '',
        category: record.isSenior ? 'Senior VIP' : 'VIP Fresher',
        ticketPrice: record.ticketPrice || (record.isSenior ? 600 : 399),
        phone: record.phone || '',
        diet: record.diet || 'Veg',
        utrNumber: record.utrNumber || '',
        ticketId: record.ticketId || '',
        status: record.status || 'VERIFIED',
        gateCheckIn: record.checkedIn ? 'YES' : 'NO',
        seniorQuote: record.seniorQuote || '',
      };

      console.log('🔄 [ELIXORA Live Sync] Sending attendee to Google Sheets:', payload.fullName, payload.rollNo);
      await fetch(webhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      console.log('✅ [ELIXORA Live Sync] Sync signal delivered to webhook.');
      return true;
    } catch (err) {
      console.warn('⚠️ [ELIXORA Live Sync] Sync failed:', err);
      return false;
    }
  },

  async syncAllToOnlineSheet() {
    const list = this.getRegistrations();
    let count = 0;
    for (const item of list) {
      const ok = await this.syncToOnlineSheet(item);
      if (ok) count++;
    }
    return count;
  },

  async syncAllToSupabase() {
    const list = this.getRegistrations();
    const result = await syncAllRegistrationsToSupabase(list);
    return result.synced || 0;
  },

  // 8. Excel & CSV Export (Exact requested columns)
  exportToCSV() {
    const list = this.getRegistrations();
    if (list.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    const headers = [
      'Payment Time / Date',
      'Name of the Student',
      'Registration / Roll Number',
      'Pass Category',
      'Amount Paid (INR)',
      'Phone Number',
      'Refreshment Preference',
      'UPI UTR / Transaction ID',
      'Ticket ID',
      'Verification Status',
      'Gate Check-In Status',
      'Gate Check-In Time',
      'Senior Quote / Advice'
    ];

    const rows = list.map((item) => [
      `"${item.issuedAt || item.createdAt || 'N/A'}"`,
      `"${(item.fullName || '').replace(/"/g, '""')}"`,
      `"${item.rollNo || ''}"`,
      item.isSenior ? 'Senior VIP' : 'VIP Fresher',
      item.ticketPrice || (item.isSenior ? 600 : 399),
      `"${item.phone || ''}"`,
      item.diet || 'Veg',
      `"${item.utrNumber || ''}"`,
      item.ticketId || '',
      item.status || 'VERIFIED',
      item.checkedIn ? 'YES' : 'NO',
      item.checkedInAt || 'N/A',
      `"${(item.seniorQuote || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `ELIXORA_2.0_Attendees_Payment_Manifest_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // 9. Reset and clear data
  clearAllRegistrations() {
    safeSet(STORAGE_KEYS.REGISTRATIONS, []);
  },

  resetToDefaults() {
    safeSet(STORAGE_KEYS.REGISTRATIONS, []);
    safeSet(STORAGE_KEYS.ROSTER, DEFAULT_SENIOR_ROSTER);
    safeSet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }
};
