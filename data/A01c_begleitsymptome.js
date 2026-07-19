/**
 * LINDEBERGS OS — Begleitsymptome (B-Symptomatik)
 *
 * Klarer, immer sichtbarer Screening-Block für Allgemein-/Alarmsymptome
 * (Tumor-, Infektions-, Systemerkrankung-Abklärung) — nach der offiziellen
 * Praxis-PDF „3 - BEGLEITENDE SYMPTOME" und den klassischen B-Symptomen.
 *
 * Positive Alarmsymptome (Gewichtsverlust, Nachtschweiß, Fieber) speisen
 * zusätzlich den globalen Red-Flag-Wächter.
 */

export const BEGLEITSYMPTOME_INTRO = {
  titel: "Allgemeine Begleitsymptome",
  beschreibung:
    "Ein paar Fragen zu allgemeinen Symptomen — sie helfen uns, ernstere Ursachen frühzeitig auszuschließen. Bitte ehrlich beantworten.",
};

export const BEGLEITSYMPTOME_FRAGEN = [
  {
    id: "BS-001",
    frage: "Hatten Sie in letzter Zeit Fieber?",
    type: "single_choice",
    required: true,
    options: [
      { value: "nein", label: "Nein" },
      { value: "leicht", label: "Ja, leicht erhöht (bis 38 °C)" },
      { value: "hoch", label: "Ja, hohes Fieber (über 38,5 °C)" },
    ],
  },
  {
    id: "BS-002",
    frage: "Haben Sie nächtliches Schwitzen (durchnässte Bettwäsche), ohne dass es zu warm ist?",
    type: "yes_no",
    required: true,
    red_flag_question: true,
    alert_on: [true],
    alert_text: "Nachtschweiß kann eine ernstere Ursache haben und sollte ärztlich abgeklärt werden.",
  },
  {
    id: "BS-003",
    frage: "Haben Sie ungewollt Gewicht verloren (ohne Diät)?",
    type: "single_choice",
    required: true,
    options: [
      { value: "nein", label: "Nein" },
      { value: "leicht", label: "Ja, etwas (1–4 kg)" },
      { value: "deutlich", label: "Ja, deutlich (5 kg oder mehr) ⚠️" },
    ],
  },
  {
    id: "BS-003b",
    frage: "Falls ja: Wie viele Kilogramm in den letzten ~6 Monaten?",
    type: "number",
    unit: "kg",
    required: false,
    condition: { field: "BS-003", not_equal: ["nein"] },
  },
  {
    id: "BS-004",
    frage: "Haben Sie ungewollt zugenommen?",
    type: "single_choice",
    required: false,
    options: [
      { value: "nein", label: "Nein" },
      { value: "leicht", label: "Ja, etwas (1–4 kg)" },
      { value: "deutlich", label: "Ja, deutlich (5 kg oder mehr)" },
    ],
  },
  {
    id: "BS-005",
    frage: "Leiden Sie unter Schwindel?",
    type: "yes_no",
    required: true,
  },
  {
    id: "BS-006",
    frage: "Fühlen Sie sich allgemein ungewöhnlich abgeschlagen oder haben einen deutlichen Leistungsknick?",
    type: "yes_no",
    required: false,
  },
  {
    id: "BS-007",
    frage: "Gibt es weitere Symptome oder Veränderungen, die Sie uns mitteilen möchten?",
    type: "textarea",
    required: false,
    placeholder: "In Ihren eigenen Worten — alles, was Ihnen aufgefallen ist…",
  },
];
