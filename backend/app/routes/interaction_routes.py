from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.sqlite_db import get_db
from app.models.sql_models import PatientRecord, ClinicalAlert, AuditLog
from app.reasoning.engine import reasoning_engine
from app.schemas.schemas import InteractionCheckRequest, InteractionCheckResponse

router = APIRouter(prefix="/interactions", tags=["Interaction Detection Engine"])

@router.post("/check", response_model=InteractionCheckResponse)
def check_interactions(req: InteractionCheckRequest, db: Session = Depends(get_db)):
    """
    Main Clinical Decision Support Endpoint:
    Executes Knowledge Graph traversal and rule-based evaluation.
    """
    patient_id = req.patientId
    patient_name = req.patientName or "Simulated Patient"
    age = req.age
    drugs = list(req.drugs)
    diseases = list(req.diseases)
    allergies = list(req.allergies)
    medical_history = list(req.medicalHistory)

    # If a registered patient ID is given, supplement with stored records
    if patient_id and patient_id != "TEMP-SIM":
        patient = db.query(PatientRecord).filter(
            (PatientRecord.patient_id == patient_id) | (PatientRecord.id == int(patient_id) if patient_id.isdigit() else False)
        ).first()

        if patient:
            patient_id = patient.patient_id
            patient_name = patient.name
            age = patient.age
            # Append stored items if not already provided
            stored_drugs = [m.drug_id for m in patient.medications]
            for sd in stored_drugs:
                if sd not in drugs:
                    drugs.append(sd)

            stored_diseases = [d.disease_id for d in patient.diseases]
            for sdis in stored_diseases:
                if sdis not in diseases:
                    diseases.append(sdis)

            stored_allergies = [a.allergy_id for a in patient.allergies]
            for sa in stored_allergies:
                if sa not in allergies:
                    allergies.append(sa)

            stored_history = [h.history_id for h in patient.medical_history]
            for sh in stored_history:
                if sh not in medical_history:
                    medical_history.append(sh)

    # Execute graph reasoning
    result = reasoning_engine.analyze(
        patient_id=patient_id,
        patient_name=patient_name,
        age=age,
        drugs=drugs,
        diseases=diseases,
        allergies=allergies,
        medical_history=medical_history
    )

    # If critical/high risks found for a registered patient, record or update alerts
    if patient_id and patient_id != "TEMP-SIM" and result["overallRisk"] in ["Critical", "High"]:
        for finding in result["findings"]:
            if finding["severity"] in ["Critical", "High"]:
                existing_alert = db.query(ClinicalAlert).filter(
                    ClinicalAlert.patient_id == patient_id,
                    ClinicalAlert.title == finding["title"]
                ).first()

                if not existing_alert:
                    db.add(ClinicalAlert(
                        patient_id=patient_id,
                        patient_name=patient_name,
                        severity=finding["severity"],
                        title=finding["title"],
                        description=finding["description"],
                        mechanism=finding.get("mechanism"),
                        clinical_effect=finding.get("clinicalEffect"),
                        recommended_action=finding.get("recommendedAction"),
                        evidence_source=finding.get("evidenceSource"),
                        graph_path=finding.get("graphPath"),
                        is_reviewed=False
                    ))
        db.commit()

    db.add(AuditLog(
        user="Doctor",
        action="INTERACTION_CHECK",
        details=f"Ran CDS check for {patient_name} ({patient_id}). Result: {result['overallRisk']} ({len(result['findings'])} findings)."
    ))
    db.commit()

    return result

@router.get("/rules")
def get_clinical_rules():
    """Returns rule reasoning criteria applied by the Knowledge Graph engine."""
    return {
        "rules": [
            {
                "ruleId": "RULE-DDI-01",
                "name": "Drug-Drug Pharmacodynamic / Pharmacokinetic Synergism",
                "condition": "Patient takes Drug A and Drug B where (Drug A)-[:DRUG_INTERACTS_WITH]->(Drug B)",
                "severities": ["Critical", "High", "Moderate", "Low"],
                "example": "Warfarin + Aspirin (Additive bleeding risk, severe hemorrhage)"
            },
            {
                "ruleId": "RULE-CONTRA-01",
                "name": "Drug-Disease Absolute Contraindication",
                "condition": "Patient has Disease X and takes Drug A where (Drug A)-[:DRUG_CONTRAINDICATED_FOR]->(Disease X)",
                "severities": ["Critical", "High"],
                "example": "Metformin + Chronic Kidney Disease Stage 4-5 (MALA, metabolic acidosis)"
            },
            {
                "ruleId": "RULE-ALLERGY-01",
                "name": "Immune Hypersensitivity / Cross-Reactivity",
                "condition": "Patient allergic to Allergen C and takes Drug A where (Drug A)-[:DRUG_TRIGGERS_ALLERGY]->(Allergen C) OR (Drug A)-[:DRUG_BELONGS_TO]->(Allergen C Class)",
                "severities": ["Critical", "High"],
                "example": "Amoxicillin + Penicillin Allergy (Anaphylaxis, airway compromise)"
            },
            {
                "ruleId": "RULE-AGE-01",
                "name": "Beers Criteria Geriatric Precaution (Age >= 65)",
                "condition": "Patient Age >= 65 and takes Drug A where (Drug A)-[:DRUG_REQUIRES_CAUTION_FOR]->(AgeGroup: Geriatric)",
                "severities": ["High", "Moderate"],
                "example": "NSAIDs / Warfarin in Geriatric patients (Increased ulceration, bleeding, falls)"
            },
            {
                "ruleId": "RULE-HIST-01",
                "name": "Past Medical History Vulnerability Conflict",
                "condition": "Patient has history of Y and takes Drug A where (Drug A)-[:DRUG_CONTRAINDICATED_FOR]->(MedicalHistory: Y)",
                "severities": ["Critical", "High"],
                "example": "Lisinopril + History of ACEi-Induced Angioedema (Fatal airway swelling)"
            }
        ]
    }
