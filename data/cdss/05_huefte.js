/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 05: HÜFTE
 *
 * Differentialdiagnosen (7):
 *  HUE-001  Coxarthrose
 *  HUE-002  Femoroacetabuläres Impingement (FAI — CAM / PINCER / kombiniert)
 *  HUE-003  Greater Trochanteric Pain Syndrome (GTPS / Bursitis trochanterica)
 *  HUE-004  Labrum-Läsion Hüfte
 *  HUE-005  Psoas-Tendinopathie / Coxa saltans (snapping hip)
 *  HUE-006  Piriformis-Syndrom / Deep Gluteal Syndrome
 *  HUE-007  Pädiatrische Hüfterkrankungen (Morbus Perthes / SCFE / Coxitis fugax)
 *
 * Quellen:
 *  - Reiman MP et al.: Diagnostic accuracy of clinical tests for the diagnosis of
 *    hip femoroacetabular impingement/labral tear: a systematic review. BJSM 2015.
 *  - Lievense A et al.: Prognosis of trochanteric pain in primary care. BJGP 2005.
 *  - Woodley SJ et al.: Lateral hip pain — evidence review. BJSM 2020.
 *  - Jacobsen S: Adult hip dysplasia and osteoarthritis. Acta Orthop 2006.
 */

const HUEFTE_QUESTIONS = [

  {
    id: "HUE-Q01",
    text: "Wo ist Ihr Hüftschmerz am stärksten?",
    type: "multiselect",
    options: [
      { value: "groin", label: "Leiste / vordere Hüfte (innen/vorne)" },
      { value: "lateral", label: "Hüftaußenseite / großer Rollhügel" },
      { value: "buttock", label: "Gesäß / Hinterseite Hüfte" },
      { value: "anterior_thigh", label: "Vordere Oberschenkelseite" },
      { value: "groin_deep", label: "Tief innen in der Hüfte (schwer zu lokalisieren — C-Zeichen)" }
    ],
    variants: ["short", "standard", "deep"],
    note: "C-Zeichen (Patient umfasst Hüfte mit C-förmiger Hand) = intraarticuläre Hüftpathologie"
  },

  {
    id: "HUE-Q02",
    text: "Wie hat der Hüftschmerz begonnen?",
    type: "select",
    options: [
      { value: "insidious", label: "Schleichend ohne klaren Auslöser" },
      { value: "overuse", label: "Nach Belastungssteigerung / Sport" },
      { value: "trauma", label: "Nach Trauma / Sturz auf die Hüfte" },
      { value: "postpartum", label: "Nach Schwangerschaft / Geburt" }
    ],
    variants: ["short", "standard", "deep"]
  },

  {
    id: "HUE-Q03",
    text: "Wie stark ist der Schmerz bei alltäglichen Aktivitäten? (0–10)",
    type: "nrs_0_10",
    variants: ["short", "standard", "deep"]
  },

  {
    id: "HUE-Q04",
    text: "Wann ist der Hüftschmerz am stärksten?",
    type: "multiselect",
    options: [
      { value: "walking_far", label: "Beim längeren Gehen" },
      { value: "stairs", label: "Beim Treppensteigen" },
      { value: "sitting_long", label: "Beim langen Sitzen (v.a. im Auto)" },
      { value: "squat_deep", label: "Beim tiefen Bücken / in die Hocke" },
      { value: "lying_lateral", label: "Im Liegen auf der betroffenen Seite" },
      { value: "single_leg", label: "Beim einseitigen Stehen / Treppensteigen" }
    ],
    variants: ["short", "standard", "deep"]
  },

  {
    id: "HUE-Q05",
    text: "Haben Sie eine Morgensteifigkeit in der Hüfte? Wie lange?",
    type: "select",
    options: [
      { value: "none", label: "Keine" },
      { value: "lt_30", label: "Weniger als 30 Minuten" },
      { value: "gt_30", label: "Mehr als 30 Minuten" }
    ],
    variants: ["standard", "deep"]
  },

  {
    id: "HUE-Q06",
    text: "Haben Sie ein Klicken, Schnappen oder Blockieren in der Hüfte?",
    type: "multiselect",
    options: [
      { value: "click_deep", label: "Tiefes Klicken / Klicken aus dem Gelenk" },
      { value: "snap_anterior", label: "Vorne Schnappen (bei Hüftbeugung/-streckung)" },
      { value: "snap_lateral", label: "Außen Schnappen (beim Gehen / Bein anheben)" },
      { value: "none", label: "Nein, kein Klicken oder Schnappen" }
    ],
    variants: ["standard", "deep"]
  },

  {
    id: "HUE-Q07",
    text: "Betreiben Sie Sportarten mit viel Hüftrotation (Ballett, Kampfsport, Yoga, Golf, Eishockey, Fußball)?",
    type: "yes_no",
    variants: ["standard", "deep"]
  },

  {
    id: "HUE-Q08",
    text: "Haben Sie Druckschmerz direkt über dem großen Rollhügel (die knöcherne Vorwölbung an der Hüftaußenseite)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    note: "Hochspezifisch für GTPS wenn positiv"
  },

  {
    id: "HUE-Q09",
    text: "Haben Sie Hüftschmerzen beim einseitigen Stehen auf dem betroffenen Bein?",
    type: "yes_no",
    variants: ["standard", "deep"],
    note: "Trendelenburg-Zeichen Äquivalent — GTPS / Abduktorenschwäche"
  },

  {
    id: "HUE-Q10",
    text: "Wie alt sind Sie? (Wichtig für Differenzierung der Hüftpathologien)",
    type: "number_confirm",
    note: "Wird aus Stammdaten übernommen — nur Bestätigung",
    variants: ["short", "standard", "deep"]
  },

  {
    id: "HUE-Q11",
    text: "Strahlt der Schmerz aus der Hüfte bis ins Knie aus?",
    type: "yes_no",
    variants: ["standard", "deep"],
    note: "Häufige Fehldiagnose: Knieschmerz als erstes Symptom einer Hüftpathologie (v.a. bei Kindern!)"
  },

  {
    id: "HUE-Q12",
    text: "Ist das Kind plötzlich (innerhalb von Tagen) ohne Trauma aufgehört zu belasten oder hinkt es?",
    type: "yes_no",
    condition: { fact: "patient_age", operator: "lessThanInclusive", value: 16 },
    variants: ["short", "standard", "deep"],
    note: "⚠️ Pädiatrische Hüfte: Notfall-Ausschluss Coxitis fugax, Perthes, SCFE"
  },

  {
    id: "HUE-Q13",
    text: "Haben Sie (oder wurde bei Ihnen) eine Hüftdysplasie oder auffällige Hüftentwicklung in der Kindheit beschrieben?",
    type: "yes_no",
    variants: ["deep"]
  },

  {
    id: "HUE-Q14",
    text: "Haben Sie tiefe Gesäßschmerzen, die beim langen Sitzen auf einer harten Fläche oder beim Autofahren schlimmer werden?",
    type: "yes_no",
    variants: ["standard", "deep"],
    note: "Piriformis-Syndrom Schlüsselfrage"
  }
];

const HUEFTE_DIAGNOSES = {

  "HUE-001": {
    id: "HUE-001",
    name: "Coxarthrose",
    name_en: "Hip Osteoarthritis",
    icd10: "M16.1",
    category: "degenerative",
    prevalence_note: "~10% der >60-Jährigen symptomatisch; 2. häufigste Gelenkarthrose nach Knie",
    key_features: [
      "Leistendominiierter Schmerz (anterior)",
      "Ausstrahlung in Oberschenkel vorne / Knie (25%!)",
      "Morgensteifigkeit < 60 Minuten",
      "Eingeschränkte Innenrotation (frühestes Zeichen!)",
      "Antalgische Gangstörung (Duchenne-Hinken)",
      "Anlaufschmerz — bessert sich nach wenigen Schritten",
      "FABER eingeschränkt und schmerzhaft"
    ],
    clinical_tests: [
      { test: "IR Restriction < 15° (Passiv)", sensitivity: 0.66, specificity: 0.79, lr_plus: 3.14 },
      { test: "Hip-Pain + IR pain + Age>50 (ACR Criteria)", sensitivity: 0.86, specificity: 0.75 },
      { test: "FABER (painful/restricted)", sensitivity: 0.60, specificity: 0.57 },
      { test: "Scour Test (axiale Kompression + Rotation)", sensitivity: 0.62, specificity: 0.75 }
    ],
    imaging_recommendation: {
      first_line: "Röntgen Becken + Hüfte axial (Gelenkspaltverschmälerung, Kellgren-Lawrence-Klassifikation)",
      if_surgery: "MRT (Knorpelstatus, Labrum)"
    },
    next_steps: [
      "Gewichtsoptimierung (stärkste konservative Maßnahme!)",
      "Physiotherapie: Hüftabduktoren + Extensoren kräftigen",
      "Thermotherapie, Elektrotherapie als begleitende Maßnahmen",
      "Intraartikuläre Injektionen: Kortison (kurzfristig), Hyaluron (mittelfristig)",
      "TEP (Totale Endoprothese Hüfte) bei Leidensdruck trotz konservatives Therapie"
    ],
    factors: { relief: -2, range: -3 }
  },

  "HUE-002": {
    id: "HUE-002",
    name: "Femoroacetabuläres Impingement (FAI)",
    name_en: "Femoroacetabular Impingement",
    icd10: "M24.85",
    category: "structural",
    prevalence_note: "Inzidenz junger Aktiver: 10–15%; CAM (Verdickung Femurhals) > PINCER (Überdeckung Pfanne)",
    fai_types: {
      CAM: "Verdickung am Femurhals — typisch junge männliche Sportler; Schmerz beim Sitzen",
      PINCER: "Übertiefe Hüftpfanne — typisch mittlere-ältere Frauen; Schmerz beim Bücken",
      COMBINED: "Kombination CAM + PINCER (häufigste Form)"
    },
    key_features: [
      "Junges bis mittleres Alter (18–45 Jahre)",
      "Tiefes Leistenkneifen (C-Zeichen)",
      "FADIR-Test positiv (Flexion + Adduktion + Innenrotation) — CAM",
      "Schmerz beim tiefen Sitzen (CAM) oder Bücken (PINCER)",
      "Oft aktiver Sportler mit viel Hüftbewegung",
      "MRT-Arthrographie für Labrumläsion (häufig assoziiert)"
    ],
    clinical_tests: [
      { test: "FADIR Test", sensitivity: 0.78, specificity: 0.50, lr_plus: 1.56, note: "Gut als Screening, wenig spezifisch" },
      { test: "FABER Test", sensitivity: 0.60, specificity: 0.57 },
      { test: "Scour Test", sensitivity: 0.62, specificity: 0.75 },
      { test: "Log Roll Test (geringer Schmerz)", note: "Differenziert intraarticulär vs. periartikulär" }
    ],
    imaging_recommendation: {
      first_line: "Röntgen Becken (Dunn-Aufnahme 45°/90°, Crossover-Zeichen für Pincer, Alpha-Winkel für CAM)",
      gold_standard: "MRT-Arthrographie Hüfte (Labrumläsion, Knorpelschaden)"
    },
    next_steps: [
      "Konservativ (3–6 Monate): Aktivitätsmodifikation, Hüftstabilisierung, Core-Training",
      "Keine forcierte Hüftmobilisation bei FAI!",
      "Arthroskopische Hüftosteochondroplastik bei Therapieversagen",
      "Orthopädisches Konsil zur Planung"
    ],
    factors: { relief: -2, range: -2 }
  },

  "HUE-003": {
    id: "HUE-003",
    name: "Greater Trochanteric Pain Syndrome (GTPS)",
    name_en: "Greater Trochanteric Pain Syndrome / Gluteal Tendinopathy",
    icd10: "M70.6",
    category: "overuse",
    prevalence_note: "Frauen 4x häufiger als Männer; Gipfel 40–60 Jahre; oft LWS-Schmerz kombiniert",
    key_features: [
      "Lateraler Hüftschmerz — direkt über dem Trochanter major",
      "Druckschmerz des Trochanter major (sehr sensitiv)",
      "Schmerz im Liegen auf betroffener Seite",
      "Einseitiger Stand schmerzhaft (Trendelenburg positiv)",
      "Schmerz beim Treppensteigen / bergab gehen",
      "Verbesserung im Sitzen / bei Entlastung"
    ],
    clinical_tests: [
      { test: "Trochanter Major Palpation (Druckschmerz)", sensitivity: 0.80, specificity: 0.82 },
      { test: "Single-Leg Stance Test", sensitivity: 0.73, specificity: 0.77 },
      { test: "Ober Test (ITB-Tightness)", sensitivity: 0.71, specificity: 0.47, note: "Oft assoziiert" }
    ],
    imaging_recommendation: {
      first_line: "Ultraschall (Gluteus-medius/minimus-Tendinopathie, Bursitis, Kalzifikation)",
      second_line: "MRT (Ausmaß der Läsion, vollständige Ruptur?)"
    },
    next_steps: [
      "Load-Management: Hüftadduktion beim Gehen/Sitzen vermeiden (Scheren-Positionen)",
      "Isometrisches Abduktionstraining (Phase 1 — Schmerzreduktion)",
      "Progressives Kräftigen Gluteus medius + minimus",
      "Stoßwellentherapie (fokussiert): Evidenz Level A für GTPS (Cochrane 2020)",
      "Ultraschallgesteuerte Kortison-Injektion bei akuter Bursitis"
    ],
    factors: { relief: -2, range: -1 },
    references: ["Woodley SJ et al. BJSM 2020", "Mellor R et al. JAMA 2018"]
  },

  "HUE-004": {
    id: "HUE-004",
    name: "Labrum-Läsion Hüfte",
    name_en: "Hip Labral Tear",
    icd10: "S73.01",
    category: "structural",
    key_features: [
      "Tiefes Leistenschmerz mit C-Zeichen",
      "Klicken / Einrasten (Clicking / Catching) im Gelenk",
      "FADIR positiv",
      "Oft in Kombination mit FAI",
      "Junge bis mittlere Aktive"
    ],
    imaging_recommendation: { gold_standard: "MRT-Arthrographie (93% Sensitivität für Labrumläsion)" },
    next_steps: [
      "Konservativ: Hüftstabilisierung 3–6 Monate",
      "Arthroskopische Labrumnaht oder -resektion bei Therapieversagen",
      "FAI gleichzeitig behandeln!"
    ],
    factors: { relief: -2, range: -2 }
  },

  "HUE-005": {
    id: "HUE-005",
    name: "Psoas-Tendinopathie / Coxa Saltans (Snapping Hip)",
    name_en: "Iliopsoas Tendinopathy / Internal Snapping Hip",
    icd10: "M76.1",
    category: "overuse",
    key_features: [
      "Vorderes Schnappen / hörbares Einschnappen bei Hüftbewegung",
      "Schmerz bei Hüftbeugung gegen Widerstand",
      "Thomas-Test zeigt Hüftflexor-Verkürzung",
      "Tänzer, Läufer, Fußballer",
      "Schmerz in der Leiste / innere Hüfte"
    ],
    imaging_recommendation: { first_line: "Dynamischer Ultraschall (Sehne überschnellt Eminentia ileopectinea)", second_line: "MRT bei Tendinose / Bursitis" },
    next_steps: [
      "Iliopsoas-Dehnung + exzentrisches Hüftbeuger-Training",
      "Ultraschallgesteuerte Injektion Bursa ileopectinea bei Bursitis",
      "Aktivitätsmodifikation temporär"
    ],
    factors: { relief: -1, range: -1 }
  },

  "HUE-006": {
    id: "HUE-006",
    name: "Piriformis-Syndrom / Deep Gluteal Syndrome",
    name_en: "Piriformis Syndrome / Deep Gluteal Syndrome",
    icd10: "G57.00",
    category: "functional",
    key_features: [
      "Tiefer Gesäßschmerz mit pseudoradikulärer Ausstrahlung",
      "Schmerz beim Sitzen auf harten Flächen",
      "FAIR-Test positiv",
      "SLR meist negativ (Unterschied zur lumbalen Radikulopathie!)",
      "Palpatorischer Druckschmerz Piriformis-Muskelbauch"
    ],
    clinical_tests: [
      { test: "FAIR Test (Piriformis)", sensitivity: 0.88, specificity: 0.83 }
    ],
    next_steps: [
      "Figure-4-Stretch (Piriformis-Dehnung)",
      "Dry Needling / Tiefenmassage M. piriformis",
      "Ultraschallgesteuerte Piriformis-Injektion"
    ],
    factors: { relief: -2, range: -1 }
  },

  "HUE-007": {
    id: "HUE-007",
    name: "Pädiatrische Hüfterkrankung",
    name_en: "Pediatric Hip Conditions",
    icd10: "M91",
    category: "pediatric",
    severity: "DRINGEND bei Verdacht",
    subtypes: {
      "Coxitis fugax": { age: "3–10 Jahre", onset: "Akut nach viral. Infekt", resolution: "Spontan 1–3 Wochen", action: "Ausschluss septische Arthritis!" },
      "Morbus Perthes": { age: "4–8 Jahre, Jungen > Mädchen", onset: "Schleichend, Hinken", action: "Orthopädie, MRT dringend" },
      "SCFE (Epiphysiolysis capitis femoris)": { age: "10–16 Jahre, Übergewicht", onset: "Knieschmerz als Erstsymptom!", action: "SOFORTIGE Überweisung — Operationsindikation!" }
    },
    key_features: [
      "⚠️ Jedes hinkende Kind < 16 Jahre braucht Bildgebung!",
      "Knieschmerz kann einziges Symptom der Hüfterkrankung sein!",
      "Coxitis fugax: Fieber nach viral. Infekt + akutes Hinken (Ausschluss septische Arthritis!)",
      "SCFE: übergewichtiger Jugendlicher + Knieschmerz + eingeschränkte IR"
    ],
    imaging_recommendation: {
      urgent: "Röntgen Hüfte sofort (Becken + Lauenstein-Aufnahme)",
      if_coxitis_fugax: "Ultraschall (Erguss) + Labor (CRP, BSG, Leukos) — septische Arthritis ausschließen!",
      mri: "MRT bei Perthes (Stadium, Deformierung), SCFE (Gleitung)"
    },
    next_steps: [
      "SOFORTIGE Weiterleitung pädiatrische Orthopädie",
      "Keine Belastung bis Diagnose gesichert",
      "Bei Coxitis fugax: Bettruhe + NSAR + engmaschige Kontrolle (24–48h Wiedervorstellung)",
      "SCFE: Operationsindikation — kein Zuwarten!"
    ],
    factors: { relief: -3, range: -3 }
  }
};

const HUEFTE_RULES = [

  // ─── HUE-007: PÄDIATRISCH (Höchste Priorität) ────────────
  {
    name: "HUE-007-ALARM: Pädiatrische Hüfte — Kind hinkt akut",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "huefte" },
        { fact: "patient_age", operator: "lessThanInclusive", value: 16 },
        { fact: "HUE-Q12", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: {
        diagnosis_id: "HUE-007",
        probability_score: 92,
        label: "⚠️ Pädiatrische Hüfte — SOFORT Röntgen und pädiatrische Orthopädie",
        urgent_referral: true
      }
    }
  },

  // ─── HUE-001: Coxarthrose ─────────────────────────────────
  {
    name: "HUE-001-SEHR-HOCH: Coxarthrose — Alter + Leiste + IR-Einschränkung",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "huefte" },
        { fact: "patient_age", operator: "greaterThanInclusive", value: 50 },
        { fact: "HUE-Q01", operator: "contains", value: "groin" },
        { fact: "HUE-Q05", operator: "in", value: ["lt_30"] }
      ],
      any: [
        { fact: "HUE-Q04", operator: "contains", value: "walking_far" },
        { fact: "HUE-Q04", operator: "contains", value: "stairs" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HUE-001", probability_score: 86, label: "Sehr wahrscheinlich" }
    }
  },

  // ─── HUE-002: FAI ─────────────────────────────────────────
  {
    name: "HUE-002-HOCH: FAI — jung + tief sitzen + Klicken",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "huefte" },
        { fact: "patient_age", operator: "lessThanInclusive", value: 45 },
        { fact: "HUE-Q01", operator: "contains", value: "groin_deep" }
      ],
      any: [
        { fact: "HUE-Q04", operator: "contains", value: "sitting_long" },
        { fact: "HUE-Q04", operator: "contains", value: "squat_deep" },
        { fact: "HUE-Q06", operator: "contains", value: "click_deep" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HUE-002", probability_score: 78, label: "Wahrscheinlich" }
    }
  },

  // ─── HUE-003: GTPS ────────────────────────────────────────
  {
    name: "HUE-003-SEHR-HOCH: GTPS — lateral + Trochanter + Seitenschlaf",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "huefte" },
        { fact: "HUE-Q01", operator: "contains", value: "lateral" },
        { fact: "HUE-Q08", operator: "equal", value: true }
      ],
      any: [
        { fact: "HUE-Q04", operator: "contains", value: "lying_lateral" },
        { fact: "HUE-Q09", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HUE-003", probability_score: 85, label: "Sehr wahrscheinlich" }
    }
  },

  // ─── HUE-004: Labrum ──────────────────────────────────────
  {
    name: "HUE-004-HOCH: Labrum — C-Zeichen + Klicken + jung",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "huefte" },
        { fact: "HUE-Q01", operator: "contains", value: "groin_deep" },
        { fact: "HUE-Q06", operator: "contains", value: "click_deep" },
        { fact: "patient_age", operator: "lessThanInclusive", value: 45 }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HUE-004", probability_score: 72, label: "Wahrscheinlich" }
    }
  },

  // ─── HUE-005: Psoas Snapping ──────────────────────────────
  {
    name: "HUE-005-HOCH: Psoas Snapping — anteriores Schnappen + Leiste",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "huefte" },
        { fact: "HUE-Q01", operator: "contains", value: "groin" },
        { fact: "HUE-Q06", operator: "contains", value: "snap_anterior" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HUE-005", probability_score: 75, label: "Wahrscheinlich" }
    }
  },

  // ─── HUE-006: Piriformis ──────────────────────────────────
  {
    name: "HUE-006-HOCH: Piriformis — Gesäß + Sitzen + kein LWS-Muster",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "huefte" },
        { fact: "HUE-Q01", operator: "contains", value: "buttock" },
        { fact: "HUE-Q14", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HUE-006", probability_score: 70, label: "Wahrscheinlich" }
    }
  }
];

export { HUEFTE_QUESTIONS, HUEFTE_DIAGNOSES, HUEFTE_RULES };
