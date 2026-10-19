import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
 * Maps database snake_case row to frontend camelCase registration object
 */
export function mapRowToRegistration(row) {
  if (!row) return null;
  return {
    ticketId: row.ticket_id,
    fullName: row.full_name,
    rollNo: row.roll_no,
    phone: row.phone,
    utrNumber: row.utr_number,
    branch: row.branch,
    batch: row.batch,
    role: row.role,
    seniorQuote: row.senior_quote,
    isSenior: Boolean(row.is_senior),
    ticketPrice: row.ticket_price,
    screenshot: row.screenshot_url,
    screenshotUrl: row.screenshot_url,
    status: row.status,
    attendanceMarked: Boolean(row.attendance_marked),
    attendanceMarkedAt: row.attendance_marked_at,
    issuedAt: row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) : new Date().toLocaleDateString('en-IN'),
    createdAt: row.created_at,
  };
}

/**
 * Maps frontend camelCase registration object to database snake_case row
 */
export function mapRegistrationToRow(reg, screenshotUrl = null) {
  return {
    ticket_id: reg.ticketId,
    full_name: reg.fullName,
    roll_no: reg.rollNo,
    phone: reg.phone || null,
    utr_number: reg.utrNumber,
    branch: reg.branch || 'Biotechnology',
    batch: reg.batch || "Batch of '26 • Fresher",
    role: reg.role || (reg.isSenior ? 'VIP Senior Council' : 'VIP Fresher Attendee'),
    senior_quote: reg.seniorQuote || null,
    is_senior: Boolean(reg.isSenior),
    ticket_price: reg.ticketPrice || 399,
    screenshot_url: screenshotUrl || reg.screenshot || null,
    status: reg.status || 'pending_verification',
    attendance_marked: Boolean(reg.attendanceMarked),
  };
}

/**
 * Upload payment screenshot receipt to Supabase Storage
 */
export async function uploadReceipt(fileOrDataUrl, ticketId) {
  if (!isSupabaseConfigured() || !supabase || !fileOrDataUrl) {
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
  }

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

    const fileName = `${ticketId}-${Date.now()}.${ext}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(filePath, blob, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn('[ELIXORA Supabase] Storage upload failed, falling back:', uploadError.message);
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
    }

    const { data: urlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (err) {
    console.error('[ELIXORA Supabase] Error during receipt upload:', err);
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null;
  }
}

/**
 * Save new attendee registration to Supabase database
 */
export async function saveRegistrationToSupabase(registration, fileOrDataUrl = null) {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    // 1. Upload receipt to Storage if provided
    let publicReceiptUrl = registration.screenshot;
    if (fileOrDataUrl) {
      const uploadedUrl = await uploadReceipt(fileOrDataUrl, registration.ticketId);
      if (uploadedUrl) publicReceiptUrl = uploadedUrl;
    }

    // 2. Insert or update record in database safely using upsert
    const row = mapRegistrationToRow(registration, publicReceiptUrl);
    const { data, error } = await supabase
      .from('registrations')
      .upsert([row], { onConflict: 'ticket_id' })
      .select()
      .single();

    if (error) {
      console.error('[ELIXORA Supabase] Insert error:', error.message);
      return null;
    }

    return mapRowToRegistration(data);
  } catch (err) {
    console.error('[ELIXORA Supabase] Unexpected error during save:', err);
    return null;
  }
}

/**
 * Fetch all registrations from Supabase
 */
export async function fetchRegistrationsFromSupabase() {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ELIXORA Supabase] Fetch error:', error.message);
      return [];
    }

    return (data || []).map(mapRowToRegistration);
  } catch (err) {
    console.error('[ELIXORA Supabase] Unexpected error during fetch:', err);
    return [];
  }
}

/**
 * Update registration verification status
 */
export async function updateRegistrationStatusInSupabase(ticketId, status) {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('registrations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('ticket_id', ticketId)
      .select()
      .single();

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
export async function updateAttendanceInSupabase(ticketId, attendanceMarked) {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('registrations')
      .update({
        attendance_marked: attendanceMarked,
        attendance_marked_at: attendanceMarked ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('ticket_id', ticketId)
      .select()
      .single();

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

export async function deleteRegistrationFromSupabase(ticketId) {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('ticket_id', ticketId);

    if (error) {
      console.error('[ELIXORA Supabase] Delete error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[ELIXORA Supabase] Delete failed:', err);
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
        if (item && onUpdate) onUpdate(item);
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'registrations' },
      (payload) => {
        const ticketId = payload.old?.ticket_id;
        if (ticketId && onDelete) onDelete(ticketId);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
