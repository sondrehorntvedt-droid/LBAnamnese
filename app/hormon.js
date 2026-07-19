/**
 * LINDEBERGS OS — Hormon-/Endokrin-Auswertung (deterministisch)
 *
 * ⚠️ THERAPEUTEN-SICHT (Vitalmedizin). Wertet A19_hormon_regeln.js gegen die
 * Antworten aus → Laborpanel-Prüfliste + Beratungspunkte + Taillen-Einordnung.
 * Keine Diagnose, keine Dosierung. Gleiche Eingabe → identische Liste.
 *
 * Registriert außerdem den endokrinen Red Flag (osmotische Diabetes-Trias)
 * am globalen Red-Flag-Wächter.
 */
import { HORMON_REGELN, HORMON_RED_FLAGS } from "../data/A19_hormon_regeln.js";
import { registerRedFlagSource } from "./redflags.js";

function erfuellt(wenn, answers) {
  const wert = answers[wenn.feld];
  if (wenn.op === "==") return wert === wenn.wert;
  if (wenn.op === "contains") return Array.isArray(wert) && wert.includes(wenn.wert);
  return false;
}

/**
 * Liefert:
 *  - panel: [{ marker, gruende: [...] }] — Laborwerte, sortiert/dedupliziert
 *  - beratung: [{ punkt, gruende: [...] }]
 *  - taille: { wert, erhoeht: bool } | null  (Schwelle geschlechtsabhängig)
 */
export function computeHormonProfil(answers) {
  const a = answers || {};
  const panelMap = new Map();
  const beratMap = new Map();

  HORMON_REGELN.forEach((regel) => {
    if (!erfuellt(regel.wenn, a)) return;
    (regel.panel || []).forEach((m) => {
      if (!panelMap.has(m)) panelMap.set(m, new Set());
      panelMap.get(m).add(regel.grund);
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

  // Taille (metabolisches Syndrom); Schwellen: Frau ≥ 88, Mann ≥ 102 (IDF/ATP III).
  let taille = null;
  const cm = Number(a["D2-010"]);
  if (Number.isFinite(cm) && cm > 0) {
    const sex = a["SD-004"];
    const schwelle = sex === "m" ? 102 : 88;
    taille = { wert: cm, erhoeht: cm >= schwelle };
  }

  return { panel: toList(panelMap), beratung: toList(beratMap), taille };
}

/** Endokrine Red Flags am globalen Wächter registrieren (einmalig beim Start). */
export function registerHormonRedFlags() {
  registerRedFlagSource((answers) =>
    HORMON_RED_FLAGS.filter((rf) => answers[rf.id] === true).map((rf) => ({
      flag_id: rf.id,
      display_message: `⚠️ ${rf.hinweis}`,
      therapist_alert: rf.hinweis,
      stop_anamnesis: false, // dringend, aber kein Sofort-Stopp der Anamnese
    }))
  );
}
