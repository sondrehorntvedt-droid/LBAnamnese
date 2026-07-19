/**
 * LINDEBERGS OS — Darm-/Mikrobiom-Auswertung (deterministisch)
 *
 * ⚠️ THERAPEUTEN-SICHT (Vitalmedizin). Wertet A20_darm_regeln.js gegen die
 * Antworten aus → Prüf-/Beratungsliste (Diagnostik + Ernährungs-/
 * Mikrobiom-Maßnahmen). Keine Diagnose, keine Medikation. Gleiche Eingabe →
 * identische Liste. Registriert außerdem die Darm-Red-Flags (IBD-/organische
 * Alarmzeichen) am globalen Wächter — dringend, aber ohne Sofort-Stopp.
 */
import { DARM_REGELN, DARM_RED_FLAGS } from "../data/A20_darm_regeln.js";
import { registerRedFlagSource } from "./redflags.js";

function erfuellt(wenn, answers) {
  const wert = answers[wenn.feld];
  if (wenn.op === "==") return wert === wenn.wert;
  if (wenn.op === "contains") return Array.isArray(wert) && wert.includes(wenn.wert);
  return false;
}

/** Liefert { pruefen: [{marker,gruende}], beratung: [{punkt,gruende}] }. */
export function computeDarmProfil(answers) {
  const a = answers || {};
  const pruefMap = new Map();
  const beratMap = new Map();

  DARM_REGELN.forEach((regel) => {
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

/** Darm-Red-Flags am globalen Wächter registrieren (einmalig beim Start). */
export function registerDarmRedFlags() {
  registerRedFlagSource((answers) =>
    DARM_RED_FLAGS.filter((rf) => {
      const val = answers[rf.id];
      return Array.isArray(val) && rf.werte.some((w) => val.includes(w));
    }).map((rf) => ({
      flag_id: rf.id,
      display_message: `⚠️ ${rf.hinweis}`,
      therapist_alert: rf.hinweis,
      stop_anamnesis: false, // dringend, aber kein Sofort-Stopp der Anamnese
    }))
  );
}
