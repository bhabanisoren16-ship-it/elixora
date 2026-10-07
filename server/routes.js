import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  getRegistrations,
  addRegistration,
  updateRegistration,
  deleteRegistration,
  getStats,
  addSSEClient,
  removeSSEClient,
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const RECEIPTS_DIR = path.join(DATA_DIR, 'receipts');

const router = express.Router();

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
 * Get all registrations
 */
router.get('/registrations', (req, res) => {
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
 * Get single registration
 */
router.get('/registrations/:ticketId', (req, res) => {
  try {
    const list = getRegistrations();
    const found = list.find((r) => r.ticketId === req.params.ticketId || r.rollNo === req.params.ticketId.toUpperCase());
    if (!found) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }
    res.json({ success: true, data: found });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Create or save new registration in real time
 */
router.post('/registrations', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.fullName || !payload.rollNo) {
      return res.status(400).json({
        success: false,
        error: 'Missing required registration fields (fullName and rollNo are mandatory)',
      });
    }

    const savedRecord = addRegistration(payload);
    console.log(`[ELIXORA API] Saved registration in real time: ${savedRecord.fullName} (${savedRecord.rollNo}) [${savedRecord.ticketId}]`);

    res.status(201).json({
      success: true,
      message: 'Registration successfully saved in real time',
      data: savedRecord,
    });
  } catch (err) {
    console.error('[ELIXORA API] Error saving registration:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Update registration (status, check-in, etc.)
 */
router.put('/registrations/:ticketId', (req, res) => {
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
 * Delete registration
 */
router.delete('/registrations/:ticketId', (req, res) => {
  try {
    const { ticketId } = req.params;
    const ok = deleteRegistration(ticketId);
    if (!ok) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }
    res.json({
      success: true,
      message: 'Registration deleted in real time',
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
 * Serve receipt images safely
 */
router.get('/receipts/:fileName', (req, res) => {
  const safeName = path.basename(req.params.fileName);
  const filePath = path.join(RECEIPTS_DIR, safeName);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ success: false, error: 'Receipt image not found' });
  }
});

/**
 * CSV Manifest Export
 */
router.get('/export/csv', (req, res) => {
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
      `"${(item.seniorQuote || '').replace(/"/g, '""')}"`,
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
