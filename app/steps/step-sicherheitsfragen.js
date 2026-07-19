/**
 * Sicherheitsfragen — universelles Red-Flag-Screening (RF001–RF008).
 * Wird direkt nach der Hauptbeschwerde gestellt. Die eigentliche Auswertung
 * und der Notfall-Hinweis laufen unabhängig davon in app/redflags.js.
 */
import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { ABSOLUTE_RED_FLAGS } from "../../data/cdss/00_red_flags.js";

const SICHERHEITSFRAGEN = ABSOLUTE_RED_FLAGS.flatMap((rf) => rf.questions);

export function registerSicherheitsfragenStep() {
  registerStep({
    id: "sicherheitsfragen",
    // Erwachsenen-Modul: bei Säuglings-Anamnese (Eltern-Fragebogen) ausgeblendet.
    isVisible: (answers) => answers["PT-001"] !== "saeugling",
    eyebrow: "Sicherheitsfragen",
    title: "Nur ein paar wichtige Kontrollfragen",
    subtitle:
      "Diese Fragen helfen uns, ernste Warnzeichen frühzeitig zu erkennen. Bitte beantworten Sie ehrlich — für Ihre eigene Sicherheit.",
    render(container) {
      return renderFragenListe(container, SICHERHEITSFRAGEN);
    },
  });
}
