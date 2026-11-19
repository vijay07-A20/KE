from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.sqlite_db import get_db
from app.models.sql_models import (
    PatientRecord, PatientMedication, PatientDisease, PatientAllergy, PatientHistoryItem, AuditLog
)
from app.schemas.schemas import (
    PatientCreate, PatientUpdate, PatientResponse, MedicationItem, DiseaseItem, AllergyItem, HistoryItem
)

router = APIRouter(prefix="/patients", tags=["Patients"])

def _serialize_patient(p: PatientRecord) -> PatientResponse:
    return PatientResponse(
        id=p.id,
        patient_id=p.patient_id,
        name=p.name,
        age=p.age,
        gender=p.gender,
        weight=p.weight,
        notes=p.notes,
        created_at=p.created_at,
        medications=[
            MedicationItem(drugId=m.drug_id, name=m.name, dosage=m.dosage, frequency=m.frequency)
            for m in p.medications
        ],
        diseases=[
            DiseaseItem(diseaseId=d.disease_id, name=d.name)
            for d in p.diseases
        ],
        allergies=[
            AllergyItem(allergyId=a.allergy_id, name=a.name, allergenClass=a.allergen_class)
            for a in p.allergies
        ],
        medicalHistory=[
            HistoryItem(historyId=h.history_id, name=h.name)
            for h in p.medical_history
        ]
    )

@router.get("", response_model=list[PatientResponse])
def get_patients(db: Session = Depends(get_db)):
    patients = db.query(PatientRecord).order_by(PatientRecord.id.asc()).all()
    return [_serialize_patient(p) for p in patients]

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(
        (PatientRecord.patient_id == patient_id) | (PatientRecord.id == int(patient_id) if patient_id.isdigit() else False)
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return _serialize_patient(patient)

@router.post("", response_model=PatientResponse)
def create_patient(data: PatientCreate, db: Session = Depends(get_db)):
    existing = db.query(PatientRecord).filter(PatientRecord.patient_id == data.patient_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Patient ID already exists")

    patient = PatientRecord(
        patient_id=data.patient_id,
        name=data.name,
        age=data.age,
        gender=data.gender,
        weight=data.weight,
        notes=data.notes
    )
    db.add(patient)
    db.flush()

    for med in data.medications:
        db.add(PatientMedication(
            patient_id=patient.id,
            drug_id=med.drugId,
            name=med.name,
            dosage=med.dosage,
            frequency=med.frequency
        ))

    for dis in data.diseases:
        db.add(PatientDisease(
            patient_id=patient.id,
            disease_id=dis.diseaseId,
            name=dis.name
        ))

    for al in data.allergies:
        db.add(PatientAllergy(
            patient_id=patient.id,
            allergy_id=al.allergyId,
            name=al.name,
            allergen_class=al.allergenClass
        ))

    for mh in data.medicalHistory:
        db.add(PatientHistoryItem(
            patient_id=patient.id,
            history_id=mh.historyId,
            name=mh.name
        ))

    db.add(AuditLog(
        user="Doctor",
        action="CREATE_PATIENT",
        details=f"Registered patient {data.name} ({data.patient_id}) with {len(data.medications)} medications."
    ))

    db.commit()
    db.refresh(patient)
    return _serialize_patient(patient)

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: str, data: PatientUpdate, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(
        (PatientRecord.patient_id == patient_id) | (PatientRecord.id == int(patient_id) if patient_id.isdigit() else False)
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if data.name is not None:
        patient.name = data.name
    if data.age is not None:
        patient.age = data.age
    if data.gender is not None:
        patient.gender = data.gender
    if data.weight is not None:
        patient.weight = data.weight
    if data.notes is not None:
        patient.notes = data.notes

    if data.medications is not None:
        db.query(PatientMedication).filter(PatientMedication.patient_id == patient.id).delete()
        for med in data.medications:
            db.add(PatientMedication(
                patient_id=patient.id,
                drug_id=med.drugId,
                name=med.name,
                dosage=med.dosage,
                frequency=med.frequency
            ))

    if data.diseases is not None:
        db.query(PatientDisease).filter(PatientDisease.patient_id == patient.id).delete()
        for dis in data.diseases:
            db.add(PatientDisease(
                patient_id=patient.id,
                disease_id=dis.diseaseId,
                name=dis.name
            ))

    if data.allergies is not None:
        db.query(PatientAllergy).filter(PatientAllergy.patient_id == patient.id).delete()
        for al in data.allergies:
            db.add(PatientAllergy(
                patient_id=patient.id,
                allergy_id=al.allergyId,
                name=al.name,
                allergen_class=al.allergenClass
            ))

    if data.medicalHistory is not None:
        db.query(PatientHistoryItem).filter(PatientHistoryItem.patient_id == patient.id).delete()
        for mh in data.medicalHistory:
            db.add(PatientHistoryItem(
                patient_id=patient.id,
                history_id=mh.historyId,
                name=mh.name
            ))

    db.commit()
    db.refresh(patient)
    return _serialize_patient(patient)

@router.delete("/{patient_id}")
def delete_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(
        (PatientRecord.patient_id == patient_id) | (PatientRecord.id == int(patient_id) if patient_id.isdigit() else False)
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    db.delete(patient)
    db.add(AuditLog(
        user="Doctor",
        action="DELETE_PATIENT",
        details=f"Deleted patient ID {patient_id}."
    ))
    db.commit()
    return {"message": f"Patient {patient_id} deleted successfully"}
