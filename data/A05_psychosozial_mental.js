/**
 * LINDEBERGS OS — Online-Anamnese
 * Modul A05: PSYCHOSOZIAL & MENTAL
 * ES-Module-Kopie — Inhalt 1:1 identisch zur kanonischen Quelle.
 *
 * WICHTIG: therapist_only = true für PHQ-4-Scores — siehe app/privacy.js.
 */

export const PSYCHOSOZIAL_INTRO = {
  titel: "Ihre geistige und emotionale Gesundheit",
  beschreibung: "Seele und Körper sind untrennbar verbunden. Bitte beantworten Sie die folgenden Fragen so ehrlich wie möglich. Alle Angaben sind vertraulich und helfen uns, Sie als ganzen Menschen zu verstehen — nicht nur Ihre körperlichen Beschwerden."
};

export const PSYCHOSOZIAL_FRAGEN = [
  {
    id: "PSY-001",
    section: "PHQ-4 Screening",
    screening_instrument: "PHQ-4",
    intro: "Wie oft haben Sie in den letzten 2 Wochen folgende Beschwerden gehabt?",
    type: "likert_4",
    scale_labels: {
      0: "Überhaupt nicht",
      1: "An einzelnen Tagen",
      2: "An mehr als der Hälfte der Tage",
      3: "Fast jeden Tag"
    },
    required: true,
    items: [
      { id: "PHQ4-1", text: "Wenig Interesse oder Freude an Ihren Aktivitäten", subscale: "depression" },
      { id: "PHQ4-2", text: "Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit", subscale: "depression" },
      { id: "PHQ4-3", text: "Nervosität, Ängstlichkeit oder Anspannung", subscale: "angst" },
      { id: "PHQ4-4", text: "Nicht in der Lage sein, Sorgen zu stoppen oder zu kontrollieren", subscale: "angst" }
    ],
    scoring: {
      gesamt_max: 12,
      grenzwerte: { normal: "0–2", mild: "3–5", moderat: "6–8", schwer: "9–12" },
      depression_subscale: "PHQ4-1 + PHQ4-2 (≥3 = auffällig)",
      angst_subscale: "PHQ4-3 + PHQ4-4 (≥3 = auffällig)"
    },
    therapist_only: true
  },
  {
    id: "PSY-002",
    frage: "Fühlen Sie sich durch Ihre Beschwerden in Ihrem Alltag stark eingeschränkt?",
    type: "single_choice",
    required: true,
    section: "Alltagseinschränkung",
    options: [
      { value: "kaum", label: "Kaum / gar nicht" },
      { value: "etwas", label: "Etwas — manche Dinge sind schwieriger" },
      { value: "deutlich", label: "Deutlich — viele Alltagsaktivitäten eingeschränkt" },
      { value: "stark", label: "Stark — kaum noch arbeitsfähig / wenig Lebensqualität" }
    ]
  },
  {
    id: "SD-010b",
    frage: "Wie zufrieden sind Sie aktuell in Ihrem Beruf?",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: false,
    section: "Beruf & Belastung",
    labels: { 0: "Gar nicht", 5: "Teils-teils", 10: "Sehr zufrieden" }
  },
  {
    id: "SD-010c",
    frage: "Wie viel Druck / Stress erleben Sie bei der Arbeit?",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: false,
    section: "Beruf & Belastung",
    labels: { 0: "Keinen", 5: "Mittel", 10: "Sehr viel" }
  },
  {
    id: "PSY-003",
    frage: "Gibt es in Ihrem Leben derzeit besondere Belastungen oder Stressoren?",
    type: "multiple_choice",
    required: false,
    section: "Psychosoziale Belastungen",
    options: [
      { value: "arbeitsstress", label: "Arbeitsstress / Überforderung / Mobbing" },
      { value: "partnerschaft", label: "Partnerschaftsprobleme / Trennung" },
      { value: "familie", label: "Familiäre Belastungen (Pflege, Konflikte, Kinderbetreuung)" },
      { value: "finanzen", label: "Finanzielle Sorgen" },
      { value: "verlust", label: "Verlust / Trauer (Todesfall, Trennung)" },
      { value: "trauma", label: "Belastendes Erlebnis / Trauma (aktuell oder vergangen)" },
      { value: "einsamkeit", label: "Einsamkeit / soziale Isolation" },
      { value: "gesundheit_sorge", label: "Sorgen um eigene oder fremde Gesundheit" },
      { value: "keine", label: "Keine besonderen Belastungen derzeit" }
    ]
  },
  {
    id: "PSY-004",
    frage: "Was glauben Sie, wie sich Ihre Beschwerden entwickeln werden?",
    type: "single_choice",
    required: true,
    section: "Yellow Flags — Schmerzkognition",
    yellow_flag: true,
    options: [
      { value: "positiv", label: "Ich glaube, sie werden besser — mit der richtigen Behandlung" },
      { value: "neutral", label: "Ich bin unsicher — mal sehen" },
      { value: "negativ", label: "Ich glaube, sie werden nicht besser" },
      { value: "katastrophal", label: "Ich befürchte das Schlimmste / bin sehr pessimistisch" }
    ]
  },
  {
    id: "PSY-005",
    frage: "Haben Sie Angst, dass Bewegung oder Aktivität Ihre Beschwerden verschlimmern könnte?",
    type: "single_choice",
    required: true,
    section: "Yellow Flags — Fear-Avoidance",
    yellow_flag: true,
    options: [
      { value: "nein", label: "Nein — ich bewege mich trotz der Beschwerden" },
      { value: "teilweise", label: "Ein bisschen — ich bin vorsichtig, aber aktiv" },
      { value: "ja_vermeide", label: "Ja — ich vermeide viele Bewegungen aus Angst vor Schmerzen" },
      { value: "ja_stark", label: "Ja, stark — ich schone mich sehr stark" }
    ]
  },
  {
    id: "PSY-006",
    frage: "Gibt es in Ihrem Umfeld Menschen, die auf Ihre Beschwerden mit großer Sorge reagieren?",
    type: "single_choice",
    required: false,
    section: "Yellow Flags — Soziale Verstärkung",
    yellow_flag: true,
    options: [
      { value: "nein", label: "Nein — alle sind unterstützend und ermutigen mich" },
      { value: "etwas", label: "Etwas — manchmal wird es übertrieben besorgt reagiert" },
      { value: "ja", label: "Ja — mein Umfeld macht sich sehr große Sorgen / schont mich sehr" }
    ]
  },
  {
    id: "PSY-007",
    frage: "Wenn Sie an Ihre Schmerzen denken — welche Gedanken kommen dabei?",
    type: "multiple_choice",
    required: false,
    section: "Yellow Flags — Katastrophisierung",
    yellow_flag: true,
    options: [
      { value: "normal", label: "Das ist ein normaler Schmerz — wird besser" },
      { value: "ernst", label: "Der Schmerz muss eine ernsthafte Ursache haben" },
      { value: "nie_besser", label: "Das wird nie besser werden" },
      { value: "dauerhaft_kaputt", label: "Ich bin dauerhaft beschädigt / kaputt" },
      { value: "kontrollverlust", label: "Ich habe keine Kontrolle über meinen Körper" },
      { value: "behinderung", label: "Ich werde behindert werden / nicht mehr arbeiten können" }
    ]
  },
  {
    id: "PSY-008",
    frage: "Wie häufig fühlen Sie sich in Ihrem Leben von Dingen überfordert, die außerhalb Ihrer Kontrolle sind?",
    type: "single_choice",
    required: true,
    section: "Perceived Stress",
    options: [
      { value: "nie", label: "Nie" },
      { value: "selten", label: "Selten" },
      { value: "manchmal", label: "Manchmal" },
      { value: "haeufig", label: "Häufig" },
      { value: "sehr_haeufig", label: "Sehr häufig — fast immer" }
    ]
  },
  {
    id: "PSY-009",
    frage: "Wie gut fühlen Sie sich in der Lage, mit den Anforderungen in Ihrem Leben umzugehen?",
    type: "single_choice",
    required: true,
    section: "Perceived Stress",
    options: [
      { value: "sehr_gut", label: "Sehr gut — ich fühle mich kompetent und handlungsfähig" },
      { value: "gut", label: "Gut — meistens okay" },
      { value: "schwierig", label: "Schwierig — oft überfordert" },
      { value: "kaum", label: "Kaum — ich sehe keinen Ausweg" }
    ]
  },
  {
    id: "PSY-010",
    frage: "Waren Sie jemals in psychologischer oder psychiatrischer Behandlung?",
    type: "single_choice",
    required: false,
    section: "Behandlungshistorie",
    options: [
      { value: "nein", label: "Nein" },
      { value: "ja_fruehbr", label: "Ja — in der Vergangenheit (erfolgreich abgeschlossen)" },
      { value: "ja_aktuell", label: "Ja — aktuell in Behandlung" },
      { value: "abgebrochen", label: "Ja — abgebrochen" }
    ]
  }
];

// Yellow-Flags Auswertung
export function computeYellowFlags(antworten) {
  let score = 0;
  const flags = [];

  if (["negativ", "katastrophal"].includes(antworten["PSY-004"])) { score += 2; flags.push("Negative Outcome-Erwartung"); }
  if (["ja_vermeide", "ja_stark"].includes(antworten["PSY-005"])) { score += 3; flags.push("Fear-Avoidance Verhalten"); }
  if (antworten["PSY-006"] === "ja") { score += 1; flags.push("Soziale Verstärkung"); }
  if ((antworten["PSY-007"] || []).some(v => ["nie_besser", "dauerhaft_kaputt", "kontrollverlust", "behinderung"].includes(v))) { score += 3; flags.push("Katastrophisierung"); }
  if (["haeufig", "sehr_haeufig"].includes(antworten["PSY-008"])) { score += 1; flags.push("Hohe Stresswahrnehmung"); }
  if (antworten["PSY-009"] === "kaum") { score += 2; flags.push("Geringe Selbstwirksamkeit"); }

  return {
    score,
    flags,
    risiko: score <= 3 ? "NIEDRIG" : score <= 7 ? "MITTEL" : "HOCH",
    empfehlung: score > 7 ? "Psychologische Mitbehandlung empfohlen. Chronifizierungsrisiko erhöht." : null
  };
}
