/**
 * LINDEBERGS OS — Online-Anamnese
 * Modul A00: STAMMDATEN & ADMINISTRATIVES
 *
 * ES-Module-Kopie (Browser) von Anamnese/A00_stammdaten.js — Inhalt 1:1
 * identisch zur kanonischen Quelle in `Anamnese Datenbanken/Anamnese/`.
 */

export const STAMMDATEN_FELDER = [

  // ── Persönliche Daten ────────────────────────────────
  {
    id: "SD-001",
    field: "vorname",
    label: "Vorname",
    type: "text",
    required: true
  },
  {
    id: "SD-002",
    field: "nachname",
    label: "Nachname",
    type: "text",
    required: true
  },
  {
    id: "SD-003",
    field: "geburtsdatum",
    label: "Geburtsdatum",
    type: "date",
    required: true
  },
  {
    id: "SD-004",
    field: "geschlecht",
    label: "Biologisches Geschlecht",
    type: "single_choice",
    required: true,
    options: [
      { value: "m", label: "Männlich" },
      { value: "f", label: "Weiblich" },
      { value: "divers", label: "Divers / Keine Angabe" }
    ],
    note: "Relevant für Risikostratifizierung und Hormonstatus"
  },
  {
    id: "SD-005",
    field: "email",
    label: "E-Mail-Adresse",
    type: "email",
    required: true
  },
  {
    id: "SD-006",
    field: "telefon",
    label: "Telefonnummer",
    type: "tel",
    required: false
  },

  // ── Körpermaße ───────────────────────────────────────
  {
    id: "SD-007",
    field: "koerpergewicht_kg",
    label: "Körpergewicht (kg)",
    type: "number",
    unit: "kg",
    min: 20,
    max: 300,
    required: true
  },
  {
    id: "SD-008",
    field: "koerpergroesse_cm",
    label: "Körpergröße (cm)",
    type: "number",
    unit: "cm",
    min: 100,
    max: 250,
    required: true,
    computed: {
      bmi: "weight_kg / (height_m * height_m)",
      display: "BMI wird automatisch berechnet"
    }
  },

  // ── Beruf & Lebenssituation ──────────────────────────
  {
    id: "SD-009",
    field: "beruf",
    label: "Beruf / Tätigkeit",
    type: "text",
    required: false,
    hint: "Relevant für ergonomische Belastungsanalyse"
  },
  {
    id: "SD-010",
    field: "taetigkeitstyp",
    label: "Art der Tätigkeit",
    type: "single_choice",
    required: true,
    options: [
      { value: "sitzend", label: "Überwiegend sitzend (Büro, Homeoffice)" },
      { value: "stehend", label: "Überwiegend stehend / gehend" },
      { value: "koerperlich", label: "Körperlich schwere Arbeit" },
      { value: "wechselnd", label: "Wechselnd (Sitzen + Stehen)" },
      { value: "nicht_berufstaetig", label: "Nicht berufstätig / Rente / Schule" }
    ]
  },
  // Beruf-Zufriedenheit & -Stress bewusst NICHT hier (zu persönlich für den
  // Einstieg) — verschoben in die Psychosozialanamnese (A05, SD-010b/c).
  {
    id: "SD-011",
    field: "handedness",
    label: "Dominante Hand",
    type: "single_choice",
    required: false,
    options: [
      { value: "rechts", label: "Rechtshändig" },
      { value: "links", label: "Linkshändig" },
      { value: "beidhändig", label: "Beidhändig" }
    ]
  },

  // ── Sportaktivität ────────────────────────────────────
  {
    id: "SD-012",
    field: "sport_haeufigkeit",
    label: "Wie oft treiben Sie Sport pro Woche?",
    type: "single_choice",
    required: true,
    options: [
      { value: "nie", label: "Gar nicht" },
      { value: "selten", label: "1-2x pro Woche" },
      { value: "regelmaessig", label: "3-4x pro Woche" },
      { value: "intensiv", label: "5+ pro Woche / Leistungssport" }
    ]
  },
  {
    id: "SD-013",
    field: "sport_arten",
    label: "Welche Sportarten betreiben Sie?",
    type: "text",
    required: false,
    placeholder: "z.B. Joggen, Krafttraining, Schwimmen..."
  },

  // ── Einwilligungen ────────────────────────────────────
  {
    id: "SD-014",
    field: "dsgvo_einwilligung",
    label: "Ich stimme der Verarbeitung meiner Gesundheitsdaten gemäß DSGVO zu.",
    type: "checkbox",
    required: true
  },
  {
    id: "SD-015",
    field: "befunde_vorhanden",
    label: "Haben Sie aktuelle Befunde, Röntgenbilder, MRT-Berichte oder Laborbefunde?",
    type: "yes_no",
    required: true,
    hint: "Sie können diese im nächsten Schritt hochladen."
  }
];

// Computed bei Absenden
export function computeBMI(weight_kg, height_cm) {
  if (!weight_kg || !height_cm) return null;
  const h = height_cm / 100;
  return +(weight_kg / (h * h)).toFixed(1);
}

export function getBMIKategorie(bmi) {
  if (!bmi) return null;
  if (bmi < 18.5) return { kat: "Untergewicht", code: "underweight" };
  if (bmi < 25.0) return { kat: "Normalgewicht", code: "normal" };
  if (bmi < 30.0) return { kat: "Übergewicht", code: "overweight" };
  if (bmi < 35.0) return { kat: "Adipositas Grad I", code: "obese_1" };
  if (bmi < 40.0) return { kat: "Adipositas Grad II", code: "obese_2" };
  return { kat: "Adipositas Grad III", code: "obese_3" };
}

export function computeAlter(geburtsdatum) {
  if (!geburtsdatum) return null;
  const today = new Date();
  const geb = new Date(geburtsdatum);
  let age = today.getFullYear() - geb.getFullYear();
  const m = today.getMonth() - geb.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < geb.getDate())) age--;
  return age;
}
