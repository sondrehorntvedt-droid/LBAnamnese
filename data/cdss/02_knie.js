/**
 * LINDEBERGS OS — CDSS Regelkatalog
 * Modul 02: KNIE
 *
 * Abgedeckte Differentialdiagnosen (8):
 *  KNIE-001  Meniskus-Läsion (medial / lateral)
 *  KNIE-002  VKB-Ruptur (vorderes Kreuzband)
 *  KNIE-003  Gonarthrose (medial / lateral / bikompartimentell)
 *  KNIE-004  Patellofemorales Schmerzsyndrom (PFSS)
 *  KNIE-005  Patellasehnen-Tendinopathie (Jumper's Knee)
 *  KNIE-006  Tractus-Iliotibialis-Syndrom (ITB / Läuferknie)
 *  KNIE-007  Pes-anserinus-Bursitis
 *  KNIE-008  HKB-Läsion (hinteres Kreuzband)
 *
 * Quellen:
 *  - Hegedus EJ et al.: Physical examination tests of the knee.
 *    BJSM 2007.
 *  - Scholten RJ et al.: The accuracy of physical diagnostic tests for
 *    assessing meniscal lesions of the knee: a meta-analysis. Clin J Sport Med 2001.
 *  - Décary S et al.: Accuracy of combined orthopaedic tests for the diagnosis
 *    of knee disorders. JOSPT 2017.
 *  - Swain MS et al.: Accuracy of clinical tests in the diagnosis of anterior
 *    cruciate ligament injury. BJSM 2014.
 *  - Crossley KM et al.: 2016 Patellofemoral pain consensus statement.
 *    BJSM 2016.
 */

const KNIE_QUESTIONS = [

  // --- GRUPPE 1: BASIS (alle Varianten) ---

  {
    id: "KNI-Q01",
    text: "Welche Knieseite bzw. welcher Bereich schmerzt am stärksten?",
    type: "multiselect",
    options: [
      { value: "medial", label: "Innenseite des Knies" },
      { value: "lateral", label: "Außenseite des Knies" },
      { value: "anterior", label: "Vorderseite / Kniescheibe" },
      { value: "posterior", label: "Hinterseite (Kniekehle)" },
      { value: "diffuse", label: "Diffus / überall" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["location", "all_diagnoses"]
  },

  {
    id: "KNI-Q02",
    text: "Wie hat der Knieschmerz begonnen?",
    type: "select",
    options: [
      { value: "trauma_twist", label: "Nach Drehbewegung / Verdrehung (z.B. Ballsport, Skifahren)" },
      { value: "trauma_direct", label: "Nach direktem Aufprall auf das Knie" },
      { value: "trauma_hyperext", label: "Nach Überstreckung des Knies" },
      { value: "overuse", label: "Schleichend durch Sport / Belastungssteigerung" },
      { value: "insidious", label: "Ohne erkennbaren Auslöser — langsam begonnen" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["onset", "all_diagnoses"]
  },

  {
    id: "KNI-Q03",
    text: "Wie schnell hat sich das Knie nach der Verletzung angeschwollen?",
    type: "select",
    condition: { fact: "KNI-Q02", operator: "in", value: ["trauma_twist", "trauma_direct", "trauma_hyperext"] },
    options: [
      { value: "immediate_2h", label: "Sehr schnell — innerhalb von 2 Stunden (Bluterguß/Hämarthros)" },
      { value: "delayed_24h", label: "Erst nach 12–24 Stunden langsam geschwollen" },
      { value: "no_swelling", label: "Keine Schwellung" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["swelling_timing", "KNIE-001", "KNIE-002"],
    note: "Sofortige Schwellung = Hämarthros → VKB-Ruptur bis Beweis des Gegenteils"
  },

  {
    id: "KNI-Q04",
    text: "Wie stark sind Ihre Knieschmerzen im Alltag? (0 = kein Schmerz, 10 = maximaler Schmerz)",
    type: "nrs_0_10",
    variants: ["short", "standard", "deep"],
    tags: ["pain_intensity", "relief"]
  },

  {
    id: "KNI-Q05",
    text: "Seit wann haben Sie diese Kniebeschwerden?",
    type: "duration_select",
    options: [
      { value: "acute", label: "Weniger als 6 Wochen" },
      { value: "subacute", label: "6 Wochen bis 3 Monate" },
      { value: "chronic", label: "3 bis 12 Monate" },
      { value: "very_chronic", label: "Mehr als 1 Jahr" }
    ],
    variants: ["short", "standard", "deep"],
    tags: ["duration"]
  },

  // --- GRUPPE 2: FUNKTIONSFRAGEN (Standard + Deep) ---

  {
    id: "KNI-Q06",
    text: "Blockiert das Knie manchmal — können Sie es plötzlich nicht mehr strecken oder beugen?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["locking", "KNIE-001"],
    note: "Mechanisches Blockieren = Meniskusfragment oder freier Gelenkkörper"
  },

  {
    id: "KNI-Q07",
    text: "Gibt das Knie manchmal plötzlich nach, als ob es wegknickt?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["giving_way", "KNIE-001", "KNIE-002"],
    note: "Giving way = VKB-Insuffizienz oder Meniskusläsion"
  },

  {
    id: "KNI-Q08",
    text: "Haben Sie Druckschmerz an der Innen- oder Außenseite des Kniegelenkspalts (auf Höhe des Gelenks, nicht die Kniescheibe)?",
    type: "select",
    options: [
      { value: "medial", label: "Ja, an der Innenseite (medialer Gelenkspalt)" },
      { value: "lateral", label: "Ja, an der Außenseite (lateraler Gelenkspalt)" },
      { value: "both", label: "Beidseitig" },
      { value: "none", label: "Nein" }
    ],
    variants: ["standard", "deep"],
    tags: ["joint_line_tenderness", "KNIE-001"]
  },

  {
    id: "KNI-Q09",
    text: "Haben Sie ein Reiben oder Knirschen in oder unter der Kniescheibe gespürt oder gehört?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["crepitus_pf", "KNIE-003", "KNIE-004"]
  },

  {
    id: "KNI-Q10",
    text: "Wo verschlimmert sich der Schmerz typischerweise am meisten?",
    type: "multiselect",
    options: [
      { value: "stairs_down", label: "Treppenabgang (bergab geht's am schlechtesten)" },
      { value: "stairs_up", label: "Treppenaufgang" },
      { value: "squat", label: "Tief in die Hocke gehen / Kauern" },
      { value: "long_sitting", label: "Langes Sitzen (Kino-Zeichen, nach Aufstehen schlechter)" },
      { value: "running_lateral", label: "Laufen — besonders bergab oder auf hartem Untergrund" },
      { value: "jumping_landing", label: "Springen und Landen" },
      { value: "walking_flat", label: "Normales Gehen auf flachem Untergrund" }
    ],
    variants: ["standard", "deep"],
    tags: ["aggravating_activities", "KNIE-003", "KNIE-004", "KNIE-005", "KNIE-006"]
  },

  {
    id: "KNI-Q11",
    text: "Haben Sie morgens eine Steifigkeit im Knie? Wenn ja, wie lange dauert sie bis das Knie wieder locker ist?",
    type: "select",
    options: [
      { value: "no_stiffness", label: "Keine Morgensteifigkeit" },
      { value: "brief", label: "Kurze Steifigkeit — besser nach 5–15 Minuten" },
      { value: "moderate", label: "Steifigkeit 15–30 Minuten" },
      { value: "prolonged", label: "Länger als 30 Minuten steif" }
    ],
    variants: ["standard", "deep"],
    tags: ["morning_stiffness", "KNIE-003"],
    note: ">30 min Morgensteifigkeit → entzündliche Arthritis (RA, SpA) erwägen"
  },

  {
    id: "KNI-Q12",
    text: "Haben Sie Schmerzen oder Druckschmerz direkt an der Spitze der Kniescheibe (unterer Pol)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["patellar_tip", "KNIE-005"]
  },

  {
    id: "KNI-Q13",
    text: "Betreiben Sie Sprung- oder Laufsport (Volleyball, Basketball, Fußball, Laufen)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["jumping_sport", "KNIE-005", "KNIE-006"]
  },

  {
    id: "KNI-Q14",
    text: "Falls Sie laufen: Hat der Schmerz zugenommen nach Steigerung des Laufumfangs oder Gelächter/Untergrundwechsel?",
    type: "yes_no",
    condition: { fact: "KNI-Q13", operator: "equal", value: true },
    variants: ["standard", "deep"],
    tags: ["running_overuse", "KNIE-006"]
  },

  {
    id: "KNI-Q15",
    text: "Haben Sie Schmerzen an der Innenseite des Schienbeins (ca. 2–3 cm unterhalb des Kniegelenks)?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["pes_anserinus", "KNIE-007"]
  },

  {
    id: "KNI-Q16",
    text: "Haben Sie Übergewicht oder Diabetes?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["metabolic_risk", "KNIE-003", "KNIE-007"]
  },

  {
    id: "KNI-Q17",
    text: "Hatten Sie beim Knieschmerz-Beginn das Gefühl, etwas zu hören oder zu spüren (Knack, Riss, Knall)?",
    type: "yes_no",
    condition: { fact: "KNI-Q02", operator: "in", value: ["trauma_twist", "trauma_hyperext"] },
    variants: ["standard", "deep"],
    tags: ["pop_sound", "KNIE-002"],
    note: "Hörbares Knacken + Sofortschwellung = VKB-Ruptur bis zum Beweis des Gegenteils (LR+ 12.0)"
  },

  {
    id: "KNI-Q18",
    text: "Haben Sie eine Schwellung in der Kniekehle bemerkt?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["bakers_cyst", "KNIE-001", "KNIE-003"]
  },

  {
    id: "KNI-Q19",
    text: "Haben Sie eine O-Bein- oder X-Bein-Stellung oder wurde Ihnen das je gesagt?",
    type: "select",
    options: [
      { value: "none", label: "Nein / Nicht bekannt" },
      { value: "varus", label: "O-Beine (Varus)" },
      { value: "valgus", label: "X-Beine (Valgus)" }
    ],
    variants: ["deep"],
    tags: ["alignment", "KNIE-003"]
  },

  {
    id: "KNI-Q20",
    text: "Haben Sie Schmerzen, wenn Sie gegen eine Wand drücken und dann das Knie beugen und strecken (Wandtest / Squat)?",
    type: "yes_no",
    variants: ["deep"],
    tags: ["squat_pain", "KNIE-004"]
  },

  {
    id: "KNI-Q21",
    text: "Haben Sie ein Instabilitätsgefühl im Knie — als würde es nach hinten durchknicken?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["posterior_instability", "KNIE-008"]
  },

  {
    id: "KNI-Q22",
    text: "Hatten Sie einen Unfall, bei dem das Knie von vorne (Armaturenbrett, Sturz auf gebeugtes Knie) getroffen wurde?",
    type: "yes_no",
    variants: ["standard", "deep"],
    tags: ["dashboard_mechanism", "KNIE-008"]
  }
];

const KNIE_DIAGNOSES = {

  "KNIE-001": {
    id: "KNIE-001",
    name: "Meniskus-Läsion",
    name_en: "Meniscal Tear (medial / lateral)",
    icd10: "M23.2",
    category: "structural",
    prevalence_note: "Häufigste Kniebinnenverletzung; medial 5x häufiger als lateral; degenerativ ab 40, traumatisch bei Jüngeren",
    key_features: [
      "Gelenkspalttenderness (medial oder lateral)",
      "McMurray-Test positiv",
      "Mechanisches Blockieren oder Giving way",
      "Verzögerte Schwellung (6–24h) bei isolierter Meniskusläsion",
      "Kniebeuge-Schmerz bei hinterhörnigen Läsionen",
      "Baker-Zyste als Sekundärphänomen möglich"
    ],
    clinical_tests: [
      { test: "McMurray Test", sensitivity: 0.70, specificity: 0.71, lr_plus: 2.41, lr_minus: 0.42 },
      { test: "Thessaly Test (5° und 20°)", sensitivity: 0.89, specificity: 0.97, lr_plus: 29.7, lr_minus: 0.11, note: "In-vivo funktioneller Test — gute Evidenz" },
      { test: "Joint Line Tenderness medial", sensitivity: 0.63, specificity: 0.77, lr_plus: 2.74 },
      { test: "Apley Compression Test", sensitivity: 0.61, specificity: 0.70 }
    ],
    imaging_recommendation: {
      first_line: "MRT Knie (Goldstandard: 93% Sensitivität, 88% Spezifität für Meniskusriss)",
      xray: "Röntgen in 2 Ebenen (Arthrose ausschließen, knöcherne Avulsion)"
    },
    next_steps: [
      "Konservativ möglich bei degenerativen Meniskusläsionen >40J. (physiotherapeutisch gleichwertig zu Arthroskopie — METEOR-Studie, NEJM 2013)",
      "Arthroskopische Meniskusteilresektion bei traumatischer Läsion jüngerer Patienten",
      "Meniskusnaht anstreben bei Läsionen in der roten Zone (vaskularisiert)"
    ],
    factors: { relief: -2, range: -2 },
    references: ["Katz JN et al. NEJM 2013 (METEOR)", "Scholten RJ et al. Clin J Sport Med 2001"]
  },

  "KNIE-002": {
    id: "KNIE-002",
    name: "VKB-Ruptur (Vorderes Kreuzband)",
    name_en: "Anterior Cruciate Ligament Rupture",
    icd10: "M23.6",
    category: "structural",
    prevalence_note: "~200.000 VKB-Rupturen/Jahr in Deutschland; Frauen 2–8x höheres Risiko als Männer; Gipfel 15–25 Jahre",
    key_features: [
      "Pivot-/Drehtrauma + Dezeleration (typischer Mechanismus)",
      "Sofortige Schwellung innerhalb 2 Stunden (Hämarthros → VKB bis Beweis des Gegenteils)",
      "Hörbares / spürbares Knacken zum Unfallzeitpunkt",
      "Instabilitätsgefühl / Giving way",
      "Lachman-Test positiv (sensitiv: 85%)",
      "Pivot-Shift-Test positiv (hoch spezifisch: 98%)"
    ],
    clinical_tests: [
      { test: "Lachman Test", sensitivity: 0.85, specificity: 0.94, lr_plus: 14.2, lr_minus: 0.16, note: "Bestes klinisches Screening" },
      { test: "Anterior Drawer Test", sensitivity: 0.55, specificity: 0.92, lr_plus: 6.88 },
      { test: "Pivot Shift Test", sensitivity: 0.39, specificity: 0.98, lr_plus: 19.5, note: "Hoch spezifisch, aber schmerzbedingt oft negativ" },
      { test: "Pop + Immediate Swelling kombiniert", sensitivity: 0.91, specificity: 0.76, note: "Anamnestische Kombination sehr stark" }
    ],
    imaging_recommendation: {
      first_line: "MRT Knie (Goldstandard — VKB, Menisken, Knorpel, Knochenmarködem)",
      xray: "Röntgen (Segond-Fraktur laterale Tibia = pathognomonisch für VKB-Ruptur)"
    },
    next_steps: [
      "Orthopädisch-/sporttraumatologisches Konsil zeitnah",
      "Konservativ: Bei inaktiven Patienten ohne Instabilität möglich (Kräftigung, propriozeptiv)",
      "VKB-Rekonstruktion: Standard bei aktiven Patienten <50J., Sportler, Rotationsinstabilität",
      "Prä-OP: Entzündungsreduktion, Beweglichkeit wiederherstellen (kein 'gerades' Bein vor OP)"
    ],
    factors: { relief: -3, range: -3 },
    references: ["Swain MS et al. BJSM 2014", "Moksnes H et al. BJSM 2012"]
  },

  "KNIE-003": {
    id: "KNIE-003",
    name: "Gonarthrose",
    name_en: "Knee Osteoarthritis",
    icd10: "M17.1",
    category: "degenerative",
    prevalence_note: "Häufigste Gelenkerkrankung: ~30% der >60-Jährigen radiologisch, ~10% symptomatisch; mediale Kompartiment 75%",
    key_features: [
      "Alter >50, chronisch progredient",
      "Morgensteifigkeit <30 Minuten",
      "Krepitus / Reiben bei Bewegung",
      "Anlaufschmerz (schlimmer nach längerem Sitzen/Liegen, bessert sich nach wenigen Minuten Bewegung)",
      "Belastungsabhängiger Schmerz (Treppensteigen, Bergab)",
      "Schwellung möglich (aktivierte Arthrose)",
      "Häufig mit O-Bein-Fehlstellung (Varus) bei medialer Gonarthrose"
    ],
    clinical_tests: [
      { test: "Krepitus (palpatorisch/auskultatorisch)", sensitivity: 0.74, specificity: 0.77, lr_plus: 3.22 },
      { test: "Bony Enlargement", sensitivity: 0.70, specificity: 0.72 },
      { test: "ACR Clinical Criteria (Alter >50 + Krepitus + Morgensteifigkeit <30min)", sensitivity: 0.95, specificity: 0.69 }
    ],
    imaging_recommendation: {
      first_line: "Röntgen Knie in 2 Ebenen + Rosenberg-View (stehend, 45° Beugung — sensitiver für medialen Gelenkspaltverlust)",
      if_surgery_planned: "MRT nur bei geplanter Schlüssellochoperation (Knorpelstatus)"
    },
    next_steps: [
      "Gewichtsreduktion (stärkste konservative Intervention bei Übergewicht)",
      "Physiotherapie: Muskelkräftigung Quadrizeps + ischiokrurale Gruppe, propriozeptives Training",
      "Orthesen: Entlastungsorthese bei Varusarthrose (medialer Gelenkspaltverlust)",
      "Intraartikuläre Injektionen: Kortison (kurzfristig), Hyaluron (mittelfristig)",
      "Eskalation: PRP (Evidence: moderat), ACP, Stammzelltherapie (experimentell)",
      "Endoprothetik bei Versagen konservativer Maßnahmen + Leidensdruck"
    ],
    factors: { relief: -2, range: -2 },
    references: ["NICE Guidelines NG226 (2022)", "ACR/AAHKS 2021 Clinical Practice Guideline"]
  },

  "KNIE-004": {
    id: "KNIE-004",
    name: "Patellofemorales Schmerzsyndrom (PFSS)",
    name_en: "Patellofemoral Pain Syndrome",
    icd10: "M22.2",
    category: "functional",
    prevalence_note: "Häufigste Kniediagnose bei jungen Aktiven (16–25J.); Frauen 2x häufiger; 'Anterior knee pain'",
    key_features: [
      "Anteriorer Knieschmerz — diffus, schwer zu lokalisieren",
      "Schmerz beim Treppenabgang (Charakteristisch!)",
      "Theater-Zeichen / Kino-Zeichen (nach langem Sitzen schlechter)",
      "Schmerz beim tiefen Hocken / Kauern",
      "Keine Gelenklinie-Druckschmerz",
      "Keine Instabilität",
      "Junges weibliches Geschlecht als Risikofaktor",
      "Schwäche M. vastus medialis obliquus (VMO)"
    ],
    clinical_tests: [
      { test: "Patellar Grind Test (Clarke)", sensitivity: 0.39, specificity: 0.67, note: "Geringe Aussagekraft als Einzeltest" },
      { test: "Step-Down Test (funktionell)", note: "Schmerz + Valguseinbruch = sensitiv und praxisnah" },
      { test: "J-Sign (patelläres Tracking)", note: "Beobachtung bei Kniestreckung — laterale Patelladeviation" },
      { test: "Patellar Apprehension", sensitivity: 0.39, specificity: 0.93, note: "Eher für Patellainstabilität" }
    ],
    imaging_recommendation: {
      first_line: "Klinische Diagnose in typischen Fällen — keine sofortige Bildgebung nötig",
      if_atypical: "Röntgen (Merchant-View, axiale Patellaaufnahme), MRT bei Therapieversagen"
    },
    next_steps: [
      "Physiotherapie: VMO-Kräftigung, Hüftabduktoren-Training (stärkste Evidenz!)",
      "Kinesio-Taping (Patella-Taping nach McConnell) — kurzfristige Schmerzreduktion",
      "Einlagenversorgung bei Pes planus / Hyperpronation",
      "Quadrizepsdehnuing, Hüftflexoren-Dehnung",
      "Load-Management: Lauf- und Sprungvolumen anpassen"
    ],
    factors: { relief: -2, range: -1 },
    references: ["Crossley KM et al. BJSM 2016", "Rathleff MS et al. BJSM 2015"]
  },

  "KNIE-005": {
    id: "KNIE-005",
    name: "Patellasehnen-Tendinopathie (Jumper's Knee)",
    name_en: "Patellar Tendinopathy",
    icd10: "M76.5",
    category: "overuse",
    key_features: [
      "Druckschmerz direkt am unteren Patellapol (oder proximales Tibiaansatz)",
      "Schmerz bei Sprung- und Landebelastung",
      "Volleyball, Basketball, Fußball, Leichtathletik",
      "Reaktion auf Trainingsvolumen-Steigerung",
      "Typisches VISA-P Scoring-Muster",
      "Kein Wärme/Rötungszeichen (keine Entzündung im klassischen Sinn)"
    ],
    clinical_tests: [
      { test: "Single-leg Decline Squat", sensitivity: 0.97, specificity: 0.93, lr_plus: 13.9, note: "Goldstandard klinischer Test — 25° Decline Board" },
      { test: "Patellar Tip Palpation", sensitivity: 0.89, specificity: 0.67 }
    ],
    imaging_recommendation: {
      first_line: "Ultraschall (Sehnenstruktur, Hypervaskularität, Verkalkungen)",
      second_line: "MRT bei atypischem Verlauf oder prä-OP"
    },
    next_steps: [
      "Exzentrisches Training (Decline Squat Protokoll — Alfredson / Kongsgaard)",
      "Isometrisches Training zur initialen Schmerzreduktion",
      "Stoßwellentherapie (fokussiert): Evidenz Level B (Cochrane 2022)",
      "Load-Management: Reduktion reaktiver Belastungen (Sprünge) temporär",
      "PRP-Injektion bei Therapieresistenz >6 Monate (kontroverse Evidenz)"
    ],
    factors: { relief: -1, range: -1 },
    references: ["Cook JL, Purdam C. BJSM 2009 (Continuum model)", "Kongsgaard M et al. Am J Sports Med 2009"]
  },

  "KNIE-006": {
    id: "KNIE-006",
    name: "Tractus-Iliotibialis-Syndrom (ITB / Läuferknie)",
    name_en: "Iliotibial Band Syndrome",
    icd10: "M76.3",
    category: "overuse",
    key_features: [
      "Lateraler Knieschmerz bei Läufern (typischerweise 20–30 Minuten in die Laufeinheit)",
      "Druckschmerz ca. 2 cm proximal des lateralen Femurkondylus",
      "Schmerz bergab am stärksten (Knie-Flexion bei Landephase ~30°)",
      "Noble-Kompressionstest positiv",
      "Ober-Test meist positiv (verkürzter TFL / ITB)",
      "Wochenlang steigende Laufumfänge als Auslöser"
    ],
    clinical_tests: [
      { test: "Noble Compression Test", sensitivity: 0.79, specificity: 0.75 },
      { test: "Ober Test", note: "ITB-Enge / TFL-Verkürzung — Screening für Tightness" },
      { test: "Renne Test (Laufen mit Schmerz bei 30°)", note: "Funktioneller Test" }
    ],
    imaging_recommendation: {
      first_line: "Klinische Diagnose ausreichend",
      if_atypical: "MRT (laterales Kompartiment-Pathologien ausschließen)"
    },
    next_steps: [
      "Laufvolumen-Reduktion temporär (häufigster Fehler: gar kein Laufen → verlängert Genesungszeit)",
      "Hüftabduktoren-Kräftigung (M. gluteus medius) — stärkste Evidenz",
      "TFL-Dehnung, Schaumstoffrolle (Foam Rolling — symptomatisch wirksam)",
      "Lauftechnikanalyse: erhöhte Schrittfrequenz, reduzierte Schrittlänge",
      "Schuhanalyse / Einlagenversorgung bei Überpronation",
      "Kortison lokal nur als letzte konservative Maßnahme"
    ],
    factors: { relief: -1, range: -1 },
    references: ["Ferber R et al. J Orthop Sports Phys Ther 2010"]
  },

  "KNIE-007": {
    id: "KNIE-007",
    name: "Pes-anserinus-Bursitis",
    name_en: "Pes Anserinus Bursitis",
    icd10: "M70.5",
    category: "inflammatory",
    key_features: [
      "Medialer Knieschmerz — UNTERHALB des Gelenkspalts (Tibia, nicht Gelenk!)",
      "Druckschmerz ca. 3–5 cm distal des medialen Gelenkspalts",
      "Häufig übergewichtige Frauen >50 mit Gonarthrose",
      "Diabetes als Risikofaktor",
      "Schmerz beim Treppensteigen",
      "Häufig falsch als mediale Gonarthrose diagnostiziert!"
    ],
    clinical_tests: [
      { test: "Palpation Pes anserinus (distal medialer Gelenkspalt)", sensitivity: 0.77, specificity: 0.62 }
    ],
    imaging_recommendation: {
      first_line: "Ultraschall (Bursaerguss, Ausdehnung) — schnell und kostengünstig",
      second_line: "MRT bei Unklarheit"
    },
    next_steps: [
      "Ultraschallgesteuerte Kortisoninjektion (sehr wirksam)",
      "Physiotherapie: Kräftigung, Gewichtsreduktion",
      "Kälteanwendung lokal"
    ],
    factors: { relief: -2 }
  },

  "KNIE-008": {
    id: "KNIE-008",
    name: "HKB-Läsion (Hinteres Kreuzband)",
    name_en: "Posterior Cruciate Ligament Injury",
    icd10: "M23.6",
    category: "structural",
    prevalence_note: "Seltener als VKB-Ruptur (~10% aller Kniebandverletzungen); oft übersehen",
    key_features: [
      "Hyperextensionstrauma oder Dashboard-Mechanismus (direkter Aufprall auf vorderen Tibia bei gebeugtem Knie)",
      "Posterior Sag Sign (Tibia fällt nach hinten in Rückenlage)",
      "Posterior Drawer Test positiv",
      "Oft weniger dramatische Akutpräsentation als VKB (wird unterschätzt)",
      "Instabilitätsgefühl hinten"
    ],
    clinical_tests: [
      { test: "Posterior Sag Sign", sensitivity: 0.79, specificity: 0.99, lr_plus: 79.0, note: "Pathognomonisch" },
      { test: "Posterior Drawer Test", sensitivity: 0.90, specificity: 0.99 },
      { test: "Quadriceps Active Test", sensitivity: 0.54, specificity: 0.97 }
    ],
    imaging_recommendation: {
      first_line: "MRT Knie (HKB komplett, posterolaterale Ecke, Menisken)"
    },
    next_steps: [
      "Orthopädisch-traumatologisches Konsil",
      "Konservativ bei Grad I-II (Physiotherapie, Quadrizepskräftigung)",
      "Operativ bei Grad III oder posterolateraler Eckenbeteiligung"
    ],
    factors: { relief: -2, range: -2 }
  }
};

const KNIE_RULES = [

  // ─── KNIE-001: Meniskus ──────────────────────────────────

  {
    name: "KNIE-001-HOCH: Meniskus — mechanische Zeichen + Gelenkspalt",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "KNI-Q08", operator: "in", value: ["medial", "lateral"] }
      ],
      any: [
        { fact: "KNI-Q06", operator: "equal", value: true },
        { fact: "KNI-Q07", operator: "equal", value: true },
        { fact: "KNI-Q03", operator: "equal", value: "delayed_24h" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-001", probability_score: 78, label: "Wahrscheinlich" }
    }
  },

  {
    name: "KNIE-001-MITTEL: Meniskus — Torsionstrauma + Gelenkspalt",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "KNI-Q02", operator: "equal", value: "trauma_twist" },
        { fact: "KNI-Q08", operator: "in", value: ["medial", "lateral"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-001", probability_score: 60, label: "Möglich" }
    }
  },

  // ─── KNIE-002: VKB ───────────────────────────────────────

  {
    name: "KNIE-002-SEHR-HOCH: VKB — Sofortschwellung + Pop + Torsionstrauma",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "KNI-Q02", operator: "in", value: ["trauma_twist", "trauma_hyperext"] },
        { fact: "KNI-Q03", operator: "equal", value: "immediate_2h" },
        { fact: "KNI-Q17", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-002", probability_score: 92, label: "Sehr wahrscheinlich — MRT dringend" }
    }
  },

  {
    name: "KNIE-002-HOCH: VKB — Hämarthros + Instabilität",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "KNI-Q03", operator: "equal", value: "immediate_2h" },
        { fact: "KNI-Q07", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-002", probability_score: 80, label: "Wahrscheinlich" }
    }
  },

  // ─── KNIE-003: Gonarthrose ────────────────────────────────

  {
    name: "KNIE-003-HOCH: Gonarthrose — Alter + Krepitus + Anlaufschmerz",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "patient_age", operator: "greaterThanInclusive", value: 50 },
        { fact: "KNI-Q09", operator: "equal", value: true },
        { fact: "KNI-Q11", operator: "in", value: ["brief", "moderate"] },
        { fact: "KNI-Q05", operator: "in", value: ["chronic", "very_chronic"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-003", probability_score: 84, label: "Sehr wahrscheinlich" }
    }
  },

  {
    name: "KNIE-003-MITTEL: Gonarthrose — Übergewicht + chronisch + Krepitus",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "KNI-Q16", operator: "equal", value: true },
        { fact: "KNI-Q09", operator: "equal", value: true },
        { fact: "KNI-Q05", operator: "in", value: ["chronic", "very_chronic"] }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-003", probability_score: 62, label: "Wahrscheinlich" }
    }
  },

  // ─── KNIE-004: PFSS ──────────────────────────────────────

  {
    name: "KNIE-004-HOCH: PFSS — Anterior + Kino-Zeichen + Treppe bergab",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "KNI-Q01", operator: "contains", value: "anterior" },
        { fact: "KNI-Q10", operator: "contains", value: "stairs_down" },
        { fact: "KNI-Q08", operator: "equal", value: "none" }
      ],
      any: [
        { fact: "KNI-Q10", operator: "contains", value: "long_sitting" },
        { fact: "KNI-Q10", operator: "contains", value: "squat" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-004", probability_score: 79, label: "Wahrscheinlich" }
    }
  },

  // ─── KNIE-005: Patellasehne ───────────────────────────────

  {
    name: "KNIE-005-HOCH: Jumper's Knee — Druckschmerz Patellapol + Sprungsport",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "KNI-Q12", operator: "equal", value: true },
        { fact: "KNI-Q13", operator: "equal", value: true },
        { fact: "KNI-Q10", operator: "contains", value: "jumping_landing" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-005", probability_score: 83, label: "Sehr wahrscheinlich" }
    }
  },

  // ─── KNIE-006: ITB ────────────────────────────────────────

  {
    name: "KNIE-006-HOCH: ITB-Syndrom — Läufer + lateral + bergab",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "KNI-Q01", operator: "contains", value: "lateral" },
        { fact: "KNI-Q13", operator: "equal", value: true },
        { fact: "KNI-Q14", operator: "equal", value: true }
      ],
      any: [
        { fact: "KNI-Q10", operator: "contains", value: "running_lateral" }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-006", probability_score: 82, label: "Sehr wahrscheinlich" }
    }
  },

  // ─── KNIE-007: Pes anserinus ─────────────────────────────

  {
    name: "KNIE-007-HOCH: Pes anserinus — medial distal + Risikoprofil",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "KNI-Q15", operator: "equal", value: true },
        { fact: "KNI-Q16", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-007", probability_score: 75, label: "Wahrscheinlich" }
    }
  },

  // ─── KNIE-008: HKB ────────────────────────────────────────

  {
    name: "KNIE-008-HOCH: HKB — Dashboard-Mechanismus + posteriore Instabilität",
    conditions: {
      all: [
        { fact: "region_primary", operator: "equal", value: "knie" },
        { fact: "KNI-Q22", operator: "equal", value: true },
        { fact: "KNI-Q21", operator: "equal", value: true }
      ]
    },
    event: {
      type: "differential_diagnosis",
      params: { diagnosis_id: "KNIE-008", probability_score: 78, label: "Wahrscheinlich" }
    }
  }
];

export { KNIE_QUESTIONS, KNIE_DIAGNOSES, KNIE_RULES };
