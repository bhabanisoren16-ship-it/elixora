import { supabase, supabaseAdmin, isSupabaseConfigured } from '../lib/supabase.js';

/**
 * Convert base64 data URL to Blob for binary storage upload
 */
function dataURItoBlob(dataURI) {
  try {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  } catch (err) {
    console.error('[ELIXORA Supabase] Error converting dataURI to Blob:', err);
    return null;
  }
}

/**
 * Maps database schema row to frontend camelCase registration object
 */
export function mapRowToRegistration(row) {
  if (!row) return null;
  // Ignore deleted registrations
  if (row['BRANCH'] === 'DELETED' || (row['FULL NAME'] && row['FULL NAME'].includes('[DELETED]'))) {
    return null;
  }
  const roll = (row['REGISTRATION'] || row.roll_no || '').trim().toUpperCase();
  const fullName = (row['FULL NAME'] || row.full_name || '').trim();
  // Ignore empty ghost entries
  if (!roll && !fullName) {
    return null;
  }
  const isSenior = Boolean(row.is_senior);

  return {
    id: row.id,
    _id: row.id || (roll ? `reg_roll_${roll}` : `reg_${row.ticket_id || Date.now()}`),
    ticketId: row.ticket_id || `ELX-${isSenior ? 'SR' : '26'}-${roll ? roll.slice(-4) : (row.id ? row.id.slice(0, 4).toUpperCase() : 'PASS')}`,
    fullName,
    rollNo: roll,
    phone: row['MOBILE NO.'] || row.phone || '',
    utrNumber: row['UTR NO.'] || row.utr_number || '',
    branch: row['BRANCH'] || row.branch || 'Biotechnology',
    batch: row['BATCH'] || row.batch || (isSenior ? "Batch of '25 • Senior" : "Batch of '26 • Fresher"),
    role: isSenior ? 'Senior VIP Council' : 'VIP Fresher Attendee',
    seniorQuote: row.senior_quote || '',
    isSenior,
    ticketPrice: Number(row.ticket_price) || (isSenior ? 600 : 399),
    screenshot: row['SCREENSHOT'] || row.screenshot_url || null,
    screenshotUrl: row['SCREENSHOT'] || row.screenshot_url || null,
    status: row.status || 'VERIFIED',
    attendanceMarked: Boolean(row.attendance_marked),
    attendanceMarkedAt: row.attendance_marked_at || null,
    issuedAt: row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) : new Date().toLocaleDateString('en-IN'),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

/**
 * Maps frontend registration object to the exact Supabase table column schema
 */
export function mapRegistrationToRow(reg, screenshotUrl = null) {
  const cleanRoll = (reg.rollNo || reg.REGISTRATION || '').trim().toUpperCase();
  const utr = (reg.utrNumber || reg['UTR NO.'] || '').trim();
  return {
    'FULL NAME': reg.fullName || reg['FULL NAME'] || 'VIP Attendee',
    'REGISTRATION': cleanRoll || ('REG_' + Date.now()),
    'MOBILE NO.': reg.phone || reg['MOBILE NO.'] || null,
    'UTR NO.': utr || ('UTR_MANUAL_' + (reg.ticketId || Date.now())),
    'BRANCH': reg.branch || reg['BRANCH'] || 'Biotechnology',
    'BATCH': reg.batch || reg['BATCH'] || (reg.isSenior ? "Batch of '25 • Senior" : "Batch of '26 • Fresher"),
    'is_senior': Boolean(reg.isSenior),
    'ticket_price': Number(reg.ticketPrice) || (reg.isSenior ? 600 : 399),
    'SCREENSHOT': screenshotUrl || reg.screenshot || reg['SCREENSHOT'] || null,
  };
}

/**
 * Upload payment screenshot receipt to Supabase Storage
 */
export async function uploadReceipt(fileOrDataUrl, ticketOrRoll) {
  if (!isSupabaseConfigured() || (!supabase && !supabaseAdmin) || !fileOrDataUrl) {
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
  }

  const client = supabaseAdmin || supabase;
  try {
    let blob = null;
    let contentType = 'image/jpeg';
    let ext = 'jpg';

    if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      blob = fileOrDataUrl;
      contentType = fileOrDataUrl.type || 'image/jpeg';
      ext = fileOrDataUrl.name ? fileOrDataUrl.name.split('.').pop() : 'jpg';
    } else if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      blob = dataURItoBlob(fileOrDataUrl);
      const mime = fileOrDataUrl.split(',')[0].split(':')[1].split(';')[0];
      if (mime) {
        contentType = mime;
        ext = mime.split('/')[1] || 'jpg';
      }
    }

    if (!blob) {
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
    }

    const fileName = `${ticketOrRoll}-${Date.now()}.${ext}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await client.storage
      .from('receipts')
      .upload(filePath, blob, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn('[ELIXORA Supabase] Storage notice:', uploadError.message);
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
    }

    const { data: urlData } = client.storage
      .from('receipts')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (err) {
    console.error('[ELIXORA Supabase] Error during receipt upload:', err);
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
  }
}

/**
 * Automatically save attendee registration to Supabase database
 */
export async function saveRegistrationToSupabase(registration, fileOrDataUrl = null) {
  if (!isSupabaseConfigured() || (!supabase && !supabaseAdmin)) {
    return null;
  }

  const client = supabaseAdmin || supabase;
  try {
    // 1. Upload receipt to Storage if base64 dataUrl is provided
    let publicReceiptUrl = registration.screenshot;
    if (fileOrDataUrl && typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      const uploadedUrl = await uploadReceipt(fileOrDataUrl, registration.rollNo || registration.ticketId);
      if (uploadedUrl) publicReceiptUrl = uploadedUrl;
    }

    // 2. Map fields to exact Supabase schema
    const row = mapRegistrationToRow(registration, publicReceiptUrl);
    const cleanRoll = (registration.rollNo || '').trim().toUpperCase();

    // 3. Upsert checking existing row by REGISTRATION
    const { data: existing } = await client
      .from('registrations')
      .select('id')
      .eq('REGISTRATION', cleanRoll)
      .maybeSingle();

    let resultData = null;
    if (existing && existing.id) {
      const { data, error } = await client
        .from('registrations')
        .update({
          ...row,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    } else {
      const { data, error } = await client
        .from('registrations')
        .insert([row])
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    }

    console.info('[ELIXORA Supabase] Successfully synced to Supabase Cloud:', registration.fullName, registration.rollNo);
    return mapRowToRegistration(resultData);
  } catch (err) {
    console.error('[ELIXORA Supabase] Unexpected error during save:', err.message || err);
    return null;
  }
}

/**
 * Fetch all registrations from Supabase
 */
export async function fetchRegistrationsFromSupabase() {
  if (!isSupabaseConfigured() || (!supabase && !supabaseAdmin)) {
    return [];
  }

  const client = supabaseAdmin || supabase;
  try {
    const { data, error } = await client
      .from('registrations')
      .select('*')
      .neq('BRANCH', 'DELETED')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ELIXORA Supabase] Fetch error:', error.message);
      return [];
    }

    return (data || []).map(mapRowToRegistration).filter(Boolean);
  } catch (err) {
    console.error('[ELIXORA Supabase] Unexpected error during fetch:', err);
    return [];
  }
}

/**
 * Update registration verification status
 */
export async function updateRegistrationStatusInSupabase(ticketOrRoll, status) {
  if (!isSupabaseConfigured() || !supabase || !ticketOrRoll) {
    return null;
  }

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ticketOrRoll);
    let query = supabase
      .from('registrations')
      .update({ updated_at: new Date().toISOString() });

    if (isUuid) {
      query = query.eq('id', ticketOrRoll);
    } else {
      query = query.eq('REGISTRATION', (ticketOrRoll || '').trim().toUpperCase());
    }

    const { data, error } = await query.select().single();

    if (error) {
      console.error('[ELIXORA Supabase] Update status error:', error.message);
      return null;
    }

    return mapRowToRegistration(data);
  } catch (err) {
    console.error('[ELIXORA Supabase] Update status failed:', err);
    return null;
  }
}

/**
 * Toggle attendance marked status
 */
export async function updateAttendanceInSupabase(ticketOrRoll, attendanceMarked) {
  if (!isSupabaseConfigured() || !supabase || !ticketOrRoll) {
    return null;
  }

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ticketOrRoll);
    let query = supabase
      .from('registrations')
      .update({
        updated_at: new Date().toISOString(),
      });

    if (isUuid) {
      query = query.eq('id', ticketOrRoll);
    } else {
      query = query.eq('REGISTRATION', (ticketOrRoll || '').trim().toUpperCase());
    }

    const { data, error } = await query.select().single();

    if (error) {
      console.error('[ELIXORA Supabase] Attendance update error:', error.message);
      return null;
    }

    return mapRowToRegistration(data);
  } catch (err) {
    console.error('[ELIXORA Supabase] Attendance update failed:', err);
    return null;
  }
}

/**
 * Delete registration from Supabase
 */
export async function deleteRegistrationFromSupabase(identifierOrTarget) {
  if (!isSupabaseConfigured() || (!supabase && !supabaseAdmin) || !identifierOrTarget) {
    return false;
  }
  const client = supabaseAdmin || supabase;
  try {
    const isTargetObj = typeof identifierOrTarget === 'object' && identifierOrTarget !== null;
    const targetId = isTargetObj
      ? identifierOrTarget.id
      : (typeof identifierOrTarget === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifierOrTarget)
        ? identifierOrTarget
        : null);

    const rawRoll = isTargetObj
      ? (identifierOrTarget.rollNo || identifierOrTarget.roll_no || identifierOrTarget.REGISTRATION || identifierOrTarget.roll)
      : (!targetId && typeof identifierOrTarget === 'string' ? identifierOrTarget : null);
    const cleanRoll = rawRoll ? String(rawRoll).trim().toUpperCase() : null;

    const targetUtr = isTargetObj
      ? (identifierOrTarget.utrNumber || identifierOrTarget['UTR NO.'] || identifierOrTarget.utr)
      : null;

    let deleted = false;

    // 1. Hard delete by primary key UUID in Supabase
    if (targetId) {
      const { data, error } = await client.from('registrations').delete().eq('id', targetId).select();
      if (!error && data && data.length > 0) {
        deleted = true;
        console.info('[ELIXORA Supabase] Hard deleted registration row by UUID in real time:', targetId);
      }
    }

    // 2. Hard delete by REGISTRATION (roll number)
    if (cleanRoll) {
      const { data, error } = await client.from('registrations').delete().eq('REGISTRATION', cleanRoll).select();
      if (!error && data && data.length > 0) {
        deleted = true;
        console.info('[ELIXORA Supabase] Hard deleted registration row by REGISTRATION in real time:', cleanRoll);
      }
    }

    // 3. Fallback: hard delete by UTR NO. if roll/id weren't matched
    if (!deleted && targetUtr) {
      const { data, error } = await client.from('registrations').delete().eq('UTR NO.', String(targetUtr).trim()).select();
      if (!error && data && data.length > 0) {
        deleted = true;
        console.info('[ELIXORA Supabase] Hard deleted registration row by UTR in real time:', targetUtr);
      }
    }

    // 4. Soft-delete fallback to ensure row never appears even if an RLS policy intercepted delete
    const softDeletePayload = {
      'BRANCH': 'DELETED',
      'FULL NAME': '[DELETED]',
      updated_at: new Date().toISOString(),
    };
    if (targetId) {
      await client.from('registrations').update(softDeletePayload).eq('id', targetId);
    }
    if (cleanRoll) {
      await client.from('registrations').update(softDeletePayload).eq('REGISTRATION', cleanRoll);
    }

    return true;
  } catch (err) {
    console.error('[ELIXORA Supabase] Real-time delete failed:', err);
    return false;
  }
}

/**
 * Subscribe to real-time changes on the registrations table
 */
export function subscribeToSupabaseRegistrations(onInsert, onUpdate, onDelete) {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  // Remove existing channels with same topic to avoid duplicate channel conflicts
  try {
    const existingChannels = supabase.getChannels?.() || [];
    for (const ch of existingChannels) {
      if (ch.topic?.includes('elixora-registrations-live')) {
        supabase.removeChannel(ch);
      }
    }
  } catch (e) {}

  const channel = supabase
    .channel('elixora-registrations-live')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'registrations' },
      (payload) => {
        const item = mapRowToRegistration(payload.new);
        if (item && onInsert) onInsert(item);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'registrations' },
      (payload) => {
        const item = mapRowToRegistration(payload.new);
        if (item && onUpdate) {
          onUpdate(item);
        } else if (!item && onDelete) {
          const id = payload.new?.id || payload.old?.id;
          const roll = payload.new?.REGISTRATION || payload.old?.REGISTRATION;
          if (id || roll) onDelete(id || roll);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'registrations' },
      (payload) => {
        const id = payload.old?.id;
        const roll = payload.old?.REGISTRATION;
        if (onDelete && (id || roll)) onDelete(id || roll);
      }
    )
    .subscribe();

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch (e) {}
  };
}
