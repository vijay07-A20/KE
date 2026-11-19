from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.knowledge_graph.graph_engine import graph_engine
from app.knowledge_graph.neo4j_client import neo4j_client
from app.database.sqlite_db import get_db
from app.models.sql_models import PatientRecord

router = APIRouter(prefix="/graph", tags=["Knowledge Graph"])

@router.get("/full")
def get_full_graph():
    """Returns all nodes and edges formatted for React Flow."""
    return graph_engine.get_full_graph()

@router.get("/patient/{patient_id}")
def get_patient_graph(patient_id: str, db: Session = Depends(get_db)):
    """Returns patient-specific interactive subgraph."""
    patient = db.query(PatientRecord).filter(
        (PatientRecord.patient_id == patient_id) | (PatientRecord.id == int(patient_id) if patient_id.isdigit() else False)
    ).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    med_ids = [m.drug_id for m in patient.medications]
    disease_ids = [d.disease_id for d in patient.diseases]
    allergy_ids = [a.allergy_id for a in patient.allergies]
    history_ids = [h.history_id for h in patient.medical_history]

    subgraph = graph_engine.get_patient_subgraph(
        patient_id=patient.patient_id,
        patient_name=patient.name,
        patient_age=patient.age,
        medication_ids=med_ids,
        disease_ids=disease_ids,
        allergy_ids=allergy_ids,
        history_ids=history_ids
    )
    return subgraph

@router.get("/drug/{drug_id}")
def get_drug_ego_network(drug_id: str):
    """Returns 1-hop ego network for a specific drug."""
    return graph_engine.get_drug_ego_network(drug_id)

@router.get("/status")
def get_graph_status():
    """Returns statistics, node/edge counts, and Neo4j status."""
    return graph_engine.get_graph_stats()

@router.post("/query")
def run_custom_query(payload: dict):
    """Executes Cypher query if Neo4j is connected, or performs graph node search."""
    cypher = payload.get("query", "").strip()
    if neo4j_client.is_connected() and cypher:
        results = neo4j_client.execute_read(cypher)
        return {"mode": "Neo4j Live", "records": results}
    else:
        # Search nodes in memory
        term = payload.get("term", "").lower()
        matched_nodes = []
        for nid, data in graph_engine.nodes_data.items():
            if term in nid.lower() or term in data.get("name", "").lower():
                matched_nodes.append(data)
        return {"mode": "Embedded Graph Engine", "nodes": matched_nodes}
