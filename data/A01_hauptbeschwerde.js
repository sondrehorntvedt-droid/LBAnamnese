/**
 * LINDEBERGS OS — Online-Anamnese
 * Modul A01: HAUPTBESCHWERDE & AKTUELLE BESCHWERDEN
 * ES-Module-Kopie — Inhalt 1:1 identisch zur kanonischen Quelle.
 */

export const HAUPTBESCHWERDE_FRAGEN = [

  {
    id: "HB-001",
    frage: "Warum kommen Sie zu uns? Was ist Ihr Hauptanliegen?",
    type: "textarea",
    placeholder: "Beschreiben Sie in eigenen Worten, was Sie zu uns bringt...",
    required: true,
    w_frage: "Was",
    hint: "Freie Beschreibung — nehmen Sie sich Zeit."
  },

  {
    id: "HB-002",
    frage: "In welchem Bereich haben Sie Ihre Hauptbeschwerden?",
    type: "multi_body_region",
    required: true,
    w_frage: "Wo",
    regions: [
      // ── Bewegungsapparat & Kopf-Hals (anatomisch: obere Extremität → Kopf →
      //    Wirbelsäule von oben nach unten → Becken → untere Extremität) ──
      { value: "hand_l", label: "Hand / Handgelenk links" },
      { value: "hand_r", label: "Hand / Handgelenk rechts" },
      { value: "ellenbogen_l", label: "Ellenbogen links" },
      { value: "ellenbogen_r", label: "Ellenbogen rechts" },
      { value: "schulter_l", label: "Schulter links" },
      { value: "schulter_r", label: "Schulter rechts" },
      { value: "kopfschmerz_migraene", label: "Kopfschmerz / Migräne" },
      { value: "schwindel", label: "Schwindel / Gleichgewicht" },
      { value: "kiefer", label: "Kiefergelenk / CMD (Knacken, Beißen, Kieferschmerz)" },
      { value: "hws", label: "Hals / Nacken (HWS)" },
      { value: "bws", label: "Brustwirbelsäule (BWS) / oberer Rücken" },
      { value: "rippen_thorax", label: "Rippen / Brustkorb" },
      { value: "lws", label: "Lendenwirbelsäule (LWS) / unterer Rücken" },
      { value: "isg", label: "ISG / Kreuzbein (Iliosakralgelenk)" },
      { value: "becken_symphyse", label: "Becken / Symphyse" },
      { value: "huefte_l", label: "Hüfte links" },
      { value: "huefte_r", label: "Hüfte rechts" },
      { value: "knie_l", label: "Knie links" },
      { value: "knie_r", label: "Knie rechts" },
      { value: "sprunggelenk_l", label: "Sprunggelenk / Fuß links" },
      { value: "sprunggelenk_r", label: "Sprunggelenk / Fuß rechts" },
      // ── Systemisch (von oben nach unten) ──
      { value: "kopf_hno", label: "HNO (Ohren, Nebenhöhlen, Hals)" },
      { value: "herz_kreislauf", label: "Herz / Kreislauf" },
      { value: "lunge_atem", label: "Lunge / Atemwege" },
      { value: "bauch_verdauung", label: "Bauch / Verdauung" },
      { value: "becken_urogenital", label: "Becken / Blase / Unterleib" },
      { value: "allgemein_muedigkeit", label: "Allgemein (Müdigkeit / Erschöpfung)" }
    ],
    max_selections: 3,
    hint: "Bitte wählen Sie bis zu 3 Bereiche — beginnen Sie mit dem schlimmsten."
  },

  {
    id: "HB-003",
    frage: "Wie würden Sie den Schmerz / die Beschwerden beschreiben?",
    type: "multiple_choice",
    required: true,
    w_frage: "Was / Wie",
    options: [
      { value: "stechend", label: "Stechend / scharf (wie ein Messer)" },
      { value: "dumpf", label: "Dumpf / ziehend" },
      { value: "brennend", label: "Brennend / elektrisch" },
      { value: "drückend", label: "Drückend / Enge" },
      { value: "klopfend", label: "Klopfend / pulsierend" },
      { value: "taubheit", label: "Taubheitsgefühl / Kribbeln / Ameisenlaufen" },
      { value: "steifigkeit", label: "Steifigkeit / Blockierung" },
      { value: "schwaeche", label: "Schwäche / Kraftlosigkeit" }
    ],
    max_selections: 3
  },

  {
    id: "HB-004",
    frage: "Wie stark sind Ihre Schmerzen im Durchschnitt der letzten Woche? (0 = kein Schmerz, 10 = schlimmster vorstellbarer Schmerz)",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: true,
    w_frage: "Wie schlimm",
    labels: { 0: "Kein Schmerz", 5: "Mäßig", 10: "Unerträglich" }
  },
  {
    id: "HB-005",
    frage: "Was ist Ihr schlimmster Schmerzwert (Maximum)?",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: false,
    w_frage: "Maximum"
  },
  {
    id: "HB-006",
    frage: "Was ist Ihr bester Schmerzwert (Minimum, wenn es gut ist)?",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: false,
    w_frage: "Minimum"
  },

  {
    id: "HB-007",
    frage: "Wann haben die Beschwerden begonnen?",
    type: "single_choice",
    required: true,
    w_frage: "Wann",
    options: [
      { value: "akut_heute", label: "Heute / Gestern (akut)" },
      { value: "akut_woche", label: "Vor weniger als 1 Woche" },
      { value: "subakut_wochen", label: "Vor 1–4 Wochen" },
      { value: "subakut_monate", label: "Vor 1–3 Monaten" },
      { value: "chronisch_6m", label: "Vor 3–6 Monaten" },
      { value: "chronisch_1j", label: "Vor 6–12 Monaten" },
      { value: "chronisch_jahre", label: "Seit mehr als 1 Jahr" },
      { value: "chronisch_viele", label: "Seit vielen Jahren" }
    ]
  },

  {
    id: "HB-008",
    frage: "Wie hat sich das Beschwerdebild über die Zeit entwickelt?",
    type: "single_choice",
    required: true,
    w_frage: "Verlauf",
    options: [
      { value: "gleichbleibend", label: "Gleichbleibend (hat sich nicht verändert)" },
      { value: "besser_werdend", label: "Tendenziell besser werdend" },
      { value: "schlechter_werdend", label: "Tendenziell schlechter werdend" },
      { value: "schwankend", label: "Schwankend — mal besser, mal schlechter" },
      { value: "schubweise", label: "In Schüben — gute Phasen und Schübe" }
    ]
  },

  {
    id: "HB-009",
    frage: "Haben die Beschwerden mit einem bestimmten Ereignis begonnen?",
    type: "multiple_choice",
    required: false,
    w_frage: "Womit / Auslöser",
    options: [
      { value: "unfall", label: "Unfall / Sturz" },
      { value: "sport", label: "Sport / körperliche Belastung" },
      { value: "heben", label: "Heben / Tragen / Bücken" },
      { value: "sitzen", label: "Langes Sitzen (Büro, Auto, Reise)" },
      { value: "arbeit", label: "Arbeit / Berufsbelastung" },
      { value: "stress", label: "Stress / psychische Belastung" },
      { value: "infektion", label: "Nach einer Infektion / Erkrankung" },
      { value: "op", label: "Nach einer Operation" },
      { value: "schwangerschaft", label: "Schwangerschaft / Geburt" },
      { value: "schleichend", label: "Schleichend — kein klares Ereignis" }
    ]
  },

  {
    id: "HB-010",
    frage: "Wann sind die Beschwerden am schlimmsten?",
    type: "multiple_choice",
    required: true,
    w_frage: "Wann / Rhythmus",
    options: [
      { value: "morgens", label: "Morgens beim Aufstehen / Morgensteifigkeit" },
      { value: "nachmittags", label: "Nachmittags" },
      { value: "abends", label: "Abends" },
      { value: "nachts", label: "Nachts (wacht auf / schläft schlecht)" },
      { value: "bei_belastung", label: "Bei Bewegung / körperlicher Belastung" },
      { value: "in_ruhe", label: "In Ruhe / beim Sitzen / Liegen" },
      { value: "bei_bestimmten_bewegungen", label: "Bei bestimmten Bewegungen (z.B. Drehen, Bücken)" },
      { value: "gleichmaessig", label: "Gleichmäßig über den Tag" }
    ]
  },

  {
    id: "HB-011",
    frage: "Was lindert die Beschwerden?",
    type: "multiple_choice",
    required: false,
    w_frage: "Wodurch (besser)",
    options: [
      { value: "waerme", label: "Wärme (Wärmflasche, Bad, Sonne)" },
      { value: "kaelte", label: "Kälte (Kühlpack, kaltes Wasser)" },
      { value: "bewegung", label: "Bewegung / Laufen" },
      { value: "dehnen", label: "Dehnübungen / Stretching" },
      { value: "mobilisation", label: "Mobilisierende Übungen / leichtes Yoga" },
      { value: "kraeftigung", label: "Kräftigungs-/Stabilisationsübungen" },
      { value: "ruhe", label: "Ruhe / Liegen" },
      { value: "medikamente", label: "Schmerzmittel / Medikamente" },
      { value: "massage", label: "Massage / manuelle Behandlung" },
      { value: "bestimmte_position", label: "Bestimmte Körperhaltung / Position" },
      { value: "schlafen", label: "Schlafen / Erholen" },
      { value: "nichts", label: "Nichts lindert die Beschwerden" }
    ]
  },

  {
    id: "HB-012",
    frage: "Was verschlimmert die Beschwerden?",
    type: "multiple_choice",
    required: false,
    w_frage: "Wodurch (schlechter)",
    options: [
      { value: "sitzen", label: "Langes Sitzen" },
      { value: "stehen", label: "Langes Stehen" },
      { value: "gehen", label: "Gehen / Treppensteigen" },
      { value: "heben", label: "Heben / Tragen" },
      { value: "sport", label: "Sport / körperliche Belastung" },
      { value: "bestimmte_uebungen", label: "Bestimmte Übungen / Sportarten / Bewegungen" },
      { value: "stress", label: "Stress / Aufregung" },
      { value: "kaelte_naesse", label: "Kälte / Feuchtigkeit / Wetterwechsel" },
      { value: "liegen", label: "Liegen (besonders Morgensteifigkeit)" },
      { value: "husten_niesen", label: "Husten / Niesen / Pressen" },
      { value: "essen", label: "Essen / bestimmte Nahrungsmittel" }
    ]
  },

  {
    id: "HB-013",
    frage: "Was glauben Sie selbst — was verursacht Ihre Beschwerden?",
    type: "textarea",
    required: false,
    w_frage: "Warum (Patientenperspektive)",
    placeholder: "Ihre eigene Einschätzung ist für uns sehr wertvoll...",
    hint: "Es gibt keine falsche Antwort."
  },

  {
    id: "HB-014",
    frage: "Wurden Sie wegen dieser Beschwerden bereits behandelt?",
    type: "multiple_choice",
    required: true,
    options: [
      { value: "arzt", label: "Hausarzt / Facharzt" },
      { value: "physio", label: "Physiotherapie" },
      { value: "osteo", label: "Osteopathie / Chiropraktik" },
      { value: "op", label: "Operation" },
      { value: "medikamente", label: "Medikamente (Schmerzmittel, Kortisonspritze etc.)" },
      { value: "alternativ", label: "Alternativmedizin / Naturheilkunde" },
      { value: "keine", label: "Noch keine Behandlung" }
    ]
  },

  {
    id: "HB-015",
    frage: "Falls behandelt: Hat die bisherige Behandlung geholfen?",
    type: "single_choice",
    required: false,
    condition: { field: "hb_behandlung_bisher", not_equal: ["keine"] },
    options: [
      { value: "sehr_gut", label: "Ja, sehr gut (>75% Verbesserung)" },
      { value: "teilweise", label: "Teilweise (25–75% Verbesserung)" },
      { value: "kaum", label: "Kaum (<25% Verbesserung)" },
      { value: "nicht", label: "Nein, keine Verbesserung" },
      { value: "schlechter", label: "Die Beschwerden wurden schlechter" }
    ]
  },

  {
    id: "HB-016",
    frage: "Haben Sie Befunde zu diesen Beschwerden? (Röntgen, MRT, CT, Ultraschall, Labor)",
    type: "file_upload",
    required: false,
    accepted_types: ["application/pdf", "image/jpeg", "image/png", "image/heic"],
    max_size_mb: 20,
    max_files: 10,
    hint: "Bitte laden Sie alle relevanten Befunde hoch — je vollständiger, desto besser können wir Ihnen helfen."
  },

  {
    id: "HB-017",
    frage: "Haben Sie aktuell eines der folgenden Warnsymptome? (BITTE EHRLICH — für Ihre Sicherheit!)",
    type: "multiple_choice",
    required: true,
    red_flag_question: true,
    options: [
      { value: "blasen_darmprobleme", label: "Neue Probleme mit Blase oder Darm (Inkontinenz, Verhalt)", red_flag: true },
      { value: "bein_lahmung", label: "Schwäche oder Lähmung in Armen oder Beinen", red_flag: true },
      { value: "taubheit_saddle", label: "Taubheit im Genital- oder Analbereich", red_flag: true },
      { value: "brustschmerz", label: "Brustschmerzen oder Herzrasen", red_flag: true },
      { value: "dyspnoe", label: "Plötzliche Atemnot", red_flag: true },
      { value: "schwindel_kollaps", label: "Plötzlicher Schwindel, Ohnmacht oder Sehstörungen", red_flag: true },
      // Gewichtsverlust, Nachtschweiß & Fieber werden NICHT hier gefragt, sondern
      // gebündelt und abgestuft im Schritt „Begleitsymptome" (B-Symptomatik) —
      // so muss der Patient sie nur einmal beantworten.
      { value: "keines", label: "Keines der oben genannten" }
    ],
    alert_on: ["blasen_darmprobleme", "bein_lahmung", "taubheit_saddle", "brustschmerz", "dyspnoe", "schwindel_kollaps"],
    alert_text: "⚠️ Bitte kontaktieren Sie sofort einen Arzt oder rufen Sie 112 an."
  }
];

/**
 * Regionsspezifische Optionen für „Was verschlimmert / lindert die Beschwerde?"
 * (HB-012 / HB-011). Ziel: nur relevante Faktoren je Gelenk zeigen — z.B. bei
 * der Schulter kein „langes Sitzen", sondern Überkopf/Nachtlage. Prägnant,
 * kurz, das Nötigste; Ergänzungen sind über das Sonstiges-Freitextfeld möglich.
 */
const O = (arr) => arr.map((l) => ({ value: l.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""), label: l }));

const W_OPTIONEN_BY_GROUP = {
  wirbelsaeule: {
    schlechter: O(["Langes Sitzen", "Langes Stehen", "Bücken / Vorbeugen", "Heben / Tragen", "Drehen / Rotation", "Husten / Niesen / Pressen", "Morgens (Steifigkeit)", "Liegen / Rückenlage"]),
    besser: O(["Bewegung / Gehen", "Bestimmte Position / Haltung", "Wärme", "Entlastung / Liegen", "Dehnübungen", "Mobilisation / leichtes Yoga"]),
  },
  schulter: {
    schlechter: O(["Überkopfbewegung", "Arm heben / abspreizen", "Heben / Tragen", "Liegen auf der Schulter / nachts", "Hinter den Rücken greifen (Schürzengriff)", "Wurf- / Schwimmbewegung", "Stützen / Liegestütz"]),
    besser: O(["Ruhe / Arm anlegen", "Arm abstützen / entlasten", "Wärme", "Bestimmte Position", "Schmerzmittel", "Bewegung im schmerzfreien Bogen"]),
  },
  arm: {
    schlechter: O(["Greifen / Zufassen", "Tippen / Mausarbeit", "Drehbewegungen (Schrauben, Türklinke)", "Heben / Tragen", "Aufstützen", "Feine Fingerarbeit"]),
    besser: O(["Ruhe", "Schiene / Bandage", "Wärme", "Schmerzmittel", "Dehnübungen"]),
  },
  huefte: {
    schlechter: O(["Gehen / Treppensteigen", "Aufstehen aus dem Sitzen (Anlaufschmerz)", "Langes Sitzen", "Liegen auf der Hüfte / Seitenlage", "Bein anziehen / Socke anziehen", "Sport"]),
    besser: O(["Bewegung nach dem Anlauf", "Entlastung / Ruhe", "Wärme", "Bestimmte Position", "Dehnübungen"]),
  },
  knie: {
    schlechter: O(["Treppensteigen (rauf/runter)", "In die Hocke / Kniebeuge", "Bergab gehen", "Langes Sitzen (Kino-Zeichen)", "Laufen / Springen", "Knien"]),
    besser: O(["Ruhe / Hochlagern", "Kühlen", "Entlastung", "Bestimmte Position", "Kräftigungsübungen"]),
  },
  fuss: {
    schlechter: O(["Auftreten / Abrollen", "Erste Schritte morgens", "Unebener Boden", "Laufen / Springen", "Langes Stehen / Gehen", "Enge Schuhe"]),
    besser: O(["Ruhe / Entlastung", "Hochlagern", "Weiche Schuhe / Einlagen", "Kühlen", "Dehnübungen"]),
  },
  kiefer: {
    schlechter: O(["Kauen (harte Speisen)", "Weites Mundöffnen / Gähnen", "Zähneknirschen / Pressen", "Stress", "Morgens"]),
    besser: O(["Ruhe / weiche Kost", "Wärme", "Kiefer bewusst entspannen", "Aufbissschiene"]),
  },
  rippen: {
    schlechter: O(["Tiefes Einatmen / Husten", "Drehen des Rumpfes", "Liegen auf der Seite", "Heben", "Druck auf die Stelle"]),
    besser: O(["Flache Atmung", "Ruhe", "Bestimmte Position", "Wärme"]),
  },
  kopf: {
    schlechter: O(["Stress", "Schlafmangel", "Bildschirmarbeit", "Nackenverspannung", "Bestimmte Nahrungsmittel / Alkohol", "Helles Licht / Lärm", "Kopfbewegung / Lagewechsel"]),
    besser: O(["Ruhe / Dunkelheit", "Schlaf", "Medikamente", "Frische Luft", "Nacken lockern"]),
  },
};

const REGION_W_GROUP = {
  hws: "wirbelsaeule", bws: "wirbelsaeule", lws: "wirbelsaeule",
  schulter_l: "schulter", schulter_r: "schulter",
  ellenbogen_l: "arm", ellenbogen_r: "arm", hand_l: "arm", hand_r: "arm",
  isg: "wirbelsaeule", becken_symphyse: "huefte",
  huefte_l: "huefte", huefte_r: "huefte",
  knie_l: "knie", knie_r: "knie",
  sprunggelenk_l: "fuss", sprunggelenk_r: "fuss",
  kiefer: "kiefer",
  rippen_thorax: "rippen",
  kopfschmerz_migraene: "kopf", schwindel: "kopf",
};

/**
 * Liefert die regionsangepassten Optionen für HB-011 (lindert) / HB-012
 * (verschlimmert) — oder null, wenn keine passende Region (dann Standard).
 */
export function getWOptionen(regionValue, frageId) {
  const grp = W_OPTIONEN_BY_GROUP[REGION_W_GROUP[regionValue]];
  if (!grp) return null;
  if (frageId === "HB-011") return grp.besser;
  if (frageId === "HB-012") return grp.schlechter;
  return null;
}

// Alle regionsspezifischen Optionen gesammelt — für lesbare Labels im
// Frage-Index (vollständige Anamnese).
export const ALLE_W_OPTIONEN = {
  "HB-011": Object.values(W_OPTIONEN_BY_GROUP).flatMap((g) => g.besser),
  "HB-012": Object.values(W_OPTIONEN_BY_GROUP).flatMap((g) => g.schlechter),
};
