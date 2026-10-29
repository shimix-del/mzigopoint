import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  Sun,
  Moon,
  Compass
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import BookingsManager from './BookingsManager';
import PaymentsManager from './PaymentsManager';
import CustomersManager from './CustomersManager';
import AlertsManager from './AlertsManager';
import ReportsManager from './ReportsManager';
import SettingsManager from './SettingsManager';
import ManualBookingModal from './ManualBookingModal';
import { DhowIcon } from '../components/SwahiliMotifs';

export default function AdminLayout({ user, token, onLogout, onSwitchToPublic }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [manualBookingOpen, setManualBookingOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('mzingo_admin_dark') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('mzingo_admin_dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

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
    { id: 'reports', label: 'Financial Reports', icon: FileBarChart2 },
    ...(isOwner ? [{ id: 'settings', label: 'Settings & Rates', icon: Settings }] : [])
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-[#071527] text-gray-100' : 'bg-[#FAF8F5] text-gray-900'
    }`}>
      {/* Top Bar */}
      <header className={`sticky top-0 z-40 shadow-sm border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0B2545] border-white/10 text-white' : 'bg-[#0B2545] border-[#0B2545] text-white'
      }`}>
        <div className="px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#FF6B4A] to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
                <DhowIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="truncate">
                <span className="font-black text-sm sm:text-base tracking-tight font-['Syne'] truncate block">
                  MZINGO <span className="text-[#FF6B4A]">POINT</span>
                </span>
                <span className="hidden sm:inline text-[10px] text-amber-300 font-mono">
                  Mombasa Island Admin
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-gray-200" />}
            </button>

            {/* Quick Walk-in Button */}
            <button
              onClick={() => setManualBookingOpen(true)}
              className="bg-[#FF6B4A] hover:bg-[#e85535] text-white text-xs px-2.5 sm:px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-all min-h-[38px] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden md:inline">New Walk-In Intake</span>
              <span className="md:hidden">Intake</span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-white/15">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold block leading-none truncate max-w-[100px]">{user.name}</span>
                <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                  isOwner ? 'bg-amber-400 text-[#0B2545]' : 'bg-[#13B5B1] text-[#0B2545]'
                }`}>
                  {user.role}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-gray-200 hover:text-white transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-4 sm:gap-6">
        {/* Desktop Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block space-y-4">
          <div className={`rounded-3xl border p-3 shadow-xs space-y-1 transition-colors ${
            isDarkMode ? 'bg-[#0B2545] border-white/10' : 'bg-white border-gray-200'
          }`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6B4A] to-[#e85535] text-white shadow-md'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick link to public site */}
          <div className={`rounded-3xl border p-5 space-y-2 text-xs transition-colors ${
            isDarkMode ? 'bg-[#0B2545]/60 border-white/10 text-gray-300' : 'bg-[#F6EBD9]/50 border-[#F6EBD9] text-gray-700'
          }`}>
            <span className="font-bold text-[#0B2545] dark:text-amber-300 block font-['Syne']">Public Portal</span>
            <p className="text-[11px] leading-relaxed opacity-80">
              Preview the live customer-facing booking portal and pricing calculator.
            </p>
            <button
              onClick={onSwitchToPublic}
              className="text-xs font-bold text-[#FF6B4A] hover:underline flex items-center gap-1.5 pt-1"
            >
              <span>Visit Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
            <div className={`w-72 h-full p-5 space-y-4 shadow-2xl transition-colors ${
              isDarkMode ? 'bg-[#0B2545] text-white' : 'bg-white text-gray-900'
            }`}>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-white/10">
                <span className="font-black text-sm font-['Syne']">Admin Navigation</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-gray-400 hover:text-white">
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
                      className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 ${
                        isActive
                          ? 'bg-[#FF6B4A] text-white'
                          : isDarkMode
                          ? 'text-gray-300 hover:bg-white/5'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                <button
                  onClick={onSwitchToPublic}
                  className="w-full text-left px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-2"
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
              isDarkMode={isDarkMode}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenWalkIn={() => setManualBookingOpen(true)}
              refreshKey={refreshTrigger}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsManager
              token={token}
              user={user}
              isDarkMode={isDarkMode}
              onOpenWalkIn={() => setManualBookingOpen(true)}
              refreshKey={refreshTrigger}
              onDataChanged={triggerRefresh}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsManager
              token={token}
              user={user}
              isDarkMode={isDarkMode}
              refreshKey={refreshTrigger}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersManager
              token={token}
              user={user}
              isDarkMode={isDarkMode}
              refreshKey={refreshTrigger}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsManager
              token={token}
              user={user}
              isDarkMode={isDarkMode}
              refreshKey={refreshTrigger}
              onDataChanged={triggerRefresh}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsManager
              token={token}
              user={user}
              isDarkMode={isDarkMode}
              refreshKey={refreshTrigger}
            />
          )}

          {activeTab === 'settings' && isOwner && (
            <SettingsManager
              token={token}
              user={user}
              isDarkMode={isDarkMode}
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
