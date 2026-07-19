/**
 * LINDEBERGS OS — Datenschutz-Trennung (DSGVO)
 *
 * Harte Grenze: therapist_only-Inhalte dürfen NIEMALS in der Patienten-
 * Ansicht erscheinen. Diese Datei ist die einzige Stelle, die entscheidet,
 * was der Patient sieht.
 *
 * therapist_only umfasst (aus anamnese_master ANAMNESE_META + A05 PHQ-4 +
 * CDSS 06_risikoprofil):
 *   - PHQ-4-Einzelitems und -Score (PHQ4-1..4, phq4_*)
 *   - Yellow-Flags-Score / Risikoprofile / CAD-Screening
 *   - therapist_alert-Texte der Red Flags
 *   - alle Felder mit therapist_only:true
 */

// Frage-ID-Präfixe/IDs, die niemals patientenseitig gezeigt werden.
export const THERAPIST_ONLY_IDS = ["PHQ4-1", "PHQ4-2", "PHQ4-3", "PHQ4-4"];

export function isTherapistOnlyId(id) {
  return THERAPIST_ONLY_IDS.includes(id);
}

/**
 * Liefert eine bereinigte Kopie der Antworten OHNE therapist_only-Felder —
 * für die Patienten-Zusammenfassung und den Patienten-PDF-Export.
 */
export function getPatientSafeView(answers) {
  const safe = {};
  Object.entries(answers).forEach(([k, v]) => {
    // Sowohl unpräfigierte als auch beschwerde-präfigierte IDs prüfen.
    const bareId = k.includes("::") ? k.split("::")[1] : k;
    if (isTherapistOnlyId(bareId)) return;
    safe[k] = v;
  });
  return safe;
}

/**
 * Für die (klar als Prototyp gekennzeichnete) Therapeuten-Vorschau: volle
 * Sicht. In Produktion würde dies über Supabase Row-Level-Security laufen —
 * hier im Frontend-Prototyp gibt es KEINE echte Zugriffskontrolle.
 */
export function getTherapistView(answers) {
  return answers;
}
