import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { PSYCHOSOZIAL_INTRO, PSYCHOSOZIAL_FRAGEN } from "../../data/A05_psychosozial_mental.js";

export function registerPsychosozialStep() {
  registerStep({
    id: "psychosozial",
    group: "Wohlbefinden",
    eyebrow: "Wohlbefinden",
    title: PSYCHOSOZIAL_INTRO.titel,
    subtitle: PSYCHOSOZIAL_INTRO.beschreibung,
    estMinutes: 5,
    tiers: ["ganzheitlich", "tiefenanalyse"],
    render(container) {
      return renderFragenListe(container, PSYCHOSOZIAL_FRAGEN);
    },
  });
}
