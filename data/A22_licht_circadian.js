/**
 * A22 — LICHT, CIRCADIANE RHYTHMIK & SCHICHTARBEIT (Patienten-Fragen)
 *
 * Erfasst die im Alltag entscheidenden Licht-/Rhythmus-Faktoren, die in
 * klassischen Anamnesen fehlen: Schichtarbeit, Tageslichtmenge tagsüber,
 * Schlafzimmer-Dunkelheit, abendliche Lichtdämpfung. Ergänzt (nicht doppelt)
 * die Schlafhygiene aus A03 D1 (Morgenlicht D1-016, Bildschirm vor Schlaf
 * D1-014) und die Sonnen-/Hautexposition aus A11.
 *
 * Fachliche Anker (evidenzbasiert):
 *  - Morgen-/Tageslicht ankert die innere Uhr; Tageslichtmangel und Licht bei
 *    Nacht stören Schlaf und Glukoseregulation (Chronobiologie: Panda,
 *    Roenneberg; Melatonin: Reiter).
 *  - Schicht-/Nachtarbeit ist ein anerkannter circadianer Störfaktor mit
 *    kardiometabolischem und onkologischem Risiko (IARC Gruppe 2A).
 *
 * Frontier-/experimentelle Themen (deuteriumarmes/EZ-Wasser, Erdung, EMF,
 * Biophotonen) werden NUR als Therapeuten-Kontext erfasst (LR-FRONTIER) und
 * fließen bewusst NICHT in die deterministische Bewertung ein. Ebenso bleiben
 * die Biohacking-Angaben (LR-B-*) reiner Kontext.
 *
 * DETERMINISTISCH: reine Fragedefinition, keine Bewertung.
 */

// Bereichs-Gate (Baum-Logik): erst „Ja" öffnet den Licht-/Rhythmus-Block.
export const LICHT_GATE = {
  id: "LICHT-GATE",
  frage: "Möchten Sie Angaben zu Licht, Tagesrhythmus & Schichtarbeit machen? — bei „Nein“ überspringen wir diesen Teil.",
  type: "yes_no",
  required: false,
  section: "Licht & Rhythmus",
};

export const LICHT_FRAGEN = [
  // ── Kern (evidenzbasiert) ──────────────────────────────────
  {
    id: "LR-001",
    frage: "Arbeiten Sie in Schicht- oder Nachtdienst?",
    type: "single_choice",
    required: false,
    section: "Licht & Rhythmus",
    options: [
      { value: "keine", label: "Nein, geregelte Tagarbeit" },
      { value: "gelegentlich", label: "Gelegentlich Abend-/Nachtschichten" },
      { value: "wechselschicht", label: "Regelmäßige Wechselschicht" },
      { value: "dauernacht", label: "Überwiegend Dauer-Nachtschicht" },
    ],
  },
  {
    id: "LR-002",
    frage: "Wie viel Zeit verbringen Sie tagsüber draußen im Tageslicht (auch bei bewölktem Himmel)?",
    type: "single_choice",
    required: false,
    section: "Licht & Rhythmus",
    options: [
      { value: "unter30", label: "Weniger als 30 Minuten" },
      { value: "30_60", label: "30–60 Minuten" },
      { value: "1_2h", label: "1–2 Stunden" },
      { value: "ueber2h", label: "Mehr als 2 Stunden" },
    ],
  },
  {
    id: "LR-003",
    frage: "Wie ist Ihr Arbeits-/Alltagsplatz tagsüber beleuchtet?",
    type: "single_choice",
    required: false,
    section: "Licht & Rhythmus",
    options: [
      { value: "viel_tageslicht", label: "Viel Tageslicht (nah am Fenster/draußen)" },
      { value: "etwas_tageslicht", label: "Etwas Tageslicht" },
      { value: "kunstlicht", label: "Überwiegend Kunstlicht" },
      { value: "fensterlos", label: "Fensterloser Raum" },
    ],
  },
  {
    id: "LR-004",
    frage: "Wie dunkel ist Ihr Schlafzimmer nachts?",
    type: "single_choice",
    required: false,
    section: "Licht & Rhythmus",
    options: [
      { value: "dunkel", label: "Völlig dunkel" },
      { value: "leicht", label: "Leicht abgedunkelt" },
      { value: "restlicht", label: "Straßenlaterne/Restlicht dringt herein" },
      { value: "geraet", label: "Nachtlicht oder Gerät leuchtet" },
    ],
  },
  {
    id: "LR-005",
    frage: "Dämpfen Sie abends das Licht (gedimmt/warm) in der letzten Stunde vor dem Schlaf?",
    type: "yes_no",
    required: false,
    section: "Licht & Rhythmus",
  },

  // ── Optionaler Unter-Zweig: Biohacking + experimentelle Themen ──
  // Erscheint nur bei „Ja" (spart Zeit; hält den Kern schlank).
  {
    id: "LR-OPT",
    frage: "Möchten Sie optionale Themen angeben (Licht-Biohacking & experimentelle Praktiken)?",
    type: "yes_no",
    required: false,
    section: "Licht & Rhythmus",
  },
  {
    id: "LR-B-001",
    frage: "Nutzen Sie Rotlicht-/Nahinfrarot-Therapie (Panel/Lampe)?",
    type: "yes_no",
    required: false,
    section: "Licht & Rhythmus",
    condition: { field: "LR-OPT", equals: true },
  },
  {
    id: "LR-B-002",
    frage: "Nutzen Sie abends einen Blaulichtfilter (Brille oder Software)?",
    type: "yes_no",
    required: false,
    section: "Licht & Rhythmus",
    condition: { field: "LR-OPT", equals: true },
  },
  {
    id: "LR-FRONTIER",
    frage: "Experimentell (nur zur Einordnung, keine Bewertung): Nutzen Sie eines davon oder interessieren sich dafür?",
    type: "multiple_choice",
    required: false,
    section: "Licht & Rhythmus",
    condition: { field: "LR-OPT", equals: true },
    options: [
      { value: "deuterium", label: "Deuteriumarmes Wasser" },
      { value: "ez_wasser", label: "Strukturiertes Wasser (Exclusion-Zone)" },
      { value: "grounding", label: "Erdung (Grounding/Earthing)" },
      { value: "emf_schlaf", label: "EMF-Reduktion im Schlafzimmer" },
      { value: "biophotonen", label: "Biophotonen-/Lichtfeld-Themen" },
      { value: "nichts", label: "Nichts davon" },
    ],
  },
];
