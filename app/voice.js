/**
 * LINDEBERGS OS — Sprach-Diktat für Freitextfelder
 *
 * Optionale Spracheingabe NUR für Freitext/Erzählfelder (Hauptanliegen,
 * „in Ihren eigenen Worten", Anmerkungen). Die strukturierten, deterministischen
 * Teile (Klick/Slider) bleiben bewusst unberührt — der Datenbank-Kern bleibt
 * eindeutig.
 *
 * Nutzt die native Web Speech API (kostenlos, keine Abhängigkeit). Verfügbar in
 * Chrome/Edge; wo nicht unterstützt, wird KEIN Knopf gezeigt (Graceful Fallback).
 * Für produktive Mehrsprachigkeit/Robustheit später Cloud-STT (z.B. Whisper)
 * über das Backend andockbar.
 */

export function speechSupported() {
  return typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Hängt einen Diktier-Knopf an ein Textarea. onText(neuerVolltext) wird bei
 * jedem Erkennungs-Update aufgerufen (damit der State synchron bleibt).
 * @returns {HTMLElement|null} der Knopf, oder null wenn nicht unterstützt.
 */
export function createDictationButton(textarea, onText) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn--ghost";
  btn.style.marginTop = "6px";
  btn.style.fontSize = "0.8rem";
  btn.textContent = "🎤 Diktieren";
  btn.setAttribute("aria-label", "Antwort per Sprache diktieren");

  let rec = null;
  let aktiv = false;

  function stoppen() {
    aktiv = false;
    btn.textContent = "🎤 Diktieren";
    btn.style.color = "";
    try {
      rec && rec.stop();
    } catch (e) {
      /* ignore */
    }
  }

  btn.addEventListener("click", () => {
    if (aktiv) {
      stoppen();
      return;
    }
    rec = new SR();
    rec.lang = "de-DE";
    rec.interimResults = true;
    rec.continuous = true;

    const basis = textarea.value ? textarea.value.trimEnd() : "";
    let finalText = "";

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + " ";
        else interim += t;
      }
      const komponiert = [basis, (finalText + interim).trim()].filter(Boolean).join(" ");
      textarea.value = komponiert;
      onText(komponiert);
    };
    rec.onerror = stoppen;
    rec.onend = stoppen;

    try {
      rec.start();
      aktiv = true;
      btn.textContent = "⏹ Aufnahme stoppen";
      btn.style.color = "var(--color-terracotta)";
    } catch (e) {
      stoppen();
    }
  });

  return btn;
}
