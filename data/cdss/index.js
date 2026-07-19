/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Master-Index: Alle Module
 *
 * Version:  1.2.0
 * Updated:  2026-07-12
 *
 * Parietale Module:
 *  00  Red Flags (universal)
 *  01  Schulter
 *  02  Knie
 *  03  LWS
 *  04  HWS
 *  05  Hüfte
 *  06  Risikoprofil
 *  07  Ellenbogen
 *  08  Hand & Handgelenk
 *  09  Sprunggelenk & Fuß
 *  10  BWS
 *  11  Rippen & Thoraxwand
 *
 * Systemische Module:
 *  S01 Herz & Kardiovaskulär
 *  S02 Lunge & Respiratorisch
 *  S03 GI & Abdomen
 *  S04 HNO / Urogenital / Gynäkologie
 *
 * Behandlungs-Compendium:
 *  behandlung_osteopathie
 */

// ── Parietale Module ─────────────────────────────────────
import * as red_flags     from './00_red_flags.js';
import * as schulter      from './01_schulter.js';
import * as knie          from './02_knie.js';
import * as lws           from './03_lws.js';
import * as hws           from './04_hws.js';
import * as huefte        from './05_huefte.js';
import * as risikoprofil  from './06_risikoprofil.js';
import * as ellenbogen    from './07_ellenbogen.js';
import * as hand          from './08_hand_handgelenk.js';
import * as sprunggelenk  from './09_sprunggelenk_fuss.js';
import * as bws           from './10_bws.js';
import * as rippen        from './11_rippen.js';

// ── Systemische Module ───────────────────────────────────
import * as herz_kardio  from './S01_herz_kardio.js';
import * as lunge_resp   from './S02_lunge_resp.js';
import * as gi_abdomen   from './S03_gi_abdomen.js';
import * as hno_uro_gyn  from './S04_hno_urogenital_gynaekologie.js';

// ── Behandlungs-Compendium ───────────────────────────────
import * as behandlung_osteopathie from './behandlung_osteopathie.js';

// ── Regionen-Map ─────────────────────────────────────────
const CDSS_REGIONS = {
  schulter,
  knie,
  lws,
  hws,
  huefte,
  ellenbogen,
  hand,
  sprunggelenk,
  bws,
  rippen,
  herz_kardio,
  lunge_resp,
  gi_abdomen,
  hno_uro_gyn
};

// ── 7-Faktoren Score ─────────────────────────────────────
/**
 * Normiert die 7-Faktoren aus dem factors-Objekt einer Diagnose.
 * Faktoren: Relief, Range, Rhythm, Regulation, Re-Energize, Relations, Rise
 * Wertebereich je Faktor: -5 bis 0
 * Gesamt-Min = -35 → Score 0; Gesamt-Max = 0 → Score 10
 */
function compute7FaktorenScore(diagnoses, max_score = 10) {
  if (!diagnoses || !Array.isArray(diagnoses)) return [];
  return diagnoses.map(dx => {
    if (!dx.factors) return { ...dx, seven_faktoren_score: null };
    const f = dx.factors;
    const raw = (f.relief || 0) + (f.range || 0) + (f.rhythm || 0) +
                (f.regulation || 0) + (f.re_energize || 0) +
                (f.relations || 0) + (f.rise || 0);
    const normalized = Math.max(0, Math.round(((raw + 35) / 35) * max_score));
    return { ...dx, seven_faktoren_score: normalized };
  });
}

// ── CAD-Screening Pflicht ─────────────────────────────────
function requiresCADScreening(region_id, manipulation_planned = false) {
  if (region_id === 'hws' && manipulation_planned) {
    return {
      required: true,
      reason: "HWS HVLA: CAD-Risiko-Screening (RP-001) Pflicht",
      protocol: "5Ds + 3Ns + CAD-Risikofaktoren"
    };
  }
  if (['bws', 'rippen'].includes(region_id) && manipulation_planned) {
    return {
      required: true,
      reason: "Thorakale Manipulation: Frakturrisiko-Screening (RP-003) + kardiale DD",
      protocol: "Risikoprofil RP-003 (FRAX)"
    };
  }
  return { required: false };
}

// ── Viszerosomatische Reflex-Lookup ──────────────────────
function getVisceroSomaticReflex(organ_name) {
  return behandlung_osteopathie.getVisceroSomaticReflex(organ_name);
}

// ── Datenbankschema ───────────────────────────────────────
const DB_SCHEMA_DESCRIPTION = {
  tables: {
    cdss_diagnoses: {
      columns: ["id UUID", "diagnosis_code VARCHAR(12)", "name TEXT", "icd10 VARCHAR(10)", "region_id VARCHAR(20)", "description TEXT", "probability_score INT", "factors JSONB", "clinical_tests JSONB", "treatment_approaches JSONB", "osteopathic_notes TEXT", "sources TEXT[]", "emergency BOOLEAN", "created_at TIMESTAMPTZ"],
      rls: "patient darf nur eigene Diagnosen lesen"
    },
    cdss_questions: {
      columns: ["id UUID", "question_code VARCHAR(12)", "region_id VARCHAR(20)", "text TEXT", "type VARCHAR(20)", "options JSONB", "condition JSONB", "variants TEXT[]", "red_flag BOOLEAN", "hint TEXT"],
      rls: "lesbar für authenticated users"
    },
    cdss_rules: {
      columns: ["id UUID", "rule_name TEXT", "region_id VARCHAR(20)", "conditions JSONB", "event JSONB", "created_at TIMESTAMPTZ"],
      rls: "nur admin write"
    },
    risk_profiles: {
      columns: ["id UUID", "patient_id UUID", "assessment_date DATE", "cad_risk_class VARCHAR(30)", "cv_risk_score INT", "fracture_risk_score INT", "somatotype VARCHAR(15)", "venous_flags TEXT[]", "therapist_only BOOLEAN DEFAULT TRUE", "created_at TIMESTAMPTZ"],
      rls: "DATENSCHUTZ: nur Therapeut — NIEMALS an Patienten-App!",
      note: "therapist_only = TRUE ist Pflicht (DSGVO)"
    },
    patient_assessments: {
      columns: ["id UUID", "patient_id UUID", "session_id UUID", "region_id VARCHAR(20)", "variant VARCHAR(10)", "answers JSONB", "differential_diagnoses JSONB", "seven_faktoren_score JSONB", "red_flags_triggered TEXT[]", "created_at TIMESTAMPTZ", "therapist_id UUID"],
      rls: "Patient nur eigene; Therapeut eigene Patienten"
    }
  }
};

// ── CDSS Meta ─────────────────────────────────────────────
const CDSS_META = {
  version: "1.2.0",
  updated: "2026-07-12",

  parietale_regionen: 10,
  systemische_regionen: 4,

  // Grobe Schätzung — exakte Zahl beim Seeden aus JS-Arrays
  total_diagnoses: "~94",   // 74 parietale + 20 systemische
  total_rules: "110+",

  behandlung_kompendium: {
    strukturelle_osteopathie: ["HVLA", "MET", "Counterstrain", "Functional Techniques", "Soft Tissue"],
    viszerale_osteopathie_barral: ["Leber/Gallenblase", "Magen", "Dünndarm", "Dickdarm", "Nieren", "Blase", "Uterus/Ovarien", "Herz/Perikard", "Lunge/Pleura"],
    fasziale_osteopathie: ["Willard TLF", "Myers Anatomy Trains (6 Linien)"],
    kraniosakrale_osteopathie: ["CV4", "Frontal", "Temporal", "SBS", "Tentorium", "Sakral Unwinding"],
    fossum_modelle: ["RC-Modell (6 Diaphragmen)", "VVS (Batson-Plexus)", "GOA Somatotypen"],
    training: ["Krafttraining MTT", "Ausdauer", "Neuromuskulär/Propriozeption", "Funktionell", "Schroth"],
    komplementaer: ["Akupunktur", "Dry Needling", "ESWT", "Neurale Therapie", "PRP", "Phytotherapie", "Ernährungsmedizin"]
  },

  determinism: "VOLLSTÄNDIG DETERMINISTISCH — json-rules-engine. Gleiche Inputs → identische Outputs.",
  llm_role: "NUR NLP-Erklärschicht. NICHT für diagnostische Entscheidungen.",

  compliance: {
    gdpr: "DSGVO-konform (EU Frankfurt Supabase)",
    risk_profiles: "therapist_only: TRUE — NIEMALS in Patienten-App",
    emergency_stop: "stop_anamnesis: true bei Cauda Equina, Schlaganfall, STEMI, PE, Aortendissektion"
  },

  roadmap: {
    phase1: "ABGESCHLOSSEN — alle parietalen Module + Risikoprofil + Osteopathie-Kompendium",
    phase2: "ABGESCHLOSSEN — alle systemischen Module (Herz, Lunge, GI, HNO/Uro/Gyn)",
    phase3: "AUSSTEHEND — Daniel Vitalmedizin/Stoffwechsel-Modul, Supabase-Seeding, Next.js 14 UI"
  }
};

export {
  CDSS_REGIONS,
  CDSS_META,
  DB_SCHEMA_DESCRIPTION,
  behandlung_osteopathie,
  compute7FaktorenScore,
  requiresCADScreening,
  getVisceroSomaticReflex
};
