/**
 * LINDEBERGS OS — Ernährungs- & Trinkverhalten-Anamnese
 *
 * Grundlage:
 *  - Praxis-PDF „11 - TRINKVERHALTEN" & „12 - ERNÄHRUNGSANAMNESE"
 *  - Daniels „Ernährungsbewusstsein"-Fragen
 *  - KPNI / Functional Medicine (Recherche): metabolische Flexibilität
 *    (Fasten/Essfenster, Mahlzeit auslassen ohne „hangry"), Nahrungsqualität
 *    (ultra-processed / Industrie-Öle), Essverhalten/Psychologie,
 *    Blutzucker-Variabilität (Nachmittagstief/Heißhunger), Food-Symptom-Trigger.
 *
 * KERN (ganzheitlich): Trinkverhalten + Ernährungsform + Rhythmus + Qualität.
 * TIEFE (tiefenanalyse): metabolische Flexibilität, Essverhalten, Trigger.
 */

// ── KERN ────────────────────────────────────────────────────
export const ERNAEHRUNG_KERN_FRAGEN = [
  // Trinkverhalten
  {
    id: "ERN-001",
    frage: "Wie viel Wasser trinken Sie ungefähr pro Tag?",
    type: "single_choice",
    section: "Trinkverhalten",
    required: true,
    options: [
      { value: "unter1", label: "Weniger als 1 Liter" },
      { value: "1_1_5", label: "1–1,5 Liter" },
      { value: "1_5_2_5", label: "1,5–2,5 Liter" },
      { value: "ueber2_5", label: "Mehr als 2,5 Liter" },
    ],
  },
  {
    id: "ERN-002",
    frage: "Trinken Sie regelmäßig über den Tag verteilt (nicht nur zu den Mahlzeiten)?",
    type: "yes_no",
    section: "Trinkverhalten",
    required: false,
  },
  {
    id: "ERN-003",
    frage: "Wie viele Tassen Kaffee / koffeinhaltige Getränke pro Tag?",
    type: "single_choice",
    section: "Trinkverhalten",
    required: false,
    options: [
      { value: "keine", label: "Keine" },
      { value: "1_2", label: "1–2" },
      { value: "3_4", label: "3–4" },
      { value: "5plus", label: "5 oder mehr" },
    ],
  },
  {
    id: "ERN-004",
    frage: "Wie oft trinken Sie zuckerhaltige Getränke (Limonade, Säfte, Energydrinks)?",
    type: "single_choice",
    section: "Trinkverhalten",
    required: false,
    options: [
      { value: "nie", label: "Nie / sehr selten" },
      { value: "woche", label: "Ein paar Mal pro Woche" },
      { value: "taeglich", label: "Täglich" },
      { value: "mehrmals", label: "Mehrmals täglich" },
    ],
  },
  // Alkohol wird bereits früher in der Vorgeschichte (PMH-016, Noxen) erfasst —
  // hier bewusst NICHT erneut fragen (keine Dublette).

  // Ernährungsform & Rhythmus
  {
    id: "ERN-010",
    frage: "Wie ernähren Sie sich überwiegend?",
    type: "multiple_choice",
    section: "Ernährungsform",
    required: true,
    options: [
      { value: "mischkost", label: "Mischkost (alles)" },
      { value: "mediterran", label: "Mediterran (viel Gemüse, Olivenöl, Fisch)" },
      { value: "vegetarisch", label: "Vegetarisch" },
      { value: "vegan", label: "Vegan" },
      { value: "low_carb", label: "Low Carb / Keto" },
      { value: "paleo", label: "Paleo" },
      { value: "rohkost", label: "Viel Rohkost" },
      { value: "unregelmaessig", label: "Unregelmäßig / keine feste Ernährungsweise" },
    ],
  },
  {
    id: "ERN-011",
    frage: "Wie oft essen Sie am Tag (inkl. Snacks)?",
    type: "single_choice",
    section: "Ess-Rhythmus",
    required: true,
    options: [
      { value: "1", label: "1× (eine Mahlzeit)" },
      { value: "2", label: "2×" },
      { value: "3", label: "3×" },
      { value: "mehr", label: "Mehr als 3× / ständig zwischendurch" },
    ],
  },
  {
    id: "ERN-012",
    frage: "Essen Sie zu einigermaßen regelmäßigen Zeiten?",
    type: "yes_no",
    section: "Ess-Rhythmus",
    required: false,
  },
  {
    id: "ERN-013",
    frage: "Wie oft kochen Sie frisch selbst (statt Fertigprodukte / auswärts)?",
    type: "single_choice",
    section: "Nahrungsqualität",
    required: false,
    options: [
      { value: "taeglich", label: "Täglich / fast immer" },
      { value: "oft", label: "Oft" },
      { value: "selten", label: "Selten" },
      { value: "kaum", label: "Kaum — überwiegend Fertigprodukte / auswärts" },
    ],
  },
  {
    id: "ERN-014",
    frage: "Wie oft essen Sie Süßigkeiten oder Gebäck?",
    type: "single_choice",
    section: "Nahrungsqualität",
    required: false,
    options: [
      { value: "selten", label: "Selten" },
      { value: "taeglich", label: "Etwa täglich" },
      { value: "mehrmals", label: "Mehrmals täglich" },
    ],
  },
  {
    id: "ERN-015",
    frage: "Haben Sie Nahrungsmittel-Unverträglichkeiten oder -Allergien?",
    type: "multiple_choice",
    section: "Verträglichkeit",
    required: false,
    options: [
      { value: "gluten", label: "Gluten / Weizen" },
      { value: "laktose", label: "Laktose (Milchzucker)" },
      { value: "histamin", label: "Histamin" },
      { value: "fructose", label: "Fruktose / FODMAP" },
      { value: "nuesse", label: "Nüsse" },
      { value: "keine", label: "Keine bekannten" },
    ],
  },
  {
    id: "ERN-016",
    frage: "Nehmen Sie Nahrungsergänzungsmittel (Vitamine, Mineralstoffe, Öle)?",
    type: "yes_no",
    section: "Supplemente",
    required: false,
  },
  {
    id: "ERN-016b",
    frage: "Falls ja: Welche und in welcher Dosierung?",
    type: "textarea",
    section: "Supplemente",
    required: false,
    condition: { field: "ERN-016", equals: true },
    placeholder: "z.B. Vitamin D 4000 IE, Omega-3 2g, Magnesium 300mg…",
  },
  {
    id: "ERN-017",
    frage: "Möchten Sie zu Ihrer Ernährung noch etwas ergänzen?",
    type: "textarea",
    section: "Ergänzung",
    required: false,
    placeholder: "In Ihren eigenen Worten…",
  },
];

// ── TIEFE (Tiefenanalyse): metabolische Flexibilität, Essverhalten, Trigger ─
export const ERNAEHRUNG_TIEFE_FRAGEN = [
  {
    id: "ERN-T-001",
    frage: "Können Sie eine Mahlzeit auslassen (4–5 h ohne Essen), ohne zittrig, reizbar oder heißhungrig zu werden?",
    type: "single_choice",
    section: "Metabolische Flexibilität",
    required: false,
    hint: "Zeigt, wie gut Ihr Körper zwischen Zucker- und Fettverbrennung wechseln kann.",
    options: [
      { value: "problemlos", label: "Ja, problemlos" },
      { value: "geht", label: "Geht, aber ungern" },
      { value: "schwer", label: "Fällt mir schwer — ich werde schnell zittrig/gereizt" },
    ],
  },
  {
    id: "ERN-T-002",
    frage: "Praktizieren Sie Intervallfasten oder ein begrenztes Essfenster?",
    type: "single_choice",
    section: "Metabolische Flexibilität",
    required: false,
    options: [
      { value: "nein", label: "Nein" },
      { value: "gelegentlich", label: "Gelegentlich" },
      { value: "regelmaessig", label: "Regelmäßig (z.B. 16:8)" },
    ],
  },
  {
    id: "ERN-T-003",
    frage: "Wie lange vor dem Schlafengehen essen Sie Ihre letzte Mahlzeit?",
    type: "single_choice",
    section: "Metabolische Flexibilität",
    required: false,
    options: [
      { value: "kurz", label: "Kurz davor (< 1 h)" },
      { value: "1_2h", label: "1–2 Stunden vorher" },
      { value: "3plus", label: "3 Stunden oder mehr vorher" },
    ],
  },
  {
    id: "ERN-T-004",
    frage: "Haben Sie ein Nachmittagstief oder Heißhunger auf Süßes/Kohlenhydrate?",
    type: "single_choice",
    section: "Blutzucker-Signale",
    required: false,
    options: [
      { value: "nein", label: "Nein" },
      { value: "manchmal", label: "Manchmal" },
      { value: "regelmaessig", label: "Regelmäßig / stark" },
    ],
  },
  {
    id: "ERN-T-005",
    frage: "Wie schnell essen Sie üblicherweise?",
    type: "single_choice",
    section: "Essverhalten",
    required: false,
    options: [
      { value: "langsam", label: "Langsam, ich kaue gründlich" },
      { value: "mittel", label: "Mittel" },
      { value: "schnell", label: "Schnell / hastig, oft nebenbei" },
    ],
  },
  {
    id: "ERN-T-006",
    frage: "Essen Sie manchmal aus emotionalen Gründen (Stress, Langeweile, Frust, Belohnung)?",
    type: "single_choice",
    section: "Essverhalten",
    required: false,
    options: [
      { value: "nein", label: "Nein" },
      { value: "manchmal", label: "Manchmal" },
      { value: "oft", label: "Oft" },
    ],
  },
  {
    id: "ERN-T-007",
    frage: "Bemerken Sie Beschwerden nach bestimmten Lebensmitteln? (Blähungen, Müdigkeit, Hautreaktionen, Kopfschmerz)",
    type: "textarea",
    section: "Food-Symptom-Trigger",
    required: false,
    placeholder: "z.B. nach Brot müde und aufgebläht; nach Milchprodukten Hautunreinheiten…",
  },
];
