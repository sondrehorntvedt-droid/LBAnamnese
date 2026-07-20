/**
 * A24 — ZIELE & PROMs: Kategorien-Baum mit deterministischen Wenn-Fragen
 *
 * Advisory-Board-Fundament (PROM-Studienlage):
 *  - PSFS (Patient-Specific Functional Scale; Stratford 1995): patienten-
 *    generierte Aktivitäten, 0–10; MCID ≈ 2 Punkte. Goldstandard für
 *    individuelle Funktionsziele in der Muskuloskelettal-Reha.
 *  - NRS Schmerz 0–10 (Farrar 2001): MCID ≈ 2 Punkte bzw. ~30 %.
 *  - GAS-Prinzip (Goal Attainment Scaling; Kiresuk & Sherman 1968):
 *    individualisierte Ziele mit definiertem Zielniveau — hier umgesetzt
 *    als Baseline → Zielwert je Kategorie.
 *  - ICF (WHO 2001): Ziele auf AKTIVITÄTS-/PARTIZIPATIONSEBENE formulieren
 *    („wieder Tennis spielen"), nicht nur auf Symptomebene („weniger
 *    Schmerz") — deshalb Kategorie → konkrete Tätigkeit → Messung.
 *  - WHO-5 (Topp 2015): universelles Wohlbefinden, bleibt für alle.
 *
 * WICHTIGE TRENNUNG (Sondres Punkt): Die Schmerzstärke der einzelnen
 * BESCHWERDE wird später je Beschwerde erhoben (HB-004, NRS). Hier geht es
 * um das ZIEL des Patienten — und nur wenn das Ziel schmerz-/funktions-
 * bezogen ist, wird zusätzlich die globale Schmerz-NRS erhoben. Wer
 * abnehmen oder besser schlafen will, bekommt stattdessen die passende
 * Baseline seiner Kategorie (Wenn-Struktur unten).
 *
 * DETERMINISTISCH: reine Daten (Kategorien + Wenn-Messungen), keine
 * Bewertung. Wird vollständig ins versionierte Regelwerk exportiert
 * (Supabase regelwerk_versionen) — maschinenlesbar für Therapietracking
 * und spätere Forschung (z.B. 2000 Bandscheiben-Patienten: Ziel-Erreichung
 * je Technik auswertbar, weil Baseline/Ziel/Instrument strukturiert sind).
 *
 * STATUS: VORLÄUFIG — Feinschliff durch Advisory Board.
 */

export const ZIEL_KATEGORIEN = [
  {
    value: "schmerz_funktion",
    icon: "🎾",
    label: "Schmerzfrei werden & wieder aktiv sein",
    hint: "z.B. wieder schmerzfrei Tennis spielen, mit den Enkelkindern Fußball spielen",
    platzhalter: "z.B. Wieder schmerzfrei Tennis spielen — oder mit den Enkelkindern Fußball spielen",
    messung: "psfs",
  },
  {
    // Prä-/postoperative Reha & Recovery nach Verletzung/Erkrankung —
    // eigener Zieltyp (Prähabilitation verbessert Post-OP-Outcomes,
    // Santa Mina 2014). Die DETAILS zu OP/Erkrankung gehören in
    // Vorgeschichte & Beschwerden — hier nur das Ziel; Messung = PSFS,
    // denn Recovery-Ziele sind Funktionsziele.
    value: "reha_recovery",
    icon: "🩹",
    label: "Reha & Recovery — nach OP, Verletzung oder Erkrankung",
    hint: "z.B. nach der Knie-OP wieder voll belastbar sein, nach dem Bandscheibenvorfall wieder arbeiten — oder sich optimal auf eine OP vorbereiten (Prehab)",
    platzhalter: "z.B. Drei Monate nach meiner Knie-OP wieder schmerzfrei Treppen steigen",
    messung: "psfs",
  },
  {
    value: "beweglichkeit_stabilitaet",
    icon: "🤸",
    label: "Beweglicher, stabiler & kräftiger werden",
    hint: "z.B. wieder in die Hocke kommen, sich im Alltag stabil fühlen",
    platzhalter: "z.B. Morgens ohne Steifigkeit in die Hocke kommen — oder mich beim Tragen stabil fühlen",
    messung: "psfs",
  },
  {
    value: "abnehmen",
    icon: "⚖️",
    label: "Abnehmen & Körperzusammensetzung",
    hint: "z.B. 8 kg abnehmen, wieder in die Lieblingshose passen, besser aussehen",
    platzhalter: "z.B. Bis zum Sommerurlaub wieder in meine Lieblingshose passen",
    messung: "gewicht",
  },
  {
    value: "energie",
    icon: "⚡",
    label: "Mehr Energie im Alltag",
    hint: "z.B. nachmittags nicht mehr einbrechen, abends noch Kraft für die Familie",
    platzhalter: "z.B. Nach der Arbeit noch Energie haben, um mit den Kindern zu spielen",
    messung: "nrs_energie",
  },
  {
    value: "schlaf",
    icon: "🌙",
    label: "Besser schlafen",
    hint: "z.B. durchschlafen, erholt aufwachen",
    platzhalter: "z.B. Wieder durchschlafen und morgens erholt aufwachen",
    messung: "nrs_schlaf",
  },
  {
    value: "stress",
    icon: "🧘",
    label: "Stress reduzieren & innere Ruhe finden",
    hint: "z.B. abschalten können, gelassener durch den Tag",
    platzhalter: "z.B. Abends wirklich abschalten können",
    messung: "nrs_stress",
  },
  {
    value: "leistung",
    icon: "🏃",
    label: "Sportliche Leistung steigern",
    hint: "z.B. Halbmarathon schaffen, im Verein wieder vorne mitspielen",
    platzhalter: "z.B. Im Frühjahr den Halbmarathon unter 2 Stunden laufen",
    messung: "psfs",
  },
  {
    value: "praevention",
    icon: "🌿",
    label: "Gesund bleiben — Prävention & Longevity",
    hint: "z.B. beweglich alt werden, Beschwerden vorbeugen",
    platzhalter: "z.B. Mit 80 noch selbstständig wandern können",
    messung: "keine",
  },
];

/**
 * Wenn-Struktur: Welche Baseline-/Ziel-Messung gehört zu welcher Kategorie.
 * typ "psfs"    → 0–10-Slider Baseline + Ziel (PSFS-Anker)
 * typ "gewicht" → Zielgewicht in kg (Ist-Gewicht kommt aus SD-007)
 * typ "nrs"     → kategorie-spezifischer 0–10-Slider Baseline + Ziel
 * typ "keine"   → keine Baseline (reines Motivations-/Präventionsziel)
 */
export const ZIEL_MESSUNGEN = {
  psfs: {
    typ: "psfs",
    baselineFrage: "Wie gut gelingt Ihnen das HEUTE? (0 = gar nicht möglich, 10 = uneingeschränkt)",
    zielFrage: "Welches Niveau möchten Sie erreichen?",
    labels: { 0: "Gar nicht möglich", 10: "Uneingeschränkt" },
  },
  gewicht: {
    typ: "gewicht",
    zielFrage: "Ihr Zielgewicht (kg)",
    hinweis: "Ihr aktuelles Gewicht haben wir aus Ihren Angaben — den Fortschritt verfolgen wir gemeinsam.",
  },
  nrs_energie: {
    typ: "nrs",
    baselineFrage: "Ihr Energielevel HEUTE (0 = völlig erschöpft, 10 = voller Energie)",
    zielFrage: "Welches Energielevel möchten Sie erreichen?",
    labels: { 0: "Völlig erschöpft", 10: "Voller Energie" },
  },
  nrs_schlaf: {
    typ: "nrs",
    baselineFrage: "Wie erholsam ist Ihr Schlaf HEUTE? (0 = gar nicht, 10 = sehr erholsam)",
    zielFrage: "Wie erholsam soll Ihr Schlaf werden?",
    labels: { 0: "Gar nicht erholsam", 10: "Sehr erholsam" },
  },
  nrs_stress: {
    typ: "nrs",
    baselineFrage: "Wie angespannt fühlen Sie sich derzeit? (0 = völlig entspannt, 10 = maximal angespannt)",
    zielFrage: "Welches Anspannungsniveau wäre Ihr Ziel?",
    labels: { 0: "Völlig entspannt", 10: "Maximal angespannt" },
  },
  keine: { typ: "keine" },
};

/**
 * Die globale Schmerz-NRS (7-Tage-Durchschnitt) wird NUR erhoben, wenn
 * mindestens ein Ziel aus diesen Kategorien stammt — wer z.B. „abnehmen"
 * gewählt hat, bekommt sie nicht (Schmerz je Beschwerde folgt ohnehin
 * in HB-004).
 */
export const SCHMERZ_NRS_WENN = ["schmerz_funktion", "reha_recovery", "beweglichkeit_stabilitaet", "leistung"];

/** Kategorie-Lookup (value → Definition). */
export function getZielKategorie(value) {
  return ZIEL_KATEGORIEN.find((k) => k.value === value) || null;
}
