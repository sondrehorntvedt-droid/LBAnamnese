/**
 * LINDEBERGS OS — Pre-Flight Upload (Befund-Ingest)
 *
 * Prinzip aus dem Master-Dokument (Phase 0 „Pre-Flight"): Der Patient lädt
 * vorhandene Befunde ZUERST hoch. In der Produktion liest eine KI-/OCR-
 * Schicht diese aus und befüllt passende Felder vor (UPLOAD_EXTRAKTION_
 * SCHEMA, 1:1 aus A09) — so muss der Patient Werte nicht doppelt eintippen.
 *
 * Kategorien sind nach medizinischer FACHRICHTUNG strukturiert (Radiologie,
 * Kardiologie, Pneumologie, Labor, …), damit die Befunde im Befund-Register
 * (Abschluss, Reiter „Befunde") fachlich gruppiert und einzeln lesbar
 * gespeichert werden. `deckt_felder` markiert, welche späteren Frage-IDs die
 * Kategorie potenziell abdeckt (→ app/upload-prefill.js).
 */

export const UPLOAD_INTRO = {
  titel: "Haben Sie bereits Befunde? Laden Sie sie zuerst hoch.",
  beschreibung:
    "Je mehr Unterlagen Sie hochladen, desto weniger müssen Sie selbst eintippen. Ordnen Sie jeden Befund seiner Fachrichtung zu — so bleibt Ihre Akte strukturiert und für jeden Behandler sofort lesbar.",
};

export const UPLOAD_KATEGORIEN = [
  {
    id: "UP-radiologie",
    fachbereich: "Radiologie",
    label: "Radiologie / Bildgebung",
    icon: "🩻",
    hint: "Röntgen, MRT, CT, Ultraschall — Befundberichte",
    deckt_felder: ["PMH-005"],
  },
  {
    id: "UP-labor",
    fachbereich: "Labormedizin",
    label: "Labor / Blutwerte",
    icon: "🩸",
    hint: "Blutbild, TSH, HbA1c, Vitamin D, Ferritin, Cholesterin, Hormone…",
    deckt_felder: ["D3-002", "D2-009", "D3-008"],
  },
  {
    id: "UP-kardiologie",
    fachbereich: "Kardiologie",
    label: "Kardiologie",
    icon: "🫀",
    hint: "EKG, Herzecho, Belastungstest, Langzeit-Blutdruck",
    deckt_felder: [],
  },
  {
    id: "UP-pneumologie",
    fachbereich: "Pneumologie",
    label: "Pneumologie / Lunge",
    icon: "🫁",
    hint: "Lungenfunktion, Spirometrie, Schlaflabor",
    deckt_felder: [],
  },
  {
    id: "UP-ortho",
    fachbereich: "Orthopädie",
    label: "Orthopädie / Bewegungsapparat",
    icon: "🦴",
    hint: "Orthopädische Befunde, Gelenk-/Wirbelsäulenberichte",
    deckt_felder: ["PMH-005"],
  },
  {
    id: "UP-op",
    fachbereich: "OP & Klinik",
    label: "OP- & Entlassungsberichte",
    icon: "🏥",
    hint: "Operationsberichte, Entlassungsbriefe, Reha-Berichte",
    deckt_felder: ["PMH-003", "PMH-004"],
  },
  {
    id: "UP-ernaehrung",
    fachbereich: "Ernährungsmedizin",
    label: "Ernährung / Stoffwechsel",
    icon: "🥗",
    hint: "Ernährungsberichte, Stoffwechselanalysen, CGM-Daten",
    deckt_felder: ["D2-009"],
  },
  {
    id: "UP-neuro",
    fachbereich: "Neurologie",
    label: "Neurologie",
    icon: "🧠",
    hint: "EEG, Nervenmessung (ENG/EMG), neurologische Befunde",
    deckt_felder: [],
  },
  {
    id: "UP-arztbrief",
    fachbereich: "Allgemein / Sonstige",
    label: "Arztbrief (sonstige Fachrichtung)",
    icon: "📄",
    hint: "Diagnosen, Facharztberichte, Allergiepass",
    deckt_felder: ["PMH-001", "PMH-011"],
  },
  {
    id: "UP-medplan",
    fachbereich: "Medikation",
    label: "Medikationsplan",
    icon: "💊",
    hint: "Aktuelle Medikamente, Dosierungen",
    deckt_felder: ["PMH-007", "PMH-008"],
  },
];
