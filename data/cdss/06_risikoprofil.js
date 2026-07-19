/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 06: RISIKOPROFIL (NUR THERAPEUTEN-SICHT)
 *
 * ⚠️  DATENSCHUTZ: Dieses Modul ist NUR für Therapeuten sichtbar.
 *     Patienten sehen keine Risikoscores, keine Risikoklassen.
 *     Die Ausgabe erscheint ausschließlich im Therapeuten-Dashboard.
 *
 * Enthaltene Risikoprofile:
 *  RP-001  Manipulations-Sicherheitsscreening HWS (CAD-Risiko)
 *  RP-002  Kardiovaskuläres Risikoprofil (Arteriosklerose, Schlaganfall)
 *  RP-003  Frakturrisikoprofil (FRAX-angelehnt)
 *  RP-004  Somatotyp & konstitutionelles Profil (Fossum GOA)
 *  RP-005  Venöses Risikoprofil (Fossum VVS — für Behandlungsplanung)
 *  RP-006  Allgemeines Behandlungsrisiko (Kontraindikationen)
 *
 * Quellen:
 *  - Fossum C. (2023): Global Osteopathic Assessment — Building a Routine.
 *    Kristiania University College, School of Health Sciences.
 *  - Fossum C. (2026): The Venous System — Connecting the Dots. Leipzig.
 *  - Rivett DA, Milburn PD: A prospective case study of cervical artery
 *    dissection. Manual Therapy 1996.
 *  - Haneline MT, Triano J: Cervical artery dissection — a comparison of
 *    highly dynamic mechanisms. J Manipulative Physiol Ther 2005.
 *  - Kaplan J et al.: SCORE2 Guidelines for Cardiovascular Risk.
 *    ESC 2021.
 *  - WHO FRAX: Fracture Risk Assessment Tool (Sheffield, 2008).
 *  - Sheldon JH: The Social Medicine of Old Age. London 1948.
 *    (Somatotypology basis — extended by Sheldon/Fossum)
 *  - Kalichman L, Hunter DJ: The genetics of intervertebral disc
 *    degeneration. Semin Arthritis Rheum 2008.
 */

// ============================================================
// RP-001: MANIPULATIONS-SICHERHEITSSCREENING HWS
// Cervical Artery Dissection (CAD) Risk Screening
//
// PFLICHTMODUL vor jeder HWS-Manipulation / HVLA-Technik
// Evidenz:
//  - Cassidy JD et al.: Risk of vertebrobasilar stroke after chiropractic care.
//    Spine 2008.
//  - Puentedura EJ et al.: Safety of cervical spine manipulation. JOSPT 2012.
//  - CAD Inzidenz bei Manipulation: ~1/100.000 bis 1/5.800.000
//    (sehr selten, aber schwerwiegende Folgen)
// ============================================================

const CAD_RISK_SCREENING = {
  id: "RP-001",
  name: "HWS-Manipulationssicherheit — CAD-Risiko-Screening",
  name_en: "Cervical Artery Dissection Risk Screening",
  visibility: "therapist_only",
  mandatory_for: ["hws_manipulation", "hvla_cervical"],

  // VORSICHT-ANZEICHEN: aus Patientenanamnese extrahiert
  risk_factors: [

    {
      id: "CAD-RF01",
      name: "Vorgeschichte einer Dissektion",
      description: "Frühere Dissektion der A. vertebralis oder A. carotis interna",
      source: "medical_history",
      question: "Hatten Sie jemals einen Schlaganfall, eine TIA oder eine Dissektion (Riss) einer Halsschlagader oder Wirbelarterie?",
      weight: 10,  // Absoluter Ausschluss
      risk_class_if: "ABSOLUTE_CONTRAINDICATION"
    },

    {
      id: "CAD-RF02",
      name: "Gefäßerkrankungen / Bindegewebserkrankungen",
      description: "Marfan-Syndrom, EDS (Ehlers-Danlos), fibromuskuläre Dysplasie, polyzystische Nierenerkrankung",
      source: "medical_history",
      question: "Haben Sie ein Marfan-Syndrom, Ehlers-Danlos-Syndrom, oder eine bekannte Erkrankung der Blutgefäße?",
      weight: 8,
      risk_class_if: "ABSOLUTE_CONTRAINDICATION"
    },

    {
      id: "CAD-RF03",
      name: "Akuter Nackenschmerz mit neuen Kopfschmerzen",
      description: "Plötzlich neu aufgetretener Nacken-/Hinterkopfschmerz OHNE Trauma — mögliches Dissektion-Frühsymptom",
      source: "current_complaint",
      question: "Haben Sie aktuell einen neu aufgetretenen, ungewöhnlich starken Kopfschmerz oder Nackenschmerz, der sich deutlich von Ihren bisherigen Beschwerden unterscheidet?",
      weight: 7,
      risk_class_if: "HIGH_RISK",
      alert: "Neuer starker Kopfschmerz: 'Thunderclap Headache' oder neu aufgetretener Nackenschmerz = mögliche aktive Dissektion! KEINE Manipulation."
    },

    {
      id: "CAD-RF04",
      name: "Neurologische Defizite",
      description: "Aktuelle Schwindel-Ataxie, Dysphagie, Doppelbilder, Dysarthrie, Horner-Syndrom",
      source: "current_symptoms",
      question: "Haben Sie aktuell Schwindel mit Gleichgewichtsverlust (anders als normaler Kopfdreh-Schwindel), Sehstörungen, Schluckbeschwerden oder ein hängendes Augenlid?",
      weight: 9,
      risk_class_if: "ABSOLUTE_CONTRAINDICATION",
      alert: "5D's: Diplopia, Dizziness, Drop attacks, Dysarthria, Dysphagia = mögliche vertebrobasiläre Insuffizienz / aktive Dissektion"
    },

    {
      id: "CAD-RF05",
      name: "Kürzliches HWS-Trauma",
      description: "HWS-Trauma in den letzten 4 Wochen (Schleudertrauma, Sportverletzung, Sturz)",
      source: "medical_history",
      question_auto: "Aus Anamnese: SCH-Q10 = trauma_whiplash in den letzten 4 Wochen",
      weight: 5,
      risk_class_if: "MODERATE_RISK"
    },

    {
      id: "CAD-RF06",
      name: "Hypertonie (unkontrolliert)",
      description: "Bekannte Hypertonie, aktuell nicht eingestellt (>160/100 mmHg)",
      source: "medical_history",
      question: "Haben Sie Bluthochdruck? Falls ja — ist er aktuell gut eingestellt (letzte Messung)?",
      weight: 3,
      risk_class_if: "MODERATE_RISK"
    },

    {
      id: "CAD-RF07",
      name: "Migräne mit Aura",
      description: "Bekannte Migräne mit visueller, sensorischer oder motorischer Aura",
      source: "medical_history",
      question: "Haben Sie Migräne — und wenn ja, haben Sie vor dem Kopfschmerz Sehstörungen, Kribbeln oder Schwäche (Aura)?",
      weight: 2,
      risk_class_if: "LOW_RISK_MODIFIED"
    },

    {
      id: "CAD-RF08",
      name: "Orale Kontrazeptiva / Östrogentherapie (Frauen)",
      description: "Erhöhtes thromboembolisches Risiko",
      source: "medical_history",
      question: "Nehmen Sie die Pille oder eine Hormontherapie mit Östrogen?",
      weight: 2,
      risk_class_if: "LOW_RISK_MODIFIED",
      condition: { fact: "patient_sex", operator: "equal", value: "female" }
    },

    {
      id: "CAD-RF09",
      name: "Rauchen",
      description: "Aktives Rauchen als unabhängiger kardiovaskulärer Risikofaktor",
      source: "medical_history",
      weight: 1,
      risk_class_if: "LOW_RISK_MODIFIED"
    }
  ],

  // Risikoklassifikation
  risk_classes: {
    ABSOLUTE_CONTRAINDICATION: {
      label: "⛔ ABSOLUTE KONTRAINDIKATION",
      color: "red",
      action: "Keine zervikale Hochgeschwindigkeitsmanipulation. Weiche Techniken (Mobilisation, Traktion) nach klinischer Beurteilung möglich. Sofortige ärztliche Abklärung bei Verdacht auf aktive Dissektion.",
      manipulation_allowed: false
    },
    HIGH_RISK: {
      label: "🔴 HOHES RISIKO",
      color: "red",
      action: "Hochgeschwindigkeits-Manipulation NICHT empfohlen. Besprechung mit Patient über Alternativen. Ärztliche Konsultation vor Behandlung.",
      manipulation_allowed: false
    },
    MODERATE_RISK: {
      label: "🟡 ERHÖHTES RISIKO",
      color: "yellow",
      action: "Vorsicht. Hochgeschwindigkeits-Manipulation nur nach eingehender klinischer Beurteilung und ausführlicher Aufklärung. Bevorzuge sanfte Mobilisationstechniken.",
      manipulation_allowed: "with_caution"
    },
    LOW_RISK_MODIFIED: {
      label: "🟢 GERINGES RISIKO (modifiziert)",
      color: "yellow_green",
      action: "Manipulation grundsätzlich möglich. Modifizierende Faktoren beachten. Aufklärung über Restrisiko dokumentieren.",
      manipulation_allowed: true
    },
    LOW_RISK: {
      label: "🟢 GERINGES RISIKO",
      color: "green",
      action: "Keine spezifischen Einschränkungen aus kardiovaskulärer Sicht. Standard-Aufklärung ausreichend.",
      manipulation_allowed: true
    }
  },

  // 5D's Screening (Fossum GOA Kontext — vertebrobasiläre Insuffizienz)
  five_ds_screening: {
    name: "5D's + 3N Screening (Vertebrobasiläre Insuffizienz)",
    items: [
      { code: "D1", name: "Diplopia", description: "Doppelbilder" },
      { code: "D2", name: "Dizziness", description: "Schwindel mit Gleichgewichtsverlust" },
      { code: "D3", name: "Drop attacks", description: "Plötzliche Sturzattacken ohne Bewusstlosigkeit" },
      { code: "D4", name: "Dysarthria", description: "Undeutliche Aussprache" },
      { code: "D5", name: "Dysphagia", description: "Schluckbeschwerden" },
      { code: "N1", name: "Nausea/Nystagmus", description: "Übelkeit / Augenzittern" },
      { code: "N2", name: "Numbness (face/bilateral)", description: "Gesichtstaubheit / bilaterale Taubheit" },
      { code: "N3", name: "Neckache (new onset)", description: "Neu aufgetretener starker Nackenschmerz" }
    ],
    rule: "2 oder mehr positive Items = Absolute Kontraindikation zervikale Manipulation"
  }
};

// ============================================================
// RP-002: KARDIOVASKULÄRES RISIKOPROFIL
// Basis: SCORE2 (ESC 2021) + Framingham-Risikofaktoren
// Relevant für: Behandlungsintensität, Manipulation,
//               Vaskuläre Ursachen, Überweisung
//
// Wichtig für Lindebergs: Arteriosklerose-Risiko beeinflusst
// das Manipulationsrisiko UND zeigt systemische Risiken auf
// ============================================================

const CARDIOVASCULAR_RISK_PROFILE = {
  id: "RP-002",
  name: "Kardiovaskuläres Risikoprofil",
  visibility: "therapist_only",

  risk_factors: [

    {
      id: "CV-RF01",
      name: "Alter",
      type: "continuous",
      source: "demographics",
      scoring: [
        { min: 18, max: 44, points: 0 },
        { min: 45, max: 54, points: 1 },
        { min: 55, max: 64, points: 2 },
        { min: 65, max: 74, points: 3 },
        { min: 75, max: 99, points: 4 }
      ]
    },

    {
      id: "CV-RF02",
      name: "Geschlecht",
      type: "categorical",
      source: "demographics",
      scoring: { male: 1, female: 0 },
      note: "Männer haben bis Menopause höheres kardiovaskuläres Risiko"
    },

    {
      id: "CV-RF03",
      name: "Bluthochdruck",
      question: "Haben Sie Bluthochdruck (Hypertonie) — diagnostiziert oder nehmen Sie Blutdruckmittel?",
      type: "yes_no",
      source: "medical_history",
      points_if_yes: 2
    },

    {
      id: "CV-RF04",
      name: "Rauchen (aktuell oder < 5 Jahre gestoppt)",
      question: "Rauchen Sie aktuell oder haben Sie in den letzten 5 Jahren geraucht?",
      type: "yes_no",
      source: "lifestyle",
      points_if_yes: 2
    },

    {
      id: "CV-RF05",
      name: "Diabetes mellitus",
      question: "Haben Sie Diabetes (Typ 1 oder Typ 2)?",
      type: "yes_no",
      source: "medical_history",
      points_if_yes: 2
    },

    {
      id: "CV-RF06",
      name: "Bekannte Herz-Kreislauf-Erkrankung",
      question: "Haben oder hatten Sie: Herzinfarkt, Schlaganfall, TIA, Bypass-OP, Stent, pAVK?",
      type: "yes_no",
      source: "medical_history",
      points_if_yes: 4,
      alert_if_yes: "Bekannte KHK / Schlaganfall: Risikofaktor für vaskuläre Ursachen von Schmerz. Ärztliche Mitbehandlung empfohlen."
    },

    {
      id: "CV-RF07",
      name: "Erhöhte Blutfette (Hypercholesterinämie)",
      question: "Wurden bei Ihnen erhöhte Cholesterin- oder Fettwerte im Blut festgestellt?",
      type: "yes_no",
      source: "medical_history",
      points_if_yes: 1
    },

    {
      id: "CV-RF08",
      name: "Familienanamnese kardiovaskuläre Erkrankungen",
      question: "Hatte ein Elternteil oder Geschwisterteil vor dem 60. Lebensjahr einen Herzinfarkt oder Schlaganfall?",
      type: "yes_no",
      source: "family_history",
      points_if_yes: 1
    },

    {
      id: "CV-RF09",
      name: "Adipositas / Übergewicht",
      description: "BMI > 30 kg/m²",
      source: "demographics_calculated",
      note: "Aus Körpergewicht und -größe berechnet",
      points_if_bmi_gt_30: 1
    },

    {
      id: "CV-RF10",
      name: "Körperliche Inaktivität",
      question: "Bewegen Sie sich im Alltag weniger als 30 Minuten pro Tag (Spazierengehen, Sport, etc.)?",
      type: "yes_no",
      source: "lifestyle",
      points_if_yes: 1
    }
  ],

  risk_levels: {
    low: { min_score: 0, max_score: 3, label: "🟢 Niedriges kardiovaskuläres Risiko", action: "Keine spezifischen Einschränkungen" },
    moderate: { min_score: 4, max_score: 6, label: "🟡 Moderates kardiovaskuläres Risiko", action: "Behandlungsintensität und -monitoring anpassen. Bei Symptomen sofortiger Stopp + ärztliche Abklärung." },
    high: { min_score: 7, max_score: 9, label: "🔴 Hohes kardiovaskuläres Risiko", action: "Ärztliche Mitbehandlung empfohlen. Intensiver Einsatz manueller Techniken zurückhaltend." },
    very_high: { min_score: 10, max_score: 99, label: "⛔ Sehr hohes kardiovaskuläres Risiko", action: "Ärztliche Abklärung vor Behandlungsbeginn. Nur sanfte Techniken." }
  },

  // Für Lindebergs: Verbindung zu AAA (Red Flag RF-005) und TVT (RF-006)
  linked_red_flags: ["RF-005", "RF-006"]
};

// ============================================================
// RP-003: FRAKTURRISIKOPROFIL (FRAX-angelehnt)
// Relevant für: Manipulation, Mobilisation, Sport-Empfehlungen
// Bei erhöhtem Risiko → keine Hochgeschwindigkeitstechniken
// ============================================================

const FRACTURE_RISK_PROFILE = {
  id: "RP-003",
  name: "Frakturrisikoprofil",
  visibility: "therapist_only",

  risk_factors: [
    {
      id: "FX-RF01",
      name: "Alter > 65 Jahre",
      source: "demographics",
      threshold_age: 65,
      points: 3
    },
    {
      id: "FX-RF02",
      name: "Weibliches Geschlecht",
      source: "demographics",
      points_if_female: 1,
      note: "Frauen 4x häufiger Osteoporose als Männer"
    },
    {
      id: "FX-RF03",
      name: "Bekannte Osteoporose / niedrige Knochendichte",
      question: "Haben Sie Osteoporose oder wurde bei Ihnen eine erniedrigte Knochendichte (DXA-Messung) festgestellt?",
      type: "yes_no",
      source: "medical_history",
      points_if_yes: 4
    },
    {
      id: "FX-RF04",
      name: "Vorherige Fraktur nach Bagatelltrauma",
      question: "Hatten Sie in den letzten Jahren einen Knochenbruch nach einem leichten Sturz oder kleinen Unfall?",
      type: "yes_no",
      source: "medical_history",
      points_if_yes: 3
    },
    {
      id: "FX-RF05",
      name: "Langzeit-Kortikosteroid-Therapie",
      question: "Nehmen Sie Kortison-Tabletten (Prednisolon oder ähnliches) für länger als 3 Monate?",
      type: "yes_no",
      source: "medical_history",
      points_if_yes: 3
    },
    {
      id: "FX-RF06",
      name: "Familienanamnese Osteoporose / Hüftfraktur Elternteil",
      question: "Hat Ihre Mutter oder Ihr Vater eine Hüftfraktur nach 60 Jahren erlitten?",
      type: "yes_no",
      source: "family_history",
      points_if_yes: 1
    },
    {
      id: "FX-RF07",
      name: "Niedriges Körpergewicht / Untergewicht",
      description: "BMI < 19 kg/m² — Untergewicht als unabhängiger Risikofaktor",
      source: "demographics_calculated",
      points_if_bmi_lt_19: 2
    },
    {
      id: "FX-RF08",
      name: "Rauchen",
      question: "Rauchen Sie?",
      type: "yes_no",
      source: "lifestyle",
      points_if_yes: 1
    },
    {
      id: "FX-RF09",
      name: "Alkohol > 3 Einheiten/Tag",
      question: "Trinken Sie täglich mehr als 3 Einheiten Alkohol (1 Einheit = 0.33l Bier oder 0.1l Wein)?",
      type: "yes_no",
      source: "lifestyle",
      points_if_yes: 1
    },
    {
      id: "FX-RF10",
      name: "Rheumatoide Arthritis",
      question: "Haben Sie rheumatoide Arthritis?",
      type: "yes_no",
      source: "medical_history",
      points_if_yes: 1
    }
  ],

  risk_levels: {
    low: {
      min_score: 0, max_score: 3,
      label: "🟢 Niedriges Frakturrisiko",
      action: "Keine spezifischen Einschränkungen"
    },
    moderate: {
      min_score: 4, max_score: 6,
      label: "🟡 Moderates Frakturrisiko",
      action: "Bei Wirbelsäulen-HVLA: Zurückhaltung. Keine Thrust-Techniken bei bestehenden Warnsignalen."
    },
    high: {
      min_score: 7, max_score: 99,
      label: "🔴 Hohes Frakturrisiko — HVLA kontraindiziert",
      action: "Hochgeschwindigkeitstechniken KONTRAINDIZIERT. Sanfte Mobilisation. Empfehlung DXA-Messung über Hausarzt.",
      manipulation_allowed: false
    }
  }
};

// ============================================================
// RP-004: SOMATOTYP & KONSTITUTIONELLES PROFIL
// Nach Fossum GOA (Sheldon'sche Somatotypologie)
// Relevant für: Behandlungsplanung, Gewebeeigenschaften,
//               Verletzungsrisiko, Therapietiefe
//
// Fossum: "Treat what you find NOT what you expect to find"
// Das Somatotyp-Profil informiert die ERWARTUNG des Therapeuten
// ============================================================

const SOMATOTYPE_PROFILE = {
  id: "RP-004",
  name: "Somatotyp & Konstitutionelles Profil (Fossum GOA)",
  visibility: "therapist_only",

  somatotypes: {
    ectomorph: {
      name: "Ektomorph",
      characteristics: {
        build: "Schlanker, langgliedriger Körperbau, wenig Muskelmasse, niedrige Knochendichte",
        tissue: "Hypermobile Gelenke, schlankes Faszialgewebe, instabil",
        injury_pattern: "Hypermobilitäts-assoziierte Beschwerden, Instabilität, Überlastungssyndrome durch Schutzmangel",
        cvs_risk: "Niedriges kardiovaskuläres Risiko durch niedrigen BMI",
        fracture_risk: "Erhöhtes Frakturrisiko (niedrige Knochendichte, niedriges BMI)"
      },
      therapy_implications: [
        "Stabilisierendes Training > Mobilisation (Gelenke NICHT weiter mobilisieren!)",
        "Sanfte Techniken — Gewebe weniger belastbar",
        "Propriozeptionstraining essentiell",
        "Vermeidung tiefer Insertionen (Nadeln, Ultraschall-Injektionen vorsichtig)"
      ],
      manipulation_note: "HVLA mit größerer Vorsicht — hypermobile Strukturen",
      screening_questions: [
        "Wurde Ihnen schon mal gesagt, Sie seien überbeweglich (Hypermobilität)?",
        "Können Sie Daumen auf das Handgelenk biegen oder Ellenbogen überstrecken?"
      ]
    },

    mesomorph: {
      name: "Mesomorph",
      characteristics: {
        build: "Muskulöser, mittlerer Körperbau, gute Knochendichte",
        tissue: "Normales Fascialgewebe, normale Gelenkstabilität",
        injury_pattern: "Überbelastungssyndrome, Muskelverletzungen, Traumafolgen",
        cvs_risk: "Durchschnittliches kardiovaskuläres Risiko",
        fracture_risk: "Durchschnittliches Frakturrisiko"
      },
      therapy_implications: [
        "Alle Techniken in Normaltiefe möglich",
        "Kräftigung + Mobilisation ausbalanciert",
        "Gute Regenerationsfähigkeit"
      ],
      manipulation_note: "HVLA normal möglich (wenn keine anderen Kontraindikationen)"
    },

    endomorph: {
      name: "Endomorph",
      characteristics: {
        build: "Rundlicher, breiter Körperbau, erhöhter Körperfettanteil",
        tissue: "Mehr Gewebemasse, schwierigere Palpation tiefer Strukturen",
        injury_pattern: "Degenerative Gelenkserkrankungen, Arthrose, metabolische Komorbiditäten",
        cvs_risk: "Erhöhtes kardiovaskuläres Risiko",
        fracture_risk: "Niedriges Frakturrisiko (höherer BMI schützend)"
      },
      therapy_implications: [
        "Metabolische Faktoren in Therapieplanung einbeziehen",
        "Gewichtsreduktion als therapeutisches Ziel wenn möglich",
        "Belastungsaufbau langsam und dosiert",
        "Tiefengewebe schwer zugänglich — Ultraschall-Guidance bei Injektionen"
      ],
      manipulation_note: "Technisch anspruchsvoller — Kraftdosierung anpassen",
      cvs_alert: "Kardiovaskuläres Risikoprofil (RP-002) obligatorisch prüfen"
    }
  },

  // Auto-Klassifikation basierend auf BMI + Hypermobilitätsfrage
  auto_classification_logic: {
    ectomorph: {
      criteria: [
        { fact: "bmi", operator: "lessThan", value: 20 }
      ],
      supporting: [
        { fact: "hypermobility_reported", operator: "equal", value: true }
      ]
    },
    endomorph: {
      criteria: [
        { fact: "bmi", operator: "greaterThanInclusive", value: 30 }
      ]
    },
    mesomorph: {
      criteria: [
        { fact: "bmi", operator: "between", value: [20, 29.9] }
      ]
    }
  }
};

// ============================================================
// RP-005: VENÖSES RISIKOPROFIL (Fossum VVS-Kontext)
// Basierend auf Fossum 2026: The Venous System — Connecting the Dots
//
// Fossum: Das Vertebrale Venöse Plexus-System (IVVP + EVVP) ist
// eine bi-direktionale Verbindung zwischen Becken und Schädel.
// Dysfunktionen des venösen Systems beeinflussen:
//  - Intrakraniellen Druck (Kopfschmerz, kognitive Funktion)
//  - Zervikale Nervenwurzel-Symptome (venöse Stauung)
//  - Lymphatischen Rücktransport
//
// Klinische Implikationen für die Anamnese:
//  - Symptome, die auf venöse Stauung / Rückflussstörung hinweisen
//  - Behandlungsplanung: Lymph-/Venöse Techniken priorisieren
// ============================================================

const VENOUS_RISK_PROFILE = {
  id: "RP-005",
  name: "Venöses & lymphatisches Risikoprofil (Fossum VVS)",
  visibility: "therapist_only",

  clinical_context: "Das vertebrale venöse Plexussystem (IVVP) verbindet Schädel und Becken bidirektional. Erhöhter intrakavitärer Druck (z.B. durch Atemrestriktion, Faszienspannungen, Haltungsstörungen) kann den venösen Rückfluss behindern und zu Druckveränderungen im Intravertebralkanal führen.",

  screening_questions: [
    {
      id: "VEN-Q01",
      text: "Haben Sie wiederkehrende Kopfschmerzen, die beim Husten, Pressen oder Vorbeugen schlimmer werden?",
      type: "yes_no",
      relevance: "Mögliche intrakranielle Druckerhöhung / venöse Stauung",
      therapist_flag: "VEN_INTRACRANIAL_PRESSURE"
    },
    {
      id: "VEN-Q02",
      text: "Bemerken Sie morgens nach dem Aufwachen Schwellungen im Gesicht oder Schwere im Kopf, die im Laufe des Tages besser werden?",
      type: "yes_no",
      relevance: "Nächtliche venöse Stauung (horizontale Position verschlechtert Rückfluss)",
      therapist_flag: "VEN_DRAINAGE_IMPAIRED"
    },
    {
      id: "VEN-Q03",
      text: "Haben Sie Krampfadern (Varizen) in den Beinen oder wurde eine chronisch venöse Insuffizienz diagnostiziert?",
      type: "yes_no",
      relevance: "Systemisches venöses Insuffizienz-Zeichen",
      therapist_flag: "VEN_SYSTEMIC_INSUFFICIENCY"
    },
    {
      id: "VEN-Q04",
      text: "Schwellen Ihre Beine oder Knöchel im Laufe des Tages an (besonders beim langen Stehen/Sitzen)?",
      type: "yes_no",
      relevance: "Periphere venöse Insuffizienz / lymphatische Belastung",
      therapist_flag: "VEN_PERIPHERAL_EDEMA"
    },
    {
      id: "VEN-Q05",
      text: "Haben Sie eine eingeschränkte Atemfunktion, Kurzatmigkeit oder atmen Sie überwiegend in den oberen Brustbereich (Brustatmer)?",
      type: "yes_no",
      relevance: "Fossum RC-Modell: Atemrestriktion als Haupthindernis für venösen und lymphatischen Rückfluss",
      therapist_flag: "VEN_BREATHING_RESTRICTION"
    }
  ],

  // Fossum's Hauptprämissen für venöse Behandlung:
  treatment_principles: [
    {
      premise: "Premise 1 — Workload of Breathing reduzieren",
      clinical_application: "Diaphragma-Mobilisation, erste Rippe, thorakale Atemexkursion — BEVOR periphere Manipulationen",
      screening_indicator: "VEN_BREATHING_RESTRICTION"
    },
    {
      premise: "Premise 2 — Obstruktionen des Rückflusses entfernen",
      clinical_application: "Horizontale Diaphragmen: Beckenboden, lumbales Diaphragma, thorakales Diaphragma (Zwerchfell), zervikothorakaler Übergang, tentoriales Diaphragma",
      screening_indicator: "VEN_DRAINAGE_IMPAIRED"
    },
    {
      premise: "Premise 3 — Fluid Flow augmentieren",
      clinical_application: "Lymphatische Pumptechniken, venöse Sinus-Techniken (Schädel), IVVP-Mobilisation durch Wirbelsäulenbehandlung",
      screening_indicator: "VEN_PERIPHERAL_EDEMA"
    }
  ],

  therapist_output_flags: {
    VEN_BREATHING_RESTRICTION: "Atemtherapie priorisieren (RC-Modell: Diaphragma, 1. Rippe, zervikothorakal)",
    VEN_DRAINAGE_IMPAIRED: "Venöse/lymphatische Techniken einplanen (Sinus-Drainage, subokzipitale Techniken)",
    VEN_PERIPHERAL_EDEMA: "Lymphatische Entstauung + Beinvenensystem in Behandlung einbeziehen",
    VEN_INTRACRANIAL_PRESSURE: "⚠️ Prüfe intrakraniellen Druck: Kopfschmerz-Abklärung vor Schädelmanipulation",
    VEN_SYSTEMIC_INSUFFICIENCY: "Systemische venöse Insuffizienz: sanfte Techniken, keine langen Inversionen"
  }
};

// ============================================================
// RP-006: ALLGEMEINES BEHANDLUNGSRISIKO — KONTRAINDIKATIONEN
// Zusammenfassung aller Risiken in eine Therapeuten-Ampel
// ============================================================

const TREATMENT_RISK_SUMMARY = {
  id: "RP-006",
  name: "Behandlungsrisiko-Zusammenfassung",
  visibility: "therapist_only",

  // Diese Funktion aggregiert alle Risikoprofile zu einem Gesamtbild
  compute_overall_risk: function(scores) {
    const {
      cad_class,
      cv_score,
      fx_score,
      somatotype,
      venous_flags
    } = scores;

    const risks = [];
    const contraindications = [];
    const modifications = [];

    // CAD absolute contraindications
    if (cad_class === "ABSOLUTE_CONTRAINDICATION" || cad_class === "HIGH_RISK") {
      contraindications.push("HWS-HVLA kontraindiziert (CAD-Risiko)");
    }

    // High fracture risk
    if (fx_score >= 7) {
      contraindications.push("HVLA kontraindiziert (Frakturrisiko)");
    }

    // High CV risk
    if (cv_score >= 7) {
      modifications.push("Ärztliche Mitbehandlung empfohlen (kardiovaskuläres Risiko)");
    }

    // Ectomorph + hypermobile
    if (somatotype === "ectomorph") {
      modifications.push("Stabilisierung > Mobilisation (Ektomorph / Hypermobilität)");
    }

    // Venous flags
    if (venous_flags && venous_flags.includes("VEN_BREATHING_RESTRICTION")) {
      modifications.push("Atemtherapie als Behandlungsprioriät (Fossum RC-Modell)");
    }

    return {
      contraindications,
      modifications,
      overall_traffic_light: contraindications.length > 0 ? "RED" :
                              modifications.length > 2 ? "YELLOW" : "GREEN"
    };
  },

  // Was zeigt das Therapeuten-Dashboard?
  dashboard_sections: [
    { id: "cad", label: "HWS-Manipulationssicherheit", module: "RP-001", always_show_for: ["hws"] },
    { id: "cv", label: "Kardiovaskuläres Risiko", module: "RP-002", always_show: true },
    { id: "fx", label: "Frakturrisiko", module: "RP-003", show_if_age_gt: 50 },
    { id: "soma", label: "Konstitutionstyp (GOA)", module: "RP-004", always_show: true },
    { id: "ven", label: "Venöses Profil (Fossum)", module: "RP-005", always_show: true }
  ]
};

export {
  CAD_RISK_SCREENING,
  CARDIOVASCULAR_RISK_PROFILE,
  FRACTURE_RISK_PROFILE,
  SOMATOTYPE_PROFILE,
  VENOUS_RISK_PROFILE,
  TREATMENT_RISK_SUMMARY
};
