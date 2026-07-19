/**
 * LINDEBERGS OS — Adaptiver Fragenbaum
 * Modul A07: SYSTEMISCHE MODULE (Organe & Körpersysteme)
 * ES-Module-Kopie — Inhalt 1:1 identisch zur kanonischen Quelle.
 *
 * Struktur identisch zu A06 (deterministisch, regelbasiert).
 * Quellen: Harrison's Principles, Greenberg's Clinical Neurology,
 * S3-Leitlinien Deutschland (AWMF), ESC/ESH Leitlinien.
 */

export const SYSTEMISCHE_BAUM = {

  HERZ_KARDIO: {
    id: "HERZ_KARDIO",
    name: "Herz & Kardiovaskuläres System",
    gruppe: "Kardiovaskulär",
    icd10: ["I20", "I25", "I42", "I10"],
    cdss_modul: "S01_herz_kardio",
    screening: [
      { id: "KAR-001", frage: "Brustschmerz, Engegefühl oder Druck in der Brust?", type: "yes_no" },
      { id: "KAR-002", frage: "Atemnot bei Belastung oder im Liegen?", type: "yes_no" },
      { id: "KAR-003", frage: "Herzklopfen, Herzrasen oder Stolpern des Herzens?", type: "yes_no" },
      { id: "KAR-004", frage: "Ohnmachtsanfälle oder Schwindel bei Belastung?", type: "yes_no" },
      { id: "KAR-005", frage: "Bekannte Herzerkrankung, Herzinfarkt oder Stent?", type: "yes_no" },
      { id: "KAR-006", frage: "Wassereinlagerungen in Beinen (Ödeme)?", type: "yes_no" },
      { id: "KAR-007", frage: "Akuter, starker Brustschmerz JETZT in Ruhe — evtl. mit Ausstrahlung in Arm/Kiefer, Kaltschweiß oder Übelkeit?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "brustschmerz_belastung", op: "==", wert: true }, cdss_gewicht: { angina_pectoris: +4, kzs_verdacht: +3 },
        fragen: [
          { id: "KAR-B-001", frage: "Strahlt der Schmerz in Arm, Kiefer oder Rücken aus?", type: "yes_no" },
          { id: "KAR-B-002", frage: "Schmerz besser in Ruhe oder nach Nitro-Spray?", type: "yes_no" },
          { id: "KAR-B-003", frage: "Risikofaktoren: Rauchen, Diabetes, Bluthochdruck, erhöhte Blutfette?", type: "multiple_choice",
            options: ["Rauchen", "Diabetes", "Bluthochdruck", "erhöhte Cholesterinwerte", "Familie: Herzinfarkt <65J", "keines"] }
        ]
      },
      { bedingung: { feld: "herzrhythmus_stoerung", op: "==", wert: true }, cdss_gewicht: { vorhofflimmern: +3, avb: +2, wpw: +1 },
        fragen: [
          { id: "KAR-C-001", frage: "Regelmäßig oder unregelmäßig das Herzrasen?", type: "single_choice", options: ["regelmäßig-schnell", "unregelmäßig", "Aussetzer", "Herzstolpern einzeln"] },
          { id: "KAR-C-002", frage: "Tritt es in Ruhe oder bei Belastung auf?", type: "single_choice", options: ["Ruhe", "Belastung", "beides", "unklar"] }
        ]
      },
      { bedingung: { feld: "oedeme", op: "==", wert: true }, cdss_gewicht: { herzinsuffizienz: +4, cor_pulmonale: +2 },
        fragen: [
          { id: "KAR-D-001", frage: "Atemnot beim Liegen flach (Orthopnoe)?", type: "yes_no" },
          { id: "KAR-D-002", frage: "Müssen Sie nachts aufstehen wegen Atemnot?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "akuter_brustschmerz_ruhend", op: "==", wert: true },
        cdss_gewicht: { acs_herzinfarkt: +5 }, hinweis: "Möglicher Herzinfarkt → 112 sofort" },
      { bedingung: { feld: "synkope_belastung", op: "==", wert: true },
        cdss_gewicht: { hypertroph_kardiomyopathie: +4 }, hinweis: "Belastungssynkope → kardiale Abklärung dringend" }
    ]
  },

  GEFAESSSYSTEM: {
    id: "GEFAESSSYSTEM",
    name: "Gefäßsystem (Arterien & Venen)",
    gruppe: "Kardiovaskulär",
    icd10: ["I70", "I83", "I80"],
    cdss_modul: "S01_herz_kardio",
    screening: [
      { id: "GEF-001", frage: "Krämpfe in den Waden beim Gehen (Schaufensterkrankheit)?", type: "yes_no" },
      { id: "GEF-002", frage: "Schwere, müde Beine, Krampfadern oder Schwellung?", type: "yes_no" },
      { id: "GEF-003", frage: "Kalte Hände oder Füße, besonders in der Kälte?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "pavk_symptome", op: "==", wert: true }, cdss_gewicht: { pavk: +4 },
        fragen: [{ id: "GEF-B-001", frage: "Wie weit können Sie gehen bis Krämpfe auftreten?", type: "single_choice", options: ["<100m", "100-500m", ">500m"] }] },
      { bedingung: { feld: "akute_bein_schwellung", op: "==", wert: true }, cdss_gewicht: { tvt: +4 },
        fragen: [
          { id: "GEF-C-001", frage: "Einseitig schwoll das Bein plötzlich an + gerötet?", type: "yes_no" },
          { id: "GEF-C-002", frage: "Lange Flugreise, Bettruhe oder OP in letzter Zeit?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "akute_tvt", op: "==", wert: true },
        cdss_gewicht: { lungen_embolie: +4 }, hinweis: "TVT-Verdacht + Atemnot → Lungenembolie (112)" }
    ]
  },

  LUNGE_RESP: {
    id: "LUNGE_RESP",
    name: "Lunge & Atemwege",
    gruppe: "Pulmonal",
    icd10: ["J45", "J44", "J18", "J93"],
    cdss_modul: "S02_lunge_resp",
    screening: [
      { id: "LUN-001", frage: "Atemnot in Ruhe oder bei Belastung?", type: "yes_no" },
      { id: "LUN-002", frage: "Chronischer Husten (>8 Wochen)?", type: "yes_no" },
      { id: "LUN-003", frage: "Pfeifende Atmung (Giemen) oder Engegefühl in der Brust?", type: "yes_no" },
      { id: "LUN-004", frage: "Blut im Auswurf?", type: "yes_no" },
      { id: "LUN-005", frage: "Raucherstatus?", type: "single_choice", options: ["Nie geraucht", "Ex-Raucher (<10J)", "Ex-Raucher (>10J)", "Aktiv-Raucher (<20 py)", "Aktiv-Raucher (≥20 py)"] }
    ],
    verzweigung: [
      { bedingung: { feld: "giemen", op: "==", wert: true }, cdss_gewicht: { asthma: +4, copd: +2 },
        fragen: [
          { id: "LUN-B-001", frage: "Besonders nachts oder morgens pfeifend? (→ Asthma)", type: "yes_no" },
          { id: "LUN-B-002", frage: "Allergien, Tierkontakt oder Pollenbelastung als Auslöser?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "raucher_packungsjahre_20_plus", op: "==", wert: true }, cdss_gewicht: { copd: +4, lungenkarzinom: +2 },
        fragen: [
          { id: "LUN-C-001", frage: "Husten mit Auswurf morgens (Raucherhusten)?", type: "yes_no" },
          { id: "LUN-C-002", frage: "Zunehmende Belastungsdyspnoe in letzten Jahren?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "haemoptyse", op: "==", wert: true }, cdss_gewicht: { lungenkarzinom: +3, tbc: +2, bronchiektasen: +2 },
        fragen: [
          { id: "LUN-D-001", frage: "Unerklärter Gewichtsverlust dabei?", type: "yes_no" },
          { id: "LUN-D-002", frage: "Aufenthalt in Tuberkulose-Risikogebiet?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "akute_atemnot_ruhe", op: "==", wert: true },
        cdss_gewicht: { lungenembolie: +4, pneumothorax: +4 }, hinweis: "Akute Ruhedyspnoe → 112" },
      { bedingung: { feld: "haemoptyse", op: "==", wert: true },
        cdss_gewicht: { malignom: +3 }, hinweis: "Hämoptyse → dringende Bildgebung" }
    ]
  },

  MAGEN_OESOPHAGUS: {
    id: "MAGEN_OESOPHAGUS",
    name: "Magen, Ösophagus & oberer GI-Trakt",
    gruppe: "Gastrointestinal",
    icd10: ["K21", "K25", "K27", "K31"],
    cdss_modul: "S03_gi_abdomen",
    screening: [
      { id: "MAG-001", frage: "Sodbrennen, saures Aufstoßen?", type: "yes_no" },
      { id: "MAG-002", frage: "Schmerzen im Oberbauch (Magengrube)?", type: "yes_no" },
      { id: "MAG-003", frage: "Übelkeit oder Erbrechen regelmäßig?", type: "yes_no" },
      { id: "MAG-004", frage: "Schluckbeschwerden (feste Nahrung bleibt stecken)?", type: "yes_no" },
      { id: "MAG-005", frage: "Schwarzer, teerartiger Stuhl oder Bluterbrechen — evtl. mit Schwäche/Schwindel?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "sodbrennen", op: "==", wert: true }, cdss_gewicht: { gerd: +4, hiatus_hernie: +2 },
        fragen: [
          { id: "MAG-B-001", frage: "Sodbrennen besonders nachts oder beim Liegen?", type: "yes_no" },
          { id: "MAG-B-002", frage: "PPI-Einnahme (Omeprazol, Pantoprazol)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "dysphagie", op: "==", wert: true }, cdss_gewicht: { oesophaguskarzinom: +3, achalasie: +3 },
        fragen: [
          { id: "MAG-C-001", frage: "Schluckbeschwerden bei festen Speisen, flüssigen oder beidem?", type: "single_choice", options: ["nur Festes", "auch Flüssiges", "beides gleich", "Flüssiges schwieriger"] },
          { id: "MAG-C-002", frage: "Gewichtsverlust dabei?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "hb_sturz_melena", op: "==", wert: true },
        cdss_gewicht: { magenblutung: +5 }, hinweis: "Teerstuhl / Hämatemesis → 112" }
    ]
  },

  DARM_KOLON: {
    id: "DARM_KOLON",
    name: "Darm, Kolon & unterer GI-Trakt",
    gruppe: "Gastrointestinal",
    icd10: ["K57", "K58", "K50", "K51"],
    cdss_modul: "S03_gi_abdomen",
    screening: [
      { id: "DAR-001", frage: "Bauchschmerzen — wo und wie?", type: "multiple_choice",
        options: ["rechter Oberbauch", "linker Oberbauch", "Nabel/Mitte", "rechter Unterbauch", "linker Unterbauch", "diffus", "krampfartig"] },
      { id: "DAR-002", frage: "Veränderte Stuhlgewohnheiten (Durchfall, Verstopfung, Wechsel)?", type: "yes_no" },
      { id: "DAR-003", frage: "Blut oder Schleim im Stuhl?", type: "yes_no" },
      { id: "DAR-004", frage: "Bauchschmerzen im Zusammenhang mit dem Stuhlgang (besser/schlechter)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "rome_iv_kriterien", op: "==", wert: true }, cdss_gewicht: { ibs: +4 },
        fragen: [
          { id: "DAR-B-001", frage: "Wie lange bestehen diese Beschwerden?", type: "single_choice", options: ["<3 Monate", "3-6 Monate", ">6 Monate"] },
          { id: "DAR-B-002", frage: "Wurden Zöliakie, Colitis und Morbus Crohn ausgeschlossen?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "morbus_crohn_verdacht", op: "==", wert: true }, cdss_gewicht: { morbus_crohn: +3, colitis_ulcerosa: +2 },
        fragen: [
          { id: "DAR-C-001", frage: "Gewichtsverlust, Fieber, Gelenkschmerzen?", type: "yes_no" },
          { id: "DAR-C-002", frage: "Familie mit CED (Morbus Crohn, Colitis)?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "alter_ue_50_rektales_blut", op: "==", wert: true },
        cdss_gewicht: { kolonkarzinom: +4 }, hinweis: "Rektales Blut ≥50J → Koloskopie dringend" }
    ]
  },

  LEBER_GALLE: {
    id: "LEBER_GALLE",
    name: "Leber, Gallenblase & Gallenwege",
    gruppe: "Hepatobiliär",
    icd10: ["K80", "K70", "K76", "K83"],
    cdss_modul: "S03_gi_abdomen",
    screening: [
      { id: "LEB-001", frage: "Schmerzen rechter Oberbauch (Leberbereich)?", type: "yes_no" },
      { id: "LEB-002", frage: "Kolikiartiger Schmerz nach fettigem Essen?", type: "yes_no" },
      { id: "LEB-003", frage: "Gelbfärbung von Haut oder Augen (Ikterus)?", type: "yes_no" },
      { id: "LEB-004", frage: "Alkoholkonsum (täglich oder exzessiv)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "kolik_nach_fett", op: "==", wert: true }, cdss_gewicht: { cholezystolithiasis: +4, cholezystitis: +3 },
        fragen: [
          { id: "LEB-B-001", frage: "Ausstrahlung in rechte Schulter oder Schulterblatt?", type: "yes_no" },
          { id: "LEB-B-002", frage: "Fieber und Schüttelfrost dazu?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "ikterus", op: "==", wert: true }, cdss_gewicht: { hepatitis: +3, choledocholithiasis: +3, pankreaskarzinom: +2 },
        fragen: [
          { id: "LEB-C-001", frage: "Dunkler Urin, heller Stuhl?", type: "yes_no" },
          { id: "LEB-C-002", frage: "Schmerzloser Ikterus?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "alkohol_taeglich", op: "==", wert: true }, cdss_gewicht: { alkohol_leberzirrhose: +3, fettleber: +2 } }
    ],
    red_flags: [
      { bedingung: { feld: "schmerzloser_ikterus_gewichtsverlust", op: "==", wert: true },
        cdss_gewicht: { pankreaskarzinom: +4 }, hinweis: "Schmerzloser Ikterus + Gewichtsverlust → Ca. ausschließen" }
    ]
  },

  PANKREAS_MILZ: {
    id: "PANKREAS_MILZ",
    name: "Pankreas & Milz",
    gruppe: "Gastrointestinal",
    icd10: ["K85", "K86", "D73"],
    cdss_modul: "S03_gi_abdomen",
    screening: [
      { id: "PAN-001", frage: "Gürtelförmiger Oberbauchschmerz, besonders in Rücken ausstrahlend?", type: "yes_no" },
      { id: "PAN-002", frage: "Übelkeit, Erbrechen, Fettstuhl?", type: "yes_no" },
      { id: "PAN-003", frage: "Schmerzen linker Oberbauch unter Rippen (Milzbereich)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "guertelschmerz_ausstr_ruecken", op: "==", wert: true }, cdss_gewicht: { pankreatitis_akut: +4, pankreatitis_chronisch: +3 },
        fragen: [
          { id: "PAN-B-001", frage: "Alkohol als Auslöser? Gallensteinleiden bekannt?", type: "yes_no" },
          { id: "PAN-B-002", frage: "Lipase oder Amylase jemals erhöht (Laborwerte)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "milz_schmerz", op: "==", wert: true }, cdss_gewicht: { splenomegalie: +2, milzruptur: +3 },
        fragen: [{ id: "PAN-C-001", frage: "Trauma oder Mononukleose in letzter Zeit?", type: "yes_no" }] }
    ]
  },

  NIERE: {
    id: "NIERE",
    name: "Nieren & Harnleiter",
    gruppe: "Urogenital",
    icd10: ["N20", "N10", "N18"],
    cdss_modul: "S04_hno_urogenital_gynaekologie",
    screening: [
      { id: "NIE-001", frage: "Flankenschmerz (seitlicher Rücken unter den Rippen)?", type: "yes_no" },
      { id: "NIE-002", frage: "Blut im Urin (sichtbar rötlich oder labormäßig)?", type: "yes_no" },
      { id: "NIE-003", frage: "Brennen beim Wasserlassen?", type: "yes_no" },
      { id: "NIE-004", frage: "Schmerzen strahlen in Leiste/Hoden/Schamlippen aus (Kolik)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "kolik_ausstrahlung", op: "==", wert: true }, cdss_gewicht: { nierenstein: +5, ureterstein: +4 },
        fragen: [
          { id: "NIE-B-001", frage: "Intensität des Schmerzes (0-10)?", type: "vas_scale" },
          { id: "NIE-B-002", frage: "Nierensteine schon früher gehabt?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "brennen_haematurie", op: "==", wert: true }, cdss_gewicht: { uti_zystitis: +4, pyelonephritis: +3 },
        fragen: [
          { id: "NIE-C-001", frage: "Fieber und Schüttelfrost dazu?", type: "yes_no" },
          { id: "NIE-C-002", frage: "Häufig wiederkehrende Blasenentzündungen?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "haematurie_ue_50_schmerzlos", op: "==", wert: true },
        cdss_gewicht: { urothelkarzinom: +4 }, hinweis: "Schmerzlose Hämaturie ≥50J → Zystoskopie" }
    ]
  },

  BLASE: {
    id: "BLASE",
    name: "Harnblase & untere Harnwege",
    gruppe: "Urogenital",
    icd10: ["N39", "N30", "N32"],
    cdss_modul: "S04_hno_urogenital_gynaekologie",
    screening: [
      { id: "BLA-001", frage: "Häufiger Harndrang, auch nachts?", type: "yes_no" },
      { id: "BLA-002", frage: "Schwacher Harnstrahl oder Harnverhalt?", type: "yes_no" },
      { id: "BLA-003", frage: "Inkontinenz (ungewollter Urinverlust)?", type: "single_choice", options: ["nein", "beim Husten/Niesen (Belastungsinkontinenz)", "plötzlicher Harndrang (Urgency)", "ständiges Tröpfeln", "beides"] }
    ],
    verzweigung: [
      { bedingung: { feld: "geschlecht", op: "==", wert: "m" },
        fragen: [
          { id: "BLA-M-001", frage: "Abgeschwächter Harnstrahl, Zögern beim Starten?", type: "yes_no" },
          { id: "BLA-M-002", frage: "Wie ist der IPSS-Score einzuschätzen? (leicht/moderat/schwer)", type: "single_choice", options: ["leicht (selten Symptome)", "moderat (regelmäßig)", "schwer (täglich, nachts, häufig"] }
        ],
        cdss_gewicht: { bph_prostata: +3 }
      },
      { bedingung: { feld: "belastungsinkontinenz", op: "==", wert: true }, cdss_gewicht: { belastungsinkontinenz: +4 },
        fragen: [{ id: "BLA-B-001", frage: "Geburten (Anzahl, Geburtsgewichte)?", type: "textarea" }] }
    ]
  },

  PROSTATA: {
    id: "PROSTATA",
    name: "Prostata",
    gruppe: "Urogenital männlich",
    icd10: ["N40", "N41", "C61"],
    cdss_modul: "S04_hno_urogenital_gynaekologie",
    screening: [
      { id: "PRO-001", frage: "Blasenentleerungsstörungen (schwacher Strahl, Zögern, Tröpfeln)?", type: "yes_no" },
      { id: "PRO-002", frage: "Schmerzen im Damm, Hoden oder unteren Rücken?", type: "yes_no" },
      { id: "PRO-003", frage: "Bekannter erhöhter PSA-Wert?", type: "yes_no" },
      { id: "PRO-004", frage: "Alter und letzter PSA-Test?", type: "textarea" }
    ],
    verzweigung: [
      { bedingung: { feld: "alter", op: ">=", wert: 50 }, cdss_gewicht: { bph: +3 },
        fragen: [{ id: "PRO-B-001", frage: "Familiäre Vorbelastung Prostatakrebs?", type: "yes_no" }] },
      { bedingung: { feld: "schmerz_damm_akut", op: "==", wert: true }, cdss_gewicht: { akute_prostatitis: +4 },
        fragen: [{ id: "PRO-C-001", frage: "Fieber, Schüttelfrost, allgemeines Krankheitsgefühl?", type: "yes_no" }] }
    ]
  },

  GYNAEKOLOGIE: {
    id: "GYNAEKOLOGIE",
    name: "Gynäkologie (Uterus, Ovar, Tube, Endometrium)",
    gruppe: "Gynäkologie",
    icd10: ["N80", "N83", "N94", "C53"],
    cdss_modul: "S04_hno_urogenital_gynaekologie",
    screening: [
      { id: "GYN-001", frage: "Regelschmerzen (Dysmenorrhö)?", type: "yes_no" },
      { id: "GYN-002", frage: "Unregelmäßiger Zyklus oder Ausbleiben der Periode?", type: "yes_no" },
      { id: "GYN-003", frage: "Schmerzen beim Geschlechtsverkehr (Dyspareunie)?", type: "yes_no" },
      { id: "GYN-004", frage: "Blutungen außerhalb der Periode oder postmenopausal?", type: "yes_no" },
      { id: "GYN-005", frage: "Krampfartige Unterbauchschmerzen, einseitig oder beidseitig?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "dysmenorrhoe", op: "==", wert: true }, cdss_gewicht: { endometriose: +3, adenomyose: +2 },
        fragen: [
          { id: "GYN-B-001", frage: "Schmerzen auch außerhalb der Periode (chronischer Beckenschmerz)?", type: "yes_no" },
          { id: "GYN-B-002", frage: "Familiengeschichte mit Endometriose?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "postmenopausale_blutung", op: "==", wert: true }, cdss_gewicht: { endometriumkarzinom: +4 },
        fragen: [{ id: "GYN-C-001", frage: "Wann war die letzte Periode? Gynäkologische Untersuchung?", type: "textarea" }] },
      { bedingung: { feld: "einseitige_unterbauchschmerzen", op: "==", wert: true }, cdss_gewicht: { ovarialzyste: +3, eileiterschwangerschaft: +4 },
        fragen: [
          { id: "GYN-D-001", frage: "Könnte eine Schwangerschaft bestehen?", type: "yes_no" },
          { id: "GYN-D-002", frage: "Schwindel, Ohnmacht, Schockzeichen?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "eileiterschwangerschaft_verdacht", op: "==", wert: true },
        cdss_gewicht: { eileiterschwangerschaft: +5 }, hinweis: "Schwangerschaft + einseitiger Schmerz + Schock → 112" }
    ]
  },

  ENDOKRIN: {
    id: "ENDOKRIN",
    name: "Endokrines System (Schilddrüse, Nebenniere, Hypophyse)",
    gruppe: "Endokrinologie",
    icd10: ["E03", "E05", "E06", "E27", "E22"],
    cdss_modul: "A03",
    screening: [
      { id: "END-001", frage: "Müdigkeit, Gewichtszunahme, Kälteintoleranz, Verstopfung?", type: "yes_no" },
      { id: "END-002", frage: "Herzrasen, Gewichtsverlust, Schweißausbrüche, Nervosität?", type: "yes_no" },
      { id: "END-003", frage: "Bekannte Schilddrüsenerkrankung?", type: "yes_no" },
      { id: "END-004", frage: "Chronische Erschöpfung, Morgentief, Salzhunger?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "hypothyreose_symptome", op: "==", wert: true }, cdss_gewicht: { hypothyreose: +4, hashimoto: +3 },
        fragen: [
          { id: "END-B-001", frage: "TSH bekannt? Wert?", type: "textarea" },
          { id: "END-B-002", frage: "Schwangerschaft geplant oder kürzlich zurückliegend?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "hpa_erschoepfung", op: "==", wert: true }, cdss_gewicht: { nebenniereninsuffizienz: +3, cortisol_mangel: +3 },
        fragen: [
          { id: "END-C-001", frage: "Morgencortisol oder DHEA-S gemessen?", type: "yes_no" },
          { id: "END-C-002", frage: "Langzeitstress, Burnout, traumatisches Erlebnis?", type: "yes_no" }
        ]
      }
    ]
  },

  HAUT: {
    id: "HAUT",
    name: "Haut & Subkutis",
    gruppe: "Dermatologie",
    icd10: ["L20", "L40", "L50", "C44"],
    cdss_modul: "S04_hno_urogenital_gynaekologie",
    screening: [
      { id: "HAU-001", frage: "Hautausschlag, Rötungen oder Juckreiz?", type: "yes_no" },
      { id: "HAU-002", frage: "Schuppige Haut, Plaques oder trockene Haut?", type: "yes_no" },
      { id: "HAU-003", frage: "Neue oder veränderte Muttermale?", type: "yes_no" },
      { id: "HAU-004", frage: "Chronischer Juckreiz ohne sichtbaren Ausschlag?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "schuppige_plaques", op: "==", wert: true }, cdss_gewicht: { psoriasis: +4 },
        fragen: [
          { id: "HAU-B-001", frage: "Gelenksschmerzen dazu (Psoriasis-Arthritis)?", type: "yes_no" },
          { id: "HAU-B-002", frage: "Familiengeschichte mit Schuppenflechte?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "veraendertes_muttermal", op: "==", wert: true }, cdss_gewicht: { melanom: +3 },
        fragen: [{ id: "HAU-C-001", frage: "ABCDE-Regel: Asymmetrie, Begrenzung, Colorit, Durchmesser >5mm, Erhabenheit?", type: "textarea" }] },
      { bedingung: { feld: "blaeschen_neuralgie", op: "==", wert: true }, cdss_gewicht: { herpes_zoster: +5 },
        fragen: [{ id: "HAU-D-001", frage: "Bläschen halbseitig am Rumpf/Gesicht + Brennen/Kribbeln vorher?", type: "yes_no" }] }
    ]
  },

  HNO: {
    id: "HNO",
    name: "HNO — Ohr, Nase, Hals, Stimme",
    gruppe: "HNO",
    icd10: ["H83.3", "H81.1", "J32", "J38"],
    cdss_modul: "S04_hno_urogenital_gynaekologie",
    screening: [
      { id: "HNO-001", frage: "Tinnitus (Ohrgeräusche)?", type: "yes_no" },
      { id: "HNO-002", frage: "Hörverlust oder Ohrdruck?", type: "yes_no" },
      { id: "HNO-003", frage: "Schwindel?", type: "yes_no" },
      { id: "HNO-004", frage: "Chronische Nasennebenhöhlen-Beschwerden?", type: "yes_no" },
      { id: "HNO-005", frage: "Schluckbeschwerden oder Heiserkeit?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "tinnitus", op: "==", wert: true }, cdss_gewicht: { tinnitus_chronisch: +4, meniere: +2, hoersturz: +2 },
        fragen: [
          { id: "HNO-B-001", frage: "Einseitig oder beidseitig?", type: "single_choice", options: ["rechts", "links", "beidseitig", "unklar"] },
          { id: "HNO-B-002", frage: "Lärmexposition (Beruf, Musik, Schuss)?", type: "yes_no" },
          { id: "HNO-B-003", frage: "Kombination: Tinnitus + Schwindel + Hörverlust (Trias)?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "schwindel_hno", op: "==", wert: true }, cdss_gewicht: { bppv: +4, meniere: +3, vestibularisparoxysmie: +2 },
        fragen: [
          { id: "HNO-C-001", frage: "Schwindel bei Lagewechsel (Drehen im Bett, Aufstehen)?", type: "yes_no" },
          { id: "HNO-C-002", frage: "Wie lange dauert der Schwindel?", type: "single_choice", options: ["Sekunden (BPPV)", "Minuten-Stunden (Menière)", "anhaltend Tage (Neuritis)", "unklar"] }
        ]
      },
      { bedingung: { feld: "chronische_sinusitis", op: "==", wert: true }, cdss_gewicht: { chronische_rhinosinusitis: +4 },
        fragen: [
          { id: "HNO-D-001", frage: "Nasenpolypen bekannt?", type: "yes_no" },
          { id: "HNO-D-002", frage: "Asthma + Aspirin-Unverträglichkeit + Nasenpolypen (Samter-Trias)?", type: "yes_no" }
        ]
      }
    ]
  },

  NEUROLOGIE: {
    id: "NEUROLOGIE",
    name: "Neurologie — Kopfschmerz, Schwindel, Kognition, Periphere Nerven",
    gruppe: "Neurologie",
    icd10: ["G43", "G44", "G45", "G35", "G20"],
    cdss_modul: "S04_hno_urogenital_gynaekologie",
    screening: [
      { id: "NEU-001", frage: "Kopfschmerzen — wie oft und wie lange?", type: "single_choice",
        options: ["selten (<4 Tage/Monat)", "episodisch (4-14 Tage/Monat)", "chronisch (>15 Tage/Monat)", "täglich"] },
      { id: "NEU-002", frage: "Welcher Kopfschmerztyp?", type: "multiple_choice",
        options: ["pochend einseitig (Migräne?)", "Druckband beidseits (Spannungskopfschmerz?)", "stechend einseitig periorbital (Cluster?)", "Nackenkopfschmerz", "morgens nach Aufwachen"] },
      { id: "NEU-003", frage: "Schwindel — welcher Typ?", type: "single_choice",
        options: ["kein Schwindel", "Drehschwindel", "Schwankschwindel", "Benommenheit", "Liftgefühl"] },
      { id: "NEU-004", frage: "Gedächtnisprobleme, Konzentrationsstörungen?", type: "yes_no" },
      { id: "NEU-005", frage: "Kribbeln / Taubheit in Händen oder Füßen (Polyneuropathie)?", type: "yes_no" },
      { id: "NEU-006", frage: "Schlagartig einschießender, stärkster Kopfschmerz Ihres Lebens (innerhalb von Sekunden, wie ein Vernichtungskopfschmerz)?", type: "yes_no" },
      { id: "NEU-007", frage: "Plötzliche einseitige Lähmung/Taubheit, Sprach- oder Sehstörung (Schlaganfall-Warnzeichen)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "kopfschmerz_typ_migraene", op: "==", wert: true }, cdss_gewicht: { migraene: +4 },
        fragen: [
          { id: "NEU-B-001", frage: "Aura (Sehstörungen, Kribbeln, Sprachstörungen) vor dem Kopfschmerz?", type: "yes_no" },
          { id: "NEU-B-002", frage: "Übelkeit / Licht- und Lärmempfindlichkeit?", type: "yes_no" },
          { id: "NEU-B-003", frage: "Auslöser? (Schlafmangel, Stress, Alkohol, Hormone, Nahrung)", type: "multiple_choice",
            options: ["Stress", "Schlafmangel", "Alkohol/Rotwein", "Hormonschwankung", "Nahrung (Käse, Schokolade)", "Wetter", "unklar"] }
        ]
      },
      { bedingung: { feld: "polyneuropathie_symptome", op: "==", wert: true }, cdss_gewicht: { polyneuropathie: +4 },
        fragen: [
          { id: "NEU-C-001", frage: "Diabetes, Alkohol, Schilddrüsenprobleme, Vitaminmangel (B12)?", type: "multiple_choice",
            options: ["Diabetes", "Alkohol", "B12-Mangel", "Schilddrüse", "Chemotherapie", "keines"] }
        ]
      },
      { bedingung: { feld: "kognitive_symptome", op: "==", wert: true }, cdss_gewicht: { mci_frueh: +2, ad_verdacht: +2 },
        fragen: [
          { id: "NEU-D-001", frage: "Vergessen von Terminen, Namen, kürzlich Gehörtem?", type: "yes_no" },
          { id: "NEU-D-002", frage: "Familiäre Demenzerkrankung?", type: "yes_no" }
        ]
      }
    ],
    red_flags: [
      { bedingung: { feld: "donnerschlagkopfschmerz", op: "==", wert: true },
        cdss_gewicht: { subarachnoidalblutung: +5 }, hinweis: "Donnerschlagkopfschmerz → Subarachnoidalblutung (112)" },
      { bedingung: { feld: "fokales_defizit_akut", op: "==", wert: true },
        cdss_gewicht: { schlaganfall: +5 }, hinweis: "Akute Halbseitenlähmung / Sprachstörung → Stroke (112)" }
    ]
  },

  RHEUMA_IMMUNOLOGIE: {
    id: "RHEUMA_IMMUNOLOGIE",
    name: "Rheumatologie & Immunologie",
    gruppe: "Immunologie",
    icd10: ["M05", "M06", "M32", "M34"],
    cdss_modul: "S01_herz_kardio",
    screening: [
      { id: "RHE-001", frage: "Morgensteifigkeit in mehreren Gelenken (>30 min)?", type: "yes_no" },
      { id: "RHE-002", frage: "Symmetrische Gelenkschwellungen (beide Hände, Handgelenke)?", type: "yes_no" },
      { id: "RHE-003", frage: "Hautausschlag Schmetterlingform im Gesicht?", type: "yes_no" },
      { id: "RHE-004", frage: "Trockene Augen und trockener Mund (Sicca)?", type: "yes_no" }
    ],
    verzweigung: [
      { bedingung: { feld: "symmetrische_arthritis", op: "==", wert: true }, cdss_gewicht: { rheumatoide_arthritis: +5 },
        fragen: [
          { id: "RHE-B-001", frage: "RF-Faktor oder Anti-CCP-Antikörper bekannt?", type: "yes_no" },
          { id: "RHE-B-002", frage: "Gelenkzerstörung im Röntgen sichtbar?", type: "yes_no" }
        ]
      },
      { bedingung: { feld: "lupus_trias", op: "==", wert: true }, cdss_gewicht: { sle_lupus: +4 },
        fragen: [{ id: "RHE-C-001", frage: "Lichtempfindlichkeit, Haarausfall, Nierenbeteiligung?", type: "yes_no" }] }
    ]
  }

};

export const SYSTEMISCH_INDEX = {
  herz: "HERZ_KARDIO",
  gefaesse: "GEFAESSSYSTEM",
  lunge: "LUNGE_RESP",
  magen_oesophagus: "MAGEN_OESOPHAGUS",
  darm: "DARM_KOLON",
  leber_galle: "LEBER_GALLE",
  pankreas_milz: "PANKREAS_MILZ",
  niere: "NIERE",
  blase: "BLASE",
  prostata: "PROSTATA",
  gynaekologie: "GYNAEKOLOGIE",
  endokrin: "ENDOKRIN",
  haut: "HAUT",
  hno: "HNO",
  neurologie: "NEUROLOGIE",
  rheuma: "RHEUMA_IMMUNOLOGIE"
};
