/**
 * LINDEBERGS OS — Vitalparameter (objektive Messwerte)
 *
 * Optionaler Eingabeort für Vitalwerte, die der Patient kennt (Blutdruck-
 * Messgerät zu Hause, Apotheke, Wearable). ALLE Felder optional.
 *
 * Vorbereitet für die spätere Geräte-/Wearable-Schnittstelle: dieselben
 * Feld-IDs können automatisch aus Apple Health, Oura, Garmin, WHOOP,
 * Blutdruckmessgerät etc. befüllt werden (Roadmap).
 */

export const VITALPARAMETER_INTRO = {
  titel: "Ihre Vitalwerte",
  beschreibung:
    "Falls Sie aktuelle Messwerte kennen (von zu Hause, aus der Apotheke oder von einem Wearable), tragen Sie sie hier ein — alles freiwillig. Später lassen sich diese Werte direkt aus Ihren Geräten übernehmen.",
};

export const VITALPARAMETER_FRAGEN = [
  {
    id: "VP-001",
    frage: "Blutdruck systolisch (oberer Wert)",
    type: "number",
    unit: "mmHg",
    section: "Herz-Kreislauf",
    required: false,
    hint: "z.B. 120",
  },
  {
    id: "VP-002",
    frage: "Blutdruck diastolisch (unterer Wert)",
    type: "number",
    unit: "mmHg",
    section: "Herz-Kreislauf",
    required: false,
    hint: "z.B. 80",
  },
  {
    id: "VP-003",
    frage: "Ruhepuls",
    type: "number",
    unit: "/min",
    section: "Herz-Kreislauf",
    required: false,
    hint: "in Ruhe gemessen, z.B. 64",
  },
  {
    id: "VP-004",
    frage: "Körpertemperatur",
    type: "number",
    unit: "°C",
    section: "Allgemein",
    required: false,
    hint: "z.B. 36,7",
  },
  {
    id: "VP-005",
    frage: "Sauerstoffsättigung (SpO₂)",
    type: "number",
    unit: "%",
    section: "Allgemein",
    required: false,
    hint: "falls per Pulsoximeter gemessen, z.B. 98",
  },
  {
    id: "VP-006",
    frage: "Herzratenvariabilität (HRV)",
    type: "number",
    unit: "ms",
    section: "Wearable / Performance",
    required: false,
    hint: "falls von Wearable bekannt (Oura, WHOOP, Garmin …)",
  },
  {
    id: "VP-007",
    frage: "Nüchtern-Blutzucker",
    type: "number",
    unit: "mg/dL",
    section: "Wearable / Performance",
    required: false,
    hint: "falls bekannt, z.B. 88",
  },
  {
    id: "VP-008",
    frage: "Weitere Messwerte / Anmerkungen (optional)",
    type: "textarea",
    section: "Ergänzung",
    required: false,
    placeholder: "z.B. Ruhepuls laut Uhr morgens 56, Blutdruck schwankt…",
  },
];
