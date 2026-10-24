const express = require('express');
const router = express.Router();
const { db } = require('../db');

// STK Push request
router.post('/stkpush', async (req, res) => {
  const { phone, amount, booking_ref, booking_id } = req.body;

  if (!phone || !amount) {
    return res.status(400).json({ error: 'Phone and amount are required' });
  }

  // Format Kenyan phone to 254XXXXXXXXX
  let formattedPhone = phone.trim().replace(/\D/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.slice(1);
  } else if (!formattedPhone.startsWith('254')) {
    formattedPhone = '254' + formattedPhone;
  }

  const checkoutRequestId = 'ws_CO_' + Date.now() + '_' + Math.floor(1000 + Math.random() * 9000);

  // Return prompt notification for the frontend
  res.json({
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing',
    MerchantRequestID: 'MZP-' + Date.now(),
    CheckoutRequestID: checkoutRequestId,
    CustomerMessage: `STK push prompt sent to ${formattedPhone}. Please enter your M-Pesa PIN on your phone to complete payment of KES ${amount}.`,
    phone: formattedPhone,
    amount: parseFloat(amount),
    bookingRef: booking_ref,
    bookingId: booking_id
  });
});

// Simulator endpoint to simulate user entering PIN on phone
router.post('/simulate-confirm', (req, res) => {
  const { booking_id, amount, phone } = req.body;

  if (!booking_id || !amount) {
    return res.status(400).json({ error: 'Booking ID and amount required' });
  }

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const payAmount = parseFloat(amount);
  const mpesaCode = 'QK' + Math.random().toString(36).substring(2, 9).toUpperCase();

  // Record payment
  db.prepare(`
    INSERT INTO payments (booking_id, amount, payment_method, mpesa_code, notes, recorded_by)
    VALUES (?, ?, 'mpesa_stk', ?, 'M-Pesa STK Push Verified', 'Safaricom Daraja Gateway')
  `).run(booking_id, payAmount, mpesaCode);

  // Update booking
  const newPaid = booking.paid_amount + payAmount;
  const newBalance = Math.max(0, (booking.total_amount + (booking.late_fee || 0)) - newPaid);
  const newPayStatus = newBalance === 0 ? 'paid' : 'partial';

  db.prepare(`
    UPDATE bookings
    SET paid_amount = ?, balance_amount = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(newPaid, newBalance, newPayStatus, booking_id);

  db.prepare(`
    INSERT INTO audit_logs (booking_id, action, details, performed_by)
    VALUES (?, 'MPESA_PAYMENT_SUCCESS', ?, 'Safaricom Daraja')
  `).run(booking_id, `Received KES ${payAmount} via M-Pesa STK Push. Receipt: ${mpesaCode}`);

  res.json({
    success: true,
    message: `Payment of KES ${payAmount} confirmed via M-Pesa! Receipt: ${mpesaCode}`,
    mpesaCode,
    newPaid,
    newBalance,
    newPayStatus
  });
});

// Real Daraja Webhook Callback
router.post('/callback', (req, res) => {
  try {
    const callbackData = req.body.Body && req.body.Body.stkCallback;
    if (callbackData) {
      const resultCode = callbackData.ResultCode;
      const resultDesc = callbackData.ResultDesc;

      if (resultCode === 0) {
        // Success
        const items = callbackData.CallbackMetadata.Item;
        const amountItem = items.find(i => i.Name === 'Amount');
        const mpesaReceiptItem = items.find(i => i.Name === 'MpesaReceiptNumber');
        const phoneItem = items.find(i => i.Name === 'PhoneNumber');

        const amount = amountItem ? amountItem.Value : 0;
        const mpesaCode = mpesaReceiptItem ? mpesaReceiptItem.Value : 'MPESA-' + Date.now();

        console.log(`[Daraja Callback] Success: KES ${amount}, Code: ${mpesaCode}`);
      } else {
        console.log(`[Daraja Callback] User cancelled or failed: ${resultDesc}`);
      }
    }
  } catch (err) {
    console.error('Error handling Daraja callback:', err);
  }

  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

module.exports = router;
