/**
 * LINDEBERGS OS — Online-Anamnese
 * Modul A03: VITALMEDIZIN & STOFFWECHSEL (Daniel's Module)
 * ES-Module-Kopie — Inhalt 1:1 identisch zur kanonischen Quelle.
 */

export const SCHLAF_ENERGIE_FRAGEN = [
  {
    id: "D1-001",
    frage: "Wie viele Stunden schlafen Sie durchschnittlich pro Nacht?",
    type: "single_choice",
    required: true,
    section: "Schlaf",
    options: [
      { value: "unter5", label: "Weniger als 5 Stunden" },
      { value: "5bis6", label: "5–6 Stunden" },
      { value: "6bis7", label: "6–7 Stunden" },
      { value: "7bis8", label: "7–8 Stunden" },
      { value: "ueber8", label: "Mehr als 8 Stunden" }
    ]
  },
  {
    id: "D1-002",
    frage: "Wie ist die Qualität Ihres Schlafs? (PSQI adaptiert)",
    type: "single_choice",
    required: true,
    section: "Schlaf",
    options: [
      { value: "sehr_gut", label: "Sehr gut — ich schlafe durch und wache erholt auf" },
      { value: "gut", label: "Gut — meistens gut, selten Probleme" },
      { value: "schlecht", label: "Schlecht — oft Einschlaf- oder Durchschlafprobleme" },
      { value: "sehr_schlecht", label: "Sehr schlecht — fast nie erholsamer Schlaf" }
    ]
  },
  {
    id: "D1-003",
    frage: "Haben Sie Probleme mit dem Einschlafen?",
    type: "single_choice",
    required: true,
    section: "Schlaf",
    options: [
      { value: "nie", label: "Nie" },
      { value: "selten", label: "Selten (1–2x/Woche)" },
      { value: "haeufig", label: "Häufig (3–4x/Woche)" },
      { value: "fast_immer", label: "Fast immer (5+x/Woche)" }
    ]
  },
  {
    id: "D1-004",
    frage: "Wachen Sie nachts auf und können nicht wieder einschlafen?",
    type: "single_choice",
    required: true,
    section: "Schlaf",
    options: [
      { value: "nie", label: "Nie" },
      { value: "selten", label: "Selten" },
      { value: "haeufig", label: "Häufig (1–2x pro Nacht)" },
      { value: "sehr_haeufig", label: "Sehr häufig (mehrmals pro Nacht)" }
    ]
  },
  {
    id: "D1-005",
    frage: "Fühlen Sie sich morgens ausgeschlafen und erholt?",
    type: "single_choice",
    required: true,
    section: "Schlaf",
    options: [
      { value: "fast_immer", label: "Ja, fast immer" },
      { value: "meistens", label: "Meistens" },
      { value: "selten", label: "Selten" },
      { value: "nie", label: "Nie — ich bin morgens immer erschöpft" }
    ]
  },
  {
    id: "D1-006",
    frage: "Schnarchen Sie laut oder haben Sie Atemaussetzer im Schlaf? (Von Partner/in beobachtet?)",
    type: "single_choice",
    required: true,
    section: "Schlaf",
    options: [
      { value: "nein", label: "Nein" },
      { value: "leicht", label: "Leichtes Schnarchen" },
      { value: "stark", label: "Starkes Schnarchen" },
      { value: "aussetzer", label: "Schnarchen + Atemaussetzer (beobachtet)" },
      { value: "weiss_nicht", label: "Weiß ich nicht" }
    ],
    hint: "STOP-BANG Screening für Schlafapnoe"
  },
  {
    id: "D1-007",
    frage: "Wie müde / schläfrig sind Sie tagsüber? (Epworth adaptiert)",
    type: "single_choice",
    required: true,
    section: "Energie",
    options: [
      { value: "nicht", label: "Gar nicht — ich bin tagsüber wach und fit" },
      { value: "leicht", label: "Leicht schläfrig (nach dem Mittagessen normal)" },
      { value: "moderat", label: "Moderat — ich döse gelegentlich ein (Besprechung, Auto)" },
      { value: "stark", label: "Stark — ich kämpfe regelmäßig gegen Schläfrigkeit" },
      { value: "sehr_stark", label: "Sehr stark — ich schlafe am Tag ungewollt ein" }
    ]
  },
  {
    id: "D1-008",
    frage: "Wie würden Sie Ihr Energieniveau allgemein einschätzen? (0 = komplett erschöpft, 10 = voller Energie)",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: true,
    section: "Energie",
    labels: { 0: "Komplett erschöpft", 5: "Mittelmäßig", 10: "Voller Energie" }
  },
  {
    id: "D1-009",
    frage: "Haben Sie das Gefühl, nach dem Schlafen nicht erholt zu sein (non-refreshing sleep)?",
    type: "yes_no",
    required: true,
    section: "Energie",
    hint: "Typisch für Fibromyalgie, ME/CFS, Schlafapnoe"
  },
  {
    id: "D1-010",
    frage: "Fühlen Sie sich emotional ausgelaugt oder ausgebrannt?",
    type: "single_choice",
    required: true,
    section: "Burnout-Screening",
    options: [
      { value: "nie", label: "Nein / kaum" },
      { value: "gelegentlich", label: "Gelegentlich" },
      { value: "haeufig", label: "Häufig" },
      { value: "fast_immer", label: "Fast immer — ich bin am Limit" }
    ]
  },
  {
    id: "D1-011",
    frage: "Haben Sie Schwierigkeiten, sich zu konzentrieren oder Dinge zu merken (Brain Fog)?",
    type: "single_choice",
    required: true,
    section: "Energie / Kognition",
    options: [
      { value: "nein", label: "Nein" },
      { value: "leicht", label: "Leicht — gelegentlich unkonzentriert" },
      { value: "moderat", label: "Moderat — häufige Konzentrationsschwierigkeiten" },
      { value: "stark", label: "Stark — erhebliche Gedächtnis-/Konzentrationsdefizite" }
    ]
  },
  {
    id: "D1-012",
    frage: "Wie ist Ihre Stimmung in den letzten 4 Wochen?",
    type: "single_choice",
    required: true,
    section: "Stimmung / Mental",
    options: [
      { value: "gut", label: "Gut / ausgeglichen" },
      { value: "schwankend", label: "Schwankend — Höhen und Tiefen" },
      { value: "eher_tief", label: "Eher gedrückt / lustlos" },
      { value: "depressiv", label: "Anhaltend deprimiert / hoffnungslos" },
      { value: "angespannt", label: "Anhaltend angespannt / ängstlich" }
    ]
  },
  // ── Schlafhygiene & Circadian (Grundlage: M. Walker; A. Huberman —
  //    Schlafkonsistenz, Licht/Bildschirme, Koffein-Timing). Liefern zugleich
  //    Stellhebel für Empfehlungen und speisen den Faktor Rhythm.
  {
    id: "D1-013",
    frage: "Wie regelmäßig sind Ihre Schlafenszeiten (auch am Wochenende ähnliche Zubett-/Aufstehzeit)?",
    type: "single_choice",
    required: false,
    section: "Schlafhygiene",
    options: [
      { value: "sehr_regelmaessig", label: "Sehr regelmäßig (± 30 min)" },
      { value: "eher_regelmaessig", label: "Eher regelmäßig" },
      { value: "unregelmaessig", label: "Unregelmäßig" },
      { value: "sehr_unregelmaessig", label: "Sehr unregelmäßig / Schichtdienst" }
    ]
  },
  {
    id: "D1-014",
    frage: "Nutzen Sie in der letzten Stunde vor dem Schlaf helle Bildschirme (Handy, TV, Laptop)?",
    type: "single_choice",
    required: false,
    section: "Schlafhygiene",
    options: [
      { value: "nie", label: "Nie / selten" },
      { value: "manchmal", label: "Manchmal" },
      { value: "meistens", label: "Meistens" },
      { value: "immer", label: "Fast immer, bis zum Einschlafen" }
    ]
  },
  {
    id: "D1-015",
    frage: "Wann trinken Sie Ihren letzten Kaffee / Ihr letztes Koffein am Tag?",
    type: "single_choice",
    required: false,
    section: "Schlafhygiene",
    options: [
      { value: "kein", label: "Kein Koffein" },
      { value: "vormittags", label: "Nur vormittags (bis ~12 Uhr)" },
      { value: "nachmittags", label: "Bis in den Nachmittag (12–16 Uhr)" },
      { value: "spaet", label: "Auch spät nachmittags / abends (nach 16 Uhr)" }
    ]
  },
  {
    id: "D1-016",
    frage: "Bekommen Sie morgens früh Tageslicht (kurz nach dem Aufstehen draußen / am Fenster)?",
    type: "single_choice",
    required: false,
    section: "Schlafhygiene",
    options: [
      { value: "taeglich", label: "Ja, fast täglich" },
      { value: "manchmal", label: "Manchmal" },
      { value: "selten", label: "Selten / nie" }
    ]
  }
];

export const STOFFWECHSEL_FRAGEN = [
  {
    id: "D2-001",
    frage: "Hat sich Ihr Körpergewicht in den letzten 12 Monaten verändert?",
    type: "single_choice",
    required: true,
    section: "Gewicht",
    options: [
      { value: "stabil", label: "Stabil geblieben" },
      { value: "zugenommen_leicht", label: "Zugenommen (1–5 kg)" },
      { value: "zugenommen_stark", label: "Stark zugenommen (>5 kg)" },
      { value: "abgenommen_leicht", label: "Abgenommen (1–5 kg)" },
      { value: "abgenommen_stark", label: "Stark abgenommen (>5 kg) ⚠️" }
    ],
    hint: "Ungewollter starker Gewichtsverlust = Red Flag"
  },
  {
    id: "D2-002",
    frage: "Haben Sie Diabetes oder wurde Ihnen jemals erhöhter Blutzucker gesagt?",
    type: "single_choice",
    required: true,
    section: "Blutzucker / Insulinresistenz",
    options: [
      { value: "nein", label: "Nein" },
      { value: "praediabetes", label: "Ja — Prädiabetes / grenzwertiger Blutzucker" },
      { value: "diabetes_2", label: "Ja — Typ-2-Diabetes" },
      { value: "diabetes_1", label: "Ja — Typ-1-Diabetes" },
      { value: "weiss_nicht", label: "Weiß ich nicht" }
    ]
  },
  {
    id: "D2-003",
    frage: "Haben Sie Symptome, die auf Insulinresistenz hindeuten könnten? (Mehrfachauswahl)",
    type: "multiple_choice",
    required: false,
    section: "Insulinresistenz-Screening",
    options: [
      { value: "heisshunger", label: "Heißhunger auf Süßes / Kohlenhydrate" },
      { value: "energieabfall", label: "Energieabfall nach Mahlzeiten (Nachmittagstief)" },
      { value: "bauchfett", label: "Übergewicht v.a. am Bauch" },
      { value: "hautveraenderungen", label: "Dunkle Hautverfärbungen (Achseln, Nacken) — Acanthosis nigricans" },
      { value: "pcos", label: "PCOS (Polyzystisches Ovarialsyndrom) — nur Frauen" },
      { value: "keine", label: "Keine dieser Symptome" }
    ]
  },
  {
    id: "D2-004",
    frage: "Haben Sie einen erhöhten Blutdruck?",
    type: "single_choice",
    required: true,
    section: "Metabolisches Syndrom",
    options: [
      { value: "nein", label: "Nein — im Normalbereich" },
      { value: "grenzwertig", label: "Grenzwertig (130-140/85-90)" },
      { value: "ja_behandelt", label: "Ja — in Behandlung (Medikamente)" },
      { value: "ja_unbehandelt", label: "Ja — aber keine Behandlung" },
      { value: "weiss_nicht", label: "Weiß ich nicht" }
    ]
  },
  {
    id: "D2-005",
    frage: "Wurden bei Ihnen erhöhte Blutfettwerte festgestellt? (Cholesterin, Triglyzeride)",
    type: "single_choice",
    required: true,
    section: "Metabolisches Syndrom",
    options: [
      { value: "nein", label: "Nein" },
      { value: "ja_behandelt", label: "Ja — in Behandlung" },
      { value: "ja_unbehandelt", label: "Ja — keine Behandlung" },
      { value: "weiss_nicht", label: "Weiß ich nicht / nie gemessen" }
    ]
  },
  {
    id: "D2-006",
    frage: "Wie ist Ihre Ernährung im Durchschnitt?",
    type: "multiple_choice",
    required: true,
    section: "Ernährung",
    options: [
      { value: "mediterran", label: "Mediterran (viel Gemüse, Olivenöl, Fisch)" },
      { value: "westlich", label: "Westlich (viel Fleisch, Fertigprodukte, Zucker)" },
      { value: "vegetarisch", label: "Vegetarisch / Vegan" },
      { value: "low_carb", label: "Low Carb / Keto" },
      { value: "intervall_fasten", label: "Intervallfasten" },
      { value: "ausgewogen", label: "Ausgewogen / gemischt" },
      { value: "unregelmaeßig", label: "Unregelmäßig / keine feste Ernährungsweise" }
    ]
  },
  {
    id: "D2-007",
    frage: "Trinken Sie täglich ausreichend Wasser?",
    type: "single_choice",
    required: false,
    section: "Ernährung",
    options: [
      { value: "unter1l", label: "Weniger als 1 Liter" },
      { value: "1bis2l", label: "1–2 Liter" },
      { value: "mehr2l", label: "Mehr als 2 Liter" }
    ]
  },
  {
    id: "D2-008",
    frage: "Haben Sie Nahrungsmittelunverträglichkeiten oder -allergien?",
    type: "multiple_choice",
    required: false,
    section: "Ernährung",
    options: [
      { value: "gluten", label: "Gluten / Weizen (Zöliakie oder Sensitivität)" },
      { value: "laktose", label: "Laktose (Milchzucker)" },
      { value: "histamin", label: "Histamin" },
      { value: "fodmap", label: "FODMAP / Fruktose" },
      { value: "nsse", label: "Nüsse" },
      { value: "andere", label: "Andere Unverträglichkeiten" },
      { value: "keine", label: "Keine bekannten Unverträglichkeiten" }
    ]
  },
  // ── Taille (metabolisches Syndrom / viszerales Fett — C. Means, IDF) ──
  {
    id: "D2-010",
    frage: "Bauchumfang (Taille, in cm auf Nabelhöhe gemessen), falls bekannt",
    type: "number",
    unit: "cm",
    required: false,
    section: "Metabolisches Syndrom",
    hint: "Richtwerte erhöht: Frauen ab ~80–88 cm, Männer ab ~94–102 cm."
  },
  // ── Osmotische Symptomtrias → Verdacht neu aufgetretener/entgleister
  //    Diabetes (Red Flag über den globalen Wächter, siehe app/hormon.js) ─
  {
    id: "D2-011",
    frage: "Haben Sie aktuell ungewöhnlich starken Durst, müssen sehr häufig Wasser lassen (auch nachts) UND haben ungewollt abgenommen?",
    type: "yes_no",
    required: false,
    section: "Blutzucker / Insulinresistenz"
  },
  {
    id: "D2-009",
    frage: "Haben Sie aktuelle Laborwerte, die für uns relevant sein könnten?",
    type: "file_upload",
    required: false,
    section: "Laborwerte",
    accepted_types: ["application/pdf", "image/jpeg", "image/png"],
    max_size_mb: 10,
    max_files: 5,
    hint: "Blutbild, HbA1c, Cholesterin, Vitamin D, Ferritin, Schilddrüse, Hormone..."
  }
];

export const HORMONSTATUS_FRAGEN = [
  {
    id: "D3-001",
    frage: "Haben Sie Symptome, die auf eine Schilddrüsenfehlfunktion hindeuten? (Mehrfachauswahl)",
    type: "multiple_choice",
    required: true,
    section: "Schilddrüse",
    options: [
      { value: "muedigkeit_kalt", label: "Ständige Müdigkeit + Kälteempfindlichkeit" },
      { value: "gewicht_zu", label: "Gewichtszunahme trotz normaler Ernährung" },
      { value: "haare_naegel", label: "Haarausfall, brüchige Nägel, trockene Haut" },
      { value: "verstopfung", label: "Verstopfung" },
      { value: "depression_schildd", label: "Depressive Verstimmung, verlangsamtes Denken" },
      { value: "herzrasen_schwitzen", label: "Herzrasen, Schwitzen, Zittern" },
      { value: "gewicht_ab", label: "Gewichtsverlust trotz gutem Appetit" },
      { value: "schlaflosigkeit_unruhe", label: "Schlaflosigkeit, innere Unruhe" },
      { value: "keine", label: "Keine dieser Symptome" }
    ]
  },
  {
    id: "D3-002",
    frage: "Ist Ihre Schilddrüse untersucht worden (TSH, T3, T4)?",
    type: "single_choice",
    required: false,
    section: "Schilddrüse",
    options: [
      { value: "normal", label: "Ja — alles normal" },
      { value: "hypothyreose", label: "Ja — Unterfunktion (Hypothyreose / Hashimoto)" },
      { value: "hyperthyreose", label: "Ja — Überfunktion (Hyperthyreose / Basedow)" },
      { value: "nie", label: "Noch nie untersucht" }
    ]
  },
  {
    id: "D3-003",
    frage: "Leiden Sie unter chronischem Stress?",
    type: "single_choice",
    required: true,
    section: "Cortisol / Stressachse (HPA-Achse)",
    options: [
      { value: "nein", label: "Nein / kaum" },
      { value: "gelegentlich", label: "Gelegentlich" },
      { value: "chronisch", label: "Ja — anhaltend chronischer Stress" },
      { value: "erschoepft", label: "Ja — und ich fühle mich bereits ausgebrannt" }
    ]
  },
  {
    id: "D3-004",
    frage: "Haben Sie Symptome, die auf einen gestörten Cortisol-Haushalt hindeuten? (Mehrfachauswahl)",
    type: "multiple_choice",
    required: false,
    section: "Cortisol / Stressachse",
    options: [
      { value: "morgens_schwer", label: "Morgentief — kaum aus dem Bett / schlimmste Zeit des Tages morgens" },
      { value: "nachmittags_besser", label: "Nachmittags/Abends deutlich besser (umgekehrter Rhythmus)" },
      { value: "salzhunger", label: "Starkes Verlangen nach Salz" },
      { value: "hyperreaktiv", label: "Überempfindlich auf Stress / 'springen' schnell an'" },
      { value: "immunschwach", label: "Häufige Infekte, langsame Erholung" },
      { value: "bauchfett_cortisol", label: "Bauchfett-Zunahme bei Stress" },
      { value: "keine", label: "Keine dieser Symptome" }
    ]
  },
  {
    id: "D3-005",
    frage: "Wie ist Ihr Zyklus? (Nur für Frauen)",
    type: "single_choice",
    required: false,
    section: "Sexualhormone (Frauen)",
    condition: { field: "sd_geschlecht", equals: "f" },
    options: [
      { value: "regelmaessig", label: "Regelmäßig (25–35 Tage)" },
      { value: "unregelmaessig", label: "Unregelmäßig" },
      { value: "stark_schmerzhaft", label: "Stark / schmerzhaft (Dysmenorrhö)" },
      { value: "ausgeblieben", label: "Ausgeblieben (Amenorrhö)" },
      { value: "wechseljahre", label: "Wechseljahre / Post-Menopause" },
      { value: "nicht_relevant", label: "Nicht relevant (Verhütung, Hysterektomie etc.)" }
    ]
  },
  {
    id: "D3-006",
    frage: "Haben Sie Wechseljahresbeschwerden? (Nur für Frauen ab ca. 40 J.)",
    type: "multiple_choice",
    required: false,
    section: "Wechseljahre / Östrogenmangel",
    condition: { field: "sd_geschlecht", equals: "f" },
    options: [
      { value: "hitzewallungen", label: "Hitzewallungen / Nachtschweiß" },
      { value: "schlaf_wechsel", label: "Schlafstörungen" },
      { value: "stimmung_wechsel", label: "Stimmungsschwankungen / Reizbarkeit" },
      { value: "libidoverlust_f", label: "Libidoverlust" },
      { value: "gelenkschmerzen_wechsel", label: "Neue oder schlimmere Gelenkschmerzen" },
      { value: "gewicht_wechsel", label: "Gewichtszunahme v.a. Bauch" },
      { value: "keine", label: "Keine Wechseljahresbeschwerden" }
    ]
  },
  {
    id: "D3-007",
    frage: "Haben Sie Symptome, die auf niedrigen Testosteronspiegel hindeuten könnten? (Nur für Männer)",
    type: "multiple_choice",
    required: false,
    section: "Testosteron (Männer)",
    condition: { field: "sd_geschlecht", equals: "m" },
    options: [
      { value: "libidoverlust_m", label: "Libidoverlust / Erektionsprobleme" },
      { value: "muskelverlust", label: "Muskelverlust, trotz Training" },
      { value: "fettverteilung", label: "Fettverteilung weiblicher (Brust, Hüften)" },
      { value: "stimmung_tief", label: "Anhaltend gedrückte Stimmung, Antriebslosigkeit" },
      { value: "hitzewallungen_m", label: "Hitzewallungen (Andropause)" },
      { value: "keine", label: "Keine dieser Symptome" }
    ]
  },
  // ── Vertiefung Schilddrüse: Autoimmun-Familienanamnese (Hashimoto/Basedow
  //    familiär gehäuft) ─────────────────────────────────────────────
  {
    id: "D3-009",
    frage: "Gibt es in Ihrer Familie Schilddrüsen- oder Autoimmunerkrankungen (z.B. Hashimoto, Basedow)?",
    type: "yes_no",
    required: false,
    section: "Schilddrüse"
  },
  // ── PCOS-Screen (Frauen mit unregelmäßigem/ausbleibendem Zyklus;
  //    Orientierung Rotterdam-Kriterien) ────────────────────────────
  {
    id: "D3-010",
    frage: "Bestehen zusätzlich zu Ihrem unregelmäßigen Zyklus: Akne, vermehrte Körper-/Gesichtsbehaarung oder Gewichtszunahme am Bauch?",
    type: "multiple_choice",
    required: false,
    section: "Sexualhormone (Frauen)",
    condition: { field: "D3-005", equals: "unregelmaessig" },
    options: [
      { value: "akne", label: "Akne / unreine Haut" },
      { value: "hirsutismus", label: "Vermehrte Körper-/Gesichtsbehaarung" },
      { value: "bauchfett", label: "Gewichtszunahme v.a. am Bauch" },
      { value: "haarausfall", label: "Haarausfall am Kopf (männliches Muster)" },
      { value: "keine", label: "Keines davon" }
    ]
  },
  // ── Menopausen-Stadium (Orientierung: M.C. Haver, L. Newson, F. Gersh) ─
  {
    id: "D3-011",
    frage: "Wie ist Ihr aktuelles Menopausen-Stadium?",
    type: "single_choice",
    required: false,
    section: "Wechseljahre / Östrogenmangel",
    condition: { field: "sd_geschlecht", equals: "f" },
    options: [
      { value: "praemenopausal", label: "Zyklus normal, keine Wechseljahres-Zeichen" },
      { value: "perimenopause", label: "Perimenopause — Zyklus wird unregelmäßig, erste Beschwerden" },
      { value: "postmenopause", label: "Postmenopause — seit über 12 Monaten keine Periode" },
      { value: "unklar", label: "Weiß ich nicht genau" }
    ]
  },
  // ── Zyklusbezogenes Training/Beschwerden (Orientierung: Stacy Sims) ──
  {
    id: "D3-012",
    frage: "Verändern sich Beschwerden, Energie oder Leistungsfähigkeit deutlich im Verlauf Ihres Zyklus?",
    type: "single_choice",
    required: false,
    section: "Sexualhormone (Frauen)",
    condition: { field: "sd_geschlecht", equals: "f" },
    options: [
      { value: "stark", label: "Ja, deutlich (z.B. PMS, Energie-/Schmerzschwankungen)" },
      { value: "etwas", label: "Etwas" },
      { value: "nein", label: "Kaum / nicht" }
    ]
  },
  {
    id: "D3-008",
    frage: "Haben Sie aktuelle Hormonstatus-Laborwerte?",
    type: "file_upload",
    required: false,
    section: "Hormonlabor",
    accepted_types: ["application/pdf", "image/jpeg"],
    max_size_mb: 5,
    max_files: 3,
    hint: "TSH, T3/T4, Testosteron, Östradiol, DHEA, Cortisol-Tagesprofil..."
  }
];

export const DARMGESUNDHEIT_FRAGEN = [
  {
    id: "D4-001",
    frage: "Wie oft haben Sie Stuhlgang?",
    type: "single_choice",
    required: true,
    section: "Stuhlfrequenz",
    options: [
      { value: "taeglich_mehrmals", label: "Mehrmals täglich" },
      { value: "taeglich", label: "Einmal täglich" },
      { value: "jede2tage", label: "Alle 2 Tage" },
      { value: "selten", label: "Seltener als alle 2 Tage (Tendenz zur Verstopfung)" },
      { value: "variabel", label: "Sehr variabel — manchmal täglich, manchmal nicht" }
    ]
  },
  {
    id: "D4-002",
    frage: "Wie würden Sie die Konsistenz Ihres Stuhls beschreiben? (Bristol Stool Scale adaptiert)",
    type: "single_choice",
    required: true,
    section: "Stuhlkonsistenz",
    options: [
      { value: "hart_klumpig", label: "Hart und klumpig (Schafe/Nüsse) — Typ 1-2 Bristol" },
      { value: "geformt_normal", label: "Geformt, wie eine Wurst, weich — Typ 3-4 (Ideal)" },
      { value: "weich_fetzig", label: "Weich, fetzig, mit Rändern — Typ 5" },
      { value: "flüssig_matschig", label: "Matschig / flüssig — Typ 6-7 (Tendenz Durchfall)" },
      { value: "wechselnd", label: "Wechselnd — mal hart, mal weich" }
    ]
  },
  {
    id: "D4-003",
    frage: "Haben Sie Bauchbeschwerden im Zusammenhang mit dem Stuhlgang?",
    type: "multiple_choice",
    required: true,
    section: "IBS-Screening (Rome IV)",
    options: [
      { value: "kein", label: "Keine Bauchbeschwerden" },
      { value: "besser_nach_stuhl", label: "Bauchschmerzen bessern sich nach Stuhlgang" },
      { value: "schlechter_nach_stuhl", label: "Bauchschmerzen werden durch Stuhlgang ausgelöst" },
      { value: "blähungen", label: "Blähungen / Aufgeblähtheit" },
      { value: "krämpfe", label: "Krampfartige Bauchschmerzen" },
      { value: "flatulenz", label: "Übermäßige Windbildung" }
    ]
  },
  {
    id: "D4-004",
    frage: "Haben Sie Blut oder Schleim im Stuhl?",
    type: "single_choice",
    required: true,
    section: "Darmgesundheit — Red Flags",
    red_flag_question: true,
    options: [
      { value: "nein", label: "Nein" },
      { value: "schleim", label: "Schleim gelegentlich" },
      { value: "blut_hell", label: "Hellrotes Blut (Blutung beim Abwischen)" },
      { value: "blut_dunkel", label: "Dunkles oder schwarzes Blut im Stuhl ⚠️" }
    ],
    alert_on: ["blut_dunkel"],
    alert_text: "⚠️ Schwarzer Teerstuhl = mögliche obere GI-Blutung. Bitte sofort Arzt aufsuchen."
  },
  {
    id: "D4-005",
    frage: "Haben Sie eine Zöliakie, Glutensensitivität oder reagieren Sie auf Gluten?",
    type: "single_choice",
    required: true,
    section: "Glutenunverträglichkeit",
    options: [
      { value: "nein", label: "Nein — kein Problem mit Gluten" },
      { value: "sensitivitaet", label: "Ja — Glutensensitivität (nicht-zöliakische)" },
      { value: "zoeliaakie", label: "Ja — Zöliakie (diagnostiziert)" },
      { value: "weiss_nicht", label: "Weiß ich nicht" }
    ]
  },
  {
    id: "D4-006",
    frage: "Haben Sie Sodbrennen, saures Aufsteigen oder ein Brennen hinter dem Brustbein?",
    type: "single_choice",
    required: true,
    section: "Oberer GI",
    options: [
      { value: "nein", label: "Nein" },
      { value: "selten", label: "Selten (nach bestimmten Mahlzeiten)" },
      { value: "haeufig", label: "Häufig (mehrmals wöchentlich)" },
      { value: "taeglich", label: "Täglich" }
    ]
  },
  {
    id: "D4-007",
    frage: "Haben Sie in den letzten 6 Monaten Antibiotika eingenommen?",
    type: "single_choice",
    required: false,
    section: "Mikrobiom",
    options: [
      { value: "nein", label: "Nein" },
      { value: "einmal", label: "Einmal" },
      { value: "mehrmals", label: "Mehrfach (2–3x)" },
      { value: "haeufig", label: "Häufig / regelmäßig" }
    ],
    hint: "Antibiotika beeinflussen das Mikrobiom — relevant für Darmtherapie"
  },
  {
    id: "D4-008",
    frage: "Nehmen Sie Probiotika, Präbiotika oder Darmsupplemente?",
    type: "yes_no",
    required: false,
    section: "Mikrobiom"
  },
  // ── Mikrobiom-Diversität (Grundlage: T. Spector / ZOE — „30 Pflanzen pro
  //    Woche"; fermentierte Lebensmittel für Diversität) ───────────────
  {
    id: "D4-009",
    frage: "Wie viele VERSCHIEDENE pflanzliche Lebensmittel (Gemüse, Obst, Hülsenfrüchte, Nüsse, Samen, Vollkorn, Kräuter) essen Sie ungefähr pro Woche?",
    type: "single_choice",
    required: false,
    section: "Mikrobiom",
    hint: "Vielfalt (Ziel ~30/Woche) ist ein starker Marker für Mikrobiom-Diversität.",
    options: [
      { value: "unter10", label: "Weniger als 10 verschiedene" },
      { value: "10_20", label: "10–20 verschiedene" },
      { value: "20_30", label: "20–30 verschiedene" },
      { value: "30plus", label: "30 oder mehr" }
    ]
  },
  {
    id: "D4-010",
    frage: "Wie oft essen Sie fermentierte Lebensmittel (Joghurt, Kefir, Sauerkraut, Kimchi, Miso, Kombucha)?",
    type: "single_choice",
    required: false,
    section: "Mikrobiom",
    options: [
      { value: "regelmaessig", label: "Regelmäßig (fast täglich)" },
      { value: "gelegentlich", label: "Gelegentlich" },
      { value: "nie", label: "Nie / sehr selten" }
    ]
  },
  {
    id: "D4-011",
    frage: "Treten Blähungen v.a. kurz nach dem Essen auf und verstärken sich durch ballaststoffreiche Kost oder Probiotika?",
    type: "yes_no",
    required: false,
    section: "Mikrobiom",
    hint: "Screening-Hinweis auf eine Dünndarm-Fehlbesiedlung (SIBO)."
  },
  {
    id: "D4-013",
    frage: "Verschlechtern sich Ihre Darmbeschwerden deutlich in Stressphasen?",
    type: "single_choice",
    required: false,
    section: "Mikrobiom",
    hint: "Darm-Hirn-Achse (Orientierung: E. Mayer).",
    options: [
      { value: "stark", label: "Ja, deutlich" },
      { value: "etwas", label: "Etwas" },
      { value: "nein", label: "Nein / kaum" }
    ]
  },
  // ── IBD-/organische Alarmzeichen (über den globalen Wächter, alert_on) ─
  {
    id: "D4-012",
    frage: "Haben Sie eines dieser Warnzeichen? (Mehrfachauswahl)",
    type: "multiple_choice",
    required: false,
    section: "Darmgesundheit — Red Flags",
    options: [
      { value: "naechtlicher_durchfall", label: "Durchfall, der Sie nachts aufweckt" },
      { value: "gewichtsverlust", label: "Ungewollter Gewichtsverlust" },
      { value: "fieber_durchfall", label: "Wiederkehrendes Fieber mit Durchfall" },
      { value: "keine", label: "Keines davon" }
    ],
    hint: "Mögliche Hinweise auf eine entzündliche/organische Darmerkrankung — werden als dringender Abklärungshinweis erfasst (siehe app/darm.js)."
  }
];

// ── Bereichs-Gates (Baum-Logik: nur bei „Ja" öffnen sich die Detailfragen) ──
export const HORMON_GATE = {
  id: "HOR-GATE",
  frage: "Möchten Sie den Bereich Hormone & Stoffwechsel ausfüllen? (Schilddrüse, Nebenniere/Stress, Zyklus/Wechseljahre, Testosteron, Blutzucker/Gewicht) — bei „Nein“ überspringen wir diesen Teil.",
  type: "yes_no",
  required: false,
  section: "Hormone & Stoffwechsel",
};
export const IMMUN_GATE = {
  id: "IMM-GATE",
  frage: "Möchten Sie Angaben zu Allergien, Entzündungen/Autoimmunthemen und Infektanfälligkeit machen? — bei „Nein“ überspringen wir diesen Teil.",
  type: "yes_no",
  required: false,
  section: "Immunsystem & Entzündung",
};
export const DARM_GATE = {
  id: "DARM-GATE",
  frage: "Möchten Sie Angaben zu Verdauung & Darm machen (Beschwerden, Stuhlgang, Unverträglichkeiten, Mikrobiom)? — bei „Nein“ überspringen wir diesen Teil.",
  type: "yes_no",
  required: false,
  section: "Darmgesundheit & Mikrobiom",
};

// ── IMMUNSYSTEM & ENTZÜNDUNG (Tiefenanalyse) ─────────────────────────────
// Orientierung: „stille Entzündung"/Inflammaging (P. Attia; funktionelle
// Medizin M. Hyman); Atopie & Autoimmunität. Speist app/immun.js.
export const IMMUN_FRAGEN = [
  {
    id: "IMM-001",
    frage: "Haben Sie Allergien? (Mehrfachauswahl)",
    type: "multiple_choice",
    required: false,
    section: "Allergie / Atopie",
    options: [
      { value: "heuschnupfen", label: "Heuschnupfen / allergischer Schnupfen" },
      { value: "asthma", label: "Allergisches Asthma" },
      { value: "neurodermitis", label: "Neurodermitis / atopisches Ekzem" },
      { value: "nahrungsmittel", label: "Nahrungsmittelallergie" },
      { value: "keine", label: "Keine bekannten Allergien" }
    ]
  },
  {
    id: "IMM-002",
    frage: "Haben Sie eines dieser anhaltenden oder wiederkehrenden Zeichen? (Mehrfachauswahl)",
    type: "multiple_choice",
    required: false,
    section: "Entzündung / Autoimmunität",
    options: [
      { value: "geschwollene_gelenke", label: "Geschwollene / entzündete Gelenke" },
      { value: "hautausschlaege", label: "Wiederkehrende Hautausschläge" },
      { value: "wiederkehrendes_fieber", label: "Wiederkehrendes Fieber ohne klaren Infekt" },
      { value: "chronische_muedigkeit", label: "Anhaltende, unerklärliche Erschöpfung" },
      { value: "trockene_augen_mund", label: "Anhaltend trockene Augen und trockener Mund" },
      { value: "keine", label: "Keines davon" }
    ]
  },
  {
    id: "IMM-003",
    frage: "Wie oft haben Sie erkältungsartige Infekte pro Jahr?",
    type: "single_choice",
    required: false,
    section: "Infektabwehr",
    options: [
      { value: "0_2", label: "Selten (0–2 pro Jahr)" },
      { value: "3_4", label: "Gelegentlich (3–4)" },
      { value: "5plus", label: "Häufig (5 oder mehr)" }
    ]
  }
];
