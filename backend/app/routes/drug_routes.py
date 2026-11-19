from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from app.knowledge_graph.graph_engine import graph_engine
from app.schemas.schemas import DrugCreate, DrugUpdate, DrugResponse
from app.database.sqlite_db import get_db
from app.models.sql_models import AuditLog

router = APIRouter(prefix="/drugs", tags=["Drugs"])

def _build_drug_response(drug_id: str, data: dict) -> DrugResponse:
    props = data.get("properties", {})

    # Gather side effects, contraindications, and interactions from graph edges
    side_effects = []
    contraindications = []
    known_interactions = []

    for edge in graph_engine.edges_data:
        src = edge["source"]
        tgt = edge["target"]
        etype = edge.get("type")
        eprops = edge.get("properties", {})

        if src == drug_id:
            if etype == "DRUG_CAUSES" and tgt in graph_engine.nodes_data:
                side_effects.append(graph_engine.nodes_data[tgt]["name"])
            elif etype == "DRUG_CONTRAINDICATED_FOR" and tgt in graph_engine.nodes_data:
                contraindications.append(f"{graph_engine.nodes_data[tgt]['name']} ({eprops.get('severity', 'High')})")
            elif etype == "DRUG_INTERACTS_WITH" and tgt in graph_engine.nodes_data:
                known_interactions.append(f"{graph_engine.nodes_data[tgt]['name']} - {eprops.get('severity', 'Moderate')}")
        elif tgt == drug_id and etype == "DRUG_INTERACTS_WITH" and src in graph_engine.nodes_data:
            known_interactions.append(f"{graph_engine.nodes_data[src]['name']} - {eprops.get('severity', 'Moderate')}")

    return DrugResponse(
        id=drug_id,
        name=data.get("name", drug_id),
        genericName=props.get("genericName", data.get("name", drug_id)),
        dosageForm=props.get("dosageForm", "Oral Tablet"),
        drugClass=props.get("drugClass", "Unclassified"),
        commonUses=props.get("commonUses", ""),
        ageRestrictions=props.get("ageRestrictions", ""),
        sideEffects=list(set(side_effects)),
        contraindications=list(set(contraindications)),
        knownInteractions=list(set(known_interactions))
    )

@router.get("", response_model=List[DrugResponse])
def get_drugs(
    search: Optional[str] = Query(None, description="Search by name or generic name"),
    drug_class: Optional[str] = Query(None, description="Filter by drug class")
):
    drugs = []
    for nid, node in graph_engine.nodes_data.items():
        if node.get("label") == "Drug":
            name = node.get("name", "").lower()
            props = node.get("properties", {})
            generic = props.get("genericName", "").lower()
            dclass = props.get("drugClass", "").lower()

            if search:
                s = search.strip().lower()
                if s not in name and s not in generic:
                    continue

            if drug_class and drug_class.lower() not in dclass:
                continue

            drugs.append(_build_drug_response(nid, node))

    drugs.sort(key=lambda d: d.name)
    return drugs

@router.get("/classes/list", response_model=List[str])
def get_drug_classes():
    classes = set()
    for nid, node in graph_engine.nodes_data.items():
        if node.get("label") == "DrugClass":
            classes.add(node.get("name", nid))
        elif node.get("label") == "Drug":
            dc = node.get("properties", {}).get("drugClass")
            if dc:
                classes.add(dc)
    return sorted(list(classes))

@router.get("/{drug_id}", response_model=DrugResponse)
def get_drug(drug_id: str):
    if drug_id not in graph_engine.nodes_data or graph_engine.nodes_data[drug_id].get("label") != "Drug":
        raise HTTPException(status_code=404, detail="Drug not found")
    return _build_drug_response(drug_id, graph_engine.nodes_data[drug_id])

@router.post("", response_model=DrugResponse)
def create_drug(drug_data: DrugCreate, db: Session = Depends(get_db)):
    drug_dict = drug_data.dict()
    new_node = graph_engine.add_custom_drug(drug_dict)
    
    db.add(AuditLog(
        user="Pharmacist",
        action="ADD_DRUG",
        details=f"Added drug {drug_data.name} to knowledge database."
    ))
    db.commit()

    return _build_drug_response(new_node["id"], new_node)

@router.put("/{drug_id}", response_model=DrugResponse)
def update_drug(drug_id: str, drug_data: DrugUpdate, db: Session = Depends(get_db)):
    if drug_id not in graph_engine.nodes_data:
        raise HTTPException(status_code=404, detail="Drug not found")

    node = graph_engine.nodes_data[drug_id]
    props = node.get("properties", {})

    if drug_data.name:
        node["name"] = drug_data.name
    if drug_data.genericName:
        props["genericName"] = drug_data.genericName
    if drug_data.dosageForm:
        props["dosageForm"] = drug_data.dosageForm
    if drug_data.drugClass:
        props["drugClass"] = drug_data.drugClass
    if drug_data.commonUses is not None:
        props["commonUses"] = drug_data.commonUses
    if drug_data.ageRestrictions is not None:
        props["ageRestrictions"] = drug_data.ageRestrictions

    node["properties"] = props
    graph_engine.nodes_data[drug_id] = node

    db.add(AuditLog(
        user="Pharmacist",
        action="UPDATE_DRUG",
        details=f"Updated drug details for {node.get('name')}."
    ))
    db.commit()

    return _build_drug_response(drug_id, node)

@router.delete("/{drug_id}")
def delete_drug(drug_id: str, db: Session = Depends(get_db)):
    if drug_id not in graph_engine.nodes_data:
        raise HTTPException(status_code=404, detail="Drug not found")

    name = graph_engine.nodes_data[drug_id].get("name", drug_id)
    graph_engine.delete_drug(drug_id)

    db.add(AuditLog(
        user="Pharmacist",
        action="DELETE_DRUG",
        details=f"Deleted drug {name} ({drug_id}) from knowledge graph."
    ))
    db.commit()

    return {"message": f"Drug {name} removed successfully"}
