/**
 * LINDEBERGS OS — Klinische Entscheidungsunterstützung (Therapeuten)
 *
 * ⚠️ NUR THERAPEUTEN-SICHT.
 *
 * Bündelt für den letzten Zusammenfassungs-Reiter:
 *  - die aus den CDSS-Katalogen (data/cdss/*) hinterlegte, evidenzbasierte
 *    klinische Testbatterie pro Körperregion (Sensitivität/Spezifität),
 *  - lesbare Namen für die aus der Anamnese abgeleiteten Differentialdiagnosen.
 *
 * Ziel ist NICHT die vollständige Diagnostik, sondern eine erste, sichere
 * Orientierung: welche Safety-/orthopädisch-neurologisch-osteopathischen
 * Tests bieten sich an, um die Verdachtsdiagnosen zu erhärten/auszuschließen.
 */

import { CDSS_REGIONS } from "../data/cdss/index.js";
import { BASISTESTS, HB002_ZU_BASIS } from "../data/A14_testbatterie.js";

// HB-002-Region (grob) → CDSS-Katalog-Modul.
const HB002_TO_CDSS = {
  hws: "hws",
  bws: "bws",
  lws: "lws",
  schulter_l: "schulter",
  schulter_r: "schulter",
  ellenbogen_l: "ellenbogen",
  ellenbogen_r: "ellenbogen",
  hand_l: "hand",
  hand_r: "hand",
  huefte_l: "huefte",
  huefte_r: "huefte",
  knie_l: "knie",
  knie_r: "knie",
  sprunggelenk_l: "sprunggelenk",
  sprunggelenk_r: "sprunggelenk",
  rippen_thorax: "rippen",
  herz_kreislauf: "herz_kardio",
  lunge_atem: "lunge_resp",
  bauch_verdauung: "gi_abdomen",
  kopf_hno: "hno_uro_gyn",
  becken_urogenital: "hno_uro_gyn",
};

function findeDiagnosenObjekt(mod) {
  if (!mod) return null;
  const eintrag = Object.entries(mod).find(([k]) => k.endsWith("_DIAGNOSES"));
  return eintrag ? eintrag[1] : null;
}

/**
 * Liefert für eine HB-002-Region die Diagnosen + eine deduplizierte,
 * region-weite klinische Testbatterie aus dem CDSS-Katalog.
 * @returns {{ diagnosen: any[], tests: any[] } | null}
 */
export function getKlinikFuerRegion(hb002Value) {
  const modKey = HB002_TO_CDSS[hb002Value];
  if (!modKey) return null;
  const dxObj = findeDiagnosenObjekt(CDSS_REGIONS[modKey]);
  if (!dxObj) return null;

  const diagnosen = Object.values(dxObj).map((d) => ({
    name: d.name,
    key_features: d.key_features || [],
    clinical_tests: d.clinical_tests || [],
    imaging: d.imaging_recommendation || null,
    emergency: !!d.emergency,
  }));

  // Aggregierte, deduplizierte Testbatterie über alle Diagnosen der Region.
  const testMap = new Map();
  diagnosen.forEach((d) => {
    d.clinical_tests.forEach((t) => {
      if (t && t.test && !testMap.has(t.test)) testMap.set(t.test, t);
    });
  });

  return { diagnosen, tests: [...testMap.values()] };
}

// Aus internen CDSS-Gewicht-Schlüsseln (z.B. "riss_rotatorenmanschette")
// einen lesbaren Namen machen (Fallback, wenn kein Katalog-Match).
const DIAGNOSE_LABEL_MAP = {
  impingement: "Subakromiales Impingement",
  subakromiale_bursitis: "Subakromiale Bursitis",
  frozen_shoulder: "Frozen Shoulder (adhäsive Kapsulitis)",
  omarthrose: "Omarthrose (Schultergelenksarthrose)",
  riss_rotatorenmanschette: "Rotatorenmanschetten-Läsion",
  traumatische_rotatorenmanschette: "Traumatische Rotatorenmanschetten-Läsion",
  schulterinstabilitaet: "Schulterinstabilität",
  schulterluxation: "Schulterluxation",
  slap_laesion: "SLAP-Läsion",
  bankart: "Bankart-Läsion",
  zervikale_mitbeteiligung: "Zervikale Mitbeteiligung (HWS)",
  pancoast_tumor: "Pancoast-Tumor (Ausschluss!)",
  lws_radikulopathie: "Lumbale Radikulopathie",
  bandscheibe_lws: "Bandscheibenvorfall LWS",
  foramenstenose_lws: "Foraminale Stenose LWS",
  spinale_stenose: "Spinalkanalstenose",
  axiale_spondyloarthritis: "Axiale Spondyloarthritis",
  ankylosierende_spondylitis: "Morbus Bechterew",
  gonarthrose: "Gonarthrose",
  meniskusriss: "Meniskusriss",
  vkb_ruptur: "Vordere Kreuzband-Ruptur",
  pfss_patellofemoral: "Patellofemorales Schmerzsyndrom",
  coxarthrose: "Coxarthrose",
  gtps_bursitis: "Glutealtendinopathie / Trochanter-Bursitis (GTPS)",
  fai_hip: "Femoroazetabuläres Impingement (FAI)",
  labrumriss: "Labrumriss Hüfte",
  zervikale_radikulopathie: "Zervikale Radikulopathie",
  zervikale_myelopathie: "Zervikale Myelopathie",
  wad_schleudertrauma: "HWS-Distorsion (Schleudertrauma)",
  plantarfasziitis: "Plantarfasziitis",
  bss_ruptur_lateral: "Laterale Bandruptur OSG",
  osg_instabilitaet_chronisch: "Chronische OSG-Instabilität",
};

/** Gelenkspezifische Basistests (Lindebergs-Batterie) für eine HB-002-Region. */
export function getBasistestsFuerRegion(hb002Value) {
  const key = HB002_ZU_BASIS[hb002Value];
  return key ? BASISTESTS[key] : null;
}

/**
 * Ermittelt aus der Anamnese, welche Safety-Test-Gruppen indiziert sind.
 * @returns {Set<string>} indikationKeys (fraktur, obere_hws, umn, kranial, viszeral)
 */
export function computeSafetyIndikationen(answers, beschwerden) {
  const a = answers || {};
  const ind = new Set();
  const anyTrue = (suffix) => Object.entries(a).some(([k, v]) => k.endsWith(suffix) && v === true);
  const anyIncludes = (suffix, val) =>
    Object.entries(a).some(([k, v]) => k.endsWith(suffix) && Array.isArray(v) && v.includes(val));
  const dx = a["PMH-001"] || [];
  const regionen = (beschwerden || []).map((b) => b.regionValue || b.region);

  if (anyIncludes("HB-009", "unfall") || dx.includes("osteoporose") || a["PMH-010"] === true || a["PMH-005"] === true)
    ind.add("fraktur");
  if (regionen.includes("hws") || anyTrue("HWS-004")) ind.add("obere_hws");
  if (anyTrue("HWS-E-001") || anyTrue("HWS-E-002") || anyTrue("NEU-007")) ind.add("umn");
  if (
    anyTrue("HWS-005") || anyTrue("HWS-D-002") || anyTrue("NEU-006") || anyTrue("NEU-007") ||
    a["SYSG-D"] === "ja" || a["SYSG-D"] === "unsicher" || a["BS-005"] === true ||
    anyIncludes("NEU-002", "pochend einseitig (Migräne?)")
  )
    ind.add("kranial");
  if (
    regionen.includes("bauch_verdauung") || regionen.includes("becken_urogenital") ||
    a["SYSG-B"] === "ja" || a["SYSG-C"] === "ja"
  )
    ind.add("viszeral");
  return ind;
}

export function diagnoseLabel(key) {
  if (DIAGNOSE_LABEL_MAP[key]) return DIAGNOSE_LABEL_MAP[key];
  // generischer Fallback: Unterstriche → Leerzeichen, erstes Zeichen groß.
  const s = String(key).replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ICD-10 für die abgeleiteten Verdachtsdiagnosen (Differential).
const DIAGNOSE_ICD10 = {
  impingement: "M75.4", subakromiale_bursitis: "M75.5", frozen_shoulder: "M75.0",
  omarthrose: "M19.01", riss_rotatorenmanschette: "M75.1", traumatische_rotatorenmanschette: "S46.0",
  schulterinstabilitaet: "M25.31", schulterluxation: "S43.0", slap_laesion: "S43.4", bankart: "S43.4",
  zervikale_mitbeteiligung: "M54.12", pancoast_tumor: "C34.1",
  lws_radikulopathie: "M54.16", bandscheibe_lws: "M51.1", foramenstenose_lws: "M99.73", spinale_stenose: "M48.06",
  axiale_spondyloarthritis: "M46.9", ankylosierende_spondylitis: "M45.09",
  gonarthrose: "M17.9", meniskusriss: "S83.2", vkb_ruptur: "S83.53", pfss_patellofemoral: "M22.2",
  coxarthrose: "M16.9", gtps_bursitis: "M70.6", fai_hip: "M25.85", labrumriss: "M24.15",
  zervikale_radikulopathie: "M54.12", zervikale_myelopathie: "M47.12", wad_schleudertrauma: "S13.4",
  plantarfasziitis: "M72.2", bss_ruptur_lateral: "S93.4", osg_instabilitaet_chronisch: "M25.37",
};
export function diagnoseICD10(key) {
  return DIAGNOSE_ICD10[key] || "";
}

// Bekannte (gesicherte) Diagnosen aus der Vorgeschichte → Name + ICD-10.
const PMH_DIAGNOSE = {
  bluthochdruck: { name: "Arterielle Hypertonie", icd10: "I10" },
  herzerkrankung: { name: "Koronare Herzkrankheit / Herzerkrankung", icd10: "I25.9" },
  diabetes: { name: "Diabetes mellitus", icd10: "E11.9" },
  schilddruese: { name: "Schilddrüsenerkrankung", icd10: "E03.9" },
  osteoporose: { name: "Osteoporose", icd10: "M81.99" },
  rheuma: { name: "Rheumatische Erkrankung", icd10: "M06.99" },
  autoimmun: { name: "Autoimmunerkrankung", icd10: "M35.9" },
  krebs: { name: "Krebserkrankung", icd10: "C80.9" },
  copd_asthma: { name: "Lungenerkrankung (COPD/Asthma)", icd10: "J44.9" },
  neurologisch: { name: "Neurologische Erkrankung", icd10: "G98" },
  depression_angst: { name: "Psychische Erkrankung (Depression/Angst)", icd10: "F41.9" },
  darmerkrankung: { name: "Chronische Darmerkrankung", icd10: "K52.9" },
  nierenerkrankung: { name: "Nierenerkrankung", icd10: "N19" },
  gefaesserkrankung: { name: "Gefäßerkrankung", icd10: "I99.9" },
};

/**
 * Gesicherte Diagnosen aus Anamnese & (hochgeladenen) Befunden — mit ICD-10.
 * Ohne OCR beruhen sie auf Patientenangaben/bekannten Diagnosen; hochgeladene
 * Radiologie-/OP-/Laborbefunde werden als Quelle mitgeführt (KI-Auslesen = Roadmap).
 */
export function getGesicherteDiagnosen(answers, uploads) {
  const a = answers || {};
  const liste = [];
  (a["PMH-001"] || []).forEach((k) => {
    if (k === "keine_bekannt") return;
    const d = PMH_DIAGNOSE[k];
    if (d) liste.push({ name: d.name, icd10: d.icd10, quelle: "Anamnese" });
  });
  // Krebs-Detail konkretisieren.
  if (a["PMH-CA-01"]) {
    const dign = a["PMH-CA-03"] === "boesartig" ? "maligne" : a["PMH-CA-03"] === "gutartig" ? "benigne" : "";
    const jahr = a["PMH-CA-04"] ? `, ${a["PMH-CA-04"]}` : "";
    liste.push({
      name: `${a["PMH-CA-01"]}${dign ? " (" + dign + ")" : ""}${jahr}`,
      icd10: "C80.9",
      quelle: "Anamnese (Onkologie)",
    });
  }
  // Datierte Diagnosen (PMH-001b) — ICD-10 unbekannt, aber gesicherte Angabe.
  (a["PMH-001b"] || []).forEach((d) => {
    if (d && d.diagnose) liste.push({ name: d.diagnose, icd10: "", quelle: `Anamnese${d.jahr ? " (" + d.jahr + ")" : ""}` });
  });
  return liste;
}
