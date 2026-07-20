/**
 * LINDEBERGS OS — Theme-Umschalter (Hell ↔ Dunkel)
 *
 * Das Design System definiert beide Welten: die HELLE (Cloud-Grund, weiße
 * Karten, Ink-Text) und die DUNKLE Ink-Welt (tiefes Dunkelgrün #0E1919 als
 * Grund, Bone/Cloud-Text, Sage bleibt der eine Akzent). Die Tokens dafür
 * liegen in styles/tokens.css ([data-theme="dark"] / [data-theme="light"]).
 *
 * Drei Einbauorte, damit der Patient den Wechsel IMMER findet:
 *  1. Fester Knopf oben rechts (jede Seite, auch Login) — initTheme().
 *  2. Schalter in der Desktop-Sidebar (unten) — renderThemeSchalter().
 *  3. Kompakter Knopf im mobilen Top-Bar — renderThemeSchalter(…, {kompakt}).
 * Alle Instanzen bleiben synchron (gemeinsame Knopf-Liste).
 *
 * Die Wahl wird je Gerät in localStorage gemerkt; ohne gespeicherte Wahl
 * gilt die System-Einstellung. Rein visuell — kein Einfluss auf Antworten.
 */

const THEME_KEY = "lindebergs_theme";
const knoepfe = new Set(); // alle Umschalt-Knöpfe, die synchron bleiben

function effektivesTheme() {
  const gespeichert = localStorage.getItem(THEME_KEY);
  if (gespeichert === "dark" || gespeichert === "light") return gespeichert;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function beschrifte(knopf, theme) {
  const dunkel = theme === "dark";
  if (knopf.dataset.variante === "pill") {
    knopf.textContent = dunkel ? "☀  Heller Modus" : "☾  Dunkler Modus";
  } else {
    knopf.textContent = dunkel ? "☀" : "☾";
  }
  knopf.setAttribute("aria-label", dunkel ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln");
  knopf.title = knopf.getAttribute("aria-label");
}

function anwenden(theme) {
  document.documentElement.dataset.theme = theme;
  knoepfe.forEach((k) => beschrifte(k, theme));
}

function umschalten() {
  const neu = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, neu);
  anwenden(neu);
}

function registriere(knopf) {
  knopf.type = "button";
  knopf.addEventListener("click", umschalten);
  knoepfe.add(knopf);
  beschrifte(knopf, document.documentElement.dataset.theme || effektivesTheme());
  return () => knoepfe.delete(knopf);
}

/** Fester Knopf oben rechts — auf jeder Seite, auch vor dem Login. */
export function initTheme() {
  if (!document.querySelector(".theme-toggle")) {
    const knopf = document.createElement("button");
    knopf.className = "theme-toggle no-print";
    registriere(knopf);
    document.body.appendChild(knopf);
  }
  anwenden(effektivesTheme());
}

/**
 * Umschalter zum Einbauen in die App-Shell (Sidebar / mobiler Header).
 * kompakt: nur Icon-Knopf; sonst Pill mit Beschriftung. Liefert cleanup.
 */
export function renderThemeSchalter(container, { kompakt = false } = {}) {
  const knopf = document.createElement("button");
  knopf.className = kompakt ? "theme-schalter theme-schalter--kompakt no-print" : "theme-schalter no-print";
  if (!kompakt) knopf.dataset.variante = "pill";
  const cleanup = registriere(knopf);
  container.appendChild(knopf);
  return cleanup;
}
