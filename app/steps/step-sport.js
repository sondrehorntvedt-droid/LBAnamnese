/**
 * LINDEBERGS OS — Sport- & Bewegungsanamnese
 * Kern (Ganzheitlich): Alltagsbewegung + 5 sportmotorische Fähigkeiten.
 * Performance-Tiefe (Tiefenanalyse): Trainingssteuerung, Zone 2, VO2max,
 * Kraft/Protein, Regeneration, Sportverletzungen, weibliche Physiologie.
 */
import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { renderGatedBlock } from "../render/renderGate.js";
import { SPORT_KERN_FRAGEN, SPORT_PERFORMANCE_FRAGEN, SPORT_GATE } from "../../data/A10_sport_bewegung.js";
import { state } from "../state.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function renderSectioned(container, fragen) {
  // Fragen nach `section` gruppieren, Zwischenüberschriften einziehen.
  const cleanups = [];
  let lastSection = null;
  let currentStack = null;
  fragen.forEach((frage) => {
    if (frage.section && frage.section !== lastSection) {
      lastSection = frage.section;
      container.appendChild(el("div", "section-label", frage.section));
      currentStack = el("div", "field-stack");
      currentStack.style.marginTop = "12px";
      currentStack.style.marginBottom = "16px";
      container.appendChild(currentStack);
    }
    if (!currentStack) {
      currentStack = el("div", "field-stack");
      container.appendChild(currentStack);
    }
    cleanups.push(renderFragenListe(currentStack, [frage]));
  });
  return () => cleanups.forEach((fn) => fn());
}

export function registerSportStep() {
  registerStep({
    id: "sport_bewegung",
    // Erwachsenen-Modul: bei Säuglings-Anamnese (Eltern-Fragebogen) ausgeblendet.
    isVisible: (answers) => !["saeugling", "kind"].includes(answers["PT-001"]),
    group: "Sport & Bewegung",
    eyebrow: "Sport & Bewegung",
    title: "Ihre Bewegung & Leistungsfähigkeit",
    subtitle:
      "Bewegung ist ein Schlüssel zu Vitalität und niedrigerem biologischem Alter. Diese Angaben fließen in Ihren Faktor Range (Bewegung) ein.",
    estMinutes: 4,
    tiers: ["ganzheitlich", "tiefenanalyse"],
    render(container) {
      // Kern immer; der Performance-Block (Tiefenanalyse) hängt hinter einem
      // Bereichs-Gate und klappt bei „Nein" komplett zu (samt Unterüberschriften).
      const cleanups = [renderSectioned(container, SPORT_KERN_FRAGEN)];
      if (state.meta.anamneseTiefe === "tiefenanalyse") {
        cleanups.push(
          renderGatedBlock(container, SPORT_GATE, (wrap) =>
            renderSectioned(wrap, SPORT_PERFORMANCE_FRAGEN)
          )
        );
      }
      return () => cleanups.forEach((fn) => fn && fn());
    },
  });
}
