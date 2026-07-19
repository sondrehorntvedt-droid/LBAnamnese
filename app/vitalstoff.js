/**
 * LINDEBERGS OS — Vitalstoff-Auswertung (deterministisch)
 *
 * ⚠️ THERAPEUTEN-SICHT (Vitalmedizin). Wertet A17_vitalstoff_regeln.js gegen
 * die Antworten aus und liefert eine PRÜF-/BERATUNGSLISTE — keine
 * Dosierungen. Ziel: gezielt entscheiden, welche Laborwerte/Mikronährstoffe
 * adressiert werden sollten (Supplement-Bestimmung erst mit Laborbefund).
 *
 * Gleiche Eingabe → identische Liste (reine Regellogik, kein LLM).
 */
import { VITALSTOFF_REGELN } from "../data/A17_vitalstoff_regeln.js";
import { computeBMI } from "../data/A00_stammdaten.js";

function erfuellt(wenn, answers) {
  const wert = answers[wenn.feld];
  if (wenn.op === "==") return wert === wenn.wert;
  if (wenn.op === "contains") return Array.isArray(wert) && wert.includes(wenn.wert);
  return false;
}

/**
 * Liefert:
 *  - pruefen: [{ marker, gruende: [...] }] — sortiert, dedupliziert
 *  - beratung: [{ punkt, gruende: [...] }]
 *  - bmi: { wert, kategorie } | null
 */
export function computeVitalstoffProfil(answers) {
  const a = answers || {};
  const pruefMap = new Map(); // marker → Set(gründe)
  const beratMap = new Map(); // punkt → Set(gründe)

  VITALSTOFF_REGELN.forEach((regel) => {
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

  // BMI aus Stammdaten (Größe SD-007, Gewicht SD-008)
  const bmiWert = computeBMI(a["SD-008"], a["SD-007"]);
  let bmi = null;
  if (Number.isFinite(bmiWert)) {
    const kat =
      bmiWert < 18.5 ? "Untergewicht" :
      bmiWert < 25 ? "Normalgewicht" :
      bmiWert < 30 ? "Übergewicht" : "Adipositas";
    bmi = { wert: Math.round(bmiWert * 10) / 10, kategorie: kat };
  }

  return { pruefen: toList(pruefMap), beratung: toList(beratMap), bmi };
}
