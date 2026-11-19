import React, { useState, useEffect } from 'react';
import { 
  Bell, AlertTriangle, AlertCircle, CheckCircle2, 
  ShieldAlert, Clock, Filter, Eye, Check, X, UserCheck 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ClinicalAlertsPage({ setActivePage, setSelectedPatientId }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(false); // false = unreviewed by default

  const [reviewingAlert, setReviewingAlert] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('Clinically verified. Contacted prescribing physician regarding alternative regimen.');

  useEffect(() => {
    loadAlerts();
  }, [severityFilter, statusFilter]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.getAlerts(severityFilter, statusFilter !== '' ? statusFilter : null);
      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewingAlert) return;
    try {
      await api.reviewAlert(
        reviewingAlert.id,
        user?.fullName || 'Attending Physician',
        reviewNotes
      );
      setReviewingAlert(null);
      loadAlerts();
    } catch (err) {
      alert("Failed to review alert: " + err.message);
    }
  };

  const handleInspectPatient = (patientId) => {
    if (setSelectedPatientId) setSelectedPatientId(patientId);
    setActivePage('checker');
  };

  const severityBadges = {
    Critical: 'bg-red-50 text-red-700 border-red-200',
    High: 'bg-orange-50 text-orange-700 border-orange-200',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-blue-50 text-blue-700 border-blue-200'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-sky-600" />
            Clinical Alerts & Pharmacovigilance Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized critical, high, and moderate safety flags requiring physician or pharmacist review
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              statusFilter === false ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Review</span>
          </button>
          <button
            onClick={() => setStatusFilter(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              statusFilter === true ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Acknowledged / Reviewed</span>
          </button>
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              statusFilter === '' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
        </div>

        {/* Severity Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <span className="font-semibold text-slate-500">Filter Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Risk Only</option>
            <option value="Moderate">Moderate Only</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-600" />
            Loading clinical alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">No Pending Alerts Found</h3>
            <p className="text-xs text-slate-400 mt-1">All detected interaction safety flags have been reviewed and acknowledged.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'Critical';
            const badgeClass = severityBadges[alert.severity] || severityBadges.Moderate;

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all ${
                  isCritical ? 'border-l-4 border-l-red-600' : 'border-l-4 border-l-orange-500'
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isCritical ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {isCritical ? <AlertTriangle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">{alert.title}</h3>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Patient: <strong>{alert.patient_name}</strong> ({alert.patient_id})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}>
                        {alert.severity} Severity
                      </span>
                      {alert.is_reviewed ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Reviewed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Alert Content */}
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-700 leading-relaxed font-medium">{alert.description}</p>

                    {alert.graph_path && (
                      <div className="p-2.5 bg-slate-50 rounded-xl font-mono text-[11px] text-sky-800 border border-slate-100">
                        Graph Traversal: {alert.graph_path}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {alert.clinical_effect && (
                        <div className="p-2.5 bg-red-50/60 rounded-xl border border-red-100">
                          <span className="font-bold text-red-900">Clinical Consequence:</span>
                          <p className="text-red-800 mt-0.5">{alert.clinical_effect}</p>
                        </div>
                      )}
                      {alert.recommended_action && (
                        <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                          <span className="font-bold text-emerald-900">Recommended Guidance:</span>
                          <p className="text-emerald-800 mt-0.5">{alert.recommended_action}</p>
                        </div>
                      )}
                    </div>

                    {/* Review Notes (if reviewed) */}
                    {alert.is_reviewed && alert.review_notes && (
                      <div className="mt-3 p-3 bg-emerald-50/40 rounded-xl border border-emerald-200/80 text-[11px]">
                        <span className="font-bold text-emerald-900 flex items-center gap-1 mb-0.5">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                          Reviewed by {alert.reviewed_by} on {alert.reviewed_at ? new Date(alert.reviewed_at).toLocaleDateString() : 'Today'}
                        </span>
                        <p className="text-emerald-800 italic">"{alert.review_notes}"</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Evidence: {alert.evidence_source || 'Verified Medical Formulary'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleInspectPatient(alert.patient_id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      >
                        Inspect Patient
                      </button>
                      {!alert.is_reviewed && (
                        <button
                          onClick={() => setReviewingAlert(alert)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Acknowledge / Review</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      {reviewingAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Sign Off & Acknowledge Alert
              </h3>
              <button onClick={() => setReviewingAlert(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-500">Alert Title:</span>
                <p className="font-bold text-slate-800">{reviewingAlert.title}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reviewing Clinician</label>
                <input
                  type="text"
                  disabled
                  value={user?.fullName || 'Attending Physician'}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Assessment / Pharmacist Notes</label>
                <textarea
                  rows={3}
                  required
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Document clinical discussion, dosage adjustment, or approved override reason..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingAlert(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Confirm Clinical Sign-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
