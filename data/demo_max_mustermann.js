/**
 * LINDEBERGS OS — Demo-Patient „Max Mustermann" (fiktiv)
 *
 * Vollständig ausgefüllter Musterpatient für Demonstration und Schulung:
 * zeigt, wie die Zusammenfassung (alle Reiter) bei einer reich gefüllten
 * Anamnese aussieht — mehrere Beschwerden mit unterschiedlichen
 * Schmerzcharakteren, zwei OPs, Labor-/Radiologie-/Kardiologie-Befunde,
 * gesicherte Diagnosen, Differentialdiagnosen und Testbatterie.
 *
 * Aufruf: index.html?demo=max — der Demo-Modus ist strikt read-only:
 * es wird NICHTS in localStorage geschrieben und NICHTS in die Cloud
 * synchronisiert (siehe app/demo.js, app/state.js, app/patient-record.js).
 *
 * Klinisches Bild (fiktiv, aber stimmig): 58-jähriger Vertriebsleiter,
 * sitzende Tätigkeit; L5-Radikulopathie links (MRT: Protrusion L4/5),
 * Schulterschmerz rechts mit Nachtschmerz (Kapselmuster), leichte mediale
 * Gonarthrose links nach Meniskus-OP 2014; metabolisch: Hypertonie,
 * T2-Diabetes, Hyperlipidämie, ASS 100 (Blutverdünner-Warnung!).
 */

const DEMO_ANSWERS = {
  // ── Für wen / Stammdaten ──────────────────────────────────
  "PT-001": "erwachsen",
  "SD-001": "Max",
  "SD-002": "Mustermann",
  "SD-003": "1968-03-12",
  "SD-004": "m",
  "SD-005": "max.mustermann@beispiel.de",
  "SD-006": "0151 2345678",
  "SD-007": 94,
  "SD-008": 182,
  "SD-009": "Vertriebsleiter (viel Auto + Schreibtisch)",
  "SD-010": "sitzend",
  "SD-011": "rechts",
  "SD-012": "selten",
  "SD-013": "Golf (1×/Woche), gelegentlich Radfahren",

  // ── Globale Schmerzskala (Ziele-Schritt, 7-Tage-NRS) ─────
  "NRS-avg": 6,

  // ── Sicherheits-/Kontrollfragen: unauffällig ─────────────
  "RF001-Q1": false,
  "RF001-Q2": false,
  "RF001-Q3": false,

  // ── Begleitsymptome ──────────────────────────────────────
  "BS-002": false,
  "BS-005": false,
  "BS-006": true, // Leistungsknick — passt zum Energie-Ziel

  // ── Vorerkrankungen (→ gesicherte Diagnosen mit ICD-10) ──
  "PMH-001": ["bluthochdruck", "diabetes"],
  "PMH-001-DM": "typ2",
  "PMH-001b": [
    { jahr: "2019", diagnose: "Arterielle Hypertonie" },
    { jahr: "2021", diagnose: "Diabetes mellitus Typ 2" },
    { jahr: "2021", diagnose: "Hyperlipidämie" },
  ],

  // ── OPs & Traumen (tabellarisch) ─────────────────────────
  "pmh_operiert": true,
  "PMH-004": [
    { jahr: "2014", was: "Kniearthroskopie links (Innenmeniskus-Teilresektion)", aktiv: "gelegentlich" },
    { jahr: "2019", was: "Leistenhernien-OP rechts (minimalinvasiv)", aktiv: "ausgeheilt" },
  ],
  "PMH-005": true,
  "pmh_unfaelle": true,
  "PMH-006": [
    { jahr: "2010", was: "Sturz vom Fahrrad, Schulterprellung rechts", aktiv: "gelegentlich" },
  ],

  // ── Medikamente / Allergien ──────────────────────────────
  "PMH-007": true,
  "pmh_medikamente": true,
  "PMH-008": [
    { medikament: "Ramipril 5 mg", seit_wann: "seit 2019", wegen_was: "Bluthochdruck" },
    { medikament: "Metformin 1000 mg (2×/Tag)", seit_wann: "seit 2021", wegen_was: "Diabetes Typ 2" },
    { medikament: "Atorvastatin 20 mg", seit_wann: "seit 2021", wegen_was: "Cholesterin" },
    { medikament: "ASS 100 mg", seit_wann: "seit 2022", wegen_was: "kardiologische Empfehlung" },
    { medikament: "Ibuprofen 400 mg bei Bedarf", seit_wann: "seit 2025", wegen_was: "Rückenschmerzen" },
  ],
  "PMH-009": true, // ASS → rote Blutverdünner-Warnzeile
  "PMH-010": false,
  "PMH-011": ["medikamente_allergie", "pollen_umwelt"],

  // ── Familienanamnese ─────────────────────────────────────
  "PMH-014": ["herzerkrankung_fam", "diabetes_fam"],
  "PMH-014b": [
    { familienmitglied: "Vater", krankheit: "Herzinfarkt mit 62" },
    { familienmitglied: "Mutter", krankheit: "Osteoporose" },
  ],
  "PMH-015": "ex_raucher",

  // ── Vitalparameter (falls bekannt) ───────────────────────
  "VP-001": 138,
  "VP-002": 88,
  "VP-003": 72,
  "VP-005": 97,
  "VP-007": 118,

  // ── Psychosozial (PHQ-4 mild — therapist_only) ──────────
  "PHQ4-1": 1,
  "PHQ4-2": 0,
  "PHQ4-3": 1,
  "PHQ4-4": 1,

  // ── Labor bekannt + Supplemente (Labor-&-Marker-Block) ──
  "SYS-E-T5": "HbA1c 6,8 % (03/2026) · LDL 142 mg/dl · Vitamin D 21 ng/ml (niedrig) · TSH 2,1 · Ferritin 88",
  "ERN-016b": "Vitamin D3 2000 IE (unregelmäßig), Magnesium abends",
  "ERN-T-KAU": "schlinge", // isst schnell — triggert Kau-/Darm-Hinweis

  // ── Befund-Uploads (Dateiname als Muster) + Kernbefunde ──
  "UP-radiologie": ["MRT_LWS_2026-05.pdf", "Roentgen_Knie_links_2026-03.pdf"],
  "UP-radiologie-notiz":
    "MRT LWS (05/2026): Bandscheibenprotrusion L4/5 links mit Kontakt zur L5-Wurzel, Facettenarthrose L4–S1. Röntgen Knie links (03/2026): mediale Gonarthrose Grad II (Kellgren-Lawrence).",
  "UP-labor": ["Labor_grosses_Blutbild_2026-03.pdf"],
  "UP-labor-notiz":
    "HbA1c 6,8 % (Ziel < 6,5), LDL 142 mg/dl, Vitamin D 21 ng/ml (unterhalb Referenz), TSH/Ferritin/Blutbild unauffällig.",
  "UP-kardiologie": ["Kardiologie_Ergometrie_Echo_2026-01.pdf"],
  "UP-kardiologie-notiz":
    "Ergometrie bis 175 W ohne Ischämiezeichen. Echo: leichte linksventrikuläre Hypertrophie, EF 58 %.",
  "UP-op": ["OP-Bericht_Kniearthroskopie_2014.pdf", "OP-Bericht_Leistenhernie_2019.pdf"],
  "UP-medplan": ["Medikationsplan_2026.pdf"],

  // ═══ Beschwerde 1 (P1): LWS radikulär links ═══════════════
  "b1::prioritaet": "p1",
  "b1::HB-001": "Tiefer Kreuzschmerz, zieht seit dem Umzug im April ins linke Bein bis zur Wade",
  "b1::HB-003": ["dumpf", "taubheit"],
  "b1::HB-004": 6,
  "b1::HB-005": 8,
  "b1::HB-006": 3,
  "b1::HB-007": "subakut_monate",
  "b1::HB-008": "schlechter_werdend",
  "b1::HB-009": "heben",
  "b1::HB-010": "bei_belastung",
  "b1::HB-011": ["waerme", "bewegung"],
  "b1::HB-012": ["sitzen"],
  "b1::HB-013": "Bandscheibe? Kam nach dem Tragen der Umzugskisten",
  "b1::LWS-002": true, // Beinausstrahlung → radikulärer Zweig
  "b1::TH-01": "etwas",
  "b1::TH-01-anzahl": "6_10",
  "b1::TH-01-frequenz": "1_woche",
  "b1::TH-03": "schlechter",
  "b1::TH-03-anzahl": "1_2",
  "b1::TH-03-frequenz": "unter_1_woche",
  "b1::TH-INT-GATE": true,
  "b1::TH-INTERVENTION": [
    { art: "PRT / Nervenwurzelblockade L5 links", anzahl: "2×", wann: "2026", erfolg: "kurzfristig deutlich besser, nach 2 Wochen zurück" },
  ],

  // ═══ Beschwerde 2 (P2): Schulter rechts (Kapselmuster) ════
  "b2::prioritaet": "p2",
  "b2::HB-001": "Rechte Schulter schmerzt bei Überkopfarbeit und nachts beim Draufliegen",
  "b2::HB-003": ["drückend"],
  "b2::HB-004": 5,
  "b2::HB-005": 7,
  "b2::HB-007": "chronisch_6m",
  "b2::HB-008": "gleichbleibend",
  "b2::HB-010": "nachts",
  "b2::HB-011": ["bewegung"],
  "b2::SCH-003": true, // Nachtschmerz/Liegen
  "b2::SCH-005": true, // schleichender Beginn ohne Trauma
  "b2::TH-05": "nur_kurz",
  "b2::TH-05-anzahl": "3_5",
  "b2::TH-05-frequenz": "unter_1_woche",

  // ═══ Beschwerde 3 (P3): Knie links (nach Meniskus-OP) ═════
  "b3::prioritaet": "p3",
  "b3::HB-001": "Linkes Knie sticht innen beim Treppab-Gehen — seit der Meniskus-OP nie ganz weg",
  "b3::HB-003": ["stechend"],
  "b3::HB-004": 3,
  "b3::HB-007": "chronisch_jahre",
  "b3::HB-008": "schwankend",
  "b3::HB-010": "bei_bestimmten_bewegungen",
  "b3::KNI-001": ["innen (medial)"],
  "b3::KNI-002": false,
};

const DEMO_META = {
  currentStepIndex: 0, // wird beim Demo-Start auf den Abschluss gesetzt (main.js)
  anamneseTiefe: "tiefenanalyse",
  sessionId: "demo-aktuell",
  sessionDatum: "2026-07-20",
  beschwerden: [
    { id: "b1", region: "lws" },
    { id: "b2", region: "schulter_r" },
    { id: "b3", region: "knie_l" },
  ],
  ziele: [
    {
      id: "z1",
      kategorie: "schmerz_funktion",
      aktivitaet: "Wieder 18 Löcher Golf gehen — ohne Rückenschmerz und ohne Angst vor dem Abschlag",
      baseline: 4,
      target: 9,
      zielgewicht: "",
      lebensbereich: null,
      zeitrahmen: "langfristig",
      zieldatum: "",
      warum: "Golf ist mein Ausgleich und meine Zeit mit Freunden — das will ich nicht verlieren.",
      prioritaet: 1,
    },
    {
      id: "z2",
      kategorie: "energie",
      aktivitaet: "Mehr Energie im Alltag — ohne das Nachmittagstief im Büro",
      baseline: 4,
      target: 8,
      zielgewicht: "",
      lebensbereich: null,
      zeitrahmen: "schnellstmoeglich",
      zieldatum: "",
      warum: "Ich will abends noch Kraft für Familie und Bewegung haben.",
      prioritaet: 2,
    },
  ],
};

// Frühere Termine (archivierte Sitzungen) — speist Schmerzkurve & Verlauf:
// LWS-Schmerz 8 → 7 → heute 6 über drei datierte Termine.
const DEMO_AKTE = {
  stammdaten: {
    "SD-001": "Max",
    "SD-002": "Mustermann",
    "SD-003": "1968-03-12",
    "SD-004": "m",
  },
  sitzungen: [
    {
      sessionId: "demo-s1",
      datum: "2026-05-12",
      tiefe: "ganzheitlich",
      answers: { "b1::HB-004": 8, "b1::HB-001": "Akuter Kreuzschmerz nach Umzug, Ausstrahlung ins linke Bein" },
      beschwerden: [{ id: "b1", region: "lws" }],
      ziele: [],
    },
    {
      sessionId: "demo-s2",
      datum: "2026-06-16",
      tiefe: "ganzheitlich",
      answers: { "b1::HB-004": 7, "b1::HB-001": "Kreuzschmerz etwas rückläufig, Beinziehen unverändert" },
      beschwerden: [{ id: "b1", region: "lws" }],
      ziele: [],
    },
  ],
};

export function getDemoDaten() {
  // Tiefe Kopie: der Demo-Datensatz selbst bleibt unveränderlich, auch wenn
  // in der laufenden Demo-Sitzung Antworten angepasst werden.
  return JSON.parse(JSON.stringify({ answers: DEMO_ANSWERS, meta: DEMO_META, akte: DEMO_AKTE }));
}
