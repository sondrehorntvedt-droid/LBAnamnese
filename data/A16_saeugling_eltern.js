/**
 * A16 — SÄUGLINGS-ANAMNESE (Eltern-Fremdanamnese)
 *
 * Wird von Mutter/Vater/Bezugsperson FÜR das Kind ausgefüllt (0–24 Monate).
 * Aktiviert über PT-001 = "saeugling" (Schritt "Für wen ist diese Anamnese?").
 *
 * Inhaltliche Basis:
 *  - Lindebergs Kinderosteopathie-Angebot (OST-PÄD OAM zertifiziert, VOD/BAO):
 *    Anpassungsstörungen nach Geburt, Schädelasymmetrien (Plagiozephalie),
 *    Entwicklungsverzögerungen, Still-/Saugprobleme, Schreibabys/Unruhe,
 *    Verdauungsbeschwerden (Koliken), Schlafprobleme, wiederkehrende Infekte.
 *  - Pädiatrische Standard-Fremdanamnese (Schwangerschaft → Geburt →
 *    Neonatalzeit → Ernährung → Regulation → Entwicklung → Vorsorge).
 *  - Dreier-Regel für exzessives Schreien nach Wessel (1954).
 *
 * STATUS: VORLÄUFIGE FASSUNG — wird mit dem Lindebergs-Kinderosteopathie-
 * Team (Advisory Board) fachlich verfeinert; Struktur ist dafür bewusst
 * daten-getrieben (Fragen ergänzen/ändern ohne Codeänderung).
 *
 * Deterministisch: reine Datendefinition, keine Bewertungslogik.
 */

export const PATIENT_TYP_INTRO = {
  titel: "Für wen ist diese Anamnese?",
  beschreibung:
    "Eltern können die Anamnese stellvertretend für ihr Baby oder Kleinkind ausfüllen — die Fragen passen sich dann komplett an.",
};

export const PATIENT_TYP_FRAGEN = [
  {
    id: "PT-001",
    frage: "Wen möchten Sie anmelden?",
    type: "single_choice",
    required: true,
    options: [
      { value: "erwachsener", label: "Mich selbst (Erwachsene/r oder Jugendliche/r)" },
      { value: "saeugling", label: "Mein Baby / Kleinkind (0–24 Monate) — ich fülle als Elternteil aus" },
    ],
  },
  {
    id: "PT-002",
    frage: "Wer füllt den Fragebogen aus?",
    type: "single_choice",
    required: true,
    condition: { field: "PT-001", equals: "saeugling" },
    options: [
      { value: "mutter", label: "Mutter" },
      { value: "vater", label: "Vater" },
      { value: "andere", label: "Andere Bezugsperson" },
    ],
  },
  {
    id: "PT-003",
    frage: "Wichtiger Hinweis: Bitte tragen Sie im Bereich 'Persönliches' die Daten Ihres KINDES ein (Name, Geburtsdatum, Geschlecht). Ihre eigenen Kontaktdaten (Telefon, E-Mail) bleiben dort richtig. Haben Sie das erledigt?",
    type: "yes_no",
    required: false,
    condition: { field: "PT-001", equals: "saeugling" },
  },
];

/** Abschnittsweise Struktur — der Schritt rendert jeden Abschnitt mit Label. */
export const SAEUGLING_ABSCHNITTE = [
  {
    key: "anliegen",
    titel: "Ihr Anliegen",
    beschreibung: "Was führt Sie mit Ihrem Kind zu uns?",
    fragen: [
      {
        id: "SGL-001",
        frage: "Welche Themen treffen zu? (Mehrfachauswahl möglich)",
        type: "multiple_choice",
        required: true,
        options: [
          { value: "anpassung_geburt", label: "Anpassungsstörungen nach der Geburt" },
          { value: "schaedelasymmetrie", label: "Kopf-/Schädelasymmetrie, Abflachung (Plagiozephalie)" },
          { value: "vorzugshaltung", label: "Vorzugshaltung / Schiefhals" },
          { value: "still_saug", label: "Still- oder Saugprobleme" },
          { value: "schreien_unruhe", label: "Viel Schreien / Unruhe / Regulationsprobleme" },
          { value: "verdauung_koliken", label: "Verdauungsbeschwerden (z.B. Koliken, Blähungen)" },
          { value: "schlaf", label: "Schlafprobleme" },
          { value: "entwicklung", label: "Sorge um die motorische Entwicklung" },
          { value: "infekte_spannung", label: "Wiederkehrende Infekte oder Spannungsmuster" },
          { value: "geburt_instrumentell", label: "Kontrolle nach schwerer oder instrumenteller Geburt" },
          { value: "sonstiges", label: "Etwas anderes" },
        ],
      },
      {
        id: "SGL-002",
        frage: "Beschreiben Sie Ihr Anliegen in eigenen Worten",
        type: "textarea",
        required: false,
        placeholder: "Was ist Ihnen aufgefallen? Seit wann? Was wünschen Sie sich?",
      },
      {
        id: "SGL-003",
        frage: "Seit wann besteht das Hauptanliegen?",
        type: "single_choice",
        required: false,
        options: [
          { value: "seit_geburt", label: "Seit der Geburt" },
          { value: "erste_wochen", label: "Seit den ersten Lebenswochen" },
          { value: "spaeter", label: "Erst später aufgetreten" },
        ],
      },
    ],
  },
  {
    key: "schwangerschaft",
    titel: "Schwangerschaft",
    fragen: [
      {
        id: "SGL-SS-01",
        frage: "Wie verlief die Schwangerschaft?",
        type: "single_choice",
        required: true,
        options: [
          { value: "unauffaellig", label: "Unauffällig" },
          { value: "komplikationen", label: "Mit Besonderheiten / Komplikationen" },
        ],
      },
      {
        id: "SGL-SS-02",
        frage: "Welche Besonderheiten traten auf?",
        type: "multiple_choice",
        required: false,
        condition: { field: "SGL-SS-01", equals: "komplikationen" },
        options: [
          { value: "hypertonie_praeeklampsie", label: "Bluthochdruck / Präeklampsie" },
          { value: "gestationsdiabetes", label: "Schwangerschaftsdiabetes" },
          { value: "infektionen", label: "Infektionen" },
          { value: "blutungen", label: "Blutungen" },
          { value: "vorzeitige_wehen", label: "Vorzeitige Wehen / Liegephase" },
          { value: "mehrlinge", label: "Mehrlingsschwangerschaft" },
          { value: "starker_stress", label: "Starke seelische Belastung / Stress" },
          { value: "sonstiges", label: "Sonstiges" },
        ],
      },
      {
        id: "SGL-SS-03",
        frage: "Wurden in der Schwangerschaft regelmäßig Medikamente eingenommen?",
        type: "yes_no",
        required: false,
      },
      {
        id: "SGL-SS-03b",
        frage: "Welche Medikamente?",
        type: "text",
        required: false,
        condition: { field: "SGL-SS-03", equals: true },
      },
    ],
  },
  {
    key: "geburt",
    titel: "Geburt",
    beschreibung: "Der Geburtsverlauf ist für die osteopathische Einordnung besonders wichtig.",
    fragen: [
      {
        id: "SGL-GEB-01",
        frage: "In welcher Schwangerschaftswoche kam Ihr Kind zur Welt?",
        type: "single_choice",
        required: true,
        options: [
          { value: "sehr_frueh", label: "Deutlich zu früh (vor der 32. Woche)" },
          { value: "frueh", label: "Zu früh (32.–36. Woche)" },
          { value: "termingerecht", label: "Termingerecht (37.–41. Woche)" },
          { value: "uebertragen", label: "Übertragen (ab 42. Woche)" },
        ],
      },
      {
        id: "SGL-GEB-02",
        frage: "Wie kam Ihr Kind zur Welt?",
        type: "single_choice",
        required: true,
        options: [
          { value: "spontan", label: "Spontan (vaginal)" },
          { value: "sectio_geplant", label: "Geplanter Kaiserschnitt" },
          { value: "sectio_ungeplant", label: "Ungeplanter / Not-Kaiserschnitt" },
          { value: "vakuum", label: "Saugglocke (Vakuum)" },
          { value: "zange", label: "Zange (Forzeps)" },
        ],
      },
      {
        id: "SGL-GEB-03",
        frage: "Wie lange dauerte die Geburt (ab regelmäßigen Wehen)?",
        type: "single_choice",
        required: false,
        options: [
          { value: "sehr_schnell", label: "Sehr schnell (unter 3 Stunden)" },
          { value: "normal", label: "Normal" },
          { value: "lang", label: "Lang (über 18 Stunden)" },
          { value: "sehr_lang", label: "Sehr lang (über 24 Stunden)" },
          { value: "unbekannt", label: "Weiß ich nicht" },
        ],
      },
      {
        id: "SGL-GEB-04",
        frage: "In welcher Lage war Ihr Kind?",
        type: "single_choice",
        required: false,
        options: [
          { value: "schaedellage", label: "Schädellage (normal)" },
          { value: "sternengucker", label: "Schädellage mit Blick nach oben (Sternengucker)" },
          { value: "beckenendlage", label: "Beckenendlage (Steißlage)" },
          { value: "querlage", label: "Querlage" },
          { value: "unbekannt", label: "Weiß ich nicht" },
        ],
      },
      {
        id: "SGL-GEB-05",
        frage: "Gab es eine PDA (Periduralanästhesie)?",
        type: "yes_no",
        required: false,
      },
      {
        id: "SGL-GEB-06",
        frage: "Gab es Komplikationen bei der Geburt?",
        type: "multiple_choice",
        required: false,
        options: [
          { value: "keine", label: "Keine" },
          { value: "nabelschnur", label: "Nabelschnur um den Hals" },
          { value: "geburtsstillstand", label: "Geburtsstillstand / Wehenschwäche" },
          { value: "schulterdystokie", label: "Schulterdystokie (Schulter blieb hängen)" },
          { value: "sauerstoffmangel", label: "Sauerstoffmangel" },
          { value: "unbekannt", label: "Weiß ich nicht" },
        ],
      },
      {
        id: "SGL-GEB-07",
        frage: "Geburtsgewicht (in Gramm, falls bekannt)",
        type: "number",
        required: false,
        placeholder: "z.B. 3450",
      },
      {
        id: "SGL-GEB-08",
        frage: "Gab es auffällige Werte direkt nach der Geburt (z.B. APGAR, Verlegung)?",
        type: "single_choice",
        required: false,
        options: [
          { value: "nein", label: "Nein, alles unauffällig" },
          { value: "ja", label: "Ja, es gab Auffälligkeiten" },
          { value: "unbekannt", label: "Weiß ich nicht" },
        ],
      },
      {
        id: "SGL-GEB-08b",
        frage: "Welche Auffälligkeiten?",
        type: "text",
        required: false,
        condition: { field: "SGL-GEB-08", equals: "ja" },
      },
    ],
  },
  {
    key: "neonatal",
    titel: "Die ersten Lebenswochen",
    fragen: [
      {
        id: "SGL-NEO-01",
        frage: "Hatte Ihr Kind eine Neugeborenen-Gelbsucht?",
        type: "single_choice",
        required: false,
        options: [
          { value: "nein", label: "Nein" },
          { value: "leicht", label: "Ja, leicht (ohne Behandlung)" },
          { value: "lichttherapie", label: "Ja, mit Lichttherapie" },
        ],
      },
      {
        id: "SGL-NEO-02",
        frage: "War Ihr Kind auf einer Frühchen-/Intensivstation?",
        type: "yes_no",
        required: false,
      },
      {
        id: "SGL-NEO-02b",
        frage: "Warum und wie lange?",
        type: "text",
        required: false,
        condition: { field: "SGL-NEO-02", equals: true },
      },
    ],
  },
  {
    key: "ernaehrung",
    titel: "Stillen, Trinken & Verdauung",
    fragen: [
      {
        id: "SGL-ERN-01",
        frage: "Wie wird Ihr Kind ernährt?",
        type: "single_choice",
        required: true,
        options: [
          { value: "gestillt", label: "Gestillt" },
          { value: "flasche", label: "Flasche" },
          { value: "beides", label: "Beides" },
          { value: "beikost", label: "Schon (auch) Beikost" },
        ],
      },
      {
        id: "SGL-ERN-02",
        frage: "Gibt oder gab es Probleme beim Saugen oder Anlegen?",
        type: "yes_no",
        required: false,
      },
      {
        id: "SGL-ERN-02b",
        frage: "Trinkt Ihr Kind auf einer Seite deutlich schlechter?",
        type: "yes_no",
        required: false,
        condition: { field: "SGL-ERN-02", equals: true },
      },
      {
        id: "SGL-ERN-03",
        frage: "Spuckt Ihr Kind?",
        type: "single_choice",
        required: false,
        options: [
          { value: "kaum", label: "Kaum" },
          { value: "gelegentlich", label: "Gelegentlich" },
          { value: "haeufig", label: "Häufig / nach fast jeder Mahlzeit" },
        ],
      },
      {
        id: "SGL-ERN-04",
        frage: "Hat Ihr Kind Koliken oder starke Blähungen?",
        type: "yes_no",
        required: false,
      },
      {
        id: "SGL-ERN-05",
        frage: "Wie ist der Stuhlgang?",
        type: "single_choice",
        required: false,
        options: [
          { value: "unauffaellig", label: "Unauffällig" },
          { value: "hart_selten", label: "Eher hart / selten" },
          { value: "fluessig_haeufig", label: "Sehr flüssig / sehr häufig" },
        ],
      },
    ],
  },
  {
    key: "regulation",
    titel: "Schreien, Schlaf & Regulation",
    fragen: [
      {
        id: "SGL-REG-01",
        frage: "Schreit Ihr Kind mehr als 3 Stunden täglich an mehr als 3 Tagen pro Woche? (Dreier-Regel nach Wessel, 1954)",
        type: "yes_no",
        required: false,
      },
      {
        id: "SGL-REG-02",
        frage: "Wie gut lässt sich Ihr Kind beruhigen?",
        type: "single_choice",
        required: false,
        options: [
          { value: "leicht", label: "Meist leicht" },
          { value: "mit_muehe", label: "Nur mit Mühe" },
          { value: "kaum", label: "Kaum zu beruhigen" },
        ],
      },
      {
        id: "SGL-REG-03",
        frage: "Wie schläft Ihr Kind?",
        type: "single_choice",
        required: false,
        options: [
          { value: "gut", label: "Gut / altersgerecht" },
          { value: "unruhig", label: "Unruhig, wacht sehr oft auf" },
          { value: "sehr_schwierig", label: "Ein-/Durchschlafen sehr schwierig" },
        ],
      },
      {
        id: "SGL-REG-04",
        frage: "Überstreckt sich Ihr Kind häufig nach hinten (macht sich steif)?",
        type: "yes_no",
        required: false,
      },
    ],
  },
  {
    key: "entwicklung",
    titel: "Haltung & Entwicklung",
    fragen: [
      {
        id: "SGL-ENT-01",
        frage: "Schaut Ihr Kind bevorzugt zu einer Seite?",
        type: "single_choice",
        required: true,
        options: [
          { value: "nein", label: "Nein, beide Seiten gleich" },
          { value: "links", label: "Ja, bevorzugt nach links" },
          { value: "rechts", label: "Ja, bevorzugt nach rechts" },
        ],
      },
      {
        id: "SGL-ENT-02",
        frage: "Ist der Hinterkopf abgeflacht?",
        type: "single_choice",
        required: false,
        options: [
          { value: "nein", label: "Nein" },
          { value: "mittig", label: "Ja, mittig" },
          { value: "einseitig", label: "Ja, einseitig" },
        ],
      },
      {
        id: "SGL-ENT-03",
        frage: "Bewegt Ihr Kind Arme und Beine auf beiden Seiten gleich gut?",
        type: "single_choice",
        required: false,
        options: [
          { value: "ja", label: "Ja" },
          { value: "unsicher", label: "Bin unsicher" },
          { value: "nein", label: "Nein, eine Seite bewegt sich weniger" },
        ],
      },
      {
        id: "SGL-ENT-04",
        frage: "Verläuft die Entwicklung bisher altersgerecht (Kopf heben, Drehen, Greifen …)?",
        type: "single_choice",
        required: false,
        options: [
          { value: "ja", label: "Ja, soweit altersgerecht" },
          { value: "unsicher", label: "Bin unsicher" },
          { value: "nein", label: "Nein, mir/uns ist etwas aufgefallen" },
        ],
      },
      {
        id: "SGL-ENT-04b",
        frage: "Was ist Ihnen aufgefallen?",
        type: "text",
        required: false,
        condition: { field: "SGL-ENT-04", equals: "nein" },
      },
    ],
  },
  {
    key: "vorsorge",
    titel: "Vorsorge & Medizinisches",
    fragen: [
      {
        id: "SGL-U-01",
        frage: "Waren die bisherigen U-Untersuchungen unauffällig?",
        type: "single_choice",
        required: false,
        options: [
          { value: "ja", label: "Ja, alle unauffällig" },
          { value: "auffaellig", label: "Es gab Auffälligkeiten" },
          { value: "unbekannt", label: "Weiß ich nicht genau" },
        ],
      },
      {
        id: "SGL-U-01b",
        frage: "Welche Auffälligkeiten?",
        type: "text",
        required: false,
        condition: { field: "SGL-U-01", equals: "auffaellig" },
      },
      {
        id: "SGL-U-02",
        frage: "Ergebnis des Hüft-Ultraschalls (meist bei der U3)?",
        type: "single_choice",
        required: false,
        options: [
          { value: "unauffaellig", label: "Unauffällig" },
          { value: "auffaellig", label: "Auffällig / Kontrolle nötig" },
          { value: "steht_aus", label: "Steht noch aus" },
          { value: "unbekannt", label: "Weiß ich nicht" },
        ],
      },
      {
        id: "SGL-MED-01",
        frage: "Sind Erkrankungen bei Ihrem Kind bekannt?",
        type: "yes_no",
        required: false,
      },
      {
        id: "SGL-MED-01b",
        frage: "Welche?",
        type: "text",
        required: false,
        condition: { field: "SGL-MED-01", equals: true },
      },
      {
        id: "SGL-MED-02",
        frage: "Bekommt Ihr Kind Medikamente?",
        type: "yes_no",
        required: false,
      },
      {
        id: "SGL-MED-02b",
        frage: "Welche?",
        type: "text",
        required: false,
        condition: { field: "SGL-MED-02", equals: true },
      },
      {
        id: "SGL-FAM-01",
        frage: "Gibt es relevante Erkrankungen in der Familie (z.B. Hüftdysplasie, Skoliose, Allergien)?",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    key: "sicherheit",
    titel: "Sicherheitsfragen",
    beschreibung:
      "Diese Fragen dienen der Sicherheit Ihres Kindes. Bei bestimmten Antworten empfehlen wir sofort ärztliche Abklärung — die Osteopathie ersetzt in diesen Fällen NICHT den Kinderarzt.",
    fragen: [
      { id: "SGL-RF-01", frage: "Hat Ihr Kind aktuell Fieber (ab 38 °C) UND ist jünger als 3 Monate?", type: "yes_no", required: true },
      { id: "SGL-RF-02", frage: "Verweigert Ihr Kind das Trinken oder hat deutlich weniger nasse Windeln als sonst?", type: "yes_no", required: true },
      { id: "SGL-RF-03", frage: "Ist Ihr Kind ungewöhnlich schlapp, teilnahmslos oder schwer aufzuwecken?", type: "yes_no", required: true },
      { id: "SGL-RF-04", frage: "Erbricht Ihr Kind wiederholt im hohen Bogen (schwallartig)?", type: "yes_no", required: true },
      { id: "SGL-RF-05", frage: "Ist die Fontanelle (weiche Stelle am Kopf) vorgewölbt/gespannt, oder schreit Ihr Kind ungewöhnlich schrill?", type: "yes_no", required: true },
      { id: "SGL-RF-06", frage: "Gab es Atemaussetzer, Blaufärbung oder einen Krampfanfall?", type: "yes_no", required: true },
    ],
  },
];

/** Red-Flag-Zuordnung: jede "ja"-Antwort löst den Wächter aus. */
export const SAEUGLING_RED_FLAGS = [
  {
    id: "SGL-RF-01",
    hinweis:
      "Fieber bei einem Säugling unter 3 Monaten — bitte SOFORT kinderärztliche Abklärung / Notaufnahme (nicht warten).",
  },
  {
    id: "SGL-RF-02",
    hinweis:
      "Trinkverweigerung / Zeichen von Flüssigkeitsmangel — bitte umgehend Kinderärztin/Kinderarzt kontaktieren.",
  },
  {
    id: "SGL-RF-03",
    hinweis:
      "Auffällige Schläfrigkeit/Teilnahmslosigkeit — bitte SOFORT ärztlich abklären lassen (im Zweifel 112).",
  },
  {
    id: "SGL-RF-04",
    hinweis:
      "Wiederholtes schwallartiges Erbrechen — bitte zeitnah kinderärztlich abklären lassen.",
  },
  {
    id: "SGL-RF-05",
    hinweis:
      "Vorgewölbte Fontanelle oder schrilles Schreien — bitte SOFORT ärztlich abklären lassen (im Zweifel 112).",
  },
  {
    id: "SGL-RF-06",
    hinweis:
      "Atemaussetzer, Blaufärbung oder Krampfanfall — bitte 112 anrufen bzw. sofort in die Notaufnahme.",
  },
];

export const SAEUGLING_INTRO = {
  titel: "Anamnese für Ihr Kind",
  beschreibung:
    "Sie füllen diese Anamnese als Elternteil für Ihr Baby aus. Nehmen Sie sich etwa 10 Minuten Zeit — je genauer Ihre Angaben, desto gezielter kann unser Kinderosteopathie-Team (OST-PÄD OAM) helfen. Wenn Sie etwas nicht wissen: einfach 'Weiß ich nicht' wählen oder frei lassen.",
};
