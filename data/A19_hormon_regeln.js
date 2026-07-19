/**
 * A19 — HORMON-/ENDOKRIN-REGELN (deterministische Laborpanel-Prüfliste)
 *
 * Zweck: Aus den bereits erhobenen Hormon-/Stoffwechsel-Symptomen (A03 D2/D3)
 * ableiten, WELCHE Laborpanels der Therapeut prüfen/veranlassen sollte.
 * Analog zu A17_vitalstoff_regeln.js — deklaratives feld/op/wert-Format,
 * maschinenlesbar, exportierbar, ohne Codeänderung erweiterbar.
 *
 * BEWUSST KEINE Diagnose und KEINE Hormon-/Medikamenten-Dosierung — Ausgabe
 * ist eine Panel-/Beratungsliste zur ärztlich-laborgestützten Abklärung.
 *
 * Fachliche Anker (Leitlinien/Advisory Board):
 *  - Schilddrüse: TSH als Primärtest, fT3/fT4, TPO-/TG-AK bei Autoimmun-
 *    verdacht; TRAK bei Hyperthyreose (Basedow).
 *  - Cortisol/HPA: Cortisol-Tagesprofil (Speichel) + DHEA-S bei Dysregulation.
 *  - Frau: LH/FSH, Östradiol, Testosteron/SHBG, Prolaktin; PCOS nach
 *    Rotterdam-Kriterien; Menopause FSH/Östradiol (M.C. Haver, L. Newson,
 *    F. Gersh); Zyklus-Periodisierung (S. Sims).
 *  - Mann: Gesamt-/freies Testosteron (morgens), SHBG, LH (Endocrine
 *    Society / Bhasin 2018).
 *  - Metabolik/Insulinresistenz: HbA1c, Nüchtern-Insulin + Glukose (HOMA-IR),
 *    Taille als viszerales Risiko (C. Means; IDF-Kriterien).
 *
 * STATUS: VORLÄUFIG — Feinschliff durch Advisory Board Vitalmedizin (Daniel).
 */

export const HORMON_REGELN = [
  // ── Schilddrüse ─────────────────────────────────────────────
  { id: "HR-SD-HYPO-1", wenn: { feld: "D3-001", op: "contains", wert: "muedigkeit_kalt" },
    grund: "Symptome einer Schilddrüsenunterfunktion",
    panel: ["TSH", "fT3", "fT4", "TPO-Antikörper (Hashimoto)"] },
  { id: "HR-SD-HYPO-2", wenn: { feld: "D3-001", op: "contains", wert: "gewicht_zu" },
    grund: "Gewichtszunahme bei Verdacht Hypothyreose",
    panel: ["TSH", "fT3", "fT4"] },
  { id: "HR-SD-HYPO-3", wenn: { feld: "D3-001", op: "contains", wert: "depression_schildd" },
    grund: "Verlangsamung/Depression bei Verdacht Hypothyreose",
    panel: ["TSH", "fT4"] },
  { id: "HR-SD-HYPER-1", wenn: { feld: "D3-001", op: "contains", wert: "herzrasen_schwitzen" },
    grund: "Symptome einer Schilddrüsenüberfunktion",
    panel: ["TSH", "fT4", "TRAK (Basedow)"] },
  { id: "HR-SD-HYPER-2", wenn: { feld: "D3-001", op: "contains", wert: "gewicht_ab" },
    grund: "Gewichtsverlust bei Verdacht Hyperthyreose",
    panel: ["TSH", "fT4"] },
  { id: "HR-SD-AUTOIMMUN", wenn: { feld: "D3-009", op: "==", wert: true },
    grund: "Familiäre Schilddrüsen-/Autoimmunerkrankung",
    panel: ["TPO-Antikörper", "TG-Antikörper"] },

  // ── Cortisol / HPA-Achse ────────────────────────────────────
  { id: "HR-CORT-1", wenn: { feld: "D3-004", op: "contains", wert: "morgens_schwer" },
    grund: "Morgentief / gestörter Cortisol-Rhythmus",
    panel: ["Cortisol-Tagesprofil (Speichel)", "DHEA-S"] },
  { id: "HR-CORT-2", wenn: { feld: "D3-004", op: "contains", wert: "salzhunger" },
    grund: "Salzhunger / Verdacht Nebennieren-Dysregulation",
    panel: ["Cortisol-Tagesprofil (Speichel)", "DHEA-S", "Elektrolyte"] },
  { id: "HR-CORT-3", wenn: { feld: "D3-003", op: "==", wert: "erschoepft" },
    grund: "Chronischer Stress mit Erschöpfung",
    panel: ["Cortisol-Tagesprofil (Speichel)"] },

  // ── Frau: Zyklus / PCOS / Menopause ─────────────────────────
  { id: "HR-F-ZYKLUS", wenn: { feld: "D3-005", op: "==", wert: "unregelmaessig" },
    grund: "Unregelmäßiger Zyklus",
    panel: ["LH", "FSH", "Östradiol", "Testosteron gesamt", "SHBG", "Prolaktin", "TSH"] },
  { id: "HR-F-AMENORRHOE", wenn: { feld: "D3-005", op: "==", wert: "ausgeblieben" },
    grund: "Ausgebliebene Periode (Amenorrhö)",
    panel: ["FSH", "LH", "Östradiol", "Prolaktin", "TSH", "ggf. β-hCG (Schwangerschaft ausschließen)"] },
  { id: "HR-F-PCOS-HIRSUT", wenn: { feld: "D3-010", op: "contains", wert: "hirsutismus" },
    grund: "Hirsutismus bei unregelmäßigem Zyklus (PCOS-Verdacht, Rotterdam)",
    panel: ["Testosteron frei", "SHBG", "LH/FSH-Ratio", "Nüchtern-Insulin", "DHEA-S"] },
  { id: "HR-F-PCOS-AKNE", wenn: { feld: "D3-010", op: "contains", wert: "akne" },
    grund: "Akne bei unregelmäßigem Zyklus (PCOS-Verdacht)",
    panel: ["Testosteron frei", "SHBG"] },
  { id: "HR-F-PERI", wenn: { feld: "D3-011", op: "==", wert: "perimenopause" },
    grund: "Perimenopause",
    panel: ["FSH", "Östradiol"] },
  { id: "HR-F-POST", wenn: { feld: "D3-011", op: "==", wert: "postmenopause" },
    grund: "Postmenopause",
    panel: ["FSH", "Östradiol"] },
  { id: "HR-F-ZYKLUS-TRAIN", wenn: { feld: "D3-012", op: "==", wert: "stark" },
    grund: "Deutlich zyklusabhängige Beschwerden/Leistung",
    beratung: ["Training & Ernährung zyklusbasiert periodisieren (Orientierung: S. Sims)"] },

  // ── Mann: Testosteron ───────────────────────────────────────
  { id: "HR-M-LIBIDO", wenn: { feld: "D3-007", op: "contains", wert: "libidoverlust_m" },
    grund: "Libidoverlust (Verdacht Testosteronmangel)",
    panel: ["Testosteron gesamt (morgens)", "Testosteron frei", "SHBG", "LH"] },
  { id: "HR-M-MUSKEL", wenn: { feld: "D3-007", op: "contains", wert: "muskelverlust" },
    grund: "Muskelverlust trotz Training",
    panel: ["Testosteron gesamt (morgens)", "SHBG"] },
  { id: "HR-M-STIMMUNG", wenn: { feld: "D3-007", op: "contains", wert: "stimmung_tief" },
    grund: "Antriebslosigkeit (Verdacht Testosteronmangel)",
    panel: ["Testosteron gesamt (morgens)"] },

  // ── Metabolik / Insulinresistenz ────────────────────────────
  { id: "HR-IR-HEISS", wenn: { feld: "D2-003", op: "contains", wert: "heisshunger" },
    grund: "Heißhunger (Verdacht Insulinresistenz)",
    panel: ["HbA1c", "Nüchtern-Glukose", "Nüchtern-Insulin (HOMA-IR)"] },
  { id: "HR-IR-BAUCH", wenn: { feld: "D2-003", op: "contains", wert: "bauchfett" },
    grund: "Viszerales Bauchfett",
    panel: ["HbA1c", "Triglyceride", "HDL"] },
  { id: "HR-IR-HAUT", wenn: { feld: "D2-003", op: "contains", wert: "hautveraenderungen" },
    grund: "Acanthosis nigricans / Hautveränderungen (Insulinresistenz)",
    panel: ["HbA1c", "Nüchtern-Insulin (HOMA-IR)"] },
  { id: "HR-PRAEDIAB", wenn: { feld: "D2-002", op: "==", wert: "praediabetes" },
    grund: "Bekannter Prädiabetes",
    panel: ["HbA1c (Verlauf)", "Nüchtern-Glukose"] },
];

/** Endokriner Red Flag (über den globalen Wächter registriert). */
export const HORMON_RED_FLAGS = [
  { id: "D2-011", hinweis:
      "Starker Durst + häufiges Wasserlassen + ungewollter Gewichtsverlust → Verdacht auf neu aufgetretenen/entgleisten Diabetes: bitte zeitnah ärztliche Blutzucker-Abklärung (nüchtern Glukose/HbA1c)." },
];
