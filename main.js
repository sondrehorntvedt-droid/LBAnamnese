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

const root = document.getElementById("app");

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

(async function boot() {
  const session = await getSession();
  if (session) {
    await starteNachLogin(session);
  } else {
    renderAuthGate(root, (neueSession) => starteNachLogin(neueSession));
  }
})();
