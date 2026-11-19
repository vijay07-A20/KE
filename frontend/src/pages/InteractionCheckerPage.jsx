import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2, 
  GitFork, FileDown, Plus, Trash2, ArrowRight, Pill, 
  HeartPulse, Sparkles, Activity, BookOpen, ExternalLink, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function InteractionCheckerPage({ selectedPatientId, setActivePage, setSelectedPatientId }) {
  const [patients, setPatients] = useState([]);
  const [selectedPid, setSelectedPid] = useState(selectedPatientId || '');
  const [availableDrugs, setAvailableDrugs] = useState([]);

  // Active Simulation State
  const [patientName, setPatientName] = useState('Eleanor Vance (Fictional)');
  const [age, setAge] = useState(72);
  const [drugs, setDrugs] = useState(['Warfarin', 'Aspirin']);
  const [diseases, setDiseases] = useState(['Atrial Fibrillation', 'Hypertension']);
  const [allergies, setAllergies] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState(['History of Major GI Bleeding']);

  // Tag inputs
  const [drugInput, setDrugInput] = useState('');
  const [diseaseInput, setDiseaseInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');
  const [historyInput, setHistoryInput] = useState('');

  // Execution & Results
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [savedReportId, setSavedReportId] = useState(null);

  useEffect(() => {
    // Load patients and drugs
    api.getPatients().then(p => {
      setPatients(p);
      if (selectedPatientId) {
        const found = p.find(item => item.patient_id === selectedPatientId || item.id === selectedPatientId);
        if (found) loadPatientProfile(found);
      }
    }).catch(() => {});

    api.getDrugs().then(d => setAvailableDrugs(d)).catch(() => {});
  }, [selectedPatientId]);

  const loadPatientProfile = (p) => {
    setSelectedPid(p.patient_id);
    setPatientName(p.name);
    setAge(p.age);
    setDrugs(p.medications ? p.medications.map(m => m.name) : []);
    setDiseases(p.diseases ? p.diseases.map(d => d.name) : []);
    setAllergies(p.allergies ? p.allergies.map(a => a.name) : []);
    setMedicalHistory(p.medicalHistory ? p.medicalHistory.map(h => h.name) : []);
    setResult(null);
    setSavedReportId(null);
  };

  const handlePatientSelect = (pid) => {
    setSelectedPid(pid);
    if (!pid) return;
    const p = patients.find(x => x.patient_id === pid);
    if (p) loadPatientProfile(p);
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setSavedReportId(null);
    try {
      const payload = {
        patientId: selectedPid || 'TEMP-SIM',
        patientName: patientName || 'Simulated Patient',
        age: parseInt(age, 10) || 45,
        drugs,
        diseases,
        allergies,
        medicalHistory
      };
      const res = await api.checkInteractions(payload);
      setResult(res);
    } catch (err) {
      alert("Error analyzing interactions: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDrug = (name) => {
    if (!name || drugs.includes(name)) return;
    setDrugs([...drugs, name]);
    setDrugInput('');
  };

  const handleRemoveDrug = (name) => {
    setDrugs(drugs.filter(d => d !== name));
  };

  const handleAddDisease = (name) => {
    if (!name || diseases.includes(name)) return;
    setDiseases([...diseases, name]);
    setDiseaseInput('');
  };

  const handleAddAllergy = (name) => {
    if (!name || allergies.includes(name)) return;
    setAllergies([...allergies, name]);
    setAllergyInput('');
  };

  const handleAddHistory = (name) => {
    if (!name || medicalHistory.includes(name)) return;
    setMedicalHistory([...medicalHistory, name]);
    setHistoryInput('');
  };

  const handleSaveReport = async () => {
    if (!result) return;
    try {
      const rep = await api.createReport({
        patientId: result.patientId,
        patientName: result.patientName,
        analysisResult: result,
        generatedBy: "Attending Physician"
      });
      setSavedReportId(rep.id);
    } catch (err) {
      alert("Failed to save report: " + err.message);
    }
  };

  const handleDownloadPdf = () => {
    if (savedReportId) {
      window.open(api.getPdfDownloadUrl(savedReportId), '_blank');
    } else {
      // Auto-save and download
      api.createReport({
        patientId: result.patientId,
        patientName: result.patientName,
        analysisResult: result,
        generatedBy: "Attending Physician"
      }).then(rep => {
        setSavedReportId(rep.id);
        window.open(api.getPdfDownloadUrl(rep.id), '_blank');
      });
    }
  };

  const handleJumpToGraph = () => {
    if (setSelectedPatientId && selectedPid) {
      setSelectedPatientId(selectedPid);
    }
    setActivePage('graph');
  };

  // Severity indicator color map
  const severityStyles = {
    Critical: {
      badge: 'bg-red-50 text-red-700 border-red-200',
      banner: 'bg-gradient-to-r from-red-600 to-rose-700 text-white',
      border: 'border-l-4 border-l-red-600',
      icon: AlertTriangle
    },
    High: {
      badge: 'bg-orange-50 text-orange-700 border-orange-200',
      banner: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white',
      border: 'border-l-4 border-l-orange-500',
      icon: AlertTriangle
    },
    Moderate: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      banner: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white',
      border: 'border-l-4 border-l-amber-500',
      icon: AlertCircle
    },
    Low: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      banner: 'bg-gradient-to-r from-blue-600 to-sky-600 text-white',
      border: 'border-l-4 border-l-blue-500',
      icon: Activity
    },
    Safe: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      banner: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
      border: 'border-l-4 border-l-emerald-500',
      icon: CheckCircle2
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-sky-600" />
            Clinical Drug Interaction & Risk Detection Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Knowledge graph-based multi-hop traversal evaluating DDI, contraindications, allergies, and age-related precautions
          </p>
        </div>
      </div>

      {/* Patient Selection & Simulation Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="w-full sm:w-80">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Select Registered Patient</label>
            <select
              value={selectedPid}
              onChange={(e) => handlePatientSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
            >
              <option value="">-- Custom Simulation (Ad-hoc) --</option>
              {patients.map(p => (
                <option key={p.id} value={p.patient_id}>
                  {p.name} ({p.patient_id}) - {p.gender}, {p.age}y
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-1/2 sm:w-36">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Patient Age</label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
              />
            </div>
            <div className="w-1/2 sm:w-56">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Regimen Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Medications to Check */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-sky-600" />
                Active Medications ({drugs.length})
              </span>
              <div className="flex items-center gap-1">
                <select
                  value={drugInput}
                  onChange={(e) => handleAddDrug(e.target.value)}
                  className="px-2 py-1 text-[11px] bg-white border border-slate-200 rounded-lg"
                >
                  <option value="">+ Add Formulary Drug...</option>
                  {availableDrugs.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[40px] items-center">
              {drugs.map(drug => (
                <span key={drug} className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-200 font-semibold text-[11px] flex items-center gap-1.5">
                  {drug}
                  <button onClick={() => handleRemoveDrug(drug)} className="text-sky-600 hover:text-red-600 font-bold">×</button>
                </span>
              ))}
              {drugs.length === 0 && <span className="text-slate-400 italic text-[11px]">No medications added yet</span>}
            </div>
          </div>

          {/* Diseases */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                Diagnosed Diseases ({diseases.length})
              </span>
              <select
                value={diseaseInput}
                onChange={(e) => handleAddDisease(e.target.value)}
                className="px-2 py-1 text-[11px] bg-white border border-slate-200 rounded-lg"
              >
                <option value="">+ Add Disease...</option>
                <option value="Atrial Fibrillation">Atrial Fibrillation</option>
                <option value="Hypertension">Hypertension</option>
                <option value="Type 2 Diabetes Mellitus">Type 2 Diabetes Mellitus</option>
                <option value="Chronic Kidney Disease (Stage 4-5)">Chronic Kidney Disease (Stage 4-5)</option>
                <option value="Peptic Ulcer Disease">Peptic Ulcer Disease</option>
                <option value="Congestive Heart Failure">Congestive Heart Failure</option>
                <option value="Hyperkalemia">Hyperkalemia</option>
                <option value="Long QT Syndrome">Long QT Syndrome</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[40px] items-center">
              {diseases.map(dis => (
                <span key={dis} className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-200 font-medium text-[11px] flex items-center gap-1.5">
                  {dis}
                  <button onClick={() => setDiseases(diseases.filter(d => d !== dis))} className="text-rose-600 hover:text-red-600 font-bold">×</button>
                </span>
              ))}
              {diseases.length === 0 && <span className="text-slate-400 italic text-[11px]">No diseases specified</span>}
            </div>
          </div>

          {/* Allergies */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Known Allergies ({allergies.length})
              </span>
              <select
                value={allergyInput}
                onChange={(e) => handleAddAllergy(e.target.value)}
                className="px-2 py-1 text-[11px] bg-white border border-slate-200 rounded-lg"
              >
                <option value="">+ Add Allergy...</option>
                <option value="Penicillin Allergy">Penicillin Allergy</option>
                <option value="NSAID Hypersensitivity">NSAID Hypersensitivity</option>
                <option value="Statin Intolerance / Myopathy">Statin Intolerance / Myopathy</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[40px] items-center">
              {allergies.map(al => (
                <span key={al} className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-[11px] flex items-center gap-1.5">
                  {al}
                  <button onClick={() => setAllergies(allergies.filter(a => a !== al))} className="text-amber-600 hover:text-red-600 font-bold">×</button>
                </span>
              ))}
              {allergies.length === 0 && <span className="text-slate-400 italic text-[11px]">No allergies reported (NKDA)</span>}
            </div>
          </div>

          {/* Medical History */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Relevant Medical History ({medicalHistory.length})
              </span>
              <select
                value={historyInput}
                onChange={(e) => handleAddHistory(e.target.value)}
                className="px-2 py-1 text-[11px] bg-white border border-slate-200 rounded-lg"
              >
                <option value="">+ Add History Item...</option>
                <option value="History of Major GI Bleeding">History of Major GI Bleeding</option>
                <option value="History of ACEi-Induced Angioedema">History of ACEi-Induced Angioedema</option>
                <option value="History of Ventricular Arrhythmia">History of Ventricular Arrhythmia</option>
                <option value="History of Acute Kidney Injury">History of Acute Kidney Injury</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[40px] items-center">
              {medicalHistory.map(mh => (
                <span key={mh} className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-200 font-medium text-[11px] flex items-center gap-1.5">
                  {mh}
                  <button onClick={() => setMedicalHistory(medicalHistory.filter(h => h !== mh))} className="text-indigo-600 hover:text-red-600 font-bold">×</button>
                </span>
              ))}
              {medicalHistory.length === 0 && <span className="text-slate-400 italic text-[11px]">Unremarkable history</span>}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleRunAnalysis}
            disabled={loading || drugs.length === 0}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/25 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            <span>{loading ? 'Traversing Knowledge Graph...' : 'Execute Knowledge Graph Reasoning'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Result Severity Banner */}
          {(() => {
            const riskConfig = severityStyles[result.overallRisk] || severityStyles.Safe;
            const Icon = riskConfig.icon;
            return (
              <div className={`p-6 rounded-2xl ${riskConfig.banner} shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-extrabold tracking-wider bg-white/25 px-2 py-0.5 rounded">
                        OVERALL STATUS: {result.overallRisk}
                      </span>
                      <span className="text-xs text-white/80 font-mono">
                        {result.findings?.length || 0} Rule Violations
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mt-1 text-white leading-tight">{result.riskSummary}</h3>
                  </div>
                </div>

                {/* Report and Graph Shortcuts */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleJumpToGraph}
                    className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <GitFork className="w-4 h-4 text-sky-600" />
                    <span>View Graph</span>
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/40 transition flex items-center gap-1.5"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Findings List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Identified Clinical Risks & Knowledge Graph Paths ({result.findings?.length || 0})
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Critical: {result.stats?.criticalCount || 0}
                </span>
                <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  High: {result.stats?.highCount || 0}
                </span>
              </div>
            </div>

            {result.findings?.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No Direct Interactions Detected</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  None of the prescribed drug pairs, disease contraindications, or allergy triggers triggered rules in the knowledge graph. Always maintain independent clinical judgment.
                </p>
              </div>
            ) : (
              result.findings.map((f, i) => {
                const sStyle = severityStyles[f.severity] || severityStyles.Moderate;
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden ${sStyle.border}`}
                  >
                    <div className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {f.category}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-0.5">{f.title}</h4>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border self-start sm:self-auto ${sStyle.badge}`}>
                          {f.severity} Severity
                        </span>
                      </div>

                      {/* Knowledge Graph Reasoning Path */}
                      <div className="mb-3.5 px-3 py-2 bg-sky-50/60 rounded-xl border border-sky-100/80 flex items-center gap-2 font-mono text-[11px] text-sky-800 overflow-x-auto">
                        <GitFork className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                        <span className="font-semibold text-slate-500 flex-shrink-0">Graph Path:</span>
                        <span>{f.graphPath}</span>
                      </div>

                      {/* Clinical Content Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <div>
                            <span className="font-bold text-slate-700">Clinical Explanation:</span>
                            <p className="text-slate-600 mt-0.5 leading-relaxed">{f.description}</p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">Pathophysiological Mechanism:</span>
                            <p className="text-slate-600 mt-0.5 leading-relaxed">{f.mechanism}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                            <span className="font-bold text-red-900">Expected Clinical Effect & Adverse Outcome:</span>
                            <p className="text-red-800 mt-0.5 font-medium leading-relaxed">{f.clinicalEffect}</p>
                          </div>
                          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                            <span className="font-bold text-emerald-900">Recommended Clinical Action:</span>
                            <p className="text-emerald-800 mt-0.5 font-semibold leading-relaxed">{f.recommendedAction}</p>
                          </div>
                        </div>
                      </div>

                      {/* Evidence Source Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span>Evidence Source: <strong>{f.evidenceSource}</strong></span>
                        </span>
                        <span className="font-semibold text-sky-600 flex items-center gap-1">
                          <span>Evidence Traceable</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
