/**
 * LINDEBERGS OS — Anzeige-Formatierung
 * Interne Speicherung bleibt ISO (YYYY-MM-DD) für Sortierung; Anzeige
 * durchgehend im deutschen Format TT.MM.JJJJ.
 */

export function formatDatum(iso) {
  if (!iso) return "";
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${m[3]}.${m[2]}.${m[1]}`;
}
