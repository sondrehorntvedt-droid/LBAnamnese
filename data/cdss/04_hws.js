/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 04: HALSWIRBELSÄULE (HWS)
 *
 * Differentialdiagnosen (7):
 *  HWS-001  Zervikale Radikulopathie (Bandscheibenvorfall / Foraminostenose)
 *  HWS-002  Zervikogener Kopfschmerz (GON / Facettengelenk-Beteiligung)
 *  HWS-003  Zervikale Myelopathie ← THERAPIE-STOPP / Dringliche Überweisung
 *  HWS-004  Zervikales Facettengelenk-Syndrom
 *  HWS-005  Zervikothorakales Übergangssyndrom / Myofasziell HWS
 *  HWS-006  HWS-Beschleunigungstrauma (Schleudertrauma / WAD)
 *  HWS-007  Thoracic-Outlet-Syndrom (TOS / Kostoklavikuläres Syndrom)
 *
 * ⚠️  WICHTIGER HINWEIS FÜR ALLE HWS-PATIENTEN:
 *     Vor jeder HWS-Manipulation MUSS das Risikoprofil-Modul (05_risikoprofil.js)
 *     ausgewertet werden! CAD-Risikoscreening ist OBLIGATORISCH.
 *
 * Quellen:
 *  - Wainner RS et al.: Reliability and diagnostic accuracy of the clinical
 *    examination and patient self-report measures for cervical radiculopathy.
 *    Spine 2003.
 *  - Bogduk N, Govind J: Cervicogenic headache — an assessment of the evidence
 *    on clinical diagnosis, invasive tests, and treatment. Lancet Neurol 2009.
 *  - Rhee JM et al.: Cervical myelopathy. J Am Acad Orthop Surg 2009.
 *  - Rubinstein SM et al.: A systematic review of the diagnostic accuracy of
 *    provocative tests of the neck for diagnosing cervical radiculopathy. Spine J 2007.
 */

const HWS_QUESTIONS = [

  {
    id: "HWS-Q01",
    text: "Wo genau ist Ihr Nackenschmerz am stärksten?",
    type: "multiselect",
    options: [
      { value: "central", label: "Mittig im Nacken / Hinterkopf" },
      { value: "paravertebral", label: "Neben der Wirbelsäule (ein- oder beidseitig)" },
      { value: "shoulder_blade", label: "Schulterblatt / oberer Rücken" },
      { value: "arm", label: "Strahlt in den Arm aus" },
      { value: "head", label: "Kopfschmerz (vom Nacken ausgehend)" }
    ],
    variants: ["short", "standard", "deep"]
  },

  {
    id: "HWS-Q02",
    text: "Strahlt der Schmerz in den Arm oder die Hand aus?",
    type: "select",
    options: [
      { value: "no", label: "Nein, bleibt im Nacken/Schulterbereich" },
      { value: "to_elbow", label: "Bis zum Ellenbogen" },
      { value: "to_hand", label: "Bis in die Hand / Finger" }
    ],
    variants: ["short", "standard", "deep"]
  },

  {
    id: "HWS-Q03",
    text: "Welche Finger oder Bereiche der Hand sind betroffen?",
    type: "select",
    condition: { fact: "HWS-Q02", operator: "equal", value: "to_hand" },
    options: [
      { value: "c5_lateral_arm", label: "Schulter außen / seitlicher Oberarm (C5)" },
      { value: "c6_thumb_index", label: "Daumen und Zeigefinger / Außenseite Unterarm (C6)" },
      { value: "c7_middle", label: "Mittel- und Ringfinger / Rückseite Arm (C7)" },
      { value: "c8_ring_small", label: "Ring- und Kleinfinger / Innenseite (C8/T1)" },
      { value: "diffuse", label: "Diffus / ganzer Arm / nicht klar lokalisierbar" }
    ],
    variants: ["standard", "deep"],
    note: "Dermatomales Muster = starker Hinweis auf zervikale Radikulopathie"
  },

  {
    id: "HWS-Q04",
    text: "Haben Sie Kribbeln, Taubheitsgefühl oder Schwäche im Arm oder in der Hand?",
    type: "multiselect",
    options: [
      { value: "none", label: "Nein, keine solchen Beschwerden" },
      { value: "tingling", label: "Kribbeln / Ameisenlaufen" },
      { value: "numbness", label: "Taubheitsgefühl / Gefühlslosigkeit" },
      { value: "weakness", label: "Schwäche beim Greifen oder Heben" }
    ],
    variants: ["short", "standard", "deep"]
  },

  {
    id: "HWS-Q05",
    text: "Verschlimmert sich der Arm-/Handschmerz, wenn Sie den Kopf zur betroffenen Seite neigen und leicht nach hinten beugen?",
    type: "yes_no",
    variants: ["standard", "deep"],
    note: "Spurling-Manöver: Sensitivität 30%, Spezifität 93% für Radikulopathie"
  },

  {
    id: "HWS-Q06",
    text: "Haben Sie Probleme mit der Feinmotorik der Hände (Knöpfe schließen, Schreiben, Besteck)?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    alert_if: true,
    note: "⚠️ Myelopathie-Zeichen — sofort eskalieren wenn JA"
  },

  {
    id: "HWS-Q07",
    text: "Haben Sie Gleichgewichtsprobleme oder einen unsicheren Gang?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    alert_if: true,
    note: "⚠️ Myelopathie-Zeichen"
  },

  {
    id: "HWS-Q08",
    text: "Spüren Sie ein elektrisches Kribbeln, das bei Kopfbeugung nach vorne in Arme oder Beine schießt?",
    type: "yes_no",
    variants: ["standard", "deep"],
    alert_if: true,
    note: "⚠️ L'Hermitte-Zeichen = Myelopathie bis Beweis des Gegenteils"
  },

  {
    id: "HWS-Q09",
    text: "Haben Sie Kopfschmerzen, die im Nacken/Hinterkopf beginnen und sich oft auf eine Kopfseite ausbreiten?",
    type: "yes_no",
    variants: ["standard", "deep"]
  },

  {
    id: "HWS-Q10",
    text: "Wie hat der Nackenschmerz begonnen?",
    type: "select",
    options: [
      { value: "trauma_whiplash", label: "Nach Auffahrunfall / Schleudertrauma" },
      { value: "trauma_direct", label: "Nach direktem Trauma auf Kopf/Nacken" },
      { value: "insidious", label: "Schleichend — ohne klaren Auslöser" },
      { value: "posture", label: "Durch lange Sitz- oder Bildschirmarbeit" },
      { value: "overuse", label: "Nach körperlicher Überbelastung" }
    ],
    variants: ["short", "standard", "deep"]
  },

  {
    id: "HWS-Q11",
    text: "Haben Sie nach dem Nackenunfall (Schleudertrauma) zusätzliche Beschwerden wie Schwindel, Sehprobleme, Konzentrationsstörungen oder Schluckbeschwerden?",
    type: "multiselect",
    condition: { fact: "HWS-Q10", operator: "equal", value: "trauma_whiplash" },
    options: [
      { value: "dizziness", label: "Schwindel (nicht nur bei Kopfbewegung)" },
      { value: "vision", label: "Sehstörungen / Doppelbilder" },
      { value: "cognitive", label: "Konzentrations- / Gedächtnisprobleme" },
      { value: "dysphagia", label: "Schluckbeschwerden" },
      { value: "tinnitus", label: "Ohrgeräusche / Tinnitus" },
      { value: "none", label: "Keine zusätzlichen Beschwerden" }
    ],
    variants: ["standard", "deep"],
    note: "WAD Klassifikation nach Quebec Task Force"
  },

  {
    id: "HWS-Q12",
    text: "Wann ist der Nackenschmerz am stärksten?",
    type: "multiselect",
    options: [
      { value: "extension", label: "Bei Rückwärtsbiegen des Kopfes / Überkopfarbeit" },
      { value: "rotation", label: "Beim Drehen des Kopfes" },
      { value: "sitting_screen", label: "Nach langem Sitzen / Bildschirmarbeit" },
      { value: "morning", label: "Morgens beim Aufwachen" },
      { value: "night", label: "Nachts" }
    ],
    variants: ["standard", "deep"]
  },

  {
    id: "HWS-Q13",
    text: "Haben Sie bei Belastung oder Anheben des Arms eine Zunahme der Symptome im Arm/Hand (Kribbeln, Schwäche)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    note: "ULNT (Upper Limb Neurodynamic Test) Äquivalent"
  },

  {
    id: "HWS-Q14",
    text: "Haben Sie Schmerzen oder ein Taubheitsgefühl im Arm, das bei Überkopfaktivitäten oder beim Tragen von Lasten auf der Schulter schlimmer wird?",
    type: "yes_no",
    variants: ["standard", "deep"],
    note: "TOS: Thoracic Outlet Syndrom"
  },

  {
    id: "HWS-Q15",
    text: "Haben Sie bekannte Risikofaktoren wie Bluthochdruck, Rauchen, Gefäßerkrankungen oder nehmen Sie die Pille (Östrogen)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    note: "⚠️ CAD-Risikofaktoren — wird im Risikoprofil-Modul vertieft"
  }
];

const HWS_DIAGNOSES = {

  "HWS-001": {
    id: "HWS-001",
    name: "Zervikale Radikulopathie",
    name_en: "Cervical Radiculopathy",
    icd10: "M54.12",
    category: "structural",
    prevalence_note: "Inzidenz: ~83/100.000/Jahr; C6 häufigster Bereich (25%), C7 (60%), C5 (10%)",
    dermatome_guide: {
      "C5": { pain: "Schulter lateral / Oberarm außen", weakness: "Deltoid / Bizeps", reflex: "Bizepssehnenreflex ↓" },
      "C6": { pain: "Daumen / Zeigefinger / Unterarm lateral", weakness: "Handgelenk-Extension / Bizeps", reflex: "Bizeps- + Brachioradialisreflex ↓" },
      "C7": { pain: "Mittelfinger / Rückseite Arm", weakness: "Trizeps / Handgelenk-Flexion", reflex: "Trizepssehnenreflex ↓" },
      "C8": { pain: "Ring- / Kleinfinger / Unterarm medial", weakness: "Fingerflexion / intrinsische Handmuskeln", reflex: "Fingerflexionsreflex" }
    },
    key_features: [
      "Armschmerz > Nackenschmerz (Leitsymptom!)",
      "Dermatomales Ausstrahlungsmuster bis in Hand",
      "Spurling-Test positiv (Kompression + Seitenneigung)",
      "ULNT positiv (neurale Spannung im Arm)",
      "Distraktionstest: Schmerzlinderung bei HWS-Entlastung",
      "Mögliche Reflexabschwächung + Sensibilitätsstörung"
    ],
    clinical_tests: [
      { test: "Spurling Test", sensitivity: 0.30, specificity: 0.93, lr_plus: 4.29 },
      { test: "ULNT-1", sensitivity: 0.72, specificity: 0.33 },
      { test: "Distraction Test", sensitivity: 0.44, specificity: 0.90, lr_plus: 4.40 },
      { test: "Wainner Cluster (Spurling + ULNT + Distraktion + Rotation <60°)", sensitivity: 0.24, specificity: 0.99, lr_plus: 30.3, note: "Alle 4 positiv = sehr hohe Spezifität" }
    ],
    imaging_recommendation: {
      first_line: "MRT HWS (Bandscheibenprotrusion, Foramenstenose, Myelopathie ausschließen)",
      emg_if: "EMG/ENG bei Unklarheit über Niveau oder periphere Ursache"
    },
    next_steps: [
      "Aufklärung: 75–90% der zervikalen Radikulopathien erholen sich konservativ in 4–6 Wochen",
      "Neurale Mobilisation (ULNT-Techniken)",
      "Manuelle Traktion (intermittierend)",
      "NSAR kurzfristig, Gabapentin/Pregabalin bei neuropathem Schmerz",
      "Periradikuläre Infiltration bei persistierender Symptomatik >6 Wochen",
      "Operative Diskektomie + Fusion (ACDF) bei progredientem Defizit oder Therapieversagen"
    ],
    factors: { relief: -2, range: -1 }
  },

  "HWS-002": {
    id: "HWS-002",
    name: "Zervikogener Kopfschmerz",
    name_en: "Cervicogenic Headache",
    icd10: "G44.841",
    category: "functional_structural",
    prevalence_note: "2–4% aller Kopfschmerzen; bei chronischen Kopfschmerzen bis 17%; häufig fehldiagnostiziert als Migräne",
    key_features: [
      "Einseitiger Kopfschmerz ohne Seitenwechsel",
      "Kopfschmerz beginnt im Nacken / Subokzipital",
      "Nackenbewegungen reproduzieren den Kopfschmerz",
      "Flexion-Rotation-Test positiv (C1/C2 Dysfunktion)",
      "Druckschmerz der oberen Zervikalgelenke (C0/C1, C1/C2)",
      "Keine Übelkeit/Erbrechen als Leitsymptom",
      "GON (Greater Occipital Nerve) oft druckschmerzhaft"
    ],
    clinical_tests: [
      { test: "Flexion-Rotation Test (FRT)", sensitivity: 0.90, specificity: 0.88, lr_plus: 7.50, note: "Bester klinischer Test für C1/C2-Beteiligung" },
      { test: "Palpation C0/C1/C2 Schmerzreproduktion", sensitivity: 0.82, specificity: 0.79 }
    ],
    imaging_recommendation: {
      first_line: "Klinische Diagnose (ICHD-3 Kriterien) — MRT nur zum Ausschluss intrakranieller Ursache",
      if_first_or_worst: "MRT Schädel + HWS bei 'erstmalig schlimmster Kopfschmerz'"
    },
    next_steps: [
      "Manuelle Therapie C1/C2 (Hochspezialisiert — nur nach CAD-Risiko-Screening!)",
      "GON-Blockade (Diagnostic + Therapeutic)",
      "Dry Needling subokzipitale Muskulatur",
      "Physiotherapie: Schulung tiefe Nackenflexoren, Krafttraining HWS"
    ],
    factors: { relief: -2, rhythm: -1 },
    references: ["Bogduk N, Govind J. Lancet Neurol 2009"]
  },

  "HWS-003": {
    id: "HWS-003",
    name: "Zervikale Myelopathie",
    name_en: "Cervical Spondylotic Myelopathy",
    icd10: "G99.2",
    category: "structural",
    severity: "DRINGEND — Therapiestopp",
    prevalence_note: "Häufigste Ursache spinaler Dysfunktion >55J.; oft schrittweise Progression",
    key_features: [
      "⚠️ KEINE HVLA-MANIPULATION OHNE MRT-AUSSCHLUSS!",
      "Bimanueller Handkraftmangel / Feinmotorikstörung",
      "Spastischer Gangstörung / Unsicherheit beim Gehen",
      "L'Hermitte-Zeichen (Elektrisieren bei Flexion)",
      "Bilaterale Arm- UND Beinsymptome",
      "Hoffmann-Reflex positiv",
      "Blasendrang / -dranginkontinenz möglich"
    ],
    clinical_tests: [
      { test: "Hoffmann Reflex (positiv = pathologisch)", sensitivity: 0.58, specificity: 0.78 },
      { test: "10-second step test (>10 Schritte in 10 Sek.)", note: "Empfindlicher Funktionstest" },
      { test: "Finger Escape Sign", sensitivity: 0.50, specificity: 0.96 },
      { test: "Grip and Release Test (<20 Wiederholungen in 10 Sek.)", note: "Klinischer Myelopathiemarker" }
    ],
    imaging_recommendation: {
      urgent: "MRT HWS SOFORT — keine manuelle Behandlung vor Bildgebung",
      referral: "Neurochirurgie / Neurologie — Timing abhängig von Progredienz"
    },
    next_steps: [
      "⛔ KEINE zervikale Manipulation bis MRT-Ergebnis",
      "Sofortige Überweisung Neurochirurgie bei progredientem Defizit",
      "Bei leichter Myelopathie: engmaschige Verlaufskontrollen MRT",
      "Operative Dekompression: Standard bei Progredienz"
    ],
    factors: { relief: -4, range: -4 }
  },

  "HWS-004": {
    id: "HWS-004",
    name: "Zervikales Facettengelenk-Syndrom",
    name_en: "Cervical Facet Joint Pain",
    icd10: "M47.812",
    category: "functional_structural",
    key_features: [
      "Nacken- + Schulterschmerz (oft bis Schulterblatt, NICHT bis Finger)",
      "Verschlimmerung bei Extension + Rotation",
      "Morgensteifigkeit (kurz)",
      "Referred pain — diffus, nicht dermatomal",
      "Kein neurologisches Defizit",
      "Häufig nach Schleudertrauma als Spätsymptom"
    ],
    imaging_recommendation: { first_line: "MRT HWS (Arthrose, Foraminostenose)", confirmation: "Diagnostische Facettenblockade" },
    next_steps: [
      "Manuelle Therapie (Mobilisation, keine HVLA vor CAD-Screening)",
      "Physiotherapie: tiefe Nackenflexoren, Haltungsschulung",
      "Zervikale Facettenblockade (Kortison) bei Therapieresistenz",
      "Radiofrequenzdenervation bei positivem Block"
    ],
    factors: { relief: -2, range: -1 }
  },

  "HWS-005": {
    id: "HWS-005",
    name: "Zervikothorakales Übergangssyndrom / Myofasziell HWS",
    name_en: "Cervicothoracic Junction Syndrome / Myofascial",
    icd10: "M54.2",
    category: "functional",
    key_features: [
      "Schmerz oberer Trapezius / M. levator scapulae",
      "Triggerpunkte palpierbar (oft bilateral)",
      "Eindeutige Haltungskomponente (Bildschirmarbeit, Smartphone-Nutzung)",
      "Typisch: junges bis mittleres Alter, Office-Job",
      "Bessert sich kurzfristig nach Wärme / Massage",
      "Kein neurologisches Defizit"
    ],
    next_steps: [
      "Ergonomie-Beratung (Primär!)",
      "Kräftigung tiefe Nackenflexoren (Chin Tuck Übungen)",
      "Triggerpunkt-Therapie / Dry Needling M. trapezius / levator scapulae",
      "Fasziale Behandlung zervikothorakal",
      "Wärmebehandlung / TENS als Ergänzung"
    ],
    factors: { relief: -1, regulation: -1 }
  },

  "HWS-006": {
    id: "HWS-006",
    name: "HWS-Beschleunigungstrauma (Schleudertrauma / WAD)",
    name_en: "Whiplash Associated Disorder (WAD)",
    icd10: "S13.4",
    category: "trauma",
    prevalence_note: "WAD nach Auffahrunfall: 15–40% chronifizieren (>3 Monate)",
    wad_classification: {
      "WAD 0": "Keine Nackenbeschwerden, kein klinischer Befund",
      "WAD I": "Nackenschmerz / -steifigkeit, keine objektiven Befunde",
      "WAD II": "Nackenbeschwerden + muskuloskelettale Befunde",
      "WAD III": "Nackenbeschwerden + neurologische Zeichen",
      "WAD IV": "Fraktur oder Dislokation (Notfall)"
    },
    key_features: [
      "Typische Latenz: Schmerzbeginn 12–24h nach Unfall",
      "Nacken- + Kopfschmerz + Schultersteifigkeit",
      "Mögliche begleitende Beschwerden: Schwindel, kognitive Einschränkung",
      "Psychosoziale Faktoren stark prognostisch (Yellow Flags!)",
      "Prognose stark von früher Aktivierung abhängig"
    ],
    next_steps: [
      "Aufklärung: Aktiv bleiben — Ruhigstellung verschlechtert Prognose!",
      "Frühe aktivierende Physiotherapie (innerhalb der ersten 2 Wochen)",
      "Analgesie: Paracetamol / NSAR kurzfristig",
      "Psychosoziale Risikofaktoren adressieren (Yellow Flags!)",
      "Bei WAD III/IV: bildgebende Abklärung vor Behandlung"
    ],
    factors: { relief: -2, range: -1, regulation: -1 }
  },

  "HWS-007": {
    id: "HWS-007",
    name: "Thoracic-Outlet-Syndrom (TOS)",
    name_en: "Thoracic Outlet Syndrome",
    icd10: "G54.0",
    category: "structural",
    key_features: [
      "Arm-Schmerz / -Taubheit bei Überkopfaktivitäten",
      "Häufiger bei jungen schlanken Frauen mit langen Hälsen",
      "Adson-Test positiv (Radialispuls-Abschwächung bei Rotation + Extension + Insp.)",
      "ROOS-Test positiv (Arm 90° abduziert, 3 Min. Öffnen/Schließen der Faust)",
      "Cervikal-Rippe möglich (Röntgen!)",
      "Unterscheide: neurales TOS (90%) vs. vaskuläres TOS (10%)"
    ],
    clinical_tests: [
      { test: "ROOS Test / Elevated Arm Stress Test", sensitivity: 0.84, specificity: 0.30, note: "Sensitiv — wenig spezifisch" },
      { test: "Adson Test", sensitivity: 0.79, specificity: 0.56 },
      { test: "Costoclavicular Maneuver", sensitivity: 0.53, specificity: 0.54 }
    ],
    imaging_recommendation: {
      first_line: "Röntgen HWS + Thoraxübersicht (Cervikalrippe, Halswirbel-Anomalien)",
      second_line: "MRT Hals (neurale Kompression), Doppler (vaskuläres TOS)"
    },
    next_steps: [
      "Physiotherapie: Skaleni-Dehnung, Thoraxöffnung, Pektoralis minor Dehnuing",
      "Haltungsschulung (Thoraxkyphose-Korrektur)",
      "Neurogenes TOS: konservativ meist erfolgreich",
      "Vaskuläres TOS: chirurgische Resektion erste Rippe / Cervikalrippe"
    ],
    factors: { relief: -1, range: -1 }
  }
};

const HWS_RULES = [

  // ─── HWS-003: MYELOPATHIE (Priorität 1 in HWS) ──────────
  {
    name: "HWS-003-ALARM: Myelopathie — Feinmotorik + Gangstörung",
    conditions: {
      all: [
        { fact: "region_primary", operator: "in", value: ["hws", "bws"] }
      ],
      any: [
        { fact: "HWS-Q06", operator: "equal", value: true },
        { fact: "HWS-Q07", operator: "equal", value: true },
        { fact: "HWS-Q08", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: {
        diagnosis_id: "HWS-003",
        probability_score: 90,
        label: "⚠️ Myelopathie-Verdacht — MRT sofort, keine Manipulation",
        manipulation_contraindication: true,
        urgent_referral: true
      }
    }
  },

  // ─── HWS-001: Radikulopathie ─────────────────────────────
  {
    name: "HWS-001-SEHR-HOCH: Radikulopathie — dermatomal bis Hand + Spurling",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "hws" },
        { fact: "HWS-Q02", operator: "equal", value: "to_hand" },
        { fact: "HWS-Q05", operator: "equal", value: true }
      ],
      any: [
        { fact: "HWS-Q04", operator: "contains", value: "numbness" },
        { fact: "HWS-Q04", operator: "contains", value: "weakness" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HWS-001", probability_score: 88, label: "Sehr wahrscheinlich" }
    }
  },

  {
    name: "HWS-001-HOCH: Radikulopathie — Armausstrahlung bis Hand",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "hws" },
        { fact: "HWS-Q02", operator: "equal", value: "to_hand" }
      ],
      any: [
        { fact: "HWS-Q04", operator: "contains", value: "tingling" },
        { fact: "HWS-Q13", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HWS-001", probability_score: 70, label: "Wahrscheinlich" }
    }
  },

  // ─── HWS-002: Zervikogener Kopfschmerz ───────────────────
  {
    name: "HWS-002-HOCH: Zervikogener KS — Hinterkopf + einseitig + Nacken auslösend",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "hws" },
        { fact: "HWS-Q09", operator: "equal", value: true },
        { fact: "HWS-Q01", operator: "contains", value: "head" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HWS-002", probability_score: 74, label: "Wahrscheinlich" }
    }
  },

  // ─── HWS-004: Facettengelenk ─────────────────────────────
  {
    name: "HWS-004-HOCH: Facettengelenk — Extension + Schulterblatt + kein Dermatom",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "hws" },
        { fact: "HWS-Q02", operator: "equal", value: "no" },
        { fact: "HWS-Q12", operator: "contains", value: "extension" },
        { fact: "HWS-Q01", operator: "contains", value: "shoulder_blade" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HWS-004", probability_score: 68, label: "Wahrscheinlich" }
    }
  },

  // ─── HWS-005: Myofasziell / Zervikothorakal ──────────────
  {
    name: "HWS-005-MITTEL: Myofasziell — Bildschirmarbeit + bilateral + kein Dermatom",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "hws" },
        { fact: "HWS-Q10", operator: "equal", value: "posture" },
        { fact: "HWS-Q02", operator: "equal", value: "no" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HWS-005", probability_score: 62, label: "Wahrscheinlich" }
    }
  },

  // ─── HWS-006: Schleudertrauma ────────────────────────────
  {
    name: "HWS-006-HOCH: WAD — Auffahrunfall + multiple Symptome",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "hws" },
        { fact: "HWS-Q10", operator: "equal", value: "trauma_whiplash" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HWS-006", probability_score: 85, label: "Sehr wahrscheinlich" }
    }
  },

  // ─── HWS-007: TOS ─────────────────────────────────────────
  {
    name: "HWS-007-MITTEL: TOS — Überkopf-Symptome + schlanke Patientin",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "hws" },
        { fact: "HWS-Q14", operator: "equal", value: true },
        { fact: "HWS-Q02", operator: "in", value: ["to_elbow", "to_hand"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "HWS-007", probability_score: 58, label: "Möglich" }
    }
  }
];

// ⚠️  HWS-SPEZIFISCHE HINWEISE: Manipulation-Sicherheit
const HWS_MANIPULATION_SAFETY_NOTE = {
  mandatory_pre_check: "Risikoprofil-Modul MUSS vor HWS-Manipulation ausgewertet werden",
  absolute_contraindications_manipulation: [
    "HWS-003 Myelopathie (bis MRT-Ausschluss)",
    "CAD-Risikoklasse HOCH (Modul 05)",
    "Bekannte Dissektionsanamnese (A. vertebralis oder A. carotis)",
    "Instabilität (Down-Syndrom, Grisel, Post-Trauma ohne Bildgebung)",
    "Aktive Malignität HWS",
    "Antikoagulation + klinisch relevante Blutungsneigung"
  ],
  require_clinical_screening: [
    "Cervical Artery Dissection (CAD) 5-Fragen-Screen (Modul 05)",
    "Sharp-Purser-Test bei C1/C2-Instabilitätsverdacht",
    "Vertebral Artery Test (klinische Evidenz begrenzt, aber Kontext relevant)"
  ]
};

export { HWS_QUESTIONS, HWS_DIAGNOSES, HWS_RULES, HWS_MANIPULATION_SAFETY_NOTE };
