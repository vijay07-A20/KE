# Knowledge Graph-Based Drug Interaction Detection System
## System Architecture & Clinical Decision Support Specification

### 1. Architectural Overview

The system is engineered as an enterprise-grade Clinical Decision Support (CDS) platform designed to intercept adverse drug events (ADEs), fatal drug-drug interactions (DDIs), contraindicated disease-drug combinations, hypersensitivity conflicts, and age-specific pharmacotherapy hazards.

```
                      +------------------------------------------+
                      |         React.js Single Page App         |
                      |   Vite + Tailwind CSS + Lucide Icons     |
                      | Recharts Analytics + React Flow Visualizer|
                      +--------------------+---------------------+
                                           | REST (JSON / Bearer JWT)
                                           v
                      +------------------------------------------+
                      |           FastAPI REST Backend           |
                      |     Pydantic Schemas + Role RBAC         |
                      +---------+--------------------+-----------+
                                |                    |
          +---------------------+                    +----------------------+
          |                                                                 |
          v                                                                 v
+-----------------------------+                           +--------------------------------+
|  SQLite Relational Storage  |                           |  Dual Knowledge Graph Engine   |
|   - Patients & Regimens     |                           |  - Neo4j Bolt Client (Cypher)  |
|   - Clinical Alerts         |                           |  - Embedded NetworkX Reasoner  |
|   - PDF Report Archives     |                           |  - 10 Entity Node Types        |
|   - Audit Security Logs     |                           |  - Multi-hop Clinical Rules    |
+-----------------------------+                           +--------------------------------+
```

---

### 2. Knowledge Graph Ontology & Schema

#### 2.1 Graph Node Entities
| Entity Label | Description | Example Attributes |
|---|---|---|
| `Patient` | Registered hospital patient | `id`, `name`, `age`, `gender`, `weight`, `notes` |
| `Drug` | Active pharmaceutical compound | `id`, `name`, `genericName`, `dosageForm`, `drugClass`, `commonUses`, `ageRestrictions` |
| `Disease` | Diagnosed condition / ICD diagnosis | `id`, `name`, `code`, `description` |
| `DrugClass` | Pharmacological or chemical classification | `id`, `name`, `category`, `description` |
| `Allergy` | Documented hypersensitivity | `id`, `name`, `allergenClass`, `severity`, `description` |
| `SideEffect` | Documented adverse drug reaction | `id`, `name`, `severity`, `description` |
| `MedicalHistory` | Past medical/surgical episode | `id`, `name`, `description` |
| `AgeGroup` | Stratified population cohort | `id`, `name`, `ageMin`, `ageMax`, `description` |

#### 2.2 Relationship Types & Cardinality
- `(Patient)-[:PATIENT_TAKES]->(Drug)`
- `(Patient)-[:PATIENT_HAS]->(Disease)`
- `(Patient)-[:PATIENT_ALLERGIC_TO]->(Allergy)`
- `(Patient)-[:PATIENT_HAS_HISTORY_OF]->(MedicalHistory)`
- `(Drug)-[:DRUG_BELONGS_TO]->(DrugClass)`
- `(Drug)-[:DRUG_TREATS]->(Disease)`
- `(Drug)-[:DRUG_CAUSES]->(SideEffect)`
- `(Drug)-[:DRUG_INTERACTS_WITH {severity, mechanism, clinicalEffect, recommendedAction, evidenceSource}]->(Drug)`
- `(Drug)-[:DRUG_CONTRAINDICATED_FOR {severity, mechanism, clinicalEffect, recommendedAction, evidenceSource}]->(Disease)`
- `(Drug)-[:DRUG_TRIGGERS_ALLERGY {severity, clinicalEffect, recommendedAction, evidenceSource}]->(Allergy)`
- `(Drug)-[:DRUG_REQUIRES_CAUTION_FOR {severity, mechanism, clinicalEffect, recommendedAction, evidenceSource}]->(AgeGroup)`

---

### 3. Clinical Reasoning Rules

The reasoning engine executes systematic graph traversal evaluating:

1. **Rule 1 (Drug-Drug Synergism & Inhibition):**
   Traverses `(d1:Drug)-[:DRUG_INTERACTS_WITH]->(d2:Drug)`.
   *Example:* Warfarin + Aspirin -> Critical internal bleeding via dual platelet and clotting factor suppression.

2. **Rule 2 (Drug-Disease Contraindications):**
   Traverses `(d:Drug)-[:DRUG_CONTRAINDICATED_FOR]->(dis:Disease)`.
   *Example:* Metformin in Chronic Kidney Disease Stage 4-5 -> Biguanide accumulation causing life-threatening lactic acidosis (MALA).

3. **Rule 3 (Allergy Hypersensitivity Conflicts):**
   Traverses direct triggers `(d:Drug)-[:DRUG_TRIGGERS_ALLERGY]->(al:Allergy)` and class-level inheritance `(d)-[:DRUG_BELONGS_TO]->(dc)` matching `al.allergenClass`.
   *Example:* Amoxicillin in Penicillin-allergic patient -> IgE-mediated anaphylaxis.

4. **Rule 4 (Beers Criteria Age-Specific Risks):**
   Categorizes patient by age (Geriatric >= 65, Pediatric < 18) and evaluates `(d:Drug)-[:DRUG_REQUIRES_CAUTION_FOR]->(ag:AgeGroup)`.
   *Example:* NSAIDs (Ibuprofen) in elderly patients -> Acute renal failure and silent peptic perforation.

5. **Rule 5 (Medical History Vulnerability):**
   Evaluates prior clinical trauma against current prescriptions `(d:Drug)-[:DRUG_CONTRAINDICATED_FOR]->(mh:MedicalHistory)`.
   *Example:* Lisinopril in patient with prior ACEi-induced Angioedema -> Fatal laryngeal asphyxia.

---

### 4. Dual Graph Engine Design

To eliminate external infrastructure bottlenecks during evaluation or standalone deployments:
- **Live Neo4j Mode:** When Neo4j runs on Bolt port 7687, Cypher queries execute directly against Neo4j Desktop or AuraDB.
- **Embedded In-Memory Mode:** Automatic fallback to NetworkX multi-directional graph engine pre-loaded with the exact identical validated nodes and edges.
- Transparent mode switching: All frontend visualizations and reasoning APIs work with 100% fidelity regardless of whether a live Neo4j daemon is running.
