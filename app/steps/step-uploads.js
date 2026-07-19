/**
 * LINDEBERGS OS — Pre-Flight Upload-Schritt
 * Ganz am Anfang: Befunde hochladen. Pro hochgeladenem Dokument können die
 * wichtigsten/auffälligen Werte erfasst werden — die dann in der
 * Zusammenfassung erscheinen. (Automatisches KI-Auslesen = Backend-Phase; die
 * Notiz-Felder sind so angelegt, dass die KI sie später selbst befüllt.)
 */
import { registerStep } from "../router.js";
import { renderQuestion } from "../render/renderQuestion.js";
import { UPLOAD_INTRO, UPLOAD_KATEGORIEN } from "../../data/A00c_uploads.js";
import { state } from "../state.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

const setter = { getValue: (id) => state.get(id), setValue: (id, v) => state.set(id, v) };

function hatDateien(katId) {
  const v = state.get(katId);
  return Array.isArray(v) && v.length > 0;
}

function computeSignature() {
  return UPLOAD_KATEGORIEN.map((k) => `${k.id}=${(state.get(k.id) || []).length}`).join("|");
}

export function registerUploadStep() {
  registerStep({
    id: "uploads",
    group: "Ihre Befunde",
    eyebrow: "Bevor wir beginnen",
    title: UPLOAD_INTRO.titel,
    subtitle: UPLOAD_INTRO.beschreibung,
    estMinutes: 3,
    render(container) {
      let lastSig = null;

      function draw() {
        const sig = computeSignature();
        if (sig === lastSig) return;
        lastSig = sig;
        container.innerHTML = "";

        const info = el("div", "alert-banner alert-banner--warning");
        info.appendChild(
          el(
            "p",
            null,
            "Laden Sie Ihre Befunde hoch und tragen Sie die wichtigsten/auffälligen Werte ein — diese erscheinen dann in Ihrer Zusammenfassung. In der fertigen Version liest unsere KI die Dokumente automatisch aus und füllt das für Sie vor."
          )
        );
        container.appendChild(info);

        const stack = el("div", "field-stack");
        stack.style.marginTop = "20px";
        UPLOAD_KATEGORIEN.forEach((kat) => {
          const card = el("div", "card card--sunken");
          card.appendChild(el("div", "section-label", `${kat.icon} ${kat.label}`));
          card.appendChild(
            renderQuestion(
              {
                id: kat.id,
                type: "file_upload",
                hint: kat.hint,
                accepted_types: ["application/pdf", "image/jpeg", "image/png", "image/heic"],
                max_files: 10,
              },
              setter
            )
          );

          // Erst wenn Dateien vorliegen: Feld für die wichtigsten Erkenntnisse.
          if (hatDateien(kat.id)) {
            const notiz = renderQuestion(
              {
                id: `${kat.id}-notiz`,
                frage: "Wichtigste Werte / Auffälligkeiten aus diesem Befund (optional)",
                type: "textarea",
                placeholder: "z.B. Vitamin D 18 ng/ml (niedrig), Ferritin 12 (niedrig), TSH 4,8 (erhöht)…",
              },
              setter
            );
            notiz.style.marginTop = "10px";
            card.appendChild(notiz);
          }

          stack.appendChild(card);
        });
        container.appendChild(stack);

        const skip = el("p", "field-hint", "Keine Befunde zur Hand? Kein Problem — Sie können diesen Schritt einfach überspringen.");
        skip.style.marginTop = "16px";
        container.appendChild(skip);
      }

      draw();
      return state.subscribe(draw);
    },
  });
}
