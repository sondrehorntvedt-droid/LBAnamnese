import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import {
  SCHLAF_ENERGIE_FRAGEN,
  DARMGESUNDHEIT_FRAGEN,
} from "../../data/A03_daniel_vitalmedizin.js";
import { FAKTOREN_WOVEN_FRAGEN } from "../faktoren-mapping.js";
import { state } from "../state.js";

// Immer (ganzheitlich+): Schlaf/Energie + die eingewobenen Faktor-Fragen.
// Nur Tiefenanalyse: Darm-/Mikrobiom-Vertiefung.
//
// ENTDOPPELT: Stoffwechsel & Hormonstatus werden NICHT mehr hier gefragt —
// Hormone/Stoffwechsel-Vertiefung liegt jetzt in der Systemanamnese
// (SYS-E „Stoffwechsel und Hormone", nur Tiefenanalyse), die Ernährung im
// eigenen Ernährungs-Modul, Diabetes/Blutdruck/Blutfette in der Vorgeschichte.
const CORE_SECTIONS = [
  { titel: "Schlaf & Energie", felder: SCHLAF_ENERGIE_FRAGEN },
  { titel: "Beweglichkeit, Verbindung & Sinn", felder: FAKTOREN_WOVEN_FRAGEN },
];
const DEEP_SECTIONS = [
  { titel: "Darmgesundheit & Mikrobiom", felder: DARMGESUNDHEIT_FRAGEN },
];

export function registerVitalmedizinStep() {
  registerStep({
    id: "vitalmedizin",
    group: "Energie & Vitalität",
    eyebrow: "Vitalmedizin",
    title: "Energie, Schlaf & Vitalität",
    subtitle: "Wie geht es Ihnen insgesamt? Diese Fragen helfen uns, Sie ganzheitlich zu behandeln.",
    estMinutes: 6,
    tiers: ["ganzheitlich", "tiefenanalyse"],
    render(container) {
      const cleanups = [];
      const sections =
        state.meta.anamneseTiefe === "tiefenanalyse" ? [...CORE_SECTIONS, ...DEEP_SECTIONS] : CORE_SECTIONS;
      sections.forEach((section) => {
        const heading = document.createElement("div");
        heading.className = "section-label";
        heading.style.marginTop = "8px";
        heading.textContent = section.titel;
        container.appendChild(heading);
        const sectionWrap = document.createElement("div");
        sectionWrap.className = "field-stack";
        container.appendChild(sectionWrap);
        cleanups.push(renderFragenListe(sectionWrap, section.felder));
      });
      return () => cleanups.forEach((fn) => fn());
    },
  });
}
