import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { VORGESCHICHTE_FRAGEN } from "../../data/A02_vorgeschichte_pmh.js";

export function registerVorgeschichteStep() {
  registerStep({
    id: "vorgeschichte",
    eyebrow: "Schritt 3 · Krankengeschichte",
    title: "Ihre medizinische Vorgeschichte",
    subtitle: "Vorerkrankungen, Operationen, Medikamente, Allergien, Familie.",
    render(container) {
      return renderFragenListe(container, VORGESCHICHTE_FRAGEN);
    },
  });
}
