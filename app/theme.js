/**
 * LINDEBERGS OS — Theme-Umschalter (Hell ↔ Dunkel)
 *
 * Das Design System definiert beide Welten: die HELLE (Cloud-Grund, weiße
 * Karten, Ink-Text) und die DUNKLE Ink-Welt (tiefes Dunkelgrün #0E1919 als
 * Grund, Bone/Cloud-Text, Sage bleibt der eine Akzent). Die Tokens dafür
 * liegen in styles/tokens.css ([data-theme="dark"] / [data-theme="light"]).
 *
 * Dieser Umschalter sitzt IMMER sichtbar oben rechts (auch auf der
 * Login-Seite), merkt sich die Wahl je Gerät in localStorage und startet
 * ohne gespeicherte Wahl mit der System-Einstellung des Patienten.
 * Rein visuell — keinerlei Einfluss auf Antworten oder Auswertung.
 */

const THEME_KEY = "lindebergs_theme";

function effektivesTheme() {
  const gespeichert = localStorage.getItem(THEME_KEY);
  if (gespeichert === "dark" || gespeichert === "light") return gespeichert;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function anwenden(theme, knopf) {
  document.documentElement.dataset.theme = theme;
  if (knopf) {
    knopf.textContent = theme === "dark" ? "☀" : "☾";
    knopf.setAttribute("aria-label", theme === "dark" ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln");
    knopf.title = knopf.getAttribute("aria-label");
  }
}

export function initTheme() {
  if (document.querySelector(".theme-toggle")) return; // nur einmal
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.className = "theme-toggle no-print";
  knopf.addEventListener("click", () => {
    const neu = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, neu);
    anwenden(neu, knopf);
  });
  document.body.appendChild(knopf);
  anwenden(effektivesTheme(), knopf);
}
