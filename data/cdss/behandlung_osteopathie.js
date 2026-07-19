/**
 * LINDEBERGS OS — Behandlungs-Compendium
 * Osteopathische, manualtherapeutische & trainingstherapeutische Ansätze
 *
 * Dieses Modul ist eine GEMEINSAME REFERENZ für alle CDSS-Module.
 * Jedes regionale/systemische Modul kann aus diesem Compendium
 * die passenden Behandlungsansätze referenzieren.
 *
 * ─────────────────────────────────────────────────────────────
 * QUELLEN & AUTOREN:
 *
 * Strukturelle Osteopathie:
 *  - Still AT: Philosophy of Osteopathy. Kirksville 1899.
 *  - Kuchera ML & Kuchera WA: Osteopathic Considerations in Systemic
 *    Dysfunction. KCOM Press 1994.
 *  - Greenman PE: Principles of Manual Medicine. Williams & Wilkins 1996.
 *  - DiGiovanna EL: An Osteopathic Approach to Diagnosis & Treatment. 2004.
 *
 * Viszerale Osteopathie:
 *  - Barral JP: Visceral Manipulation I & II. Eastland Press 1988/1989.
 *  - Barral JP: Urogenital Manipulation. Eastland Press 1993.
 *  - Barral JP: The Thorax. Eastland Press 1991.
 *  - Barral JP: Manipulation of the Spine. Thieme 2007.
 *
 * Neurologische Osteopathie & Faszien:
 *  - Willard FH: Nociception, the Neuroendocrine Immune System, and
 *    Osteopathic Medicine. In: Foundations of Osteopathic Medicine. 2011.
 *  - Willard FH et al.: The thoracolumbar fascia: anatomy, function and
 *    clinical considerations. J Anat 2012.
 *  - Myers TW: Anatomy Trains. Churchill Livingstone 2001 / 4th Ed. 2021.
 *
 * Kraniosakrale Osteopathie:
 *  - Sutherland WG: The Cranial Bowl. 1939.
 *  - Magoun HI: Osteopathy in the Cranial Field. 1951.
 *
 * Fossum / VVS / RC-Modell:
 *  - Fossum C (2023): Global Osteopathic Assessment — Building a Routine.
 *  - Fossum C (2026): The Venous System. Leipzig Seminar.
 *
 * Training / MTT:
 *  - Freiwald J: Optimales Dehnen. Meyer & Meyer 2009.
 *  - American College of Sports Medicine: ACSM Guidelines 2022.
 *
 * Komplementär:
 *  - Pischinger A: Das System der Grundregulation. Haug 2009.
 *  - Klinghardt D: Neurale Therapie nach Huneke. 1999.
 *
 * FDM / Faszien-Distorsionsmodell:
 *  - Typaldos S: Fascial Distortion Model — A New Paradigm for Musculoskeletal
 *    Injury and Disease. JAOA 1994.
 *  - Typaldos S: Orthopathic Medicine. FDM Educational Institute 2002.
 *  - Schleip R et al.: Fascial Plasticity — a new neurobiological explanation.
 *    J Bodywork Mov Ther 2003.
 *  - Schleip R, Findley TW, Chaitow L, Huijing PA: Fascia — The Tensional
 *    Network of the Human Body. Elsevier 2012.
 * ─────────────────────────────────────────────────────────────
 */

// ════════════════════════════════════════════════════════════
// 1. STRUKTURELLE OSTEOPATHIE (Kuchera, Greenman, DiGiovanna)
// ════════════════════════════════════════════════════════════
const STRUKTURELLE_OSTEOPATHIE = {

  HVLA: {
    name: "HVLA — High Velocity Low Amplitude (Thrust-Technik)",
    description: "Hochgeschwindigkeit, niedrige Amplitude. Zielt auf Bewegungseinschränkung (Somatic Dysfunction). Klassische 'Knack-Technik' der Osteopathie.",
    indications: ["Somatic Dysfunction (TART: Tissue texture, Asymmetry, Restricted motion, Tenderness)", "Akute und chronische Gelenkblockierungen", "Segmentale Dysfunktionen WS + periphere Gelenke"],
    contraindications: ["Instabilität", "Fraktur", "Osteoporose (FRAX >7)", "Myelopathie", "CAD-Risiko HWS (RP-001)", "Malignität", "Infektion"],
    evidence: "Evidenz A für akute LWS, Evidenz B für HWS/thorakal (Bronfort 2010, Cochrane)"
  },

  MET: {
    name: "MET — Muscle Energy Technique (Mitchell Sr.)",
    description: "Patient kontrahiert Muskel gegen definierten Therapeutenwiderstand (isometrisch oder isotonisch). Führt zu post-isometrischer Relaxation + verbesserter Gelenkbeweglichkeit.",
    variants: ["Isometrisch (PIR): 3-5 Sek Kontraktion, 10 Sek Relaxation, 3-5 Wiederholungen", "Isotonisch konzentrisch: aktive Bewegung gegen Widerstand", "Isotonisch exzentrisch: therapeutischer Widerstand gegen Bewegung (stärker)"],
    indications: ["Gelenkhypomobilität", "Muskelverkürzung", "Triggerpunkte", "Segmentale Dysfunktionen"],
    evidence: "Evidenz B (Wilson 2003, Fryer 2011)"
  },

  Counterstrain: {
    name: "Strain-Counterstrain (Jones 1964)",
    description: "Passives Positionieren des Körpers in die Richtung des geringsten Schmerzwiderstands (Folding). Hält 90 Sekunden. Sehr sanfte Technik.",
    indications: ["Akuter Schmerz", "Tenderpunkte (TPs)", "Hypertonische Muskulatur", "Postoperativ", "Sehr empfindliche Patienten"],
    principle: "Propriozeptive Fehlmeldung → Positionierung in Entspannung → Rezeptoren umprogrammiert"
  },

  FunctionalTechniques: {
    name: "Funktionelle Techniken (Hoover, Johnston)",
    description: "Folge dem Körper in seine leichteste Bewegungsrichtung (indirect). Sehr sanft, geeignet für akute und vulnerable Patienten.",
    variants: ["Balanced Ligamentous Tension (BLT)", "Functional Indirect", "Fascial Unwinding"]
  },

  SoftTissue: {
    name: "Weichteiltechniken / Myofasziales Release",
    description: "Direkte oder indirekte Behandlung von Muskeln, Faszien, Bändern. Normalisierung von Gewebespannung.",
    techniques: ["Inhibition (anhaltender Druck auf Triggerpunkt)", "Kneading / Pétrissage", "Longitudinales Stretching", "Transversale Friktion (Cyriax)", "Deep Tissue Release"]
  }
};

// ════════════════════════════════════════════════════════════
// 2. VISZERALE OSTEOPATHIE (Jean-Pierre Barral)
// ════════════════════════════════════════════════════════════
const VISZERALE_OSTEOPATHIE = {

  Grundprinzip: {
    author: "Jean-Pierre Barral DO (Grenoble / Paris)",
    principle: "Jedes Organ hat eine physiologische Eigenbewegung (Motilität) und reagiert auf Atemexkursionen (Mobilität). Verlust dieser Beweglichkeit → Adhäsionen, viszerosomatische Reflexe → MSK-Beschwerden.",
    listen_technique: "Globales listening (GL) + Lokales listening: Körper 'zeigt' dem Therapeuten, wo die primäre Dysfunktion sitzt",
    viscerosomatic_reflex: "Viszerosomatischer Reflex (VSR): Organläsion → segmentale Hyperalgesie → MSK-Schmerz (z.B. Gallenblase → rechte Schulter, Herz → linker Arm)"
  },

  organs: {
    leber_gallenblase: {
      location: "Rechter Oberbauch, unter Rippenbogen",
      osteopathic_tests: ["Hepatisches Pumping", "Glissons-Kapsel Mobilisation", "Ligamentum falciforme Zug"],
      common_restrictions: ["Rechte Zwerchfell-Restriktion", "Leber-Lungen-Adhäsion", "T5-T9 paravertebral rechts hyperalgetisch"],
      referred_msk: ["Rechte Schulter (C4-Dermatom via N. phrenicus)", "Rechtsseitige LWS", "Rechter Trapezius"],
      technique: "Recoil-Technik Leber, Gallenblasenmobilisation, Ligamentäre Dekompressions-Techniken",
      source: "Barral JP: The Liver, Stomach & Duodenum. Eastland Press 1988"
    },

    magen: {
      location: "Linker Oberbauch, epigastrial",
      osteopathic_tests: ["Magentest (Ballottement)", "Kardia-Spannung (GE-Junction)"],
      common_restrictions: ["Linkes Zwerchfell (Kardia-Adhäsion)", "Omentum minus Spannung", "Pylorus-Restriktion"],
      referred_msk: ["Linke Schulter / linke HWS", "Interscapulärer Schmerz BWS", "T6-T9 links"],
      technique: "Magenstretch, Pylorus-Release, Gastropexie-Dekompressions",
      source: "Barral JP: Visceral Manipulation I. 1988"
    },

    dunn_duenndarm: {
      location: "Zentral / periumbilikal",
      osteopathic_tests: ["Dünndarmlistening", "Mesenterialer Zug"],
      common_restrictions: ["Mesenterium-Adhäsionen (nach Op, Infektionen)", "Ileozökalklappe Dysfunktion"],
      referred_msk: ["Zentrale LWS", "Beckenbodenspannung", "Iliopsoas-Hypertonus"],
      technique: "Mesenterialer Lift, Ileozökalklappen-Mobilisation",
      source: "Barral JP: Visceral Manipulation II. 1989"
    },

    dickdarm: {
      location: "Rahmen: Colon ascendens (rechts), transversum (quer), descendens (links), Sigmoid",
      osteopathic_tests: ["Kolisches Listening", "Rolande-Recoil-Test (Colon)"],
      common_restrictions: ["Colonrahmen-Fixierung", "Haustra-Dysfunktion", "Sigmoid-Restriktion"],
      referred_msk: ["Rechte Hüfte (Colon ascendens)", "LWS-Schmerz beidseits", "Sakrum-Dysfunktion (Sigmoid)"],
      technique: "Colon-Mobilisation, Sigmoid-Release, hepatische/lienale Flexur-Mobilisation",
      source: "Barral JP: Visceral Manipulation II. 1989"
    },

    nieren: {
      location: "Retroperitoneal, Th12-L2",
      osteopathic_tests: ["Nierenlistening", "Nierenptose-Test (Glenard-Test)", "Nierenkapsel-Mobilisation"],
      common_restrictions: ["Perinephrische Faszien-Adhäsionen", "Nierenptose", "Ureterrestriktion"],
      referred_msk: ["Ipsilaterale LWS T10-L1", "Flankenschmerz", "Hüftbeuger-Hypertonus (Psoas-Nierenbeziehung)"],
      technique: "Nieren-Lifting, Fascia-renalis-Release, Nierenreposition",
      source: "Barral JP: Urogenital Manipulation. 1993"
    },

    blase_urogenital: {
      location: "Kleines Becken, suprapubisch",
      osteopathic_tests: ["Blasenlistening", "Urogenital-Palpation (extern)"],
      common_restrictions: ["Blasenligamente (lateral + posterior)", "Urethra-Spannung", "Blasenbodenspannung"],
      referred_msk: ["ISG-Schmerz", "Untere LWS", "Adduktoren-Hypertonus", "Beckenbodeninsuffizienz"],
      technique: "Blasen-Mobilisation, Ligamentum-pubovesicale-Release, Beckenbodenmobilisation",
      source: "Barral JP: Urogenital Manipulation. 1993"
    },

    uterus_ovarien: {
      location: "Kleines Becken (Frauen)",
      osteopathic_tests: ["Uterus-Listening", "Uterosakrale Bänder-Test", "Lig. rotundum-Spannung"],
      common_restrictions: ["Narben post-OP (Sectio, Laparoskopie)", "Uterosakrale Bänder-Adhäsion", "Endometriose-bedingte Restriktionen"],
      referred_msk: ["Untere LWS", "ISG-Schmerz (besonders L)", "Coccyx-Schmerz", "Beckenbodenspannung"],
      technique: "Uterusmobilisation, uterosakrale Band-Release, Ovarien-Mobilisation",
      source: "Barral JP: The Female Pelvis. Eastland Press 1998"
    },

    herz_perikard: {
      location: "Mediastinum, posterior Sternum",
      osteopathic_tests: ["Perikard-Listening (anterior Thorax)", "Herzlistening", "Lig. sternoperikardiale-Test"],
      common_restrictions: ["Perikard-Adhäsionen (post-Perikardit, post-OP)", "Pleuroperikardiale Adhäsionen", "Lig. sternoperikardiale-Spannung"],
      referred_msk: ["Linke Schulter/Arm (C3-C4/T1-T4)", "BWS interscapulär links", "HWS links"],
      technique: "Mediastinale Dekompression, Perikard-Mobilisation, Herzlistening + Recoil",
      source: "Barral JP: The Thorax. Eastland Press 1991"
    },

    lunge_pleura: {
      location: "Thorax bilateral",
      osteopathic_tests: ["Pleurale Listening", "Hiluspalpation", "Cupola (Lungenspitze)"],
      common_restrictions: ["Pleuroadhäsionen (post-Pneumonie, Pleuritis)", "Cupola-Restriktion (Zugang HWS/BWS)", "Hilus-Fixierung"],
      referred_msk: ["Ipsilatarle Schulter", "Nacken (Phrenic N.)", "Skapuläre Region", "HWS (Cupola → A. vertebralis)"],
      technique: "Pleurale Entfaltung, Cupola-Release, Hilus-Mobilisation",
      source: "Barral JP: The Thorax. 1991"
    }
  },

  viscerosomatic_chart: [
    { organ: "Herz (Perikard)", spinal_segment: "T1-T5 links", referred_msk: "Linke Schulter, linker Arm, BWS links, Kiefer" },
    { organ: "Lunge rechts", spinal_segment: "T2-T4 rechts", referred_msk: "Rechte Schulter, Nacken rechts, Skapula" },
    { organ: "Lunge links", spinal_segment: "T2-T4 links", referred_msk: "Linke Schulter, HWS links" },
    { organ: "Ösophagus", spinal_segment: "T4-T6", referred_msk: "BWS interscapulär, Sternum" },
    { organ: "Magen", spinal_segment: "T6-T9 links", referred_msk: "Linke Schulter, BWS links, Epigastrium" },
    { organ: "Leber/Gallenblase", spinal_segment: "T5-T9 rechts", referred_msk: "Rechte Schulter (Murphy-Punkt), C4 rechts" },
    { organ: "Pankreas", spinal_segment: "T6-T10", referred_msk: "Gürtelförmig BWS, linke Flanke, LWS" },
    { organ: "Dünndarm", spinal_segment: "T9-T11", referred_msk: "Nabel-Region, zentrale LWS" },
    { organ: "Colon (rechts)", spinal_segment: "T10-L1 rechts", referred_msk: "Rechte Hüfte, rechte Fossa iliaca" },
    { organ: "Colon (links)", spinal_segment: "T10-L1 links", referred_msk: "Linke Hüfte, linke Fossa iliaca" },
    { organ: "Niere (Costovertebral)", spinal_segment: "T10-L1 ipsi.", referred_msk: "Flanke, LWS, Hüftbeuger" },
    { organ: "Blase", spinal_segment: "T10-L2 + S2-S4", referred_msk: "Suprapubisch, LWS, ISG, Adduktoren" },
    { organ: "Uterus/Ovarien", spinal_segment: "T10-L2 + S2-S4", referred_msk: "Untere LWS, ISG links, Adduktoren" },
    { organ: "Prostata", spinal_segment: "S2-S4", referred_msk: "Perineum, Sakrum, ISG" },
    { organ: "Appendix", spinal_segment: "T10-L1 rechts", referred_msk: "McBurney-Punkt, rechte Fossa iliaca" }
  ]
};

// ════════════════════════════════════════════════════════════
// 3. FASZIALE WISSENSCHAFT (Frank Willard / Myers / Levin)
// ════════════════════════════════════════════════════════════
const FASZIALE_OSTEOPATHIE = {

  Willard: {
    author: "Frank H. Willard PhD, University of New England, College of Osteopathic Medicine",
    key_concepts: [
      "Thorakolumbale Faszie (TLF): 3-Schicht-Modell — posterior, middle, anterior layer. Zentrale Kraftübertragung LWS/Becken. Innervation: freie Nervenenden (mechano-, thermisch-, nozizeptiv)",
      "Neuroendokrin-Immunologische Integration: Schmerz ist ein systemisches Phänomen — nicht nur peripher sondern zentral moduliert",
      "Sensitization: periphere + zentrale Sensibilisierung = Schlüssel für chronischen Schmerz",
      "Fasziale Kontinuität: keine Lokalbehandlung ohne systemische Auswirkung"
    ],
    clinical_application: [
      "TLF-Release: manuelle Mobilisation der thorakolumbalen Faszie",
      "Posterior-zu-anterior Druckentlastung (anti-Gravitationsstrategie)",
      "Fasziale Hydrierung: Hyaluronan-Mobilisation durch sanfte Gleitbewegungen (Schleip 2015)"
    ],
    key_publications: [
      "Willard FH et al.: The thoracolumbar fascia. J Anat 2012;221(6):507-536",
      "Bordoni B, Zanier E: Skin, fascia, and scars: symptoms and systemic connections. JMMB 2014"
    ]
  },

  Myers_AnatomyTrains: {
    author: "Thomas W. Myers LMT, Kinesis Inc.",
    lines: [
      { line: "Superficial Back Line (SBL)", path: "Plantarfaszie → Wade → Ischiocrural → Sakrum → Erector spinae → Okziput", relevance: "Haltung, LWS-Schmerz, Fersensporn + Nackenspannung als EINE Linie" },
      { line: "Superficial Front Line (SFL)", path: "Zehen → Tibialis ant → Rektus femoris → Rektusbauchmusk. → Sternalis → SCM", relevance: "Vorwärtsgebeugte Haltung, Atemrestriktion, Kopfvorhalte" },
      { line: "Lateral Line (LL)", path: "Peronei → ITB → TFL → QL → Interkostales → SCM", relevance: "Laterale Stabilität, Knie-Hüfte-Schulter-HWS lateral" },
      { line: "Spiral Line (SPL)", path: "Okziput → Rhomboïdei → Serratus → oblique Abd. → TFL → Peronei → Kreuzbein", relevance: "Rotationsschiefstände, Skoliose, Rotationsasymmetrien" },
      { line: "Deep Front Line (DFL)", path: "Plantarfaszie → Tibialis post → Adduktoren → Psoas → Zwerchfell → Perikard → prävertebralen Musk. → Zungenbein", relevance: "ZENTRALE LINIE: Psoas-Zwerchfell-Herz-HWS als Einheit. Barral's viszerale Arbeit trifft Myers hier" },
      { line: "Arm Lines (4)", path: "4 Armfaszienlinien: deep/superficial front/back", relevance: "Schulter-, Ellenbogen-, Handgelenkprobleme in Verbindung" }
    ]
  }
};

// ════════════════════════════════════════════════════════════
// 4. KRANIOSAKRALE OSTEOPATHIE (Sutherland / Upledger)
// ════════════════════════════════════════════════════════════
const KRANIOSAKAL_OSTEOPATHIE = {
  history: "William Garner Sutherland DO (1873-1954): Entdeckte 'Primary Respiratory Mechanism' (PRM). John Upledger DO (1932-2012): Entwickelte CranioSacral Therapy (CST) als klinische Methode.",

  PRM_Mechanismus: {
    components: [
      "Rhythmische Gehirnbewegung (6-12 Zyklen/Minute)",
      "Liquorzirkulation / CSF-Fluss",
      "Gegensätzliche Membranspannungen (Falx cerebri, Tentorium cerebelli)",
      "Knochenelastizität der kranialen Nähte",
      "Kraniosakrale Achse: Okziput ↔ Sakrum als Einheit"
    ],
    clinical_palpation: "Still Point / Stille: Therapeut wartet auf Pause im CRI (Cranial Rhythmic Impulse) → Neuorganisation"
  },

  techniques: [
    { name: "CV4 (Compression of Fourth Ventricle)", description: "Okziput-Kompression → Still Point → systemische Relaxation. Parasympathikus-Aktivierung." },
    { name: "Frontale Dekompression", description: "Frontale Knochen-Mobilisation → Frontalsinus, Kognition, Stress" },
    { name: "Temporale Entspannung", description: "Os temporale: N. VII, N. VIII, Vena jugularis" },
    { name: "Sphänobalasiläre Symphyse (SBS)", description: "Zentrale Basis des Schädels. SBS-Torsion, SBS-Sideshift, SBS-Kompression" },
    { name: "Tentorium-Release", description: "Membranspannungsausgleich zwischen Supra-/Infratentorial" },
    { name: "Sakrales Unwinding", description: "Sakrum: Dural attachment S2. Sacroiliakal + dural span" }
  ]
};

// ════════════════════════════════════════════════════════════
// 5. FOSSUM MODELLE (RC-Modell + VVS + GOA)
// ════════════════════════════════════════════════════════════
const FOSSUM_MODELLE = {

  RC_Modell: {
    name: "Respiratory-Circulatory Model (Fossum nach Still)",
    principle: "Atemmechanik als Motor für alle Flüssigkeitsbewegungen im Körper: Lymphe, venöses Blut, CSF, interstitielle Flüssigkeit.",
    hierarchy_of_treatment: [
      "1. Atemfähigkeit wiederherstellen (Diaphragma, 1. Rippe, thorakoabdominaler Übergang)",
      "2. Obstruktionen der horizontalen Diaphragmen aufheben (Beckenboden → lumbales D. → thorakales D. → zervikothorakaler Übergang → Tentorium)",
      "3. Flüssigkeitsbewegung augmentieren (lymphatische Pumpe, venöse Drainage)",
      "4. Dann erst strukturelle Behandlung der Extremitäten / Wirbelsäule"
    ],
    diaphragmen: [
      { name: "Beckenboden", level: "S3-S4", clinical_relevance: "Beckenbodenspannung → ISG, Sakrum, LWS, Blase" },
      { name: "Lumbales Diaphragma (Psoas/QL)", level: "L1-L2", clinical_relevance: "Psoas-Spannung → Niere, Ureter, LWS" },
      { name: "Zwerchfell (thorakoabdominal)", level: "T8-T12", clinical_relevance: "Haupt-Atemmotor, Verbindung Thorax/Abdomen, Perikard" },
      { name: "Thoracic Inlet (zervikothorakal)", level: "T1-T3/C7", clinical_relevance: "Lymphabfluss (Ductus thoracicus links!), 1. Rippe, Armplexus" },
      { name: "Zervikales Diaphragma (Hyoid)", level: "C2-C3", clinical_relevance: "Zungenbein, Schlucken, HWS-Dysfunktion" },
      { name: "Tentoriales Diaphragma", level: "Kranial", clinical_relevance: "Okzipitale Kompression, venöse Sinusdrainage" }
    ]
  },

  VVS_Modell: {
    name: "Vertebrales Venöses Plexussystem (Fossum 2026, nach Batson 1940)",
    principle: "IVVP (internal vertebral venous plexus) + EVVP (external): bidirektionale Verbindung Schädel ↔ Becken. Kein Klappenventilsystem — druckabhängiger Fluss.",
    clinical_importance: [
      "Kopfschmerz durch erhöhten intrakraniellen Druck: venöse Stauung als Ursache prüfen",
      "Radikuäre Schmerzen: venöse Stauung im Foraminalbereich",
      "Lumbalgie: epidurales Venengeflecht unter Druckerhöhung (Husten, Niesen)",
      "Behandlung: horizontale Diaphragmen ZUERST, dann kraniale Venensinusdrainage"
    ]
  },

  GOA_Somatotypen: {
    name: "Global Osteopathic Assessment — Somatotypologie (Fossum nach Sheldon)",
    principle: "Konstitutionstyp informiert Therapieplanung, Behandlungstiefe und Gewebeverhalten.",
    ectomorph: { treatment_priority: "Stabilisation → keine weiteren Dehnungen!", risk: "Hypermobilität, Instabilität, Frakturrisiko" },
    mesomorph: { treatment_priority: "Balance Kräftigung/Mobilisation", risk: "Durchschnittlich" },
    endomorph: { treatment_priority: "Metabolische Faktoren, Kardio-Risiko beachten", risk: "KV + metabolisch" }
  }
};

// ════════════════════════════════════════════════════════════
// 6. MEDIZINISCHES TRAINING (MTT / EAT)
// ════════════════════════════════════════════════════════════
const TRAINING_THERAPIE = {

  Grundsatz: "Training ist Medizin — nach Hippokrates ('Die Bewegung ist des Menschen beste Medizin'). Medizinische Trainingstherapie (MTT) = evidenzbasierter Standard für MSK + kardiovaskuläre + metabolische Erkrankungen.",

  ACSM_Guidelines: {
    source: "American College of Sports Medicine: Guidelines for Exercise Testing and Prescription. 2022.",
    principles: ["FITT: Frequency, Intensity, Time, Type", "Progressive Überlastung", "Spezifität", "Reversibilität", "Individualität"]
  },

  Trainingsformen: {
    Krafttraining: {
      name: "Krafttraining / Resistance Training",
      evidence: "Evidenz A für MSK, Osteoporose, Metabolismus, Depression",
      parameters: "3x/Woche, 2-4 Sätze, 6-15 Wdh, 60-85% 1RM",
      for_musculoskeletal: ["Exzentrische Belastung (Achille, Patellasehne, Lateral Epikondylalgie)", "Heavy Slow Resistance (HSR)", "Postoperativer Aufbau", "Sturzprophylaxe Ältere"],
      key_reference: "Alfredson H: Eccentric calf muscle training in chronic Achilles tendinosis. BJSM 1998"
    },

    Ausdauertraining: {
      name: "Ausdauertraining / Cardiovascular Endurance",
      evidence: "Evidenz A für Herz, Lunge, Metabolismus, Mentale Gesundheit",
      parameters: "150-300 Min/Woche moderate Intensität oder 75-150 Min vigorous",
      for_conditions: ["KHK (Herzrehabilitation Phase II-III)", "COPD (pulmonale Rehabilitation)", "Metabolisches Syndrom", "Depression", "Gonarthrose", "Fibromyalgie"]
    },

    NeuromuskulaereRehab: {
      name: "Neuromuskuläres Training / Propriozeption",
      evidence: "Evidenz A für Sturzprophylaxe, OSG-Instabilität, VKB-Prävention",
      techniques: ["Balance Board Training", "Wackelkissen / BOSU", "Single-Leg Stance Progression", "Reaktionstraining", "Vibrations-Propriozeption"],
      key_reference: "Hupperets MD: Effect of unsupervised home based proprioceptive training on recurrences of ankle sprain. BMJ 2009"
    },

    FunktionellesTraining: {
      name: "Funktionelles Training / Bewegungsmuster",
      principle: "Training in globalen Bewegungsmustern (nicht isoliert). Transfer in Alltagsbewegungen.",
      patterns: ["Squat / Hip Hinge (Knie-Hüfte-Mechanik)", "Push / Pull (Schulter-Arm)", "Core Stabilisation (Planke, Dead Bug)", "Gait Training (Gangschulung)", "Carry variations (loaded movement)"]
    },

    SchrothMethode: {
      name: "Schroth-Methode (Dreidimensionale Skoliosetherapie)",
      indication: "Skoliose, Scheuermann-Kyphose, Asymmetrische WS-Deformitäten",
      principle: "3D-Atemkorrekturen + Muskelaktivierungsmuster gegen Deformität",
      evidence: "Evidenz B (Weiss 2016)"
    }
  }
};

// ════════════════════════════════════════════════════════════
// 7. KOMPLEMENTÄRE VERFAHREN (KAM)
// ════════════════════════════════════════════════════════════
const KOMPLEMENTAERE_VERFAHREN = {

  Akupunktur: {
    name: "Akupunktur / Dry Needling",
    TCM_vs_Western: "TCM-Akupunktur: Meridiane + Qi-Konzept. Western Medical Acupuncture: neurophysiologisch erklärt (Endorphinfreisetzung, segmentale Hemmung, deszendente Schmerzmodulation).",
    evidence: {
      high: ["Chronischer LWS-Schmerz (Cochrane 2013: moderate Evidenz)", "Nackenschmerz", "Osteoarthritis Knie", "Kopfschmerz/Migräne", "Fibromyalgie"],
      moderate: ["Schulter-Impingement", "Epikondylalgie", "Plantar Fasziitis"],
      low: ["Akuter LWS-Schmerz"]
    }
  },

  DryNeedling: {
    name: "Dry Needling (Triggerpunkt-Nadeln)",
    principle: "Direkte Nadelung von myofaszialen Triggerpunkten. Lokale Zuckungsreaktion (LTR) → Desensibilisierung.",
    evidence: "Evidenz B: Llamas-Ramos et al. 2014, Unverzagt 2015",
    difference_to_acupuncture: "Dry Needling = westliches Triggerpunkt-Paradigma. Nadeln gleich, Konzept verschieden."
  },

  StosswellenTherapie: {
    name: "Extrakorporale Stoßwellentherapie (ESWT)",
    types: ["Fokussierte ESWT (tief, höhere Energie)", "Radiale ESWT (oberflächlich, breiter)"],
    evidence_A: ["Plantarfasziitis (>6 Monate)", "Kalkschulter (Ca²⁺-Ablagerung)", "Glutealtendinopathie"],
    evidence_B: ["Achillestendinopathie Midportion", "Epikondylalgie lateral", "Patellatendinopathie"],
    mechanism: "Kavitation → Mikrotrauma → Neovaskularisation + Heilungsreaktion"
  },

  NeuraleTherapie: {
    name: "Neurale Therapie (Huneke / Klinghardt)",
    principle: "Lokalanästhetikum (meist Procain) an Störfeldern oder Ganglien → 'Sekundenphänomen' = sofortige Fernwirkung.",
    applications: ["Narben-Behandlung (post-OP, Unfallnarben)", "Ganglion stellatum Blockade", "ISG-Infiltration", "Triggerpunkt-Infiltration"],
    lindebergs_relevance: "Kombinierbar mit osteopathischer Behandlung — Narben als Störfelder im Sinne Fossums"
  },

  PRP: {
    name: "PRP (Platelet-Rich Plasma) / Orthobiologicals",
    evidence: { moderate: ["Gonarthrose (Evidenz B)", "Laterale Epikondylalgie"], low: ["Achillestendinopathie (gemischt)", "Rotatorenmanschette"] },
    note: "Wachstumsreich + anti-inflammatorisch + regenerativ. Keine Kortison-ähnlichen Nebenwirkungen."
  },

  Osteopathische_Phytotherapie: {
    name: "Phytotherapie / Nutzpflanzen (Vitalmedizin)",
    examples: [
      { plant: "Teufelskralle (Harpagophytum)", indication: "MSK-Entzündung, LWS-Schmerz", evidence: "Evidenz B" },
      { plant: "Weidenrinde (Salix)", indication: "Analgetisch (Salicylsäure-Vorläufer)", evidence: "Evidenz B" },
      { plant: "Curcumin (Kurkuma)", indication: "Anti-inflammatorisch, Arthrose", evidence: "Evidenz B" },
      { plant: "Boswellia (Weihrauch)", indication: "Anti-inflammatorisch, IBD, Arthritis", evidence: "Evidenz B" }
    ]
  },

  Ernaehrungsmedizin_Ortho: {
    name: "Ernährungsmedizin / Anti-inflammatorische Ernährung",
    principle: "Entzündungsregulation durch Ernährung als adjuvante Therapie bei chronischen MSK-Erkrankungen",
    approaches: [
      "Mediterrane Ernährung (Omega-3 ↑, Omega-6 ↓)",
      "Ausreichend Protein für Regeneration (1.6-2.0g/kg KG bei Tendinopathien)",
      "Vitamin D (Knochen + Muskelkraft) — Standard: 2000-4000 IE/Tag",
      "Kollagen-Hydrolysat (5-15g vor exzentrischer Belastung — Shaw 2017 Evidenz B)",
      "Intermittierendes Fasten: anti-inflammatorisch, mTOR-Modulation"
    ]
  }
};

// ════════════════════════════════════════════════════════════
// 8. FDM — FASCIAL DISTORTION MODEL (Stephen Typaldos DO)
// ════════════════════════════════════════════════════════════
const FDM_MODELL = {

  Grundprinzip: {
    author: "Stephen Typaldos DO (1957-2006), FDM Educational Institute",
    year_developed: 1991,
    core_concept: "Faszien sind keine passiven Hüllen, sondern aktiv verformbare Strukturen. 6 spezifische 'Distorsionen' (Verformungen) entstehen bei Trauma oder Überlastung. Patienten ZEIGEN ihre Distorsion durch charakteristische Körpersprache (Handgeste). Therapeut interpretiert die Geste → spezifische Technik.",
    hallmark: "Körpersprache des Patienten = Diagnose. 'The patient is always right' — die Geste führt die Behandlung.",
    evidence: "Evidenz: Fallserien, Expertenkonsens. RCT begrenzt. Weit verbreitet in Notfall- und Sportmedizin (Österreich, Deutschland). Klinische Effektivität gut dokumentiert bei akuten MSK-Beschwerden.",
    sources: [
      "Typaldos S: JAOA 1994;94:647-655",
      "Gutersohn C: FDM in der Notaufnahme. Notfall+Rettungsmed 2013",
      "Rähm S: FDM bei Sprunggelenkverletzungen. BJSM 2020"
    ]
  },

  sechs_distorsionen: [

    {
      id: "FDM-1",
      name: "Triggerpunkt (Triggerband — TB)",
      german: "Triggerband",
      patient_gesture: "Patient streicht mit Finger eine LINIE entlang des Schmerzwegs — zeichnet eine Linie auf der Haut",
      pathomechanism: "Faszienband verdreht/verhakt auf sich selbst → Zugspannung entlang des Verlaufs",
      clinical_presentation: ["Linienförmiger Schmerz — zieht entlang Muskel/Sehne/Extremität", "Patient zieht mit Fingerkuppe den Schmerzweg nach", "Tritt bei Dehnung/Bewegung auf"],
      treatment: {
        technique: "Therapeutischer Druck entlang der gezogenen Linie — thumb slide / finger slide. Folge dem Linienverlauf des Patienten mit konstantem Druck.",
        pressure: "Mitteltief bis tief, gleitend",
        duration: "Sekunden bis Minuten — bis Schmerz nachlässt",
        key_rule: "Immer in RICHTUNG des Schmerzes arbeiten — nie quer!"
      },
      typical_locations: ["ITB (Tractus iliotibialis)", "Wadenmuskulatur", "Unterarm-Extensoren/-Flexoren", "Paraspinale Muskulatur", "Nacken-Trapezius-Linie"]
    },

    {
      id: "FDM-2",
      name: "Herniated Triggerpoint (HTP)",
      german: "Triggerpunkt / herniierter Faszientrigger",
      patient_gesture: "Patient drückt mit einem Finger PUNKTUELL — 'genau HIER tut es weh' — wie ein Stöpsel eindrücken",
      pathomechanism: "Kleiner Faszienabschnitt herniert durch Lücke in übergeordnete Faszienschicht → punktueller Vorsprung, Einklemmung",
      clinical_presentation: ["Punktuell — enger Bereich", "Wie 'etwas knöchelt heraus'", "Oft nach Trauma, Kompression", "Häufig interossär, am Periostsaum, am Muskelbauch"],
      treatment: {
        technique: "Daumen- oder Fingerdruck DIREKT auf den Punkt — senkrecht eindrücken und halten. Ziel: Hernie zurückdrängen durch defekte Faszienöffnung.",
        pressure: "Tief und fokussiert — bis Symptom nachlässt (oft sofort)",
        duration: "5-30 Sekunden konstanter Druck",
        key_rule: "Punktgenau — kein Gleiten. Patienten-Geste zeigt exakten Punkt."
      },
      typical_locations: ["Interossäre Muskeln (Hand/Fuß)", "Tibiale Vorderkante", "Schulterblatt-Ränder", "Periossale Faszien"]
    },

    {
      id: "FDM-3",
      name: "Continuum Distortion (CD)",
      german: "Kontinuum-Distorsion",
      patient_gesture: "Patient zeigt mit einem Finger auf den knöchernen-sehniösen ÜBERGANG (Enthese) — Ansatz- oder Ursprungspunkt",
      pathomechanism: "Übergangszone Knochen → Knorpel → Faszie → Sehne verliert ihre dreidimensionale Integrität. 'Kontinuum' = Gewebe-Kontinuum an der Enthese",
      clinical_presentation: ["Schmerz genau am Knochen-Sehnen-Übergang", "Typisch: Laterale Epikondyle, Fersensporn, Trochanter, Patellaspitze", "Morgensteifigkeit, Belastungsschmerz"],
      treatment: {
        technique: "Thumb-Rotation direkt auf die Enthese — kreisende Daumendruckbewegung auf den knöchernen Ansatz.",
        pressure: "Tief, zirkulär",
        duration: "30-90 Sekunden",
        key_rule: "Genau auf die Enthese — 1-2mm Breite. Kein Gleiten auf der Sehne."
      },
      typical_locations: ["Laterale Epikondyle (Tennisarm = CD!)", "Insertio Achillessehne", "Plantar-Faszie Kalkaneus (Fersensporn)", "Trochanter major (GTPS)", "Patella-Unterpol", "Supra-/Infraspinatus-Ansatz Humerus"]
    },

    {
      id: "FDM-4",
      name: "Folding Distortion (FoD)",
      german: "Faltungs-Distorsion",
      patient_gesture: "Patient umgreift ein Gelenk mit der ganzen Hand — 'das ganze Gelenk' — oder zeigt mit Hand auf tiefen Gelenkschmerz",
      pathomechanism: "3D-Faszienstruktur um ein Gelenk faltet sich falsch zusammen nach Trauma → Gelenk kann nicht korrekt geführt werden",
      clinical_presentation: ["Tiefer Gelenkschmerz", "Gefühl 'etwas sitzt falsch'", "Bewegungseinschränkung aus dem Gelenk heraus", "Patient umgreift das Gelenk"],
      treatment: {
        technique: "Drei-dimensionale Entfaltung des Gelenks — passive Bewegung + spezifischer manueller Druck, um Faszienfalte wieder aufzurichten. Gelenktraktionen + Rotationskomponenten.",
        variants: ["Anteriore Faltung", "Posteriore Faltung", "Mediale/Laterale Faltung"],
        key_rule: "Folge der Richtung, die das Gelenk vorgibt — kein Forcing"
      },
      typical_locations: ["OSG nach Supinationstrauma", "Handgelenk", "Ellenbogen", "LWS-Gelenke", "Schulter"]
    },

    {
      id: "FDM-5",
      name: "Cylinder Distortion (CyD)",
      german: "Zylinder-Distorsion",
      patient_gesture: "Patient reibt kreisend mit der flachen Hand über einen BEREICH — wie Scheuern über eine Fläche",
      pathomechanism: "Zylindrische Faszienlagen (konzentrisch um Extremitäten/Rumpf) verschieben sich gegeneinander → keine klare Linie, kein Punkt — flächige Symptomatik",
      clinical_presentation: ["Diffuser, flächiger Schmerz / Taubheit / Kribbeln", "Kein punktuelles Schmerzzentrum", "Patient reibt kreisend über großen Bereich", "Oft nach längerem Druckeinsatz (Schlafen auf Arm, Gipslagerung)"],
      treatment: {
        technique: "Kreisende Bewegungen mit flacher Hand / Faust über die betroffene Fläche — Cylinder Unwinding. Kein Gleiten auf der Haut — Haut mitbewegen.",
        key_rule: "Immer kreisend, nie linear. Patient zeigt Richtung durch Geste."
      },
      typical_locations: ["Oberschenkel-Außenseite", "Unterschenkel", "Unterarm", "Thoraxwand", "Glutealbereich"]
    },

    {
      id: "FDM-6",
      name: "Tectonic Fixation (TF)",
      german: "Tektonische Fixation",
      patient_gesture: "Patient beschreibt generellen Bewegungsverlust eines Gelenks oder Körperbereichs — 'alles ist steif' — kann keine spezifische Geste machen",
      pathomechanism: "Verlust der Gleitfähigkeit zwischen Faszienlagen (Hyaluronan-Verdickung, Adhäsionen, Entzündung). 'Tektonische Platten' — Schichten kleben aneinander.",
      clinical_presentation: ["Generelle Steifigkeit ohne spezifischen Punkt", "Bewegungsverlust in alle Richtungen", "Morgendliche Steifigkeit", "Oft ältere Patienten, nach Immobilisation, nach OP"],
      treatment: {
        technique: "Passive Mobilisation + aktive Bewegung unter leichtem Zug (Traktionsmobilisation). Ziel: Gleitfähigkeit zwischen Schichten wiederherstellen. Hyaluronan-Hydrierung durch Bewegung.",
        variants: ["Gelenktraktion + Bewegung (alle Richtungen)", "Passive Gelenkmobilisation zyklisch", "Kombination mit Hydrierung (Schleip: Fasziale Hydrierung durch oszillierende Techniken)"],
        key_rule: "Kein starrer Hochgeschwindigkeits-Thrust — sanfte repetitive Mobilisation"
      },
      typical_locations: ["Frozen Shoulder", "Gonarthrose mit Kapselschrumpfung", "Coxarthrose", "LWS nach Langzeitimmobilisation"]
    }
  ],

  FDM_clinical_workflow: {
    steps: [
      "1. BEOBACHTEN: Wie zeigt der Patient seinen Schmerz? (Linie → TB, Punkt → HTP/CD, Umgreifen → FoD, Reiben → CyD, keine Geste → TF)",
      "2. BESTÄTIGEN: 'Zeigen Sie mir genau wo' — Patient exakt nachführen lassen",
      "3. ZUORDNEN: Geste → Distorsionstyp → Technik wählen",
      "4. BEHANDELN: Technik direkt und ohne Umwege. Patient gibt Feedback in Echtzeit.",
      "5. REASSESSMENT: Sofortiger Re-Test (Bewegung, Schmerz-VAS) nach Technik"
    ],
    typical_session_time: "5-20 Minuten — FDM ist schnell und direktiv",
    key_principle: "FDM ist KEINE Entspannungsmethode — der Druck ist oft stark. Kurzer, intensiver Schmerz der Behandlung → deutliche Sofortverbesserung"
  },

  FDM_vs_klassisch: {
    comparison: [
      { aspect: "Diagnostik", fdm: "Körpersprache (Geste) des Patienten", klassisch: "Orthopädische Tests, Palpation" },
      { aspect: "Wirkgeschwindigkeit", fdm: "Sofort (Sekunden bis Minuten)", klassisch: "Wochen bis Monate" },
      { aspect: "Schmerzhaftigkeit der Behandlung", fdm: "Stark (kurz)", klassisch: "Moderat" },
      { aspect: "Sitzungsdauer", fdm: "Sehr kurz (5-20 Min)", klassisch: "30-60 Min" },
      { aspect: "Indikation", fdm: "Akut + subakut optimal", klassisch: "Akut + chronisch" },
      { aspect: "Faszienpathologie", fdm: "Zentral (6 Distorsionen)", klassisch: "Teilweise (Triggerpunkte, MFR)" }
    ]
  }
};

// ════════════════════════════════════════════════════════════
// 9. ERWEITERTE FASZIENTHERAPIE (Schleip / Pischinger / Stecco)
// ════════════════════════════════════════════════════════════
const FASZIENTHERAPIE_ERWEITERT = {

  Schleip_Faszienwissenschaft: {
    author: "Robert Schleip PhD, Fascia Research Group, Universität Ulm",
    key_findings: [
      "Faszien sind innerviert (freie Nervenenden, Mechanorezeptoren: Ruffini, Pacini, Meissner, Golgi-ähnlich)",
      "Faszien sind kontraktil — Myofibroblasten können sich aktiv zusammenziehen (Tonus-Regulation ohne Muskelaktivität)",
      "Hyaluronan-Viskosität: zwischen Faszienlagen — wird durch Bewegung, Wärme, Massage dünnflüssiger (Thixotropie)",
      "Fasziales Propriozeptionssystem: Ruffini-Körperchen in tiefer Faszie → Bewusstsein für Körperhaltung",
      "Matrisom: Extrazelluläre Matrix-Proteine — Kollagen I/III, Elastin, Fibronektin, Hyaluronan"
    ],
    therapeutic_implications: [
      "Langsamer Druck (>90 Sek) aktiviert Ruffini-Körperchen → Sympathikusdämpfung → Gewebebreitfluß",
      "Schnelle Techniken: Pacini-Körperchen → Vibration, Erschütterung",
      "Hydrierung: oszillierende Techniken lösen Hyaluronan-Clusterbildung auf",
      "Wärme vor Behandlung: senkt Faszientonus (Kollagenplastizität steigt bei >39°C)"
    ],
    sources: ["Schleip R: Fascial Plasticity. J Bodywork Mov Ther 2003", "Schleip R et al.: Fascia. Elsevier 2012"]
  },

  Stecco_Faszienmanipulation: {
    author: "Luigi Stecco PT, Carla Stecco MD, Università di Padova",
    method: "Fascial Manipulation® (FM) — systematisch, anatomisch präzise",
    core_concept: "Myo-Fascial Units (MFU): Muskel + Faszie + Bewegungsrichtung als Einheit. Centres of Coordination (CC) — Punkte auf Faszie, die eine Bewegungsrichtung steuern. Centres of Fusion (CF) — Diagonale, spiralförmige Verbindungen.",
    sequences: [
      "Horizontale Sequenzen (anterior-posterior)",
      "Diagonale Sequenzen (anteflex-retroflex + laterolateral)",
      "Spirale Sequenzen"
    ],
    treatment: "Tiefer Knöcheldruck auf CC/CF-Punkte (tiefer als Triggerpunkt-Behandlung) — gezielte Punktbehandlung, keine Streichmassage",
    sources: ["Stecco L: Fascial Manipulation for Musculoskeletal Pain. Piccin 2004", "Stecco C: Functional Atlas of the Human Fascial System. Elsevier 2015"]
  },

  Pischinger_Grundregulation: {
    author: "Alfred Pischinger MD (1899-1983), Universität Graz — weiterentwickelt durch Heine H.",
    concept: "System der Grundregulation: Extrazelluläre Matrix (ECM/Grundsubstanz) als zentrales Regulationssystem. Alle Zellen kommunizieren über die ECM mit dem vegetativen Nervensystem, Blut, Lymphe, Immunsystem.",
    therapeutic_implications: [
      "Störfelder (z.B. Narben, Zahnherde) können ECM-Regulation fernwirksam stören",
      "Entsäuerung der ECM: basische Ernährung, Trinkmenge, Bewegung",
      "Neurale Therapie (Huneke): Procain setzt Störfeld zurück → ECM-Normalisierung",
      "Entstauungstherapie (Lymphdrainage) = ECM-Reinigung"
    ],
    sources: ["Pischinger A: Das System der Grundregulation. Haug 2009 (12. Aufl.)", "Heine H: Lehrbuch der biologischen Medizin. Hippokrates 2006"]
  },

  Rolfsches_Strukturelle_Integration: {
    author: "Ida P. Rolf PhD (1896-1979)",
    method: "Rolfing® Structural Integration — 10-Sitzungs-Serie",
    principle: "Körper im Schwerefeld optimal ausrichten durch Reorganisation der Faszienstruktur. Tiefe Faszienarbeit von außen nach innen über 10 Sessions.",
    sessions_overview: [
      "Session 1-3: Äußere Hülle (oberflächliche Faszien: Brustkorb, Rücken, Seitenlinien)",
      "Session 4-7: Kernbereich (Becken, Wirbelsäule, Hüften, Schultern)",
      "Session 8-10: Integration (Gesamtkörper)"
    ],
    evidence: "Evidenz B: Rolfing verbessert Körperhaltung, reduziert chronische LWS-Schmerzen (Cottingham 1988)"
  }
};

// ════════════════════════════════════════════════════════════
// MASTER EXPORT
// ════════════════════════════════════════════════════════════
export {
  STRUKTURELLE_OSTEOPATHIE,
  VISZERALE_OSTEOPATHIE,
  FASZIALE_OSTEOPATHIE,
  KRANIOSAKAL_OSTEOPATHIE,
  FOSSUM_MODELLE,
  TRAINING_THERAPIE,
  KOMPLEMENTAERE_VERFAHREN,
  FDM_MODELL,
  FASZIENTHERAPIE_ERWEITERT
};

// Helper: VSR-Lookup für ein Organ
export function getVisceroSomaticReflex(organ) {
  return VISZERALE_OSTEOPATHIE.viscerosomatic_chart.find(v => v.organ.toLowerCase().includes(organ.toLowerCase()));
}

// Helper: FDM-Distorsion anhand Patienten-Geste
export function getFDMByGesture(gesture_type) {
  const map = {
    linie: "FDM-1 Triggerband",
    punkt: "FDM-2 HTP oder FDM-3 CD (Enthese prüfen)",
    umgreifen: "FDM-4 Folding Distortion",
    reiben: "FDM-5 Cylinder Distortion",
    keine_geste: "FDM-6 Tectonic Fixation"
  };
  return map[gesture_type] || "Kombination möglich — alle 6 prüfen";
}
