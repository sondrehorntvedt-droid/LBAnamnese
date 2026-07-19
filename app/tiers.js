/**
 * LINDEBERGS OS — Tiefe-Stufen (Tier-Staffelung)
 *
 * Drei Stufen steuern, WIE VIEL der Patient beantwortet — damit „Fokus" wirklich
 * kurz ist und „Deep Dive" die Tiefe bringt, ohne dass der Fragebogen ausufert.
 * Die volle inhaltliche Tiefe bleibt IMMER in der Datenbank/Regelwerk; die Stufen
 * blenden nur die Erhebung ab.
 *
 *   fokus         → ~8–10 Min   (nur Essenzielles + Sofort-Sicherheit)
 *   ganzheitlich  → ~25 Min     (Standard: solide Breite)
 *   tiefenanalyse → ~40–45 Min  (Deep Dive: volle Tiefe, gate-gesteuert)
 *
 * Zwei Tagging-Systeme:
 *  1) `variants: ["short","standard","deep"]` — bereits an den Red-Flag-Fragen
 *     (data/cdss/00_red_flags.js) vom Original vorklassifiziert.
 *  2) `minTier: "ganzheitlich"` — für neu gestaffelte Fragen (Vorgeschichte,
 *     W-Fragen): erscheint ab dieser Stufe aufwärts.
 *
 * Sicherheit hat Vorrang: Sofort-Notfälle (stop_anamnesis:true) werden NIE
 * ausgeblendet — das entscheidet der Safety-Schritt, nicht dieses Modul.
 */

export const TIER_RANK = { fokus: 0, ganzheitlich: 1, tiefenanalyse: 2 };
export const TIER_VARIANT = { fokus: "short", ganzheitlich: "standard", tiefenanalyse: "deep" };

/** Aktuelle Tiefe aus dem State (Default: ganzheitlich/Standard). */
export function aktuelleTiefe(state) {
  return (state && state.meta && state.meta.anamneseTiefe) || "ganzheitlich";
}

/** Variant-Name der aktuellen Stufe ("short"|"standard"|"deep"). */
export function variantForTier(tiefe) {
  return TIER_VARIANT[tiefe] || "standard";
}

/** true, wenn die aktuelle Stufe mindestens `minTier` erreicht. */
export function tierMind(tiefe, minTier) {
  return (TIER_RANK[tiefe] ?? 1) >= (TIER_RANK[minTier] ?? 0);
}

/**
 * Filtert eine Frageliste nach `minTier` (Fragen ohne minTier bleiben immer).
 * Für variant-getaggte Listen (Red-Flags) siehe Safety-Schritt separat.
 */
export function nachTier(felder, tiefe) {
  return (felder || []).filter((f) => !f.minTier || tierMind(tiefe, f.minTier));
}
