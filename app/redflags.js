/**
 * LINDEBERGS OS — Globaler Red-Flag-Wächter
 *
 * Wertet bei JEDER Antwort-Änderung die absoluten Red Flags aus
 * 00_red_flags.js sowie die inline `alert_on`-Fragen aus A01/A03 aus.
 * Bei stop_anamnesis:true (oder inline alert_on-Treffer) erscheint sofort
 * ein blockierendes Vollbild — Patientensicherheit hat Vorrang vor Formular-
 * Fortschritt. Bei stop_anamnesis:false erscheint ein dismissbarer Hinweis-
 * Banner.
 *
 * Regionsspezifische red_flags aus GELENKE_BAUM/SYSTEMISCH_BAUM (Phase 4)
 * werden über registerRedFlagSource() nachträglich angebunden, ohne dieses
 * Modul zu ändern.
 */

import { state } from "./state.js";
import { ABSOLUTE_RED_FLAGS } from "../data/cdss/00_red_flags.js";
import { HAUPTBESCHWERDE_FRAGEN } from "../data/A01_hauptbeschwerde.js";
import { BEGLEITSYMPTOME_FRAGEN } from "../data/A01c_begleitsymptome.js";
import { DARMGESUNDHEIT_FRAGEN } from "../data/A03_daniel_vitalmedizin.js";

// ── Zusätzliche Red-Flag-Quellen (von Phase 4 CDSS-Regionsmodulen befüllt) ──
const extraSources = [];
export function registerRedFlagSource(checkFn) {
  extraSources.push(checkFn);
}

// ── json-rules-engine-kompatible Bedingungsauswertung ───────────────────
function evalFactCondition({ fact, operator, value }, facts) {
  const factVal = facts[fact];
  switch (operator) {
    case "equal":
      return factVal === value;
    case "in":
      if (Array.isArray(factVal)) return factVal.some((v) => value.includes(v));
      return value.includes(factVal);
    default:
      return false;
  }
}

function evalNode(node, facts) {
  if ("any" in node) return node.any.some((child) => evalNode(child, facts));
  if ("all" in node) return node.all.every((child) => evalNode(child, facts));
  return evalFactCondition(node, facts);
}

function checkAbsoluteRedFlags(answers) {
  const facts = { ...answers, region_primary: answers["HB-002"] || [] };
  return ABSOLUTE_RED_FLAGS.filter((rf) => evalNode(rf.rule.conditions, facts)).map((rf) => ({
    flag_id: rf.rule.event.params.flag_id,
    name: rf.name,
    icd10: rf.icd10,
    ...rf.rule.event.params,
  }));
}

// ── Inline `alert_on`-Fragen (HB-017, D4-004, ...) ──────────────────────
const ALERT_TAGGED_QUESTIONS = [
  ...HAUPTBESCHWERDE_FRAGEN,
  ...BEGLEITSYMPTOME_FRAGEN,
  ...DARMGESUNDHEIT_FRAGEN,
].filter((q) => Array.isArray(q.alert_on));

function checkInlineAlerts(answers) {
  return ALERT_TAGGED_QUESTIONS.filter((q) => {
    const val = answers[q.id];
    const valArr = Array.isArray(val) ? val : [val];
    return q.alert_on.some((a) => valArr.includes(a));
  }).map((q) => ({
    flag_id: q.id,
    name: q.frage,
    display_message: q.alert_text,
    therapist_alert: `${q.id}: ${q.alert_text}`,
    stop_anamnesis: true,
  }));
}

export function checkAllRedFlags(answers) {
  return [
    ...checkAbsoluteRedFlags(answers),
    ...checkInlineAlerts(answers),
    ...extraSources.flatMap((fn) => fn(answers) || []),
  ];
}

// ── UI: blockierendes Vollbild + dismissbarer Banner ────────────────────
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

let overlayEl = null;
let bannerEl = null;

function ensureBanner() {
  if (bannerEl) return bannerEl;
  bannerEl = el("div", "no-print");
  bannerEl.style.position = "sticky";
  bannerEl.style.top = "0";
  bannerEl.style.zIndex = "15";
  bannerEl.style.padding = "0";
  document.getElementById("app").insertBefore(bannerEl, document.getElementById("app").children[1]);
  return bannerEl;
}

function renderBanner(flags) {
  const banner = ensureBanner();
  banner.innerHTML = "";
  const acknowledged = state.meta.emergencyAcknowledged || [];
  const visible = flags.filter((f) => !acknowledged.includes(f.flag_id));
  if (!visible.length) return;

  visible.forEach((flag) => {
    const bar = el("div", "alert-banner alert-banner--warning");
    bar.style.margin = "12px 24px 0";
    const textWrap = el("div");
    textWrap.appendChild(el("p", null, flag.display_message));
    bar.appendChild(textWrap);
    const dismiss = el("button", "btn btn--ghost", "OK, verstanden");
    dismiss.type = "button";
    dismiss.addEventListener("click", () => {
      state.setMeta({ emergencyAcknowledged: [...acknowledged, flag.flag_id] });
    });
    bar.appendChild(dismiss);
    banner.appendChild(bar);
  });
}

function renderOverlay(flag) {
  if (overlayEl) overlayEl.remove();
  overlayEl = el("div", "emergency-overlay no-print");
  const card = el("div", "emergency-card");
  card.appendChild(el("h2", null, "Wichtiger Sicherheitshinweis"));
  card.appendChild(el("p", null, flag.display_message));
  const note = el(
    "p",
    "field-hint",
    "Dieser Hinweis basiert auf Ihren Angaben und ersetzt keine ärztliche Untersuchung."
  );
  card.appendChild(note);

  const ackBtn = el("button", "btn btn--danger btn--block", "Verstanden — ich hole mir schnellstmöglich ärztliche Hilfe");
  ackBtn.type = "button";
  ackBtn.style.marginTop = "16px";
  ackBtn.addEventListener("click", () => {
    const acknowledged = state.meta.emergencyAcknowledged || [];
    state.setMeta({ emergencyAcknowledged: [...acknowledged, flag.flag_id] });
    overlayEl.remove();
    overlayEl = null;
  });
  card.appendChild(ackBtn);

  overlayEl.appendChild(card);
  document.body.appendChild(overlayEl);
}

function evaluate() {
  const flags = checkAllRedFlags(state.answers);
  const acknowledged = state.meta.emergencyAcknowledged || [];

  const stopFlag = flags.find((f) => f.stop_anamnesis && !acknowledged.includes(f.flag_id));
  if (stopFlag) {
    renderOverlay(stopFlag);
  } else if (overlayEl) {
    overlayEl.remove();
    overlayEl = null;
  }

  const relativeFlags = flags.filter((f) => !f.stop_anamnesis);
  renderBanner(relativeFlags);
}

export function initRedFlagWatcher() {
  evaluate();
  state.subscribe(evaluate);
}
