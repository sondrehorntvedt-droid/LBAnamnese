/**
 * A22 — LICHT-/CIRCADIAN-REGELN (deterministische Lichthygiene-Prüf-/Maßnahmenliste)
 *
 * Aus den evidenzbasierten Kernfragen (LR-001..005) abgeleitete Therapeuten-
 * Empfehlungen zur Licht-/Circadian-Hygiene. KEINE Diagnose, keine Medikation.
 * Deklaratives feld/op/wert-Format wie A17 (Vitalstoff), A19 (Hormon),
 * A20 (Darm), A21 (Immun).
 *
 * BEWUSST NICHT im Scoring: LR-FRONTIER (deuteriumarmes/EZ-Wasser, Erdung,
 * EMF, Biophotonen) und LR-B-* (Biohacking) — experimentell bzw. nur
 * Therapeuten-Kontext. Die Auswertung liest ausschließlich LR-001..005.
 *
 * STATUS: VORLÄUFIG — Feinschliff durch Advisory Board Vitalmedizin.
 */

export const LICHT_REGELN = [
  // ── Schicht-/Nachtarbeit (IARC 2A) ──────────────────────────
  { id: "LI-SCHICHT-WECHSEL", wenn: { feld: "LR-001", op: "==", wert: "wechselschicht" },
    grund: "Regelmäßige Wechselschicht (circadiane Störung)",
    pruefen: ["Vitamin-D-Status (25-OH-D)", "Kardiometabolisches Screening (Nüchternglukose/HbA1c, Blutdruck, Lipide) erwägen"],
    beratung: [
      "Circadiane Schichtstrategie: feste Anker-Schlafzeiten, helles Licht zu Schichtbeginn, Dunkelheit/Blaulichtreduktion nach der Nachtschicht",
      "Aufklärung: Schichtarbeit als kardiometabolischer/onkologischer Risikofaktor (IARC 2A) — Prävention betonen",
    ] },
  { id: "LI-SCHICHT-NACHT", wenn: { feld: "LR-001", op: "==", wert: "dauernacht" },
    grund: "Überwiegende Dauer-Nachtschicht (circadiane Störung)",
    pruefen: ["Vitamin-D-Status (25-OH-D)", "Kardiometabolisches Screening (Nüchternglukose/HbA1c, Blutdruck, Lipide) erwägen"],
    beratung: [
      "Circadiane Schichtstrategie: konsequente Verdunkelung tagsüber, helles Licht in der Nacht-Wachphase, stabile Schlaffenster",
      "Aufklärung: Schichtarbeit als kardiometabolischer/onkologischer Risikofaktor (IARC 2A) — Prävention betonen",
    ] },
  { id: "LI-SCHICHT-GELEG", wenn: { feld: "LR-001", op: "==", wert: "gelegentlich" },
    grund: "Gelegentliche Abend-/Nachtschichten",
    beratung: ["Nach Nachtschichten Anker-Schlafzeiten stabil halten; Lichtexposition gezielt steuern"] },

  // ── Tageslichtmenge tagsüber ────────────────────────────────
  { id: "LI-TAGESLICHT-WENIG", wenn: { feld: "LR-002", op: "==", wert: "unter30" },
    grund: "Sehr wenig Tageslicht tagsüber (<30 Min)",
    pruefen: ["Vitamin-D-Status (25-OH-D)"],
    beratung: ["Tageslicht steigern: 20–30+ Min morgens/vormittags draußen (auch bewölkt); Pausen nach draußen verlegen"] },
  { id: "LI-TAGESLICHT-MITTEL", wenn: { feld: "LR-002", op: "==", wert: "30_60" },
    grund: "Wenig Tageslicht tagsüber (30–60 Min)",
    beratung: ["Nach Möglichkeit mehr Tageslicht am Vormittag (Spaziergang, Fensterplatz)"] },

  // ── Arbeitsplatz-Licht ──────────────────────────────────────
  { id: "LI-ARBEIT-FENSTERLOS", wenn: { feld: "LR-003", op: "==", wert: "fensterlos" },
    grund: "Fensterloser Arbeitsplatz (kein Tageslicht)",
    beratung: ["Tagsüber Lichtexposition erhöhen (Outdoor-Pausen); tageslichtähnliche Beleuchtung/Tageslichtlampe am Vormittag erwägen"] },
  { id: "LI-ARBEIT-KUNSTLICHT", wenn: { feld: "LR-003", op: "==", wert: "kunstlicht" },
    grund: "Überwiegend Kunstlicht am Arbeitsplatz",
    beratung: ["Fensternähe/Outdoor-Pausen priorisieren, um das Tageslichtsignal zu erhöhen"] },

  // ── Schlafzimmer-Dunkelheit (Licht bei Nacht) ───────────────
  { id: "LI-SZ-GERAET", wenn: { feld: "LR-004", op: "==", wert: "geraet" },
    grund: "Gerät/Nachtlicht leuchtet im Schlafzimmer",
    beratung: ["Schlafzimmer verdunkeln: Geräte-LEDs abkleben/entfernen; Licht im Schlaf beeinträchtigt Schlaf und Glukoseregulation"] },
  { id: "LI-SZ-RESTLICHT", wenn: { feld: "LR-004", op: "==", wert: "restlicht" },
    grund: "Restlicht/Straßenlaterne im Schlafzimmer",
    beratung: ["Verdunkelung verbessern (Blackout-Vorhänge oder Schlafmaske)"] },

  // ── Abendliches Licht / Melatonin ───────────────────────────
  { id: "LI-ABEND-HELL", wenn: { feld: "LR-005", op: "==", wert: false },
    grund: "Kein Dämpfen des Lichts am Abend",
    beratung: ["Abends Licht dimmen/warm (letzte 1–2 h), grelles Deckenlicht vermeiden — schützt Melatonin und Einschlafen"] },
];
