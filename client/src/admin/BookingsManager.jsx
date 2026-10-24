import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  PlusCircle,
  Eye,
  RefreshCw,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  AlertCircle
} from 'lucide-react';
import BookingDetailModal from './BookingDetailModal';

export default function BookingsManager({ token, user, onOpenWalkIn, refreshKey, onDataChanged }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sort
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  // Selected Booking for Modal
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [refreshKey, statusFilter, paymentFilter, startDate, endDate]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (statusFilter !== 'all') queryParams.set('status', statusFilter);
      if (paymentFilter !== 'all') queryParams.set('payment_status', paymentFilter);
      if (startDate) queryParams.set('start_date', startDate);
      if (endDate) queryParams.set('end_date', endDate);

      const res = await fetch(`/api/bookings?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  // Sorting
  const sortedBookings = [...bookings].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Booking Ref',
      'Customer Name',
      'Phone',
      'Item Type',
      'Size',
      'Qty',
      'Shelf',
      'Dropoff Date',
      'Pickup Date',
      'Status',
      'Total KES',
      'Paid KES',
      'Balance KES',
      'Payment Status'
    ];

    const rows = sortedBookings.map(b => [
      b.booking_ref,
      `"${b.customer_name}"`,
      b.customer_phone,
      `"${b.item_type}"`,
      b.item_size,
      b.quantity,
      b.shelf_location || 'N/A',
      b.dropoff_date,
      b.expected_pickup_date,
      b.status,
      b.total_amount,
      b.paid_amount,
      b.balance_amount,
      b.payment_status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mzingo_point_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status badge styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'in_storage':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">In Storage</span>;
      case 'ready':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">Ready Pick-up</span>;
      case 'collected':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">Collected</span>;
      case 'overdue':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-700 animate-pulse">Overdue</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-200 text-gray-700">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">Booked</span>;
    }
  };

  const renderPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">Paid</span>;
      case 'partial':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">Partial</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-700">Pending</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-lg font-bold font-['Poppins'] text-[#0F2A4A]">
              Bookings & Storage Inventory
            </h2>
            <p className="text-xs text-gray-500">
              Showing {sortedBookings.length} bookings • Search by name, phone, shelf, or reference
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onOpenWalkIn}
              className="bg-[#E75A2D] hover:bg-[#d0451b] text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Walk-in</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ref, customer, phone, shelf..."
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
            />
          </form>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
            >
              <option value="all">All Storage Statuses</option>
              <option value="in_storage">In Storage</option>
              <option value="ready">Ready for Pick-up</option>
              <option value="overdue">Overdue</option>
              <option value="booked">Booked (Pending Dropoff)</option>
              <option value="collected">Collected</option>
            </select>
          </div>

          {/* Payment filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Fully Paid</option>
              <option value="partial">Partially Paid</option>
              <option value="pending">Pending Payment</option>
            </select>
          </div>

          {/* Date range picker trigger */}
          <div className="flex gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-xs px-2 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
              title="Start dropoff date"
            />
          </div>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th onClick={() => toggleSort('booking_ref')} className="p-3.5 cursor-pointer hover:text-black">
                  <div className="flex items-center gap-1">
                    <span>Reference</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('customer_name')} className="p-3.5 cursor-pointer hover:text-black">
                  <div className="flex items-center gap-1">
                    <span>Customer & Phone</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Items & Shelf</th>
                <th onClick={() => toggleSort('dropoff_date')} className="p-3.5 cursor-pointer hover:text-black">
                  <div className="flex items-center gap-1">
                    <span>Drop-off / Due</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('total_amount')} className="p-3.5 text-right cursor-pointer hover:text-black">
                  <div className="flex items-center justify-end gap-1">
                    <span>Total (KES)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 text-right">Balance</th>
                <th className="p-3.5 text-center">Payment</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-400">
                    Loading bookings...
                  </td>
                </tr>
              ) : sortedBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-400">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                sortedBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                    onClick={() => setSelectedBookingId(b.id)}
                  >
                    <td className="p-3.5 font-bold font-mono text-[#0F2A4A]">
                      {b.booking_ref}
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-gray-900 block">{b.customer_name}</span>
                      <span className="text-[11px] text-gray-500 font-mono">{b.customer_phone}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{b.quantity}x {b.item_type}</span>
                        <span className="text-[10px] text-gray-400 uppercase">({b.item_size})</span>
                      </div>
                      <div className="mt-0.5">
                        {b.shelf_location ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                            {b.shelf_location}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">No rack assigned</span>
                        )}
                        {b.is_fragile ? <span className="ml-1 text-[10px] text-rose-600 font-bold">⚠️ Fragile</span> : null}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-gray-600">{b.dropoff_date}</div>
                      <div className="font-bold text-gray-900 mt-0.5">Due: {b.expected_pickup_date}</div>
                    </td>

                    <td className="p-3.5 text-right font-bold text-gray-900">
                      {b.total_amount?.toLocaleString()}
                    </td>

                    <td className={`p-3.5 text-right font-bold ${
                      b.balance_amount > 0 ? 'text-rose-600' : 'text-emerald-700'
                    }`}>
                      {b.balance_amount > 0 ? b.balance_amount?.toLocaleString() : 'KES 0'}
                    </td>

                    <td className="p-3.5 text-center">
                      {renderPaymentBadge(b.payment_status)}
                    </td>

                    <td className="p-3.5 text-center">
                      {renderStatusBadge(b.status)}
                    </td>

                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedBookingId(b.id)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#0F2A4A] text-gray-600 hover:text-white transition-colors"
                        title="View Full Booking Details & Actions"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL BOOKING DETAIL & ACTION MODAL */}
      {selectedBookingId && (
        <BookingDetailModal
          bookingId={selectedBookingId}
          token={token}
          user={user}
          onClose={() => setSelectedBookingId(null)}
          onDataChanged={() => {
            fetchBookings();
            if (onDataChanged) onDataChanged();
          }}
        />
      )}
    </div>
  );
}
