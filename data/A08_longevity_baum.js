/**
 * LINDEBERGS OS — Adaptiver Fragenbaum
 * Modul A08: LONGEVITY, GESUNDHEITSOPTIMIERUNG & PRÄVENTION
 *
 * Inspirationsquellen:
 *  — David Sinclair (Harvard): Epigenetik, NAD+/Sirtuine, Seneszenz, Autophagie
 *  — Peter Attia (MD): Zone 2, VO2max, Muskelmasse, CGM, ApoB, Longevity Medicine
 *  — Andrew Huberman (Stanford): Schlaf, Licht, Dopamin, HRV, ANS-Regulation
 *  — Gary Brecka: Methylierung, Homocystein, MTHFR, Genetische Nährstoffdefizite
 *  — Dietrich Klinghardt (MD): Schwermetalle, EMF, Parasiten, Neurotoxine, Biophotonen
 *  — Matthew Walker (UCB): Schlafarchitektur, Alzheimer, Immunfunktion
 *  — Mark Hyman (MD): Functional Medicine, Mitochondrien, Entzündung
 *  — Terry Wahls (MD): Mitochondriale Ernährung, MS-Remission
 *  — Dale Bredesen (MD): ReCODE-Protokoll Alzheimer-Prävention
 *
 * DETERMINISTISCH: Gleiche Eingabe → immer gleiche Ausgabe.
 */

const LONGEVITY_BAUM = {

  // ════════════════════════════════════════════════════════════════════
  // LONGEVITY & ALTERSMEDIZIN (Sinclair / Attia)
  // ════════════════════════════════════════════════════════════════════

  LONGEVITY: {
    id: "LONGEVITY",
    name: "Longevity & biologisches Alter (Sinclair / Attia / Hyman)",
    gruppe: "Gesundheitsoptimierung",
    ziel: "Biologisches Alter reduzieren, Healthspan maximieren, Krankheitsprävention",
    quellen: ["David Sinclair - Lifespan 2019", "Peter Attia - Outlive 2023", "Mark Hyman - Young Forever 2023"],
    screening: [
      { id: "LON-001", frage: "Wie alt fühlen Sie sich im Vergleich zu Ihrem tatsächlichen Alter?", type: "single_choice",
        options: ["deutlich jünger", "etwas jünger", "dem Alter entsprechend", "etwas älter", "deutlich älter"] },
      { id: "LON-002", frage: "Haben Sie Zugang zu oder Interesse an epigenetischen Alters-Tests (Horvath-Clock, DunedinPACE)?", type: "yes_no" },
      { id: "LON-003", frage: "Welche Longevity-Interventionen praktizieren Sie bereits?", type: "multiple_choice",
        options: ["Intervallfasten (IF / TRE)", "Kalorienreduktion", "Metformin", "NMN/NR-Supplementierung", "Rapamycin", "kalte Exposition (Eisbad, Kryokammer)", "Saunagänge", "keines davon"] },
      { id: "LON-004", frage: "Wie ist Ihre Muskelmasse einzuschätzen?", type: "single_choice",
        options: ["athletisch / muskulös", "durchschnittlich", "gering", "Muskelabbau bemerkt (Sarkopenie?)"] },
      { id: "LON-005", frage: "VO2max bekannt (Ausdauerkapazität)?", type: "single_choice",
        options: ["ja, gemessen", "geschätzt: gut", "geschätzt: mittel", "geschätzt: niedrig", "unbekannt"] }
    ],
    verzweigung: [
      { bedingung: { feld: "biologisch_aelter_gefuehlt", op: "==", wert: true },
        cdss_gewicht: { beschleunigtes_altern: +3, inflammaging: +3 },
        fragen: [
          { id: "LON-B-001", frage: "Chronische Entzündungsmarker bekannt (CRP, IL-6, hsCRP)?", type: "yes_no" },
          { id: "LON-B-002", frage: "Schlafdauer durchschnittlich wie viele Stunden?", type: "single_choice",
            options: ["<5h", "5-6h", "7-8h", ">9h"] },
          { id: "LON-B-003", frage: "Stressbelastung chronisch hoch?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "sarkopenie_verdacht", op: "==", wert: true },
        cdss_gewicht: { sarkopenie: +4, testosteron_mangel: +2, wachstumshormon_mangel: +2 },
        fragen: [
          { id: "LON-C-001", frage: "Wie viel Krafttraining machen Sie pro Woche?", type: "single_choice",
            options: ["keins", "1x", "2-3x", "4+x"] },
          { id: "LON-C-002", frage: "Proteinaufnahme geschätzt (g/kg Körpergewicht)?", type: "single_choice",
            options: ["<0.8g/kg", "0.8-1.2g/kg", "1.2-1.6g/kg", ">1.6g/kg (Attia-Empfehlung)"] }
        ]
      },
      { bedingung: { feld: "if_fasten", op: "includes", wert: "Intervallfasten (IF / TRE)" },
        cdss_gewicht: { autophagie_aktivierung: +2 },
        fragen: [
          { id: "LON-D-001", frage: "Welches Fastenschema? (16:8, 18:6, 5:2, OMAD, verlängertes Fasten)", type: "single_choice",
            options: ["16:8", "18:6", "OMAD (23:1)", "5:2 (2 Fastentage/Woche)", "Mehrtagefasten", "anderes"] }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════
  // ENERGIE & MITOCHONDRIEN (Hyman / Wahls / Attia Zone 2)
  // ════════════════════════════════════════════════════════════════════

  ENERGIE_MITO: {
    id: "ENERGIE_MITO",
    name: "Energie & Mitochondriale Gesundheit (Hyman / Wahls / Attia)",
    gruppe: "Gesundheitsoptimierung",
    ziel: "Mitochondriale Funktion optimieren, ATP-Produktion steigern",
    quellen: ["Mark Hyman - The UltraMind Solution", "Terry Wahls - The Wahls Protocol 2014", "Peter Attia Zone 2"],
    screening: [
      { id: "MIT-001", frage: "Energieniveau tagsüber (VAS 0-10)?", type: "vas_scale" },
      { id: "MIT-002", frage: "Post-Exertional Malaise: Erschöpfung nach körperlicher Anstrengung (ME/CFS-Symptom)?", type: "yes_no" },
      { id: "MIT-003", frage: "Muskelschwäche oder rasches Ermüden bei normalen Aktivitäten?", type: "yes_no" },
      { id: "MIT-004", frage: "Wie trainieren Sie? (Ausdauer-Zone)", type: "single_choice",
        options: ["kein Training", "hauptsächlich hochintensiv (HIIT)", "gemischt", "hauptsächlich Zone 2 (Nasenatemtraining)", "nur Krafttraining"] },
      { id: "MIT-005", frage: "Laborwerte bekannt: CoQ10, Carnitin, B-Vitamine?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "energie_niedrig", op: "<=", wert: 4 },
        cdss_gewicht: { mitochondriale_dysfunktion: +3, schilddruese: +2, eisenmangel: +2 },
        fragen: [
          { id: "MIT-B-001", frage: "Ferritin, Eisen, B12, Folat, Vitamin D bekannt?", type: "yes_no" },
          { id: "MIT-B-002", frage: "CoQ10 oder Magnesium supplementiert?", type: "yes_no" },
          { id: "MIT-B-003", frage: "Ernährung reich an Mitochondrien-Nährstoffen (Kreuzblütler, Blattgemüse, Omega-3)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "pem_symptome", op: "==", wert: true },
        cdss_gewicht: { mecfs: +4, long_covid: +3 },
        fragen: [
          { id: "MIT-C-001", frage: "Begann die Erschöpfung nach einer Infektion (COVID, EBV, Borreliose)?", type: "yes_no" },
          { id: "MIT-C-002", frage: "Wie lange besteht die Erschöpfung schon?", type: "single_choice",
            options: ["<3 Monate", "3-6 Monate", "6-12 Monate", ">1 Jahr"] }
        ]
      },
      { bedingung: { feld: "kein_zone2_training", op: "==", wert: true },
        fragen: [
          { id: "MIT-D-001", frage: "Interesse an Zone-2-Aufbau (Fahrrad, Gehen, Schwimmen bei Nasenatemtempo)?", type: "yes_no" }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════
  // SCHLAF & ZIRKADIANE RHYTHMIK (Huberman / Walker)
  // ════════════════════════════════════════════════════════════════════

  SCHLAF_OPTIMIERUNG: {
    id: "SCHLAF_OPTIMIERUNG",
    name: "Schlafoptimierung & Zirkadiane Gesundheit (Huberman / Walker)",
    gruppe: "Gesundheitsoptimierung",
    ziel: "Schlafqualität, zirkadiane Synchronisation, Amyloid-Clearing (Walker)",
    quellen: ["Matthew Walker - Why We Sleep 2017", "Andrew Huberman - Huberman Lab Podcast, Sleep Toolkit"],
    screening: [
      { id: "SLO-001", frage: "Morgenlicht-Exposition: Kommen Sie täglich binnen 60 min nach dem Aufwachen an die Sonne/Tageslicht?", type: "yes_no" },
      { id: "SLO-002", frage: "Smartphone/Bildschirm in letzter Stunde vor dem Schlafen?", type: "yes_no" },
      { id: "SLO-003", frage: "Schlaftemperatur im Zimmer?", type: "single_choice",
        options: ["kühl (16-19°C, ideal)", "normal (20-22°C)", "warm (>23°C)"] },
      { id: "SLO-004", frage: "Alkohol oder Cannabis vor dem Schlafen?", type: "yes_no" },
      { id: "SLO-005", frage: "Koffein nach 14 Uhr?", type: "yes_no" },
      { id: "SLO-006", frage: "Schlafritual (Abendroutine, Entspannung)?", type: "yes_no" },
      { id: "SLO-007", frage: "Schlaftracking-Gerät im Einsatz? (Oura, Whoop, Apple Watch)", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "kein_morgenlicht", op: "==", wert: true },
        fragen: [{ id: "SLO-B-001", frage: "Haben Sie eine SAD-Lampe (10.000 Lux) oder Sonnenaufgangs-Wecker?", type: "yes_no" }] },
      { bedingung: { feld: "alkohol_schlaf", op: "==", wert: true },
        fragen: [{ id: "SLO-C-001", frage: "Alkohol als Einschlafhilfe? (unterbricht REM-Schlaf - Walker)", type: "yes_no" }] },
      { bedingung: { feld: "oura_whoop_tracking", op: "==", wert: true },
        fragen: [
          { id: "SLO-D-001", frage: "Durchschnittlicher HRV-Wert morgens?", type: "textarea" },
          { id: "SLO-D-002", frage: "REM-Schlaf-Anteil laut Tracker (optimal >20%)?", type: "single_choice",
            options: [">25%", "20-25%", "15-20%", "<15% (kritisch)"] }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════
  // BURNOUT & STRESSMANAGEMENT (Huberman / HRV / ANS)
  // ════════════════════════════════════════════════════════════════════

  BURNOUT_STRESS: {
    id: "BURNOUT_STRESS",
    name: "Burnout, Stressresilienz & ANS-Regulation (Huberman / HRV)",
    gruppe: "Gesundheitsoptimierung",
    ziel: "Autonomes Nervensystem balancieren, Cortisol regulieren, Resilienz aufbauen",
    quellen: ["Andrew Huberman - Stress Tools Podcast", "Bessel van der Kolk - The Body Keeps the Score"],
    screening: [
      { id: "BUS-001", frage: "Burnout-Screening (MBI adaptiert): Emotionale Erschöpfung?", type: "single_choice",
        options: ["kaum", "gelegentlich", "regelmäßig", "fast immer", "vollständig ausgebrannt"] },
      { id: "BUS-002", frage: "Depersonalisation: Zynismus, innere Distanz zur Arbeit/Menschen?", type: "single_choice",
        options: ["nicht vorhanden", "gelegentlich", "regelmäßig", "stark"] },
      { id: "BUS-003", frage: "Herzkohärenz/HRV gemessen?", type: "yes_no" },
      { id: "BUS-004", frage: "Welche Stressbewältigungsstrategien nutzen Sie?", type: "multiple_choice",
        options: ["Atemübungen (Physiologisches Seufzen, Box Breathing)", "Meditation/Mindfulness", "Sport", "Natur", "Soziale Verbindung", "Psychotherapie", "Keine gezielten Strategien"] },
      { id: "BUS-005", frage: "Trauma-Hintergrund (traumatische Erfahrungen in Kindheit oder Erwachsenenalter)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "burnout_stark", op: "==", wert: true },
        cdss_gewicht: { burnout_vollbild: +4, depressive_episode: +3, hpa_erschoepfung: +3 },
        fragen: [
          { id: "BUS-B-001", frage: "Arbeitsstunden pro Woche? Urlaubstage letztes Jahr?", type: "textarea" },
          { id: "BUS-B-002", frage: "Cortisol-Tagesprofil bekannt (Speichel-Cortisol)?", type: "yes_no" },
          { id: "BUS-B-003", frage: "Suizidgedanken (optional — wird separat bewertet)?", type: "yes_no", therapist_only: true }
        ]
      },
      { bedingung: { feld: "trauma_hintergrund", op: "==", wert: true },
        cdss_gewicht: { ptbs: +3, komplexe_ptbs: +2 },
        fragen: [
          { id: "BUS-C-001", frage: "Flashbacks, Albträume, Hypervigilanz?", type: "yes_no" },
          { id: "BUS-C-002", frage: "Sind Sie in psychologischer Behandlung / EMDR?", type: "yes_no" }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════
  // KÖRPERZUSAMMENSETZUNG & STOFFWECHSEL (Attia / Brecka)
  // ════════════════════════════════════════════════════════════════════

  KOERPER_METABOLISMUS: {
    id: "KOERPER_METABOLISMUS",
    name: "Körperzusammensetzung & Metabolismus (Attia / Brecka / Hyman)",
    gruppe: "Gesundheitsoptimierung",
    ziel: "Insulinsensitivität, Muskelmasse, Körperfettverteilung, ApoB optimieren",
    quellen: ["Peter Attia - Outlive 2023", "Gary Brecka - Methylation & Gene Expression", "Mark Hyman - Eat Fat Get Thin"],
    screening: [
      { id: "KME-001", frage: "Bauchfett / viszerales Fett (Bauchumfang)?", type: "single_choice",
        options: ["Männer <94cm / Frauen <80cm (gut)", "Männer 94-102cm / Frauen 80-88cm (erhöht)", "Männer >102cm / Frauen >88cm (hoch)"] },
      { id: "KME-002", frage: "ApoB-Wert bekannt (kardiovaskulärer Risikomarker nach Attia)?", type: "yes_no" },
      { id: "KME-003", frage: "CGM (kontinuierliches Glukose-Monitoring) verwendet oder HbA1c bekannt?", type: "yes_no" },
      { id: "KME-004", frage: "Fastenblutzucker bekannt?", type: "single_choice",
        options: ["<90 mg/dL (optimal)", "90-100 mg/dL (gut)", "100-125 mg/dL (Prädiabetes)", ">125 mg/dL (Diabetes)", "unbekannt"] },
      { id: "KME-005", frage: "Ernährungsstrategie?", type: "single_choice",
        options: ["keine gezielt", "ketogen / low-carb", "Mediterranean", "vegan/vegetarisch", "Paleo", "Carnivore", "FODMAP", "Zeit-restringiert (IF)"] }
    ],
    verzweigung: [
      { bedingung: { feld: "viszerales_fett_hoch", op: "==", wert: true },
        cdss_gewicht: { metabolisches_syndrom: +4, insulinresistenz: +3, apob_risiko: +2 },
        fragen: [
          { id: "KME-B-001", frage: "Blutfette bekannt (LDL, HDL, Triglyzeride)?", type: "yes_no" },
          { id: "KME-B-002", frage: "Hypertonie bekannt oder gemessen?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "hba1c_pdm", op: "==", wert: true },
        cdss_gewicht: { praediabetes: +4, insulinresistenz: +3 },
        fragen: [
          { id: "KME-C-001", frage: "Heißhunger auf Süßes, besonders am Nachmittag?", type: "yes_no" },
          { id: "KME-C-002", frage: "Energieabfall nach Kohlenhydratmahlzeiten (Postprandiale Müdigkeit)?", type: "yes_no" }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════
  // ERNÄHRUNG & SUPPLEMENTIERUNG (Brecka / Klinghardt / Attia)
  // ════════════════════════════════════════════════════════════════════

  ERNAEHRUNG_SUPPL: {
    id: "ERNAEHRUNG_SUPPL",
    name: "Ernährung, Supplementierung & Methylierung (Brecka / Hyman / Attia)",
    gruppe: "Gesundheitsoptimierung",
    ziel: "Epigenetische Optimierung, Methylierungsstatus, Mikronährstoffsättigungsgrad",
    quellen: ["Gary Brecka - 10X Health System, MTHFR & Methylierung", "Mark Hyman - Functional Medicine Nutrition"],
    screening: [
      { id: "ERN-001", frage: "Homocystein bekannt (Methylierungsmarker, Brecka)?", type: "yes_no" },
      { id: "ERN-002", frage: "MTHFR-Gentest bekannt?", type: "yes_no" },
      { id: "ERN-003", frage: "Welche Supplemente nehmen Sie?", type: "multiple_choice",
        options: ["Omega-3 (EPA/DHA)", "Vitamin D3 + K2", "Magnesium", "B-Komplex (aktiv methyliert)", "Zink", "NAC", "NMN/NR", "CoQ10 / Ubiquinol", "Collagen", "Probiotika", "Kreatin", "keine"] },
      { id: "ERN-004", frage: "Vitamin D-Spiegel bekannt?", type: "single_choice",
        options: [">60 ng/mL (optimal nach Hyman)", "40-60 ng/mL (gut)", "20-40 ng/mL (suboptimal)", "<20 ng/mL (Mangel)", "unbekannt"] },
      { id: "ERN-005", frage: "Omega-3-Index bekannt (EPA+DHA als % der RBC-Fettsäuren)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "mthfr_bekannt", op: "==", wert: true },
        fragen: [
          { id: "ERN-B-001", frage: "Welches MTHFR-Variante? (C677T / A1298C / compound heterozygot)", type: "single_choice",
            options: ["C677T homozygot", "A1298C homozygot", "compound heterozygot", "eine Kopie (heterozygot)", "Wildtyp (keine Variante)", "unbekannt"] },
          { id: "ERN-B-002", frage: "Nehmen Sie methyliertes B12 (Methylcobalamin) + Methylfolat?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "homozystein_erhoht", op: "==", wert: true },
        cdss_gewicht: { methylierungsdefizit: +4, kardiovaskulaeres_risiko: +3, demenz_risiko: +2 },
        fragen: [
          { id: "ERN-C-001", frage: "Homocystein-Wert?", type: "textarea" }
        ]
      },
      { bedingung: { feld: "vitamin_d_mangel", op: "==", wert: true },
        cdss_gewicht: { vit_d_mangel: +4 },
        fragen: [
          { id: "ERN-D-001", frage: "Tägliche Sonnenexposition und Lichtskintherapie?", type: "yes_no" },
          { id: "ERN-D-002", frage: "Körpergewicht (D3-Dosierung gewichtsabhängig)?", type: "textarea" }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════
  // SPORT & PERFORMANCE
  // ════════════════════════════════════════════════════════════════════

  SPORT_PERFORMANCE: {
    id: "SPORT_PERFORMANCE",
    name: "Sportliches Ziel & Performance-Optimierung",
    gruppe: "Gesundheitsoptimierung",
    ziel: "Sportziel-spezifische Anamnese und Optimierungsplan",
    screening: [
      { id: "SPO-001", frage: "Was ist Ihr konkretes sportliches Ziel?", type: "single_choice",
        options: ["Allgemeine Fitness / Gesundheit", "Gewichtsverlust + Körperzusammensetzung", "Ausdauer: Marathon/Halbmarathon/Triathlon", "Ausdauer: Radrennen / Sportlich Radfahren", "Kraft: Muskelaufbau / Bodybuilding", "Kraft: Functional Fitness / CrossFit", "Sport-Prävention (Skifahren, Tennis, Golf...)", "Kampfsport / Martial Arts", "Mannschaftssport (Fußball, Basketball...)", "Wiederherstellung nach Verletzung"] },
      { id: "SPO-002", frage: "Welchen Zeithorizont haben Sie für Ihr Ziel?", type: "single_choice",
        options: ["<3 Monate", "3-6 Monate", "6-12 Monate", ">1 Jahr", "dauerhafter Lebensstil"] },
      { id: "SPO-003", frage: "Wie trainieren Sie aktuell?", type: "textarea",
        placeholder: "z.B. 3x Kraft, 2x Laufen, 1x Yoga — oder gar nicht" },
      { id: "SPO-004", frage: "Gibt es eine konkrete Veranstaltung / ein Datum?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "ziel_ausdauer", op: "==", wert: true },
        fragen: [
          { id: "SPO-B-001", frage: "Aktuelle Trainingswoche (Kilometer/Stunden)?", type: "textarea" },
          { id: "SPO-B-002", frage: "VO2max bekannt oder geschätzt?", type: "single_choice",
            options: ["ja (Wert: _)", "<35 (unter Durchschnitt)", "35-45 (Durchschnitt)", "45-55 (gut)", ">55 (sehr gut/athletisch)", "unbekannt"] },
          { id: "SPO-B-003", frage: "Welche Verletzungen haben Sie bei Ihrem Sport bisher gehabt?", type: "textarea" }
        ]
      },
      { bedingung: { feld: "ziel_ski_tennis_golf", op: "==", wert: true },
        fragen: [
          { id: "SPO-C-001", frage: "Sportspezifische Beschwerde? (Golferellbogen, Tennisellbogen, Skiknie)", type: "textarea" },
          { id: "SPO-C-002", frage: "Wie viele Wochen bis zur Saison / zum nächsten Einsatz?", type: "textarea" }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════
  // DETOX & TOXINE (Klinghardt)
  // ════════════════════════════════════════════════════════════════════

  DETOX_TOXINE: {
    id: "DETOX_TOXINE",
    name: "Toxine, Schwermetalle & Umweltbelastungen (Klinghardt / Pizzorno)",
    gruppe: "Gesundheitsoptimierung",
    ziel: "Toxin-Last identifizieren, Ausleitung unterstützen, Störfelder eliminieren",
    quellen: ["Dietrich Klinghardt MD - Neurotoxin-Protokoll, ART", "Joseph Pizzorno - Textbook of Natural Medicine", "Bill Walsh - Nutrient Power"],
    screening: [
      { id: "DET-001", frage: "Metallzahnfüllungen (Amalgam) vorhanden?", type: "yes_no" },
      { id: "DET-002", frage: "Berufliche oder Hobby-Exposition gegenüber Chemikalien, Lösungsmitteln, Metallen?", type: "yes_no" },
      { id: "DET-003", frage: "Wohnort nahe Industrie, stark befahrenen Straßen, Hochspannungsleitungen?", type: "yes_no" },
      { id: "DET-004", frage: "WLAN-Router im Schlafzimmer oder Handy am Bett?", type: "yes_no" },
      { id: "DET-005", frage: "Schimmelpilzbelastung im Wohn- oder Arbeitsumfeld?", type: "yes_no" },
      { id: "DET-006", frage: "Schwermetall-Test gemacht (Urin, Vollblut, Haare)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "amalgam_vorhanden", op: "==", wert: true },
        cdss_gewicht: { quecksilberbelastung: +3 },
        fragen: [
          { id: "DET-B-001", frage: "Gedächtnis-, Konzentrations- oder Stimmungsprobleme?", type: "yes_no" },
          { id: "DET-B-002", frage: "Amalgam saniert oder geplant?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "schimmel_exposition", op: "==", wert: true },
        cdss_gewicht: { cirs_biotoxin_krankheit: +4, mycotoxin_belastung: +3 },
        fragen: [
          { id: "DET-C-001", frage: "Symptome: Fatigue, Hirnneubel, Gelenksschmerzen, Atemwegsprobleme im Gebäude?", type: "yes_no" },
          { id: "DET-C-002", frage: "MSH oder TGF-beta1 bekannt (CIRS-Marker nach Shoemaker)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "emf_belastung", op: "==", wert: true },
        cdss_gewicht: { emf_hypersensitivitaet: +2 },
        fragen: [
          { id: "DET-D-001", frage: "Schlaf verbessert sich bei Abschalten von WLAN/Handy?", type: "yes_no" }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════
  // PRÄVENTION & FRÜHERKENNUNG
  // ════════════════════════════════════════════════════════════════════

  PRAEVENTION: {
    id: "PRAEVENTION",
    name: "Prävention & Vorsorge-Screening",
    gruppe: "Gesundheitsoptimierung",
    ziel: "Krebsprävention, kardiovaskuläre Prävention, Demenzprävention, Knochengesundheit",
    quellen: ["Peter Attia - Outlive: Die 4 Todesreiter", "Dale Bredesen - The End of Alzheimer's", "S3-Leitlinie Früherkennung AWMF"],
    screening: [
      { id: "PRÄ-001", frage: "Welche Vorsorge-Untersuchungen haben Sie zuletzt durchführen lassen?", type: "multiple_choice",
        options: ["Koloskopie (Darmspiegelung)", "Mammographie", "Zervix-Abstrich (PAP)", "Hautkrebs-Screening", "PSA (Prostata)", "Herzecho / EKG Belastung", "Knochendichtemessung (DXA)", "Ganzkörper-MRT", "LDCT Lunge (Raucher)", "Augenarzt", "keine in letzten 2J"] },
      { id: "PRÄ-002", frage: "Blutdruck bekannt?", type: "single_choice",
        options: ["<120/80 (optimal)", "120-130/80 (normal)", "130-140/80-90 (erhöht)", ">140/90 (Hypertonie)", "unbekannt"] },
      { id: "PRÄ-003", frage: "Familiäre Krebserkrankungen?", type: "multiple_choice",
        options: ["Brust-/Eierstockkrebs (BRCA?)", "Darmkrebs / Polypen", "Prostatakrebs", "Pankreaskrebs", "Magenkrebs", "Hautkrebs (Melanom)", "keine bekannt"] },
      { id: "PRÄ-004", frage: "DEXA-Scan (Körperzusammensetzung / Knochendichte) gemacht?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "familiarer_krebs_brca", op: "==", wert: true },
        cdss_gewicht: { brca_risiko: +4 },
        fragen: [
          { id: "PRÄ-B-001", frage: "Genetisches Beratungsgespräch / BRCA-Test gemacht?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "alter", op: ">=", wert: 45 },
        fragen: [
          { id: "PRÄ-C-001", frage: "LDL, ApoB, Lp(a) bekannt (Attia: Prävention KHK)?", type: "yes_no" },
          { id: "PRÄ-C-002", frage: "Koronare Kalzifizierung (CAC-Score) bekannt?", type: "yes_no" }
        ]
      }
    ]
  },

  // ════════════════════════════════════════════════════════════════════
  // KOGNITION & DEMENZPRÄVENTION (Bredesen / Huberman)
  // ════════════════════════════════════════════════════════════════════

  KOGNITION_BRAIN: {
    id: "KOGNITION_BRAIN",
    name: "Kognition & Gehirngesundheit (Bredesen ReCODE / Huberman)",
    gruppe: "Gesundheitsoptimierung",
    ziel: "Kognitive Leistung schützen und fördern, Alzheimer-Risikofaktoren identifizieren",
    quellen: ["Dale Bredesen - The End of Alzheimer's 2017, ReCODE 2.0", "Andrew Huberman - Neuroplasticity & Cognitive Performance"],
    screening: [
      { id: "KOG-001", frage: "Konzentrations- oder Gedächtnisprobleme im Alltag?", type: "single_choice",
        options: ["keine", "leichte (vergesse Dinge gelegentlich)", "moderate (stört Alltag)", "ausgeprägte (stört Beruf/Familie)"] },
      { id: "KOG-002", frage: "Brain Fog — mentale Unschärfe, Watte im Kopf?", type: "yes_no" },
      { id: "KOG-003", frage: "APOE4-Genotyp bekannt (Alzheimer-Risikomarker)?", type: "yes_no" },
      { id: "KOG-004", frage: "Regelmäßige neue Herausforderungen für das Gehirn (Sprachen, Musik, Schach)?", type: "yes_no" },
      { id: "KOG-005", frage: "Soziale Aktivität und menschliche Verbindung?", type: "single_choice",
        options: ["sehr aktiv sozial", "moderate soziale Kontakte", "wenig sozial", "stark isoliert (Demenzrisiko)"] }
    ],
    verzweigung: [
      { bedingung: { feld: "brain_fog", op: "==", wert: true },
        cdss_gewicht: { mci_verdacht: +2, metabolisches_brain_fog: +3 },
        fragen: [
          { id: "KOG-B-001", frage: "Schlaf, Schilddrüse, Blutzucker, Vitamine geprüft?", type: "yes_no" },
          { id: "KOG-B-002", frage: "Bredesen-Protokoll: CRP, Homocystein, Insulin nüchtern bekannt?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "apoe4_positiv", op: "==", wert: true },
        cdss_gewicht: { apoe4_risiko: +4 },
        fragen: [
          { id: "KOG-C-001", frage: "Omega-3-Supplementierung (DHA besonders wichtig bei APOE4)?", type: "yes_no" },
          { id: "KOG-C-002", frage: "Schlafqualität (Amyloid-Clearing nur im Schlaf)?", type: "single_choice",
            options: ["gut (7-9h, tief)", "moderat", "schlecht (<6h oder fragmentiert)"] }
        ]
      }
    ]
  }

};

// ════════════════════════════════════════════════════════════════════════
// LONGEVITY-INDEX
// ════════════════════════════════════════════════════════════════════════

const LONGEVITY_INDEX = {
  longevity: "LONGEVITY",
  energie_mito: "ENERGIE_MITO",
  schlaf_optimierung: "SCHLAF_OPTIMIERUNG",
  burnout_stress: "BURNOUT_STRESS",
  koerper_metabolismus: "KOERPER_METABOLISMUS",
  ernaehrung_suppl: "ERNAEHRUNG_SUPPL",
  sport_performance: "SPORT_PERFORMANCE",
  detox_toxine: "DETOX_TOXINE",
  praevention: "PRAEVENTION",
  kognition_brain: "KOGNITION_BRAIN"
};

export { LONGEVITY_BAUM, LONGEVITY_INDEX };
