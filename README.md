# 🧳 Mzingo Point – Secure Storage Mombasa

**Leave your things. Go get your future.**  
*A complete mobile-first website and owner admin dashboard for secure belongings & luggage storage in Mombasa, Kenya.*

---

## 🌟 Key Features

### 🌐 1. Public Website & Booking Experience
- **Mobile-First & PWA Enabled:** Built for high performance on 3G/4G networks; installable as a progressive web app.
- **English & Swahili Toggle:** Complete translation support across all pages with a single click.
- **Mombasa Coastal Vibe:** Deep ocean blue, sandy cream, and coral/orange palette.
- **Interactive Storage Price Calculator:** Real-time quotation for Small, Medium, Large, and Extra Large luggage with auto-calculated duration discounts.
- **Multi-Step Booking Form:**
  1. Customer Contact & National ID verification
  2. Luggage sizing, description, fragile flags & photo uploads
  3. Dates & drop-off schedule
  4. M-Pesa STK Push or Pay on drop-off
  5. Instant QR code confirmation and printable slips
- **Live Booking Tracker:** Lookup by Reference (e.g. `MZP-2026-0001`) and Phone number; view days stored, shelf rack location, and extend storage online.
- **Floating WhatsApp Widget:** Click-to-chat directly with Mombasa desk attendants on every page.
- **About, Searchable FAQ, Contact, Terms, and Kenya Data Protection Act Privacy Pages.**

### 📊 2. Owner & Staff Admin Dashboard
- **Role-Based Access Control:**
  - **Owner (Ali Mwamburi):** Full revenue analytics, setting prices, capacity limits, and staff administration.
  - **Staff Attendant (Fatuma Juma):** Front-counter check-in, assigning shelf locations, logging cash/M-Pesa payments, and collection verification.
- **Overview Dashboard:** 6 KPI summary cards (Active Bookings, Today's Pickups, Overdue Alerts, Daily/Weekly/Monthly Revenue, Pending Balances, Capacity Gauge) and visual analytics charts.
- **Bookings Management Table:** Filter by status/payment/date, search, sort, and export to CSV/Excel.
- **Full Booking Drawer:** Customer National ID verification, shelf assignment editor, activity audit logs, and one-click WhatsApp notification triggers.
- **Digital Collection & Signature Pad:** Release items with collector ID recording and HTML5 canvas signature capture.
- **Thermal Receipt & Luggage Tag Generator:** Printable 80mm / A4 receipt with QR code and tear-off baggage tag for bag handles.
- **Payments & M-Pesa Center:** Transaction logs, outstanding balance reminders, and daily cash reconciliation.
- **Customers Directory:** Lifetime spend, repeat customer loyalty badges, and historical bookings.
- **Alerts & Unclaimed Goods:** Automatic late fee calculation (KES 100/day) and statutory 30-day disposal notices per Kenya law.
- **Settings & Price Editor:** Configure rates, capacity, late fees, and add staff members.

---

## 🚀 Quick Start Guide

### 1. Start the Server
```bash
npm start
```
The server starts at `http://localhost:5000`. It serves both the REST API and the React frontend client.

### 2. Log in to the Admin Dashboard
- Open: `http://localhost:5000/`
- Click **"Staff / Owner Login"** in the top navigation bar or footer.
- Use one of the pre-configured accounts:
  - **Owner:** `owner@mzingopoint.co.ke` | Password: `admin123`
  - **Staff Attendant:** `attendant@mzingopoint.co.ke` | Password: `staff123`
  *(Or use the 1-click Quick Demo login buttons on the sign-in screen)*

---

## 📁 Repository Structure
```
mzingo-point/
├── package.json               # Root scripts & dependencies
├── ADMIN_USER_GUIDE.md        # Comprehensive staff & owner operational manual
├── .env.example               # Environment variables template
├── server/
│   ├── index.js               # Express application server
│   ├── db.js                  # SQLite database (WAL mode & foreign keys)
│   ├── seed.js                # Seed script with 14 realistic Mombasa bookings
│   ├── mzingo.db              # SQLite database file
│   └── routes/
│       ├── auth.js            # JWT login & role management
│       ├── bookings.js        # Booking intake, tracking, QR & extension
│       ├── payments.js        # Transaction recording & daily reconciliation
│       ├── customers.js       # Customer directory & lifetime value
│       ├── settings.js        # Price rates & business config
│       ├── reports.js         # KPIs & analytics
│       ├── mpesa.js           # Safaricom Daraja STK Push & Simulator
│       └── notifications.js   # WhatsApp & SMS notification triggers
└── client/
    ├── index.html             # SEO meta, Google Fonts (Poppins & Inter) & PWA
    ├── vite.config.js         # Vite & Tailwind v4 build configuration
    ├── public/
    │   ├── manifest.json      # PWA application manifest
    │   └── sw.js              # Service worker for offline caching
    └── src/
        ├── index.css          # Tailwind CSS v4 & print styles
        ├── App.jsx            # Master routing & authentication provider
        ├── translations.js    # English & Swahili dictionaries
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── WhatsAppFloating.jsx
        │   ├── ReceiptPrint.jsx
        │   └── SignaturePad.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Pricing.jsx
        │   ├── BookStorage.jsx
        │   ├── TrackBooking.jsx
        │   ├── About.jsx
        │   ├── Faq.jsx
        │   ├── Contact.jsx
        │   ├── Terms.jsx
        │   └── Privacy.jsx
        └── admin/
            ├── AdminLayout.jsx
            ├── AdminLogin.jsx
            ├── DashboardOverview.jsx
            ├── BookingsManager.jsx
            ├── BookingDetailModal.jsx
            ├── ManualBookingModal.jsx
            ├── PaymentsManager.jsx
            ├── CustomersManager.jsx
            ├── AlertsManager.jsx
            ├── ReportsManager.jsx
            └── SettingsManager.jsx
```

---

## 🛡️ Compliance & Safety
- **Kenya Data Protection Act 2019:** Compliant data handling, restricted access to National IDs.
- **Kenya Disposal of Uncollected Goods Act (Cap. 38):** Statutory 30-day grace period and formal notification workflows.
