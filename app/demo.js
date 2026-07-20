/**
 * LINDEBERGS OS — Demo-Modus (Musterpatient)
 *
 * Aktiviert über die URL: index.html?demo=max
 *
 * Im Demo-Modus gilt strikt read-only gegenüber echten Daten:
 *  - app/state.js lädt den Demo-Datensatz statt localStorage und
 *    persistiert NICHTS (der echte Anamnese-Stand bleibt unberührt).
 *  - app/patient-record.js liefert die Demo-Akte und speichert NICHTS.
 *  - main.js überspringt Auth-Gate und Cloud-Sync und zeigt ein
 *    deutliches Demo-Banner; app/boot.js startet keinen Auto-Sync.
 *
 * Zum Verlassen genügt das Entfernen des ?demo-Parameters (Banner-Link).
 */

export const DEMO_MODUS =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("demo") === "max";
