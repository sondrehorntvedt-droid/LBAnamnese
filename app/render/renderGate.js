/**
 * LINDEBERGS OS — Block-Gate (Baum-Logik für ganze Abschnitte)
 *
 * Rendert eine Gate-Frage (yes_no); der gesamte nachfolgende Block wird nur
 * angezeigt, wenn das Gate mit „Ja" beantwortet ist. Anders als das
 * feld-weise hinterGate() (app/conditions.js) klappt hier der KOMPLETTE Block
 * inklusive seiner Zwischenüberschriften zu — nötig überall, wo der Inhalt
 * eigene section-Header einzieht (Sport-Performance, Ernährungs-Tiefe), damit
 * bei „Nein" keine leeren Überschriften stehen bleiben.
 *
 * Deterministisch/rein visuell: schaltet nur die Sichtbarkeit; die
 * Antwortwerte im State bleiben unberührt, keine Bewertung.
 */
import { renderFragenListe } from "./renderFragenListe.js";
import { state } from "../state.js";
import { evaluateCondition } from "../conditions.js";

/**
 * @param {HTMLElement} container   Ziel
 * @param {object} gateFrage        yes_no-Frage mit eindeutiger id
 * @param {(wrap:HTMLElement)=>Function} innerFn  rendert den Block, gibt cleanup zurück
 * @returns {Function} cleanup
 */
export function renderGatedBlock(container, gateFrage, innerFn) {
  const cleanups = [];
  cleanups.push(renderFragenListe(container, [gateFrage]));

  const wrap = document.createElement("div");
  container.appendChild(wrap);
  const innerCleanup = innerFn(wrap);
  if (innerCleanup) cleanups.push(innerCleanup);

  const cond = { field: gateFrage.id, equals: true };
  const update = () => {
    wrap.style.display = evaluateCondition(cond, state.answers) ? "" : "none";
  };
  update();
  const unsub = state.subscribe(update);

  return () => {
    unsub();
    cleanups.forEach((fn) => fn && fn());
  };
}
