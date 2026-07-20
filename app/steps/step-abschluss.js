/**
 * LINDEBERGS OS — Abschluss & Zusammenfassung (4 Reiter)
 *
 *  1. Vollständig   — komplette Anamnese, maximale Tiefe
 *  2. Kompakt       — ½–1 A4, in 1–3 Min erfassbar; portable Patientenakte
 *  3. Befunde       — strukturierte Tabelle aller hochgeladenen Befunde
 *  4. Verlauf       — grafische Gesundheits-Roadmap (Zeitlinie)
 *
 * Patient/Therapeut-Umschalter blendet therapist_only-Inhalte (PHQ-4,
 * Yellow Flags, CDSS-Verdacht, Red-Flag-Alerts) ein/aus. Druckbar via
 * window.print().
 */
import { registerStep } from "../router.js";
import { renderRadarChart } from "../render/renderRadarChart.js";
import { renderTimeline } from "../render/renderTimeline.js";
import { computeSummary } from "../summary.js";
import { archiviereSitzung, starteNeueSitzung, ladeAkte } from "../patient-record.js";
import { formatDatum } from "../format.js";
import { FUNKTIONELLE_MARKER } from "../../data/A12_funktionelle_marker.js";
import { INDEX, formatAntwort, getFrage } from "../anamnese-index.js";
import { diagnoseLabel, diagnoseICD10, getBasistestsFuerRegion, computeSafetyIndikationen, getGesicherteDiagnosen } from "../klinik.js";
import { computeVitalstoffProfil } from "../vitalstoff.js";
import { computeHormonProfil } from "../hormon.js";
import { computeDarmProfil } from "../darm.js";
import { computeImmunProfil } from "../immun.js";
import { computeLichtProfil } from "../licht.js";
import { SAFETY_TESTS, OSTEO_ROUTINE } from "../../data/A14_testbatterie.js";
import { ABSOLUTE_RED_FLAGS } from "../../data/cdss/00_red_flags.js";
import { THERAPIE_HISTORIE_MODALITAETEN } from "../../data/A01b_therapie_historie.js";
import { computeWHO5 } from "../faktoren-mapping.js";
import { state } from "../state.js";

const FAKTOR_KEYS = ["Relief", "Range", "Rhythm", "Regulation", "Re-Energize", "Relations", "Rise"];
const DIAGNOSE_LABEL = {
  bluthochdruck: "Bluthochdruck", herzerkrankung: "Herzerkrankung", diabetes: "Diabetes mellitus",
  schilddruese: "Schilddrüsenerkrankung", osteoporose: "Osteoporose", rheuma: "Rheumatische Erkrankung",
  krebs: "Krebserkrankung", copd_asthma: "Lungenerkrankung", neurologisch: "Neurologische Erkrankung",
  depression_angst: "Psychische Erkrankung", darmerkrankung: "Chronische Darmerkrankung",
  nierenerkrankung: "Nierenerkrankung", gefaesserkrankung: "Gefäßerkrankung",
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function sektion(container, titel) {
  container.appendChild(el("div", "section-label", titel));
  const card = el("div", "card");
  card.style.marginTop = "8px";
  card.style.marginBottom = "18px";
  container.appendChild(card);
  return card;
}

function faktorenZeile(faktoren) {
  return FAKTOR_KEYS.map((k) => `${k} ${faktoren[k] == null ? "–" : Math.round(faktoren[k]) + "%"}`).join(" · ");
}

/** Kleine, druckbare Tabelle: kopf = Spaltentitel, zeilen = Array von Arrays. */
function tabelle(kopf, zeilen) {
  const wrap = el("div");
  wrap.style.overflowX = "auto";
  const table = el("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.fontSize = "var(--text-small)";
  const thead = el("thead");
  const htr = el("tr");
  kopf.forEach((h) => {
    const th = el("th", null, h);
    th.style.textAlign = "left";
    th.style.padding = "4px 8px";
    th.style.borderBottom = "2px solid var(--color-border)";
    th.style.color = "var(--color-secondary)";
    th.style.fontWeight = "var(--weight-semibold)";
    htr.appendChild(th);
  });
  thead.appendChild(htr);
  table.appendChild(thead);
  const tbody = el("tbody");
  zeilen.forEach((z) => {
    const tr = el("tr");
    z.forEach((c) => {
      const td = el("td", null, c || "—");
      td.style.padding = "4px 8px";
      td.style.borderBottom = "1px solid var(--color-border)";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

// Karte mit den (manuell erfassten / später KI-ausgelesenen) Kernbefunden
// aus hochgeladenen Dokumenten — prominent, weil oft der wichtigste Input.
function befundErkenntnisseCard(s) {
  const card = el("div", "card");
  card.style.margin = "0 0 14px";
  card.style.borderLeft = "3px solid var(--color-primary)";
  card.appendChild(el("div", "section-label", "🧪 Wichtigste Befund-Erkenntnisse"));
  s.befundErkenntnisse.forEach((b, i) => {
    const row = el("div");
    row.style.padding = "6px 0";
    if (i < s.befundErkenntnisse.length - 1) row.style.borderBottom = "1px solid var(--color-border)";
    const head = el("div", "field-hint", b.fachbereich + (b.datum ? " · " + formatDatum(b.datum) : ""));
    head.style.fontWeight = "var(--weight-semibold)";
    head.style.color = "var(--color-secondary)";
    row.appendChild(head);
    const t = el("p", null, b.notiz);
    t.style.margin = "2px 0 0";
    row.appendChild(t);
    card.appendChild(row);
  });
  return card;
}

// Q→A-Zeile für die vollständige Auflistung.
function qaRow(container, frage, antwort) {
  const row = el("div");
  row.style.padding = "4px 0";
  row.style.borderBottom = "1px solid var(--color-border)";
  const q = el("span", "field-hint", frage + ": ");
  const v = el("span", null, antwort);
  v.style.fontWeight = "var(--weight-medium)";
  row.appendChild(q);
  row.appendChild(v);
  container.appendChild(row);
}

// ── Bausteine für den PDF-Stil (nummerierte Abschnitte, ✓-Listen) ──────────

// Nummerierter Abschnitts-Header im Stil des Praxis-Anamnesebogens.
// Markenregel: Terracotta NUR als Struktur-/Abschnitts-Marker — genau hier.
function sektionNr(container, nr, titel) {
  const head = el("div");
  head.style.display = "flex";
  head.style.alignItems = "center";
  head.style.gap = "10px";
  head.style.margin = "26px 0 8px";
  const badge = el("span", null, String(nr).padStart(2, "0"));
  // Ink-Marker (invertiert automatisch im Dark Theme: dort Cloud auf Ink-Grund)
  badge.style.background = "var(--color-text-primary)";
  badge.style.color = "var(--color-bg)";
  badge.style.borderRadius = "8px";
  badge.style.padding = "2px 9px";
  badge.style.fontWeight = "var(--weight-semibold)";
  badge.style.fontSize = "var(--text-small)";
  badge.style.flexShrink = "0";
  head.appendChild(badge);
  const t = el("span", null, titel.toUpperCase());
  t.style.letterSpacing = "0.14em";
  t.style.fontWeight = "var(--weight-semibold)";
  t.style.fontSize = "var(--text-small)";
  t.style.color = "var(--color-primary)";
  head.appendChild(t);
  container.appendChild(head);
  const card = el("div", "card");
  card.style.marginBottom = "6px";
  container.appendChild(card);
  return card;
}

// Kleine fette Zwischenüberschrift innerhalb eines Abschnitts.
function subKopf(card, text) {
  const h = el("div", null, text);
  h.style.fontWeight = "var(--weight-semibold)";
  h.style.margin = "12px 0 4px";
  card.appendChild(h);
  return h;
}

// Unter-Label eine Ebene unter subKopf — trennt innerhalb einer Beschwerde
// den W-Fragen-Kern von den Zusatzangaben (Advisory Board: erst die
// klassische Schmerzanamnese nach dem SOCRATES-Schema, danach Spezial- und
// Inspektionsfragen aus der CDSS-Vertiefung).
function miniLabel(card, text) {
  const h = el("div", "field-hint", text);
  h.style.letterSpacing = "0.08em";
  h.style.textTransform = "uppercase";
  h.style.fontWeight = "var(--weight-semibold)";
  h.style.margin = "10px 0 2px";
  card.appendChild(h);
}

// ✓-Liste: zeigt nur Zutreffendes — liest sich wie der ausgefüllte
// Papierbogen (Kreuze), nicht wie ein Formular-Dump. Optional eingefärbt
// (z.B. Rot für auffällige Red-Flag-Antworten, Grün für Green Flags).
function kreuzListe(card, eintraege, farbe) {
  const ul = el("ul");
  ul.style.listStyle = "none";
  ul.style.margin = "4px 0 0";
  ul.style.padding = "0";
  eintraege.forEach((t) => {
    const li = el("li", null, "✓ " + t);
    li.style.padding = "2px 0";
    if (farbe) li.style.color = farbe;
    ul.appendChild(li);
  });
  card.appendChild(ul);
}

// Schmerz als Grafik (Sondre): farbcodierter 0–10-Balken für den heutigen
// Stand (Ø HB-004, Spannweite max/min) + Mini-Verlaufskurve über frühere
// archivierte Sitzungen derselben Region, sobald ≥2 datierte Werte da sind.
function schmerzGrafik(card, b, a) {
  const vas = a[`${b.id}::HB-004`];
  if (vas == null || vas === "") return;
  const maxW = a[`${b.id}::HB-005`];
  const minW = a[`${b.id}::HB-006`];
  const wrap = el("div");
  wrap.style.margin = "6px 0 12px";
  const kopf = el("div", "field-hint",
    `Schmerz aktuell (NRS): Ø ${vas}/10${maxW != null && maxW !== "" ? ` · max ${maxW}` : ""}${minW != null && minW !== "" ? ` · min ${minW}` : ""}`);
  kopf.style.fontWeight = "var(--weight-semibold)";
  wrap.appendChild(kopf);
  const track = el("div");
  track.style.cssText = "height:10px;border-radius:999px;background:var(--color-surface-sunken);overflow:hidden;margin-top:4px;max-width:340px;";
  const fill = el("div");
  fill.style.cssText = `height:100%;width:${Math.min(10, Math.max(0, Number(vas))) * 10}%;background:${schmerzFarbe(Number(vas))};`;
  track.appendChild(fill);
  wrap.appendChild(track);

  // Verlaufskurve (Schmerzkurve): frühere Sitzungen gleicher Region + heute.
  try {
    const punkte = [];
    (ladeAkte().sitzungen || []).forEach((sess) => {
      (sess.beschwerden || []).forEach((sb) => {
        if (sb.region !== b.regionValue) return;
        const v = sess.answers ? sess.answers[`${sb.id}::HB-004`] : null;
        if (v != null && v !== "" && sess.datum) punkte.push({ datum: sess.datum, vas: Number(v) });
      });
    });
    punkte.push({ datum: state.meta.sessionDatum || "", vas: Number(vas) });
    if (punkte.length >= 2) {
      const W = 340, H = 64, padX = 8, padY = 8;
      const x = (i) => padX + (i * (W - 2 * padX)) / (punkte.length - 1);
      const y = (v) => H - padY - (Math.min(10, Math.max(0, v)) / 10) * (H - 2 * padY);
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.style.cssText = "max-width:340px;width:100%;display:block;margin-top:8px;";
      const line = document.createElementNS(svgNS, "polyline");
      line.setAttribute("points", punkte.map((p, i) => `${x(i)},${y(p.vas)}`).join(" "));
      line.setAttribute("fill", "none");
      line.setAttribute("stroke", "var(--color-sage-deep, #50654E)");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);
      punkte.forEach((p, i) => {
        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", x(i));
        dot.setAttribute("cy", y(p.vas));
        dot.setAttribute("r", "3.5");
        dot.setAttribute("fill", schmerzFarbe(p.vas));
        svg.appendChild(dot);
        const txt = document.createElementNS(svgNS, "text");
        txt.setAttribute("x", x(i));
        txt.setAttribute("y", y(p.vas) - 6);
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("font-size", "9");
        txt.setAttribute("fill", "var(--color-text-muted, #8a8a80)");
        txt.textContent = String(p.vas);
        svg.appendChild(txt);
      });
      wrap.appendChild(svg);
      wrap.appendChild(el("p", "field-hint", `Schmerzkurve über ${punkte.length} Termine (ältester → heute).`));
    }
  } catch (e) { /* Verlauf ist optional — Balken bleibt */ }
  card.appendChild(wrap);
}

// Wiederholbare Einträge (OPs, Unfälle, Medikamente, Familie, Interventionen)
// als echte Tabelle statt Fließzeile — deutlich übersichtlicher.
function antwortAlsTabelle(card, def, label, value) {
  if (!def || def.type !== "repeatable_entry") return false;
  if (!Array.isArray(value) || !value.length || !Array.isArray(def.fields) || !def.fields.length) return false;
  const l = el("div", null, label);
  l.style.fontWeight = "var(--weight-medium)";
  l.style.margin = "10px 0 4px";
  card.appendChild(l);
  card.appendChild(
    tabelle(
      def.fields.map((f) => f.label),
      value.map((eintrag) =>
        def.fields.map((f) => {
          const v = eintrag ? eintrag[f.key] : null;
          if (v === true) return "Ja";
          if (v === false) return "Nein";
          return v == null || v === "" ? "—" : String(v);
        })
      )
    )
  );
  return true;
}

// Sicherheits-Kontrollfragen (RF001–RF008): wie viele beantwortet, welche positiv.
function safetyStatus(a) {
  const positive = [];
  let beantwortet = 0;
  ABSOLUTE_RED_FLAGS.forEach((rf) =>
    (rf.questions || []).forEach((q) => {
      if (!(q.id in a)) return;
      beantwortet++;
      if (a[q.id] === true) positive.push(q.text);
    })
  );
  return { beantwortet, positive };
}

// Green Flags — günstige, deterministisch ableitbare Zeichen (positive
// prognostische Faktoren). Bewusst konservativ: nur direkt aus den Antworten
// ablesbar, keine Interpretation, keine Diagnose.
function computeGreenFlags(a, s, safety) {
  const flags = [];
  if (safety.beantwortet > 0 && safety.positive.length === 0 && !(s.therapist.redFlags || []).length)
    flags.push("Alle Sicherheits-Kontrollfragen unauffällig");
  if (a["PMH-009"] === false) flags.push("Keine Blutverdünner");
  if (a["PMH-010"] === false) flags.push("Keine Kortison-Dauertherapie");
  if (a["SD-012"] === "regelmaessig" || a["SD-012"] === "intensiv") flags.push("Regelmäßig körperlich aktiv");
  const who5 = computeWHO5(a);
  if (who5 && who5.prozent != null && who5.prozent >= 68) flags.push(`Gutes Wohlbefinden (WHO-5 ${who5.prozent} %)`);
  return flags;
}

// ── Reiter 1: Vollständig — nummerierter Anamnesebogen (nach Praxis-PDF) ───
// Struktur & Reihenfolge folgen dem Lindebergs-Anamnesebogen (Anamnese.pdf,
// Abschnitte 1–15), ergänzt um die neuen Module (Schlaf, Vitalmedizin-
// Vertiefungen, Licht & Rhythmus, Ziele). Nur Beantwortetes wird gezeigt —
// Beschwerden als Fließtext, Symptome als ✓-Listen. Ein Auffangnetz
// (Ergänzungen) garantiert, dass keine beantwortete Frage verloren geht.
// Deterministisch: reine Formatierung der Antworten, keine Bewertung.
function renderVollstaendig(container, s, therapistMode) {
  const a = state.answers;
  const consumed = new Set(["PT-001"]); // Weiche selbst ist nicht listenswert
  const antwortTxt = (id) => (id in a ? formatAntwort(id, a[id]) : null);
  const zeige = (card, id, labelOverride) => {
    if (consumed.has(id)) return false;
    const def = getFrage(id);
    const label = labelOverride || (def ? def.label : id);
    // Wiederholbare Einträge (OPs, Unfälle, Medikamente, Familie …) → Tabelle.
    if (id in a && antwortAlsTabelle(card, def, label, a[id])) {
      consumed.add(id);
      return true;
    }
    const t = antwortTxt(id);
    if (t == null) return false;
    consumed.add(id);
    qaRow(card, label, t);
    return true;
  };
  const zeigeAlle = (card, ids) => ids.reduce((n, id) => n + (zeige(card, id) ? 1 : 0), 0);
  const idsInGruppe = (gruppe) => Object.keys(INDEX).filter((id) => INDEX[id].group === gruppe);

  // Longitudinale Sitzungs-Historie (nur wenn mehr als die aktuelle Sitzung).
  if (s.sitzungsHistorie.length > 1) {
    const h = sektion(container, "Verlauf der Anamnesen");
    s.sitzungsHistorie.forEach((sess) => {
      const label = sess.beschwerden.map((b) => b.region).join(", ") || "Anamnese";
      const line = el("p", null, `${formatDatum(sess.datum)}${sess.aktuell ? " (aktuell)" : ""} — ${label}`);
      line.style.fontSize = "var(--text-small)";
      h.appendChild(line);
    });
  }

  // ── PATIENT (Kopf, unnummeriert) — Ink-Cover (die dunkle Markenfläche) ──
  const name = [s.grunddaten.vorname, s.grunddaten.nachname].filter(Boolean).join(" ");
  const kopf = el("div", "card card--ink");
  kopf.style.borderTop = "3px solid var(--color-sage)";
  kopf.style.marginBottom = "6px";
  const nameEl = el("div", null, name || "Patient:in");
  nameEl.style.fontSize = "1.3rem";
  nameEl.style.fontWeight = "var(--weight-semibold)";
  kopf.appendChild(nameEl);
  const metaTeile = [];
  if (s.grunddaten.alter != null) metaTeile.push(`${s.grunddaten.alter} Jahre`);
  if (s.grunddaten.geschlecht) metaTeile.push(s.grunddaten.geschlecht === "m" ? "männlich" : s.grunddaten.geschlecht === "f" ? "weiblich" : s.grunddaten.geschlecht);
  if (s.grunddaten.bmi) metaTeile.push(`BMI ${s.grunddaten.bmi}`);
  if (s.sitzungDatum) metaTeile.push("Anamnese vom " + formatDatum(s.sitzungDatum));
  if (metaTeile.length) kopf.appendChild(el("p", "field-hint", metaTeile.join(" · ")));
  ["SD-001", "SD-002", "SD-003"].forEach((id) => consumed.add(id)); // im Kopf enthalten
  zeigeAlle(kopf, idsInGruppe("Stammdaten"));
  zeige(kopf, "PT-002", "Ausgefüllt von");
  zeige(kopf, "PT-004", "Einverständnis Sorgeberechtigte (Jugendliche/r)");
  zeige(kopf, "PT-005", "Sorgeberechtigte/r");
  container.appendChild(kopf);

  // Fremdanamnese = Eltern füllen für Baby (A16) oder Kind 2–11 (A23) aus.
  const saeugling = a["PT-001"] === "saeugling" || a["PT-001"] === "kind";
  let nr = 0;

  if (!saeugling) {
    // ── 01 · RISIKOPROFIL & FLAGS (Red / Yellow / Green) ──
    const sich = sektionNr(container, ++nr, "Risikoprofil & Flags");
    const safety = safetyStatus(a);
    ABSOLUTE_RED_FLAGS.forEach((rf) => (rf.questions || []).forEach((q) => { if (q.id in a) consumed.add(q.id); }));

    // 🚩 Red Flags — Sicherheits-Kontrollfragen
    subKopf(sich, "🚩 Red Flags — Sicherheits-Kontrollfragen");
    if (safety.positive.length) {
      const warn = el("p", null, "Auffällig beantwortet:");
      warn.style.color = "var(--color-status-red)";
      warn.style.fontWeight = "var(--weight-semibold)";
      warn.style.margin = "0 0 2px";
      sich.appendChild(warn);
      kreuzListe(sich, safety.positive, "var(--color-status-red)");
      if (safety.beantwortet > safety.positive.length)
        sich.appendChild(el("p", "field-hint", `Übrige ${safety.beantwortet - safety.positive.length} Kontrollfragen unauffällig.`));
    } else if (safety.beantwortet) {
      sich.appendChild(el("p", null, `Alle ${safety.beantwortet} Sicherheits-Kontrollfragen unauffällig beantwortet.`));
    } else {
      sich.appendChild(el("p", "field-hint", "Keine Angaben."));
    }
    zeige(sich, "PMH-018"); // Schwangerschaft — sicherheitsrelevant
    if (therapistMode && s.therapist.redFlags.length) {
      const rfl = el("p", null, "⚠️ Ausgelöste Red Flags: " + s.therapist.redFlags.map((r) => r.name || r.flag_id).join(", "));
      rfl.style.color = "var(--color-status-red)";
      rfl.style.fontWeight = "var(--weight-semibold)";
      sich.appendChild(rfl);
    }

    // ⚠ Yellow Flags & Psychometrie — therapist only (psychosoziale Prognose)
    if (therapistMode) {
      subKopf(sich, "⚠ Yellow Flags & Psychometrie (therapist only)");
      const yf = el("p", null, `Yellow Flags: ${s.therapist.yellowFlags.risiko} (Score ${s.therapist.yellowFlags.score})`);
      yf.style.color = "var(--color-status-yellow)";
      yf.style.fontWeight = "var(--weight-medium)";
      sich.appendChild(yf);
      sich.appendChild(el("p", "field-hint", `PHQ-4: ${s.therapist.phq4.gesamt}/12 (${s.therapist.phq4.kategorie})`));
    }

    // 🟢 Green Flags — günstige Zeichen (deterministisch, konservativ)
    const green = computeGreenFlags(a, s, safety);
    if (green.length) {
      subKopf(sich, "🟢 Green Flags — günstige Zeichen");
      kreuzListe(sich, green, "var(--color-status-green)");
    }

    // Risikoprofil (Ampel + Technikwahl) — therapist only, direkt beim Flags-Block.
    if (therapistMode) renderRisikoprofil(container, s.therapist.risikoprofil);

    // ── 02 · ZIELE & ERWARTUNGEN ── (patientenzentriert: direkt nach der
    // Sicherheit — der Behandler sieht sofort, WOFÜR der Patient kommt.)
    const zieleCard = sektionNr(container, ++nr, "Ziele & Erwartungen");
    if (s.ziele.length) {
      s.ziele.forEach((ziel) => {
        const row = el("div");
        row.style.marginBottom = "8px";
        row.appendChild(el("strong", null, ziel.zielText || "Ziel"));
        row.appendChild(el("p", "field-hint", [ziel.lebensbereich, ziel.fokus, ziel.zeitrahmen].filter(Boolean).join(" · ")));
        zieleCard.appendChild(row);
      });
    } else {
      zieleCard.appendChild(el("p", "field-hint", "Keine Ziele erfasst."));
    }

    // ── 03 · AKTUELLE BESCHWERDEN (Fließtext + Vertiefung) ──
    const W_TEXT_IDS = ["HB-001", "HB-003", "HB-004", "HB-005", "HB-006", "HB-007", "HB-008", "HB-009", "HB-010", "HB-011", "HB-012", "HB-013"];
    const besch = sektionNr(container, ++nr, "Aktuelle Beschwerden");
    // Globale Schmerzskala aus dem Ziele-Schritt (7-Tage-Durchschnitt, NRS)
    // — sichtbar machen, auch wenn sie nur dort erfasst wurde (Sondres
    // Befund: die Skala fehlte in den Berichten komplett).
    if (a["NRS-avg"] != null && a["NRS-avg"] !== "") {
      consumed.add("NRS-avg");
      const nrsWrap = el("div");
      nrsWrap.style.margin = "0 0 12px";
      const nrsKopf = el("div", "field-hint", `Schmerz gesamt (Ø letzte 7 Tage, NRS): ${a["NRS-avg"]}/10`);
      nrsKopf.style.fontWeight = "var(--weight-semibold)";
      nrsWrap.appendChild(nrsKopf);
      const nrsTrack = el("div");
      nrsTrack.style.cssText = "height:10px;border-radius:999px;background:var(--color-surface-sunken);overflow:hidden;margin-top:4px;max-width:340px;";
      const nrsFill = el("div");
      nrsFill.style.cssText = `height:100%;width:${Math.min(10, Math.max(0, Number(a["NRS-avg"]))) * 10}%;background:${schmerzFarbe(Number(a["NRS-avg"]))};`;
      nrsTrack.appendChild(nrsFill);
      nrsWrap.appendChild(nrsTrack);
      besch.appendChild(nrsWrap);
    }
    if (!s.beschwerden.length) besch.appendChild(el("p", "field-hint", "Keine Beschwerden erfasst."));
    s.beschwerden.forEach((b, i) => {
      const prio = b.prioritaet ? ` (${b.prioritaet.kurz} · ${b.prioritaet.label})` : "";
      subKopf(besch, `Beschwerde ${i + 1} — ${b.region}${prio}`);
      const g = (id) => {
        const k = `${b.id}::${id}`;
        return k in a ? formatAntwort(id, a[k]) : null;
      };
      // Aufbau je Beschwerde (Advisory-Board-Struktur, Sondres Vorgabe —
      // identisch für Beschwerde 1..n): 1. Beschreibung in Patientenworten,
      // 2. Schmerz als Grafik, 3. die W-Fragen strukturiert in fester
      // Reihenfolge (klinische Schmerzanamnese, SOCRATES-Schema), 4. danach
      // erst die Zusatzangaben aus der CDSS-Vertiefung (z.B. O-/X-Bein,
      // Überwärmung/Rötung). Der frühere W-Fließtext lebt im Kompakt-
      // Arztbericht weiter — hier wäre er nur Redundanz.
      if (g("HB-001")) {
        const z = el("p", null, `„${g("HB-001")}“`);
        z.style.margin = "0 0 4px";
        z.style.fontStyle = "italic";
        besch.appendChild(z);
      }
      // Schmerz als Grafik: Balken (heute, Ø/max/min) + Schmerzkurve über Termine.
      schmerzGrafik(besch, b, a);
      // Die W-Fragen im Überblick — Intensität steckt bereits in der Grafik.
      const wZeilen = [
        ["HB-003", "Charakter"],
        ["HB-007", "Beginn"],
        ["HB-008", "Verlauf seither"],
        ["HB-009", "Auslöser"],
        ["HB-010", "Am schlimmsten"],
        ["HB-011", "Was lindert"],
        ["HB-012", "Was verschlimmert"],
        ["HB-013", "Eigene Vermutung"],
      ].filter(([id]) => g(id) != null);
      if (wZeilen.length) {
        miniLabel(besch, "Die W-Fragen im Überblick");
        wZeilen.forEach(([id, label]) => qaRow(besch, label, g(id)));
      }
      // Übrige strukturierte Antworten dieser Beschwerde (CDSS-Vertiefung etc.);
      // Vorbehandlungen (TH-*) folgen gesammelt in Abschnitt Behandlungsanamnese.
      const zusatz = [];
      Object.keys(INDEX).forEach((id) => {
        if (W_TEXT_IDS.includes(id) || id.startsWith("TH-")) return;
        const key = `${b.id}::${id}`;
        if (!(key in a)) return;
        const txt = formatAntwort(id, a[key]);
        if (txt == null) return;
        zusatz.push([getFrage(id).label, txt]);
      });
      if (zusatz.length) {
        miniLabel(besch, "Weitere Angaben zu dieser Beschwerde");
        zusatz.forEach(([label, txt]) => qaRow(besch, label, txt));
      }
      if (therapistMode && b.verdacht.length) {
        const v = el("p", "field-hint", "CDSS-Verdacht: " + b.verdacht.slice(0, 5).map((x) => `${x.label} (${x.score})`).join(", "));
        v.style.marginTop = "6px";
        besch.appendChild(v);
      }
    });

    // ── 03 · BEGLEITENDE SYMPTOME (✓-Liste) ──
    const beg = sektionNr(container, ++nr, "Begleitende Symptome");
    const begPos = [];
    let begSonst = 0;
    idsInGruppe("Begleitsymptome").forEach((id) => {
      if (!(id in a)) return;
      consumed.add(id);
      if (a[id] === true) {
        begPos.push(INDEX[id].label);
        return;
      }
      if (a[id] === false) return; // Verneintes nicht listen — nur Kreuze
      const txt = formatAntwort(id, a[id]);
      if (txt != null) {
        qaRow(beg, INDEX[id].label, txt);
        begSonst++;
      }
    });
    if (begPos.length) kreuzListe(beg, begPos);
    if (!begPos.length && !begSonst) beg.appendChild(el("p", null, "Keine begleitenden Symptome angegeben."));

    // ── 04 · VORERKRANKUNGEN ──
    const vor = sektionNr(container, ++nr, "Vorerkrankungen");
    const n04 = zeigeAlle(vor, ["PMH-001", "PMH-001-DM", "PMH-001-DM-INSULIN", "PMH-001-HERZ", "PMH-002", "PMH-001b", "PMH-CA-01", "PMH-CA-02", "PMH-CA-03", "PMH-CA-04", "PMH-CA-05", "PMH-CA-06", "PMH-CA-07"]);
    if (!n04) vor.appendChild(el("p", null, "Keine bekannten Vorerkrankungen angegeben."));

    // ── 06 · OPERATIONEN, TRAUMEN & UNFÄLLE (tabellarisch) ──
    const op = sektionNr(container, ++nr, "Operationen, Traumen & Unfälle");
    const n05 = zeigeAlle(op, ["PMH-003", "PMH-004", "PMH-005", "PMH-006"]);
    if (!n05) op.appendChild(el("p", null, "Keine Operationen oder relevanten Traumen angegeben."));

    // ── 07 · MEDIKAMENTE, ALLERGIEN & IMPFUNGEN (tabellarisch) ──
    const med = sektionNr(container, ++nr, "Medikamente, Allergien & Impfungen");
    let n06 = zeigeAlle(med, ["PMH-007", "PMH-008"]);
    // Blutverdünner/Kortison: bei „Ja" als rote Warnzeile (behandlungsrelevant).
    [["PMH-009", "Blutverdünner"], ["PMH-010", "Kortison / Steroide (länger)"]].forEach(([id, label]) => {
      if (!(id in a) || consumed.has(id)) return;
      consumed.add(id);
      n06++;
      if (a[id] === true) {
        const w = el("p", null, `⚠ ${label}: Ja`);
        w.style.color = "var(--color-status-red)";
        w.style.fontWeight = "var(--weight-semibold)";
        w.style.margin = "4px 0";
        med.appendChild(w);
      } else {
        qaRow(med, getFrage(id).label, formatAntwort(id, a[id]) || "Nein");
      }
    });
    n06 += zeigeAlle(med, ["PMH-010b", "PMH-011", "PMH-012", "PMH-013"]);
    if (!n06) med.appendChild(el("p", null, "Keine Medikamente oder Allergien angegeben."));

    // ── 07 · FAMILIENANAMNESE ──
    const fam = sektionNr(container, ++nr, "Familienanamnese");
    const n07 = zeigeAlle(fam, ["PMH-014", "PMH-014b"]);
    if (!n07) fam.appendChild(el("p", null, "Keine familiären Erkrankungen angegeben."));

    // ── 08 · BEHANDLUNGSANAMNESE (pro Beschwerde) ──
    const beh = sektionNr(container, ++nr, "Behandlungsanamnese");
    let n08 = 0;
    s.beschwerden.forEach((b, i) => {
      const zeilen = [];
      THERAPIE_HISTORIE_MODALITAETEN.forEach((mod) => {
        const v = a[`${b.id}::${mod.id}`];
        if (v == null || v === "") return;
        // Neue zweidimensionale Dosierung (Anzahl + Frequenz); Altbestand
        // (-haeufigkeit) als Fallback in der Anzahl-Spalte.
        const anzahl =
          formatAntwort(`${mod.id}-anzahl`, a[`${b.id}::${mod.id}-anzahl`]) ||
          formatAntwort(`${mod.id}-haeufigkeit`, a[`${b.id}::${mod.id}-haeufigkeit`]) || "—";
        const frequenz = formatAntwort(`${mod.id}-frequenz`, a[`${b.id}::${mod.id}-frequenz`]) || "—";
        zeilen.push([mod.label, formatAntwort(mod.id, v) || String(v), anzahl, frequenz]);
      });
      const frei = a[`${b.id}::TH-FREI`];
      const intervention = a[`${b.id}::TH-INTERVENTION`];
      if (!zeilen.length && !frei && !intervention) return;
      n08++;
      if (s.beschwerden.length > 1) subKopf(beh, `Beschwerde ${i + 1} — ${b.region}`);
      if (zeilen.length) beh.appendChild(tabelle(["Therapie", "Erfolg", "Wie oft gesamt", "Frequenz"], zeilen));
      if (frei) qaRow(beh, "Weitere Therapieversuche", String(frei));
      if (intervention && !antwortAlsTabelle(beh, getFrage("TH-INTERVENTION"), "Interventionen (Spritzen / Infiltrationen)", intervention))
        qaRow(beh, "Interventionen", formatAntwort("TH-INTERVENTION", intervention) || "");
    });
    if (!n08) beh.appendChild(el("p", null, "Keine Vorbehandlungen angegeben."));

    // ── 09 · VITALPARAMETER ──
    const vit = sektionNr(container, ++nr, "Vitalparameter");
    const n09 = zeigeAlle(vit, idsInGruppe("Vitalparameter"));
    if (!n09) vit.appendChild(el("p", "field-hint", "Keine Messwerte erfasst."));

    // ── 10 · SYSTEMANAMNESE (a–…) ──
    const sys = sektionNr(container, ++nr, "Systemanamnese");
    const sysGruppen = [];
    Object.keys(INDEX).forEach((id) => {
      const grp = INDEX[id].group || "";
      if (grp.startsWith("Systemanamnese: ") && !sysGruppen.includes(grp)) sysGruppen.push(grp);
    });
    let sysCount = 0;
    let letter = 0;
    // Darm-/Mikrobiom-Vertiefung (D4) gehört fachlich zu den Organsystemen —
    // sie wird direkt hinter „Darm, Kolon & unterer GI-Trakt" einsortiert.
    const darmIds = idsInGruppe("Vitalmedizin").filter((id) => id === "DARM-GATE" || id.startsWith("D4-"));
    let darmEingefuegt = false;
    const renderDarmVertiefung = () => {
      if (darmEingefuegt) return;
      darmEingefuegt = true;
      const offen = darmIds.filter((id) => id in a && !consumed.has(id) && formatAntwort(id, a[id]) != null);
      if (!offen.length) return;
      const buchstabe = String.fromCharCode(97 + letter++);
      if (a["DARM-GATE"] === false && offen.length === 1 && offen[0] === "DARM-GATE") {
        const z = el("p", "field-hint", `${buchstabe}) Darmgesundheit & Mikrobiom (Vertiefung): auf Wunsch übersprungen.`);
        z.style.margin = "2px 0";
        sys.appendChild(z);
        consumed.add("DARM-GATE");
        sysCount++;
        return;
      }
      subKopf(sys, `${buchstabe}) Darmgesundheit & Mikrobiom (Vertiefung)`);
      offen.forEach((id) => {
        if (id === "DARM-GATE") consumed.add(id);
        else zeige(sys, id);
      });
      sysCount++;
    };
    sysGruppen.forEach((grp) => {
      const sysName = grp.replace("Systemanamnese: ", "");
      const ids = idsInGruppe(grp).filter((id) => id in a && !consumed.has(id) && formatAntwort(id, a[id]) != null);
      if (ids.length) {
        const buchstabe = String.fromCharCode(97 + letter++);
        const gateId = ids.find((id) => id.startsWith("SYSG-"));
        // System ohne Beschwerden („Nein" am Gate, sonst nichts): eine Zeile genügt.
        if (gateId && a[gateId] === "nein" && ids.length === 1) {
          const z = el("p", "field-hint", `${buchstabe}) ${sysName}: keine Beschwerden.`);
          z.style.margin = "2px 0";
          sys.appendChild(z);
          consumed.add(gateId);
          sysCount++;
        } else {
          subKopf(sys, `${buchstabe}) ${sysName}`);
          ids.forEach((id) => zeige(sys, id));
          sysCount++;
        }
      }
      if (sysName.startsWith("Darm")) renderDarmVertiefung();
    });
    renderDarmVertiefung(); // Fallback: falls das Darm-System selbst leer war
    if (!sysCount) sys.appendChild(el("p", "field-hint", "Nicht erhoben (Fokus-Stufe) oder ohne Angaben."));

    // ── 11 · TRINKVERHALTEN & ERNÄHRUNG ──
    const ern = sektionNr(container, ++nr, "Trinkverhalten & Ernährung");
    // ERN-020 (Sonne/Tageslicht) erscheint fachlich im Abschnitt Licht & Rhythmus.
    const n11 = zeigeAlle(ern, idsInGruppe("Ernährung & Trinken").filter((id) => id !== "ERN-020"));
    if (!n11) ern.appendChild(el("p", "field-hint", "Nicht erhoben."));

    // ── 12 · SPORT & BEWEGUNG ──
    const spo = sektionNr(container, ++nr, "Sport & Bewegung");
    const n12 = zeigeAlle(spo, idsInGruppe("Sport & Bewegung"));
    if (!n12) spo.appendChild(el("p", "field-hint", "Nicht erhoben."));

    // ── 14 · SCHLAF & ENERGIE ── (Lifestyle-Block: Ernährung → Bewegung → Schlaf)
    const schlaf = sektionNr(container, ++nr, "Schlaf & Energie");
    const n14 = zeigeAlle(schlaf, idsInGruppe("Vitalmedizin").filter((id) => id.startsWith("D1-")));
    if (!n14) schlaf.appendChild(el("p", "field-hint", "Nicht erhoben."));

    // Gemeinsamer Renderer für gate-gesteuerte Vertiefungen (eigener Abschnitt je Thema).
    const vertiefungsAbschnitt = (titel, ids, gateId) => {
      const card = sektionNr(container, ++nr, titel);
      const offen = ids.filter((id) => id in a && !consumed.has(id) && formatAntwort(id, a[id]) != null);
      if (!offen.length) {
        card.appendChild(el("p", "field-hint", "Nicht erhoben (nur in der Tiefenanalyse)."));
        return;
      }
      if (gateId && a[gateId] === false && offen.length === 1 && offen[0] === gateId) {
        card.appendChild(el("p", "field-hint", "Bereich auf Wunsch übersprungen."));
        consumed.add(gateId);
        return;
      }
      offen.forEach((id) => {
        // Gate-„Ja" selbst ist Rauschen — nur die Inhalte zeigen.
        if (id === gateId || id === "LR-OPT") consumed.add(id);
        else zeige(card, id);
      });
    };
    const vmIds = idsInGruppe("Vitalmedizin");

    // ── 15 · LICHT & RHYTHMUS ── (direkt hinter dem Schlaf — circadianes
    // Paar; Ausrichtung Reiter/Panda: Licht ist der stärkste Schlaf-Hebel.)
    vertiefungsAbschnitt("Licht & Rhythmus", [...idsInGruppe("Vitalmedizin — Licht & Rhythmus"), "ERN-020"], "LICHT-GATE");

    // ── 16 · SOZIALANAMNESE & PSYCHE ──
    const soz = sektionNr(container, ++nr, "Sozialanamnese & Psyche");
    let n16s = zeigeAlle(soz, ["PMH-015", "PMH-016", "PMH-017"]);
    n16s += zeigeAlle(soz, idsInGruppe("Psychosozial").filter((id) => !id.startsWith("PHQ4-")));
    n16s += zeigeAlle(soz, idsInGruppe("Vitalität & Faktoren")); // eingewobene Relations-/Rise-Fragen
    idsInGruppe("Psychosozial").forEach((id) => {
      if (id.startsWith("PHQ4-")) consumed.add(id); // therapist_only — nie im Patiententext
    });
    if (!n16s) soz.appendChild(el("p", "field-hint", "Nicht erhoben."));

    // ── 17 · HORMONE & STOFFWECHSEL / 18 · IMMUNSYSTEM & ENTZÜNDUNG ──
    vertiefungsAbschnitt("Hormone & Stoffwechsel", vmIds.filter((id) => id === "HOR-GATE" || id.startsWith("D2-") || id.startsWith("D3-")), "HOR-GATE");
    vertiefungsAbschnitt("Immunsystem & Entzündung", vmIds.filter((id) => id === "IMM-GATE" || id.startsWith("IMM-")), "IMM-GATE");

    // ── 16 · BEFUNDE & DOKUMENTE ──
    const bef = sektionNr(container, ++nr, "Befunde & Dokumente");
    let n16 = 0;
    if (s.befundErkenntnisse && s.befundErkenntnisse.length) {
      subKopf(bef, "🧪 Wichtigste Befund-Erkenntnisse");
      s.befundErkenntnisse.forEach((b) => {
        qaRow(bef, b.fachbereich + (b.datum ? " · " + formatDatum(b.datum) : ""), b.notiz);
      });
      n16++;
    }
    n16 += zeigeAlle(bef, idsInGruppe("Befunde"));
    n16 += zeige(bef, "PMH-019") ? 1 : 0;
    if (s.labor.hatDaten) {
      if (s.labor.uploads.length) {
        bef.appendChild(el("p", "field-hint", `${s.labor.uploads.length} Labor-/Ernährungs-Befund(e) hochgeladen — siehe Reiter Befunde.`));
      }
      if (therapistMode) {
        const ref = el("div");
        ref.style.marginTop = "10px";
        ref.appendChild(el("p", "field-hint", "Funktionelle Referenzbereiche (Optimierung, enger als Laborreferenz) — Interpretationshilfe, keine Diagnostik:"));
        FUNKTIONELLE_MARKER.forEach((grp) => {
          const gl = el("div", "section-label", grp.gruppe);
          gl.style.marginTop = "10px";
          ref.appendChild(gl);
          ref.appendChild(
            tabelle(
              ["Marker", "Laborref.", "Funktionell", "Bedeutung"],
              grp.marker.map((m) => [`${m.name}${m.einheit ? " (" + m.einheit + ")" : ""}`, m.laborRef, m.funktionell, m.hinweis])
            )
          );
        });
        bef.appendChild(ref);
      }
      n16++;
    }
    if (!n16) bef.appendChild(el("p", "field-hint", "Keine Befunde hochgeladen."));

    // (Ziele stehen jetzt vorn als Abschnitt 02 — patientenzentriert.)

    // ── 20 · ERGÄNZUNGEN (Auffangnetz — nichts geht verloren) ──
    const restGruppen = new Map();
    Object.keys(INDEX).forEach((id) => {
      if (consumed.has(id) || id.startsWith("PHQ4-")) return;
      const grp = INDEX[id].group || "Weitere";
      if (grp === "Beschwerde" || grp === "Für wen?" || grp.startsWith("Säugling: ") || grp.startsWith("Kind: ")) return;
      if (!(id in a)) return;
      if (formatAntwort(id, a[id]) == null) return;
      if (!restGruppen.has(grp)) restGruppen.set(grp, []);
      restGruppen.get(grp).push(id);
    });
    if (restGruppen.size) {
      const erg = sektionNr(container, ++nr, "Ergänzungen & weitere Angaben");
      restGruppen.forEach((ids, grp) => {
        subKopf(erg, grp);
        ids.forEach((id) => zeige(erg, id));
      });
    }
  } else {
    // ── Eltern-Fragebogen (Säugling A16 / Kind A23): Abschnitte nummeriert ──
    const sglGruppen = [];
    Object.keys(INDEX).forEach((id) => {
      const grp = INDEX[id].group || "";
      if ((grp.startsWith("Säugling: ") || grp.startsWith("Kind: ")) && !sglGruppen.includes(grp)) sglGruppen.push(grp);
    });
    sglGruppen.forEach((grp) => {
      const ids = idsInGruppe(grp).filter((id) => id in a && formatAntwort(id, a[id]) != null);
      if (!ids.length) return;
      const card = sektionNr(container, ++nr, grp.replace(/^(Säugling|Kind): /, ""));
      ids.forEach((id) => zeige(card, id));
    });
    if (therapistMode && s.therapist.redFlags.length) {
      const card = sektionNr(container, ++nr, "Sicherheit");
      const rfl = el("p", null, "⚠️ Ausgelöste Red Flags: " + s.therapist.redFlags.map((r) => r.name || r.flag_id).join(", "));
      rfl.style.color = "var(--color-status-red)";
      rfl.style.fontWeight = "var(--weight-semibold)";
      card.appendChild(rfl);
    }
  }

  // ── ZUSAMMENFASSUNG & VITALITÄTSPROFIL (wie PDF-Abschnitt 15) ──
  const f = sektionNr(container, ++nr, "Zusammenfassung & Vitalitätsprofil");
  if (!saeugling) {
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.maxWidth = "300px";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto 12px";
    f.appendChild(canvas);
    const chartProfil = {};
    FAKTOR_KEYS.forEach((k) => (chartProfil[k] = s.faktoren[k] == null ? null : s.faktoren[k] / 10));
    requestAnimationFrame(() => renderRadarChart(canvas, chartProfil));
    f.appendChild(el("p", "field-hint", faktorenZeile(s.faktoren)));
  } else {
    f.appendChild(el("p", "field-hint", "Eltern-Fragebogen — die Einordnung erfolgt durch das Kinderosteopathie-Team."));
  }

  // (Red/Yellow Flags, Psychometrie & Risikoprofil stehen jetzt gebündelt in
  // Abschnitt 01 „Risikoprofil & Flags" — kein separater Endblock mehr.)
}

const AMPEL_FARBE = { rot: "var(--color-status-red)", gelb: "var(--color-status-yellow)", gruen: "var(--color-status-green)" };
const AMPEL_TEXT = { rot: "Erhöhte Vorsicht — Kontraindikation(en) beachten", gelb: "Modifikationen nötig", gruen: "Keine harten Kontraindikationen" };

// Therapeuten-Risikoprofil (Fossum): Technikwahl & Diagnostikvorbereitung.
function renderRisikoprofil(container, rp) {
  if (!rp) return;
  const card = sektion(container, "Therapist only — Risikoprofil & Technikwahl");

  // Gesamt-Ampel
  const ampelRow = el("div");
  ampelRow.style.display = "flex";
  ampelRow.style.alignItems = "center";
  ampelRow.style.gap = "10px";
  ampelRow.style.marginBottom = "10px";
  const dot = el("span");
  dot.style.width = "14px";
  dot.style.height = "14px";
  dot.style.borderRadius = "50%";
  dot.style.background = AMPEL_FARBE[rp.gesamt.ampel];
  dot.style.flexShrink = "0";
  ampelRow.appendChild(dot);
  const at = el("strong", null, AMPEL_TEXT[rp.gesamt.ampel]);
  at.style.color = AMPEL_FARBE[rp.gesamt.ampel];
  ampelRow.appendChild(at);
  card.appendChild(ampelRow);

  if (rp.gesamt.kontraindikationen.length) {
    const k = el("p", null, "⛔ Kontraindikationen: " + rp.gesamt.kontraindikationen.join(" · "));
    k.style.color = "var(--color-status-red)";
    k.style.fontWeight = "var(--weight-semibold)";
    card.appendChild(k);
  }
  if (rp.gesamt.modifikationen.length) {
    card.appendChild(el("p", "field-hint", "Modifikationen: " + rp.gesamt.modifikationen.join(" · ")));
  }

  // Einzelprofile als Tabelle
  const zeilen = [
    ["HWS-Manipulation (CAD)", rp.hws_manipulation.label, rp.hws_manipulation.faktoren.join("; ") || "—"],
    ["Frakturrisiko", `${rp.fraktur.label} (Score ${rp.fraktur.score})`, rp.fraktur.faktoren.join("; ") || "—"],
    ["Kardiovaskulär", `${rp.kardiovaskulaer.label} (Score ${rp.kardiovaskulaer.score})`, rp.kardiovaskulaer.faktoren.join("; ") || "—"],
    ["Obere HWS-Instabilität", rp.obere_hws_instabilitaet.verdacht ? "⚠ Verdacht — abklären" : "kein Verdacht", rp.obere_hws_instabilitaet.trigger.join("; ") || "—"],
    ["Konstitutionstyp", rp.konstitution.label, rp.konstitution.hypermobil ? "hypermobil" : "—"],
  ];
  card.appendChild(tabelle(["Profil", "Einordnung", "Faktoren"], zeilen));

  // Empfohlene Tests
  if (rp.empfohlene_tests.length) {
    const l = el("div", "section-label", "Empfohlene Tests / Diagnostik");
    l.style.marginTop = "14px";
    card.appendChild(l);
    rp.empfohlene_tests.forEach((t) => {
      const row = el("div");
      row.style.marginTop = "6px";
      row.appendChild(el("strong", null, t.anlass));
      const ul = el("ul");
      ul.style.margin = "4px 0 0";
      t.tests.forEach((x) => {
        // Tests sind kategorisiert ({kat, text}) — Disziplin als Präfix.
        const li = el("li");
        if (x && typeof x === "object" && x.kat) {
          const tag = el("strong", null, x.kat + ": ");
          tag.style.color = "var(--color-secondary)";
          li.appendChild(tag);
          li.appendChild(document.createTextNode(x.text));
        } else {
          li.textContent = typeof x === "string" ? x : x.text || "";
        }
        ul.appendChild(li);
      });
      row.appendChild(ul);
      card.appendChild(row);
    });
  }

  // Technik-Hinweise
  if (rp.technik_hinweise.length) {
    const l = el("div", "section-label", "Technik-Hinweise");
    l.style.marginTop = "14px";
    card.appendChild(l);
    const ul = el("ul");
    ul.style.margin = "4px 0 0";
    rp.technik_hinweise.forEach((x) => ul.appendChild(el("li", null, x)));
    card.appendChild(ul);
  }

  card.appendChild(el("p", "field-hint", "Regelbasierte Entscheidungsunterstützung (Fossum GOA / CAD / FRAX-orientiert) — ersetzt nicht die klinische Untersuchung und Beurteilung."));
}

// ── Kompakt-Dashboard: kleine Helfer ──────────────────────
const PRIO_FARBE = { P1: "var(--color-status-red)", P2: "var(--color-terracotta)", P3: "var(--color-sage)", P4: "var(--color-text-muted)" };
function schmerzFarbe(v) {
  if (v == null) return "var(--color-border)";
  if (v <= 3) return "var(--color-status-green)";
  if (v <= 6) return "var(--color-status-yellow)";
  return "var(--color-status-red)";
}
function chip(text, opts = {}) {
  const c = el("span", null, text);
  c.style.display = "inline-flex";
  c.style.alignItems = "center";
  c.style.gap = "4px";
  c.style.padding = "3px 10px";
  c.style.borderRadius = "999px";
  c.style.fontSize = "0.78rem";
  c.style.fontWeight = "var(--weight-medium)";
  c.style.background = opts.bg || "var(--color-surface-sunken)";
  c.style.color = opts.fg || "var(--color-text)";
  if (opts.border) c.style.border = "1px solid " + opts.border;
  c.style.margin = "2px 4px 2px 0";
  return c;
}
function chipRow() {
  const r = el("div");
  r.style.display = "flex";
  r.style.flexWrap = "wrap";
  r.style.margin = "4px 0";
  return r;
}
function dashCard(titel) {
  const c = el("div", "card");
  c.style.margin = "0";
  if (titel) {
    const h = el("div", "section-label", titel);
    h.style.marginBottom = "10px";
    c.appendChild(h);
  }
  return c;
}
function banner(text, farbe, icon) {
  const b = el("div");
  b.style.display = "flex";
  b.style.alignItems = "center";
  b.style.gap = "10px";
  b.style.padding = "12px 16px";
  b.style.borderRadius = "var(--radius-md, 14px)";
  b.style.background = "color-mix(in srgb, " + farbe + " 12%, transparent)";
  b.style.borderLeft = "4px solid " + farbe;
  b.style.marginBottom = "14px";
  const t = el("span");
  t.appendChild(el("strong", null, (icon ? icon + " " : "") ));
  t.appendChild(document.createTextNode(text));
  t.style.color = farbe;
  t.style.fontWeight = "var(--weight-medium)";
  b.appendChild(t);
  return b;
}

// ── Reiter 2: Kompakt — Arztbericht (½–1 A4) ───────────────────────────────
// Klassischer Vorstellungsbericht im Arztbrief-Stil (Wunsch Sondre): „Frau
// Mustermann stellt sich am … in unserer Praxis vor mit …" — komprimierter
// Fließtext für externe Ärzte und unsere Therapeuten, in wenigen Minuten das
// Vollbild. Deterministisch aus den Antworten gebaut, keine Bewertung.
function renderKompakt(container, s, therapistMode) {
  const a = state.answers;
  const fmt = (id, nsId) => {
    const key = nsId ? `${nsId}::${id}` : id;
    return key in a ? formatAntwort(id, a[key]) : null;
  };
  const absatz = (text) => {
    if (!text) return;
    const p = el("p");
    p.style.margin = "0 0 12px";
    p.style.lineHeight = "1.65";
    p.textContent = text;
    container.appendChild(p);
  };
  const markiert = (label, text, farbe) => {
    if (!text) return;
    const p = el("p");
    p.style.margin = "0 0 10px";
    p.style.lineHeight = "1.6";
    if (farbe) p.style.color = farbe;
    p.appendChild(el("strong", null, label + ": "));
    p.appendChild(document.createTextNode(text));
    container.appendChild(p);
  };

  container.appendChild(
    el("p", "field-hint", "Kompaktbericht im Arztbrief-Stil — für Behandler und externe Ärzte. Oben Druck-Knopf zum Speichern/Drucken.")
  );

  // Kopfzeile
  const anrede = s.grunddaten.geschlecht === "m" ? "Herr " : s.grunddaten.geschlecht === "f" ? "Frau " : "";
  const name = [s.grunddaten.vorname, s.grunddaten.nachname].filter(Boolean).join(" ") || "Patient:in";
  const kopf = el("div");
  kopf.style.marginBottom = "12px";
  const nameEl = el("div", null, `${anrede}${name}`);
  nameEl.style.fontSize = "1.2rem";
  nameEl.style.fontWeight = "var(--weight-semibold)";
  kopf.appendChild(nameEl);
  const kopfMeta = [];
  if (s.grunddaten.alter != null) kopfMeta.push(`${s.grunddaten.alter} Jahre`);
  if (s.grunddaten.bmi) kopfMeta.push(`BMI ${s.grunddaten.bmi}`);
  if (s.vitalwerte) kopfMeta.push(s.vitalwerte);
  if (kopfMeta.length) kopf.appendChild(el("p", "field-hint", kopfMeta.join(" · ")));
  container.appendChild(kopf);

  // Sicherheitszeilen zuerst (Arztbrief-Konvention: Wichtiges nach oben)
  if (therapistMode && s.therapist.redFlags.length)
    markiert("⚠️ Red Flags", s.therapist.redFlags.map((r) => r.name || r.flag_id).join(", "), "var(--color-status-red)");
  if (s.warnzeichen && s.warnzeichen.length)
    markiert("⚠ Warnzeichen", s.warnzeichen.join(", "), "var(--color-status-yellow)");

  // 1) Vorstellungssatz mit Beschwerden
  const datum = s.sitzungDatum ? formatDatum(s.sitzungDatum) : formatDatum(new Date().toISOString().slice(0, 10));
  const beschTexte = s.beschwerden.map((b) => {
    const details = [];
    const anliegen = fmt("HB-001", b.id);
    if (anliegen) details.push(`„${anliegen}“`);
    if (fmt("HB-004", b.id)) details.push(`NRS ${fmt("HB-004", b.id)}/10`);
    if (fmt("HB-007", b.id)) details.push(`seit ${fmt("HB-007", b.id)}`);
    const prio = b.prioritaet ? ` (${b.prioritaet.kurz})` : "";
    const dx = therapistMode && b.verdacht.length ? `; V.a. ${diagnoseLabel(b.verdacht[0].label)}` : "";
    return `${b.region}${prio}${details.length ? " — " + details.join(", ") : ""}${dx}`;
  });
  // Globale 7-Tage-Schmerz-NRS (aus dem Ziele-Schritt) gehört in den
  // Bericht — auch wenn je Beschwerde (noch) kein Einzelwert erfasst ist.
  const nrsAvg = a["NRS-avg"] != null && a["NRS-avg"] !== "" ? ` Der Schmerz liegt im 7-Tage-Durchschnitt bei ${a["NRS-avg"]}/10 (NRS).` : "";
  absatz(
    (beschTexte.length
      ? `${anrede}${name} stellt sich am ${datum} in unserer Praxis vor mit: ${beschTexte.join("; ")}.`
      : `${anrede}${name} stellt sich am ${datum} zur ganzheitlichen Analyse in unserer Praxis vor.`) + nrsAvg
  );

  // 1b) Je Beschwerde ein Detail-Absatz (Sondre: „alles muss in die
  // Kompaktfassung"): Verlauf, Auslöser, bessernd/verschlimmernd und die
  // bisherige Therapie mit Dosierung (Anzahl × Frequenz) und Erfolg.
  s.beschwerden.forEach((b) => {
    const d = [];
    if (fmt("HB-008", b.id)) d.push(`Verlauf: ${fmt("HB-008", b.id)}`);
    if (fmt("HB-009", b.id)) d.push(`Auslöser: ${fmt("HB-009", b.id)}`);
    if (fmt("HB-010", b.id)) d.push(`am schlimmsten: ${fmt("HB-010", b.id)}`);
    if (fmt("HB-011", b.id)) d.push(`bessernd: ${fmt("HB-011", b.id)}`);
    if (fmt("HB-012", b.id)) d.push(`verschlimmernd: ${fmt("HB-012", b.id)}`);
    const th = [];
    THERAPIE_HISTORIE_MODALITAETEN.forEach((mod) => {
      const v = a[`${b.id}::${mod.id}`];
      if (v == null || v === "") return;
      const dosis = [
        formatAntwort(`${mod.id}-anzahl`, a[`${b.id}::${mod.id}-anzahl`]) ||
          formatAntwort(`${mod.id}-haeufigkeit`, a[`${b.id}::${mod.id}-haeufigkeit`]),
        formatAntwort(`${mod.id}-frequenz`, a[`${b.id}::${mod.id}-frequenz`]),
      ].filter(Boolean).join(", ");
      th.push(`${mod.label.split(" / ")[0]}${dosis ? ` (${dosis})` : ""}: ${formatAntwort(mod.id, v) || v}`);
    });
    if (th.length) d.push(`Bisherige Therapie — ${th.join("; ")}`);
    if (d.length) absatz(`Zur ${b.region}: ${d.join(". ")}.`);
  });

  // 2) Anamnese-Absatz (Vorerkrankungen, OPs, Traumen)
  const anamneseSaetze = [];
  const dg = s.vorgeschichte.diagnosen.map((d) => DIAGNOSE_LABEL[d] || d);
  if (dg.length) {
    const zusatz = [];
    if (fmt("PMH-001-DM")) zusatz.push(`Diabetes: ${fmt("PMH-001-DM")}${a["PMH-001-DM-INSULIN"] === true ? ", insulinpflichtig" : ""}`);
    if (fmt("PMH-001-HERZ")) zusatz.push(`Herz: ${fmt("PMH-001-HERZ")}`);
    anamneseSaetze.push(`An Vorerkrankungen bestehen: ${dg.join(", ")}${zusatz.length ? " (" + zusatz.join("; ") + ")" : ""}.`);
  }
  const ops = s.vorgeschichte.operationen.map((o) => [o.jahr, o.was].filter(Boolean).join(" ")).filter(Boolean);
  if (ops.length) anamneseSaetze.push(`Voroperationen: ${ops.join("; ")}.`);
  const unf = (s.vorgeschichte.unfaelle || []).map((o) => [o.jahr, o.was].filter(Boolean).join(" ")).filter(Boolean);
  if (unf.length) anamneseSaetze.push(`Traumen: ${unf.join("; ")}.`);
  absatz(anamneseSaetze.join(" "));

  // 3) Medikation & Allergien
  const medSaetze = [];
  const meds = s.vorgeschichte.medikamente.map((m) => m.medikament).filter(Boolean);
  const medWarn = [s.vorgeschichte.blutverduenner ? "⚠ Blutverdünner" : null, a["PMH-010"] === true ? "⚠ Kortison" : null].filter(Boolean);
  if (meds.length || medWarn.length)
    medSaetze.push(`Aktuelle Medikation: ${meds.length ? meds.join(", ") : "siehe Angaben"}${medWarn.length ? " — " + medWarn.join(", ") : ""}.`);
  if (s.vorgeschichte.allergien.length) medSaetze.push(`Allergien: ${s.vorgeschichte.allergien.join(", ")}.`);
  absatz(medSaetze.join(" "));

  // 4) Systeme & Lebensstil
  const sysAuffaellig = [];
  Object.keys(a).forEach((k) => {
    if (!k.startsWith("SYSG-")) return;
    if (a[k] !== "ja" && a[k] !== "unsicher") return;
    const def = getFrage(k);
    const label = def && def.group ? def.group.replace("Systemanamnese: ", "") : null;
    if (label) sysAuffaellig.push(label + (a[k] === "unsicher" ? " (unsicher)" : ""));
  });
  const teil4 = [];
  if (sysAuffaellig.length) teil4.push(`Systemanamnestisch auffällig: ${sysAuffaellig.join(", ")} (Details siehe vollständige Anamnese).`);
  const leben = [];
  if (fmt("D1-001")) leben.push(`Schlaf ${fmt("D1-001")}`);
  if (fmt("ERN-010")) leben.push(`Ernährung ${fmt("ERN-010")}`);
  if (fmt("SD-012")) leben.push(`Sport ${fmt("SD-012")}`);
  if (fmt("PMH-015")) leben.push(`Rauchen ${fmt("PMH-015")}`);
  if (fmt("PMH-016")) leben.push(`Alkohol ${fmt("PMH-016")}`);
  if (leben.length) teil4.push(`Lebensstil: ${leben.join(", ")}.`);
  absatz(teil4.join(" "));

  // 5) Befunde & Verlauf
  const teil5 = [];
  if (s.befundErkenntnisse && s.befundErkenntnisse.length)
    teil5.push(`Vorliegende Befunde: ${s.befundErkenntnisse.map((b) => `${b.fachbereich}: ${b.notiz}`).join("; ")}.`);
  else if (s.labor.uploads.length) teil5.push(`${s.labor.uploads.length} Befund-Dokument(e) hochgeladen (siehe Reiter Befunde).`);
  const tlEvents = s.timeline.filter((e) => e.jahr != null);
  if (tlEvents.length) teil5.push(`Relevanter Verlauf: ${tlEvents.map((e) => `${e.jahr} ${e.text}`.trim()).join("; ")}.`);
  absatz(teil5.join(" "));

  // 6) Ziele — die 7 Faktoren bleiben bewusst der vollständigen Anamnese
  // vorbehalten (Sondre: Kompakt = klinischer Bericht, kein Vitalprofil).
  if (s.ziele.length)
    absatz(`Behandlungsziele: ${s.ziele.map((z) => z.zielText).filter(Boolean).map((t) => `„${t}“`).join("; ")}.`);

  // 7) Günstige Zeichen (Green Flags)
  const green = computeGreenFlags(a, s, safetyStatus(a));
  if (green.length) markiert("🟢 Günstige Zeichen", green.join(" · "), "var(--color-status-green)");

  // Therapeuten-Absatz (nur im Therapeuten-Modus)
  if (therapistMode) {
    const rp = s.therapist.risikoprofil;
    const t = [];
    t.push(`PHQ-4 ${s.therapist.phq4.gesamt}/12 (${s.therapist.phq4.kategorie})`);
    t.push(`Yellow Flags ${s.therapist.yellowFlags.risiko}`);
    if (rp) t.push(AMPEL_TEXT[rp.gesamt.ampel]);
    if (rp && rp.gesamt.kontraindikationen.length) t.push("⛔ " + rp.gesamt.kontraindikationen.join(" · "));
    if (rp) t.push(`Fraktur ${rp.fraktur.stufe} · HWS-Manip. ${rp.hws_manipulation.klasse} · kardiovask. ${rp.kardiovaskulaer.stufe}`);
    markiert("Therapist only", t.join(" · "));
  }
}

// ── Reiter 3: Befund-Register (nach Fachbereich gruppiert) ─
function renderBefunde(container, s) {
  // Kernbefunde ganz oben — das Wichtigste zuerst.
  if (s.befundErkenntnisse && s.befundErkenntnisse.length) container.appendChild(befundErkenntnisseCard(s));

  if (!s.uploads.length) {
    if (!(s.befundErkenntnisse && s.befundErkenntnisse.length))
      container.appendChild(el("p", "field-hint", "Noch keine Befunde hochgeladen. Im ersten Schritt (Ihre Befunde) können Sie Ihre Unterlagen nach Fachrichtung hinterlegen — hier werden sie strukturiert gesammelt."));
    return;
  }

  // Nach Fachbereich gruppieren.
  const byFach = new Map();
  s.uploads.forEach((u) => {
    if (!byFach.has(u.fachbereich)) byFach.set(u.fachbereich, []);
    byFach.get(u.fachbereich).push(u);
  });

  byFach.forEach((eintraege, fachbereich) => {
    container.appendChild(el("div", "section-label", fachbereich));
    const card = el("div", "card");
    card.style.marginTop = "8px";
    card.style.marginBottom = "18px";
    eintraege
      .sort((a, b) => (a.datum < b.datum ? 1 : -1))
      .forEach((u) => {
        const row = el("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.gap = "12px";
        row.style.padding = "6px 0";
        row.style.borderBottom = "1px solid var(--color-border)";
        const left = el("span", null, `📎 ${u.file && typeof u.file === "object" ? u.file.name || "Datei" : u.file}`);
        left.style.fontSize = "var(--text-small)";
        const right = el("span", "field-hint", u.datum ? `hochgeladen ${formatDatum(u.datum)}` : u.label);
        row.appendChild(left);
        row.appendChild(right);
        card.appendChild(row);
      });
    container.appendChild(card);
  });

  container.appendChild(
    el(
      "p",
      "field-hint",
      "Ihre Befunde bleiben nach Fachrichtung geordnet gespeichert und einzeln abrufbar. In der fertigen Version liest die KI jeden Befund aus (Werte, Diagnosen) und ordnet ihn automatisch der richtigen Fachrichtung zu."
    )
  );
}

// ── Reiter 4: Gesundheits-Roadmap ─────────────────────────
function renderRoadmap(container, s) {
  renderTimeline(container, s.timeline);
}

// ── Reiter 5: Klinik (Therapeut) — Differentialdiagnose, Risikoprofil, Tests ─
function renderKlinik(container, s, therapistMode) {
  // Nur für Behandler:innen — für Patienten ausgeblendet.
  if (!therapistMode) {
    const hint = el("div", "card card--sunken");
    hint.appendChild(el("div", "section-label", "Für Ihre Behandler:innen"));
    hint.appendChild(
      el("p", "field-hint", "Diese Ansicht enthält Differentialdiagnosen, Risikoprofil und Vorschläge für klinische Sicherheits- und Untersuchungstests. Sie ist Ihrem Behandlungsteam vorbehalten. Über den Umschalter oben (Therapeuten-Vorschau) können Behandler:innen sie einsehen.")
    );
    container.appendChild(hint);
    return;
  }

  container.appendChild(
    el("p", "field-hint", "Entscheidungsunterstützung für die erste Untersuchung — keine fertige Diagnose. Aufbau der Untersuchungs-Batterie (aus der Anamnese zusammengestellt): 1. Safety-Tests (symptomgeleitet) → 2. orthopädisch/neurologische Basistests je Region → 3. spezifische Tests (osteopathische Short-Routine, Risikoprofil/Technikwahl, trainingstherapeutische Hinweise). Die Differentialdiagnosen sind deterministisch abgeleitet und vom Behandlungsteam zu verifizieren — die Tests dienen dazu, sie gezielt zu erhärten oder auszuschließen.")
  );

  // 1) Risikoprofil + Safety-/Technik-Tests (bereits kategorisiert ortho/neuro/osteo).
  renderRisikoprofil(container, s.therapist.risikoprofil);

  // 2) SAFETY FIRST — indikationsgesteuert. Nur die aus der Anamnese
  //    indizierten Gruppen werden hervorgehoben (z.B. Hirnnerven nur bei
  //    Seh-/Schwindel-/Kopfsymptomen).
  const indikationen = computeSafetyIndikationen(state.answers, s.beschwerden);
  const safeCard = sektion(container, "Safety First — symptomgeleitete Sicherheitstests");
  safeCard.appendChild(el("p", "field-hint", "Grün markiert = laut Anamnese indiziert. Übrige nur bei entsprechendem Befund."));
  SAFETY_TESTS.forEach((grp) => {
    const indiziert = indikationen.has(grp.indikationKey);
    const head = el("div", "section-label", (indiziert ? "● " : "○ ") + grp.gruppe + (indiziert ? " — indiziert" : ""));
    head.style.marginTop = "12px";
    head.style.color = indiziert ? "var(--color-status-green)" : "var(--color-text-muted)";
    safeCard.appendChild(head);
    safeCard.appendChild(el("p", "field-hint", "Wann: " + grp.indikation));
    if (indiziert) {
      safeCard.appendChild(
        tabelle(
          ["Test", "Positiv", "Konsequenz", "ICD-10"],
          grp.tests.map((t) => [t.name, t.positiv, t.konsequenz || "", t.icd10 || ""])
        )
      );
    }
  });

  // 3) Pro Beschwerde: Differentialdiagnose-Ranking + gelenkspezifische Basistests.
  s.beschwerden.forEach((b, i) => {
    const prio = b.prioritaet ? `${b.prioritaet.kurz} · ` : "";
    const card = sektion(container, `Differentialdiagnose — Beschwerde ${i + 1}: ${prio}${b.region}`);

    if (b.verdacht.length) {
      card.appendChild(el("div", "section-label", "Differentialdiagnosen — deterministisch aus der Anamnese abgeleitet, bitte klinisch verifizieren"));
      card.appendChild(
        tabelle(
          ["Verdachtsdiagnose", "Score"],
          b.verdacht.slice(0, 6).map((v) => [diagnoseLabel(v.label), String(v.score)])
        )
      );
    } else {
      card.appendChild(el("p", "field-hint", "Keine spezifische Verdachtsgewichtung — Screening ohne klare Verzweigung."));
    }

    const basis = getBasistestsFuerRegion(b.regionValue);
    if (basis && basis.tests.length) {
      const l = el("div", "section-label", "Klinische Basistests — " + basis.region);
      l.style.marginTop = "14px";
      card.appendChild(l);
      card.appendChild(
        tabelle(
          ["Test", "Positiv/Interpretation", "ICD-10"],
          basis.tests.map((t) => [t.name, t.positiv, t.icd10 || ""])
        )
      );
    }
  });

  // 3b) Vitalmedizin: Vitalstoff-/Supplement-Prüfliste (deterministisch).
  const vs = computeVitalstoffProfil(state.answers);
  if (vs.bmi || vs.pruefen.length || vs.beratung.length) {
    const vsCard = sektion(container, "Vitalmedizin — Vitalstoff- & Ernährungs-Prüfliste");
    vsCard.appendChild(
      el("p", "field-hint", "Aus der Ernährungs-/Medikamenten-/Zeichen-Anamnese abgeleitet. Prüfliste für Labor & Beratung — KEINE Dosierung ohne Laborbefund.")
    );
    if (vs.bmi) {
      const b = el("div", "section-label", `BMI: ${vs.bmi.wert} — ${vs.bmi.kategorie}`);
      b.style.marginTop = "8px";
      vsCard.appendChild(b);
    }
    if (vs.pruefen.length) {
      const l = el("div", "section-label", "Laborseitig prüfen");
      l.style.marginTop = "12px";
      vsCard.appendChild(l);
      vsCard.appendChild(
        tabelle(["Marker / Mikronährstoff", "Anlass (aus Anamnese)"], vs.pruefen.map((p) => [p.marker, p.gruende.join("; ")]))
      );
    }
    if (vs.beratung.length) {
      const l = el("div", "section-label", "Beratungspunkte");
      l.style.marginTop = "12px";
      vsCard.appendChild(l);
      const ul = el("ul");
      ul.style.margin = "4px 0 0";
      vs.beratung.forEach((p) => ul.appendChild(el("li", null, `${p.punkt} — ${p.gruende.join("; ")}`)));
      vsCard.appendChild(ul);
    }
  }

  // 3c) Vitalmedizin: Hormon-/Endokrin-Laborpanel-Prüfliste (deterministisch).
  const hz = computeHormonProfil(state.answers);
  if (hz.taille || hz.panel.length || hz.beratung.length) {
    const hzCard = sektion(container, "Vitalmedizin — Hormon-/Endokrin-Prüfliste");
    hzCard.appendChild(
      el("p", "field-hint", "Aus den Hormon-/Stoffwechsel-Symptomen abgeleitete Laborpanels zur ärztlichen Abklärung — KEINE Diagnose, keine Dosierung.")
    );
    if (hz.taille) {
      const t = el("div", "section-label", `Taille: ${hz.taille.wert} cm${hz.taille.erhoeht ? " — erhöht (metabolisches Risiko)" : ""}`);
      t.style.marginTop = "8px";
      t.style.color = hz.taille.erhoeht ? "var(--color-status-yellow)" : "var(--color-text-muted)";
      hzCard.appendChild(t);
    }
    if (hz.panel.length) {
      const l = el("div", "section-label", "Laborpanel prüfen");
      l.style.marginTop = "12px";
      hzCard.appendChild(l);
      hzCard.appendChild(
        tabelle(["Laborwert", "Anlass (aus Anamnese)"], hz.panel.map((p) => [p.marker, p.gruende.join("; ")]))
      );
    }
    if (hz.beratung.length) {
      const l = el("div", "section-label", "Beratungspunkte");
      l.style.marginTop = "12px";
      hzCard.appendChild(l);
      const ul = el("ul");
      ul.style.margin = "4px 0 0";
      hz.beratung.forEach((p) => ul.appendChild(el("li", null, `${p.punkt} — ${p.gruende.join("; ")}`)));
      hzCard.appendChild(ul);
    }
  }

  // 3d) Vitalmedizin: Darm-/Mikrobiom-Prüfliste (deterministisch).
  const dm = computeDarmProfil(state.answers);
  if (dm.pruefen.length || dm.beratung.length) {
    const dmCard = sektion(container, "Vitalmedizin — Darm- & Mikrobiom-Prüfliste");
    dmCard.appendChild(
      el("p", "field-hint", "Aus den Darm-/Mikrobiom-Antworten abgeleitete Diagnostik- und Maßnahmenvorschläge — keine Diagnose.")
    );
    if (dm.pruefen.length) {
      const l = el("div", "section-label", "Diagnostik erwägen");
      l.style.marginTop = "12px";
      dmCard.appendChild(l);
      dmCard.appendChild(
        tabelle(["Untersuchung", "Anlass (aus Anamnese)"], dm.pruefen.map((p) => [p.marker, p.gruende.join("; ")]))
      );
    }
    if (dm.beratung.length) {
      const l = el("div", "section-label", "Ernährungs-/Mikrobiom-Maßnahmen");
      l.style.marginTop = "12px";
      dmCard.appendChild(l);
      const ul = el("ul");
      ul.style.margin = "4px 0 0";
      dm.beratung.forEach((p) => ul.appendChild(el("li", null, `${p.punkt} — ${p.gruende.join("; ")}`)));
      dmCard.appendChild(ul);
    }
  }

  // 3e) Vitalmedizin: Immun-/Entzündungs-Prüfliste (deterministisch).
  const im = computeImmunProfil(state.answers);
  if (im.pruefen.length || im.beratung.length) {
    const imCard = sektion(container, "Vitalmedizin — Immun- & Entzündungs-Prüfliste");
    imCard.appendChild(
      el("p", "field-hint", "Aus Immun-/Entzündungs-/Allergie-Angaben abgeleitete Diagnostik-Vorschläge — keine Diagnose.")
    );
    if (im.pruefen.length) {
      const l = el("div", "section-label", "Diagnostik erwägen");
      l.style.marginTop = "12px";
      imCard.appendChild(l);
      imCard.appendChild(
        tabelle(["Untersuchung", "Anlass (aus Anamnese)"], im.pruefen.map((p) => [p.marker, p.gruende.join("; ")]))
      );
    }
    if (im.beratung.length) {
      const l = el("div", "section-label", "Maßnahmen");
      l.style.marginTop = "12px";
      imCard.appendChild(l);
      const ul = el("ul");
      ul.style.margin = "4px 0 0";
      im.beratung.forEach((p) => ul.appendChild(el("li", null, `${p.punkt} — ${p.gruende.join("; ")}`)));
      imCard.appendChild(ul);
    }
  }

  // 3f) Vitalmedizin: Licht- & Circadian-Hygiene (deterministisch).
  const li = computeLichtProfil(state.answers);
  if (li.pruefen.length || li.beratung.length) {
    const liCard = sektion(container, "Vitalmedizin — Licht- & Circadian-Hygiene");
    liCard.appendChild(
      el("p", "field-hint", "Aus Licht-/Rhythmus-/Schichtangaben abgeleitete Hygiene- und Diagnostik-Vorschläge — keine Diagnose. Experimentelle Angaben (Frontier/Biohacking) fließen bewusst nicht ein.")
    );
    if (li.pruefen.length) {
      const l = el("div", "section-label", "Diagnostik erwägen");
      l.style.marginTop = "12px";
      liCard.appendChild(l);
      liCard.appendChild(
        tabelle(["Untersuchung", "Anlass (aus Anamnese)"], li.pruefen.map((p) => [p.marker, p.gruende.join("; ")]))
      );
    }
    if (li.beratung.length) {
      const l = el("div", "section-label", "Licht-/Circadian-Maßnahmen");
      l.style.marginTop = "12px";
      liCard.appendChild(l);
      const ul = el("ul");
      ul.style.margin = "4px 0 0";
      li.beratung.forEach((p) => ul.appendChild(el("li", null, `${p.punkt} — ${p.gruende.join("; ")}`)));
      liCard.appendChild(ul);
    }
  }

  // 4) Osteopathische Short-Routine — wird ohnehin vollständig durchgeführt.
  const osteo = sektion(container, "Osteopathische Short-Routine (immer vollständig)");
  osteo.appendChild(el("p", "field-hint", OSTEO_ROUTINE.prinzip));
  OSTEO_ROUTINE.phasen.forEach((p) => {
    const h = el("div", "section-label", p.phase);
    h.style.marginTop = "10px";
    osteo.appendChild(h);
    const ul = el("ul");
    ul.style.margin = "4px 0 0";
    p.schritte.forEach((s2) => ul.appendChild(el("li", null, s2)));
    osteo.appendChild(ul);
  });
}

// ── Reiter 6: Diagnosen (gesichert aus Befunden + Differential mit ICD-10) ─
function renderDiagnosen(container, s, therapistMode) {
  container.appendChild(
    el("p", "field-hint", "Übersicht der gesicherten Diagnosen (aus Anamnese & Befunden) und der offenen Verdachtsdiagnosen — mit ICD-10, als Grundlage für die spätere Diagnosestellung.")
  );

  // 1) Gesicherte Diagnosen — auch für Patient sichtbar (eigene Daten).
  const gesichert = getGesicherteDiagnosen(state.answers, s.uploads);
  const gCard = sektion(container, "Gesicherte Diagnosen (Anamnese & Befunde)");
  if (gesichert.length) {
    gCard.appendChild(
      tabelle(["Diagnose", "ICD-10", "Quelle"], gesichert.map((d) => [d.name, d.icd10 || "—", d.quelle]))
    );
  } else {
    gCard.appendChild(el("p", "field-hint", "Keine gesicherten Diagnosen aus der Anamnese hinterlegt."));
  }
  // Hochgeladene Befunde als Quellen (Radiologie/OP/Labor) — KI-Auslesen ist Roadmap.
  const befundQuellen = (s.uploads || []).filter((u) =>
    ["Radiologie", "OP & Klinik", "Labormedizin", "Kardiologie", "Neurologie", "Orthopädie"].includes(u.fachbereich)
  );
  if (befundQuellen.length) {
    const dateiName = (f) => (f && typeof f === "object" ? f.name || "Datei" : f);
    gCard.appendChild(el("p", "field-hint", `Zugrunde liegende Befunde (${befundQuellen.length}): ` + befundQuellen.map((u) => `${u.fachbereich} — ${dateiName(u.file)}`).join("; ")));
    gCard.appendChild(el("p", "field-hint", "In der fertigen Version liest die KI Diagnosen inkl. ICD-10 direkt aus diesen Berichten aus und ergänzt sie hier automatisch."));
  }

  // 2) Differentialdiagnosen (Verdacht) — nur Therapeut, testbestätigungspflichtig.
  if (!therapistMode) {
    const note = el("div", "card card--sunken");
    note.style.marginTop = "16px";
    note.appendChild(el("p", "field-hint", "Verdachts-/Differentialdiagnosen sind Ihrem Behandlungsteam vorbehalten und werden erst nach klinischer Untersuchung gesetzt."));
    container.appendChild(note);
    return;
  }

  s.beschwerden.forEach((b, i) => {
    if (!b.verdacht.length) return;
    const prio = b.prioritaet ? `${b.prioritaet.kurz} · ` : "";
    const card = sektion(container, `Differentialdiagnosen — Beschwerde ${i + 1}: ${prio}${b.region}`);
    card.appendChild(
      tabelle(
        ["Verdachtsdiagnose", "ICD-10", "Score"],
        b.verdacht.slice(0, 6).map((v) => [diagnoseLabel(v.label), diagnoseICD10(v.label) || "—", String(v.score)])
      )
    );
  });
  container.appendChild(
    el("p", "field-hint", "⚠ Verdachtsdiagnosen aus der Anamnese abgeleitet — müssen durch die klinischen Tests (Reiter Klinik) bestätigt oder ausgeschlossen werden, bevor sie als Diagnose gesetzt werden.")
  );
}

const TABS = [
  { id: "vollstaendig", label: "Vollständig", titel: "Vollständige Anamnese", render: renderVollstaendig },
  { id: "kompakt", label: "Kompakt", titel: "Kompakt-Zusammenfassung", render: renderKompakt },
  { id: "befunde", label: "Befunde", titel: "Befund-Register", render: renderBefunde },
  { id: "diagnosen", label: "Diagnosen", titel: "Diagnosen — gesichert & Differential (ICD-10)", render: renderDiagnosen },
  { id: "verlauf", label: "Verlauf", titel: "Gesundheits-Verlauf", render: renderRoadmap },
  { id: "klinik", label: "Klinik (Therapeut)", titel: "Klinik — Differentialdiagnose, Risikoprofil & Tests", render: renderKlinik },
];

export function registerAbschlussStep() {
  registerStep({
    id: "abschluss",
    group: "Zusammenfassung",
    eyebrow: "Fast geschafft",
    title: "Ihre Zusammenfassung",
    subtitle: "Vielen Dank! Alles Wichtige übersichtlich in vier Ansichten.",
    estMinutes: 1,
    render(container) {
      function draw() {
        container.innerHTML = "";
        const s = computeSummary();
        const therapistMode = state.meta.therapistPreview === true;
        const activeTab = state.meta.summaryTab || "kompakt";

        // Steuerleiste
        const controls = el("div", "no-print");
        controls.style.display = "flex";
        controls.style.gap = "8px";
        controls.style.flexWrap = "wrap";
        controls.style.marginBottom = "16px";
        const toggle = el("button", "btn btn--ghost", therapistMode ? "→ Patienten-Ansicht" : "→ Therapeuten-Vorschau");
        toggle.type = "button";
        toggle.addEventListener("click", () => state.setMeta({ therapistPreview: !therapistMode }));
        const printBtn = el("button", "btn btn--primary", "🖨 Drucken / als PDF speichern");
        printBtn.type = "button";
        printBtn.addEventListener("click", () => window.print());
        controls.appendChild(toggle);
        controls.appendChild(printBtn);
        container.appendChild(controls);

        // Longitudinale Akte: Sitzung übernehmen / neue Sitzung starten.
        const akteControls = el("div", "no-print");
        akteControls.style.display = "flex";
        akteControls.style.gap = "8px";
        akteControls.style.flexWrap = "wrap";
        akteControls.style.marginBottom = "16px";
        // Lebende Akte, verständlich erklärt: Datum läuft automatisch; bei
        // einem späteren Besuch wird ERGÄNZT, nicht neu begonnen.
        const akteHint = el("p", "field-hint",
          "Ihre Anamnese wird mit dem heutigen Datum in Ihrer Gesundheitsakte gespeichert. " +
          "Kommt später etwas Neues dazu (neue Beschwerde, neues Ereignis, neuer Befund), melden Sie sich einfach wieder an und ergänzen es — " +
          "Ihre Grunddaten und Ihre bisherige Historie bleiben erhalten, nichts muss doppelt ausgefüllt werden.");
        akteHint.style.width = "100%";
        akteHint.style.margin = "0 0 6px";
        akteControls.appendChild(akteHint);
        const uebernehmen = el("button", "btn btn--primary", state.meta.sitzungArchiviert ? "✓ In Akte übernommen" : "In meine Gesundheitsakte übernehmen");
        uebernehmen.type = "button";
        uebernehmen.disabled = state.meta.sitzungArchiviert === true;
        uebernehmen.addEventListener("click", () => {
          archiviereSitzung();
          state.setMeta({ sitzungArchiviert: true });
        });
        akteControls.appendChild(uebernehmen);
        if (state.meta.sitzungArchiviert) {
          const neu = el("button", "btn btn--ghost", "+ Neue Beschwerde / späterer Besuch");
          neu.type = "button";
          neu.addEventListener("click", () => {
            starteNeueSitzung();
            state.setMeta({ currentStepIndex: 0, sitzungArchiviert: false, therapistPreview: false });
          });
          akteControls.appendChild(neu);
        }
        container.appendChild(akteControls);

        if (therapistMode) {
          const warn = el("div", "alert-banner alert-banner--warning no-print");
          warn.appendChild(el("p", null, "Therapeuten-Vorschau (Prototyp) — enthält DSGVO-relevante therapist_only-Inhalte. Echte Zugriffskontrolle folgt mit Supabase."));
          container.appendChild(warn);
        }

        // Tab-Leiste
        const tabbar = el("div", "no-print");
        tabbar.style.display = "flex";
        tabbar.style.gap = "4px";
        tabbar.style.flexWrap = "wrap";
        tabbar.style.marginBottom = "20px";
        tabbar.style.borderBottom = "1px solid var(--color-border)";
        TABS.forEach((tab) => {
          const btn = el("button", "btn btn--ghost", tab.label);
          btn.type = "button";
          if (tab.id === activeTab) {
            btn.style.color = "var(--color-forest-800)";
            btn.style.fontWeight = "var(--weight-semibold)";
            btn.style.borderBottom = "2px solid var(--color-forest-800)";
            btn.style.borderRadius = "0";
          }
          btn.addEventListener("click", () => state.setMeta({ summaryTab: tab.id }));
          tabbar.appendChild(btn);
        });
        container.appendChild(tabbar);

        // Aktiver Tab
        const content = el("div");
        container.appendChild(content);
        const tabDef = TABS.find((t) => t.id === activeTab) || TABS[0];
        // Druck-Titel des aktiven Reiters
        const h = el("h2", "step-title", tabDef.titel);
        h.style.fontSize = "var(--text-h1)";
        content.appendChild(h);
        tabDef.render(content, s, therapistMode);
      }

      draw();
      return state.subscribe(draw);
    },
  });
}
