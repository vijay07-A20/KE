import React, { useState, useEffect } from 'react';
import { 
  Settings, Database, CheckCircle2, AlertTriangle, RefreshCw, 
  ShieldCheck, Server, Key, RotateCcw, ListFilter, Activity 
} from 'lucide-react';
import { api } from '../services/api';

export default function SettingsPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);

  // Neo4j credentials form
  const [neoUri, setNeoUri] = useState('bolt://localhost:7687');
  const [neoUser, setNeoUser] = useState('neo4j');
  const [neoPass, setNeoPass] = useState('password123');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [sysStatus, logs] = await Promise.all([
        api.getSystemStatus(),
        api.getAuditLogs()
      ]);
      setStatus(sysStatus);
      setAuditLogs(logs);
      if (sysStatus?.neo4j?.uri) setNeoUri(sysStatus.neo4j.uri);
      if (sysStatus?.neo4j?.user) setNeoUser(sysStatus.neo4j.user);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNeo4j = async (e) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.testNeo4j({
        uri: neoUri,
        user: neoUser,
        password: neoPass
      });
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm("Are you sure you want to reset all patient records and knowledge graphs to the default state?")) {
      return;
    }
    try {
      await api.resetDemoData();
      setResetSuccess(true);
      loadSettings();
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (err) {
      alert("Failed to reset: " + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-sky-600" />
          System Settings & Database Architecture
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Knowledge Graph engine connectivity, Neo4j configuration, database statistics, and audit security logs
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demo database and knowledge graph successfully re-seeded to initial validated state!</span>
        </div>
      )}

      {/* Grid: Neo4j Config + Graph Engine Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Neo4j Connection Setup */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-sm text-slate-900">Neo4j Graph Database Connection</h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              status?.neo4j?.connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {status?.neo4j?.connected ? 'Connected' : 'Embedded Engine Active'}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Antigravity includes an embedded multi-hop graph reasoning engine and also natively connects to any local or cloud Neo4j instance (AuraDB, Desktop, Docker).
          </p>

          <form onSubmit={handleTestNeo4j} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Neo4j Bolt URI</label>
              <input
                type="text"
                value={neoUri}
                onChange={(e) => setNeoUri(e.target.value)}
                placeholder="bolt://localhost:7687"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  value={neoUser}
                  onChange={(e) => setNeoUser(e.target.value)}
                  placeholder="neo4j"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={neoPass}
                  onChange={(e) => setNeoPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-xs"
                />
              </div>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl text-xs border ${
                testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-0.5">
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  <span>{testResult.success ? 'Connection Successful' : 'Connection Note'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{testResult.message}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={testing}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5" />}
                <span>{testing ? 'Testing...' : 'Test Neo4j Connectivity'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Knowledge Graph Breakdown & System State */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Knowledge Graph Topology</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">v{status?.appVersion || '2.0.0'}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Total Knowledge Nodes</span>
              <span className="text-xl font-bold text-slate-900">{status?.stats?.totalNodes || 54}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Relationship Edges</span>
              <span className="text-xl font-bold text-slate-900">{status?.stats?.totalEdges || 57}</span>
            </div>
          </div>

          {/* Node Entities List */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Entities in Active Knowledge Base:
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {Object.entries(status?.stats?.nodeTypes || {}).map(([type, count]) => (
                <span key={type} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-medium">
                  {type}: <strong>{count}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-800">Reset Demo Environment</h4>
                <p className="text-[11px] text-slate-400">Restore all fictional patients and sample clinical alerts</p>
              </div>
              <button
                onClick={handleResetData}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Security Logs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-sm text-slate-900">Hospital Security & Clinical Audit Trail</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">HIPAA Audit Compliance Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
                <th className="py-2.5 px-5">Timestamp</th>
                <th className="py-2.5 px-5">Provider / User</th>
                <th className="py-2.5 px-5">Action Performed</th>
                <th className="py-2.5 px-5">Clinical Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
              {auditLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-5 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-5 font-semibold text-slate-900">{log.user}</td>
                  <td className="py-2.5 px-5">
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold text-[10px] border border-sky-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-5 text-slate-600 max-w-md truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
