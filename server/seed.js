const bcrypt = require('bcryptjs');
const { db, initDb } = require('./db');

function seedDatabase() {
  initDb();

  // Check if users already seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    console.log('Database already has data. Skipping seed.');
    return;
  }

  console.log('Seeding initial data...');

  // 1. Seed Users (Owner & Staff)
  const salt = bcrypt.genSaltSync(10);
  const ownerHash = bcrypt.hashSync('admin123', salt);
  const staffHash = bcrypt.hashSync('staff123', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, phone, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run('Ali Mwamburi (Owner)', 'owner@mzingopoint.co.ke', '+254712345678', ownerHash, 'owner');
  insertUser.run('Fatuma Juma (Attendant)', 'attendant@mzingopoint.co.ke', '+254722998877', staffHash, 'staff');

  // 2. Seed Default Settings
  const defaultSettings = [
    { key: 'business_name', value: 'Mzingo Point Storage Ltd' },
    { key: 'address', value: 'Moi Avenue, Opp. Mombasa Tusks, Next to Central Post Office, Mombasa, Kenya' },
    { key: 'phone', value: '+254 712 345 678' },
    { key: 'whatsapp', value: '+254 712 345 678' },
    { key: 'email', value: 'info@mzingopoint.co.ke' },
    { key: 'opening_hours', value: '6:30 AM to 8:30 PM daily (Mon - Sun)' },
    { key: 'currency', value: 'KES' },
    { key: 'online_booking_enabled', value: 'true' },
    { key: 'storage_capacity_total', value: '65' },
    { key: 'late_fee_per_day', value: '100' },
    { key: 'unclaimed_grace_days', value: '30' },
    {
      key: 'pricing_rates',
      value: JSON.stringify({
        small: { label: 'Small', desc: 'Backpack, handbag, laptop bag', day: 150, week: 900, month: 3200 },
        medium: { label: 'Medium', desc: 'Carry-on suitcase, medium carton box', day: 250, week: 1500, month: 5500 },
        large: { label: 'Large', desc: 'Big suitcase, 90L duffel, trunk', day: 400, week: 2400, month: 8800 },
        xlarge: { label: 'Extra Large', desc: 'Mattress, furniture piece, appliances', day: 750, week: 4500, month: 16000 }
      })
    },
    {
      key: 'mpesa_config',
      value: JSON.stringify({
        mode: 'simulator', // 'simulator' or 'live'
        shortcode: '174379',
        till_number: '890123',
        paybill: '400200',
        account_name: 'MZINGO POINT'
      })
    }
  ];

  const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  for (const s of defaultSettings) {
    insertSetting.run(s.key, s.value);
  }

  // 3. Seed Realistic Mombasa Customers & Bookings
  const sampleCustomers = [
    { name: 'Kiprono Cheruiyot', phone: '+254719234567', email: 'kiprono.c@gmail.com', id_number: '31289456' },
    { name: 'Amina Nassir Bakari', phone: '+254721456789', email: 'amina.bakari@yahoo.com', id_number: '29871452' },
    { name: 'David Mutua Ndambuki', phone: '+254733678912', email: 'mutuadavid@gmail.com', id_number: '34512789' },
    { name: 'Zawadi Wanjiku', phone: '+254701239845', email: 'zawadi.w@outlook.com', id_number: '36984125' },
    { name: 'Brian Ochieng Otieno', phone: '+254790112233', email: 'brian.otieno@gmail.com', id_number: '32004512' },
    { name: 'Halima Hassan Omar', phone: '+254728990011', email: 'halima.omar@coastmail.com', id_number: '28475961' },
    { name: 'Peter Karanja Mwangi', phone: '+254714556677', email: 'pkaranja@karanjalaw.co.ke', id_number: '25419876' },
    { name: 'Grace Mumbua Mutiso', phone: '+254792341100', email: 'mumbuagrace@gmail.com', id_number: '33120485' },
    { name: 'Mohamed Said Al-Maamiry', phone: '+254722883344', email: 'moha.said@gmail.com', id_number: '27194852' },
    { name: 'Everlyn Moraa Nyaboke', phone: '+254705663322', email: 'emoraa@gmail.com', id_number: '35489120' },
    { name: 'Emmanuel Kipkorir', phone: '+254711447788', email: 'ekipkorir@eldoretpost.com', id_number: '30291847' },
    { name: 'Sophie Laurent', phone: '+254798334455', email: 'sophie.laurent@voyage.fr', id_number: 'PASS-FR-98214' },
    { name: 'Samson Odhiambo', phone: '+254743221199', email: 'samson.odhiambo@gmail.com', id_number: '31908472' },
    { name: 'Rehema Binti Athman', phone: '+254720993311', email: 'rehema.athman@gmail.com', id_number: '37129845' }
  ];

  const insertCustomer = db.prepare(`
    INSERT INTO customers (name, phone, email, id_number)
    VALUES (?, ?, ?, ?)
  `);

  const customerIds = {};
  for (const c of sampleCustomers) {
    const info = insertCustomer.run(c.name, c.phone, c.email, c.id_number);
    customerIds[c.phone] = info.lastInsertRowid;
  }

  // Sample Bookings across diverse Mombasa use-cases
  const sampleBookings = [
    {
      ref: 'MZP-2026-0001',
      phone: '+254719234567',
      item_type: 'Travel Suitcase',
      item_size: 'large',
      qty: 1,
      desc: 'Navy Blue Samsonite hard-shell suitcase with TSA padlock. Job seeker interviewing at Kenya Ports Authority (KPA).',
      fragile: 0,
      dropoff: '2026-10-22',
      dropoff_time: '08:30 AM',
      pickup: '2026-10-25',
      actual_pickup: null,
      reason: 'Interview / Exams',
      shelf: 'Shelf A-03',
      status: 'in_storage',
      total: 1200,
      paid: 1200,
      balance: 0,
      pay_status: 'paid',
      payment_method: 'mpesa_stk',
      mpesa_code: 'QKH781299A',
      notes: 'Came via Modern Coast bus from Eldoret. Leaving for KPA interview.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0002',
      phone: '+254721456789',
      item_type: 'Cartons & Bag',
      item_size: 'medium',
      qty: 3,
      desc: '2 medium brown cardboard boxes taped securely + 1 purple duffel bag. Relocating to Nyali.',
      fragile: 1,
      dropoff: '2026-10-23',
      dropoff_time: '10:00 AM',
      pickup: '2026-10-26',
      actual_pickup: null,
      reason: 'House hunting',
      shelf: 'Shelf B-01',
      status: 'in_storage',
      total: 2250,
      paid: 1000,
      balance: 1250,
      pay_status: 'partial',
      payment_method: 'mpesa_counter',
      mpesa_code: 'QKJ918204B',
      notes: 'Paid 1,000 KES deposit on dropoff. Balance 1,250 due on collection.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0003',
      phone: '+254733678912',
      item_type: 'Tourist Luggage',
      item_size: 'medium',
      qty: 2,
      desc: '1 silver wheelie suitcase and 1 black daypack. Sightseeing Old Town & Fort Jesus before evening SGR train.',
      fragile: 0,
      dropoff: '2026-10-24',
      dropoff_time: '07:15 AM',
      pickup: '2026-10-24',
      actual_pickup: null,
      reason: 'Travelling',
      shelf: 'Shelf A-01',
      status: 'ready',
      total: 500,
      paid: 500,
      balance: 0,
      pay_status: 'paid',
      payment_method: 'mpesa_stk',
      mpesa_code: 'QKL448910C',
      notes: 'Customer notified items are ready for rapid dispatch.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0004',
      phone: '+254701239845',
      item_type: 'Student Mattress & Trunk',
      item_size: 'xlarge',
      qty: 2,
      desc: '4x6 high-density mattress wrapped in waterproof plastic + student metal trunk. TUM semester break.',
      fragile: 0,
      dropoff: '2026-10-20',
      dropoff_time: '11:45 AM',
      pickup: '2026-11-03',
      actual_pickup: null,
      reason: 'Students',
      shelf: 'Bay C-02',
      status: 'in_storage',
      total: 10500,
      paid: 10500,
      balance: 0,
      pay_status: 'paid',
      payment_method: 'mpesa_stk',
      mpesa_code: 'QKB102934D',
      notes: 'Technical University of Mombasa student storing items during recess.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0005',
      phone: '+254790112233',
      item_type: 'Executive Briefcase',
      item_size: 'small',
      qty: 1,
      desc: 'Black leather laptop bag with Dell XPS inside. Fragile electronics.',
      fragile: 1,
      dropoff: '2026-10-24',
      dropoff_time: '09:00 AM',
      pickup: '2026-10-24',
      actual_pickup: null,
      reason: 'Interview / Exams',
      shelf: 'Locker S-04',
      status: 'in_storage',
      total: 150,
      paid: 150,
      balance: 0,
      pay_status: 'paid',
      payment_method: 'cash',
      mpesa_code: null,
      notes: 'Walk-in customer paid cash at counter. Left for court appointment.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0006',
      phone: '+254728990011',
      item_type: 'Trade Show Display Boxes',
      item_size: 'xlarge',
      qty: 3,
      desc: '3 large heavy exhibition cartons with banners and product samples for Mombasa Show.',
      fragile: 1,
      dropoff: '2026-10-21',
      dropoff_time: '14:00 PM',
      pickup: '2026-10-27',
      actual_pickup: null,
      reason: 'Travelling',
      shelf: 'Bay C-05',
      status: 'in_storage',
      total: 13500,
      paid: 13500,
      balance: 0,
      pay_status: 'paid',
      payment_method: 'mpesa_stk',
      mpesa_code: 'QKP901235F',
      notes: 'Commercial trade display goods. Handled with care.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0007',
      phone: '+254714556677',
      item_type: 'Overdue Suitcase',
      item_size: 'large',
      qty: 1,
      desc: 'Maroon heavy VIP trolley bag. Customer was scheduled to pick up 2 days ago.',
      fragile: 0,
      dropoff: '2026-10-18',
      dropoff_time: '10:00 AM',
      pickup: '2026-10-22', // Was due 2 days ago!
      actual_pickup: null,
      reason: 'Travelling',
      shelf: 'Shelf A-07',
      status: 'overdue',
      total: 1600, // 4 days * 400
      paid: 1000,
      balance: 800, // 600 balance + 200 late fee (2 days * 100)
      pay_status: 'partial',
      payment_method: 'mpesa_counter',
      mpesa_code: 'QKZ301928G',
      notes: 'Automated late fee applied: 2 overdue days @ 100 KES/day. WhatsApp reminder sent.',
      late_fee: 200
    },
    {
      ref: 'MZP-2026-0008',
      phone: '+254792341100',
      item_type: 'Household Furniture & Box',
      item_size: 'xlarge',
      qty: 2,
      desc: 'Disassembled wooden coffee table and 1 large plastic crate of kitchenware.',
      fragile: 1,
      dropoff: '2026-10-15',
      dropoff_time: '12:00 PM',
      pickup: '2026-10-23',
      actual_pickup: '2026-10-23 15:40:00',
      reason: 'Moving',
      shelf: 'Bay C-01',
      status: 'collected',
      total: 6000,
      paid: 6000,
      balance: 0,
      pay_status: 'paid',
      payment_method: 'mpesa_stk',
      mpesa_code: 'QKG551290H',
      notes: 'Collected successfully by Grace Mutiso. Verified National ID.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0009',
      phone: '+254722883344',
      item_type: 'Backpack & Duffel',
      item_size: 'small',
      qty: 2,
      desc: 'Green camping rucksack and small sports gym bag.',
      fragile: 0,
      dropoff: '2026-10-24',
      dropoff_time: '14:30 PM',
      pickup: '2026-10-25',
      actual_pickup: null,
      reason: 'House hunting',
      shelf: 'Shelf A-05',
      status: 'in_storage',
      total: 300,
      paid: 300,
      balance: 0,
      pay_status: 'paid',
      payment_method: 'mpesa_stk',
      mpesa_code: 'QKT119934J',
      notes: 'House hunting around Kizingo & Ganjoni.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0010',
      phone: '+254705663322',
      item_type: 'Online Booking (Pending Drop-off)',
      item_size: 'medium',
      qty: 1,
      desc: 'Red American Tourister trolley bag. Travelling from Kisumu via morning flight.',
      fragile: 0,
      dropoff: '2026-10-25',
      dropoff_time: '09:00 AM',
      pickup: '2026-10-27',
      actual_pickup: null,
      reason: 'Interview / Exams',
      shelf: null,
      status: 'booked',
      total: 500,
      paid: 0,
      balance: 500,
      pay_status: 'pending',
      payment_method: 'cash',
      mpesa_code: null,
      notes: 'Selected pay on drop-off at counter.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0011',
      phone: '+254711447788',
      item_type: 'Suitcase & Carton',
      item_size: 'large',
      qty: 2,
      desc: '1 hard trolley case + 1 carton sealed with yellow tape. Moving house to Bamburi.',
      fragile: 0,
      dropoff: '2026-10-19',
      dropoff_time: '13:00 PM',
      pickup: '2026-10-24',
      actual_pickup: null,
      reason: 'Moving',
      shelf: 'Shelf B-04',
      status: 'ready',
      total: 4000,
      paid: 4000,
      balance: 0,
      pay_status: 'paid',
      payment_method: 'mpesa_stk',
      mpesa_code: 'QKW671234K',
      notes: 'Client called to confirm pickup this evening.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0012',
      phone: '+254798334455',
      item_type: 'French Tourist Luggage',
      item_size: 'large',
      qty: 2,
      desc: '2 Delsey rolling suitcases. French tourist doing Mombasa historical walk then transfer to Diani.',
      fragile: 0,
      dropoff: '2026-10-24',
      dropoff_time: '08:00 AM',
      pickup: '2026-10-24',
      actual_pickup: null,
      reason: 'Travelling',
      shelf: 'Shelf A-02',
      status: 'in_storage',
      total: 800,
      paid: 800,
      balance: 0,
      pay_status: 'paid',
      payment_method: 'mpesa_stk',
      mpesa_code: 'QKX881920L',
      notes: 'Requested English & French assistance. Paid online seamlessly.',
      late_fee: 0
    },
    {
      ref: 'MZP-2026-0013',
      phone: '+254743221199',
      item_type: 'Unclaimed Notice Storage >30 Days',
      item_size: 'large',
      qty: 1,
      desc: 'Old leather trunk left since September. Customer unreachable on phone.',
      fragile: 0,
      dropoff: '2026-09-10',
      dropoff_time: '11:00 AM',
      pickup: '2026-09-17',
      actual_pickup: null,
      reason: 'Other',
      shelf: 'Bay C-09',
      status: 'overdue',
      total: 2800,
      paid: 1000,
      balance: 4800, // 1800 balance + 3000 late fee
      pay_status: 'partial',
      payment_method: 'cash',
      mpesa_code: null,
      notes: 'CRITICAL ALERT: Stored > 30 days. Formal 14-day disposal notice sent via registered SMS/Letter per Kenya Disposal of Uncollected Goods Act.',
      late_fee: 3000
    },
    {
      ref: 'MZP-2026-0014',
      phone: '+254720993311',
      item_type: 'Handbag & Document Folder',
      item_size: 'small',
      qty: 1,
      desc: 'Brown synthetic handbag and sealed legal document folder.',
      fragile: 1,
      dropoff: '2026-10-24',
      dropoff_time: '15:10 PM',
      pickup: '2026-10-24',
      actual_pickup: null,
      reason: 'Interview / Exams',
      shelf: 'Locker S-02',
      status: 'in_storage',
      total: 150,
      paid: 150,
      balance: 0,
      pay_status: 'paid',
      payment_method: 'cash',
      mpesa_code: null,
      notes: 'Walk-in attendant registered.',
      late_fee: 0
    }
  ];

  const insertBooking = db.prepare(`
    INSERT INTO bookings (
      booking_ref, customer_id, item_type, item_size, quantity, description,
      is_fragile, dropoff_date, dropoff_time, expected_pickup_date, actual_pickup_date,
      storage_reason, shelf_location, status, total_amount, paid_amount,
      balance_amount, payment_status, notes, late_fee
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  const insertPayment = db.prepare(`
    INSERT INTO payments (booking_id, amount, payment_method, mpesa_code, notes, recorded_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (booking_id, action, details, performed_by, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const b of sampleBookings) {
    const custId = customerIds[b.phone];
    const bInfo = insertBooking.run(
      b.ref,
      custId,
      b.item_type,
      b.item_size,
      b.qty,
      b.desc,
      b.fragile,
      b.dropoff,
      b.dropoff_time,
      b.pickup,
      b.actual_pickup,
      b.reason,
      b.shelf,
      b.status,
      b.total,
      b.paid,
      b.balance,
      b.pay_status,
      b.notes,
      b.late_fee
    );

    const bookingId = bInfo.lastInsertRowid;

    if (b.paid > 0) {
      insertPayment.run(
        bookingId,
        b.paid,
        b.payment_method,
        b.mpesa_code || 'CASH-PAY',
        `Payment of KES ${b.paid} recorded`,
        b.payment_method === 'cash' ? 'Fatuma Juma' : 'M-Pesa Gateway',
        `${b.dropoff} 10:00:00`
      );
    }

    insertAudit.run(
      bookingId,
      'BOOKING_CREATED',
      `Booking ${b.ref} registered with status ${b.status}`,
      'System',
      `${b.dropoff} 08:00:00`
    );

    if (b.shelf) {
      insertAudit.run(
        bookingId,
        'SHELF_ASSIGNED',
        `Assigned storage location ${b.shelf}`,
        'Fatuma Juma',
        `${b.dropoff} 09:30:00`
      );
    }

    if (b.status === 'collected') {
      insertAudit.run(
        bookingId,
        'ITEMS_COLLECTED',
        'Items inspected and collected by owner. Verified ID.',
        'Fatuma Juma',
        b.actual_pickup
      );
    }
  }

  console.log(`Seeded ${sampleCustomers.length} customers and ${sampleBookings.length} realistic bookings successfully!`);
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
