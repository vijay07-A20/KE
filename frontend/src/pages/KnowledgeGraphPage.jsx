import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  GitFork, Search, Filter, ZoomIn, ZoomOut, Maximize2, 
  RotateCcw, Info, X, ShieldAlert, Pill, HeartPulse, 
  AlertCircle, Users, Sparkles, Activity
} from 'lucide-react';
import { api } from '../services/api';

export default function KnowledgeGraphPage({ selectedPatientId, setSelectedPatientId }) {
  const [patients, setPatients] = useState([]);
  const [activePid, setActivePid] = useState(selectedPatientId || 'PAT-001');
  const [graphMode, setGraphMode] = useState(selectedPatientId ? 'patient' : 'patient'); // 'patient' or 'full'

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  // Inspector State
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Drug', 'Disease', 'Allergy', 'Patient'

  // Load Patient list on mount
  useEffect(() => {
    api.getPatients().then(p => {
      setPatients(p);
      if (selectedPatientId && !activePid) {
        setActivePid(selectedPatientId);
      }
    }).catch(() => {});
  }, [selectedPatientId]);

  // Load Graph data when mode or activePid changes
  useEffect(() => {
    loadGraph();
  }, [graphMode, activePid]);

  const loadGraph = async () => {
    setLoading(true);
    setSelectedNode(null);
    try {
      let data;
      if (graphMode === 'patient' && activePid) {
        data = await api.getPatientGraph(activePid);
      } else {
        data = await api.getFullGraph();
      }

      // Transform nodes into React Flow nodes
      const rfNodes = (data.nodes || []).map((n) => {
        const styling = n.style || {};
        return {
          id: n.id,
          position: n.position || { x: Math.random() * 500, y: Math.random() * 400 },
          data: { 
            label: (
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  {styling.badge || n.label}
                </span>
                <span className="font-bold text-xs text-slate-800 text-center line-clamp-2">
                  {n.name}
                </span>
              </div>
            ),
            raw: n
          },
          style: {
            background: styling.bg || '#ffffff',
            border: `2px solid ${styling.border || '#94a3b8'}`,
            borderRadius: '14px',
            padding: '10px 14px',
            color: styling.text || '#0f172a',
            fontSize: '12px',
            minWidth: 140,
            maxWidth: 200,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            cursor: 'pointer'
          }
        };
      });

      // Transform edges
      const rfEdges = (data.edges || []).map((e) => {
        const isCritical = e.severity === 'Critical';
        const isHigh = e.severity === 'High';
        const strokeColor = isCritical ? '#dc2626' : isHigh ? '#ea580c' : e.style?.stroke || '#94a3b8';

        return {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          animated: isCritical || isHigh,
          style: {
            stroke: strokeColor,
            strokeWidth: isCritical ? 3.5 : isHigh ? 2.5 : 1.5,
            strokeDasharray: e.style?.strokeDasharray || 'none',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: strokeColor,
            width: 16,
            height: 16,
          },
          labelStyle: {
            fill: strokeColor,
            fontWeight: 700,
            fontSize: 10
          },
          labelBgStyle: {
            fill: '#ffffff',
            fillOpacity: 0.85,
            rx: 4,
            ry: 4
          },
          data: e
        };
      });

      setNodes(rfNodes);
      setEdges(rfEdges);
    } catch (err) {
      console.error("Failed to load knowledge graph data:", err);
    } finally {
      setLoading(false);
    }
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data?.raw || null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Filter nodes visually by type
  const filteredNodes = useMemo(() => {
    if (activeFilter === 'All' && !searchTerm) return nodes;

    const term = searchTerm.toLowerCase();
    return nodes.map(n => {
      const raw = n.data?.raw || {};
      const label = raw.label || '';
      const name = (raw.name || '').toLowerCase();
      
      const matchesFilter = activeFilter === 'All' || label.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = !term || name.includes(term);

      return {
        ...n,
        hidden: !(matchesFilter && matchesSearch)
      };
    });
  }, [nodes, activeFilter, searchTerm]);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-3">
      {/* Top Knowledge Graph Control Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setGraphMode('patient')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                graphMode === 'patient' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patient Subgraph
            </button>
            <button
              onClick={() => setGraphMode('full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                graphMode === 'full' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Global Knowledge Graph
            </button>
          </div>

          {/* Patient Selector (When in patient mode) */}
          {graphMode === 'patient' && (
            <select
              value={activePid}
              onChange={(e) => {
                setActivePid(e.target.value);
                if (setSelectedPatientId) setSelectedPatientId(e.target.value);
              }}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-800"
            >
              {patients.map(p => (
                <option key={p.id} value={p.patient_id}>
                  {p.name} ({p.patient_id})
                </option>
              ))}
            </select>
          )}

          {/* Node Category Filters */}
          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-200 text-xs">
            {['All', 'Drug', 'Disease', 'Allergy'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeFilter === cat ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Statistics */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search graph nodes..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            onClick={loadGraph}
            title="Reset View / Reload Graph"
            className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl border border-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas + Side Drawer Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden flex">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="flex flex-col items-center gap-2">
              <Activity className="w-8 h-8 text-sky-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-600">Rendering Knowledge Graph Relationships...</p>
            </div>
          </div>
        ) : null}

        {/* React Flow Visualizer Canvas */}
        <div className="flex-1 h-full w-full">
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="#cbd5e1" gap={20} size={1} />
            <Controls className="bg-white border border-slate-200 shadow-md rounded-xl p-1" />
            <MiniMap 
              nodeColor={(n) => n.style?.border || '#3b82f6'} 
              className="border border-slate-200 rounded-xl shadow-md overflow-hidden" 
              zoomable 
              pannable 
            />
          </ReactFlow>
        </div>

        {/* Legend Overlay at bottom-left */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-[11px] space-y-1.5 pointer-events-auto max-w-xs z-10 hidden sm:block">
          <div className="font-bold text-slate-800 text-xs mb-1">Graph Legend</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-600">Drug</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-600">Disease</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">Allergy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-slate-600">Patient</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 flex items-center gap-2">
            <span className="w-4 h-0.5 bg-red-600"></span>
            <span className="text-red-700 font-bold text-[10px]">Critical / High Risk Edge</span>
          </div>
        </div>

        {/* Node Detail Inspector Drawer */}
        {selectedNode && (
          <div className="w-80 md:w-96 bg-white border-l border-slate-200 shadow-2xl p-5 overflow-y-auto flex-shrink-0 z-20 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                    {selectedNode.label}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1">{selectedNode.name}</h3>
                  <div className="font-mono text-[10px] text-slate-400">{selectedNode.id}</div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Node Properties */}
              <div className="space-y-3 text-xs">
                {Object.entries(selectedNode.properties || {}).map(([key, val]) => (
                  <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-0.5">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-medium text-slate-800 break-words leading-relaxed">
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6">
              <button
                onClick={() => setSelectedNode(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Close Drawer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
