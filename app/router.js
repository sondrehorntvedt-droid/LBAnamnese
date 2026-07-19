/**
 * LINDEBERGS OS — Router
 *
 * Verwaltet die geordnete Liste aller Anamnese-Schritte (progressive
 * disclosure). Schritte werden von den jeweiligen Phasen-Modulen per
 * registerStep() eingetragen — der Router selbst kennt keine
 * Anamnese-Inhalte, nur die Navigations-Mechanik.
 *
 * Ein Schritt kann `isVisible(answers, meta)` definieren, um sich z.B. nur
 * bei gewählter "Deep Dive"-Tiefe oder nach Auswahl bestimmter
 * Körperregionen einzublenden (dynamische CDSS-Verzweigung, Phase 4/5).
 */

import { state } from "./state.js";

const steps = [];

export function registerStep(stepDef) {
  steps.push(stepDef);
}

export function getAllSteps() {
  return steps;
}

export function getVisibleSteps() {
  const tiefe = state.meta.anamneseTiefe || "ganzheitlich";
  return steps.filter((s) => {
    // Tier-Filter: ein Schritt mit `tiers`-Liste erscheint nur in diesen
    // Tiefe-Stufen. Ohne `tiers` ist der Schritt immer relevant (Kernfluss).
    if (s.tiers && !s.tiers.includes(tiefe)) return false;
    if (s.isVisible && !s.isVisible(state.answers, state.meta)) return false;
    return true;
  });
}

export function getCurrentStep() {
  const visible = getVisibleSteps();
  if (!visible.length) return null;
  const idx = Math.min(state.meta.currentStepIndex, visible.length - 1);
  return visible[idx];
}

export function getProgress() {
  const visible = getVisibleSteps();
  if (visible.length <= 1) return visible.length ? 100 : 0;
  const idx = Math.min(state.meta.currentStepIndex, visible.length - 1);
  return Math.round((idx / (visible.length - 1)) * 100);
}

export function canGoPrev() {
  return state.meta.currentStepIndex > 0;
}

export function canGoNext() {
  const visible = getVisibleSteps();
  return state.meta.currentStepIndex < visible.length - 1;
}

export function goNext() {
  if (!canGoNext()) return;
  state.setMeta({ currentStepIndex: state.meta.currentStepIndex + 1 });
}

export function goPrev() {
  if (!canGoPrev()) return;
  state.setMeta({ currentStepIndex: state.meta.currentStepIndex - 1 });
}

export function goToStepId(id) {
  const visible = getVisibleSteps();
  const idx = visible.findIndex((s) => s.id === id);
  if (idx >= 0) state.setMeta({ currentStepIndex: idx });
}

/**
 * Gruppiert die sichtbaren Schritte nach `step.group` (z.B. "Persönliches",
 * "Beschwerden") für die Sidebar-Navigation. Ein Schritt ohne `group`
 * bildet seine eigene Gruppe. Liefert je Gruppe: Titel, ob sie den
 * aktuellen Schritt enthält, ob sie vollständig hinter dem aktuellen
 * Schritt liegt ("erledigt"), und die Summe der geschätzten Minuten
 * (step.estMinutes) der noch nicht erledigten Schritte.
 */
export function getSidebarGroups() {
  const visible = getVisibleSteps();
  const currentIdx = Math.min(state.meta.currentStepIndex, visible.length - 1);

  const groups = [];
  const byName = new Map();
  visible.forEach((step, idx) => {
    const name = step.group || step.title || step.id;
    if (!byName.has(name)) {
      const g = { name, firstIdx: idx, lastIdx: idx };
      byName.set(name, g);
      groups.push(g);
    } else {
      byName.get(name).lastIdx = idx;
    }
  });

  let remainingMinutes = 0;
  visible.forEach((step, idx) => {
    if (idx >= currentIdx) remainingMinutes += step.estMinutes || 0;
  });

  return {
    remainingMinutes,
    groups: groups.map((g) => ({
      name: g.name,
      isCurrent: currentIdx >= g.firstIdx && currentIdx <= g.lastIdx,
      isDone: currentIdx > g.lastIdx,
    })),
  };
}
