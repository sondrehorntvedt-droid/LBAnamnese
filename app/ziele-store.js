/**
 * LINDEBERGS OS — Ziele-Store (PROM, Phase 0)
 * Analog zu beschwerde-store.js, aber ohne CDSS-Namensraum — Ziele haben
 * ein festes, kleines Feld-Set und werden direkt als Objekte in
 * state.meta.ziele gehalten.
 */

import { state } from "./state.js";
import { MAX_ZIELE } from "../data/A00b_ziele.js";

export function getZiele() {
  return state.meta.ziele || [];
}

export function addZiel() {
  const list = getZiele();
  if (list.length >= MAX_ZIELE) return null;
  const neu = {
    id: `z${Date.now()}${list.length}`,
    kategorie: null,    // Ziel-Kategorie (A24 — steuert den Wenn-Baum)
    aktivitaet: "",     // konkretes Ziel in eigenen Worten (ICF-Aktivitätsebene)
    baseline: null,     // Baseline 0–10 (PSFS bzw. kategoriespezifische NRS)
    target: 10,         // Zielwert 0–10
    zielgewicht: "",    // nur Kategorie „abnehmen" (kg)
    lebensbereich: null, // Altbestand (bis v-5) — wird nicht mehr abgefragt
    zeitrahmen: null,
    zieldatum: "",      // bei zeitrahmen === "zu_termin"
    warum: "",          // warum wichtig (qualitativ/motivational, GAS-Prinzip)
    prioritaet: list.length + 1,
  };
  state.setMeta({ ziele: [...list, neu] });
  return neu.id;
}

export function updateZiel(id, patch) {
  state.setMeta({ ziele: getZiele().map((z) => (z.id === id ? { ...z, ...patch } : z)) });
}

export function removeZiel(id) {
  state.setMeta({ ziele: getZiele().filter((z) => z.id !== id) });
}

export function ensureFirstZiel() {
  if (getZiele().length === 0) addZiel();
}

export function getTiefe() {
  return state.meta.anamneseTiefe || null;
}

export function setTiefe(value) {
  state.setMeta({ anamneseTiefe: value });
}
