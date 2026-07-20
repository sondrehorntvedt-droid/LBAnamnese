/**
 * Kinder-Anamnese 2–11 Jahre (Eltern-Fremdanamnese, gern gemeinsam mit dem
 * Kind) — sichtbar nur bei PT-001 = "kind". Rendert die Abschnitte aus A23
 * und meldet die Kinder-Red-Flags an den globalen Wächter.
 *
 * VORLÄUFIGE FASSUNG — wird mit dem Lindebergs-Kinderosteopathie-Team
 * (OST-PÄD OAM, Advisory Board) fachlich verfeinert.
 */
import { registerStep, goToStepId } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { registerRedFlagSource } from "../redflags.js";
import { state } from "../state.js";
import { KIND_INTRO, KIND_ABSCHNITTE, KIND_RED_FLAGS } from "../../data/A23_kind_eltern.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function registerKindStep() {
  // Red-Flag-Quelle: nur aktiv, wenn die Kinder-Anamnese gewählt ist.
  registerRedFlagSource((answers) => {
    if (answers["PT-001"] !== "kind") return [];
    return KIND_RED_FLAGS.filter((rf) => answers[rf.id] === true).map((rf) => ({
      flag_id: rf.id,
      display_message: `⚠️ ${rf.hinweis}`,
      therapist_alert: rf.hinweis,
      stop_anamnesis: true,
    }));
  });

  registerStep({
    id: "kind",
    group: "Ihr Kind",
    eyebrow: "Eltern-Fragebogen (2–11 Jahre)",
    title: KIND_INTRO.titel,
    subtitle: KIND_INTRO.beschreibung,
    estMinutes: 8,
    isVisible: (answers) => answers["PT-001"] === "kind",
    render(container) {
      // Ein-Klick-Umschaltung zurück zur Für-wen-Auswahl (kein mühsames
      // Zurück-Navigieren — analog Säuglings-Fragebogen).
      const switcher = el("div", "card card--sunken");
      switcher.style.display = "flex";
      switcher.style.flexWrap = "wrap";
      switcher.style.alignItems = "center";
      switcher.style.justifyContent = "space-between";
      switcher.style.gap = "12px";
      switcher.style.marginBottom = "16px";
      switcher.appendChild(el("span", "field-label", "Fragebogen für: Kind (2–11 Jahre)"));
      const switchBtn = el("button", "btn btn--ghost", "↺ Auswahl ändern (Für wen?)");
      switchBtn.type = "button";
      switchBtn.addEventListener("click", () => goToStepId("patient-typ"));
      switcher.appendChild(switchBtn);
      container.appendChild(switcher);

      const badge = el("span", "badge badge--provisional", "Vorläufige Fassung — wird mit dem Kinderosteopathie-Team verfeinert");
      container.appendChild(badge);

      const cleanups = [];
      KIND_ABSCHNITTE.forEach((abschnitt) => {
        const label = el("div", "section-label", abschnitt.titel);
        label.style.marginTop = "28px";
        container.appendChild(label);
        const wrap = el("div", "section-stack");
        container.appendChild(wrap);
        const cleanup = renderFragenListe(wrap, abschnitt.fragen);
        if (cleanup) cleanups.push(cleanup);
      });
      return () => cleanups.forEach((fn) => fn());
    },
  });
}
