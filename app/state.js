/**
 * LINDEBERGS OS — Zentraler Antworten-Store
 *
 * Hält alle Patientenantworten (answers, keyed by Frage-ID, z.B. "SD-001")
 * plus Navigations-Meta (aktueller Schritt, gewählte Anamnese-Tiefe,
 * aktivierte Körperregionen/CDSS-Module). Persistiert in localStorage,
 * damit ein Patient die Anamnese unterbrechen und fortsetzen kann.
 *
 * WICHTIG (DSGVO): dieser Store enthält auch therapist_only-Werte (z.B.
 * PHQ4-1..4). Die Trennung "was darf der Patient sehen" passiert NICHT hier,
 * sondern ausschließlich in app/privacy.js beim Rendern der Zusammenfassung.
 */

const STORAGE_KEY = "lindebergs_anamnese_v1";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Anamnese-State konnte nicht geladen werden:", err);
    return null;
  }
}

class AnamneseState {
  constructor() {
    const saved = loadFromStorage();
    this.answers = saved?.answers ?? {};
    this.meta = {
      currentStepIndex: 0,
      tiefe: null, // "kurz" | "standard" | "deep_dive"
      aktivierteRegionen: [], // Werte aus HB-002 (Körperregion-Auswahl)
      aktivierteCdssModule: [], // z.B. ["04_hws", "01_schulter"]
      emergencyAcknowledged: [], // IDs bestätigter Red-Flag-Warnungen
      ...(saved?.meta ?? {}),
    };
    this.listeners = new Set();
  }

  save() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers: this.answers, meta: this.meta })
      );
    } catch (err) {
      console.warn("Anamnese-State konnte nicht gespeichert werden:", err);
    }
  }

  get(id) {
    return this.answers[id];
  }

  set(id, value) {
    this.answers[id] = value;
    this.save();
    this._notify(id, value);
  }

  setMeta(patch) {
    Object.assign(this.meta, patch);
    this.save();
    this._notify("__meta__", this.meta);
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  _notify(id, value) {
    this.listeners.forEach((fn) => fn(id, value, this.answers));
  }

  reset() {
    this.answers = {};
    this.meta = {
      currentStepIndex: 0,
      tiefe: null,
      aktivierteRegionen: [],
      aktivierteCdssModule: [],
      emergencyAcknowledged: [],
    };
    this.save();
    this._notify("__reset__", null);
  }
}

export const state = new AnamneseState();
