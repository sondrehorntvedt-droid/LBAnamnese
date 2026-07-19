/**
 * LINDEBERGS OS — Ziele (valides PROM)
 *
 * Drei getrennte, wissenschaftlich verankerte Schichten, damit
 * Therapieergebnisse später forschbar sind:
 *   1. PSFS — konkrete Funktionsziele (Aktivität + Baseline + Zielwert)
 *   2. NRS  — Schmerz (0–10), bewusst getrennt von Funktion & Lebensqualität
 *   3. WHO-5 — emotionales Wohlbefinden / Lebensqualität
 */
import { registerStep } from "../router.js";
import { renderQuestion } from "../render/renderQuestion.js";
import {
  ZIELE_INTRO,
  LEBENSBEREICH_OPTIONEN,
  ZEITRAHMEN_OPTIONEN,
  PSFS_ANKER,
  NRS_ANKER,
  WHO5_INTRO,
  WHO5_SKALA,
  WHO5_ITEMS,
  MAX_ZIELE,
} from "../../data/A00b_ziele.js";
import { getZiele, addZiel, updateZiel, removeZiel, ensureFirstZiel } from "../ziele-store.js";
import { state } from "../state.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function renderZielCard(z, index) {
  const card = el("div", "card");
  card.style.marginBottom = "16px";
  card.dataset.zielId = z.id;

  const headerRow = el("div");
  headerRow.style.display = "flex";
  headerRow.style.justifyContent = "space-between";
  headerRow.appendChild(el("div", "section-label", `Ziel ${index + 1}`));
  if (index > 0) {
    const rm = el("button", "btn btn--ghost", "Entfernen");
    rm.type = "button";
    rm.addEventListener("click", () => removeZiel(z.id));
    headerRow.appendChild(rm);
  }
  card.appendChild(headerRow);

  const stack = el("div", "field-stack");
  stack.style.marginTop = "12px";

  // Aktivität (PSFS, patientengeneriert)
  stack.appendChild(
    renderQuestion(
      {
        id: "aktivitaet",
        frage: "Welche konkrete Tätigkeit möchten Sie (wieder) können?",
        type: "textarea",
        placeholder: "z.B. Die 25 Treppenstufen bis in mein Schlafzimmer steigen — oder mit meinen Enkeln Fußball spielen",
        hint: "Je konkreter, desto besser können wir Ihren Fortschritt messen.",
      },
      { getValue: () => z.aktivitaet, setValue: (_, v) => updateZiel(z.id, { aktivitaet: v }) }
    )
  );

  // Baseline (PSFS 0–10)
  stack.appendChild(
    renderQuestion(
      { id: "baseline", frage: PSFS_ANKER.frage, type: "vas_scale", min: PSFS_ANKER.min, max: PSFS_ANKER.max, labels: PSFS_ANKER.labels },
      { getValue: () => z.baseline, setValue: (_, v) => updateZiel(z.id, { baseline: v }) }
    )
  );

  // Zielwert (target)
  stack.appendChild(
    renderQuestion(
      {
        id: "target",
        frage: "Welches Niveau möchten Sie erreichen?",
        type: "vas_scale",
        min: 0,
        max: 10,
        labels: { 0: "Wie jetzt", 10: "Uneingeschränkt" },
      },
      { getValue: () => z.target, setValue: (_, v) => updateZiel(z.id, { target: v }) }
    )
  );

  // Lebensbereich
  stack.appendChild(
    renderQuestion(
      { id: "lebensbereich", frage: "Welcher Lebensbereich?", type: "single_choice", options: LEBENSBEREICH_OPTIONEN.map((o) => ({ value: o.value, label: `${o.icon} ${o.label}` })) },
      { getValue: () => z.lebensbereich, setValue: (_, v) => updateZiel(z.id, { lebensbereich: v }) }
    )
  );

  // Zeitrahmen (+ Datumsfeld bei „bis zu einem Datum")
  stack.appendChild(
    renderQuestion(
      { id: "zeitrahmen", frage: "In welchem Zeitrahmen?", type: "single_choice", options: ZEITRAHMEN_OPTIONEN },
      { getValue: () => z.zeitrahmen, setValue: (_, v) => updateZiel(z.id, { zeitrahmen: v }) }
    )
  );
  if (z.zeitrahmen === "zu_termin") {
    stack.appendChild(
      renderQuestion(
        { id: "zieldatum", frage: "Bis zu welchem Datum?", type: "date", hint: "z.B. ein Urlaub, ein Wettkampf, ein wichtiges Ereignis" },
        { getValue: () => z.zieldatum, setValue: (_, v) => updateZiel(z.id, { zieldatum: v }) }
      )
    );
  }

  // Warum (qualitativ)
  stack.appendChild(
    renderQuestion(
      { id: "warum", frage: "Warum ist Ihnen das wichtig? (optional)", type: "textarea", placeholder: "Was würde sich für Sie im Leben ändern?" },
      { getValue: () => z.warum, setValue: (_, v) => updateZiel(z.id, { warum: v }) }
    )
  );

  card.appendChild(stack);
  return card;
}

export function registerZieleStep() {
  registerStep({
    id: "ziele",
    // Erwachsenen-Modul: bei Säuglings-Anamnese (Eltern-Fragebogen) ausgeblendet.
    isVisible: (answers) => answers["PT-001"] !== "saeugling",
    group: "Ihre Ziele",
    eyebrow: "Ihre Ziele",
    title: ZIELE_INTRO.titel,
    subtitle:
      "Wir behandeln nicht nur Symptome, sondern das, was Sie wieder erreichen möchten — und messen Ihren Fortschritt wissenschaftlich fundiert.",
    estMinutes: 4,
    render(container) {
      ensureFirstZiel();
      let lastSig = null;

      function redraw() {
        const ziele = getZiele();
        const sig = ziele.map((z) => `${z.id}:${z.zeitrahmen}`).join("|");
        if (sig === lastSig) return;
        lastSig = sig;

        container.innerHTML = "";

        // Schicht 1 — Funktionsziele (PSFS)
        container.appendChild(el("div", "section-label", "Ihre Funktionsziele"));
        const zieleWrap = el("div");
        zieleWrap.style.marginTop = "12px";
        ziele.forEach((z, i) => zieleWrap.appendChild(renderZielCard(z, i)));
        container.appendChild(zieleWrap);
        if (ziele.length < MAX_ZIELE) {
          const add = el("button", "btn btn--ghost", "+ Weiteres Ziel hinzufügen");
          add.type = "button";
          add.addEventListener("click", () => addZiel());
          container.appendChild(add);
        }

        // Schicht 2 — Schmerz (NRS), getrennt
        container.appendChild(el("div", "section-label", "Schmerz heute"));
        const nrsWrap = el("div", "field-stack");
        nrsWrap.style.marginTop = "12px";
        nrsWrap.style.marginBottom = "20px";
        nrsWrap.appendChild(
          renderQuestion(
            { id: "NRS-avg", frage: "Wie stark waren Ihre Schmerzen im Durchschnitt der letzten 7 Tage?", type: "vas_scale", min: NRS_ANKER.min, max: NRS_ANKER.max, labels: NRS_ANKER.labels },
            { getValue: (id) => state.get(id), setValue: (id, v) => state.set(id, v) }
          )
        );
        container.appendChild(nrsWrap);

        // Schicht 3 — Wohlbefinden (WHO-5)
        container.appendChild(el("div", "section-label", "Ihr Wohlbefinden (WHO-5)"));
        container.appendChild(el("p", "field-hint", WHO5_INTRO));
        const whoWrap = el("div", "field-stack");
        whoWrap.style.marginTop = "12px";
        const skalaOptions = Object.entries(WHO5_SKALA).map(([v, label]) => ({ value: Number(v), label }));
        WHO5_ITEMS.forEach((item) => {
          whoWrap.appendChild(
            renderQuestion(
              { id: item.id, frage: item.text, type: "single_choice", options: skalaOptions },
              { getValue: (id) => state.get(id), setValue: (id, v) => state.set(id, v) }
            )
          );
        });
        container.appendChild(whoWrap);
      }

      redraw();
      return state.subscribe(redraw);
    },
  });
}
