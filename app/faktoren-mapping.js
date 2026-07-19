/**
 * LINDEBERGS OS — 7-Faktoren-Ableitung (eingewebt statt separat)
 *
 * Prinzip (Wunsch des Praxisinhabers): die 7 Faktoren der Gesundheit &
 * Vitalität NICHT als eigenen Block mit 7 Slidern abfragen, sondern aus den
 * ohnehin im Fluss erhobenen Antworten ABLEITEN — so spart der Patient Zeit,
 * das Spinnennetz bleibt aber erhalten.
 *
 * Jeder Faktor wird auf 0–100 % normiert (0 = kritisch/Defizit,
 * 100 = volle Vitalität). Fehlt für einen Faktor jede Datenquelle, liefert
 * er `null` (im Chart als „noch nicht erfasst" behandelt).
 *
 * Quellen je Faktor (ambient, wo möglich; sonst eine leichte eingewobene
 * Zusatzfrage FAK-*):
 *   Relief      ← Schmerz-VAS aller Beschwerden (b*::HB-004), invertiert
 *   Range       ← FAK-RANGE (Beweglichkeit, eingewoben in Vitalmedizin)
 *   Rhythm      ← Schlafqualität/-dauer (D1-002 / D1-001)
 *   Regulation  ← Stress (D3-003) + Selbstwirksamkeit (PSY-009) + Stresslast (PSY-008)
 *   Re-Energize ← Energie-VAS (D1-008)
 *   Relations   ← FAK-RELATIONS (eingewoben) + Belastungen (PSY-003)
 *   Rise        ← FAK-RISE (Sinn/Optimismus, eingewoben)
 *
 * DETERMINISTISCH: reine Funktion der Antworten — gleiche Eingabe, gleiche
 * Ausgabe.
 */

import { getBeschwerden } from "./beschwerde-store.js";

const clamp = (v) => Math.max(0, Math.min(100, v));

function scoreFromMap(value, map) {
  if (value == null || !(value in map)) return null;
  return map[value];
}

function reliefScore(answers) {
  // Mittelwert der Schmerz-VAS über alle Beschwerden; invertiert.
  const vasWerte = getBeschwerden()
    .map((b) => answers[`${b.id}::HB-004`])
    .filter((v) => typeof v === "number");
  if (!vasWerte.length) return null;
  const avg = vasWerte.reduce((a, b) => a + b, 0) / vasWerte.length;
  return clamp(100 - avg * 10);
}

function rangeScore(answers) {
  // Bevorzugt: Mittel der fünf sportmotorischen Fähigkeiten (SPT-*), sonst
  // die eingewobene Beweglichkeits-Frage FAK-RANGE.
  const faehigkeiten = ["SPT-FLEX", "SPT-KOORD", "SPT-SPEED", "SPT-KRAFT", "SPT-AUSDAUER"]
    .map((id) => answers[id])
    .filter((v) => typeof v === "number");
  if (faehigkeiten.length) {
    const avg = faehigkeiten.reduce((a, b) => a + b, 0) / faehigkeiten.length;
    return clamp(avg * 10);
  }
  if (typeof answers["FAK-RANGE"] === "number") return clamp(answers["FAK-RANGE"] * 10);
  return null;
}

function rhythmScore(answers) {
  // Rhythm = Schlaf & zirkadiane Ordnung. Nutzt jetzt ALLE bereits erhobenen
  // Schlaf-Signale (D1-001…005 + Konsistenz D1-013), nicht nur Dauer+Qualität.
  const qual = scoreFromMap(answers["D1-002"], {
    sehr_gut: 100, gut: 72, schlecht: 38, sehr_schlecht: 12,
  });
  const dauer = scoreFromMap(answers["D1-001"], {
    unter5: 25, "5bis6": 55, "6bis7": 78, "7bis8": 100, ueber8: 85,
  });
  const einschlaf = scoreFromMap(answers["D1-003"], {
    nie: 100, selten: 75, haeufig: 40, fast_immer: 15,
  });
  const durchschlaf = scoreFromMap(answers["D1-004"], {
    nie: 100, selten: 75, haeufig: 40, sehr_haeufig: 15,
  });
  const erholt = scoreFromMap(answers["D1-005"], {
    fast_immer: 100, meistens: 75, selten: 40, nie: 12,
  });
  const konsistenz = scoreFromMap(answers["D1-013"], {
    sehr_regelmaessig: 100, eher_regelmaessig: 72, unregelmaessig: 40, sehr_unregelmaessig: 15,
  });
  const teile = [qual, dauer, einschlaf, durchschlaf, erholt, konsistenz].filter((v) => v != null);
  if (!teile.length) return null;
  return clamp(teile.reduce((a, b) => a + b, 0) / teile.length);
}

function regulationScore(answers) {
  const stress = scoreFromMap(answers["D3-003"], {
    nein: 100,
    gelegentlich: 70,
    chronisch: 35,
    erschoepft: 12,
  });
  const selbstwirk = scoreFromMap(answers["PSY-009"], {
    sehr_gut: 100,
    gut: 72,
    schwierig: 38,
    kaum: 12,
  });
  const stresslast = scoreFromMap(answers["PSY-008"], {
    nie: 100,
    selten: 80,
    manchmal: 55,
    haeufig: 30,
    sehr_haeufig: 12,
  });
  const teile = [stress, selbstwirk, stresslast].filter((v) => v != null);
  if (!teile.length) return null;
  return clamp(teile.reduce((a, b) => a + b, 0) / teile.length);
}

function reEnergizeScore(answers) {
  // Re-Energize = Tagesenergie/Regeneration. Neben der Energie-VAS (D1-008)
  // fließen die bereits erhobenen Signale Tagesschläfrigkeit (D1-007),
  // non-refreshing sleep (D1-009) und Brain Fog (D1-011) ein.
  const teile = [];
  if (typeof answers["D1-008"] === "number") teile.push(clamp(answers["D1-008"] * 10));
  const schlaefrig = scoreFromMap(answers["D1-007"], {
    nicht: 100, leicht: 78, moderat: 50, stark: 28, sehr_stark: 10,
  });
  if (schlaefrig != null) teile.push(schlaefrig);
  if (answers["D1-009"] === true) teile.push(25);
  else if (answers["D1-009"] === false) teile.push(100);
  const brainfog = scoreFromMap(answers["D1-011"], {
    nein: 100, leicht: 70, moderat: 45, stark: 20,
  });
  if (brainfog != null) teile.push(brainfog);
  if (!teile.length) return null;
  return clamp(teile.reduce((a, b) => a + b, 0) / teile.length);
}

function relationsScore(answers) {
  const direkt = typeof answers["FAK-RELATIONS"] === "number" ? clamp(answers["FAK-RELATIONS"] * 10) : null;
  // Belastungen (PSY-003) als Dämpfer: Einsamkeit/Partnerschaft/Familie ziehen ab.
  let belastung = null;
  const bel = answers["PSY-003"];
  if (Array.isArray(bel)) {
    const relevant = ["einsamkeit", "partnerschaft", "familie"].filter((k) => bel.includes(k)).length;
    belastung = clamp(100 - relevant * 25);
  }
  const teile = [direkt, belastung].filter((v) => v != null);
  if (!teile.length) return null;
  return clamp(teile.reduce((a, b) => a + b, 0) / teile.length);
}

/**
 * WHO-5 Wohlbefinden-Index (deterministisch). Rohwert 0–25 (5 Items × 0–5),
 * Prozent = Rohwert × 4. Liefert null, wenn kein Item beantwortet.
 * <50 % = reduziertes Wohlbefinden; <28 % = Depressions-Screening empfohlen.
 */
export function computeWHO5(answers) {
  const items = ["WHO5-1", "WHO5-2", "WHO5-3", "WHO5-4", "WHO5-5"]
    .map((id) => Number(answers[id]))
    .filter((v) => Number.isFinite(v));
  if (!items.length) return null;
  // Nur werten, wenn vollständig (validierte Auswertung braucht alle 5 Items).
  if (items.length < 5) return { prozent: null, unvollstaendig: true };
  const roh = items.reduce((a, b) => a + b, 0);
  const prozent = roh * 4;
  const kategorie =
    prozent < 28 ? "sehr niedrig (Depressions-Screening empfohlen)" :
    prozent < 50 ? "reduziert" : "gut";
  return { roh, prozent, kategorie, unvollstaendig: false };
}

function riseScore(answers) {
  // Rise = Sinn/Zuversicht/Zufriedenheit. Speist sich aus der eingewobenen
  // FAK-RISE-Frage, dem WHO-5-Wohlbefinden und der Lebenszufriedenheit (PSY-011).
  const teile = [];
  if (typeof answers["FAK-RISE"] === "number") teile.push(clamp(answers["FAK-RISE"] * 10));
  const who5 = computeWHO5(answers);
  if (who5 && typeof who5.prozent === "number") teile.push(clamp(who5.prozent));
  if (typeof answers["PSY-011"] === "number") teile.push(clamp(answers["PSY-011"] * 10));
  if (!teile.length) return null;
  return clamp(teile.reduce((a, b) => a + b, 0) / teile.length);
}

/**
 * Berechnet das 7-Faktoren-Profil (0–100 je Achse, oder null).
 */
export function compute7FaktorenAbgeleitet(answers) {
  return {
    Relief: reliefScore(answers),
    Range: rangeScore(answers),
    Rhythm: rhythmScore(answers),
    Regulation: regulationScore(answers),
    "Re-Energize": reEnergizeScore(answers),
    Relations: relationsScore(answers),
    Rise: riseScore(answers),
  };
}

// Eingewobene Zusatzfragen — bewusst NUR für die Faktoren, die sonst keine
// ambiente Quelle haben (Range, Relations, Rise). Werden in die
// Vitalmedizin-/Lebensstil-Sektion eingehängt, nicht als eigener 7er-Block.
export const FAKTOREN_WOVEN_FRAGEN = [
  // Range wird über das Sport-Modul (5 sportmotorische Fähigkeiten) erfasst.
  {
    id: "FAK-RELATIONS",
    frage: "Wie verbunden und getragen fühlen Sie sich durch die Menschen um Sie herum? (0 = sehr isoliert, 10 = sehr verbunden)",
    type: "vas_scale",
    min: 0,
    max: 10,
    faktor: "Relations",
    labels: { 0: "Sehr isoliert", 5: "Teils-teils", 10: "Sehr verbunden" },
  },
  {
    id: "FAK-RISE",
    frage: "Wie viel Sinn, Motivation und Zuversicht erleben Sie in Ihrem Leben? (0 = kaum, 10 = sehr viel)",
    type: "vas_scale",
    min: 0,
    max: 10,
    faktor: "Rise",
    labels: { 0: "Kaum", 5: "Phasenweise", 10: "Sehr viel" },
  },
];
