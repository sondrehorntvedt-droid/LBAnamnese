/**
 * LINDEBERGS OS — Sport- & Bewegungsanamnese
 *
 * Fachliche Grundlage:
 *  - "Unsere Philosophie" (Lindebergs): Faktor RANGE (Bewegung) — die fünf
 *    sportmotorischen Fähigkeiten „Flexibilität, Koordination, Schnelligkeit,
 *    Kraft, Ausdauer" sind die eigene Taxonomie des Hauses. Bewegung als
 *    Schlüsselindikator für Lebendigkeit / niedrigeres biologisches Alter.
 *  - Advisory Board Funktionsmedizin (Performance-Säulen): Zone-2-Basis &
 *    metabolische Flexibilität (Attia, San Millán), polarisierte
 *    Intensitätsverteilung 80/20 (Seiler), VO2max als Longevity-Marker
 *    (Joyner/Attia), Kraft/Muskelerhalt & Proteinzufuhr (Phillips, Galpin),
 *    Regeneration/Hydration (Galpin), weibliche Trainingsphysiologie
 *    (Sims, Wright), Return-to-Sport (Galpin).
 *
 * Die KERN-Fragen speisen den Faktor RANGE und bleiben bewusst kurz
 * (Ganzheitlich-Tiefe). Die PERFORMANCE-Fragen erscheinen nur in der
 * Tiefenanalyse.
 */

// ── KERN (ganzheitlich): Alltagsbewegung + 5 sportmotorische Fähigkeiten ──
export const SPORT_KERN_FRAGEN = [
  {
    id: "SPT-001",
    frage: "Wie aktiv ist Ihr Alltag insgesamt (Wege, Treppen, Stehen, Tragen — unabhängig vom Sport)?",
    type: "single_choice",
    section: "Alltagsbewegung (NEAT)",
    required: false,
    options: [
      { value: "sehr_sitzend", label: "Überwiegend sitzend (viel Schreibtisch, wenig Wege)" },
      { value: "leicht_aktiv", label: "Leicht aktiv (gelegentlich Wege zu Fuß / Treppen)" },
      { value: "aktiv", label: "Aktiv (viel auf den Beinen, regelmäßig zu Fuß)" },
      { value: "sehr_aktiv", label: "Sehr aktiv (körperliche Arbeit / ständig in Bewegung)" },
    ],
  },
  {
    id: "SPT-002",
    frage: "Wie oft treiben Sie gezielt Sport pro Woche?",
    type: "single_choice",
    section: "Trainingsumfang",
    required: false,
    options: [
      { value: "nie", label: "Gar nicht" },
      { value: "1_2", label: "1–2× pro Woche" },
      { value: "3_4", label: "3–4× pro Woche" },
      { value: "5plus", label: "5× und mehr / Leistungssport" },
    ],
  },
  {
    id: "SPT-003",
    frage: "Welche Sportarten oder Bewegungsformen betreiben Sie?",
    type: "text",
    section: "Trainingsumfang",
    required: false,
    placeholder: "z.B. Joggen, Krafttraining, Yoga, Schwimmen, Klettern...",
  },
  // Die fünf sportmotorischen Fähigkeiten — Selbsteinschätzung (speisen RANGE)
  {
    id: "SPT-FLEX",
    frage: "Flexibilität: Wie beweglich/gedehnt fühlen Sie sich?",
    type: "vas_scale",
    min: 0,
    max: 10,
    section: "Ihre sportmotorischen Fähigkeiten",
    faktor: "Range",
    required: false,
    labels: { 0: "Sehr steif", 5: "Durchschnittlich", 10: "Sehr beweglich" },
  },
  {
    id: "SPT-KOORD",
    frage: "Koordination & Gleichgewicht: Wie sicher und kontrolliert bewegen Sie sich?",
    type: "vas_scale",
    min: 0,
    max: 10,
    section: "Ihre sportmotorischen Fähigkeiten",
    faktor: "Range",
    required: false,
    labels: { 0: "Unsicher", 5: "Durchschnittlich", 10: "Sehr sicher" },
  },
  {
    id: "SPT-SPEED",
    frage: "Schnelligkeit: Wie spritzig/reaktionsschnell fühlen Sie sich?",
    type: "vas_scale",
    min: 0,
    max: 10,
    section: "Ihre sportmotorischen Fähigkeiten",
    faktor: "Range",
    required: false,
    labels: { 0: "Träge", 5: "Durchschnittlich", 10: "Sehr spritzig" },
  },
  {
    id: "SPT-KRAFT",
    frage: "Kraft: Wie kräftig fühlen Sie sich für Alltag und Sport?",
    type: "vas_scale",
    min: 0,
    max: 10,
    section: "Ihre sportmotorischen Fähigkeiten",
    faktor: "Range",
    required: false,
    labels: { 0: "Schwach", 5: "Durchschnittlich", 10: "Sehr kräftig" },
  },
  {
    id: "SPT-AUSDAUER",
    frage: "Ausdauer: Wie belastbar sind Sie, ohne schnell zu ermüden?",
    type: "vas_scale",
    min: 0,
    max: 10,
    section: "Ihre sportmotorischen Fähigkeiten",
    faktor: "Range",
    required: false,
    labels: { 0: "Schnell erschöpft", 5: "Durchschnittlich", 10: "Sehr ausdauernd" },
  },
];

// ── PERFORMANCE (nur Tiefenanalyse): Trainingssteuerung, Longevity-Marker ──
export const SPORT_PERFORMANCE_FRAGEN = [
  {
    id: "SPT-P-ZIEL",
    frage: "Was ist Ihr wichtigstes sportliches Ziel?",
    type: "single_choice",
    section: "Ziel & Trainingssteuerung",
    required: false,
    options: [
      { value: "gesundheit", label: "Allgemeine Gesundheit & Fitness" },
      { value: "abnehmen", label: "Gewicht / Körperzusammensetzung" },
      { value: "ausdauer", label: "Ausdauer (Lauf, Rad, Triathlon...)" },
      { value: "kraft", label: "Kraft / Muskelaufbau" },
      { value: "sport_spezifisch", label: "Sportartspezifische Leistung" },
      { value: "reha", label: "Wiederaufbau nach Verletzung / Return-to-Sport" },
    ],
  },
  {
    id: "SPT-P-INTENSITY",
    frage: "Wie verteilt sich Ihr Training auf lockere vs. harte Einheiten? (Polarisierung nach Seiler)",
    type: "single_choice",
    section: "Intensitätsverteilung",
    required: false,
    hint: "Elite-Ausdauersportler trainieren ~80% locker, ~20% hart.",
    options: [
      { value: "meist_locker", label: "Überwiegend locker / niedrige Intensität" },
      { value: "polarisiert", label: "Gemischt: viel locker, gezielt wenige harte Einheiten (80/20)" },
      { value: "meist_hart", label: "Überwiegend intensiv / immer am Limit" },
      { value: "unstrukturiert", label: "Unstrukturiert / keine bewusste Steuerung" },
    ],
  },
  {
    id: "SPT-P-ZONE2",
    frage: "Können Sie längere Zeit im lockeren Grundlagentempo trainieren (Zone 2, Gespräch/Nasenatmung möglich)?",
    type: "single_choice",
    section: "Metabolische Basis (Zone 2)",
    required: false,
    options: [
      { value: "ja_regelmaessig", label: "Ja, mache ich regelmäßig" },
      { value: "selten", label: "Selten / nur unbewusst" },
      { value: "faellt_schwer", label: "Fällt mir schwer — komme schnell außer Atem" },
      { value: "unbekannt", label: "Kenne ich nicht" },
    ],
  },
  {
    id: "SPT-P-VO2",
    frage: "Ist Ihr VO₂max / Ihre Ausdauerkapazität bekannt (Test, Sportuhr-Schätzung)?",
    type: "single_choice",
    section: "Longevity-Marker",
    required: false,
    hint: "VO₂max gehört zu den stärksten Prädiktoren für langfristige Gesundheit.",
    options: [
      { value: "gemessen", label: "Ja, gemessen (Wert bekannt)" },
      { value: "geschaetzt", label: "Von Sportuhr geschätzt" },
      { value: "unbekannt", label: "Unbekannt" },
    ],
  },
  {
    id: "SPT-P-KRAFT",
    frage: "Wie oft machen Sie gezieltes Krafttraining?",
    type: "single_choice",
    section: "Kraft & Muskelerhalt",
    required: false,
    hint: "Muskelmasse ist einer der stärksten Prädiktoren für gesundes Altern.",
    options: [
      { value: "nie", label: "Gar nicht" },
      { value: "1x", label: "1× pro Woche" },
      { value: "2_3x", label: "2–3× pro Woche" },
      { value: "4plus", label: "4× und mehr" },
    ],
  },
  {
    id: "SPT-P-PROTEIN",
    frage: "Achten Sie bewusst auf ausreichende Eiweißzufuhr (z.B. zu jeder Hauptmahlzeit)?",
    type: "yes_no",
    section: "Kraft & Muskelerhalt",
    required: false,
  },
  {
    id: "SPT-P-REGEN",
    frage: "Wie gut erholen Sie sich zwischen den Trainingseinheiten?",
    type: "single_choice",
    section: "Regeneration",
    required: false,
    options: [
      { value: "sehr_gut", label: "Sehr gut — bin schnell wieder fit" },
      { value: "ok", label: "In Ordnung" },
      { value: "schlecht", label: "Schlecht — oft müde / übertraininert" },
    ],
  },
  {
    id: "SPT-P-VERLETZUNG",
    frage: "Haben Sie sich beim Sport schon einmal ernsthaft verletzt oder trainieren Sie aktuell mit Einschränkung?",
    type: "yes_no",
    section: "Sportverletzungen & Return-to-Sport",
    required: false,
  },
  {
    id: "SPT-P-VERLETZUNG-DETAIL",
    frage: "Bitte beschreiben Sie die Verletzung(en) und den aktuellen Stand:",
    type: "textarea",
    section: "Sportverletzungen & Return-to-Sport",
    required: false,
    condition: { field: "SPT-P-VERLETZUNG", equals: true },
    placeholder: "z.B. Kreuzbandriss 2022, wieder voll belastbar / Achillessehne aktuell gereizt",
  },
  {
    id: "SPT-P-ZYKLUS",
    frage: "Richten Sie Ihr Training nach Ihrem Zyklus / Ihrer hormonellen Situation aus (z.B. Zyklusphasen, Wechseljahre)?",
    type: "single_choice",
    section: "Weibliche Trainingsphysiologie",
    required: false,
    condition: { field: "sd_geschlecht", equals: "f" },
    options: [
      { value: "ja", label: "Ja, achte ich bewusst darauf" },
      { value: "nein", label: "Nein" },
      { value: "interesse", label: "Nein, aber ich hätte Interesse daran" },
    ],
  },
];
