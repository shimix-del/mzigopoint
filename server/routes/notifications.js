const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('./auth');

// Format phone for WhatsApp wa.me link (2547XXXXXXXX)
function formatPhoneForWhatsApp(phone) {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

// Generate templates
function generateMessageTemplate(type, booking) {
  const ref = booking.booking_ref;
  const name = booking.customer_name || 'Valued Customer';
  const pickup = booking.expected_pickup_date;
  const balance = booking.balance_amount || 0;

  switch (type) {
    case 'confirmation':
      return `Habari ${name}! Your booking at *Mzingo Point Mombasa* is confirmed.\n\n` +
        `🔖 *Ref:* ${ref}\n` +
        `📦 *Items:* ${booking.quantity}x ${booking.item_type} (${booking.item_size})\n` +
        `📅 *Expected Pick-up:* ${pickup}\n` +
        `💰 *Balance Due:* KES ${balance}\n\n` +
        `📍 *Location:* Moi Avenue, Near Mombasa Tusks, Mombasa.\n` +
        `Track your items anytime at: https://mzingopoint.co.ke/track?ref=${ref}\n` +
        `Asante sana for choosing Mzingo Point!`;

    case 'reminder_due':
      return `Habari ${name}! Friendly reminder from *Mzingo Point Mombasa* that your stored belongings (Ref: *${ref}*) are scheduled for collection *TODAY*.\n\n` +
        `⏰ Open daily 6:30 AM - 8:30 PM\n` +
        `💰 Balance due: KES ${balance}\n` +
        `Please present your booking ref & National ID at the counter.`;

    case 'overdue_alert':
      return `⚠️ *URGENT NOTICE from Mzingo Point Mombasa*\n\n` +
        `Habari ${name}, your stored belongings (*${ref}*) were due for pickup on ${pickup} and are now *OVERDUE*.\n` +
        `Current outstanding balance: *KES ${balance}* (including standard late fees).\n\n` +
        `Please collect your items urgently or contact us on +254 712 345 678 to extend your storage. Uncollected goods are subject to Kenya statutory disposal policies.`;

    case 'receipt':
      return `*RECEIPT - Mzingo Point Mombasa*\n\n` +
        `Thank you ${name}!\n` +
        `🔖 Ref: ${ref}\n` +
        `Total: KES ${booking.total_amount}\n` +
        `Paid: KES ${booking.paid_amount}\n` +
        `Balance: KES ${booking.balance_amount}\n` +
        `Safe storage guaranteed. See you soon!`;

    default:
      return `Message from Mzingo Point regarding booking ${ref}.`;
  }
}

// POST trigger / generate notification
router.post('/send', authenticateToken, (req, res) => {
  const { booking_id, type } = req.body; // type: confirmation, reminder_due, overdue_alert, receipt

  if (!booking_id || !type) {
    return res.status(400).json({ error: 'Booking ID and notification type are required' });
  }

  const booking = db.prepare(`
    SELECT
      b.*,
      c.name as customer_name,
      c.phone as customer_phone
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    WHERE b.id = ?
  `).get(booking_id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const messageText = generateMessageTemplate(type, booking);
  const waPhone = formatPhoneForWhatsApp(booking.customer_phone);
  const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(messageText)}`;

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (booking_id, action, details, performed_by)
    VALUES (?, 'NOTIFICATION_SENT', ?, ?)
  `).run(
    booking_id,
    `Notification sent (${type.toUpperCase()}) to ${booking.customer_phone}`,
    req.user ? req.user.name : 'System'
  );

  res.json({
    success: true,
    message: `Notification prepared for ${booking.customer_name}`,
    type,
    phone: booking.customer_phone,
    text: messageText,
    whatsAppLink: waLink,
    africasTalkingPayload: {
      to: booking.customer_phone,
      message: messageText,
      from: 'MZINGOPOINT'
    }
  });
});

module.exports = router;
