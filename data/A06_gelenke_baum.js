/**
 * LINDEBERGS OS — Adaptiver Fragenbaum
 * Modul A06: GELENKE & BEWEGUNGSAPPARAT
 * ES-Module-Kopie — Inhalt 1:1 identisch zur kanonischen Quelle.
 *
 * DETERMINISTISCH: Gleiche Eingabe → immer gleiche Ausgabe.
 * Keine KI-Entscheidungen — nur Regellogik (json-rules-engine-kompatibel).
 */

export function computeGelenkFragenPfad(gelenk_id, kontext) {
  const gelenk = GELENKE_BAUM[gelenk_id];
  if (!gelenk) return { fragen: [], cdss_gewichte: {}, red_flag_alert: false };

  const fragen = [...(gelenk.screening || []).map(f => f.id)];
  const cdss_gewichte = {};
  let red_flag_alert = false;

  if (gelenk.red_flags) {
    gelenk.red_flags.forEach(rf => {
      if (evalBedingung(rf.bedingung, kontext)) {
        red_flag_alert = true;
        rf.cdss_gewicht && Object.assign(cdss_gewichte, rf.cdss_gewicht);
      }
    });
  }

  if (gelenk.verzweigung) {
    gelenk.verzweigung.forEach(regel => {
      if (evalBedingung(regel.bedingung, kontext)) {
        (regel.fragen || []).forEach(f => { if (!fragen.includes(f.id)) fragen.push(f.id); });
        if (regel.cdss_gewicht) Object.assign(cdss_gewichte, regel.cdss_gewicht);
      }
    });
  }

  return { fragen, cdss_gewichte, red_flag_alert };
}

export function evalBedingung(bedingung, kontext) {
  if (!bedingung) return true;
  const { feld, op, wert } = bedingung;
  const val = kontext[feld];
  switch(op) {
    case ">=": return val >= wert;
    case "<=": return val <= wert;
    case ">":  return val > wert;
    case "<":  return val < wert;
    case "==": return val == wert;
    case "in": return Array.isArray(wert) && wert.includes(val);
    case "includes": return Array.isArray(val) && val.includes(wert);
    case "any": return Array.isArray(val) && wert.some(w => val.includes(w));
    default: return false;
  }
}

export const GELENKE_BAUM = {

  KIEFER_TMJ: {
    id: "KIEFER_TMJ",
    name: "Kiefergelenk (Temporomandibulargelenk, TMJ)",
    gruppe: "Kopf & Kiefer",
    icd10: ["K07.6", "M26.6"],
    cdss_modul: "12_kiefer_tmj",
    screening: [
      { id: "TMJ-001", frage: "Auf welcher Seite haben Sie Kieferbeschwerden?", type: "single_choice", options: ["links", "rechts", "beidseitig"] },
      { id: "TMJ-002", frage: "Haben Sie Schmerzen beim Kauen, Gähnen oder Mund öffnen?", type: "yes_no" },
      { id: "TMJ-003", frage: "Hören oder spüren Sie ein Knacken oder Reiben im Kiefer?", type: "single_choice", options: ["kein Geräusch", "Knacken", "Reiben/Knirschen", "beides"] },
      { id: "TMJ-004", frage: "Wie weit können Sie den Mund öffnen? (Daumen-Test)", type: "single_choice", options: ["normal (3 Finger)", "leicht eingeschränkt (2 Finger)", "stark eingeschränkt (<2 Finger)", "Mund kaum öffenbar"] },
      { id: "TMJ-005", frage: "Haben Sie Zähne knirschen / Bruxismus (besonders nachts)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "trauma", op: "==", wert: true }, cdss_gewicht: { diskusverlagerung: +3, fraktur: +2 },
        fragen: [{ id: "TMJ-B-001", frage: "Art des Traumas? (Schlag, Unfall, Zahnbehandlung)", type: "textarea" }] },
      { bedingung: { feld: "alter", op: ">=", wert: 50 }, cdss_gewicht: { tmj_arthrose: +3 },
        fragen: [{ id: "TMJ-B-002", frage: "Hatten Sie eine Kiefergelenkbehandlung oder -OP?", type: "yes_no" }] },
      { bedingung: { feld: "onset_dauer", op: ">=", wert: 90 }, cdss_gewicht: { chronische_tmj: +3, myofasziales_schmerzsyndrom: +2 },
        fragen: [
          { id: "TMJ-B-003", frage: "Haben Sie gleichzeitig Kopfschmerzen, Nackenschmerzen oder Tinnitus?", type: "multiple_choice", options: ["Kopfschmerzen", "Nackenschmerzen", "Tinnitus", "Schwindel", "keines"] },
          { id: "TMJ-B-004", frage: "Tragen Sie eine Aufbissschiene?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "kiefersperre", op: "==", wert: true }, cdss_gewicht: { diskusverlagerung_ohne_reposition: +5 },
        hinweis: "Kiefersperre → sofortige oralchirurgische Abklärung" }
    ]
  },

  KLAVIKULA: {
    id: "KLAVIKULA",
    name: "Klavikula / Schlüsselbein",
    gruppe: "Schulter & Schlüsselbein",
    icd10: ["S42.0", "M89.8"],
    cdss_modul: "01_schulter",
    screening: [
      { id: "KLA-001", frage: "Liegt ein Trauma vor (Sturz, Aufprall)?", type: "yes_no" },
      { id: "KLA-002", frage: "Schmerz über dem Schlüsselbein oder an der Schulter-Hals-Grenze?", type: "single_choice", options: ["mediales Drittel (brustseitig)", "mittleres Drittel", "laterales Drittel (schulterseitig)", "gesamt"] },
      { id: "KLA-003", frage: "Sehen Sie eine sichtbare Verformung oder Schwellung?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "trauma", op: "==", wert: true }, cdss_gewicht: { klavikulafraktur: +5 },
        fragen: [
          { id: "KLA-B-001", frage: "Können Sie den Arm noch heben?", type: "yes_no" },
          { id: "KLA-B-002", frage: "Wann passierte der Unfall?", type: "single_choice", options: ["heute", "gestern", "vor 2-7 Tagen", "vor >1 Woche"] }
        ]
      },
      { bedingung: { feld: "trauma", op: "==", wert: false }, cdss_gewicht: { os_exostose: +1, tumor: +1 },
        fragen: [{ id: "KLA-B-003", frage: "Bemerken Sie eine tastbare harte Verdickung?", type: "yes_no" }] }
    ],
    red_flags: [
      { bedingung: { feld: "sichtbare_verformung", op: "==", wert: true },
        cdss_gewicht: { klavikulafraktur: +5 }, hinweis: "Mögliche Fraktur → Röntgen obligat" }
    ]
  },

  AC_GELENK: {
    id: "AC_GELENK",
    name: "Akromioklavikulargelenk (AC-Gelenk)",
    gruppe: "Schulter & Schlüsselbein",
    icd10: ["M75.5", "S43.1"],
    cdss_modul: "01_schulter",
    screening: [
      { id: "AC-001", frage: "Schmerz genau an der Schultergelenkoberfläche (Schultereck)?", type: "yes_no" },
      { id: "AC-002", frage: "Schmerz bei Arm über die Mittellinie führen (Queraddukton)?", type: "yes_no" },
      { id: "AC-003", frage: "Sturz auf die Schulter oder auf den ausgestreckten Arm?", type: "yes_no" },
      { id: "AC-004", frage: "Hochdrücken-Schmerz beim Sport (Bankdrücken, Liegestütz)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "trauma", op: "==", wert: true }, cdss_gewicht: { ac_sprengung: +4 },
        fragen: [{ id: "AC-B-001", frage: "Sehen Sie eine 'Stufe' oder Erhöhung am Schultereck?", type: "yes_no" }] },
      { bedingung: { feld: "onset_dauer", op: ">=", wert: 90 }, cdss_gewicht: { ac_arthrose: +3 },
        fragen: [{ id: "AC-B-002", frage: "Schmerzt das Schultereck beim Schlafen auf der Seite?", type: "yes_no" }] }
    ]
  },

  SCHULTER_GH: {
    id: "SCHULTER_GH",
    name: "Schultergelenk (Glenohumeralgelenk, GHG)",
    gruppe: "Schulter & Schlüsselbein",
    icd10: ["M75.0", "M75.1", "M75.3"],
    cdss_modul: "01_schulter",
    screening: [
      { id: "SCH-001", frage: "Wo ist der Hauptschmerz?", type: "single_choice", options: ["vorne", "seitlich", "hinten", "tief innen", "ausstrahlung in Arm"] },
      { id: "SCH-002", frage: "Wie hoch können Sie den Arm heben?", type: "single_choice", options: ["vollständig (180°)", "bis Schulterhöhe (90°)", "nur wenig (<90°)", "kaum möglich"] },
      { id: "SCH-003", frage: "Schmerzt die Schulter nachts und beim Liegen darauf?", type: "yes_no" },
      { id: "SCH-004", frage: "Fühlt sich die Schulter instabil an oder springt heraus?", type: "yes_no" },
      { id: "SCH-005", frage: "Begann die Einschränkung schleichend ohne Trauma?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "alter", op: ">=", wert: 50 }, cdss_gewicht: { omarthrose: +2, frozen_shoulder: +3, riss_rotatorenmanschette: +2 },
        fragen: [
          { id: "SCH-A-001", frage: "Können Sie den Arm nach außen drehen (Hand hinter Kopf)?", type: "single_choice", options: ["vollständig", "eingeschränkt", "kaum möglich"] },
          { id: "SCH-A-002", frage: "Hat eine Diabetes-Erkrankung bestanden?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "onset_dauer", op: "<=", wert: 7 }, cdss_gewicht: { traumatische_rotatorenmanschette: +3, schulterluxation: +2 },
        fragen: [
          { id: "SCH-B-001", frage: "Wie kam es dazu? (Sport, Sturz, Heben, unklar)", type: "single_choice", options: ["Sport", "Sturz auf Arm/Schulter", "schweres Heben", "plötzlich beim Heben", "unklar schleichend"] },
          { id: "SCH-B-002", frage: "Ist die Schulter nach vorne aus dem Gelenk gesprungen?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "alter", op: "<", wert: 40 }, cdss_gewicht: { schulterinstabilitaet: +3, slap_laesion: +2, bankart: +2 },
        fragen: [
          { id: "SCH-C-001", frage: "Haben Sie eine Vorgeschichte von Schulterluxationen?", type: "yes_no" },
          { id: "SCH-C-002", frage: "Sport mit Überkopfbelastung (Volleyball, Schwimmen, Werfen)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "onset_dauer", op: ">=", wert: 90 }, cdss_gewicht: { impingement: +3, subakromiale_bursitis: +2 },
        fragen: [
          { id: "SCH-D-001", frage: "Schmerzt die Schulter beim Heben des Arms zwischen 60-120°? (Schmerzbogen)", type: "yes_no" },
          { id: "SCH-D-002", frage: "Beruf oder Aktivität mit häufiger Überkopfarbeit?", type: "yes_no" }
        ]
      },
      // Antwortgesteuerte Vertiefung (unabhängig vom Alter) — öffnet nur bei „Ja".
      { bedingung: { feld: "instabilitaet", op: "==", wert: true }, cdss_gewicht: { schulterinstabilitaet: +4, bankart: +2, slap_laesion: +2 },
        fragen: [
          { id: "SCH-INST-001", frage: "War die Schulter schon einmal (teil-)ausgerenkt?", type: "single_choice", options: ["nein", "einmal", "mehrfach"] },
          { id: "SCH-INST-002", frage: "Unsicheres/ängstliches Gefühl, wenn der Arm nach außen-oben geführt wird (z.B. Ausholen zum Wurf)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "nachtschmerz_schleichend", op: "==", wert: true }, cdss_gewicht: { frozen_shoulder: +3, riss_rotatorenmanschette: +2, subakromiale_bursitis: +1 },
        fragen: [
          { id: "SCH-CAP-001", frage: "Ist die Außendrehung des Arms auch dann blockiert, wenn jemand anderes den Arm passiv bewegt?", type: "single_choice", options: ["frei", "etwas eingeschränkt", "stark blockiert"] }
        ]
      },
      { bedingung: { feld: "schulter_ausstrahlung_arm", op: "==", wert: true }, cdss_gewicht: { zervikale_mitbeteiligung: +2 },
        fragen: [
          { id: "SCH-CERV-001", frage: "Strahlt der Schmerz über den Ellenbogen hinaus bis in Hand/Finger?", type: "yes_no" },
          { id: "SCH-CERV-002", frage: "Ändert sich der Schmerz mit Kopf-/Nackenbewegungen?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "gewichtsverlust_unerklart", op: "==", wert: true },
        cdss_gewicht: { pancoast_tumor: +3 }, hinweis: "Unerklärter Gewichtsverlust + Schulter → Pancoast ausschließen" }
    ]
  },

  SKAPULA: {
    id: "SKAPULA",
    name: "Schulterblatt (Skapula) & Skapulathoraxgelenk",
    gruppe: "Schulter & Schlüsselbein",
    icd10: ["M54.6", "M62.8"],
    cdss_modul: "01_schulter",
    screening: [
      { id: "SKA-001", frage: "Schmerzt der Bereich zwischen Schulterblatt und Wirbelsäule?", type: "yes_no" },
      { id: "SKA-002", frage: "Steht das Schulterblatt ab (Scapula alata)?", type: "yes_no" },
      { id: "SKA-003", frage: "Knacken oder Knirschen bei Schulterblattbewegung?", type: "yes_no" },
      { id: "SKA-004", frage: "Taubheit oder Kribbeln im Arm (Halssymptome)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "skapula_alata", op: "==", wert: true }, cdss_gewicht: { n_thoracicus_longus_parese: +4 },
        fragen: [{ id: "SKA-B-001", frage: "Vorausgegangene schwere körperliche Belastung, Injektion oder Trauma?", type: "yes_no" }] }
    ]
  },

  ELLBOGEN: {
    id: "ELLBOGEN",
    name: "Ellbogengelenk",
    gruppe: "Obere Extremität",
    icd10: ["M77.1", "M77.0", "M70.2"],
    cdss_modul: "07_ellenbogen",
    screening: [
      { id: "ELL-001", frage: "Wo ist der Schmerzschwerpunkt?", type: "single_choice", options: ["außen (lateraler Epicondylus)", "innen (medialer Epicondylus)", "hinter dem Ellbogen (Olekranon)", "vorne (Ellenbeuge)", "diffus"] },
      { id: "ELL-002", frage: "Schmerzt das Greifen, Tippen oder Schrauben?", type: "yes_no" },
      { id: "ELL-003", frage: "Kann der Ellbogen vollständig gestreckt/gebeugt werden?", type: "single_choice", options: ["vollständig", "Streckdefizit", "Beugedefizit", "beides eingeschränkt"] },
      { id: "ELL-004", frage: "Kribbeln oder Taubheit in Ringfinger oder kleinem Finger?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "schmerz_lateral", op: "==", wert: true }, cdss_gewicht: { epikondylalgie_lateral: +4, radialis_kompressionssyndrom: +2 },
        fragen: [
          { id: "ELL-B-001", frage: "Schmerzt die Unterarmstreckung gegen Widerstand (Handgelenk nach oben)?", type: "yes_no" },
          { id: "ELL-B-002", frage: "Berufsbedingte Repetitivbelastung (Maus, Schraube, Sport)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "kribbeln_ulnar", op: "==", wert: true }, cdss_gewicht: { kubitaltunnelsyndrom: +4, ulnaris_kompressionssyndrom: +3 },
        fragen: [
          { id: "ELL-C-001", frage: "Kribbeln beim Ellbogen aufstützen oder bei Arm-Überstreckung?", type: "yes_no" },
          { id: "ELL-C-002", frage: "Schwäche beim Finger spreizen oder Faustschluss?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "alter", op: "<=", wert: 16 }, cdss_gewicht: { epikondylus_avulsion: +3, morbus_panner: +2 },
        fragen: [{ id: "ELL-D-001", frage: "Sport mit Wurf- oder Schlagbewegungen (Baseball, Tennis, Handball)?", type: "yes_no" }] }
    ]
  },

  UNTERARM: {
    id: "UNTERARM",
    name: "Unterarm (Radius, Ulna, Membrana interossea)",
    gruppe: "Obere Extremität",
    icd10: ["S52", "M79.8"],
    cdss_modul: "07_ellenbogen",
    screening: [
      { id: "UFA-001", frage: "Schmerzt die Unterarmdrehung (Pronation/Supination)?", type: "yes_no" },
      { id: "UFA-002", frage: "Liegt ein Trauma vor?", type: "yes_no" },
      { id: "UFA-003", frage: "Kribbeln oder Taubheit in Fingern?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "trauma", op: "==", wert: true }, cdss_gewicht: { radiusfraktur: +3, ulnafraktur: +2 } },
      { bedingung: { feld: "drehschmerz", op: "==", wert: true }, cdss_gewicht: { pradu_subluxation: +3, membrana_interossea: +2 } }
    ]
  },

  HANDGELENK: {
    id: "HANDGELENK",
    name: "Handgelenk (Radiokarpalgelenk, DRUJ)",
    gruppe: "Obere Extremität",
    icd10: ["M19.03", "S62.0", "M65.4"],
    cdss_modul: "08_hand_handgelenk",
    screening: [
      { id: "HG-001", frage: "Wo ist der Schmerz?", type: "multiple_choice", options: ["radial/daumenseitig", "ulnar/kleinfingerseitig", "dorsal/Handrücken", "palmar/Handinnenfläche", "diffus"] },
      { id: "HG-002", frage: "Schmerzt das Handgelenk beim Stützen (Liegestütz, Aufstützen)?", type: "yes_no" },
      { id: "HG-003", frage: "Bestand ein Sturz auf die ausgestreckte Hand?", type: "yes_no" },
      { id: "HG-004", frage: "Hörten/fühlten Sie ein Knacken zum Zeitpunkt des Traumas?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "schmerz_radial", op: "==", wert: true }, cdss_gewicht: { de_quervain: +3, skaphoidfraktur: +2, rhizarthrose: +2 },
        fragen: [
          { id: "HG-B-001", frage: "Schmerzt das Bewegen des Daumens, Schreiben, Tippen?", type: "yes_no" },
          { id: "HG-B-002", frage: "Schmerz bei Finkelstein-Test (Daumen einknicken, Handgelenk ulnardeviation)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "schmerz_ulnar", op: "==", wert: true }, cdss_gewicht: { tfcc_laesion: +4, lunotriquetrum_instabilitaet: +2, hamatumfraktur: +2 },
        fragen: [
          { id: "HG-C-001", frage: "Schmerzt die Unterarmdrehung (Schraube aufdrehen)?", type: "yes_no" },
          { id: "HG-C-002", frage: "Kontaktsport oder Sturz auf Handgelenk?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "trauma", op: "==", wert: true }, cdss_gewicht: { skaphoidfraktur: +4, distale_radiusfraktur: +3 },
        fragen: [
          { id: "HG-D-001", frage: "Druckschmerz in der Tabatière (Grübchen zw. Daumen-Strecksehnen)?", type: "yes_no" }
        ]
      }
    ]
  },

  HAND_FINGER: {
    id: "HAND_FINGER",
    name: "Hand & Finger (MCP, PIP, DIP, Daumen-Sattelgelenk)",
    gruppe: "Obere Extremität",
    icd10: ["M19.04", "M65.3", "M20.0"],
    cdss_modul: "08_hand_handgelenk",
    screening: [
      { id: "HAF-001", frage: "Welche Finger sind betroffen?", type: "multiple_choice", options: ["Daumen", "Zeigefinger", "Mittelfinger", "Ringfinger", "Kleinfinger", "mehrere"] },
      { id: "HAF-002", frage: "Morgensteifigkeit der Finger (>30 min)?", type: "yes_no" },
      { id: "HAF-003", frage: "Schwellungen oder Deformierungen der Gelenke?", type: "yes_no" },
      { id: "HAF-004", frage: "Schnappender oder blockierender Finger?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "morgensteifigkeit", op: "==", wert: true }, cdss_gewicht: { rheumatoide_arthritis: +4, psoriasis_arthritis: +3 },
        fragen: [
          { id: "HAF-B-001", frage: "Symmetrische Schwellungen in mehreren Gelenken?", type: "yes_no" },
          { id: "HAF-B-002", frage: "Vorbekannte Schuppenflechte (Psoriasis)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "schnappender_finger", op: "==", wert: true }, cdss_gewicht: { schnellender_finger: +5 },
        fragen: [{ id: "HAF-C-001", frage: "Welcher Finger schnappt? Schmerzt das Schnappen?", type: "textarea" }] },
      { bedingung: { feld: "alter", op: ">=", wert: 50 }, cdss_gewicht: { fingerpolyarthrose: +3, heberden_bouchard: +2 },
        fragen: [{ id: "HAF-D-001", frage: "Knötelartige Verdickungen an den Fingergelenken?", type: "yes_no" }] },
      { bedingung: { feld: "trauma", op: "==", wert: true }, cdss_gewicht: { fingerfraktur: +3, bandruptur_finger: +3 },
        fragen: [{ id: "HAF-E-001", frage: "Welcher Finger, wie ist es passiert? (Klemmen, Umknicken, Sportverletzung)", type: "textarea" }] }
    ]
  },

  HWS: {
    id: "HWS",
    name: "Halswirbelsäule (HWS, C0–C7)",
    gruppe: "Wirbelsäule",
    icd10: ["M54.2", "M50.1", "M47.8"],
    cdss_modul: "04_hws",
    screening: [
      { id: "HWS-001", frage: "Wo genau ist der Schmerz?", type: "multiple_choice", options: ["Nacken/Hinterkopf", "seitlicher Hals", "zwischen Schulterblättern", "Ausstrahlung in Arm/Hand", "Kopfschmerzen occipital"] },
      { id: "HWS-002", frage: "Kribbeln, Taubheit oder Schwäche in Arm/Hand?", type: "yes_no" },
      { id: "HWS-003", frage: "Morgensteifigkeit im Nacken?", type: "yes_no" },
      { id: "HWS-004", frage: "Schleudertrauma oder Unfall in der Vorgeschichte?", type: "yes_no" },
      { id: "HWS-005", frage: "Schwindel bei Kopfdrehung?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "ausstrahlung_arm", op: "==", wert: true }, cdss_gewicht: { zervikale_radikulopathie: +4, bandscheibe_hws: +3, foramenstenose: +2 },
        fragen: [
          { id: "HWS-B-001", frage: "Welcher Arm ist betroffen? In welche Finger strahlt es aus?", type: "textarea" },
          { id: "HWS-B-002", frage: "Verschlimmert sich das Kribbeln beim Husten oder Pressen?", type: "yes_no" },
          { id: "HWS-B-003", frage: "Schwäche beim Greifen oder Arm heben?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "trauma_hws", op: "==", wert: true }, cdss_gewicht: { wad_schleudertrauma: +4, hws_distorsion: +3 },
        fragen: [
          { id: "HWS-C-001", frage: "Art des Unfalls? (Auffahrunfall, Sturz, Sport)", type: "single_choice", options: ["Auffahrunfall von hinten", "Auffahrunfall von vorne/seitlich", "Sturz", "Sportkontakt", "anderes"] },
          { id: "HWS-C-002", frage: "Wann war der Unfall? Wurden Sie untersucht?", type: "textarea" },
          { id: "HWS-C-003", frage: "Sehstörungen, Schluckbeschwerden oder Heiserkeit danach?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "schwindel_kopfdrehung", op: "==", wert: true }, cdss_gewicht: { vertebralis_insuffizienz: +3, zkis: +3, hws_facette: +2 },
        fragen: [
          { id: "HWS-D-001", frage: "Wie lange hält der Schwindel an?", type: "single_choice", options: ["Sekunden", "Minuten", "Stunden", "anhaltend"] },
          { id: "HWS-D-002", frage: "Doppelbilder, Schluckbeschwerden oder Sprachprobleme?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "alter", op: ">=", wert: 60 }, cdss_gewicht: { zervikale_myelopathie: +3, hws_spondylarthrose: +2 },
        fragen: [
          { id: "HWS-E-001", frage: "Unsicheres Gehen, Treppensteigen schwieriger geworden?", type: "yes_no" },
          { id: "HWS-E-002", frage: "Probleme mit feinmotorischen Aufgaben (Knöpfe, Schreiben)?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "myelopathie_zeichen", op: "==", wert: true },
        cdss_gewicht: { zervikale_myelopathie: +5 }, hinweis: "Gangstörung + Hände → Myelopathie! Neurochirurgie" }
    ]
  },

  CTU: {
    id: "CTU",
    name: "Zerviko-thorakaler Übergang (CTÜ, C6–T2)",
    gruppe: "Wirbelsäule",
    icd10: ["M54.2", "G54.2"],
    cdss_modul: "04_hws",
    screening: [
      { id: "CTU-001", frage: "Schmerz am Übergang Nacken–oberer Rücken?", type: "yes_no" },
      { id: "CTU-002", frage: "Kribbeln in Ring- oder Kleinfinger (C8/T1)?", type: "yes_no" },
      { id: "CTU-003", frage: "Schulter-Nacken-Schmerz bei langer Sitzarbeit?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "kribbeln_c8_t1", op: "==", wert: true }, cdss_gewicht: { tos_thoracic_outlet: +4, c8_radikulopathie: +3 },
        fragen: [
          { id: "CTU-B-001", frage: "Schmerz beim Tragen von Lasten (Rucksack, Tasche)?", type: "yes_no" },
          { id: "CTU-B-002", frage: "Verfärbung oder Kälte der Hand?", type: "yes_no" }
        ]
      }
    ]
  },

  BWS: {
    id: "BWS",
    name: "Brustwirbelsäule (BWS, T1–T12)",
    gruppe: "Wirbelsäule",
    icd10: ["M54.6", "M51.4", "M40.2"],
    cdss_modul: "10_bws",
    screening: [
      { id: "BWS-001", frage: "Wo liegt der Schmerzschwerpunkt?", type: "single_choice", options: ["obere BWS (zwischen Schulterblättern)", "mittlere BWS", "untere BWS (Übergang Lendenwirbel)", "Rippen/Thorax", "brustbein"] },
      { id: "BWS-002", frage: "Schmerzt das tiefe Einatmen oder Husten?", type: "yes_no" },
      { id: "BWS-003", frage: "Gürtelförmige Ausstrahlungen um den Brustkorb?", type: "yes_no" },
      { id: "BWS-004", frage: "Buckelbildung oder sichtbare Rundrücken-Zunahme?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "alter", op: ">=", wert: 60 }, cdss_gewicht: { wirbelkoerperfraktur_osteoporotisch: +4, bws_spondylarthrose: +2 },
        fragen: [
          { id: "BWS-B-001", frage: "Plötzlicher Beginn des Schmerzes nach Heben oder Husten?", type: "yes_no" },
          { id: "BWS-B-002", frage: "Bekannte Osteoporose oder Kortison-Langzeiteinnahme?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "alter", op: "<=", wert: 25 }, cdss_gewicht: { scheuermann_krankheit: +4 },
        fragen: [{ id: "BWS-C-001", frage: "In der Jugend/Schule Rundrücken bemerkt und kommentiert?", type: "yes_no" }] },
      { bedingung: { feld: "gurtelschmerz", op: "==", wert: true }, cdss_gewicht: { interkostalneuralgie: +3, herpes_zoster: +2, bws_radikulopathie: +2 },
        fragen: [
          { id: "BWS-D-001", frage: "Hautausschlag oder Bläschen auf der betroffenen Seite?", type: "yes_no" },
          { id: "BWS-D-002", frage: "Brennen, elektrischer Schmerz auf der Haut?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "kardio_ausschluss_noetig", op: "==", wert: true }, cdss_gewicht: { aorta_dissektion: +3, perikarditis: +2 },
        fragen: [
          { id: "BWS-E-001", frage: "Brustschmerz der in Rücken ausstrahlt + reißend?", type: "yes_no" },
          { id: "BWS-E-002", frage: "Schweißausbrüche, Atemnot oder Übelkeit dazu?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "reissender_rueckenschmerz_ausstrahlung", op: "==", wert: true },
        cdss_gewicht: { aorta_dissektion: +5 }, hinweis: "Reißender BWS-Schmerz → Aortendissektion ausschließen (112)" }
    ]
  },

  TLU: {
    id: "TLU",
    name: "Thorakolumbaler Übergang (TLÜ, T11–L2)",
    gruppe: "Wirbelsäule",
    icd10: ["M54.5", "M51.1"],
    cdss_modul: "03_lws",
    screening: [
      { id: "TLU-001", frage: "Schmerz am unteren Rücken-Rippen-Übergang?", type: "yes_no" },
      { id: "TLU-002", frage: "Ausstrahlung in die Leiste oder den Bauch?", type: "yes_no" },
      { id: "TLU-003", frage: "Schmerz beim Rotieren des Rumpfes?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "ausstrahlung_leiste", op: "==", wert: true }, cdss_gewicht: { tlu_syndrom: +3, nierensteinkolik: +2, ilioinguinalis_neuropathie: +2 },
        fragen: [{ id: "TLU-B-001", frage: "Begleitsymptome wie Übelkeit, Erbrechen oder Blut im Urin?", type: "yes_no" }] }
    ]
  },

  LWS: {
    id: "LWS",
    name: "Lendenwirbelsäule (LWS, L1–L5)",
    gruppe: "Wirbelsäule",
    icd10: ["M54.5", "M51.1", "M47.8"],
    cdss_modul: "03_lws",
    screening: [
      { id: "LWS-001", frage: "Wo genau liegt der Schmerz?", type: "multiple_choice", options: ["zentral Lendenwirbel", "einseitig links", "einseitig rechts", "beidseitig", "Ausstrahlung ins Bein"] },
      { id: "LWS-002", frage: "Strahlt der Schmerz ins Bein aus? Kribbeln oder Taubheit?", type: "yes_no" },
      { id: "LWS-003", frage: "Morgensteifigkeit (>30 min) oder nachtens schlimmer?", type: "yes_no" },
      { id: "LWS-004", frage: "Schmerzlinderung beim Vorbeugen / Verschlimmerung beim Strecken?", type: "yes_no" },
      { id: "LWS-005", frage: "Schmerz nach langem Stehen oder Gehen (Gehmüdigkeit)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "ausstrahlung_bein", op: "==", wert: true }, cdss_gewicht: { lws_radikulopathie: +4, bandscheibe_lws: +4, foramenstenose_lws: +3 },
        fragen: [
          { id: "LWS-B-001", frage: "In welches Bein strahlt der Schmerz aus?", type: "single_choice", options: ["linkes Bein", "rechtes Bein", "beide Beine"] },
          { id: "LWS-B-001b", frage: "Wie weit strahlt der Schmerz nach unten? (bis wohin am weitesten)", type: "single_choice", options: ["nur ins Gesäß", "bis zum Oberschenkel", "bis zum Knie", "bis zur Wade / zum Schienbein", "bis in den Fuß / die Zehen"] },
          { id: "LWS-B-001c", frage: "Wo am Bein verläuft der Schmerz überwiegend?", type: "single_choice", options: ["Außenseite", "Innenseite", "Rückseite", "Vorderseite", "mittig / diffus / nicht klar zuzuordnen"] },
          { id: "LWS-B-002", frage: "Welche Zehen sind taub?", type: "multiple_choice", options: ["Großzehe (L4/L5)", "Kleinzehe (S1)", "alle außen (S1)", "Innenseite (L3/L4)", "keine / kein bestimmtes Muster"] },
          { id: "LWS-B-003", frage: "Verschlimmerung beim Sitzen / besser beim Gehen?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "morgensteifigkeit", op: "==", wert: true }, cdss_gewicht: { axiale_spondyloarthritis: +4, ankylosierende_spondylitis: +3 },
        fragen: [
          { id: "LWS-C-001", frage: "Alter unter 45 bei Beschwerdebeginn?", type: "yes_no" },
          { id: "LWS-C-002", frage: "Familiengeschichte mit Morbus Bechterew oder Schuppenflechte?", type: "yes_no" },
          { id: "LWS-C-003", frage: "Morgensteifigkeit besser durch Bewegung und nicht durch Ruhe?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "gehmuedigkeit", op: "==", wert: true }, cdss_gewicht: { spinale_stenose: +4 },
        fragen: [
          { id: "LWS-D-001", frage: "Wie weit können Sie gehen bis der Schmerz Sie stoppt?", type: "single_choice", options: ["<100m", "100-500m", "500m-1km", ">1km", "keine Begrenzung"] },
          { id: "LWS-D-002", frage: "Besserung beim Vornüberlehnen (z.B. Einkaufswagen schieben)?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "blasendarm_stoerung", op: "==", wert: true },
        cdss_gewicht: { cauda_equina_syndrom: +5 }, hinweis: "Cauda Equina! → sofort Notaufnahme/112" },
      { bedingung: { feld: "sattelanasthesie", op: "==", wert: true },
        cdss_gewicht: { cauda_equina_syndrom: +5 }, hinweis: "Sattelbetäubung → sofort 112" }
    ]
  },

  LSU_SAKRUM: {
    id: "LSU_SAKRUM",
    name: "Lumbosakraler Übergang & Sakrum (L5/S1)",
    gruppe: "Wirbelsäule",
    icd10: ["M53.3", "M47.8"],
    cdss_modul: "03_lws",
    screening: [
      { id: "LSU-001", frage: "Schmerz ganz unten am Rücken (Steißbein, Kreuzbein)?", type: "yes_no" },
      { id: "LSU-002", frage: "Ausstrahlung über Gesäß in Bein (klassische Ischias-Linie)?", type: "yes_no" },
      { id: "LSU-003", frage: "Schmerz beim Sitzen auf hartem Stuhl / Treppen gehen?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "steissbein_schmerz", op: "==", wert: true }, cdss_gewicht: { kokzygodynie: +4 },
        fragen: [{ id: "LSU-B-001", frage: "Sturz auf das Steiß oder längeres Sitzen auf harter Fläche?", type: "yes_no" }] }
    ]
  },

  ISG: {
    id: "ISG",
    name: "Iliosakralgelenk (ISG) — bilateral",
    gruppe: "Wirbelsäule",
    icd10: ["M53.3", "M46.1"],
    cdss_modul: "03_lws",
    screening: [
      { id: "ISG-001", frage: "Schmerz in der Gesäßgrube neben der Wirbelsäule (Handbreit von der Mittellinie)?", type: "yes_no" },
      { id: "ISG-002", frage: "Einseitiger oder beidseitiger ISG-Schmerz?", type: "single_choice", options: ["links", "rechts", "beidseitig", "wechselt"] },
      { id: "ISG-003", frage: "Schmerzt das Schuhanzüge, Einbeinstand oder Treppensteigen?", type: "yes_no" },
      { id: "ISG-004", frage: "Schwangerschaft aktuell oder kürzlich zurückliegend?", type: "yes_no" },
      { id: "ISG-005", frage: "Morgensteifigkeit im unteren Rücken/Becken über 30 Minuten, die sich durch Bewegung bessert?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "schwangerschaft_isg", op: "==", wert: true }, cdss_gewicht: { isg_schwangerschaft: +4, symphyseolyse: +2 } },
      { bedingung: { feld: "morgensteifigkeit", op: "==", wert: true }, cdss_gewicht: { axiale_spondyloarthritis: +4, sacroiliitis: +3 },
        fragen: [{ id: "ISG-B-001", frage: "Schmerzbesserung nach Aufwärmen / Bewegung?", type: "yes_no" }] },
      { bedingung: { feld: "trauma", op: "==", wert: true }, cdss_gewicht: { isg_subluxation: +3 } }
    ]
  },

  SYMPHYSE: {
    id: "SYMPHYSE",
    name: "Symphyse & Beckenring",
    gruppe: "Becken",
    icd10: ["M53.3", "O26.7"],
    cdss_modul: "03_lws",
    screening: [
      { id: "SYM-001", frage: "Schmerz hinter dem Schambein (vorne unten)?", type: "yes_no" },
      { id: "SYM-002", frage: "Schmerzt das Spreizen der Beine oder Einbeinstand?", type: "yes_no" },
      { id: "SYM-003", frage: "Schwangerschaft oder kürzlich Geburt?", type: "yes_no" },
      { id: "SYM-004", frage: "Treiben Sie Sport mit hoher Becken-/Leistenbelastung (Fußball, Laufen, Kampfsport)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "sport_belastung", op: "==", wert: true }, cdss_gewicht: { symphysenarthrose: +3, adduktoren_tendino: +2, pubalgie: +2 },
        fragen: [{ id: "SYM-B-001", frage: "Sportart? (Fußball, Laufen, Kampfsport)", type: "textarea" }] }
    ]
  },

  HUEFTE: {
    id: "HUEFTE",
    name: "Hüftgelenk (Coxalgelenk)",
    gruppe: "Untere Extremität",
    icd10: ["M16", "M25.5", "M70.6"],
    cdss_modul: "05_huefte",
    screening: [
      { id: "HUE-001", frage: "Wo ist der Schmerzschwerpunkt?", type: "multiple_choice", options: ["Leiste/innen", "seitlich (Trochanter)", "Gesäß", "Oberschenkel innen", "Knie (Ausstrahlungsschmerz)"] },
      { id: "HUE-002", frage: "Schmerzt das Treppensteigen, Aufstehen, Einbeinstand?", type: "yes_no" },
      { id: "HUE-003", frage: "Einschränkung beim Schuhe anziehen / Bein überkreuzen?", type: "yes_no" },
      { id: "HUE-004", frage: "Knacken / Einspringen in der Hüfte?", type: "yes_no" },
      { id: "HUE-005", frage: "Ruhe- oder Nachtschmerz in der Hüfte (auch ohne Belastung)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "schmerz_leiste", op: "==", wert: true }, cdss_gewicht: { coxarthrose: +3, fai_hip: +3, labrumriss: +2 },
        fragen: [
          { id: "HUE-B-001", frage: "Schmerzt die Hüfte beim Rotieren (Socke anziehen)?", type: "yes_no" },
          { id: "HUE-B-002", frage: "Aktivitäts- oder Sportart, die zum Schmerz geführt hat?", type: "textarea" }
        ]
      },
      { bedingung: { feld: "schmerz_trochanter", op: "==", wert: true }, cdss_gewicht: { gtps_bursitis: +4, gluteus_medius_tendinopathie: +3 },
        fragen: [
          { id: "HUE-C-001", frage: "Seitliches Schlafen auf der Hüfte schmerzhaft?", type: "yes_no" },
          { id: "HUE-C-002", frage: "Schmerzt das Treppensteigen oder Hügel gehen?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "alter", op: ">=", wert: 55 }, cdss_gewicht: { coxarthrose: +4 },
        fragen: [
          { id: "HUE-D-001", frage: "Anlaufschmerz (schlimmer bei den ersten Schritten)?", type: "yes_no" },
          { id: "HUE-D-002", frage: "Schmerz mit der Zeit besser oder schlechter geworden?", type: "single_choice", options: ["besser", "stabil", "langsam schlechter", "schnell schlechter"] }
        ]
      },
      { bedingung: { feld: "alter", op: "<=", wert: 35 }, cdss_gewicht: { fai_hip: +4, labrumriss: +3 },
        fragen: [{ id: "HUE-E-001", frage: "Hochleistungssport mit Hüftbelastung (Fußball, Tanzen, Kampfsport)?", type: "yes_no" }] }
    ],
    red_flags: [
      { bedingung: { feld: "ruheschmerz_nacht", op: "==", wert: true },
        cdss_gewicht: { knochentumor_hufte: +2, hueftkopfnekrose: +3 }, hinweis: "Nachtschmerz Hüfte bei Jungen → Nekrose / Leukämie ausschließen" }
    ]
  },

  KNIE: {
    id: "KNIE",
    name: "Kniegelenk",
    gruppe: "Untere Extremität",
    icd10: ["M17", "M23", "S83"],
    cdss_modul: "02_knie",
    screening: [
      { id: "KNI-001", frage: "Wo ist der Knieschmerz?", type: "multiple_choice", options: ["vorne (Kniescheibe)", "innen (medial)", "außen (lateral)", "hinten (Kniekehle)", "diffus"] },
      { id: "KNI-002", frage: "Ist das Knie geschwollen?", type: "yes_no" },
      { id: "KNI-003", frage: "Blockiert das Knie oder gibt es nach (Instabilität)?", type: "yes_no" },
      { id: "KNI-004", frage: "Knacken / Knirschen im Knie?", type: "yes_no" },
      { id: "KNI-005", frage: "Trauma? (Verdrehung, Sturz, Schlag)", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "trauma_knie", op: "==", wert: true }, cdss_gewicht: { vkb_ruptur: +4, meniskusriss: +4, seitenband_ruptur: +3 },
        fragen: [
          { id: "KNI-B-001", frage: "Hörten Sie ein Knall-Geräusch beim Trauma?", type: "yes_no" },
          { id: "KNI-B-002", frage: "Schwellung sofort nach Verletzung (<2h)?", type: "yes_no" },
          { id: "KNI-B-003", frage: "Kann das Knie belastet werden?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "schmerz_anterior", op: "==", wert: true }, cdss_gewicht: { pfss_patellofemoral: +4, patellatendinopathie: +3 },
        fragen: [
          { id: "KNI-C-001", frage: "Schmerzt es besonders beim Treppensteigen, Hinhocken, Radfahren?", type: "yes_no" },
          { id: "KNI-C-002", frage: "Sport mit viel Kniebeugung (Laufen, Radfahren, Basketball)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "alter", op: ">=", wert: 50 }, cdss_gewicht: { gonarthrose: +4, meniskus_degeneration: +3 },
        fragen: [
          { id: "KNI-D-001", frage: "Anlaufschmerz morgens oder nach Sitzen?", type: "yes_no" },
          { id: "KNI-D-002", frage: "O-Beine oder X-Beine (sichtbar)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "knie_schwellung", op: "==", wert: true }, cdss_gewicht: { gelenkerrguss: +3, bursitis_knie: +2 },
        fragen: [
          { id: "KNI-E-001", frage: "Ist das Knie warm und gerötet?", type: "yes_no" },
          { id: "KNI-E-002", frage: "Fieber oder allgemeines Krankheitsgefühl dazu?", type: "yes_no" }
        ]
      }
    ]
  },

  OSG: {
    id: "OSG",
    name: "Oberes Sprunggelenk (OSG, Talokruralgelenk)",
    gruppe: "Untere Extremität",
    icd10: ["S93.4", "M79.6", "M19.07"],
    cdss_modul: "09_sprunggelenk_fuss",
    screening: [
      { id: "OSG-001", frage: "Umknieken? (Supinationstrauma)", type: "yes_no" },
      { id: "OSG-002", frage: "Schwellung oder Bluterguss am Sprunggelenk?", type: "yes_no" },
      { id: "OSG-003", frage: "Kann der Fuß belastet werden?", type: "yes_no" },
      { id: "OSG-004", frage: "Schmerzt die Außenseite oder Innenseite?", type: "single_choice", options: ["außen (lateral)", "innen (medial)", "vorne", "hinten (Achillessehne)", "gesamt"] },
      { id: "OSG-005", frage: "Knicken Sie immer wieder um (wiederholtes Umknicken, Gefühl der Instabilität)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "trauma_osg", op: "==", wert: true }, cdss_gewicht: { bss_ruptur_lateral: +4, osg_fraktur: +3 },
        fragen: [
          { id: "OSG-B-001", frage: "Ottawa Ankle Rules: Schmerz am hinteren Rand der Malleolen?", type: "yes_no" },
          { id: "OSG-B-002", frage: "Wann war das Trauma? Wurde der Knöchel geröntgt?", type: "textarea" }
        ]
      },
      { bedingung: { feld: "wiederholt_umknicken", op: "==", wert: true }, cdss_gewicht: { osg_instabilitaet_chronisch: +4 } },
      { bedingung: { feld: "alter", op: ">=", wert: 50 }, cdss_gewicht: { osg_arthrose: +3 },
        fragen: [{ id: "OSG-C-001", frage: "Anlaufschmerz, Steifigkeit morgens im Knöchel?", type: "yes_no" }] }
    ]
  },

  USG: {
    id: "USG",
    name: "Unteres Sprunggelenk (USG, Subtalargelenk)",
    gruppe: "Untere Extremität",
    icd10: ["M19.07"],
    cdss_modul: "09_sprunggelenk_fuss",
    screening: [
      { id: "USG-001", frage: "Schmerzt das Abrollgehen auf unebenem Boden besonders?", type: "yes_no" },
      { id: "USG-002", frage: "Schwerer Knöchelbruch in der Vorgeschichte?", type: "yes_no" },
      { id: "USG-003", frage: "Einschränkung der Fersenneigung (auf die Seite kippen)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "zustand_nach_fraktur", op: "==", wert: true }, cdss_gewicht: { posttraumatische_usg_arthrose: +4 } }
    ]
  },

  MITTELFUSS: {
    id: "MITTELFUSS",
    name: "Mittelfuß (Lisfranc, Tarsometatarsal) & Quer-/Längsgewölbe",
    gruppe: "Untere Extremität",
    icd10: ["M19.07", "M77.4", "S93.3"],
    cdss_modul: "09_sprunggelenk_fuss",
    screening: [
      { id: "MF-001", frage: "Schmerz im Mittelfuß (zwischen Knöchel und Zehen)?", type: "yes_no" },
      { id: "MF-002", frage: "Trauma (Verdrehung, Sturz auf Fuß)?", type: "yes_no" },
      { id: "MF-003", frage: "Schmerzt die Ferse beim ersten Auftreten morgens?", type: "yes_no" },
      { id: "MF-004", frage: "Laufen/joggen Sie viel und der Schmerz kam schleichend unter Belastung (ohne einzelnes Trauma)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "fersenschmerz_morgens", op: "==", wert: true }, cdss_gewicht: { plantarfasziitis: +5 },
        fragen: [
          { id: "MF-B-001", frage: "Bessert sich der Fersenschmerz nach wenigen Schritten?", type: "yes_no" },
          { id: "MF-B-002", frage: "Übergewicht, viel Stehen, harte Böden?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "stressreaktion_laeufer", op: "==", wert: true }, cdss_gewicht: { metatarsale_stressfraktur: +4 } }
    ]
  },

  FUSS_ZEHEN: {
    id: "FUSS_ZEHEN",
    name: "Zehengelenke (MTP, IP, Großzehe, Kleinzehen)",
    gruppe: "Untere Extremität",
    icd10: ["M20.1", "M10.07", "M77.5"],
    cdss_modul: "09_sprunggelenk_fuss",
    screening: [
      { id: "FZ-001", frage: "Welche Zehen sind betroffen?", type: "multiple_choice", options: ["Großzehe", "2. Zehe", "3. Zehe", "4./5. Zehe", "alle"] },
      { id: "FZ-002", frage: "Hallux valgus (Großzehe nach innen gebogen)?", type: "yes_no" },
      { id: "FZ-003", frage: "Heißer, roter, sehr schmerzhafter großer Zeh (akut)?", type: "yes_no" },
      { id: "FZ-004", frage: "Taubheit oder Brennen zwischen den Zehen?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "akute_arthritis_grosszehe", op: "==", wert: true }, cdss_gewicht: { gicht_akut: +5 },
        fragen: [{ id: "FZ-B-001", frage: "Reichhaltiges Essen / Alkohol vor dem Anfall?", type: "yes_no" }] },
      { bedingung: { feld: "taubheit_interdigital", op: "==", wert: true }, cdss_gewicht: { morton_neurom: +5 },
        fragen: [{ id: "FZ-C-001", frage: "Taubheit beim Gehen im engen Schuh, besser barfuß?", type: "yes_no" }] }
    ]
  },

  RIPPEN_THORAX: {
    id: "RIPPEN_THORAX",
    name: "Rippen, Thorax & Sternokostalgelenke",
    gruppe: "Thorax",
    icd10: ["S22.3", "M94.0", "M94.1"],
    cdss_modul: "11_rippen",
    screening: [
      { id: "RIP-001", frage: "Schmerzt das tiefe Einatmen oder Husten?", type: "yes_no" },
      { id: "RIP-002", frage: "Wo ist der Schmerz?", type: "single_choice", options: ["Rippen seitlich", "Brustbein vorne", "Rippenbogen unten", "Rippen-Wirbel Übergang hinten"] },
      { id: "RIP-003", frage: "Trauma (Sturz, Schlag, starkes Husten)?", type: "yes_no" },
      { id: "RIP-004", frage: "Schwellung oder Verdickung über dem Rippenknochen?", type: "yes_no" },
      { id: "RIP-005", frage: "Brennender, gürtelförmiger Schmerz entlang einer Rippe auf einer Seite?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "trauma_rippen", op: "==", wert: true }, cdss_gewicht: { rippenfraktur: +4, pneumothorax: +2 },
        fragen: [
          { id: "RIP-B-001", frage: "Atemnot oder Lufthunger nach dem Trauma?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "schwellung_sternum", op: "==", wert: true }, cdss_gewicht: { tietze_syndrom: +4 } },
      { bedingung: { feld: "gurtelschmerz_thorax", op: "==", wert: true }, cdss_gewicht: { herpes_zoster: +4, interkostalneuralgie: +3 } }
    ],
    red_flags: [
      { bedingung: { feld: "atemnot_nach_trauma", op: "==", wert: true },
        cdss_gewicht: { pneumothorax: +5 }, hinweis: "Atemnot nach Thoraxtrauma → Pneumothorax (112)" }
    ]
  }

};

export const GELENKE_INDEX = {
  kiefer_tmj: "KIEFER_TMJ",
  klavikula: "KLAVIKULA",
  ac_gelenk: "AC_GELENK",
  schulter: "SCHULTER_GH",
  skapula: "SKAPULA",
  ellbogen: "ELLBOGEN",
  unterarm: "UNTERARM",
  handgelenk: "HANDGELENK",
  hand_finger: "HAND_FINGER",
  hws: "HWS",
  ctu: "CTU",
  bws: "BWS",
  tlu: "TLU",
  lws: "LWS",
  lsu_sakrum: "LSU_SAKRUM",
  isg: "ISG",
  symphyse: "SYMPHYSE",
  huefte: "HUEFTE",
  knie: "KNIE",
  osg: "OSG",
  usg: "USG",
  mittelfuss: "MITTELFUSS",
  fuss_zehen: "FUSS_ZEHEN",
  rippen_thorax: "RIPPEN_THORAX"
};
