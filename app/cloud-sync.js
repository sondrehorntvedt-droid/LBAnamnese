/**
 * LINDEBERGS OS — Cloud-Sync je Benutzer
 *
 * Spiegelt den kompletten lokalen App-Zustand (die localStorage-Schlüssel
 * unten) als EINE JSONB-Zeile je Benutzer in public.anamnese_stand.
 *
 * Verhalten (bewusst einfach und vorhersagbar):
 *  - Beim Login: existiert ein Cloud-Stand, gewinnt die Cloud (lokale
 *    Schlüssel werden überschrieben). Existiert keiner, wird der lokale
 *    Stand hochgeladen. Da die App login-pflichtig ist, gibt es keinen
 *    "anonym ausgefüllten" Zustand, der verloren gehen könnte.
 *  - Danach: automatisches, entprelltes Speichern bei jeder Änderung
 *    (2 s), zusätzlich beim Verlassen/Ausblenden der Seite.
 *  - Konflikte bei Mehrgeräte-Nutzung: Last-Write-Wins (aktualisiert_am).
 *
 * Kein KI-/Interpretationsschritt — reine, deterministische Spiegelung.
 */
import { supabase } from "./supabase.js";

/** Alle localStorage-Schlüssel, die den Patientenzustand tragen. */
const SYNC_KEYS = ["lindebergs_anamnese_v1", "lindebergs_patientenakte"];

const APP_VERSION = "2026.07-supabase-1";
// Aktive Regelwerk-Version: wird in jeden gespeicherten Stand gestempelt,
// damit jede Auswertung später exakt reproduzierbar ist (siehe regelwerk/).
const REGELWERK_VERSION = "2026.07.19-6";

let aktuellerUserId = null;
let debounceTimer = null;
let pending = false;
const statusListeners = new Set();

let status = {
  zustand: "aus", // "aus" | "bereit" | "speichert" | "gespeichert" | "fehler"
  letzterSync: null, // ISO-Zeitpunkt des letzten erfolgreichen Uploads
  fehler: null,
};

function setStatus(patch) {
  status = { ...status, ...patch };
  statusListeners.forEach((fn) => fn(status));
}

export function getSyncStatus() {
  return status;
}

export function onSyncStatus(fn) {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

/** Lokalen Zustand als Objekt {schluessel: geparster Wert} einsammeln. */
function snapshotLokal() {
  const daten = {};
  SYNC_KEYS.forEach((key) => {
    const raw = localStorage.getItem(key);
    if (raw == null) return;
    try {
      daten[key] = JSON.parse(raw);
    } catch {
      daten[key] = raw; // defensiv: nie Daten verlieren, auch wenn kein JSON
    }
  });
  return daten;
}

/** Cloud-Stand in localStorage zurückschreiben. */
function restoreLokal(daten) {
  if (!daten || typeof daten !== "object") return;
  SYNC_KEYS.forEach((key) => {
    if (!(key in daten)) return;
    const wert = daten[key];
    localStorage.setItem(key, typeof wert === "string" ? wert : JSON.stringify(wert));
  });
}

/**
 * Beim Login aufrufen, BEVOR die App (state.js) initialisiert wird:
 * lädt den Cloud-Stand (Cloud gewinnt) oder lädt den lokalen Stand hoch.
 * Liefert {quelle: "cloud"|"lokal"|"leer", fehler?}.
 */
export async function initialSync(userId) {
  aktuellerUserId = userId;
  try {
    const { data, error } = await supabase
      .from("anamnese_stand")
      .select("daten, aktualisiert_am")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;

    if (data && data.daten && Object.keys(data.daten).length > 0) {
      restoreLokal(data.daten);
      setStatus({ zustand: "bereit", letzterSync: data.aktualisiert_am, fehler: null });
      return { quelle: "cloud" };
    }

    const lokal = snapshotLokal();
    if (Object.keys(lokal).length > 0) {
      await upload(lokal);
      return { quelle: "lokal" };
    }
    setStatus({ zustand: "bereit", fehler: null });
    return { quelle: "leer" };
  } catch (err) {
    console.warn("Cloud-Sync: Initial-Sync fehlgeschlagen:", err);
    setStatus({ zustand: "fehler", fehler: String(err?.message || err) });
    return { quelle: "lokal", fehler: err };
  }
}

async function upload(daten) {
  if (!aktuellerUserId) return;
  setStatus({ zustand: "speichert" });
  const { error } = await supabase.from("anamnese_stand").upsert({
    user_id: aktuellerUserId,
    daten: daten ?? snapshotLokal(),
    app_version: APP_VERSION,
    regelwerk_version: REGELWERK_VERSION,
    aktualisiert_am: new Date().toISOString(),
  });
  if (error) {
    console.warn("Cloud-Sync: Speichern fehlgeschlagen:", error);
    setStatus({ zustand: "fehler", fehler: error.message });
    return;
  }
  setStatus({ zustand: "gespeichert", letzterSync: new Date().toISOString(), fehler: null });
}

/** Entprelltes Speichern — von state.subscribe() getriggert. */
export function planeUpload() {
  if (!aktuellerUserId) return;
  pending = true;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    pending = false;
    upload();
  }, 2000);
}

/** Sofort speichern (Konto-Seite "Jetzt speichern", Logout, Seite verlassen). */
export async function flushUpload() {
  clearTimeout(debounceTimer);
  pending = false;
  await upload();
}

/**
 * Autosave verdrahten. `anamneseState` ist der Store aus app/state.js —
 * wird nach dem Login übergeben (die App startet erst nach initialSync).
 */
export function startAutoSync(anamneseState) {
  anamneseState.subscribe(() => planeUpload());
  // Beim Ausblenden/Verlassen der Seite letzten Stand sichern (best effort).
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && pending) flushUpload();
  });
  window.addEventListener("beforeunload", () => {
    if (pending) flushUpload();
  });
}

/** Abmelden: Stand sichern, lokale Patientendaten entfernen, neu laden. */
export async function logoutMitSync() {
  try {
    await flushUpload();
  } catch {
    // Abmelden darf nicht an einem Sync-Fehler scheitern.
  }
  SYNC_KEYS.forEach((key) => localStorage.removeItem(key));
  await supabase.auth.signOut();
  window.location.reload();
}
