import logging
from typing import Dict, Any, List, Optional, Set
import networkx as nx
from app.knowledge_graph.knowledge_data import INITIAL_NODES, INITIAL_EDGES, INITIAL_PATIENTS
from app.knowledge_graph.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)

class GraphEngine:
    def __init__(self):
        self.graph = nx.MultiDiGraph()
        self.nodes_data: Dict[str, Dict[str, Any]] = {}
        self.edges_data: List[Dict[str, Any]] = []
        self._initialize_graph()

    def _initialize_graph(self):
        """Load medically verified nodes and edges into graph."""
        self.graph.clear()
        self.nodes_data.clear()
        self.edges_data.clear()

        # Load initial nodes
        for node in INITIAL_NODES:
            self.nodes_data[node["id"]] = node
            self.graph.add_node(node["id"], **node)

        # Load initial edges
        for edge in INITIAL_EDGES:
            self.edges_data.append(edge)
            self.graph.add_edge(
                edge["source"],
                edge["target"],
                key=edge.get("type", "RELATED_TO"),
                type=edge.get("type", "RELATED_TO"),
                properties=edge.get("properties", {})
            )

        logger.info(f"Graph initialized with {self.graph.number_of_nodes()} nodes and {self.graph.number_of_edges()} edges.")
        
        # Sync with Neo4j if available
        if neo4j_client.is_connected():
            neo4j_client.sync_knowledge_graph(INITIAL_NODES, INITIAL_EDGES)

    def get_full_graph(self) -> Dict[str, Any]:
        """Returns all nodes and edges formatted for React Flow visualization."""
        nodes = []
        edges = []

        # Color mapping for node types
        color_map = {
            "Drug": {"bg": "#eff6ff", "border": "#3b82f6", "text": "#1d4ed8", "badge": "Drug"},
            "Disease": {"bg": "#fef2f2", "border": "#ef4444", "text": "#b91c1c", "badge": "Disease"},
            "DrugClass": {"bg": "#f0fdf4", "border": "#22c55e", "text": "#15803d", "badge": "Class"},
            "Allergy": {"bg": "#fffbeb", "border": "#f59e0b", "text": "#b45309", "badge": "Allergy"},
            "SideEffect": {"bg": "#fff1f2", "border": "#f43f5e", "text": "#be123c", "badge": "Side Effect"},
            "MedicalHistory": {"bg": "#f5f3ff", "border": "#8b5cf6", "text": "#6d28d9", "badge": "Med History"},
            "AgeGroup": {"bg": "#f0fdfa", "border": "#14b8a6", "text": "#0f766e", "badge": "Age Group"},
            "Patient": {"bg": "#faf5ff", "border": "#a855f7", "text": "#7e22ce", "badge": "Patient"},
        }

        # Calculate coordinates using circular or spring layout for neat visual appearance
        try:
            pos = nx.spring_layout(self.graph, k=0.85, iterations=40, seed=42)
        except Exception:
            pos = {}

        for nid, data in self.nodes_data.items():
            label = data.get("label", "Entity")
            styling = color_map.get(label, {"bg": "#f8fafc", "border": "#64748b", "text": "#334155", "badge": label})
            
            coord = pos.get(nid, [0.0, 0.0])
            x_pos = int((coord[0] + 1.0) * 550) + 50
            y_pos = int((coord[1] + 1.0) * 450) + 50

            nodes.append({
                "id": nid,
                "label": label,
                "name": data.get("name", nid),
                "properties": data.get("properties", {}),
                "position": {"x": x_pos, "y": y_pos},
                "style": styling
            })

        for idx, edge in enumerate(self.edges_data):
            rel_type = edge.get("type", "RELATED_TO")
            props = edge.get("properties", {})
            severity = props.get("severity", "Normal")
            
            # Severity color mapping for edges
            severity_colors = {
                "Critical": "#dc2626", # deep red
                "High": "#ea580c",     # orange
                "Moderate": "#d97706", # amber
                "Low": "#2563eb",      # blue
                "Normal": "#94a3b8"    # slate
            }

            color = severity_colors.get(severity, "#94a3b8")
            is_critical = severity in ["Critical", "High"]

            edges.append({
                "id": f"e-{edge['source']}-{edge['target']}-{idx}",
                "source": edge["source"],
                "target": edge["target"],
                "type": rel_type,
                "label": rel_type.replace("_", " "),
                "severity": severity,
                "properties": props,
                "style": {
                    "stroke": color,
                    "strokeWidth": 3 if is_critical else 1.5,
                    "strokeDasharray": "5,5" if rel_type == "DRUG_CONTRAINDICATED_FOR" else "none"
                },
                "animated": is_critical
            })

        return {"nodes": nodes, "edges": edges}

    def get_patient_subgraph(
        self,
        patient_id: str,
        patient_name: str,
        patient_age: int,
        medication_ids: List[str],
        disease_ids: List[str],
        allergy_ids: List[str],
        history_ids: List[str]
    ) -> Dict[str, Any]:
        """Constructs a patient-specific subgraph highlighting their conditions, medications, and interaction paths."""
        sub_nodes: Dict[str, Dict[str, Any]] = {}
        sub_edges: List[Dict[str, Any]] = []

        # 1. Patient Center Node
        pat_node_id = f"pat-{patient_id}"
        sub_nodes[pat_node_id] = {
            "id": pat_node_id,
            "label": "Patient",
            "name": f"{patient_name} (Age: {patient_age})",
            "properties": {"patientId": patient_id, "age": patient_age},
            "position": {"x": 450, "y": 300},
            "style": {"bg": "#faf5ff", "border": "#9333ea", "text": "#6b21a8", "badge": "Active Patient"}
        }

        # 2. Add Patient Medications
        med_set = set(medication_ids)
        for i, mid in enumerate(medication_ids):
            if mid in self.nodes_data:
                node = self.nodes_data[mid]
                sub_nodes[mid] = {
                    "id": mid,
                    "label": "Drug",
                    "name": node.get("name", mid),
                    "properties": node.get("properties", {}),
                    "position": {"x": 150 + (i * 180), "y": 120},
                    "style": {"bg": "#eff6ff", "border": "#2563eb", "text": "#1e40af", "badge": "Prescribed Drug"}
                }
                sub_edges.append({
                    "id": f"e-pat-takes-{mid}",
                    "source": pat_node_id,
                    "target": mid,
                    "type": "PATIENT_TAKES",
                    "label": "TAKES",
                    "severity": "Normal",
                    "style": {"stroke": "#3b82f6", "strokeWidth": 2},
                    "animated": False
                })

        # 3. Add Patient Diseases
        for j, dis_id in enumerate(disease_ids):
            if dis_id in self.nodes_data:
                node = self.nodes_data[dis_id]
                sub_nodes[dis_id] = {
                    "id": dis_id,
                    "label": "Disease",
                    "name": node.get("name", dis_id),
                    "properties": node.get("properties", {}),
                    "position": {"x": 120 + (j * 200), "y": 480},
                    "style": {"bg": "#fef2f2", "border": "#dc2626", "text": "#991b1b", "badge": "Diagnosed Condition"}
                }
                sub_edges.append({
                    "id": f"e-pat-has-{dis_id}",
                    "source": pat_node_id,
                    "target": dis_id,
                    "type": "PATIENT_HAS",
                    "label": "HAS CONDITION",
                    "severity": "Normal",
                    "style": {"stroke": "#ef4444", "strokeWidth": 2},
                    "animated": False
                })

        # 4. Add Allergies
        for k, al_id in enumerate(allergy_ids):
            if al_id in self.nodes_data:
                node = self.nodes_data[al_id]
                sub_nodes[al_id] = {
                    "id": al_id,
                    "label": "Allergy",
                    "name": node.get("name", al_id),
                    "properties": node.get("properties", {}),
                    "position": {"x": 750 + (k * 180), "y": 300},
                    "style": {"bg": "#fffbeb", "border": "#d97706", "text": "#92400e", "badge": "Confirmed Allergy"}
                }
                sub_edges.append({
                    "id": f"e-pat-allergy-{al_id}",
                    "source": pat_node_id,
                    "target": al_id,
                    "type": "PATIENT_ALLERGIC_TO",
                    "label": "ALLERGIC TO",
                    "severity": "High",
                    "style": {"stroke": "#f59e0b", "strokeWidth": 2},
                    "animated": True
                })

        # 5. Add Medical History
        for m, mh_id in enumerate(history_ids):
            if mh_id in self.nodes_data:
                node = self.nodes_data[mh_id]
                sub_nodes[mh_id] = {
                    "id": mh_id,
                    "label": "MedicalHistory",
                    "name": node.get("name", mh_id),
                    "properties": node.get("properties", {}),
                    "position": {"x": 720 + (m * 180), "y": 450},
                    "style": {"bg": "#f5f3ff", "border": "#7c3aed", "text": "#5b21b6", "badge": "Past History"}
                }
                sub_edges.append({
                    "id": f"e-pat-history-{mh_id}",
                    "source": pat_node_id,
                    "target": mh_id,
                    "type": "PATIENT_HAS_HISTORY_OF",
                    "label": "HISTORY OF",
                    "severity": "Normal",
                    "style": {"stroke": "#8b5cf6", "strokeWidth": 2},
                    "animated": False
                })

        # 6. Include Interactions, Contraindications & Side Effects among the patient's active entities
        all_active_ids = set(sub_nodes.keys())

        for edge in self.edges_data:
            src = edge["source"]
            tgt = edge["target"]
            rel_type = edge["type"]
            props = edge.get("properties", {})
            sev = props.get("severity", "Normal")

            # Check if this edge links two entities the patient has/takes
            if src in med_set and tgt in med_set and rel_type == "DRUG_INTERACTS_WITH":
                sub_edges.append({
                    "id": f"e-sub-ddi-{src}-{tgt}",
                    "source": src,
                    "target": tgt,
                    "type": rel_type,
                    "label": f"INTERACTS ({sev})",
                    "severity": sev,
                    "properties": props,
                    "style": {"stroke": "#dc2626" if sev == "Critical" else "#ea580c", "strokeWidth": 4, "strokeDasharray": "3,3"},
                    "animated": True
                })
            elif src in med_set and tgt in disease_ids and rel_type == "DRUG_CONTRAINDICATED_FOR":
                sub_edges.append({
                    "id": f"e-sub-contra-{src}-{tgt}",
                    "source": src,
                    "target": tgt,
                    "type": rel_type,
                    "label": f"CONTRAINDICATED ({sev})",
                    "severity": sev,
                    "properties": props,
                    "style": {"stroke": "#dc2626", "strokeWidth": 3.5, "strokeDasharray": "5,5"},
                    "animated": True
                })
            elif src in med_set and tgt in allergy_ids and rel_type == "DRUG_TRIGGERS_ALLERGY":
                sub_edges.append({
                    "id": f"e-sub-allergy-{src}-{tgt}",
                    "source": src,
                    "target": tgt,
                    "type": rel_type,
                    "label": f"ALLERGY TRIGGER ({sev})",
                    "severity": sev,
                    "properties": props,
                    "style": {"stroke": "#dc2626", "strokeWidth": 4},
                    "animated": True
                })
            elif src in med_set and tgt in history_ids:
                sub_edges.append({
                    "id": f"e-sub-hist-{src}-{tgt}",
                    "source": src,
                    "target": tgt,
                    "type": rel_type,
                    "label": f"HISTORY RISK ({sev})",
                    "severity": sev,
                    "properties": props,
                    "style": {"stroke": "#ea580c", "strokeWidth": 3},
                    "animated": True
                })

        return {"nodes": list(sub_nodes.values()), "edges": sub_edges}

    def get_drug_ego_network(self, drug_id: str) -> Dict[str, Any]:
        """Returns 1-hop ego network for a specific drug."""
        if drug_id not in self.nodes_data:
            return {"nodes": [], "edges": []}

        sub_node_ids = {drug_id}
        for u, v, data in self.graph.edges(data=True):
            if u == drug_id:
                sub_node_ids.add(v)
            elif v == drug_id:
                sub_node_ids.add(u)

        nodes = []
        for nid in sub_node_ids:
            if nid in self.nodes_data:
                nodes.append(self.nodes_data[nid])

        edges = []
        for edge in self.edges_data:
            if edge["source"] in sub_node_ids and edge["target"] in sub_node_ids:
                edges.append(edge)

        return {"nodes": nodes, "edges": edges}

    def get_graph_stats(self) -> Dict[str, Any]:
        """Provides node and edge counts aggregated by type."""
        node_counts = {}
        for node in self.nodes_data.values():
            lbl = node.get("label", "Entity")
            node_counts[lbl] = node_counts.get(lbl, 0) + 1

        rel_counts = {}
        for edge in self.edges_data:
            rtype = edge.get("type", "RELATED_TO")
            rel_counts[rtype] = rel_counts.get(rtype, 0) + 1

        interaction_count = sum(1 for e in self.edges_data if e.get("type") == "DRUG_INTERACTS_WITH")
        contraindication_count = sum(1 for e in self.edges_data if e.get("type") == "DRUG_CONTRAINDICATED_FOR")

        return {
            "totalNodes": len(self.nodes_data),
            "totalEdges": len(self.edges_data),
            "nodeTypes": node_counts,
            "relationshipTypes": rel_counts,
            "totalInteractions": interaction_count,
            "totalContraindications": contraindication_count,
            "neo4jConnected": neo4j_client.is_connected()
        }

    def add_custom_drug(self, drug_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add new drug to graph database."""
        drug_id = drug_data.get("id") or f"drug-{drug_data['name'].lower().replace(' ', '-')}"
        new_node = {
            "id": drug_id,
            "label": "Drug",
            "name": drug_data["name"],
            "properties": {
                "genericName": drug_data.get("genericName", drug_data["name"]),
                "dosageForm": drug_data.get("dosageForm", "Oral Tablet"),
                "drugClass": drug_data.get("drugClass", "Unclassified"),
                "commonUses": drug_data.get("commonUses", ""),
                "ageRestrictions": drug_data.get("ageRestrictions", "")
            }
        }
        self.nodes_data[drug_id] = new_node
        self.graph.add_node(drug_id, **new_node)
        return new_node

    def delete_drug(self, drug_id: str):
        """Remove drug and associated edges."""
        if drug_id in self.nodes_data:
            del self.nodes_data[drug_id]
        if self.graph.has_node(drug_id):
            self.graph.remove_node(drug_id)
        self.edges_data = [e for e in self.edges_data if e["source"] != drug_id and e["target"] != drug_id]

graph_engine = GraphEngine()
