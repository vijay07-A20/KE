import React, { useState, useEffect } from 'react';
import { 
  Users, Pill, ShieldAlert, AlertTriangle, Activity, 
  GitFork, ArrowUpRight, CheckCircle2, Clock, ChevronRight,
  TrendingUp, Sparkles, FileText, Database
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';
import { api } from '../services/api';

export default function DashboardPage({ setActivePage, setSelectedPatientId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error("Dashboard stats error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectPatient = (patientId) => {
    if (setSelectedPatientId) setSelectedPatientId(patientId);
    setActivePage('checker');
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Querying Knowledge Graph & Clinical Records...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'from-blue-600 to-sky-500',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-100',
      change: '+12% this month'
    },
    {
      title: 'Knowledge Graph Drugs',
      value: stats.totalDrugs,
      icon: Pill,
      color: 'from-teal-600 to-emerald-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      change: '14 Active Formularies'
    },
    {
      title: 'Interactions Detected',
      value: stats.totalInteractionsDetected,
      icon: Activity,
      color: 'from-indigo-600 to-violet-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      change: 'Multi-Hop Graph Rules'
    },
    {
      title: 'Critical Alerts',
      value: stats.criticalAlertsCount,
      icon: ShieldAlert,
      color: 'from-rose-600 to-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      change: 'Urgent Clinical Review'
    }
  ];

  const pieColors = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/30 text-sky-200 border border-sky-400/30">
              Live Decision Support
            </span>
            <span className="text-xs text-sky-300">| Knowledge Graph Connected</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Clinical Pharmacovigilance Center</h2>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-xl">
            Detecting dangerous multi-drug interactions, contraindications, and age/allergy risks using semantic graph reasoning.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => setActivePage('checker')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-sky-900 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-sky-600" />
            <span>Launch Interaction Checker</span>
          </button>
          <button
            onClick={() => setActivePage('graph')}
            className="px-4 py-2.5 rounded-xl bg-sky-700/60 hover:bg-sky-700 text-white font-medium text-xs sm:text-sm border border-sky-500/40 transition flex items-center gap-2"
          >
            <GitFork className="w-4 h-4 text-sky-300" />
            <span>Explore Graph</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl bg-white border ${card.borderColor} shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</div>
                <div className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Severity Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Detected Interaction Severity Breakdown</h3>
              <p className="text-xs text-slate-500">Distribution of active clinical interaction levels</p>
            </div>
            <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
              Validated Rules
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.severityDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Share Donut Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Risk Ratio</h3>
            <p className="text-xs text-slate-500">Proportion by Clinical Severity</p>
          </div>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.severityDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {stats.severityDistribution.map((entry, index) => (
                    <Cell key={`donut-${index}`} fill={entry.color || pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
            {stats.severityDistribution.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-800 ml-auto">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Detection Trends Area Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">6-Month Clinical Screening & Detection Trends</h3>
            <p className="text-xs text-slate-500">Screening volume vs identified critical and high risk interactions</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Total Screenings
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical Detected
            </span>
          </div>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorChecks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="checks" name="Total Checks" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorChecks)" />
              <Area type="monotone" dataKey="critical" name="Critical Interactions" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorCritical)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Patient Analyses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recent Patient Clinical Analyses</h3>
            <p className="text-xs text-slate-500">Latest multi-agent and knowledge graph reasoning runs</p>
          </div>
          <button
            onClick={() => setActivePage('patients')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>View All Patients</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
                <th className="py-3 px-5">Patient ID</th>
                <th className="py-3 px-5">Patient Name</th>
                <th className="py-3 px-5">Overall Risk Level</th>
                <th className="py-3 px-5">Clinical Finding Summary</th>
                <th className="py-3 px-5">Date / Time</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stats.recentAnalyses.map((rec) => {
                const isCritical = rec.overallRisk === 'Critical';
                const isHigh = rec.overallRisk === 'High';
                const badgeColor = isCritical
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : isHigh
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-5 font-mono font-semibold text-slate-900">{rec.patientId}</td>
                    <td className="py-3.5 px-5 font-medium text-slate-900">{rec.patientName}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${badgeColor}`}>
                        {isCritical && <AlertTriangle className="w-3 h-3 text-red-600" />}
                        {rec.overallRisk}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 max-w-xs truncate text-slate-600">{rec.summary}</td>
                    <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">{rec.createdAt}</td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleInspectPatient(rec.patientId)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition inline-flex items-center gap-1"
                      >
                        <span>Re-Analyze</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
