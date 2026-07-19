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
import { archiviereSitzung, starteNeueSitzung } from "../patient-record.js";
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

// ── Reiter 1: Vollständig — ALLES, was angekreuzt/eingegeben wurde ─────────
function renderVollstaendig(container, s, therapistMode) {
  const a = state.answers;

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

  const name = [s.grunddaten.vorname, s.grunddaten.nachname].filter(Boolean).join(" ");
  if (name) {
    const kopf = sektion(container, "Patient");
    kopf.appendChild(el("p", null, name));
  }

  // Behandlungsziele (strukturiert aus meta).
  if (s.ziele.length) {
    const z = sektion(container, "Behandlungsziele");
    s.ziele.forEach((ziel) => {
      const row = el("div");
      row.style.marginBottom = "8px";
      row.appendChild(el("strong", null, ziel.zielText || "Ziel"));
      row.appendChild(el("p", "field-hint", [ziel.lebensbereich, ziel.fokus, ziel.zeitrahmen].filter(Boolean).join(" · ")));
      z.appendChild(row);
    });
  }

  // Pro Beschwerde: ALLE namespaced Antworten (W-Fragen + regionsspezifischer
  // CDSS-Deep-Dive + Vorbehandlungen), in stabiler Index-Reihenfolge.
  s.beschwerden.forEach((b, i) => {
    const prio = b.prioritaet ? `${b.prioritaet.kurz} ${b.prioritaet.label} · ` : "";
    const c = sektion(container, `Beschwerde ${i + 1}: ${prio}${b.region}`);
    let count = 0;
    Object.keys(INDEX).forEach((id) => {
      const key = `${b.id}::${id}`;
      if (!(key in a)) return;
      const txt = formatAntwort(id, a[key]);
      if (txt == null) return;
      qaRow(c, getFrage(id).label, txt);
      count++;
    });
    if (!count) c.appendChild(el("p", "field-hint", "—"));
    if (therapistMode && b.verdacht.length) {
      const v = el("p", "field-hint", "CDSS-Verdacht: " + b.verdacht.slice(0, 5).map((x) => `${x.label} (${x.score})`).join(", "));
      v.style.marginTop = "8px";
      c.appendChild(v);
    }
  });

  // Globaler Dump: jede beantwortete Frage aller Module, gruppiert (stabile
  // Reihenfolge aus dem Frage-Index). PHQ-4-Rohwerte bleiben therapist_only
  // (separater Abschnitt unten).
  const gruppen = new Map();
  Object.keys(INDEX).forEach((id) => {
    if (id.startsWith("PHQ4-")) return;
    // Beschwerde-Fragen erscheinen pro Beschwerde-Akte oben (namespaced) —
    // globale Legacy-Kopien (z.B. HB-002) hier nicht doppeln.
    if (INDEX[id].group === "Beschwerde") return;
    if (!(id in a)) return;
    const txt = formatAntwort(id, a[id]);
    if (txt == null) return;
    const g = INDEX[id].group || "Weitere Angaben";
    if (!gruppen.has(g)) gruppen.set(g, []);
    gruppen.get(g).push([INDEX[id].label, txt]);
  });
  gruppen.forEach((rows, g) => {
    const card = sektion(container, g);
    rows.forEach(([q, v]) => qaRow(card, q, v));
  });

  // Befund-Erkenntnisse aus hochgeladenen Dokumenten.
  if (s.befundErkenntnisse && s.befundErkenntnisse.length) container.appendChild(befundErkenntnisseCard(s));

  // Labor: Uploads-Hinweis + funktionelle Referenzbereiche (nur Therapeut).
  if (s.labor.hatDaten) {
    const lab = sektion(container, "Labor & Marker");
    if (s.labor.uploads.length) {
      lab.appendChild(el("p", "field-hint", `${s.labor.uploads.length} Labor-/Ernährungs-Befund(e) hochgeladen — siehe Reiter Befunde.`));
    }
    if (therapistMode) {
      const ref = el("div");
      ref.style.marginTop = "10px";
      ref.appendChild(el("p", "field-hint", "Funktionelle Referenzbereiche (Optimierung, enger als Laborreferenz) — Interpretationshilfe, keine Diagnostik:"));
      FUNKTIONELLE_MARKER.forEach((g) => {
        const gl = el("div", "section-label", g.gruppe);
        gl.style.marginTop = "10px";
        ref.appendChild(gl);
        ref.appendChild(
          tabelle(
            ["Marker", "Laborref.", "Funktionell", "Bedeutung"],
            g.marker.map((m) => [`${m.name}${m.einheit ? " (" + m.einheit + ")" : ""}`, m.laborRef, m.funktionell, m.hinweis])
          )
        );
      });
      lab.appendChild(ref);
    }
  }

  const f = sektion(container, "Vitalitätsprofil (7 Faktoren)");
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

  if (therapistMode) {
    const t = sektion(container, "Therapist only — Psychometrie & Sicherheit");
    if (s.therapist.redFlags.length) {
      t.appendChild(el("p", null, "⚠️ Red Flags: " + s.therapist.redFlags.map((r) => r.name || r.flag_id).join(", ")));
    }
    t.appendChild(el("p", "field-hint", `PHQ-4: ${s.therapist.phq4.gesamt}/12 (${s.therapist.phq4.kategorie})`));
    t.appendChild(el("p", "field-hint", `Yellow Flags: ${s.therapist.yellowFlags.risiko} (Score ${s.therapist.yellowFlags.score})`));

    renderRisikoprofil(container, s.therapist.risikoprofil);
  }
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

// ── Reiter 2: Kompakt — visuelles Dashboard ───────────────
function renderKompakt(container, s, therapistMode) {
  container.appendChild(
    el("p", "field-hint", "Überblick für Behandler & als portable Patientenakte. Oben Druck-Knopf zum Speichern/Drucken.")
  );

  // Kopf: Name + Kennzahlen als Chips
  const head = dashCard();
  const name = [s.grunddaten.vorname, s.grunddaten.nachname].filter(Boolean).join(" ");
  const nameEl = el("div");
  nameEl.style.fontSize = "1.25rem";
  nameEl.style.fontWeight = "var(--weight-semibold)";
  nameEl.textContent = name || "Patient:in";
  head.appendChild(nameEl);
  const hRow = chipRow();
  if (s.grunddaten.alter != null) hRow.appendChild(chip(`${s.grunddaten.alter} J.`));
  if (s.grunddaten.geschlecht) hRow.appendChild(chip(s.grunddaten.geschlecht === "m" ? "♂ männlich" : s.grunddaten.geschlecht === "f" ? "♀ weiblich" : s.grunddaten.geschlecht));
  if (s.grunddaten.bmi) hRow.appendChild(chip(`BMI ${s.grunddaten.bmi}`));
  if (s.sitzungDatum) hRow.appendChild(chip("📅 " + formatDatum(s.sitzungDatum)));
  if (s.vitalwerte) s.vitalwerte.split(" · ").forEach((v) => hRow.appendChild(chip(v, { bg: "var(--color-sage-100, #eef3ee)" })));
  head.appendChild(hRow);
  container.appendChild(head);

  // Befund-Erkenntnisse (auffällige Laborwerte etc.) — sehr wichtig, oben.
  if (s.befundErkenntnisse && s.befundErkenntnisse.length) container.appendChild(befundErkenntnisseCard(s));

  // Warnbanner (Red Flags therapist, dann B-Symptomatik)
  if (therapistMode && s.therapist.redFlags.length) {
    container.appendChild(banner("Red Flags: " + s.therapist.redFlags.map((r) => r.name || r.flag_id).join(", "), "var(--color-status-red)", "⚠️"));
  }
  if (s.warnzeichen && s.warnzeichen.length) {
    container.appendChild(banner("Warnzeichen: " + s.warnzeichen.join(", "), "var(--color-status-yellow)", "⚠"));
  }

  // Beschwerde-Karten (priorisiert, mit Schmerz-Gauge)
  if (s.beschwerden.length) {
    const grid = el("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(240px, 1fr))";
    grid.style.gap = "12px";
    grid.style.marginBottom = "14px";
    s.beschwerden.forEach((b) => {
      const pc = el("div", "card");
      pc.style.margin = "0";
      const prioKurz = b.prioritaet ? b.prioritaet.kurz : null;
      pc.style.borderTop = "3px solid " + (prioKurz ? PRIO_FARBE[prioKurz] : "var(--color-border)");
      const top = el("div");
      top.style.display = "flex";
      top.style.justifyContent = "space-between";
      top.style.alignItems = "center";
      const reg = el("strong", null, b.region);
      top.appendChild(reg);
      if (prioKurz) {
        const badge = chip(prioKurz + (b.prioritaet.label ? " " + b.prioritaet.label : ""), { bg: PRIO_FARBE[prioKurz], fg: "#fff" });
        badge.style.margin = "0";
        top.appendChild(badge);
      }
      pc.appendChild(top);
      // Schmerz-Gauge
      if (b.schmerz_vas != null) {
        const g = el("div");
        g.style.margin = "10px 0 6px";
        const track = el("div");
        track.style.height = "8px";
        track.style.borderRadius = "999px";
        track.style.background = "var(--color-surface-sunken)";
        track.style.overflow = "hidden";
        const fill = el("div");
        fill.style.height = "100%";
        fill.style.width = b.schmerz_vas * 10 + "%";
        fill.style.background = schmerzFarbe(b.schmerz_vas);
        track.appendChild(fill);
        g.appendChild(track);
        const lbl = el("div", "field-hint", `Schmerz ${b.schmerz_vas}/10`);
        lbl.style.fontSize = "0.72rem";
        lbl.style.marginTop = "3px";
        g.appendChild(lbl);
        pc.appendChild(g);
      }
      if (b.charakter && b.charakter.length) {
        const cr = chipRow();
        b.charakter.slice(0, 4).forEach((ch) => cr.appendChild(chip(ch)));
        pc.appendChild(cr);
      }
      if (therapistMode && b.verdacht.length) {
        const v = el("p", "field-hint", "→ " + diagnoseLabel(b.verdacht[0].label));
        v.style.margin = "6px 0 0";
        v.style.color = "var(--color-secondary)";
        pc.appendChild(v);
      }
      grid.appendChild(pc);
    });
    container.appendChild(grid);
  }

  // Zwei-Spalten: Vitalitätsprofil (Radar) | Ziele + Vorgeschichte
  const cols = el("div");
  cols.style.display = "grid";
  cols.style.gridTemplateColumns = "repeat(auto-fit, minmax(260px, 1fr))";
  cols.style.gap = "12px";
  cols.style.marginBottom = "14px";

  // Radar
  const vitCard = dashCard("Vitalitätsprofil (7 Faktoren)");
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.maxWidth = "260px";
  canvas.style.display = "block";
  canvas.style.margin = "0 auto";
  vitCard.appendChild(canvas);
  const chartProfil = {};
  FAKTOR_KEYS.forEach((k) => (chartProfil[k] = s.faktoren[k] == null ? null : s.faktoren[k] / 10));
  requestAnimationFrame(() => renderRadarChart(canvas, chartProfil));
  cols.appendChild(vitCard);

  // Ziele + Vorgeschichte
  const infoCard = dashCard("Ziele & Vorgeschichte");
  if (s.ziele.length) {
    const zl = el("div");
    zl.appendChild(el("strong", null, "🎯 Ziele"));
    const ul = el("ul");
    ul.style.margin = "4px 0 10px";
    s.ziele.forEach((z) => z.zielText && ul.appendChild(el("li", null, z.zielText)));
    zl.appendChild(ul);
    infoCard.appendChild(zl);
  }
  const dg = s.vorgeschichte.diagnosen.map((d) => DIAGNOSE_LABEL[d] || d);
  if (dg.length || s.vorgeschichte.blutverduenner || s.vorgeschichte.allergien.length) {
    const vgRow = chipRow();
    dg.forEach((d) => vgRow.appendChild(chip(d, { bg: "color-mix(in srgb, var(--color-camel, #a07e57) 14%, transparent)" })));
    if (s.vorgeschichte.blutverduenner) vgRow.appendChild(chip("⚠ Blutverdünner", { bg: "color-mix(in srgb, var(--color-status-red) 14%, transparent)", fg: "var(--color-status-red)" }));
    if (s.vorgeschichte.allergien.length) vgRow.appendChild(chip("Allergien"));
    infoCard.appendChild(vgRow);
  }
  const meds = s.vorgeschichte.medikamente.map((m) => m.medikament).filter(Boolean);
  if (meds.length) infoCard.appendChild(el("p", "field-hint", "💊 " + meds.join(", ")));
  const ops = s.vorgeschichte.operationen.map((o) => [o.jahr, o.was].filter(Boolean).join(" ")).filter(Boolean);
  if (ops.length) infoCard.appendChild(el("p", "field-hint", "🏥 OPs: " + ops.join("; ")));
  if (s.labor.patientBekannt) infoCard.appendChild(el("p", "field-hint", "🧪 Labor: " + s.labor.patientBekannt));
  cols.appendChild(infoCard);
  container.appendChild(cols);

  // Verlauf als horizontaler Strip
  const tlEvents = s.timeline.filter((e) => e.jahr != null);
  if (tlEvents.length) {
    const tc = dashCard("Verlauf");
    const strip = el("div");
    strip.style.display = "flex";
    strip.style.flexWrap = "wrap";
    strip.style.gap = "6px";
    tlEvents.forEach((e) => {
      const item = chip(`${e.jahr} · ${e.icon || ""} ${e.text}`.trim());
      item.style.fontSize = "0.75rem";
      strip.appendChild(item);
    });
    tc.appendChild(strip);
    container.appendChild(tc);
  }

  // Therapeuten-Band: Risikoprofil-Ampel + Psychometrie
  if (therapistMode) {
    const rp = s.therapist.risikoprofil;
    const tb = dashCard("Therapist only");
    const row = chipRow();
    row.appendChild(chip(`PHQ-4 ${s.therapist.phq4.gesamt}/12 · ${s.therapist.phq4.kategorie}`));
    row.appendChild(chip(`Yellow Flags ${s.therapist.yellowFlags.risiko}`));
    if (rp) {
      const ampelFarbe = AMPEL_FARBE[rp.gesamt.ampel];
      row.appendChild(chip("Risiko: " + AMPEL_TEXT[rp.gesamt.ampel], { bg: "color-mix(in srgb, " + ampelFarbe + " 16%, transparent)", fg: ampelFarbe }));
    }
    tb.appendChild(row);
    if (rp && rp.gesamt.kontraindikationen.length) {
      const k = el("p", null, "⛔ " + rp.gesamt.kontraindikationen.join(" · "));
      k.style.color = "var(--color-status-red)";
      k.style.fontWeight = "var(--weight-medium)";
      tb.appendChild(k);
    }
    if (rp) tb.appendChild(el("p", "field-hint", `Fraktur ${rp.fraktur.stufe} · HWS-Manip. ${rp.hws_manipulation.klasse} · kardiovask. ${rp.kardiovaskulaer.stufe}`));
    container.appendChild(tb);
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
    el("p", "field-hint", "Entscheidungsunterstützung für die erste Untersuchung — keine fertige Diagnose. Die Tests dienen dazu, die Verdachtsdiagnosen gezielt zu erhärten oder auszuschließen und sicher zu behandeln.")
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
      card.appendChild(el("div", "section-label", "Verdacht (aus Anamnese abgeleitet)"));
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
