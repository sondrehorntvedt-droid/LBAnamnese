/**
 * GOLDEN CASES — eingefrorene Musterfälle für den Determinismus-Beweis.
 *
 * Jeder Fall ist ein festes Antwortmuster (Frage-ID → Wert) plus die
 * Regionen, deren CDSS-Pfad bewertet wird. Der Runner (app/golden-runner.js)
 * führt jeden Fall 10-mal aus und vergleicht gegen den eingefrorenen
 * Snapshot in expected.json:
 *
 *   "10 identische Antwortmuster → 10 identische Ergebnisse."
 *
 * Regeländerungen, die einen Fall unbeabsichtigt kippen, werden dadurch
 * sichtbar, BEVOR sie Patienten erreichen. Beabsichtigte Änderungen =
 * Snapshot bewusst neu einfrieren (neuer Commit, nachvollziehbar in Git).
 *
 * Die Feld-Ableitungen (z.B. LWS-002 → ausstrahlung_bein) sind in
 * app/cdss-context.js definiert — Quellen dort prüfen, bevor Fälle
 * geändert werden.
 */
export const GOLDEN_CASES = [
  {
    id: "GC-01",
    name: "LWS unauffällig (nur Screening)",
    erwartung: "Keine Verzweigung, keine Red Flags — Basisfragen der LWS.",
    regionen: ["LWS"],
    answers: {},
  },
  {
    id: "GC-02",
    name: "LWS radikulär (Beinausstrahlung)",
    erwartung: "LWS-002=ja öffnet den Radikulär-Zweig (LWS-B-*).",
    regionen: ["LWS"],
    answers: { "LWS-002": true },
  },
  {
    id: "GC-03",
    name: "LWS entzündlicher Verdacht (Morgensteifigkeit)",
    erwartung: "LWS-003=ja öffnet den Entzündungs-Zweig (LWS-C-*).",
    regionen: ["LWS"],
    answers: { "LWS-003": true },
  },
  {
    id: "GC-04",
    name: "Cauda-Equina-Alarm (Blasen-/Darmstörung)",
    erwartung: "RF001-Q1=ja muss den 112-Red-Flag der LWS auslösen.",
    regionen: ["LWS"],
    answers: { "LWS-002": true, "RF001-Q1": true },
  },
  {
    id: "GC-05",
    name: "Schulter instabil (Luxationsgefühl)",
    erwartung: "SCH-004=ja öffnet den Instabilitäts-Zweig (SCH-INST-*).",
    regionen: ["SCHULTER_GH"],
    answers: { "SCH-004": true },
  },
  {
    id: "GC-06",
    name: "Frozen-Shoulder-Muster (Nachtschmerz, schleichend)",
    erwartung: "SCH-003+SCH-005=ja öffnen den Kapsel-Zweig (SCH-CAP-001).",
    regionen: ["SCHULTER_GH"],
    answers: { "SCH-003": true, "SCH-005": true },
  },
  {
    id: "GC-07",
    name: "HWS radikulär nach Trauma",
    erwartung: "HWS-002 (Armausstrahlung) + HWS-004 (Trauma) öffnen B- und C-Zweig.",
    regionen: ["HWS"],
    answers: { "HWS-002": true, "HWS-004": true },
  },
  {
    id: "GC-08",
    name: "Zervikogener Schwindel",
    erwartung: "HWS-005 (Schwindel bei Kopfdrehung) öffnet den D-Zweig.",
    regionen: ["HWS"],
    answers: { "HWS-005": true },
  },
  {
    id: "GC-09",
    name: "Belastungsabhängiger Brustschmerz",
    erwartung: "KAR-001=ja öffnet den Angina-Zweig (KAR-B-*, u.a. Arm/Kiefer-Ausstrahlung).",
    regionen: ["HERZ_KARDIO"],
    answers: { "KAR-001": true },
  },
  {
    id: "GC-10",
    name: "Akuter Ruhe-Brustschmerz (Notfall)",
    erwartung: "KAR-007=ja muss den 112-Red-Flag (Herzinfarkt-Verdacht) auslösen.",
    regionen: ["HERZ_KARDIO"],
    answers: { "KAR-007": true },
  },
  {
    id: "GC-11",
    name: "Risikoprofil: gemessene Hypertonie",
    erwartung: "VP-001=150 / VP-002=95 muss den Hypertonie-Hinweis im Risikoprofil setzen.",
    regionen: [],
    answers: { "VP-001": 150, "VP-002": 95 },
  },
  {
    id: "GC-12",
    name: "Kiefer: Bruxismus-Muster (CMD myogen)",
    erwartung: "TMJ-005=ja öffnet den Bruxismus-Zweig (TMJ-BRX-*) mit Gewicht cmd_myogen.",
    regionen: ["KIEFER_TMJ"],
    answers: { "TMJ-005": true },
  },
  {
    id: "GC-13",
    name: "Kiefer: Trauma + Bissveränderung (Fraktur-Alarm)",
    erwartung: "Unfall (HB-009) + TMJ-008=ja muss den Kieferfraktur-Red-Flag auslösen.",
    regionen: ["KIEFER_TMJ"],
    answers: { "HB-009": ["unfall"], "TMJ-008": true },
  },
  {
    id: "GC-14",
    name: "Gynäkologie: Schwangerschaft mit Blutung (Alarm)",
    erwartung: "GYN-006=ja öffnet den Schwangerschafts-Zweig; +GYN-SS-004=ja muss den Klinik-Red-Flag auslösen.",
    regionen: ["GYNAEKOLOGIE"],
    answers: { "GYN-006": "ja", "GYN-SS-004": true },
  },
  {
    id: "GC-15",
    name: "Knie: heiß + gerötet + Fieber (septische Arthritis)",
    erwartung: "KNI-E-001+KNI-E-002=ja muss den Notfall-Red-Flag septische Arthritis auslösen.",
    regionen: ["KNIE"],
    answers: { "KNI-002": true, "KNI-E-001": true, "KNI-E-002": true },
  },
  {
    id: "GC-16",
    name: "Handgelenk: Sturz + Tabatière-Schmerz (Skaphoid)",
    erwartung: "HG-003=ja + HG-D-001=ja muss den Skaphoidfraktur-Red-Flag auslösen.",
    regionen: ["HANDGELENK"],
    answers: { "HG-003": true, "HG-D-001": true },
  },
  {
    id: "GC-17",
    name: "Vitalstoff: vegan + PPI + Metformin (Prüfliste)",
    erwartung: "Kombiniert zu B12/Eisen/Zink/Omega-3/Jod/Selen/Magnesium; B12 mit 3 Gründen (dedupliziert, sortiert).",
    regionen: [],
    answers: { "ERN-010": ["vegan"], "ERN-021": ["ppi", "metformin"], "ERN-020": "selten", "ERN-006": "nie" },
  },
  {
    id: "GC-18",
    name: "7 Faktoren: schlechter Schlaf senkt Rhythm & Re-Energize",
    erwartung: "Rhythm nutzt jetzt Einschlafen/Durchschlafen/Erholt/Konsistenz; Re-Energize nutzt Schläfrigkeit/non-refreshing/Brain-Fog — beide deutlich unter Mitte.",
    regionen: [],
    answers: {
      "D1-001": "5bis6", "D1-002": "schlecht", "D1-003": "haeufig", "D1-004": "haeufig",
      "D1-005": "selten", "D1-013": "unregelmaessig", "D1-007": "stark", "D1-009": true,
      "D1-011": "moderat", "D1-008": 3,
    },
  },
  {
    id: "GC-19",
    name: "Hormon: Frau, unregelmäßiger Zyklus + Hirsutismus (PCOS-Panel)",
    erwartung: "D3-005=unregelmäßig öffnet Zyklus-Panel; +D3-010 Hirsutismus ergänzt PCOS-Panel (freies Testosteron/SHBG/Insulin).",
    regionen: [],
    answers: { "SD-004": "f", "D3-005": "unregelmaessig", "D3-010": ["hirsutismus", "akne"] },
  },
  {
    id: "GC-20",
    name: "Darm: IBS-Muster + SIBO-Hinweis + geringe Vielfalt",
    erwartung: "Rome-IV (D4-003 besser_nach_stuhl) → Low-FODMAP+Calprotectin; SIBO (D4-011) → Atemtest; geringe Pflanzenvielfalt → Diversität.",
    regionen: [],
    answers: { "D4-003": ["besser_nach_stuhl", "blähungen"], "D4-011": true, "D4-009": "unter10", "D4-010": "nie" },
  },
];
