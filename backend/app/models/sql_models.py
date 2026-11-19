from datetime import datetime
import json
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="Doctor", nullable=False) # Doctor, Pharmacist, Admin
    created_at = Column(DateTime, default=datetime.utcnow)

class PatientRecord(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    weight = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    medications = relationship("PatientMedication", back_populates="patient", cascade="all, delete-orphan")
    diseases = relationship("PatientDisease", back_populates="patient", cascade="all, delete-orphan")
    allergies = relationship("PatientAllergy", back_populates="patient", cascade="all, delete-orphan")
    medical_history = relationship("PatientHistoryItem", back_populates="patient", cascade="all, delete-orphan")

class PatientMedication(Base):
    __tablename__ = "patient_medications"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    drug_id = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    dosage = Column(String(50), nullable=True)
    frequency = Column(String(100), nullable=True)

    patient = relationship("PatientRecord", back_populates="medications")

class PatientDisease(Base):
    __tablename__ = "patient_diseases"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    disease_id = Column(String(100), nullable=False)
    name = Column(String(150), nullable=False)

    patient = relationship("PatientRecord", back_populates="diseases")

class PatientAllergy(Base):
    __tablename__ = "patient_allergies"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    allergy_id = Column(String(100), nullable=False)
    name = Column(String(150), nullable=False)
    allergen_class = Column(String(100), nullable=True)

    patient = relationship("PatientRecord", back_populates="allergies")

class PatientHistoryItem(Base):
    __tablename__ = "patient_history"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    history_id = Column(String(100), nullable=False)
    name = Column(String(200), nullable=False)

    patient = relationship("PatientRecord", back_populates="medical_history")

class ClinicalAlert(Base):
    __tablename__ = "clinical_alerts"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(50), index=True, nullable=False)
    patient_name = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False) # Critical, High, Moderate, Low
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    mechanism = Column(Text, nullable=True)
    clinical_effect = Column(Text, nullable=True)
    recommended_action = Column(Text, nullable=True)
    evidence_source = Column(String(250), nullable=True)
    graph_path = Column(String(250), nullable=True)
    is_reviewed = Column(Boolean, default=False)
    reviewed_by = Column(String(100), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    review_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class InteractionReport(Base):
    __tablename__ = "interaction_reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(50), index=True, nullable=False)
    patient_name = Column(String(100), nullable=False)
    overall_risk = Column(String(20), nullable=False)
    summary = Column(Text, nullable=False)
    report_data_json = Column(Text, nullable=False)
    generated_by = Column(String(100), default="Clinical System")
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
