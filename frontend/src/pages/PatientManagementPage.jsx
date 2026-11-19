import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, ShieldAlert, Trash2, Eye, 
  Activity, Pill, HeartPulse, AlertCircle, FileText, ChevronRight, X 
} from 'lucide-react';
import { api } from '../services/api';

export default function PatientManagementPage({ setActivePage, setSelectedPatientId }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await api.getPatients();
      setPatients(data);
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deletePatient(id);
      setPatients(patients.filter(p => p.patient_id !== id && p.id !== id));
      setDeleteConfirmId(null);
      if (selectedPatient?.patient_id === id) setSelectedPatient(null);
    } catch (err) {
      alert("Failed to delete patient record: " + err.message);
    }
  };

  const handleRunCheck = (patient) => {
    if (setSelectedPatientId) setSelectedPatientId(patient.patient_id);
    setActivePage('checker');
  };

  const filtered = patients.filter(p => {
    const q = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(q);
    const idMatch = p.patient_id.toLowerCase().includes(q);
    const medMatch = p.medications?.some(m => m.name.toLowerCase().includes(q));
    const disMatch = p.diseases?.some(d => d.name.toLowerCase().includes(q));
    return nameMatch || idMatch || medMatch || disMatch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            Registered Patients Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Clinical profiles, active medication regimens, diagnosed diseases, and drug allergies
          </p>
        </div>
        <button
          onClick={() => setActivePage('add-patient')}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-600/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search & Statistics Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, drug, or disease..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 w-full sm:w-auto justify-end">
          <span>Showing <strong className="text-slate-800">{filtered.length}</strong> of {patients.length} patients</span>
        </div>
      </div>

      {/* Patient Cards / Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
          <Activity className="w-6 h-6 animate-spin text-sky-600 mr-2" />
          Loading patient directory...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">No patients found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or register a new patient.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((patient) => {
            const hasAllergies = patient.allergies && patient.allergies.length > 0;
            return (
              <div
                key={patient.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shadow-sm">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">{patient.name}</h3>
                        <span className="font-mono text-[11px] text-slate-500">{patient.patient_id}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600">
                      {patient.gender}, {patient.age}y
                    </span>
                  </div>

                  {/* Clinical Indicators */}
                  <div className="space-y-2 mt-4 text-xs">
                    {/* Medications */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Pill className="w-3 h-3 text-sky-500" /> Current Medications ({patient.medications?.length || 0})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {patient.medications?.length > 0 ? (
                          patient.medications.map((m, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-sky-50 text-sky-800 rounded font-medium text-[11px] border border-sky-100">
                              {m.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">None recorded</span>
                        )}
                      </div>
                    </div>

                    {/* Diseases */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <HeartPulse className="w-3 h-3 text-rose-500" /> Diagnosed Diseases ({patient.diseases?.length || 0})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {patient.diseases?.length > 0 ? (
                          patient.diseases.map((d, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-rose-50 text-rose-800 rounded font-medium text-[11px] border border-rose-100">
                              {d.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">None documented</span>
                        )}
                      </div>
                    </div>

                    {/* Allergies */}
                    {hasAllergies && (
                      <div className="pt-1">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                          <span>Allergies: {patient.allergies.map(a => a.name).join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Record</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRunCheck(patient)}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition flex items-center gap-1 shadow-sm"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Check Risks</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(patient.patient_id)}
                      title="Delete Patient Record"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono font-semibold text-sky-600">{selectedPatient.patient_id}</span>
                    <span>•</span>
                    <span>{selectedPatient.gender}, {selectedPatient.age} years</span>
                    {selectedPatient.weight && (
                      <>
                        <span>•</span>
                        <span>{selectedPatient.weight} kg</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs text-slate-700">
              {/* Clinical Notes */}
              {selectedPatient.notes && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900 mb-1">Clinical Impressions / Notes:</div>
                  <p className="text-slate-600 leading-relaxed">{selectedPatient.notes}</p>
                </div>
              )}

              {/* Current Medications Detail */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
                  <Pill className="w-4 h-4 text-sky-600" /> Prescribed Medications
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {selectedPatient.medications?.map((m, i) => (
                    <div key={i} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50">
                      <div>
                        <div className="font-bold text-slate-900">{m.name}</div>
                        <div className="text-[11px] text-slate-500">{m.dosage || 'Standard dose'} • {m.frequency || 'Daily'}</div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{m.drugId}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diseases Detail */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
                  <HeartPulse className="w-4 h-4 text-rose-600" /> Active Diagnoses
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.diseases?.map((d, i) => (
                    <div key={i} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-medium">
                      {d.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies Detail */}
              {selectedPatient.allergies?.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Confirmed Allergies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((a, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 font-semibold">
                        {a.name} {a.allergenClass ? `(${a.allergenClass})` : ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medical History */}
              {selectedPatient.medicalHistory?.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-500">
                    <FileText className="w-4 h-4 text-indigo-600" /> Medical History
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.medicalHistory.map((h, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium">
                        {h.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRunCheck(selectedPatient);
                  setSelectedPatient(null);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Launch Graph Reasoning</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Delete Patient Record?</h3>
            <p className="text-xs text-slate-500 mb-5">
              Are you sure you want to remove patient <strong>{deleteConfirmId}</strong>? This action will remove all attached medications and history.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
