import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, UserPlus, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react';

export default function SettingsManager({ token, user, onSettingsUpdated }) {
  const [settings, setSettings] = useState(null);
  const [staffUsers, setStaffUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New staff modal
  const [newStaffModal, setNewStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffPwd, setStaffPwd] = useState('');
  const [staffRole, setStaffRole] = useState('staff');

  useEffect(() => {
    fetchSettings();
    fetchUsers();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSettings(data.settings);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStaffUsers(data.users || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ settings })
      });
      if (!res.ok) throw new Error('Save failed');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (onSettingsUpdated) onSettingsUpdated();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: staffName,
          email: staffEmail,
          phone: staffPhone,
          password: staffPwd,
          role: staffRole
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewStaffModal(false);
      setStaffName('');
      setStaffEmail('');
      setStaffPhone('');
      setStaffPwd('');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleUserActive = async (id, currentActive) => {
    try {
      const res = await fetch(`/api/auth/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ active: currentActive ? 0 : 1 })
      });
      if (!res.ok) throw new Error('Update failed');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center text-xs text-gray-500">
        Loading settings...
      </div>
    );
  }

  const pricingRates = settings.pricing_rates || {
    small: { day: 150, week: 900, month: 3200 },
    medium: { day: 250, week: 1500, month: 5500 },
    large: { day: 400, week: 2400, month: 8800 },
    xlarge: { day: 750, week: 4500, month: 16000 }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-['Poppins'] text-[#0F2A4A]">
            Business Settings & Pricing Configuration
          </h2>
          <p className="text-xs text-gray-500">
            Owner configuration: live prices, storage capacity limits, late fees & staff access permissions.
          </p>
        </div>

        {saveSuccess && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        {/* 1. Storage Pricing Rates */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#0F2A4A] font-['Poppins'] border-b pb-2">
            Storage Price Rates (KES)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['small', 'medium', 'large', 'xlarge'].map((sz) => (
              <div key={sz} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <span className="font-bold text-[#0F2A4A] uppercase block">
                  {sz} Luggage
                </span>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase block mb-0.5">Per Day (KES)</label>
                  <input
                    type="number"
                    value={pricingRates[sz]?.day || 0}
                    onChange={(e) => {
                      const updated = { ...pricingRates, [sz]: { ...pricingRates[sz], day: parseFloat(e.target.value) || 0 } };
                      setSettings({ ...settings, pricing_rates: updated });
                    }}
                    className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase block mb-0.5">Per Week (KES)</label>
                  <input
                    type="number"
                    value={pricingRates[sz]?.week || 0}
                    onChange={(e) => {
                      const updated = { ...pricingRates, [sz]: { ...pricingRates[sz], week: parseFloat(e.target.value) || 0 } };
                      setSettings({ ...settings, pricing_rates: updated });
                    }}
                    className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase block mb-0.5">Per Month (KES)</label>
                  <input
                    type="number"
                    value={pricingRates[sz]?.month || 0}
                    onChange={(e) => {
                      const updated = { ...pricingRates, [sz]: { ...pricingRates[sz], month: parseFloat(e.target.value) || 0 } };
                      setSettings({ ...settings, pricing_rates: updated });
                    }}
                    className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Operations & Capacity Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#0F2A4A] font-['Poppins'] border-b pb-2">
            Operations & Capacity Limits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Total Luggage Capacity (Units)</label>
              <input
                type="number"
                value={settings.storage_capacity_total || 60}
                onChange={(e) => setSettings({ ...settings, storage_capacity_total: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Late Fee Per Day (KES)</label>
              <input
                type="number"
                value={settings.late_fee_per_day || 100}
                onChange={(e) => setSettings({ ...settings, late_fee_per_day: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Online Booking Toggle</label>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, online_booking_enabled: settings.online_booking_enabled === 'true' ? 'false' : 'true' })}
                className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-between border ${
                  settings.online_booking_enabled === 'true' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                <span>{settings.online_booking_enabled === 'true' ? 'Online Bookings OPEN' : 'Online Bookings PAUSED (FULL)'}</span>
                <span className="text-[10px] uppercase font-mono">Toggle</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Business Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#0F2A4A] font-['Poppins'] border-b pb-2">
            Facility Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Moi Avenue Address</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Opening Hours</label>
              <input
                type="text"
                value={settings.opening_hours || ''}
                onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Support Phone & WhatsApp</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Email</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#0F2A4A] hover:bg-[#1a406c] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Configuration Changes'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* 4. Staff Accounts Management */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <h3 className="font-bold text-sm text-[#0F2A4A] font-['Poppins']">
              Staff & Attendant Accounts
            </h3>
            <p className="text-[11px] text-gray-500">
              Staff accounts can inspect bags, record check-ins, take cash and M-Pesa, but cannot modify prices or view revenue.
            </p>
          </div>

          <button
            onClick={() => setNewStaffModal(true)}
            className="bg-[#E75A2D] text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Staff Member</span>
          </button>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {staffUsers.map((u) => (
            <div key={u.id} className="py-3 flex justify-between items-center">
              <div>
                <strong className="text-gray-900 block">{u.name}</strong>
                <span className="text-[11px] text-gray-500 font-mono">{u.email} • {u.phone || 'No phone'}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  u.role === 'owner' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {u.role}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleUserActive(u.id, u.active)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                    u.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {u.active ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Modal */}
      {newStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border text-xs">
            <h4 className="font-bold text-base text-[#0F2A4A]">Add New Staff Account</h4>
            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Temporary Password *</label>
                <input
                  type="password"
                  required
                  value={staffPwd}
                  onChange={(e) => setStaffPwd(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Account Role</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="staff">Staff Attendant (Front Counter)</option>
                  <option value="owner">Full Business Owner (Admin)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setNewStaffModal(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0F2A4A] text-white rounded-lg font-bold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
