/**
 * LINDEBERGS OS — Ziele (valides PROM, kategoriegesteuerter Baum)
 *
 * Aufbau je Ziel (Advisory-Board-Design, siehe data/A24_ziele_prom.js):
 *   1. KATEGORIE wählen (klickbare Kacheln — „Was möchten Sie erreichen?")
 *   2. Konkretes Ziel in eigenen Worten (ICF: Aktivitäts-/Partizipations-
 *      ebene; Platzhalter passt sich der Kategorie an)
 *   3. WENN-Messung je Kategorie: PSFS-Slider (Stratford 1995) ODER
 *      Zielgewicht ODER kategoriespezifische NRS — ODER keine (Prävention)
 *   4. Zeitrahmen (+ Datum) und „Warum" (Motivation, GAS-Prinzip)
 *
 * Die globale Schmerz-NRS (7 Tage) erscheint NUR, wenn ein Ziel schmerz-/
 * funktionsbezogen ist — wer abnehmen oder schlafen will, bekommt sie
 * nicht (Schmerz je Beschwerde folgt ohnehin in HB-004). WHO-5 bleibt für
 * alle (universelles Wohlbefinden).
 *
 * Klick-Fix: Alle Werte werden LIVE aus dem Store gelesen und die
 * Redraw-Signatur enthält die Kategorie — die Kacheln zeigen die Auswahl
 * jetzt sofort an (vorher: veraltetes Closure, Auswahl blieb unsichtbar).
 */
import { registerStep } from "../router.js";
import { renderQuestion } from "../render/renderQuestion.js";
import {
  ZIELE_INTRO,
  ZEITRAHMEN_OPTIONEN,
  PSFS_ANKER,
  NRS_ANKER,
  WHO5_INTRO,
  WHO5_SKALA,
  WHO5_ITEMS,
  MAX_ZIELE,
} from "../../data/A00b_ziele.js";
import { ZIEL_KATEGORIEN, ZIEL_MESSUNGEN, SCHMERZ_NRS_WENN, getZielKategorie } from "../../data/A24_ziele_prom.js";
import { getZiele, addZiel, updateZiel, removeZiel, ensureFirstZiel } from "../ziele-store.js";
import { state } from "../state.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

// Werte IMMER live aus dem Store lesen (nie aus dem Render-Closure).
function zielFeld(zielId, feld) {
  const z = getZiele().find((x) => x.id === zielId);
  return z ? z[feld] : undefined;
}

function renderZielCard(zielId, index) {
  const card = el("div", "card");
  card.style.marginBottom = "16px";
  card.dataset.zielId = zielId;

  const headerRow = el("div");
  headerRow.style.display = "flex";
  headerRow.style.justifyContent = "space-between";
  headerRow.appendChild(el("div", "section-label", `Ziel ${index + 1}`));
  if (index > 0) {
    const rm = el("button", "btn btn--ghost", "Entfernen");
    rm.type = "button";
    rm.addEventListener("click", () => removeZiel(zielId));
    headerRow.appendChild(rm);
  }
  card.appendChild(headerRow);

  const stack = el("div", "field-stack");
  stack.style.marginTop = "12px";

  // 1) Kategorie (Wurzel des Baums) — klickbare Kacheln mit Beispielen.
  stack.appendChild(
    renderQuestion(
      {
        id: "kategorie",
        frage: "Was möchten Sie vor allem erreichen?",
        type: "single_choice",
        options: ZIEL_KATEGORIEN.map((k) => ({ value: k.value, label: `${k.icon} ${k.label}` })),
        hint: "Wählen Sie die Richtung — die nächsten Fragen passen sich daran an.",
      },
      { getValue: () => zielFeld(zielId, "kategorie"), setValue: (_, v) => updateZiel(zielId, { kategorie: v }) }
    )
  );

  const kategorie = getZielKategorie(zielFeld(zielId, "kategorie"));
  if (!kategorie) {
    card.appendChild(stack);
    return card; // erst nach Kategorie-Wahl geht der Baum weiter
  }

  // 2) Konkretes Ziel (ICF-Aktivitätsebene; Platzhalter je Kategorie).
  stack.appendChild(
    renderQuestion(
      {
        id: "aktivitaet",
        frage: "Ihr Ziel in Ihren eigenen Worten:",
        type: "textarea",
        placeholder: kategorie.platzhalter,
        hint: `${kategorie.hint}. Je konkreter, desto besser können wir Ihren Fortschritt messen.`,
      },
      { getValue: () => zielFeld(zielId, "aktivitaet"), setValue: (_, v) => updateZiel(zielId, { aktivitaet: v }) }
    )
  );

  // 3) Wenn-Messung je Kategorie (deterministischer Baum aus A24).
  const messung = ZIEL_MESSUNGEN[kategorie.messung] || ZIEL_MESSUNGEN.keine;
  if (messung.typ === "psfs" || messung.typ === "nrs") {
    stack.appendChild(
      renderQuestion(
        { id: "baseline", frage: messung.baselineFrage, type: "vas_scale", min: 0, max: 10, labels: messung.labels || PSFS_ANKER.labels },
        { getValue: () => zielFeld(zielId, "baseline"), setValue: (_, v) => updateZiel(zielId, { baseline: v }) }
      )
    );
    stack.appendChild(
      renderQuestion(
        { id: "target", frage: messung.zielFrage, type: "vas_scale", min: 0, max: 10, labels: messung.labels || { 0: "Wie jetzt", 10: "Uneingeschränkt" } },
        { getValue: () => zielFeld(zielId, "target"), setValue: (_, v) => updateZiel(zielId, { target: v }) }
      )
    );
  } else if (messung.typ === "gewicht") {
    const aktuell = state.get("SD-007");
    stack.appendChild(
      renderQuestion(
        {
          id: "zielgewicht",
          frage: messung.zielFrage,
          type: "number",
          hint: aktuell ? `Aktuell angegeben: ${aktuell} kg. ${messung.hinweis}` : messung.hinweis,
        },
        { getValue: () => zielFeld(zielId, "zielgewicht"), setValue: (_, v) => updateZiel(zielId, { zielgewicht: v }) }
      )
    );
  }
  // messung.typ === "keine": bewusst keine Baseline (Prävention/Longevity).

  // 4) Zeitrahmen (+ Datumsfeld bei „bis zu einem Datum")
  stack.appendChild(
    renderQuestion(
      { id: "zeitrahmen", frage: "In welchem Zeitrahmen?", type: "single_choice", options: ZEITRAHMEN_OPTIONEN },
      { getValue: () => zielFeld(zielId, "zeitrahmen"), setValue: (_, v) => updateZiel(zielId, { zeitrahmen: v }) }
    )
  );
  if (zielFeld(zielId, "zeitrahmen") === "zu_termin") {
    stack.appendChild(
      renderQuestion(
        { id: "zieldatum", frage: "Bis zu welchem Datum?", type: "date", hint: "z.B. ein Urlaub, ein Wettkampf, ein wichtiges Ereignis" },
        { getValue: () => zielFeld(zielId, "zieldatum"), setValue: (_, v) => updateZiel(zielId, { zieldatum: v }) }
      )
    );
  }

  // 5) Warum (qualitativ — Motivation, GAS-Prinzip)
  stack.appendChild(
    renderQuestion(
      { id: "warum", frage: "Warum ist Ihnen das wichtig? (optional)", type: "textarea", placeholder: "Was würde sich für Sie im Leben ändern?" },
      { getValue: () => zielFeld(zielId, "warum"), setValue: (_, v) => updateZiel(zielId, { warum: v }) }
    )
  );

  card.appendChild(stack);
  return card;
}

export function registerZieleStep() {
  registerStep({
    id: "ziele",
    // Erwachsenen-Modul: bei Säuglings-/Kinder-Anamnese ausgeblendet.
    isVisible: (answers) => !["saeugling", "kind"].includes(answers["PT-001"]),
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
        // Signatur enthält Kategorie & Zeitrahmen: Kachel-Klicks zeichnen
        // sofort neu (Auswahl sichtbar, Baum wechselt). Text-/Slider-Werte
        // absichtlich NICHT in der Signatur (kein Fokusverlust beim Tippen).
        const hatSchmerzZiel = ziele.some((z) => SCHMERZ_NRS_WENN.includes(z.kategorie));
        const sig = ziele.map((z) => `${z.id}:${z.kategorie}:${z.zeitrahmen}`).join("|") + `#${hatSchmerzZiel}`;
        if (sig === lastSig) return;
        lastSig = sig;

        container.innerHTML = "";

        // Schicht 1 — Ziele (kategoriegesteuert)
        container.appendChild(el("div", "section-label", "Ihre Ziele"));
        const zieleWrap = el("div");
        zieleWrap.style.marginTop = "12px";
        ziele.forEach((z, i) => zieleWrap.appendChild(renderZielCard(z.id, i)));
        container.appendChild(zieleWrap);
        if (ziele.length < MAX_ZIELE) {
          const add = el("button", "btn btn--ghost", "+ Weiteres Ziel hinzufügen");
          add.type = "button";
          add.addEventListener("click", () => addZiel());
          container.appendChild(add);
        }

        // Schicht 2 — Schmerz-NRS: NUR bei schmerz-/funktionsbezogenen Zielen.
        if (hatSchmerzZiel) {
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
          nrsWrap.appendChild(el("p", "field-hint", "Die Schmerzstärke jeder einzelnen Beschwerde erfassen wir zusätzlich im Beschwerde-Teil."));
          container.appendChild(nrsWrap);
        }

        // Schicht 3 — Wohlbefinden (WHO-5), für alle.
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
