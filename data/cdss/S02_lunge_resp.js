/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Systemisches Modul S02: LUNGE & RESPIRATORISCHES SYSTEM
 *
 * Diagnosen:
 *  LUN-001  Asthma bronchiale J45
 *  LUN-002  COPD J44
 *  LUN-003  Pneumonie J18 ⚠️
 *  LUN-004  Lungenembolie I26 ⚠️ NOTFALL
 *  LUN-005  Pneumothorax J93 ⚠️ NOTFALL
 *  LUN-006  Schlafapnoesyndrom G47.3
 *
 * Quellen:
 *  - GINA: Global Initiative for Asthma. 2023.
 *  - GOLD: Global Strategy for COPD. 2024.
 *  - ESC: Pulmonary Embolism Guidelines 2019.
 *  - Barral JP: The Thorax. Eastland Press 1991.
 *  - Fossum C: Respiratory-Circulatory Model. 2022.
 */

const LUNGE_QUESTIONS = [
  {
    id: "LUN-Q01",
    text: "Haben Sie Atemnot?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag: true
  },
  {
    id: "LUN-Q02",
    text: "Wann tritt die Atemnot auf?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    condition: { fact: "lun_dyspnoe", operator: "equal", value: true },
    options: [
      { value: "exertion", label: "Nur bei Belastung (Treppen, Sport)" },
      { value: "rest_and_exertion", label: "Auch in Ruhe" },
      { value: "nocturnal", label: "Nachts / beim Aufwachen" },
      { value: "sudden", label: "Plötzlich / akut eingesetzt" },
      { value: "episodic", label: "Episodisch / anfallsartig" }
    ]
  },
  {
    id: "LUN-Q03",
    text: "Husten Sie? Wenn ja — mit Auswurf?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "dry", label: "Trockener Reizhusten (kein Schleim)" },
      { value: "productive_clear", label: "Husten mit klarem/weißem Schleim" },
      { value: "productive_yellow", label: "Husten mit gelbem/grünem Schleim (infektiös)" },
      { value: "productive_blood", label: "Blutiger Auswurf (Hämoptyse) ⚠️" },
      { value: "no_cough", label: "Kein Husten" }
    ]
  },
  {
    id: "LUN-Q04",
    text: "Hören Sie ein pfeifendes oder brummendes Geräusch beim Atmen (Giemen/Pfeifen)?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    hint: "Pfeifen = Bronchospasmus (Asthma, COPD-Exazerbation)"
  },
  {
    id: "LUN-Q05",
    text: "Haben Sie Fieber, Schüttelfrost oder fühlen sich allgemein krank?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag: true
  },
  {
    id: "LUN-Q06",
    text: "Sind Sie kürzlich länger gereist, hatten eine OP oder liegen Sie viel im Bett?",
    type: "yes_no",
    variants: ["standard", "deep"],
    red_flag: true,
    hint: "⚠️ Thrombose/PE-Risiko: Immobilisierung, lange Flugreise, postoperativ"
  },
  {
    id: "LUN-Q07",
    text: "Rauchen Sie oder haben Sie früher geraucht? Wie viele Packyears?",
    type: "single_choice",
    variants: ["standard", "deep"],
    options: [
      { value: "never", label: "Nie geraucht" },
      { value: "ex_light", label: "Ex-Raucher (< 10 Packyears)" },
      { value: "ex_heavy", label: "Ex-Raucher (≥ 10 Packyears)" },
      { value: "current_light", label: "Aktuell Raucher (< 10 Packyears)" },
      { value: "current_heavy", label: "Aktuell Raucher (≥ 10 Packyears)" }
    ]
  },
  {
    id: "LUN-Q08",
    text: "Schnarchen Sie laut, oder hat jemand beobachtet, dass Sie nachts Atemaussetzer haben?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Obstruktive Schlafapnoe — hohe MSK-Komorbiditätsrate"
  },
  {
    id: "LUN-Q09",
    text: "Ist der Schmerz im Brustkorb atemabhängig und seitlich lokalisiert?",
    type: "yes_no",
    variants: ["standard", "deep"],
    red_flag: true,
    hint: "⚠️ Pleuritischer Schmerz: PE, Pleuritis, Pneumonie"
  }
];

const LUNGE_DIAGNOSES = [
  {
    id: "LUN-001",
    name: "Asthma bronchiale",
    icd10: "J45",
    probability_score: 0,
    description: "Chronisch entzündliche Erkrankung der Atemwege mit reversibler Obstruktion, Hyperreagibilität und Schleimhautödem. Episodisch — typisch: Pfeifen, Husten, Atemnot anfallsweise, besonders nachts/früh morgens. Trigger: Allergene, Kälte, Belastung, NSAR, Stress.",
    clinical_tests: [
      {
        name: "Spirometrie + Reversibilitätstest",
        description: "FEV1/FVC <70% + Reversibilität nach Bronchodilatator ≥12% und 200ml",
        sensitivity: 0.80, specificity: 0.85
      },
      {
        name: "Peak Flow (PEF)",
        description: "Tagesvariation >20% = charakteristisch für Asthma",
        sensitivity: 0.75
      }
    ],
    treatment_approach: [
      "GINA Step 1-5: ICS (inhalatives Kortikosteroid) + LABA (long-acting β₂)",
      "Reliever: kurzwirksames SABA (Salbutamol) bei Bedarf",
      "Allergologie, Asthmaschulung, Trigger-Karenz",
      "Biologika bei schwerem eosinophilem Asthma (Dupilumab, Mepolizumab)"
    ],
    osteopathic_note: "Atemtechnik zentral! Fossum RC-Modell: Zwerchfell + 1. Rippe + thorakaler Eingang. Barral: Lungen-Pleura-Release (Cupola besonders), Hilus-Mobilisation. Parasympathikus-Dysregulation (N. vagus) mitbehandeln: CV4, OAA-Release.",
    factors: { relief: -2, range: -1, rhythm: -3, regulation: -2, re_energize: -2, relations: -1, rise: -2 }
  },
  {
    id: "LUN-002",
    name: "COPD",
    icd10: "J44",
    probability_score: 0,
    description: "Chronisch progrediente, nicht-reversible Obstruktion. Ursache: Rauchen (≥80%), Staubexposition. GOLD-Stadium I-IV. Leitsymptome: chronischer Husten mit Auswurf (Bronchitis-Typ), progrediente Belastungsdyspnoe. Häufig Depression, Kachexie, Muskelatrophie.",
    clinical_tests: [
      { name: "Spirometrie post Bronchodilatator", description: "FEV1/FVC <0.70 = COPD definiert. FEV1 % SOLL → GOLD I-IV", sensitivity: 0.90 }
    ],
    treatment_approach: [
      "Rauchstopp (einzige krankheitsmodifizierende Maßnahme!)",
      "LAMA + LABA (+ ICS bei Exazerbationshäufigkeit ≥2/Jahr oder Eos ≥300)",
      "Pulmonale Rehabilitation (strukturiertes Trainingsprogramm)",
      "O₂-Langzeittherapie bei pO₂ <55 mmHg",
      "Atemphysiotherapie, Sekretmanagement"
    ],
    osteopathic_note: "Atemhilfsmuskulatur (SCM, Skaleni, Pectoralis) chronisch hypertrophiert → Behandlung thorakaler Eingang, 1. Rippe. Zwerchfell flach + überlastet → MFR. Fasszienbehandlung Thorax (Myers: SBL + SFL). Barral: Cupola + Hilus.",
    factors: { relief: -3, range: -2, rhythm: -3, regulation: -3, re_energize: -3, relations: -1, rise: -3 }
  },
  {
    id: "LUN-003",
    name: "Pneumonie",
    icd10: "J18",
    probability_score: 0,
    description: "Infektion des Lungenparenchyms. Klassisch: Fieber, produktiver Husten (gelblich-grün), Dyspnoe, pleuritischer Schmerz. Vitalzeichen! CRB-65-Score für Schweregrad. Häufigster Erreger ambulant: Streptococcus pneumoniae.",
    action: "Hausarzt/Notaufnahme → Röntgen Thorax, Blutbild, CRP. Antibiotika!",
    crb65: "0 Pkt: ambulant; 1-2: stationär erwägen; 3-4: Intensiv",
    treatment_approach: [
      "Ambulant: Amoxicillin 1g 3x/Tag für 5-7 Tage (+ Azithromycin bei atypisch)",
      "Ausreichend Flüssigkeit, Bettruhe",
      "Atemphysiotherapie: Incentive Spirometrie, Sekretmobilisation"
    ],
    osteopathic_note: "In Rekonvaleszenz (NACH Fieberfreiheit + Antibiotika): osteopathische Sekretmobilisation (Perkussion, vibrierende Techniken), Lymphdrainage Thorax, pleurale Entfaltung. Barral: post-pneumonische Adhäsionen.",
    factors: { relief: -3, range: -2, rhythm: -3, regulation: -3, re_energize: -3, relations: 0, rise: -3 }
  },
  {
    id: "LUN-004",
    name: "Lungenembolie",
    icd10: "I26",
    probability_score: 0,
    emergency: true,
    description: "⚠️ NOTFALL! Thromboembolischer Verschluss pulmonalarterieller Gefäße. Klinik: plötzliche Dyspnoe, Tachykardie, pleuritischer Schmerz, evtl. Synkope, Hämoptyse. Risiko: Immobilisation, postoperativ, Tumorerkrankung, Hormontherapie.",
    action: "SOFORT 112 — Sauerstoff — Lagerung — KEINE Massage der Beine!",
    scores: [
      "Wells-Score für PE: Klinische Wahrscheinlichkeit",
      "D-Dimere: NPV sehr hoch — negativer Wert bei niedriger Prätestwahrscheinlichkeit schließt PE aus"
    ],
    factors: { relief: -5, range: -5, rhythm: -5, regulation: -5, re_energize: -5, relations: 0, rise: -5 }
  },
  {
    id: "LUN-005",
    name: "Pneumothorax",
    icd10: "J93",
    probability_score: 0,
    emergency: true,
    description: "⚠️ NOTFALL! Luft im Pleuraraum → Lungenkollaps. Plötzlicher Schmerz + Dyspnoe. Spannungspneumothorax = unmittelbar lebensbedrohlich. Risiko: junger Ektomorpher, Rauchen, COPD, nach Interkostalnervenblockade.",
    action: "SOFORT 112 — Spannungszeichen (Trachealdeviation, Kreislaufversagen) = sofortige Nadeldekompression durch Arzt!",
    factors: { relief: -5, range: -5, rhythm: -5, regulation: -5, re_energize: -5, relations: 0, rise: -5 }
  },
  {
    id: "LUN-006",
    name: "Obstruktives Schlafapnoesyndrom (OSAS)",
    icd10: "G47.3",
    probability_score: 0,
    description: "Repetitiver Kollaps der oberen Atemwege im Schlaf → Apnoen + Arousals. Hauptsymptome: lautes Schnarchen, Tagesmüdigkeit, Konzentrationsstörungen, Kopfschmerzen morgens. Risiko: Übergewicht, männlich, kurzer Hals. Hohe Komorbiditätsrate: Hypertonie, Vorhofflimmern, Diabetes, Depression.",
    screening: "STOP-BANG Score: ≥3 Pkt → Schlaflabordiagnostik (Polygraphie/Polysomnographie)",
    treatment_approach: [
      "CPAP (Continuous Positive Airway Pressure) — First-line ab AHI ≥15",
      "Gewichtsreduktion (MST-Therapie!)",
      "Körperlagetraining (Rückenlagen vermeiden)",
      "Unterkiefer-Protrusionsschiene (MAD) bei leichtem/moderatem OSAS oder CPAP-Intoleranz",
      "HNO: Uvulopalatopharyngoplastik (UPPP) bei anatomischen Ursachen"
    ],
    osteopathic_note: "Kraniomandibuläre Dysfunktion (CMD), HWS-Dysfunktion und erhöhte Zungenbeintension können OSAS begünstigen. Kraniosakraler Ansatz: temporomandibuläres Gelenk, Zungenbein-Release, OAA. Fossum: Zervikales Diaphragma (Hyoid-Ebene) + kraniale Venendrainageebene.",
    factors: { relief: -2, range: -1, rhythm: -3, regulation: -2, re_energize: -3, relations: -1, rise: -2 }
  }
];

const LUNGE_RULES = [
  {
    name: "PE — plötzlich + Dyspnoe + Risikofaktoren",
    conditions: {
      all: [
        { fact: "lun_dyspnoe", operator: "equal", value: true },
        { fact: "lun_onset", operator: "equal", value: "sudden" },
        { fact: "lun_risk_immobility", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "LUN-004", probability_score: 85, alert: "⚠️ NOTFALL — 112!" }
  },
  {
    name: "Asthma — episodisch + Giemen + anfallsartig",
    conditions: {
      all: [
        { fact: "lun_wheeze", operator: "equal", value: true },
        { fact: "lun_onset", operator: "equal", value: "episodic" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "LUN-001", probability_score: 80 }
  },
  {
    name: "COPD — Raucher + progredient + Auswurf",
    conditions: {
      all: [
        { fact: "lun_smoker", operator: "in", value: ["current_heavy", "ex_heavy"] },
        { fact: "lun_productive_cough", operator: "in", value: ["productive_clear", "productive_yellow"] },
        { fact: "lun_dyspnoe", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "LUN-002", probability_score: 78 }
  },
  {
    name: "Pneumonie — Fieber + produktiver Husten",
    conditions: {
      all: [
        { fact: "lun_fever", operator: "equal", value: true },
        { fact: "lun_productive_cough", operator: "equal", value: "productive_yellow" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "LUN-003", probability_score: 75 }
  },
  {
    name: "OSAS — Schnarchen + Tagesmüdigkeit",
    conditions: {
      all: [
        { fact: "lun_snoring", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "LUN-006", probability_score: 65 }
  }
];

export { LUNGE_QUESTIONS, LUNGE_DIAGNOSES, LUNGE_RULES };
