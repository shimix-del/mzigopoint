const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('./auth');

// GET Dashboard KPI Summary
router.get('/summary', authenticateToken, (req, res) => {
  const isOwner = req.user && req.user.role === 'owner';
  const today = new Date().toISOString().split('T')[0];

  // Active bookings (in_storage + ready)
  const activeBookings = db.prepare(`
    SELECT COUNT(*) as count
    FROM bookings
    WHERE status IN ('in_storage', 'ready')
  `).get().count;

  // Expected pick-up today
  const pickupsToday = db.prepare(`
    SELECT COUNT(*) as count
    FROM bookings
    WHERE expected_pickup_date = ? AND status != 'collected' AND status != 'cancelled'
  `).get(today).count;

  // Overdue bookings
  const overdueBookings = db.prepare(`
    SELECT COUNT(*) as count
    FROM bookings
    WHERE status = 'overdue'
  `).get().count;

  // Pending payments (total KES owed across all non-cancelled bookings)
  const pendingPayments = db.prepare(`
    SELECT COALESCE(SUM(balance_amount), 0) as total
    FROM bookings
    WHERE status != 'cancelled' AND balance_amount > 0
  `).get().total;

  // Capacity
  const capacityRow = db.prepare("SELECT value FROM settings WHERE key = 'storage_capacity_total'").get();
  const totalCapacity = capacityRow ? parseInt(capacityRow.value) || 60 : 60;
  const capacityUsed = db.prepare(`
    SELECT COALESCE(SUM(quantity), 0) as used
    FROM bookings
    WHERE status IN ('in_storage', 'ready', 'overdue')
  `).get().used;

  // Revenue metrics (Only if owner)
  let revenue = {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    allTime: 0
  };

  if (isOwner) {
    // Today's revenue
    revenue.today = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE created_at LIKE ?
    `).get(`${today}%`).total;

    // This week (last 7 days)
    revenue.thisWeek = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE created_at >= date('now', '-7 days')
    `).get().total;

    // This month
    const thisMonthPrefix = today.slice(0, 7);
    revenue.thisMonth = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
      WHERE created_at LIKE ?
    `).get(`${thisMonthPrefix}%`).total;

    // All time
    revenue.allTime = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payments
    `).get().total;
  }

  res.json({
    activeBookings,
    pickupsToday,
    overdueBookings,
    pendingPayments,
    capacity: {
      used: capacityUsed,
      total: totalCapacity,
      available: Math.max(0, totalCapacity - capacityUsed),
      percentage: Math.min(100, Math.round((capacityUsed / totalCapacity) * 100))
    },
    revenue: isOwner ? revenue : null,
    isOwner
  });
});

// GET Charts & Analytics
router.get('/analytics', authenticateToken, (req, res) => {
  const isOwner = req.user && req.user.role === 'owner';

  // 1. Storage Reason Distribution
  const reasons = db.prepare(`
    SELECT storage_reason as label, COUNT(*) as count
    FROM bookings
    GROUP BY storage_reason
    ORDER BY count DESC
  `).all();

  // 2. Popular Item Sizes
  const sizes = db.prepare(`
    SELECT item_size as label, COUNT(*) as count
    FROM bookings
    GROUP BY item_size
    ORDER BY count DESC
  `).all();

  // 3. Payment Status Breakdown
  const paymentBreakdown = db.prepare(`
    SELECT payment_status as label, COUNT(*) as count, COALESCE(SUM(balance_amount), 0) as balance_total
    FROM bookings
    WHERE status != 'cancelled'
    GROUP BY payment_status
  `).all();

  // 4. Booking Status Breakdown
  const bookingStatuses = db.prepare(`
    SELECT status as label, COUNT(*) as count
    FROM bookings
    GROUP BY status
  `).all();

  // 5. Weekly Bookings
  const weeklyBookings = db.prepare(`
    SELECT strftime('%Y-%W', created_at) as week, COUNT(*) as bookings_count
    FROM bookings
    GROUP BY week
    ORDER BY week DESC
    LIMIT 6
  `).all();

  // 6. Revenue Trend (Owner only)
  let revenueTrend = [];
  if (isOwner) {
    revenueTrend = db.prepare(`
      SELECT date(created_at) as day, SUM(amount) as amount
      FROM payments
      WHERE created_at >= date('now', '-14 days')
      GROUP BY day
      ORDER BY day ASC
    `).all();
  }

  res.json({
    reasons,
    sizes,
    paymentBreakdown,
    bookingStatuses,
    weeklyBookings: weeklyBookings.reverse(),
    revenueTrend,
    isOwner
  });
});

module.exports = router;
