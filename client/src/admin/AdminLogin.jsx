import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-[80vh] flex items-center justify-center px-3 sm:px-6 py-8 sm:py-16">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-10 border border-gray-200 shadow-2xl space-y-5 sm:space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6 text-[#FF6B4A]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Syne'] text-[#0B2545]">
            Moi Avenue Desk Portal
          </h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Authorized owner and staff login for intake, pickups, and live bay verification.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
              Email or Phone
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. owner@mzingo.co.ke"
                className="w-full text-base sm:text-xs pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 min-h-[44px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-base sm:text-xs pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 min-h-[44px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0B2545] hover:bg-[#163a63] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all min-h-[44px] cursor-pointer"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Desk</span>
                <ArrowRight className="w-4 h-4 text-[#13B5B1]" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block text-center">
            Demo Quick Login Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('owner@mzingo.co.ke', 'mzingo2026')}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#0B2545] text-left transition-colors min-h-[44px]"
            >
              <strong className="block text-[11px] font-bold">👑 Business Owner</strong>
              <span className="text-[10px] text-gray-500 font-mono">Full Access + Revenue</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('staff@mzingo.co.ke', 'staff2026')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0B2545] text-left transition-colors min-h-[44px]"
            >
              <strong className="block text-[11px] font-bold">🛡️ Desk Staff</strong>
              <span className="text-[10px] text-gray-500 font-mono">Intake & Pickups</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-gray-500 hover:text-black font-semibold flex items-center justify-center gap-1 mx-auto py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
}
