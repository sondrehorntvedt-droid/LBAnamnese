/**
 * LINDEBERGS OS — Ziele & Motivation (PROM)
 *
 * Struktur aus "Finale Lindebergs OS Anamnese 5.1.25.docx", Phase 0
 * (ZIELE & MOTIVATION), ganz am Anfang der Anamnese — bewusst VOR den
 * Beschwerden, damit die Behandlung von den Zielen des Patienten her
 * gedacht wird ("Magic Wand"-Prinzip, PSFS-Logik).
 */

export const ZIELE_INTRO = {
  titel: "Bevor wir über Ihre Beschwerden sprechen — was ist Ihr Ziel?",
  beschreibung:
    "Was ist der wahre Grund, warum Sie hier sind? Sie können bis zu 5 persönliche Ziele festlegen — so behandeln wir nicht nur Symptome, sondern das, was Ihnen wirklich wichtig ist.",
};

export const LEBENSBEREICH_OPTIONEN = [
  { value: "alltag", label: "Alltag & Selbstständigkeit", icon: "🏠" },
  { value: "sport", label: "Sport & Performance", icon: "🏃" },
  { value: "beruf", label: "Beruf & Arbeit", icon: "💼" },
  { value: "familie", label: "Familie & Soziales", icon: "👨‍👩‍👧" },
  { value: "koerpergefuehl", label: "Körpergefühl & Vitalität", icon: "✨" },
];

export const FOKUS_OPTIONEN = [
  { value: "schmerzfreiheit", label: "Schmerzfreiheit" },
  { value: "mobilitaet", label: "Mobilität" },
  { value: "kraft_stabilitaet", label: "Kraft & Stabilität" },
  { value: "ausdauer", label: "Ausdauer" },
  { value: "aesthetik", label: "Ästhetik" },
];

export const ZEITRAHMEN_OPTIONEN = [
  { value: "schnellstmoeglich", label: "Schnellstmöglich" },
  { value: "zu_termin", label: "Bis zu einem bestimmten Datum" },
  { value: "langfristig", label: "Langfristig" },
];

export const PRIORITAET_OPTIONEN = [
  { value: 1, label: "Priorität 1 (am wichtigsten)" },
  { value: 2, label: "Priorität 2" },
  { value: 3, label: "Priorität 3" },
];

export const MAX_ZIELE = 5;

// ── PSFS — Patient-Specific Functional Scale (validiert) ────────────
// Der Patient benennt konkrete Alltagsaktivitäten, die durch seine
// Beschwerden eingeschränkt sind, und bewertet sie 0–10. Genau die
// „Oma-will-25-Treppenstufen"- / „mit-Enkeln-Fußball"-Logik.
// Quelle: Stratford et al. 1995. MCID ≥3 Punkte pro Aktivität.
export const PSFS_ANKER = {
  frage: "Wie gut können Sie diese Tätigkeit heute ausführen?",
  min: 0,
  max: 10,
  labels: {
    0: "Gar nicht möglich",
    5: "Mit deutlicher Mühe",
    10: "Uneingeschränkt (wie vor dem Problem)",
  },
};

// ── NRS — Numeric Pain Rating Scale (0–10), bewusst GETRENNT von Funktion/QoL ─
export const NRS_ANKER = {
  min: 0,
  max: 10,
  labels: { 0: "Kein Schmerz", 5: "Mäßig", 10: "Stärkster vorstellbarer Schmerz" },
};

// ── WHO-5 Wohlbefindens-Index (validiert, deutsche Standardversion) ──
// Erfasst die emotionale Lebensqualität / Vitalität. Score = Summe(0–25) × 4
// → 0–100 %. ≤50 % = niedriges Wohlbefinden (Depressions-Screening).
// Quelle: Psychiatric Research Unit / WHO Collaborating Centre.
export const WHO5_INTRO =
  "Die folgenden Aussagen betreffen Ihr Wohlbefinden in den letzten zwei Wochen. Bitte wählen Sie jeweils, was am besten beschreibt, wie Sie sich gefühlt haben.";
export const WHO5_SKALA = {
  0: "Zu keinem Zeitpunkt",
  1: "Ab und zu",
  2: "Etwas weniger als die Hälfte der Zeit",
  3: "Etwas mehr als die Hälfte der Zeit",
  4: "Meistens",
  5: "Die ganze Zeit",
};
export const WHO5_ITEMS = [
  { id: "WHO5-1", text: "In den letzten zwei Wochen war ich froh und guter Laune." },
  { id: "WHO5-2", text: "In den letzten zwei Wochen habe ich mich ruhig und entspannt gefühlt." },
  { id: "WHO5-3", text: "In den letzten zwei Wochen habe ich mich energisch und aktiv gefühlt." },
  { id: "WHO5-4", text: "In den letzten zwei Wochen habe ich mich beim Aufwachen frisch und ausgeruht gefühlt." },
  { id: "WHO5-5", text: "In den letzten zwei Wochen war mein Alltag voller Dinge, die mich interessieren." },
];

/** WHO-5-Score 0–100 % aus den 5 Items (oder null, wenn nichts beantwortet). */
export function computeWHO5(answers) {
  const werte = WHO5_ITEMS.map((i) => answers[i.id]).filter((v) => typeof v === "number");
  if (!werte.length) return null;
  const summe = werte.reduce((a, b) => a + b, 0);
  // Auf volle 5 Items hochskalieren, falls unvollständig, dann ×4.
  return Math.round((summe / (werte.length * 5)) * 100);
}

// ── Anamnese-Tiefe ──────────────────────────────────────────
// Patient entscheidet selbst, wie umfangreich die Anamnese sein soll.
// Der `tiers`-Filter im Router (app/router.js) blendet Schritte je nach
// gewählter Tiefe ein/aus — so bleibt der Aufwand minimal bei voller Tiefe
// dort, wo sie gebraucht wird.
//
// Interne Werte bleiben stabil (fokus/ganzheitlich/tiefenanalyse) — nur die
// Anzeigenamen sind neu.
export const ANAMNESE_TIEFE_OPTIONEN = [
  {
    value: "fokus",
    label: "Fokus",
    dauer: "≈ 15 Minuten",
    beschreibung:
      "Konzentriert auf Ihre konkrete Beschwerde (z.B. Schulter, Knie, Rücken). Ideal, wenn das Problem klar umrissen und eher neu ist.",
  },
  {
    value: "ganzheitlich",
    label: "Ganzheitlich",
    dauer: "≈ 30 Minuten",
    empfohlen: true,
    beschreibung:
      "Sucht die Ursache, nicht nur das Symptom. Wir betrachten Ihre Beschwerde im Zusammenhang mit Ihren Organsystemen, systemischen Beschwerden und dem Verlauf Ihres Lebens — welche Beschwerden Sie früher hatten und wie sie mit Ihren heutigen zusammenhängen könnten. So verstehen wir, WARUM das Problem entstanden ist. Die empfohlene Tiefe für die meisten Erstbesuche.",
  },
  {
    value: "tiefenanalyse",
    label: "Tiefenanalyse",
    dauer: "≈ 45 Minuten",
    beschreibung:
      "Maximale Tiefe inkl. funktioneller Medizin — von uns Vitalmedizin genannt: Stoffwechsel, Ernährung, Supplementierung und Hormonhaushalt. Für alle, die über die Beschwerde hinaus an Leistungsfähigkeit und Gesundheitsoptimierung arbeiten möchten — abnehmen, Muskeln aufbauen, gesund altern und den Jahren mehr Leben geben. Auch empfohlen bei komplexen, chronischen oder mehreren gleichzeitigen Beschwerden.",
  },
];
