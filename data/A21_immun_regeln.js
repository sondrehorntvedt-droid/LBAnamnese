/**
 * A21 — IMMUN-/ENTZÜNDUNGS-REGELN (deterministische Prüf-/Beratungsliste)
 *
 * Zweck: Aus Immun-/Entzündungs-/Autoimmun-Symptomen ableiten, welche
 * Diagnostik erwogen werden sollte. Deklaratives feld/op/wert-Format wie
 * A17/A19/A20. KEINE Diagnose, keine Medikation.
 *
 * Fachliche Anker:
 *  - „Stille Entzündung"/Inflammaging als Longevity-Thema (P. Attia — hsCRP);
 *    metabolische Entzündung bei viszeralem Fett (C. Means).
 *  - Autoimmun-Screening: hsCRP, BSG, ANA, Rheumafaktor/anti-CCP.
 *  - Sicca-Symptomatik → Sjögren (ANA, SS-A/SS-B).
 *  - Infektanfälligkeit: Differentialblutbild, Vitamin D; Lebensstil.
 *  - Atopie: allergologische Abklärung.
 *
 * STATUS: VORLÄUFIG — Feinschliff durch Advisory Board Vitalmedizin (Daniel).
 */

export const IMMUN_REGELN = [
  // ── Bekannte Autoimmun-/rheumatische Erkrankung (aus Vorgeschichte) ──
  { id: "IM-AUTOIMMUN", wenn: { feld: "PMH-001", op: "contains", wert: "autoimmun" },
    grund: "Bekannte Autoimmunerkrankung",
    pruefen: ["hsCRP", "BSG", "Differentialblutbild", "krankheitsspezifische Verlaufsmarker"] },
  { id: "IM-RHEUMA", wenn: { feld: "PMH-001", op: "contains", wert: "rheuma" },
    grund: "Bekannte rheumatische Erkrankung",
    pruefen: ["hsCRP", "BSG", "Rheumafaktor", "anti-CCP"] },

  // ── Entzündungs-/Autoimmun-Symptomcluster ───────────────────
  { id: "IM-GELENKE", wenn: { feld: "IMM-002", op: "contains", wert: "geschwollene_gelenke" },
    grund: "Geschwollene/entzündete Gelenke",
    pruefen: ["hsCRP", "BSG", "Rheumafaktor", "anti-CCP", "ANA"] },
  { id: "IM-HAUT", wenn: { feld: "IMM-002", op: "contains", wert: "hautausschlaege" },
    grund: "Wiederkehrende Hautausschläge",
    pruefen: ["hsCRP", "ANA (bei Verdacht auf systemische Beteiligung)"] },
  { id: "IM-FIEBER", wenn: { feld: "IMM-002", op: "contains", wert: "wiederkehrendes_fieber" },
    grund: "Wiederkehrendes Fieber ohne klaren Infekt",
    pruefen: ["hsCRP", "BSG", "Differentialblutbild", "ärztliche Abklärung (Fieber-Ursache)"] },
  { id: "IM-SICCA", wenn: { feld: "IMM-002", op: "contains", wert: "trockene_augen_mund" },
    grund: "Sicca-Symptomatik (trockene Augen/Mund)",
    pruefen: ["ANA", "SS-A/SS-B (Sjögren)"] },
  { id: "IM-MUEDE", wenn: { feld: "IMM-002", op: "contains", wert: "chronische_muedigkeit" },
    grund: "Anhaltende unerklärliche Erschöpfung",
    pruefen: ["hsCRP", "Ferritin", "TSH", "Vitamin D (25-OH)", "Blutbild"] },

  // ── Infektanfälligkeit ──────────────────────────────────────
  { id: "IM-INFEKTE-HAEUFIG", wenn: { feld: "IMM-003", op: "==", wert: "5plus" },
    grund: "Häufige Infekte (≥5/Jahr)",
    pruefen: ["Differentialblutbild", "Vitamin D (25-OH)", "ggf. Immunglobuline"],
    beratung: ["Immun-Basis stärken (Schlaf, Stress, Ernährung, Zink/Vitamin D nach Status)"] },

  // ── Atopie / Allergie ───────────────────────────────────────
  { id: "IM-ATOPIE-HEU", wenn: { feld: "IMM-001", op: "contains", wert: "heuschnupfen" },
    grund: "Allergischer Schnupfen (Atopie)",
    beratung: ["Allergologische Abklärung erwägen (Auslöser, ggf. Hyposensibilisierung)"] },
  { id: "IM-ATOPIE-ASTHMA", wenn: { feld: "IMM-001", op: "contains", wert: "asthma" },
    grund: "Allergisches Asthma",
    beratung: ["Pneumologische/allergologische Anbindung sicherstellen"] },
  { id: "IM-ATOPIE-DERM", wenn: { feld: "IMM-001", op: "contains", wert: "neurodermitis" },
    grund: "Neurodermitis (atopisches Ekzem)",
    beratung: ["Hautbarriere-/Trigger-Management; Zusammenhang mit Darm/Ernährung bedenken"] },

  // ── Metabolische „stille" Entzündung ────────────────────────
  { id: "IM-VISZERAL", wenn: { feld: "D2-003", op: "contains", wert: "bauchfett" },
    grund: "Viszerales Bauchfett (metabolische Entzündung)",
    pruefen: ["hsCRP (stille Entzündung)"] },
];
