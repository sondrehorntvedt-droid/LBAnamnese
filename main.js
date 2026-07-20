/**
 * LINDEBERGS OS — Online-Anamnese
 * Bootstrap: Auth-Gate → Cloud-Initial-Sync → App-Start
 *
 * Ablauf:
 *  1. Session prüfen. Ohne Anmeldung erscheint das Auth-Gate (app/auth.js).
 *  2. Nach Anmeldung: Cloud-Stand laden (Cloud gewinnt) bzw. lokalen Stand
 *     hochladen (app/cloud-sync.js).
 *  3. Erst DANACH wird die eigentliche App dynamisch importiert
 *     (app/boot.js), damit der Antworten-Store den richtigen Stand liest.
 */
import { getSession } from "./app/supabase.js";
import { renderAuthGate } from "./app/auth.js";
import { initialSync } from "./app/cloud-sync.js";
import { initTheme } from "./app/theme.js";
import { DEMO_MODUS } from "./app/demo.js";

const root = document.getElementById("app");

// Hell/Dunkel-Umschalter sofort aktivieren — sichtbar auf JEDER Seite,
// auch vor dem Login (Patientenwunsch: immer oben in der Ecke wechselbar).
initTheme();

function zeigeLadehinweis(text) {
  root.innerHTML = "";
  const seite = document.createElement("div");
  seite.className = "auth-seite";
  const p = document.createElement("p");
  p.className = "tagline";
  p.textContent = text;
  seite.appendChild(p);
  root.appendChild(seite);
}

async function starteNachLogin(session) {
  zeigeLadehinweis("Ihre Akte wird geladen …");
  const ergebnis = await initialSync(session.user.id);
  const { startApp } = await import("./app/boot.js");
  startApp();
  if (ergebnis.fehler) {
    console.warn(
      "Hinweis: Cloud nicht erreichbar — es wird lokal weitergearbeitet und bei Verbindung automatisch gespeichert."
    );
  }
}

/**
 * Demo-Modus (?demo=max): Musterpatient „Max Mustermann" — ohne Login,
 * ohne Cloud-Sync, ohne Speichern. Startet direkt in der Zusammenfassung,
 * damit alle Reiter (Vollständig/Kompakt/Befunde/Diagnosen/Verlauf/Klinik)
 * sofort mit reichen Beispieldaten sichtbar sind.
 */
async function starteDemo() {
  // Deutliches Banner — niemand soll die Demo für echte Daten halten.
  const banner = document.createElement("div");
  banner.style.cssText =
    "position:sticky;top:0;z-index:200;background:var(--color-status-yellow, #b98301);color:#fff;padding:8px 16px;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;font-size:14px;";
  const txt = document.createElement("span");
  txt.textContent = "🧪 DEMO — Musterpatient „Max Mustermann“ (fiktive Daten, nichts wird gespeichert)";
  banner.appendChild(txt);
  const raus = document.createElement("a");
  raus.href = window.location.pathname; // gleiche Seite ohne ?demo
  raus.textContent = "Demo verlassen";
  raus.style.cssText = "color:#fff;text-decoration:underline;font-weight:600;";
  banner.appendChild(raus);
  document.body.prepend(banner);

  const { startApp } = await import("./app/boot.js");
  const { getVisibleSteps } = await import("./app/router.js");
  const { state } = await import("./app/state.js");
  // Direkt zur Zusammenfassung springen (alle Schritte bleiben über die
  // Seitenleiste erreichbar — auch die Demo ist frei durchklickbar).
  const idx = getVisibleSteps().findIndex((s) => s.id === "abschluss");
  if (idx >= 0) state.setMeta({ currentStepIndex: idx });
  startApp();
}

(async function boot() {
  if (DEMO_MODUS) {
    await starteDemo();
    return;
  }
  const session = await getSession();
  if (session) {
    await starteNachLogin(session);
  } else {
    renderAuthGate(root, (neueSession) => starteNachLogin(neueSession));
  }
})();
