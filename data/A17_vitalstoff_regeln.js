/**
 * A17 — VITALSTOFF-REGELN (deterministische Supplement-/Labor-Hinweise)
 *
 * Zweck: Aus den Ernährungs-/Medikamenten-/Zeichen-Antworten ableiten,
 * welche Mikronährstoffe LABORSEITIG GEPRÜFT bzw. im Gespräch adressiert
 * werden sollten. BEWUSST KEINE Dosier-Empfehlungen ohne Laborwerte —
 * Ausgabe ist eine Prüf-/Beratungsliste für den Therapeuten (Vitalmedizin).
 *
 * Fachliche Anker (gut belegte Zusammenhänge):
 *  - Vegane/vegetarische Kost → B12, Eisen, Zink, Omega-3 (DHA/EPA), Jod
 *  - Kein Fisch → Omega-3-Status
 *  - Wenig Sonne → Vitamin D (25-OH)
 *  - Arznei-Nährstoff-Interaktionen: PPI → B12/Magnesium; Metformin → B12;
 *    Diuretika → Magnesium/Kalium; orale Kontrazeptiva → Folat/B6/Zink/Mg;
 *    Kortison → Vitamin D/Calcium (+ Knochendichte, s. Risikoprofil);
 *    Statine → CoQ10 (Hinweis, Evidenz moderat)
 *  - Klinische Zeichen: Krämpfe/Lidzucken → Mg; Infektanfälligkeit &
 *    Wundheilung → Zink/Vit. D; Haare/Nägel → Ferritin/Zink; Restless Legs
 *    & Blässe/Müdigkeit → Ferritin/B12
 *
 * STATUS: VORLÄUFIG — Feinschliff durch Advisory Board Vitalmedizin (Daniel).
 * Deklaratives Datenformat (feld/op/wert) — maschinenlesbar, exportierbar,
 * ohne Codeänderung erweiterbar. Auswertung: app/vitalstoff.js.
 */

export const VITALSTOFF_REGELN = [
  // ── Ernährungsform ──────────────────────────────────────────
  { id: "VS-VEGAN", wenn: { feld: "ERN-010", op: "contains", wert: "vegan" },
    grund: "Vegane Ernährung",
    pruefen: ["Vitamin B12 (Holo-TC)", "Eisen (Ferritin)", "Zink", "Omega-3-Index (DHA/EPA)", "Jod", "Selen"] },
  { id: "VS-VEGETARISCH", wenn: { feld: "ERN-010", op: "contains", wert: "vegetarisch" },
    grund: "Vegetarische Ernährung",
    pruefen: ["Vitamin B12 (Holo-TC)", "Eisen (Ferritin)", "Zink"] },
  { id: "VS-KEIN-FISCH", wenn: { feld: "ERN-006", op: "==", wert: "nie" },
    grund: "Kein Fischverzehr",
    pruefen: ["Omega-3-Index (DHA/EPA)"] },
  { id: "VS-WENIG-GEMUESE", wenn: { feld: "ERN-005", op: "==", wert: "unter1" },
    grund: "Sehr wenig Gemüse/Obst",
    beratung: ["Mikronährstoff-Dichte der Ernährung erhöhen (Folat, Kalium, Polyphenole)"] },
  { id: "VS-WENIG-WASSER", wenn: { feld: "ERN-001", op: "==", wert: "unter1" },
    grund: "Trinkmenge unter 1 Liter/Tag",
    beratung: ["Hydration strukturiert aufbauen (Zielmenge, Trinkroutine)"] },

  // ── Sonnenexposition ────────────────────────────────────────
  { id: "VS-SONNE", wenn: { feld: "ERN-020", op: "==", wert: "selten" },
    grund: "Wenig Sonnenexposition",
    pruefen: ["Vitamin D (25-OH)"] },

  // ── Arznei-Nährstoff-Interaktionen (Dauermedikation) ────────
  { id: "VS-PPI", wenn: { feld: "ERN-021", op: "contains", wert: "ppi" },
    grund: "Dauerhafte Säureblocker (PPI)",
    pruefen: ["Vitamin B12 (Holo-TC)", "Magnesium (Vollblut)"] },
  { id: "VS-METFORMIN", wenn: { feld: "ERN-021", op: "contains", wert: "metformin" },
    grund: "Metformin",
    pruefen: ["Vitamin B12 (Holo-TC)"] },
  { id: "VS-STATIN", wenn: { feld: "ERN-021", op: "contains", wert: "statin" },
    grund: "Statin",
    pruefen: ["Coenzym Q10 (Hinweis, Evidenz moderat)"] },
  { id: "VS-DIURETIKUM", wenn: { feld: "ERN-021", op: "contains", wert: "diuretikum" },
    grund: "Entwässerungsmedikament (Diuretikum)",
    pruefen: ["Magnesium (Vollblut)", "Kalium"] },
  { id: "VS-PILLE", wenn: { feld: "ERN-021", op: "contains", wert: "pille" },
    grund: "Orale Kontrazeptiva (Pille)",
    pruefen: ["Folat", "Vitamin B6", "Zink", "Magnesium (Vollblut)"] },
  { id: "VS-KORTISON", wenn: { feld: "ERN-021", op: "contains", wert: "kortison" },
    grund: "Dauerhafte Kortison-Einnahme",
    pruefen: ["Vitamin D (25-OH)", "Calcium"],
    beratung: ["Knochendichte-Thema beachten (siehe Risikoprofil/Frakturmodul)"] },

  // ── Klinische Zeichen ───────────────────────────────────────
  { id: "VS-KRAEMPFE", wenn: { feld: "ERN-022", op: "contains", wert: "kraempfe" },
    grund: "Muskelkrämpfe / Lidzucken",
    pruefen: ["Magnesium (Vollblut)"] },
  { id: "VS-INFEKTE", wenn: { feld: "ERN-022", op: "contains", wert: "infekte" },
    grund: "Häufige Infekte",
    pruefen: ["Zink", "Vitamin D (25-OH)"] },
  { id: "VS-WUNDHEILUNG", wenn: { feld: "ERN-022", op: "contains", wert: "wundheilung" },
    grund: "Schlechte Wundheilung",
    pruefen: ["Zink"] },
  { id: "VS-HAARE", wenn: { feld: "ERN-022", op: "contains", wert: "haare_naegel" },
    grund: "Haarausfall / brüchige Nägel",
    pruefen: ["Eisen (Ferritin)", "Zink", "Schilddrüse (TSH) gegenprüfen"] },
  { id: "VS-RESTLESS", wenn: { feld: "ERN-022", op: "contains", wert: "unruhige_beine" },
    grund: "Unruhige Beine nachts",
    pruefen: ["Eisen (Ferritin)"] },
  { id: "VS-BLAESSE", wenn: { feld: "ERN-022", op: "contains", wert: "blaesse" },
    grund: "Blässe / auffällige Müdigkeit",
    pruefen: ["Eisen (Ferritin)", "Vitamin B12 (Holo-TC)"] },

  // ── Stoffwechsel / Gewicht (Beratungspunkte, keine Supplemente) ─
  { id: "VS-HEISSHUNGER", wenn: { feld: "ERN-T-004", op: "==", wert: "regelmaessig" },
    grund: "Regelmäßiges Nachmittagstief / Heißhunger",
    beratung: ["Blutzucker-Stabilität adressieren (Protein zuerst, Mahlzeitenstruktur; ggf. HbA1c/Nüchternwerte)"] },
  { id: "VS-ABNEHMEN", wenn: { feld: "ERN-032", op: "==", wert: "ja_deutlich" },
    grund: "Deutlicher Abnehm-Wunsch",
    beratung: ["Proteinzufuhr sichern (Muskelerhalt), Krafttraining koppeln, Gewichtsverlauf/Taille als Verlaufsmarker"] },
];
