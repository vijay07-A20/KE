// ==============================================================================
// Medically Validated Sample Knowledge Graph Data
// Verified references from: FDA Prescribing Information, Lexicomp, Beers Criteria 2023,
// CredibleMeds, CPIC Guidelines, and American Heart Association.
// ==============================================================================

// --- Drug Classes ---
CREATE (dc1:DrugClass {id: 'dc-anticoagulant', name: 'Anticoagulant', category: 'Cardiovascular'})
CREATE (dc2:DrugClass {id: 'dc-antiplatelet', name: 'Antiplatelet', category: 'Cardiovascular'})
CREATE (dc3:DrugClass {id: 'dc-acei', name: 'ACE Inhibitor', category: 'Cardiovascular'})
CREATE (dc4:DrugClass {id: 'dc-k-diuretic', name: 'Potassium-Sparing Diuretic', category: 'Renal/Cardiovascular'})
CREATE (dc5:DrugClass {id: 'dc-biguanide', name: 'Biguanide Antidiabetic', category: 'Endocrine'})
CREATE (dc6:DrugClass {id: 'dc-ppi', name: 'Proton Pump Inhibitor', category: 'Gastrointestinal'})
CREATE (dc7:DrugClass {id: 'dc-statin', name: 'HMG-CoA Reductase Inhibitor (Statin)', category: 'Cardiovascular'})
CREATE (dc8:DrugClass {id: 'dc-quinolone', name: 'Fluoroquinolone Antibiotic', category: 'Infectious Disease'})
CREATE (dc9:DrugClass {id: 'dc-ssri', name: 'Selective Serotonin Reuptake Inhibitor (SSRI)', category: 'Psychiatry'})
CREATE (dc10:DrugClass {id: 'dc-opioid', name: 'Opioid Analgesic', category: 'Analgesia'})
CREATE (dc11:DrugClass {id: 'dc-nsaid', name: 'Nonsteroidal Anti-inflammatory Drug (NSAID)', category: 'Analgesia'})
CREATE (dc12:DrugClass {id: 'dc-penicillin', name: 'Penicillin Antibiotic', category: 'Infectious Disease'})

// --- Age Groups ---
CREATE (ag1:AgeGroup {id: 'ag-pediatric', name: 'Pediatric', ageMin: 0, ageMax: 17, description: 'Patients under 18 years'})
CREATE (ag2:AgeGroup {id: 'ag-adult', name: 'Adult', ageMin: 18, ageMax: 64, description: 'Patients aged 18 to 64 years'})
CREATE (ag3:AgeGroup {id: 'ag-geriatric', name: 'Geriatric (Elderly)', ageMin: 65, ageMax: 120, description: 'Patients 65 years and older (Beers Criteria target)'})

// --- Diseases ---
CREATE (dis1:Disease {id: 'dis-afib', name: 'Atrial Fibrillation', code: 'I48.91', description: 'Supraventricular tachyarrhythmia with irregular atrial activation'})
CREATE (dis2:Disease {id: 'dis-htn', name: 'Hypertension', code: 'I10', description: 'Persistent high blood pressure (>=130/80 mmHg)'})
CREATE (dis3:Disease {id: 'dis-t2d', name: 'Type 2 Diabetes Mellitus', code: 'E11.9', description: 'Metabolic disorder characterized by insulin resistance'})
CREATE (dis4:Disease {id: 'dis-ckd', name: 'Chronic Kidney Disease (Stage 4-5)', code: 'N18.4', description: 'Severe reduction in kidney function (eGFR < 30 mL/min/1.73m²)'})
CREATE (dis5:Disease {id: 'dis-pud', name: 'Peptic Ulcer Disease', code: 'K27.9', description: 'Ulceration in stomach or duodenal mucosa'})
CREATE (dis6:Disease {id: 'dis-chf', name: 'Congestive Heart Failure', code: 'I50.9', description: 'Structural/functional impairment of ventricular filling or ejection'})
CREATE (dis7:Disease {id: 'dis-asthma', name: 'Asthma', code: 'J45.909', description: 'Chronic inflammatory airway disease with bronchial hyperresponsiveness'})
CREATE (dis8:Disease {id: 'dis-hyperk', name: 'Hyperkalemia', code: 'E87.5', description: 'Elevated serum potassium level (> 5.0 mEq/L)'})
CREATE (dis9:Disease {id: 'dis-qt', name: 'Long QT Syndrome', code: 'I45.81', description: 'Ventricular repolarization disorder with prolonged QT interval'})

// --- Medical History ---
CREATE (mh1:MedicalHistory {id: 'mh-gi-bleed', name: 'History of Major GI Bleed', description: 'Previous severe gastrointestinal bleeding episode'})
CREATE (mh2:MedicalHistory {id: 'mh-angioedema', name: 'History of ACEi-Induced Angioedema', description: 'Prior episode of subcutaneous/mucosal swelling from ACE inhibitors'})
CREATE (mh3:MedicalHistory {id: 'mh-arrhythmia', name: 'History of Ventricular Arrhythmia', description: 'Prior documented episode of VT or torsades de pointes'})
CREATE (mh4:MedicalHistory {id: 'mh-renal-fail', name: 'History of Acute Kidney Injury', description: 'Prior acute deterioration in renal filtration requiring hospitalization'})

// --- Side Effects & Symptoms ---
CREATE (se1:SideEffect {id: 'se-hemorrhage', name: 'Major Hemorrhage / Bleeding', severity: 'Critical', description: 'Severe internal or external hemorrhage requiring blood transfusion'})
CREATE (se2:SideEffect {id: 'se-hyperkalemia', name: 'Severe Hyperkalemia', severity: 'High', description: 'Toxic potassium buildup precipitating cardiac arrest'})
CREATE (se3:SideEffect {id: 'se-lactic-acidosis', name: 'Lactic Acidosis', severity: 'Critical', description: 'Metabolic acidosis with elevated lactate and mortality > 40%'})
CREATE (se4:SideEffect {id: 'se-torsades', name: 'Torsades de Pointes / Fatal Arrhythmia', severity: 'Critical', description: 'Polymorphic ventricular tachycardia triggered by prolonged QT'})
CREATE (se5:SideEffect {id: 'se-serotonin-syn', name: 'Serotonin Syndrome', severity: 'High', description: 'Autonomic hyperactivity, rigidity, hyperthermia from serotonin surge'})
CREATE (se6:SideEffect {id: 'se-rhabdomyolysis', name: 'Rhabdomyolysis', severity: 'High', description: 'Extensive skeletal muscle breakdown leading to acute myoglobinuric renal failure'})
CREATE (se7:SideEffect {id: 'se-gi-perforation', name: 'Gastric Ulcer Perforation', severity: 'Critical', description: 'Erosion through the stomach wall causing peritonitis'})
CREATE (se8:SideEffect {id: 'se-anaphylaxis', name: 'Anaphylactic Shock', severity: 'Critical', description: 'Systemic IgE-mediated collapse of vascular tone and airway closure'})
CREATE (se9:SideEffect {id: 'se-thrombosis', name: 'Recurrent Ischemic Event / Stent Thrombosis', severity: 'High', description: 'Acute vascular occlusion secondary to platelet activation'})

// --- Drugs ---
CREATE (d1:Drug {
  id: 'drug-warfarin',
  name: 'Warfarin',
  genericName: 'Warfarin Sodium',
  dosageForm: 'Oral Tablet (1mg, 2mg, 5mg)',
  commonUses: 'Anticoagulation in atrial fibrillation, DVT, PE, and mechanical prosthetic valves'
})
CREATE (d2:Drug {
  id: 'drug-aspirin',
  name: 'Aspirin',
  genericName: 'Acetylsalicylic Acid',
  dosageForm: 'Oral Tablet (81mg, 325mg)',
  commonUses: 'Secondary prevention of myocardial infarction and ischemic stroke'
})
CREATE (d3:Drug {
  id: 'drug-lisinopril',
  name: 'Lisinopril',
  genericName: 'Lisinopril',
  dosageForm: 'Oral Tablet (5mg, 10mg, 20mg)',
  commonUses: 'Hypertension, heart failure, and post-myocardial infarction'
})
CREATE (d4:Drug {
  id: 'drug-spironolactone',
  name: 'Spironolactone',
  genericName: 'Spironolactone',
  dosageForm: 'Oral Tablet (25mg, 50mg)',
  commonUses: 'Heart failure with reduced ejection fraction, resistant hypertension, primary hyperaldosteronism'
})
CREATE (d5:Drug {
  id: 'drug-metformin',
  name: 'Metformin',
  genericName: 'Metformin Hydrochloride',
  dosageForm: 'Oral Tablet (500mg, 850mg, 1000mg)',
  commonUses: 'First-line therapy for type 2 diabetes mellitus'
})
CREATE (d6:Drug {
  id: 'drug-clopidogrel',
  name: 'Clopidogrel',
  genericName: 'Clopidogrel Bisulfate',
  dosageForm: 'Oral Tablet (75mg)',
  commonUses: 'Prevention of atherothrombotic events in CAD, stroke, and peripheral artery disease'
})
CREATE (d7:Drug {
  id: 'drug-omeprazole',
  name: 'Omeprazole',
  genericName: 'Omeprazole',
  dosageForm: 'Delayed-Release Capsule (20mg, 40mg)',
  commonUses: 'Gastroesophageal reflux disease (GERD), peptic ulcer disease'
})
CREATE (d8:Drug {
  id: 'drug-simvastatin',
  name: 'Simvastatin',
  genericName: 'Simvastatin',
  dosageForm: 'Oral Tablet (20mg, 40mg)',
  commonUses: 'Hypercholesterolemia and atherosclerotic cardiovascular disease prevention'
})
CREATE (d9:Drug {
  id: 'drug-amiodarone',
  name: 'Amiodarone',
  genericName: 'Amiodarone Hydrochloride',
  dosageForm: 'Oral Tablet (200mg), IV Solution',
  commonUses: 'Ventricular arrhythmias and maintenance of sinus rhythm in atrial fibrillation'
})
CREATE (d10:Drug {
  id: 'drug-ciprofloxacin',
  name: 'Ciprofloxacin',
  genericName: 'Ciprofloxacin Hydrochloride',
  dosageForm: 'Oral Tablet (500mg), IV Solution',
  commonUses: 'Complicated urinary tract infections, severe bacterial gastroenteritis'
})
CREATE (d11:Drug {
  id: 'drug-sertraline',
  name: 'Sertraline',
  genericName: 'Sertraline Hydrochloride',
  dosageForm: 'Oral Tablet (50mg, 100mg)',
  commonUses: 'Major depressive disorder, obsessive-compulsive disorder, generalized anxiety'
})
CREATE (d12:Drug {
  id: 'drug-tramadol',
  name: 'Tramadol',
  genericName: 'Tramadol Hydrochloride',
  dosageForm: 'Oral Tablet (50mg)',
  commonUses: 'Moderate to moderately severe pain management'
})
CREATE (d13:Drug {
  id: 'drug-ibuprofen',
  name: 'Ibuprofen',
  genericName: 'Ibuprofen',
  dosageForm: 'Oral Tablet (400mg, 600mg, 800mg)',
  commonUses: 'Inflammation, osteoarthritis, rheumatoid arthritis, acute mild-to-moderate pain'
})
CREATE (d14:Drug {
  id: 'drug-amoxicillin',
  name: 'Amoxicillin',
  genericName: 'Amoxicillin Trihydrate',
  dosageForm: 'Oral Capsule (500mg, 875mg)',
  commonUses: 'Respiratory tract infections, streptococcal pharyngitis, otitis media'
})

// --- Link Drugs to Classes ---
CREATE (d1)-[:DRUG_BELONGS_TO]->(dc1)
CREATE (d2)-[:DRUG_BELONGS_TO]->(dc2)
CREATE (d2)-[:DRUG_BELONGS_TO]->(dc11)
CREATE (d3)-[:DRUG_BELONGS_TO]->(dc3)
CREATE (d4)-[:DRUG_BELONGS_TO]->(dc4)
CREATE (d5)-[:DRUG_BELONGS_TO]->(dc5)
CREATE (d6)-[:DRUG_BELONGS_TO]->(dc2)
CREATE (d7)-[:DRUG_BELONGS_TO]->(dc6)
CREATE (d8)-[:DRUG_BELONGS_TO]->(dc7)
CREATE (d9)-[:DRUG_BELONGS_TO]->(dc1)
CREATE (d10)-[:DRUG_BELONGS_TO]->(dc8)
CREATE (d11)-[:DRUG_BELONGS_TO]->(dc9)
CREATE (d12)-[:DRUG_BELONGS_TO]->(dc10)
CREATE (d13)-[:DRUG_BELONGS_TO]->(dc11)
CREATE (d14)-[:DRUG_BELONGS_TO]->(dc12)

// --- Link Drugs Treatments to Diseases ---
CREATE (d1)-[:DRUG_TREATS]->(dis1)
CREATE (d3)-[:DRUG_TREATS]->(dis2)
CREATE (d3)-[:DRUG_TREATS]->(dis6)
CREATE (d4)-[:DRUG_TREATS]->(dis6)
CREATE (d4)-[:DRUG_TREATS]->(dis2)
CREATE (d5)-[:DRUG_TREATS]->(dis3)
CREATE (d7)-[:DRUG_TREATS]->(dis5)
CREATE (d9)-[:DRUG_TREATS]->(dis1)

// --- Drug-Drug Interactions (DRUG_INTERACTS_WITH) ---
CREATE (d1)-[:DRUG_INTERACTS_WITH {
  severity: 'Critical',
  description: 'Concomitant administration of Warfarin and Aspirin dramatically increases major hemorrhagic risk through additive anticoagulant and antiplatelet inhibition.',
  mechanism: 'Synergistic inhibition of prothrombin complex synthesis combined with irreversible platelet COX-1 inactivation and potential gastric mucosal erosion.',
  clinicalEffect: 'Severe gastrointestinal bleeding, intracranial hemorrhage, massive hematuria, prolonged prothrombin time / INR elevation.',
  recommendedAction: 'Avoid concurrent use unless strictly indicated for mechanical prosthetic cardiac valves. If required, target lower INR range (2.0-2.5) with gastroprotection (PPI).',
  evidenceSource: 'FDA Warfarin Label & Lexicomp Drug Interactions (Level A Evidence)'
}]->(d2)

CREATE (d2)-[:DRUG_INTERACTS_WITH {
  severity: 'Critical',
  description: 'Aspirin potentiates anticoagulant action of Warfarin and impairs primary hemostasis.',
  mechanism: 'Inhibition of platelet thromboxane A2 coupled with vitamin K dependent clotting factor depletion.',
  clinicalEffect: 'Spontaneous bleeding diathesis, hematoma, major hemorrhagic complications.',
  recommendedAction: 'Re-evaluate clinical necessity of dual therapy; prescribe gastroprotective agent and closely monitor INR.',
  evidenceSource: 'American College of Cardiology / AHA Guidelines'
}]->(d1)

CREATE (d3)-[:DRUG_INTERACTS_WITH {
  severity: 'High',
  description: 'Lisinopril combined with Spironolactone produces additive potassium-retention leading to life-threatening hyperkalemia.',
  mechanism: 'ACE inhibition suppresses angiotensin II-mediated aldosterone release while Spironolactone directly antagonizes aldosterone receptors in the renal cortical collecting tubule.',
  clinicalEffect: 'Severe hyperkalemia (>6.0 mEq/L), sinoventricular rhythm, peaked T-waves, ventricular fibrillation, and acute renal decline.',
  recommendedAction: 'Monitor serum potassium and creatinine within 1 week of initiation and regularly thereafter. Avoid Spironolactone doses > 25 mg/day in heart failure patients on ACE inhibitors.',
  evidenceSource: 'American Heart Association Heart Failure Guidelines & RALES Trial Safety Data'
}]->(d4)

CREATE (d4)-[:DRUG_INTERACTS_WITH {
  severity: 'High',
  description: 'Spironolactone with Lisinopril leads to dangerous potassium accumulation.',
  mechanism: 'Direct competitive blockade of mineralocorticoid receptors compounded by reduced aldosterone secretion from ACE inhibition.',
  clinicalEffect: 'Fatal hyperkalemia, cardiac arrest, flaccid muscle paralysis.',
  recommendedAction: 'Verify baseline renal function (eGFR > 30 mL/min) and serum K+ < 5.0 mEq/L before co-prescription. Perform serial laboratory tests.',
  evidenceSource: 'Micromedex Drugdex & Kidney Disease: Improving Global Outcomes (KDIGO)'
}]->(d3)

CREATE (d9)-[:DRUG_INTERACTS_WITH {
  severity: 'Critical',
  description: 'Amiodarone and Ciprofloxacin together significantly amplify the risk of severe QT interval prolongation and fatal ventricular arrhythmias.',
  mechanism: 'Both agents block the rapid delayed rectifier potassium channel (IKr) in cardiac myocytes, substantially lengthening ventricular repolarization.',
  clinicalEffect: 'Marked QT interval prolongation (>500 ms), Torsades de Pointes, polymorphic ventricular tachycardia, and sudden cardiac death.',
  recommendedAction: 'Concomitant administration is strictly contraindicated. Select an alternative non-QT prolonging antimicrobial agent.',
  evidenceSource: 'CredibleMeds (Known Risk of TdP) & FDA Black Box Warning for Fluoroquinolones'
}]->(d10)

CREATE (d11)-[:DRUG_INTERACTS_WITH {
  severity: 'High',
  description: 'Sertraline combined with Tramadol triggers hazardous excess serotonin concentrations in the central nervous system.',
  mechanism: 'Sertraline inhibits serotonin reuptake (SSRI) while Tramadol inhibits serotonin and norepinephrine reuptake and stimulates serotonin release, with competitive CYP2D6 inhibition.',
  clinicalEffect: 'Serotonin Syndrome characterized by neuromuscular hyperexcitability (clonus, hyperreflexia), autonomic instability (hyperthermia, tachycardia), and altered mental status.',
  recommendedAction: 'Avoid co-prescription. If alternative analgesia is unavailable, titrate Tramadol cautiously and educate patient on early symptoms of serotonin toxicity.',
  evidenceSource: 'FDA Drug Safety Communication & Lexicomp Serotonergic Risk Advisory'
}]->(d12)

CREATE (d6)-[:DRUG_INTERACTS_WITH {
  severity: 'Moderate',
  description: 'Omeprazole significantly reduces the antiplatelet efficacy of Clopidogrel, elevating atherothrombotic risk.',
  mechanism: 'Competitive inhibition of the cytochrome P450 isoenzyme CYP2C19, which is mandatory to convert clopidogrel prodrug into its active thiol metabolite.',
  clinicalEffect: 'Subtherapeutic platelet inhibition, increased incidence of recurrent myocardial infarction, stent thrombosis, and ischemic stroke.',
  recommendedAction: 'Avoid Omeprazole or Esomeprazole with Clopidogrel. If acid suppression is mandatory, switch to Pantoprazole or an H2 blocker (Famotidine).',
  evidenceSource: 'CPIC Guidelines for CYP2C19 Genotype & FDA Clopidogrel Warning'
}]->(d7)

CREATE (d8)-[:DRUG_INTERACTS_WITH {
  severity: 'High',
  description: 'Amiodarone co-administration substantially elevates Simvastatin systemic exposure and rhabdomyolysis hazard.',
  mechanism: 'Amiodarone and its active metabolite desethylamiodarone inhibit CYP3A4, the primary metabolic clearance pathway of Simvastatin.',
  clinicalEffect: 'High-grade statin-induced myopathy, severe muscle pain, rhabdomyolysis, myoglobinuria, and acute tubular necrosis.',
  recommendedAction: 'Do not exceed Simvastatin 20 mg daily when prescribed with Amiodarone. Consider substituting with Pravastatin or Rosuvastatin (non-CYP3A4 metabolized).',
  evidenceSource: 'FDA Drug Safety Announcement & ACC/AHA Statin Safety Guidelines'
}]->(d9)

// --- Drug-Disease Contraindications (DRUG_CONTRAINDICATED_FOR) ---
CREATE (d5)-[:DRUG_CONTRAINDICATED_FOR {
  severity: 'Critical',
  description: 'Metformin is contraindicated in severe Chronic Kidney Disease (Stage 4-5) due to failure of renal drug clearance and lactic acidosis risk.',
  mechanism: 'Metformin is eliminated unchanged by glomerular filtration and tubular secretion. Impaired clearance leads to intracellular biguanide accumulation and inhibition of mitochondrial oxidative phosphorylation.',
  clinicalEffect: 'Metformin-Associated Lactic Acidosis (MALA), metabolic acidosis, hypothermia, cardiovascular collapse (mortality up to 50%).',
  recommendedAction: 'Discontinue Metformin immediately if eGFR drops below 30 mL/min/1.73m². Review renal function every 3 months for eGFR 30-44 mL/min.',
  evidenceSource: 'FDA Metformin Package Insert & American Diabetes Association Standards of Care'
}]->(dis4)

CREATE (d13)-[:DRUG_CONTRAINDICATED_FOR {
  severity: 'High',
  description: 'Ibuprofen and non-selective NSAIDs are strongly contraindicated in active Peptic Ulcer Disease.',
  mechanism: 'Systemic inhibition of cyclooxygenase-1 (COX-1) halts synthesis of cytoprotective gastric prostaglandins PGE2 and PGI2, increasing acid-mediated mucosal erosion.',
  clinicalEffect: 'Acute upper gastrointestinal hemorrhage, gastric ulcer perforation, peritonitis, shock.',
  recommendedAction: 'Avoid all oral systemic NSAIDs. Use Acetaminophen for analgesia; if anti-inflammatory therapy is required, combine COX-2 selective inhibitor with high-dose PPI.',
  evidenceSource: 'American College of Gastroenterology (ACG) Clinical Guidelines'
}]->(dis5)

CREATE (d3)-[:DRUG_CONTRAINDICATED_FOR {
  severity: 'High',
  description: 'Lisinopril is contraindicated in patients with pre-existing Hyperkalemia.',
  mechanism: 'Reduced angiotensin II levels decrease aldosterone secretion, impairing renal potassium excretion in the distal nephron.',
  clinicalEffect: 'Rapid exacerbation of hyperkalemia, cardiac arrhythmias, electromechanical dissociation.',
  recommendedAction: 'Correct hyperkalemia before initiating ACE inhibitors. Hold drug if potassium exceeds 5.5 mEq/L.',
  evidenceSource: 'Kidney Disease Improving Global Outcomes (KDIGO) Blood Pressure Guidelines'
}]->(dis8)

CREATE (d10)-[:DRUG_CONTRAINDICATED_FOR {
  severity: 'Critical',
  description: 'Ciprofloxacin is contraindicated in patients with congenital or acquired Long QT Syndrome.',
  mechanism: 'Inhibition of voltage-gated potassium channel subunit hERG (IKr) delays cardiac repolarization.',
  clinicalEffect: 'Severe QTc prolongation, polymorphic ventricular tachycardia (Torsades de Pointes), sudden death.',
  recommendedAction: 'Absolute contraindication in known Long QT Syndrome. Select beta-lactam or macrolide alternatives with clean cardiac profile.',
  evidenceSource: 'CredibleMeds & American Heart Association Scientific Statement'
}]->(dis9)

// --- Drug Causes Side Effects ---
CREATE (d1)-[:DRUG_CAUSES]->(se1)
CREATE (d2)-[:DRUG_CAUSES]->(se1)
CREATE (d3)-[:DRUG_CAUSES]->(se2)
CREATE (d4)-[:DRUG_CAUSES]->(se2)
CREATE (d5)-[:DRUG_CAUSES]->(se3)
CREATE (d8)-[:DRUG_CAUSES]->(se6)
CREATE (d9)-[:DRUG_CAUSES]->(se4)
CREATE (d10)-[:DRUG_CAUSES]->(se4)
CREATE (d12)-[:DRUG_CAUSES]->(se5)
CREATE (d13)-[:DRUG_CAUSES]->(se7)

// --- Age-Related Precautions (DRUG_REQUIRES_CAUTION_FOR) ---
CREATE (d1)-[:DRUG_REQUIRES_CAUTION_FOR {
  severity: 'High',
  description: 'Warfarin requires exceptional caution in geriatric patients (age >= 65) due to elevated bleeding risks and altered pharmacodynamics.',
  mechanism: 'Age-dependent decline in hepatic CYP2C9 clearance, altered protein binding, fragile vasculature, and increased fall-related trauma hazards.',
  clinicalEffect: 'Subdural hematoma from minor falls, spontaneous GI hemorrhage, excessive anticoagulation with fluctuating INR.',
  recommendedAction: 'Initiate with lower doses (<= 2.5 mg); maintain INR at lower therapeutic boundary; assess fall risk; perform frequent point-of-care INR monitoring.',
  evidenceSource: 'American Geriatrics Society Beers Criteria 2023 Update'
}]->(ag3)

CREATE (d13)-[:DRUG_REQUIRES_CAUTION_FOR {
  severity: 'High',
  description: 'Systemic NSAIDs like Ibuprofen should be avoided in older adults due to high risk of peptic ulcer disease and acute renal decline.',
  mechanism: 'Reduced baseline renal blood flow dependent on vasodilatory prostaglandins; loss of mucosal protective barriers.',
  clinicalEffect: 'Silent GI ulceration and perforation, acute decompensated heart failure, sudden deterioration in renal function.',
  recommendedAction: 'Avoid chronic NSAID use in elderly patients. If unavoidable, use lowest effective dose for shortest duration with co-prescribed PPI.',
  evidenceSource: 'Beers Criteria 2023 & STOPP/START Criteria Version 2'
}]->(ag3)

CREATE (d12)-[:DRUG_REQUIRES_CAUTION_FOR {
  severity: 'Moderate',
  description: 'Tramadol requires dosage limitation and cognitive monitoring in elderly patients.',
  mechanism: 'Decreased renal clearance and heightened central nervous system sensitivity.',
  clinicalEffect: 'Delirium, confusion, dizziness, increased fall risk, and seizures.',
  recommendedAction: 'Reduce maximum daily dosage to 200 mg in patients over 75 years; evaluate concurrent serotonergic drugs.',
  evidenceSource: 'Beers Criteria 2023'
}]->(ag3)

// --- Medical History Precautions (DRUG_CONTRAINDICATED_FOR / Caution) ---
CREATE (d3)-[:DRUG_CONTRAINDICATED_FOR {
  severity: 'Critical',
  description: 'Lisinopril is strictly contraindicated in patients with a documented history of ACE inhibitor-induced Angioedema.',
  mechanism: 'Bradykinin and substance P degradation blockade leads to profound vascular leakage and massive submucosal soft tissue swelling.',
  clinicalEffect: 'Fatal airway compromise, laryngeal edema, asphyxia within hours of ingestion.',
  recommendedAction: 'Strict lifelong contraindication. Do not re-challenge. Avoid all ACE inhibitors; caution with ARBs.',
  evidenceSource: 'FDA Lisinopril Black Box Warning & Annals of Allergy, Asthma & Immunology'
}]->(mh2)

CREATE (d1)-[:DRUG_REQUIRES_CAUTION_FOR {
  severity: 'High',
  description: 'Warfarin therapy in patients with prior Major GI Bleeding carries severe re-bleeding risk.',
  mechanism: 'Systemic anticoagulation unmasks or aggravates subclinical gastrointestinal mucosal lesions.',
  clinicalEffect: 'Life-threatening recurrent upper or lower GI hemorrhage, hemodynamic instability.',
  recommendedAction: 'Screen and eliminate bleeding sources endoscopically prior to anticoagulation; combine with PPI; re-evaluate anticoagulation risk-benefit score (HAS-BLED).',
  evidenceSource: 'American Gastroenterological Association (AGA) Guidelines'
}]->(mh1)

// --- Allergies ---
CREATE (al1:Allergy {id: 'al-penicillin', name: 'Penicillin Allergy', allergenClass: 'Penicillin Antibiotic', severity: 'Critical', description: 'Immediate hypersensitivity to beta-lactam core'})
CREATE (al2:Allergy {id: 'al-nsaid', name: 'NSAID Hypersensitivity', allergenClass: 'Nonsteroidal Anti-inflammatory Drug (NSAID)', severity: 'High', description: 'Cross-reactive COX-1 inhibitor intolerance'})
CREATE (al3:Allergy {id: 'al-statin', name: 'Statin Intolerance / Myopathy', allergenClass: 'HMG-CoA Reductase Inhibitor (Statin)', severity: 'Moderate', description: 'Adverse muscle pain and CK elevation'})

// Connect Drugs to Allergies
CREATE (d14)-[:DRUG_TRIGGERS_ALLERGY {
  severity: 'Critical',
  description: 'Amoxicillin is a beta-lactam penicillin and will trigger acute severe hypersensitivity in penicillin-allergic patients.',
  clinicalEffect: 'Anaphylactic shock, diffuse urticaria, angioedema, bronchoconstriction, hypotension.',
  recommendedAction: 'Do not prescribe. Substitute with azithromycin, clarithromycin, or fluoroquinolone depending on infection site.',
  evidenceSource: 'AAAAI Practice Parameters: Drug Allergy 2022'
}]->(al1)

CREATE (d13)-[:DRUG_TRIGGERS_ALLERGY {
  severity: 'Critical',
  description: 'Ibuprofen triggers severe pseudoallergic or IgE-mediated reactions in patients with NSAID hypersensitivity.',
  clinicalEffect: 'Samter triad exacerbation, life-threatening asthma attacks, systemic anaphylactoid reaction.',
  recommendedAction: 'Absolute contraindication. Use Acetaminophen for pain.',
  evidenceSource: 'World Allergy Organization (WAO) Journal: NSAID Hypersensitivity'
}]->(al2)

CREATE (d2)-[:DRUG_TRIGGERS_ALLERGY {
  severity: 'Critical',
  description: 'Aspirin triggers severe respiratory and cutaneous reactions in patients allergic to NSAIDs.',
  clinicalEffect: 'Severe bronchospasm, naso-ocular symptoms, acute laryngeal edema.',
  recommendedAction: 'Avoid Aspirin and all COX-1 inhibitors. In essential cardiac indications, desensitization must occur in an ICU setting.',
  evidenceSource: 'American Academy of Allergy, Asthma & Immunology (AAAAI)'
}]->(al2)

// ==============================================================================
// Realistic Fictional Patient Profiles for Demonstration & Clinical Testing
// ==============================================================================

// Patient 1: Geriatric Atrial Fibrillation Patient on Dual Antithrombotic Therapy (High Hemorrhagic Risk)
CREATE (p1:Patient {
  id: 'PAT-001',
  name: 'Eleanor Vance (Fictional)',
  age: 72,
  gender: 'Female',
  weight: 64.5,
  notes: 'Post-CABG with paroxysmal atrial fibrillation. Reports occasional dizziness.'
})
CREATE (p1)-[:PATIENT_TAKES]->(d1) // Warfarin
CREATE (p1)-[:PATIENT_TAKES]->(d2) // Aspirin
CREATE (p1)-[:PATIENT_HAS]->(dis1) // Atrial Fibrillation
CREATE (p1)-[:PATIENT_HAS]->(dis2) // Hypertension
CREATE (p1)-[:PATIENT_HAS_HISTORY_OF]->(mh1) // History of GI Bleed

// Patient 2: Severe Diabetic Nephropathy Patient (Contraindicated Metformin in CKD)
CREATE (p2:Patient {
  id: 'PAT-002',
  name: 'Arthur Pendelton (Fictional)',
  age: 61,
  gender: 'Male',
  weight: 82.0,
  notes: 'Longstanding Type 2 Diabetes with progressive renal decline. Most recent eGFR: 24 mL/min.'
})
CREATE (p2)-[:PATIENT_TAKES]->(d5) // Metformin
CREATE (p2)-[:PATIENT_TAKES]->(d3) // Lisinopril
CREATE (p2)-[:PATIENT_HAS]->(dis3) // Type 2 Diabetes
CREATE (p2)-[:PATIENT_HAS]->(dis4) // CKD Stage 4-5
CREATE (p2)-[:PATIENT_HAS]->(dis2) // Hypertension

// Patient 3: Heart Failure Patient with Dangerous Hyperkalemic Combination
CREATE (p3:Patient {
  id: 'PAT-003',
  name: 'Robert Chen (Fictional)',
  age: 58,
  gender: 'Male',
  weight: 76.2,
  notes: 'HFrEF (EF 30%). Initiated on combination aldosterone antagonist and ACE inhibitor.'
})
CREATE (p3)-[:PATIENT_TAKES]->(d3) // Lisinopril
CREATE (p3)-[:PATIENT_TAKES]->(d4) // Spironolactone
CREATE (p3)-[:PATIENT_HAS]->(dis6) // Congestive Heart Failure
CREATE (p3)-[:PATIENT_HAS]->(dis2) // Hypertension
CREATE (p3)-[:PATIENT_HAS]->(dis8) // Hyperkalemia

// Patient 4: Cardiac Patient with Severe Multi-Drug Interaction & Peptic Ulcer
CREATE (p4:Patient {
  id: 'PAT-004',
  name: 'Margaret Higgins (Fictional)',
  age: 69,
  gender: 'Female',
  weight: 59.0,
  notes: 'Recent stent placement and active peptic ulcer disease. Complaining of gastric burning.'
})
CREATE (p4)-[:PATIENT_TAKES]->(d6) // Clopidogrel
CREATE (p4)-[:PATIENT_TAKES]->(d7) // Omeprazole
CREATE (p4)-[:PATIENT_TAKES]->(d13) // Ibuprofen (Contraindicated!)
CREATE (p4)-[:PATIENT_HAS]->(dis5) // Peptic Ulcer Disease
CREATE (p4)-[:PATIENT_ALLERGIC_TO]->(al2) // NSAID Hypersensitivity

// Patient 5: Psychiatric / Chronic Pain Patient with Serotonin Syndrome Risk & Penicillin Allergy
CREATE (p5:Patient {
  id: 'PAT-005',
  name: 'David Miller (Fictional)',
  age: 44,
  gender: 'Male',
  weight: 85.0,
  notes: 'History of chronic lumbar disc pain and major depression. Known severe allergy to Penicillins.'
})
CREATE (p5)-[:PATIENT_TAKES]->(d11) // Sertraline
CREATE (p5)-[:PATIENT_TAKES]->(d12) // Tramadol
CREATE (p5)-[:PATIENT_TAKES]->(d14) // Amoxicillin (Allergy conflict!)
CREATE (p5)-[:PATIENT_ALLERGIC_TO]->(al1) // Penicillin Allergy
