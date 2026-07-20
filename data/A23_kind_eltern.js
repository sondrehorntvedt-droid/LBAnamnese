/**
 * A23 — KINDER-ANAMNESE 2–11 JAHRE (Eltern-Fremdanamnese, gern gemeinsam
 * mit dem Kind)
 *
 * Advisory-Board-Entscheid (Kinderosteopathie OST-PÄD): Der Säuglingsbogen
 * (A16, 0–24 Monate) passt inhaltlich nicht für ältere Kinder (Geburt/
 * Stillen/Meilensteine des 1. Lebensjahres). Für 2–11 Jahre braucht es einen
 * eigenen Bogen mit den häufigsten pädiatrischen Themen: Haltung/Skoliose,
 * Kopf- & Bauchschmerz (häufigste wiederkehrende Schmerzen im Schulalter),
 * Infekthäufigkeit, Entwicklung, Schlaf, Bewegung/Medien, Schule/Kita.
 * Ab ~12 Jahren füllt der/die Jugendliche die Erwachsenen-Anamnese selbst
 * aus (mit Einverständnis der Sorgeberechtigten, siehe PT-004/PT-005).
 *
 * STATUS: VORLÄUFIG — fachlicher Feinschliff durch das Lindebergs-
 * Kinderosteopathie-Team (OST-PÄD OAM) steht aus.
 *
 * DETERMINISTISCH: reine Fragedefinition, keine Bewertung.
 */

export const KIND_INTRO = {
  titel: "Anamnese für Ihr Kind (2–11 Jahre)",
  beschreibung:
    "Sie füllen diese Anamnese als Elternteil aus — ab dem Schulalter gern gemeinsam mit Ihrem Kind. Nehmen Sie sich etwa 8 Minuten Zeit. Wenn Sie etwas nicht wissen: einfach frei lassen.",
};

export const KIND_ABSCHNITTE = [
  {
    titel: "Anliegen & Beschwerde",
    fragen: [
      {
        id: "KD-001",
        frage: "Weshalb kommen Sie mit Ihrem Kind zu uns? (Mehrfachauswahl möglich)",
        type: "multiple_choice",
        required: true,
        options: [
          { value: "haltung", label: "Haltung / „schiefer“ Rücken / Skoliose-Verdacht" },
          { value: "kopfschmerz", label: "Kopfschmerzen / Migräne" },
          { value: "bauchschmerz", label: "Wiederkehrende Bauchschmerzen" },
          { value: "ruecken", label: "Rücken- oder Nackenschmerzen" },
          { value: "gelenke", label: "Gelenk- oder Wachstumsschmerzen (z.B. Knie, Fersen)" },
          { value: "unfall", label: "Nach Sturz / Unfall / Sportverletzung" },
          { value: "fuesse", label: "Füße / Beinachsen (Knick-Senk-Fuß, X-/O-Beine, Zehengang)" },
          { value: "kiefer", label: "Kiefer / Zähne / Zahnspange" },
          { value: "konzentration", label: "Konzentration / Unruhe / Schule" },
          { value: "infekte", label: "Häufige Infekte (Ohren, Hals, Atemwege)" },
          { value: "verdauung", label: "Verdauung / Stuhlgang / Einnässen" },
          { value: "schlaf", label: "Schlafprobleme" },
        ],
        allow_sonstiges: true,
      },
      {
        id: "KD-002",
        frage: "Beschreiben Sie das Anliegen in Ihren eigenen Worten (seit wann, wie oft, was hilft?)",
        type: "textarea",
        required: false,
        placeholder: "z.B. Seit einem halben Jahr klagt sie nach der Schule über Kopfschmerzen, etwa 2×/Woche …",
      },
      {
        id: "KD-003",
        frage: "Wie stark beeinträchtigt das Ihr Kind im Alltag (Schule, Spielen, Sport)?",
        type: "single_choice",
        required: false,
        options: [
          { value: "kaum", label: "Kaum" },
          { value: "etwas", label: "Etwas" },
          { value: "deutlich", label: "Deutlich (fehlt in Schule/Sport)" },
        ],
      },
    ],
  },
  {
    titel: "Entwicklung & Geburt (kurz)",
    fragen: [
      {
        id: "KD-010",
        frage: "Gab es Besonderheiten bei Schwangerschaft oder Geburt? (z.B. Frühgeburt, Kaiserschnitt, Saugglocke)",
        type: "single_choice",
        required: false,
        options: [
          { value: "nein", label: "Nein / nichts Besonderes" },
          { value: "ja", label: "Ja" },
          { value: "unbekannt", label: "Weiß ich nicht" },
        ],
      },
      {
        id: "KD-011",
        frage: "Falls ja: Was?",
        type: "textarea",
        required: false,
        condition: { field: "KD-010", equals: "ja" },
      },
      {
        id: "KD-012",
        frage: "Verlief die motorische Entwicklung (Krabbeln, Laufen) und die Sprachentwicklung unauffällig?",
        type: "single_choice",
        required: false,
        options: [
          { value: "ja", label: "Ja, unauffällig" },
          { value: "verzoegert", label: "Teilweise verzögert / auffällig" },
          { value: "unbekannt", label: "Weiß ich nicht" },
        ],
      },
      {
        id: "KD-013",
        frage: "Falls auffällig: Was und gab es Therapien (Ergo, Logo, Physio)?",
        type: "textarea",
        required: false,
        condition: { field: "KD-012", equals: "verzoegert" },
      },
    ],
  },
  {
    titel: "Gesundheit & Vorgeschichte",
    fragen: [
      {
        id: "KD-020",
        frage: "Wie oft ist Ihr Kind erkältet / hat Infekte (Ohren, Hals, Atemwege)?",
        type: "single_choice",
        required: false,
        options: [
          { value: "selten", label: "Selten (0–3×/Jahr)" },
          { value: "normal", label: "Normal für das Alter (4–8×/Jahr)" },
          { value: "haeufig", label: "Häufig (öfter, oft mit Antibiotika)" },
        ],
      },
      {
        id: "KD-021",
        frage: "Bestehen Allergien, Neurodermitis oder Asthma?",
        type: "multiple_choice",
        required: false,
        options: [
          { value: "allergie", label: "Allergien (Heuschnupfen, Lebensmittel …)" },
          { value: "neurodermitis", label: "Neurodermitis" },
          { value: "asthma", label: "Asthma" },
          { value: "keine", label: "Nein, nichts davon" },
        ],
      },
      {
        id: "KD-022",
        frage: "Nimmt Ihr Kind regelmäßig Medikamente?",
        type: "yes_no",
        required: false,
      },
      {
        id: "KD-023",
        frage: "Falls ja: Welche?",
        type: "textarea",
        required: false,
        condition: { field: "KD-022", equals: true },
      },
      {
        id: "KD-024",
        frage: "Gab es Operationen, Krankenhausaufenthalte oder größere Unfälle/Stürze?",
        type: "yes_no",
        required: false,
      },
      {
        id: "KD-025",
        frage: "Falls ja: Was und wann?",
        type: "textarea",
        required: false,
        condition: { field: "KD-024", equals: true },
      },
      {
        id: "KD-026",
        frage: "Sind die empfohlenen Vorsorgeuntersuchungen (U-Untersuchungen) aktuell?",
        type: "single_choice",
        required: false,
        options: [
          { value: "ja", label: "Ja" },
          { value: "teilweise", label: "Teilweise" },
          { value: "unbekannt", label: "Weiß ich nicht" },
        ],
      },
    ],
  },
  {
    titel: "Verdauung, Schlaf & Alltag",
    fragen: [
      {
        id: "KD-030",
        frage: "Hat Ihr Kind regelmäßig Bauchschmerzen, Verstopfung oder Durchfall?",
        type: "single_choice",
        required: false,
        options: [
          { value: "nein", label: "Nein" },
          { value: "gelegentlich", label: "Gelegentlich" },
          { value: "haeufig", label: "Häufig (mehrmals pro Woche)" },
        ],
      },
      {
        id: "KD-031",
        frage: "Nässt Ihr Kind noch ein (tags oder nachts)?",
        type: "single_choice",
        required: false,
        options: [
          { value: "nein", label: "Nein" },
          { value: "nachts", label: "Nachts gelegentlich" },
          { value: "haeufig", label: "Häufiger / auch tagsüber" },
        ],
      },
      {
        id: "KD-032",
        frage: "Wie schläft Ihr Kind?",
        type: "single_choice",
        required: false,
        options: [
          { value: "gut", label: "Gut, durchgehend" },
          { value: "einschlaf", label: "Einschlafprobleme" },
          { value: "durchschlaf", label: "Wacht oft auf / Albträume" },
        ],
      },
      {
        id: "KD-033",
        frage: "Wie viel bewegt sich Ihr Kind (Sport, draußen spielen)?",
        type: "single_choice",
        required: false,
        options: [
          { value: "viel", label: "Viel (täglich aktiv, Verein)" },
          { value: "mittel", label: "Mittel" },
          { value: "wenig", label: "Wenig (überwiegend drinnen/sitzend)" },
        ],
      },
      {
        id: "KD-034",
        frage: "Wie viel Bildschirmzeit hat Ihr Kind ungefähr pro Tag?",
        type: "single_choice",
        required: false,
        options: [
          { value: "unter1", label: "Unter 1 Stunde" },
          { value: "1_2", label: "1–2 Stunden" },
          { value: "ueber2", label: "Mehr als 2 Stunden" },
        ],
      },
      {
        id: "KD-035",
        frage: "Fühlt sich Ihr Kind in Schule/Kita wohl?",
        type: "single_choice",
        required: false,
        options: [
          { value: "ja", label: "Ja" },
          { value: "teils", label: "Teils-teils" },
          { value: "nein", label: "Eher nicht (Stress, Mobbing, Ängste)" },
        ],
      },
    ],
  },
  {
    titel: "Warnzeichen (bitte ehrlich beantworten)",
    fragen: [
      {
        id: "KD-RF-01",
        frage: "Hat Ihr Kind Fieber über mehrere Tage ohne klare Ursache?",
        type: "yes_no",
        required: false,
      },
      {
        id: "KD-RF-02",
        frage: "Hat Ihr Kind ungewollt Gewicht verloren oder wirkt zunehmend schlapp/blass?",
        type: "yes_no",
        required: false,
      },
      {
        id: "KD-RF-03",
        frage: "Wacht Ihr Kind nachts wegen Schmerzen auf (nicht nur einmalig)?",
        type: "yes_no",
        required: false,
      },
      {
        id: "KD-RF-04",
        frage: "Bestehen Lähmungen, Taubheitsgefühle, starke Kopfschmerzen mit Erbrechen oder Gangunsicherheit?",
        type: "yes_no",
        required: false,
      },
    ],
  },
];

/** Kinder-Red-Flags: bei „Ja" sofortiger Hinweis auf ärztliche Abklärung. */
export const KIND_RED_FLAGS = [
  { id: "KD-RF-01", hinweis: "Fieber über mehrere Tage ohne klare Ursache gehört zeitnah in ärztliche Abklärung (Kinderarzt/-ärztin)." },
  { id: "KD-RF-02", hinweis: "Ungewollter Gewichtsverlust / zunehmende Blässe und Schlappheit beim Kind: bitte zeitnah kinderärztlich abklären (u.a. Blutbild)." },
  { id: "KD-RF-03", hinweis: "Nächtliche Schmerzen, die das Kind wecken, sind beim Kind ein Warnzeichen — bitte vor einer Behandlung ärztlich abklären." },
  { id: "KD-RF-04", hinweis: "Neurologische Auffälligkeiten (Lähmung, Taubheit, starke Kopfschmerzen mit Erbrechen, Gangunsicherheit): bitte UMGEHEND ärztlich vorstellen." },
];
