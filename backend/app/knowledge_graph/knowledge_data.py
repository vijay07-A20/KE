"""
Medically Validated Knowledge Graph Dataset & Seed Definitions.
Sources:
- FDA Prescribing Information & Black Box Warnings
- Lexicomp Clinical Drug Interactions
- American Geriatrics Society Beers Criteria 2023 Update
- CredibleMeds QTc Risk Categories
- Clinical Pharmacogenetics Implementation Consortium (CPIC) Guidelines
- American College of Cardiology / AHA Guidelines
- American College of Gastroenterology (ACG) Clinical Guidelines
- American Academy of Allergy, Asthma & Immunology (AAAAI)
"""

INITIAL_NODES = [
    # --- Drug Classes ---
    {"id": "dc-anticoagulant", "label": "DrugClass", "name": "Anticoagulant", "properties": {"category": "Cardiovascular", "description": "Inhibits blood coagulation factor cascades"}},
    {"id": "dc-antiplatelet", "label": "DrugClass", "name": "Antiplatelet", "properties": {"category": "Cardiovascular", "description": "Inhibits platelet aggregation and thrombus formation"}},
    {"id": "dc-acei", "label": "DrugClass", "name": "ACE Inhibitor", "properties": {"category": "Cardiovascular", "description": "Inhibits angiotensin converting enzyme to reduce vascular resistance"}},
    {"id": "dc-k-diuretic", "label": "DrugClass", "name": "Potassium-Sparing Diuretic", "properties": {"category": "Renal/Cardiovascular", "description": "Inhibits aldosterone or epithelial Na+ channels"}},
    {"id": "dc-biguanide", "label": "DrugClass", "name": "Biguanide Antidiabetic", "properties": {"category": "Endocrine", "description": "Suppresses hepatic gluconeogenesis and improves insulin sensitivity"}},
    {"id": "dc-ppi", "label": "DrugClass", "name": "Proton Pump Inhibitor", "properties": {"category": "Gastrointestinal", "description": "Blocks gastric H+/K+ ATPase enzyme"}},
    {"id": "dc-statin", "label": "DrugClass", "name": "HMG-CoA Reductase Inhibitor (Statin)", "properties": {"category": "Cardiovascular", "description": "Rate-limiting enzyme inhibitor of cholesterol biosynthesis"}},
    {"id": "dc-quinolone", "label": "DrugClass", "name": "Fluoroquinolone Antibiotic", "properties": {"category": "Infectious Disease", "description": "Inhibits bacterial DNA gyrase and topoisomerase IV"}},
    {"id": "dc-ssri", "label": "DrugClass", "name": "Selective Serotonin Reuptake Inhibitor (SSRI)", "properties": {"category": "Psychiatry", "description": "Inhibits synaptic presynaptic serotonin reuptake"}},
    {"id": "dc-opioid", "label": "DrugClass", "name": "Opioid Analgesic", "properties": {"category": "Analgesia", "description": "Binds mu-opioid receptors and modulates pain signaling"}},
    {"id": "dc-nsaid", "label": "DrugClass", "name": "Nonsteroidal Anti-inflammatory Drug (NSAID)", "properties": {"category": "Analgesia", "description": "Inhibits cyclooxygenase enzymes COX-1 and COX-2"}},
    {"id": "dc-penicillin", "label": "DrugClass", "name": "Penicillin Antibiotic", "properties": {"category": "Infectious Disease", "description": "Beta-lactam antibiotic inhibiting bacterial cell wall synthesis"}},

    # --- Age Groups ---
    {"id": "ag-pediatric", "label": "AgeGroup", "name": "Pediatric (<18)", "properties": {"ageMin": 0, "ageMax": 17, "description": "Patients younger than 18 years"}},
    {"id": "ag-adult", "label": "AgeGroup", "name": "Adult (18-64)", "properties": {"ageMin": 18, "ageMax": 64, "description": "Patients aged 18 through 64 years"}},
    {"id": "ag-geriatric", "label": "AgeGroup", "name": "Geriatric (Elderly, 65+)", "properties": {"ageMin": 65, "ageMax": 120, "description": "Elderly patients subject to Beers Criteria risk considerations"}},

    # --- Diseases ---
    {"id": "dis-afib", "label": "Disease", "name": "Atrial Fibrillation", "properties": {"code": "I48.91", "description": "Supraventricular tachyarrhythmia with chaotic atrial electrical activity"}},
    {"id": "dis-htn", "label": "Disease", "name": "Hypertension", "properties": {"code": "I10", "description": "Systemic arterial blood pressure >= 130/80 mmHg"}},
    {"id": "dis-t2d", "label": "Disease", "name": "Type 2 Diabetes Mellitus", "properties": {"code": "E11.9", "description": "Chronic metabolic disorder characterized by hyperglycemia"}},
    {"id": "dis-ckd", "label": "Disease", "name": "Chronic Kidney Disease (Stage 4-5)", "properties": {"code": "N18.4", "description": "Severe renal impairment with eGFR < 30 mL/min/1.73m²"}},
    {"id": "dis-pud", "label": "Disease", "name": "Peptic Ulcer Disease", "properties": {"code": "K27.9", "description": "Active mucosal ulceration of the stomach or duodenum"}},
    {"id": "dis-chf", "label": "Disease", "name": "Congestive Heart Failure", "properties": {"code": "I50.9", "description": "Impairment of myocardial contractile or relaxation mechanics"}},
    {"id": "dis-hyperk", "label": "Disease", "name": "Hyperkalemia", "properties": {"code": "E87.5", "description": "Serum potassium concentration > 5.0 mEq/L"}},
    {"id": "dis-qt", "label": "Disease", "name": "Long QT Syndrome", "properties": {"code": "I45.81", "description": "Prolongation of ventricular repolarization predisposing to Torsades"}},
    {"id": "dis-asthma", "label": "Disease", "name": "Asthma", "properties": {"code": "J45.909", "description": "Chronic inflammatory disorder with airway hyperresponsiveness"}},

    # --- Medical History ---
    {"id": "mh-gi-bleed", "label": "MedicalHistory", "name": "History of Major GI Bleeding", "properties": {"description": "Previous documented severe upper or lower GI hemorrhage"}},
    {"id": "mh-angioedema", "label": "MedicalHistory", "name": "History of ACEi-Induced Angioedema", "properties": {"description": "Prior life-threatening mucosal or submucosal edema from ACEi"}},
    {"id": "mh-arrhythmia", "label": "MedicalHistory", "name": "History of Ventricular Arrhythmia", "properties": {"description": "Prior ventricular fibrillation or polymorphic VT"}},
    {"id": "mh-renal-fail", "label": "MedicalHistory", "name": "History of Acute Kidney Injury", "properties": {"description": "Prior hospital admission with acute decompensated renal filtration"}},

    # --- Allergies ---
    {"id": "al-penicillin", "label": "Allergy", "name": "Penicillin Allergy", "properties": {"allergenClass": "Penicillin Antibiotic", "severity": "Critical", "description": "IgE-mediated beta-lactam hypersensitivity"}},
    {"id": "al-nsaid", "label": "Allergy", "name": "NSAID Hypersensitivity", "properties": {"allergenClass": "Nonsteroidal Anti-inflammatory Drug (NSAID)", "severity": "High", "description": "COX-1 inhibitor-induced respiratory or anaphylactoid intolerance"}},
    {"id": "al-statin", "label": "Allergy", "name": "Statin Intolerance / Myopathy", "properties": {"allergenClass": "HMG-CoA Reductase Inhibitor (Statin)", "severity": "Moderate", "description": "Statin-associated muscle symptoms with CK elevation"}},

    # --- Side Effects & Symptoms ---
    {"id": "se-hemorrhage", "label": "SideEffect", "name": "Major Hemorrhage / Bleeding", "properties": {"severity": "Critical", "description": "Severe intracranial or gastrointestinal bleeding requiring transfusions"}},
    {"id": "se-hyperkalemia", "label": "SideEffect", "name": "Severe Hyperkalemia", "properties": {"severity": "High", "description": "Serum K > 6.0 mEq/L leading to fatal arrhythmias"}},
    {"id": "se-lactic-acidosis", "label": "SideEffect", "name": "Lactic Acidosis (MALA)", "properties": {"severity": "Critical", "description": "Profound metabolic acidosis with serum lactate > 5 mmol/L"}},
    {"id": "se-torsades", "label": "SideEffect", "name": "Torsades de Pointes / Fatal Arrhythmia", "properties": {"severity": "Critical", "description": "Polymorphic ventricular tachycardia triggered by delayed repolarization"}},
    {"id": "se-serotonin-syn", "label": "SideEffect", "name": "Serotonin Syndrome", "properties": {"severity": "High", "description": "Hyperreflexia, clonus, hyperthermia, autonomic instability"}},
    {"id": "se-rhabdomyolysis", "label": "SideEffect", "name": "Rhabdomyolysis", "properties": {"severity": "High", "description": "Extensive myocyte breakdown causing acute myoglobinuric kidney injury"}},
    {"id": "se-gi-perforation", "label": "SideEffect", "name": "Gastric Ulcer Perforation", "properties": {"severity": "Critical", "description": "Transmural gastric mucosal defect leading to peritonitis and sepsis"}},
    {"id": "se-anaphylaxis", "label": "SideEffect", "name": "Anaphylactic Shock", "properties": {"severity": "Critical", "description": "Acute multiorgan hypersensitivity with severe bronchospasm and vascular collapse"}},
    {"id": "se-thrombosis", "label": "SideEffect", "name": "Stent Thrombosis / Recurrent Ischemia", "properties": {"severity": "High", "description": "Vascular re-occlusion secondary to inadequate platelet inhibition"}},

    # --- Drugs ---
    {
        "id": "drug-warfarin",
        "label": "Drug",
        "name": "Warfarin",
        "properties": {
            "genericName": "Warfarin Sodium",
            "dosageForm": "Oral Tablet (1mg, 2mg, 2.5mg, 5mg)",
            "drugClass": "Anticoagulant",
            "commonUses": "Prevention and treatment of venous thromboembolism, atrial fibrillation anticoagulation",
            "ageRestrictions": "Requires heightened caution and dose titration in elderly patients (Beers Criteria)"
        }
    },
    {
        "id": "drug-aspirin",
        "label": "Drug",
        "name": "Aspirin",
        "properties": {
            "genericName": "Acetylsalicylic Acid",
            "dosageForm": "Oral Tablet (81mg, 325mg)",
            "drugClass": "Antiplatelet / NSAID",
            "commonUses": "Secondary cardiovascular prophylaxis, ischemic cerebrovascular disease",
            "ageRestrictions": "Avoid in children/adolescents due to Reye Syndrome; caution in >= 65"
        }
    },
    {
        "id": "drug-lisinopril",
        "label": "Drug",
        "name": "Lisinopril",
        "properties": {
            "genericName": "Lisinopril",
            "dosageForm": "Oral Tablet (5mg, 10mg, 20mg, 40mg)",
            "drugClass": "ACE Inhibitor",
            "commonUses": "Hypertension, heart failure with reduced ejection fraction, post-MI",
            "ageRestrictions": "Contraindicated in pregnancy; renal dose adjustments required in elderly"
        }
    },
    {
        "id": "drug-spironolactone",
        "label": "Drug",
        "name": "Spironolactone",
        "properties": {
            "genericName": "Spironolactone",
            "dosageForm": "Oral Tablet (25mg, 50mg, 100mg)",
            "drugClass": "Potassium-Sparing Diuretic",
            "commonUses": "Heart failure (NYHA II-IV), primary hyperaldosteronism, resistant hypertension",
            "ageRestrictions": "High hyperkalemia risk in elderly patients with declining renal function"
        }
    },
    {
        "id": "drug-metformin",
        "label": "Drug",
        "name": "Metformin",
        "properties": {
            "genericName": "Metformin Hydrochloride",
            "dosageForm": "Oral Tablet (500mg, 850mg, 1000mg, ER)",
            "drugClass": "Biguanide Antidiabetic",
            "commonUses": "First-line oral antidiabetic therapy for Type 2 Diabetes",
            "ageRestrictions": "Renal safety limits; contraindicated if eGFR < 30 mL/min"
        }
    },
    {
        "id": "drug-clopidogrel",
        "label": "Drug",
        "name": "Clopidogrel",
        "properties": {
            "genericName": "Clopidogrel Bisulfate",
            "dosageForm": "Oral Tablet (75mg, 300mg loading)",
            "drugClass": "Antiplatelet",
            "commonUses": "Reduction of atherothrombotic events in CAD, stroke, PAD, post-PCI stent",
            "ageRestrictions": "Standard adult dosing; monitor bleeding parameters in elderly"
        }
    },
    {
        "id": "drug-omeprazole",
        "label": "Drug",
        "name": "Omeprazole",
        "properties": {
            "genericName": "Omeprazole",
            "dosageForm": "Delayed-Release Capsule (20mg, 40mg)",
            "drugClass": "Proton Pump Inhibitor",
            "commonUses": "GERD, Erosive Esophagitis, Peptic Ulcer Disease, H. pylori eradication",
            "ageRestrictions": "Avoid chronic unmonitored use in elderly due to C. diff and fracture hazards"
        }
    },
    {
        "id": "drug-simvastatin",
        "label": "Drug",
        "name": "Simvastatin",
        "properties": {
            "genericName": "Simvastatin",
            "dosageForm": "Oral Tablet (10mg, 20mg, 40mg)",
            "drugClass": "HMG-CoA Reductase Inhibitor",
            "commonUses": "Hypercholesterolemia, secondary ASCVD prevention",
            "ageRestrictions": "CYP3A4 interactions escalate myopathy risk; dose capped with amiodarone"
        }
    },
    {
        "id": "drug-amiodarone",
        "label": "Drug",
        "name": "Amiodarone",
        "properties": {
            "genericName": "Amiodarone Hydrochloride",
            "dosageForm": "Oral Tablet (100mg, 200mg), IV",
            "drugClass": "Antiarrhythmic Class III",
            "commonUses": "Ventricular arrhythmias, rhythm control in refractory atrial fibrillation",
            "ageRestrictions": "Multiple toxicities (pulmonary, hepatic, ocular, thyroid); Beers Criteria warning"
        }
    },
    {
        "id": "drug-ciprofloxacin",
        "label": "Drug",
        "name": "Ciprofloxacin",
        "properties": {
            "genericName": "Ciprofloxacin Hydrochloride",
            "dosageForm": "Oral Tablet (250mg, 500mg), IV",
            "drugClass": "Fluoroquinolone Antibiotic",
            "commonUses": "Complicated UTIs, bacterial pyelonephritis, infectious diarrhea",
            "ageRestrictions": "FDA Black Box: Tendinitis, tendon rupture, peripheral neuropathy, CNS effects, QT"
        }
    },
    {
        "id": "drug-sertraline",
        "label": "Drug",
        "name": "Sertraline",
        "properties": {
            "genericName": "Sertraline Hydrochloride",
            "dosageForm": "Oral Tablet (25mg, 50mg, 100mg)",
            "drugClass": "SSRI",
            "commonUses": "Major depressive disorder, OCD, panic disorder, PTSD, social anxiety",
            "ageRestrictions": "Beers Criteria: SIADH and hyponatremia risk in elderly; fall precautions"
        }
    },
    {
        "id": "drug-tramadol",
        "label": "Drug",
        "name": "Tramadol",
        "properties": {
            "genericName": "Tramadol Hydrochloride",
            "dosageForm": "Oral Tablet (50mg)",
            "drugClass": "Opioid Analgesic",
            "commonUses": "Moderate to moderately severe acute or chronic nociceptive/neuropathic pain",
            "ageRestrictions": "Avoid doses > 200 mg in >= 75 yrs; caution with seizures or serotonergic drugs"
        }
    },
    {
        "id": "drug-ibuprofen",
        "label": "Drug",
        "name": "Ibuprofen",
        "properties": {
            "genericName": "Ibuprofen",
            "dosageForm": "Oral Tablet (200mg, 400mg, 600mg, 800mg)",
            "drugClass": "NSAID",
            "commonUses": "Relief of inflammatory symptoms, mild-to-moderate pain, fever reduction",
            "ageRestrictions": "Strongly avoid chronic usage in >= 65 due to GI bleeding, renal, and CV risk"
        }
    },
    {
        "id": "drug-amoxicillin",
        "label": "Drug",
        "name": "Amoxicillin",
        "properties": {
            "genericName": "Amoxicillin Trihydrate",
            "dosageForm": "Oral Capsule (250mg, 500mg, 875mg)",
            "drugClass": "Penicillin Antibiotic",
            "commonUses": "Acute bacterial sinusitis, streptococcal pharyngitis, acute otitis media",
            "ageRestrictions": "Adjust dosage for severe renal clearance deficits"
        }
    }
]

INITIAL_EDGES = [
    # --- Drug Class Memberships ---
    {"source": "drug-warfarin", "target": "dc-anticoagulant", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-aspirin", "target": "dc-antiplatelet", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-aspirin", "target": "dc-nsaid", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-lisinopril", "target": "dc-acei", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-spironolactone", "target": "dc-k-diuretic", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-metformin", "target": "dc-biguanide", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-clopidogrel", "target": "dc-antiplatelet", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-omeprazole", "target": "dc-ppi", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-simvastatin", "target": "dc-statin", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-amiodarone", "target": "dc-anticoagulant", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-ciprofloxacin", "target": "dc-quinolone", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-sertraline", "target": "dc-ssri", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-tramadol", "target": "dc-opioid", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-ibuprofen", "target": "dc-nsaid", "type": "DRUG_BELONGS_TO"},
    {"source": "drug-amoxicillin", "target": "dc-penicillin", "type": "DRUG_BELONGS_TO"},

    # --- Drug Treats Disease ---
    {"source": "drug-warfarin", "target": "dis-afib", "type": "DRUG_TREATS"},
    {"source": "drug-lisinopril", "target": "dis-htn", "type": "DRUG_TREATS"},
    {"source": "drug-lisinopril", "target": "dis-chf", "type": "DRUG_TREATS"},
    {"source": "drug-spironolactone", "target": "dis-chf", "type": "DRUG_TREATS"},
    {"source": "drug-spironolactone", "target": "dis-htn", "type": "DRUG_TREATS"},
    {"source": "drug-metformin", "target": "dis-t2d", "type": "DRUG_TREATS"},
    {"source": "drug-omeprazole", "target": "dis-pud", "type": "DRUG_TREATS"},
    {"source": "drug-amiodarone", "target": "dis-afib", "type": "DRUG_TREATS"},

    # --- Drug Causes Side Effects ---
    {"source": "drug-warfarin", "target": "se-hemorrhage", "type": "DRUG_CAUSES"},
    {"source": "drug-aspirin", "target": "se-hemorrhage", "type": "DRUG_CAUSES"},
    {"source": "drug-lisinopril", "target": "se-hyperkalemia", "type": "DRUG_CAUSES"},
    {"source": "drug-spironolactone", "target": "se-hyperkalemia", "type": "DRUG_CAUSES"},
    {"source": "drug-metformin", "target": "se-lactic-acidosis", "type": "DRUG_CAUSES"},
    {"source": "drug-simvastatin", "target": "se-rhabdomyolysis", "type": "DRUG_CAUSES"},
    {"source": "drug-amiodarone", "target": "se-torsades", "type": "DRUG_CAUSES"},
    {"source": "drug-ciprofloxacin", "target": "se-torsades", "type": "DRUG_CAUSES"},
    {"source": "drug-tramadol", "target": "se-serotonin-syn", "type": "DRUG_CAUSES"},
    {"source": "drug-sertraline", "target": "se-serotonin-syn", "type": "DRUG_CAUSES"},
    {"source": "drug-ibuprofen", "target": "se-gi-perforation", "type": "DRUG_CAUSES"},

    # --- Drug-Drug Interactions (DRUG_INTERACTS_WITH) ---
    {
        "source": "drug-warfarin",
        "target": "drug-aspirin",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "Critical",
            "description": "Concomitant administration of Warfarin and Aspirin dramatically increases major hemorrhagic risk through additive anticoagulant and antiplatelet inhibition.",
            "mechanism": "Synergistic inhibition of vitamin K dependent clotting factor synthesis combined with irreversible platelet COX-1 inhibition and gastric mucosal irritation.",
            "clinicalEffect": "Severe upper gastrointestinal bleeding, intracranial hemorrhage, fatal internal bleeding, prolonged prothrombin time / INR spike.",
            "recommendedAction": "Avoid concurrent use unless strictly indicated for mechanical heart valve. If co-prescribed, target lower INR range (2.0-2.5) with gastroprotective PPI.",
            "evidenceSource": "FDA Warfarin Prescribing Information & Lexicomp Drug Interactions (Level A Evidence)"
        }
    },
    {
        "source": "drug-aspirin",
        "target": "drug-warfarin",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "Critical",
            "description": "Aspirin potentiates anticoagulant action of Warfarin and impairs primary platelet hemostasis.",
            "mechanism": "Platelet thromboxane A2 inhibition compounded by prothrombin complex synthesis depletion.",
            "clinicalEffect": "Major hemorrhagic diathesis, systemic hematoma, gastrointestinal perforation.",
            "recommendedAction": "Re-evaluate necessity of dual antiplatelet/anticoagulant therapy; prescribe gastroprotection and verify INR frequently.",
            "evidenceSource": "American College of Cardiology / AHA Antithrombotic Guidelines"
        }
    },
    {
        "source": "drug-lisinopril",
        "target": "drug-spironolactone",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "High",
            "description": "Lisinopril combined with Spironolactone produces additive potassium-retention leading to life-threatening hyperkalemia.",
            "mechanism": "ACE inhibition suppresses angiotensin II-mediated aldosterone secretion, while Spironolactone competitively blocks mineralocorticoid receptors in renal cortical collecting tubules.",
            "clinicalEffect": "Severe hyperkalemia (>6.0 mEq/L), sinoventricular cardiac rhythm, peaked T-waves, fatal ventricular fibrillation, and sudden cardiac arrest.",
            "recommendedAction": "Monitor serum potassium and creatinine within 1 week of initiation and monthly thereafter. Avoid Spironolactone doses > 25 mg/day in heart failure patients on ACE inhibitors.",
            "evidenceSource": "AHA Heart Failure Guidelines & RALES Trial Safety Profile"
        }
    },
    {
        "source": "drug-spironolactone",
        "target": "drug-lisinopril",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "High",
            "description": "Spironolactone co-administered with Lisinopril accelerates hazardous potassium retention.",
            "mechanism": "Direct distal tubule potassium excretion blockade combined with renin-angiotensin-aldosterone axis suppression.",
            "clinicalEffect": "Life-threatening hyperkalemic paralysis and cardiac electromechanical dissociation.",
            "recommendedAction": "Verify baseline renal clearance (eGFR > 30 mL/min) and serum K+ < 5.0 mEq/L before prescription.",
            "evidenceSource": "Micromedex Drugdex & KDIGO Clinical Practice Guidelines"
        }
    },
    {
        "source": "drug-amiodarone",
        "target": "drug-ciprofloxacin",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "Critical",
            "description": "Amiodarone and Ciprofloxacin together significantly amplify the risk of severe QT interval prolongation and fatal ventricular arrhythmias.",
            "mechanism": "Both agents block the rapid delayed rectifier potassium channel (IKr) in cardiac myocytes, substantially lengthening ventricular repolarization.",
            "clinicalEffect": "Marked QT interval prolongation (>500 ms), Torsades de Pointes, polymorphic ventricular tachycardia, and sudden cardiac death.",
            "recommendedAction": "Concomitant administration is strictly contraindicated. Select an alternative non-QT prolonging antimicrobial agent (e.g. beta-lactam).",
            "evidenceSource": "CredibleMeds (Known Risk of TdP) & FDA Black Box Warning for Fluoroquinolones"
        }
    },
    {
        "source": "drug-ciprofloxacin",
        "target": "drug-amiodarone",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "Critical",
            "description": "Ciprofloxacin markedly potentiates Amiodarone-induced QT prolongation.",
            "mechanism": "Synergistic cardiac hERG potassium current inhibition delaying phase 3 myocardial repolarization.",
            "clinicalEffect": "Ventricular dysrhythmias, syncope, fatal Torsades de Pointes.",
            "recommendedAction": "Avoid combination. Continuous ECG telemetry is required if co-exposure cannot be avoided.",
            "evidenceSource": "AHA/ACC/HRS Guideline for Management of Patients With Ventricular Arrhythmias"
        }
    },
    {
        "source": "drug-sertraline",
        "target": "drug-tramadol",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "High",
            "description": "Sertraline combined with Tramadol triggers hazardous excess serotonin concentrations in the central nervous system.",
            "mechanism": "Sertraline inhibits serotonin reuptake (SSRI) while Tramadol inhibits serotonin and norepinephrine reuptake and stimulates serotonin release, with competitive CYP2D6 inhibition.",
            "clinicalEffect": "Serotonin Syndrome characterized by neuromuscular hyperexcitability (clonus, hyperreflexia), autonomic instability (hyperthermia, tachycardia), and altered mental status.",
            "recommendedAction": "Avoid co-prescription. If alternative analgesia is unavailable, titrate Tramadol cautiously and educate patient on early symptoms of serotonin toxicity.",
            "evidenceSource": "FDA Drug Safety Communication & Lexicomp Serotonergic Advisory"
        }
    },
    {
        "source": "drug-tramadol",
        "target": "drug-sertraline",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "High",
            "description": "Tramadol escalates central serotonergic toxicity in presence of Sertraline.",
            "mechanism": "Dual serotonergic stimulation coupled with reduced metabolic clearance.",
            "clinicalEffect": "Agitation, autonomic storm, myoclonus, seizures.",
            "recommendedAction": "Discontinue Tramadol; replace with non-serotonergic opioid or multimodal non-opioid analgesics.",
            "evidenceSource": "American Psychiatric Association & FDA Boxed Warning"
        }
    },
    {
        "source": "drug-clopidogrel",
        "target": "drug-omeprazole",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "Moderate",
            "description": "Omeprazole significantly reduces the antiplatelet efficacy of Clopidogrel, elevating atherothrombotic risk.",
            "mechanism": "Competitive inhibition of cytochrome P450 isoenzyme CYP2C19, which is mandatory to convert clopidogrel prodrug into its active thiol metabolite.",
            "clinicalEffect": "Subtherapeutic platelet inhibition, increased incidence of recurrent myocardial infarction, stent thrombosis, and ischemic stroke.",
            "recommendedAction": "Avoid Omeprazole or Esomeprazole with Clopidogrel. If acid suppression is mandatory, switch to Pantoprazole or an H2 blocker (Famotidine).",
            "evidenceSource": "CPIC Guidelines for CYP2C19 Genotype & FDA Clopidogrel Warning"
        }
    },
    {
        "source": "drug-omeprazole",
        "target": "drug-clopidogrel",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "Moderate",
            "description": "Omeprazole attenuates clopidogrel active metabolite formation via CYP2C19 blockade.",
            "mechanism": "Pharmacokinetic inhibition of bioactivation step in liver microsomes.",
            "clinicalEffect": "Platelet aggregation rebound and cardiovascular ischemic events.",
            "recommendedAction": "Substitute with Pantoprazole (less CYP2C19 affinity) or Famotidine.",
            "evidenceSource": "FDA Drug Safety Communication & American College of Cardiology"
        }
    },
    {
        "source": "drug-simvastatin",
        "target": "drug-amiodarone",
        "type": "DRUG_INTERACTS_WITH",
        "properties": {
            "severity": "High",
            "description": "Amiodarone co-administration substantially elevates Simvastatin systemic exposure and rhabdomyolysis hazard.",
            "mechanism": "Amiodarone and its metabolite desethylamiodarone inhibit CYP3A4, the primary metabolic clearance pathway of Simvastatin.",
            "clinicalEffect": "High-grade statin-induced myopathy, severe muscle pain, rhabdomyolysis, myoglobinuria, and acute tubular necrosis.",
            "recommendedAction": "Do not exceed Simvastatin 20 mg daily when prescribed with Amiodarone. Consider substituting with Pravastatin or Rosuvastatin (non-CYP3A4 metabolized).",
            "evidenceSource": "FDA Drug Safety Announcement & ACC/AHA Statin Safety Guidelines"
        }
    },

    # --- Drug-Disease Contraindications (DRUG_CONTRAINDICATED_FOR) ---
    {
        "source": "drug-metformin",
        "target": "dis-ckd",
        "type": "DRUG_CONTRAINDICATED_FOR",
        "properties": {
            "severity": "Critical",
            "description": "Metformin is contraindicated in severe Chronic Kidney Disease (Stage 4-5) due to failure of renal drug clearance and lactic acidosis risk.",
            "mechanism": "Metformin is eliminated unchanged by glomerular filtration and tubular secretion. Impaired clearance leads to biguanide systemic accumulation and mitochondrial respiration blockade.",
            "clinicalEffect": "Metformin-Associated Lactic Acidosis (MALA), severe metabolic acidosis, hypothermia, cardiovascular collapse (mortality up to 50%).",
            "recommendedAction": "Discontinue Metformin immediately if eGFR drops below 30 mL/min/1.73m². Review renal function every 3 months for eGFR 30-44 mL/min.",
            "evidenceSource": "FDA Metformin Package Insert & American Diabetes Association Standards of Care"
        }
    },
    {
        "source": "drug-ibuprofen",
        "target": "dis-pud",
        "type": "DRUG_CONTRAINDICATED_FOR",
        "properties": {
            "severity": "High",
            "description": "Ibuprofen and non-selective NSAIDs are strongly contraindicated in active Peptic Ulcer Disease.",
            "mechanism": "Systemic inhibition of cyclooxygenase-1 (COX-1) halts synthesis of cytoprotective gastric prostaglandins PGE2 and PGI2, increasing acid-mediated mucosal erosion.",
            "clinicalEffect": "Acute upper gastrointestinal hemorrhage, gastric ulcer perforation, peritonitis, shock.",
            "recommendedAction": "Avoid all oral systemic NSAIDs. Use Acetaminophen for analgesia; if anti-inflammatory therapy is required, combine COX-2 selective inhibitor with high-dose PPI.",
            "evidenceSource": "American College of Gastroenterology (ACG) Clinical Guidelines"
        }
    },
    {
        "source": "drug-lisinopril",
        "target": "dis-hyperk",
        "type": "DRUG_CONTRAINDICATED_FOR",
        "properties": {
            "severity": "High",
            "description": "Lisinopril is contraindicated in patients with pre-existing Hyperkalemia.",
            "mechanism": "Reduced angiotensin II levels decrease aldosterone secretion, impairing renal potassium excretion in the distal nephron.",
            "clinicalEffect": "Rapid exacerbation of hyperkalemia, cardiac arrhythmias, electromechanical dissociation.",
            "recommendedAction": "Correct hyperkalemia before initiating ACE inhibitors. Hold drug if potassium exceeds 5.5 mEq/L.",
            "evidenceSource": "Kidney Disease Improving Global Outcomes (KDIGO) Blood Pressure Guidelines"
        }
    },
    {
        "source": "drug-ciprofloxacin",
        "target": "dis-qt",
        "type": "DRUG_CONTRAINDICATED_FOR",
        "properties": {
            "severity": "Critical",
            "description": "Ciprofloxacin is contraindicated in patients with congenital or acquired Long QT Syndrome.",
            "mechanism": "Inhibition of voltage-gated potassium channel subunit hERG (IKr) delays cardiac repolarization.",
            "clinicalEffect": "Severe QTc prolongation, polymorphic ventricular tachycardia (Torsades de Pointes), sudden death.",
            "recommendedAction": "Absolute contraindication in known Long QT Syndrome. Select beta-lactam or macrolide alternatives with clean cardiac profile.",
            "evidenceSource": "CredibleMeds & American Heart Association Scientific Statement"
        }
    },

    # --- Age-Related Precautions (DRUG_REQUIRES_CAUTION_FOR) ---
    {
        "source": "drug-warfarin",
        "target": "ag-geriatric",
        "type": "DRUG_REQUIRES_CAUTION_FOR",
        "properties": {
            "severity": "High",
            "description": "Warfarin requires exceptional caution in geriatric patients (age >= 65) due to elevated bleeding risks and altered pharmacodynamics.",
            "mechanism": "Age-dependent decline in hepatic CYP2C9 clearance, altered protein binding, fragile vasculature, and increased fall-related trauma hazards.",
            "clinicalEffect": "Subdural hematoma from minor falls, spontaneous GI hemorrhage, excessive anticoagulation with fluctuating INR.",
            "recommendedAction": "Initiate with lower doses (<= 2.5 mg); maintain INR at lower therapeutic boundary; assess fall risk; perform frequent point-of-care INR monitoring.",
            "evidenceSource": "American Geriatrics Society Beers Criteria 2023 Update"
        }
    },
    {
        "source": "drug-ibuprofen",
        "target": "ag-geriatric",
        "type": "DRUG_REQUIRES_CAUTION_FOR",
        "properties": {
            "severity": "High",
            "description": "Systemic NSAIDs like Ibuprofen should be avoided in older adults due to high risk of peptic ulcer disease and acute renal decline.",
            "mechanism": "Reduced baseline renal blood flow dependent on vasodilatory prostaglandins; loss of mucosal protective barriers.",
            "clinicalEffect": "Silent GI ulceration and perforation, acute decompensated heart failure, sudden deterioration in renal function.",
            "recommendedAction": "Avoid chronic NSAID use in elderly patients. If unavoidable, use lowest effective dose for shortest duration with co-prescribed PPI.",
            "evidenceSource": "Beers Criteria 2023 & STOPP/START Criteria Version 2"
        }
    },
    {
        "source": "drug-tramadol",
        "target": "ag-geriatric",
        "type": "DRUG_REQUIRES_CAUTION_FOR",
        "properties": {
            "severity": "Moderate",
            "description": "Tramadol requires dosage limitation and cognitive monitoring in elderly patients.",
            "mechanism": "Decreased renal clearance and heightened central nervous system sensitivity.",
            "clinicalEffect": "Delirium, confusion, dizziness, increased fall risk, and seizures.",
            "recommendedAction": "Reduce maximum daily dosage to 200 mg in patients over 75 years; evaluate concurrent serotonergic drugs.",
            "evidenceSource": "Beers Criteria 2023"
        }
    },

    # --- Medical History Precautions (DRUG_CONTRAINDICATED_FOR / DRUG_REQUIRES_CAUTION_FOR) ---
    {
        "source": "drug-lisinopril",
        "target": "mh-angioedema",
        "type": "DRUG_CONTRAINDICATED_FOR",
        "properties": {
            "severity": "Critical",
            "description": "Lisinopril is strictly contraindicated in patients with a documented history of ACE inhibitor-induced Angioedema.",
            "mechanism": "Bradykinin and substance P degradation blockade leads to profound vascular leakage and massive submucosal soft tissue swelling.",
            "clinicalEffect": "Fatal airway compromise, laryngeal edema, asphyxia within hours of ingestion.",
            "recommendedAction": "Strict lifelong contraindication. Do not re-challenge. Avoid all ACE inhibitors; caution with ARBs.",
            "evidenceSource": "FDA Lisinopril Black Box Warning & Annals of Allergy, Asthma & Immunology"
        }
    },
    {
        "source": "drug-warfarin",
        "target": "mh-gi-bleed",
        "type": "DRUG_REQUIRES_CAUTION_FOR",
        "properties": {
            "severity": "High",
            "description": "Warfarin therapy in patients with prior Major GI Bleeding carries severe re-bleeding risk.",
            "mechanism": "Systemic anticoagulation unmasks or aggravates subclinical gastrointestinal mucosal lesions.",
            "clinicalEffect": "Life-threatening recurrent upper or lower GI hemorrhage, hemodynamic instability.",
            "recommendedAction": "Screen and eliminate bleeding sources endoscopically prior to anticoagulation; combine with PPI; re-evaluate anticoagulation risk-benefit score (HAS-BLED).",
            "evidenceSource": "American Gastroenterological Association (AGA) Guidelines"
        }
    },

    # --- Allergy Triggers (DRUG_TRIGGERS_ALLERGY) ---
    {
        "source": "drug-amoxicillin",
        "target": "al-penicillin",
        "type": "DRUG_TRIGGERS_ALLERGY",
        "properties": {
            "severity": "Critical",
            "description": "Amoxicillin is a beta-lactam penicillin and will trigger acute severe hypersensitivity in penicillin-allergic patients.",
            "clinicalEffect": "Anaphylactic shock, diffuse urticaria, angioedema, bronchoconstriction, hypotension.",
            "recommendedAction": "Do not prescribe. Substitute with azithromycin, clarithromycin, or fluoroquinolone depending on infection site.",
            "evidenceSource": "AAAAI Practice Parameters: Drug Allergy 2022"
        }
    },
    {
        "source": "drug-ibuprofen",
        "target": "al-nsaid",
        "type": "DRUG_TRIGGERS_ALLERGY",
        "properties": {
            "severity": "Critical",
            "description": "Ibuprofen triggers severe pseudoallergic or IgE-mediated reactions in patients with NSAID hypersensitivity.",
            "clinicalEffect": "Samter triad exacerbation, life-threatening asthma attacks, systemic anaphylactoid reaction.",
            "recommendedAction": "Absolute contraindication. Use Acetaminophen for pain.",
            "evidenceSource": "World Allergy Organization (WAO) Journal: NSAID Hypersensitivity"
        }
    },
    {
        "source": "drug-aspirin",
        "target": "al-nsaid",
        "type": "DRUG_TRIGGERS_ALLERGY",
        "properties": {
            "severity": "Critical",
            "description": "Aspirin triggers severe respiratory and cutaneous reactions in patients allergic to NSAIDs.",
            "clinicalEffect": "Severe bronchospasm, naso-ocular symptoms, acute laryngeal edema.",
            "recommendedAction": "Avoid Aspirin and all COX-1 inhibitors. In essential cardiac indications, desensitization must occur in an ICU setting.",
            "evidenceSource": "American Academy of Allergy, Asthma & Immunology (AAAAI)"
        }
    }
]

# Initial Sample Patients
INITIAL_PATIENTS = [
    {
        "id": "PAT-001",
        "name": "Eleanor Vance (Fictional)",
        "age": 72,
        "gender": "Female",
        "weight": 64.5,
        "notes": "Post-CABG with paroxysmal atrial fibrillation. Prescribed dual antithrombotic therapy.",
        "medications": [
            {"drugId": "drug-warfarin", "name": "Warfarin", "dosage": "5 mg", "frequency": "Once daily at bedtime"},
            {"drugId": "drug-aspirin", "name": "Aspirin", "dosage": "81 mg", "frequency": "Once daily in morning"}
        ],
        "diseases": [
            {"diseaseId": "dis-afib", "name": "Atrial Fibrillation"},
            {"diseaseId": "dis-htn", "name": "Hypertension"}
        ],
        "allergies": [],
        "medicalHistory": [
            {"historyId": "mh-gi-bleed", "name": "History of Major GI Bleeding"}
        ]
    },
    {
        "id": "PAT-002",
        "name": "Arthur Pendelton (Fictional)",
        "age": 61,
        "gender": "Male",
        "weight": 82.0,
        "notes": "Longstanding Type 2 Diabetes with progressive renal decline. Most recent eGFR: 24 mL/min.",
        "medications": [
            {"drugId": "drug-metformin", "name": "Metformin", "dosage": "1000 mg", "frequency": "Twice daily with meals"},
            {"drugId": "drug-lisinopril", "name": "Lisinopril", "dosage": "20 mg", "frequency": "Once daily"}
        ],
        "diseases": [
            {"diseaseId": "dis-t2d", "name": "Type 2 Diabetes Mellitus"},
            {"diseaseId": "dis-ckd", "name": "Chronic Kidney Disease (Stage 4-5)"},
            {"diseaseId": "dis-htn", "name": "Hypertension"}
        ],
        "allergies": [],
        "medicalHistory": [
            {"historyId": "mh-renal-fail", "name": "History of Acute Kidney Injury"}
        ]
    },
    {
        "id": "PAT-003",
        "name": "Robert Chen (Fictional)",
        "age": 58,
        "gender": "Male",
        "weight": 76.2,
        "notes": "HFrEF (EF 30%). Initiated on combination aldosterone antagonist and ACE inhibitor.",
        "medications": [
            {"drugId": "drug-lisinopril", "name": "Lisinopril", "dosage": "20 mg", "frequency": "Once daily"},
            {"drugId": "drug-spironolactone", "name": "Spironolactone", "dosage": "50 mg", "frequency": "Once daily"}
        ],
        "diseases": [
            {"diseaseId": "dis-chf", "name": "Congestive Heart Failure"},
            {"diseaseId": "dis-htn", "name": "Hypertension"},
            {"diseaseId": "dis-hyperk", "name": "Hyperkalemia"}
        ],
        "allergies": [],
        "medicalHistory": []
    },
    {
        "id": "PAT-004",
        "name": "Margaret Higgins (Fictional)",
        "age": 69,
        "gender": "Female",
        "weight": 59.0,
        "notes": "Recent stent placement and active peptic ulcer disease. Complaining of gastric burning.",
        "medications": [
            {"drugId": "drug-clopidogrel", "name": "Clopidogrel", "dosage": "75 mg", "frequency": "Once daily"},
            {"drugId": "drug-omeprazole", "name": "Omeprazole", "dosage": "40 mg", "frequency": "Once daily before breakfast"},
            {"drugId": "drug-ibuprofen", "name": "Ibuprofen", "dosage": "600 mg", "frequency": "As needed for arthritis"}
        ],
        "diseases": [
            {"diseaseId": "dis-pud", "name": "Peptic Ulcer Disease"},
            {"diseaseId": "dis-htn", "name": "Hypertension"}
        ],
        "allergies": [
            {"allergyId": "al-nsaid", "name": "NSAID Hypersensitivity", "allergenClass": "Nonsteroidal Anti-inflammatory Drug (NSAID)"}
        ],
        "medicalHistory": []
    },
    {
        "id": "PAT-005",
        "name": "David Miller (Fictional)",
        "age": 44,
        "gender": "Male",
        "weight": 85.0,
        "notes": "History of chronic lumbar disc pain and major depression. Known severe allergy to Penicillins.",
        "medications": [
            {"drugId": "drug-sertraline", "name": "Sertraline", "dosage": "100 mg", "frequency": "Once daily in morning"},
            {"drugId": "drug-tramadol", "name": "Tramadol", "dosage": "50 mg", "frequency": "Every 6 hours as needed"},
            {"drugId": "drug-amoxicillin", "name": "Amoxicillin", "dosage": "500 mg", "frequency": "Every 8 hours"}
        ],
        "diseases": [],
        "allergies": [
            {"allergyId": "al-penicillin", "name": "Penicillin Allergy", "allergenClass": "Penicillin Antibiotic"}
        ],
        "medicalHistory": []
    }
]
