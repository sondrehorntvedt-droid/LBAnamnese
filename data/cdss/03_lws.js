/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 03: LENDENWIRBELSÄULE (LWS)
 *
 * Abgedeckte Differentialdiagnosen (8):
 *  LWS-001  Lumbaler Bandscheibenvorfall / Radikulopathie
 *  LWS-002  Lumbales Facettengelenk-Syndrom
 *  LWS-003  Lumbale Spinalkanalstenose
 *  LWS-004  ISG-Dysfunktion / Sakroiliitis
 *  LWS-005  Piriformis-Syndrom
 *  LWS-006  Spondylolisthese / Spondylolyse
 *  LWS-007  Myofasziales Schmerzsyndrom (LWS / M. psoas / QL)
 *  LWS-008  Axiale Spondyloarthritis (axSpA / M. Bechterew)
 *
 * Quellen:
 *  - Chou R et al.: Diagnosis and treatment of low back pain.
 *    Ann Intern Med 2007.
 *  - van Kleef M et al.: Evidence-based guidelines for interventional pain medicine
 *    according to clinical diagnoses. Pain Practice 2010.
 *  - Hancock MJ et al.: Diagnostic accuracy of the SLR and clinical signs for
 *    lumbar nerve root compression. Spine 2011.
 *  - ASAS/EULAR Recommendations for SpA 2022.
 *  - Laslett M et al.: Diagnosis of sacroiliac joint pain. Man Ther 2005.
 *  - National Institute for Health and Care Excellence (NICE) NG59 (2022).
 */

const LWS_QUESTIONS = [

  // --- GRUPPE 1: BASIS (alle Varianten) ---

  {
    id: "LWS-Q01",
    text: "Wo genau ist Ihr Rückenschmerz am schlimmsten?",
    type: "multiselect",
    options: [
      { value: "lumbar_central", label: "Mittig im unteren Rücken" },
      { value: "lumbar_paravertebral", label: "Neben der Wirbelsäule links/rechts" },
      { value: "buttock", label: "Gesäß" },
      { value: "sacral", label: "Kreuzbein / direkt über dem Steiß" },
      { value: "groin", label: "Leiste" },
      { value: "radiating_leg", label: "Strahlt in das Bein aus" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["location", "all_diagnoses"]
  },

  {
    id: "LWS-Q02",
    text: "Strahlt der Schmerz in ein Bein aus? Wenn ja, wie weit?",
    type: "select",
    options: [
      { value: "no_radiation", label: "Nein, bleibt im Rücken/Gesäß" },
      { value: "to_knee", label: "Bis zum Oberschenkel / Knie" },
      { value: "below_knee", label: "Bis unter das Knie" },
      { value: "to_foot", label: "Bis in den Fuß / die Zehen" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["radiation", "LWS-001", "LWS-003"],
    note: "Strahlung unter Knie = Radikulopathie bis Beweis des Gegenteils"
  },

  {
    id: "LWS-Q03",
    text: "Falls der Schmerz ins Bein ausstrahlt — in welchen Bereich?",
    type: "select",
    condition: { fact: "LWS-Q02", operator: "in", value: ["below_knee", "to_foot"] },
    options: [
      { value: "l4_medial", label: "Innenseite Unterschenkel / große Zehe (L4)" },
      { value: "l5_dorsal", label: "Fußrücken / Großzehe / 2.–3. Zehe (L5)" },
      { value: "s1_plantar", label: "Fußsohle / Kleinfinger / Ferse (S1)" },
      { value: "anterior_thigh", label: "Vordere Oberschenkelseite (L2–L3–L4 femoral)" },
      { value: "diffuse", label: "Diffus / nicht klar lokalisierbar" }
    ],
    variants: ["standard", "deep"],
    tags: ["dermatome", "LWS-001"],
    note: "Dermatomales Muster = stärkster Hinweis auf segmentale Wurzelkompression"
  },

  {
    id: "LWS-Q04",
    text: "Haben Sie Taubheitsgefühl oder Kribbeln im Bein?",
    type: "select",
    options: [
      { value: "none", label: "Nein" },
      { value: "thigh", label: "Ja, im Oberschenkel" },
      { value: "lower_leg", label: "Ja, im Unterschenkel / Fuß" },
      { value: "saddle", label: "Ja, im Gesäß / Genitalbereich (Reithosenmuster)" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["sensory_symptoms", "LWS-001", "LWS-003"],
    alert_if: "saddle"
  },

  {
    id: "LWS-Q05",
    text: "Wie hat der Rückenschmerz begonnen?",
    type: "select",
    options: [
      { value: "acute_lift", label: "Plötzlich beim Heben / Bücken" },
      { value: "acute_twist", label: "Plötzlich nach Drehbewegung" },
      { value: "insidious", label: "Schleichend ohne klaren Auslöser" },
      { value: "post_overload", label: "Nach Überbelastung / langer Tätigkeit" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["onset"]
  },

  {
    id: "LWS-Q06",
    text: "Wann ist der Rückenschmerz am schlimmsten?",
    type: "multiselect",
    options: [
      { value: "forward_bend", label: "Beim Vorbeugen / Bücken" },
      { value: "extension", label: "Beim Hohlkreuz / Rückwärtsbiegen / längerem Stehen" },
      { value: "sitting", label: "Beim langen Sitzen (z.B. Autofahrt)" },
      { value: "walking", label: "Beim Gehen — wird mit der Zeit schlechter" },
      { value: "morning", label: "Morgens beim Aufstehen" },
      { value: "night", label: "Nachts (weckt mich auf)" },
      { value: "activity_improves", label: "Schmerz bessert sich mit Bewegung und Aktivität" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["mechanical_pattern", "LWS-001", "LWS-002", "LWS-003", "LWS-008"]
  },

  {
    id: "LWS-Q07",
    text: "Haben Sie Schmerzen beim langen Gehen, die sich bessern wenn Sie sich nach vorn lehnen oder absitzen?",
    type: "select",
    options: [
      { value: "yes_shopping_cart", label: "Ja — ich lehne mich beim Gehen vor oder brauche Pausen (Einkaufswagen-Zeichen)" },
      { value: "yes_but_mild", label: "Etwas, aber nicht so ausgeprägt" },
      { value: "no", label: "Nein" }
    ],
    variants: ["standard", "deep"],
    tags: ["neurogenic_claudication", "LWS-003"],
    note: "Einkaufswagen-Zeichen: pathognomonisch für lumbale Spinalkanalstenose (LR+ 4.0)"
  },

  {
    id: "LWS-Q08",
    text: "Haben Sie Schmerzen oder eine Schwäche beim Gehen auf Zehenspitzen (S1) oder Fersengehen (L4/L5)?",
    type: "select",
    options: [
      { value: "tiptoeing_weak", label: "Zehenspitzengang schwierig (S1)" },
      { value: "heel_weak", label: "Fersengehen schwierig (L4/L5)" },
      { value: "both", label: "Beides eingeschränkt" },
      { value: "normal", label: "Beides problemlos möglich" }
    ],
    variants: ["standard", "deep"],
    tags: ["motor_deficit", "LWS-001", "LWS-003"]
  },

  {
    id: "LWS-Q09",
    text: "Haben Sie Schmerzen direkt über dem Kreuzbein-Becken-Übergang — genau auf der Stelle, die Sie mit dem Finger zeigen können (ca. 1–2 cm medial von der hinteren Beckenschaufel)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["fortin_finger", "LWS-004"],
    note: "Fortin-Finger-Zeichen: spezifisch für ISG-Schmerz (LR+ 4.1)"
  },

  {
    id: "LWS-Q10",
    text: "Haben Sie Schmerzen beim einseitigen Beinheben (Heben eines ausgestreckten Beins im Liegen oder Stehen)?",
    type: "select",
    options: [
      { value: "yes_radiating", label: "Ja — und der Beinschmerz wird schlimmer (unter 60°)" },
      { value: "yes_back_only", label: "Ja — aber nur Rückenschmerz, kein Beinschmerz" },
      { value: "no", label: "Nein" }
    ],
    variants: ["standard", "deep"],
    tags: ["slr", "LWS-001"],
    note: "Lasègue / SLR: Beinschmerz unter 60° = Wurzelkompression (LR+ 3.7)"
  },

  {
    id: "LWS-Q11",
    text: "Haben Sie einen Knochenbau, der als 'schmal' oder 'zierlich' beschrieben wurde, oder ist jemand in Ihrer Familie an Rücken operiert worden?",
    type: "yes_no",
    variants: ["deep"],
    tags: ["stenosis_risk", "LWS-003"]
  },

  {
    id: "LWS-Q12",
    text: "Haben Sie tiefe Gesäßschmerzen, die beim langen Sitzen (harter Stuhl) und beim Autofahren schlimmer werden?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["piriformis", "LWS-005"]
  },

  {
    id: "LWS-Q13",
    text: "Betreiben Sie Überstreckungssport (Turnen, Leistungsturnen, Gewichtheben, Ringen, American Football)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["extension_sport", "LWS-006"]
  },

  {
    id: "LWS-Q14",
    text: "Haben Sie Schmerzen nachts, die Sie wecken, aber sich mit Bewegung bessern (nicht schlechter)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["inflammatory_night_pain", "LWS-008"],
    note: "ASAS-Kriterium für axiale SpA: inflammatorischer Rückenschmerz"
  },

  {
    id: "LWS-Q15",
    text: "Wie lange dauert die Morgensteifigkeit des Rückens?",
    type: "select",
    options: [
      { value: "none", label: "Keine" },
      { value: "lt_30", label: "Weniger als 30 Minuten" },
      { value: "30_60", label: "30 bis 60 Minuten" },
      { value: "gt_60", label: "Mehr als 60 Minuten (bis zu mehreren Stunden)" }
    ],
    variants: ["standard", "deep"],
    tags: ["morning_stiffness", "LWS-002", "LWS-008"]
  },

  {
    id: "LWS-Q16",
    text: "Haben Sie (oder jemand in Ihrer Familie) Schuppenflechte (Psoriasis), eine Darmerkrankung (Morbus Crohn, Colitis ulcerosa) oder Augenprobleme (Uveitis)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["spa_extraarticular", "LWS-008"],
    note: "Extraartikuläre Manifestationen der SpA: starker Hinweis auf axiale SpA / M. Bechterew"
  },

  {
    id: "LWS-Q17",
    text: "Haben Sie diffuse Muskelverspannungen im Rücken ohne klaren Brennpunkt, die auf Druck an verschiedenen Stellen (Triggerpunkte) reagieren?",
    type: "yes_no",
    variants: ["deep"],
    tags: ["trigger_points", "LWS-007"]
  },

  {
    id: "LWS-Q18",
    text: "Verschlimmert sich Ihr Rückenschmerz typischerweise stark bei Stress oder psychischer Belastung?",
    type: "yes_no",
    variants: ["deep"],
    tags: ["psychosocial", "LWS-007"]
  },

  {
    id: "LWS-Q19",
    text: "Haben Sie beim Beginn dieser Rückenschmerzepisode gespürt, als würde 'ein Stein' in den Rücken schießen (Hexenschuss)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["acute_disc", "LWS-001"]
  },

  {
    id: "LWS-Q20",
    text: "Haben Sie während oder nach dem Sport (besonders beim Kopfstand/Rückwärtssalto) Schmerzen im unteren Rücken, die nach vorne beugen nachlassen?",
    type: "yes_no",
    condition: { fact: "LWS-Q13", operator: "equal", value: true },
    variants: ["deep"],
    tags: ["spondylolysis", "LWS-006"]
  }
];

const LWS_DIAGNOSES = {

  "LWS-001": {
    id: "LWS-001",
    name: "Lumbaler Bandscheibenvorfall / Radikulopathie",
    name_en: "Lumbar Disc Herniation / Radiculopathy",
    icd10: "M51.1",
    category: "structural",
    prevalence_note: "Symptomatische Radikulopathie: ~5% aller LWS-Schmerzen; L5/S1 häufigster Level (45%), L4/5 (40%)",
    dermatome_guide: {
      "L3": { pain: "Vorderer Oberschenkel", weakness: "Knieextension", reflex: "Patellarsehne (abgeschwächt bei L4)" },
      "L4": { pain: "Medialer Unterschenkel bis große Zehe", weakness: "Fußhebung (Tibialis anterior)", reflex: "Patellarsehnenreflex ↓" },
      "L5": { pain: "Dorsaler Fuß, Großzehe, 2./3. Zehe", weakness: "Großzehenstreckung (EHL), Fußheben", reflex: "Kein sicherer Eigenreflex (Tibialis posterior)" },
      "S1": { pain: "Fußsohle, Ferse, Kleinfinger", weakness: "Zehenspitzenstand, Fußsenker", reflex: "Achillessehnenreflex ↓" }
    },
    key_features: [
      "Beinschmerz > Rückenschmerz (Leitsymptom der Radikulopathie!)",
      "Dermatomales Ausstrahlungsmuster (unter Knie)",
      "Verschlimmerung beim Vorbeugen / Sitzen / Husten",
      "SLR / Lasègue positiv < 60° mit Beinschmerz-Reproduktion",
      "Sensibilitätsstörung + motorische Schwäche möglich",
      "Reflexabschwächung segmentspezifisch",
      "Spontanverlauf: 90% deutliche Besserung innerhalb 6–12 Wochen"
    ],
    clinical_tests: [
      { test: "Straight Leg Raise (SLR) — ipsilateral", sensitivity: 0.92, specificity: 0.28, lr_plus: 1.28, lr_minus: 0.29, note: "Sehr sensitiv — wenn negativ, Radikulopathie unwahrscheinlich" },
      { test: "Crossed SLR", sensitivity: 0.29, specificity: 0.88, lr_plus: 2.42, note: "Hoch spezifisch — wenn positiv, fast sicher Radikulopathie" },
      { test: "Slump Test", sensitivity: 0.84, specificity: 0.83, lr_plus: 4.94 },
      { test: "Reflexabschwächung (PSR/ASR)", sensitivity: 0.47, specificity: 0.87, lr_plus: 3.62 },
      { test: "Motorisches Defizit (Kennmuskeln)", sensitivity: 0.63, specificity: 0.74 }
    ],
    imaging_recommendation: {
      first_line: "MRT LWS (ohne KM — Goldstandard) bei persistierenden Symptomen >4–6 Wochen oder Defizit",
      xray: "Röntgen LWS nur bei Red Flags oder OP-Planung (Instabilität, Skoliose)",
      ct: "CT als Alternative wenn MRT kontraindiziert"
    },
    next_steps: [
      "Information: 90% der Radikulopathien erholen sich konservativ innerhalb 12 Wochen",
      "Aktiv bleiben — Bettruhe kontraproduktiv!",
      "NSAR (kurzfristig), ggf. Gabapentin/Pregabalin bei neuropathem Schmerz",
      "Physiotherapie: neurale Mobilisation, Detonisierung, aktive Übungen (McKenzie-Analyse)",
      "Periradikuläre Infiltration (CT-gesteuert) bei Therapieversagen und klarem Befund",
      "Chirurgische Diskektomie: bei Kauda-Equina, progredientem Defizit, Versagen nach 6–12 Wochen"
    ],
    factors: { relief: -3, range: -2, re_energize: -1 },
    references: ["Chou R et al. Ann Intern Med 2007", "Hancock MJ et al. Spine 2011"]
  },

  "LWS-002": {
    id: "LWS-002",
    name: "Lumbales Facettengelenk-Syndrom",
    name_en: "Lumbar Facet Joint Pain",
    icd10: "M47.816",
    category: "functional_structural",
    prevalence_note: "Facettengelenke als Schmerzquelle bei 15–40% der chronischen LWS-Schmerzen; nimmt mit Alter zu",
    key_features: [
      "Paravertebraler Schmerz, oft bilateral",
      "Verschlimmerung bei Rückwärtsbiegen (Extension) und Rotation",
      "Besserung beim Sitzen und Vorbeugen",
      "Referred pain ins Gesäß und Oberschenkel (NICHT unter Knie)",
      "Morgensteifigkeit (kurz, < 30 min)",
      "Schmerz in Ruhelage (flacht ab)",
      "Kein neurologisches Defizit"
    ],
    clinical_tests: [
      { test: "Extension-Rotation Test (provoziert Schmerz)", sensitivity: 0.65, specificity: 0.60 },
      { test: "Paravertebrale Druckschmerzhaftigkeit", sensitivity: 0.71, specificity: 0.56, note: "Geringe Spezifität" },
      { test: "Bestätigung: Diagnostische Facettenblockade", note: "Goldstandard — nur interventionell" }
    ],
    imaging_recommendation: {
      first_line: "Klinische Diagnose — MRT zeigt oft keine Korrelation mit Symptomen",
      if_interventional: "CT oder Röntgen für Facettenblockade-Guidance"
    },
    next_steps: [
      "Physiotherapie: Haltungsschulung, Rumpfkräftigung, Flexionsbetonte Übungen",
      "Manuelle Therapie / Manipulation (gute Evidenz für akute LWS)",
      "Facettengelenk-Infiltration (Kortison) diagnostisch + therapeutisch",
      "Radiofrequenzdenervation bei positivem Blockade-Test und Therapieresistenz"
    ],
    factors: { relief: -2, range: -1 }
  },

  "LWS-003": {
    id: "LWS-003",
    name: "Lumbale Spinalkanalstenose",
    name_en: "Lumbar Spinal Canal Stenosis",
    icd10: "M48.06",
    category: "degenerative",
    prevalence_note: "Häufigste Wirbelsäulenoperation >65J.; prävalenz ~10% der >60-Jährigen symptomatisch; zentraler Kanal + Foramina",
    key_features: [
      "Neurogene Claudicatio (Schmerz/Schwäche beim Gehen — nach Abstand)",
      "Bessert sich beim Vornbeugen, Sitzen, Fahrradfahren (Flexion öffnet Kanal)",
      "Einkaufswagen-Zeichen (nach vorne gelehnt am Wagen kann länger gehen)",
      "Beidseitige Beinbeschwerden (anders als Diskushernie — oft einseitig)",
      "Alter >60 (typisch degenerativ)",
      "SLR meist negativ (Unterschied zu Diskushernie!)",
      "Fahrradfahren ohne Probleme (unterscheidet von vaskulärer Claudicatio)"
    ],
    clinical_tests: [
      { test: "Spinal Stenosis Measure (SSM — Fragebogen)", sensitivity: 0.89, specificity: 0.80 },
      { test: "Shopping Cart Sign / Stooped Walking Relief", sensitivity: 0.68, specificity: 0.77, lr_plus: 2.96 },
      { test: "SLR negativ (Unterschied zu Diskushernie)", sensitivity: 0.90, specificity: 0.40, note: "Negatives SLR bei Beinschmerz = stenose wahrscheinlicher" },
      { test: "Bicycle Test", note: "Keine Symptome beim Radfahren (=Stenose), Symptome beim Radfahren (=vaskulär)" }
    ],
    imaging_recommendation: {
      first_line: "MRT LWS (Goldstandard — Kanaldurchmesser, Foramina, Dura)",
      if_mri_contraindicated: "CT-Myelographie"
    },
    next_steps: [
      "Aufklärung: Natürlicher Verlauf variabel — ca. 1/3 verbessert sich, 1/3 stabil, 1/3 verschlechtert sich",
      "Physiotherapie: Flexionsbetonte Übungen (Williams), Aquatherapie, Fahrrad",
      "Epidurale Steroidinjektion: kurzfristig wirksam (3–6 Monate)",
      "Chirurgie (Dekompression/Laminektomie): bei erheblicher Lebensqualitätseinschränkung trotz konservativer Therapie"
    ],
    factors: { relief: -2, range: -3 },
    references: ["SPORT Trial, NEJM 2008", "NICE NG59 2022"]
  },

  "LWS-004": {
    id: "LWS-004",
    name: "ISG-Dysfunktion / Sakroiliitis",
    name_en: "Sacroiliac Joint Pain / Sacroiliitis",
    icd10: "M53.3",
    category: "functional_structural",
    prevalence_note: "ISG als Schmerzquelle: 13–30% aller LWS-Schmerzen; häufig fehldiagnostiziert als Diskushernie",
    key_features: [
      "Fortin-Finger-Zeichen (Patient zeigt auf Punkt direkt medial der PSIS)",
      "Schmerz im Gesäß, gelegentlich Ausstrahlung bis Oberschenkel (nicht unter Knie)",
      "FABER-Test positiv (Hüfte in Außenrotation + Abduktion + Flexion)",
      "Positive Provokationstests: Gaenslen, Thigh Thrust, Compression",
      "Schmerz postpartal (Beckeninstabilität nach Geburt)",
      "ASLR (Active Straight Leg Raise) positiv bei pelvinem Gürtelschmerz",
      "Keine neurologischen Symptome"
    ],
    clinical_tests: [
      { test: "Fortin Finger Test", sensitivity: 0.76, specificity: 0.47, note: "Gut als erstes Screening" },
      { test: "FABER Test", sensitivity: 0.69, specificity: 0.16, note: "Sensitiv, nicht spezifisch" },
      { test: "Thigh Thrust Test", sensitivity: 0.88, specificity: 0.69 },
      { test: "Gaenslen Test", sensitivity: 0.71, specificity: 0.26 },
      {
        test: "3+ positive Provokationstests kombiniert",
        sensitivity: 0.91,
        specificity: 0.78,
        lr_plus: 4.14,
        note: "Laslett 2005: ≥3/5 Tests = ISG-Diagnose wahrscheinlich"
      }
    ],
    imaging_recommendation: {
      first_line: "Klinische Diagnose bei typischem Befund ausreichend",
      if_spa_suspected: "MRT ISG (Knochenmarködem = aktive axSpA, ASAS-Kriterien)",
      confirmation: "Diagnostische ISG-Injektion (Goldstandard)"
    },
    next_steps: [
      "Physiotherapie: Stabilisierung Becken/Rumpf, ISG-Mobilisation (wenn hypomobil)",
      "ISG-Injektion (Kortison, ultraschall- oder CT-gesteuert) diagnostisch + therapeutisch",
      "Becken-Gürtel-Orthese bei postpartaler Instabilität",
      "Radiofrequenzdenervation (Rami laterales) bei Therapieresistenz"
    ],
    factors: { relief: -2, range: -1 },
    references: ["Laslett M et al. Man Ther 2005"]
  },

  "LWS-005": {
    id: "LWS-005",
    name: "Piriformis-Syndrom",
    name_en: "Piriformis Syndrome / Deep Gluteal Syndrome",
    icd10: "G57.00",
    category: "functional",
    prevalence_note: "Unterdiagnostiziert — geschätzt 6% aller Rücken-/Gesäßschmerz-Patienten; Frauen 6x häufiger",
    key_features: [
      "Tiefer Gesäßschmerz (M. piriformis liegt tief, unter M. gluteus max.)",
      "Schmerz beim langen Sitzen (besonders harte Oberfläche, Autofahren)",
      "Ischias-ähnliche Ausstrahlung ins Bein — aber NICHT dermatomal",
      "FAIR-Test positiv (Flexion + Adduction + Internal Rotation = Kompression N. ischiadicus)",
      "Palpatorischer Druckschmerz am Piriformis (Muskelbauch im Gesäß)",
      "SLR meist negativ oder mild positiv",
      "MRT oft unauffällig (klinische Diagnose!)"
    ],
    clinical_tests: [
      { test: "FAIR Test", sensitivity: 0.88, specificity: 0.83, lr_plus: 5.18 },
      { test: "Beatty Test", sensitivity: 0.78, specificity: 0.80 },
      { test: "Palpation Piriformis (im Gesäß)", sensitivity: 0.56, specificity: 0.90 }
    ],
    imaging_recommendation: {
      first_line: "Klinische Diagnose — MRT nur zum Ausschluss anderer Pathologien",
      ultrasound: "Ultraschall-gesteuerte Piriformis-Injektion diagnostisch + therapeutisch"
    },
    next_steps: [
      "Dehnung M. piriformis (Schlüssel-Übung: Figure-4-Stretch)",
      "Manuelle Tiefengewebsmassage / Dry Needling Piriformis",
      "Ultraschallgesteuerte Piriformis-Injektion (Kortison + Lokalanästhetikum)",
      "Botulinumtoxin-Injektion bei Therapieresistenz"
    ],
    factors: { relief: -2, range: -1 }
  },

  "LWS-006": {
    id: "LWS-006",
    name: "Spondylolisthese / Spondylolyse",
    name_en: "Spondylolisthesis / Spondylolysis",
    icd10: "M43.16",
    category: "structural",
    key_features: [
      "Junge Athleten: Überstreckungssport (Turnen, Ringen, Gewichtheben, Schwimmen)",
      "Schmerz bei Extension (Rückwärtsbiegen) — Stork-Test positiv",
      "Schmerz bei einseitigem Stehen auf einem Bein + Extension (One-leg extension test)",
      "L5 häufigster Bereich (85%)",
      "Bei höhergradiger Spondylolisthese: Stufenbildung palpierbar",
      "Degenerativ: Ältere >50, oft mit Stenose-Symptomen kombiniert"
    ],
    clinical_tests: [
      { test: "One-Leg Hyperextension Test", sensitivity: 0.73, specificity: 0.64 },
      { test: "Step-off Sign (palpatorisch)", note: "Spezifisch bei höhergradiger Listhese" }
    ],
    imaging_recommendation: {
      first_line: "Röntgen LWS in 2 Ebenen + Funktionsaufnahmen (Flexion/Extension) — Spondylolyse oft nur schräge Aufnahme ('Terrier-Halsband')",
      ct: "CT (Meyerding-Klassifikation, Pars-Interarticularis-Defekt)",
      mri: "MRT (Ödem Pars interarticularis = aktive Stressfraktur; Nervenwurzel bei Listhese)"
    },
    next_steps: [
      "Akute Spondylolyse (junger Athlet, Ödem im MRT): Ruhigstellung 3–6 Monate, Korsett",
      "Chronische Spondylolisthese Grad I–II: Kräftigung Rumpf, Detonisierung, Steuerung der Wirbelsäulenbelastung",
      "Grad III+: Orthopädisches Konsil für OP-Planung (Fusion)"
    ],
    factors: { relief: -2, range: -2 }
  },

  "LWS-007": {
    id: "LWS-007",
    name: "Myofasziales Schmerzsyndrom (LWS)",
    name_en: "Myofascial Pain Syndrome (Lumbar)",
    icd10: "M79.1",
    category: "functional",
    prevalence_note: "Oft als 'Hexenschuss' oder 'Verspannung' bezeichnet; sehr häufig als Sekundärphänomen bei anderen Diagnosen",
    key_features: [
      "Triggerpunkte: M. quadratus lumborum (QL), M. iliopsoas, M. piriformis, M. gluteus medius",
      "Referred pain nach typischen myofaszialen Mustern (nicht dermatomal)",
      "Kein neurologisches Defizit",
      "Verstärkung durch Stress, Kälte, einseitige Belastung",
      "Sofortige Schmerzlinderung durch gezielte Massage / Dry Needling als diagnostisches Zeichen",
      "MRT und Röntgen unauffällig"
    ],
    clinical_tests: [
      { test: "Triggerpunkt-Palpation (reproduziert Referred Pain)", sensitivity: 0.82, specificity: 0.67 },
      { test: "Schmerzlinderung nach lokaler Behandlung", note: "Ex-juvantibus-Diagnose" }
    ],
    imaging_recommendation: {
      first_line: "Keine Bildgebung nötig bei typischem Bild",
      if_atypical: "MRT LWS zum Ausschluss struktureller Pathologie"
    },
    next_steps: [
      "Dry Needling / Triggerpunktbehandlung",
      "Ischämische Kompression / manuelle Triggerpunkttherapie",
      "Wärmeanwendung (fördert Durchblutung und Detonisierung)",
      "Ergonom. Beratung + Stressmanagement (Yellow Flag Bewertung einbeziehen)",
      "Aktive Übungstherapie nach Detonisierung"
    ],
    factors: { relief: -1, regulation: -1 }
  },

  "LWS-008": {
    id: "LWS-008",
    name: "Axiale Spondyloarthritis (axSpA / Morbus Bechterew)",
    name_en: "Axial Spondyloarthritis",
    icd10: "M45",
    category: "inflammatory",
    prevalence_note: "Prävalenz: 0.3–0.5% Bevölkerung; HLA-B27+ in 85–90%; Gipfel Beginn 20–40 Jahre; Männer 2–3x häufiger als Frauen",
    asas_criteria_note: "ASAS-Klassifikationskriterien 2009: Bildgebende Achse (Sakroiliitis MRT/Röntgen) ODER Klinische Achse (HLA-B27 + ≥2 SpA-Features)",
    key_features: [
      "Chronischer Rückenschmerz >3 Monate, Beginn <45 Jahre",
      "Inflammatorisches Schmerzmuster: nächtliche Schmerzen (zweite Nachthälfte), Morgensteifigkeit >60 Minuten, Besserung durch Bewegung",
      "Wechselnde Gesäßschmerzen (ISG-Beteiligung)",
      "Gute NSAR-Antwort (diagnostisch hinweisend!)",
      "HLA-B27 positiv",
      "Extraartikuläre Manifestationen: Uveitis, Psoriasis, CED",
      "Familiäre Häufung SpA"
    ],
    clinical_tests: [
      { test: "ASAS Inflammatory Back Pain Criteria (≥4/5)", sensitivity: 0.79, specificity: 0.72 },
      { test: "HLA-B27", sensitivity: 0.90, specificity: 0.91, note: "Labor — nicht klinischer Test" },
      { test: "Schober-Test < 5cm (Lendenwirbelsäulenmobilität)", sensitivity: 0.23, specificity: 0.91, note: "Erst bei fortgeschrittener Erkrankung auffällig" }
    ],
    imaging_recommendation: {
      first_line: "MRT ISG (Knochenmarködem = aktive Entzündung = axSpA auch ohne Röntgenbefund)",
      second_line: "Röntgen Becken-Übersicht (Sakroiliitis Grad II-IV nach New York Kriterien)"
    },
    next_steps: [
      "SOFORTIGE Überweisung Rheumatologie (Biologika-Therapie kann Radiologische Progression verhindern)",
      "NSAR als Ersttherapie (diagnostisch + therapeutisch)",
      "Physiotherapie: Extensionsübungen, Atemtherapie, Ankylosierungsprophylaxe",
      "Biologika (TNF-alpha-Inhibitoren, IL-17-Inhibitoren) bei NSAR-Versagen"
    ],
    factors: { relief: -3, range: -3, rhythm: -2 },
    references: ["ASAS/EULAR Recommendations 2022", "Rudwaleit M et al. Ann Rheum Dis 2009"]
  }
};

const LWS_RULES = [

  // ─── LWS-001: Bandscheibenvorfall ────────────────────────

  {
    name: "LWS-001-SEHR-HOCH: Radikulopathie — klassisches dermatomales Muster + SLR",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "lws" },
        { fact: "LWS-Q02", operator: "in", value: ["below_knee", "to_foot"] },
        { fact: "LWS-Q10", operator: "equal", value: "yes_radiating" }
      ],
      any: [
        { fact: "LWS-Q03", operator: "in", value: ["l4_medial", "l5_dorsal", "s1_plantar"] },
        { fact: "LWS-Q08", operator: "in", value: ["tiptoeing_weak", "heel_weak", "both"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "LWS-001", probability_score: 89, label: "Sehr wahrscheinlich" }
    }
  },

  {
    name: "LWS-001-HOCH: Radikulopathie — Beinausstrahlung + Vorbeuge-Verschlimmerung",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "lws" },
        { fact: "LWS-Q02", operator: "in", value: ["below_knee", "to_foot"] },
        { fact: "LWS-Q06", operator: "contains", value: "forward_bend" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "LWS-001", probability_score: 72, label: "Wahrscheinlich" }
    }
  },

  // ─── LWS-002: Facettengelenk ─────────────────────────────

  {
    name: "LWS-002-HOCH: Facettengelenk — Extension + Referred Pain Gesäß/OS ohne Bein",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "lws" },
        { fact: "LWS-Q02", operator: "equal", value: "no_radiation" },
        { fact: "LWS-Q06", operator: "contains", value: "extension" }
      ],
      any: [
        { fact: "LWS-Q01", operator: "contains", value: "buttock" },
        { fact: "LWS-Q15", operator: "in", value: ["lt_30", "30_60"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "LWS-002", probability_score: 68, label: "Wahrscheinlich" }
    }
  },

  // ─── LWS-003: Spinalkanalstenose ─────────────────────────

  {
    name: "LWS-003-SEHR-HOCH: Stenose — Einkaufswagen-Zeichen + Alter + beidseitig",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "lws" },
        { fact: "LWS-Q07", operator: "equal", value: "yes_shopping_cart" },
        { fact: "patient_age", operator: "greaterThanInclusive", value: 60 }
      ],
      any: [
        { fact: "LWS-Q06", operator: "contains", value: "walking" },
        { fact: "LWS-Q02", operator: "in", value: ["below_knee", "to_foot"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "LWS-003", probability_score: 88, label: "Sehr wahrscheinlich" }
    }
  },

  {
    name: "LWS-003-MITTEL: Stenose — Älterer Patient + Claudicatio",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "lws" },
        { fact: "patient_age", operator: "greaterThanInclusive", value: 55 },
        { fact: "LWS-Q06", operator: "contains", value: "walking" },
        { fact: "LWS-Q10", operator: "in", value: ["no", "yes_back_only"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "LWS-003", probability_score: 60, label: "Möglich" }
    }
  },

  // ─── LWS-004: ISG ─────────────────────────────────────────

  {
    name: "LWS-004-HOCH: ISG — Fortin-Finger + Gesäßschmerz + kein Beinschmerz",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "lws" },
        { fact: "LWS-Q09", operator: "equal", value: true },
        { fact: "LWS-Q01", operator: "contains", value: "buttock" },
        { fact: "LWS-Q02", operator: "in", value: ["no_radiation", "to_knee"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "LWS-004", probability_score: 76, label: "Wahrscheinlich" }
    }
  },

  // ─── LWS-005: Piriformis ─────────────────────────────────

  {
    name: "LWS-005-HOCH: Piriformis — Gesäßschmerz + Sitzen + kein klares Dermatom",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "lws" },
        { fact: "LWS-Q12", operator: "equal", value: true },
        { fact: "LWS-Q01", operator: "contains", value: "buttock" }
      ],
      any: [
        { fact: "LWS-Q02", operator: "in", value: ["no_radiation", "to_knee"] },
        { fact: "LWS-Q10", operator: "in", value: ["no", "yes_back_only"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "LWS-005", probability_score: 68, label: "Wahrscheinlich" }
    }
  },

  // ─── LWS-006: Spondylolisthese ────────────────────────────

  {
    name: "LWS-006-HOCH: Spondylolisthese — junger Extensionssportler",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "lws" },
        { fact: "LWS-Q13", operator: "equal", value: true },
        { fact: "LWS-Q06", operator: "contains", value: "extension" },
        { fact: "patient_age", operator: "lessThanInclusive", value: 30 }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "LWS-006", probability_score: 74, label: "Wahrscheinlich" }
    }
  },

  // ─── LWS-007: Myofasziell ─────────────────────────────────

  {
    name: "LWS-007-MITTEL: Myofasziell — Triggerpunkte + keine Radiation + Stress",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "lws" },
        { fact: "LWS-Q02", operator: "equal", value: "no_radiation" },
        { fact: "LWS-Q17", operator: "equal", value: true }
      ],
      any: [
        { fact: "LWS-Q18", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "LWS-007", probability_score: 58, label: "Möglich" }
    }
  },

  // ─── LWS-008: axiale SpA ──────────────────────────────────

  {
    name: "LWS-008-HOCH: axSpA — inflammatorisches Muster + jung + Familienanamnese/Extraartikulär",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "lws" },
        { fact: "patient_age", operator: "lessThanInclusive", value: 45 },
        { fact: "LWS-Q14", operator: "equal", value: true },
        { fact: "LWS-Q15", operator: "in", value: ["30_60", "gt_60"] }
      ],
      any: [
        { fact: "LWS-Q16", operator: "equal", value: true },
        { fact: "LWS-Q06", operator: "contains", value: "activity_improves" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: {
        diagnosis_id: "LWS-008",
        probability_score: 80,
        label: "Wahrscheinlich — Rheumatologie-Überweisung",
        urgent_referral: true
      }
    }
  }
];

export { LWS_QUESTIONS, LWS_DIAGNOSES, LWS_RULES };
