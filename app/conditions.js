/**
 * LINDEBERGS OS — Bedingungs-Auswertung
 *
 * Es gibt zwei Bedingungs-Formate im Datensatz:
 *
 *  1) A00–A05 ("condition"): { field: "sd_geschlecht", equals: "f" }
 *     Die "field"-Namen sind semantische Aliase (z.B. "sd_geschlecht"),
 *     die NICHT identisch mit den Frage-IDs (z.B. "SD-004") sind — sie
 *     müssen über ID_ALIAS_MAP aufgelöst werden.
 *
 *  2) A06/A07/A09 ("bedingung", GELENKE_BAUM/SYSTEMISCH_BAUM): identisch zu
 *     der in A06_gelenke_baum.js definierten evalBedingung()-Logik.
 *     { feld, op, wert } mit op aus [">=","<=",">","<","==","in","includes","any"]
 *
 * Unbekannte/fehlende Aliase führen NICHT zum Absturz, sondern lassen die
 * betroffene Frage sichtbar (fail-open für Formular-Vollständigkeit; harte
 * Sicherheits-Regeln laufen ausschließlich über app/redflags.js).
 */

// Bekannte Alias-Zuordnungen aus A00–A05 (semantischer Name → Frage-ID)
export const ID_ALIAS_MAP = {
  sd_geschlecht: "SD-004",
  pmh_operiert: "PMH-003",
  pmh_unfaelle: "PMH-005",
  pmh_medikamente: "PMH-007",
  pmh_allergien: "PMH-011",
  hb_behandlung_bisher: "HB-014",
};

function resolveValue(field, answers) {
  if (field in answers) return answers[field];
  const aliasId = ID_ALIAS_MAP[field];
  if (aliasId && aliasId in answers) return answers[aliasId];
  return undefined;
}

/** Format 1 — A00–A05 "condition" Objekte */
export function evaluateCondition(condition, answers) {
  if (!condition) return true;

  // Verknüpfte Bedingungen (für Bereichs-Gates + eigene Detail-Bedingung):
  //   { all: [c1, c2] } → alle müssen zutreffen (UND)
  //   { any: [c1, c2] } → mindestens eine (ODER)
  if (Array.isArray(condition.all)) return condition.all.every((c) => evaluateCondition(c, answers));
  if (Array.isArray(condition.any)) return condition.any.some((c) => evaluateCondition(c, answers));

  const value = resolveValue(condition.field, answers);

  if ("equals" in condition) return value === condition.equals;
  if ("not_equal" in condition) {
    const list = Array.isArray(condition.not_equal) ? condition.not_equal : [condition.not_equal];
    return !list.includes(value);
  }
  if ("contains" in condition) {
    return Array.isArray(value) && value.includes(condition.contains);
  }
  // Unbekannter Operator → sichtbar lassen statt zu blockieren
  return true;
}

/**
 * Baum-Helfer: hängt jede Detailfrage hinter ein Bereichs-Gate. Erst wenn das
 * Gate (yes_no) mit „Ja" (true) beantwortet ist, werden die Felder sichtbar.
 * Eine bereits vorhandene eigene Bedingung der Frage bleibt erhalten
 * (UND-verknüpft über { all: [...] }). Spart dem Patienten Zeit, wenn der
 * Bereich für ihn kein Thema ist. Für flache Listen (renderFragenListe);
 * für Blöcke mit Zwischenüberschriften siehe render/renderGate.js.
 */
export function hinterGate(gateId, felder) {
  const gateCond = { field: gateId, equals: true };
  return felder.map((f) => ({
    ...f,
    condition: f.condition ? { all: [gateCond, f.condition] } : gateCond,
  }));
}

/** Format 2 — A06/A07/A09 "bedingung" Objekte ({feld, op, wert}) — identisch zu A06_gelenke_baum.js evalBedingung() */
export function evalBedingung(bedingung, kontext) {
  if (!bedingung) return true;
  const { feld, op, wert } = bedingung;
  const val = kontext[feld];
  // Numerische Vergleiche nur bei tatsächlich vorhandenem Zahlenwert auswerten.
  // Sonst würde z.B. `null <= 7` in JS zu `0 <= 7` (true) und Alters-/Dauer-
  // Zweige würden bei noch leerem Geburtsdatum/Onset fälschlich aufklappen.
  const istZahlOp = op === ">=" || op === "<=" || op === ">" || op === "<";
  if (istZahlOp && (val == null || val === "" || Number.isNaN(Number(val)))) return false;
  switch (op) {
    case ">=":
      return val >= wert;
    case "<=":
      return val <= wert;
    case ">":
      return val > wert;
    case "<":
      return val < wert;
    case "==":
      return val == wert;
    case "in":
      return Array.isArray(wert) && wert.includes(val);
    case "includes":
      return Array.isArray(val) && val.includes(wert);
    case "any":
      return Array.isArray(val) && wert.some((w) => val.includes(w));
    default:
      return false;
  }
}
