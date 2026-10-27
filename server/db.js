import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root data directories
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const RECEIPTS_DIR = path.join(DATA_DIR, 'receipts');
const DB_FILE = path.join(DATA_DIR, 'registrations.json');

// Real-time SSE subscriber connections
const sseClients = new Set();

/**
 * Ensure database file and receipt directories exist
 */
export function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(RECEIPTS_DIR)) {
    fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 * Read all registrations from disk
 */
export function getRegistrations() {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[ELIXORA DB] Error reading registrations:', err);
    return [];
  }
}

/**
 * Persist registrations atomically to disk
 */
export function saveRegistrations(list) {
  initDb();
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(list, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('[ELIXORA DB] Error saving registrations:', err);
    // Fallback direct write
    fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), 'utf8');
    return true;
  }
}

/**
 * Save base64 image data URL to receipt file securely
 */
function saveReceiptImage(ticketId, dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) return dataUrl;

    let ext = matches[1].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    
    // Whitelist allowed image formats only
    const ALLOWED_EXTS = ['jpg', 'png', 'webp'];
    if (!ALLOWED_EXTS.includes(ext)) {
      return null;
    }

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Limit image size to 8MB max
    if (buffer.length > 8 * 1024 * 1024) {
      console.warn('[ELIXORA DB] Receipt image exceeds 8MB limit, skipping file write');
      return null;
    }

    const sanitizedId = ticketId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${sanitizedId}.${ext}`;
    const filePath = path.join(RECEIPTS_DIR, fileName);

    fs.writeFileSync(filePath, buffer);
    return `/api/receipts/${fileName}`;
  } catch (err) {
    console.error('[ELIXORA DB] Failed to save receipt file:', err);
    return dataUrl;
  }
}

/**
 * Broadcast real-time SSE event to all connected clients
 */
export function broadcastSSE(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      sseClients.delete(client);
    }
  }
}

/**
 * Register SSE client
 */
export function addSSEClient(res) {
  sseClients.add(res);
  // Send heartbeat comment immediately
  res.write(': connected to ELIXORA real-time backend stream\n\n');
}

/**
 * Unregister SSE client
 */
export function removeSSEClient(res) {
  sseClients.delete(res);
}

/**
 * Add or update registration in real time with security checks
 */
export function addRegistration(pass) {
  initDb();
  const current = getRegistrations();
  const cleanRoll = (pass.rollNo || '').trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const cleanUtr = (pass.utrNumber || '').trim();

  // Security Check 1: Enforce UTR uniqueness to prevent payment receipt hijacking
  if (cleanUtr) {
    const duplicateUtr = current.find(
      (r) => r.utrNumber && r.utrNumber.toLowerCase() === cleanUtr.toLowerCase() && 
             r.rollNo !== cleanRoll && 
             r.ticketId !== pass.ticketId
    );
    if (duplicateUtr) {
      const duplicateError = new Error('This UPI Transaction / UTR number has already been registered with another student.');
      duplicateError.statusCode = 409;
      throw duplicateError;
    }
  }

  const isSenior = Boolean(pass.isSenior);
  // Security Check 2: Cryptographically random ticket ID generation
  const randomSuffix = crypto.randomInt(100000, 999999);
  const ticketId = pass.ticketId || `ELX-${isSenior ? 'SR' : '26'}-${randomSuffix}`;

  // Handle receipt screenshot storage
  let screenshotUrl = pass.screenshot || null;
  if (screenshotUrl && screenshotUrl.startsWith('data:image/')) {
    screenshotUrl = saveReceiptImage(ticketId, screenshotUrl);
  }

  const record = {
    ticketId,
    fullName: (pass.fullName || '').trim().slice(0, 100),
    rollNo: cleanRoll.slice(0, 20),
    branch: (pass.branch || 'Biotechnology').slice(0, 50),
    batch: pass.batch || (isSenior ? "Batch of '25 • Senior" : "Batch of '26 • Fresher"),
    role: pass.role || (isSenior ? 'Senior VIP Pass (Full Access + Red Carpet)' : 'VIP Fresher Attendee'),
    phone: (pass.phone || '').trim().replace(/[^0-9+]/g, '').slice(0, 15),
    email: (pass.email || '').trim().slice(0, 100),
    seniorQuote: (pass.seniorQuote || '').trim().slice(0, 500),
    diet: pass.diet === 'Non-Veg' ? 'Non-Veg' : 'Veg',
    utrNumber: cleanUtr.slice(0, 50),
    isSenior,
    ticketPrice: Number(pass.ticketPrice) || (isSenior ? 600 : 399),
    tier: pass.tier || (isSenior ? 'SENIOR VIP COUNCIL ACCESS' : 'VIP FRESHER ACCESS'),
    entryGate: pass.entryGate || (isSenior ? 'Gate 1 (Presidential Arch)' : 'Gate 2 (Aurora North Arch)'),
    tableZone: pass.tableZone || (isSenior ? 'VIP Lounge' : 'Arena Floor A-14'),
    screenshot: screenshotUrl,
    status: pass.status || 'VERIFIED',
    checkedIn: Boolean(pass.checkedIn),
    checkedInAt: pass.checkedInAt || null,
    issuedAt: pass.issuedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
    createdAt: pass.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Find if existing by ticketId or rollNo
  const existingIdx = current.findIndex(
    (r) => (r.ticketId && r.ticketId === record.ticketId) || (cleanRoll && r.rollNo === cleanRoll)
  );

  let updatedList;
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...record };
  } else {
    updatedList = [record, ...current];
  }

  saveRegistrations(updatedList);

  // Broadcast real-time update
  broadcastSSE(existingIdx >= 0 ? 'update_registration' : 'new_registration', record);

  // Trigger optional Google Sheets sync asynchronously in background
  syncToGoogleSheets(record).catch(() => {});

  return record;
}

/**
 * Update an existing registration
 */
export function updateRegistration(ticketId, updates) {
  initDb();
  const current = getRegistrations();
  let updatedRecord = null;

  const nextList = current.map((item) => {
    if (item.ticketId === ticketId) {
      updatedRecord = {
        ...item,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return updatedRecord;
    }
    return item;
  });

  if (updatedRecord) {
    saveRegistrations(nextList);
    broadcastSSE('update_registration', updatedRecord);
  }

  return updatedRecord;
}

/**
 * Delete a registration
 */
export function deleteRegistration(identifier) {
  initDb();
  const current = getRegistrations();
  const cleanId = (identifier || '').trim().toUpperCase();
  const nextList = current.filter((r) => r.ticketId !== identifier && (r.rollNo || '').trim().toUpperCase() !== cleanId);

  if (nextList.length !== current.length) {
    saveRegistrations(nextList);
    broadcastSSE('delete_registration', { ticketId: identifier });
    return true;
  }
  return false;
}

/**
 * Calculate analytics and live statistics
 */
export function getStats() {
  const list = getRegistrations();
  const total = list.length;
  const seniors = list.filter((r) => r.isSenior).length;
  const freshers = total - seniors;
  const verified = list.filter((r) => r.status === 'VERIFIED').length;
  const pending = list.filter((r) => r.status === 'PENDING').length;
  const rejected = list.filter((r) => r.status === 'REJECTED').length;
  const checkedIn = list.filter((r) => r.checkedIn).length;
  const veg = list.filter((r) => r.diet === 'Veg').length;
  const nonVeg = list.filter((r) => r.diet === 'Non-Veg').length;

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
    activeConnections: sseClients.size,
  };
}

/**
 * Background Google Sheets webhook synchronization
 */
async function syncToGoogleSheets(record) {
  const webhookUrl = process.env.VITE_SHEETS_WEBHOOK_URL || process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

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

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('[ELIXORA DB] Google Sheets webhook notice:', err.message);
  }
}
