/**
 * LINDEBERGS OS — Auth-Gate (Anmelden / Registrieren / Passwort zurücksetzen)
 *
 * Die Anamnese ist login-pflichtig: erst nach Anmeldung wird die eigentliche
 * App geladen (dynamischer Import in main.js), damit jeder Stand eindeutig
 * einem Benutzer gehört und in dessen Cloud-Akte gespeichert wird.
 *
 * Passwörter werden ausschließlich vom Benutzer selbst gewählt und gehen
 * direkt an Supabase Auth — sie tauchen nirgendwo sonst auf.
 */
import { supabase } from "./supabase.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function feld(labelText, type, autocomplete) {
  const wrap = el("div", "auth-feld");
  const label = el("label", "field-label", labelText);
  const input = document.createElement("input");
  input.type = type;
  if (autocomplete) input.autocomplete = autocomplete;
  input.required = true;
  label.appendChild(input);
  wrap.appendChild(label);
  return { wrap, input };
}

/**
 * Zeigt das Auth-Gate im übergebenen Wurzelelement.
 * `onAngemeldet(session)` wird nach erfolgreicher Anmeldung aufgerufen.
 */
export function renderAuthGate(root, onAngemeldet) {
  let modus = "login"; // "login" | "signup" | "reset" | "recovery" | "signup_ok" | "reset_ok"

  // Passwort-Zurücksetzen-Link führt mit type=recovery zurück auf die Seite.
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      modus = "recovery";
      draw();
    } else if (event === "SIGNED_IN" && session && modus !== "recovery") {
      onAngemeldet(session);
    }
  });

  function draw() {
    root.innerHTML = "";
    const seite = el("div", "auth-seite");
    const card = el("div", "card auth-card");

    card.appendChild(el("div", "app-logo", "LINDEBERGS"));
    card.appendChild(el("p", "step-eyebrow", "Online-Anamnese"));

    const meldung = el("p", "auth-meldung");
    meldung.style.display = "none";
    function zeigeFehler(text) {
      meldung.textContent = text;
      meldung.style.display = "block";
    }

    const form = document.createElement("form");
    form.className = "auth-form";

    if (modus === "signup_ok") {
      card.appendChild(el("h1", "step-title", "Fast geschafft"));
      card.appendChild(
        el(
          "p",
          "step-subtitle",
          "Wir haben Ihnen eine Bestätigungs-E-Mail geschickt. Bitte klicken Sie auf den Link darin — danach können Sie sich hier anmelden."
        )
      );
      const zurueck = el("button", "btn btn--primary", "Zur Anmeldung");
      zurueck.type = "button";
      zurueck.addEventListener("click", () => {
        modus = "login";
        draw();
      });
      card.appendChild(zurueck);
    } else if (modus === "reset_ok") {
      card.appendChild(el("h1", "step-title", "E-Mail unterwegs"));
      card.appendChild(
        el(
          "p",
          "step-subtitle",
          "Falls ein Konto mit dieser Adresse existiert, haben wir einen Link zum Zurücksetzen des Passworts geschickt."
        )
      );
      const zurueck = el("button", "btn btn--primary", "Zur Anmeldung");
      zurueck.type = "button";
      zurueck.addEventListener("click", () => {
        modus = "login";
        draw();
      });
      card.appendChild(zurueck);
    } else if (modus === "recovery") {
      card.appendChild(el("h1", "step-title", "Neues Passwort wählen"));
      const pw = feld("Neues Passwort (mind. 8 Zeichen)", "password", "new-password");
      const pw2 = feld("Passwort wiederholen", "password", "new-password");
      form.appendChild(pw.wrap);
      form.appendChild(pw2.wrap);
      const ok = el("button", "btn btn--primary", "Passwort speichern");
      ok.type = "submit";
      form.appendChild(ok);
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (pw.input.value.length < 8) return zeigeFehler("Bitte mindestens 8 Zeichen.");
        if (pw.input.value !== pw2.input.value) return zeigeFehler("Die Passwörter stimmen nicht überein.");
        ok.disabled = true;
        const { error } = await supabase.auth.updateUser({ password: pw.input.value });
        ok.disabled = false;
        if (error) return zeigeFehler(error.message);
        const { data } = await supabase.auth.getSession();
        if (data.session) onAngemeldet(data.session);
      });
      card.appendChild(form);
    } else if (modus === "reset") {
      card.appendChild(el("h1", "step-title", "Passwort zurücksetzen"));
      const email = feld("E-Mail-Adresse", "email", "email");
      form.appendChild(email.wrap);
      const ok = el("button", "btn btn--primary", "Link anfordern");
      ok.type = "submit";
      form.appendChild(ok);
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        ok.disabled = true;
        await supabase.auth.resetPasswordForEmail(email.input.value.trim(), {
          redirectTo: window.location.origin,
        });
        modus = "reset_ok";
        draw();
      });
      card.appendChild(form);
      const zurueck = el("button", "auth-link", "← Zur Anmeldung");
      zurueck.type = "button";
      zurueck.addEventListener("click", () => {
        modus = "login";
        draw();
      });
      card.appendChild(zurueck);
    } else if (modus === "signup") {
      card.appendChild(el("h1", "step-title", "Konto erstellen"));
      card.appendChild(
        el("p", "step-subtitle", "Ihre Angaben werden verschlüsselt in der EU gespeichert und sind nur für Sie einsehbar.")
      );
      const name = feld("Vor- und Nachname", "text", "name");
      const email = feld("E-Mail-Adresse", "email", "email");
      const pw = feld("Passwort (mind. 8 Zeichen)", "password", "new-password");
      const pw2 = feld("Passwort wiederholen", "password", "new-password");
      [name, email, pw, pw2].forEach((f) => form.appendChild(f.wrap));
      const ok = el("button", "btn btn--primary", "Registrieren");
      ok.type = "submit";
      form.appendChild(ok);
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (pw.input.value.length < 8) return zeigeFehler("Bitte mindestens 8 Zeichen.");
        if (pw.input.value !== pw2.input.value) return zeigeFehler("Die Passwörter stimmen nicht überein.");
        ok.disabled = true;
        const { data, error } = await supabase.auth.signUp({
          email: email.input.value.trim(),
          password: pw.input.value,
          options: {
            data: { full_name: name.input.value.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        ok.disabled = false;
        if (error) return zeigeFehler(error.message);
        if (data.session) {
          onAngemeldet(data.session); // E-Mail-Bestätigung deaktiviert
        } else {
          modus = "signup_ok"; // Bestätigungs-E-Mail nötig
          draw();
        }
      });
      card.appendChild(form);
      const wechsel = el("button", "auth-link", "Ich habe bereits ein Konto");
      wechsel.type = "button";
      wechsel.addEventListener("click", () => {
        modus = "login";
        draw();
      });
      card.appendChild(wechsel);
    } else {
      // Anmelden
      card.appendChild(el("h1", "step-title", "Willkommen"));
      card.appendChild(
        el("p", "step-subtitle", "Melden Sie sich an, um Ihre Anamnese zu beginnen oder fortzusetzen.")
      );
      const email = feld("E-Mail-Adresse", "email", "email");
      const pw = feld("Passwort", "password", "current-password");
      form.appendChild(email.wrap);
      form.appendChild(pw.wrap);
      const ok = el("button", "btn btn--primary", "Anmelden");
      ok.type = "submit";
      form.appendChild(ok);
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        ok.disabled = true;
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.input.value.trim(),
          password: pw.input.value,
        });
        ok.disabled = false;
        if (error) {
          const text =
            error.message === "Invalid login credentials"
              ? "E-Mail oder Passwort ist nicht korrekt."
              : error.message === "Email not confirmed"
                ? "Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse (Link in der Bestätigungs-E-Mail)."
                : error.message;
          return zeigeFehler(text);
        }
        if (data.session) onAngemeldet(data.session);
      });
      card.appendChild(form);

      const reihe = el("div", "auth-linkreihe");
      const neu = el("button", "auth-link", "Neues Konto erstellen");
      neu.type = "button";
      neu.addEventListener("click", () => {
        modus = "signup";
        draw();
      });
      const vergessen = el("button", "auth-link", "Passwort vergessen?");
      vergessen.type = "button";
      vergessen.addEventListener("click", () => {
        modus = "reset";
        draw();
      });
      reihe.appendChild(neu);
      reihe.appendChild(vergessen);
      card.appendChild(reihe);
    }

    card.appendChild(meldung);
    card.appendChild(
      el("p", "auth-fuss", "Where science meets soul.")
    );
    seite.appendChild(card);
    root.appendChild(seite);
  }

  draw();
}
