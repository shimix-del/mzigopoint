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

export default function BookingsManager({ token, user, isDarkMode, onOpenWalkIn, refreshKey, onDataChanged }) {
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
      'Expected Pickup',
      'Total KES',
      'Paid KES',
      'Balance KES',
      'Payment Status',
      'Storage Status'
    ];

    const rows = sortedBookings.map(b => [
      b.booking_ref,
      `"${b.customer_name}"`,
      b.customer_phone,
      `"${b.item_type}"`,
      b.item_size,
      b.quantity,
      b.shelf_location || 'Unassigned',
      b.dropoff_date,
      b.expected_pickup_date,
      b.total_amount,
      b.paid_amount,
      b.balance_amount,
      b.payment_status,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MzingoPoint_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'in_storage':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#13B5B1]/20 text-[#13B5B1] border border-[#13B5B1]/30">In Storage</span>;
      case 'ready':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-400/20 text-amber-500 border border-amber-400/30">Ready</span>;
      case 'overdue':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500 text-white animate-pulse">Overdue</span>;
      case 'collected':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">Collected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30">Booked</span>;
    }
  };

  const renderPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-500">Paid</span>;
      case 'partial':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-400/20 text-amber-500">Partial</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-500">Pending</span>;
    }
  };

  const cardBg = isDarkMode ? 'bg-[#0B2545] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900';
  const tableHeaderBg = isDarkMode ? 'bg-[#071527] text-gray-400 border-white/10' : 'bg-gray-50/90 text-gray-500 border-gray-200';
  const inputBg = isDarkMode ? 'bg-white/5 border-white/15 text-white' : 'bg-gray-50/60 border-gray-200 text-gray-900';

  return (
    <div className="space-y-4">
      {/* Search & Actions Header */}
      <div className={`rounded-3xl border p-6 shadow-sm space-y-4 transition-colors ${cardBg}`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black font-['Syne']">
              Luggage Registry & Storage Inventory
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Showing {sortedBookings.length} bookings • Search by customer, phone, bay, or reference
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="bg-white/10 hover:bg-white/20 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#13B5B1]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onOpenWalkIn}
              className="bg-[#FF6B4A] hover:bg-[#e85535] text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Walk-In Intake</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, customer, phone, bay..."
              className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:border-[#13B5B1] ${inputBg}`}
            />
          </form>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-[#13B5B1] ${inputBg}`}
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
              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-[#13B5B1] ${inputBg}`}
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Fully Paid</option>
              <option value="partial">Partially Paid</option>
              <option value="pending">Pending Payment</option>
            </select>
          </div>

          {/* Date range picker trigger */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-xl border focus:outline-none focus:border-[#13B5B1] ${inputBg}`}
              title="Start dropoff date"
            />
          </div>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className={`rounded-3xl border overflow-hidden shadow-sm transition-colors ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-mono font-bold uppercase text-[10px] tracking-wider ${tableHeaderBg}`}>
                <th onClick={() => toggleSort('booking_ref')} className="p-4 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1.5">
                    <span>Reference</span>
                    <ArrowUpDown className="w-3 h-3 text-[#FF6B4A]" />
                  </div>
                </th>
                <th onClick={() => toggleSort('customer_name')} className="p-4 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1.5">
                    <span>Customer & Phone</span>
                    <ArrowUpDown className="w-3 h-3 text-[#FF6B4A]" />
                  </div>
                </th>
                <th className="p-4">Items & Bay</th>
                <th onClick={() => toggleSort('dropoff_date')} className="p-4 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1.5">
                    <span>Drop-off / Due</span>
                    <ArrowUpDown className="w-3 h-3 text-[#FF6B4A]" />
                  </div>
                </th>
                <th onClick={() => toggleSort('total_amount')} className="p-4 text-right cursor-pointer hover:text-white">
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total (KES)</span>
                    <ArrowUpDown className="w-3 h-3 text-[#FF6B4A]" />
                  </div>
                </th>
                <th className="p-4 text-right">Balance</th>
                <th className="p-4 text-center">Payment</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="p-10 text-center text-gray-400">
                    <div className="w-6 h-6 border-2 border-[#FF6B4A] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <span>Loading bookings...</span>
                  </td>
                </tr>
              ) : sortedBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-10 text-center text-gray-400">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                sortedBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-[#13B5B1]/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => setSelectedBookingId(b.id)}
                  >
                    <td className="p-4 font-mono font-bold text-[#FF6B4A]">
                      {b.booking_ref}
                    </td>

                    <td className="p-4">
                      <span className="font-bold block">{b.customer_name}</span>
                      <span className="text-[11px] opacity-70 font-mono">{b.customer_phone}</span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{b.quantity}x {b.item_type}</span>
                        <span className="text-[10px] font-mono opacity-60 uppercase">({b.item_size})</span>
                      </div>
                      <div className="mt-1">
                        {b.shelf_location ? (
                          <span className="text-[10px] font-mono font-bold text-[#13B5B1] bg-[#13B5B1]/10 px-2 py-0.5 rounded-md">
                            Bay {b.shelf_location}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">No bay assigned</span>
                        )}
                        {b.is_fragile ? <span className="ml-1.5 text-[10px] text-[#FF6B4A] font-bold">⚠️ Fragile</span> : null}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="opacity-70 font-mono text-[11px]">{b.dropoff_date}</div>
                      <div className="font-bold font-mono text-[11px] mt-0.5">Due: {b.expected_pickup_date}</div>
                    </td>

                    <td className="p-4 text-right font-black font-['Syne']">
                      KES {b.total_amount?.toLocaleString()}
                    </td>

                    <td className={`p-4 text-right font-mono font-bold ${
                      b.balance_amount > 0 ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {b.balance_amount > 0 ? `KES ${b.balance_amount?.toLocaleString()}` : 'KES 0'}
                    </td>

                    <td className="p-4 text-center">
                      {renderPaymentBadge(b.payment_status)}
                    </td>

                    <td className="p-4 text-center">
                      {renderStatusBadge(b.status)}
                    </td>

                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedBookingId(b.id)}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-[#FF6B4A] text-gray-600 dark:text-gray-300 hover:text-white transition-all shadow-xs"
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
