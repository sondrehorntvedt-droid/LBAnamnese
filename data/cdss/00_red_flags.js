/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 00: RED FLAGS & YELLOW FLAGS
 * ES-Module-Kopie — Inhalt 1:1 identisch zur kanonischen Quelle
 * (CDSS_Regelkatalog/00_red_flags.js).
 *
 * Priorität: HÖCHSTE — wird VOR allen regionalen Regeln ausgewertet.
 */

export const ABSOLUTE_RED_FLAGS = [

  {
    id: "RF-001",
    name: "Cauda-Equina-Syndrom",
    icd10: "G83.4",
    priority: 1,
    action: "NOTAUFNAHME_SOFORT",
    action_text: "Sofort Notaufnahme aufsuchen — innerhalb von 6 Stunden Operationsfenster!",
    questions: [
      {
        id: "RF001-Q1",
        text: "Haben Sie in letzter Zeit Probleme beim Wasserlassen oder beim Stuhlgang — z.B. Harndrang ohne Kontrolle, oder kein Gefühl beim Wasserlassen?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF001-Q2",
        text: "Haben Sie Taubheitsgefühl oder Kribbeln im Bereich des Gesäßes, der Innenseite der Oberschenkel oder um den Genitalbereich (sogenanntes Reithosengefühl)?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF001-Q3",
        text: "Ist bei Ihnen in den letzten Wochen plötzlich eine deutliche Schwäche in einem oder beiden Beinen aufgetreten?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      }
    ],
    rule: {
      conditions: {
        any: [
          { fact: "RF001-Q1", operator: "equal", value: true },
          { fact: "RF001-Q2", operator: "equal", value: true },
          { fact: "RF001-Q3", operator: "equal", value: true }
        ]
      },
      event: {
        type: "red_flag",
        params: {
          flag_id: "RF-001",
          severity: "absolute",
          action: "NOTAUFNAHME_SOFORT",
          display_message: "⚠️ SOFORT NOTAUFNAHME: Mögliches Cauda-Equina-Syndrom. Neurochirurgischer Notfall — Zeitfenster 6 Stunden.",
          therapist_alert: "Cauda Equina Verdacht: RF001-Q1/Q2/Q3 positiv. Patient sofort in Notaufnahme. Keine weiteren Behandlungen.",
          stop_anamnesis: true
        }
      }
    }
  },

  {
    id: "RF-002",
    name: "Verdacht auf Malignität / Metastasen",
    icd10: "C80.1",
    priority: 2,
    action: "DRINGENDE_UEBERWEISUNG",
    action_text: "Dringende Überweisung zum Hausarzt/Onkologen — Bildgebung innerhalb 1 Woche.",
    questions: [
      {
        id: "RF002-Q1",
        text: "Haben oder hatten Sie jemals eine Krebserkrankung (auch vor vielen Jahren)?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"],
        note: "Stärkster Einzelprädiktor für spinale Metastasen (LR+ 14.7)"
      },
      {
        id: "RF002-Q2",
        text: "Haben Sie in den letzten 3 Monaten ohne Diät mehr als 5 kg ungewollt abgenommen?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF002-Q3",
        text: "Haben Sie nachts Schmerzen, die Sie aus dem Schlaf wecken und durch keine Lageänderung besser werden?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF002-Q4",
        text: "Haben Sie in letzter Zeit Nachtschweiß oder unerklärliches Fieber?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      },
      {
        id: "RF002-Q5",
        text: "Sind Sie über 50 Jahre alt und hat Ihr aktueller Schmerz ohne Sturz oder Unfall begonnen und besteht länger als 6 Wochen trotz Behandlung?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"],
        note: "Kombination Alter >50 + kein Trauma + kein Besserung = starker Malignomindikator"
      }
    ],
    rule: {
      conditions: {
        any: [
          { fact: "RF002-Q1", operator: "equal", value: true },
          {
            all: [
              { fact: "RF002-Q2", operator: "equal", value: true },
              { fact: "RF002-Q3", operator: "equal", value: true }
            ]
          },
          {
            all: [
              { fact: "RF002-Q4", operator: "equal", value: true },
              { fact: "RF002-Q5", operator: "equal", value: true }
            ]
          }
        ]
      },
      event: {
        type: "red_flag",
        params: {
          flag_id: "RF-002",
          severity: "absolute",
          action: "DRINGENDE_UEBERWEISUNG",
          display_message: "⚠️ WICHTIG: Bitte suchen Sie umgehend Ihren Arzt auf. Es gibt Hinweise, die eine weitere Abklärung erfordern.",
          therapist_alert: "Red Flag Malignität: RF002-Q positiv. Überweisung Hausarzt/Onkologie. Bildgebung + Labor (BSG, CRP, PSA, Blutbild).",
          stop_anamnesis: false,
          continue_with_note: true
        }
      }
    }
  },

  {
    id: "RF-003",
    name: "Vertebrale Infektion / Spondylodiszitis",
    icd10: "M46.3",
    priority: 3,
    action: "NOTAUFNAHME_BALDMOEGLICH",
    action_text: "Unverzügliche ärztliche Abklärung — innerhalb von 24 Stunden.",
    questions: [
      {
        id: "RF003-Q1",
        text: "Haben Sie aktuell Fieber (über 38°C) oder hatten Sie in den letzten 2 Wochen Fieber?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF003-Q2",
        text: "Haben Sie in letzter Zeit eine Infektion gehabt (z.B. Harnwegsinfektion, Zahnabszess, Hautwunde) oder waren kürzlich im Krankenhaus?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      },
      {
        id: "RF003-Q3",
        text: "Nehmen Sie Medikamente, die das Immunsystem schwächen (z.B. Cortison, Biologika, Chemotherapie), oder haben Sie Diabetes oder HIV?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      },
      {
        id: "RF003-Q4",
        text: "Haben Sie eine lokale Rötung, ungewöhnliche Wärme oder Schwellung an der schmerzhaften Stelle, die neu aufgetreten ist?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      }
    ],
    rule: {
      conditions: {
        any: [
          {
            all: [
              { fact: "RF003-Q1", operator: "equal", value: true },
              { fact: "RF003-Q4", operator: "equal", value: true }
            ]
          },
          {
            all: [
              { fact: "RF003-Q1", operator: "equal", value: true },
              { fact: "RF003-Q2", operator: "equal", value: true }
            ]
          },
          {
            all: [
              { fact: "RF003-Q1", operator: "equal", value: true },
              { fact: "RF003-Q3", operator: "equal", value: true }
            ]
          }
        ]
      },
      event: {
        type: "red_flag",
        params: {
          flag_id: "RF-003",
          severity: "absolute",
          action: "NOTAUFNAHME_BALDMOEGLICH",
          display_message: "⚠️ Bitte suchen Sie innerhalb von 24 Stunden einen Arzt auf. Ihre Symptome erfordern dringende Abklärung.",
          therapist_alert: "Vertebrale Infektion möglich: Fieber + lokale Zeichen / Immunsuppression. Labor: CRP, BSG, Blutbild, Blutkulturen. MRT Wirbelsäule.",
          stop_anamnesis: true
        }
      }
    }
  },

  {
    id: "RF-004",
    name: "Frakturverdacht (Insuffizienz- oder Traumafraktur)",
    icd10: "M84.3",
    priority: 4,
    action: "ROENTGEN_DRINGEND",
    action_text: "Röntgenuntersuchung innerhalb 48 Stunden. Bis zur Bildgebung keine Mobilisierung.",
    questions: [
      {
        id: "RF004-Q1",
        text: "Hatten Sie kürzlich einen Sturz, Unfall oder starken Aufprall auf den betroffenen Bereich?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF004-Q2",
        text: "Haben Sie Osteoporose oder wurde bei Ihnen jemals eine Knochendichtemessung gemacht, die einen niedrigen Wert ergeben hat?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      },
      {
        id: "RF004-Q3",
        text: "Nehmen Sie länger als 3 Monate Cortison (Kortikosteroide)?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      },
      {
        id: "RF004-Q4",
        text: "Haben Sie nach einem Sturz oder Unfall sofort einen starken, gut lokalisierbaren Schmerz gespürt, der sich seitdem kaum gebessert hat?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      }
    ],
    rule: {
      conditions: {
        any: [
          {
            all: [
              { fact: "RF004-Q1", operator: "equal", value: true },
              { fact: "RF004-Q4", operator: "equal", value: true }
            ]
          },
          {
            all: [
              { fact: "RF004-Q2", operator: "equal", value: true },
              { fact: "RF004-Q4", operator: "equal", value: true }
            ]
          },
          {
            all: [
              { fact: "RF004-Q3", operator: "equal", value: true },
              { fact: "RF004-Q4", operator: "equal", value: true }
            ]
          }
        ]
      },
      event: {
        type: "red_flag",
        params: {
          flag_id: "RF-004",
          severity: "absolute",
          action: "ROENTGEN_DRINGEND",
          display_message: "⚠️ Bitte suchen Sie zeitnah Ihren Arzt auf. Es ist wichtig, dass zunächst eine Röntgenaufnahme gemacht wird.",
          therapist_alert: "Frakturverdacht: Trauma + sofortiger Lokalschmerz ODER Osteoporose. Röntgen vor jeder Behandlung. Keine Manipulation.",
          stop_anamnesis: false,
          continue_with_note: true
        }
      }
    }
  },

  {
    id: "RF-005",
    name: "Abdominelles Aortenaneurysma (AAA) / vaskuläre Ursache",
    icd10: "I71.4",
    priority: 5,
    action: "NOTAUFNAHME_SOFORT",
    action_text: "SOFORT Notaufnahme — möglicher vaskulärer Notfall.",
    questions: [
      {
        id: "RF005-Q1",
        text: "Spüren Sie neben dem Rückenschmerz auch einen pulsierenden oder pochenden Schmerz im Bauch?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF005-Q2",
        text: "Haben Sie starke Risikofaktoren für Gefäßerkrankungen: Rauchen (>20 Pack-Years), bekannte Arteriosklerose, Bluthochdruck, Alter >65?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      }
    ],
    rule: {
      conditions: {
        all: [
          { fact: "RF005-Q1", operator: "equal", value: true },
          { fact: "RF005-Q2", operator: "equal", value: true }
        ]
      },
      event: {
        type: "red_flag",
        params: {
          flag_id: "RF-005",
          severity: "absolute",
          action: "NOTAUFNAHME_SOFORT",
          display_message: "⚠️ SOFORT NOTAUFNAHME: Möglicher vaskulärer Notfall.",
          therapist_alert: "AAA Verdacht: Pulsierender Bauchschmerz + vaskuläre Risikofaktoren. Notaufnahme sofort. Keine Mobilisierung.",
          stop_anamnesis: true
        }
      }
    }
  },

  {
    id: "RF-006",
    name: "Tiefe Beinvenenthrombose (TVT)",
    icd10: "I80.2",
    priority: 6,
    action: "ARZT_HEUTE",
    action_text: "Noch heute zum Arzt — Thromboseverdacht muss heute ausgeschlossen werden.",
    questions: [
      {
        id: "RF006-Q1",
        text: "Haben Sie eine einseitige Schwellung des Beins oder der Wade, die neu aufgetreten ist?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF006-Q2",
        text: "Ist die geschwollene Seite des Beins gerötet, warm oder druckschmerzhaft?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF006-Q3",
        text: "Waren Sie in den letzten 4 Wochen für längere Zeit immobilisiert (Bettlägerigkeit, langer Flug >4h, Gips) oder hatten Sie eine Operation?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      }
    ],
    rule: {
      conditions: {
        any: [
          {
            all: [
              { fact: "RF006-Q1", operator: "equal", value: true },
              { fact: "RF006-Q2", operator: "equal", value: true }
            ]
          },
          {
            all: [
              { fact: "RF006-Q1", operator: "equal", value: true },
              { fact: "RF006-Q3", operator: "equal", value: true }
            ]
          }
        ]
      },
      event: {
        type: "red_flag",
        params: {
          flag_id: "RF-006",
          severity: "absolute",
          action: "ARZT_HEUTE",
          display_message: "⚠️ Bitte suchen Sie HEUTE noch einen Arzt auf. Ihre Symptome könnten auf eine Thrombose hinweisen.",
          therapist_alert: "TVT Verdacht: Einseitige Beinschwellung + Rötung/Wärme ± Immobilisation. Wells Score berechnen. D-Dimer + Duplexsonographie.",
          stop_anamnesis: true
        }
      }
    }
  },

  {
    id: "RF-007",
    name: "Zervikale / Thorakale Myelopathie",
    icd10: "G99.2",
    priority: 7,
    action: "MRT_DRINGEND_NEUROCHIRURGIE",
    action_text: "Dringende MRT + Vorstellung Neurochirurgie/Neurologie.",
    questions: [
      {
        id: "RF007-Q1",
        text: "Haben Sie Probleme mit der Feinmotorik der Hände — z.B. Knöpfe schließen, Schreiben, Besteck halten?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF007-Q2",
        text: "Haben Sie Gleichgewichtsprobleme oder einen unsicheren, schwankenden Gang?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      },
      {
        id: "RF007-Q3",
        text: "Haben Sie ein elektrisierendes Gefühl, das beim Kopfbeugen nach vorne in Arme oder Beine schießt (sogenanntes L'Hermitte-Zeichen)?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      },
      {
        id: "RF007-Q4",
        text: "Haben Sie beidseitige Symptome in Armen und Beinen gleichzeitig (Schwäche, Taubheit, Kribbeln)?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["short", "standard", "deep"]
      }
    ],
    rule: {
      conditions: {
        any: [
          {
            all: [
              { fact: "RF007-Q1", operator: "equal", value: true },
              { fact: "RF007-Q2", operator: "equal", value: true }
            ]
          },
          { fact: "RF007-Q3", operator: "equal", value: true },
          {
            all: [
              { fact: "RF007-Q4", operator: "equal", value: true },
              { fact: "region_primary", operator: "in", value: ["hws", "bws"] }
            ]
          }
        ]
      },
      event: {
        type: "red_flag",
        params: {
          flag_id: "RF-007",
          severity: "absolute",
          action: "MRT_DRINGEND_NEUROCHIRURGIE",
          display_message: "⚠️ Ihre Symptome erfordern dringende bildgebende Untersuchung und neurologische Abklärung.",
          therapist_alert: "Myelopathie Verdacht: Feinmotorik + Gangstörung ± L'Hermitte. MRT HWS/BWS dringend. Neurochirurgie/Neurologie.",
          stop_anamnesis: true
        }
      }
    }
  },

  {
    id: "RF-008",
    name: "Entzündliche Arthritis / systemische Erkrankung",
    icd10: "M79.3",
    priority: 8,
    action: "RHEUMATOLOGE_UEBERWEISUNG",
    action_text: "Überweisung zum Rheumatologen innerhalb 2 Wochen.",
    questions: [
      {
        id: "RF008-Q1",
        text: "Haben Sie Morgensteifigkeit, die länger als 45 Minuten anhält, bevor die Gelenke wieder beweglicher werden?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      },
      {
        id: "RF008-Q2",
        text: "Sind mehrere Gelenke gleichzeitig betroffen (z.B. Finger, Zehen, Knie, Wirbelsäule)?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      },
      {
        id: "RF008-Q3",
        text: "Haben Sie oder hat jemand in Ihrer Familie Schuppenflechte (Psoriasis), Morbus Bechterew oder chronisch-entzündliche Darmerkrankungen (Crohn, Colitis)?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"]
      },
      {
        id: "RF008-Q4",
        text: "Bessern sich Ihre Schmerzen deutlich unter Bewegung und Aktivität, während Ruhe sie verschlimmert?",
        type: "yes_no",
        red_flag_if: true,
        variants: ["standard", "deep"],
        note: "Inflammatorisches Schmerzmuster (ASAS-Kriterium)"
      }
    ],
    rule: {
      conditions: {
        all: [
          { fact: "RF008-Q1", operator: "equal", value: true },
          {
            any: [
              { fact: "RF008-Q2", operator: "equal", value: true },
              { fact: "RF008-Q3", operator: "equal", value: true },
              { fact: "RF008-Q4", operator: "equal", value: true }
            ]
          }
        ]
      },
      event: {
        type: "red_flag",
        params: {
          flag_id: "RF-008",
          severity: "relative",
          action: "RHEUMATOLOGE_UEBERWEISUNG",
          display_message: "ℹ️ Einige Ihrer Beschwerden könnten auf eine entzündliche Gelenkerkrankung hinweisen. Ihr Arzt sollte dies abklären.",
          therapist_alert: "Entzündliche Arthritis möglich: Morgensteifigkeit >45min + Mehrglenksbefall/FamAnamnese/inflammatorisches Muster. Rheumatologie.",
          stop_anamnesis: false
        }
      }
    }
  }
];

export const YELLOW_FLAGS = [
  {
    id: "YF-001",
    name: "Fear-Avoidance-Verhalten",
    questions: [
      {
        id: "YF001-Q1",
        text: "Haben Sie Angst, dass Bewegung Ihren Schmerz verschlimmern oder dauerhaft schaden könnte?",
        type: "scale_0_10",
        yellow_flag_if_gte: 6,
        variants: ["standard", "deep"]
      },
      {
        id: "YF001-Q2",
        text: "Vermeiden Sie bestimmte Aktivitäten oder Bewegungen aus Angst vor Schmerz?",
        type: "yes_no",
        yellow_flag_if: true,
        variants: ["standard", "deep"]
      }
    ],
    scoring_weight: 2,
    therapy_implication: "Graded Exposure, Pain Neuroscience Education (PNE) einplanen"
  },
  {
    id: "YF-002",
    name: "Katastrophisieren",
    questions: [
      {
        id: "YF002-Q1",
        text: "Denken Sie manchmal, dass Ihr Schmerz niemals besser wird oder dass etwas Schlimmes in Ihrem Körper passiert?",
        type: "yes_no",
        yellow_flag_if: true,
        variants: ["standard", "deep"]
      },
      {
        id: "YF002-Q2",
        text: "Wie sehr glauben Sie, dass Ihr Schmerz durch körperliche Schäden verursacht wird (0 = gar nicht, 10 = vollständig)?",
        type: "scale_0_10",
        yellow_flag_if_gte: 8,
        variants: ["deep"]
      }
    ],
    scoring_weight: 3,
    therapy_implication: "Pain Neuroscience Education, psychologische Mitbehandlung erwägen"
  },
  {
    id: "YF-003",
    name: "Depressivität / PHQ-2 Screening",
    questions: [
      {
        id: "YF003-Q1",
        text: "Wie oft haben Sie sich in den letzten 2 Wochen niedergeschlagen, deprimiert oder hoffnungslos gefühlt?",
        type: "frequency_4",
        yellow_flag_if_gte: 2,
        variants: ["standard", "deep"],
        validated_scale: "PHQ-2 Item 1"
      },
      {
        id: "YF003-Q2",
        text: "Wie oft hatten Sie in den letzten 2 Wochen wenig Interesse oder Freude an Dingen, die Ihnen sonst wichtig sind?",
        type: "frequency_4",
        yellow_flag_if_gte: 2,
        variants: ["standard", "deep"],
        validated_scale: "PHQ-2 Item 2"
      }
    ],
    scoring_weight: 3,
    therapy_implication: "Bei Score ≥3: PHQ-9 Vollversion durchführen. Psychologische Mitbehandlung / Hausarzt."
  },
  {
    id: "YF-004",
    name: "Schmerz-Selbstwirksamkeit (niedrig)",
    questions: [
      {
        id: "YF004-Q1",
        text: "Wie zuversichtlich sind Sie, dass Sie Ihren Alltag trotz der Schmerzen bewältigen können (0 = gar nicht zuversichtlich, 10 = sehr zuversichtlich)?",
        type: "scale_0_10",
        yellow_flag_if_lte: 4,
        variants: ["standard", "deep"]
      }
    ],
    scoring_weight: 2,
    therapy_implication: "Selbstwirksamkeitstraining, Aktivierungs-/Motivationsförderung"
  },
  {
    id: "YF-005",
    name: "Arbeitsplatzbezogene Faktoren",
    questions: [
      {
        id: "YF005-Q1",
        text: "Macht Ihnen Ihre Arbeit Freude, oder gibt es dort Konflikte oder großen Druck, der Ihnen Sorgen bereitet?",
        type: "select",
        options: [
          { value: "zufrieden", label: "Ich bin zufrieden mit meiner Arbeit" },
          { value: "neutral", label: "Teils-teils" },
          { value: "unzufrieden", label: "Ich bin unzufrieden / habe Stress bei der Arbeit" },
          { value: "arbeitslos", label: "Ich arbeite aktuell nicht" }
        ],
        yellow_flag_if: ["unzufrieden"],
        variants: ["deep"]
      },
      {
        id: "YF005-Q2",
        text: "Glauben Sie, dass Sie durch Ihren Schmerz dauerhaft nicht mehr arbeiten können werden?",
        type: "yes_no",
        yellow_flag_if: true,
        variants: ["standard", "deep"]
      }
    ],
    scoring_weight: 2,
    therapy_implication: "Betriebliche Eingliederung ansprechen, sozialmedizinische Beratung"
  },
  {
    id: "YF-006",
    name: "Chronischer Schmerz / Lange Krankengeschichte",
    questions: [
      {
        id: "YF006-Q1",
        text: "Wie lange haben Sie diese oder ähnliche Schmerzen bereits?",
        type: "duration_select",
        options: [
          { value: "acute", label: "Weniger als 6 Wochen", flag: false },
          { value: "subacute", label: "6–12 Wochen", flag: false },
          { value: "chronic_3mo", label: "3–6 Monate", flag: true },
          { value: "chronic_6mo", label: "6–12 Monate", flag: true },
          { value: "chronic_1y", label: "Mehr als 1 Jahr", flag: true }
        ],
        yellow_flag_if: ["chronic_3mo", "chronic_6mo", "chronic_1y"],
        variants: ["short", "standard", "deep"]
      },
      {
        id: "YF006-Q2",
        text: "Haben Sie wegen dieser Beschwerden schon mehrfach Therapien gemacht, die wenig geholfen haben?",
        type: "yes_no",
        yellow_flag_if: true,
        variants: ["standard", "deep"]
      }
    ],
    scoring_weight: 1,
    therapy_implication: "Chronifizierungsmodell erklären, multimodal planen"
  }
];

export const YELLOW_FLAG_RISK_LEVELS = {
  low: { min_score: 0, max_score: 3, label: "Niedriges psychosoziales Risiko", therapy_path: "Primär physikalische Therapie ausreichend" },
  medium: { min_score: 4, max_score: 7, label: "Mittleres psychosoziales Risiko", therapy_path: "Physikalische Therapie + PNE + Aktivierungsstrategien" },
  high: { min_score: 8, max_score: 99, label: "Hohes psychosoziales Risiko (Chronifizierungsgefahr)", therapy_path: "Multimodaler Ansatz: Physiotherapie + psychologische Mitbehandlung + ggf. Schmerzambulanz" }
};

export const RED_FLAG_SCREENING_SEQUENCE = {
  step_1_all_variants: ["RF001-Q1", "RF001-Q2", "RF001-Q3", "RF006-Q1", "RF006-Q2", "RF007-Q1", "RF007-Q2"],
  step_2_standard_deep: ["RF002-Q1", "RF002-Q2", "RF002-Q3", "RF003-Q1", "RF003-Q4", "RF004-Q1", "RF004-Q4", "RF005-Q1"],
  step_3_deep: ["RF002-Q4", "RF002-Q5", "RF003-Q2", "RF003-Q3", "RF004-Q2", "RF004-Q3", "RF005-Q2", "RF008-Q1", "RF008-Q2", "RF008-Q3", "RF008-Q4"],
  yellow_flags_standard: ["YF001-Q1", "YF001-Q2", "YF002-Q1", "YF003-Q1", "YF003-Q2", "YF004-Q1", "YF005-Q2", "YF006-Q1", "YF006-Q2"],
  yellow_flags_deep: ["YF002-Q2", "YF005-Q1"]
};
