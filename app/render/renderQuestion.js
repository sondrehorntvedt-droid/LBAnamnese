/**
 * LINDEBERGS OS — Generischer Fragen-Renderer
 *
 * Rendert einen einzelnen Frage-Datensatz (aus A00–A09 / CDSS_Regelkatalog)
 * als DOM-Element, unabhängig vom jeweiligen Modul. Unterstützt alle im
 * Datensatz vorkommenden `type`-Werte.
 *
 * Aufruf: renderQuestion(question, { getValue, setValue })
 *   - getValue(id) → aktueller gespeicherter Wert für eine Frage-ID
 *   - setValue(id, value) → schreibt einen neuen Wert und löst Re-Render aus
 *
 * Nutzt ausschließlich textContent/DOM-APIs (kein innerHTML) — Patienten-
 * Freitext wird nie als HTML interpretiert.
 */
import { speechSupported, createDictationButton } from "../voice.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function normalizeOptions(rawOptions) {
  return (rawOptions || []).map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );
}

function getQuestionText(q) {
  return q.label ?? q.frage ?? q.titel ?? q.text ?? "";
}

function fieldWrapper(question) {
  const wrap = el("div", "field-stack__item");
  const label = el(
    "label",
    "field-label" + (question.required ? " field-required" : "")
  );
  label.textContent = getQuestionText(question);
  wrap.appendChild(label);
  if (question.hint) wrap.appendChild(el("p", "field-hint", question.hint));
  return wrap;
}

function renderChoiceTiles({ wrap, question, options, isMulti, getValue, setValue }) {
  const grid = el("div", "choice-grid");
  const tileRefs = [];

  function isSelected(value) {
    const current = getValue(question.id);
    if (isMulti) return Array.isArray(current) && current.includes(value);
    return current === value;
  }

  function syncTiles() {
    tileRefs.forEach(({ tile, value }) => {
      tile.classList.toggle("choice-tile--selected", isSelected(value));
    });
  }

  options.forEach((opt) => {
    const tile = el(
      "button",
      "choice-tile" +
        (isMulti ? " choice-tile--checkbox" : "") +
        (opt.red_flag ? " choice-tile--redflag" : "")
    );
    tile.type = "button";
    tile.setAttribute("role", isMulti ? "checkbox" : "radio");
    tile.appendChild(el("span", "choice-tile__mark"));
    tile.appendChild(el("span", null, opt.label));
    tile.addEventListener("click", () => {
      if (isMulti) {
        const cur = Array.isArray(getValue(question.id)) ? [...getValue(question.id)] : [];
        const idx = cur.indexOf(opt.value);
        if (idx >= 0) {
          cur.splice(idx, 1);
        } else {
          if (question.max_selections && cur.length >= question.max_selections) {
            cur.shift();
          }
          cur.push(opt.value);
        }
        setValue(question.id, cur);
      } else {
        setValue(question.id, opt.value);
      }
      syncTiles();
    });
    tileRefs.push({ tile, value: opt.value });
    grid.appendChild(tile);
  });
  syncTiles();
  wrap.appendChild(grid);
}

function renderText(wrap, question, getValue, setValue, multiline = false) {
  const input = el(multiline ? "textarea" : "input");
  if (!multiline) input.type = "text";
  if (question.placeholder) input.placeholder = question.placeholder;
  input.value = getValue(question.id) ?? "";
  input.addEventListener("input", () => setValue(question.id, input.value));
  wrap.appendChild(input);

  // Optionale Spracheingabe für Freitext (nur wo unterstützt; kein Zwang).
  if (multiline && question.voice !== false && speechSupported()) {
    const btn = createDictationButton(input, (text) => setValue(question.id, text));
    if (btn) wrap.appendChild(btn);
  }
}

function renderTypedInput(wrap, question, getValue, setValue, htmlType) {
  const input = el("input");
  input.type = htmlType;
  if (question.unit) input.placeholder = question.unit;
  if (question.min != null) input.min = question.min;
  if (question.max != null) input.max = question.max;
  input.value = getValue(question.id) ?? "";
  input.addEventListener("input", () => {
    const v = htmlType === "number" ? (input.value === "" ? "" : Number(input.value)) : input.value;
    setValue(question.id, v);
  });
  wrap.appendChild(input);
}

function renderYesNo(wrap, question, getValue, setValue) {
  renderChoiceTiles({
    wrap,
    question,
    options: [
      { value: true, label: "Ja" },
      { value: false, label: "Nein" },
    ],
    isMulti: false,
    getValue,
    setValue,
  });
}

function renderVasScale(wrap, question, getValue, setValue) {
  const min = question.min ?? 0;
  const max = question.max ?? 10;
  const current = getValue(question.id);
  const valueEl = el("div", "vas-value", current != null ? String(current) : "–");
  wrap.appendChild(valueEl);

  const range = el("input", "vas-slider");
  range.type = "range";
  range.min = String(min);
  range.max = String(max);
  range.step = "1";
  range.value = String(current ?? Math.round((min + max) / 2));
  range.addEventListener("input", () => {
    valueEl.textContent = range.value;
    setValue(question.id, Number(range.value));
  });
  const vasWrap = el("div", "vas-wrap");
  vasWrap.appendChild(range);
  wrap.appendChild(vasWrap);

  if (question.labels) {
    const labelsRow = el("div", "vas-labels");
    Object.entries(question.labels).forEach(([, text]) => {
      labelsRow.appendChild(el("span", null, text));
    });
    wrap.appendChild(labelsRow);
  }
}

function renderLikert4(wrap, question, getValue, setValue) {
  if (question.intro) wrap.appendChild(el("p", "field-hint", question.intro));
  const scaleEntries = Object.entries(question.scale_labels || {});

  (question.items || []).forEach((item) => {
    const itemWrap = el("div", "card card--sunken");
    itemWrap.style.marginBottom = "12px";
    itemWrap.appendChild(el("p", "field-label", item.text));
    const options = scaleEntries.map(([val, label]) => ({ value: Number(val), label }));
    renderChoiceTiles({
      wrap: itemWrap,
      question: { id: item.id, max_selections: undefined },
      options,
      isMulti: false,
      getValue,
      setValue,
    });
    wrap.appendChild(itemWrap);
  });
}

function renderMedicationList(wrap, question, getValue, setValue) {
  const current = Array.isArray(getValue(question.id)) ? getValue(question.id) : [""];
  const listWrap = el("div", "field-stack");

  function redraw(rows) {
    listWrap.innerHTML = "";
    rows.forEach((row, idx) => {
      const rowWrap = el("div");
      rowWrap.style.display = "flex";
      rowWrap.style.gap = "8px";
      const input = el("input");
      input.type = "text";
      input.placeholder = question.placeholder || "";
      input.value = row;
      input.addEventListener("input", () => {
        rows[idx] = input.value;
        setValue(question.id, [...rows]);
      });
      rowWrap.appendChild(input);
      if (rows.length > 1) {
        const removeBtn = el("button", "btn btn--ghost", "×");
        removeBtn.type = "button";
        removeBtn.addEventListener("click", () => {
          rows.splice(idx, 1);
          setValue(question.id, [...rows]);
          redraw(rows);
        });
        rowWrap.appendChild(removeBtn);
      }
      listWrap.appendChild(rowWrap);
    });
    const addBtn = el("button", "btn btn--ghost", "+ Weiteres Medikament");
    addBtn.type = "button";
    addBtn.addEventListener("click", () => {
      rows.push("");
      setValue(question.id, [...rows]);
      redraw(rows);
    });
    listWrap.appendChild(addBtn);
  }
  redraw([...current]);
  wrap.appendChild(listWrap);
}

function renderRepeatableEntry(wrap, question, getValue, setValue) {
  const current = Array.isArray(getValue(question.id)) ? getValue(question.id) : [];
  const listWrap = el("div", "field-stack");

  function redraw(rows) {
    listWrap.innerHTML = "";
    rows.forEach((row, idx) => {
      const rowCard = el("div", "card card--sunken");
      rowCard.style.display = "flex";
      rowCard.style.gap = "12px";
      rowCard.style.flexWrap = "wrap";
      rowCard.style.alignItems = "flex-end";

      question.fields.forEach((f) => {
        const fieldWrap = el("div");
        fieldWrap.style.flex = "1";
        fieldWrap.style.minWidth = "140px";
        fieldWrap.appendChild(el("label", "field-label", f.label));
        let input;
        if (f.type === "select") {
          input = el("select");
          const leer = el("option", null, "– bitte wählen –");
          leer.value = "";
          input.appendChild(leer);
          (f.options || []).forEach((opt) => {
            const o = typeof opt === "string" ? { value: opt, label: opt } : opt;
            const optEl = el("option", null, o.label);
            optEl.value = o.value;
            input.appendChild(optEl);
          });
          input.value = row[f.key] ?? "";
          input.addEventListener("change", () => {
            rows[idx] = { ...rows[idx], [f.key]: input.value };
            setValue(question.id, [...rows]);
          });
        } else {
          input = el("input");
          input.type = f.type === "number" ? "number" : f.type === "date" ? "date" : "text";
          if (f.placeholder) input.placeholder = f.placeholder;
          input.value = row[f.key] ?? "";
          input.addEventListener("input", () => {
            rows[idx] = { ...rows[idx], [f.key]: input.value };
            setValue(question.id, [...rows]);
          });
        }
        fieldWrap.appendChild(input);
        rowCard.appendChild(fieldWrap);
      });

      const removeBtn = el("button", "btn btn--ghost", "Entfernen");
      removeBtn.type = "button";
      removeBtn.addEventListener("click", () => {
        rows.splice(idx, 1);
        setValue(question.id, [...rows]);
        redraw(rows);
      });
      rowCard.appendChild(removeBtn);

      listWrap.appendChild(rowCard);
    });

    const addBtn = el("button", "btn btn--ghost", question.addLabel || "+ Weiteren Eintrag hinzufügen");
    addBtn.type = "button";
    addBtn.addEventListener("click", () => {
      rows.push({});
      setValue(question.id, [...rows]);
      redraw(rows);
    });
    listWrap.appendChild(addBtn);
  }

  redraw([...current]);
  wrap.appendChild(listWrap);
}

function renderFileUpload(wrap, question, getValue, setValue) {
  const current = Array.isArray(getValue(question.id)) ? getValue(question.id) : [];
  const fileList = el("ul");
  fileList.style.listStyle = "none";
  fileList.style.padding = "0";
  fileList.style.margin = "0 0 8px";

  function redrawList(names) {
    fileList.innerHTML = "";
    names.forEach((name) => {
      const item = el("li", "field-hint", "📎 " + name);
      fileList.appendChild(item);
    });
  }
  redrawList(current);

  const input = el("input");
  input.type = "file";
  input.multiple = (question.max_files ?? 1) > 1;
  if (question.accepted_types) input.accept = question.accepted_types.join(",");
  input.addEventListener("change", () => {
    // WICHTIG: bestehende Liste frisch aus dem State lesen (nicht die beim
    // Rendern eingefrorene Closure) — sonst überschreibt ein zweiter Upload
    // die erste Runde, statt sie zu ergänzen.
    const bestehend = Array.isArray(getValue(question.id)) ? getValue(question.id) : [];
    const names = Array.from(input.files).map((f) => f.name);
    const merged = [...bestehend, ...names].slice(0, question.max_files || 10);
    setValue(question.id, merged);
    redrawList(merged);
    input.value = ""; // erlaubt erneutes Auswählen derselben Datei
  });

  wrap.appendChild(fileList);
  wrap.appendChild(input);
  wrap.appendChild(
    el(
      "p",
      "field-hint",
      "Hinweis: In diesem Prototyp werden Dateien nur lokal referenziert, nicht hochgeladen."
    )
  );
}

export function renderQuestion(question, { getValue, setValue }) {
  // PHQ-4-artige Gruppenfragen haben keinen einzelnen Wert am eigenen id
  if (question.type === "likert_4") {
    const wrap = el("div", "field-stack__item");
    const label = el("label", "field-label" + (question.required ? " field-required" : ""));
    label.textContent = getQuestionText(question);
    wrap.appendChild(label);
    renderLikert4(wrap, question, getValue, setValue);
    return wrap;
  }

  const wrap = fieldWrapper(question);

  switch (question.type) {
    case "text":
    case "email":
    case "tel":
      renderText(wrap, question, getValue, setValue, false);
      break;
    case "textarea":
      renderText(wrap, question, getValue, setValue, true);
      break;
    case "number":
      renderTypedInput(wrap, question, getValue, setValue, "number");
      break;
    case "date":
      renderTypedInput(wrap, question, getValue, setValue, "date");
      break;
    case "yes_no":
      renderYesNo(wrap, question, getValue, setValue);
      break;
    case "single_choice":
      renderChoiceTiles({
        wrap,
        question,
        options: normalizeOptions(question.options),
        isMulti: false,
        getValue,
        setValue,
      });
      break;
    case "multi_choice": // Alias/Schreibvariante von multiple_choice (Robustheit)
    case "multiple_choice":
      renderChoiceTiles({
        wrap,
        question,
        options: normalizeOptions(question.options),
        isMulti: true,
        getValue,
        setValue,
      });
      break;
    case "multi_body_region":
      renderChoiceTiles({
        wrap,
        question,
        options: normalizeOptions(question.regions),
        isMulti: true,
        getValue,
        setValue,
      });
      break;
    case "vas_scale":
      renderVasScale(wrap, question, getValue, setValue);
      break;
    case "medication_list":
      renderMedicationList(wrap, question, getValue, setValue);
      break;
    case "repeatable_entry":
      renderRepeatableEntry(wrap, question, getValue, setValue);
      break;
    case "file_upload":
      renderFileUpload(wrap, question, getValue, setValue);
      break;
    case "checkbox": {
      renderChoiceTiles({
        wrap,
        question,
        options: [{ value: true, label: question.label }],
        isMulti: false,
        getValue,
        setValue,
      });
      break;
    }
    default:
      wrap.appendChild(el("p", "field-hint", `[Unbekannter Fragetyp: ${question.type}]`));
  }

  // Optionales „Sonstiges / Ergänzung"-Freitextfeld — für den Wunsch, fast
  // überall etwas eintragen zu können. Speichert unter `${id}__erg`.
  // Default AN bei Mehrfachauswahl (dort fehlt am ehesten eine Option),
  // sonst nur bei explizitem Opt-in. Mit `allow_sonstiges: false` abschaltbar.
  const ergaenzungAktiv =
    question.allow_sonstiges === true ||
    question.allow_ergaenzung === true ||
    (question.type === "multiple_choice" && question.allow_sonstiges !== false);
  if (ergaenzungAktiv) {
    const ergId = `${question.id}__erg`;
    const ergWrap = el("div");
    ergWrap.style.marginTop = "8px";
    const ergInput = el("input");
    ergInput.type = "text";
    ergInput.placeholder = question.ergaenzung_placeholder || "Sonstiges / Ergänzung (optional)…";
    ergInput.value = getValue(ergId) ?? "";
    ergInput.addEventListener("input", () => setValue(ergId, ergInput.value));
    ergWrap.appendChild(ergInput);
    wrap.appendChild(ergWrap);
  }

  return wrap;
}

export { getQuestionText };
