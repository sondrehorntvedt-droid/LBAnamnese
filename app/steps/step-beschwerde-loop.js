/**
 * LINDEBERGS OS — Beschwerde-Loop
 *
 * Kernstück der Anamnese (nach Master-Dokument): für jede Beschwerde eine
 * eigene "Beschwerde-Akte" — Regionswahl, W-Fragen, CDSS-Deep-Dive und
 * Therapie-Historie werden für JEDE Beschwerde separat durchlaufen, damit
 * sich z.B. Knie- und Kopfschmerz-Antworten nicht vermischen. Am Ende jeder
 * Akte fragt das System "Weitere Beschwerde?" — bei Ja startet eine neue
 * Akte, bei Nein geht es weiter zu den Sicherheitsfragen.
 */
import { registerStep } from "../router.js";
import { renderQuestion } from "../render/renderQuestion.js";
import { renderBodyMap } from "../render/bodymap.js";
import { HAUPTBESCHWERDE_FRAGEN, getWOptionen } from "../../data/A01_hauptbeschwerde.js";
import { THERAPIE_HISTORIE_MODALITAETEN, THERAPIE_ERFOLG_OPTIONEN, THERAPIE_HAEUFIGKEIT_OPTIONEN, THERAPIE_FREITEXT, INTERVENTION_FRAGEN } from "../../data/A01b_therapie_historie.js";
import { computeRegionPfadForBeschwerde, getRegionKeysForHB002Value, isSystemicKey } from "../cdss-engine.js";
import {
  getBeschwerden,
  addBeschwerde,
  setBeschwerdeRegion,
  removeBeschwerde,
  ensureFirstBeschwerde,
  namespacedAccessors,
} from "../beschwerde-store.js";
import { state } from "../state.js";

const REGION_OPTIONS = HAUPTBESCHWERDE_FRAGEN.find((f) => f.id === "HB-002").regions;
const REGION_LABEL_BY_VALUE = Object.fromEntries(REGION_OPTIONS.map((r) => [r.value, r.label]));

// Beschwerde-IDs, deren Regionswahl gerade (erneut) geöffnet ist — rein
// UI-lokaler Zustand, kein persistierter Antwortwert.
const editingRegion = new Set();

const W_FRAGEN_IDS = ["HB-001", "HB-003", "HB-004", "HB-005", "HB-006", "HB-007", "HB-008", "HB-009", "HB-010", "HB-011", "HB-012", "HB-013"];
const W_FRAGEN = HAUPTBESCHWERDE_FRAGEN.filter((f) => W_FRAGEN_IDS.includes(f.id));

const PRIORITAET_OPTIONEN = [
  { value: "p1", label: "Hauptfokus — das wichtigste Anliegen (P1)" },
  { value: "p2", label: "Wichtig (P2)" },
  { value: "p3", label: "Nebenproblem (P3)" },
  { value: "p4", label: "Nur ein Hinweis (P4)" },
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function computeSignature() {
  const beschwerden = getBeschwerden();
  return JSON.stringify(
    beschwerden.map((b) => {
      const editing = editingRegion.has(b.id);
      if (!b.region) return { id: b.id, region: null, editing };
      const regionKeys = getRegionKeysForHB002Value(b.region, state.answers["SD-004"]);
      const cdssIds = regionKeys.flatMap(
        (k) => computeRegionPfadForBeschwerde(b.id, k, state.answers).fragen.map((f) => f.id)
      );
      const gates = regionKeys
        .filter((k) => isSystemicKey(k))
        .map((k) => `${k}=${state.get(`${b.id}::${k}-GATE`) ?? ""}`);
      const intGate = state.get(`${b.id}::TH-INT-GATE`) ?? "";
      const thVals = THERAPIE_HISTORIE_MODALITAETEN.map((m) => state.get(`${b.id}::${m.id}`) ?? "").join(",");
      return { id: b.id, region: b.region, editing, cdssIds, gates, intGate, thVals };
    })
  );
}

function renderBeschwerdeCard(b, index, isOnly, onChangeRegion) {
  const card = el("div", "card");
  card.style.marginBottom = "20px";
  card.dataset.beschwerdeId = b.id;

  const headerRow = el("div");
  headerRow.style.display = "flex";
  headerRow.style.justifyContent = "space-between";
  headerRow.style.alignItems = "center";
  headerRow.appendChild(el("div", "section-label", `Beschwerde ${index + 1}`));
  if (!isOnly) {
    const removeBtn = el("button", "btn btn--ghost", "Entfernen");
    removeBtn.type = "button";
    removeBtn.addEventListener("click", () => removeBeschwerde(b.id));
    headerRow.appendChild(removeBtn);
  }
  card.appendChild(headerRow);

  const showPicker = !b.region || editingRegion.has(b.id);

  if (showPicker) {
    const regionQuestion = {
      id: "region",
      frage: "In welchem Bereich liegt diese Beschwerde?",
      type: "single_choice",
      options: REGION_OPTIONS,
    };
    card.appendChild(
      renderQuestion(regionQuestion, {
        getValue: () => b.region,
        setValue: (_, val) => {
          setBeschwerdeRegion(b.id, val);
          editingRegion.delete(b.id);
        },
      })
    );
  } else {
    const summary = el("div", "choice-tile choice-tile--selected");
    summary.style.cursor = "default";
    const label = el("span", null, REGION_LABEL_BY_VALUE[b.region] || b.region);
    const changeBtn = el("button", "btn btn--ghost", "Ändern");
    changeBtn.type = "button";
    changeBtn.style.marginLeft = "auto";
    changeBtn.addEventListener("click", () => {
      editingRegion.add(b.id);
      onChangeRegion();
    });
    summary.appendChild(label);
    summary.appendChild(changeBtn);
    card.appendChild(summary);
  }

  if (!b.region) return card;

  const { getValue, setValue } = namespacedAccessors(b.id);

  // Priorität dieser Beschwerde (Hauptfokus vs. Nebenproblem) — hilft dem
  // Therapeuten, bei mehreren Beschwerden sofort den Schwerpunkt zu sehen.
  card.appendChild(
    renderQuestion(
      {
        id: "prioritaet",
        frage: "Wie wichtig ist Ihnen diese Beschwerde?",
        type: "single_choice",
        options: PRIORITAET_OPTIONEN,
      },
      { getValue, setValue }
    )
  );

  card.appendChild(el("div", "section-label", "Wo genau? (optional einzeichnen)"));
  const bodyMapWrap = el("div");
  bodyMapWrap.style.marginTop = "8px";
  bodyMapWrap.style.marginBottom = "20px";
  renderBodyMap(bodyMapWrap, {
    getValue: () => getValue("bodymap"),
    setValue: (marks) => setValue("bodymap", marks),
  });
  card.appendChild(bodyMapWrap);

  const wStack = el("div", "field-stack");
  wStack.style.marginTop = "16px";
  W_FRAGEN.forEach((frage) => {
    // HB-011/HB-012: regionsspezifische Optionen (z.B. Schulter ohne „langes Sitzen").
    const regionOpts = getWOptionen(b.region, frage.id);
    const f = regionOpts ? { ...frage, options: regionOpts } : frage;
    wStack.appendChild(renderQuestion(f, { getValue, setValue }));
  });
  card.appendChild(wStack);

  const regionKeys = getRegionKeysForHB002Value(b.region, state.answers["SD-004"]);
  regionKeys.forEach((key) => {
    const { entry, fragen } = computeRegionPfadForBeschwerde(b.id, key, state.answers);
    if (!entry) return;
    card.appendChild(el("div", "section-label", entry.name));

    // Systemische Module: erst EINE Gate-Frage, Detailfragen nur bei Ja/Unsicher.
    // Vermeidet 10–15 irrelevante Fragen, wenn das System kein Thema ist.
    if (isSystemicKey(key)) {
      const gateId = `${key}-GATE`;
      card.appendChild(
        renderQuestion(
          {
            id: gateId,
            frage: `Ist „${entry.name}" ein Thema, zu dem wir genauer nachfragen sollen?`,
            type: "single_choice",
            options: [
              { value: "ja", label: "Ja" },
              { value: "nein", label: "Nein" },
              { value: "unsicher", label: "Unsicher — bitte genauer prüfen" },
            ],
          },
          { getValue, setValue }
        )
      );
      const gateVal = getValue(gateId);
      if (gateVal !== "ja" && gateVal !== "unsicher") return;
    }

    const stack = el("div", "field-stack");
    stack.style.marginTop = "12px";
    stack.style.marginBottom = "16px";
    fragen.forEach((frage) => stack.appendChild(renderQuestion(frage, { getValue, setValue })));
    card.appendChild(stack);
  });

  card.appendChild(el("div", "section-label", "Bisherige Behandlungsversuche für diese Beschwerde"));
  const thStack = el("div", "field-stack");
  thStack.style.marginTop = "12px";
  THERAPIE_HISTORIE_MODALITAETEN.forEach((mod) => {
    thStack.appendChild(
      renderQuestion(
        { id: mod.id, frage: mod.label, type: "single_choice", options: THERAPIE_ERFOLG_OPTIONEN },
        { getValue, setValue }
      )
    );
    // Häufigkeit/Dauer erscheint erst, wenn die Therapie überhaupt versucht wurde.
    if (getValue(mod.id)) {
      const hWrap = el("div");
      hWrap.style.margin = "-6px 0 4px 12px";
      hWrap.appendChild(
        renderQuestion(
          { id: `${mod.id}-haeufigkeit`, frage: "Wie oft / wie lange?", type: "single_choice", options: THERAPIE_HAEUFIGKEIT_OPTIONEN },
          { getValue, setValue }
        )
      );
      thStack.appendChild(hWrap);
    }
  });
  thStack.appendChild(renderQuestion(THERAPIE_FREITEXT, { getValue, setValue }));
  card.appendChild(thStack);

  // Interventionelle/orthopädische Maßnahmen — Gate, dann Detailtabelle.
  const intStack = el("div", "field-stack");
  intStack.style.marginTop = "12px";
  const intGate = INTERVENTION_FRAGEN[0];
  intStack.appendChild(renderQuestion({ id: intGate.id, frage: intGate.frage, type: intGate.type }, { getValue, setValue }));
  if (getValue("TH-INT-GATE") === true) {
    const intRep = INTERVENTION_FRAGEN[1];
    intStack.appendChild(
      renderQuestion(
        { id: intRep.id, frage: intRep.frage, type: "repeatable_entry", addLabel: intRep.addLabel, hint: intRep.hint, fields: intRep.fields },
        { getValue, setValue }
      )
    );
  }
  card.appendChild(intStack);

  return card;
}

export function registerBeschwerdeLoopStep() {
  registerStep({
    id: "beschwerde_loop",
    group: "Ihre Beschwerden",
    eyebrow: "Ihre Beschwerden",
    title: "Was führt Sie zu uns?",
    subtitle:
      "Viele Patienten haben mehrere Anliegen gleichzeitig — damit nichts vermischt wird, gehen wir sie nacheinander durch.",
    estMinutes: 12,
    render(container) {
      ensureFirstBeschwerde();
      let lastSignature = null;

      function redraw() {
        const signature = computeSignature();
        if (signature === lastSignature) return;
        lastSignature = signature;

        container.innerHTML = "";
        const beschwerden = getBeschwerden();
        beschwerden.forEach((b, idx) => {
          container.appendChild(renderBeschwerdeCard(b, idx, beschwerden.length === 1, redraw));
        });

        const last = beschwerden[beschwerden.length - 1];
        if (last && last.region) {
          const loopControl = el("div", "card card--sunken");
          loopControl.appendChild(el("p", "field-label", "Möchten Sie eine weitere Beschwerde hinzufügen?"));
          const addBtn = el("button", "btn btn--primary", "+ Weitere Beschwerde erfassen");
          addBtn.type = "button";
          addBtn.addEventListener("click", () => addBeschwerde());
          loopControl.appendChild(addBtn);
          container.appendChild(loopControl);
        }
      }

      redraw();
      return state.subscribe(redraw);
    },
  });
}
