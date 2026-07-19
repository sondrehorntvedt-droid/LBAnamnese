/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 07: ELLENBOGEN
 *
 * Diagnosen:
 *  ELB-001  Laterale Epikondylalgie (Tennisellenbogen) M77.1
 *  ELB-002  Mediale Epikondylalgie (Golferellenbogen) M77.0
 *  ELB-003  Karpaltunnelsyndrom G54.0 (hier: Differentialdiagnose)
 *  ELB-004  Kubitaltunnelsyndrom (N. ulnaris) G56.20
 *  ELB-005  Ellenbogengelenksarthrose M19.02
 *  ELB-006  Radiusköpfchenfraktur (Ausschluss nach Trauma) S52.1
 *
 * Quellen:
 *  - Bisset LM et al.: A systematic review and meta-analysis of clinical
 *    tests for lateral epicondylalgia. Br J Sports Med 2006.
 *  - Coonen JM et al.: The diagnostic accuracy of clinical tests for
 *    cubital tunnel syndrome. JSES 2017.
 *  - Verhaar JA: Tennis elbow. Int Orthop 1994.
 *  - AWMF: Leitlinie Epikondylopathie. AWMF 2018.
 */

const ELLENBOGEN_QUESTIONS = [

  {
    id: "ELB-Q01",
    text: "Wo genau sitzt Ihr Ellenbogenschmerz hauptsächlich?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "lateral", label: "Außenseite des Ellenbogens (Tennisellenbogen-Seite)" },
      { value: "medial", label: "Innenseite des Ellenbogens" },
      { value: "posterior", label: "Olekranon / Spitze des Ellenbogens" },
      { value: "anterior", label: "Ellenbeuge / Vorderseite" },
      { value: "diffuse", label: "Gesamter Ellenbogen / diffus" }
    ]
  },

  {
    id: "ELB-Q02",
    text: "Wann entstanden die Beschwerden?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "gradual_overuse", label: "Schleichend durch Überlastung (wiederholte Bewegungen, Arbeit, Sport)" },
      { value: "trauma", label: "Nach einem Trauma / Sturz auf den Arm" },
      { value: "sudden_no_trauma", label: "Plötzlich ohne erkennbaren Auslöser" },
      { value: "after_sports", label: "Nach intensivem Sport (Tennis, Golf, Klettern)" }
    ]
  },

  {
    id: "ELB-Q03",
    text: "Welche Tätigkeiten verschlimmern den Schmerz?",
    type: "multiple_choice",
    variants: ["standard", "deep"],
    options: [
      { value: "grip_strength", label: "Greifen / Händedruck / Twist öffnen" },
      { value: "computer_mouse", label: "Mausbedienen, Tippen am Computer" },
      { value: "lifting_wrist_ext", label: "Heben mit Handgelenkstreckung (Handfläche nach unten)" },
      { value: "lifting_wrist_flex", label: "Heben mit Handgelenkbeugung (Handfläche nach oben)" },
      { value: "forearm_rotation", label: "Unterarmdrehbewegungen (z.B. Schraubenzieher)" },
      { value: "elbow_flexion_load", label: "Ellenbogenbeugen unter Last (z.B. Tragen)" }
    ]
  },

  {
    id: "ELB-Q04",
    text: "Haben Sie Kribbeln, Taubheit oder Schwäche in der Hand oder den Fingern?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "none", label: "Nein" },
      { value: "ring_little_finger", label: "Ja — Ring- und Kleinfinger (4./5. Finger)" },
      { value: "thumb_index_middle", label: "Ja — Daumen, Zeige- und Mittelfinger (1.-3. Finger)" },
      { value: "whole_hand", label: "Ja — gesamte Hand" }
    ]
  },

  {
    id: "ELB-Q05",
    text: "Haben Sie nächtliche Beschwerden in der Hand?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Typisch für Karpaltunnelsyndrom: Aufwachen durch Kribbeln, Schütteln der Hand lindert"
  },

  {
    id: "ELB-Q06",
    text: "Hatten Sie frühere Sportverletzungen am Ellenbogen?",
    type: "yes_no",
    variants: ["deep"]
  },

  {
    id: "ELB-Q07",
    text: "Beruf / Haupttätigkeit?",
    type: "single_choice",
    variants: ["standard", "deep"],
    options: [
      { value: "office_computer", label: "Büroarbeit / Computer" },
      { value: "manual_labor", label: "Körperliche Arbeit (Handwerker, Pflege, Mechaniker)" },
      { value: "sports_racket", label: "Racket-Sport (Tennis, Badminton, Squash)" },
      { value: "golf", label: "Golf" },
      { value: "other", label: "Sonstiges" }
    ]
  }
];

const ELLENBOGEN_DIAGNOSES = [

  {
    id: "ELB-001",
    name: "Laterale Epikondylalgie (Tennisellenbogen)",
    icd10: "M77.1",
    probability_score: 0,
    description: "Überlastungssyndrom der Extensorensehnenansätze am Epicondylus humeri lateralis. Häufigste Ellenbogenerkrankung (~3% Bevölkerung, Peak 40-50 Jahre). Klassisch durch repetitive Greif-/Extensionsbewegungen.",
    clinical_tests: [
      {
        name: "Cozen-Test",
        description: "Widerstandsgestützte Handgelenksextension bei Ellenbogenstreckung",
        sensitivity: 0.72, specificity: 0.68,
        lr_positive: 2.25, lr_negative: 0.41,
        source: "Bisset et al., Br J Sports Med 2006"
      },
      {
        name: "Mill-Test",
        description: "Passiver Stress: Handgelenksflexion + Pronation + Ellenbogenstreckung",
        sensitivity: 0.53, specificity: 0.76,
        lr_positive: 2.21, lr_negative: 0.62
      },
      {
        name: "Palpation Epicondylus lateralis",
        description: "Punktueller Druckschmerz am lateralen Epikondylus",
        sensitivity: 0.87, specificity: 0.69,
        lr_positive: 2.8,
        note: "Hochsensitiv — fast immer positiv bei Epikondylalgie"
      }
    ],
    treatment_approach: [
      "Exzentrische ERCB-Übungen (Evidenz Klasse A: Svernlöv & Adolfsson 2001)",
      "Physiotherapie: Gelenkmobilisation HWS + Ellenbogen (Bisset 2006: kurzzeitig besser als Kortison)",
      "Stoßwellentherapie (Evidenz: Grade B, Rompe et al. 2007)",
      "Epicondylitis-Bandage (kurzfristige Symptomkontrolle)",
      "Kortison-Injektion: kurzfristig wirksam, schlechtere Langzeitergebnis (Coombes 2010)"
    ],
    factors: { relief: -2, range: -1, rhythm: 0, regulation: 0, re_energize: -1, relations: 0, rise: 0 }
  },

  {
    id: "ELB-002",
    name: "Mediale Epikondylalgie (Golferellenbogen)",
    icd10: "M77.0",
    probability_score: 0,
    description: "Überlastung Flexoren-/Pronatorenansatz am Epicondylus humeri medialis. Häufiger als oft angenommen — auch bei Kletterer, Handwerkern, Wurfsportlern.",
    clinical_tests: [
      {
        name: "Resisted wrist flexion (Golfer-Test)",
        description: "Widerstand gegen Handgelenksflexion + Pronation → Schmerz medial",
        sensitivity: 0.68, specificity: 0.71
      },
      {
        name: "Palpation medialer Epikondylus",
        description: "Punktueller Druckschmerz",
        sensitivity: 0.85
      }
    ],
    important_note: "N. ulnaris immer mitprüfen! 25% der medialen Epikondylalgien haben begleitende ulnare Neuropathie",
    treatment_approach: [
      "Exzentrische Flexoren-Übungen (analog zu lateraler Epikondylalgie)",
      "Manuelle Therapie (Gelenk + Weichteile)",
      "Sportkarenz / Belastungsmodifikation"
    ],
    factors: { relief: -2, range: -1, rhythm: 0, regulation: 0, re_energize: -1, relations: 0, rise: 0 }
  },

  {
    id: "ELB-003",
    name: "Karpaltunnelsyndrom",
    icd10: "G54.0",
    probability_score: 0,
    description: "N. medianus-Kompression im Karpalkanal. Klinisch: Kribbeln/Taubheit Daumen-Ring 3 (1.-3. Finger), nächtliche Symptome, Schütteln lindert. Häufiger bei Frauen, Schwangere, Rheumatiker, Diabetiker.",
    clinical_tests: [
      {
        name: "Phalen-Test",
        description: "90° Handgelenksflexion für 60 Sek. → Kribbeln 1.-3. Finger",
        sensitivity: 0.68, specificity: 0.73,
        lr_positive: 2.52, lr_negative: 0.44,
        source: "Gelfman et al., 2009"
      },
      {
        name: "Tinel-Zeichen",
        description: "Beklopfen Karpalkanal-Region → Kribbeln 1.-3. Finger",
        sensitivity: 0.50, specificity: 0.77
      },
      {
        name: "Karpalkompressionstest (Durkan-Test)",
        description: "Dauerdruck auf Karpaldach für 30 Sek.",
        sensitivity: 0.87, specificity: 0.83,
        lr_positive: 5.1,
        source: "Durkan 1991 — bester Einzeltest"
      }
    ],
    next_steps: "Elektrophysiologie (NLG) zur Sicherung. Handgelenksschiene nachts. OP-Indikation bei motorischem Defizit.",
    note: "In Differentialdiagnose zu lateraler Epikondylalgie / zervikaler Radikulopathie abgrenzen",
    factors: { relief: -2, range: -1, rhythm: -1, regulation: -1, re_energize: -2, relations: -1, rise: -1 }
  },

  {
    id: "ELB-004",
    name: "Kubitaltunnelsyndrom (N. ulnaris)",
    icd10: "G56.20",
    probability_score: 0,
    description: "Häufigste ulnare Neuropathie. N. ulnaris-Kompression am medialen Epicondylus / Kubitaltunnel. Symptome: Kribbeln 4./5. Finger, mediale Ellenbogenschmerzen, Kraftminderung kleiner Finger-Abduktion.",
    clinical_tests: [
      {
        name: "Elbow Flexion Test",
        description: "Maximale Ellenbogenflexion + HWS-Extension für 3 Min. → Kribbeln 4./5. Finger",
        sensitivity: 0.75, specificity: 0.78
      },
      {
        name: "Scratch Collapse Test",
        description: "Provokation durch Kratzen über N. ulnaris am Kubitaltunnel",
        sensitivity: 0.69, specificity: 0.99,
        lr_positive: "sehr hoch",
        source: "Cheng et al., J Hand Surg 2008"
      },
      {
        name: "Tinel am Kubitaltunnel",
        description: "Beklopfen hinter medialem Epicondylus",
        sensitivity: 0.70, specificity: 0.65
      }
    ],
    next_steps: "NLG/EMG zur Schweregrad-Einteilung. Ellenbogenpolster. Nachtschiene in Streckposition.",
    factors: { relief: -2, range: -1, rhythm: -1, regulation: -1, re_energize: -2, relations: -1, rise: -1 }
  },

  {
    id: "ELB-005",
    name: "Ellenbogengelenksarthrose",
    icd10: "M19.02",
    probability_score: 0,
    description: "Degenerative Gelenksveränderung. Häufig nach Trauma (posttraumatische Arthrose) oder bei Hochleistungssportlern (Werfer, Judoka). Symptome: Endgradig Schmerz, Kapselgefühl, Blockierungen (lose Körper).",
    clinical_tests: [
      {
        name: "Endgradig Bewegungsschmerz",
        description: "Schmerz bei endgradiger Streckung und/oder Beugung",
        sensitivity: 0.85
      }
    ],
    red_flag: "Gelenkkörper → Blockierungen möglich → Röntgen",
    factors: { relief: -2, range: -3, rhythm: -1, regulation: 0, re_energize: -1, relations: 0, rise: -1 }
  }
];

const ELLENBOGEN_RULES = [
  {
    name: "Laterale Epikondylalgie — klassisch",
    conditions: {
      all: [
        { fact: "elb_location", operator: "equal", value: "lateral" },
        { fact: "elb_mechanism", operator: "in", value: ["gradual_overuse", "after_sports"] },
        { fact: "elb_aggravating", operator: "contains", value: "grip_strength" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "ELB-001", probability_score: 78 }
  },

  {
    name: "Laterale Epikondylalgie — Büro",
    conditions: {
      all: [
        { fact: "elb_location", operator: "equal", value: "lateral" },
        { fact: "elb_work", operator: "equal", value: "office_computer" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "ELB-001", probability_score: 65 }
  },

  {
    name: "Mediale Epikondylalgie",
    conditions: {
      all: [
        { fact: "elb_location", operator: "equal", value: "medial" },
        { fact: "elb_mechanism", operator: "in", value: ["gradual_overuse", "after_sports"] },
        { fact: "elb_aggravating", operator: "contains", value: "lifting_wrist_flex" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "ELB-002", probability_score: 74 }
  },

  {
    name: "KTS — klassisch nächtlich + 1.-3. Finger",
    conditions: {
      all: [
        { fact: "elb_numbness", operator: "equal", value: "thumb_index_middle" },
        { fact: "elb_nocturnal", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "ELB-003", probability_score: 82 }
  },

  {
    name: "Kubitaltunnel — 4./5. Finger",
    conditions: {
      all: [
        { fact: "elb_numbness", operator: "equal", value: "ring_little_finger" },
        { fact: "elb_location", operator: "in", value: ["medial", "diffuse"] }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "ELB-004", probability_score: 76 }
  }
];

const ELLENBOGEN_OUTPUT_CONFIG = {
  max_differentials_short: 2,
  max_differentials_standard: 3,
  max_differentials_deep: 5,
  key_differentiator: "Lokalisation (lateral = Tennisellenbogen, medial = Golferellenbogen) + Neurologie (Finger-Zuordnung)"
};

export {
  ELLENBOGEN_QUESTIONS,
  ELLENBOGEN_DIAGNOSES,
  ELLENBOGEN_RULES,
  ELLENBOGEN_OUTPUT_CONFIG
};
