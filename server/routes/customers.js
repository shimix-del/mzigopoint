const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('./auth');

// GET all customers with aggregated statistics
router.get('/', authenticateToken, (req, res) => {
  const { search } = req.query;

  let query = `
    SELECT
      c.*,
      COUNT(b.id) as total_bookings,
      COALESCE(SUM(b.total_amount), 0) as total_spent,
      COALESCE(SUM(b.paid_amount), 0) as total_paid,
      COALESCE(SUM(b.balance_amount), 0) as total_balance,
      MAX(b.created_at) as last_booking_date,
      CASE WHEN COUNT(b.id) > 1 THEN 1 ELSE 0 END as is_repeat_customer
    FROM customers c
    LEFT JOIN bookings b ON c.id = b.customer_id
    WHERE 1=1
  `;

  const params = [];

  if (search) {
    query += ` AND (c.name LIKE ? OR c.phone LIKE ? OR c.email LIKE ? OR c.id_number LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }

  query += ` GROUP BY c.id ORDER BY total_bookings DESC, c.created_at DESC`;

  const customers = db.prepare(query).all(...params);
  res.json({ customers });
});

// GET single customer with booking history
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const customer = db.prepare(`
    SELECT
      c.*,
      COUNT(b.id) as total_bookings,
      COALESCE(SUM(b.total_amount), 0) as total_spent,
      CASE WHEN COUNT(b.id) > 1 THEN 1 ELSE 0 END as is_repeat_customer
    FROM customers c
    LEFT JOIN bookings b ON c.id = b.customer_id
    WHERE c.id = ?
    GROUP BY c.id
  `).get(id);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const bookings = db.prepare(`
    SELECT * FROM bookings
    WHERE customer_id = ?
    ORDER BY created_at DESC
  `).all(id);

  res.json({ customer, bookings });
});

module.exports = router;
