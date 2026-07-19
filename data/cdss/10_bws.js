/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 10: BRUSTWIRBELSÄULE (BWS)
 *
 * Diagnosen:
 *  BWS-001  Kostovertebrales Gelenksyndrom M54.6
 *  BWS-002  Thorakales Facettengelenksyndrom M47.814
 *  BWS-003  Morbus Scheuermann (Adoleszent/Adult) M42.0
 *  BWS-004  Thorakale Radikulopathie M54.12
 *  BWS-005  Myofasziales BWS-Syndrom M79.1
 *  BWS-006  Thorakale Bandscheibenprotrusion M51.14
 *
 * ⚠️ RED FLAG: Thorakaler Schmerz IMMER sorgfältiger Red-Flag-Screen!
 *    Kardiovaskuläre, pulmonale und abdominale Differentialdiagnosen
 *    sind hier häufiger als an anderen Wirbelsäulenabschnitten.
 *
 * Quellen:
 *  - Edmondston SJ & Singer KP: Thoracic spine — anatomical and
 *    biomechanical considerations for manual therapy. Manual Therapy 1997.
 *  - Heneghan NR et al.: Clinical tests for thoracic spine dysfunction.
 *    JOSPT 2018.
 *  - Scheuermann HW: Kyphosis dorsalis juvenilis. Z Orthop Chir 1921.
 *  - Briggs AM et al.: Thoracic kyphosis in older individuals. J Gerontol 2007.
 *  - Fruth SJ: Differential diagnosis and treatment in a patient with
 *    posterior upper thoracic pain. Phys Ther 2006.
 */

// ═══════════════════════════════════════════
// RED FLAG NOTE — THORAX
// ═══════════════════════════════════════════
const BWS_RED_FLAG_ALERT = {
  warning: "⚠️ THORAKALER SCHMERZ — Erweiterte Differentialdiagnose",
  differential_non_msk: [
    { system: "Kardiovaskulär", diagnoses: ["Akutes Koronarsyndrom (ACS)", "Aortendissektion", "Perikarditis"], alert_if: "Ausstrahlung in Arm/Kiefer + Schweiß + Dyspnoe → SOFORT Notaufnahme" },
    { system: "Pulmonal", diagnoses: ["Pneumonie", "Lungenembolie", "Pneumothorax", "Pleuritis"], alert_if: "Atemabhängiger Schmerz + Dyspnoe + Fieber → Arzt heute" },
    { system: "Abdominal", diagnoses: ["Pankreatitis", "Cholezystitis", "Ulcus duodeni"], alert_if: "Ausstrahlung gürtelförmig + Übelkeit + Nüchternschmerz" },
    { system: "Neurologisch", diagnoses: ["Herpes zoster (vor Bläschen-Stadium)", "Myelopathie thorakal"], alert_if: "Einseitig brennend + hyperästhetisch" }
  ]
};

const BWS_QUESTIONS = [

  {
    id: "BWS-Q01",
    text: "Wo genau sitzt Ihr Schmerz in der Brustwirbelsäule / am Rücken?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "upper_bws", label: "Obere BWS / zwischen den Schulterblättern (Th1-Th4)" },
      { value: "mid_bws", label: "Mittlere BWS / Höhe Schulterblatt (Th5-Th8)" },
      { value: "lower_bws", label: "Untere BWS / unterhalb Schulterblätter (Th9-Th12)" },
      { value: "paravertebral", label: "Neben der Wirbelsäule (paravertebral beidseits)" },
      { value: "costovertebral", label: "Seitlich / Rippenbogen-Region" }
    ]
  },

  {
    id: "BWS-Q02",
    text: "Haben Sie Schmerzen beim tiefen Einatmen, Husten oder Niesen?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    hint: "Atemabhängiger Schmerz = typisch für Kostovertebrales Gelenk oder pulmonale Ursache"
  },

  {
    id: "BWS-Q03",
    text: "Strahlt der Schmerz um den Brustkorb herum (gürtelförmig) aus?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    hint: "Interkostal-Ausstrahlung = Kostovertebrales Gelenk oder thorakale Radikulopathie"
  },

  {
    id: "BWS-Q04",
    text: "⚠️ Strahlt der Schmerz in den Arm, Kiefer oder die Brust aus UND haben Sie gleichzeitig Atemnot, Schweißausbrüche oder Übelkeit?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag_screen: true,
    alert_if_yes: "MÖGLICHES AKUTES KORONARSYNDROM — SOFORT Notaufnahme!"
  },

  {
    id: "BWS-Q05",
    text: "Haben Sie eine ausgeprägte Rundrücken-Haltung oder wurde Ihnen jemals Morbus Scheuermann diagnostiziert?",
    type: "yes_no",
    variants: ["standard", "deep"]
  },

  {
    id: "BWS-Q06",
    text: "Wann begann der BWS-Schmerz?",
    type: "single_choice",
    variants: ["standard", "deep"],
    options: [
      { value: "gradual_posture", label: "Schleichend — langes Sitzen / Bildschirmarbeit / schlechte Haltung" },
      { value: "acute_twist", label: "Plötzlich nach Drehbewegung oder Heben" },
      { value: "after_sport", label: "Nach Sport / körperlicher Belastung" },
      { value: "morning_stiffness", label: "Morgendliche Steifheit (> 30 Minuten)" },
      { value: "no_cause", label: "Kein erkennbarer Auslöser" }
    ]
  },

  {
    id: "BWS-Q07",
    text: "Verschlimmert sich der Schmerz durch Rotation (Drehen) der Wirbelsäule?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Rotationsschmerz = typisch für Kostovertebral oder Facettengelenk"
  },

  {
    id: "BWS-Q08",
    text: "Haben Sie Kribbeln oder Taubheit, die gürtelförmig um den Brustkorb verläuft?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Dermatomale Ausstrahlung = thorakale Radikulopathie oder Herpes zoster"
  },

  {
    id: "BWS-Q09",
    text: "Beschreiben Sie Ihren Schmerz:",
    type: "single_choice",
    variants: ["standard", "deep"],
    options: [
      { value: "dull_deep", label: "Dumpf, tief, schwer lokalisierbar" },
      { value: "sharp_movement", label: "Stechend, besonders bei bestimmten Bewegungen" },
      { value: "burning_girdle", label: "Brennend, gürtelförmig" },
      { value: "pressure_heaviness", label: "Druck- oder Schwere-Gefühl" }
    ]
  },

  {
    id: "BWS-Q10",
    text: "Wie alt waren Sie, als die Beschwerden begannen?",
    type: "single_choice",
    variants: ["deep"],
    options: [
      { value: "adolescent", label: "In der Jugend (10-20 Jahre) — Scheuermann-Verdacht" },
      { value: "young_adult", label: "Junges Erwachsenenalter (20-35 Jahre)" },
      { value: "middle_age", label: "Mittleres Alter (35-55 Jahre)" },
      { value: "older", label: "Höheres Alter (>55 Jahre)" }
    ]
  },

  {
    id: "BWS-Q11",
    text: "Sitzen Sie beruflich viel (> 6 Stunden/Tag)?",
    type: "yes_no",
    variants: ["deep"]
  },

  {
    id: "BWS-Q12",
    text: "Haben Sie Blasen- oder Mastdarmprobleme oder Taubheit in den Beinen?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag_screen: true,
    alert_if_yes: "THORAKALE MYELOPATHIE — SOFORT MRT + Neurochirurgie!"
  }
];

const BWS_DIAGNOSES = [

  {
    id: "BWS-001",
    name: "Kostovertebrales Gelenksyndrom",
    icd10: "M54.6",
    probability_score: 0,
    description: "Dysfunction des kostovertebral/kostotransversalen Gelenks mit atemabhängigem, unilateralem Brustschmerz. Häufigste behandelbare BWS-Ursache in der manuellen Therapie. Schmerz oft gürtelförmig entlang des Rippenbogens.",
    pathoanatomy: "12 Rippenpaare, je 2 Gelenke pro Seite (kostovertebral + kostotransversal). Eingeschränkte Gleitbewegung bei Atmung → Schonhaltung → reaktive Muskelspannung.",
    clinical_tests: [
      {
        name: "Rippen-Springing (Rib Spring Test)",
        description: "PA-Druck auf Rippe → lokaler Schmerz und/oder Steifigkeit",
        sensitivity: 0.72, specificity: 0.85,
        source: "Heneghan et al., JOSPT 2018"
      },
      {
        name: "Atemexkursions-Test",
        description: "Händeplatzierung beidseits Thorax — Asymmetrie der Atemexkursion",
        sensitivity: 0.68, specificity: 0.80,
        note: "Einfach, klinisch sehr nützlich"
      },
      {
        name: "Palpation Kostovertebral-Gelenk",
        description: "Druckschmerz direkt am kostovertebral Gelenk (2-3 cm lateral Wirbeldornfortsatz)",
        sensitivity: 0.80,
        note: "Gut reproduzierbar bei geübten Therapeuten"
      }
    ],
    treatment_approach: [
      "Kostovertebrale Mobilisation (Maitland Grade III-IV) — Evidenz gut",
      "HVLA Thrust Technik Rippe (wenn keine Kontraindikation)",
      "Atemübungen: Laterale Rippenatmung",
      "Haltungskorrektur, Ergonomie"
    ],
    factors: { relief: -2, range: -2, rhythm: -2, regulation: -1, re_energize: -1, relations: 0, rise: 0 }
  },

  {
    id: "BWS-002",
    name: "Thorakales Facettengelenksyndrom",
    icd10: "M47.814",
    probability_score: 0,
    description: "Degenerativ oder mechanisch bedingte Facettengelenks-Irritation der BWS. Typisch: paravertebraler Schmerz, Rotationsschmerz, morgendliche Steifheit, keine Neurologie.",
    clinical_tests: [
      {
        name: "P-A Mobilisation (Maitland PA Pressure)",
        description: "Dorsoventraler Druck auf Dornfortsatz → lokaler Schmerz / Widerstand → veränderte Beweglichkeit",
        sensitivity: 0.78, specificity: 0.74,
        source: "Edmondston & Singer, Manual Therapy 1997"
      },
      {
        name: "Thorakale Rotation Provokation",
        description: "Rotation zur Schmerzseite in Sitz → Schmerz reproduzierbar",
        sensitivity: 0.71
      }
    ],
    treatment_approach: [
      "Maitland PA Mobilisation (starke Evidenz für thorakale Mobilisation)",
      "HVLA thorakal (Grade V) — mehrere RCTs belegen Wirksamkeit",
      "Stretching pectoralis minor (Haltungskorrektur)",
      "Kräftigung Rückenstrecker + Schulterblatt-Retraktion"
    ],
    note: "Thorakale Manipulation bei HWS-Beschwerden: RCT-Evidenz Level A für sofortige Schmerzreduktion (Cleland et al., JOSPT 2005)",
    factors: { relief: -2, range: -2, rhythm: -1, regulation: -1, re_energize: -1, relations: 0, rise: 0 }
  },

  {
    id: "BWS-003",
    name: "Morbus Scheuermann (juvenile/adulte Kyphose)",
    icd10: "M42.0",
    probability_score: 0,
    description: "Osteochondrose der Wirbelkörper-Apophysen → strukturelle thorakale Kyphose (>45°). Betrifft 1-8% der Jugendlichen (häufiger Jungen). Adulte Form: oft asymptomatisch, aber Schmerz durch Überbelastung der hinteren Strukturen.",
    diagnostic_criteria: "Radiologisch: 3 aufeinanderfolgende Wirbelkörper mit >5° Keildeformität (Cobb-Kriterium)",
    clinical_tests: [
      {
        name: "Adams Forward Bend Test",
        description: "Vorbeugen → strukturelle Kyphose sichtbar (nicht ausgleichbar = strukturell)",
        sensitivity: 0.85,
        note: "Unterscheidet strukturell (Scheuermann) von funktionell (muskulär)"
      },
      {
        name: "Finger-Boden-Abstand (FBA)",
        description: "Globale Flexionsmessung — oft eingeschränkt bei ausgeprägter Kyphose",
        sensitivity: 0.62
      }
    ],
    next_steps: "Röntgen BWS seitlich (Cobb-Winkel). Bei >70° Kyphose orthopädische Mitbeurteilung.",
    treatment_approach: [
      "Physiotherapie: Extensionsübungen, Kräftigung dorsaler Muskulatur (Evidenz B)",
      "Schroth-Methode (Spezifische 3D-Korrekturtechnik) — Evidenz wachsend",
      "Korsett bei Jugendlichen + Restachsenwachstum (Milwaukee/Boston-Korsett)",
      "Operation nur bei >75° Kyphose oder neurologischer Kompression"
    ],
    factors: { relief: -2, range: -3, rhythm: -1, regulation: -1, re_energize: -2, relations: -1, rise: -1 }
  },

  {
    id: "BWS-004",
    name: "Thorakale Radikulopathie",
    icd10: "M54.12",
    probability_score: 0,
    description: "Nervenwurzelkompression/-irritation im thorakalen Bereich. SELTEN — nur 0.15-4% aller Radikulopathien. WICHTIG: Differentialdiagnose zu kardiovaskulären, pulmonalen und abdominalen Erkrankungen!",
    warning: "⚠️ Thorakale Radikulopathie ist eine Ausschlussdiagnose — immer internistische Ursachen ausschließen!",
    dermatomal_patterns: {
      "Th1-Th2": "Innenseite Arm (DD: HWS-Pathologie, thoracic outlet)",
      "Th4-Th6": "Brustregion gürtelförmig (DD: Herzerkrankung, Pleuritis)",
      "Th6-Th9": "Oberbauch gürtelförmig (DD: Ulcus, Pankreatitis)",
      "Th10-Th12": "Unterbauch, Leiste (DD: Appendizitis, renale Kolik)"
    },
    clinical_tests: [
      {
        name: "Slump Test (thorakal modifiziert)",
        description: "Neurodynamischer Test für thorakale Nervenwurzeln",
        sensitivity: 0.68, specificity: 0.72,
        source: "Fruth SJ, Phys Ther 2006"
      },
      {
        name: "Dermatomale Sensibilitätsprüfung",
        description: "Monofilament oder Zahnstocher entlang thorakaler Dermatome",
        sensitivity: 0.62, specificity: 0.88
      }
    ],
    next_steps: "MRT BWS (Pflicht). Labor (CRP, Blutbild, BSG) zum Infektions-/Tumorausschluss. EKG bei kardialer DD.",
    factors: { relief: -3, range: -2, rhythm: -2, regulation: -1, re_energize: -2, relations: -1, rise: -1 }
  },

  {
    id: "BWS-005",
    name: "Myofasziales BWS-Syndrom",
    icd10: "M79.1",
    probability_score: 0,
    description: "Triggerpunkt-assoziierte Schmerzen der thorakalen Muskulatur. Häufigste Muskeln: M. trapezius (TP1-4), Mm. rhomboïdei, M. erector spinae thoracalis, M. serratus anterior. Stress- und haltungsassoziiert.",
    trigger_point_patterns: [
      { muscle: "M. trapezius (TP1)", referred_pain: "Okzipital/Schläfe/Hinterkopf" },
      { muscle: "M. trapezius (TP3)", referred_pain: "Schulter-Akromion-Bereich" },
      { muscle: "Mm. rhomboidei", referred_pain: "Medialer Schulterblattrand" },
      { muscle: "M. erector spinae Th", referred_pain: "Paravertebral BWS, diffus" }
    ],
    clinical_tests: [
      {
        name: "Triggerpunkt-Palpation",
        description: "Taut band (gespanntes Muskelbündel) + referred pain reproduzierbar + lokaler Zuckungsreflex",
        sensitivity: 0.65, specificity: 0.70,
        note: "Interrater-Reliabilität begrenzt — klinische Erfahrung entscheidend"
      }
    ],
    treatment_approach: [
      "Dry Needling (Evidenz Klasse B: Llamas-Ramos et al. 2014)",
      "Ischämische Kompression / Release",
      "Wärmetherapie",
      "Stressmanagement (häufig psychosoziale Verstärkungsfaktoren)",
      "Haltungskorrektur + Ergonomie Arbeitsplatz"
    ],
    factors: { relief: -2, range: -1, rhythm: -1, regulation: -2, re_energize: -1, relations: -1, rise: -1 }
  },

  {
    id: "BWS-006",
    name: "Thorakale Bandscheibenprotrusion",
    icd10: "M51.14",
    probability_score: 0,
    description: "Selten symptomatisch (nur 0.5-1.8% aller Bandscheibenvorfälle). WICHTIG: Wenn symptomatisch — Myelopathie-Risiko durch beengte spinale Enge im Thorakalbereich! Keine starken Mobilisationstechniken ohne MRT-Befund.",
    warning: "⚠️ Thorakale Myelopathie durch Bandscheibenvorfall ist ein Notfall! Bilateral-neurologische Symptome = SOFORT Neurochirurgie.",
    clinical_tests: [
      {
        name: "Babinski-Reflex",
        description: "Pathologisch = Zeichen der zentralen Läsion",
        sensitivity: 0.50, specificity: 0.99
      },
      {
        name: "Klonus",
        description: "Fußklonus als Zeichen der Myelopathie",
        sensitivity: 0.45, specificity: 0.97
      }
    ],
    next_steps: "MRT BWS obligat bei neurologischen Zeichen. Neurochirurgische Vorstellung bei Myelopathie.",
    factors: { relief: -3, range: -2, rhythm: -2, regulation: -1, re_energize: -2, relations: -1, rise: -2 }
  }
];

const BWS_RULES = [
  {
    name: "Kostovertebrales Gelenk — Atemschmerz",
    conditions: {
      all: [
        { fact: "bws_breathing_pain", operator: "equal", value: true },
        { fact: "bws_girdle_radiation", operator: "equal", value: true },
        { fact: "bws_cardiac_alarm", operator: "equal", value: false }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "BWS-001", probability_score: 80 }
  },
  {
    name: "Kostovertebrales Gelenk — seitlich + Rotation",
    conditions: {
      all: [
        { fact: "bws_location", operator: "equal", value: "costovertebral" },
        { fact: "bws_rotation_pain", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "BWS-001", probability_score: 72 }
  },
  {
    name: "Facettengelenk — paravertebral + Morgensteiifigkeit",
    conditions: {
      all: [
        { fact: "bws_location", operator: "equal", value: "paravertebral" },
        { fact: "bws_onset", operator: "equal", value: "morning_stiffness" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "BWS-002", probability_score: 70 }
  },
  {
    name: "Facettengelenk — Büro/Haltung + Rotation",
    conditions: {
      all: [
        { fact: "bws_onset", operator: "equal", value: "gradual_posture" },
        { fact: "bws_rotation_pain", operator: "equal", value: true },
        { fact: "bws_breathing_pain", operator: "equal", value: false }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "BWS-002", probability_score: 65 }
  },
  {
    name: "Scheuermann — Jugend-Onset + Rundrücken",
    conditions: {
      all: [
        { fact: "bws_age_onset", operator: "equal", value: "adolescent" },
        { fact: "bws_kyphosis", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "BWS-003", probability_score: 78 }
  },
  {
    name: "Radikulopathie thorakal — Kribbeln gürtelförmig",
    conditions: {
      all: [
        { fact: "bws_numbness_girdle", operator: "equal", value: true },
        { fact: "bws_pain_type", operator: "equal", value: "burning_girdle" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "BWS-004", probability_score: 65 }
  },
  {
    name: "Myofasziell — Büro + kein Atemschmerz",
    conditions: {
      all: [
        { fact: "bws_office_work", operator: "equal", value: true },
        { fact: "bws_breathing_pain", operator: "equal", value: false },
        { fact: "bws_numbness_girdle", operator: "equal", value: false }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "BWS-005", probability_score: 68 }
  }
];

const BWS_OUTPUT_CONFIG = {
  max_differentials_short: 2,
  max_differentials_standard: 3,
  max_differentials_deep: 5,
  key_differentiator: "Atemabhängigkeit (kostovertebral) + Neurologie (Radikulopathie) + Struktur (Scheuermann)",
  mandatory_red_flag_exclusions: [
    "Kardiovaskulär (ACS, Aortendissektion)",
    "Pulmonal (Lungenembolie, Pneumonie)",
    "Abdominal (Pankreatitis, Cholezystitis)",
    "Thorakale Myelopathie"
  ]
};

export {
  BWS_RED_FLAG_ALERT,
  BWS_QUESTIONS,
  BWS_DIAGNOSES,
  BWS_RULES,
  BWS_OUTPUT_CONFIG
};
