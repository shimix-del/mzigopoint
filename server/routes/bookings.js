const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { db } = require('../db');
const { authenticateToken } = require('./auth');

// Helper to calculate total price
function calculateStoragePrice(itemSize, qty, days) {
  const settingsRow = db.prepare("SELECT value FROM settings WHERE key = 'pricing_rates'").get();
  let rates = {
    small: { day: 150, week: 900, month: 3200 },
    medium: { day: 250, week: 1500, month: 5500 },
    large: { day: 400, week: 2400, month: 8800 },
    xlarge: { day: 750, week: 4500, month: 16000 }
  };

  if (settingsRow && settingsRow.value) {
    try {
      rates = JSON.parse(settingsRow.value);
    } catch (e) {}
  }

  const rate = rates[itemSize] || rates.medium;
  const numDays = Math.max(1, parseInt(days) || 1);
  const quantity = Math.max(1, parseInt(qty) || 1);

  let totalPerUnit = 0;
  if (numDays >= 30) {
    const months = Math.floor(numDays / 30);
    const remDays = numDays % 30;
    totalPerUnit = (months * rate.month) + (remDays * rate.day);
  } else if (numDays >= 7) {
    const weeks = Math.floor(numDays / 7);
    const remDays = numDays % 7;
    totalPerUnit = (weeks * rate.week) + (remDays * rate.day);
  } else {
    totalPerUnit = numDays * rate.day;
  }

  return totalPerUnit * quantity;
}

// Generate unique booking reference MZP-2026-XXXX
function generateBookingRef() {
  const year = new Date().getFullYear();
  const countRow = db.prepare('SELECT COUNT(*) as count FROM bookings').get();
  const seq = String(countRow.count + 1).padStart(4, '0');
  let ref = `MZP-${year}-${seq}`;

  // Ensure unique
  let check = db.prepare('SELECT id FROM bookings WHERE booking_ref = ?').get(ref);
  while (check) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    ref = `MZP-${year}-${randomSuffix}`;
    check = db.prepare('SELECT id FROM bookings WHERE booking_ref = ?').get(ref);
  }
  return ref;
}

// Check and update overdue bookings automatically
function refreshOverdueBookings() {
  const today = new Date().toISOString().split('T')[0];
  const settingsLateFee = db.prepare("SELECT value FROM settings WHERE key = 'late_fee_per_day'").get();
  const lateFeePerDay = settingsLateFee ? parseFloat(settingsLateFee.value) || 100 : 100;

  const candidates = db.prepare(`
    SELECT id, expected_pickup_date, total_amount, paid_amount, late_fee, status
    FROM bookings
    WHERE status IN ('in_storage', 'ready') AND expected_pickup_date < ?
  `).all(today);

  for (const b of candidates) {
    const expDate = new Date(b.expected_pickup_date);
    const now = new Date(today);
    const diffTime = Math.abs(now - expDate);
    const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (overdueDays > 0) {
      const calculatedLateFee = overdueDays * lateFeePerDay;
      const newBalance = Math.max(0, (b.total_amount + calculatedLateFee) - b.paid_amount);

      db.prepare(`
        UPDATE bookings
        SET status = 'overdue',
            late_fee = ?,
            balance_amount = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(calculatedLateFee, newBalance, b.id);

      db.prepare(`
        INSERT INTO audit_logs (booking_id, action, details, performed_by)
        VALUES (?, 'OVERDUE_MARKED', ?, 'System Auto-Monitor')
      `).run(b.id, `Item overdue by ${overdueDays} days. Late fee of KES ${calculatedLateFee} applied.`);
    }
  }
}

// GET all bookings (Admin/Staff)
router.get('/', authenticateToken, (req, res) => {
  refreshOverdueBookings();

  const { search, status, payment_status, start_date, end_date } = req.query;

  let query = `
    SELECT
      b.*,
      c.name as customer_name,
      c.phone as customer_phone,
      c.email as customer_email,
      c.id_number as customer_id_number,
      CAST((julianday('now') - julianday(b.dropoff_date)) AS INTEGER) as days_stored_calculated
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    WHERE 1=1
  `;

  const params = [];

  if (search) {
    query += ` AND (
      b.booking_ref LIKE ? OR
      c.name LIKE ? OR
      c.phone LIKE ? OR
      b.shelf_location LIKE ?
    )`;
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }

  if (status && status !== 'all') {
    query += ` AND b.status = ?`;
    params.push(status);
  }

  if (payment_status && payment_status !== 'all') {
    query += ` AND b.payment_status = ?`;
    params.push(payment_status);
  }

  if (start_date) {
    query += ` AND b.dropoff_date >= ?`;
    params.push(start_date);
  }

  if (end_date) {
    query += ` AND b.dropoff_date <= ?`;
    params.push(end_date);
  }

  query += ` ORDER BY b.created_at DESC`;

  const bookings = db.prepare(query).all(...params);
  res.json({ bookings });
});

// GET single booking details (Admin/Staff)
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  const booking = db.prepare(`
    SELECT
      b.*,
      c.name as customer_name,
      c.phone as customer_phone,
      c.email as customer_email,
      c.id_number as customer_id_number,
      CAST((julianday('now') - julianday(b.dropoff_date)) AS INTEGER) as days_stored_calculated
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    WHERE b.id = ?
  `).get(id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const payments = db.prepare('SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC').all(id);
  const auditLogs = db.prepare('SELECT * FROM audit_logs WHERE booking_id = ? ORDER BY created_at DESC').all(id);

  // Generate QR code Data URL
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({
      ref: booking.booking_ref,
      name: booking.customer_name,
      phone: booking.customer_phone,
      items: `${booking.quantity}x ${booking.item_type} (${booking.item_size})`,
      shelf: booking.shelf_location || 'Unassigned',
      status: booking.status
    }));
  } catch (err) {
    console.error('QR code error', err);
  }

  res.json({
    booking,
    payments,
    auditLogs,
    qrCodeDataUrl
  });
});

// Public Track Booking by Ref + Phone
router.post('/track', async (req, res) => {
  refreshOverdueBookings();
  const { reference, phone } = req.body;

  if (!reference || !phone) {
    return res.status(400).json({ error: 'Booking reference and phone number are required' });
  }

  const cleanRef = reference.trim().toUpperCase();
  const cleanPhone = phone.trim().replace(/\s+/g, '');

  const booking = db.prepare(`
    SELECT
      b.id,
      b.booking_ref,
      b.item_type,
      b.item_size,
      b.quantity,
      b.description,
      b.is_fragile,
      b.dropoff_date,
      b.dropoff_time,
      b.expected_pickup_date,
      b.actual_pickup_date,
      b.storage_reason,
      b.shelf_location,
      b.status,
      b.total_amount,
      b.paid_amount,
      b.balance_amount,
      b.payment_status,
      b.late_fee,
      b.created_at,
      c.name as customer_name,
      c.phone as customer_phone,
      CAST((julianday('now') - julianday(b.dropoff_date)) AS INTEGER) as days_stored_calculated
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    WHERE b.booking_ref = ? AND (
      c.phone LIKE ? OR
      c.phone = ? OR
      replace(c.phone, '+254', '0') = ? OR
      replace(c.phone, '+254', '') = ?
    )
  `).get(cleanRef, `%${cleanPhone.slice(-9)}%`, cleanPhone, cleanPhone, cleanPhone);

  if (!booking) {
    return res.status(404).json({ error: 'No booking found matching that reference and phone number. Please verify your details.' });
  }

  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(booking.booking_ref);
  } catch (e) {}

  res.json({
    booking,
    qrCodeDataUrl
  });
});

// POST Create Booking (Public website multi-step form OR Staff walk-in)
router.post('/', async (req, res) => {
  const {
    name,
    phone,
    email,
    id_number,
    item_type,
    item_size,
    quantity,
    description,
    is_fragile,
    photo_url,
    dropoff_date,
    dropoff_time,
    expected_pickup_date,
    storage_reason,
    payment_choice, // 'mpesa_stk' or 'counter'
    payment_type, // 'full' or 'deposit'
    deposit_amount,
    shelf_location, // if walk-in by staff
    notes,
    is_walkin
  } = req.body;

  if (!name || !phone || !id_number || !dropoff_date || !expected_pickup_date || !item_size) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  // Calculate days
  const dDrop = new Date(dropoff_date);
  const dPick = new Date(expected_pickup_date);
  const diffDays = Math.max(1, Math.ceil((dPick - dDrop) / (1000 * 60 * 60 * 24)));

  const totalAmount = calculateStoragePrice(item_size, quantity || 1, diffDays);
  const bookingRef = generateBookingRef();

  // Find or create customer
  let customer = db.prepare('SELECT id FROM customers WHERE phone = ?').get(phone.trim());
  let customerId;

  if (customer) {
    customerId = customer.id;
    // update email / id if supplied
    db.prepare(`
      UPDATE customers
      SET name = ?, email = COALESCE(?, email), id_number = COALESCE(?, id_number)
      WHERE id = ?
    `).run(name.trim(), email ? email.trim() : null, id_number.trim(), customerId);
  } else {
    const custInfo = db.prepare(`
      INSERT INTO customers (name, phone, email, id_number)
      VALUES (?, ?, ?, ?)
    `).run(name.trim(), phone.trim(), email ? email.trim() : null, id_number.trim());
    customerId = custInfo.lastInsertRowid;
  }

  // Determine initial payment and status
  let initialPaid = 0;
  let payStatus = 'pending';
  let initialStatus = is_walkin ? 'in_storage' : 'booked';

  if (payment_choice === 'mpesa_stk' && payment_type === 'full') {
    initialPaid = totalAmount;
    payStatus = 'paid';
  } else if (payment_choice === 'mpesa_stk' && payment_type === 'deposit') {
    initialPaid = deposit_amount ? parseFloat(deposit_amount) : Math.ceil(totalAmount * 0.5);
    payStatus = initialPaid >= totalAmount ? 'paid' : 'partial';
  }

  const balanceAmount = Math.max(0, totalAmount - initialPaid);

  const insertBookingStmt = db.prepare(`
    INSERT INTO bookings (
      booking_ref, customer_id, item_type, item_size, quantity, description,
      is_fragile, photo_url, dropoff_date, dropoff_time, expected_pickup_date,
      storage_reason, shelf_location, status, total_amount, paid_amount,
      balance_amount, payment_status, notes
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  const info = insertBookingStmt.run(
    bookingRef,
    customerId,
    item_type || 'Luggage & Belongings',
    item_size,
    quantity || 1,
    description || '',
    is_fragile ? 1 : 0,
    photo_url || null,
    dropoff_date,
    dropoff_time || '10:00 AM',
    expected_pickup_date,
    storage_reason || 'Other',
    shelf_location || null,
    initialStatus,
    totalAmount,
    initialPaid,
    balanceAmount,
    payStatus,
    notes || null
  );

  const bookingId = info.lastInsertRowid;

  // Record initial payment if paid online
  if (initialPaid > 0) {
    const fakeMpesa = 'QKP' + Math.floor(1000000 + Math.random() * 9000000);
    db.prepare(`
      INSERT INTO payments (booking_id, amount, payment_method, mpesa_code, notes, recorded_by)
      VALUES (?, ?, 'mpesa_stk', ?, ?, ?)
    `).run(bookingId, initialPaid, fakeMpesa, 'Online M-Pesa Payment', is_walkin ? 'Staff Counter' : 'M-Pesa Daraja STK');
  }

  // Record Audit
  db.prepare(`
    INSERT INTO audit_logs (booking_id, action, details, performed_by)
    VALUES (?, 'BOOKING_CREATED', ?, ?)
  `).run(
    bookingId,
    `Booking ${bookingRef} created. Total KES ${totalAmount}, Paid KES ${initialPaid}`,
    is_walkin ? 'Staff Counter' : 'Online Customer'
  );

  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(bookingRef);
  } catch (err) {}

  res.status(201).json({
    message: 'Booking successfully created',
    bookingId,
    bookingRef,
    totalAmount,
    paidAmount: initialPaid,
    balanceAmount,
    paymentStatus: payStatus,
    qrCodeDataUrl
  });
});

// PATCH Update status & actions (Staff/Admin)
router.patch('/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    status,
    shelf_location,
    collector_name,
    collector_id,
    collector_signature,
    notes
  } = req.body;

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  let actualPickup = booking.actual_pickup_date;
  if (status === 'collected' && !actualPickup) {
    actualPickup = new Date().toISOString().replace('T', ' ').slice(0, 19);
  }

  db.prepare(`
    UPDATE bookings
    SET
      status = COALESCE(?, status),
      shelf_location = COALESCE(?, shelf_location),
      collector_name = COALESCE(?, collector_name),
      collector_id = COALESCE(?, collector_id),
      collector_signature = COALESCE(?, collector_signature),
      notes = COALESCE(?, notes),
      actual_pickup_date = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    status || null,
    shelf_location || null,
    collector_name || null,
    collector_id || null,
    collector_signature || null,
    notes || null,
    actualPickup,
    id
  );

  const actor = req.user ? req.user.name : 'Staff';
  let logDetail = `Status changed to ${status || booking.status}`;
  if (shelf_location) logDetail += ` | Shelf: ${shelf_location}`;
  if (collector_name) logDetail += ` | Collected by: ${collector_name} (ID: ${collector_id})`;

  db.prepare(`
    INSERT INTO audit_logs (booking_id, action, details, performed_by)
    VALUES (?, ?, ?, ?)
  `).run(id, `STATUS_${(status || 'UPDATED').toUpperCase()}`, logDetail, actor);

  res.json({ message: 'Booking status updated successfully' });
});

// POST Extend Booking (Public or Admin)
router.post('/:id/extend', async (req, res) => {
  const { id } = req.params;
  const { new_pickup_date, payment_method, mpesa_code, paid_now } = req.body;

  if (!new_pickup_date) {
    return res.status(400).json({ error: 'New pickup date is required' });
  }

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const dOldPick = new Date(booking.expected_pickup_date);
  const dNewPick = new Date(new_pickup_date);
  const extraDays = Math.ceil((dNewPick - dOldPick) / (1000 * 60 * 60 * 24));

  if (extraDays <= 0) {
    return res.status(400).json({ error: 'New date must be after current pickup date' });
  }

  // Recalculate full period
  const dDrop = new Date(booking.dropoff_date);
  const totalDays = Math.ceil((dNewPick - dDrop) / (1000 * 60 * 60 * 24));
  const newTotal = calculateStoragePrice(booking.item_size, booking.quantity, totalDays) + (booking.late_fee || 0);

  const addedPayment = parseFloat(paid_now) || 0;
  const updatedPaid = booking.paid_amount + addedPayment;
  const updatedBalance = Math.max(0, newTotal - updatedPaid);
  const updatedPayStatus = updatedBalance === 0 ? 'paid' : (updatedPaid > 0 ? 'partial' : 'pending');

  let newStatus = booking.status;
  if (booking.status === 'overdue' && new_pickup_date >= new Date().toISOString().split('T')[0]) {
    newStatus = 'in_storage';
  }

  db.prepare(`
    UPDATE bookings
    SET
      expected_pickup_date = ?,
      total_amount = ?,
      paid_amount = ?,
      balance_amount = ?,
      payment_status = ?,
      status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(new_pickup_date, newTotal, updatedPaid, updatedBalance, updatedPayStatus, newStatus, id);

  if (addedPayment > 0) {
    db.prepare(`
      INSERT INTO payments (booking_id, amount, payment_method, mpesa_code, notes, recorded_by)
      VALUES (?, ?, ?, ?, 'Extension payment', ?)
    `).run(id, addedPayment, payment_method || 'mpesa_stk', mpesa_code || 'EXT-PAY', 'Customer / Staff');
  }

  db.prepare(`
    INSERT INTO audit_logs (booking_id, action, details, performed_by)
    VALUES (?, 'BOOKING_EXTENDED', ?, ?)
  `).run(id, `Storage extended to ${new_pickup_date} (+${extraDays} days). New total: KES ${newTotal}`, 'Customer/Staff');

  res.json({
    message: 'Booking extended successfully',
    newTotal,
    updatedPaid,
    updatedBalance,
    newStatus
  });
});

module.exports = router;
