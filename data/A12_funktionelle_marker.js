/**
 * LINDEBERGS OS — Funktionelle Referenzbereiche (Labor)
 *
 * Zweck: Wenn ein Labor-/Ernährungs-Befund vorliegt (Upload) oder der Patient
 * bekannte Auffälligkeiten nennt, gibt diese Tabelle dem Therapeuten die
 * FUNKTIONELLEN (Optimierungs-)Bereiche an die Hand — sie liegen bewusst enger
 * als die klassischen Labor-Referenzbereiche („noch normal" ≠ „optimal").
 *
 * WICHTIG: Dies ist eine Referenz-/Interpretationshilfe, KEINE Diagnostik und
 * kein automatischer Abgleich. Die App liest (noch) keine Laborwerte aus
 * Uploads aus (OCR/KI ist Roadmap). Die Einordnung eines konkreten Wertes
 * bleibt ärztlich/therapeutisch. Quellen: Functional-Medicine-/Longevity-
 * Konsens (u.a. Attia, Bredesen, Hyman) + gängige Laborreferenzen.
 *
 * therapist_only: wird nur in der Therapeuten-Ansicht der Zusammenfassung
 * angezeigt.
 */

export const FUNKTIONELLE_MARKER = [
  {
    gruppe: "Entzündung & Immunsystem",
    marker: [
      { name: "hs-CRP", einheit: "mg/L", laborRef: "< 5", funktionell: "< 1,0", hinweis: "Stille Entzündung / kardiovaskuläres Risiko" },
      { name: "Homocystein", einheit: "µmol/L", laborRef: "< 15", funktionell: "< 7", hinweis: "Methylierung, B6/B9/B12-Status, Gefäß-/Neuro-Risiko" },
      { name: "Ferritin", einheit: "ng/mL", laborRef: "15–300", funktionell: "50–150", hinweis: "Eisenspeicher; sehr hoch auch Entzündungszeichen" },
    ],
  },
  {
    gruppe: "Blutzucker & Stoffwechsel",
    marker: [
      { name: "Nüchternglukose", einheit: "mg/dL", laborRef: "< 100", funktionell: "70–85", hinweis: "Metabolische Gesundheit" },
      { name: "HbA1c", einheit: "%", laborRef: "< 5,7", funktionell: "< 5,4", hinweis: "3-Monats-Blutzucker" },
      { name: "Nüchtern-Insulin", einheit: "µIU/mL", laborRef: "< 25", funktionell: "< 5", hinweis: "Frühzeichen Insulinresistenz" },
      { name: "HOMA-IR", einheit: "", laborRef: "< 2,5", funktionell: "< 1,0", hinweis: "Insulinresistenz-Index (Glukose × Insulin / 405)" },
      { name: "Triglyzeride/HDL-Ratio", einheit: "", laborRef: "< 3", funktionell: "< 1,5", hinweis: "Surrogat für Insulinsensitivität" },
    ],
  },
  {
    gruppe: "Schilddrüse & Hormone",
    marker: [
      { name: "TSH", einheit: "mIU/L", laborRef: "0,4–4,0", funktionell: "0,5–2,0", hinweis: "Bei Symptomen fT3/fT4 & Antikörper ergänzen" },
      { name: "Vitamin D (25-OH)", einheit: "ng/mL", laborRef: "> 20", funktionell: "40–60", hinweis: "Immun-, Knochen-, Hormonfunktion" },
    ],
  },
  {
    gruppe: "Nährstoffe & Fettsäuren",
    marker: [
      { name: "Vitamin B12 (Holo-TC)", einheit: "pg/mL", laborRef: "> 200", funktionell: "> 500", hinweis: "Bei Grenzwert Methylmalonsäure ergänzen" },
      { name: "Omega-3-Index", einheit: "%", laborRef: "—", funktionell: "> 8", hinweis: "Membran-/Herz-/Hirngesundheit" },
      { name: "Magnesium (im Vollblut)", einheit: "mmol/L", laborRef: "0,7–1,05 (Serum)", funktionell: "oberes Drittel", hinweis: "Serum unterschätzt Mangel; Vollblut aussagekräftiger" },
    ],
  },
];
