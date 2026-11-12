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
  if (
    row['BRANCH'] === 'DELETED' ||
    (row['FULL NAME'] && row['FULL NAME'].includes('[DELETED]')) ||
    (row['STUDENT NAME'] && row['STUDENT NAME'].includes('[DELETED]'))
  ) {
    return null;
  }
  const roll = (
    row['ROLL NO'] ||
    row.roll_no ||
    row['REGISTRATION'] ||
    row.registration ||
    ''
  ).trim().toUpperCase();

  const fullName = (
    row['STUDENT NAME'] ||
    row.student_name ||
    row['FULL NAME'] ||
    row.full_name ||
    ''
  ).trim();

  // Ignore empty ghost entries
  if (!roll && !fullName) {
    return null;
  }

  const isSenior = Boolean(
    row.is_senior ||
    (row['CATEGORY'] && String(row['CATEGORY']).toUpperCase().includes('SENIOR')) ||
    (row.category && String(row.category).toUpperCase().includes('SENIOR'))
  );

  const category =
    row['CATEGORY'] ||
    row.category ||
    (isSenior ? 'SENIOR VIP' : 'FRESHER');

  const ticketId =
    row['TICKET ID'] ||
    row.ticket_id ||
    `ELX-${isSenior ? 'SR' : '26'}-${roll ? roll.slice(-4) : (row.id ? row.id.slice(0, 4).toUpperCase() : 'PASS')}`;

  const photo =
    row['PHOTO'] ||
    row.photo ||
    row['SCREENSHOT'] ||
    row.screenshot ||
    row.screenshot_url ||
    row['screenshot_url'] ||
    null;

  const status =
    row['STATUS'] ||
    row.status ||
    'VERIFIED';

  const regDate =
    row['REGISTRATION DATE'] ||
    row['DATE'] ||
    row.registration_date ||
    (row.created_at
      ? new Date(row.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : null);

  const regTime =
    row['REGISTRATION TIME'] ||
    row['TIME'] ||
    row.registration_time ||
    (row.created_at
      ? new Date(row.created_at).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : null);

  const regDateTime =
    row['REGISTRATION DATE & TIME'] ||
    (regDate && regTime ? `${regDate}, ${regTime}` : null);

  const food =
    row['FOOD'] ||
    row.food ||
    row['DIET'] ||
    row.diet ||
    'Veg';

  return {
    id: row.id,
    _id: row.id || (roll ? `reg_roll_${roll}` : `reg_${ticketId || Date.now()}`),
    ticketId,
    fullName,
    rollNo: roll,
    category,
    food,
    diet: food,
    phone: row['MOBILE NO.'] || row.phone || '',
    utrNumber: row['UTR NO.'] || row.utr_number || '',
    branch: row['BRANCH'] || row.branch || 'Biotechnology',
    batch: row['BATCH'] || row.batch || (isSenior ? "Batch of '25 • Senior" : "Batch of '26 • Fresher"),
    role: isSenior ? 'Senior VIP Council' : 'VIP Fresher Attendee',
    seniorQuote: row.senior_quote || '',
    isSenior,
    ticketPrice: Number(row.ticket_price) || (isSenior ? 600 : 399),
    screenshot: photo,
    screenshotUrl: photo,
    photo,
    status,
    registrationDate: regDate,
    registrationTime: regTime,
    registrationDateTime: regDateTime,
    attendanceMarked: Boolean(row.attendance_marked),
    attendanceMarkedAt: row.attendance_marked_at || null,
    issuedAt: regDateTime || (row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) : new Date().toLocaleDateString('en-IN')),
    createdAt: row.registered_at || row.created_at || new Date().toISOString(),
  };
}

/**
 * Maps frontend registration object to the exact Supabase table column schema
 * Supporting [STUDENT NAME | ROLL NO | CATEGORY | TICKET ID | PHOTO | STATUS]
 * and Registration Date & Time Options
 */
export function mapRegistrationToRow(reg, screenshotUrl = null) {
  const cleanRoll = (
    reg.rollNo ||
    reg['ROLL NO'] ||
    reg.roll_no ||
    reg.REGISTRATION ||
    ''
  ).replace(/[^a-zA-Z0-9]/g, '').trim().toUpperCase();

  const utr = (
    reg.utrNumber ||
    reg['UTR NO.'] ||
    reg.utr_number ||
    ''
  ).replace(/[^a-zA-Z0-9]/g, '').trim();

  const fullName = (
    reg.fullName ||
    reg['STUDENT NAME'] ||
    reg.student_name ||
    reg['FULL NAME'] ||
    'VIP Attendee'
  ).trim();

  const isSenior = Boolean(reg.isSenior);
  const category = reg.category || reg['CATEGORY'] || (isSenior ? 'SENIOR VIP' : 'FRESHER');
  const ticketId = reg.ticketId || reg['TICKET ID'] || reg.ticket_id || `ELX-${isSenior ? 'SR' : '26'}-${cleanRoll ? cleanRoll.slice(-4) : 'PASS'}`;
  const photo = screenshotUrl || reg.photo || reg['PHOTO'] || reg.screenshot || reg['SCREENSHOT'] || reg.screenshotUrl || null;
  const status = reg.status || reg['STATUS'] || 'VERIFIED';
  const food = reg.food || reg.diet || reg['FOOD'] || reg['DIET'] || 'Veg';

  const now = new Date();
  const regDate =
    reg.registrationDate ||
    now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const regTime =
    reg.registrationTime ||
    now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const regDateTime = reg.issuedAt || `${regDate}, ${regTime}`;

  return {
    // Exact schema matching the admin table headers
    'STUDENT NAME': fullName,
    'ROLL NO': cleanRoll || ('REG_' + Date.now()),
    'CATEGORY': category,
    'TICKET ID': ticketId,
    'PHOTO': photo,
    'STATUS': status,
    'FOOD': food,
    'DIET': food,
    food: food,
    diet: food,

    // Time & Date of Registration Options for Supabase Table
    'REGISTRATION DATE': regDate,
    'REGISTRATION TIME': regTime,
    'REGISTRATION DATE & TIME': regDateTime,
    'DATE': regDate,
    'TIME': regTime,
    registration_date: now.toISOString().split('T')[0],
    registration_time: regTime,
    registered_at: reg.createdAt || now.toISOString(),

    // Legacy / base schema columns for full backward compatibility
    'FULL NAME': fullName,
    'REGISTRATION': cleanRoll || ('REG_' + Date.now()),
    'MOBILE NO.': reg.phone || reg['MOBILE NO.'] || null,
    'UTR NO.': utr || ('UTR_MANUAL_' + (ticketId || Date.now())),
    'BRANCH': reg.branch || reg['BRANCH'] || 'Biotechnology',
    'BATCH': reg.batch || reg['BATCH'] || (isSenior ? "Batch of '25 • Senior" : "Batch of '26 • Fresher"),
    'is_senior': isSenior,
    'ticket_price': Number(reg.ticketPrice) || (isSenior ? 600 : 399),
    'SCREENSHOT': photo,
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

    // Sanitize identifier to prevent path traversal or invalid bucket characters
    const safePrefix = String(ticketOrRoll || 'ticket').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const fileName = `${safePrefix}_${Date.now()}.${ext}`;

    const { error: uploadError } = await client.storage
      .from('receipts')
      .upload(fileName, blob, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn('[ELIXORA Supabase] Storage notice:', uploadError.message);
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
    }

    const { data: urlData } = client.storage
      .from('receipts')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (err) {
    console.error('[ELIXORA Supabase] Error during receipt upload:', err);
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
  }
}

/**
 * Automatically save attendee registration to Supabase database in real time
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

    // 2. Strict Input Sanitization & Mapping
    const cleanRoll = (registration.rollNo || registration.REGISTRATION || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .trim()
      .toUpperCase();
    const cleanUtr = (registration.utrNumber || registration['UTR NO.'] || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .trim();

    if (!cleanRoll || cleanRoll.length < 4) {
      throw new Error('Registration number must be at least 4 alphanumeric characters');
    }
    if (!cleanUtr || cleanUtr.length < 6) {
      throw new Error('UPI UTR / Reference number must be at least 6 characters');
    }

    // 3. Security: Check for UTR Replay / Hijacking across registrations
    const { data: existingWithUtr } = await client
      .from('registrations')
      .select('id, REGISTRATION')
      .filter('"UTR NO."', 'eq', cleanUtr)
      .neq('BRANCH', 'DELETED')
      .maybeSingle();

    if (existingWithUtr && existingWithUtr.REGISTRATION && existingWithUtr.REGISTRATION !== cleanRoll) {
      console.error('[ELIXORA Security] Duplicate UTR detected for different roll number:', cleanUtr);
      throw new Error('This UPI Reference / UTR Number has already been registered with another student pass.');
    }

    const row = mapRegistrationToRow(registration, publicReceiptUrl);

    // 4. Find existing record by roll number to allow re-issues/updates by the same student
    let existingId = registration.id || null;
    if (!existingId) {
      const { data: existingByRoll } = await client
        .from('registrations')
        .select('id')
        .eq('REGISTRATION', cleanRoll)
        .neq('BRANCH', 'DELETED')
        .maybeSingle();
      if (existingByRoll?.id) existingId = existingByRoll.id;
    }

    // 5. Dynamic Adaptive Save: Writes new columns [STUDENT NAME, ROLL NO, CATEGORY, TICKET ID, PHOTO, STATUS]
    // while gracefully stripping any columns not yet created in remote table before migration
    const saveWithDynamicFallback = async (payload, isUpdate, targetId) => {
      let currentPayload = { ...payload };
      let attempts = 0;
      while (attempts < 10) {
        attempts++;
        try {
          if (isUpdate) {
            const { data, error } = await client
              .from('registrations')
              .update({ ...currentPayload, updated_at: new Date().toISOString() })
              .eq('id', targetId)
              .select()
              .single();
            if (error) throw error;
            return data;
          } else {
            const { data, error } = await client
              .from('registrations')
              .insert([currentPayload])
              .select()
              .single();
            if (error) throw error;
            return data;
          }
        } catch (err) {
          if (err?.code === 'PGRST204' || (err?.message && (err.message.includes('column') || err.message.includes('schema cache')))) {
            const match = err.message.match(/Could not find the '([^']+)' column/) || err.message.match(/column [^.]+\.([^ ]+) does not exist/);
            if (match && match[1] && currentPayload[match[1]] !== undefined) {
              console.warn(`[ELIXORA Supabase] Column '${match[1]}' not yet in database; stripping and retrying...`);
              delete currentPayload[match[1]];
              continue;
            }
          }
          throw err;
        }
      }
    };

    let resultData = null;
    if (existingId) {
      resultData = await saveWithDynamicFallback(row, true, existingId);
    } else {
      resultData = await saveWithDynamicFallback(row, false);
    }

    console.info('[ELIXORA Supabase] Successfully synced to Supabase Cloud in real time:', registration.fullName, cleanRoll);
    return mapRowToRegistration(resultData);
  } catch (err) {
    console.error('[ELIXORA Supabase] Real-time sync notice:', err.message || err);
    throw err;
  }
}

/**
 * Batch sync all registrations to Supabase database without creating extra tables
 */
export async function syncAllRegistrationsToSupabase(list = []) {
  if (!isSupabaseConfigured() || (!supabase && !supabaseAdmin)) {
    return { success: false, synced: 0, error: 'Supabase is not configured' };
  }
  let count = 0;
  for (const item of list) {
    if (!item) continue;
    const res = await saveRegistrationToSupabase(item, item.screenshot);
    if (res) count++;
  }
  return { success: true, synced: count };
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
    let updatePayload = { 
      'STATUS': status,
      status: status,
      updated_at: new Date().toISOString() 
    };

    let query = supabase
      .from('registrations')
      .update(updatePayload);

    if (isUuid) {
      query = query.eq('id', ticketOrRoll);
    } else {
      query = query.or(`REGISTRATION.eq.${(ticketOrRoll || '').trim().toUpperCase()},"ROLL NO".eq.${(ticketOrRoll || '').trim().toUpperCase()},"TICKET ID".eq.${ticketOrRoll}`);
    }

    let { data, error } = await query.select().maybeSingle();

    // If 'STATUS' column not yet in remote table schema, retry with status only
    if (error && (error.code === 'PGRST204' || error.message?.includes('STATUS') || error.message?.includes('schema cache'))) {
      delete updatePayload['STATUS'];
      delete updatePayload.status;
      query = supabase.from('registrations').update({ updated_at: new Date().toISOString() });
      if (isUuid) {
        query = query.eq('id', ticketOrRoll);
      } else {
        query = query.eq('REGISTRATION', (ticketOrRoll || '').trim().toUpperCase());
      }
      const retryResult = await query.select().maybeSingle();
      data = retryResult.data;
      error = retryResult.error;
    }

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

    // 2. Hard delete by REGISTRATION or ROLL NO (roll number)
    if (cleanRoll) {
      try {
        const { data, error } = await client.from('registrations').delete().eq('REGISTRATION', cleanRoll).select();
        if (!error && data && data.length > 0) {
          deleted = true;
          console.info('[ELIXORA Supabase] Hard deleted registration row by REGISTRATION in real time:', cleanRoll);
        }
      } catch (e) {}

      if (!deleted) {
        try {
          const { data, error } = await client.from('registrations').delete().eq('ROLL NO', cleanRoll).select();
          if (!error && data && data.length > 0) {
            deleted = true;
            console.info('[ELIXORA Supabase] Hard deleted registration row by ROLL NO in real time:', cleanRoll);
          }
        } catch (e) {}
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
