import React, { useState } from 'react';
import {
  LayoutDashboard,
  Luggage,
  CreditCard,
  Users,
  Bell,
  FileBarChart2,
  Settings,
  LogOut,
  PlusCircle,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import BookingsManager from './BookingsManager';
import PaymentsManager from './PaymentsManager';
import CustomersManager from './CustomersManager';
import AlertsManager from './AlertsManager';
import ReportsManager from './ReportsManager';
import SettingsManager from './SettingsManager';
import ManualBookingModal from './ManualBookingModal';

export default function AdminLayout({ user, token, onLogout, onSwitchToPublic }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [manualBookingOpen, setManualBookingOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const isOwner = user && user.role === 'owner';

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings & Storage', icon: Luggage },
    { id: 'payments', label: 'Payments & M-Pesa', icon: CreditCard },
    { id: 'customers', label: 'Customers Directory', icon: Users },
    { id: 'alerts', label: 'Alerts & Overdue', icon: Bell },
    { id: 'reports', label: 'Financial & Audit Reports', icon: FileBarChart2 },
    ...(isOwner ? [{ id: 'settings', label: 'Settings & Rates', icon: Settings }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-gray-800 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="bg-[#0F2A4A] text-white sticky top-0 z-40 shadow-sm border-b border-white/10">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/10 text-white"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E75A2D] to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                MP
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight font-['Poppins']">
                  MZINGO <span className="text-[#E75A2D]">POINT</span>
                </span>
                <span className="hidden sm:inline text-[10px] text-amber-300 ml-2 font-mono">
                  Mombasa Admin Desk
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Walk-in Button */}
            <button
              onClick={() => setManualBookingOpen(true)}
              className="bg-[#E75A2D] hover:bg-[#d0451b] text-white text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Walk-In Booking</span>
              <span className="sm:hidden">New Booking</span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold block leading-none">{user.name}</span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded mt-0.5 inline-block ${
                  isOwner ? 'bg-amber-400 text-[#0F2A4A]' : 'bg-blue-400 text-[#0F2A4A]'
                }`}>
                  {user.role}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-gray-200 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-[#0F2A4A] text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick link to public site */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 space-y-2 text-xs">
            <span className="font-bold text-[#0F2A4A] block">Public Customer View</span>
            <p className="text-gray-600 text-[11px] leading-snug">
              Preview the customer-facing booking portal and price calculator.
            </p>
            <button
              onClick={onSwitchToPublic}
              className="text-xs font-bold text-[#E75A2D] hover:underline flex items-center gap-1"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 flex">
            <div className="w-72 bg-white h-full p-4 space-y-3 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="font-bold text-sm text-[#0F2A4A]">Navigation Menu</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 ${
                        isActive ? 'bg-[#0F2A4A] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={onSwitchToPublic}
                  className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:text-black flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Public Website View</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <DashboardOverview
              token={token}
              user={user}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenWalkIn={() => setManualBookingOpen(true)}
              refreshKey={refreshTrigger}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsManager
              token={token}
              user={user}
              onOpenWalkIn={() => setManualBookingOpen(true)}
              refreshKey={refreshTrigger}
              onDataChanged={triggerRefresh}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsManager
              token={token}
              user={user}
              refreshKey={refreshTrigger}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersManager
              token={token}
              user={user}
              refreshKey={refreshTrigger}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsManager
              token={token}
              user={user}
              refreshKey={refreshTrigger}
              onDataChanged={triggerRefresh}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsManager
              token={token}
              user={user}
              refreshKey={refreshTrigger}
            />
          )}

          {activeTab === 'settings' && isOwner && (
            <SettingsManager
              token={token}
              user={user}
              onSettingsUpdated={triggerRefresh}
            />
          )}
        </main>
      </div>

      {/* MANUAL WALK-IN BOOKING MODAL */}
      {manualBookingOpen && (
        <ManualBookingModal
          token={token}
          user={user}
          onClose={() => setManualBookingOpen(false)}
          onSuccess={() => {
            setManualBookingOpen(false);
            triggerRefresh();
            setActiveTab('bookings');
          }}
        />
      )}
    </div>
  );
}
