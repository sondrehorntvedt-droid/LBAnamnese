/**
 * LINDEBERGS OS — CDSS-Verzweigungs-Engine
 *
 * Wandelt die grobe Körperregion-Auswahl einer Beschwerde in die
 * feingranularen GELENKE_BAUM/SYSTEMISCHE_BAUM-Einträge um, wertet deren
 * Screening- und Verzweigungsfragen aus (via app/cdss-context.js) und
 * akkumuliert cdss_gewichte für das spätere Differentialdiagnose-Ranking.
 *
 * Arbeitet im Namensraum EINER Beschwerde (app/beschwerde-store.js), da
 * jede Beschwerde ihren eigenen, unabhängigen Fragenpfad durchläuft.
 * Regionsspezifische red_flags werden automatisch beim globalen
 * Red-Flag-Wächter (app/redflags.js) registriert — über alle aktiven
 * Beschwerden hinweg.
 */

import { GELENKE_BAUM } from "../data/A06_gelenke_baum.js";
import { SYSTEMISCHE_BAUM } from "../data/A07_systemisch_baum.js";
import { evalBedingung } from "./conditions.js";
import { buildKontext } from "./cdss-context.js";
import { registerRedFlagSource } from "./redflags.js";
import { getNamespacedView, getBeschwerden } from "./beschwerde-store.js";

// HB-002-Auswahl (grob) → GELENKE_BAUM/SYSTEMISCHE_BAUM-Schlüssel (fein)
const HB002_TO_REGION_KEYS = {
  hws: ["HWS"],
  bws: ["BWS"],
  lws: ["LWS"],
  schulter_l: ["SCHULTER_GH"],
  schulter_r: ["SCHULTER_GH"],
  ellenbogen_l: ["ELLBOGEN"],
  ellenbogen_r: ["ELLBOGEN"],
  hand_l: ["HANDGELENK"],
  hand_r: ["HANDGELENK"],
  huefte_l: ["HUEFTE"],
  huefte_r: ["HUEFTE"],
  knie_l: ["KNIE"],
  knie_r: ["KNIE"],
  sprunggelenk_l: ["OSG"],
  sprunggelenk_r: ["OSG"],
  kiefer: ["KIEFER_TMJ"],
  isg: ["ISG", "LSU_SAKRUM"],
  becken_symphyse: ["SYMPHYSE"],
  rippen_thorax: ["RIPPEN_THORAX"],
  kopfschmerz_migraene: ["NEUROLOGIE"],
  schwindel: ["NEUROLOGIE", "HNO"],
  herz_kreislauf: ["HERZ_KARDIO"],
  lunge_atem: ["LUNGE_RESP"],
  bauch_verdauung: ["MAGEN_OESOPHAGUS", "DARM_KOLON"],
  kopf_hno: ["HNO"],
  becken_urogenital: ["NIERE", "BLASE"],
  allgemein_muedigkeit: [],
};

function getRegionEntry(regionKey) {
  return GELENKE_BAUM[regionKey] || SYSTEMISCHE_BAUM[regionKey] || null;
}

/** Systemische Module (Organe) haben viele Screening-Fragen → Gate davor. */
export function isSystemicKey(regionKey) {
  return regionKey in SYSTEMISCHE_BAUM;
}

export function getRegionKeysForHB002Value(hb002Value, geschlecht) {
  const keys = new Set(HB002_TO_REGION_KEYS[hb002Value] || []);
  if (keys.has("NIERE") || keys.has("BLASE")) {
    if (geschlecht === "m") keys.add("PROSTATA");
    if (geschlecht === "f") keys.add("GYNAEKOLOGIE");
  }
  return [...keys];
}

export function computeRegionPfad(regionKey, answers) {
  const entry = getRegionEntry(regionKey);
  if (!entry) return { entry: null, fragen: [], cdss_gewichte: {}, hints: [] };

  const kontext = buildKontext(regionKey, answers);
  const fragen = [...(entry.screening || [])];
  const cdss_gewichte = {};
  const hints = [];

  if (entry.red_flags) {
    entry.red_flags.forEach((rf, idx) => {
      if (evalBedingung(rf.bedingung, kontext)) {
        if (rf.cdss_gewicht) Object.assign(cdss_gewichte, rf.cdss_gewicht);
        hints.push({
          flag_id: `${regionKey}-RF-${idx}`,
          display_message: `⚠️ ${rf.hinweis}`,
          therapist_alert: rf.hinweis,
          stop_anamnesis: true,
        });
      }
    });
  }

  if (entry.verzweigung) {
    entry.verzweigung.forEach((regel) => {
      if (evalBedingung(regel.bedingung, kontext)) {
        (regel.fragen || []).forEach((f) => {
          if (!fragen.find((existing) => existing.id === f.id)) fragen.push(f);
        });
        if (regel.cdss_gewicht) Object.assign(cdss_gewichte, regel.cdss_gewicht);
      }
    });
  }

  return { entry, fragen, cdss_gewichte, hints };
}

/**
 * Wie computeRegionPfad(), aber ausgewertet im Namensraum EINER Beschwerde
 * (siehe app/beschwerde-store.js) — für den Beschwerde-Loop, in dem jede
 * Beschwerde ihre eigenen, unabhängigen Antworten hat.
 */
export function computeRegionPfadForBeschwerde(beschwerdeId, regionKey, allAnswers) {
  const view = getNamespacedView(beschwerdeId, allAnswers);
  return computeRegionPfad(regionKey, view);
}

/** Alle CDSS-Ergebnisse über alle aktiven Beschwerden hinweg (für Red-Flag-Wächter & Zusammenfassung). */
export function computeAllActiveRegionsPerBeschwerde(allAnswers) {
  return getBeschwerden().flatMap((b) => {
    if (!b.region) return [];
    return getRegionKeysForHB002Value(b.region, allAnswers["SD-004"]).map((key) => ({
      beschwerdeId: b.id,
      key,
      ...computeRegionPfadForBeschwerde(b.id, key, allAnswers),
    }));
  });
}

// ── Anbindung an den globalen Red-Flag-Wächter (Phase 3) ────────────────
registerRedFlagSource((answers) => computeAllActiveRegionsPerBeschwerde(answers).flatMap((r) => r.hints));
