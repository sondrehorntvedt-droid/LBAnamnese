/**
 * LINDEBERGS OS — Vitalparameter (optionale Messwerte, Geräte-Schnittstelle ready)
 */
import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { VITALPARAMETER_INTRO, VITALPARAMETER_FRAGEN } from "../../data/A15_vitalparameter.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function renderSectioned(container, fragen) {
  const cleanups = [];
  let lastSection = null;
  let stack = null;
  fragen.forEach((frage) => {
    if (frage.section && frage.section !== lastSection) {
      lastSection = frage.section;
      container.appendChild(el("div", "section-label", frage.section));
      stack = el("div", "field-stack");
      stack.style.marginTop = "12px";
      stack.style.marginBottom = "16px";
      container.appendChild(stack);
    }
    if (!stack) {
      stack = el("div", "field-stack");
      container.appendChild(stack);
    }
    cleanups.push(renderFragenListe(stack, [frage]));
  });
  return () => cleanups.forEach((fn) => fn());
}

// Scaffold für die spätere Wearable-/Geräte-Anbindung. Zeigt die Vision und
// die vorgesehenen Anbieter, ohne Funktion vorzutäuschen (Anbindung = Backend).
const WEARABLES = ["Oura Ring", "WHOOP", "Garmin", "Apple Health", "Fitbit", "Withings"];

function renderWearableScaffold() {
  const card = el("div", "card card--sunken");
  card.style.marginTop = "8px";
  card.appendChild(el("div", "section-label", "Geräte & Wearables verbinden"));
  card.appendChild(
    el(
      "p",
      "field-hint",
      "Bald können Sie Ihre Werte (Herzfrequenz, HRV, Schlaf, Blutdruck) automatisch aus Ihren Geräten übernehmen — dann müssen Sie oben nichts von Hand eintragen."
    )
  );
  const row = el("div");
  row.style.display = "flex";
  row.style.flexWrap = "wrap";
  row.style.gap = "8px";
  row.style.margin = "10px 0";
  WEARABLES.forEach((name) => {
    const chip = el("span", "choice-tile");
    chip.style.opacity = "0.6";
    chip.style.cursor = "not-allowed";
    chip.appendChild(el("span", null, name));
    const soon = el("span", "field-hint", "  bald");
    soon.style.fontSize = "0.7rem";
    chip.appendChild(soon);
    row.appendChild(chip);
  });
  card.appendChild(row);
  card.appendChild(
    el("p", "field-hint", "Hinweis: Die automatische Anbindung erfolgt mit der Server-Version (sichere Verbindung über Ihr Geräte-Konto). Ihre Daten bleiben bei Ihnen.")
  );
  return card;
}

export function registerVitalparameterStep() {
  registerStep({
    id: "vitalparameter",
    // Erwachsenen-Modul: bei Säuglings-Anamnese (Eltern-Fragebogen) ausgeblendet.
    isVisible: (answers) => answers["PT-001"] !== "saeugling",
    group: "Vitalparameter",
    eyebrow: "Messwerte",
    title: VITALPARAMETER_INTRO.titel,
    subtitle: VITALPARAMETER_INTRO.beschreibung,
    estMinutes: 1,
    // Keine tiers-Beschränkung: kurz & optional, in allen Tiefen verfügbar.
    render(container) {
      const cleanup = renderSectioned(container, VITALPARAMETER_FRAGEN);
      container.appendChild(renderWearableScaffold());
      return cleanup;
    },
  });
}
