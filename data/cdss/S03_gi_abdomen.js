/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Systemisches Modul S03: GASTROINTESTINALTRAKT & ABDOMEN
 *
 * Diagnosen:
 *  GI-001  GERD / Refluxösophagitis K21
 *  GI-002  Reizdarmsyndrom (IBS) K58
 *  GI-003  Cholezystitis / Cholelithiasis K80 ⚠️
 *  GI-004  Pankreatitis K85 ⚠️
 *  GI-005  Appendizitis K37 ⚠️ NOTFALL
 *  GI-006  Chronisch-entzündliche Darmerkrankung (CED) K50/K51
 *
 * Quellen:
 *  - ACG Clinical Guideline: GERD. Am J Gastroenterol 2022.
 *  - Rome IV Criteria: Functional Gastrointestinal Disorders 2016.
 *  - Barral JP: Visceral Manipulation I & II. Eastland Press 1988/1989.
 *  - Pischinger A: Das System der Grundregulation. Haug 2009.
 */

const GI_QUESTIONS = [
  {
    id: "GI-Q01",
    text: "Haben Sie Bauchschmerzen? Wenn ja, wo genau?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "epigastric", label: "Oberbauch / Magengrube (Epigastrium)" },
      { value: "right_upper", label: "Rechter Oberbauch (Gallenblase/Leber)" },
      { value: "left_upper", label: "Linker Oberbauch (Milz/Pankreas)" },
      { value: "periumbilical", label: "Nabelbereich" },
      { value: "right_lower", label: "Rechter Unterbauch (Appendix/Colon)" },
      { value: "left_lower", label: "Linker Unterbauch (Sigma/Colon descendens)" },
      { value: "diffuse", label: "Gesamter Bauch / diffus" },
      { value: "no_pain", label: "Kein Bauchschmerz" }
    ]
  },
  {
    id: "GI-Q02",
    text: "Haben Sie Sodbrennen, saures Aufstoßen oder ein Brennen hinter dem Brustbein?",
    type: "yes_no",
    variants: ["short", "standard", "deep"]
  },
  {
    id: "GI-Q03",
    text: "Haben Sie Übelkeit, Erbrechen oder Durchfall / Verstopfung?",
    type: "multiple_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "nausea", label: "Übelkeit" },
      { value: "vomiting", label: "Erbrechen" },
      { value: "diarrhea", label: "Durchfall" },
      { value: "constipation", label: "Verstopfung" },
      { value: "alternating", label: "Wechsel Durchfall/Verstopfung" },
      { value: "none", label: "Keines davon" }
    ]
  },
  {
    id: "GI-Q04",
    text: "Haben Sie Blut im Stuhl, schwarzen Stuhl (Teerstuhl) oder Blut beim Erbrechen?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag: true,
    hint: "⚠️ Blut im Stuhl / Hämatemesis = SOFORT Arzt. Meläna (Teerstuhl) = obere GI-Blutung!"
  },
  {
    id: "GI-Q05",
    text: "Haben Sie Fieber?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag: true
  },
  {
    id: "GI-Q06",
    text: "Tritt der Bauchschmerz nach Fettessen auf, mit Ausstrahlung in die rechte Schulter?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Gallenkolik: fettassoziierter Schmerz, Murphy-Zeichen, Ausstrahlung rechte Schulter (C4)"
  },
  {
    id: "GI-Q07",
    text: "Haben Sie starken, gürtelförmigen Oberbauchschmerz in den Rücken ausstrahlend, besonders nach Alkohol oder Fettessen?",
    type: "yes_no",
    variants: ["standard", "deep"],
    red_flag: true,
    hint: "⚠️ Pankreatitis: gürtelförmig, radiärer Rückenschmerz, nach Alkohol — sofortiger Arzt!"
  },
  {
    id: "GI-Q08",
    text: "Haben Sie Gewichtsverlust, ungewollten Appetitverlust oder anhaltende Erschöpfung?",
    type: "yes_no",
    variants: ["standard", "deep"],
    red_flag: true,
    hint: "⚠️ Alarmsymptome (Red Flags Gastrointestinal): Malignität ausschließen!"
  },
  {
    id: "GI-Q09",
    text: "Haben Sie bekannte chronische Darmerkrankungen (Morbus Crohn, Colitis ulcerosa)?",
    type: "yes_no",
    variants: ["standard", "deep"]
  },
  {
    id: "GI-Q10",
    text: "Lindern oder verstärken sich Ihre Bauchbeschwerden beim Stuhlgang?",
    type: "yes_no",
    variants: ["deep"],
    hint: "Charakteristisch für Reizdarmsyndrom: Stuhlgangsassoziierte Beschwerden (Rome IV)"
  }
];

const GI_DIAGNOSES = [
  {
    id: "GI-001",
    name: "GERD / Gastroösophagealer Reflux",
    icd10: "K21",
    probability_score: 0,
    description: "Aufstieg von Mageninhalt in Speiseröhre → Sodbrennen, saures Aufsteigen, Regurgitation. Risikofaktoren: Adipositas, Rauchen, Alkohol, Schwangerschaft, hiatale Hernie. Typisch: nach Mahlzeiten, im Liegen, bei Bücken.",
    red_flags: ["Dysphagie (Schluckstörung) → Barrett, Karzinom ausschließen!", "Odynophagie", "Gewichtsverlust"],
    clinical_tests: [
      { name: "Klinisches Bild + PPI-Test", description: "PPI 2x täglich für 2 Wochen: Ansprechen bestätigt GERD klinisch", sensitivity: 0.78, specificity: 0.54 }
    ],
    treatment_approach: [
      "PPI (Protonenpumpenhemmer): Omeprazol 20mg 1x/Tag nüchtern (4-8 Wochen)",
      "Antazida bei Bedarf",
      "Lifestyle: Gewicht reduzieren, Bettkopfende erhöhen, spät abends nichts essen",
      "Rauchstopp, Alkohol reduzieren"
    ],
    osteopathic_note: "Barral: Kardia-Spannung (GE-Junction), Hiatusrelaxation, Magenachse-Reposition. Zwerchfell-Dysfunktion ist oft mitursächlich (hiatus oesophageus = Zwerchfellöffnung). Fossum: Thorakoabdominales Diaphragma als Schlüsselstruktur.",
    factors: { relief: -2, range: -1, rhythm: -1, regulation: -1, re_energize: -1, relations: -1, rise: -1 }
  },
  {
    id: "GI-002",
    name: "Reizdarmsyndrom (IBS)",
    icd10: "K58",
    probability_score: 0,
    description: "Funktionelle Darmerkrankung — keine strukturelle Läsion. Rome IV Kriterien: Bauchschmerz ≥1x/Woche für ≥3 Monate, assoziiert mit Stuhlgang/Frequenz/Konsistenz. Subtypes: IBS-C (Konstipation), IBS-D (Diarrhoe), IBS-M (gemischt). Hohe Komorbiditätsrate: Depression, Angst, Fibromyalgie.",
    rome_iv: "Bauchschmerz ≥1x/Woche × 3 Monate, PLUS ≥2 von: 1) Besserung/Verschlechterung bei Defäkation, 2) Frequenzänderung, 3) Konsistenzänderung",
    red_flags: ["Blut im Stuhl", "Nachtsymptome", "Gewichtsverlust", "Erstmanifestation >50 Jahre", "Positive Familienanamnese (CED, Kolonkarzinom)"],
    treatment_approach: [
      "Ernährungsmodifikation: Low-FODMAP Diät (82% Ansprechen in Studien — Gibson 2010)",
      "Antispasmodika: Mebeverin, Pfefferminzöl",
      "IBS-D: Loperamid, Rifaximin",
      "IBS-C: Macrogol, Linaclotid",
      "Psychotherapie / Gut-directed Hypnotherapy (Evidenz A)",
      "Probiotika: Lactobacillus, Bifidobacterium (moderate Evidenz)"
    ],
    osteopathic_note: "ZENTRAL: Barral viszerale Behandlung des gesamten Kolons (Colon-Mobilisation, Ileozökalklappen-Release), Dünndarm-Mesenterium (Lift). Gut-Brain-Axis (Vagus N.X): kraniosakrale Behandlung (CV4, OAA) kann visceralen Tonus normalisieren. Sigma-Release, Beckenbodenmobilisation.",
    factors: { relief: -2, range: -1, rhythm: -2, regulation: -2, re_energize: -2, relations: -1, rise: -1 }
  },
  {
    id: "GI-003",
    name: "Cholezystitis / Cholelithiasis",
    icd10: "K80",
    probability_score: 0,
    description: "Gallensteinkrankheit (häufig), entzündete Gallenblase (Cholezystitis). Risiko: 'Fett, Forty, Fertile, Female' (Adipositas, >40 Jahre, Schwangere, Frauen). Typisch: Koliken nach Fettessen, rechter Oberbauch/Schulter-Ausstrahlung (C4, Phrenikussymptom).",
    clinical_tests: [
      { name: "Murphy-Zeichen", description: "Tiefer Druck rechts subkostal bei Einatmen → Atemstop durch Schmerz", sensitivity: 0.65, specificity: 0.87, lr_positive: 5.0 }
    ],
    treatment_approach: [
      "Akute Kolik: Spasmolytika (Buscopan), NSAR, Stationär bei Cholezystitis (Antibiotika + Cholezystektomie)",
      "Elektive Cholezystektomie (laparoskopisch) bei symptomatischer Cholezystolithiasis"
    ],
    osteopathic_note: "Barral: Gallenblasenmobilisation, Ligamentum hepatoduodenale-Release. NACH Akutphase. Rechte Schulter (C4) und T5-T9 rechts (viszerosomatischer Reflex) mitbehandeln.",
    factors: { relief: -2, range: -1, rhythm: -2, regulation: -2, re_energize: -2, relations: 0, rise: -2 }
  },
  {
    id: "GI-004",
    name: "Pankreatitis",
    icd10: "K85",
    probability_score: 0,
    emergency: true,
    description: "⚠️ Akut: Notfall! Chronisch: rezidivierend. Akut: Autodigestion durch vorzeitig aktivierte Pankreasenzyme. Ursachen: Alkohol (40%), Gallensteine (40%), idiopathisch. Klassisch: plötzlich einsetzender gürtelförmiger Oberbauchschmerz, in den Rücken ausstrahlend, Übelkeit/Erbrechen, Lipase-Erhöhung.",
    action: "SOFORT Hausarzt/Notaufnahme: Lipase-Messung, Stationäre Aufnahme bei akuter Pankreatitis (Null per os, Volumentherapie i.v.).",
    factors: { relief: -4, range: -3, rhythm: -4, regulation: -4, re_energize: -4, relations: 0, rise: -4 }
  },
  {
    id: "GI-005",
    name: "Appendizitis",
    icd10: "K37",
    probability_score: 0,
    emergency: true,
    description: "⚠️ NOTFALL! Entzündung des Wurmfortsatzes. Klassisch: Wandernder Schmerz Nabel → McBurney-Punkt (rechter Unterbauch), Fieber, Übelkeit. Kinder und junge Erwachsene häufiger.",
    action: "SOFORT Notaufnahme — Laparoskopische Appendektomie!",
    clinical_tests: [
      { name: "McBurney-Druckschmerz", description: "Punkt zwischen Nabel und Spina iliaca anterior superior rechts", sensitivity: 0.85 },
      { name: "Loslassschmerz (Blumberg)", description: "Tiefer Druck → plötzliches Loslassen → Schmerz rechts", sensitivity: 0.70, specificity: 0.85 },
      { name: "Alvarado Score", description: "8 klinische Parameter: ≥7 = OP, 5-6 = CT, <5 = Beobachtung", sensitivity: 0.82 }
    ],
    factors: { relief: -5, range: -4, rhythm: -5, regulation: -5, re_energize: -5, relations: 0, rise: -5 }
  },
  {
    id: "GI-006",
    name: "Chronisch-entzündliche Darmerkrankung (CED)",
    icd10: "K50",
    icd10_uc: "K51",
    probability_score: 0,
    description: "Morbus Crohn (K50): transmural, diskontinuierlich, gesamter GI-Trakt. Colitis ulcerosa (K51): kontinuierlich, Schleimhaut, Rektum aufsteigend. Extraintestinale Manifestationen: Arthritis (Sakroiliitis!), Uveitis, Erythema nodosum, Pyoderma gangraenosum.",
    clinical_note: "Bei ISG-Schmerz + jungem Patient + GI-Symptomen → CED + axiale Spondyloarthropathie (axSpA) ausschließen!",
    treatment_approach: [
      "Remissionsinduktion: Kortikosteroide, Mesalazin (UC)",
      "Remissionserhalt: Azathioprin, Biologika (Anti-TNF: Infliximab, Adalimumab; Anti-IL: Vedolizumab, Ustekinumab)",
      "Ernährungstherapie (Crohn: exklusive enterale Ernährung bei Kindern)",
      "OP: bei Komplikationen (Stenose, Fistel, therapierefraktär)"
    ],
    osteopathic_note: "Adjuvant in Remission: Barral viszerale Techniken (Colon, Dünndarm), Lymphdrainage abdominal. Sakroiliitis (axSpA) = eigenständiges MSK-Problem mitbehandeln (vgl. LWS-Modul axSpA). NICHT in Schub manipulativ behandeln!",
    factors: { relief: -3, range: -2, rhythm: -2, regulation: -3, re_energize: -2, relations: -1, rise: -2 }
  }
];

const GI_RULES = [
  {
    name: "Appendizitis — rechter Unterbauch + Fieber + akut",
    conditions: {
      all: [
        { fact: "gi_location", operator: "equal", value: "right_lower" },
        { fact: "gi_fever", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "GI-005", probability_score: 82, alert: "⚠️ NOTFALL — Notaufnahme!" }
  },
  {
    name: "Pankreatitis — gürtelförmig + Alkohol + Ausstrahlung Rücken",
    conditions: {
      all: [
        { fact: "gi_belt_pain_back", operator: "equal", value: true },
        { fact: "gi_location", operator: "in", value: ["epigastric", "left_upper"] }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "GI-004", probability_score: 80, alert: "⚠️ Notarzt!" }
  },
  {
    name: "Cholezystitis — rechts oben + fettassoziiert + Schulterausstrahlung",
    conditions: {
      all: [
        { fact: "gi_location", operator: "equal", value: "right_upper" },
        { fact: "gi_fat_triggered", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "GI-003", probability_score: 76 }
  },
  {
    name: "GERD — Sodbrennen + nach Mahlzeiten",
    conditions: {
      all: [
        { fact: "gi_heartburn", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "GI-001", probability_score: 74 }
  },
  {
    name: "IBS — stuhlgangsassoziiert + wechselnd + keine Red Flags",
    conditions: {
      all: [
        { fact: "gi_stool_related", operator: "equal", value: true },
        { fact: "gi_blood_stool", operator: "equal", value: false },
        { fact: "gi_fever", operator: "equal", value: false }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "GI-002", probability_score: 68 }
  }
];

export { GI_QUESTIONS, GI_DIAGNOSES, GI_RULES };
