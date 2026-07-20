/**
 * A20 — DARM-/MIKROBIOM-REGELN (deterministische Prüf-/Maßnahmenliste)
 *
 * Zweck: Aus den Darm-/Mikrobiom-Antworten (A03 D4 + Ballaststoffe aus A11)
 * ableiten, welche Diagnostik/Maßnahmen der Therapeut erwägen sollte.
 * Deklaratives feld/op/wert-Format wie A17 (Vitalstoff) und A19 (Hormon).
 *
 * KEINE Diagnose, keine Medikation — Ausgabe ist Prüf-/Beratungsliste.
 *
 * Fachliche Anker:
 *  - Mikrobiom-Diversität & „30 Pflanzen/Woche", fermentierte Lebensmittel
 *    (T. Spector / ZOE; American Gut Project).
 *  - IBS: Rome-IV-Symptomatik → zeitlich begrenzter Low-FODMAP-Versuch;
 *    Calprotectin zum Ausschluss entzündlicher Darmerkrankung (IBD).
 *  - SIBO: postprandiale Blähungen, Verschlechterung durch Ballaststoffe/
 *    Probiotika → H2-/CH4-Atemtest.
 *  - Darm-Hirn-Achse (E. Mayer): stressgetriggerte Symptome.
 *  - Intestinale Permeabilität („Leaky Gut") — als Thema, Evidenz 🟡.
 *
 * STATUS: VORLÄUFIG — Feinschliff durch Advisory Board Vitalmedizin (Daniel).
 */

export const DARM_REGELN = [
  // ── Mikrobiom-Diversität / Ernährung ────────────────────────
  { id: "DR-DIV-NIEDRIG", wenn: { feld: "D4-009", op: "==", wert: "unter10" },
    grund: "Geringe pflanzliche Vielfalt",
    beratung: ["Pflanzenvielfalt schrittweise erhöhen (Ziel ~30 verschiedene pflanzliche Lebensmittel/Woche; Spector/ZOE)"] },
  { id: "DR-FERMENT-NIE", wenn: { feld: "D4-010", op: "==", wert: "nie" },
    grund: "Keine fermentierten Lebensmittel",
    beratung: ["Fermentiertes einführen (Joghurt/Kefir/Sauerkraut/Kimchi) für Mikrobiom-Diversität"] },
  { id: "DR-BALLAST-WENIG", wenn: { feld: "ERN-T-012", op: "==", wert: "wenig" },
    grund: "Wenig Ballaststoffe",
    beratung: ["Ballaststoffe steigern (Gemüse, Hülsenfrüchte, Vollkorn) — langsam aufbauen"] },

  // ── Antibiotika / Mikrobiom-Aufbau ──────────────────────────
  { id: "DR-AB-MEHR", wenn: { feld: "D4-007", op: "==", wert: "mehrmals" },
    grund: "Mehrfache Antibiotika (letzte 6 Monate)",
    pruefen: ["ggf. Mikrobiom-/Stuhlanalyse"],
    beratung: ["Gezielter Mikrobiom-Aufbau (Präbiotika/fermentiert/Diversität) nach Antibiotika"] },
  { id: "DR-AB-HAEUFIG", wenn: { feld: "D4-007", op: "==", wert: "haeufig" },
    grund: "Häufige Antibiotika",
    pruefen: ["Mikrobiom-/Stuhlanalyse erwägen"],
    beratung: ["Gezielter Mikrobiom-Aufbau; Ursachen der häufigen Antibiotika hinterfragen"] },

  // ── IBS (Rome IV) ───────────────────────────────────────────
  { id: "DR-IBS-BESSER", wenn: { feld: "D4-003", op: "contains", wert: "besser_nach_stuhl" },
    grund: "Bauchschmerz bessert sich nach Stuhlgang (Rome-IV-Merkmal)",
    pruefen: ["Calprotectin (IBD-Ausschluss)"],
    beratung: ["Zeitlich begrenzter Low-FODMAP-Versuch mit Wiedereinführung"] },
  { id: "DR-IBS-KRAEMPFE", wenn: { feld: "D4-003", op: "contains", wert: "krämpfe" },
    grund: "Krampfartige Bauchschmerzen",
    beratung: ["Zeitlich begrenzter Low-FODMAP-Versuch; Trigger-Tagebuch"] },
  { id: "DR-IBS-BLAEH", wenn: { feld: "D4-003", op: "contains", wert: "blähungen" },
    grund: "Blähungen / Aufgeblähtheit",
    beratung: ["Ess-Symptom-Tagebuch; ballaststofftolerante Aufbaustrategie"] },

  // ── SIBO ────────────────────────────────────────────────────
  { id: "DR-SIBO", wenn: { feld: "D4-011", op: "==", wert: true },
    grund: "Postprandiale Blähungen, verstärkt durch Ballaststoffe/Probiotika (SIBO-Hinweis)",
    pruefen: ["H2-/CH4-Atemtest (Laktulose oder Glukose)"] },

  // ── Reflux / oberer GI ──────────────────────────────────────
  { id: "DR-REFLUX", wenn: { feld: "D4-006", op: "==", wert: "taeglich" },
    grund: "Täglicher Reflux/Sodbrennen",
    pruefen: ["Ärztliche GERD-Abklärung erwägen"],
    beratung: ["Reflux-Basismaßnahmen (späte Mahlzeiten meiden, Portionsgröße, Trigger)"] },

  // ── Gluten ──────────────────────────────────────────────────
  { id: "DR-GLUTEN-SENS", wenn: { feld: "D4-005", op: "==", wert: "sensitivitaet" },
    grund: "Glutensensitivität berichtet",
    beratung: ["Strukturierter glutenreduzierter Versuch; Zöliakie-Diagnostik VOR Karenz bedenken"] },
  { id: "DR-GLUTEN-ZOEL", wenn: { feld: "D4-005", op: "==", wert: "zoeliaakie" },
    grund: "Diagnostizierte Zöliakie",
    beratung: ["Strikt glutenfrei; Nährstoffstatus prüfen (Eisen, Vitamin D, B-Vitamine)"] },

  // ── Darm-Hirn-Achse ─────────────────────────────────────────
  { id: "DR-STRESS", wenn: { feld: "D4-013", op: "==", wert: "stark" },
    grund: "Stark stressgetriggerte Darmbeschwerden",
    beratung: ["Darm-Hirn-Achse adressieren (Stressregulation, Atmung, Schlaf; Orientierung E. Mayer)"] },

  // ── Kau-Verhalten (F.X. Mayr, 1875–1965) ─────────────────────
  { id: "DR-KAU-SCHLINGT", wenn: { feld: "ERN-T-KAU", op: "==", wert: "schlinge" },
    grund: "Schlingt — kaut kaum",
    beratung: ["Gründlicher kauen (~20–30× pro Bissen, F.X. Mayr): die Vorverdauung beginnt im Mund und entlastet Magen & Darm"] },
  { id: "DR-KAU-WENIG", wenn: { feld: "ERN-T-KAU", op: "==", wert: "unter10" },
    grund: "Kaut wenig (unter ~10×)",
    beratung: ["Kau-Bewusstsein aufbauen (Ziel ~20–30× pro Bissen, F.X. Mayr); langsamer essen, Besteck zwischen den Bissen ablegen"] },
];

/** Darm-Red-Flags (dringend, aber ohne Sofort-Stopp — über globalen Wächter). */
export const DARM_RED_FLAGS = [
  { id: "D4-012", werte: ["naechtlicher_durchfall", "gewichtsverlust", "fieber_durchfall"],
    hinweis: "Nächtlicher Durchfall, ungewollter Gewichtsverlust oder Fieber mit Durchfall → mögliche entzündliche/organische Darmerkrankung: bitte ärztlich abklären (u.a. Calprotectin, ggf. Darmspiegelung)." },
];
