/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 09: SPRUNGGELENK & FUSS
 *
 * Diagnosen:
 *  SPR-001  OSG-Instabilität (laterales Bandapparat) M24.27
 *  SPR-002  Achillodynie / Achillestendinopathie M76.6
 *  SPR-003  Plantarfasziitis M72.2
 *  SPR-004  Peroneus-Sehnenpathologie M76.7
 *  SPR-005  Hallux valgus M20.1
 *  SPR-006  Morton-Neurom G57.6
 *  SPR-007  Stressfraktur Mittelfuß (Marschfraktur) M84.37
 *
 * Quellen:
 *  - van Dijk CN et al.: Diagnosis of lateral instability of the ankle.
 *    J Bone Joint Surg Am 1996.
 *  - Alfredson H: The chronic painful Achilles and patellar tendon.
 *    Br J Sports Med 2005.
 *  - Buchbinder R: Plantar fasciitis. NEJM 2004.
 *  - Thomas MJ et al.: The clinical diagnosis of Morton's neuroma.
 *    Foot Ankle Surg 2013.
 */

const SPRUNGGELENK_QUESTIONS = [

  {
    id: "SPR-Q01",
    text: "Wo genau sitzen Ihre Fußbeschwerden?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "lateral_ankle", label: "Außenknöchel / äußeres Sprunggelenk" },
      { value: "achilles", label: "Achillessehne / Ferse hinten" },
      { value: "heel_plantar", label: "Ferse unten / Fußsohle (Fersenschmerz beim Auftreten)" },
      { value: "midfoot", label: "Mittelfuß (Fußrücken oder Fußgewölbe)" },
      { value: "forefoot", label: "Vorfuß / Ballen / Zehen" },
      { value: "arch", label: "Fußgewölbe (innen/Längsgewölbe)" }
    ]
  },

  {
    id: "SPR-Q02",
    text: "Hatten Sie ein Umknicktrauma (Supination) des Sprunggelenks?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "acute_recent", label: "Ja — akut (< 4 Wochen)" },
      { value: "past", label: "Ja — früher, mehrfach" },
      { value: "no", label: "Nein" }
    ]
  },

  {
    id: "SPR-Q03",
    text: "Ist der Schmerz morgens beim ersten Auftreten besonders stark und wird nach einigen Minuten Gehen besser?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    hint: "Klassisches Zeichen der Plantarfasziitis: 'Anlaufschmerz'"
  },

  {
    id: "SPR-Q04",
    text: "Wo sitzt der Schmerz in der Achillessehne?",
    type: "single_choice",
    variants: ["standard", "deep"],
    condition: { fact: "spr_location", operator: "equal", value: "achilles" },
    options: [
      { value: "midportion", label: "Mitte der Sehne (2-6 cm über Fersenansatz)" },
      { value: "insertional", label: "Am Fersenansatz direkt (Enthesopathie)" }
    ]
  },

  {
    id: "SPR-Q05",
    text: "Treiben Sie Lauf- oder Sprungsport? Wenn ja — wann entstanden die Beschwerden?",
    type: "single_choice",
    variants: ["standard", "deep"],
    options: [
      { value: "running_overload", label: "Ja — nach Trainingsintensivierung / Kilometersteigerung" },
      { value: "running_normal", label: "Ja — aber ohne erkennbaren Auslöser" },
      { value: "no_sport", label: "Kein Lauf-/Sprungsport" },
      { value: "new_shoes", label: "Neue Schuhe / Untergrundwechsel" }
    ]
  },

  {
    id: "SPR-Q06",
    text: "Haben Sie Kribbeln oder Taubheit zwischen den Zehen oder im Vorfuß?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Typisch: Morton-Neurom zwischen 3./4. Zehe"
  },

  {
    id: "SPR-Q07",
    text: "Haben Sie Schmerzen zwischen den Mittelfußknochen beim Zusammendrücken des Vorfußes?",
    type: "yes_no",
    variants: ["standard", "deep"],
    condition: { fact: "spr_forefoot_numbness", operator: "equal", value: true }
  },

  {
    id: "SPR-Q08",
    text: "Haben Sie einen nach innen gedrehten Großzeh (Hallux valgus / Ballenzeh)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    condition: { fact: "spr_location", operator: "equal", value: "forefoot" }
  },

  {
    id: "SPR-Q09",
    text: "Kam der Schmerz plötzlich nach erhöhter Belastung (langer Wanderung, Marsch, ungewohntem Sport)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Stressfraktur Verdacht bei ungewohnter Belastungszunahme"
  }
];

const SPRUNGGELENK_DIAGNOSES = [

  {
    id: "SPR-001",
    name: "OSG-Instabilität / Laterales Bandapparat",
    icd10: "M24.27",
    probability_score: 0,
    description: "Chronische laterale Bandinstabilität nach Supinationstrauma. LFTA (Lig. fibulotalare anterius) häufigste Verletzung. Bei Rezidivumknickern oft strukturelle Instabilität. Ottawa Ankle Rules für Frakturausschluss.",
    clinical_tests: [
      {
        name: "Anterior Drawer Test (OSG)",
        description: "Talus nach vorne gegenüber Tibia → vermehrte Translation + weicher Anschlag",
        sensitivity: 0.73, specificity: 0.97,
        lr_positive: 24.3, lr_negative: 0.28,
        source: "van Dijk et al., JBJS 1996"
      },
      {
        name: "Talar Tilt Test",
        description: "Talus invertieren / kippen → LFCA-Integrität",
        sensitivity: 0.50, specificity: 0.88,
        note: "Besser bei chronischer als akuter Instabilität"
      },
      {
        name: "Ottawa Ankle Rules",
        description: "Schmerzpalpation Malleolusspitzen + Basis MT V + Navikulare → Frakturausschluss",
        sensitivity: 0.97, specificity: 0.32,
        lr_negative: 0.09,
        note: "Hochsensitiv — NEGATIV schließt Fraktur aus (NPV 97%)"
      }
    ],
    red_flag: "Ottawa Ankle Rules positiv → Röntgen obligat",
    treatment_approach: [
      "Akut: RICE, funktionelle Orthese (keine Gipsruhigstellung bei Grad I-II)",
      "Chronisch: Propriozeptionstraining (Evidenz A: Hupperets 2009)",
      "Taping / Bandage für Sport",
      "OP: Broström-Modifikation bei struktureller Instabilität"
    ],
    factors: { relief: -2, range: -2, rhythm: -2, regulation: 0, re_energize: -2, relations: 0, rise: -1 }
  },

  {
    id: "SPR-002",
    name: "Achillestendinopathie",
    icd10: "M76.6",
    probability_score: 0,
    description: "Belastungsassoziierte Degeneration der Achillessehne. NICHT entzündlich (Tendinopathie, nicht Tendinitis). Midportion (2-6 cm) vs. insertional (Fersenansatz — unterschiedliche Pathomechanik und Therapie!).",
    clinical_tests: [
      {
        name: "Royal London Hospital Test",
        description: "Dorsalflexion → Druckschmerz verschwindet → typisch Midportion-Tendinopathie",
        sensitivity: 0.78, specificity: 0.89
      },
      {
        name: "Arc Sign",
        description: "Druckschmerzpunkt bewegt sich bei Pro-/Dorsalflexion mit der Sehne mit",
        sensitivity: 0.73, specificity: 0.91,
        lr_positive: 8.1
      },
      {
        name: "VISA-A Score",
        description: "Validierter Fragebogen Achillessehnen-Funktion (0-100 Punkte)",
        note: "Kein Test — Outcome-Messung"
      }
    ],
    treatment_approach: [
      "Exzentrische Übungen nach Alfredson (Standardtherapie, Evidenz A: Alfredson 2005)",
      "Heavy Slow Resistance (HSR) — gleichwertige Alternative zu exzentrischen Übungen",
      "Stoßwellentherapie (Midportion: Evidenz B; Insertional: Evidenz C)",
      "PRP-Injektionen (gemischte Evidenz)",
      "KEIN Kortison in/um Achillessehne (Rupturrisiko!)"
    ],
    key_differentiator: "Midportion vs. Insertional: unterschiedliche Therapie! Insertional → KEINE ausgeprägten Exzentriks (verschlechtert Insertions-Tendinopathie)",
    factors: { relief: -2, range: -1, rhythm: -2, regulation: 0, re_energize: -2, relations: 0, rise: -1 }
  },

  {
    id: "SPR-003",
    name: "Plantarfasziitis",
    icd10: "M72.2",
    probability_score: 0,
    description: "Häufigste Ursache Fersenschmerz (Prävalenz 10% Bevölkerung). Überlastungsreaktion des Plantarfaszienansatzes am Kalkaneus. Klassischer Anlaufschmerz morgens. Sporn ≠ Ursache (nur 50% der PF haben Sporn, 15% beschwerdefreie Personen auch).",
    clinical_tests: [
      {
        name: "Fersenbeindruck Plantarseite medial",
        description: "Palpation anteriomedialer Fersenbein-Plantarseite",
        sensitivity: 0.84, specificity: 0.89,
        lr_positive: 7.6,
        source: "Buchbinder NEJM 2004"
      },
      {
        name: "Windlass-Test",
        description: "Passive Großzehenextension → Spannung Plantarfaszie → Fersenschmerz",
        sensitivity: 0.32, specificity: 0.98,
        lr_positive: 16.0,
        note: "Niedrige Sensitivität — aber sehr spezifisch"
      }
    ],
    treatment_approach: [
      "Nachtschiene / Plantarfaszien-Schiene (Evidenz A)",
      "Stretching Plantarfaszie + Wadenmuskulatur (3x täglich, Evidenz B)",
      "Stoßwellentherapie: beste Evidenz bei chronischer PF > 6 Monate (Rompe 2010, Evidenz A)",
      "Einlagen / Fersenkissen (kurzfristige Entlastung)",
      "Kortison-Injektion: kurzfristig wirksam (3 Monate), kein Langzeiteffekt, Rupturrisiko!"
    ],
    factors: { relief: -2, range: -1, rhythm: -2, regulation: 0, re_energize: -2, relations: 0, rise: -1 }
  },

  {
    id: "SPR-004",
    name: "Peroneus-Sehnenpathologie",
    icd10: "M76.7",
    probability_score: 0,
    description: "Tendopathie, Subluxation oder Riss der Peronäussehnen (Peroneus longus / brevis) hinter dem lateralen Malleolus. Häufig nach Supinationstrauma übersehen. Schmerz lateral + posterior Malleolus.",
    clinical_tests: [
      {
        name: "Widerstandseversion",
        description: "Aktive Eversion gegen Widerstand → Schmerz lateral-posterior Malleolus",
        sensitivity: 0.79
      },
      {
        name: "Peroneus-Subluxationstest",
        description: "Palpation + Bewegung: Sehne springt aus Sulkus heraus",
        sensitivity: 0.67, specificity: 0.93
      }
    ],
    next_steps: "Sonographie für Sehnenluxation/Riss. MRT bei Unklarheit.",
    factors: { relief: -2, range: -1, rhythm: -1, regulation: 0, re_energize: -1, relations: 0, rise: -1 }
  },

  {
    id: "SPR-005",
    name: "Hallux valgus",
    icd10: "M20.1",
    probability_score: 0,
    description: "Lateraldeviation der Großzehe mit medialer Prominenz des 1. Metatarsalköpfchens. Häufig bilateral, genetische Prädisposition, enge Schuhe als Trigger. Assoziation: Spreizfuß, Vorfußballenbelastung.",
    clinical_tests: [
      {
        name: "Klinische Inspektion + Röntgen",
        description: "Hallux-valgus-Winkel (normal < 15°) + Intermetatarsalwinkel (normal < 9°)",
        note: "Diagnose klinisch, Schweregrad röntgenologisch"
      }
    ],
    treatment_approach: [
      "Konservativ: Hallux-valgus-Schiene (nachts), geeignetes Schuhwerk, Einlagen",
      "Physiotherapie: Intrinsische Muskulatur kräftigen",
      "Operativ: >30° oder therapierefraktär — verschiedene Osteotomien (Chevron, Scarf)"
    ],
    factors: { relief: -1, range: -1, rhythm: -1, regulation: 0, re_energize: -1, relations: -1, rise: -1 }
  },

  {
    id: "SPR-006",
    name: "Morton-Neurom",
    icd10: "G57.6",
    probability_score: 0,
    description: "Perineurales Fibrom (kein echtes Neurom) des N. plantaris communis, meist 3./4. Intermetatarsalraum. Typisch: Brennen, Kribbeln zwischen Zehen, verschlechtert durch enges Schuhwerk, gebessert durch Ausziehen der Schuhe.",
    clinical_tests: [
      {
        name: "Mulder-Zeichen",
        description: "Laterale Kompression des Vorfußes + gleichzeitige Palpation Intermetatarsalraum → klickendes Schnappen + Schmerz",
        sensitivity: 0.62, specificity: 0.95,
        lr_positive: 12.4,
        source: "Thomas et al., Foot Ankle Surg 2013"
      },
      {
        name: "Vorfußkompressionstest",
        description: "Seitliche Kompression aller Metatarsalen → Schmerz Intermetatarsalraum",
        sensitivity: 0.73, specificity: 0.84
      }
    ],
    next_steps: "Sonographie (erste Wahl, sensitiv für > 6 mm). MRT bei Unklarheit.",
    treatment_approach: [
      "Einlagen mit Metatarsalpads (Druckentlastung)",
      "Weites, flaches Schuhwerk",
      "Kortison-Injektion Intermetatarsalraum (Evidenz B, 50-60% kurzfristig gut)",
      "Alkohol-Sklerosierung (Evidenz B, 89% Erfolg in Kontrollen)",
      "Operative Neurolyse / Neurektomie"
    ],
    factors: { relief: -2, range: -1, rhythm: -1, regulation: 0, re_energize: -1, relations: -1, rise: -1 }
  },

  {
    id: "SPR-007",
    name: "Stressfraktur Metatarsalia (Marschfraktur)",
    icd10: "M84.37",
    probability_score: 0,
    description: "Ermüdungsfraktur durch repetitive Belastung ohne adäquates Trauma. Metatarsale II + III häufigst (Läufer, Soldaten). Metatarsale V (Jones-Fraktur) — besondere Heilungsproblem!",
    clinical_tests: [
      {
        name: "Hoptest / Single-Leg-Hop",
        description: "Einbeinig auf betroffenem Bein hüpfen → Schmerz (nicht bei akutem Schmerz testen!)",
        sensitivity: 0.62
      },
      {
        name: "Stimmgabeltest",
        description: "Vibrierende Stimmgabel über Metatarsale → stärkerer Schmerz als Palpation allein",
        sensitivity: 0.75
      }
    ],
    red_flag: "⚠️ Röntgen initial oft negativ! Kontrolle nach 2-3 Wochen oder MRT bei klinischem Verdacht.",
    treatment_approach: [
      "Entlastungsorthese / Gips 6-8 Wochen",
      "Jones-Fraktur MT V: erhöhtes Pseudarthrose-Risiko → oft operative Versorgung",
      "Ursachenanalyse: Trainingsbelastung, Schuhwerk, Biomechanik, Knochendichte!"
    ],
    risk_profile_note: "Frakturrisikoprofil (RP-003) prüfen — FRAX-Score bei V.a. Osteoporose",
    factors: { relief: -3, range: -3, rhythm: -2, regulation: 0, re_energize: -2, relations: -1, rise: -2 }
  }
];

const SPRUNGGELENK_RULES = [
  {
    name: "OSG-Instabilität — akutes Trauma",
    conditions: {
      all: [
        { fact: "spr_location", operator: "equal", value: "lateral_ankle" },
        { fact: "spr_trauma_type", operator: "equal", value: "acute_recent" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "SPR-001", probability_score: 78 }
  },
  {
    name: "OSG-Instabilität — Rezidivtrauma",
    conditions: {
      all: [
        { fact: "spr_location", operator: "equal", value: "lateral_ankle" },
        { fact: "spr_trauma_type", operator: "equal", value: "past" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "SPR-001", probability_score: 72 }
  },
  {
    name: "Achillestendinopathie — Läufer Überlastung",
    conditions: {
      all: [
        { fact: "spr_location", operator: "equal", value: "achilles" },
        { fact: "spr_sport_onset", operator: "equal", value: "running_overload" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "SPR-002", probability_score: 82 }
  },
  {
    name: "Plantarfasziitis — Anlaufschmerz klassisch",
    conditions: {
      all: [
        { fact: "spr_location", operator: "equal", value: "heel_plantar" },
        { fact: "spr_morning_pain", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "SPR-003", probability_score: 84 }
  },
  {
    name: "Morton-Neurom — Kribbeln Vorfuß",
    conditions: {
      all: [
        { fact: "spr_location", operator: "in", value: ["forefoot", "midfoot"] },
        { fact: "spr_forefoot_numbness", operator: "equal", value: true },
        { fact: "spr_squeeze_pain", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "SPR-006", probability_score: 80 }
  },
  {
    name: "Stressfraktur — Überlastung Mittelfuß",
    conditions: {
      all: [
        { fact: "spr_location", operator: "in", value: ["midfoot", "forefoot"] },
        { fact: "spr_sudden_overload", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "SPR-007", probability_score: 68 }
  }
];

const SPRUNGGELENK_OUTPUT_CONFIG = {
  max_differentials_short: 2,
  max_differentials_standard: 3,
  max_differentials_deep: 5,
  key_differentiator: "Lokalisation (lateral/plantar/Achilles/Vorfuß) + Trauma + Morgensteifigkeit",
  red_flag_rules: [
    "Ottawa Ankle Rules positiv → Röntgen",
    "Verdacht Stressfraktur → MRT wenn Röntgen negativ",
    "Jones-Fraktur MT V → chirurgische Mitbeurteilung"
  ]
};

export {
  SPRUNGGELENK_QUESTIONS,
  SPRUNGGELENK_DIAGNOSES,
  SPRUNGGELENK_RULES,
  SPRUNGGELENK_OUTPUT_CONFIG
};
