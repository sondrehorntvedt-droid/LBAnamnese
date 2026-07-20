import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { VORGESCHICHTE_FRAGEN } from "../../data/A02_vorgeschichte_pmh.js";
import { state } from "../state.js";
import { aktuelleTiefe, tierMind } from "../tiers.js";

// Diese Felder sind für einen fokussierten Erstkontakt nicht kritisch und
// erscheinen erst ab Standard: Sonstiges/Freitext, Impfstatus, Familienanamnese,
// Lifestyle (Rauchen/Alkohol/Substanzen), Dokumenten-Hinweis.
// BEWUSST IMMER sichtbar (Sicherheit/Behandlung): Diagnosen (PMH-001), OPs
// (PMH-003), Unfälle/Frakturen (PMH-005), Medikamente (PMH-007), Blutverdünner
// (PMH-009), Kortison (PMH-010), Bindegewebe/Hypermobilität (PMH-010b),
// Allergien (PMH-011), Schwangerschaft (PMH-018).
const AB_STANDARD = new Set([
  "PMH-002", "PMH-013", "PMH-014", "PMH-014b", "PMH-015", "PMH-016", "PMH-017", "PMH-019",
]);

export function registerVorgeschichteStep() {
  registerStep({
    id: "vorgeschichte",
    // Erwachsenen-Modul: bei Säuglings-Anamnese (Eltern-Fragebogen) ausgeblendet.
    isVisible: (answers) => !["saeugling", "kind"].includes(answers["PT-001"]),
    eyebrow: "Schritt 3 · Krankengeschichte",
    title: "Ihre medizinische Vorgeschichte",
    subtitle: "Vorerkrankungen, Operationen, Medikamente, Allergien, Familie.",
    render(container) {
      const felder = tierMind(aktuelleTiefe(state), "ganzheitlich")
        ? VORGESCHICHTE_FRAGEN
        : VORGESCHICHTE_FRAGEN.filter((f) => !AB_STANDARD.has(f.id));
      return renderFragenListe(container, felder);
    },
  });
}
