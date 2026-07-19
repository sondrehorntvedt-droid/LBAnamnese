/**
 * LINDEBERGS OS — Klinische Testbatterie (Therapeuten-Grundlage)
 *
 * ⚠️ NUR THERAPEUTEN-SICHT. Nicht patientenzugänglich.
 *
 * Verbatim-nah aus den Lindebergs-Untersuchungsdokumenten:
 *   1) „Safety First – detailliert"        → SAFETY_TESTS (symptomgeleitet)
 *   2) „Klinische Basistests – detailliert" → BASISTESTS (gelenkspezifisch)
 *   3) „Osteopathische Short-Routine"        → OSTEO_ROUTINE (immer vollständig)
 *
 * Diese Batterie ist bewusst NICHT vollständig — sie ist die sichere Grundlage
 * für die erste Untersuchung. Safety-Tests (inkl. der 12 Hirnnerven) werden nur
 * bei Indikation eingesetzt; die Basistests gelenkspezifisch; die osteopathische
 * Routine wird ohnehin vollständig durchgeführt.
 */

// ── 1) SAFETY FIRST (symptomgeleitet) ───────────────────────
// Jede Gruppe hat einen indikationKey → im Klinik-Reiter wird sie nur als
// „indiziert" hervorgehoben, wenn die Anamnese das nahelegt.
export const SAFETY_TESTS = [
  {
    id: "SAF-FX",
    gruppe: "Fraktur-Schnellscreen",
    indikationKey: "fraktur",
    indikation: "Nach Sturz/Trauma (auch Bagatelltrauma bei Osteoporose), lokaler stechender Knochenschmerz, Deformität/Schwellung/Hämatom, Belastungsunfähigkeit, punktförmige Klopfempfindlichkeit.",
    tests: [
      { name: "Klopf-/Perkussionstest", durchfuehrung: "Schmerzmaximum lokalisieren; senkrecht über dem Punkt perkutieren, an Röhrenknochen längs der Achse; WS: über Dornfortsatz.", positiv: "Reproduzierbarer, exakt lokaler stechender Knochenschmerz → Frakturverdacht.", konsequenz: "Bildgebung vor Manipulation.", icd10: "T14.2" },
      { name: "Stimmgabel 128 Hz (nur wenn Klopftest positiv/unsicher)", durchfuehrung: "Stimmgabel auf prominenten Knochenpunkt nahe der Schmerzstelle aufsetzen; Reproduzierbarkeit prüfen.", positiv: "Vibrations-verstärkter lokaler Knochenschmerz → Frakturverdacht.", konsequenz: "Bildgebung.", icd10: "T14.2" },
    ],
  },
  {
    id: "SAF-HWS",
    gruppe: "Obere HWS — Manipulations-Sicherheit",
    indikationKey: "obere_hws",
    indikation: "Immer vor geplanter HWS-HVLA; nach HWS-Trauma; bei Kopfschmerz/Schwindel/Seh-, Sprach-, Schluckstörung; sensomotorischen Ausfällen; anamnestischem Band-/Knochen-Risiko. Keine provokativen Endrange-Vertebralarterien-Tests.",
    tests: [
      { name: "Sharp-Purser", durchfuehrung: "C2 mit Pinzettengriff fixieren; Kopf leicht flektiert; Atlas sanft posterior gegen C2 translatieren (kontrolliert).", positiv: "Deutliche Translation/'Klick' oder sofortige Symptombesserung → atlantoaxiale Instabilität (Lig. transversum).", konsequenz: "Keine HWS-HVLA; ärztliche Abklärung.", icd10: "M53.21" },
      { name: "Alar-Ligament-Stresstest", durchfuehrung: "C2 palpatorisch fixieren; Kopf minimal rotieren/seitneigen → sofortige Mitbewegung von C2 erwartet.", positiv: "Verzögerte/fehlende Mitbewegung von C2 → Alarband-Insuffizienz.", konsequenz: "Keine HWS-HVLA; ärztliche Abklärung.", icd10: "M53.21" },
      { name: "Prä-Manipulations-Hold (ohne Endrange)", durchfuehrung: "Behandlungsrichtung subendständig einstellen, 10–15 s halten; Patient auf Schwindel/Parästhesien/Sehstörung/Übelkeit/Dysarthrie achten lassen.", positiv: "Auftreten solcher Symptome → neurovaskuläre Irritation.", konsequenz: "Keine HVLA; alternative Technik/Abklärung.", icd10: "R42" },
    ],
  },
  {
    id: "SAF-UMN",
    gruppe: "Neuro-Red-Flag: UMN-Kurzcheck",
    indikationKey: "umn",
    indikation: "Akut/progredient: Gang-/Standstörung, Feinmotorikverlust, Hinweise auf Myelopathie/ZNS-Beteiligung.",
    tests: [
      { name: "Babinski (Plantarreflex)", durchfuehrung: "Stumpf lateral an der Fußsohle von der Ferse nach vorn, bogenförmig zum Großzehenballen streichen.", positiv: "Pathologische Dorsalextension der Großzehe ± Spreizen → UMN-Zeichen.", konsequenz: "Neurologische Abklärung.", icd10: "G95.9" },
      { name: "Knöchel-Clonus", durchfuehrung: "Fuß rasch in Dorsalflexion bringen und halten; rhythmische Schläge zählen.", positiv: "> 3–4 rhythmische Schläge → UMN-Zeichen.", konsequenz: "Neurologische Abklärung.", icd10: "G95.9" },
    ],
  },
  {
    id: "SAF-OKUL",
    gruppe: "Pupillen & Okulomotorik (Hirnnerven II, III, IV, VI)",
    indikationKey: "kranial",
    indikation: "Sehstörung/Doppelbilder, Kopfschmerz, Schwindel, V.a. zentrale Beteiligung.",
    tests: [
      { name: "Pupillen-Lichtreaktion + Swinging-Flashlight (RAPD)", durchfuehrung: "Direkt-/Indirektreaktion prüfen; Licht im Sekundentakt zwischen den Augen wechseln.", positiv: "Träge/fehlende Miosis oder paradoxe Dilatation → RAPD (afferente Optikus-Störung).", konsequenz: "Augen-/neurologische Abklärung.", icd10: "H46" },
      { name: "Okulomotorik-Screen (Smooth Pursuit, Sakkaden, H-Test)", durchfuehrung: "Blickfolge horizontal/vertikal; schnelle Blicksprünge; Stift in 6 Kardinalrichtungen.", positiv: "Ruckige Folge/Dysmetrie oder Blickparese/Diplopie (III/IV/VI).", konsequenz: "Neurologische Abklärung.", icd10: "H49.9" },
    ],
  },
  {
    id: "SAF-ROMBERG",
    gruppe: "Romberg (Stand/Gleichgewicht)",
    indikationKey: "kranial",
    indikation: "Schwindel, Gleichgewichts-/Gangstörung.",
    tests: [
      { name: "Romberg (± Tandem)", durchfuehrung: "Füße geschlossen; 10 s Augen offen, dann 10–20 s Augen geschlossen; ggf. Tandemstand.", positiv: "Stabil offen, instabil geschlossen → sensorische Ataxie; instabil auch offen → eher zerebellär.", konsequenz: "Neurologische Abklärung.", icd10: "R27.0" },
    ],
  },
  {
    id: "SAF-HN",
    gruppe: "Hirnnerven-Kurzscreen (V, VII, VIII, IX, X, XI, XII)",
    indikationKey: "kranial",
    indikation: "Gesichts-Hypästhesie/-schmerz, Mimik-Asymmetrie, Hörminderung/Tinnitus, Dysphagie/Dysarthrie/Heiserkeit, Schulterkraftverlust, Zungenabweichung. (II/III/IV/VI bereits über Pupillen & Okulomotorik.)",
    tests: [
      { name: "V — N. trigeminus", durchfuehrung: "Berührung V1/V2/V3 beidseits; Masseter/Temporalis beim Zubeißen palpieren.", positiv: "Dermatom-Hypästhesie, Kauschwäche/Asymmetrie.", konsequenz: "Neurologische Abklärung.", icd10: "G50.9" },
      { name: "VII — N. facialis", durchfuehrung: "Stirn runzeln, Augen schließen, Backen aufblasen, Zähne zeigen.", positiv: "Asymmetrie/Schwäche (Stirn mitbetroffen = peripher).", konsequenz: "Abklärung.", icd10: "G51.9" },
      { name: "VIII — N. vestibulocochlearis", durchfuehrung: "Flüstertest/Fingerreiben je Ohr, Gegenohr abdecken.", positiv: "Einseitige Hypakusis.", konsequenz: "HNO-Abklärung.", icd10: "H93.3" },
      { name: "IX/X — Glossopharyngeus/Vagus", durchfuehrung: "Phonation 'Aaaa' → Segelhebung mittig? Stimmklang?", positiv: "Uvula-Abweichung, Dysphonie/Dysphagie.", konsequenz: "Abklärung.", icd10: "G52.1" },
      { name: "XI — N. accessorius", durchfuehrung: "Schulterheben (Trapezius) und Kopfrotation (SCM) gegen Widerstand.", positiv: "Kraftminderung/Atrophie einseitig.", konsequenz: "Abklärung.", icd10: "G52.8" },
      { name: "XII — N. hypoglossus", durchfuehrung: "Zunge herausstrecken; Abweichung, Atrophie, Kraft gegen Wangenwiderstand.", positiv: "Abweichung zur betroffenen Seite, Atrophie/Faszikulationen.", konsequenz: "Abklärung.", icd10: "G52.3" },
    ],
  },
  {
    id: "SAF-VISZ",
    gruppe: "Viszerale Sicherheitstests",
    indikationKey: "viszeral",
    indikation: "Akuter Bauch-/Flankenschmerz, Fieber/Übelkeit/Erbrechen, kolikartige Schmerzen, AAA-Risikoprofil (Alter, Rauchen, Hypertonie, männlich), Harnwegszeichen.",
    tests: [
      { name: "AAA-Palpation", durchfuehrung: "Rückenlage, Knie flektiert; paramedian oberhalb des Nabels palpieren.", positiv: "Expansive, verbreiterte Pulsation → AAA-Verdacht.", konsequenz: "Keine tiefen Viszeraltechniken; Sonografie.", icd10: "I71.4" },
      { name: "Murphy-Zeichen", durchfuehrung: "Finger unter rechten Rippenbogen einhaken; Patient tief einatmen.", positiv: "Schmerz + Inspirationsstopp → Cholezystitis-Verdacht.", konsequenz: "Ärztliche Abklärung.", icd10: "K81.0" },
      { name: "Nierenklopfschmerz (CVA-Tenderness)", durchfuehrung: "Über costovertebralem Winkel sanft perkutieren.", positiv: "Dumpfer, lokalisierter Flankenschmerz → Nierenbeteiligung.", konsequenz: "Ärztliche Abklärung.", icd10: "N10" },
    ],
  },
];

// ── 2) KLINISCHE BASISTESTS (gelenkspezifisch) ──────────────
export const BASISTESTS = {
  hand: {
    region: "Hand & Handgelenk",
    tests: [
      { name: "Watson (Scaphoid-Shift)", positiv: "Schmerz/Klick/Sprung des Skaphoids → skapholunäre Instabilität.", icd10: "S63.5" },
      { name: "CMC-1 Grind", positiv: "Schmerz/Crepitus am Sattelgelenk → Rhizarthrose.", icd10: "M18.0" },
      { name: "TFCC-Load / Fovea-Sign", positiv: "Ulnarseitiger Handgelenksschmerz → TFCC-Läsion.", icd10: "S63.5" },
      { name: "Phalen / Tinel (Karpaltunnel)", positiv: "Parästhesien Daumen–radialer Ringfinger → N. medianus.", icd10: "G56.0" },
      { name: "Tinel Guyon-Loge", positiv: "Parästhesien ulnare 1½ Finger → N. ulnaris.", icd10: "G56.2" },
    ],
  },
  ellenbogen: {
    region: "Ellenbogen",
    tests: [
      { name: "Cozen / Mill's / Maudsley", positiv: "Lateraler Ellenbogenschmerz → Epicondylitis lateralis (ECRB).", icd10: "M77.1" },
      { name: "Moving-Valgus-Stress", positiv: "Laxität/Schmerzfenster 70–120° → UCL-Insuffizienz.", icd10: "S53.4" },
    ],
  },
  schulter: {
    region: "Schulter",
    tests: [
      { name: "Apley-Scratch (Screen)", positiv: "Asymmetrie/Schmerz/Bewegungsstopp (globaler ROM).", icd10: "M75.1" },
      { name: "Jobe / Empty-Can", positiv: "Schmerz/Schwäche → Supraspinatus.", icd10: "M75.1" },
      { name: "ER-Lag (Außenrotatoren)", positiv: "Lag-Zeichen (Abfallen in IR) → Infraspinatus/Teres minor.", icd10: "M75.1" },
      { name: "Lift-off / Belly-Press", positiv: "Schwäche/Schmerz → Subscapularis.", icd10: "M75.1" },
      { name: "Speed / Yergason", positiv: "Vorderer Sulcus-Schmerz → lange Bizepssehne/SLAP.", icd10: "M75.2" },
      { name: "Apprehension / Relocation", positiv: "Apprehension, Erleichterung bei Relocation → Instabilität.", icd10: "M25.31" },
      { name: "O'Brien / Crank", positiv: "Schmerz/Klick (stärker in IR) → Labrum/SLAP.", icd10: "M75.8" },
      { name: "Hawkins-Kennedy / Neer / Painful Arc", positiv: "Schmerz → subakromiales Impingement.", icd10: "M75.4" },
      { name: "ULNT Medianus / Spurling (bei Armsymptomen)", positiv: "Reproduzierbare radikuläre Symptome → zervikale Mitbeteiligung.", icd10: "M54.12" },
    ],
  },
  hws: {
    region: "HWS",
    tests: [
      { name: "Spurling", positiv: "Arm-radikulärer Schmerz → zervikale Radikulopathie. (Nur bei unauffälliger Safety!)", icd10: "M54.12" },
      { name: "Distraktion / ULNT (Entlastung)", positiv: "Symptomlinderung bei Traktion → radikulär.", icd10: "M54.12" },
      { name: "PA-Gleiten (cPA/uPA)", positiv: "Lokaler Segment-Schmerz/hartes Endgefühl → Facettensyndrom.", icd10: "M47.8" },
      { name: "CFRT (C1/C2 Flexion-Rotation)", positiv: "ROM < ~32–34° zur Seite → zervikogener Kopfschmerz.", icd10: "G44.86" },
    ],
  },
  bws_rippen: {
    region: "BWS & Rippen",
    tests: [
      { name: "PA-Springings", positiv: "Hartes Endgefühl/lokaler Schmerz → Facettensyndrom BWS.", icd10: "M47.8" },
      { name: "Rib-Spring / Costovertebral-Test", positiv: "Schmerz/verminderter Spring → Rippengelenks-Dysfunktion.", icd10: "M25.88" },
      { name: "AP-Rippenkompression", positiv: "Schmerz in betroffener Rippe/Seite. (Bei Trauma: Fraktur-Screen!)", icd10: "M25.88" },
    ],
  },
  lws: {
    region: "LWS",
    tests: [
      { name: "SLR ± Bragard", positiv: "Beinsymptome 30–70°, verstärkt durch Dorsalflexion → radikulär.", icd10: "M54.16" },
      { name: "Slump", positiv: "Symptomreproduktion, Besserung bei Kopf-Extension → neurodynamisch.", icd10: "M54.16" },
      { name: "PA-Gleiten (cPA/uPA)", positiv: "Lokaler Schmerz/hartes Endgefühl → Facettenreiz.", icd10: "M47.8" },
      { name: "Extension-Rotation (Kemp)", positiv: "Ipsilateraler Facettenschmerz.", icd10: "M47.8" },
      { name: "Prone Instability Test", positiv: "Schmerz in Ruhe, weniger bei Muskelaktivierung → segmentale Instabilität.", icd10: "M53.2" },
    ],
  },
  becken_isg: {
    region: "Becken / ISG",
    tests: [
      { name: "Thigh-Thrust", positiv: "Tiefer reproduzierbarer ISG-Schmerz.", icd10: "M53.3" },
      { name: "Sacral-Thrust", positiv: "Tiefer ISG-Schmerz.", icd10: "M53.3" },
      { name: "Laslett-Cluster (2–3 Tests: Distraction, Compression, FABER, Gaenslen)", positiv: "≥3 positiv → ISG als Schmerzquelle wahrscheinlich.", icd10: "M53.3" },
    ],
  },
  huefte: {
    region: "Hüfte",
    tests: [
      { name: "Trendelenburg", positiv: "Beckenabkippen kontralateral → Abduktorenschwäche.", icd10: "M25.85" },
      { name: "FADIR / FABER", positiv: "Leistenschmerz (FADIR: FAI/Labrum; FABER: ggf. SI).", icd10: "M25.85" },
      { name: "Scour", positiv: "Schmerz/Krepitus/Catch in der Leiste → intraartikulär.", icd10: "M25.85" },
      { name: "Log-Roll", positiv: "Übermäßige AR/weiches Endgefühl → Kapsellaxität.", icd10: "M25.35" },
      { name: "Resisted SLR (Iliopsoas)", positiv: "Leistenschmerz/Schwäche → Iliopsoas.", icd10: "M76.1" },
      { name: "Ober (ITB/TFL)", positiv: "Bein bleibt oben/lateraler Schmerz → ITB-Tightness.", icd10: "M76.3" },
    ],
  },
  knie: {
    region: "Knie",
    tests: [
      { name: "Lachman / Vordere Schublade", positiv: "Mehrtranslation/weiches Endgefühl → VKB.", icd10: "S83.53" },
      { name: "Posteriore Schublade / Sag-Sign", positiv: "Hintertranslation → HKB.", icd10: "S83.54" },
      { name: "Varus/Valgus-Stress (0°/30°)", positiv: "Laxität/Schmerz → MCL/LCL.", icd10: "S83.4" },
      { name: "McMurray / Thessaly", positiv: "Schmerz/Click/Block → Meniskus.", icd10: "S83.2" },
      { name: "Patellar Apprehension / Compression", positiv: "Abwehr/retropatellarer Schmerz → PF-Gelenk.", icd10: "M22.2" },
    ],
  },
  fuss_osg: {
    region: "Fuß & Sprunggelenk",
    tests: [
      { name: "Vordere Schublade OSG (ATFL)", positiv: "Mehrtranslation/weiches Endgefühl → ATFL.", icd10: "S93.4" },
      { name: "Squeeze / Kleiger (DF-ER)", positiv: "Distaler vorder-lateraler Schmerz → Syndesmose.", icd10: "S93.43" },
      { name: "Thompson (Achillessehne)", positiv: "Keine Plantarflexion bei Wadenkompression → Ruptur.", icd10: "S86.0" },
    ],
  },
};

// HB-002-Region → BASISTESTS-Schlüssel.
export const HB002_ZU_BASIS = {
  hws: "hws",
  bws: "bws_rippen",
  rippen_thorax: "bws_rippen",
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
  sprunggelenk_l: "fuss_osg",
  sprunggelenk_r: "fuss_osg",
  isg: "becken_isg",
};

// ── 3) OSTEOPATHISCHE SHORT-ROUTINE („Signature Lindebergs") ─
// Wird ohnehin vollständig durchgeführt — hier als Referenzsequenz.
export const OSTEO_ROUTINE = {
  prinzip: "Ganzkörper-Screen auf Ease vs. Bind (Leichtigkeit vs. Bindung), TART (Tissue/Asymmetrie/ROM/Tenderness), Leitregionen & Ketten priorisieren.",
  phasen: [
    { phase: "A) Stehen", schritte: ["Ganzkörper-Inspektion (Haut/Narben, Asymmetrien, Shifts)", "Global Listening (Ganzkörper-Lauschen, Anfangs-Vektor)", "Vorlauftest Becken (PSIS-Forward-Bend)", "Seitneige & CTÜ/HWS/Kiefer-Kurzscreen"] },
    { phase: "B) Sitzen (Top-down)", schritte: ["Kiefer (TMG) Bewegungsbahn", "TOS-Screen (Sotto-Hall) kurz & sicher", "Glenohumeral: Distraktion, IR/AR im schmerzfreien Bogen", "Steißbein-Kurzscreen (Driver: Becken vs. cervico-thorakal)", "Atmung: Thoraxapertur & Zwerchfell"] },
    { phase: "C) Bauchlage", schritte: ["Sakrum: Nutation/Contra-Nutation, Federung im Seitenvergleich"] },
    { phase: "D) Rückenlage", schritte: ["Becken neutralisieren (Malleolenvergleich)", "Becken/ISG-Landmarken & Kompression, Symphysen-Spring", "Diaphragmen: Beckenboden, Zwerchfell/Subkostal, Ease-Seiten", "Viszerales Leitgleiten (Leber/Galle, Magen, Kolon, Niere, Blase) bei Bedarf"] },
    { phase: "E) Obere Extremität", schritte: ["Schulter (GH/Scapula/AC/SC) osteopathischer Quick-Screen"] },
    { phase: "Synthese", schritte: ["Leitketten (z.B. CTÜ → 1. Rippe → Zwerchfell → Becken) und Zink-Pattern einordnen; Top-3 Zielregionen (Struktur • Diaphragmen/Faszie • Neuro/Cranial) wählen."] },
  ],
};
