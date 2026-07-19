/**
 * LINDEBERGS OS — Systemanamnese (Review of Systems)
 *
 * Inhalt: 1:1 aus der offiziellen Praxis-PDF "Anamnesebogen Lindebergs"
 * (Abschnitt 10 - SYSTEMANAMNESE, a-h).
 * Bedienlogik: "Gatekeeper" aus dem Master-Dokument (Phase 10) — eine
 * Frage pro System (Nein/Ja/Unsicher), Detail-Checkliste klappt nur bei
 * Ja/Unsicher auf ("Erst filtern, dann maximale Tiefe").
 */

export const SYSTEMANAMNESE_INTRO = {
  titel: "Ihre große Systemanamnese",
  beschreibung:
    "Damit wir effizient bleiben, stellen wir eine Frage pro Körpersystem. Bei „Nein“ springen wir weiter — bei „Ja“ oder „Unsicher“ schauen wir gemeinsam genauer hin.",
};

export const GATE_OPTIONEN = [
  { value: "nein", label: "Nein" },
  { value: "ja", label: "Ja" },
  { value: "unsicher", label: "Unsicher — bitte genauer prüfen" },
];

/**
 * Daniel/KPNI-Vertiefung für das Endokrin-/Stoffwechsel-System — erscheint in
 * der neuen (baumbasierten) Systemanamnese unter ENDOKRIN, nur in der
 * Tiefenanalyse.
 */
export const ENDOKRIN_DEEP_FRAGEN = [
  {
    id: "SYS-E-T1",
    frage: "Schilddrüse / Energie-Grundumsatz — trifft zu:",
    type: "multiple_choice",
    options: ["Ständiges Frieren / kalte Hände & Füße", "Trockene Haut oder Haarausfall / brüchige Nägel", "Verstopfung", "Gewichtszunahme trotz gleicher Ernährung", "Morgens schwer in Gang / Antriebslosigkeit"].map((l) => ({ value: l, label: l })),
  },
  {
    id: "SYS-E-T2",
    frage: "Nebenniere / Stress-Achse — trifft zu:",
    type: "multiple_choice",
    options: ["Energie-Tief am Nachmittag, abends wieder wach (zweiter Wind)", "Aufstehen fällt schwer, komme morgens kaum hoch", "Ausgeprägter Salzhunger", "Schwindel / Kreislaufschwäche beim schnellen Aufstehen", "Erschöpfung, die sich durch Schlaf nicht erholt"].map((l) => ({ value: l, label: l })),
  },
  {
    id: "SYS-E-T4",
    frage: "Sexualhormone / Libido — trifft zu:",
    type: "multiple_choice",
    options: ["Libido deutlich verringert", "Muskelabbau / Kraftverlust trotz Training", "Stimmungsschwankungen / Reizbarkeit", "Hitzewallungen oder Nachtschweiß"].map((l) => ({ value: l, label: l })),
  },
  {
    id: "SYS-E-T6",
    frage: "Funktionelle Nährstoff-Mangelzeichen — trifft zu:",
    type: "multiple_choice",
    options: ["Muskelkrämpfe, Wadenkrämpfe oder Lidzucken (Magnesium)", "Kribbeln/Taubheit, Zungenbrennen, Konzentrationsprobleme (Vitamin B12)", "Brüchige Nägel, Haarausfall, Blässe, Erschöpfung (Eisen/Ferritin)", "Häufige Infekte, langsame Wundheilung (Vitamin D / Zink)", "Trockene Haut, depressive Verstimmung, Gelenkbeschwerden (Omega-3 / Vitamin D)", "Zahnfleischbluten, leichte Blutergüsse (Vitamin C)"].map((l) => ({ value: l, label: l })),
  },
  {
    id: "SYS-E-T7",
    frage: "Blutzucker / Insulinresistenz — trifft zu:",
    type: "multiple_choice",
    options: ["Zunehmender Bauchumfang / Fett an der Taille", "Heißhunger auf Süßes/Kohlenhydrate, besonders nachmittags/abends", "Müdigkeit / starkes Tief kurz nach den Mahlzeiten", "Dunkle, samtige Hautverfärbung (Nacken, Achseln)", "Diabetes Typ 2 in der nahen Familie"].map((l) => ({ value: l, label: l })),
  },
  {
    id: "SYS-E-T8",
    frage: "Energie / Mitochondrien & Entgiftung (KPNI) — trifft zu:",
    type: "multiple_choice",
    options: ["Belastungsintoleranz — schon kleine Anstrengung erschöpft stark", "Sehr lange Erholung nach Sport (Tage statt Stunden)", "Ausgeprägte Empfindlichkeit gegenüber Gerüchen/Chemikalien/Medikamenten", "Veränderte Reaktion auf Koffein oder Alkohol (stärker/schlechter verträglich)", "Chronische Erschöpfung ohne klaren Grund"].map((l) => ({ value: l, label: l })),
  },
  {
    id: "SYS-E-T5",
    frage: "Bekannte Auffälligkeiten in Blutwerten (falls bekannt)?",
    type: "textarea",
    placeholder: "z.B. TSH erhöht, Vitamin D niedrig, HbA1c grenzwertig, Ferritin niedrig…",
  },
];

export const SYSTEMANAMNESE_BLOCKS = [
  {
    id: "SYS-A",
    name: "Herz-Kreislauf und Atmung",
    gateId: "SYSG-A",
    gateFrage: "Bestehen bei Ihnen Beschwerden im Bereich Herz, Kreislauf oder Atmung?",
    fachbereiche: ["Kardiologie", "Pneumologie"],
    freitext: {
      id: "SYS-A-frei",
      titel: "In Ihren eigenen Worten: Wie äußern sich Ihre Herz-/Kreislauf- oder Atembeschwerden?",
      placeholder: "z.B. Herzstolpern beim Einschlafen, Luftnot beim Treppensteigen ab dem 2. Stock…",
    },
    sections: [
      {
        id: "SYS-A-1",
        titel: "Leistungsfähigkeit",
        type: "single_choice",
        options: [
          { value: "gut", label: "Gut" },
          { value: "mittel", label: "Mittel" },
          { value: "schlecht", label: "Schlecht" },
        ],
      },
      {
        id: "SYS-A-2",
        titel: "Bestehen bei Ihnen:",
        type: "multiple_choice",
        options: [
          "Atemnot", "Müdigkeit", "Herzsensationen", "Beklemmungsgefühl im Thorax", "Husten",
          "Auswurf", "Heiserkeit", "Schmerzen oder Druck im Brustbereich", "Atemabhängiger Schmerz",
        ].map((l) => ({ value: l, label: l })),
      },
    ],
  },
  {
    id: "SYS-B",
    name: "Verdauungsapparat",
    gateId: "SYSG-B",
    gateFrage: "Bestehen bei Ihnen Verdauungsbeschwerden?",
    fachbereiche: ["Ernährungsmedizin"],
    freitext: {
      id: "SYS-B-frei",
      titel: "In Ihren eigenen Worten: Wie äußern sich Ihre Verdauungsbeschwerden?",
      placeholder: "z.B. Blähungen v.a. abends, Bauchweh nach Milchprodukten, Stuhlgang unregelmäßig…",
    },
    sections: [
      {
        id: "SYS-B-1",
        titel: "Bestehen bei Ihnen:",
        type: "multiple_choice",
        options: [
          "Schluckbeschwerden", "Aufstoßen", "Völlegefühl", "Appetitlosigkeit", "Bauchschmerzen",
          "Übelkeit", "Erbrechen", "Blähungen", "Durchfälle", "Obstipation", "Beimengungen (Blut, Schleim etc.)",
        ].map((l) => ({ value: l, label: l })),
      },
    ],
  },
  {
    id: "SYS-C",
    name: "Harnwege",
    gateId: "SYSG-C",
    gateFrage: "Bestehen bei Ihnen Beschwerden beim Wasserlassen?",
    fachbereiche: ["Labormedizin"],
    freitext: {
      id: "SYS-C-frei",
      titel: "In Ihren eigenen Worten: Was fällt Ihnen beim Wasserlassen auf?",
      placeholder: "z.B. muss nachts 2× raus, Brennen, plötzlicher Harndrang…",
    },
    sections: [
      {
        id: "SYS-C-1",
        titel: "Miktionsbeschwerden:",
        type: "multiple_choice",
        options: ["Schmerzhaft", "Veränderte Häufigkeit", "Veränderte Menge", "Nächtliches Wasserlassen", "Inkontinenz"].map((l) => ({ value: l, label: l })),
      },
      {
        id: "SYS-C-2",
        titel: "Harnveränderungen:",
        type: "multiple_choice",
        options: ["Farbe verändert", "Trüb", "Geruchsveränderungen"].map((l) => ({ value: l, label: l })),
      },
    ],
  },
  {
    id: "SYS-D",
    name: "Nervensystem",
    gateId: "SYSG-D",
    gateFrage: "Bestehen bei Ihnen neurologische Beschwerden?",
    fachbereiche: ["Neurologie"],
    freitext: {
      id: "SYS-D-frei",
      titel: "In Ihren eigenen Worten: Wie äußern sich Ihre neurologischen Beschwerden?",
      placeholder: "z.B. Kribbeln in den Fingern morgens, Schwindel beim Aufstehen, Kopfschmerz einseitig…",
    },
    sections: [
      {
        id: "SYS-D-1",
        titel: "Störung der Hirnnervenfunktionen:",
        type: "multiple_choice",
        options: ["Riechen", "Schmecken", "Sehstörungen", "Gleichgewicht", "Koordination", "Hören", "Kopfschmerz", "Sensibilität", "Zungenmotorik"].map((l) => ({ value: l, label: l })),
      },
      {
        id: "SYS-D-2",
        titel: "Störung der Extremitäten:",
        type: "multiple_choice",
        options: ["Sensibilitätsverlust", "Kraftverlust"].map((l) => ({ value: l, label: l })),
      },
    ],
  },
  {
    id: "SYS-E",
    name: "Stoffwechsel und Hormone",
    gateId: "SYSG-E",
    gateFrage: "Bestehen bei Ihnen Stoffwechsel- oder Hormonbeschwerden?",
    fachbereiche: ["Labormedizin", "Ernährungsmedizin"],
    freitext: {
      id: "SYS-E-frei",
      titel: "In Ihren eigenen Worten: Was beobachten Sie an Ihrem Stoffwechsel / Hormonhaushalt?",
      placeholder: "z.B. friere ständig, Gewicht steigt trotz gleicher Ernährung, Energie erst ab Mittag…",
    },
    sections: [
      {
        id: "SYS-E-1",
        titel: "Bestehen bei Ihnen:",
        type: "multiple_choice",
        options: ["Müdigkeit", "Unruhe", "Schlafstörungen", "Gemütsveränderungen", "Schwitzen", "Verändertes Durstgefühl"].map((l) => ({ value: l, label: l })),
      },
    ],
    // Vertiefung (nur Tiefenanalyse): Daniels Stoffwechsel-/Hormon-Screening,
    // KPNI-informiert. Funktionelle Muster (Schilddrüse-tief, Nebenniere/Stress,
    // Blutzucker, Sexualhormone) — deuten NICHT diagnostisch, sondern lenken das
    // Gespräch und mögliche Laborkontrollen. Bleibt Therapeuten-Interpretation.
    tiefeSections: [
      {
        id: "SYS-E-T1",
        titel: "Schilddrüse / Energie-Grundumsatz — trifft zu:",
        type: "multiple_choice",
        options: [
          "Ständiges Frieren / kalte Hände & Füße",
          "Trockene Haut oder Haarausfall / brüchige Nägel",
          "Verstopfung",
          "Gewichtszunahme trotz gleicher Ernährung",
          "Morgens schwer in Gang / Antriebslosigkeit",
        ].map((l) => ({ value: l, label: l })),
      },
      {
        id: "SYS-E-T2",
        titel: "Nebenniere / Stress-Achse — trifft zu:",
        type: "multiple_choice",
        options: [
          "Energie-Tief am Nachmittag, abends wieder wach (zweiter Wind)",
          "Aufstehen fällt schwer, komme morgens kaum hoch",
          "Ausgeprägter Salzhunger",
          "Schwindel / Kreislaufschwäche beim schnellen Aufstehen",
          "Erschöpfung, die sich durch Schlaf nicht erholt",
        ].map((l) => ({ value: l, label: l })),
      },
      {
        id: "SYS-E-T3",
        titel: "Wie ist Ihr Energieverlauf über den Tag?",
        type: "single_choice",
        options: [
          { value: "stabil", label: "Gleichmäßig / stabil" },
          { value: "morgens_tief", label: "Morgens tief, kommt erst später" },
          { value: "nachmittag_tief", label: "Vormittags gut, Nachmittagstief" },
          { value: "schwankend", label: "Stark schwankend / unvorhersehbar" },
        ],
      },
      {
        id: "SYS-E-T4",
        titel: "Sexualhormone / Libido — trifft zu:",
        type: "multiple_choice",
        options: [
          "Libido deutlich verringert",
          "Muskelabbau / Kraftverlust trotz Training",
          "Stimmungsschwankungen / Reizbarkeit",
          "Hitzewallungen oder Nachtschweiß",
        ].map((l) => ({ value: l, label: l })),
      },
      {
        id: "SYS-E-T6",
        titel: "Funktionelle Nährstoff-Mangelzeichen — trifft zu:",
        type: "multiple_choice",
        hint: "Klinische Hinweise auf mögliche Defizite (keine Diagnose) — lenken gezielte Laborkontrollen.",
        options: [
          "Muskelkrämpfe, Wadenkrämpfe oder Lidzucken (Magnesium)",
          "Kribbeln/Taubheit, Zungenbrennen, Konzentrationsprobleme (Vitamin B12)",
          "Brüchige Nägel, Haarausfall, Blässe, Erschöpfung (Eisen/Ferritin)",
          "Häufige Infekte, langsame Wundheilung (Vitamin D / Zink)",
          "Trockene Haut, depressive Verstimmung, Gelenkbeschwerden (Omega-3 / Vitamin D)",
          "Zahnfleischbluten, leichte Blutergüsse (Vitamin C)",
        ].map((l) => ({ value: l, label: l })),
      },
      {
        id: "SYS-E-T7",
        titel: "Blutzucker / Insulinresistenz — trifft zu:",
        type: "multiple_choice",
        options: [
          "Zunehmender Bauchumfang / Fett an der Taille",
          "Heißhunger auf Süßes/Kohlenhydrate, besonders nachmittags/abends",
          "Müdigkeit / starkes Tief kurz nach den Mahlzeiten",
          "Dunkle, samtige Hautverfärbung (Nacken, Achseln)",
          "Diabetes Typ 2 in der nahen Familie",
        ].map((l) => ({ value: l, label: l })),
      },
      {
        id: "SYS-E-T8",
        titel: "Energie / Mitochondrien & Entgiftung (KPNI) — trifft zu:",
        type: "multiple_choice",
        options: [
          "Belastungsintoleranz — schon kleine Anstrengung erschöpft stark",
          "Sehr lange Erholung nach Sport (Tage statt Stunden)",
          "Ausgeprägte Empfindlichkeit gegenüber Gerüchen/Chemikalien/Medikamenten",
          "Veränderte Reaktion auf Koffein oder Alkohol (stärker/schlechter verträglich)",
          "Chronische Erschöpfung ohne klaren Grund",
        ].map((l) => ({ value: l, label: l })),
      },
      {
        id: "SYS-E-T5",
        titel: "Bekannte Auffälligkeiten in Blutwerten (falls bekannt)?",
        type: "textarea",
        placeholder: "z.B. TSH erhöht, Vitamin D niedrig, HbA1c grenzwertig, Ferritin niedrig…",
      },
    ],
  },
  {
    id: "SYS-F1",
    name: "Gynäkologie",
    gateId: "SYSG-F1",
    gateFrage: "Bestehen bei Ihnen gynäkologische Beschwerden?",
    condition: { field: "sd_geschlecht", equals: "f" },
    freitext: {
      id: "SYS-F1-frei",
      titel: "In Ihren eigenen Worten: Was möchten Sie zu Zyklus / gynäkologischen Themen anmerken?",
      placeholder: "z.B. Zyklus seit einem Jahr unregelmäßig, starke Regelschmerzen…",
    },
    sections: [
      {
        id: "SYS-F1-1",
        titel: "Regel:",
        type: "multiple_choice",
        options: ["Regelmäßig", "Ausbleibend", "Verlängert", "Verkürzt", "Vermehrt", "Vermindert", "Schmerzhaft"].map((l) => ({ value: l, label: l })),
      },
      { id: "SYS-F1-2", titel: "Menarche (Alter erste Periode)", type: "text" },
      { id: "SYS-F1-3", titel: "Menopause (Alter, falls zutreffend)", type: "text" },
      { id: "SYS-F1-4", titel: "Schwangerschaften (wie viele)", type: "number" },
      { id: "SYS-F1-5", titel: "Abgänge (wie viele)", type: "number" },
      { id: "SYS-F1-6", titel: "Abbrüche (wie viele)", type: "number" },
      { id: "SYS-F1-7", titel: "Geburten (wie viele)", type: "number" },
      { id: "SYS-F1-8", titel: "Verhütung", type: "text" },
    ],
  },
  {
    id: "SYS-F2",
    name: "Sexualität & Urologie",
    gateId: "SYSG-F2",
    gateFrage: "Bestehen bei Ihnen Beschwerden im Bereich Sexualität?",
    freitext: {
      id: "SYS-F2-frei",
      titel: "In Ihren eigenen Worten (optional):",
      placeholder: "Nur wenn Sie möchten…",
    },
    sections: [
      {
        id: "SYS-F2-1",
        titel: "Bestehen bei Ihnen:",
        type: "multiple_choice",
        options: ["Erektionsprobleme", "Libidostörungen", "Schmerzen beim Geschlechtsverkehr"].map((l) => ({ value: l, label: l })),
      },
    ],
  },
  {
    id: "SYS-G",
    name: "Hautprobleme",
    gateId: "SYSG-G",
    gateFrage: "Bestehen bei Ihnen Hautprobleme?",
    fachbereiche: ["Allgemein / Sonstige"],
    freitext: {
      id: "SYS-G-frei",
      titel: "In Ihren eigenen Worten: Was fällt Ihnen an Ihrer Haut auf?",
      placeholder: "z.B. Ausschlag an den Ellenbeugen, Juckreiz nachts, seit dem Frühjahr…",
    },
    sections: [
      {
        id: "SYS-G-1",
        titel: "Bestehen bei Ihnen:",
        type: "multiple_choice",
        options: ["Jucken", "Trocken", "Feucht", "Blass", "Rötlich", "Ausschlag"].map((l) => ({ value: l, label: l })),
      },
    ],
  },
  {
    id: "SYS-H",
    name: "HNO — Ohren, Nase, Hals, Mund & Kiefer",
    gateId: "SYSG-H",
    gateFrage: "Bestehen bei Ihnen HNO-Beschwerden (Ohren, Nase/Nebenhöhlen, Hals) oder im Bereich Mund/Kiefer?",
    freitext: {
      id: "SYS-H-frei",
      titel: "In Ihren eigenen Worten: Was beobachten Sie im HNO-/Kieferbereich?",
      placeholder: "z.B. Ohrgeräusche links, chronische Nebenhöhlen, morgens Kieferschmerz…",
    },
    sections: [
      {
        id: "SYS-H-0a",
        titel: "Ohren:",
        type: "multiple_choice",
        options: ["Ohrgeräusche / Tinnitus", "Hörminderung", "Ohrschmerz / Druckgefühl", "Drehschwindel"].map((l) => ({ value: l, label: l })),
      },
      {
        id: "SYS-H-0b",
        titel: "Nase / Hals:",
        type: "multiple_choice",
        options: ["Behinderte Nasenatmung", "Häufiger Schnupfen / Niesen", "Schluckbeschwerden", "Heiserkeit / Räusperzwang", "Globusgefühl (Kloß im Hals)"].map((l) => ({ value: l, label: l })),
      },
      {
        id: "SYS-H-1",
        titel: "Nasennebenhöhlen (Sinusitis):",
        type: "single_choice",
        options: [
          { value: "keine", label: "Keine" },
          { value: "akut", label: "Akut" },
          { value: "chronisch", label: "Chronisch" },
        ],
      },
      {
        id: "SYS-H-2",
        titel: "Kiefer / Zähne:",
        type: "multiple_choice",
        options: ["Zähneknirschen", "Zähnepressen", "Aufbissschiene", "Kieferschmerzen / Knacken", "Implantate", "Wurzelbehandlung"].map((l) => ({ value: l, label: l })),
      },
    ],
  },
];
