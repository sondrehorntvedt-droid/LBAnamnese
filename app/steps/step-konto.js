/**
 * Konto-Schritt: zeigt den angemeldeten Benutzer, den Cloud-Speicherstatus
 * und bietet Abmelden an. Bewusst der letzte Eintrag in der Sidebar.
 */
import { registerStep } from "../router.js";
import { supabase } from "../supabase.js";
import { getSyncStatus, onSyncStatus, flushUpload, logoutMitSync } from "../cloud-sync.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function statusText(s) {
  if (s.zustand === "speichert") return "Speichert …";
  if (s.zustand === "fehler") return "Speichern fehlgeschlagen — bitte Internetverbindung prüfen.";
  if (s.letzterSync) {
    const d = new Date(s.letzterSync);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const hhmm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    return `Zuletzt gespeichert: ${dd}.${mm}.${d.getFullYear()} um ${hhmm} Uhr`;
  }
  return "Noch nicht gespeichert.";
}

export function registerKontoStep() {
  registerStep({
    id: "konto",
    group: "Konto",
    eyebrow: "Ihr Zugang",
    title: "Konto & Datenspeicherung",
    subtitle:
      "Ihre Anamnese wird automatisch und verschlüsselt in Ihrem persönlichen Konto gespeichert (Server in der EU). Sie können jederzeit unterbrechen und auf jedem Gerät weitermachen.",
    estMinutes: 1,
    render(container) {
      const card = el("div", "card");

      const emailZeile = el("p", "field-label", "Angemeldet als");
      const emailWert = el("p", "tagline", "…");
      card.appendChild(emailZeile);
      card.appendChild(emailWert);
      supabase.auth.getUser().then(({ data }) => {
        emailWert.textContent = data?.user?.email || "unbekannt";
      });

      const status = el("p", "field-hint", statusText(getSyncStatus()));
      status.style.marginTop = "12px";
      card.appendChild(status);
      const unsub = onSyncStatus((s) => {
        status.textContent = statusText(s);
      });

      const reihe = el("div", "auth-linkreihe");
      reihe.style.marginTop = "20px";

      const speichern = el("button", "btn btn--ghost", "Jetzt speichern");
      speichern.addEventListener("click", () => flushUpload());
      reihe.appendChild(speichern);

      const abmelden = el("button", "btn btn--primary", "Abmelden");
      abmelden.addEventListener("click", async () => {
        abmelden.disabled = true;
        abmelden.textContent = "Wird gespeichert …";
        await logoutMitSync();
      });
      reihe.appendChild(abmelden);

      card.appendChild(reihe);

      const hinweis = el(
        "p",
        "field-hint",
        "Beim Abmelden wird Ihr Stand gesichert und von diesem Gerät entfernt — beim nächsten Anmelden ist alles wieder da."
      );
      hinweis.style.marginTop = "12px";
      card.appendChild(hinweis);

      container.appendChild(card);
      return () => unsub();
    },
  });
}
