import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { BEGLEITSYMPTOME_INTRO, BEGLEITSYMPTOME_FRAGEN } from "../../data/A01c_begleitsymptome.js";

export function registerBegleitsymptomeStep() {
  registerStep({
    id: "begleitsymptome",
    // Erwachsenen-Modul: bei Säuglings-Anamnese (Eltern-Fragebogen) ausgeblendet.
    isVisible: (answers) => answers["PT-001"] !== "saeugling",
    group: "Begleitsymptome",
    eyebrow: "Begleitsymptome",
    title: BEGLEITSYMPTOME_INTRO.titel,
    subtitle: BEGLEITSYMPTOME_INTRO.beschreibung,
    estMinutes: 2,
    render(container) {
      return renderFragenListe(container, BEGLEITSYMPTOME_FRAGEN);
    },
  });
}
