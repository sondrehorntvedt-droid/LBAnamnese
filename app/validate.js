/**
 * LINDEBERGS OS — Datenbank-Validator (Integrität & Determinismus)
 *
 * Prüft die deterministische Datenbank auf Konsistenz, damit das
 * Versprechen „gleiche Eingabe → gleiches Ergebnis" beweisbar bleibt und
 * das Entwicklerteam Regressionen sofort erkennt.
 *
 * Aufruf: `runValidation()` gibt { passed, checks[] } zurück. Kann später in
 * eine CI eingebunden werden. Rein lesend, keine Nebenwirkungen.
 */

import { GELENKE_BAUM } from "../data/A06_gelenke_baum.js";
import { SYSTEMISCHE_BAUM } from "../data/A07_systemisch_baum.js";
import { buildKontext } from "./cdss-context.js";
import { computeRegionPfad, getRegionKeysForHB002Value } from "./cdss-engine.js";
import { HAUPTBESCHWERDE_FRAGEN } from "../data/A01_hauptbeschwerde.js";
import { INDEX } from "./anamnese-index.js";
import { THERAPIST_ONLY_IDS } from "./privacy.js";

const GLOBAL_FACTS = new Set(["alter", "geschlecht", "onset_dauer", "trauma"]);

function referencedFacts(entry) {
  const refs = new Set();
  (entry.verzweigung || []).forEach((r) => r.bedingung && refs.add(r.bedingung.feld));
  (entry.red_flags || []).forEach((r) => r.bedingung && refs.add(r.bedingung.feld));
  return refs;
}

function producibleFacts(key) {
  const proxy = new Proxy({}, { get: () => true });
  const keys = new Set(GLOBAL_FACTS);
  try {
    Object.keys(buildKontext(key, proxy)).forEach((k) => keys.add(k));
  } catch (e) {
    /* builder fehlt → wird als eigene Prüfung gemeldet */
  }
  return keys;
}

// ── Einzelprüfungen ─────────────────────────────────────────

function checkToteBranches() {
  const dead = {};
  const audit = (baum) =>
    Object.entries(baum).forEach(([key, entry]) => {
      const prod = producibleFacts(key);
      const fehlend = [...referencedFacts(entry)].filter((f) => !prod.has(f));
      if (fehlend.length) dead[key] = fehlend;
    });
  audit(GELENKE_BAUM);
  audit(SYSTEMISCHE_BAUM);
  const anzahl = Object.keys(dead).length;
  return {
    name: "Keine toten Verzweigungsäste (jeder Bedingungs-Fact hat eine Quelle)",
    status: anzahl === 0 ? "ok" : "fail",
    details: anzahl === 0 ? "Alle Bedingungen werden aus Antworten abgeleitet." : dead,
  };
}

function checkRegionMapping() {
  const hb002 = HAUPTBESCHWERDE_FRAGEN.find((f) => f.id === "HB-002");
  const alleKeys = new Set([...Object.keys(GELENKE_BAUM), ...Object.keys(SYSTEMISCHE_BAUM)]);
  const probleme = [];
  (hb002.regions || []).forEach((r) => {
    const keys = [...getRegionKeysForHB002Value(r.value, "m"), ...getRegionKeysForHB002Value(r.value, "f")];
    // "allgemein_muedigkeit" darf leer sein (kein spezifischer Baum).
    const unbekannt = keys.filter((k) => !alleKeys.has(k));
    if (unbekannt.length) probleme.push({ region: r.value, unbekannte_baumschluessel: unbekannt });
  });
  return {
    name: "Alle Beschwerde-Regionen verweisen auf existierende Bäume",
    status: probleme.length === 0 ? "ok" : "fail",
    details: probleme.length === 0 ? "Jede Region ist korrekt verkabelt." : probleme,
  };
}

function checkRedFlagsHaveHinweis() {
  const fehlend = [];
  const audit = (baum) =>
    Object.entries(baum).forEach(([key, entry]) =>
      (entry.red_flags || []).forEach((rf, i) => {
        if (!rf.hinweis) fehlend.push(`${key}#${i}`);
      })
    );
  audit(GELENKE_BAUM);
  audit(SYSTEMISCHE_BAUM);
  return {
    name: "Jede Red-Flag-Regel hat einen Hinweistext",
    status: fehlend.length === 0 ? "ok" : "fail",
    details: fehlend.length === 0 ? "Alle Red Flags dokumentiert." : fehlend,
  };
}

function checkTherapistOnlyIndexed() {
  const fehlend = THERAPIST_ONLY_IDS.filter((id) => !INDEX[id]);
  return {
    name: "therapist_only-Felder sind im Index bekannt (Privacy-Grenze definiert)",
    status: fehlend.length === 0 ? "ok" : "warn",
    details: fehlend.length === 0 ? THERAPIST_ONLY_IDS : { nicht_im_index: fehlend },
  };
}

function checkDeterminismus() {
  // Fester Eingabefall → zweimal berechnen → identisch?
  const answers = {
    "SD-003": "1965-01-01",
    "SD-004": "m",
    "SCH-001": "ausstrahlung in Arm",
    "SCH-003": true,
    "SCH-004": true,
    "SCH-005": true,
    "HB-007": "chronisch_1j",
    "KAR-001": true,
    "KAR-007": true,
  };
  const a1 = JSON.stringify(computeRegionPfad("SCHULTER_GH", answers));
  const a2 = JSON.stringify(computeRegionPfad("SCHULTER_GH", answers));
  const b1 = JSON.stringify(computeRegionPfad("HERZ_KARDIO", answers));
  const b2 = JSON.stringify(computeRegionPfad("HERZ_KARDIO", answers));
  const identisch = a1 === a2 && b1 === b2;
  return {
    name: "Determinismus: identische Eingabe → bit-identisches Ergebnis",
    status: identisch ? "ok" : "fail",
    details: identisch ? "Schulter & Herz zweifach identisch berechnet." : "Abweichung erkannt!",
  };
}

function checkKeineDoppeltenFragenLabels() {
  // Fragen mit identischer ID aber unterschiedlichem Label = Konflikt.
  // (Der Index dedupliziert; hier prüfen wir die Rohquellen grob über INDEX-
  //  Konsistenz — echte Doppelvergaben werden separat im Build erkannt.)
  const leer = Object.entries(INDEX).filter(([, def]) => !def.label);
  return {
    name: "Jede Frage im Index hat ein Label",
    status: leer.length === 0 ? "ok" : "warn",
    details: leer.length === 0 ? "Alle Fragen beschriftet." : leer.map(([id]) => id),
  };
}

export function runValidation() {
  const checks = [
    checkToteBranches(),
    checkRegionMapping(),
    checkRedFlagsHaveHinweis(),
    checkTherapistOnlyIndexed(),
    checkDeterminismus(),
    checkKeineDoppeltenFragenLabels(),
  ];
  const passed = checks.every((c) => c.status === "ok" || c.status === "warn");
  const failed = checks.filter((c) => c.status === "fail");
  return { passed, anzahl_checks: checks.length, fehlgeschlagen: failed.length, checks };
}
