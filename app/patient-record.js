/**
 * LINDEBERGS OS — Longitudinale Patientenakte
 *
 * Konzept: Eine Anamnese ist kein einmaliges Dokument, sondern eine
 * LEBENDE Akte. Jede Sitzung wird zu einem Datum erfasst und archiviert.
 * Kommt der Patient Monate später mit einem neuen Problem wieder, startet
 * eine neue datierte Sitzung — die Gesamtakte (und ihre Kurzfassung) wächst
 * fortlaufend mit neuen Beschwerden, Befunden und Ereignissen.
 *
 * Speicher (getrennt vom Arbeits-State `lindebergs_anamnese_v1`):
 *   localStorage['lindebergs_patientenakte'] = {
 *     stammdaten: { "SD-001": ..., ... },   // einmalig, aktualisierbar
 *     sitzungen: [ { datum, tiefe, answers, beschwerden, ziele }, ... ]
 *   }
 *
 * Der aktuelle Arbeits-State (app/state.js) ist die AKTIVE Sitzung. Beim
 * Abschluss wird sie per archiviereSitzung() als datierter Snapshot an die
 * Akte gehängt.
 */

import { state } from "./state.js";

const AKTE_KEY = "lindebergs_patientenakte";

const STAMMDATEN_IDS = [
  "SD-001", "SD-002", "SD-003", "SD-004", "SD-005", "SD-006",
  "SD-007", "SD-008", "SD-009", "SD-010", "SD-011", "SD-012", "SD-013",
];

// Krankengeschichte, die über Sitzungen hinweg weiterlebt (kumulativ):
// Diagnosen, OPs, Unfälle, datierte Diagnosen, Medikamente, Allergien,
// Familienanamnese. Wird beim Wiederbesuch übernommen und ergänzt.
const VORGESCHICHTE_IDS = [
  "PMH-001", "PMH-002", "PMH-001b", "PMH-003", "PMH-004", "PMH-005", "PMH-006",
  "PMH-007", "PMH-008", "PMH-009", "PMH-010", "PMH-011", "PMH-012", "PMH-013",
  "PMH-014", "PMH-014b",
];

export function ladeAkte() {
  try {
    const raw = localStorage.getItem(AKTE_KEY);
    return raw ? JSON.parse(raw) : { stammdaten: {}, sitzungen: [] };
  } catch {
    return { stammdaten: {}, sitzungen: [] };
  }
}

function speichereAkte(akte) {
  localStorage.setItem(AKTE_KEY, JSON.stringify(akte));
}

export function hatFruehereAkte() {
  const akte = ladeAkte();
  return akte.sitzungen.length > 0;
}

export function getStammdaten() {
  return ladeAkte().stammdaten;
}

export function heuteISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Archiviert die aktuelle Arbeits-Sitzung als datierten Snapshot in die
 * Akte und aktualisiert die Stammdaten. Idempotent pro Sitzung: eine bereits
 * archivierte Sitzung (gleiche sessionId) wird ersetzt, nicht dupliziert.
 */
export function archiviereSitzung() {
  const akte = ladeAkte();

  // Stammdaten aktualisieren (neueste Angaben gewinnen).
  STAMMDATEN_IDS.forEach((id) => {
    if (state.answers[id] != null && state.answers[id] !== "") {
      akte.stammdaten[id] = state.answers[id];
    }
  });

  const sessionId = state.meta.sessionId || ("s" + Date.now());
  const snapshot = {
    sessionId,
    datum: state.meta.sessionDatum || heuteISO(),
    tiefe: state.meta.anamneseTiefe || null,
    answers: { ...state.answers },
    beschwerden: state.meta.beschwerden || [],
    ziele: state.meta.ziele || [],
  };

  const idx = akte.sitzungen.findIndex((s) => s.sessionId === sessionId);
  if (idx >= 0) akte.sitzungen[idx] = snapshot;
  else akte.sitzungen.push(snapshot);

  akte.sitzungen.sort((a, b) => (a.datum < b.datum ? -1 : a.datum > b.datum ? 1 : 0));
  speichereAkte(akte);
  return snapshot;
}

/**
 * Startet eine neue, leere Sitzung mit heutigem Datum — Stammdaten aus der
 * Akte werden übernommen, damit der wiederkehrende Patient sie nicht erneut
 * eingeben muss.
 */
export function starteNeueSitzung() {
  const akte = ladeAkte();
  // Kumulative Krankengeschichte aus der jüngsten Sitzung übernehmen.
  const letzte = akte.sitzungen[akte.sitzungen.length - 1];
  state.reset();
  state.meta.sessionId = "s" + Date.now();
  state.meta.sessionDatum = heuteISO();
  Object.entries(akte.stammdaten).forEach(([id, val]) => {
    state.answers[id] = val;
  });
  if (letzte) {
    VORGESCHICHTE_IDS.forEach((id) => {
      if (letzte.answers[id] != null) state.answers[id] = letzte.answers[id];
    });
  }
  state.save();
}

/** Sorgt dafür, dass die aktive Sitzung eine ID und ein Datum hat. */
export function ensureSitzungInit() {
  const patch = {};
  if (!state.meta.sessionId) patch.sessionId = "s" + Date.now();
  if (!state.meta.sessionDatum) patch.sessionDatum = heuteISO();
  if (Object.keys(patch).length) state.setMeta(patch);
}
