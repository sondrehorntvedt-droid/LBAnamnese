/**
 * REGELWERK-EXPORT — friert die komplette Entscheidungsbasis als EIN
 * versioniertes JSON ein (tools/export-regelwerk.html).
 *
 * Prinzip: Git bleibt die Quelle der Wahrheit (JS-Datenmodule). Dieser
 * Export erzeugt daraus einen maschinenlesbaren, sprachunabhängigen
 * Snapshot (regelwerk/regelwerk-<version>.json), dessen SHA-256-Hash in
 * Supabase (regelwerk_versionen) veröffentlicht wird. Jede Auswertung
 * kann sich damit auf eine exakte, unveränderliche Regelversion berufen.
 *
 * Kein Zeitstempel IM Inhalt — sonst wäre derselbe Stand nie hash-gleich.
 */
import { GELENKE_BAUM } from "../data/A06_gelenke_baum.js";
import { SYSTEMISCHE_BAUM } from "../data/A07_systemisch_baum.js";
import { SAFETY_TESTS, BASISTESTS, OSTEO_ROUTINE, HB002_ZU_BASIS } from "../data/A14_testbatterie.js";
import { ABSOLUTE_RED_FLAGS, YELLOW_FLAGS, YELLOW_FLAG_RISK_LEVELS } from "../data/cdss/00_red_flags.js";
import { PATIENT_TYP_FRAGEN, SAEUGLING_ABSCHNITTE, SAEUGLING_RED_FLAGS } from "../data/A16_saeugling_eltern.js";
import { INDEX } from "./anamnese-index.js";
import { buildManifest } from "./manifest.js";

export const REGELWERK_SCHEMA = "lindebergs-regelwerk@1";

export function baueRegelwerk(version) {
  return {
    schema: REGELWERK_SCHEMA,
    version,
    fragenkatalog: INDEX,
    gelenke_baum: GELENKE_BAUM,
    systemische_baum: SYSTEMISCHE_BAUM,
    testbatterie: {
      safety: SAFETY_TESTS,
      basistests: BASISTESTS,
      osteo_routine: OSTEO_ROUTINE,
      region_zuordnung: HB002_ZU_BASIS,
    },
    red_flags: {
      absolut: ABSOLUTE_RED_FLAGS,
      yellow_flags: YELLOW_FLAGS,
      yellow_flag_risikostufen: YELLOW_FLAG_RISK_LEVELS,
    },
    saeugling: {
      patient_typ: PATIENT_TYP_FRAGEN,
      abschnitte: SAEUGLING_ABSCHNITTE,
      red_flags: SAEUGLING_RED_FLAGS,
    },
    umfang: buildManifest(),
  };
}

/** Baut das Regelwerk und legt es über den Dev-Server unter generated/ ab. */
export async function exportiereRegelwerk(version) {
  const regelwerk = baueRegelwerk(version);
  const json = JSON.stringify(regelwerk);
  const res = await fetch(`/__save/regelwerk-${version}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
  });
  if (!res.ok) throw new Error("Speichern fehlgeschlagen: HTTP " + res.status);
  return { version, bytes: json.length };
}
