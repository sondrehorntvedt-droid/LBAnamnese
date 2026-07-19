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
];
