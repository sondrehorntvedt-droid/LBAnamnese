/**
 * LINDEBERGS OS — Online-Anamnese
 * MASTER-EXPORT — ES-Module-Kopie, Inhalt 1:1 identisch zur kanonischen Quelle.
 */

import { STAMMDATEN_FELDER, computeBMI, getBMIKategorie, computeAlter } from "./A00_stammdaten.js";
import { HAUPTBESCHWERDE_FRAGEN } from "./A01_hauptbeschwerde.js";
import { VORGESCHICHTE_FRAGEN } from "./A02_vorgeschichte_pmh.js";
import { SCHLAF_ENERGIE_FRAGEN, STOFFWECHSEL_FRAGEN, HORMONSTATUS_FRAGEN, DARMGESUNDHEIT_FRAGEN } from "./A03_daniel_vitalmedizin.js";
import { SIEBEN_FAKTOREN_INTRO, SIEBEN_FAKTOREN_FRAGEN, compute7FaktorenProfil } from "./A04_sieben_faktoren.js";
import { PSYCHOSOZIAL_INTRO, PSYCHOSOZIAL_FRAGEN, computeYellowFlags } from "./A05_psychosozial_mental.js";

export { STAMMDATEN_FELDER, computeBMI, getBMIKategorie, computeAlter };
export { HAUPTBESCHWERDE_FRAGEN };
export { VORGESCHICHTE_FRAGEN };
export { SCHLAF_ENERGIE_FRAGEN, STOFFWECHSEL_FRAGEN, HORMONSTATUS_FRAGEN, DARMGESUNDHEIT_FRAGEN };
export { SIEBEN_FAKTOREN_INTRO, SIEBEN_FAKTOREN_FRAGEN, compute7FaktorenProfil };
export { PSYCHOSOZIAL_INTRO, PSYCHOSOZIAL_FRAGEN, computeYellowFlags };

export const ANAMNESE_SCHRITTE = [
  {
    schritt: 1, id: "stammdaten", titel: "Ihre Daten",
    untertitel: "Persönliche Angaben und Einwilligung",
    modul: "A00", felder: STAMMDATEN_FELDER, geschaetzte_minuten: 3, pflicht: true
  },
  {
    schritt: 2, id: "hauptbeschwerde", titel: "Ihre Hauptbeschwerde",
    untertitel: "Was führt Sie zu uns? Die 7 W-Fragen.",
    modul: "A01", felder: HAUPTBESCHWERDE_FRAGEN, geschaetzte_minuten: 8, pflicht: true
  },
  {
    schritt: 3, id: "vorgeschichte", titel: "Ihre Krankengeschichte",
    untertitel: "Vorerkrankungen, Operationen, Medikamente, Allergien",
    modul: "A02", felder: VORGESCHICHTE_FRAGEN, geschaetzte_minuten: 6, pflicht: true
  },
  {
    schritt: 4, id: "vitalmedizin", titel: "Energie, Schlaf & Stoffwechsel",
    untertitel: "Wie geht es Ihnen insgesamt? — Vitalmedizin",
    modul: "A03",
    sektionen: [
      { id: "schlaf_energie", titel: "Schlaf & Energie", felder: SCHLAF_ENERGIE_FRAGEN },
      { id: "stoffwechsel", titel: "Stoffwechsel & Ernährung", felder: STOFFWECHSEL_FRAGEN },
      { id: "hormonstatus", titel: "Hormonstatus", felder: HORMONSTATUS_FRAGEN },
      { id: "darm", titel: "Darmgesundheit", felder: DARMGESUNDHEIT_FRAGEN }
    ],
    geschaetzte_minuten: 10, pflicht: false
  },
  {
    schritt: 5, id: "sieben_faktoren", titel: "Ihre Lebensqualität",
    untertitel: "7 Faktoren — Ihr persönliches Gesundheitsprofil",
    modul: "A04", intro: SIEBEN_FAKTOREN_INTRO, felder: SIEBEN_FAKTOREN_FRAGEN,
    geschaetzte_minuten: 5, pflicht: true
  },
  {
    schritt: 6, id: "psychosozial", titel: "Ihr Wohlbefinden",
    untertitel: "Seele und Körper sind untrennbar verbunden",
    modul: "A05", intro: PSYCHOSOZIAL_INTRO, felder: PSYCHOSOZIAL_FRAGEN,
    geschaetzte_minuten: 5, pflicht: false
  }
];

export const REGION_ZU_CDSS_MODUL = {
  hws: "04_hws",
  bws: "10_bws",
  lws: "03_lws",
  schulter_l: "01_schulter",
  schulter_r: "01_schulter",
  ellenbogen_l: "07_ellenbogen",
  ellenbogen_r: "07_ellenbogen",
  hand_l: "08_hand_handgelenk",
  hand_r: "08_hand_handgelenk",
  huefte_l: "05_huefte",
  huefte_r: "05_huefte",
  knie_l: "02_knie",
  knie_r: "02_knie",
  sprunggelenk_l: "09_sprunggelenk_fuss",
  sprunggelenk_r: "09_sprunggelenk_fuss",
  rippen_thorax: "11_rippen",
  herz_kreislauf: "S01_herz_kardio",
  lunge_atem: "S02_lunge_resp",
  bauch_verdauung: "S03_gi_abdomen",
  kopf_hno: "S04_hno_urogenital_gynaekologie",
  becken_urogenital: "S04_hno_urogenital_gynaekologie",
  allgemein_muedigkeit: null
};

export function getCDSSModule(regionen_auswahl) {
  if (!Array.isArray(regionen_auswahl)) return [];
  const module = [...new Set(regionen_auswahl.map(r => REGION_ZU_CDSS_MODUL[r]).filter(Boolean))];
  return module;
}

export function computeAnamneseAuswertung(antworten) {
  const bmi = computeBMI(antworten["SD-007"], antworten["SD-008"]);
  const alter = computeAlter(antworten["SD-003"]);
  const sieben_faktoren = compute7FaktorenProfil(antworten);
  const yellow_flags = computeYellowFlags(antworten);

  const regionen = antworten["HB-002"] || [];
  const cdss_module = getCDSSModule(regionen);

  const red_flag_antworten = antworten["HB-017"] || [];
  const aktive_red_flags = red_flag_antworten.filter(a => a !== "keines");

  const phq4_depression = (antworten["PHQ4-1"] || 0) + (antworten["PHQ4-2"] || 0);
  const phq4_angst = (antworten["PHQ4-3"] || 0) + (antworten["PHQ4-4"] || 0);
  const phq4_gesamt = phq4_depression + phq4_angst;
  const phq4_kategorie = phq4_gesamt <= 2 ? "Normal" : phq4_gesamt <= 5 ? "Mild" : phq4_gesamt <= 8 ? "Moderat" : "Schwer";

  return {
    alter, bmi, bmi_kategorie: getBMIKategorie(bmi),
    sieben_faktoren, yellow_flags,
    cdss_module_aktiviert: cdss_module,
    aktive_red_flags,
    red_flag_alert: aktive_red_flags.length > 0,
    phq4: {
      gesamt: phq4_gesamt, depression: phq4_depression, angst: phq4_angst,
      kategorie: phq4_kategorie, therapist_only: true
    }
  };
}

export const PDF_STRUKTUR = {
  sektion_1: { titel: "Stammdaten & Rahmendaten", inhalt: ["Name", "Geburtsdatum", "Alter", "Geschlecht", "BMI", "Beruf/Tätigkeit", "Datum der Anamnese"] },
  sektion_2: { titel: "Hauptbeschwerde", inhalt: ["Freitext-Beschreibung (HB-001)", "Körperregion(en)", "Schmerzcharakter", "VAS Ø/Max/Min", "Beginn & Verlauf", "Auslöser", "Linderung / Verschlechterung", "Patientenhypothese", "Bisherige Behandlungen"] },
  sektion_3: { titel: "Medizinische Vorgeschichte (PMH)", inhalt: ["Bisherige Diagnosen", "Operationen & Verletzungen", "Medikamente (inkl. Blutverdünner, Kortison)", "Allergien & Unverträglichkeiten", "Familienanamnese", "Noxen (Rauchen, Alkohol)"] },
  sektion_4: { titel: "Vitalmedizin — Schlaf, Stoffwechsel, Hormone, Darm", inhalt: ["Schlafqualität & -quantität", "Energieniveau (VAS)", "Stoffwechsel-Screening", "Hormon-Symptomkomplex", "Darmgesundheit & Ernährung"] },
  sektion_5: { titel: "7-Faktoren-Profil", inhalt: ["Spider-Chart (PDF-Grafik)", "Relief / Range / Rhythm / Regulation / Re-Energize / Relations / Rise", "Gesamtscore (%)", "Stärken & Entwicklungsfelder"] },
  sektion_6: { titel: "Psychosozial & Psychologisches Screening", inhalt: ["PHQ-4 Score (THERAPIST ONLY — nicht in Patienten-PDF)", "Yellow-Flags Risikoscore", "Stresswahrnehmung", "Belastungsfaktoren"] },
  sektion_7: { titel: "Differentialdiagnosen (CDSS-Output)", inhalt: ["Aktivierte CDSS-Module", "Top 3-6 Differentialdiagnosen je Region", "ICD-10-Codes", "Wahrscheinlichkeiten", "Nächste diagnostische Schritte"] },
  sektion_8: { titel: "Hochgeladene Befunde", inhalt: ["Liste der hochgeladenen Dokumente (Name, Datum, Typ)", "Befunde direkt verknüpft in Patientenakte"] }
};

export const ANAMNESE_META = {
  version: "1.0.0", erstellt: "2026-07-12", geschaetzte_gesamtzeit_minuten: 25,
  pflicht_schritte: ["stammdaten", "hauptbeschwerde", "vorgeschichte", "sieben_faktoren"],
  optionale_schritte: ["vitalmedizin", "psychosozial"], sprache: "de",
  plattform: "Online (Pre-Visit) — alle Schritte vor dem Termin",
  datenschutz: {
    dsgvo: true, server: "EU-Frankfurt (Supabase)",
    therapist_only_felder: ["phq4_score", "phq4_kategorie", "risk_profile"],
    patient_sieht: "Alle Antworten außer therapist_only-Felder"
  }
};
