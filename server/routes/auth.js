const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'mzingo-point-mombasa-secret-key-2026';

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Middleware for Owner-only routes
function requireOwner(req, res, next) {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Owner privileges required' });
  }
}

// Login
router.post('/login', (req, res) => {
  const { identifier, password } = req.body; // email or phone

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email/phone and password are required' });
  }

  const user = db.prepare(`
    SELECT * FROM users
    WHERE (email = ? OR phone = ?) AND active = 1
  `).get(identifier.trim().toLowerCase(), identifier.trim());

  if (!user) {
    return res.status(401).json({ error: 'Invalid login credentials or account inactive' });
  }

  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

// Get Current User
router.get('/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, phone, role, active, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// List Users (Owner Only)
router.get('/users', authenticateToken, requireOwner, (req, res) => {
  const users = db.prepare('SELECT id, name, email, phone, role, active, created_at FROM users ORDER BY created_at DESC').all();
  res.json({ users });
});

// Create Staff/User (Owner Only)
router.post('/users', authenticateToken, requireOwner, (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const stmt = db.prepare(`
    INSERT INTO users (name, email, phone, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  const info = stmt.run(name, email.trim().toLowerCase(), phone || null, passwordHash, role || 'staff');
  res.status(201).json({
    message: 'User created successfully',
    userId: info.lastInsertRowid
  });
});

// Toggle User Active Status (Owner Only)
router.patch('/users/:id/status', authenticateToken, requireOwner, (req, res) => {
  const { id } = req.params;
  const { active, role } = req.body;

  const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Prevent disabling the main owner if they are the only owner
  if (active === 0 && user.role === 'owner') {
    const ownerCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'owner' AND active = 1").get().count;
    if (ownerCount <= 1) {
      return res.status(400).json({ error: 'Cannot deactivate the sole active owner account' });
    }
  }

  if (active !== undefined) {
    db.prepare('UPDATE users SET active = ? WHERE id = ?').run(active ? 1 : 0, id);
  }
  if (role) {
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
  }

  res.json({ message: 'User updated successfully' });
});

module.exports = {
  router,
  authenticateToken,
  requireOwner
};
