import pytest
from app.reasoning.engine import reasoning_engine
from app.knowledge_graph.graph_engine import graph_engine

def test_graph_initialization():
    stats = graph_engine.get_graph_stats()
    assert stats["totalNodes"] > 0
    assert stats["totalEdges"] > 0
    assert "Drug" in stats["nodeTypes"]
    assert "Disease" in stats["nodeTypes"]

def test_warfarin_aspirin_interaction():
    res = reasoning_engine.analyze(
        patient_name="Test Patient",
        age=50,
        drugs=["Warfarin", "Aspirin"]
    )
    assert res["overallRisk"] == "Critical"
    ddi_titles = [f["title"] for f in res["drugDrugInteractions"]]
    assert any("Warfarin + Aspirin" in t or "Aspirin + Warfarin" in t for t in ddi_titles)

def test_metformin_ckd_contraindication():
    res = reasoning_engine.analyze(
        patient_name="Test Patient",
        age=55,
        drugs=["Metformin"],
        diseases=["Chronic Kidney Disease (Stage 4-5)"]
    )
    assert res["overallRisk"] == "Critical"
    contra = res["drugDiseaseInteractions"]
    assert len(contra) > 0
    assert "Metformin is contraindicated" in contra[0]["description"]

def test_penicillin_allergy_conflict():
    res = reasoning_engine.analyze(
        patient_name="Test Patient",
        age=30,
        drugs=["Amoxicillin"],
        allergies=["Penicillin Allergy"]
    )
    assert res["overallRisk"] == "Critical"
    assert len(res["allergyConflicts"]) > 0

def test_geriatric_age_precaution():
    res = reasoning_engine.analyze(
        patient_name="Elderly Patient",
        age=75,
        drugs=["Warfarin"]
    )
    assert res["overallRisk"] in ["High", "Critical"]
    assert len(res["agePrecautions"]) > 0

def test_safe_combination():
    res = reasoning_engine.analyze(
        patient_name="Safe Patient",
        age=35,
        drugs=["Amoxicillin"],
        diseases=[]
    )
    assert res["overallRisk"] == "Safe"
