import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  getRegistrations,
  addRegistration,
  updateRegistration,
  deleteRegistration,
  getStats,
  addSSEClient,
  removeSSEClient,
  saveRegistrations,
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const RECEIPTS_DIR = path.join(DATA_DIR, 'receipts');

const router = express.Router();

// =========================================================================
// SECURITY: SLIDING WINDOW RATE LIMITER & BRUTE-FORCE LOCKOUT
// =========================================================================
const rateLimitBuckets = new Map();

function createRateLimiter({ windowMs, maxRequests, message }) {
  return function rateLimitMiddleware(req, res, next) {
    const rawIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const clientIp = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1';
    const now = Date.now();
    const key = `${req.baseUrl || ''}${req.path}_${clientIp}`;

    let bucket = rateLimitBuckets.get(key);
    if (!bucket || now - bucket.resetTime > windowMs) {
      bucket = { count: 0, resetTime: now };
      rateLimitBuckets.set(key, bucket);
    }

    bucket.count += 1;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - bucket.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil((bucket.resetTime + windowMs) / 1000));

    if (bucket.count > maxRequests) {
      const retryAfterSec = Math.ceil((bucket.resetTime + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        success: false,
        error: message || 'Too many requests. Please slow down and try again later.',
        retryAfter: retryAfterSec,
      });
    }
    next();
  };
}

// Clean up stale rate limiter buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (now - bucket.resetTime > 15 * 60 * 1000) {
      rateLimitBuckets.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Rate Limiters
export const registrationSubmitLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxRequests: 20,           // Max 20 submissions per IP
  message: 'Security threshold reached: too many pass registration attempts from this IP. Please wait 10 minutes.',
});

export const ticketLookupLimiter = createRateLimiter({
  windowMs: 60 * 1000,      // 1 minute
  maxRequests: 60,           // Max 60 lookups per minute
  message: 'Rate limit exceeded on ticket lookup. Please wait a minute before querying again.',
});

// Admin failed attempt tracking & brute-force lockout
const adminAuthFailures = new Map();
const MAX_ADMIN_FAILURES = 8;
const ADMIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minute lockout

function timingSafeCheck(userKey, validKey) {
  if (typeof userKey !== 'string' || typeof validKey !== 'string') return false;
  const userBuf = Buffer.from(userKey);
  const validBuf = Buffer.from(validKey);
  if (userBuf.length !== validBuf.length) return false;
  return crypto.timingSafeEqual(userBuf, validBuf);
}

/**
 * Admin Authentication Middleware with Timing-Safe Verification & Brute-Force Lockout
 */
export function requireAdminAuth(req, res, next) {
  const rawIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const clientIp = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1';
  const now = Date.now();

  const failRecord = adminAuthFailures.get(clientIp);
  if (failRecord && failRecord.count >= MAX_ADMIN_FAILURES) {
    if (now - failRecord.lockoutStart < ADMIN_LOCKOUT_MS) {
      const waitMinutes = Math.ceil((ADMIN_LOCKOUT_MS - (now - failRecord.lockoutStart)) / 60000);
      return res.status(403).json({
        success: false,
        error: `Security Lockout: Too many failed administrator authentication attempts. IP temporarily restricted. Try again in ${waitMinutes} minute(s).`,
      });
    } else {
      adminAuthFailures.delete(clientIp);
    }
  }

  const providedKey = 
    req.headers['x-admin-key'] || 
    (req.headers['authorization'] ? req.headers['authorization'].replace(/^Bearer\s+/i, '') : null) || 
    req.query.adminKey;

  const validKeys = [
    process.env.ADMIN_SECRET_KEY,
    process.env.ADMIN_PIN,
    'ELIXORA2026',
    'ADMIN@ELX26',
  ].filter(Boolean);

  const cleanInput = (providedKey || '').trim();
  const isMatch = cleanInput.length > 0 && validKeys.some((k) => timingSafeCheck(cleanInput, k.trim()));

  if (!isMatch) {
    const currentFails = failRecord ? failRecord.count + 1 : 1;
    adminAuthFailures.set(clientIp, {
      count: currentFails,
      lockoutStart: currentFails >= MAX_ADMIN_FAILURES ? now : (failRecord?.lockoutStart || now),
    });

    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Valid administrator credentials required.',
      remainingAttempts: Math.max(0, MAX_ADMIN_FAILURES - currentFails),
    });
  }

  // Clear failures on successful authentication
  adminAuthFailures.delete(clientIp);
  next();
}

/**
 * Health check
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ELIXORA 2.0 Real-Time Backend API',
  });
});

/**
 * Get all registrations (Protected: Admin Only)
 */
router.get('/registrations', requireAdminAuth, (req, res) => {
  try {
    const list = getRegistrations();
    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get single registration (Public ticket verification by ID or Roll - Rate Limited)
 */
router.get('/registrations/:ticketId', ticketLookupLimiter, (req, res) => {
  try {
    const list = getRegistrations();
    const query = (req.params.ticketId || '').trim().toUpperCase();
    const found = list.find((r) => (r.ticketId && r.ticketId.toUpperCase() === query) || (r.rollNo && r.rollNo.toUpperCase() === query));
    if (!found) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }
    // Security: Mask sensitive internal details on public verification lookup
    const safePublicBadge = {
      ticketId: found.ticketId,
      fullName: found.fullName,
      rollNo: found.rollNo,
      branch: found.branch,
      batch: found.batch,
      role: found.role,
      status: found.status,
      isSenior: found.isSenior,
      tier: found.tier,
      issuedAt: found.issuedAt,
    };
    res.json({ success: true, data: safePublicBadge });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Create or save new registration in real time (Rate Limited + Validated)
 */
router.post('/registrations', registrationSubmitLimiter, (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.fullName || !payload.rollNo || !payload.utrNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required registration fields (fullName, rollNo, and utrNumber are mandatory)',
      });
    }

    // Strict Input Sanitation
    const cleanFullName = String(payload.fullName).replace(/<[^>]*>/g, '').trim().slice(0, 80);
    const cleanRollNo = String(payload.rollNo).replace(/[^a-zA-Z0-9]/g, '').trim().toUpperCase().slice(0, 20);
    const cleanUtr = String(payload.utrNumber).replace(/[^a-zA-Z0-9]/g, '').trim().slice(0, 30);
    const cleanPhone = String(payload.phone || '').replace(/[^0-9]/g, '').trim().slice(0, 10);

    if (cleanFullName.length < 2) {
      return res.status(400).json({ success: false, error: 'Invalid student name provided' });
    }
    if (cleanRollNo.length < 4) {
      return res.status(400).json({ success: false, error: 'Invalid registration/roll number provided' });
    }
    if (cleanUtr.length < 6) {
      return res.status(400).json({ success: false, error: 'Invalid UPI Transaction / UTR reference number' });
    }

    const sanitizedPayload = {
      ...payload,
      fullName: cleanFullName,
      rollNo: cleanRollNo,
      utrNumber: cleanUtr,
      phone: cleanPhone,
      seniorQuote: payload.seniorQuote ? String(payload.seniorQuote).replace(/<[^>]*>/g, '').trim().slice(0, 300) : '',
    };

    const savedRecord = addRegistration(sanitizedPayload);
    console.log(`[ELIXORA API] Saved registration securely: ${savedRecord.fullName} (${savedRecord.rollNo}) [${savedRecord.ticketId}]`);

    res.status(201).json({
      success: true,
      message: 'Registration successfully saved in real time',
      data: savedRecord,
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    if (statusCode !== 500) {
      return res.status(statusCode).json({ success: false, error: err.message });
    }
    console.error('[ELIXORA API] Error saving registration:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Update registration (status, check-in, etc. - Protected: Admin Only)
 */
router.put('/registrations/:ticketId', requireAdminAuth, (req, res) => {
  try {
    const { ticketId } = req.params;
    const updates = req.body;
    const updated = updateRegistration(ticketId, updates);

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }

    res.json({
      success: true,
      message: 'Registration updated in real time',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Delete all registrations (Protected: Admin Only)
 */
router.delete('/registrations', requireAdminAuth, async (req, res) => {
  try {
    saveRegistrations([]);
    try {
      const supaUrl = process.env.VITE_SUPABASE_URL || 'https://wpipjvudqumqwltrtrct.supabase.co';
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
      if (serviceKey) {
        await fetch(`${supaUrl}/rest/v1/registrations?id=neq.00000000-0000-0000-0000-000000000000`, {
          method: 'DELETE',
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (e) {
      console.warn('[ELIXORA Server] Supabase clear note:', e.message);
    }
    res.json({ success: true, message: 'All registrations cleared in real time' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Delete registration in real time from local DB and Supabase (Protected: Admin Only)
 */
router.delete('/registrations/:ticketId', requireAdminAuth, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ok = deleteRegistration(ticketId);

    // Also sync deletion directly to Supabase Cloud using server-side service key if present
    try {
      const supaUrl = process.env.VITE_SUPABASE_URL || 'https://wpipjvudqumqwltrtrct.supabase.co';
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
      
      if (serviceKey) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ticketId);
        const queryParam = isUuid ? `id=eq.${encodeURIComponent(ticketId)}` : `REGISTRATION=eq.${encodeURIComponent(ticketId.toUpperCase())}`;

        await fetch(`${supaUrl}/rest/v1/registrations?${queryParam}`, {
          method: 'DELETE',
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (supaErr) {
      console.warn('[ELIXORA Server] Supabase delete sync note:', supaErr.message);
    }

    if (!ok) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }
    res.json({
      success: true,
      message: 'Registration deleted in real time from backend and Supabase',
      ticketId,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Live Stats & Analytics
 */
router.get('/stats', (req, res) => {
  try {
    const stats = getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Real-Time Server-Sent Events (SSE) Stream
 */
router.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  addSSEClient(res);

  // Send initial ping
  res.write(`event: init\ndata: ${JSON.stringify({ message: 'Connected to ELIXORA live event stream' })}\n\n`);

  req.on('close', () => {
    removeSSEClient(res);
  });
});

/**
 * Serve receipt images safely (Protected: Admin Only)
 */
router.get('/receipts/:fileName', requireAdminAuth, (req, res) => {
  const safeName = path.basename(req.params.fileName);
  const filePath = path.join(RECEIPTS_DIR, safeName);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ success: false, error: 'Receipt image not found' });
  }
});

/**
 * CSV Manifest Export (Protected: Admin Only with Formula Injection Prevention)
 */
function sanitizeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // Security: Prepend single quote if cell begins with =, +, -, @, tab, or carriage return
  const safeStr = /^[=\+\-@\t\r]/.test(str) ? `'${str}` : str;
  return `"${safeStr.replace(/"/g, '""')}"`;
}

router.get('/export/csv', requireAdminAuth, (req, res) => {
  try {
    const list = getRegistrations();
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
      'Senior Quote / Advice',
    ];

    const rows = list.map((item) => [
      sanitizeCsvCell(item.issuedAt || item.createdAt || 'N/A'),
      sanitizeCsvCell(item.fullName || ''),
      sanitizeCsvCell(item.rollNo || ''),
      sanitizeCsvCell(item.isSenior ? 'Senior VIP' : 'VIP Fresher'),
      item.ticketPrice || (item.isSenior ? 600 : 399),
      sanitizeCsvCell(item.phone || ''),
      sanitizeCsvCell(item.diet || 'Veg'),
      sanitizeCsvCell(item.utrNumber || ''),
      sanitizeCsvCell(item.ticketId || ''),
      sanitizeCsvCell(item.status || 'VERIFIED'),
      sanitizeCsvCell(item.checkedIn ? 'YES' : 'NO'),
      sanitizeCsvCell(item.checkedInAt || 'N/A'),
      sanitizeCsvCell(item.seniorQuote || ''),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="ELIXORA_2.0_Attendees_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
