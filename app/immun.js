/**
 * LINDEBERGS OS — Immun-/Entzündungs-Auswertung (deterministisch)
 *
 * ⚠️ THERAPEUTEN-SICHT (Vitalmedizin). Wertet A21_immun_regeln.js gegen die
 * Antworten aus → Prüf-/Beratungsliste (Entzündungs-/Autoimmun-/Allergie-
 * Diagnostik). Keine Diagnose. Gleiche Eingabe → identische Liste.
 */
import { IMMUN_REGELN } from "../data/A21_immun_regeln.js";

function erfuellt(wenn, answers) {
  const wert = answers[wenn.feld];
  if (wenn.op === "==") return wert === wenn.wert;
  if (wenn.op === "contains") return Array.isArray(wert) && wert.includes(wenn.wert);
  return false;
}

/** Liefert { pruefen: [{marker,gruende}], beratung: [{punkt,gruende}] }. */
export function computeImmunProfil(answers) {
  const a = answers || {};
  const pruefMap = new Map();
  const beratMap = new Map();

  IMMUN_REGELN.forEach((regel) => {
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
