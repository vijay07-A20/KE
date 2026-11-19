from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- Auth Schemas ---
class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    fullName: str
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# --- Patient Sub-Items ---
class MedicationItem(BaseModel):
    drugId: str
    name: str
    dosage: Optional[str] = "Standard"
    frequency: Optional[str] = "Daily"

class DiseaseItem(BaseModel):
    diseaseId: str
    name: str

class AllergyItem(BaseModel):
    allergyId: str
    name: str
    allergenClass: Optional[str] = None

class HistoryItem(BaseModel):
    historyId: str
    name: str

# --- Patient Schemas ---
class PatientCreate(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str
    weight: Optional[float] = None
    notes: Optional[str] = None
    medications: List[MedicationItem] = []
    diseases: List[DiseaseItem] = []
    allergies: List[AllergyItem] = []
    medicalHistory: List[HistoryItem] = []

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    notes: Optional[str] = None
    medications: Optional[List[MedicationItem]] = None
    diseases: Optional[List[DiseaseItem]] = None
    allergies: Optional[List[AllergyItem]] = None
    medicalHistory: Optional[List[HistoryItem]] = None

class PatientResponse(BaseModel):
    id: int
    patient_id: str
    name: str
    age: int
    gender: str
    weight: Optional[float] = None
    notes: Optional[str] = None
    medications: List[MedicationItem] = []
    diseases: List[DiseaseItem] = []
    allergies: List[AllergyItem] = []
    medicalHistory: List[HistoryItem] = []
    created_at: datetime

    class Config:
        from_attributes = True

# --- Drug Schemas ---
class DrugCreate(BaseModel):
    name: str
    genericName: str
    dosageForm: str
    drugClass: str
    commonUses: Optional[str] = None
    ageRestrictions: Optional[str] = None

class DrugUpdate(BaseModel):
    name: Optional[str] = None
    genericName: Optional[str] = None
    dosageForm: Optional[str] = None
    drugClass: Optional[str] = None
    commonUses: Optional[str] = None
    ageRestrictions: Optional[str] = None

class DrugResponse(BaseModel):
    id: str
    name: str
    genericName: str
    dosageForm: str
    drugClass: str
    commonUses: Optional[str] = None
    ageRestrictions: Optional[str] = None
    sideEffects: List[str] = []
    contraindications: List[str] = []
    knownInteractions: List[str] = []

# --- Interaction Check Schemas ---
class InteractionCheckRequest(BaseModel):
    patientId: Optional[str] = None
    patientName: Optional[str] = "Simulated Patient"
    age: int = 45
    drugs: List[str] = []
    diseases: List[str] = []
    allergies: List[str] = []
    medicalHistory: List[str] = []

class FindingItem(BaseModel):
    id: str
    category: str
    title: str
    primaryEntity: str
    secondaryEntity: str
    severity: str
    description: str
    mechanism: str
    clinicalEffect: str
    recommendedAction: str
    evidenceSource: str
    graphPath: str

class InteractionCheckResponse(BaseModel):
    patientId: str
    patientName: str
    patientAge: int
    overallRisk: str
    riskSummary: str
    stats: Dict[str, int]
    findings: List[FindingItem]
    drugDrugInteractions: List[FindingItem]
    drugDiseaseInteractions: List[FindingItem]
    allergyConflicts: List[FindingItem]
    agePrecautions: List[FindingItem]
    historyRisks: List[FindingItem]
    resolvedEntities: Dict[str, List[str]]
    subgraph: Dict[str, Any]

# --- Alert Schemas ---
class AlertResponse(BaseModel):
    id: int
    patient_id: str
    patient_name: str
    severity: str
    title: str
    description: str
    mechanism: Optional[str] = None
    clinical_effect: Optional[str] = None
    recommended_action: Optional[str] = None
    evidence_source: Optional[str] = None
    graph_path: Optional[str] = None
    is_reviewed: bool
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    review_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AlertReviewRequest(BaseModel):
    reviewed_by: str
    review_notes: Optional[str] = "Clinically reviewed and acknowledged."

# --- Report Schemas ---
class ReportCreateRequest(BaseModel):
    patientId: str
    patientName: str
    analysisResult: Dict[str, Any]
    generatedBy: Optional[str] = "Attending Physician"

class ReportResponse(BaseModel):
    id: int
    patient_id: str
    patient_name: str
    overall_risk: str
    summary: str
    report_data: Dict[str, Any]
    generated_by: str
    created_at: datetime

# --- Dashboard Stats Schemas ---
class DashboardStatsResponse(BaseModel):
    totalPatients: int
    totalDrugs: int
    totalInteractionsDetected: int
    criticalAlertsCount: int
    highRiskCount: int
    moderateRiskCount: int
    reviewedAlertsCount: int
    graphNodesCount: int
    graphEdgesCount: int
    neo4jConnected: bool
    recentAnalyses: List[Dict[str, Any]]
    severityDistribution: List[Dict[str, Any]]
    monthlyTrends: List[Dict[str, Any]]
