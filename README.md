# Knowledge Graph-Based Drug Interaction Detection and Clinical Decision Support System

An enterprise-grade, modern full-stack clinical decision support web application built for hospitals to intercept fatal drug interactions, disease contraindications, age-related medication risks, and allergy conflicts using **Knowledge Graphs** and semantic rule-based reasoning.

---

## 🌟 Key Capabilities

1. **Drug-Drug Interaction Detection (DDI):** Detects multi-drug pharmacodynamic and pharmacokinetic synergies (e.g., Warfarin + Aspirin hemorrhagic risk, Ciprofloxacin + Amiodarone fatal QT prolongation).
2. **Drug-Disease Contraindications:** Intercepts contraindicated prescriptions (e.g., Metformin in Chronic Kidney Disease, NSAIDs in active Peptic Ulcer Disease).
3. **Allergy-Related Risks:** Detects both direct allergen triggers and chemical class cross-reactivity (e.g., Amoxicillin in Penicillin allergy, Aspirin in NSAID hypersensitivity).
4. **Age-Stratified Precautions (Beers Criteria 2023):** Flags geriatric (65+) and pediatric vulnerabilities automatically.
5. **Medical History Vulnerability:** Cross-checks past patient history (e.g., prior ACEi-induced Angioedema vs. Lisinopril).
6. **Severity Classification:** Classifies all detected risks into **Low**, **Moderate**, **High**, and **Critical**.
7. **Graph-Based Explainability:** Displays the exact graph reasoning route `(Drug A) ──[:INTERACTS_WITH]──> (Drug B)` alongside mechanisms, clinical effects, and traceable evidence sources.
8. **Interactive React Flow Visualization:** Dynamic pan, zoom, drag, and node inspection for both the global hospital knowledge graph and patient-specific subgraphs.
9. **Clinical Safety Reports & PDF Generation:** Professional hospital PDF generation via ReportLab with physician & pharmacist signature blocks.
10. **Pharmacovigilance Alert Management:** Triage, review, and acknowledge high/critical interaction alerts with clinician audit logging.

---

## 🛠 Technology Stack

- **Frontend:** React 19, Vite 5, Tailwind CSS, JavaScript, Lucide React Icons, Recharts (analytics charts), React Flow (`@xyflow/react`) for graph visualization.
- **Backend:** Python 3.11, FastAPI, Pydantic, REST API, Uvicorn.
- **Database & Graph:** Neo4j Graph Database (Cypher scripts provided in `database/`) + Dual In-Memory NetworkX Graph Reasoner + SQLite for patient and alert records.
- **Documentation & Reporting:** ReportLab for server-side clinical PDF rendering, OpenAPI / Swagger at `/api/docs`.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v20+)
- Python 3.10+ (with pip)

### 1. Backend Setup & Startup
```powershell
cd backend
python -m pip install -r requirements.txt   # Or pip install fastapi uvicorn pydantic sqlalchemy aiosqlite neo4j networkx bcrypt python-jose reportlab python-multipart pytest httpx
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
The FastAPI backend will start at `http://127.0.0.1:8000`.
- API Documentation (Swagger): `http://127.0.0.1:8000/api/docs`

### 2. Frontend Setup & Startup
```powershell
cd frontend
npm install
npm run dev
```
The React frontend will be accessible at `http://localhost:3000`.

---

## 🔐 Demo Accounts
- **Doctor:** `dr.sarah` / `doctor123` (Dr. Sarah Connor, MD - Cardiologist)
- **Pharmacist:** `pharm.marcus` / `pharm123` (Marcus Vance, PharmD - Lead Pharmacist)
- **Administrator:** `admin` / `admin123` (Clinical Administrator)

*(The top navigation bar also features a 1-click Role Switcher to seamlessly test role-based access control).*

---

## 🧪 Running Automated Tests
```powershell
cd backend
python -m pytest app/tests/
```
All unit tests verify graph initialization, Warfarin+Aspirin DDI, Metformin+CKD contraindication, Penicillin allergy conflicts, Beers Criteria geriatric cautions, and safe combinations.

---

## 📁 Repository Structure
```
frontend/
- src/
  - components/
  - context/ (AuthContext)
  - layouts/ (MainLayout)
  - pages/ (Dashboard, Patients, Checker, Graph, Drugs, Alerts, Reports, Settings, Login)
  - services/ (api.js)

backend/
- app/
  - main.py (FastAPI entry point)
  - config.py
  - routes/ (auth, dashboard, patients, drugs, interactions, graph, alerts, reports, settings)
  - models/ (SQLAlchemy models)
  - schemas/ (Pydantic schemas)
  - services/ (PDF generator)
  - knowledge_graph/ (Neo4j client, graph engine, knowledge dataset)
  - reasoning/ (Clinical reasoning engine)
  - database/ (SQLite manager)
  - tests/ (Pytest test suite)

database/
- neo4j_schema.cypher (Neo4j constraints and indexes)
- sample_data.cypher (Medically validated dataset)

docs/
- README.md
- architecture.md
- API_DOCUMENTATION.md
```

---

## ⚖️ Academic Medical Disclaimer
This software is an academic Clinical Decision Support prototype and NOT a certified medical device. It must never replace the independent clinical judgment of a licensed healthcare practitioner. All rules and interaction data are sourced from verified medical literature (FDA labels, Lexicomp, Beers Criteria 2023, CPIC Guidelines, CredibleMeds).
