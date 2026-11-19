// ==============================================================================
// Knowledge Graph-Based Drug Interaction Detection System
// Neo4j Graph Schema & Constraints Definition
// ==============================================================================

// --- Node Uniqueness Constraints & Indexes ---
CREATE CONSTRAINT drug_id_unique IF NOT EXISTS FOR (d:Drug) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT drug_name_unique IF NOT EXISTS FOR (d:Drug) REQUIRE d.name IS UNIQUE;
CREATE CONSTRAINT disease_id_unique IF NOT EXISTS FOR (dis:Disease) REQUIRE dis.id IS UNIQUE;
CREATE CONSTRAINT patient_id_unique IF NOT EXISTS FOR (p:Patient) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT allergy_id_unique IF NOT EXISTS FOR (a:Allergy) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT drug_class_id_unique IF NOT EXISTS FOR (dc:DrugClass) REQUIRE dc.id IS UNIQUE;
CREATE CONSTRAINT symptom_id_unique IF NOT EXISTS FOR (s:Symptom) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT side_effect_id_unique IF NOT EXISTS FOR (se:SideEffect) REQUIRE se.id IS UNIQUE;
CREATE CONSTRAINT medical_history_id_unique IF NOT EXISTS FOR (mh:MedicalHistory) REQUIRE mh.id IS UNIQUE;
CREATE CONSTRAINT age_group_id_unique IF NOT EXISTS FOR (ag:AgeGroup) REQUIRE ag.id IS UNIQUE;

// Indexes for fast lookup
CREATE INDEX drug_name_idx IF NOT EXISTS FOR (d:Drug) ON (d.name);
CREATE INDEX disease_name_idx IF NOT EXISTS FOR (dis:Disease) ON (dis.name);
CREATE INDEX patient_name_idx IF NOT EXISTS FOR (p:Patient) REQUIRE p.name;
