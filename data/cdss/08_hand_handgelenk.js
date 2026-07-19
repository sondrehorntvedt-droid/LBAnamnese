/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 08: HAND & HANDGELENK
 *
 * Diagnosen:
 *  HAN-001  De Quervain-Tendosynovitis M65.4
 *  HAN-002  TFCC-Läsion (Triangular Fibrocartilage Complex) S63.6
 *  HAN-003  Handgelenksarthrose / SLAC-Wrist M19.03
 *  HAN-004  Ganglion M67.4
 *  HAN-005  Schnappender Finger / Digitus saltans M65.3
 *  HAN-006  Dupuytren-Kontraktur M72.0
 *
 * Quellen:
 *  - Dawson J et al.: De Quervain's tenosynovitis. JBJS 2011.
 *  - Palmer AK: Triangular fibrocartilage complex lesions.
 *    J Hand Surg Am 1989.
 *  - Lindau T: The TFCC in wrist trauma. JHS 1997.
 */

const HAND_QUESTIONS = [

  {
    id: "HAN-Q01",
    text: "Wo genau am Handgelenk oder der Hand sitzt Ihr Hauptschmerz?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "radial_styloid", label: "Radiales (daumenseitiges) Handgelenk / Daumenwurzel" },
      { value: "ulnar", label: "Ulnares (kleinfingerseitiges) Handgelenk" },
      { value: "dorsal_wrist", label: "Handgelenkrücken (Mitte/dorsal)" },
      { value: "palmar_wrist", label: "Handgelenkbeugeseite / Innenhand" },
      { value: "fingers", label: "Finger / Fingergelenke" },
      { value: "diffuse_hand", label: "Gesamte Hand / diffus" }
    ]
  },

  {
    id: "HAN-Q02",
    text: "Haben Sie Schmerzen, wenn Sie Ihren Daumen einschlagen und das Handgelenk zur Kleinfingerseite beugen (Finklestein-Bewegung)?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    hint: "Klassischer Finkelstein-Test für De Quervain",
    condition: { fact: "han_location", operator: "equal", value: "radial_styloid" }
  },

  {
    id: "HAN-Q03",
    text: "Haben Sie Schmerzen an der Kleinfinger-/Ulnarseite des Handgelenks, besonders beim Drehen des Unterarms (Türklinke, Schrauben)?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    condition: { fact: "han_location", operator: "equal", value: "ulnar" }
  },

  {
    id: "HAN-Q04",
    text: "Kam der Schmerz nach einem Trauma / Sturz auf die Hand?",
    type: "yes_no",
    variants: ["short", "standard", "deep"]
  },

  {
    id: "HAN-Q05",
    text: "Sehen oder fühlen Sie eine sichtbare Wulst / Geschwulst am Handgelenk oder der Hand?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Ganglion: pralle, glasige Zyste, häufig am Handgelenkrücken oder Beugeseite"
  },

  {
    id: "HAN-Q06",
    text: "Bleibt ein Finger manchmal in Beugestellung stecken oder 'schnappt' er beim Strecken?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Schnappender Finger / Trigger Finger"
  },

  {
    id: "HAN-Q07",
    text: "Bemerken Sie Stränge in der Handinnenfläche, die die Finger in Beugestellung ziehen?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Dupuytren-Kontraktur: typisch 4./5. Finger"
  },

  {
    id: "HAN-Q08",
    text: "Wann treten die Schmerzen am stärksten auf?",
    type: "multiple_choice",
    variants: ["standard", "deep"],
    options: [
      { value: "grip", label: "Greifen und Halten (Tasse, Flasche)" },
      { value: "pinch", label: "Zwicken / Pinzettengriff (Daumen-Zeigefinger)" },
      { value: "rotation", label: "Unterarmdrehung (Türöffnen, Schrauben)" },
      { value: "rest", label: "Auch in Ruhe / Nachts" },
      { value: "weight_bearing", label: "Beim Abstützen / Gewichttragen" }
    ]
  }
];

const HAND_DIAGNOSES = [

  {
    id: "HAN-001",
    name: "De Quervain-Tendosynovitis",
    icd10: "M65.4",
    probability_score: 0,
    description: "Tendosynovitis der Sehnen des M. abductor pollicis longus und M. extensor pollicis brevis im 1. Strecksehnenfach. Häufig bei jungen Müttern (Säugling tragen), Computerarbeit, Handwerkern. Prävalenz Frauen:Männer = 8:1.",
    clinical_tests: [
      {
        name: "Finkelstein-Test",
        description: "Daumen in Faust einschlagen, Handgelenk ulnardevieren → radialer Schmerz",
        sensitivity: 0.89, specificity: 0.75,
        lr_positive: 3.56, lr_negative: 0.15,
        source: "Dawson et al., JBJS 2011"
      },
      {
        name: "Eichhoff-Test (Variante)",
        description: "Daumen einschlagen + Ulnardeviation — weniger spezifisch als Finkelstein",
        sensitivity: 0.81, specificity: 0.50
      }
    ],
    icd10_note: "Wichtig: Ausschluss Rhizarthrose (Daumensattelgelenksarthrose, CMC-I-Arthrose) — ähnliche Lokalisation, aber andere Pathologie",
    treatment_approach: [
      "Unterarmschiene mit Daumeneinschluss (6-8 Wochen)",
      "Kortison-Injektion in 1. Strecksehnenfach (Evidenz gut: Peters-Veluthamaningal 2009)",
      "Exzentrische Übungen nach Akutphase",
      "Operatives Fachschlitzen bei Therapieresistenz"
    ],
    factors: { relief: -2, range: -1, rhythm: 0, regulation: 0, re_energize: -1, relations: 0, rise: 0 }
  },

  {
    id: "HAN-002",
    name: "TFCC-Läsion",
    icd10: "S63.6",
    probability_score: 0,
    description: "Schädigung des Triangulären Fibrokartilaginären Komplexes am ulnaren Handgelenk. Wichtigste Stabilisierungsstruktur ulnar. Trauma (Sturz, Rotation) oder degenerativ. Ulnar-seitiger Handgelenkschmerz + Rotationsschmerz.",
    clinical_tests: [
      {
        name: "TFCC Compression Test",
        description: "Axiale Kompression bei Ulnardeviation + Rotation → ulnarer Schmerz",
        sensitivity: 0.73, specificity: 0.91,
        lr_positive: 8.1,
        source: "Lindau et al., JHS 1997"
      },
      {
        name: "Ulnokarpal Stress Test",
        description: "Handgelenk ulnardeviert + Pro-/Supination unter Axialkraft",
        sensitivity: 0.66, specificity: 0.70
      },
      {
        name: "Ballottement Test (Reagan Test)",
        description: "Verschiebung von Os lunatum und Os triquetrum gegeneinander → ulnarer Schmerz",
        sensitivity: 0.64, specificity: 0.44
      }
    ],
    next_steps: "MRT mit Kontrastmittel oder Arthroskopie für genaue Klassifikation (Palmer-Klassifikation Typ 1A-1E / 2A-2F)",
    treatment_approach: [
      "Ruhigstellung 4-6 Wochen (vollständiger Riss: Gips/Schiene)",
      "Arthroskopische Debridement / Naht",
      "Physiotherapie: schrittweiser Rotationsaufbau"
    ],
    factors: { relief: -2, range: -2, rhythm: -1, regulation: 0, re_energize: -1, relations: 0, rise: -1 }
  },

  {
    id: "HAN-003",
    name: "Handgelenksarthrose / Rhizarthrose",
    icd10: "M19.03",
    probability_score: 0,
    description: "Rhizarthrose (CMC-I-Arthrose) = häufigste Handarthrose. Schmerz am Daumensattelgelenk, Kraft- und Pinzettengriff-Schwäche. Frauen postmenopausal besonders betroffen. Karpale Arthrose (SLAC-Wrist) nach TFCC-Läsion oder Skaphoidfraktur.",
    clinical_tests: [
      {
        name: "Grind Test / CMC-I-Test",
        description: "Axialer Druck + Rotation Daumen → Schmerz am Sattelgelenk",
        sensitivity: 0.53, specificity: 0.80,
        lr_positive: 2.65
      },
      {
        name: "Schlüsselgriff-Schwäche",
        description: "Kraftverlust Pinzettengriff Daumen-Zeigefinger",
        sensitivity: 0.72
      }
    ],
    red_flag_note: "Ausschluss De Quervain! Oft kombiniert vorhanden.",
    factors: { relief: -2, range: -2, rhythm: 0, regulation: 0, re_energize: -1, relations: -1, rise: -1 }
  },

  {
    id: "HAN-004",
    name: "Ganglion",
    icd10: "M67.4",
    probability_score: 0,
    description: "Häufigste Weichteiltumor der Hand (50-70% aller Handtumoren). Synoviale Zyste, prall-elastisch, gelegentlich spontane Remission. Häufigste Lokalisation: dorsal Handgelenk (60-70%), palmar (18-20%), Finger-Beuge-/Strecksehne.",
    clinical_tests: [
      {
        name: "Palpation",
        description: "Prall-elastische, glatte, nicht verschiebliche Raumforderung",
        sensitivity: 0.95
      },
      {
        name: "Diaphanoskopie",
        description: "Licht durchscheinend (Flüssigkeit)",
        sensitivity: 0.80
      }
    ],
    note: "Sonographie zur Sicherung. MRT bei atypischer Lokalisation oder Größe.",
    treatment_approach: [
      "Abwartendes Verhalten (50% spontane Remission)",
      "Aspiration (Rezidivrate hoch: ~50%)",
      "Arthroskopische oder offene Exzision"
    ],
    factors: { relief: -1, range: -1, rhythm: 0, regulation: 0, re_energize: 0, relations: 0, rise: 0 }
  },

  {
    id: "HAN-005",
    name: "Schnappender Finger (Digitus saltans)",
    icd10: "M65.3",
    probability_score: 0,
    description: "Tendovaginitis stenosans. Einengung der Sehnenscheide am A1-Ringband → schnappende/blockierende Fingerbewegung. Häufig bei Diabetiker, Rheumatiker, Frauen 50-60 Jahre.",
    clinical_tests: [
      {
        name: "Klinisches Bild",
        description: "Schnappen beim Strecken, Blockierung, palmar Druckschmerz über A1-Ringband (Grundgelenk-Beuge-Falte)",
        sensitivity: 0.95,
        note: "Diagnose klinisch eindeutig bei typischem Schnappen"
      }
    ],
    treatment_approach: [
      "Kortison-Injektion Sehnenscheide (Evidenz A: Baumgarten 2007, 90% Erfolg nach 1-2 Injektionen)",
      "Spaltung A1-Ringband (operativ, perkutan oder offen)"
    ],
    factors: { relief: -2, range: -1, rhythm: 0, regulation: 0, re_energize: -1, relations: 0, rise: 0 }
  },

  {
    id: "HAN-006",
    name: "Dupuytren-Kontraktur",
    icd10: "M72.0",
    probability_score: 0,
    description: "Fibroproliferative Erkrankung der palmaren Faszie. Tastbare Stränge und Knoten → progressive Beugekontraktur 4./5. Finger. Genetische Prädisposition (Nordeuropäer). Assoziation: Diabetes, Epilepsie, Alkohol, Rauchen.",
    clinical_tests: [
      {
        name: "Tabletop Test (Hueston-Test)",
        description: "Hand flach auf Tisch legen — wenn nicht möglich = signifikante Kontraktur",
        sensitivity: 0.97
      }
    ],
    next_steps: "Ergo-/Physiotherapie (begrenzt wirksam), Kollagenase-Injektion (Xiapex), Nadelkordsotomie, Operation bei >30° Kontraktur",
    factors: { relief: -1, range: -2, rhythm: 0, regulation: 0, re_energize: -1, relations: -1, rise: -1 }
  }
];

const HAND_RULES = [
  {
    name: "De Quervain — klassisch",
    conditions: {
      all: [
        { fact: "han_location", operator: "equal", value: "radial_styloid" },
        { fact: "han_finkelstein_positive", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "HAN-001", probability_score: 85 }
  },
  {
    name: "TFCC — ulnar + Rotation + Trauma",
    conditions: {
      all: [
        { fact: "han_location", operator: "equal", value: "ulnar" },
        { fact: "han_trauma", operator: "equal", value: true },
        { fact: "han_aggravating", operator: "contains", value: "rotation" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "HAN-002", probability_score: 78 }
  },
  {
    name: "TFCC — ulnar + Rotation, kein Trauma",
    conditions: {
      all: [
        { fact: "han_location", operator: "equal", value: "ulnar" },
        { fact: "han_aggravating", operator: "contains", value: "rotation" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "HAN-002", probability_score: 58 }
  },
  {
    name: "Ganglion",
    conditions: {
      all: [
        { fact: "han_visible_mass", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "HAN-004", probability_score: 88 }
  },
  {
    name: "Schnappender Finger",
    conditions: {
      all: [
        { fact: "han_snapping_finger", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "HAN-005", probability_score: 92 }
  },
  {
    name: "Dupuytren",
    conditions: {
      all: [
        { fact: "han_dupuytren_cords", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "HAN-006", probability_score: 95 }
  }
];

const HAND_OUTPUT_CONFIG = {
  max_differentials_short: 2,
  max_differentials_standard: 3,
  max_differentials_deep: 5,
  key_differentiator: "Lokalisation (radial vs. ulnar) + Trauma-Anamnese + Neurologie"
};

export {
  HAND_QUESTIONS,
  HAND_DIAGNOSES,
  HAND_RULES,
  HAND_OUTPUT_CONFIG
};
