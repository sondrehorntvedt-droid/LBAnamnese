/**
 * Willkommens-Schritt. Erkennt wiederkehrende Patienten (bestehende Akte)
 * und begrüßt sie persönlich — die Anamnese ist eine lebende Akte, die bei
 * jedem Besuch fortgeschrieben wird.
 */
import { registerStep } from "../router.js";
import { hatFruehereAkte, getStammdaten, ladeAkte } from "../patient-record.js";

export function registerWelcomeStep() {
  registerStep({
    id: "welcome",
    group: "Willkommen",
    eyebrow: "Lindebergs OS",
    title: "Willkommen bei Ihrer Anamnese",
    subtitle:
      "In den nächsten Schritten lernen wir Sie kennen — so können wir Ihnen in der ersten Sitzung schneller und gezielter helfen.",
    estMinutes: 1,
    render(container) {
      const wiederkehrer = hatFruehereAkte();
      if (wiederkehrer) {
        const stamm = getStammdaten();
        const akte = ladeAkte();
        const vorname = stamm["SD-001"] || "";
        const card = document.createElement("div");
        card.className = "card";
        const h = document.createElement("p");
        h.className = "tagline";
        h.textContent = vorname ? `Willkommen zurück, ${vorname}.` : "Willkommen zurück.";
        card.appendChild(h);
        const p = document.createElement("p");
        p.className = "field-hint";
        p.style.marginTop = "8px";
        p.textContent = `Schön, dass Sie wieder da sind. Ihre Gesundheitsakte umfasst bereits ${akte.sitzungen.length} frühere Anamnese${
          akte.sitzungen.length > 1 ? "n" : ""
        }. Erzählen Sie uns, was Sie diesmal zu uns führt — wir ergänzen es in Ihrer Akte.`;
        card.appendChild(p);
        container.appendChild(card);
      } else {
        const p = document.createElement("p");
        p.className = "tagline";
        p.textContent = "Where science meets soul.";
        container.appendChild(p);
      }
    },
  });
}
