import logging
from typing import Dict, Any, List, Optional, Tuple, Set
from app.knowledge_graph.graph_engine import graph_engine

logger = logging.getLogger(__name__)

class ClinicalReasoningEngine:
    """
    Rule-based and Graph-traversal Reasoning Engine for Clinical Decision Support.
    Analyzes:
    - Drug-Drug Interactions
    - Drug-Disease Contraindications
    - Drug-Allergy Hypersensitivities
    - Age-Related Beers Criteria / Pediatric Precautions
    - Past Medical History Precautions
    """

    def _normalize_id(self, item: str, item_type: str) -> Optional[str]:
        """Resolves an ID or display name to a canonical graph node ID."""
        if not item:
            return None
        
        # Check direct match in graph
        if item in graph_engine.nodes_data:
            return item

        # Search by lowercase name or ID
        item_lower = item.strip().lower()
        for nid, node in graph_engine.nodes_data.items():
            if node.get("label", "").lower() == item_type.lower() or item_type == "any":
                if nid.lower() == item_lower or node.get("name", "").lower() == item_lower:
                    return nid
                props = node.get("properties", {})
                if props.get("genericName", "").lower() == item_lower:
                    return nid

        return None

    def analyze(
        self,
        patient_id: Optional[str] = None,
        patient_name: str = "Unknown Patient",
        age: int = 45,
        drugs: List[str] = [],
        diseases: List[str] = [],
        allergies: List[str] = [],
        medical_history: List[str] = []
    ) -> Dict[str, Any]:
        """Executes full multi-hop graph traversal and rule-based clinical evaluation."""

        # 1. Resolve Canonical IDs
        resolved_drugs = []
        for d in drugs:
            norm = self._normalize_id(d, "Drug")
            if norm:
                resolved_drugs.append(norm)

        resolved_diseases = []
        for dis in diseases:
            norm = self._normalize_id(dis, "Disease")
            if norm:
                resolved_diseases.append(norm)

        resolved_allergies = []
        for al in allergies:
            norm = self._normalize_id(al, "Allergy")
            if norm:
                resolved_allergies.append(norm)

        resolved_history = []
        for mh in medical_history:
            norm = self._normalize_id(mh, "MedicalHistory")
            if norm:
                resolved_history.append(norm)

        # 2. Determine Age Group Node
        age_group_id = "ag-adult"
        if age >= 65:
            age_group_id = "ag-geriatric"
        elif age < 18:
            age_group_id = "ag-pediatric"

        # Collections for detected findings
        ddi_findings: List[Dict[str, Any]] = []
        contraindication_findings: List[Dict[str, Any]] = []
        allergy_findings: List[Dict[str, Any]] = []
        age_findings: List[Dict[str, Any]] = []
        history_findings: List[Dict[str, Any]] = []

        seen_ddi_pairs: Set[Tuple[str, str]] = set()

        # -------------------------------------------------------------
        # Rule 1: Drug-Drug Interactions (DDI)
        # -------------------------------------------------------------
        for i in range(len(resolved_drugs)):
            for j in range(i + 1, len(resolved_drugs)):
                d1 = resolved_drugs[i]
                d2 = resolved_drugs[j]

                pair_key = (min(d1, d2), max(d1, d2))
                if pair_key in seen_ddi_pairs:
                    continue

                # Query graph edges
                edge = self._find_edge(d1, d2, "DRUG_INTERACTS_WITH") or self._find_edge(d2, d1, "DRUG_INTERACTS_WITH")
                if edge:
                    seen_ddi_pairs.add(pair_key)
                    props = edge.get("properties", {})
                    d1_name = graph_engine.nodes_data[d1].get("name", d1)
                    d2_name = graph_engine.nodes_data[d2].get("name", d2)

                    ddi_findings.append({
                        "id": f"ddi-{d1}-{d2}",
                        "category": "Drug-Drug Interaction",
                        "title": f"{d1_name} + {d2_name}",
                        "primaryEntity": d1_name,
                        "secondaryEntity": d2_name,
                        "severity": props.get("severity", "Moderate"),
                        "description": props.get("description", f"Interaction detected between {d1_name} and {d2_name}."),
                        "mechanism": props.get("mechanism", "Pharmacodynamic or pharmacokinetic interaction."),
                        "clinicalEffect": props.get("clinicalEffect", "Increased risk of adverse clinical events."),
                        "recommendedAction": props.get("recommendedAction", "Professional clinical review advised."),
                        "evidenceSource": props.get("evidenceSource", "Verified Medical Formulary & FDA Prescribing Information"),
                        "graphPath": f"({d1_name}:Drug) ──[:DRUG_INTERACTS_WITH]──> ({d2_name}:Drug)"
                    })

        # -------------------------------------------------------------
        # Rule 2: Drug-Disease Interactions (Contraindications)
        # -------------------------------------------------------------
        for drug_id in resolved_drugs:
            for dis_id in resolved_diseases:
                edge = self._find_edge(drug_id, dis_id, "DRUG_CONTRAINDICATED_FOR")
                if edge:
                    props = edge.get("properties", {})
                    d_name = graph_engine.nodes_data[drug_id].get("name", drug_id)
                    dis_name = graph_engine.nodes_data[dis_id].get("name", dis_id)

                    contraindication_findings.append({
                        "id": f"contra-{drug_id}-{dis_id}",
                        "category": "Drug-Disease Contraindication",
                        "title": f"{d_name} contraindicated in {dis_name}",
                        "primaryEntity": d_name,
                        "secondaryEntity": dis_name,
                        "severity": props.get("severity", "Critical"),
                        "description": props.get("description", f"{d_name} is contraindicated for patients with {dis_name}."),
                        "mechanism": props.get("mechanism", "Pathophysiological conflict."),
                        "clinicalEffect": props.get("clinicalEffect", "Aggravation of underlying condition or toxic accumulation."),
                        "recommendedAction": props.get("recommendedAction", "Discontinue drug or select safer alternative."),
                        "evidenceSource": props.get("evidenceSource", "FDA Black Box Warning / Medical Practice Guidelines"),
                        "graphPath": f"({d_name}:Drug) ──[:DRUG_CONTRAINDICATED_FOR]──> ({dis_name}:Disease)"
                    })

        # -------------------------------------------------------------
        # Rule 3: Allergy Hypersensitivity Conflicts
        # -------------------------------------------------------------
        for drug_id in resolved_drugs:
            d_name = graph_engine.nodes_data[drug_id].get("name", drug_id)
            drug_props = graph_engine.nodes_data[drug_id].get("properties", {})
            d_class = drug_props.get("drugClass", "")

            for al_id in resolved_allergies:
                al_node = graph_engine.nodes_data.get(al_id, {})
                al_name = al_node.get("name", al_id)
                al_props = al_node.get("properties", {})
                allergen_class = al_props.get("allergenClass", "")

                # Check direct trigger edge
                edge = self._find_edge(drug_id, al_id, "DRUG_TRIGGERS_ALLERGY")
                
                # Check class match
                class_matched = (allergen_class and allergen_class.lower() in d_class.lower()) or \
                                (al_name.lower().replace(" allergy", "") in d_name.lower())

                if edge or class_matched:
                    props = edge.get("properties", {}) if edge else {}
                    allergy_findings.append({
                        "id": f"allergy-{drug_id}-{al_id}",
                        "category": "Allergy Conflict",
                        "title": f"{d_name} with known {al_name}",
                        "primaryEntity": d_name,
                        "secondaryEntity": al_name,
                        "severity": props.get("severity", "Critical"),
                        "description": props.get("description", f"Patient has documented {al_name}; {d_name} carries high risk of hypersensitivity."),
                        "mechanism": props.get("mechanism", "IgE-mediated immune reaction or COX-1 inhibition intolerance."),
                        "clinicalEffect": props.get("clinicalEffect", "Anaphylactic reaction, bronchospasm, severe urticaria."),
                        "recommendedAction": props.get("recommendedAction", "Strictly avoid prescribing. Select non-cross-reactive alternative."),
                        "evidenceSource": props.get("evidenceSource", "AAAAI Practice Parameters: Drug Allergy"),
                        "graphPath": f"({d_name}:Drug) ──[:DRUG_TRIGGERS_ALLERGY]──> ({al_name}:Allergy)"
                    })

        # -------------------------------------------------------------
        # Rule 4: Age-Related Precautions (Beers Criteria / Pediatric)
        # -------------------------------------------------------------
        if age_group_id:
            for drug_id in resolved_drugs:
                edge = self._find_edge(drug_id, age_group_id, "DRUG_REQUIRES_CAUTION_FOR")
                if edge:
                    props = edge.get("properties", {})
                    d_name = graph_engine.nodes_data[drug_id].get("name", drug_id)
                    ag_name = graph_engine.nodes_data[age_group_id].get("name", age_group_id)

                    age_findings.append({
                        "id": f"age-{drug_id}-{age_group_id}",
                        "category": "Age-Related Precaution",
                        "title": f"{d_name} in {ag_name} Patient (Age: {age})",
                        "primaryEntity": d_name,
                        "secondaryEntity": ag_name,
                        "severity": props.get("severity", "High"),
                        "description": props.get("description", f"Special caution required for {d_name} in {ag_name} population."),
                        "mechanism": props.get("mechanism", "Altered drug clearance and heightened physiological vulnerability."),
                        "clinicalEffect": props.get("clinicalEffect", "Increased rate of adverse drug events, falls, or toxicity."),
                        "recommendedAction": props.get("recommendedAction", "Consider lower initial dose, therapeutic monitoring, or safer geriatric alternative."),
                        "evidenceSource": props.get("evidenceSource", "American Geriatrics Society Beers Criteria 2023"),
                        "graphPath": f"({d_name}:Drug) ──[:DRUG_REQUIRES_CAUTION_FOR]──> ({ag_name}:AgeGroup)"
                    })

        # -------------------------------------------------------------
        # Rule 5: Medical History Precautions
        # -------------------------------------------------------------
        for drug_id in resolved_drugs:
            for mh_id in resolved_history:
                edge = self._find_edge(drug_id, mh_id, "DRUG_CONTRAINDICATED_FOR") or \
                       self._find_edge(drug_id, mh_id, "DRUG_REQUIRES_CAUTION_FOR")
                if edge:
                    props = edge.get("properties", {})
                    d_name = graph_engine.nodes_data[drug_id].get("name", drug_id)
                    mh_name = graph_engine.nodes_data[mh_id].get("name", mh_id)

                    history_findings.append({
                        "id": f"hist-{drug_id}-{mh_id}",
                        "category": "Medical History Conflict",
                        "title": f"{d_name} conflict with {mh_name}",
                        "primaryEntity": d_name,
                        "secondaryEntity": mh_name,
                        "severity": props.get("severity", "Critical"),
                        "description": props.get("description", f"{d_name} presents significant hazards given patient's {mh_name}."),
                        "mechanism": props.get("mechanism", "Prior adverse reaction susceptibility or tissue vulnerability."),
                        "clinicalEffect": props.get("clinicalEffect", "Recurrence of life-threatening historical complications."),
                        "recommendedAction": props.get("recommendedAction", "Strict avoidance or close clinical monitoring required."),
                        "evidenceSource": props.get("evidenceSource", "Clinical Practice Guidelines & Hospital Historical Risk Matrix"),
                        "graphPath": f"({d_name}:Drug) ──[:CONFLICTS_WITH_HISTORY]──> ({mh_name}:MedicalHistory)"
                    })

        # -------------------------------------------------------------
        # Consolidate and Rank Findings by Severity
        # -------------------------------------------------------------
        all_findings = ddi_findings + contraindication_findings + allergy_findings + age_findings + history_findings

        severity_rank = {"Critical": 4, "High": 3, "Moderate": 2, "Low": 1, "Normal": 0}
        all_findings.sort(key=lambda x: severity_rank.get(x.get("severity", "Normal"), 0), reverse=True)

        # Determine Overall Risk Level
        severities = [f.get("severity", "Normal") for f in all_findings]
        if "Critical" in severities:
            overall_risk = "Critical"
            risk_summary = "CRITICAL ALERT: Urgent clinical assessment required. Potentially fatal drug combinations, contraindications, or allergy conflicts detected."
        elif "High" in severities:
            overall_risk = "High"
            risk_summary = "HIGH RISK: Immediate professional review required. High-grade interactions or geriatric cautions identified."
        elif "Moderate" in severities:
            overall_risk = "Moderate"
            risk_summary = "MODERATE RISK: Medical review recommended. Drug interactions may reduce efficacy or cause manageable side effects."
        elif "Low" in severities:
            overall_risk = "Low"
            risk_summary = "LOW RISK: Minor informational cautions detected. Routine monitoring advised."
        else:
            overall_risk = "Safe"
            risk_summary = "NO DIRECT INTERACTIONS DETECTED: Note that missing knowledge graph data does not guarantee clinical safety. Professional judgment is always required."

        # Generate Patient Subgraph for React Flow visualizer
        subgraph = graph_engine.get_patient_subgraph(
            patient_id=patient_id or "TEMP-SIM",
            patient_name=patient_name,
            patient_age=age,
            medication_ids=resolved_drugs,
            disease_ids=resolved_diseases,
            allergy_ids=resolved_allergies,
            history_ids=resolved_history
        )

        return {
            "patientId": patient_id or "TEMP-SIM",
            "patientName": patient_name,
            "patientAge": age,
            "overallRisk": overall_risk,
            "riskSummary": risk_summary,
            "stats": {
                "totalFindings": len(all_findings),
                "criticalCount": sum(1 for f in all_findings if f["severity"] == "Critical"),
                "highCount": sum(1 for f in all_findings if f["severity"] == "High"),
                "moderateCount": sum(1 for f in all_findings if f["severity"] == "Moderate"),
                "lowCount": sum(1 for f in all_findings if f["severity"] == "Low"),
            },
            "findings": all_findings,
            "drugDrugInteractions": ddi_findings,
            "drugDiseaseInteractions": contraindication_findings,
            "allergyConflicts": allergy_findings,
            "agePrecautions": age_findings,
            "historyRisks": history_findings,
            "resolvedEntities": {
                "drugs": [graph_engine.nodes_data[d]["name"] for d in resolved_drugs if d in graph_engine.nodes_data],
                "diseases": [graph_engine.nodes_data[dis]["name"] for dis in resolved_diseases if dis in graph_engine.nodes_data],
                "allergies": [graph_engine.nodes_data[al]["name"] for al in resolved_allergies if al in graph_engine.nodes_data],
                "medicalHistory": [graph_engine.nodes_data[mh]["name"] for mh in resolved_history if mh in graph_engine.nodes_data]
            },
            "subgraph": subgraph
        }

    def _find_edge(self, source_id: str, target_id: str, edge_type: str) -> Optional[Dict[str, Any]]:
        """Search graph edges for matching source, target, and edge_type."""
        for edge in graph_engine.edges_data:
            if edge["source"] == source_id and edge["target"] == target_id and edge.get("type") == edge_type:
                return edge
        return None

reasoning_engine = ClinicalReasoningEngine()
