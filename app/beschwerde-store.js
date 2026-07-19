/**
 * LINDEBERGS OS — Beschwerde-Loop Store
 *
 * Kernidee aus dem Master-Dokument ("Finale Lindebergs OS Anamnese 5.1.25"):
 * "Der Patient erstellt für jedes Problem eine eigene 'Beschwerde-Akte'.
 * Der Fragenbaum wird für jede Akte separat durchlaufen, um eine
 * Vermischung von Symptomen (z.B. Knie vs. Kopfschmerz) zu vermeiden."
 *
 * Jede Beschwerde bekommt eine eigene ID (z.B. "b1"). Alle Fragen, die für
 * diese Beschwerde beantwortet werden (W-Fragen, CDSS-Screening,
 * Therapie-Historie), werden NAMENSRAUM-präfigiert im globalen answers-
 * Objekt gespeichert: `"${beschwerdeId}::HB-003"`, `"${beschwerdeId}::LWS-002"`
 * usw. So kollidieren mehrfach gestellte, identische Fragen nicht.
 *
 * Globale Fakten (SD-*, RF00X-Q* aus den Sicherheitsfragen) bleiben
 * unpräfigiert und sind über getNamespacedView() automatisch für jede
 * Beschwerde mit-sichtbar (z.B. für Cross-Links wie den Cauda-Equina-Check).
 */

import { state } from "./state.js";

const SEP = "::";

export function getBeschwerden() {
  return state.meta.beschwerden || [];
}

export function addBeschwerde() {
  const list = getBeschwerden();
  const nextNum = list.length + 1;
  const neu = { id: `b${nextNum}`, region: null };
  state.setMeta({ beschwerden: [...list, neu] });
  return neu.id;
}

export function setBeschwerdeRegion(beschwerdeId, regionValue) {
  const list = getBeschwerden().map((b) => (b.id === beschwerdeId ? { ...b, region: regionValue } : b));
  state.setMeta({ beschwerden: list });
  syncLegacyRegionList();
}

export function removeBeschwerde(beschwerdeId) {
  const list = getBeschwerden().filter((b) => b.id !== beschwerdeId);
  state.setMeta({ beschwerden: list });
  syncLegacyRegionList();
}

export function ensureFirstBeschwerde() {
  if (getBeschwerden().length === 0) addBeschwerde();
}

// Hält HB-002 (Regionen-Array) synchron, da andere Module (anamnese_master,
// evtl. spätere PDF-Zusammenfassung) diesen Schlüssel als Aggregat lesen.
function syncLegacyRegionList() {
  const regions = getBeschwerden().map((b) => b.region).filter(Boolean);
  state.set("HB-002", regions);
}

export function namespacedAccessors(beschwerdeId) {
  return {
    getValue: (id) => state.get(`${beschwerdeId}${SEP}${id}`),
    setValue: (id, val) => state.set(`${beschwerdeId}${SEP}${id}`, val),
  };
}

/**
 * Liefert eine "flache Sicht" für einen Beschwerde-Kontext: alle globalen
 * (nicht-präfigierten) Antworten PLUS die Antworten dieser einen Beschwerde
 * mit entferntem Präfix — genau das, was cdss-context.js/buildKontext für
 * die Verzweigungslogik braucht.
 */
export function getNamespacedView(beschwerdeId, allAnswers) {
  const prefix = `${beschwerdeId}${SEP}`;
  const view = {};
  Object.entries(allAnswers).forEach(([k, v]) => {
    if (k.startsWith(prefix)) {
      view[k.slice(prefix.length)] = v;
    } else if (!k.includes(SEP)) {
      view[k] = v;
    }
  });
  return view;
}
