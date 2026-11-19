import React, { useState, useEffect } from 'react';
import { 
  Pill, Search, Plus, Eye, Edit3, Trash2, Filter, 
  ShieldAlert, AlertTriangle, CheckCircle2, X, Activity, BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function DrugDatabasePage({ setActivePage }) {
  const [drugs, setDrugs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [activeModalDrug, setActiveModalDrug] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // New Drug Form State
  const [newDrug, setNewDrug] = useState({
    name: '',
    genericName: '',
    dosageForm: 'Oral Tablet (10mg, 20mg)',
    drugClass: 'Cardiovascular',
    commonUses: '',
    ageRestrictions: ''
  });

  useEffect(() => {
    loadData();
  }, [searchTerm, selectedClass]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [drugList, classList] = await Promise.all([
        api.getDrugs(searchTerm, selectedClass),
        api.getDrugClasses()
      ]);
      setDrugs(drugList);
      setClasses(classList);
    } catch (e) {
      console.error("Failed to load drugs:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDrug = async (e) => {
    e.preventDefault();
    try {
      await api.createDrug(newDrug);
      setIsAddModalOpen(false);
      setNewDrug({
        name: '',
        genericName: '',
        dosageForm: 'Oral Tablet (10mg, 20mg)',
        drugClass: 'Cardiovascular',
        commonUses: '',
        ageRestrictions: ''
      });
      loadData();
    } catch (err) {
      alert("Failed to add drug: " + err.message);
    }
  };

  const handleDeleteDrug = async (id) => {
    try {
      await api.deleteDrug(id);
      setDeleteConfirmId(null);
      if (activeModalDrug?.id === id) setActiveModalDrug(null);
      loadData();
    } catch (err) {
      alert("Failed to delete drug: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-sky-600" />
            Pharmacopeia & Drug Knowledge Database
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Clinical formulary linked with side effects, contraindications, and interaction graph paths
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-600/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Drug</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand or generic name..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700"
            >
              <option value="">All Pharmacological Classes</option>
              {classes.map((cls, idx) => (
                <option key={idx} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Formularies: <strong className="text-slate-800">{drugs.length}</strong>
        </div>
      </div>

      {/* Drug Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
            <Activity className="w-6 h-6 animate-spin text-sky-600 mr-2" />
            Querying Drug Knowledge Entities...
          </div>
        ) : drugs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <Pill className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-600">No drugs match your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
                  <th className="py-3 px-5">Brand Name</th>
                  <th className="py-3 px-5">Generic Compound</th>
                  <th className="py-3 px-5">Pharmacological Class</th>
                  <th className="py-3 px-5">Common Indications</th>
                  <th className="py-3 px-5">Known Interactions</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {drugs.map((drug) => (
                  <tr key={drug.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                        {drug.name.charAt(0)}
                      </div>
                      <span>{drug.name}</span>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-700">{drug.genericName}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {drug.drugClass}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 max-w-xs truncate text-slate-500">{drug.commonUses || 'Cardiovascular / Systemic'}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {drug.knownInteractions?.length || 0} In Graph
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1">
                      <button
                        onClick={() => setActiveModalDrug(drug)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(drug.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drug Details Modal */}
      {activeModalDrug && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-base">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeModalDrug.name}</h3>
                  <p className="text-xs text-slate-500">{activeModalDrug.genericName} • {activeModalDrug.dosageForm}</p>
                </div>
              </div>
              <button onClick={() => setActiveModalDrug(null)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-800 mb-1">Common Clinical Indications:</div>
                <p className="text-slate-600">{activeModalDrug.commonUses || 'None provided'}</p>
              </div>

              {activeModalDrug.ageRestrictions && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Age & Population Warnings:
                  </div>
                  <p className="text-amber-800">{activeModalDrug.ageRestrictions}</p>
                </div>
              )}

              {/* Side Effects */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 text-slate-500">
                  Documented Adverse Effects
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalDrug.sideEffects?.length > 0 ? (
                    activeModalDrug.sideEffects.map((se, i) => (
                      <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 font-medium">
                        {se}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None documented in current knowledge slice</span>
                  )}
                </div>
              </div>

              {/* Contraindications */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 text-slate-500">
                  Clinical Contraindications
                </h4>
                <div className="space-y-1">
                  {activeModalDrug.contraindications?.length > 0 ? (
                    activeModalDrug.contraindications.map((c, i) => (
                      <div key={i} className="p-2 bg-red-50 text-red-900 rounded-lg border border-red-200 font-medium">
                        {c}
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No direct disease contraindications recorded</span>
                  )}
                </div>
              </div>

              {/* Known Graph Interactions */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 text-slate-500">
                  Knowledge Graph Drug Interactions
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {activeModalDrug.knownInteractions?.map((intItem, i) => (
                    <div key={i} className="p-2.5 bg-white text-slate-700 font-medium">
                      {intItem}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModalDrug(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-semibold text-xs text-slate-700 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Drug Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-600" />
                Add New Drug Entity to Graph
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDrug} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brand / Common Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apixaban"
                  value={newDrug.name}
                  onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Generic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apixaban"
                  value={newDrug.genericName}
                  onChange={(e) => setNewDrug({ ...newDrug, genericName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Drug Class</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Direct Oral Anticoagulant (DOAC)"
                    value={newDrug.drugClass}
                    onChange={(e) => setNewDrug({ ...newDrug, drugClass: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oral Tablet (2.5mg, 5mg)"
                    value={newDrug.dosageForm}
                    onChange={(e) => setNewDrug({ ...newDrug, dosageForm: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Common Indications / Uses</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Nonvalvular atrial fibrillation stroke prophylaxis, DVT/PE treatment"
                  value={newDrug.commonUses}
                  onChange={(e) => setNewDrug({ ...newDrug, commonUses: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age / Special Population Cautions</label>
                <input
                  type="text"
                  placeholder="e.g. Dose reduction in elderly with serum creatinine >= 1.5 mg/dL"
                  value={newDrug.ageRestrictions}
                  onChange={(e) => setNewDrug({ ...newDrug, ageRestrictions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Save Drug Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-2" />
            <h3 className="font-bold text-slate-900 text-sm mb-1">Remove Drug Entity?</h3>
            <p className="text-xs text-slate-500 mb-4">This will remove this drug and its connected edges from the Knowledge Graph.</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button onClick={() => handleDeleteDrug(deleteConfirmId)} className="px-4 py-1.5 text-xs bg-red-600 text-white rounded-lg font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
