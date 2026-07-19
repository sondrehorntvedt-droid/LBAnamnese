/**
 * LINDEBERGS OS — CDSS Kontext-Auflösung
 *
 * Die `bedingung.feld`-Namen in GELENKE_BAUM/SYSTEMISCHE_BAUM (z.B.
 * "schmerz_lateral", "ausstrahlung_arm") sind semantische Bezeichner, die
 * NICHT identisch mit den Screening-Frage-IDs sind. Diese Datei bildet pro
 * Region/System explizit ab, welche Screening- oder Folgefrage welchen
 * semantischen Fact liefert.
 *
 * GRUNDSATZ: Sicherheitsrelevante Facts werden NIE aus unpassenden Fragen
 * „geraten". Wo keine eindeutige Quellfrage existierte (z.B.
 * "donnerschlagkopfschmerz", "fokales_defizit_akut", "akuter_brustschmerz_
 * ruhend", "hb_sturz_melena"), wurde eine eigene, unmissverständliche
 * Red-Flag-Frage im jeweiligen Screening ergänzt (NEU-006/007, KAR-007,
 * MAG-005) und hier abgebildet — statt bestehende Fragen umzudeuten.
 */

import { computeAlter } from "../data/A00_stammdaten.js";

const DURATION_DAYS = {
  akut_heute: 1,
  akut_woche: 5,
  subakut_wochen: 20,
  subakut_monate: 60,
  chronisch_6m: 135,
  chronisch_1j: 270,
  chronisch_jahre: 400,
  chronisch_viele: 1000,
};

function buildGlobalFacts(answers) {
  const alter = computeAlter(answers["SD-003"]);
  const geschlecht = answers["SD-004"];
  const onset_dauer = DURATION_DAYS[answers["HB-007"]] ?? null;
  const trauma = Array.isArray(answers["HB-009"]) && answers["HB-009"].includes("unfall");
  return { alter, geschlecht, onset_dauer, trauma };
}

const includesVal = (arr, val) => Array.isArray(arr) && arr.includes(val);

const REGION_CONTEXT_BUILDERS = {
  KIEFER_TMJ: (a) => ({
    kiefersperre: a["TMJ-004"] === "Mund kaum öffenbar",
  }),
  KLAVIKULA: (a) => ({
    trauma: a["KLA-001"] === true,
    sichtbare_verformung: a["KLA-003"] === true,
  }),
  AC_GELENK: (a) => ({
    trauma: a["AC-003"] === true,
  }),
  SCHULTER_GH: (a) => ({
    instabilitaet: a["SCH-004"] === true,
    nachtschmerz_schleichend: a["SCH-003"] === true && a["SCH-005"] === true,
    schulter_ausstrahlung_arm: a["SCH-001"] === "ausstrahlung in Arm",
    // Cross-Link zur globalen B-Symptomatik (Begleitsymptome-Schritt)
    gewichtsverlust_unerklart: a["BS-003"] === "deutlich",
  }),
  SKAPULA: (a) => ({
    skapula_alata: a["SKA-002"] === true,
  }),
  ELLBOGEN: (a) => ({
    schmerz_lateral: a["ELL-001"] === "außen (lateraler Epicondylus)",
    kribbeln_ulnar: a["ELL-004"] === true,
  }),
  UNTERARM: (a) => ({
    trauma: a["UFA-002"] === true,
    drehschmerz: a["UFA-001"] === true,
  }),
  HANDGELENK: (a) => ({
    schmerz_radial: includesVal(a["HG-001"], "radial/daumenseitig"),
    schmerz_ulnar: includesVal(a["HG-001"], "ulnar/kleinfingerseitig"),
    trauma: a["HG-003"] === true,
  }),
  HAND_FINGER: (a) => ({
    morgensteifigkeit: a["HAF-002"] === true,
    schnappender_finger: a["HAF-004"] === true,
  }),
  HWS: (a) => ({
    ausstrahlung_arm: a["HWS-002"] === true,
    trauma_hws: a["HWS-004"] === true,
    schwindel_kopfdrehung: a["HWS-005"] === true,
    myelopathie_zeichen: a["HWS-E-001"] === true || a["HWS-E-002"] === true,
  }),
  CTU: (a) => ({
    kribbeln_c8_t1: a["CTU-002"] === true,
  }),
  BWS: (a) => ({
    gurtelschmerz: a["BWS-003"] === true,
    reissender_rueckenschmerz_ausstrahlung: a["BWS-E-001"] === true,
    // Vorderer Thorax-/Brustbeinschmerz → kardiovaskulären Ausschluss anstoßen
    kardio_ausschluss_noetig: a["BWS-001"] === "Rippen/Thorax" || a["BWS-001"] === "brustbein",
  }),
  TLU: (a) => ({
    ausstrahlung_leiste: a["TLU-002"] === true,
  }),
  LWS: (a, global, allAnswers) => ({
    ausstrahlung_bein: a["LWS-002"] === true,
    morgensteifigkeit: a["LWS-003"] === true,
    gehmuedigkeit: a["LWS-005"] === true,
    // Cross-Link zu den universellen Sicherheitsfragen (Phase 3)
    blasendarm_stoerung: allAnswers["RF001-Q1"] === true,
    sattelanasthesie: allAnswers["RF001-Q2"] === true,
  }),
  LSU_SAKRUM: (a) => ({
    steissbein_schmerz: a["LSU-001"] === true,
  }),
  ISG: (a) => ({
    schwangerschaft_isg: a["ISG-004"] === true,
    morgensteifigkeit: a["ISG-005"] === true,
  }),
  SYMPHYSE: (a) => ({
    sport_belastung: a["SYM-004"] === true,
  }),
  HUEFTE: (a) => ({
    schmerz_leiste: includesVal(a["HUE-001"], "Leiste/innen"),
    schmerz_trochanter: includesVal(a["HUE-001"], "seitlich (Trochanter)"),
    ruheschmerz_nacht: a["HUE-005"] === true,
  }),
  KNIE: (a) => ({
    trauma_knie: a["KNI-005"] === true,
    schmerz_anterior: includesVal(a["KNI-001"], "vorne (Kniescheibe)"),
    knie_schwellung: a["KNI-002"] === true,
  }),
  OSG: (a) => ({
    trauma_osg: a["OSG-001"] === true,
    wiederholt_umknicken: a["OSG-005"] === true,
  }),
  USG: (a) => ({
    zustand_nach_fraktur: a["USG-002"] === true,
  }),
  MITTELFUSS: (a) => ({
    fersenschmerz_morgens: a["MF-003"] === true,
    stressreaktion_laeufer: a["MF-004"] === true,
  }),
  FUSS_ZEHEN: (a) => ({
    akute_arthritis_grosszehe: a["FZ-003"] === true,
    taubheit_interdigital: a["FZ-004"] === true,
  }),
  RIPPEN_THORAX: (a) => ({
    trauma_rippen: a["RIP-003"] === true,
    schwellung_sternum: a["RIP-004"] === true && a["RIP-002"] === "Brustbein vorne",
    atemnot_nach_trauma: a["RIP-B-001"] === true,
    gurtelschmerz_thorax: a["RIP-005"] === true,
  }),

  // ── Systemische Module (A07) ──────────────────────────────
  HERZ_KARDIO: (a) => ({
    brustschmerz_belastung: a["KAR-001"] === true,
    herzrhythmus_stoerung: a["KAR-003"] === true,
    oedeme: a["KAR-006"] === true,
    synkope_belastung: a["KAR-004"] === true,
    akuter_brustschmerz_ruhend: a["KAR-007"] === true,
  }),
  GEFAESSSYSTEM: (a) => ({
    pavk_symptome: a["GEF-001"] === true,
    akute_bein_schwellung: a["GEF-002"] === true,
    akute_tvt: a["GEF-C-001"] === true,
  }),
  LUNGE_RESP: (a) => ({
    giemen: a["LUN-003"] === true,
    raucher_packungsjahre_20_plus: a["LUN-005"] === "Aktiv-Raucher (≥20 py)",
    haemoptyse: a["LUN-004"] === true,
    akute_atemnot_ruhe: a["LUN-001"] === true,
  }),
  MAGEN_OESOPHAGUS: (a) => ({
    sodbrennen: a["MAG-001"] === true,
    dysphagie: a["MAG-004"] === true,
    hb_sturz_melena: a["MAG-005"] === true,
  }),
  DARM_KOLON: (a, global) => ({
    rome_iv_kriterien: a["DAR-004"] === true,
    morbus_crohn_verdacht: a["DAR-003"] === true,
    alter_ue_50_rektales_blut: (global.alter ?? 0) >= 50 && a["DAR-003"] === true,
  }),
  LEBER_GALLE: (a) => ({
    kolik_nach_fett: a["LEB-002"] === true,
    ikterus: a["LEB-003"] === true,
    alkohol_taeglich: a["LEB-004"] === true,
    schmerzloser_ikterus_gewichtsverlust: a["LEB-C-002"] === true,
  }),
  PANKREAS_MILZ: (a) => ({
    guertelschmerz_ausstr_ruecken: a["PAN-001"] === true,
    milz_schmerz: a["PAN-003"] === true,
  }),
  NIERE: (a, global) => ({
    kolik_ausstrahlung: a["NIE-004"] === true,
    brennen_haematurie: a["NIE-003"] === true && a["NIE-002"] === true,
    haematurie_ue_50_schmerzlos: (global.alter ?? 0) >= 50 && a["NIE-002"] === true,
  }),
  BLASE: (a) => ({
    belastungsinkontinenz: a["BLA-003"] === "beim Husten/Niesen (Belastungsinkontinenz)",
  }),
  PROSTATA: (a) => ({
    schmerz_damm_akut: a["PRO-002"] === true,
  }),
  GYNAEKOLOGIE: (a) => ({
    dysmenorrhoe: a["GYN-001"] === true,
    postmenopausale_blutung: a["GYN-004"] === true,
    einseitige_unterbauchschmerzen: a["GYN-005"] === true,
    eileiterschwangerschaft_verdacht: a["GYN-D-001"] === true && a["GYN-D-002"] === true,
  }),
  ENDOKRIN: (a) => ({
    hypothyreose_symptome: a["END-001"] === true,
    hpa_erschoepfung: a["END-004"] === true,
  }),
  HAUT: (a) => ({
    schuppige_plaques: a["HAU-002"] === true,
    veraendertes_muttermal: a["HAU-003"] === true,
    blaeschen_neuralgie: a["HAU-001"] === true,
  }),
  HNO: (a) => ({
    tinnitus: a["HNO-001"] === true,
    schwindel_hno: a["HNO-003"] === true,
    chronische_sinusitis: a["HNO-004"] === true,
  }),
  NEUROLOGIE: (a) => ({
    kopfschmerz_typ_migraene: includesVal(a["NEU-002"], "pochend einseitig (Migräne?)"),
    polyneuropathie_symptome: a["NEU-005"] === true,
    kognitive_symptome: a["NEU-004"] === true,
    donnerschlagkopfschmerz: a["NEU-006"] === true,
    fokales_defizit_akut: a["NEU-007"] === true,
  }),
  RHEUMA_IMMUNOLOGIE: (a) => ({
    symmetrische_arthritis: a["RHE-002"] === true,
    lupus_trias: a["RHE-003"] === true && a["RHE-004"] === true,
  }),
};

/**
 * Baut den vollständigen Kontext für eine Region/System-ID.
 * @param {string} regionKey — Schlüssel aus GELENKE_BAUM/SYSTEMISCHE_BAUM (z.B. "HWS")
 * @param {object} answers — state.answers
 */
export function buildKontext(regionKey, answers) {
  const global = buildGlobalFacts(answers);
  const builder = REGION_CONTEXT_BUILDERS[regionKey];
  const local = builder ? builder(answers, global, answers) : {};
  return { ...global, ...local };
}
