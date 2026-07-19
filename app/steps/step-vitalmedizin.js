import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import {
  SCHLAF_ENERGIE_FRAGEN,
  DARMGESUNDHEIT_FRAGEN,
  STOFFWECHSEL_FRAGEN,
  HORMONSTATUS_FRAGEN,
  IMMUN_FRAGEN,
} from "../../data/A03_daniel_vitalmedizin.js";
import { FAKTOREN_WOVEN_FRAGEN } from "../faktoren-mapping.js";
import { state } from "../state.js";

// Kuratiertes Hormon-/Stoffwechsel-Screening für die Tiefenanalyse:
// die strukturierten Hormonfragen (D3) + NUR die nicht anderweitig erhobenen
// Stoffwechsel-Marker (Insulinresistenz-Zeichen, Taille, Diabetes-Trias).
// Bewusst OHNE die in Vorgeschichte/Ernährung bereits erfassten D2-Fragen —
// keine Dublette. Diese Antworten speisen app/hormon.js (Laborpanel-Prüfliste).
const METAB_SCREEN = STOFFWECHSEL_FRAGEN.filter((q) =>
  ["D2-003", "D2-010", "D2-011"].includes(q.id)
);
const HORMON_STOFFWECHSEL = [...METAB_SCREEN, ...HORMONSTATUS_FRAGEN];

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
  { titel: "Hormone & Stoffwechsel", felder: HORMON_STOFFWECHSEL },
  { titel: "Immunsystem & Entzündung", felder: IMMUN_FRAGEN },
];

export function registerVitalmedizinStep() {
  registerStep({
    id: "vitalmedizin",
    // Erwachsenen-Modul: bei Säuglings-Anamnese (Eltern-Fragebogen) ausgeblendet.
    isVisible: (answers) => answers["PT-001"] !== "saeugling",
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
