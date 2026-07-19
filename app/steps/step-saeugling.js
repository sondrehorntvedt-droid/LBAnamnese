/**
 * Säuglings-Anamnese (Eltern-Fremdanamnese) — sichtbar nur bei
 * PT-001 = "saeugling". Rendert die Abschnitte aus A16 und meldet die
 * Säuglings-Red-Flags an den globalen Wächter.
 *
 * VORLÄUFIGE FASSUNG — wird mit dem Lindebergs-Kinderosteopathie-Team
 * (OST-PÄD OAM, Advisory Board) fachlich verfeinert.
 */
import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { registerRedFlagSource } from "../redflags.js";
import {
  SAEUGLING_INTRO,
  SAEUGLING_ABSCHNITTE,
  SAEUGLING_RED_FLAGS,
} from "../../data/A16_saeugling_eltern.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function registerSaeuglingStep() {
  // Red-Flag-Quelle: nur aktiv, wenn die Säuglings-Anamnese gewählt ist.
  registerRedFlagSource((answers) => {
    if (answers["PT-001"] !== "saeugling") return [];
    return SAEUGLING_RED_FLAGS.filter((rf) => answers[rf.id] === true).map((rf) => ({
      flag_id: rf.id,
      display_message: `⚠️ ${rf.hinweis}`,
      therapist_alert: rf.hinweis,
      stop_anamnesis: true,
    }));
  });

  registerStep({
    id: "saeugling",
    group: "Ihr Kind",
    eyebrow: "Eltern-Fragebogen",
    title: SAEUGLING_INTRO.titel,
    subtitle: SAEUGLING_INTRO.beschreibung,
    estMinutes: 9,
    isVisible: (answers) => answers["PT-001"] === "saeugling",
    render(container) {
      const badge = el("span", "badge badge--provisional", "Vorläufige Fassung — wird mit dem Kinderosteopathie-Team verfeinert");
      container.appendChild(badge);

      const cleanups = [];
      SAEUGLING_ABSCHNITTE.forEach((abschnitt) => {
        const label = el("div", "section-label", abschnitt.titel);
        label.style.marginTop = "28px";
        container.appendChild(label);
        if (abschnitt.beschreibung) {
          container.appendChild(el("p", "field-hint", abschnitt.beschreibung));
        }
        const wrap = el("div", "section-stack");
        container.appendChild(wrap);
        const cleanup = renderFragenListe(wrap, abschnitt.fragen);
        if (cleanup) cleanups.push(cleanup);
      });
      return () => cleanups.forEach((fn) => fn());
    },
  });
}
