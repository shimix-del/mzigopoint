const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'mzingo.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('owner', 'staff')) NOT NULL DEFAULT 'staff',
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      email TEXT,
      id_number TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_ref TEXT UNIQUE NOT NULL,
      customer_id INTEGER NOT NULL,
      item_type TEXT NOT NULL,
      item_size TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      description TEXT,
      is_fragile INTEGER DEFAULT 0,
      photo_url TEXT,
      dropoff_date DATE NOT NULL,
      dropoff_time TEXT,
      expected_pickup_date DATE NOT NULL,
      actual_pickup_date DATETIME,
      storage_reason TEXT,
      shelf_location TEXT,
      status TEXT CHECK(status IN ('booked', 'in_storage', 'ready', 'collected', 'overdue', 'cancelled')) NOT NULL DEFAULT 'booked',
      total_amount REAL NOT NULL,
      paid_amount REAL NOT NULL DEFAULT 0,
      balance_amount REAL NOT NULL,
      payment_status TEXT CHECK(payment_status IN ('pending', 'partial', 'paid')) NOT NULL DEFAULT 'pending',
      collector_name TEXT,
      collector_id TEXT,
      collector_signature TEXT,
      notes TEXT,
      late_fee REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT CHECK(payment_method IN ('mpesa_stk', 'mpesa_counter', 'cash', 'card')) NOT NULL,
      mpesa_code TEXT,
      notes TEXT,
      recorded_by TEXT DEFAULT 'System',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER,
      action TEXT NOT NULL,
      details TEXT,
      performed_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Database initialized successfully.');
}

module.exports = {
  db,
  initDb
};
