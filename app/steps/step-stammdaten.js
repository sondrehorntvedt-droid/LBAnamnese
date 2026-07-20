import { registerStep } from "../router.js";
import { renderFragenListe } from "../render/renderFragenListe.js";
import { STAMMDATEN_FELDER, computeBMI, getBMIKategorie } from "../../data/A00_stammdaten.js";
import { state } from "../state.js";

export function registerStammdatenStep() {
  registerStep({
    id: "stammdaten",
    group: "Ihre Daten",
    eyebrow: "Zuerst das Formale",
    title: "Ihre persönlichen Angaben",
    subtitle: "Bevor wir starten — ein paar Grunddaten und Ihre Einwilligung. Dauert etwa 3 Minuten.",
    estMinutes: 3,
    render(container) {
      const cleanup = renderFragenListe(container, STAMMDATEN_FELDER);

      const bmiCard = document.createElement("div");
      bmiCard.className = "card card--sunken";
      container.appendChild(bmiCard);

      function updateBmi() {
        const bmi = computeBMI(state.get("SD-007"), state.get("SD-008"));
        const kat = getBMIKategorie(bmi);
        bmiCard.innerHTML = "";
        const label = document.createElement("div");
        label.className = "section-label";
        label.textContent = "Ihr BMI — wird automatisch berechnet";
        const value = document.createElement("p");
        value.className = "tagline";
        value.style.margin = "8px 0 0";
        // Keine erneute Eingabe: rechnet live aus Gewicht (SD-007) und
        // Größe (SD-008) weiter oben — der Text darf nicht wie eine
        // zusätzliche Frage klingen.
        value.textContent = bmi
          ? `${bmi} — ${kat.kat}`
          : "… erscheint hier, sobald Gewicht und Größe oben ausgefüllt sind.";
        bmiCard.appendChild(label);
        bmiCard.appendChild(value);
      }
      updateBmi();
      const unsubBmi = state.subscribe(updateBmi);

      return () => {
        cleanup();
        unsubBmi();
      };
    },
  });
}
