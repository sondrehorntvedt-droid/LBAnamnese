/**
 * LINDEBERGS OS — Systemanamnese (tief, baumbasiert)
 *
 * Nutzt den vollständigen systemischen Fragebaum (SYSTEMISCHE_BAUM, A07) mit
 * ALLEN Organsystemen. Pro System: Gate („ist das ein Thema?") → bei Ja das
 * Screening → und über die Verzweigungslogik eine ZWEITE Ebene tieferer Fragen,
 * wenn bestimmte Antworten zutreffen (z.B. Herz-Brustschmerz → „strahlt in Arm/
 * Kiefer/Rücken aus?"). Freitext & Befund-Verknüpfung pro System bleiben; das
 * Endokrin-/Stoffwechsel-System erhält in der Tiefenanalyse den KPNI-Deep-Dive.
 *
 * Red Flags aus dem systemischen Baum (z.B. akuter Ruhe-Brustschmerz) werden
 * global überwacht (registerRedFlagSource unten).
 */
import { registerStep } from "../router.js";
import { renderQuestion } from "../render/renderQuestion.js";
import { computeRegionPfad } from "../cdss-engine.js";
import { SYSTEMISCHE_BAUM } from "../../data/A07_systemisch_baum.js";
import { SYSTEMANAMNESE_INTRO, GATE_OPTIONEN, ENDOKRIN_DEEP_FRAGEN } from "../../data/A02b_systemanamnese.js";
import { getBefundeFuerFachbereiche } from "../upload-prefill.js";
import { registerRedFlagSource } from "../redflags.js";
import { state } from "../state.js";

// Reihenfolge & Fachbereichs-/Geschlechts-Zuordnung der systemischen Module.
const MODULE = [
  { key: "HERZ_KARDIO", fach: ["Kardiologie"] },
  { key: "GEFAESSSYSTEM", fach: ["Kardiologie"] },
  { key: "LUNGE_RESP", fach: ["Pneumologie"] },
  { key: "HNO", fach: [] },
  { key: "NEUROLOGIE", fach: ["Neurologie"] },
  { key: "MAGEN_OESOPHAGUS", fach: ["Ernährungsmedizin"] },
  { key: "DARM_KOLON", fach: ["Ernährungsmedizin"] },
  { key: "LEBER_GALLE", fach: ["Labormedizin"] },
  { key: "PANKREAS_MILZ", fach: ["Labormedizin"] },
  { key: "NIERE", fach: ["Labormedizin"] },
  { key: "BLASE", fach: [] },
  { key: "PROSTATA", fach: [], geschlecht: "m" },
  { key: "GYNAEKOLOGIE", fach: [], geschlecht: "f" },
  { key: "ENDOKRIN", fach: ["Labormedizin", "Ernährungsmedizin"], deep: true },
  { key: "HAUT", fach: ["Allgemein / Sonstige"] },
  { key: "RHEUMA_IMMUNOLOGIE", fach: ["Labormedizin"] },
];

const gateId = (key) => `SYSG-${key}`;
const freitextId = (key) => `SYSFREI-${key}`;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function sichtbareModule() {
  const sex = state.answers["SD-004"];
  return MODULE.filter((m) => !m.geschlecht || m.geschlecht === sex);
}

function computeSignature() {
  const parts = sichtbareModule().map((m) => {
    const g = state.get(gateId(m.key)) ?? "";
    if (g !== "ja" && g !== "unsicher") return `${m.key}=${g}`;
    // Bei offenem Gate auch die aktuell aktiven (verzweigten) Fragen-IDs
    // aufnehmen, damit die 2. Ebene beim Ausfüllen live erscheint.
    const ids = computeRegionPfad(m.key, state.answers).fragen.map((f) => f.id).join(",");
    return `${m.key}=${g}:${ids}`;
  });
  return parts.join("|") + "|" + state.answers["SD-004"] + "|" + state.meta.anamneseTiefe;
}

const setter = { getValue: (id) => state.get(id), setValue: (id, v) => state.set(id, v) };

function renderBefundHinweis(fach) {
  const befunde = getBefundeFuerFachbereiche(fach || []);
  if (befunde.length === 0) return null;
  const box = el("div", "card card--sunken");
  box.style.marginTop = "12px";
  box.style.borderLeft = "3px solid var(--color-primary)";
  box.appendChild(el("div", "section-label", "Uns liegt bereits ein Befund vor"));
  befunde.forEach((b) => {
    const p = el("p", "field-hint", `${b.label}: ${b.files.length} Datei(en) hochgeladen.`);
    p.style.margin = "4px 0 0";
    box.appendChild(p);
  });
  const hinweis = el("p", "tagline");
  hinweis.style.margin = "8px 0 0";
  hinweis.style.fontSize = "0.85rem";
  hinweis.textContent = "Bitte nur ergänzen, was sich seither geändert hat oder was im Befund nicht steht.";
  box.appendChild(hinweis);
  return box;
}

function renderModul(m) {
  const entry = SYSTEMISCHE_BAUM[m.key];
  if (!entry) return null;

  const card = el("div", "card");
  card.style.marginBottom = "16px";
  card.appendChild(el("div", "section-label", entry.name));

  // Gate
  card.appendChild(
    renderQuestion(
      {
        id: gateId(m.key),
        frage: `Bestehen bei Ihnen Beschwerden oder Auffälligkeiten im Bereich ${entry.name}?`,
        type: "single_choice",
        options: GATE_OPTIONEN,
      },
      setter
    )
  );

  const g = state.get(gateId(m.key));
  if (g !== "ja" && g !== "unsicher") return card;

  const befund = renderBefundHinweis(m.fach);
  if (befund) card.appendChild(befund);

  const stack = el("div", "field-stack");
  stack.style.marginTop = "16px";

  // Freitext zuerst.
  stack.appendChild(
    renderQuestion(
      { id: freitextId(m.key), frage: "In Ihren eigenen Worten (optional):", type: "textarea", placeholder: "Was beobachten Sie? Seit wann?" },
      setter
    )
  );

  // Screening + verzweigte 2. Ebene aus dem systemischen Baum.
  const { fragen } = computeRegionPfad(m.key, state.answers);
  fragen.forEach((f) => stack.appendChild(renderQuestion(f, setter)));

  // Endokrin: KPNI-/Daniel-Deep-Dive nur in der Tiefenanalyse.
  if (m.deep && state.meta.anamneseTiefe === "tiefenanalyse") {
    const v = el("div", "section-label", "Vertiefung (Stoffwechsel, Hormone, Nährstoffe)");
    v.style.marginTop = "16px";
    v.style.color = "var(--color-secondary)";
    stack.appendChild(v);
    ENDOKRIN_DEEP_FRAGEN.forEach((f) => stack.appendChild(renderQuestion(f, setter)));
  }

  card.appendChild(stack);
  return card;
}

// Globaler Red-Flag-Wächter für die (global gespeicherten) Systemanamnese-
// Antworten — z.B. akuter Ruhe-Brustschmerz (KAR-007) → 112.
registerRedFlagSource((answers) => MODULE.flatMap((m) => computeRegionPfad(m.key, answers).hints));

export function registerSystemanamneseStep() {
  registerStep({
    id: "systemanamnese",
    // Erwachsenen-Modul: bei Säuglings-Anamnese (Eltern-Fragebogen) ausgeblendet.
    isVisible: (answers) => answers["PT-001"] !== "saeugling",
    group: "Systemanamnese",
    eyebrow: "Systemanamnese",
    title: SYSTEMANAMNESE_INTRO.titel,
    subtitle:
      "Eine kurze Frage pro Organsystem. Bei Ja gehen wir gezielt in die Tiefe — nur so weit, wie es für Sie relevant ist.",
    estMinutes: 7,
    tiers: ["ganzheitlich", "tiefenanalyse"],
    render(container) {
      let lastSignature = null;
      function redraw() {
        const signature = computeSignature();
        if (signature === lastSignature) return;
        lastSignature = signature;
        container.innerHTML = "";
        sichtbareModule().forEach((m) => {
          const c = renderModul(m);
          if (c) container.appendChild(c);
        });
      }
      redraw();
      return state.subscribe(redraw);
    },
  });
}
