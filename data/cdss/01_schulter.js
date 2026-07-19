/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 01: SCHULTER
 *
 * Abgedeckte Differentialdiagnosen (8):
 *  SCHU-001  Rotatorenmanschetten-Läsion (komplett / partiell)
 *  SCHU-002  Subakromiales Impingement-Syndrom
 *  SCHU-003  Adhäsive Kapsulitis (Frozen Shoulder)
 *  SCHU-004  Omarthrose (GHG-Arthrose)
 *  SCHU-005  AC-Gelenk-Pathologie (Arthrose / Akromioklavikular-Läsion)
 *  SCHU-006  Zervikogene Schulter / Zervikobrachialgie
 *  SCHU-007  Schulterinstabilität / Bankart-Läsion / SLAP
 *  SCHU-008  Bizepstendinopathie / SLAP-Läsion (lange Bizepssehne)
 *
 * Quellen (Auswahl):
 *  - Hegedus EJ et al.: Physical examination tests of the shoulder:
 *    a systematic review with meta-analysis of individual tests. BJSM 2008.
 *  - Hermans J et al.: Does this patient with shoulder pain have rotator cuff disease?
 *    JAMA 2013.
 *  - Kuhn JE: Practical evidence for managing patients with shoulder pain.
 *    J Musculoskeletal Med 2009.
 *  - Çalış M et al.: Diagnostic values of clinical diagnostic tests in
 *    subacromial impingement syndrome. Ann Rheum Dis 2000.
 *  - Zuckerman JD, Rokito A: Frozen shoulder: definition and overview.
 *    J Shoulder Elbow Surg 2011.
 *  - Reijnierse M et al.: Shoulder MRI findings, clinical presentation and
 *    diagnosis. Eur Radiol 2014.
 */

// ============================================================
// FRAGEBOGEN: SCHULTER
// Jede Frage hat eine ID, den Fragentext, Typ, Optionen
// und ist einer oder mehreren Diagnosen zugeordnet.
// Adaptive Logik: Follow-up-Fragen werden nur gestellt,
// wenn ein Trigger erfüllt ist.
// ============================================================

const SCHULTER_QUESTIONS = [

  // --- GRUPPE 1: BASISFRAGEN (alle Varianten) ---------------

  {
    id: "SCH-Q01",
    text: "Wo genau ist Ihr Schulterschmerz am stärksten?",
    type: "multiselect",
    options: [
      { value: "anterior", label: "Vorderseite der Schulter" },
      { value: "lateral", label: "Außenseite / seitlicher Deltabereich" },
      { value: "superior", label: "Schulteröberseite / Schultereck" },
      { value: "posterior", label: "Hinterseite / Schulterblatt" },
      { value: "radiating_arm", label: "Strahlt in den Arm aus" },
      { value: "radiating_neck", label: "Strahlt in den Nacken aus" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["location", "all_diagnoses"]
  },

  {
    id: "SCH-Q02",
    text: "Wie hat der Schmerz begonnen?",
    type: "select",
    options: [
      { value: "trauma_acute", label: "Plötzlich nach Sturz / Unfall / Aufprall" },
      { value: "overuse", label: "Schleichend durch Überbelastung / Wiederholung" },
      { value: "insidious", label: "Ohne erkennbaren Auslöser — einfach angefangen" },
      { value: "post_immob", label: "Nach einer Zeit der Ruhigstellung / Operation" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["onset", "all_diagnoses"]
  },

  {
    id: "SCH-Q03",
    text: "Seit wann haben Sie diese Schulterbeschwerden?",
    type: "duration_select",
    options: [
      { value: "acute", label: "Weniger als 6 Wochen" },
      { value: "subacute", label: "6 Wochen bis 3 Monate" },
      { value: "chronic", label: "3 bis 12 Monate" },
      { value: "very_chronic", label: "Mehr als 1 Jahr" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["duration", "all_diagnoses"]
  },

  {
    id: "SCH-Q04",
    text: "Wie stark sind Ihre Schulterschmerzen in Ruhe? (0 = kein Schmerz, 10 = stärkster vorstellbarer Schmerz)",
    type: "nrs_0_10",
    variants: ["short", "standard", "deep"],
    tags: ["pain_intensity", "relief"]
  },

  {
    id: "SCH-Q05",
    text: "Wie stark sind Ihre Schulterschmerzen bei Belastung / Bewegung?",
    type: "nrs_0_10",
    variants: ["short", "standard", "deep"],
    tags: ["pain_intensity_active", "relief"]
  },

  // --- GRUPPE 2: BEWEGUNG & FUNKTION (Standard + Deep) ------

  {
    id: "SCH-Q06",
    text: "Können Sie Ihren Arm über Schulterhöhe heben?",
    type: "select",
    options: [
      { value: "full", label: "Ja, problemlos bis über den Kopf" },
      { value: "painful_arc", label: "Ja, aber mit Schmerz in einem bestimmten Bereich" },
      { value: "limited_60", label: "Nur bis ca. 60–90°, dann stoppt der Schmerz" },
      { value: "not_possible", label: "Kaum möglich, Schulter ist sehr steif" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["range_of_motion", "SCHU-001", "SCHU-002", "SCHU-003"]
  },

  {
    id: "SCH-Q07",
    text: "In welchem Bereich beim Armheben haben Sie den meisten Schmerz?",
    type: "select",
    condition: { fact: "SCH-Q06", operator: "equal", value: "painful_arc" },
    options: [
      { value: "arc_60_120", label: "Zwischen ca. 60° und 120° (mittlerer Bereich — schmerzhafter Bogen)" },
      { value: "arc_above_120", label: "Erst über 120° aufwärts Richtung Kopf" },
      { value: "full_arc", label: "Den ganzen Weg über" }
    ],
    variants: ["standard", "deep"],
    tags: ["painful_arc", "SCHU-001", "SCHU-002", "SCHU-005"]
  },

  {
    id: "SCH-Q08",
    text: "Haben Sie deutliche Einschränkungen beim Drehen des Arms nach außen (z.B. Schlafen auf der Seite, Hände hinter den Kopf legen)?",
    type: "select",
    options: [
      { value: "no_restriction", label: "Nein, keine Einschränkung" },
      { value: "painful_but_possible", label: "Schmerzhaft, aber noch möglich" },
      { value: "significantly_restricted", label: "Deutlich eingeschränkt" },
      { value: "impossible", label: "Kaum oder nicht möglich" }
    ],
    variants: ["standard", "deep"],
    tags: ["external_rotation", "SCHU-003", "SCHU-004"]
  },

  {
    id: "SCH-Q09",
    text: "Können Sie Ihren Arm gut nach hinten bringen (z.B. Rücken kratzen, BH-Verschluss)?",
    type: "select",
    options: [
      { value: "no_problem", label: "Problemlos" },
      { value: "painful", label: "Schmerzhaft" },
      { value: "limited", label: "Deutlich eingeschränkt" }
    ],
    variants: ["standard", "deep"],
    tags: ["internal_rotation", "SCHU-003"]
  },

  {
    id: "SCH-Q10",
    text: "Merken Sie eine Schwäche im Arm, wenn Sie ihn seitlich halten oder nach außen drehen gegen Widerstand?",
    type: "select",
    options: [
      { value: "no_weakness", label: "Keine Schwäche" },
      { value: "mild_weakness", label: "Etwas schwächer als die andere Seite" },
      { value: "significant_weakness", label: "Deutliche Kraftminderung" },
      { value: "cannot_hold", label: "Arm fällt nach unten / kann nicht gehalten werden (Drop-Arm)" }
    ],
    variants: ["standard", "deep"],
    tags: ["weakness", "SCHU-001", "SCHU-006"]
  },

  // --- GRUPPE 3: SCHMERZCHARAKTER (Standard + Deep) ---------

  {
    id: "SCH-Q11",
    text: "Haben Sie nachts Schmerzen in der Schulter, die Sie aufwecken oder das Schlafen verhindern?",
    type: "select",
    options: [
      { value: "no_night_pain", label: "Nein, keine Nachtschmerzen" },
      { value: "side_dependent", label: "Nur wenn ich auf der betroffenen Seite liege" },
      { value: "all_positions", label: "Auch in anderen Schlafpositionen" },
      { value: "wakes_me", label: "Ja, weckt mich aus dem Schlaf" }
    ],
    variants: ["standard", "deep"],
    tags: ["night_pain", "SCHU-001", "SCHU-003"]
  },

  {
    id: "SCH-Q12",
    text: "Wie würden Sie den Charakter des Schulterschmerzes beschreiben?",
    type: "multiselect",
    options: [
      { value: "dull_aching", label: "Dumpf-drückend" },
      { value: "sharp_stabbing", label: "Scharf / stechend" },
      { value: "burning", label: "Brennend / elektrisierend" },
      { value: "grinding", label: "Reiben / Knirschen spürbar" },
      { value: "deep_aching", label: "Tief innen / schwer zu lokalisieren" }
    ],
    variants: ["standard", "deep"],
    tags: ["pain_quality", "SCHU-003", "SCHU-006"]
  },

  {
    id: "SCH-Q13",
    text: "Haben Sie ein Reiben oder Knirschen in der Schulter gespürt oder gehört?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["crepitus", "SCHU-004"]
  },

  {
    id: "SCH-Q14",
    text: "Haben Sie das Gefühl, dass die Schulter instabil ist, herausspringt oder sich unzuverlässig anfühlt?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["instability", "SCHU-007"]
  },

  // --- GRUPPE 4: HALS & AUSSTRAHLUNG (Standard + Deep) ------

  {
    id: "SCH-Q15",
    text: "Strahlt der Schmerz bis in die Hand oder die Finger aus?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["radiation_fingers", "SCHU-006"],
    note: "Bei Ja: Zervikobrachialgie wahrscheinlicher — Follow-up-Fragen zu HWS"
  },

  {
    id: "SCH-Q16",
    text: "Verschlimmert sich der Schmerz, wenn Sie den Kopf zur betroffenen Seite drehen oder den Kopf rückwärts und zur Seite neigen?",
    type: "yes_no",
    condition: { fact: "SCH-Q15", operator: "equal", value: true },
    variants: ["standard", "deep"],
    tags: ["spurling_sign", "SCHU-006"],
    note: "Spurling-Manöver Äquivalent — positiv = Zervikale Ursache"
  },

  {
    id: "SCH-Q17",
    text: "Haben Sie gleichzeitig Nackenschmerzen oder Beschwerden, die vom Nacken ausgehen?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["neck_pain_concurrent", "SCHU-006"]
  },

  // --- GRUPPE 5: SPEZIFISCHE ANAMNESE (Deep) ----------------

  {
    id: "SCH-Q18",
    text: "Haben Sie Diabetes, eine Schilddrüsenerkrankung oder eine andere Stoffwechselerkrankung?",
    type: "yes_no",
    variants: ["deep"],
    tags: ["metabolic", "SCHU-003"],
    note: "Diabetes und Hypothyreose signifikant mit Frozen Shoulder assoziiert (LR+ 2.4)"
  },

  {
    id: "SCH-Q19",
    text: "Hatten Sie die Schulter in letzter Zeit immobilisiert (Schlinge, Gips, Operation, Verletzung)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["immobilization", "SCHU-003"]
  },

  {
    id: "SCH-Q20",
    text: "Ist die Schulter bei einem Sturz jemals ausgekugelt oder verrenkt worden?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["dislocation_history", "SCHU-007"]
  },

  {
    id: "SCH-Q21",
    text: "Betreiben Sie Überkopfsport oder -arbeit (z.B. Schwimmen, Tennis, Volleyball, Maler, Elektriker)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["overhead_activity", "SCHU-001", "SCHU-002", "SCHU-007", "SCHU-008"]
  },

  {
    id: "SCH-Q22",
    text: "Haben Sie Schmerzen beim Greifen über den Körper zur Gegenseite (z.B. Anschnallen im Auto)?",
    type: "yes_no",
    variants: ["deep"],
    tags: ["cross_arm_adduction", "SCHU-005"],
    note: "Cross-arm adduction test — spezifisch für AC-Gelenk-Pathologie"
  },

  {
    id: "SCH-Q23",
    text: "Haben Sie nach einem Trauma auf die Schulteröberseite (Sturz auf die Schulter) begonnen zu schmerzen?",
    type: "yes_no",
    condition: { fact: "SCH-Q02", operator: "equal", value: "trauma_acute" },
    variants: ["standard", "deep"],
    tags: ["ac_trauma", "SCHU-005"]
  },

  {
    id: "SCH-Q24",
    text: "Haben Sie Schmerzen oder Empfindlichkeit im Bereich der langen Bizepssehne (vordere Schulterseite, bei Armbeugung gegen Widerstand)?",
    type: "yes_no",
    variants: ["deep"],
    tags: ["biceps_tendon", "SCHU-008"]
  }
];

// ============================================================
// DIAGNOSEN-BIBLIOTHEK: SCHULTER
// ============================================================

const SCHULTER_DIAGNOSES = {

  "SCHU-001": {
    id: "SCHU-001",
    name: "Rotatorenmanschetten-Läsion",
    name_en: "Rotator Cuff Tear (partial or full thickness)",
    icd10: "M75.1",
    category: "structural",
    prevalence_note: "Häufigste Ursache von Schulterschmerz >45 Jahre; MRT-Prävalenz asymptomatischer RC-Läsion: 25% (>60J.) bis 50% (>70J.)",
    key_features: [
      "Schmerzhafter Bogen (Painful Arc) 60–120°",
      "Schwäche in Abduktion und/oder Außenrotation",
      "Nachtschmerzen (besonders bei Schlafen auf betroffener Seite)",
      "Drop-Arm-Zeichen bei kompletter Ruptur",
      "Alter >45 (degenerativ) oder Trauma bei Jüngeren"
    ],
    clinical_tests: [
      { test: "Empty Can Test (Jobe)", sensitivity: 0.69, specificity: 0.66, lr_plus: 2.03, lr_minus: 0.47 },
      { test: "Drop Arm Sign", sensitivity: 0.35, specificity: 0.88, lr_plus: 2.92, lr_minus: 0.74, note: "Hohe Spezifität für komplette Ruptur" },
      { test: "Painful Arc (60–120°)", sensitivity: 0.53, specificity: 0.76, lr_plus: 2.21, lr_minus: 0.62 },
      { test: "Infraspinatus Test (ER Kraft)", sensitivity: 0.42, specificity: 0.90, lr_plus: 4.20, lr_minus: 0.64 }
    ],
    imaging_recommendation: {
      first_line: "Ultraschall Schulter (kostengünstig, dynamisch, Sehnendicke und -diskontinuität)",
      second_line: "MRT Schulter ohne KM (Ausdehnung der Läsion, Retraktion, Atrophie)",
      xray: "Röntgen nur bei Verdacht auf knöcherne Begleitverletzung / Arthrose"
    },
    next_steps: [
      "Orthopädisches Konsil zur Behandlungsplanung (konservativ vs. operativ)",
      "Physiotherapie: Kräftigung Rotatorenmanschette, Skapulastabilisierung",
      "NSAR kurzfristig bei akuter Phase",
      "Subakromiale Injektion erwägen (Kortison) bei therapieresistentem Schmerz"
    ],
    factors: {
      relief: -3,    // Hohe Schmerzbelastung
      range: -2,     // Bewegungseinschränkung
      re_energize: -1
    },
    references: ["Hermans J et al. JAMA 2013", "Hegedus EJ et al. BJSM 2012"]
  },

  "SCHU-002": {
    id: "SCHU-002",
    name: "Subakromiales Impingement-Syndrom",
    name_en: "Subacromial Impingement Syndrome",
    icd10: "M75.1",
    category: "functional_structural",
    prevalence_note: "Häufigste Schulterdiagnose überhaupt — 44–65% aller Schulterschmerzpatienten",
    key_features: [
      "Schmerzhafter Bogen 60–120° bei aktiver Abduktion",
      "Schmerz unter dem Akromion lateral",
      "Hawkins-Kennedy Test positiv",
      "Neer-Zeichen positiv",
      "Keine/minimale passive Bewegungseinschränkung (Unterschied zu Frozen Shoulder!)",
      "Typisch: Überkopfarbeit oder -sport"
    ],
    clinical_tests: [
      { test: "Hawkins-Kennedy Test", sensitivity: 0.79, specificity: 0.59, lr_plus: 1.93, lr_minus: 0.36, note: "Bestes Screening für Impingement" },
      { test: "Neer's Sign", sensitivity: 0.72, specificity: 0.60, lr_plus: 1.80, lr_minus: 0.47 },
      { test: "Painful Arc", sensitivity: 0.53, specificity: 0.76, lr_plus: 2.21, lr_minus: 0.62 }
    ],
    imaging_recommendation: {
      first_line: "Ultraschall Schulter (Bursitis, partielle RC-Läsion, Sehnenverkalkung)",
      second_line: "MRT bei therapieresistenter Symptomatik (>3 Monate)",
      xray: "Röntgen in 2 Ebenen + Outlet-View (Akromionform Typ I/II/III)"
    },
    next_steps: [
      "Physiotherapie: Rotatorenmanschetten-Kräftigung, Skapulastabilisierung, Dehnnung M. pectoralis minor",
      "Haltungskorrektur, ergonomische Beratung",
      "Subakromiale Kortisoninjektion bei akuter Bursitis (kurzfristig wirksam)",
      "Stoßwellentherapie bei verkalkter Tendinitis (Evidenz: Cochrane 2003)"
    ],
    factors: {
      relief: -2,
      range: -1
    },
    references: ["Çalış M et al. Ann Rheum Dis 2000", "Ainsworth R, Lewis J. Manual Therapy 2007"]
  },

  "SCHU-003": {
    id: "SCHU-003",
    name: "Adhäsive Kapsulitis (Frozen Shoulder)",
    name_en: "Adhesive Capsulitis",
    icd10: "M75.0",
    category: "structural",
    prevalence_note: "2–5% der Bevölkerung; Frauen 60%, Gipfel 40–60 Jahre; Diabetes 3–5x häufiger betroffen",
    phases: [
      { name: "Phase 1: Einfrierend (Freezing)", duration: "2–9 Monate", characteristics: "Starke Schmerzen, beginnende Steifigkeit" },
      { name: "Phase 2: Eingefroren (Frozen)", duration: "4–12 Monate", characteristics: "Rückgang Schmerz, maximale Steifigkeit" },
      { name: "Phase 3: Auftauend (Thawing)", duration: "5–26 Monate", characteristics: "Schrittweise Rückkehr der Beweglichkeit" }
    ],
    key_features: [
      "Passive Außenrotation als ERSTE und stärkste Einschränkung",
      "Passive Abduktion eingeschränkt (Kapselmuster)",
      "Passive Innenrotation eingeschränkt",
      "Schleichender Beginn ohne erkennbaren Auslöser",
      "Nachtschmerzen in Phase 1",
      "Diabetes / Hypothyreose als Risikofaktoren",
      "Vorangegangene Immobilisierung"
    ],
    clinical_tests: [
      { test: "Passive ER < 50% der Gegenseite", sensitivity: 0.88, specificity: 0.81, lr_plus: 4.63, note: "Stärkster Einzelindikator" },
      { test: "Passive Abduktion < 90°", sensitivity: 0.70, specificity: 0.90, lr_plus: 7.00 },
      { test: "Kapselmuster (ER > AB > IR)", sensitivity: 0.84, specificity: 0.83 }
    ],
    imaging_recommendation: {
      first_line: "Klinische Diagnose ausreichend in typischen Fällen",
      second_line: "Ultraschall (verdickte Kapsel rotator interval, axilläre Tasche)",
      mri: "MRT bei Unklarheit oder Therapieresistenz (Kapseldicke, Synovialitis)"
    },
    next_steps: [
      "Aufklärung über natürlichen Verlauf (12–42 Monate bis Vollremission — aber vollständige Erholung bei ~90%)",
      "Phase 1: Schmerzmanagement, sanfte pendelnde Übungen, kein forciertes Stretching",
      "Phase 2: Progressive Mobilisierung, PNF-Techniken",
      "Glenohumerale Injektion (Hydrodilation / Kortison) bei therapieresistenter Phase 1",
      "MUA (Manipulation Under Anesthesia) oder Arthroskopische Kapsulotomie als Eskalation"
    ],
    factors: {
      relief: -3,
      range: -4,
      re_energize: -1
    },
    references: ["Zuckerman JD, Rokito A. J Shoulder Elbow Surg 2011", "Bunker T. Curr Orthop 2009"]
  },

  "SCHU-004": {
    id: "SCHU-004",
    name: "Glenohumerale Omarthrose",
    name_en: "Glenohumeral Osteoarthritis",
    icd10: "M19.01",
    category: "degenerative",
    prevalence_note: "Deutlich seltener als Knie-/Hüftarthrose: ~16% der >65-Jährigen radiologisch, symptomatisch ~5%",
    key_features: [
      "Alter >55 (typisches Auftreten)",
      "Chronisch progredient",
      "Knirschen / Reiben (Krepitus) bei Bewegung",
      "Globale Bewegungseinschränkung (alle Ebenen, passiv eingeschränkt)",
      "Morgensteifigkeit (kurz, < 30 min)",
      "Ruheschmerz bei fortgeschrittener Arthrose",
      "Vorgeschichte: Schultertraumata, RC-Ruptur, frühere Instabilität"
    ],
    clinical_tests: [
      { test: "Krepitus bei passiver Bewegung", sensitivity: 0.74, specificity: 0.67, lr_plus: 2.24 },
      { test: "Globale passive ROM-Einschränkung", sensitivity: 0.65, specificity: 0.78, lr_plus: 2.95 }
    ],
    imaging_recommendation: {
      first_line: "Röntgen Schulter in 2 Ebenen + axilläre Aufnahme (Gelenkspaltverschmälerung, Osteophyten, posteriore Glenoidverlust)",
      confirmation: "MRT oder CT bei OP-Planung"
    },
    next_steps: [
      "Physiotherapie: Gelenkerhaltende Beweglichkeitsübungen, Kräftigung",
      "Analgesie: Paracetamol / NSAR (kurzfristig)",
      "Intraartikuäre Kortison- oder Hyaluroninjektionen",
      "Bei Versagen: Schulterprothese (Hemi- oder Totalendoprothese, inverse Prothese)"
    ],
    factors: {
      relief: -3,
      range: -3
    },
    references: ["Arden N, Nevitt MC. Arthritis Care Res 2006"]
  },

  "SCHU-005": {
    id: "SCHU-005",
    name: "AC-Gelenk-Pathologie (Arthrose / Sprengung)",
    name_en: "Acromioclavicular Joint Pathology",
    icd10: "M75.5",
    category: "structural",
    key_features: [
      "Schmerz am oberen Schultereck (Schulter-Hals-Übergang)",
      "Cross-Arm-Adduktionstest positiv (größter Schmerz beim Überkreuzen des Arms)",
      "Druckschmerz direkt über dem AC-Gelenk",
      "Schmerz bei Armheben > 120° (End-range)",
      "Junge Sportler: nach direktem Trauma (Sturz auf Schulter)",
      "Ältere Patienten: isolierte AC-Arthrose ohne Trauma"
    ],
    clinical_tests: [
      { test: "Cross-Arm Adduction Test", sensitivity: 0.77, specificity: 0.79, lr_plus: 3.67, lr_minus: 0.29 },
      { test: "AC Joint Palpation Tenderness", sensitivity: 0.96, specificity: 0.10, note: "Hochsensitiv, gering spezifisch" },
      { test: "O'Brien Active Compression (für AC)", sensitivity: 0.41, specificity: 0.95, lr_plus: 8.20, note: "Bei Schmerz ÜBER dem AC — nicht tief" }
    ],
    imaging_recommendation: {
      first_line: "Röntgen (Zanca-Aufnahme: 10° Kranialwinkel, niedrig dosiert)",
      second_line: "MRT oder Ultraschall bei Weichteilbeteiligung"
    },
    next_steps: [
      "Akute Sprengung Tossy I-II: Physiotherapie, Schlinge kurzfristig",
      "Tossy III: kontrovers — operativ bei hohem sportlichem Anspruch",
      "AC-Arthrose: lokale Injektion (Kortison), Physiotherapie",
      "Orthopädisches Konsil bei Tossy III+"
    ],
    factors: {
      relief: -2,
      range: -1
    }
  },

  "SCHU-006": {
    id: "SCHU-006",
    name: "Zervikogene Schulter / Zervikobrachialgie",
    name_en: "Cervicogenic Shoulder Pain / Cervicobrachialgia",
    icd10: "M54.2",
    category: "referred_pain",
    prevalence_note: "Ca. 5% aller Schulterschmerzpatienten haben zervikal bedingte Symptome; häufig fehldiagnostiziert",
    key_features: [
      "Schmerz strahlt bis in die Hand oder einzelne Finger aus",
      "Nackenbeweglungen reproduzieren den Schulter-/Armschmerz",
      "Spurling-Test positiv (Kompression + Seitenneigung = Schmerzprovokation)",
      "Dermatomales Muster: C5 (lateraler Arm), C6 (Daumen/Zeigefinger), C7 (Mittel-/Ringfinger), C8/T1 (Kleinfinger)",
      "Möglicherweise Reflexabschwächung oder Sensibilitätsstörung",
      "SCHULTERBEWEGUNGEN meist SCHMERZFREI oder wenig schmerzhaft"
    ],
    clinical_tests: [
      { test: "Spurling Compression Test", sensitivity: 0.30, specificity: 0.93, lr_plus: 4.29, lr_minus: 0.75 },
      { test: "ULNT-1 (Upper Limb Neurodynamic Test)", sensitivity: 0.72, specificity: 0.33, note: "Gut als Screening, wenig spezifisch" },
      { test: "Distraction Test (Entlastung HWS)", sensitivity: 0.44, specificity: 0.90, lr_plus: 4.40 },
      { test: "Neck Active ROM — Schmerzreproduktion", sensitivity: 0.56, specificity: 0.64 }
    ],
    imaging_recommendation: {
      first_line: "MRT HWS (Bandscheibenvorfall, Foraminostenose, Myelopathie ausschließen)",
      if_myelopathy_signs: "MRT HWS dringend (Myelopathie-Ausschluss!)"
    },
    next_steps: [
      "Behandlung der zervikalen Ursache (HWS-Mobilisation, Traktion, neurale Mobilisation)",
      "KEINE lokale Schulterbehandlung als Hauptfokus",
      "Bildgebung HWS wenn Radikulopathiezeichen vorhanden",
      "Neurologie/Orthopädie-Konsil bei Schwäche oder Sensibilitätsstörung"
    ],
    factors: {
      relief: -2,
      range: -1
    },
    references: ["Wainner RS et al. Spine 2003", "Rubinstein SM et al. J Manipulative Physiol Ther 2007"]
  },

  "SCHU-007": {
    id: "SCHU-007",
    name: "Schulterinstabilität / Bankart-Läsion / SLAP",
    name_en: "Glenohumeral Instability / Bankart / SLAP Lesion",
    icd10: "M24.41",
    category: "structural",
    key_features: [
      "Junge Patienten (< 35 Jahre, typisch Sportler)",
      "Vorgeschichte: Schulterausrenkung oder -subluxation",
      "Apprehension-Test positiv (Angst/Schmerz bei Außenrotation + Abduktion)",
      "Relocation-Test positiv",
      "Gefühl der Schulter-Instabilität, 'gibt nach'",
      "Überkopfsportler: SLAP-Verdacht"
    ],
    clinical_tests: [
      { test: "Apprehension Test", sensitivity: 0.53, specificity: 0.99, lr_plus: 53.0, note: "Sehr hochspezifisch wenn positiv" },
      { test: "Relocation Test", sensitivity: 0.57, specificity: 0.87, lr_plus: 4.38 },
      { test: "Anterior Release Test", sensitivity: 0.92, specificity: 0.89, lr_plus: 8.36 },
      { test: "O'Brien Test (SLAP)", sensitivity: 0.47, specificity: 0.55, note: "Moderat, MRT für SLAP nötig" }
    ],
    imaging_recommendation: {
      first_line: "MRT-Arthrographie Schulter (Labrumläsion, Bankart, HAGL, SLAP)",
      xray: "Röntgen (Hillsachs-Delle, knöcherne Bankart, Glenoidverlust)"
    },
    next_steps: [
      "Konservativ bei erster Luxation / Hyperlaxizität: Stabilisierungstherapie 3–6 Monate",
      "Operativ bei rezidivierender Luxation oder knöchernem Bankart: Arthroskopische Bankart-Repair",
      "SLAP-Läsion: arthroskopische SLAP-Repair oder Tenotomie/Tenodese Bizeps"
    ],
    factors: {
      relief: -2,
      range: -2
    }
  },

  "SCHU-008": {
    id: "SCHU-008",
    name: "Bizepstendinopathie / SLAP-Läsion (lange Bizepssehne)",
    name_en: "Long Head Biceps Tendinopathy / SLAP Lesion",
    icd10: "M75.2",
    category: "structural",
    key_features: [
      "Anteriorer Schulter-/Bizepsrinne-Schmerz",
      "Speed-Test positiv (Flexion gegen Widerstand mit gestrecktem Ellenbogen)",
      "Yergason-Test positiv (Supination gegen Widerstand)",
      "O'Brien-Test positiv (tief = intrartikulär, Richtung SLAP)",
      "Überkopfsportler / Wurfathleten",
      "Oft kombiniert mit RC- oder Impingement-Pathologie"
    ],
    clinical_tests: [
      { test: "Speed Test", sensitivity: 0.32, specificity: 0.75, lr_plus: 1.28, note: "Isoliert wenig diagnostisch" },
      { test: "Yergason Test", sensitivity: 0.43, specificity: 0.79 },
      { test: "O'Brien Test (Schmerz tief intraarticular)", sensitivity: 0.63, specificity: 0.73 }
    ],
    imaging_recommendation: {
      first_line: "Ultraschall (Tendinopathie, Tenosynovitis, partielle Ruptur)",
      second_line: "MRT-Arthrographie (SLAP-Klassifikation)"
    },
    next_steps: [
      "Physiotherapie: Bizepsexzentrisch, Schulterblatt-Stabilisierung",
      "Ultraschallgesteuerte Injektion peritendineär (kein intratendinäres Kortison!)",
      "Arthroskopische Tenotomie oder Tenodese bei persistierender Symptomatik"
    ],
    factors: {
      relief: -1,
      range: -1
    }
  }
};

// ============================================================
// CDSS-REGELN: SCHULTER
// Format: json-rules-engine kompatibel
// Bewertungsprinzip: Jede Regel produziert ein Event mit
// diagnosis_id + probability_score (0–100)
// Mehrere Regeln können dieselbe Diagnose bedienen:
//   - Hohe Wahrscheinlichkeit (score > 70)
//   - Mittlere Wahrscheinlichkeit (score 45–70)
//   - Niedrige Wahrscheinlichkeit / Ausschluss (score < 45)
// ============================================================

const SCHULTER_RULES = [

  // ─── SCHU-001: Rotatorenmanschetten-Läsion ───────────────

  {
    name: "SCHU-001-HOCH: RC-Läsion — komplette Ruptur wahrscheinlich",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q06", operator: "in", value: ["limited_60", "not_possible"] },
        { fact: "SCH-Q10", operator: "equal", value: "cannot_hold" }
      ],
      any: [
        { fact: "patient_age", operator: "greaterThanInclusive", value: 50 },
        { fact: "SCH-Q02", operator: "equal", value: "trauma_acute" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-001", probability_score: 88, label: "Sehr wahrscheinlich" }
    }
  },

  {
    name: "SCHU-001-MITTEL: RC-Läsion — partielle Ruptur / Tendinopathie",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q06", operator: "equal", value: "painful_arc" },
        { fact: "SCH-Q07", operator: "equal", value: "arc_60_120" }
      ],
      any: [
        { fact: "SCH-Q11", operator: "in", value: ["all_positions", "wakes_me"] },
        { fact: "SCH-Q10", operator: "in", value: ["mild_weakness", "significant_weakness"] },
        { fact: "patient_age", operator: "greaterThanInclusive", value: 45 }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-001", probability_score: 65, label: "Wahrscheinlich" }
    }
  },

  // ─── SCHU-002: Impingement ───────────────────────────────

  {
    name: "SCHU-002-HOCH: Subakromiales Impingement",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q06", operator: "equal", value: "painful_arc" },
        { fact: "SCH-Q07", operator: "equal", value: "arc_60_120" },
        { fact: "SCH-Q08", operator: "in", value: ["no_restriction", "painful_but_possible"] },
        { fact: "SCH-Q10", operator: "in", value: ["no_weakness", "mild_weakness"] }
      ],
      any: [
        { fact: "SCH-Q21", operator: "equal", value: true },
        { fact: "SCH-Q01", operator: "contains", value: "lateral" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-002", probability_score: 78, label: "Wahrscheinlich" }
    }
  },

  {
    name: "SCHU-002-MITTEL: Impingement — Überkopfbetonte Symptomatik",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q21", operator: "equal", value: true },
        { fact: "SCH-Q06", operator: "in", value: ["painful_arc", "limited_60"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-002", probability_score: 55, label: "Möglich" }
    }
  },

  // ─── SCHU-003: Frozen Shoulder ───────────────────────────

  {
    name: "SCHU-003-HOCH: Frozen Shoulder — Vollbild",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q06", operator: "equal", value: "not_possible" },
        { fact: "SCH-Q08", operator: "in", value: ["significantly_restricted", "impossible"] },
        { fact: "SCH-Q09", operator: "in", value: ["painful", "limited"] }
      ],
      any: [
        { fact: "patient_age", operator: "between", value: [40, 65] },
        { fact: "SCH-Q18", operator: "equal", value: true },
        { fact: "SCH-Q19", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-003", probability_score: 85, label: "Sehr wahrscheinlich" }
    }
  },

  {
    name: "SCHU-003-MITTEL: Frozen Shoulder — frühe Phase / Diabetesrisiko",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q08", operator: "in", value: ["significantly_restricted", "impossible"] }
      ],
      any: [
        { fact: "SCH-Q18", operator: "equal", value: true },
        {
          all: [
            { fact: "SCH-Q02", operator: "equal", value: "insidious" },
            { fact: "SCH-Q11", operator: "in", value: ["all_positions", "wakes_me"] }
          ]
        }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-003", probability_score: 60, label: "Wahrscheinlich" }
    }
  },

  // ─── SCHU-004: Omarthrose ────────────────────────────────

  {
    name: "SCHU-004-HOCH: Omarthrose — typisches Vollbild",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q13", operator: "equal", value: true },
        { fact: "SCH-Q03", operator: "in", value: ["chronic", "very_chronic"] },
        { fact: "patient_age", operator: "greaterThanInclusive", value: 55 }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-004", probability_score: 75, label: "Wahrscheinlich" }
    }
  },

  // ─── SCHU-005: AC-Gelenk ─────────────────────────────────

  {
    name: "SCHU-005-HOCH: AC-Gelenk-Pathologie",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q01", operator: "contains", value: "superior" }
      ],
      any: [
        { fact: "SCH-Q22", operator: "equal", value: true },
        { fact: "SCH-Q23", operator: "equal", value: true },
        {
          all: [
            { fact: "SCH-Q02", operator: "equal", value: "trauma_acute" },
            { fact: "SCH-Q01", operator: "contains", value: "superior" }
          ]
        }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-005", probability_score: 72, label: "Wahrscheinlich" }
    }
  },

  // ─── SCHU-006: Zervikogene Schulter ──────────────────────

  {
    name: "SCHU-006-HOCH: Zervikobrachialgie — typisches Muster",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q15", operator: "equal", value: true },
        { fact: "SCH-Q16", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-006", probability_score: 82, label: "Sehr wahrscheinlich" }
    }
  },

  {
    name: "SCHU-006-MITTEL: Zervikogene Schulter — Nacken + Ausstrahlung",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q17", operator: "equal", value: true },
        { fact: "SCH-Q15", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-006", probability_score: 62, label: "Möglich — HWS abklären" }
    }
  },

  // ─── SCHU-007: Instabilität ───────────────────────────────

  {
    name: "SCHU-007-HOCH: Schulterinstabilität",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q14", operator: "equal", value: true },
        { fact: "SCH-Q20", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-007", probability_score: 84, label: "Sehr wahrscheinlich" }
    }
  },

  {
    name: "SCHU-007-MITTEL: Instabilität — jung + Überkopfsport ohne Luxation",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q14", operator: "equal", value: true },
        { fact: "patient_age", operator: "lessThanInclusive", value: 35 },
        { fact: "SCH-Q21", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-007", probability_score: 55, label: "Möglich" }
    }
  },

  // ─── SCHU-008: Bizepstendinopathie ────────────────────────

  {
    name: "SCHU-008-MITTEL: Bizepstendinopathie / SLAP",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "schulter" },
        { fact: "SCH-Q01", operator: "contains", value: "anterior" },
        { fact: "SCH-Q24", operator: "equal", value: true }
      ],
      any: [
        { fact: "SCH-Q21", operator: "equal", value: true },
        { fact: "SCH-Q02", operator: "equal", value: "overuse" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "SCHU-008", probability_score: 62, label: "Wahrscheinlich" }
    }
  }
];

// ============================================================
// AUSGABE-LOGIK: Probability Scoring → Finale Differentialdiagnosen
// ============================================================

const SCHULTER_OUTPUT_CONFIG = {
  // Wie viele Differentialdiagnosen maximal ausgeben?
  max_differentials_short: 2,
  max_differentials_standard: 4,
  max_differentials_deep: 6,

  // Mindest-Score für Aufnahme in die Ausgabe
  min_score_to_include: 40,

  // Reihenfolge: höchster Score zuerst
  sort: "score_desc",

  // Hinweis-Regeln: bei bestimmten Kombinationen Warnung ausgeben
  combination_alerts: [
    {
      condition: { diagnoses_in_top3: ["SCHU-001", "SCHU-002"] },
      message: "Oft kombiniert: Rotatorenmanschetten-Läsion und Impingement. Ultraschall klärt ab."
    },
    {
      condition: { diagnoses_in_top3: ["SCHU-006"] },
      message: "Zervikaler Ursprung wahrscheinlich — HWS-Untersuchung vor Schulterbehandlung empfohlen."
    }
  ]
};

export {
  SCHULTER_QUESTIONS,
  SCHULTER_DIAGNOSES,
  SCHULTER_RULES,
  SCHULTER_OUTPUT_CONFIG
};
