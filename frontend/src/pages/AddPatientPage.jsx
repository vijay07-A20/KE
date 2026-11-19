import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Pill, HeartPulse, AlertCircle, FileText, 
  Plus, Trash2, CheckCircle2, ChevronRight, Stethoscope 
} from 'lucide-react';
import { api } from '../services/api';

export default function AddPatientPage({ setActivePage, setSelectedPatientId }) {
  const [patientId, setPatientId] = useState(`PAT-00${Math.floor(Math.random() * 900 + 100)}`);
  const [name, setName] = useState('');
  const [age, setAge] = useState(65);
  const [gender, setGender] = useState('Male');
  const [weight, setWeight] = useState(70.0);
  const [notes, setNotes] = useState('');

  // Dynamic Lists
  const [medications, setMedications] = useState([
    { drugId: 'drug-warfarin', name: 'Warfarin', dosage: '5 mg', frequency: 'Once daily' }
  ]);
  const [diseases, setDiseases] = useState([
    { diseaseId: 'dis-afib', name: 'Atrial Fibrillation' }
  ]);
  const [allergies, setAllergies] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);

  // Form helpers
  const [availableDrugs, setAvailableDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.getDrugs().then(drugs => setAvailableDrugs(drugs)).catch(() => {});
  }, []);

  // Common quick-add items
  const quickDiseases = [
    { diseaseId: 'dis-afib', name: 'Atrial Fibrillation' },
    { diseaseId: 'dis-htn', name: 'Hypertension' },
    { diseaseId: 'dis-t2d', name: 'Type 2 Diabetes Mellitus' },
    { diseaseId: 'dis-ckd', name: 'Chronic Kidney Disease (Stage 4-5)' },
    { diseaseId: 'dis-pud', name: 'Peptic Ulcer Disease' },
    { diseaseId: 'dis-chf', name: 'Congestive Heart Failure' },
    { diseaseId: 'dis-hyperk', name: 'Hyperkalemia' },
    { diseaseId: 'dis-qt', name: 'Long QT Syndrome' }
  ];

  const quickAllergies = [
    { allergyId: 'al-penicillin', name: 'Penicillin Allergy', allergenClass: 'Penicillin Antibiotic' },
    { allergyId: 'al-nsaid', name: 'NSAID Hypersensitivity', allergenClass: 'Nonsteroidal Anti-inflammatory Drug (NSAID)' },
    { allergyId: 'al-statin', name: 'Statin Intolerance / Myopathy', allergenClass: 'HMG-CoA Reductase Inhibitor (Statin)' }
  ];

  const quickHistory = [
    { historyId: 'mh-gi-bleed', name: 'History of Major GI Bleeding' },
    { historyId: 'mh-angioedema', name: 'History of ACEi-Induced Angioedema' },
    { historyId: 'mh-arrhythmia', name: 'History of Ventricular Arrhythmia' },
    { historyId: 'mh-renal-fail', name: 'History of Acute Kidney Injury' }
  ];

  const handleAddMedication = () => {
    setMedications([...medications, { drugId: '', name: '', dosage: 'Standard', frequency: 'Daily' }]);
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    if (field === 'drugId') {
      const match = availableDrugs.find(d => d.id === value);
      if (match) updated[index].name = match.name;
    }
    setMedications(updated);
  };

  const handleRemoveMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleToggleDisease = (d) => {
    if (diseases.some(x => x.diseaseId === d.diseaseId)) {
      setDiseases(diseases.filter(x => x.diseaseId !== d.diseaseId));
    } else {
      setDiseases([...diseases, d]);
    }
  };

  const handleToggleAllergy = (a) => {
    if (allergies.some(x => x.allergyId === a.allergyId)) {
      setAllergies(allergies.filter(x => x.allergyId !== a.allergyId));
    } else {
      setAllergies([...allergies, a]);
    }
  };

  const handleToggleHistory = (h) => {
    if (medicalHistory.some(x => x.historyId === h.historyId)) {
      setMedicalHistory(medicalHistory.filter(x => x.historyId !== h.historyId));
    } else {
      setMedicalHistory([...medicalHistory, h]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter patient name.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patient_id: patientId,
        name: name.trim() + " (Fictional)",
        age: parseInt(age, 10),
        gender,
        weight: weight ? parseFloat(weight) : null,
        notes,
        medications: medications.filter(m => m.name.trim() !== ''),
        diseases,
        allergies,
        medicalHistory
      };

      await api.createPatient(payload);
      setSuccess(true);
      if (setSelectedPatientId) setSelectedPatientId(patientId);

      setTimeout(() => {
        setActivePage('checker');
      }, 1200);
    } catch (err) {
      alert("Failed to register patient: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-sky-600" />
          Patient Clinical Registration
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter clinical demographics, active medications, diseases, allergies, and historical contraindications
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm font-semibold shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Patient registered successfully! Redirecting to Clinical Interaction Checker...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Demographics Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            1. Patient Demographics (Fictional Demo Data)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patient ID</label>
              <input
                type="text"
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Johnathan Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                required
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg, optional)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Impressions / Notes</label>
              <input
                type="text"
                placeholder="e.g. History of chronic palpitations; monitoring renal clearance..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Current Medications Dynamic List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-sky-600" />
                2. Current Prescriptions & Medications
              </h3>
              <p className="text-xs text-slate-500">Active medications being taken by the patient</p>
            </div>
            <button
              type="button"
              onClick={handleAddMedication}
              className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medication</span>
            </button>
          </div>

          <div className="space-y-3">
            {medications.map((med, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="w-full sm:w-1/3">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Drug Selection</label>
                  <select
                    value={med.drugId}
                    onChange={(e) => handleMedChange(idx, 'drugId', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">Select formulary drug...</option>
                    {availableDrugs.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.drugClass})</option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-1/4">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Drug Name (or custom)</label>
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                    placeholder="e.g. Warfarin"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="w-full sm:w-1/4">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Dosage</label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                    placeholder="e.g. 5 mg"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="w-full sm:w-1/4">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">Frequency</label>
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                    placeholder="e.g. Once daily"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveMedication(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg self-end sm:self-center mt-2 sm:mt-4 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosed Diseases Multi-Select */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            3. Diagnosed Diseases & Medical Conditions
          </h3>
          <p className="text-xs text-slate-500">Toggle active diagnoses to trigger disease-drug contraindication checks</p>

          <div className="flex flex-wrap gap-2 pt-1">
            {quickDiseases.map(d => {
              const active = diseases.some(x => x.diseaseId === d.diseaseId);
              return (
                <button
                  key={d.diseaseId}
                  type="button"
                  onClick={() => handleToggleDisease(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {d.name} {active && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Known Allergies */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            4. Known Drug Hypersensitivities & Allergies
          </h3>
          <p className="text-xs text-slate-500">Known immunologic reactions or drug intolerance</p>

          <div className="flex flex-wrap gap-2 pt-1">
            {quickAllergies.map(a => {
              const active = allergies.some(x => x.allergyId === a.allergyId);
              return (
                <button
                  key={a.allergyId}
                  type="button"
                  onClick={() => handleToggleAllergy(a)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {a.name} {active && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Past Medical History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            5. Relevant Medical History
          </h3>
          <p className="text-xs text-slate-500">Historical episodes that present ongoing pharmacotherapy risks</p>

          <div className="flex flex-wrap gap-2 pt-1">
            {quickHistory.map(h => {
              const active = medicalHistory.some(x => x.historyId === h.historyId);
              return (
                <button
                  key={h.historyId}
                  type="button"
                  onClick={() => handleToggleHistory(h)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {h.name} {active && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submission Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActivePage('patients')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/25 transition flex items-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Saving Patient...' : 'Save & Check Interactions'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
