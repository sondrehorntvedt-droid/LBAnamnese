/**
 * LINDEBERGS OS — Anamnese-Tiefe (eigener früher Schritt)
 *
 * Bewusst getrennt von den Zielen und weit vorne: der Patient entscheidet
 * zuerst, wie tief er gehen möchte. Mit klarer Erklärung des Nutzens —
 * Zeitinvestition hier entlastet die erste Sitzung enorm.
 */
import { registerStep } from "../router.js";
import { ANAMNESE_TIEFE_OPTIONEN } from "../../data/A00b_ziele.js";
import { getTiefe, setTiefe } from "../ziele-store.js";
import { state } from "../state.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function registerTiefeStep() {
  registerStep({
    id: "tiefe",
    group: "Umfang wählen",
    eyebrow: "Bevor wir beginnen",
    title: "Wie tief möchten Sie gehen?",
    subtitle:
      "Sie bestimmen den Umfang. Je mehr Sie uns vorab anvertrauen, desto mehr Zeit sparen Sie in Ihrer ersten Sitzung.",
    estMinutes: 1,
    render(container) {
      // Nutzen-Erklärung
      const nutzen = el("div", "card card--sunken");
      nutzen.appendChild(el("div", "section-label", "Warum sich Gründlichkeit lohnt"));
      const p = el("p", "field-hint");
      p.style.marginTop = "8px";
      p.textContent =
        "Wenn Sie sich hier ein paar Minuten mehr Zeit nehmen, muss Ihr Therapeut in der ersten Sitzung nicht das Anamnesegespräch führen — er kann sich sofort auf Diagnostik und Behandlung konzentrieren. Das macht Ihren ersten Termin deutlich wertvoller.";
      nutzen.appendChild(p);
      container.appendChild(nutzen);

      const stack = el("div", "choice-grid");
      stack.style.marginTop = "20px";

      function sync() {
        Array.from(stack.children).forEach((tile) => {
          tile.classList.toggle("choice-tile--selected", tile.dataset.value === getTiefe());
        });
      }

      ANAMNESE_TIEFE_OPTIONEN.forEach((opt) => {
        const tile = el("button", "choice-tile");
        tile.type = "button";
        tile.dataset.value = opt.value;
        tile.style.alignItems = "flex-start";
        const textWrap = el("div");
        textWrap.style.flex = "1";
        const titleRow = el("div");
        titleRow.style.display = "flex";
        titleRow.style.justifyContent = "space-between";
        titleRow.style.gap = "8px";
        const t = el("strong", null, opt.label + (opt.empfohlen ? "  ★ empfohlen" : ""));
        titleRow.appendChild(t);
        titleRow.appendChild(el("span", "field-hint", opt.dauer));
        textWrap.appendChild(titleRow);
        textWrap.appendChild(el("p", "field-hint", opt.beschreibung));
        tile.appendChild(textWrap);
        tile.addEventListener("click", () => {
          setTiefe(opt.value);
          sync();
        });
        stack.appendChild(tile);
      });
      sync();
      container.appendChild(stack);

      return state.subscribe(() => {});
    },
  });
}
