/**
 * LINDEBERGS OS — Therapie-Historie (pro Beschwerde)
 *
 * Struktur aus "Finale Lindebergs OS Anamnese 5.1.25.docx", Abschnitt
 * "THERAPIE-HISTORIE" (innerhalb des Beschwerde-Loops): pro Modalität ein
 * 4-stufiges Ergebnis statt einer einzelnen globalen Erfolgsfrage.
 *
 * Legende (verbatim aus der Quelle):
 *  Sehr gut  — Deutlicher Fortschritt
 *  Etwas     — Hilft leicht
 *  Nein      — Keine Wirkung
 *  Nur kurz  — Lindert nur kurzfristig
 */

export const THERAPIE_ERFOLG_OPTIONEN = [
  { value: "sehr_gut", label: "Sehr gut (deutlicher Fortschritt)" },
  { value: "etwas", label: "Etwas (hilft leicht)" },
  { value: "nein", label: "Nein (keine Wirkung)" },
  { value: "nur_kurz", label: "Nur kurz (lindert nur kurzfristig)" },
];

// Umfang der Behandlung — wichtig, um „einmal ausprobiert" von „konsequent
// über Monate durchgezogen" zu unterscheiden.
export const THERAPIE_HAEUFIGKEIT_OPTIONEN = [
  { value: "1_2", label: "1–2 Mal" },
  { value: "3_5", label: "3–5 Mal" },
  { value: "6_10", label: "6–10 Mal" },
  { value: "10_20", label: "~10–20 Sitzungen" },
  { value: "monate", label: "Über Monate (20+ Sitzungen)" },
  { value: "laufend", label: "Läuft aktuell noch" },
];

// Freitext für Details, die das Raster nicht abbildet.
export const THERAPIE_FREITEXT = {
  id: "TH-FREI",
  frage: "Weitere Details zu Ihren bisherigen Behandlungen? (optional)",
  type: "textarea",
  placeholder: "z.B. Physio 2023 über ein halbes Jahr, ca. 30 Sitzungen — kurzfristig besser, dann wieder Schmerzen…",
};

/**
 * Interventionelle / orthopädische Maßnahmen — für eine orthopädische Praxis
 * oft entscheidend (was wurde gespritzt/infiltriert, wie oft, mit welchem
 * Erfolg?). Bewusst hinter einem Gate: nur wer solche Eingriffe hatte, füllt
 * die Detailtabelle aus („weniger ist mehr").
 */
export const INTERVENTION_FRAGEN = [
  {
    id: "TH-INT-GATE",
    frage: "Wurden an dieser Region interventionelle Maßnahmen durchgeführt (Spritzen, Infiltrationen, Stoßwelle, PRP …)?",
    type: "yes_no",
  },
  {
    id: "TH-INTERVENTION",
    frage: "Bitte tragen Sie die Maßnahmen ein:",
    type: "repeatable_entry",
    addLabel: "+ Weitere Maßnahme hinzufügen",
    hint: "z.B. Cortison-Spritze, Hyaluron, PRP/Eigenblut, Facetteninfiltration, PRT/Nervenwurzelblockade, Stoßwelle, Radiofrequenz, Neuraltherapie.",
    condition: { field: "TH-INT-GATE", equals: true },
    fields: [
      { key: "art", label: "Maßnahme", type: "text", placeholder: "z.B. Cortison-Spritze, PRP, Facetteninfiltration" },
      { key: "anzahl", label: "Wie oft?", type: "text", placeholder: "z.B. 3x" },
      { key: "wann", label: "Wann (Jahr)?", type: "text", placeholder: "z.B. 2024" },
      { key: "erfolg", label: "Erfolg?", type: "text", placeholder: "z.B. kurzfristig / langfristig / keine Wirkung" },
    ],
  },
];

export const THERAPIE_HISTORIE_MODALITAETEN = [
  { id: "TH-01", label: "Physiotherapie / Manuelle Therapie" },
  { id: "TH-02", label: "Osteopathie" },
  { id: "TH-03", label: "Chiropraktik" },
  { id: "TH-04", label: "Heilpraktiker" },
  { id: "TH-05", label: "Massage / Faszientherapie" },
  { id: "TH-06", label: "Akupunktur / Dry Needling" },
  { id: "TH-07", label: "Medizinisches Training / Reha" },
  { id: "TH-08", label: "Dehnung / Yoga" },
  { id: "TH-09", label: "Fitness / Krafttraining" },
  { id: "TH-10", label: "Spritzen / Injektionen" },
  { id: "TH-11", label: "Medikamente (Schmerzmittel)" },
  { id: "TH-12", label: "Stoßwelle" },
  { id: "TH-13", label: "Kälte- / Wärmetherapie" },
  { id: "TH-14", label: "Bandagen / Taping / Einlagen" },
  { id: "TH-15", label: "Operation" },
];
