/**
 * LINDEBERGS OS — Ernährung & Trinkverhalten
 * Kern (Ganzheitlich): Trinkverhalten, Ernährungsform, Rhythmus, Qualität.
 * Tiefe (Tiefenanalyse): metabolische Flexibilität, Essverhalten, Trigger.
 */
import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { ERNAEHRUNG_KERN_FRAGEN, ERNAEHRUNG_TIEFE_FRAGEN } from "../../data/A11_ernaehrung.js";
import { state } from "../state.js";

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

export function registerErnaehrungStep() {
  registerStep({
    id: "ernaehrung",
    group: "Ernährung",
    eyebrow: "Ernährung & Trinken",
    title: "Ernährung & Trinkverhalten",
    subtitle: "Ernährung ist ein Grundpfeiler Ihrer Gesundheit — diese Angaben helfen uns, gezielt zu beraten.",
    estMinutes: 4,
    tiers: ["ganzheitlich", "tiefenanalyse"],
    render(container) {
      const fragen =
        state.meta.anamneseTiefe === "tiefenanalyse"
          ? [...ERNAEHRUNG_KERN_FRAGEN, ...ERNAEHRUNG_TIEFE_FRAGEN]
          : ERNAEHRUNG_KERN_FRAGEN;
      return renderSectioned(container, fragen);
    },
  });
}
