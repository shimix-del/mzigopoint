import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid login credentials');
      }

      localStorage.setItem('mzingo_token', data.token);
      localStorage.setItem('mzingo_user', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email, pwd) => {
    setIdentifier(email);
    setPassword(pwd);
    // trigger login automatically
    setIsLoading(true);
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: email, password: pwd })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('mzingo_token', data.token);
          localStorage.setItem('mzingo_user', JSON.stringify(data.user));
          onLoginSuccess(data.user, data.token);
        } else {
          setErrorMsg(data.error || 'Login failed');
        }
      })
      .catch(e => setErrorMsg(e.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 sm:p-10 border border-gray-200 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0F2A4A] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold font-['Poppins'] text-[#0F2A4A]">
            Staff & Owner Portal
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to manage luggage check-in, verify pickups, view revenue & assign racks.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email or Phone
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. owner@mzingopoint.co.ke"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0F2A4A] hover:bg-[#1a406c] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <span>Signing in...</span> : <span>Sign In to Dashboard</span>}
          </button>
        </form>

        {/* Quick Demo Login Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-2.5">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block text-center">
            ⚡ Quick Demo Accounts
          </span>

          <button
            type="button"
            onClick={() => handleDemoLogin('owner@mzingopoint.co.ke', 'admin123')}
            className="w-full p-2.5 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100/80 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <strong className="text-xs text-[#0F2A4A] block">Login as Owner (Ali Mwamburi)</strong>
              <span className="text-[10px] text-gray-500">Full Access: Revenue, Prices, Reports & Staff</span>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-200 px-2 py-0.5 rounded">Owner</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('attendant@mzingopoint.co.ke', 'staff123')}
            className="w-full p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <strong className="text-xs text-[#0F2A4A] block">Login as Staff Attendant (Fatuma Juma)</strong>
              <span className="text-[10px] text-gray-500">Check-in, Shelf assignment, Payments, Collections</span>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-200 px-2 py-0.5 rounded">Staff</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-gray-500 hover:text-gray-800 underline"
          >
            Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
}
