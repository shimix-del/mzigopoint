import QRCode from 'qrcode';

// Initial seed data for static standalone / GitHub Pages environment
const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Kiprono Cheruiyot', phone: '+254719234567', email: 'kiprono.c@gmail.com', id_number: '31289456' },
  { id: 2, name: 'Amina Nassir Bakari', phone: '+254721456789', email: 'amina.bakari@yahoo.com', id_number: '29871452' },
  { id: 3, name: 'David Mutua Ndambuki', phone: '+254733678912', email: 'mutuadavid@gmail.com', id_number: '34512789' },
  { id: 4, name: 'Zawadi Wanjiku', phone: '+254701239845', email: 'zawadi.w@outlook.com', id_number: '36984125' },
  { id: 5, name: 'Brian Ochieng Otieno', phone: '+254790112233', email: 'brian.otieno@gmail.com', id_number: '32004512' },
  { id: 6, name: 'Halima Hassan Omar', phone: '+254728990011', email: 'halima.omar@coastmail.com', id_number: '28475961' },
  { id: 7, name: 'Peter Karanja Mwangi', phone: '+254714556677', email: 'pkaranja@karanjalaw.co.ke', id_number: '25419876' },
  { id: 8, name: 'Grace Mumbua Mutiso', phone: '+254792341100', email: 'mumbuagrace@gmail.com', id_number: '33120485' },
  { id: 9, name: 'Mohamed Said Al-Maamiry', phone: '+254722883344', email: 'moha.said@gmail.com', id_number: '27194852' },
  { id: 10, name: 'Everlyn Moraa Nyaboke', phone: '+254705663322', email: 'emoraa@gmail.com', id_number: '35489120' },
  { id: 11, name: 'Emmanuel Kipkorir', phone: '+254711447788', email: 'ekipkorir@eldoretpost.com', id_number: '30291847' },
  { id: 12, name: 'Sophie Laurent', phone: '+254798334455', email: 'sophie.laurent@voyage.fr', id_number: 'PASS-FR-98214' },
  { id: 13, name: 'Samson Odhiambo', phone: '+254743221199', email: 'samson.odhiambo@gmail.com', id_number: '31908472' },
  { id: 14, name: 'Rehema Binti Athman', phone: '+254720993311', email: 'rehema.athman@gmail.com', id_number: '37129845' }
];

const INITIAL_BOOKINGS = [
  {
    id: 1,
    booking_ref: 'MZP-2026-0001',
    customer_name: 'Kiprono Cheruiyot',
    customer_phone: '+254719234567',
    customer_id_number: '31289456',
    customer_email: 'kiprono.c@gmail.com',
    item_type: 'Travel Suitcase',
    item_size: 'large',
    quantity: 1,
    description: 'Navy Blue Samsonite hard-shell suitcase with TSA padlock. Job seeker interviewing at KPA.',
    is_fragile: 0,
    dropoff_date: '2026-10-22',
    dropoff_time: '08:30 AM',
    expected_pickup_date: '2026-10-25',
    storage_reason: 'Interview / Exams',
    shelf_location: 'Shelf A-03',
    status: 'in_storage',
    total_amount: 1200,
    paid_amount: 1200,
    balance_amount: 0,
    payment_status: 'paid',
    late_fee: 0,
    notes: 'Came via Modern Coast bus from Eldoret. Leaving for KPA interview.',
    created_at: '2026-10-22 08:30:00',
    days_stored_calculated: 2
  },
  {
    id: 2,
    booking_ref: 'MZP-2026-0002',
    customer_name: 'Amina Nassir Bakari',
    customer_phone: '+254721456789',
    customer_id_number: '29871452',
    customer_email: 'amina.bakari@yahoo.com',
    item_type: 'Cartons & Bag',
    item_size: 'medium',
    quantity: 3,
    description: '2 medium brown cardboard boxes taped securely + 1 purple duffel bag. Relocating to Nyali.',
    is_fragile: 1,
    dropoff_date: '2026-10-23',
    dropoff_time: '10:00 AM',
    expected_pickup_date: '2026-10-26',
    storage_reason: 'House hunting',
    shelf_location: 'Shelf B-01',
    status: 'in_storage',
    total_amount: 2250,
    paid_amount: 1000,
    balance_amount: 1250,
    payment_status: 'partial',
    late_fee: 0,
    notes: 'Paid 1,000 KES deposit on dropoff. Balance 1,250 due on collection.',
    created_at: '2026-10-23 10:00:00',
    days_stored_calculated: 1
  },
  {
    id: 3,
    booking_ref: 'MZP-2026-0003',
    customer_name: 'David Mutua Ndambuki',
    customer_phone: '+254733678912',
    customer_id_number: '34512789',
    customer_email: 'mutuadavid@gmail.com',
    item_type: 'Tourist Luggage',
    item_size: 'medium',
    quantity: 2,
    description: '1 silver wheelie suitcase and 1 black daypack. Sightseeing Old Town & Fort Jesus before evening SGR train.',
    is_fragile: 0,
    dropoff_date: '2026-10-24',
    dropoff_time: '07:15 AM',
    expected_pickup_date: '2026-10-24',
    storage_reason: 'Travelling',
    shelf_location: 'Shelf A-01',
    status: 'ready',
    total_amount: 500,
    paid_amount: 500,
    balance_amount: 0,
    payment_status: 'paid',
    late_fee: 0,
    notes: 'Customer notified items are ready for rapid dispatch.',
    created_at: '2026-10-24 07:15:00',
    days_stored_calculated: 1
  },
  {
    id: 4,
    booking_ref: 'MZP-2026-0004',
    customer_name: 'Zawadi Wanjiku',
    customer_phone: '+254701239845',
    customer_id_number: '36984125',
    item_type: 'Student Mattress & Trunk',
    item_size: 'xlarge',
    quantity: 2,
    description: '4x6 high-density mattress + metal trunk. TUM semester recess.',
    is_fragile: 0,
    dropoff_date: '2026-10-20',
    dropoff_time: '11:45 AM',
    expected_pickup_date: '2026-11-03',
    storage_reason: 'Students',
    shelf_location: 'Bay C-02',
    status: 'in_storage',
    total_amount: 10500,
    paid_amount: 10500,
    balance_amount: 0,
    payment_status: 'paid',
    late_fee: 0,
    notes: 'Technical University of Mombasa student storing items during recess.',
    created_at: '2026-10-20 11:45:00',
    days_stored_calculated: 4
  },
  {
    id: 5,
    booking_ref: 'MZP-2026-0007',
    customer_name: 'Peter Karanja Mwangi',
    customer_phone: '+254714556677',
    customer_id_number: '25419876',
    item_type: 'Overdue Suitcase',
    item_size: 'large',
    quantity: 1,
    description: 'Maroon heavy VIP trolley bag. Was scheduled to pick up 2 days ago.',
    is_fragile: 0,
    dropoff_date: '2026-10-18',
    dropoff_time: '10:00 AM',
    expected_pickup_date: '2026-10-22',
    storage_reason: 'Travelling',
    shelf_location: 'Shelf A-07',
    status: 'overdue',
    total_amount: 1600,
    paid_amount: 1000,
    balance_amount: 800,
    payment_status: 'partial',
    late_fee: 200,
    notes: 'Automated late fee applied: 2 overdue days @ 100 KES/day.',
    created_at: '2026-10-18 10:00:00',
    days_stored_calculated: 6
  },
  {
    id: 6,
    booking_ref: 'MZP-2026-0008',
    customer_name: 'Grace Mumbua Mutiso',
    customer_phone: '+254792341100',
    customer_id_number: '33120485',
    item_type: 'Household Furniture & Box',
    item_size: 'xlarge',
    quantity: 2,
    description: 'Disassembled wooden coffee table and 1 large plastic crate of kitchenware.',
    is_fragile: 1,
    dropoff_date: '2026-10-15',
    dropoff_time: '12:00 PM',
    expected_pickup_date: '2026-10-23',
    actual_pickup_date: '2026-10-23 15:40:00',
    storage_reason: 'Moving',
    shelf_location: 'Bay C-01',
    status: 'collected',
    total_amount: 6000,
    paid_amount: 6000,
    balance_amount: 0,
    payment_status: 'paid',
    late_fee: 0,
    notes: 'Collected successfully by Grace Mutiso. Verified National ID.',
    created_at: '2026-10-15 12:00:00',
    days_stored_calculated: 8
  },
  {
    id: 7,
    booking_ref: 'MZP-2026-0013',
    customer_name: 'Samson Odhiambo',
    customer_phone: '+254743221199',
    customer_id_number: '31908472',
    item_type: 'Unclaimed Notice Storage >30 Days',
    item_size: 'large',
    quantity: 1,
    description: 'Old leather trunk left since September. Customer unreachable on phone.',
    is_fragile: 0,
    dropoff_date: '2026-09-10',
    dropoff_time: '11:00 AM',
    expected_pickup_date: '2026-09-17',
    storage_reason: 'Other',
    shelf_location: 'Bay C-09',
    status: 'overdue',
    total_amount: 2800,
    paid_amount: 1000,
    balance_amount: 4800,
    payment_status: 'partial',
    late_fee: 3000,
    notes: 'CRITICAL ALERT: Stored > 30 days. Formal 14-day disposal notice sent via registered SMS/Letter per Kenya Disposal of Uncollected Goods Act.',
    created_at: '2026-09-10 11:00:00',
    days_stored_calculated: 44
  }
];

const INITIAL_PAYMENTS = [
  { id: 1, booking_id: 1, booking_ref: 'MZP-2026-0001', customer_name: 'Kiprono Cheruiyot', customer_phone: '+254719234567', amount: 1200, payment_method: 'mpesa_stk', mpesa_code: 'QKH781299A', recorded_by: 'M-Pesa Gateway', created_at: '2026-10-22 08:35:00' },
  { id: 2, booking_id: 2, booking_ref: 'MZP-2026-0002', customer_name: 'Amina Nassir Bakari', customer_phone: '+254721456789', amount: 1000, payment_method: 'mpesa_counter', mpesa_code: 'QKJ918204B', recorded_by: 'Fatuma Juma', created_at: '2026-10-23 10:05:00' },
  { id: 3, booking_id: 3, booking_ref: 'MZP-2026-0003', customer_name: 'David Mutua Ndambuki', customer_phone: '+254733678912', amount: 500, payment_method: 'mpesa_stk', mpesa_code: 'QKL448910C', recorded_by: 'M-Pesa Gateway', created_at: '2026-10-24 07:20:00' },
  { id: 4, booking_id: 4, booking_ref: 'MZP-2026-0004', customer_name: 'Zawadi Wanjiku', customer_phone: '+254701239845', amount: 10500, payment_method: 'mpesa_stk', mpesa_code: 'QKB102934D', recorded_by: 'M-Pesa Gateway', created_at: '2026-10-20 11:50:00' },
  { id: 5, booking_id: 6, booking_ref: 'MZP-2026-0008', customer_name: 'Grace Mumbua Mutiso', customer_phone: '+254792341100', amount: 6000, payment_method: 'mpesa_stk', mpesa_code: 'QKG551290H', recorded_by: 'M-Pesa Gateway', created_at: '2026-10-15 12:05:00' }
];

export function initLocalStorage() {
  if (!localStorage.getItem('mzingo_gh_bookings')) {
    localStorage.setItem('mzingo_gh_bookings', JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem('mzingo_gh_customers')) {
    localStorage.setItem('mzingo_gh_customers', JSON.stringify(INITIAL_CUSTOMERS));
  }
  if (!localStorage.getItem('mzingo_gh_payments')) {
    localStorage.setItem('mzingo_gh_payments', JSON.stringify(INITIAL_PAYMENTS));
  }
}

// Client API mock for GitHub Pages
export async function handleClientMockApi(url, options = {}) {
  initLocalStorage();
  const path = url.split('?')[0].replace('/api/', '');
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // 1. Auth Login
  if (path === 'auth/login' && method === 'POST') {
    const { identifier, password } = body;
    if (identifier.toLowerCase().includes('owner') || identifier.toLowerCase().includes('admin')) {
      const user = { id: 1, name: 'Ali Mwamburi (Owner)', email: 'owner@mzingopoint.co.ke', role: 'owner' };
      return { token: 'mock-owner-token-ghpages', user };
    } else {
      const user = { id: 2, name: 'Fatuma Juma (Attendant)', email: 'attendant@mzingopoint.co.ke', role: 'staff' };
      return { token: 'mock-staff-token-ghpages', user };
    }
  }

  // 2. Reports Summary
  if (path === 'reports/summary') {
    const bookings = JSON.parse(localStorage.getItem('mzingo_gh_bookings') || '[]');
    const payments = JSON.parse(localStorage.getItem('mzingo_gh_payments') || '[]');
    const active = bookings.filter(b => b.status === 'in_storage' || b.status === 'ready').length;
    const overdue = bookings.filter(b => b.status === 'overdue').length;
    const pendingTotal = bookings.filter(b => b.status !== 'cancelled').reduce((acc, b) => acc + (b.balance_amount || 0), 0);
    const capacityTotal = 65;
    const capacityUsed = bookings.filter(b => b.status === 'in_storage' || b.status === 'ready' || b.status === 'overdue').reduce((acc, b) => acc + (b.quantity || 1), 0);
    const totalRev = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

    return {
      activeBookings: active,
      pickupsToday: 3,
      overdueBookings: overdue,
      pendingPayments: pendingTotal,
      capacity: {
        used: capacityUsed,
        total: capacityTotal,
        available: Math.max(0, capacityTotal - capacityUsed),
        percentage: Math.min(100, Math.round((capacityUsed / capacityTotal) * 100))
      },
      revenue: {
        today: 2500,
        thisWeek: 18500,
        thisMonth: totalRev,
        allTime: totalRev + 12000
      },
      isOwner: true
    };
  }

  // 3. Reports Analytics
  if (path === 'reports/analytics') {
    return {
      reasons: [
        { label: 'Travelling', count: 6 },
        { label: 'Interview / Exams', count: 3 },
        { label: 'House hunting', count: 3 },
        { label: 'Students', count: 2 },
        { label: 'Moving', count: 1 }
      ],
      sizes: [
        { label: 'medium', count: 6 },
        { label: 'large', count: 4 },
        { label: 'small', count: 3 },
        { label: 'xlarge', count: 2 }
      ],
      paymentBreakdown: [
        { label: 'paid', count: 9, balance_total: 0 },
        { label: 'partial', count: 4, balance_total: 4850 },
        { label: 'pending', count: 1, balance_total: 500 }
      ],
      bookingStatuses: [
        { label: 'in_storage', count: 5 },
        { label: 'ready', count: 2 },
        { label: 'overdue', count: 2 },
        { label: 'collected', count: 4 },
        { label: 'booked', count: 1 }
      ],
      revenueTrend: [
        { day: '2026-10-18', amount: 3200 },
        { day: '2026-10-19', amount: 4500 },
        { day: '2026-10-20', amount: 10500 },
        { day: '2026-10-21', amount: 5000 },
        { day: '2026-10-22', amount: 4200 },
        { day: '2026-10-23', amount: 6800 },
        { day: '2026-10-24', amount: 2500 }
      ],
      isOwner: true
    };
  }

  // 4. Bookings List
  if (path === 'bookings' && method === 'GET') {
    const bookings = JSON.parse(localStorage.getItem('mzingo_gh_bookings') || '[]');
    return { bookings };
  }

  // 5. Track Booking
  if (path === 'bookings/track' && method === 'POST') {
    const bookings = JSON.parse(localStorage.getItem('mzingo_gh_bookings') || '[]');
    const found = bookings.find(b =>
      b.booking_ref.toUpperCase() === body.reference?.toUpperCase() ||
      b.customer_phone.includes(body.phone?.replace(/\D/g, '').slice(-9))
    );
    if (!found) {
      throw new Error('No booking found matching that reference and phone number.');
    }
    let qr = '';
    try { qr = await QRCode.toDataURL(found.booking_ref); } catch(e){}
    return { booking: found, qrCodeDataUrl: qr };
  }

  // 6. Create Booking
  if (path === 'bookings' && method === 'POST') {
    const bookings = JSON.parse(localStorage.getItem('mzingo_gh_bookings') || '[]');
    const year = new Date().getFullYear();
    const ref = `MZP-${year}-${String(bookings.length + 1).padStart(4, '0')}`;
    const dDrop = new Date(body.dropoff_date || new Date());
    const dPick = new Date(body.expected_pickup_date || new Date());
    const days = Math.max(1, Math.ceil((dPick - dDrop) / (1000 * 60 * 60 * 24)));
    const rates = { small: 150, medium: 250, large: 400, xlarge: 750 };
    const total = (rates[body.item_size] || 250) * (body.quantity || 1) * days;
    const paid = body.payment_choice === 'mpesa_stk' ? (body.payment_type === 'deposit' ? Math.ceil(total * 0.5) : total) : 0;
    const balance = Math.max(0, total - paid);

    const newB = {
      id: Date.now(),
      booking_ref: ref,
      customer_name: body.name,
      customer_phone: body.phone,
      customer_id_number: body.id_number,
      customer_email: body.email,
      item_type: body.item_type || 'Luggage',
      item_size: body.item_size || 'medium',
      quantity: body.quantity || 1,
      description: body.description || '',
      is_fragile: body.is_fragile ? 1 : 0,
      dropoff_date: body.dropoff_date,
      dropoff_time: body.dropoff_time || '10:00 AM',
      expected_pickup_date: body.expected_pickup_date,
      storage_reason: body.storage_reason || 'Travelling',
      shelf_location: body.shelf_location || (body.is_walkin ? 'Shelf A-05' : null),
      status: body.is_walkin ? 'in_storage' : 'booked',
      total_amount: total,
      paid_amount: paid,
      balance_amount: balance,
      payment_status: balance === 0 ? 'paid' : (paid > 0 ? 'partial' : 'pending'),
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      days_stored_calculated: 1
    };

    bookings.unshift(newB);
    localStorage.setItem('mzingo_gh_bookings', JSON.stringify(bookings));

    let qr = '';
    try { qr = await QRCode.toDataURL(ref); } catch(e){}

    return {
      message: 'Booking successfully created',
      bookingId: newB.id,
      bookingRef: ref,
      totalAmount: total,
      paidAmount: paid,
      balanceAmount: balance,
      paymentStatus: newB.payment_status,
      qrCodeDataUrl: qr
    };
  }

  // 7. Booking Details
  if (path.startsWith('bookings/') && method === 'GET') {
    const id = path.replace('bookings/', '');
    const bookings = JSON.parse(localStorage.getItem('mzingo_gh_bookings') || '[]');
    const found = bookings.find(b => String(b.id) === String(id) || b.booking_ref === id);
    if (!found) throw new Error('Booking not found');
    let qr = '';
    try { qr = await QRCode.toDataURL(found.booking_ref); } catch(e){}
    return {
      booking: found,
      payments: [
        { id: 1, amount: found.paid_amount, payment_method: 'mpesa_stk', mpesa_code: 'QKH' + Math.floor(100000 + Math.random() * 900000), recorded_by: 'M-Pesa Gateway', created_at: found.created_at }
      ],
      auditLogs: [
        { id: 1, action: 'BOOKING_CREATED', details: `Booking ${found.booking_ref} created`, performed_by: 'System', created_at: found.created_at },
        ...(found.shelf_location ? [{ id: 2, action: 'SHELF_ASSIGNED', details: `Assigned location ${found.shelf_location}`, performed_by: 'Fatuma Juma', created_at: found.created_at }] : [])
      ],
      qrCodeDataUrl: qr
    };
  }

  // 8. Patch status / shelf
  if (path.includes('/status') && method === 'PATCH') {
    const id = path.split('/')[1];
    const bookings = JSON.parse(localStorage.getItem('mzingo_gh_bookings') || '[]');
    const idx = bookings.findIndex(b => String(b.id) === String(id));
    if (idx !== -1) {
      bookings[idx] = { ...bookings[idx], ...body, updated_at: new Date().toISOString() };
      localStorage.setItem('mzingo_gh_bookings', JSON.stringify(bookings));
    }
    return { message: 'Updated successfully' };
  }

  // 9. Extend
  if (path.includes('/extend') && method === 'POST') {
    const id = path.split('/')[1];
    const bookings = JSON.parse(localStorage.getItem('mzingo_gh_bookings') || '[]');
    const idx = bookings.findIndex(b => String(b.id) === String(id));
    if (idx !== -1) {
      bookings[idx].expected_pickup_date = body.new_pickup_date;
      bookings[idx].total_amount += 500;
      bookings[idx].balance_amount += 500;
      localStorage.setItem('mzingo_gh_bookings', JSON.stringify(bookings));
    }
    return { message: 'Extended successfully', newTotal: bookings[idx]?.total_amount, updatedBalance: bookings[idx]?.balance_amount, newStatus: bookings[idx]?.status };
  }

  // 10. Payments
  if (path === 'payments' && method === 'GET') {
    const payments = JSON.parse(localStorage.getItem('mzingo_gh_payments') || '[]');
    return { payments };
  }

  if (path === 'payments' && method === 'POST') {
    const payments = JSON.parse(localStorage.getItem('mzingo_gh_payments') || '[]');
    const newPay = {
      id: Date.now(),
      booking_id: body.booking_id,
      booking_ref: 'MZP-2026-PAY',
      customer_name: 'Customer Payment',
      amount: body.amount,
      payment_method: body.payment_method,
      mpesa_code: body.mpesa_code || 'CASH-PAY',
      recorded_by: 'Staff',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    payments.unshift(newPay);
    localStorage.setItem('mzingo_gh_payments', JSON.stringify(payments));
    return { message: 'Payment recorded', paymentId: newPay.id };
  }

  if (path === 'payments/reconciliation') {
    const payments = JSON.parse(localStorage.getItem('mzingo_gh_payments') || '[]');
    const cash = payments.filter(p => p.payment_method === 'cash').reduce((a, b) => a + b.amount, 0);
    const mpesa = payments.filter(p => p.payment_method.includes('mpesa')).reduce((a, b) => a + b.amount, 0);
    return {
      date: new Date().toISOString().split('T')[0],
      cashTotal: cash || 1200,
      mpesaTotal: mpesa || 18500,
      overallTotal: (cash || 1200) + (mpesa || 18500),
      payments
    };
  }

  // 11. Customers
  if (path === 'customers') {
    const custs = JSON.parse(localStorage.getItem('mzingo_gh_customers') || '[]');
    return { customers: custs.map(c => ({ ...c, total_bookings: 2, total_spent: 3500, is_repeat_customer: c.id % 2 === 0 ? 1 : 0 })) };
  }

  // 12. Settings
  if (path === 'settings' && method === 'GET') {
    return {
      settings: {
        business_name: 'Mzingo Point Storage Ltd',
        address: 'Moi Avenue, Opp. Mombasa Tusks, Mombasa, Kenya',
        phone: '+254 712 345 678',
        whatsapp: '+254 712 345 678',
        email: 'info@mzingopoint.co.ke',
        opening_hours: '6:30 AM to 8:30 PM daily (Mon - Sun)',
        currency: 'KES',
        storage_capacity_total: '65',
        late_fee_per_day: '100',
        online_booking_enabled: 'true',
        pricing_rates: {
          small: { day: 150, week: 900, month: 3200 },
          medium: { day: 250, week: 1500, month: 5500 },
          large: { day: 400, week: 2400, month: 8800 },
          xlarge: { day: 750, week: 4500, month: 16000 }
        }
      }
    };
  }

  if (path === 'settings' && method === 'POST') {
    return { message: 'Settings saved successfully' };
  }

  // 13. Notifications
  if (path === 'notifications/send') {
    const waPhone = '254712345678';
    const text = `Habari! Mzingo Point Mombasa notification for your stored belongings.`;
    return {
      success: true,
      whatsAppLink: `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`
    };
  }

  return { success: true };
}
