# REST API Documentation
## Knowledge Graph Clinical Decision Support System

Base URL: `http://127.0.0.1:8000/api`
Interactive Swagger Docs: `http://127.0.0.1:8000/api/docs`

---

### 1. Authentication (`/auth`)

#### `POST /auth/login`
- **Description:** Authenticates physician, pharmacist, or administrator.
- **Request Body:**
  ```json
  {
    "username": "dr.sarah",
    "password": "doctor123"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "username": "dr.sarah",
      "email": "sarah.connor@hospital.org",
      "fullName": "Dr. Sarah Connor, MD",
      "role": "Doctor"
    }
  }
  ```

#### `POST /auth/quick-switch/{role}`
- **Description:** Switch between Doctor, Pharmacist, and Admin roles for seamless demo inspection.

---

### 2. Clinical Interaction Checker (`/interactions`)

#### `POST /interactions/check`
- **Description:** Central clinical reasoning engine. Analyzes patient ID or ad-hoc custom combinations of medications, diseases, allergies, age, and medical history.
- **Request Body:**
  ```json
  {
    "patientId": "PAT-001",
    "patientName": "Eleanor Vance (Fictional)",
    "age": 72,
    "drugs": ["Warfarin", "Aspirin"],
    "diseases": ["Atrial Fibrillation", "Hypertension"],
    "allergies": [],
    "medicalHistory": ["History of Major GI Bleeding"]
  }
  ```
- **Response:**
  ```json
  {
    "patientId": "PAT-001",
    "patientName": "Eleanor Vance (Fictional)",
    "patientAge": 72,
    "overallRisk": "Critical",
    "riskSummary": "CRITICAL ALERT: Urgent clinical assessment required...",
    "stats": {
      "totalFindings": 3,
      "criticalCount": 1,
      "highCount": 2,
      "moderateCount": 0,
      "lowCount": 0
    },
    "findings": [
      {
        "id": "ddi-drug-warfarin-drug-aspirin",
        "category": "Drug-Drug Interaction",
        "title": "Warfarin + Aspirin",
        "primaryEntity": "Warfarin",
        "secondaryEntity": "Aspirin",
        "severity": "Critical",
        "description": "Additive anticoagulant and antiplatelet inhibition.",
        "mechanism": "Platelet COX-1 blockade + prothrombin depletion.",
        "clinicalEffect": "Fatal internal hemorrhage, intracranial bleeding.",
        "recommendedAction": "Avoid concurrent use unless strictly indicated.",
        "evidenceSource": "FDA Warfarin Label & Lexicomp Drug Interactions",
        "graphPath": "(Warfarin:Drug) ──[:DRUG_INTERACTS_WITH]──> (Aspirin:Drug)"
      }
    ],
    "subgraph": { "nodes": [...], "edges": [...] }
  }
  ```

---

### 3. Patient Management (`/patients`)

- `GET /patients`: List registered patients.
- `GET /patients/{id}`: Retrieve detailed patient clinical record.
- `POST /patients`: Register new patient with dynamic medications and conditions.
- `PUT /patients/{id}`: Update patient details.
- `DELETE /patients/{id}`: Delete patient record.

---

### 4. Drug Formulary (`/drugs`)

- `GET /drugs`: Search and filter drugs by name or class.
- `GET /drugs/{id}`: Get drug details with side effects and contraindications.
- `POST /drugs`: Add custom drug entity to knowledge graph.
- `PUT /drugs/{id}`: Update drug properties.
- `DELETE /drugs/{id}`: Remove drug entity.

---

### 5. Knowledge Graph Visualization (`/graph`)

- `GET /graph/full`: Returns full graph nodes and edges for React Flow.
- `GET /graph/patient/{patient_id}`: Returns patient-specific subgraph.
- `GET /graph/drug/{drug_id}`: Returns drug 1-hop ego network.
- `GET /graph/status`: Node and relationship counts, Neo4j connection status.

---

### 6. Clinical Alerts & Reports (`/alerts`, `/reports`)

- `GET /alerts`: Filterable by severity and review status.
- `POST /alerts/{id}/review`: Sign off on alert with clinical notes.
- `POST /reports/generate`: Save clinical report.
- `GET /reports/{id}/pdf`: Download styled ReportLab PDF.
