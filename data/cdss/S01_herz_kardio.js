/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Systemisches Modul S01: HERZ & KARDIOVASKULÄR
 *
 * Diagnosen:
 *  KAR-001  Stabile Angina Pectoris / KHK I20.8
 *  KAR-002  Akutes Koronarsyndrom (ACS) I21 ⚠️ NOTFALL
 *  KAR-003  Perikarditis I30
 *  KAR-004  Herzinsuffizienz (dekompensiert) I50 ⚠️
 *  KAR-005  Herzrhythmusstörungen I49
 *  KAR-006  Hypertensive Krise I10 ⚠️ NOTFALL
 *
 * ⚠️ WICHTIG: Dieses Modul triggert, wenn Patienten kardiale Symptome als
 *    Hauptbeschwerden berichten, ODER wenn MSK-Symptome einen viszerosomatischen
 *    Herzreflex andeuten (linke Schulter, linker Arm, BWS links, Kiefer).
 *
 * Quellen:
 *  - ESC Guidelines: Acute Coronary Syndromes. Eur Heart J 2023.
 *  - ESC Guidelines: Stable Coronary Artery Disease. Eur Heart J 2019.
 *  - Barral JP: The Thorax. Eastland Press 1991. (Perikard-Osteopathie)
 *  - Fossum C: RC-Modell & Herz. Seminar notes 2023.
 */

const HERZ_QUESTIONS = [
  {
    id: "KAR-Q01",
    text: "Haben Sie Brustschmerzen, Druck oder Enge im Brustbereich?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag: true
  },
  {
    id: "KAR-Q02",
    text: "Strahlt der Schmerz aus — in den linken Arm, Kiefer, Hals oder Rücken?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag: true,
    hint: "⚠️ Klassische ACS-Ausstrahlung — SOFORTMASSNAHMEN einleiten!",
    condition: { fact: "kar_chest_pain", operator: "equal", value: true }
  },
  {
    id: "KAR-Q03",
    text: "Haben Sie Atemnot — besonders im Liegen oder bei Belastung?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag: true
  },
  {
    id: "KAR-Q04",
    text: "Spüren Sie Herzrasen, unregelmäßigen Herzschlag oder 'Stolpern' des Herzens?",
    type: "yes_no",
    variants: ["short", "standard", "deep"]
  },
  {
    id: "KAR-Q05",
    text: "Sind die Beschwerden bei körperlicher Belastung schlimmer und verschwinden in Ruhe?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    condition: { fact: "kar_chest_pain", operator: "equal", value: true }
  },
  {
    id: "KAR-Q06",
    text: "Haben Sie Beinödeme (geschwollene Knöchel/Unterschenkel), besonders abends?",
    type: "yes_no",
    variants: ["standard", "deep"]
  },
  {
    id: "KAR-Q07",
    text: "Haben Sie bekannte Herzerkrankungen, Stents, Bypässe oder hohen Blutdruck?",
    type: "yes_no",
    variants: ["standard", "deep"]
  },
  {
    id: "KAR-Q08",
    text: "Wann begannen die Beschwerden — plötzlich oder schleichend?",
    type: "single_choice",
    variants: ["standard", "deep"],
    options: [
      { value: "sudden", label: "Plötzlich (innerhalb Minuten)" },
      { value: "gradual", label: "Langsam zunehmend (Stunden/Tage)" },
      { value: "chronic", label: "Seit Wochen/Monaten bestehend" }
    ]
  }
];

const HERZ_DIAGNOSES = [
  {
    id: "KAR-001",
    name: "Stabile Angina Pectoris / KHK",
    icd10: "I20.8",
    probability_score: 0,
    description: "Reversible myokardiale Ischämie durch koronare Stenosen. Belastungsabhängiger Druck-/Engegefühl, Ausstrahlung linker Arm/Kiefer. Nitro-Response (2-3 Min). Risikokonst.: Hypertonie, Diabetes, Rauchen, Dyslipidämie, positive Familienanamnese.",
    clinical_assessment: [
      "Angina-Klassifikation (CCS I-IV)",
      "Ruhe-EKG (ggf. ST-Veränderungen)",
      "Stresstest / Koronarangiographie",
      "Nitro-Test: Ansprechen in 2-3 Min"
    ],
    viscerosomatic_msk: "Linke Schulter (C4-Dermatom/N. phrenicus), linker Arm T1-T4, BWS interscapulär links, Kiefer links — können führendes Symptom sein!",
    treatment_approach: [
      "Nitrate (kurzwirksam bei Bedarf, langwirksam prophylaktisch)",
      "Beta-Blocker, ACE-Hemmer, Statin, ASS",
      "Lebensstil: Rauchstopp, Gewicht, körperliche Aktivität",
      "Revaskularisation: PCI oder CABG bei relevanter Stenose"
    ],
    osteopathic_note: "KEINE Behandlung ohne kardiologische Abklärung! Nach Abklärung: Perikard-Osteopathie (Barral), mediastinale Dekompression, thorakaler Lymphdrainage kann adjuvant wirken. Parasympathikusförderung (CV4 kraniosakral).",
    factors: { relief: -3, range: -2, rhythm: -3, regulation: -3, re_energize: -3, relations: -1, rise: -3 }
  },
  {
    id: "KAR-002",
    name: "Akutes Koronarsyndrom (ACS/STEMI/NSTEMI)",
    icd10: "I21",
    probability_score: 0,
    emergency: true,
    description: "⚠️ LEBENSBEDROHLICH — Sofort 112 rufen! Ruptur atherosklerotischer Plaque → Thrombus → Myokardischämie/-infarkt. Typisch: anhaltender Brustschmerz >20 Min, Schweißausbruch, Übelkeit, Ausstrahlung. ABER: atypische Präsentation bei Frauen, Diabetikern, Älteren häufig!",
    action: "STOP SESSION — NOTRUF 112 — Lagerung: halbsitzend. ASS 500mg zerkauen (wenn verfügbar). EKG!",
    atypical_presentations: ["Epigastrischer Schmerz (Magenähnlich)", "Rückenschmerz (Aortendissektion DD!)", "Nur Atemnot", "Schwäche/Erschöpfung (besonders Frauen)", "Kieferschmerz"],
    factors: { relief: -5, range: -5, rhythm: -5, regulation: -5, re_energize: -5, relations: 0, rise: -5 }
  },
  {
    id: "KAR-003",
    name: "Perikarditis",
    icd10: "I30",
    probability_score: 0,
    description: "Entzündung des Herzbeutels (meist viral nach Infekt, autoimmun, selten bakteriell). Charakteristisch: lageabhängiger Schmerz (besser sitzen/vorbeugen, schlimmer Liegen), atemabhängig, pleuritisch. Reibegeräusch. Junge Männer häufiger.",
    clinical_tests: [
      { name: "Lagerungstest", description: "Schmerz besser in Sitzen/Vorbeuge (entlastet Perikard)", sensitivity: 0.85 },
      { name: "Perikardreiben (Auskultation)", description: "Ledernes Reibegeräusch — best gehört mit Membran, vorgebeugt", sensitivity: 0.65 }
    ],
    treatment_approach: [
      "Ibuprofen 600mg 3x/Tag für 2-4 Wochen (erste Wahl viral)",
      "Colchicin 0.5mg 2x/Tag für 3 Monate (Rezidivprävention)",
      "STRENGE Sportkarenz bis beschwerdefrei + CRP normal!",
      "Kortison nur bei Autoimmun-Ursache"
    ],
    osteopathic_note: "Nach Akutphase: Barral Perikard-Osteopathie (lig. sternoperikardiale, pleuroperikardale Adhäsionen). Mediastinale Dekompression. BWS T2-T4 (vaskulär-kardialer Reflex).",
    factors: { relief: -3, range: -2, rhythm: -3, regulation: -2, re_energize: -2, relations: 0, rise: -2 }
  },
  {
    id: "KAR-004",
    name: "Herzinsuffizienz (dekompensiert)",
    icd10: "I50",
    probability_score: 0,
    description: "Pumpversagen → Rückwärtsversagen (Stau) + Vorwärtsversagen (Minderperfusion). Leitsymptome: Dyspnoe (besonders orthopnoeisch), Ödeme beidseits, Müdigkeit. NYHA I-IV. Häufigste Ursachen: KHK, Hypertonie, Klappenfehler.",
    clinical_signs: ["Beinödeme bilateral", "Rasselgeräusche (Lungenstauung)", "Juguläre Venenstauung", "Orthopnoe (muss hochgelagert schlafen)"],
    treatment_approach: [
      "ACE-Hemmer/ARNi + Beta-Blocker + MRA + SGLT2-Inhibitor (HFrEF-Quartet)",
      "Diuretika (Schleifendiuretika: Torasemid)",
      "ICD/CRT bei indizierter LVEF"
    ],
    osteopathic_note: "Fossum RC-Modell zentral: venöser Rückfluss verbessern (Bein-Lymphdrainage, Diaphragma-Mobilisation, Perikard-Release). NICHT aktiv manipulativ in akuter Dekompensation.",
    factors: { relief: -3, range: -3, rhythm: -3, regulation: -3, re_energize: -4, relations: -1, rise: -4 }
  },
  {
    id: "KAR-005",
    name: "Herzrhythmusstörungen",
    icd10: "I49",
    probability_score: 0,
    description: "Supraventrikuläre (AVNRT, WPW, Vorhofflimmern/-flattern) oder ventrikuläre Arrhythmien (VES, VT, VF). Vorhofflimmern = häufigste anhaltende Rhythmusstörung, Schlaganfallrisiko!",
    clinical_assessment: ["EKG (Langzeit-EKG bei Verdacht)", "Elektrolyte (K+, Mg2+)", "Schilddrüse (Hyperthyreose → VHF)"],
    treatment_approach: ["Frequenz-/Rhythmuskontrolle", "Antikoagulation bei VHF (CHA₂DS₂-VASc ≥1)", "Katheterablation bei AVNRT/VHF"],
    factors: { relief: -2, range: -1, rhythm: -3, regulation: -3, re_energize: -2, relations: 0, rise: -2 }
  },
  {
    id: "KAR-006",
    name: "Hypertensive Krise",
    icd10: "I10",
    probability_score: 0,
    emergency: true,
    description: "⚠️ RR >180/120 mmHg mit Organschäden (Enzephalopathie, Epistaxis, Sehstörungen, Thoraxschmerz) = Hypertensiver Notfall → 112!",
    action: "Blutdruckmessung sofort. Bei RR >180/120 + Symptome → 112. Sonst: Hausarzt sofort.",
    factors: { relief: -4, range: -2, rhythm: -4, regulation: -4, re_energize: -3, relations: 0, rise: -4 }
  }
];

const HERZ_RULES = [
  {
    name: "ACS — Brustschmerz + Ausstrahlung + akut",
    conditions: {
      all: [
        { fact: "kar_chest_pain", operator: "equal", value: true },
        { fact: "kar_radiation", operator: "equal", value: true },
        { fact: "kar_onset", operator: "equal", value: "sudden" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "KAR-002", probability_score: 90, alert: "⚠️ NOTFALL — 112!" }
  },
  {
    name: "Angina — Belastungsabhängig + linker Arm",
    conditions: {
      all: [
        { fact: "kar_chest_pain", operator: "equal", value: true },
        { fact: "kar_effort_dependent", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "KAR-001", probability_score: 78 }
  },
  {
    name: "Perikarditis — Lageabhängig + atemabhängig + kein ACS-Muster",
    conditions: {
      all: [
        { fact: "kar_chest_pain", operator: "equal", value: true },
        { fact: "kar_positional", operator: "equal", value: true },
        { fact: "kar_radiation", operator: "equal", value: false }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "KAR-003", probability_score: 70 }
  },
  {
    name: "Herzinsuffizienz — Dyspnoe + Ödeme + Orthopnoe",
    conditions: {
      all: [
        { fact: "kar_dyspnoe", operator: "equal", value: true },
        { fact: "kar_leg_edema", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "KAR-004", probability_score: 75 }
  }
];

export { HERZ_QUESTIONS, HERZ_DIAGNOSES, HERZ_RULES };
