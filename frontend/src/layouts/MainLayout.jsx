import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserPlus, Pill, ShieldAlert, 
  GitFork, Bell, FileText, Settings, LogOut, Menu, X, 
  Activity, ChevronRight, Stethoscope, Database, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function MainLayout({ activePage, setActivePage, children }) {
  const { user, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreviewedAlerts, setUnreviewedAlerts] = useState(0);
  const [graphStatus, setGraphStatus] = useState({ neo4jConnected: false, totalNodes: 54 });

  useEffect(() => {
    // Fetch unreviewed alerts count and graph status
    api.getAlerts('', false)
      .then(alerts => setUnreviewedAlerts(alerts.length))
      .catch(() => {});

    api.getGraphStatus()
      .then(status => setGraphStatus(status))
      .catch(() => {});
  }, [activePage]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'checker', label: 'Interaction Checker', icon: ShieldAlert, highlight: true },
    { id: 'graph', label: 'Knowledge Graph', icon: GitFork },
    { id: 'patients', label: 'Patient Management', icon: Users },
    { id: 'add-patient', label: 'Register Patient', icon: UserPlus },
    { id: 'drugs', label: 'Drug Database', icon: Pill },
    { id: 'alerts', label: 'Clinical Alerts', icon: Bell, badge: unreviewedAlerts },
    { id: 'reports', label: 'Safety Reports', icon: FileText },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-400 text-white shadow-lg shadow-sky-500/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight tracking-tight">KGraph CDS</h1>
            <p className="text-xs text-sky-400 font-medium">Drug Safety Engine</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Clinical Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : item.highlight
                    ? 'bg-sky-950/40 text-sky-300 hover:bg-slate-800 border border-sky-800/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Graph Engine Status Footer */}
        <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              Graph Engine
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              graphStatus.neo4jConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-sky-950 text-sky-300 border border-sky-800'
            }`}>
              {graphStatus.neo4jConnected ? 'Neo4j Active' : 'Dual Engine'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {graphStatus.totalNodes} Nodes | Reasoning Active
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
          {/* Mobile hamburger & Page Title */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Hospital Decision Support
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <span className="text-sm font-bold text-slate-800 capitalize hidden sm:inline">
                {activePage.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher for demonstration */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 px-2">Role:</span>
              {['Doctor', 'Pharmacist', 'Admin'].map(r => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2 py-1 text-xs rounded font-medium transition ${
                    user?.role === r ? 'bg-white text-sky-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Quick Action: New Interaction Check */}
            <button
              onClick={() => setActivePage('checker')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Check Interaction</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-semibold text-slate-800 truncate max-w-[120px]">{user?.fullName || 'User'}</div>
                <div className="text-sky-600 font-medium">{user?.role || 'Staff'}</div>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${
                  activePage === item.id ? 'bg-sky-600 text-white' : 'text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Body View */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
