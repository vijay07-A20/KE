import os
import json
import logging
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings
from app.models.sql_models import (
    Base, User, PatientRecord, PatientMedication, PatientDisease,
    PatientAllergy, PatientHistoryItem, ClinicalAlert, InteractionReport, AuditLog
)
from app.knowledge_graph.knowledge_data import INITIAL_PATIENTS

logger = logging.getLogger(__name__)

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Create all tables and seed default users, demo patients, and initial alerts."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Default Users if none exist
        if db.query(User).count() == 0:
            import bcrypt
            
            def hash_pwd(pwd: str) -> str:
                return bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            users = [
                User(
                    username="dr.sarah",
                    email="sarah.connor@hospital.org",
                    hashed_password=hash_pwd("doctor123"),
                    full_name="Dr. Sarah Connor, MD (Cardiologist)",
                    role="Doctor"
                ),
                User(
                    username="pharm.marcus",
                    email="marcus.vance@hospital.org",
                    hashed_password=hash_pwd("pharm123"),
                    full_name="Marcus Vance, PharmD (Lead Pharmacist)",
                    role="Pharmacist"
                ),
                User(
                    username="admin",
                    email="admin@hospital.org",
                    hashed_password=hash_pwd("admin123"),
                    full_name="System Clinical Administrator",
                    role="Admin"
                )
            ]
            db.add_all(users)
            db.commit()
            logger.info("Initialized default users (dr.sarah, pharm.marcus, admin).")

        # 2. Seed Initial Patients if none exist
        if db.query(PatientRecord).count() == 0:
            for pat_data in INITIAL_PATIENTS:
                patient = PatientRecord(
                    patient_id=pat_data["id"],
                    name=pat_data["name"],
                    age=pat_data["age"],
                    gender=pat_data["gender"],
                    weight=pat_data.get("weight"),
                    notes=pat_data.get("notes")
                )
                db.add(patient)
                db.flush()

                for med in pat_data.get("medications", []):
                    db.add(PatientMedication(
                        patient_id=patient.id,
                        drug_id=med["drugId"],
                        name=med["name"],
                        dosage=med.get("dosage", "Standard"),
                        frequency=med.get("frequency", "Daily")
                    ))

                for dis in pat_data.get("diseases", []):
                    db.add(PatientDisease(
                        patient_id=patient.id,
                        disease_id=dis["diseaseId"],
                        name=dis["name"]
                    ))

                for al in pat_data.get("allergies", []):
                    db.add(PatientAllergy(
                        patient_id=patient.id,
                        allergy_id=al["allergyId"],
                        name=al["name"],
                        allergen_class=al.get("allergenClass")
                    ))

                for mh in pat_data.get("medicalHistory", []):
                    db.add(PatientHistoryItem(
                        patient_id=patient.id,
                        history_id=mh["historyId"],
                        name=mh["name"]
                    ))

            db.commit()
            logger.info(f"Initialized {len(INITIAL_PATIENTS)} sample patients.")

        # 3. Seed Initial Critical Clinical Alerts for the dashboard
        if db.query(ClinicalAlert).count() == 0:
            alerts = [
                ClinicalAlert(
                    patient_id="PAT-001",
                    patient_name="Eleanor Vance (Fictional)",
                    severity="Critical",
                    title="Warfarin + Aspirin Major Hemorrhagic Synergism",
                    description="Patient is concurrently prescribed Warfarin and Aspirin, substantially elevating gastrointestinal and intracranial bleeding risk.",
                    mechanism="Synergistic platelet COX-1 inhibition and prothrombin complex synthesis depletion.",
                    clinicalEffect="Major fatal internal hemorrhage, prolonged INR spike.",
                    recommendedAction="Avoid combination unless required for mechanical valve; add PPI gastroprotection.",
                    evidenceSource="FDA Warfarin Label & Lexicomp Drug Interactions",
                    graph_path="(Warfarin:Drug) ──[:DRUG_INTERACTS_WITH]──> (Aspirin:Drug)",
                    is_reviewed=False,
                    created_at=datetime.utcnow()
                ),
                ClinicalAlert(
                    patient_id="PAT-002",
                    patient_name="Arthur Pendelton (Fictional)",
                    severity="Critical",
                    title="Metformin Contraindicated in CKD Stage 4-5",
                    description="Metformin prescription in patient with advanced chronic kidney disease (eGFR < 30 mL/min).",
                    mechanism="Severely reduced biguanide renal clearance causing mitochondrial toxicity.",
                    clinicalEffect="Metformin-Associated Lactic Acidosis (MALA), >40% mortality risk.",
                    recommendedAction="Discontinue Metformin immediately; switch to insulin or renal-safe DPP-4i.",
                    evidenceSource="FDA Metformin Package Insert & ADA Guidelines",
                    graph_path="(Metformin:Drug) ──[:DRUG_CONTRAINDICATED_FOR]──> (CKD:Disease)",
                    is_reviewed=False,
                    created_at=datetime.utcnow()
                ),
                ClinicalAlert(
                    patient_id="PAT-003",
                    patient_name="Robert Chen (Fictional)",
                    severity="High",
                    title="Lisinopril + Spironolactone Hyperkalemia Risk",
                    description="Combined ACE inhibitor and potassium-sparing diuretic in patient with pre-existing hyperkalemia.",
                    mechanism="Dual suppression of renal potassium excretion.",
                    clinicalEffect="Severe hyperkalemia, sinoventricular rhythm, ventricular fibrillation.",
                    recommendedAction="Monitor serum K+ and creatinine weekly; cap Spironolactone at 25 mg daily.",
                    evidenceSource="AHA Heart Failure Guidelines & RALES Trial",
                    graph_path="(Lisinopril:Drug) ──[:DRUG_INTERACTS_WITH]──> (Spironolactone:Drug)",
                    is_reviewed=False,
                    created_at=datetime.utcnow()
                ),
                ClinicalAlert(
                    patient_id="PAT-005",
                    patient_name="David Miller (Fictional)",
                    severity="Critical",
                    title="Amoxicillin Prescribed with Known Penicillin Allergy",
                    description="Beta-lactam antibiotic prescription in a patient with documented Penicillin hypersensitivity.",
                    mechanism="IgE-mediated mast cell and basophil degranulation from beta-lactam nucleus.",
                    clinicalEffect="Anaphylactic shock, acute laryngeal edema, cardiovascular collapse.",
                    recommendedAction="Cancel prescription immediately. Substitute with macrolide or fluoroquinolone.",
                    evidenceSource="AAAAI Practice Parameters: Drug Allergy",
                    graph_path="(Amoxicillin:Drug) ──[:DRUG_TRIGGERS_ALLERGY]──> (Penicillin Allergy:Allergy)",
                    is_reviewed=True,
                    reviewed_by="Marcus Vance, PharmD",
                    reviewed_at=datetime.utcnow(),
                    review_notes="Prescription intercepted and switched to Azithromycin.",
                    created_at=datetime.utcnow()
                )
            ]
            db.add_all(alerts)

            # Seed an audit log
            db.add(AuditLog(
                user="System",
                action="SYSTEM_INIT",
                details="Knowledge Graph CDS Database initialized with validated clinical datasets.",
                ip_address="127.0.0.1"
            ))

            db.commit()
            logger.info("Initialized clinical alerts and audit logs.")

    except Exception as e:
        db.rollback()
        logger.error(f"Error during init_db: {e}")
    finally:
        db.close()
