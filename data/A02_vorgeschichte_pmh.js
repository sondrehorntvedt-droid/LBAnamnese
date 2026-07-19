/**
 * LINDEBERGS OS — Online-Anamnese
 * Modul A02: VORGESCHICHTE & MEDIZINISCHE KRANKENGESCHICHTE (PMH)
 * ES-Module-Kopie — Inhalt 1:1 identisch zur kanonischen Quelle.
 */

export const VORGESCHICHTE_FRAGEN = [

  {
    id: "PMH-001",
    frage: "Haben Sie bekannte Erkrankungen? (Mehrfachauswahl möglich)",
    type: "multiple_choice",
    required: true,
    options: [
      { value: "bluthochdruck", label: "Bluthochdruck (Hypertonie)" },
      { value: "herzerkrankung", label: "Herzerkrankung (KHK, Herzinfarkt, Herzrhythmusstörung)" },
      { value: "diabetes", label: "Diabetes mellitus (Typ 1 oder Typ 2)" },
      { value: "schilddruese", label: "Schilddrüsenerkrankung (Über-/Unterfunktion, Hashimoto)" },
      { value: "osteoporose", label: "Osteoporose" },
      { value: "rheuma", label: "Rheumatische Erkrankung (RA, axSpA, Gicht, Lupus)" },
      { value: "autoimmun", label: "Autoimmunerkrankung (MS, ALS, Hashimoto, Zöliakie, Psoriasis, Typ-1-Diabetes …)" },
      { value: "krebs", label: "Krebserkrankung (aktuell oder in der Vorgeschichte)" },
      { value: "copd_asthma", label: "Lungenerkrankung (COPD, Asthma)" },
      { value: "neurologisch", label: "Neurologische Erkrankung (Parkinson, Schlaganfall, Epilepsie, Migräne)" },
      { value: "depression_angst", label: "Psychische Erkrankung (Depression, Angst, Burnout)" },
      { value: "darmerkrankung", label: "Chronische Darmerkrankung (Morbus Crohn, Colitis ulcerosa, IBS)" },
      { value: "nierenerkrankung", label: "Nierenerkrankung" },
      { value: "gefaesserkrankung", label: "Gefäßerkrankung (TVT, Lungenembolie, Arteriosklerose)" },
      { value: "keine_bekannt", label: "Keine bekannten Erkrankungen" }
    ],
    allow_sonstiges: true
  },

  {
    id: "PMH-002",
    frage: "Falls Sie weitere Erkrankungen haben, die oben nicht aufgeführt sind:",
    type: "textarea",
    required: false,
    placeholder: "Weitere Diagnosen hier eintragen..."
  },

  {
    id: "PMH-001b",
    frage: "Wann wurden wichtige Diagnosen gestellt? (für Ihre Gesundheits-Zeitlinie)",
    type: "repeatable_entry",
    required: false,
    addLabel: "+ Diagnose mit Jahr hinzufügen",
    hint: "Hilft uns, den Verlauf Ihrer Gesundheit über die Jahre zu verstehen.",
    fields: [
      { key: "jahr", label: "Jahr", type: "text", placeholder: "z.B. 1991" },
      { key: "diagnose", label: "Diagnose", type: "text", placeholder: "z.B. Hashimoto-Thyreoiditis" },
    ],
  },

  // ── Krebs-Detailerfassung — nur wenn oben „Krebserkrankung" angekreuzt.
  // Wird hier EINMAL vollständig erfasst (inkl. OP), damit es nicht doppelt
  // unter Operationen abgefragt werden muss.
  {
    id: "PMH-CA-01",
    frage: "Zu Ihrer Krebserkrankung — welche Art / welcher Tumor?",
    type: "text",
    required: false,
    condition: { field: "PMH-001", contains: "krebs" },
    placeholder: "z.B. Mammakarzinom, Prostatakarzinom, Kolonkarzinom"
  },
  {
    id: "PMH-CA-02",
    frage: "Wo (Organ / Körperregion)?",
    type: "text",
    required: false,
    condition: { field: "PMH-001", contains: "krebs" },
    placeholder: "z.B. linke Brust, Dickdarm"
  },
  {
    id: "PMH-CA-03",
    frage: "Gutartig oder bösartig?",
    type: "single_choice",
    required: false,
    condition: { field: "PMH-001", contains: "krebs" },
    options: [
      { value: "gutartig", label: "Gutartig (benigne)" },
      { value: "boesartig", label: "Bösartig (maligne)" },
      { value: "unklar", label: "Unklar / weiß ich nicht" }
    ]
  },
  {
    id: "PMH-CA-04",
    frage: "Wann wurde es festgestellt (Jahr)?",
    type: "text",
    required: false,
    condition: { field: "PMH-001", contains: "krebs" },
    placeholder: "z.B. 2018"
  },
  {
    id: "PMH-CA-05",
    frage: "Hat der Tumor gestreut (Metastasen)?",
    type: "single_choice",
    required: false,
    condition: { field: "PMH-001", contains: "krebs" },
    options: [
      { value: "nein", label: "Nein, keine Metastasen" },
      { value: "ja", label: "Ja, gestreut / Metastasen" },
      { value: "unbekannt", label: "Unbekannt" }
    ]
  },
  {
    id: "PMH-CA-06",
    frage: "Welche Behandlungen haben Sie erhalten?",
    type: "multiple_choice",
    required: false,
    condition: { field: "PMH-001", contains: "krebs" },
    options: [
      { value: "operation", label: "Operation" },
      { value: "chemo", label: "Chemotherapie" },
      { value: "bestrahlung", label: "Bestrahlung (Radiotherapie)" },
      { value: "hormon", label: "Hormontherapie" },
      { value: "immun", label: "Immun-/Antikörpertherapie" },
      { value: "beobachtung", label: "Nur Beobachtung / keine Therapie" }
    ]
  },
  {
    id: "PMH-CA-07",
    frage: "Aktueller Stand?",
    type: "single_choice",
    required: false,
    condition: { field: "PMH-001", contains: "krebs" },
    hint: "Eine hier eingetragene Krebs-Operation müssen Sie unten bei den Operationen nicht noch einmal erfassen.",
    options: [
      { value: "in_behandlung", label: "Aktuell in Behandlung" },
      { value: "nachsorge", label: "Behandlung abgeschlossen, in Nachsorge" },
      { value: "geheilt", label: "Als geheilt entlassen" }
    ]
  },

  {
    id: "PMH-003",
    frage: "Wurden Sie jemals operiert?",
    type: "yes_no",
    required: true
  },

  {
    id: "PMH-004",
    frage: "Bitte tragen Sie Ihre Operationen ein:",
    type: "repeatable_entry",
    required: false,
    condition: { field: "pmh_operiert", equals: true },
    addLabel: "+ Weitere Operation hinzufügen",
    hint: "Narben sind für uns klinisch relevant (Faszielle Störfelder, Barral)",
    fields: [
      { key: "jahr", label: "Welches Jahr?", type: "text", placeholder: "z.B. 2019" },
      { key: "was", label: "Was? (Art, Körperregion)", type: "text", placeholder: "z.B. Kniearthroskopie rechts" },
      { key: "aktiv", label: "Heute noch Beschwerden?", type: "select", options: ["ausgeheilt", "gelegentlich", "ja, weiterhin"] },
    ],
  },

  {
    id: "PMH-005",
    frage: "Hatten Sie relevante Unfälle, Frakturen oder schwere Verletzungen?",
    type: "yes_no",
    required: true
  },

  {
    id: "PMH-006",
    frage: "Bitte tragen Sie Ihre Unfälle / Traumen ein:",
    type: "repeatable_entry",
    required: false,
    condition: { field: "pmh_unfaelle", equals: true },
    addLabel: "+ Weiteren Unfall hinzufügen",
    fields: [
      { key: "jahr", label: "Welches Jahr?", type: "text", placeholder: "z.B. 2018" },
      { key: "was", label: "Was?", type: "text", placeholder: "z.B. Schleudertrauma" },
      { key: "aktiv", label: "Heute noch Beschwerden?", type: "select", options: ["ausgeheilt", "gelegentlich", "ja, weiterhin"] },
    ],
  },

  {
    id: "PMH-007",
    frage: "Nehmen Sie aktuell regelmäßig Medikamente?",
    type: "yes_no",
    required: true
  },

  {
    id: "PMH-008",
    frage: "Welche Medikamente nehmen Sie?",
    type: "repeatable_entry",
    required: false,
    condition: { field: "pmh_medikamente", equals: true },
    addLabel: "+ Weiteres Medikament hinzufügen",
    hint: "Bitte auch Nahrungsergänzungsmittel, Hormone und pflanzliche Präparate angeben.",
    fields: [
      { key: "medikament", label: "Medikament", type: "text", placeholder: "z.B. Ibuprofen 400mg" },
      { key: "seit_wann", label: "Seit wann?", type: "text", placeholder: "z.B. seit 2022" },
      { key: "wegen_was", label: "Wegen was?", type: "text", placeholder: "z.B. Rückenschmerzen" },
    ],
  },

  {
    id: "PMH-009",
    frage: "Nehmen Sie Blutverdünner? (Marcumar, Xarelto, Eliquis, ASS etc.)",
    type: "yes_no",
    required: true,
    hint: "Relevant für Behandlungssicherheit (Injektionen, Manipulationen)"
  },

  {
    id: "PMH-010",
    frage: "Nehmen Sie Kortison / Steroide (Tabletten, Spritzen oder langfristig)?",
    type: "yes_no",
    required: true,
    hint: "Langzeit-Steroide erhöhen Frakturrisiko (Osteoporose)"
  },

  {
    id: "PMH-010b",
    frage: "Wurde bei Ihnen eine Bindegewebserkrankung oder ausgeprägte Überbeweglichkeit festgestellt?",
    type: "single_choice",
    required: false,
    hint: "z.B. Marfan-Syndrom, Ehlers-Danlos, Hypermobilitätssyndrom — relevant für die Wahl sanfter vs. manipulativer Techniken (Bänder-/Gelenkstabilität, obere HWS).",
    options: [
      { value: "nein", label: "Nein / nicht bekannt" },
      { value: "hypermobil", label: "Ja, ausgeprägte Überbeweglichkeit (Hypermobilität)" },
      { value: "bindegewebe", label: "Ja, diagnostizierte Bindegewebserkrankung (Marfan, Ehlers-Danlos …)" },
      { value: "unsicher", label: "Unsicher" }
    ]
  },

  {
    id: "PMH-011",
    frage: "Haben Sie bekannte Allergien oder Unverträglichkeiten?",
    type: "multiple_choice",
    required: true,
    options: [
      { value: "medikamente_allergie", label: "Medikamentenallergie (z.B. Penicillin, ASS, Ibuprofen)" },
      { value: "latex", label: "Latexallergie" },
      { value: "kontrastmittel", label: "Kontrastmittel-Allergie (MRT/CT)" },
      { value: "nahrung", label: "Nahrungsmittelallergie (z.B. Nüsse, Gluten, Laktose)" },
      { value: "pollen_umwelt", label: "Umweltallergie (Pollen, Hausstaubmilben, Tierhaare)" },
      { value: "keine", label: "Keine bekannten Allergien" }
    ]
  },

  {
    id: "PMH-012",
    frage: "Falls Medikamentenallergie: Welche Medikamente und welche Reaktion?",
    type: "textarea",
    required: false,
    condition: { field: "pmh_allergien", contains: "medikamente_allergie" },
    placeholder: "z.B. Penicillin → Urtikaria, Ibuprofen → Bronchospasmus..."
  },

  {
    id: "PMH-013",
    frage: "Sind Ihre Impfungen aktuell? (Tetanus, Pneumokokken bei ≥60J, Herpes zoster bei ≥50J)",
    type: "single_choice",
    required: false,
    options: [
      { value: "ja_alle", label: "Ja, alles aktuell" },
      { value: "teilweise", label: "Teilweise — bin nicht sicher" },
      { value: "nein", label: "Nein / nicht aktuell" },
      { value: "weiss_nicht", label: "Weiß ich nicht" }
    ]
  },

  {
    id: "PMH-014",
    frage: "Gibt es Erkrankungen, die in Ihrer Familie (Eltern, Geschwister) gehäuft vorkommen?",
    type: "multiple_choice",
    required: true,
    options: [
      { value: "herzerkrankung_fam", label: "Herzerkrankung / Herzinfarkt (vor dem 65. LJ)" },
      { value: "schlaganfall_fam", label: "Schlaganfall" },
      { value: "krebs_fam", label: "Krebserkrankung" },
      { value: "diabetes_fam", label: "Diabetes mellitus" },
      { value: "osteoporose_fam", label: "Osteoporose / Wirbelbrüche" },
      { value: "rheuma_fam", label: "Rheuma / entzündliche Gelenkerkrankung" },
      { value: "darmkrebs_fam", label: "Darmkrebs / Polypen" },
      { value: "depression_fam", label: "Psychische Erkrankungen" },
      { value: "keine_fam", label: "Keine bekannten Familienerkrankungen" }
    ]
  },

  {
    id: "PMH-014b",
    frage: "Möchten Sie einzelne Familienmitglieder mit ihrer Erkrankung eintragen?",
    type: "repeatable_entry",
    required: false,
    addLabel: "+ Familienmitglied hinzufügen",
    fields: [
      { key: "familienmitglied", label: "Familienmitglied", type: "text", placeholder: "z.B. Vater" },
      { key: "krankheit", label: "Krankheit", type: "text", placeholder: "z.B. Herzinfarkt mit 58" },
    ],
  },

  {
    id: "PMH-015",
    frage: "Rauchen Sie?",
    type: "single_choice",
    required: true,
    options: [
      { value: "nie", label: "Nie geraucht" },
      { value: "ex_raucher", label: "Ex-Raucher (aufgehört)" },
      { value: "gelegentlich", label: "Gelegentlich" },
      { value: "regelmaessig", label: "Regelmäßig — Zigaretten/Tag:" }
    ]
  },

  {
    id: "PMH-016",
    frage: "Wie viel Alkohol trinken Sie pro Woche?",
    type: "single_choice",
    required: true,
    options: [
      { value: "keinen", label: "Keinen / kaum" },
      { value: "gelegentlich", label: "Gelegentlich (1-3 Gläser/Woche)" },
      { value: "moderat", label: "Moderat (4-7 Gläser/Woche)" },
      { value: "viel", label: "Täglich oder mehr als 7 Gläser/Woche" }
    ]
  },

  {
    id: "PMH-017",
    frage: "Nehmen Sie andere Substanzen regelmäßig ein? (z.B. Cannabis, Schlaf- oder Beruhigungsmittel)",
    type: "yes_no",
    required: false,
    hint: "Vertrauliche Angabe — nur für optimale Behandlungsplanung"
  },

  {
    id: "PMH-018",
    frage: "Sind Sie schwanger oder könnte eine Schwangerschaft bestehen?",
    type: "single_choice",
    required: false,
    condition: { field: "sd_geschlecht", equals: "f" },
    options: [
      { value: "ja", label: "Ja" },
      { value: "nein", label: "Nein" },
      { value: "weiss_nicht", label: "Weiß ich nicht" }
    ],
    hint: "Relevant für Behandlungssicherheit (Röntgen, Manipulation, Medikamente)"
  },

  {
    id: "PMH-019",
    frage: "Haben Sie Arztbriefe, Befunde oder Krankenhausberichte aus der Vergangenheit, die für unsere Behandlung relevant sein könnten?",
    type: "file_upload",
    required: false,
    accepted_types: ["application/pdf", "image/jpeg", "image/png"],
    max_size_mb: 30,
    max_files: 15,
    hint: "z.B. OP-Berichte, Entlassungsbriefe, Röntgenbefunde, Laborberichte der letzten 5 Jahre"
  }
];
