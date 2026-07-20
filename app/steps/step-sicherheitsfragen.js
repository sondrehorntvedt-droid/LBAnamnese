/**
 * Sicherheitsfragen — universelles Red-Flag-Screening (RF001–RF008).
 * Wird direkt nach der Hauptbeschwerde gestellt. Die eigentliche Auswertung
 * und der Notfall-Hinweis laufen unabhängig davon in app/redflags.js.
 */
import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { ABSOLUTE_RED_FLAGS } from "../../data/cdss/00_red_flags.js";
import { state } from "../state.js";
import { aktuelleTiefe, variantForTier } from "../tiers.js";

/**
 * Tier-gestaffeltes Red-Flag-Screening.
 *
 * SICHERHEIT ZUERST: Sofort-Notfälle (stop_anamnesis:true → Cauda, vertebrale
 * Infektion, AAA, TVT, Myelopathie) werden in JEDER Stufe VOLLSTÄNDIG gezeigt,
 * damit die Notfall-Regeln immer feuern können. Für die übrigen Flags
 * (Malignität, Fraktur, entzündliche Arthritis) greift die vom Original
 * hinterlegte Klassifizierung `variants` (short/standard/deep): die akuten
 * Leitfragen sind „short" (immer sichtbar), die weichen Risiko-Modifikatoren
 * erscheinen erst ab Standard. So bleibt „Fokus" schlank ohne Sicherheitsverlust.
 */
function sichtbareSicherheitsfragen(tiefe) {
  const variant = variantForTier(tiefe);
  const felder = [];
  ABSOLUTE_RED_FLAGS.forEach((rf) => {
    const sofortNotfall = rf.rule?.event?.params?.stop_anamnesis === true;
    (rf.questions || []).forEach((q) => {
      if (sofortNotfall || !q.variants || q.variants.includes(variant)) felder.push(q);
    });
  });
  return felder;
}

export function registerSicherheitsfragenStep() {
  registerStep({
    id: "sicherheitsfragen",
    // Erwachsenen-Modul: bei Säuglings-Anamnese (Eltern-Fragebogen) ausgeblendet.
    isVisible: (answers) => !["saeugling", "kind"].includes(answers["PT-001"]),
    eyebrow: "Sicherheitsfragen",
    title: "Nur ein paar wichtige Kontrollfragen",
    subtitle:
      "Diese Fragen helfen uns, ernste Warnzeichen frühzeitig zu erkennen. Bitte beantworten Sie ehrlich — für Ihre eigene Sicherheit.",
    render(container) {
      return renderFragenListe(container, sichtbareSicherheitsfragen(aktuelleTiefe(state)));
    },
  });
}
