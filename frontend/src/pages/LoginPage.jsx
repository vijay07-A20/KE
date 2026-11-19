import React, { useState } from 'react';
import { Activity, ShieldCheck, Lock, User, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onLoginSuccess }) {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('dr.sarah');
  const [password, setPassword] = useState('doctor123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoLogin = async (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError('');
    try {
      await login(demoUser, demoPass);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Hospital Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white shadow-xl shadow-sky-500/25 mb-4">
            <Activity className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Metropolitan Hospital CDS</h1>
          <p className="text-sm text-sky-200 mt-1">Knowledge Graph Drug Interaction & Decision Support</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Clinical Portal Login</h2>
              <p className="text-xs text-slate-500">Sign in to access patient records and reasoning engine</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-sky-600" />
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Username / Provider ID</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. dr.sarah"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-sky-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Quick Demo Access Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Demo Account Sign-In:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('dr.sarah', 'doctor123')}
                className="p-2 text-center rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 transition text-xs"
              >
                <div className="font-bold">Doctor</div>
                <div className="text-[10px] text-sky-600 truncate">Dr. Sarah</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('pharm.marcus', 'pharm123')}
                className="p-2 text-center rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 transition text-xs"
              >
                <div className="font-bold">Pharmacist</div>
                <div className="text-[10px] text-teal-600 truncate">M. Vance</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin', 'admin123')}
                className="p-2 text-center rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 transition text-xs"
              >
                <div className="font-bold">Admin</div>
                <div className="text-[10px] text-indigo-600 truncate">System</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer Notice */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Hospital Information System • Authorized Clinical Staff Only • 256-bit AES
        </p>
      </div>
    </div>
  );
}
