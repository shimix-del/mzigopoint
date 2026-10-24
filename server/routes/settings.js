const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken, requireOwner } = require('./auth');

// GET all settings (Public can access business info & pricing, admin gets all)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const settings = {};

  for (const r of rows) {
    try {
      settings[r.key] = JSON.parse(r.value);
    } catch (e) {
      settings[r.key] = r.value;
    }
  }

  res.json({ settings });
});

// POST update settings (Owner Only)
router.post('/', authenticateToken, requireOwner, (req, res) => {
  const { settings } = req.body;

  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: 'Settings object required' });
  }

  const upsert = db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = CURRENT_TIMESTAMP
  `);

  for (const [key, val] of Object.entries(settings)) {
    const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
    upsert.run(key, stringVal);
  }

  res.json({ message: 'Settings updated successfully' });
});

module.exports = router;
