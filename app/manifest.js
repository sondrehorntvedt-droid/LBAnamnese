/**
 * LINDEBERGS OS — Manifest-Generator
 *
 * Erzeugt ein maschinenlesbares Abbild der GESAMTEN deterministischen
 * Datenbank: alle Fragen (ID, Label, Typ, Optionen, Gruppe), Beschwerde-
 * Regionen, Gelenk- & Organ-Bäume mit ihren Diagnosen (inkl. ICD-10),
 * Red Flags, Tiefe-Stufen und therapist_only-Felder.
 *
 * Zweck: eine einzige „Wahrheit", die KI-Agenten und das Entwicklerteam
 * abfragen können, ohne den Code zu lesen. `buildManifest()` ist rein
 * ableitend (keine Nebenwirkung) und deterministisch.
 */

import { INDEX } from "./anamnese-index.js";
import { GELENKE_BAUM, GELENKE_INDEX } from "../data/A06_gelenke_baum.js";
import { SYSTEMISCHE_BAUM } from "../data/A07_systemisch_baum.js";
import { HAUPTBESCHWERDE_FRAGEN } from "../data/A01_hauptbeschwerde.js";
import { ANAMNESE_TIEFE_OPTIONEN } from "../data/A00b_ziele.js";
import { THERAPIST_ONLY_IDS } from "./privacy.js";
import { diagnoseLabel, diagnoseICD10 } from "./klinik.js";

const MANIFEST_VERSION = "1.0.0";

function normOpt(o) {
  return typeof o === "string" ? { value: o, label: o } : { value: o.value, label: o.label };
}

// Alle im Baum verwendeten Diagnose-Gewichte einsammeln (Verzweigung + Red Flags).
function sammleDiagnosen(baum) {
  const set = new Set();
  Object.values(baum).forEach((entry) => {
    (entry.verzweigung || []).forEach((r) => Object.keys(r.cdss_gewicht || {}).forEach((k) => set.add(k)));
    (entry.red_flags || []).forEach((r) => Object.keys(r.cdss_gewicht || {}).forEach((k) => set.add(k)));
  });
  return set;
}

function baumZusammenfassung(baum) {
  return Object.values(baum).map((entry) => ({
    key: entry.id,
    name: entry.name,
    gruppe: entry.gruppe || null,
    icd10: entry.icd10 || [],
    screening_ids: (entry.screening || []).map((q) => q.id),
    verzweigungen: (entry.verzweigung || []).map((r) => ({
      bedingung: r.bedingung || null,
      fragen_ids: (r.fragen || []).map((f) => f.id),
      cdss_gewicht: r.cdss_gewicht || {},
    })),
    red_flags: (entry.red_flags || []).map((r) => ({ bedingung: r.bedingung || null, hinweis: r.hinweis || null, cdss_gewicht: r.cdss_gewicht || {} })),
  }));
}

export function buildManifest() {
  // ── Fragen (aus dem zentralen Index) ──────────────────────
  const fragen = Object.entries(INDEX).map(([id, def]) => ({
    id,
    label: def.label,
    type: def.type || null,
    group: def.group || null,
    therapist_only: THERAPIST_ONLY_IDS.includes(id),
    options: Object.entries(def.optionsMap || {}).map(([value, label]) => ({ value, label })),
    fields: def.fields ? def.fields.map((f) => ({ key: f.key, label: f.label, type: f.type })) : null,
  }));

  // ── Beschwerde-Regionen ───────────────────────────────────
  const hb002 = HAUPTBESCHWERDE_FRAGEN.find((f) => f.id === "HB-002");
  const regionen = (hb002.regions || []).map(normOpt);

  // ── Diagnosen (aus allen Bäumen) mit lesbarem Namen + ICD-10 ─
  const dxKeys = new Set([...sammleDiagnosen(GELENKE_BAUM), ...sammleDiagnosen(SYSTEMISCHE_BAUM)]);
  const diagnosen = [...dxKeys].sort().map((key) => ({ key, name: diagnoseLabel(key), icd10: diagnoseICD10(key) || null }));

  return {
    manifest_version: MANIFEST_VERSION,
    erzeugt: new Date().toISOString().slice(0, 10),
    zusammenfassung: {
      fragen_gesamt: fragen.length,
      regionen_gesamt: regionen.length,
      gelenk_module: Object.keys(GELENKE_BAUM).length,
      organ_module: Object.keys(SYSTEMISCHE_BAUM).length,
      diagnosen_gesamt: diagnosen.length,
      therapist_only_felder: THERAPIST_ONLY_IDS.length,
    },
    tiefe_stufen: ANAMNESE_TIEFE_OPTIONEN.map((t) => ({ value: t.value, label: t.label, dauer: t.dauer || null })),
    regionen,
    region_zu_baum: GELENKE_INDEX,
    gelenke_baum: baumZusammenfassung(GELENKE_BAUM),
    organ_baum: baumZusammenfassung(SYSTEMISCHE_BAUM),
    diagnosen,
    therapist_only_ids: THERAPIST_ONLY_IDS,
    fragen,
  };
}

export function manifestAlsJson() {
  return JSON.stringify(buildManifest(), null, 2);
}
