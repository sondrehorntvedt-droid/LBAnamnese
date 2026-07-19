/**
 * LINDEBERGS OS — Upload-gestützte Vorbefüllung
 *
 * Sammelt, welche Frage-IDs durch hochgeladene Befunde (potenziell)
 * abgedeckt sind, damit renderFragenListe diese Fragen als „durch Ihren
 * Befund abgedeckt — nur bei Bedarf ergänzen" markieren kann.
 *
 * Der eigentliche Upload-Wert liegt (wie bei jedem file_upload-Feld) im
 * answers-Store unter der Kategorie-ID; hier leiten wir daraus die
 * abgedeckten Felder ab. Das echte Auslesen (OCR/KI) ist Roadmap — die
 * Feld-Zuordnung selbst ist bereits vollständig hinterlegt.
 */

import { state } from "./state.js";
import { UPLOAD_KATEGORIEN } from "../data/A00c_uploads.js";

export function getAbgedeckteFelder() {
  const abgedeckt = new Set();
  UPLOAD_KATEGORIEN.forEach((kat) => {
    const files = state.get(kat.id);
    if (Array.isArray(files) && files.length > 0) {
      (kat.deckt_felder || []).forEach((id) => abgedeckt.add(id));
    }
  });
  return abgedeckt;
}

export function istFeldAbgedeckt(frageId) {
  return getAbgedeckteFelder().has(frageId);
}

/**
 * Liefert die hochgeladenen Befunde eines oder mehrerer Fachbereiche.
 * Für die Befund-Verknüpfung in der Systemanamnese: wenn z.B. ein
 * kardiologischer Befund vorliegt, wird er im Herz-Block angezeigt und die
 * Fragen können adaptiert werden („nur Änderungen seither ergänzen").
 * @param {string[]} fachbereiche
 * @returns {{fachbereich:string, label:string, files:any[]}[]}
 */
export function getBefundeFuerFachbereiche(fachbereiche) {
  if (!Array.isArray(fachbereiche) || fachbereiche.length === 0) return [];
  const treffer = [];
  UPLOAD_KATEGORIEN.forEach((kat) => {
    if (!fachbereiche.includes(kat.fachbereich)) return;
    const files = state.get(kat.id);
    if (Array.isArray(files) && files.length > 0) {
      treffer.push({ fachbereich: kat.fachbereich, label: kat.label, files });
    }
  });
  return treffer;
}
