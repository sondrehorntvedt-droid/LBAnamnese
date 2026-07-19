/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Systemisches Modul S04: HNO / UROGENITAL / GYNÄKOLOGIE
 *
 * Diagnosen:
 *  HNO-001  Tinnitus H93.1
 *  HNO-002  Schwindel / Morbus Menière H81
 *  HNO-003  BPLS (Benigner paroxysmaler Lagerungsschwindel) H81.1
 *  URO-001  Urolithiasis / Nierensteine N20 ⚠️
 *  URO-002  Prostatitis / CPPS N41.3
 *  GYN-001  Endometriose N80
 *  GYN-002  Dysmenorrhö N94.4
 *
 * Quellen:
 *  - Bhattacharyya N: Clinical practice guideline: tinnitus. AAO-HNSF 2014.
 *  - Bhattacharyya N: BPPV clinical practice guideline. AAO-HNSF 2017.
 *  - Barral JP: Urogenital Manipulation. Eastland Press 1993.
 *  - Barral JP: The Female Pelvis. Eastland Press 1998.
 *  - Sinaki M et al.: Endometriosis osteopathic treatment. JAOA 2014.
 */

// ══════════════════════════════════════════
// HNO SEKTION
// ══════════════════════════════════════════

const HNO_QUESTIONS = [
  {
    id: "HNO-Q01",
    text: "Haben Sie Ohrgeräusche (Pfeifen, Rauschen, Brummen — nur Sie hören es)?",
    type: "yes_no",
    variants: ["short", "standard", "deep"]
  },
  {
    id: "HNO-Q02",
    text: "Haben Sie Schwindel? Wenn ja, welche Art?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "rotary", label: "Drehschwindel (Karussellgefühl)" },
      { value: "positional", label: "Lagerungsschwindel (beim Drehen im Bett / Aufstehen)" },
      { value: "unsteady", label: "Gangunsicherheit / Schwanken" },
      { value: "presyncope", label: "Schwarz-vor-Augen / Ohnmachtsgefühl" },
      { value: "no", label: "Kein Schwindel" }
    ]
  },
  {
    id: "HNO-Q03",
    text: "Tritt der Schwindel beim Drehen im Bett, Hinlegen oder Aufstehen auf?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    hint: "BPPV: Lagerungsabhängig, kurz (<60 Sek), kein Hörverlust",
    condition: { fact: "hno_vertigo_type", operator: "in", value: ["rotary", "positional"] }
  },
  {
    id: "HNO-Q04",
    text: "Haben Sie Hörverlust oder Druckgefühl im Ohr?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Morbus Menière: Trias = Tinnitus + Schwindel + fluktuierender Hörverlust"
  },
  {
    id: "HNO-Q05",
    text: "Haben Sie Kopfschmerzen, Nackenschmerzen oder Kieferprobleme?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Zervikogener Schwindel, CMD — wichtige MSK-Differentialdiagnosen"
  }
];

const HNO_DIAGNOSES = [
  {
    id: "HNO-001",
    name: "Tinnitus",
    icd10: "H93.1",
    probability_score: 0,
    description: "Ohrgeräusch ohne externe Schallquelle. Subjektiv (nur Patient hört es) — häufigste Form. Objektivierbarer Tinnitus selten (vaskulär, muskulär). Ätiologie: Lärm-/Lärmschaden, Presbyakusis, Medikamente (Salizylate, Aminoglykoside), Stress, Kieferprobleme (CMD). Chronisch >3 Monate. Komorbidität: Depression, Schlafstörungen, Angst.",
    treatment_approach: [
      "HNO-Abklärung: Audiogramm, Ausschluss Akustikusneurinom (MRT bei einseitigem Tinnitus!)",
      "Tinnitus Retraining Therapy (TRT): Gewöhnungstherapie",
      "Kognitive Verhaltenstherapie (KVT): Evidenz A bei chronischem Tinnitus",
      "Geräuschtherapie (Sound Enrichment, Weißes Rauschen)",
      "Hörgerät (bei gleichzeitigem Hörverlust)"
    ],
    osteopathic_note: "CMD/Kiefergelenk → N. auriculotemporalis (V₃) → Tinnitus! Temporale Knochenbehandlung (kraniosakral: Os temporale, Styloidprozess). Intrakranielle venöse Stauung (Fossum VVS: transversaler Sinus) kann zu pulsatilen Geräuschen führen. HWS (besonders OAA): zervikogener Tinnitus nach Trauma. Fisioterapia manuale cervicale zeigt Evidenz B bei zervikogenem Tinnitus (Michiels 2016).",
    factors: { relief: -1, range: 0, rhythm: -2, regulation: -2, re_energize: -2, relations: -1, rise: -1 }
  },
  {
    id: "HNO-002",
    name: "Morbus Menière",
    icd10: "H81.0",
    probability_score: 0,
    description: "Endolymphatischer Hydrops → Trias: episodischer Drehschwindel (20 Min bis 12h), fluktuierender Hörverlust (Tieftöne), Tinnitus. Druckgefühl im Ohr (Aura). Attacken spontan, nicht lageabhängig. Anfälle können zu bleibenden Hörschäden führen.",
    clinical_tests: [
      { name: "AAO-HNS Criteria", description: "Definite Menière: ≥2 Attacken 20min-12h + dokumentierter Tiefton-Hörverlust + Tinnitus/Druck", sensitivity: 0.85 }
    ],
    treatment_approach: [
      "Kochsalz-Reduktion (<1.5g Natrium/Tag)",
      "Betahistin 48mg 2x/Tag (Evidenz moderat)",
      "Diuretika (Hydrochlorothiazid) für Endolymph-Druckreduktion",
      "Intratympanale Kortikosteroide oder Gentamicin bei therapierefraktär",
      "Saccus-Dekompression (operativ)"
    ],
    osteopathic_note: "Kraniosakraler Ansatz: Os petrosum, Os temporale, Vena jugularis (Abfluss!), Fossum VVS (intrakranieller Venendruck). Lymphatisches System der Schädelbasis. NICHT in akuter Attacke behandeln.",
    factors: { relief: -2, range: -1, rhythm: -3, regulation: -2, re_energize: -2, relations: -1, rise: -2 }
  },
  {
    id: "HNO-003",
    name: "BPPV (Benigner paroxysmaler Lagerungsschwindel)",
    icd10: "H81.1",
    probability_score: 0,
    description: "Häufigste Schwindelursache (30% aller Schwindelpatienten). Otolithen (Kalziumkristalle) im posterioren Bogengang → lageabhängiger Drehschwindel (<60 Sek), nystagmus. Kein Hörverlust, kein Tinnitus. Trauma, Infektion oder spontan.",
    clinical_tests: [
      {
        name: "Dix-Hallpike-Manöver",
        description: "Schnelles Hinlegen mit 45° Kopfrotation → rotatorischer Nystagmus nach <30 Sek Latenz, <1 Min Dauer, erschöpflich",
        sensitivity: 0.79, specificity: 0.75, lr_positive: 3.2
      }
    ],
    treatment_approach: [
      "Repositionsmanöver nach Epley (Evidenz A — Gordon 2004, Cochrane)",
      "Brandt-Daroff-Übungen (häuslich)",
      "Physiotherapie-Vestibularrehabilitation bei anhaltend"
    ],
    osteopathic_note: "Os petrosum + temporale (Labyrinth) kraniosakral. OAA-Junction (atlantookzipital): zervikogene Schwindelsymptome klar abgrenzen. Nach Epley: SCC-Reintegration durch vestibulär-zervikale Behandlung möglich.",
    factors: { relief: -1, range: -1, rhythm: -2, regulation: -1, re_energize: -1, relations: 0, rise: 0 }
  }
];

// ══════════════════════════════════════════
// UROGENITAL SEKTION
// ══════════════════════════════════════════

const URO_QUESTIONS = [
  {
    id: "URO-Q01",
    text: "Haben Sie Flankenschmerz, Schmerz in der Leistengegend oder beim Wasserlassen?",
    type: "yes_no",
    variants: ["short", "standard", "deep"]
  },
  {
    id: "URO-Q02",
    text: "Haben Sie Blut im Urin (rot oder braun)?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    red_flag: true,
    hint: "Hämaturie: Nierenstein, Tumor, Infektion — immer abklären!"
  },
  {
    id: "URO-Q03",
    text: "Haben Sie Schmerzen beim Wasserlassen, häufigen Harndrang oder Brennen?",
    type: "yes_no",
    variants: ["short", "standard", "deep"],
    hint: "Dysuria + Frequenz: Harnwegsinfekt, Zystitis, Prostatitis"
  },
  {
    id: "URO-Q04",
    text: "Haben Sie Hodenschmerzen, Beckenschmerzen oder Schmerzen beim Sitzen?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "CPPS (chronisches Beckenschmerzsyndrom), Prostatitis"
  }
];

const URO_DIAGNOSES = [
  {
    id: "URO-001",
    name: "Urolithiasis / Nierensteine / Harnleiterkoliken",
    icd10: "N20",
    probability_score: 0,
    description: "Harnsteine (Ca-Oxalat 75%, Urat, Struvit, Zystin). Kolik: plötzlicher, kolikartiger Flankenschmerz mit Ausstrahlung in Leiste/Hoden/Vulva. Stärker als Geburtsschmerz. Hämaturie in 85%. Erbrechen, Unruhe.",
    clinical_tests: [
      { name: "Klopfschmerz Nierenlager", description: "Faustperkussion Kostovertebralwinkel → Schmerz", sensitivity: 0.75 },
      { name: "CT Abdomen ohne KM", description: "Goldstandard — Sensitivität 97%", sensitivity: 0.97, specificity: 0.96 }
    ],
    treatment_approach: [
      "Analgesie (Diclofenac 75mg i.m. oder rektal — CAVE Nierenfunktion!)",
      "Alpha-Blocker (Tamsulosin 0.4mg): expulsive Therapie bei Stein <10mm",
      "Ausreichend Trinken (2-3L/Tag)",
      "Stoßwellenlithotripsie (ESWL) oder Ureteroskopie bei großem Stein"
    ],
    osteopathic_note: "Barral: Nieren-Lifting, Ureterrelease, perinephrische Faszie-Mobilisation. In AKUTER Kolik: KEINE Manipulation. Nach Steinabgang oder operativer Behandlung: Nieren-Repositionierung, Psoas-Dekompressions (Psoas-Nierenbeziehung, T12-L2).",
    factors: { relief: -3, range: -2, rhythm: -3, regulation: -3, re_energize: -3, relations: 0, rise: -3 }
  },
  {
    id: "URO-002",
    name: "Prostatitis / Chronisches Beckenschmerzsyndrom (CPPS)",
    icd10: "N41.3",
    probability_score: 0,
    description: "Chronisch-abakterielles Beckenschmerzsyndrom (CPPS, NIH-Kategorie III): häufigste Prostataerkrankung bei <50-Jährigen. Schmerz Perineum, Damm, Hoden, Leiste. Miktionsbeschwerden. Kein Nachweis bakterieller Infektion. Pathomechanismus: myofasziale Dysfunktion, neuroinflammatorisch, psychosozial.",
    treatment_approach: [
      "Alpha-Blocker (Tamsulosin) bei Miktionssymptomen",
      "Antibiotika NUR bei akuter bakterieller Prostatitis (NIH-I/II)",
      "Physiotherapie Beckenboden: Triggerpunkt-Behandlung perineal (Anderson Pelvic Protocol — Evidenz B)",
      "NSAR, Quercetin (Supplement — Evidenz B)",
      "Psychotherapie bei CPPS (Schmerzbewältigung)"
    ],
    osteopathic_note: "Barral: Blasen-Prostata-Verbindung, sakrale Dekompression, Beckenbodenmobilisation extern. Craniosakral: S2-S4 parasympathisch. Beckenboden-Triggerpunkte (intern/extern). Beckenboden-MFR, ISG-Mobilisation. Psoas-Hypertonus mitbehandeln.",
    factors: { relief: -2, range: -1, rhythm: -2, regulation: -2, re_energize: -2, relations: -2, rise: -2 }
  }
];

// ══════════════════════════════════════════
// GYNÄKOLOGIE SEKTION
// ══════════════════════════════════════════

const GYN_QUESTIONS = [
  {
    id: "GYN-Q01",
    text: "Haben Sie Unterleibsschmerzen — und wenn ja, stehen diese in Zusammenhang mit Ihrer Periode?",
    type: "single_choice",
    variants: ["short", "standard", "deep"],
    options: [
      { value: "before_period", label: "Vor der Periode (prämenstruell)" },
      { value: "during_period", label: "Während der Periode" },
      { value: "after_period", label: "Nach der Periode" },
      { value: "continuous", label: "Dauerhaft, unabhängig von Zyklus" },
      { value: "no", label: "Keine zyklusassoziierten Schmerzen" }
    ]
  },
  {
    id: "GYN-Q02",
    text: "Haben Sie Schmerzen beim Geschlechtsverkehr (Dyspareunie)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Dyspareunie: typisch für Endometriose, Vulvodynie, Vaginismus"
  },
  {
    id: "GYN-Q03",
    text: "Haben Sie Probleme mit der Blase oder dem Darm, die mit Ihrer Periode zusammenhängen?",
    type: "yes_no",
    variants: ["standard", "deep"],
    hint: "Endometriose kann Blase und Darm infiltrieren → zyklische Symptome"
  },
  {
    id: "GYN-Q04",
    text: "Haben Sie unerfüllten Kinderwunsch oder sind Sie ungewollt kinderlos?",
    type: "yes_no",
    variants: ["deep"],
    hint: "Endometriose: häufige Ursache weiblicher Infertilität (30-50%)"
  }
];

const GYN_DIAGNOSES = [
  {
    id: "GYN-001",
    name: "Endometriose",
    icd10: "N80",
    probability_score: 0,
    description: "Gebärmutterschleimhaut-ähnliches Gewebe außerhalb des Uterus. Prävalenz: 10% aller Frauen reproduktiven Alters, 30-50% der infertilen Frauen. Diagnose-Delay im Schnitt 7-12 Jahre! Lokalisationen: Ovarien (Endometriome), Douglas, Rektovaginalraum, Blase, Darm, Pleura (selten). Kardinalsymptome: Dysmenorrhö, Dyspareunie, Dyschezie, Infertilität.",
    clinical_note: "Diagnose NUR durch Laparoskopie gesichert (Histologie). Klinischer Verdacht reicht für Therapiebeginn.",
    diagnostic_scores: [
      "Endometriosis Fertility Index (EFI)",
      "rAFS-Klassifikation Stadium I-IV (nach Laparoskopie)"
    ],
    treatment_approach: [
      "Hormonelle Therapie: kombinierte orale Kontrazeptiva (KOK), Gestagen-Monotherapie, GnRH-Analoga",
      "Laparoskopische Herdexzision (Goldstandard bei symptomatisch + Infertilität)",
      "Schmerztherapie: NSAR, Tramadol bei starken Beschwerden"
    ],
    osteopathic_note: "Barral: ZENTRAL! Uterusmobilisation, uterosakrale Bänder-Release (typischerweise stark verkürzt/vernarbt), Ovarien-Mobilisation. Sakraldekompression (S2-S4 parasympathisch). Narben post-Laparoskopie als Störfelder behandeln (Neurale Therapie). Sigmoid-Release (hinteres Kompartiment-Endometriose). Beckenboden-Dekompressions-Techniken. Barral hat speziell für Endometriose-Narbenbehandlung Protokolle entwickelt.",
    factors: { relief: -3, range: -2, rhythm: -3, regulation: -3, re_energize: -2, relations: -3, rise: -2 }
  },
  {
    id: "GYN-002",
    name: "Dysmenorrhö (primär / sekundär)",
    icd10: "N94.4",
    probability_score: 0,
    description: "Primäre Dysmenorrhö: Schmerzhafte Menstruation ohne organische Ursache (Prostaglandin-mediiert). Junge Frauen, kurz nach Menarche. Sekundäre Dysmenorrhö: durch Endometriose, Myome, Adenomyose — eher ältere Frauen, schlechter auf NSAR ansprechend.",
    clinical_note: "Primär vs. Sekundär unterscheiden: bei Verdacht Sekundär → Gynäkologie (Sonographie, ggf. Laparoskopie).",
    treatment_approach: [
      "Primär: NSAR (Ibuprofen 400-600mg, Naproxen 500mg) — Prostaglandinsynthesehemmer First-line",
      "KOK bei primärer Dysmenorrhö (zusätzliche Linderung)",
      "Wärmepflaster (Evidenz B: Akin 2001)",
      "Magnesium (600mg/Tag) — Evidenz B"
    ],
    osteopathic_note: "Osteopathisch gut behandelbar! Barral: Uterusmobilisation, sakrale Dekompression. ISG-Mobilisation (L5-S1, S1-S3 → Uterus-Innervation). Beckenboden-Dekompressions. Pischinger: Grundsubstanz-Entstauung abdominal/pelvinal. Komplementär: Wärme, Akupunktur (Evidenz A für Dysmenorrhö — Zhu 2011 Cochrane).",
    factors: { relief: -2, range: -1, rhythm: -2, regulation: -2, re_energize: -2, relations: -1, rise: -1 }
  }
];

// Combinierte Rules
const S04_RULES = [
  {
    name: "BPPV — Lagerungsschwindel kurz, kein Hörverlust",
    conditions: {
      all: [
        { fact: "hno_vertigo_type", operator: "equal", value: "positional" },
        { fact: "hno_hearing_loss", operator: "equal", value: false }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "HNO-003", probability_score: 88 }
  },
  {
    name: "Menière — Trias: Drehschwindel + Hörverlust + Tinnitus",
    conditions: {
      all: [
        { fact: "hno_vertigo_type", operator: "equal", value: "rotary" },
        { fact: "hno_hearing_loss", operator: "equal", value: true },
        { fact: "hno_tinnitus", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "HNO-002", probability_score: 82 }
  },
  {
    name: "Nierenstein — Kolik + Hämaturie + Flanke",
    conditions: {
      all: [
        { fact: "uro_flank_pain", operator: "equal", value: true },
        { fact: "uro_hematuria", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "URO-001", probability_score: 85 }
  },
  {
    name: "Endometriose — Dysmenorrhö + Dyspareunie + jung",
    conditions: {
      all: [
        { fact: "gyn_cycle_pain", operator: "equal", value: "during_period" },
        { fact: "gyn_dyspareunia", operator: "equal", value: true }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "GYN-001", probability_score: 72 }
  },
  {
    name: "Dysmenorrhö primär — Regelschmerz, jung, keine Sek.-Zeichen",
    conditions: {
      all: [
        { fact: "gyn_cycle_pain", operator: "equal", value: "during_period" },
        { fact: "gyn_dyspareunia", operator: "equal", value: false }
      ]
    },
    event: { type: "diagnosis", diagnosis_id: "GYN-002", probability_score: 70 }
  }
];

export {
  HNO_QUESTIONS, HNO_DIAGNOSES,
  URO_QUESTIONS, URO_DIAGNOSES,
  GYN_QUESTIONS, GYN_DIAGNOSES,
  S04_RULES
};
