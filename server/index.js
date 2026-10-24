const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initDb } = require('./db');
const { seedDatabase } = require('./seed');

const { router: authRouter } = require('./routes/auth');
const bookingsRouter = require('./routes/bookings');
const paymentsRouter = require('./routes/payments');
const customersRouter = require('./routes/customers');
const settingsRouter = require('./routes/settings');
const reportsRouter = require('./routes/reports');
const mpesaRouter = require('./routes/mpesa');
const notificationsRouter = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/uploads', express.static(uploadDir));

// Initialize Database & Seed Sample Data
initDb();
seedDatabase();

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/mpesa', mpesaRouter);
app.use('/api/notifications', notificationsRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Mzingo Point Storage API',
    location: 'Mombasa, Kenya',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build in production
const clientDist = path.join(__dirname, '../client/dist');
const rootDist = path.join(__dirname, '..');
const staticDist = fs.existsSync(clientDist) ? clientDist : rootDist;

if (fs.existsSync(path.join(staticDist, 'index.html'))) {
  app.use(express.static(staticDist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(staticDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Mzingo Point backend server running at http://localhost:${PORT}`);
});
