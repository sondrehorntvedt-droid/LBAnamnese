/**
 * LINDEBERGS OS — Zentraler Frage-Index & Antwort-Formatter
 *
 * Aggregiert ALLE Fragedefinitionen aus den Datenmodulen zu einem Lookup
 * (id → {label, type, optionsMap, fields}). Damit kann die vollständige
 * Anamnese jede beantwortete Frage lesbar als „Frage → Antwort" ausgeben —
 * über sämtliche Module (Stammdaten, Beschwerden, Vorgeschichte,
 * Systemanamnese, Vitalmedizin, Sport, Ernährung, Psychosozial), nicht nur
 * die aktuelle Beschwerde.
 *
 * Deterministisch: reine Nachschlage-/Formatlogik, keine Bewertung.
 */

import { STAMMDATEN_FELDER } from "../data/A00_stammdaten.js";
import { HAUPTBESCHWERDE_FRAGEN, ALLE_W_OPTIONEN } from "../data/A01_hauptbeschwerde.js";
import { BEGLEITSYMPTOME_FRAGEN } from "../data/A01c_begleitsymptome.js";
import { VORGESCHICHTE_FRAGEN } from "../data/A02_vorgeschichte_pmh.js";
import { GATE_OPTIONEN, ENDOKRIN_DEEP_FRAGEN } from "../data/A02b_systemanamnese.js";
import { SCHLAF_ENERGIE_FRAGEN, STOFFWECHSEL_FRAGEN, HORMONSTATUS_FRAGEN, DARMGESUNDHEIT_FRAGEN, IMMUN_FRAGEN, HORMON_GATE, IMMUN_GATE, DARM_GATE } from "../data/A03_daniel_vitalmedizin.js";
import { LICHT_GATE, LICHT_FRAGEN } from "../data/A22_licht_circadian.js";
import { PSYCHOSOZIAL_FRAGEN } from "../data/A05_psychosozial_mental.js";
import { SPORT_KERN_FRAGEN, SPORT_PERFORMANCE_FRAGEN, SPORT_GATE } from "../data/A10_sport_bewegung.js";
import { ERNAEHRUNG_KERN_FRAGEN, ERNAEHRUNG_TIEFE_FRAGEN, ERN_GATE } from "../data/A11_ernaehrung.js";
import { VITALPARAMETER_FRAGEN } from "../data/A15_vitalparameter.js";
import { UPLOAD_KATEGORIEN } from "../data/A00c_uploads.js";
import { THERAPIE_HISTORIE_MODALITAETEN, THERAPIE_ERFOLG_OPTIONEN, THERAPIE_HAEUFIGKEIT_OPTIONEN, THERAPIE_FREITEXT, INTERVENTION_FRAGEN } from "../data/A01b_therapie_historie.js";
import { GELENKE_BAUM } from "../data/A06_gelenke_baum.js";
import { SYSTEMISCHE_BAUM } from "../data/A07_systemisch_baum.js";
import { PATIENT_TYP_FRAGEN, SAEUGLING_ABSCHNITTE } from "../data/A16_saeugling_eltern.js";
import { FAKTOREN_WOVEN_FRAGEN } from "./faktoren-mapping.js";
import { ABSOLUTE_RED_FLAGS } from "../data/cdss/00_red_flags.js";

function normOpt(opt) {
  return typeof opt === "string" ? { value: opt, label: opt } : opt;
}

function optionsMap(options) {
  const m = {};
  (options || []).forEach((o) => {
    const n = normOpt(o);
    m[n.value] = n.label;
  });
  return m;
}

const INDEX = {};

function add(q, group) {
  if (!q || !q.id) return;
  const label = q.frage || q.label || q.titel || q.id;
  INDEX[q.id] = {
    label,
    type: q.type,
    optionsMap: optionsMap(q.options),
    fields: q.fields || null,
    group: group || INDEX[q.id]?.group,
  };
  // Likert-/Gruppen-Items (z.B. PHQ-4) als eigenständige Fragen registrieren.
  if (Array.isArray(q.items)) {
    const sm = {};
    if (q.scale_labels) Object.entries(q.scale_labels).forEach(([v, l]) => (sm[v] = l));
    q.items.forEach((it) => {
      if (it.id) INDEX[it.id] = { label: it.text || it.frage || it.id, type: q.type, optionsMap: sm, group };
    });
  }
}

function addList(list, group) {
  (list || []).forEach((q) => add(q, group));
}

// ── Globale Module ──────────────────────────────────────────
addList(STAMMDATEN_FELDER, "Stammdaten");
addList(BEGLEITSYMPTOME_FRAGEN, "Begleitsymptome");
addList(VORGESCHICHTE_FRAGEN, "Vorgeschichte");
addList([...SCHLAF_ENERGIE_FRAGEN, ...STOFFWECHSEL_FRAGEN, ...HORMONSTATUS_FRAGEN, ...DARMGESUNDHEIT_FRAGEN, ...IMMUN_FRAGEN, HORMON_GATE, IMMUN_GATE, DARM_GATE], "Vitalmedizin");
addList([LICHT_GATE, ...LICHT_FRAGEN], "Vitalmedizin — Licht & Rhythmus");
addList(PSYCHOSOZIAL_FRAGEN, "Psychosozial");
addList([...SPORT_KERN_FRAGEN, ...SPORT_PERFORMANCE_FRAGEN, SPORT_GATE], "Sport & Bewegung");
addList([...ERNAEHRUNG_KERN_FRAGEN, ...ERNAEHRUNG_TIEFE_FRAGEN, ERN_GATE], "Ernährung & Trinken");
addList(VITALPARAMETER_FRAGEN, "Vitalparameter");
// Befunde: Upload-Kategorie + erfasste Kernbefund-Notiz je Fachbereich.
UPLOAD_KATEGORIEN.forEach((k) => {
  INDEX[k.id] = { label: "Upload: " + k.label, type: "file_upload", optionsMap: {}, group: "Befunde" };
  INDEX[`${k.id}-notiz`] = { label: k.label + " — Kernbefunde", type: "textarea", optionsMap: {}, group: "Befunde" };
});

// Systemanamnese (baumbasiert): Gate + Freitext + Screening + Verzweigung je
// Organsystem — gruppiert für die vollständige Anamnese.
Object.values(SYSTEMISCHE_BAUM).forEach((entry) => {
  const grp = "Systemanamnese: " + entry.name;
  INDEX["SYSG-" + entry.id] = { label: `Beschwerden im Bereich ${entry.name}?`, type: "single_choice", optionsMap: optionsMap(GATE_OPTIONEN), group: grp };
  INDEX["SYSFREI-" + entry.id] = { label: `${entry.name} — in eigenen Worten`, type: "textarea", optionsMap: {}, group: grp };
  (entry.screening || []).forEach((q) => add(q, grp));
  (entry.verzweigung || []).forEach((r) => (r.fragen || []).forEach((q) => add(q, grp)));
});
addList(ENDOKRIN_DEEP_FRAGEN, "Systemanamnese: Endokrin & Stoffwechsel");

// 7-Faktoren-Fragen, die in den Vitalmedizin-Schritt eingewoben sind
// (Relations/Rise) — damit auch diese Antworten in der vollständigen
// Anamnese erscheinen und im Regelwerk-Fragenkatalog stehen.
addList(FAKTOREN_WOVEN_FRAGEN, "Vitalität & Faktoren");

// Sicherheits-Kontrollfragen (Red-Flag-Screening RF001–RF008) — Feldname im
// Datenmodul ist `text` (nicht `frage`), daher direkte Registrierung.
ABSOLUTE_RED_FLAGS.forEach((rf) =>
  (rf.questions || []).forEach((q) => {
    INDEX[q.id] = { label: q.text, type: q.type, optionsMap: {}, group: "Sicherheitsfragen" };
  })
);

// Säuglings-Anamnese (Eltern-Fremdanamnese, A16) — gruppiert je Abschnitt.
addList(PATIENT_TYP_FRAGEN, "Für wen?");
SAEUGLING_ABSCHNITTE.forEach((abschnitt) => {
  addList(abschnitt.fragen, "Säugling: " + abschnitt.titel);
});

// ── Beschwerde-bezogene Fragen (namespaced) ─────────────────
addList(HAUPTBESCHWERDE_FRAGEN, "Beschwerde");
// Regionsspezifische Optionen für HB-011/HB-012 in die Label-Maps mergen.
["HB-011", "HB-012"].forEach((id) => {
  if (INDEX[id]) (ALLE_W_OPTIONEN[id] || []).forEach((o) => (INDEX[id].optionsMap[o.value] = o.label));
});
THERAPIE_HISTORIE_MODALITAETEN.forEach((mod) => {
  INDEX[mod.id] = { label: "Vorbehandlung: " + mod.label, type: "single_choice", optionsMap: optionsMap(THERAPIE_ERFOLG_OPTIONEN), group: "Beschwerde" };
  INDEX[`${mod.id}-haeufigkeit`] = { label: mod.label + " — wie oft/lange", type: "single_choice", optionsMap: optionsMap(THERAPIE_HAEUFIGKEIT_OPTIONEN), group: "Beschwerde" };
});
add(THERAPIE_FREITEXT, "Beschwerde");
addList(INTERVENTION_FRAGEN, "Beschwerde");
// Gelenke (namespaced pro Beschwerde). Systemische Baum-Fragen sind oben
// bereits unter „Systemanamnese" registriert.
Object.values(GELENKE_BAUM).forEach((entry) => {
  (entry.screening || []).forEach((q) => add(q, "Beschwerde"));
  (entry.verzweigung || []).forEach((r) => (r.fragen || []).forEach((q) => add(q, "Beschwerde")));
});

// ── öffentliche Helfer ──────────────────────────────────────
export function getFrage(id) {
  return INDEX[id] || null;
}

/** true, wenn eine Antwort „leer" ist (nicht anzeigen). */
export function istLeer(value) {
  if (value == null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Wandelt einen Antwortwert in lesbaren Text (nutzt optionsMap/Feldtyp). */
export function formatAntwort(id, value) {
  const def = INDEX[id];
  if (istLeer(value)) return null;

  // Wiederholbare Einträge (OPs, Diagnosen, Medikamente, Familie …)
  if (def && def.type === "repeatable_entry" && Array.isArray(value)) {
    const zeilen = value
      .map((eintrag) =>
        (def.fields || [])
          .map((f) => (eintrag && eintrag[f.key] ? `${f.label}: ${eintrag[f.key]}` : null))
          .filter(Boolean)
          .join(", ")
      )
      .filter(Boolean);
    return zeilen.length ? zeilen.join(" | ") : null;
  }

  if (typeof value === "boolean") return value ? "Ja" : "Nein";

  const map = def ? def.optionsMap : {};
  if (Array.isArray(value)) {
    return value.map((v) => (map && map[v]) || v).join(", ");
  }
  if (map && map[value] != null) return String(map[value]);
  return String(value);
}

export { INDEX };
