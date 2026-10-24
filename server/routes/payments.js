const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('./auth');

// GET all payments
router.get('/', authenticateToken, (req, res) => {
  const { date, method, search } = req.query;

  let query = `
    SELECT
      p.*,
      b.booking_ref,
      b.total_amount as booking_total,
      b.balance_amount as booking_balance,
      c.name as customer_name,
      c.phone as customer_phone
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    JOIN customers c ON b.customer_id = c.id
    WHERE 1=1
  `;

  const params = [];

  if (date) {
    query += ` AND p.created_at LIKE ?`;
    params.push(`${date}%`);
  }

  if (method && method !== 'all') {
    query += ` AND p.payment_method = ?`;
    params.push(method);
  }

  if (search) {
    query += ` AND (b.booking_ref LIKE ? OR c.name LIKE ? OR c.phone LIKE ? OR p.mpesa_code LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }

  query += ` ORDER BY p.created_at DESC`;

  const payments = db.prepare(query).all(...params);
  res.json({ payments });
});

// POST Record Manual Payment (Cash or M-Pesa counter)
router.post('/', authenticateToken, (req, res) => {
  const { booking_id, amount, payment_method, mpesa_code, notes } = req.body;

  if (!booking_id || !amount || !payment_method) {
    return res.status(400).json({ error: 'Booking ID, amount, and payment method are required' });
  }

  const payAmount = parseFloat(amount);
  if (payAmount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than zero' });
  }

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const recordedBy = req.user ? req.user.name : 'Staff';

  // Insert payment
  const stmt = db.prepare(`
    INSERT INTO payments (booking_id, amount, payment_method, mpesa_code, notes, recorded_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const pInfo = stmt.run(
    booking_id,
    payAmount,
    payment_method,
    mpesa_code ? mpesa_code.trim().toUpperCase() : (payment_method === 'cash' ? 'CASH-RCPT' : null),
    notes || 'Payment recorded at counter',
    recordedBy
  );

  // Update booking
  const newPaid = booking.paid_amount + payAmount;
  const newBalance = Math.max(0, (booking.total_amount + (booking.late_fee || 0)) - newPaid);
  const newStatus = newBalance === 0 ? 'paid' : 'partial';

  db.prepare(`
    UPDATE bookings
    SET paid_amount = ?, balance_amount = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(newPaid, newBalance, newStatus, booking_id);

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (booking_id, action, details, performed_by)
    VALUES (?, 'PAYMENT_RECORDED', ?, ?)
  `).run(
    booking_id,
    `Payment of KES ${payAmount} received via ${payment_method.toUpperCase()} (${mpesa_code || 'Cash'}). Balance remaining: KES ${newBalance}`,
    recordedBy
  );

  res.status(201).json({
    message: 'Payment recorded successfully',
    paymentId: pInfo.lastInsertRowid,
    newPaid,
    newBalance,
    newStatus
  });
});

// GET Daily Reconciliation Report
router.get('/reconciliation', authenticateToken, (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];

  const totalPayments = db.prepare(`
    SELECT
      payment_method,
      COUNT(*) as count,
      SUM(amount) as total
    FROM payments
    WHERE created_at LIKE ?
    GROUP BY payment_method
  `).all(`${date}%`);

  const paymentsList = db.prepare(`
    SELECT
      p.*,
      b.booking_ref,
      c.name as customer_name
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    JOIN customers c ON b.customer_id = c.id
    WHERE p.created_at LIKE ?
    ORDER BY p.created_at DESC
  `).all(`${date}%`);

  let cashTotal = 0;
  let mpesaTotal = 0;
  let overallTotal = 0;

  for (const t of totalPayments) {
    if (t.payment_method === 'cash') cashTotal += t.total;
    if (t.payment_method.includes('mpesa')) mpesaTotal += t.total;
    overallTotal += t.total;
  }

  res.json({
    date,
    cashTotal,
    mpesaTotal,
    overallTotal,
    breakdown: totalPayments,
    payments: paymentsList
  });
});

module.exports = router;
