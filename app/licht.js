/**
 * LINDEBERGS OS — Licht-/Circadian-Auswertung (deterministisch)
 *
 * ⚠️ THERAPEUTEN-SICHT (Vitalmedizin). Wertet A22_licht_regeln.js gegen die
 * Antworten aus → Licht-/Circadian-Hygiene-Prüf-/Maßnahmenliste. Keine
 * Diagnose, keine Medikation. Gleiche Eingabe → identische Liste.
 *
 * Liest ausschließlich die evidenzbasierten Kernfragen (LR-001..005). Die
 * experimentellen Frontier-Angaben (LR-FRONTIER) und die Biohacking-Angaben
 * (LR-B-*) fließen bewusst NICHT in die Bewertung ein — sie bleiben reiner
 * Therapeuten-Kontext in der vollständigen Anamnese.
 */
import { LICHT_REGELN } from "../data/A22_licht_regeln.js";

function erfuellt(wenn, answers) {
  const wert = answers[wenn.feld];
  if (wenn.op === "==") return wert === wenn.wert;
  if (wenn.op === "contains") return Array.isArray(wert) && wert.includes(wenn.wert);
  return false;
}

/** Liefert { pruefen: [{marker,gruende}], beratung: [{punkt,gruende}] }. */
export function computeLichtProfil(answers) {
  const a = answers || {};
  const pruefMap = new Map();
  const beratMap = new Map();

  LICHT_REGELN.forEach((regel) => {
    if (!erfuellt(regel.wenn, a)) return;
    (regel.pruefen || []).forEach((m) => {
      if (!pruefMap.has(m)) pruefMap.set(m, new Set());
      pruefMap.get(m).add(regel.grund);
    });
    (regel.beratung || []).forEach((p) => {
      if (!beratMap.has(p)) beratMap.set(p, new Set());
      beratMap.get(p).add(regel.grund);
    });
  });

  const toList = (map) =>
    [...map.entries()]
      .map(([k, set]) => ({ marker: k, punkt: k, gruende: [...set].sort() }))
      .sort((x, y) => x.marker.localeCompare(y.marker));

  return { pruefen: toList(pruefMap), beratung: toList(beratMap) };
}
