/**
 * LINDEBERGS OS — Auswertung / Zusammenfassung
 *
 * Trägt alle Antworten deterministisch zu einem strukturierten Ergebnis
 * zusammen. Gleiche Eingaben → identisches Ergebnis (Kernanforderung:
 * „10 Patienten mit gleicher Symptomatik → gleiche Ergebnisse").
 *
 * Trennt bewusst in patientenSichtbar vs. therapeutOnly.
 */

import { state } from "./state.js";
import { getBeschwerden } from "./beschwerde-store.js";
import { computeAllActiveRegionsPerBeschwerde } from "./cdss-engine.js";
import { compute7FaktorenAbgeleitet } from "./faktoren-mapping.js";
import { checkAllRedFlags } from "./redflags.js";
import { ladeAkte } from "./patient-record.js";
import { computeRisikoprofil } from "./risikoprofil.js";
import { diagnoseLabel } from "./klinik.js";
import { computeYellowFlags } from "../data/A05_psychosozial_mental.js";
import { computeBMI, getBMIKategorie, computeAlter } from "../data/A00_stammdaten.js";
import { HAUPTBESCHWERDE_FRAGEN } from "../data/A01_hauptbeschwerde.js";
import { UPLOAD_KATEGORIEN } from "../data/A00c_uploads.js";
import { ZEITRAHMEN_OPTIONEN } from "../data/A00b_ziele.js";
import { getZielKategorie } from "../data/A24_ziele_prom.js";

/**
 * Alle Sitzungen (archivierte Akte + aktuelle Arbeits-Sitzung), dedupliziert
 * nach sessionId, chronologisch. Grundlage für die longitudinale Sicht.
 */
function alleSitzungen() {
  const akte = ladeAkte();
  const sitzungen = [...akte.sitzungen];
  const aktuelleId = state.meta.sessionId;
  const schonArchiviert = sitzungen.some((s) => s.sessionId === aktuelleId);
  if (!schonArchiviert) {
    sitzungen.push({
      sessionId: aktuelleId,
      datum: state.meta.sessionDatum || new Date().toISOString().slice(0, 10),
      tiefe: state.meta.anamneseTiefe,
      answers: state.answers,
      beschwerden: state.meta.beschwerden || [],
      ziele: state.meta.ziele || [],
      _aktuell: true,
    });
  }
  sitzungen.sort((a, b) => (a.datum < b.datum ? -1 : a.datum > b.datum ? 1 : 0));
  return sitzungen;
}

const REGION_LABEL = Object.fromEntries(
  HAUPTBESCHWERDE_FRAGEN.find((f) => f.id === "HB-002").regions.map((r) => [r.value, r.label])
);

function schmerzcharakterLabels(werte) {
  const q = HAUPTBESCHWERDE_FRAGEN.find((f) => f.id === "HB-003");
  const map = Object.fromEntries(q.options.map((o) => [o.value, o.label]));
  return (werte || []).map((v) => map[v] || v);
}

const PRIORITAET_INFO = {
  p1: { rang: 1, kurz: "P1", label: "Hauptfokus" },
  p2: { rang: 2, kurz: "P2", label: "Wichtig" },
  p3: { rang: 3, kurz: "P3", label: "Nebenproblem" },
  p4: { rang: 4, kurz: "P4", label: "Hinweis" },
};
function prioritaetInfo(value) {
  return PRIORITAET_INFO[value] || null;
}

/** Rangierte CDSS-Verdachtsliste pro Beschwerde aus akkumulierten Gewichten. */
function rankedVerdacht(cdss_gewichte) {
  return Object.entries(cdss_gewichte || {})
    .sort((a, b) => b[1] - a[1])
    .map(([label, score]) => ({ label, score }));
}

export function computeSummary() {
  const a = state.answers;

  // ── Grunddaten ──────────────────────────────────────────
  const bmi = computeBMI(a["SD-007"], a["SD-008"]);
  const grunddaten = {
    vorname: a["SD-001"],
    nachname: a["SD-002"],
    alter: computeAlter(a["SD-003"]),
    geschlecht: a["SD-004"],
    bmi,
    bmi_kategorie: getBMIKategorie(bmi)?.kat,
    beruf: a["SD-009"],
  };

  // ── Ziele (PROM, kategoriegesteuert — A24) ──────────────
  const zeitrahmenLabel = (v) => (ZEITRAHMEN_OPTIONEN.find((o) => o.value === v) || {}).label || v;
  const ziele = (state.meta.ziele || [])
    .filter((z) => z.kategorie || z.aktivitaet || z.lebensbereich)
    .map((z) => {
      const kat = getZielKategorie(z.kategorie);
      const messwerte = [];
      if (z.baseline != null) messwerte.push(`Baseline ${z.baseline}/10`);
      if (z.baseline != null && z.target != null) messwerte.push(`Ziel ${z.target}/10`);
      if (z.zielgewicht) messwerte.push(`Zielgewicht ${z.zielgewicht} kg`);
      return {
        zielText: z.aktivitaet || (kat ? kat.label : "Ziel"),
        kategorieLabel: kat ? `${kat.icon} ${kat.label}` : null,
        // Abschluss-Kompatibilität: alte Renderer lesen lebensbereich/fokus.
        lebensbereich: kat ? kat.label : z.lebensbereich || null,
        fokus: messwerte.join(" · ") || null,
        zeitrahmen: z.zeitrahmen === "zu_termin" && z.zieldatum ? `bis ${z.zieldatum}` : zeitrahmenLabel(z.zeitrahmen),
        warum: z.warum || null,
      };
    });

  // ── Beschwerden + CDSS-Verdacht pro Beschwerde ──────────
  const cdssPerBeschwerde = computeAllActiveRegionsPerBeschwerde(a);
  const beschwerden = getBeschwerden()
    .filter((b) => b.region)
    .map((b) => {
      const gewichteMerged = {};
      cdssPerBeschwerde
        .filter((r) => r.beschwerdeId === b.id)
        .forEach((r) => Object.assign(gewichteMerged, r.cdss_gewichte));
      return {
        id: b.id,
        region: REGION_LABEL[b.region] || b.region,
        regionValue: b.region,
        prioritaet: prioritaetInfo(a[`${b.id}::prioritaet`]),
        hauptanliegen: a[`${b.id}::HB-001`],
        schmerz_vas: a[`${b.id}::HB-004`],
        charakter: schmerzcharakterLabels(a[`${b.id}::HB-003`]),
        verdacht: rankedVerdacht(gewichteMerged),
        bodymap: a[`${b.id}::bodymap`] || [],
      };
    })
    // Nach Priorität sortieren (P1 zuerst; ohne Angabe ans Ende).
    .sort((x, y) => (x.prioritaet?.rang ?? 99) - (y.prioritaet?.rang ?? 99));

  // ── 7-Faktoren-Profil ───────────────────────────────────
  const faktoren = compute7FaktorenAbgeleitet(a);

  // ── Hochgeladene Befunde (nach Fachbereich, über alle Sitzungen) ─
  const sitzungen = alleSitzungen();
  const uploads = [];
  const befundErkenntnisse = [];
  UPLOAD_KATEGORIEN.forEach((k) => {
    sitzungen.forEach((sess) => {
      (sess.answers[k.id] || []).forEach((file) => {
        uploads.push({ fachbereich: k.fachbereich, label: k.label, file, datum: sess.datum });
      });
      // Vom Patienten/Therapeuten erfasste Kernbefunde je Dokument (bis KI-OCR).
      const notiz = sess.answers[`${k.id}-notiz`];
      if (notiz && String(notiz).trim()) {
        befundErkenntnisse.push({ fachbereich: k.fachbereich, label: k.label, notiz: String(notiz).trim(), datum: sess.datum });
      }
    });
  });

  // ── B-Symptomatik / Warnzeichen (für Kompaktansicht) ────
  const warnzeichen = [];
  if (a["BS-001"] === "hoch" || a["BS-001"] === "leicht") warnzeichen.push("Fieber");
  if (a["BS-002"] === true) warnzeichen.push("Nachtschweiß");
  if (a["BS-003"] === "deutlich") warnzeichen.push("ungewollter Gewichtsverlust ≥5 kg");
  else if (a["BS-003"] === "leicht") warnzeichen.push("leichter Gewichtsverlust");
  if (a["BS-005"] === true) warnzeichen.push("Schwindel");
  if (a["BS-006"] === true) warnzeichen.push("Leistungsknick");

  // ── Vitalparameter (objektive Messwerte, falls erfasst) ─
  const vw = [];
  if (a["VP-001"] || a["VP-002"]) vw.push(`RR ${a["VP-001"] ?? "?"}/${a["VP-002"] ?? "?"} mmHg`);
  if (a["VP-003"]) vw.push(`Puls ${a["VP-003"]}/min`);
  if (a["VP-004"]) vw.push(`Temp ${a["VP-004"]} °C`);
  if (a["VP-005"]) vw.push(`SpO₂ ${a["VP-005"]} %`);
  if (a["VP-006"]) vw.push(`HRV ${a["VP-006"]} ms`);
  if (a["VP-007"]) vw.push(`Nüchtern-BZ ${a["VP-007"]} mg/dL`);
  const vitalwerte = vw.join(" · ");

  // ── therapist_only ──────────────────────────────────────
  const phq4 = {
    depression: (a["PHQ4-1"] || 0) + (a["PHQ4-2"] || 0),
    angst: (a["PHQ4-3"] || 0) + (a["PHQ4-4"] || 0),
  };
  phq4.gesamt = phq4.depression + phq4.angst;
  phq4.kategorie =
    phq4.gesamt <= 2 ? "Normal" : phq4.gesamt <= 5 ? "Mild" : phq4.gesamt <= 8 ? "Moderat" : "Schwer";

  const yellowFlags = computeYellowFlags(a);
  const redFlags = checkAllRedFlags(a);

  // ── Gesundheits-Zeitlinie (über alle Sitzungen) ─────────
  const timeline = computeTimelineAlleSitzungen(sitzungen, beschwerden);

  // ── Sitzungs-Historie (für Vollansicht) ─────────────────
  const sitzungsHistorie = sitzungen.map((sess) => ({
    datum: sess.datum,
    tiefe: sess.tiefe,
    aktuell: !!sess._aktuell,
    beschwerden: (sess.beschwerden || [])
      .filter((b) => b.region)
      .map((b) => ({ region: REGION_LABEL[b.region] || b.region, vas: sess.answers[`${b.id}::HB-004`] })),
  }));

  // ── Vorgeschichte (für Vollansicht & Kompakt) ───────────
  const diagnosen = (a["PMH-001"] || []).filter((v) => v !== "keine_bekannt");
  const medikamente = (a["PMH-008"] || []).filter((m) => m && (m.medikament || m.wegen_was));
  const operationen = (a["PMH-004"] || []).filter((o) => o && (o.jahr || o.was));
  const unfaelle = (a["PMH-006"] || []).filter((u) => u && (u.jahr || u.was));
  const allergien = (a["PMH-011"] || []).filter((v) => v !== "keine");
  const blutverduenner = a["PMH-009"] === true;

  // ── Labor & Marker ──────────────────────────────────────
  // Kein OCR: wir bündeln, was patientenseitig bekannt ist + welche Labor-/
  // Ernährungs-Uploads vorliegen. Funktionelle Referenzbereiche als
  // Interpretationshilfe kommen aus A12 (therapist_only, im Renderer).
  const laborUploads = uploads.filter(
    (u) => u.fachbereich === "Labormedizin" || u.fachbereich === "Ernährungsmedizin"
  );
  const labor = {
    patientBekannt: a["SYS-E-T5"] || "",
    supplemente: a["ERN-016b"] || "",
    uploads: laborUploads,
    hatDaten: !!(a["SYS-E-T5"] || a["ERN-016b"] || laborUploads.length),
  };

  return {
    grunddaten,
    ziele,
    beschwerden,
    faktoren,
    uploads,
    timeline,
    sitzungsHistorie,
    sitzungDatum: state.meta.sessionDatum,
    vorgeschichte: { diagnosen, medikamente, operationen, unfaelle, allergien, blutverduenner },
    warnzeichen,
    vitalwerte,
    befundErkenntnisse,
    labor,
    therapist: {
      phq4,
      yellowFlags,
      redFlags,
      risikoprofil: computeRisikoprofil(a),
    },
  };
}

/**
 * Zeitlinie über alle Sitzungen: datierte Ereignisse + Anamnese-Marker.
 * Der Anamnese-Marker benennt konkret Problem + Region (z.B. „Impingement
 * (Schulter rechts)") statt nur „Anamnese", damit der Verlauf lesbar ist.
 */
export function computeTimelineAlleSitzungen(sitzungen, aktuelleBeschwerden) {
  const events = [];
  const kurz = (s) => (s && s.length > 55 ? s.slice(0, 52) + "…" : s);
  const beschreibeSitzung = (sess) => {
    // Aktuelle Sitzung: Region + führende Verdachtsdiagnose (falls vorhanden).
    if (sess._aktuell && Array.isArray(aktuelleBeschwerden) && aktuelleBeschwerden.length) {
      return aktuelleBeschwerden
        .map((b) => {
          const dx = b.verdacht && b.verdacht.length ? diagnoseLabel(b.verdacht[0].label) : null;
          return dx ? `${b.region} — ${dx}` : b.region;
        })
        .join(", ");
    }
    // Frühere Sitzungen: Region + (falls vorhanden) das Hauptanliegen.
    const teile = (sess.beschwerden || [])
      .filter((b) => b.region)
      .map((b) => {
        const rl = REGION_LABEL[b.region] || b.region;
        const ha = sess.answers && sess.answers[`${b.id}::HB-001`];
        return ha ? `${rl}: ${kurz(ha)}` : rl;
      });
    return teile.join(", ");
  };
  sitzungen.forEach((sess) => {
    computeTimeline(sess.answers).forEach((e) => events.push(e));
    const label = beschreibeSitzung(sess);
    events.push({
      jahr: sess.datum ? parseInt(sess.datum.slice(0, 4), 10) : null,
      roh: sess.datum,
      text: label || "Anamnese",
      typ: "Anamnese",
      icon: "📋",
      datum: sess.datum,
    });
  });
  // Duplikate (gleiches Jahr+Text) zusammenfassen.
  const seen = new Set();
  const unique = events.filter((e) => {
    const key = `${e.jahr}|${e.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((x, y) => {
    if (x.jahr == null && y.jahr == null) return 0;
    if (x.jahr == null) return 1;
    if (y.jahr == null) return -1;
    return x.jahr - y.jahr;
  });
  return unique;
}

/**
 * Sammelt alle datierten Ereignisse (OPs, Unfälle, wichtige Diagnosen) und
 * sortiert sie chronologisch für die Gesundheits-Roadmap.
 */
export function computeTimeline(a) {
  const events = [];
  const parseJahr = (j) => {
    const m = String(j || "").match(/\d{4}/);
    return m ? parseInt(m[0], 10) : null;
  };

  // „ausgeheilt" → false (gedämpft), „gelegentlich"/„ja, weiterhin" → true (aktiv).
  const istAktiv = (v) => (v === "ausgeheilt" ? false : v === "gelegentlich" || v === "ja, weiterhin" ? true : undefined);

  (a["PMH-004"] || []).forEach((op) => {
    if (op.jahr || op.was) events.push({ jahr: parseJahr(op.jahr), roh: op.jahr, text: op.was || "Operation", typ: "OP", icon: "🏥", aktiv: istAktiv(op.aktiv) });
  });
  (a["PMH-006"] || []).forEach((u) => {
    if (u.jahr || u.was) events.push({ jahr: parseJahr(u.jahr), roh: u.jahr, text: u.was || "Unfall/Trauma", typ: "Trauma", icon: "⚡", aktiv: istAktiv(u.aktiv) });
  });
  (a["PMH-001b"] || []).forEach((d) => {
    if (d.jahr || d.diagnose) events.push({ jahr: parseJahr(d.jahr), roh: d.jahr, text: d.diagnose || "Diagnose", typ: "Diagnose", icon: "🩺" });
  });

  // Nach Jahr sortieren; undatierte ans Ende.
  events.sort((x, y) => {
    if (x.jahr == null && y.jahr == null) return 0;
    if (x.jahr == null) return 1;
    if (y.jahr == null) return -1;
    return x.jahr - y.jahr;
  });
  return events;
}
