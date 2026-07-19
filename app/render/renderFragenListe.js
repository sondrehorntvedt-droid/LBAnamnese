/**
 * LINDEBERGS OS — Wiederverwendbarer Renderer für Fragen-Arrays
 * (Gemeinsames Muster für A00–A03: Liste von Fragen-Objekten, teils mit
 * `condition` für bedingte Sichtbarkeit, teils mit `follow_up`.)
 *
 * Rendert alle Fragen sofort (auch bedingt versteckte), toggelt aber nur
 * die CSS-Sichtbarkeit bei Zustandsänderungen — vermeidet einen kompletten
 * Re-Render, der z.B. den Fokus in Texteingaben zerstören würde.
 *
 * Gibt eine Cleanup-Funktion zurück (state-Subscription abmelden), die der
 * Aufrufer (main.js) beim Verlassen des Schritts ausführen sollte.
 */

import { renderQuestion } from "./renderQuestion.js";
import { evaluateCondition } from "../conditions.js";
import { istFeldAbgedeckt } from "../upload-prefill.js";
import { state } from "../state.js";

function makeUploadBadge() {
  const badge = document.createElement("div");
  badge.className = "badge";
  badge.style.marginBottom = "8px";
  badge.textContent = "📎 Durch Ihren hochgeladenen Befund abgedeckt — nur bei Bedarf ergänzen";
  return badge;
}

export function renderFragenListe(container, fragenListe) {
  const getValue = (id) => state.get(id);
  const setValue = (id, val) => state.set(id, val);

  const entries = fragenListe.map((frage) => {
    const wrap = document.createElement("div");
    const badge = makeUploadBadge();
    wrap.appendChild(badge);
    wrap.appendChild(renderQuestion(frage, { getValue, setValue }));
    if (frage.follow_up) {
      const followWrap = document.createElement("div");
      followWrap.style.marginTop = "8px";
      followWrap.appendChild(renderQuestion(frage.follow_up, { getValue, setValue }));
      wrap.appendChild(followWrap);
    }
    container.appendChild(wrap);
    return { frage, wrap, badge };
  });

  function update() {
    entries.forEach(({ frage, wrap, badge }) => {
      const visible = !frage.condition || evaluateCondition(frage.condition, state.answers);
      wrap.style.display = visible ? "" : "none";
      badge.style.display = istFeldAbgedeckt(frage.id) ? "" : "none";
    });
  }
  update();

  return state.subscribe(update);
}
