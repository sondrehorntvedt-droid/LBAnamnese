/**
 * GOLDEN-RUNNER — führt die Golden Cases aus und beweist Determinismus.
 *
 * Für jeden Fall:
 *   1. 10 Wiederholungen mit identischen Antworten → alle 10 Ergebnisse
 *      müssen bit-identisch sein (JSON-Vergleich).
 *   2. Ergebnis wird gegen den eingefrorenen Snapshot (expected.json)
 *      verglichen. Abweichung = Regelwerk hat sich verändert.
 *
 * Reine Lesewerkzeuge: keine Seiteneffekte, kein localStorage, kein Netz
 * außer dem Laden von expected.json.
 */
import { computeRegionPfad } from "./cdss-engine.js";
import { computeRisikoprofil } from "./risikoprofil.js";
import { computeVitalstoffProfil } from "./vitalstoff.js";
import { compute7FaktorenAbgeleitet } from "./faktoren-mapping.js";
import { computeHormonProfil } from "./hormon.js";
import { GOLDEN_CASES } from "../tests/golden/cases.js";

/** Deterministische Normalform eines Fall-Ergebnisses (stabil sortiert). */
function bewerteFall(fall) {
  const regionen = {};
  [...fall.regionen].sort().forEach((key) => {
    const pfad = computeRegionPfad(key, fall.answers);
    regionen[key] = {
      fragen: (pfad.fragen || []).map((f) => f.id),
      gewichte: Object.fromEntries(
        Object.entries(pfad.cdss_gewichte || {}).sort(([a], [b]) => a.localeCompare(b))
      ),
      red_flags: (pfad.hints || []).map((h) => h.flag_id),
    };
  });

  const risiko = computeRisikoprofil(fall.answers);
  const vitalstoff = computeVitalstoffProfil(fall.answers);
  const faktoren = compute7FaktorenAbgeleitet(fall.answers);
  const hormon = computeHormonProfil(fall.answers);
  return {
    regionen,
    risikoprofil: JSON.parse(JSON.stringify(risiko)),
    vitalstoff: JSON.parse(JSON.stringify(vitalstoff)),
    faktoren: JSON.parse(JSON.stringify(faktoren)),
    hormon: JSON.parse(JSON.stringify(hormon)),
  };
}

function stabilesJson(wert) {
  // JSON mit stabiler Schlüsselreihenfolge (rekursiv) für Bit-Vergleich.
  if (Array.isArray(wert)) return "[" + wert.map(stabilesJson).join(",") + "]";
  if (wert && typeof wert === "object") {
    return (
      "{" +
      Object.keys(wert)
        .sort()
        .map((k) => JSON.stringify(k) + ":" + stabilesJson(wert[k]))
        .join(",") +
      "}"
    );
  }
  return JSON.stringify(wert);
}

export async function runGolden() {
  let expected = null;
  try {
    const res = await fetch("../tests/golden/expected.json", { cache: "no-store" });
    if (res.ok) expected = await res.json();
  } catch {
    expected = null;
  }

  const ergebnisse = [];
  const aktuell = {};

  GOLDEN_CASES.forEach((fall) => {
    // 1) Determinismus: 10 identische Läufe
    const laeufe = [];
    for (let i = 0; i < 10; i++) laeufe.push(stabilesJson(bewerteFall(fall)));
    const deterministisch = laeufe.every((l) => l === laeufe[0]);

    // 2) Snapshot-Vergleich
    const wert = JSON.parse(laeufe[0]);
    aktuell[fall.id] = wert;
    const soll = expected ? expected[fall.id] : undefined;
    const schnappschussOk = soll !== undefined ? stabilesJson(soll) === laeufe[0] : null;

    ergebnisse.push({
      fall,
      deterministisch,
      schnappschussOk, // true | false | null (= noch nicht eingefroren)
      wert,
    });
  });

  return { ergebnisse, aktuell, hatSnapshot: !!expected };
}

/** Rendert die Ergebnistabelle in ein Wurzelelement (tests/golden.html). */
export async function renderGolden(root) {
  root.innerHTML = "<p class='tagline'>Golden Cases laufen …</p>";
  const { ergebnisse, aktuell, hatSnapshot } = await runGolden();

  const alleDet = ergebnisse.every((e) => e.deterministisch);
  const alleSnap = hatSnapshot && ergebnisse.every((e) => e.schnappschussOk === true);

  const wrap = document.createElement("div");
  wrap.style.maxWidth = "860px";
  wrap.style.margin = "40px auto";
  wrap.style.padding = "0 20px";

  const banner = document.createElement("div");
  banner.className = "card";
  banner.style.borderLeft = "6px solid " + (alleDet && (alleSnap || !hatSnapshot) ? "#3A7C22" : "#B4432F");
  banner.innerHTML =
    "<h1 class='step-title'>Golden Cases — Determinismus-Beweis</h1>" +
    `<p class='step-subtitle'>${ergebnisse.length} Fälle × 10 Wiederholungen. ` +
    `Determinismus: <strong>${alleDet ? "BESTANDEN" : "VERLETZT"}</strong>. ` +
    (hatSnapshot
      ? `Snapshot-Vergleich: <strong>${alleSnap ? "ALLE IDENTISCH" : "ABWEICHUNGEN!"}</strong>.`
      : "Noch kein Snapshot eingefroren (expected.json leer).") +
    "</p>";
  wrap.appendChild(banner);

  const tabelle = document.createElement("div");
  tabelle.style.marginTop = "20px";
  ergebnisse.forEach((e) => {
    const zeile = document.createElement("div");
    zeile.className = "card";
    zeile.style.marginTop = "10px";
    const status =
      !e.deterministisch
        ? "🔴 NICHT deterministisch"
        : e.schnappschussOk === false
          ? "🔴 Abweichung vom Snapshot"
          : e.schnappschussOk === true
            ? "🟢 identisch (10/10)"
            : "🟡 noch nicht eingefroren";
    zeile.innerHTML =
      `<strong>${e.fall.id}</strong> — ${e.fall.name}<br>` +
      `<span class='field-hint'>${e.fall.erwartung}</span><br>` +
      `<span>${status}</span>`;
    tabelle.appendChild(zeile);
  });
  wrap.appendChild(tabelle);

  // Aktuellen Stand für das Einfrieren bereitstellen (Konsole/Automation).
  window.__GOLDEN_AKTUELL = aktuell;
  const hinweis = document.createElement("p");
  hinweis.className = "field-hint";
  hinweis.style.marginTop = "16px";
  hinweis.textContent =
    "Einfrieren: window.__GOLDEN_AKTUELL als tests/golden/expected.json speichern (bewusster Git-Commit).";
  wrap.appendChild(hinweis);

  root.innerHTML = "";
  root.appendChild(wrap);

  return { alleDet, alleSnap, hatSnapshot };
}
