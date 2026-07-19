/**
 * Schritt "Für wen ist diese Anamnese?" — direkt nach der Tiefe-Wahl.
 *
 * Eltern können hier auf die Säuglings-Fremdanamnese umschalten (PT-001).
 * Bei "saeugling" blenden sich alle Erwachsenen-Module aus (isVisible in den
 * jeweiligen Schritten) und der Eltern-Fragebogen (step-saeugling) erscheint.
 */
import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { PATIENT_TYP_INTRO, PATIENT_TYP_FRAGEN } from "../../data/A16_saeugling_eltern.js";

export function registerPatientTypStep() {
  registerStep({
    id: "patient-typ",
    group: "Für wen?",
    eyebrow: "Ihre Anamnese",
    title: PATIENT_TYP_INTRO.titel,
    subtitle: PATIENT_TYP_INTRO.beschreibung,
    estMinutes: 1,
    render(container) {
      return renderFragenListe(container, PATIENT_TYP_FRAGEN);
    },
  });
}
