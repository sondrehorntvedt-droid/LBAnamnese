/**
 * LINDEBERGS OS — Online-Anamnese
 * Modul A04: 7-FAKTOREN-SELBSTEINSCHÄTZUNG (Fossum / Lindebergs)
 * ES-Module-Kopie — Inhalt 1:1 identisch zur kanonischen Quelle.
 */

export const SIEBEN_FAKTOREN_INTRO = {
  titel: "Wie geht es Ihnen wirklich?",
  beschreibung: "Die folgenden 7 Fragen geben uns ein Bild Ihrer gesamten Lebensqualität — nicht nur körperlich, sondern als ganzer Mensch. Bitte bewerten Sie ehrlich, wie es Ihnen in den letzten 4 Wochen im Durchschnitt gegangen ist.",
  skala: "0 = trifft gar nicht zu / sehr schlecht · 10 = trifft vollständig zu / ausgezeichnet"
};

export const SIEBEN_FAKTOREN_FRAGEN = [
  {
    id: "F1-RELIEF",
    faktor: "Relief",
    faktor_nr: 1,
    icon: "🧘",
    titel: "Wohlbefinden & Schmerzfreiheit",
    frage: "Wie schmerzfrei und körperlich wohl fühlen Sie sich in Ihrem Alltag?",
    beschreibung: "Wie sehr beeinflussen Schmerzen, Verspannungen oder körperliche Beschwerden Ihren Alltag?",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: true,
    labels: {
      0: "Starke Schmerzen, erhebliche Einschränkung",
      5: "Gelegentliche Beschwerden",
      10: "Vollständig schmerzfrei und wohl"
    },
    follow_up: {
      id: "F1-RELIEF-b",
      frage: "In welchen Situationen fühlen Sie sich am wohlsten / am wenigsten in Schmerzen?",
      type: "textarea",
      required: false,
      placeholder: "z.B. beim Spazierengehen, nach einem Bad, morgens nach guter Nacht..."
    }
  },
  {
    id: "F2-RANGE",
    faktor: "Range",
    faktor_nr: 2,
    icon: "🤸",
    titel: "Beweglichkeit & Bewegungsfreiheit",
    frage: "Wie frei und beweglich fühlen Sie sich körperlich?",
    beschreibung: "Können Sie sich bewegen, wie Sie möchten? Gibt es Einschränkungen bei Alltagsbewegungen, Sport oder bestimmten Aktivitäten?",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: true,
    labels: {
      0: "Stark eingeschränkt — viele Dinge nicht möglich",
      5: "Einige Einschränkungen",
      10: "Vollständig frei und beweglich"
    },
    follow_up: {
      id: "F2-RANGE-b",
      frage: "Welche Bewegungen oder Aktivitäten können Sie nicht (mehr) so ausführen, wie Sie möchten?",
      type: "textarea",
      required: false,
      placeholder: "z.B. Treppensteigen, Bücken, Sport, Autofahren, Schlafen in bestimmten Positionen..."
    }
  },
  {
    id: "F3-RHYTHM",
    faktor: "Rhythm",
    faktor_nr: 3,
    icon: "🌙",
    titel: "Lebensrhythmus & Erholung",
    frage: "Wie gut ist Ihr Schlaf-Wach-Rhythmus und Ihre Fähigkeit zur Erholung?",
    beschreibung: "Schlafen Sie gut? Erholen Sie sich ausreichend? Haben Sie einen guten Tagesrhythmus?",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: true,
    labels: {
      0: "Chaotischer Rhythmus, kein Schlaf, keine Erholung",
      5: "Schwankend — manche Nächte gut, manche schlecht",
      10: "Ausgezeichneter Schlaf, guter Rhythmus, erholt"
    },
    follow_up: {
      id: "F3-RHYTHM-b",
      frage: "Was stört Ihren Rhythmus am meisten?",
      type: "multiple_choice",
      required: false,
      options: [
        { value: "einschlafen", label: "Einschlafprobleme" },
        { value: "durchschlafen", label: "Durchschlafprobleme" },
        { value: "arbeit_rhythmus", label: "Unregelmäßige Arbeitszeiten / Schichtarbeit" },
        { value: "stress", label: "Stress und Grübeln" },
        { value: "schmerz_nacht", label: "Schmerzen in der Nacht" },
        { value: "kinder", label: "Kleine Kinder / Familie" },
        { value: "nichts", label: "Nichts Wesentliches" }
      ]
    }
  },
  {
    id: "F4-REGULATION",
    faktor: "Regulation",
    faktor_nr: 4,
    icon: "⚖️",
    titel: "Selbstregulation & inneres Gleichgewicht",
    frage: "Wie gut können Sie sich selbst regulieren — körperlich und emotional?",
    beschreibung: "Gemeint ist Ihre Fähigkeit, mit Stress umzugehen, Ihr vegetatives Nervensystem zu beruhigen und emotional in der Mitte zu bleiben.",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: true,
    labels: {
      0: "Völlig aus dem Gleichgewicht — kaum regulierbar",
      5: "Teilweise — manchmal gut, manchmal überwältigt",
      10: "Sehr gut — ruhig und zentriert auch unter Druck"
    },
    follow_up: {
      id: "F4-REGULATION-b",
      frage: "Was hilft Ihnen, sich zu regulieren und zu beruhigen?",
      type: "textarea",
      required: false,
      placeholder: "z.B. Meditation, Spaziergang, Sport, Musik, Natur, Atemübungen, Gespräche..."
    }
  },
  {
    id: "F5-REENERGIZE",
    faktor: "Re-Energize",
    faktor_nr: 5,
    icon: "⚡",
    titel: "Energie & Vitalität",
    frage: "Wie hoch ist Ihr Energieniveau? Wie gut können Sie sich regenerieren?",
    beschreibung: "Fühlen Sie sich vital und haben ausreichend Energie für Alltag und das, was Ihnen wichtig ist?",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: true,
    labels: {
      0: "Chronisch erschöpft — kaum Energie für den Alltag",
      5: "Mittelmäßig — genug für das Nötigste",
      10: "Voller Energie und Lebensfreude"
    },
    follow_up: {
      id: "F5-REENERGIZE-b",
      frage: "Wann fühlen Sie sich am energiereichsten?",
      type: "single_choice",
      required: false,
      options: [
        { value: "morgens", label: "Morgens" },
        { value: "mittags", label: "Mittags" },
        { value: "abends", label: "Abends" },
        { value: "nach_sport", label: "Nach Sport / Bewegung" },
        { value: "nach_erholung", label: "Nach Erholung / Urlaub" },
        { value: "nie", label: "Eigentlich nie wirklich energiegeladen" }
      ]
    }
  },
  {
    id: "F6-RELATIONS",
    faktor: "Relations",
    faktor_nr: 6,
    icon: "❤️",
    titel: "Soziale Verbindungen & Beziehungen",
    frage: "Wie erfüllend sind Ihre sozialen Beziehungen und Verbindungen zu anderen Menschen?",
    beschreibung: "Forschung zeigt: Soziale Verbindung ist einer der stärksten Einflussfaktoren auf Gesundheit, Schmerzwahrnehmung und Heilung.",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: true,
    labels: {
      0: "Sehr isoliert / einsam / Beziehungsprobleme belasten stark",
      5: "Einige Beziehungen, aber auch Einsamkeit oder Konflikte",
      10: "Sehr verbunden, unterstützende und erfüllende Beziehungen"
    },
    follow_up: {
      id: "F6-RELATIONS-b",
      frage: "Belasten Sie aktuelle Beziehungssituationen (Familie, Partnerschaft, Arbeit)?",
      type: "single_choice",
      required: false,
      options: [
        { value: "nein", label: "Nein — meine Beziehungen sind gut" },
        { value: "leicht", label: "Leicht — kleine Spannungen, aber insgesamt gut" },
        { value: "moderat", label: "Moderat — belastende Situation" },
        { value: "stark", label: "Stark — sehr belastende Beziehungssituation" }
      ]
    }
  },
  {
    id: "F7-RISE",
    faktor: "Rise",
    faktor_nr: 7,
    icon: "🌱",
    titel: "Lebenssinn, Motivation & Wachstum",
    frage: "Wie stark erleben Sie Sinn, Motivation und persönliches Wachstum in Ihrem Leben?",
    beschreibung: "Viktor Frankl: 'Wer ein Warum hat zu leben, erträgt fast jedes Wie.' Lebenssinn ist ein mächtiger Gesundheitsfaktor.",
    type: "vas_scale",
    min: 0,
    max: 10,
    required: true,
    labels: {
      0: "Kaum Sinn oder Motivation — Zukunft erscheint leer",
      5: "Phasenweise sinnvoll und motiviert",
      10: "Starkes Sinnerleben, voller Motivation und Lebensfreude"
    },
    follow_up: {
      id: "F7-RISE-b",
      frage: "Was gibt Ihrem Leben am meisten Sinn und Bedeutung?",
      type: "textarea",
      required: false,
      placeholder: "z.B. Familie, Arbeit, Kreativität, Natur, Spiritualität, Gemeinschaft..."
    }
  }
];

// Auswertungsfunktion — erstellt 7-Faktoren-Profil für PDF und CDSS
export function compute7FaktorenProfil(antworten) {
  const faktoren = ["F1-RELIEF", "F2-RANGE", "F3-RHYTHM", "F4-REGULATION", "F5-REENERGIZE", "F6-RELATIONS", "F7-RISE"];
  const namen = { "F1-RELIEF": "Relief", "F2-RANGE": "Range", "F3-RHYTHM": "Rhythm", "F4-REGULATION": "Regulation", "F5-REENERGIZE": "Re-Energize", "F6-RELATIONS": "Relations", "F7-RISE": "Rise" };
  const profil = {};
  let gesamt = 0;

  faktoren.forEach(id => {
    const wert = antworten[id] ?? null;
    profil[namen[id]] = wert;
    if (wert !== null) gesamt += wert;
  });

  const ausgefuellt = Object.values(profil).filter(v => v !== null).length;
  const gesamt_prozent = ausgefuellt > 0 ? Math.round((gesamt / (ausgefuellt * 10)) * 100) : null;

  const schwachstellen = Object.entries(profil)
    .filter(([_, v]) => v !== null && v <= 4)
    .map(([k]) => k);

  const staerken = Object.entries(profil)
    .filter(([_, v]) => v !== null && v >= 8)
    .map(([k]) => k);

  return { profil, gesamt_prozent, schwachstellen, staerken };
}
