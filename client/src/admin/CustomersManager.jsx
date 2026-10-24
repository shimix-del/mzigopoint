import React, { useState, useEffect } from 'react';
import { Users, Search, Star, Phone, Mail, Award, Luggage, Clock } from 'lucide-react';

export default function CustomersManager({ token, user, refreshKey }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCust, setSelectedCust] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [refreshKey]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/customers${q}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleViewHistory = async (id) => {
    try {
      const res = await fetch(`/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSelectedCust(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-['Poppins'] text-[#0F2A4A]">
            Customers Directory (Wateja)
          </h2>
          <p className="text-xs text-gray-500">
            {customers.length} registered customers • Lifetime spend, verified National IDs & repeat customer loyalty tracking.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, ID..."
            className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
          />
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">National ID / Passport</th>
                <th className="p-3.5 text-center">Bookings</th>
                <th className="p-3.5 text-right">Lifetime Spent (KES)</th>
                <th className="p-3.5 text-center">Loyalty Tier</th>
                <th className="p-3.5 text-center">History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">Loading customers...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">No customers found.</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3.5 font-bold text-gray-900">
                      {c.name}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1 font-mono text-gray-700">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{c.phone}</span>
                      </div>
                      {c.email && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{c.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 font-mono text-[#0F2A4A] font-bold">
                      {c.id_number}
                    </td>

                    <td className="p-3.5 text-center font-bold">
                      {c.total_bookings}
                    </td>

                    <td className="p-3.5 text-right font-extrabold text-[#0F2A4A]">
                      KES {c.total_spent?.toLocaleString()}
                    </td>

                    <td className="p-3.5 text-center">
                      {c.is_repeat_customer ? (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-amber-500 stroke-none" />
                          <span>Repeat Mteja</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">New Customer</span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleViewHistory(c.id)}
                        className="text-[11px] text-[#E75A2D] hover:underline font-bold"
                      >
                        View Bookings
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer History Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">
                  {selectedCust.customer.name}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {selectedCust.customer.phone} • ID: {selectedCust.customer.id_number}
                </p>
              </div>
              <button onClick={() => setSelectedCust(null)} className="p-1 text-gray-400 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-gray-400 block">
                Booking Records ({selectedCust.bookings.length})
              </span>

              {selectedCust.bookings.map((b) => (
                <div key={b.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0F2A4A]">{b.booking_ref}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-200">
                        {b.status}
                      </span>
                    </div>
                    <span className="text-gray-600 block mt-0.5">
                      {b.quantity}x {b.item_type} ({b.item_size}) • {b.dropoff_date} to {b.expected_pickup_date}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-[#0F2A4A] block">KES {b.total_amount?.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400">{b.payment_status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
