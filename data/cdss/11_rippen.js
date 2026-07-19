/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 11: RIPPEN & THORAXWAND
 *
 * Diagnosen:
 *  RIP-001  Rippenfraktur S22.3/S22.4
 *  RIP-002  Kostochondritis / Tietze-Syndrom M94.0
 *  RIP-003  Rippendysfunktion (osteopathisch) M99.08
 *  RIP-004  Herpes zoster intercostal B02.29
 *  RIP-005  Interkostalneuralgie M54.6 / G58.0
 *  RIP-006  Pleuritis / Pleuropneumonie (DD) J90 / J18
 *
 * ⚠️ SYSTEMISCHE RED FLAGS:
 *  - Atemabhängiger starker Schmerz + Dyspnoe → PE / Pneumothorax ausschließen!
 *  - Drückender Thoraxschmerz → ACS ausschließen (vor Behandlung!)
 *  - Atypische Ausstrahlung → Aortendissektion
 *
 * Quellen:
 *  - Sato K et al.: Rib fracture diagnosis. Emerg Med J 2011.
 *  - Fischbach W: Tietze-Syndrom und Kostochondritis. Dtsch Med Wochenschr 2004.
 *  - Barral JP: The Thorax. Eastland Press 1991.
 *  - Fossum C: Rib dysfunction osteopathic approach. Seminar notes 2022.
 *  - Cohen SP: Herpes zoster. N Engl J Med 2013.
 *  - Still AT: Osteopathy — rib mechanics. Philosophy of Osteopathy 1899.
 */

const RIPPEN_QUESTIONS = [

  {
    id: "RIP-Q01",
    text: "Wo sitzt der Hauptschmerz im Bereich des Brustkorbs?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "anterior_sternum", label: "Vorne am Brustbein / Sternum" },
      { value: "anterior_lateral", label: "Seitlich vorne (Rippenbogen)" },
      { value: "lateral", label: "Seitlich (Rippenmittellinie)" },
      { value: "posterior", label: "Hinten (BWS-Rippen-Übergang)" },
      { value: "circumferential", label: "Gürtelförmig (umgreifend)" },
      { value: "diffuse_thorax", label: "Gesamter Brustkorb / diffus" }
    ]
  },

  {
    id: "RIP-Q02",
    text: "Kam der Schmerz nach einem Trauma, Sturz oder starkem Husten?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    hint: "Rippenfrakturen entstehen auch durch starkes Husten (Hustenrippen), besonders bei Osteoporose"
  },

  {
    id: "RIP-Q03",
    text: "Verstärkt sich der Schmerz beim Einatmen oder beim Drücken auf die Rippen?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    hint: "Atemabhängiger Schmerz ist typisch für Rippenfraktur, Kostochondritis und Pleuritis"
  },

  {
    id: "RIP-Q04",
    text: "Haben Sie Atemnot oder das Gefühl, nicht tief durchatmen zu können?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag: true,
    hint: "⚠️ Dyspnoe: Pneumothorax, Lungenembolie, Pneumonie ausschließen!"
  },

  {
    id: "RIP-Q05",
    text: "Haben Sie Fieber, Schüttelfrost oder fühlen sich allgemein krank?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag: true,
    hint: "⚠️ Systemische Infektzeichen → Pleuritis, Pneumonie, Herpes zoster (Prodromalphase)"
  },

  {
    id: "RIP-Q06",
    text: "Bemerken Sie einen Hautausschlag oder Bläschen im Schmerzbereich?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    hint: "Herpes zoster: Bläschen entlang Dermatom — ABER: Schmerz oft 3-5 Tage VOR Hautausschlag!"
  },

  {
    id: "RIP-Q07",
    text: "Wie würden Sie den Schmerz beschreiben?",
    type: "multiple_choice",
    variants: ["standard", "deep"],
    options: [
      { value: "sharp_stabbing", label: "Stechend, scharf — wie ein Messer" },
      { value: "burning", label: "Brennend / elektrisch" },
      { value: "pressure", label: "Drückend / Enge" },
      { value: "aching", label: "Dumpf / ziehend" },
      { value: "tight_band", label: "Wie ein enger Gürtel / Band" }
    ]
  },

  {
    id: "RIP-Q08",
    text: "Haben Sie Osteoporose, nehmen Sie Cortison (Steroide), oder haben Sie in letzter Zeit abnehmen müssen?",
    type: "yes_no",
    variants: ["standard", "deep"],
    red_flag: true,
    hint: "⚠️ Frakturrisiko erhöht — auch Insuffizienzfraktur ohne Trauma möglich"
  },

  {
    id: "RIP-Q09",
    text: "Spüren Sie eine Bewegungseinschränkung des Brustkorbs beim Atmen — als würde 'etwas blockieren'?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Typisch für osteopathische Rippendysfunktion (Rippe blockiert in Exspiration oder Inspiration)"
  },

  {
    id: "RIP-Q10",
    text: "Haben Sie Vorerkrankungen wie Krebs, chronische Infektionen oder nehmen Sie blutverdünnende Medikamente?",
    type: "yes_no",
    variants: ["deep"],
    red_flag: true,
    hint: "⚠️ Pathologische Fraktur (Metastasen), Blutungskomplikationen, Immunsuppression"
  }
];

const RIPPEN_DIAGNOSES = [

  {
    id: "RIP-001",
    name: "Rippenfraktur",
    icd10: "S22.3",
    icd10_multiple: "S22.4",
    probability_score: 0,
    description: "Fraktur einer oder mehrerer Rippen. Ursachen: direktes Trauma, Sturz, Verkehrsunfall. Insuffizienzfraktur bei Osteoporose oder Kortison-Langzeittherapie — auch nach Husten! Serienfraktur (≥3 Rippen) → Flail Chest (paradoxe Atembewegung) = intensivpflichtig!",
    clinical_tests: [
      {
        name: "Kompressionstest (indirekte Kompression)",
        description: "Seitlicher Druck auf den Brustkorb (nicht direkt auf Frakturort) → Schmerz am Frakturort",
        sensitivity: 0.71, specificity: 0.81,
        lr_positive: 3.7,
        source: "Sato K et al., Emerg Med J 2011"
      },
      {
        name: "Lokaler Druckschmerz",
        description: "Direkte Palpation der Rippe → scharf lokalisierter Schmerz",
        sensitivity: 0.85, specificity: 0.62
      },
      {
        name: "Atemsplit",
        description: "Patient atmet flach, vermeidet tiefes Einatmen",
        sensitivity: 0.80
      }
    ],
    red_flags: [
      "Serienfraktur ≥3 Rippen → Krankenhauseinweisung!",
      "Hämopneumothorax → Dyspnoe + Kreislaufinstabilität",
      "Flail Chest: paradoxe Atembewegung = Intensivstation",
      "1. Rippe Fraktur: hohe Energie → Aorta/Subklaviaschäden ausschließen"
    ],
    imaging: "Röntgen Thorax (Sensitivität nur 70% — viele Frakturen unsichtbar initial). CT Thorax bei klinischem Verdacht + neg. Röntgen.",
    treatment_approach: [
      "Analgesie: NSAR + Paracetamol (Opiode vermeiden — Atemdepression!)",
      "Rippengurt NUR kurzfristig: verhindert Atemexkursion → Atelektase-Gefahr",
      "Atemphysiotherapie: Incentive Spirometrie, tiefes Atmen trotz Schmerz",
      "KEIN HVLA auf betroffene Rippe! Osteopathisch: sanfte MFR, Atemlenkung",
      "Intercostal-Block: bei starken Schmerzen (Lokalanästhetikum)"
    ],
    osteopathic_note: "Behandlung erst nach Ausschluss Pneumothorax/Hämatopneumothorax. Flüssigkeitsmobilisation (RC-Modell Fossum) hilfreich für Sekretolyse.",
    factors: { relief: -3, range: -3, rhythm: -3, regulation: -2, re_energize: -2, relations: 0, rise: -2 }
  },

  {
    id: "RIP-002",
    name: "Kostochondritis / Tietze-Syndrom",
    icd10: "M94.0",
    probability_score: 0,
    description: "Entzündung der Knorpel-Knochen-Übergänge (chondrosternale / kostochondrale Gelenke). Unterschied: Tietze = MIT Schwellung am Knorpelansatz (Rippe 2-5). Kostochondritis = OHNE Schwellung (häufiger, meist Rippe 3-5). Vor allem junge Erwachsene, Frauen. Selbstlimitierend (Wochen bis Monate). Wichtigste DD: Herzschmerz!",
    clinical_tests: [
      {
        name: "Palpation Knorpelansatz",
        description: "Druckschmerz direkt am chondrosternalen Übergang → reproduzierbar",
        sensitivity: 0.90, specificity: 0.70,
        lr_positive: 3.0
      },
      {
        name: "Tietze-Zeichen",
        description: "Sichtbare + tastbare Schwellung am Rippenknorpel (Tietze ≠ Kostochondritis)",
        sensitivity: 0.60
      },
      {
        name: "Bewegungsabhängigkeit",
        description: "Schmerz bei Armbewegung, Rotation, Atemexkursion",
        sensitivity: 0.75
      }
    ],
    differential_diagnosis: [
      "ACS / Angina (IMMER ausschließen bei Brustschmerz!)",
      "Rippenfraktur",
      "GERD / Ösophagusspasmus",
      "Perikarditis (Reibegeräusch?)"
    ],
    treatment_approach: [
      "NSAR (Ibuprofen 3x400mg für 2-3 Wochen)",
      "Lokale Kortison-Injektion bei starken Beschwerden",
      "Osteopathisch: kostosternale Gelenkmobilisation (MET, Counterstrain)",
      "Wärmeapplikation / lokale Salben (Diclofenac-Gel)",
      "Restrukturierung Atemmuskulatur (Zwerchfell, ICM)"
    ],
    osteopathic_note: "Fossum RC-Modell: Atemqualität prüfen (thorakales Diaphragma oft mitbetroffen). Barral: Herz-Perikard-Verbindung (lig. sternoperikardiale) → thorakale Dekompression.",
    factors: { relief: -2, range: -1, rhythm: -2, regulation: -1, re_energize: -1, relations: 0, rise: -1 }
  },

  {
    id: "RIP-003",
    name: "Rippendysfunktion (Osteopathisch)",
    icd10: "M99.08",
    probability_score: 0,
    description: "Eingeschränkte Beweglichkeit einer oder mehrerer Rippen im kostovertebralen und/oder kostotransversalen Gelenk. KEINE strukturelle Läsion — Funktionsstörung. Osteopathisches Kernkonzept (Still, Greenman). Rippe kann in Exspirations- oder Inspirationsstellung blockieren. Häufig nach Trauma, Husten, ungünstige Körperhaltung.",
    rib_dysfunction_types: [
      {
        type: "Exspirations-Rippe (Exhalation Rib)",
        definition: "Rippe lässt sich nicht vollständig heben (Inhalationsbewegung eingeschränkt)",
        test: "In Inspiration nicht hochgehend wie benachbarte Rippen",
        treatment: "Thrust oder MET in Inspiration"
      },
      {
        type: "Inspirations-Rippe (Inhalation Rib)",
        definition: "Rippe lässt sich nicht vollständig senken (Exhalationsbewegung eingeschränkt)",
        test: "In Exspiration nicht absenkend",
        treatment: "MET in Exspiration oder Counterstrain"
      },
      {
        type: "Erste Rippe Dysfunktion",
        definition: "Erste Rippe (skalentriangle) erhöht oder anterior → TOS-ähnlich",
        test: "Palpation 1. Rippe posterolateral, Einschränkung Halsrotation",
        treatment: "Dekompressions-Technik 1. Rippe, Skalenus-MET, thoracic inlet"
      },
      {
        type: "Rippen-Torsion",
        definition: "Rippe in Torsion (anterior/posterior) — nach Still",
        treatment: "Techniken nach Greenman: Anterior/Posterior-Torsions-Release"
      }
    ],
    clinical_tests: [
      {
        name: "Atemexkursionstest",
        description: "Therapeut legt Hände auf Rippenbogen bilateral → Asymmetrie der Exkursion in In-/Exspiration",
        sensitivity: 0.75,
        note: "Osteopathischer Test — Interpräzision moderat"
      },
      {
        name: "Spring-Test Kostovertebral",
        description: "Posteriorer-anteriorer Druck auf Rippe → eingeschränkte Federung vs. benachbarte Rippe",
        sensitivity: 0.70
      },
      {
        name: "1. Rippe Palpation",
        description: "Posteriore Palpation 1. Rippe unter Trapaezius → Erhöhung, Spannung, Druckschmerz",
        sensitivity: 0.80
      }
    ],
    treatment_approach: [
      "MET (Muscle Energy): Patient atmet gegen Widerstand in blockierte Richtung — 3-5x",
      "HVLA kostovertebral (Thrust): nur bei geeignetem Patient, kein Frakturrisiko",
      "Counterstrain: Rippentenderpunkte — anteriore/posteriore Punkte nach Jones",
      "Barral: Rippenpleura-Release (Thorax-Buch Barral 1991)",
      "RC-Modell (Fossum): Atemqualität optimieren als Gesamtstrategie",
      "1. Rippe: Skalenus-MET + Thoracic-Inlet-Release"
    ],
    osteopathic_note: "Kostovertebrale Dysfunktionen oft segmental assoziiert mit viszerosomatischen Reflexen (T2-T4: Lunge/Herz; T5-T9: Leber/Magen; T10-L1: Niere/Darm). Immer Differenzierung BWS-Facetten-Dysfunktion vs. Rippe.",
    factors: { relief: -1, range: -2, rhythm: -2, regulation: -1, re_energize: -1, relations: 0, rise: -1 }
  },

  {
    id: "RIP-004",
    name: "Herpes zoster intercostal",
    icd10: "B02.29",
    probability_score: 0,
    description: "Reaktivierung von Varizella-Zoster-Virus (VZV) in Dorsalganglion → Ausbreitung entlang Dermatom. Intercostale Lokalisation häufigste Form (T3-T12). Risikogruppen: >50 Jahre, Immunsupprimierte. WICHTIG: Schmerz typischerweise 3-5 Tage VOR Hautmanifest! → MSK-Fehldiagnose möglich!",
    clinical_tests: [
      {
        name: "Dermatombegrenzter Schmerz",
        description: "Gürtelförmig, halbseitig, scharf begrenzt auf ein Dermatom",
        sensitivity: 0.95
      },
      {
        name: "Hautbefund (nach Prodromal)",
        description: "Gruppierte Bläschen auf gerötetem Grund, halbseitig — konfirmatorisch",
        sensitivity: 0.98, specificity: 0.99
      },
      {
        name: "Allodynie",
        description: "Berührungsempfindlichkeit der Haut im betroffenen Dermatom",
        sensitivity: 0.85
      }
    ],
    complications: [
      "Postherpetische Neuralgie (PHN): anhaltende Schmerzen >3 Monate nach Abklingen — 10-15% der Fälle",
      "Ramsay-Hunt-Syndrom: Zoster oticus (N. VII + VIII betroffen)",
      "Zoster ophthalmicus: Auge — Erblindungsrisiko!",
      "Disseminierter Zoster: Immunsupprimierte"
    ],
    treatment_approach: [
      "⚠️ FRÜHZEITIG: Virostatika innerhalb 72h nach Ausbruch → Aciclovir 800mg 5x/Tag für 7 Tage",
      "Analgesie: Gabapentin/Pregabalin (neuropathisch), NSAR, Opiode bei starken Schmerzen",
      "Lokale Behandlung: Zovirax-Creme, keine Manipulation der Blasen",
      "PHN-Prävention: frühe Antivirale + Gabapentin",
      "Impfung: Shingrix-Impfstoff für >50-Jährige (Prävention)"
    ],
    osteopathic_note: "KEINE manuelle Behandlung der betroffenen Segmente in akuter Phase! Sympathikusmodulation möglich (T1-T4 für Immunaktivierung). Erst nach Abheilung: Post-zoster-Neuralgie mit Osteopathie + Neurale Therapie (Narbe als Störfeld).",
    treatment_priority: "MEDIZINISCH — Überweisung Hausarzt/Dermatologe unverzüglich",
    factors: { relief: -3, range: -2, rhythm: -2, regulation: -3, re_energize: -3, relations: 0, rise: -2 }
  },

  {
    id: "RIP-005",
    name: "Interkostalneuralgie",
    icd10: "M54.6",
    icd10_neural: "G58.0",
    probability_score: 0,
    description: "Schmerz entlang eines Interkostalnervs ohne nachweisbare strukturelle Ursache, oder nach Trauma/OP (post-thorakotomische Neuralgie). Charakteristisch: bandförmig-gürtelförmiger Schmerz, neuropathische Qualität (brennend, elektrisch). Ausschlussdiagnose nach Herpes zoster, Fraktur, Pleuritis.",
    clinical_tests: [
      {
        name: "Gürtelförmiges Schmerzmuster",
        description: "Halbseitig entlang eines Interkostalraums — reproduzierbar durch Palpation am Rippenunterrand",
        sensitivity: 0.80
      },
      {
        name: "Tinel-Zeichen interkostal",
        description: "Beklopfen des Nervenasts → Schmerz/Parästhesie",
        sensitivity: 0.65
      }
    ],
    differential_note: "Herpes zoster (IMMER ausschließen!), Rippenfraktur, Pleuritis, GERD, Radikulopathie thorakal",
    treatment_approach: [
      "Gabapentin/Pregabalin (First-line neuropathisch)",
      "SNRI (Duloxetin 60mg/Tag bei chronisch)",
      "Lokale Betäubungsmittel: Lidocain-Pflaster 5% (Versatis)",
      "Interkostalblock: Lokalanästhetikum am Rippenunterrand (Nervenaustritt)",
      "Neurale Therapie (Huneke/Klinghardt): Procain-Infiltration am Nervenaustritt",
      "Osteopathisch: Thorakale Segmentmobilisation + Soft Tissue ICM"
    ],
    factors: { relief: -2, range: -1, rhythm: -2, regulation: -2, re_energize: -2, relations: 0, rise: -1 }
  },

  {
    id: "RIP-006",
    name: "Pleuritis / Pleuropneumonie (DD)",
    icd10: "J90",
    icd10_pneumo: "J18",
    probability_score: 0,
    description: "⚠️ SYSTEMISCHE DIFFERENTIALDIAGNOSE — kein primäres MSK-Problem! Entzündung der Pleura → atemabhängiger, scharfer Seitenschmerz. Oft mit Dyspnoe, Husten, Fieber. Pleuritis exsudativa: Pleuraerguss. Pleuropneumonie: gleichzeitig Lunge + Pleura.",
    red_flag_level: "HIGH",
    clinical_tests: [
      {
        name: "Atemabhängiger Schmerz",
        description: "Scharf, atemabhängig (bei Einatmen schlimmer), tief lokalisiert",
        sensitivity: 0.90
      },
      {
        name: "Auskultation Reibegeräusch",
        description: "Pleuritisches Reibegeräusch (lederner Klang, in beiden Atemphasen)",
        sensitivity: 0.70
      },
      {
        name: "Systemzeichen",
        description: "Fieber, Tachykardie, allgemeines Krankheitsgefühl",
        sensitivity: 0.75
      }
    ],
    action_required: "SOFORTIGE ÄRZTLICHE ABKLÄRUNG. Röntgen Thorax / CT Thorax. Blutbild, CRP, PCT, D-Dimere (PE-Ausschluss).",
    treatment_approach: [
      "⚠️ KEINE osteopathische/manuelle Behandlung bis Ausschluss systemischer Ursache",
      "Hausarzt / Notaufnahme",
      "Antibiotika bei Pneumonie",
      "NSAR für Pleuritis (Ibuprofen 1. Wahl)",
      "Thorakozenese bei großem Erguss"
    ],
    factors: { relief: -3, range: -3, rhythm: -3, regulation: -3, re_energize: -3, relations: 0, rise: -3 }
  }
];

const RIPPEN_RULES = [
  {
    name: "Rippenfraktur — Trauma + Druckschmerz + Atemschmerz",
    conditions: {
      all: [
        { fact: "rip_trauma", operator: "equal", value: true },
        { fact: "rip_respiratory_pain", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "RIP-001", probability_score: 82 }
  },

  {
    name: "Rippenfraktur — Osteoporose/Steroide + Schmerz (Insuffizienzfraktur)",
    conditions: {
      all: [
        { fact: "rip_osteoporosis_steroids", operator: "equal", value: true },
        { fact: "rip_respiratory_pain", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "RIP-001", probability_score: 75 }
  },

  {
    name: "Kostochondritis / Tietze — anteriorer Brustkorb + Palpationsschmerz chondrosternal",
    conditions: {
      all: [
        { fact: "rip_location", operator: "equal", value: "anterior_sternum" },
        { fact: "rip_respiratory_pain", operator: "equal", value: true },
        { fact: "rip_trauma", operator: "equal", value: false }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "RIP-002", probability_score: 72 }
  },

  {
    name: "Herpes zoster — gürtelförmig + Hautausschlag",
    conditions: {
      all: [
        { fact: "rip_location", operator: "equal", value: "circumferential" },
        { fact: "rip_skin_rash", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "RIP-004", probability_score: 95 }
  },

  {
    name: "Herpes zoster — gürtelförmig + brennend + Allgemeinzeichen (Prodromal)",
    conditions: {
      all: [
        { fact: "rip_location", operator: "equal", value: "circumferential" },
        { fact: "rip_systemic_symptoms", operator: "equal", value: true },
        { fact: "rip_quality", operator: "contains", value: "burning" }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "RIP-004", probability_score: 68 }
  },

  {
    name: "Osteopathische Rippendysfunktion — keine Trauma, Blockgefühl, BWS-Bereich",
    conditions: {
      all: [
        { fact: "rip_trauma", operator: "equal", value: false },
        { fact: "rip_movement_restriction", operator: "equal", value: true },
        { fact: "rip_location", operator: "in", value: ["posterior", "lateral"] }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "RIP-003", probability_score: 70 }
  },

  {
    name: "Pleuritis DD — Dyspnoe + Fieber + atemabhängig",
    conditions: {
      all: [
        { fact: "rip_dyspnoe", operator: "equal", value: true },
        { fact: "rip_systemic_symptoms", operator: "equal", value: true },
        { fact: "rip_respiratory_pain", operator: "equal", value: true }
      ]
    },
    event: {
      type: "diagnosis",
      diagnosis_id: "RIP-006",
      probability_score: 80,
      alert: "⚠️ SYSTEMISCHE URSACHE — Sofort Arzt!"
    }
  }
];

const RIPPEN_RED_FLAG_ALERT = {
  id: "RIP-RF",
  checks: [
    { fact: "rip_dyspnoe", value: true, action: "STOPP — Dyspnoe: Pneumothorax/PE/Pneumonie ausschließen. Sofort Arzt." },
    { fact: "rip_systemic_symptoms", value: true, action: "Fieber/Schüttelfrost: systemische Infektion prüfen." },
    { fact: "rip_osteoporosis_steroids", value: true, action: "Hohes Frakturrisiko — bildgebend vor Behandlung." }
  ]
};

const RIPPEN_OUTPUT_CONFIG = {
  max_differentials_short: 2,
  max_differentials_standard: 3,
  max_differentials_deep: 5,
  key_differentiator: "Trauma-Anamnese + Atemabhängigkeit + Hautzeichen + Systemzeichen",
  mandatory_exclusions_before_treatment: [
    "Pneumothorax (bei Dyspnoe)",
    "Lungenembolie (bei Dyspnoe + Risikokonst.)",
    "ACS (bei anteriorem Brustschmerz)",
    "Herpes zoster (vor manueller Therapie)"
  ]
};

export {
  RIPPEN_QUESTIONS,
  RIPPEN_DIAGNOSES,
  RIPPEN_RULES,
  RIPPEN_RED_FLAG_ALERT,
  RIPPEN_OUTPUT_CONFIG
};
