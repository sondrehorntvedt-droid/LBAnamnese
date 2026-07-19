/**
 * LINDEBERGS OS — Online-Anamnese
 * App-Bootstrap
 */

import { state } from "./app/state.js";
import {
  getCurrentStep,
  getProgress,
  getSidebarGroups,
  canGoPrev,
  canGoNext,
  goNext,
  goPrev,
} from "./app/router.js";
import { initRedFlagWatcher } from "./app/redflags.js";
import { ensureSitzungInit } from "./app/patient-record.js";
import "./app/steps/register-all.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

const root = document.getElementById("app");

function buildShell() {
  root.innerHTML = "";

  const shell = el("div", "app-shell");

  // ── Sidebar (Desktop) ──────────────────────────────────
  const sidebar = el("div", "app-sidebar");
  sidebar.appendChild(el("div", "app-logo", "LINDEBERGS"));
  const sidebarNav = el("div", "sidebar-nav");
  sidebar.appendChild(sidebarNav);
  const sidebarFooter = el("div", "sidebar-footer");
  const timeEstimate = el("p", "field-hint", "");
  sidebarFooter.appendChild(timeEstimate);
  sidebar.appendChild(sidebarFooter);

  // ── Mobile top bar (fallback) ──────────────────────────
  const header = el("div", "app-header");
  const headerRow = el("div", "app-header__row");
  headerRow.appendChild(el("div", "app-logo", "LINDEBERGS"));
  const progressWrap = el("div");
  progressWrap.style.flex = "1";
  progressWrap.style.marginLeft = "24px";
  const track = el("div", "progress-track");
  const fill = el("div", "progress-fill");
  track.appendChild(fill);
  progressWrap.appendChild(track);
  headerRow.appendChild(progressWrap);
  header.appendChild(headerRow);

  // ── Content column ──────────────────────────────────────
  const contentCol = el("div", "app-content-col");
  const main = el("main", "app-main");
  main.id = "step-content";

  const footer = el("div", "app-footer-nav");
  const footerRow = el("div", "app-footer-nav__row");
  const prevBtn = el("button", "btn btn--ghost", "← Zurück");
  const nextBtn = el("button", "btn btn--primary", "Weiter →");
  footerRow.appendChild(prevBtn);
  footerRow.appendChild(nextBtn);
  footer.appendChild(footerRow);

  contentCol.appendChild(header);
  contentCol.appendChild(main);
  contentCol.appendChild(footer);

  shell.appendChild(sidebar);
  shell.appendChild(contentCol);
  root.appendChild(shell);

  prevBtn.addEventListener("click", () => {
    goPrev();
    render();
  });
  nextBtn.addEventListener("click", () => {
    goNext();
    render();
  });

  return { fill, main, prevBtn, nextBtn, sidebarNav, timeEstimate };
}

let refs = buildShell();

let currentCleanup = null;

function renderSidebar() {
  const { groups, remainingMinutes } = getSidebarGroups();
  refs.sidebarNav.innerHTML = "";
  groups.forEach((g) => {
    const item = el(
      "div",
      "sidebar-nav__item" +
        (g.isCurrent ? " sidebar-nav__item--current" : "") +
        (g.isDone ? " sidebar-nav__item--done" : "")
    );
    const marker = el("span", "sidebar-nav__marker", g.isDone ? "✓" : "");
    item.appendChild(marker);
    item.appendChild(el("span", null, g.name));
    refs.sidebarNav.appendChild(item);
  });
  refs.timeEstimate.textContent =
    remainingMinutes > 0 ? `Noch etwa ${remainingMinutes} Minuten` : "Fast geschafft";
}

function render() {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  const step = getCurrentStep();
  refs.fill.style.width = getProgress() + "%";
  refs.prevBtn.disabled = !canGoPrev();
  refs.nextBtn.disabled = !canGoNext();
  refs.nextBtn.textContent = canGoNext() ? "Weiter →" : "Fertig";
  renderSidebar();

  refs.main.innerHTML = "";
  if (!step) {
    refs.main.appendChild(el("p", "field-hint", "Keine Schritte registriert."));
    return;
  }

  const stepHeader = el("div", "step-header");
  if (step.eyebrow) stepHeader.appendChild(el("div", "step-eyebrow", step.eyebrow));
  if (step.title) stepHeader.appendChild(el("h1", "step-title", step.title));
  if (step.subtitle) stepHeader.appendChild(el("p", "step-subtitle", step.subtitle));
  refs.main.appendChild(stepHeader);

  const contentWrap = el("div", "section-stack");
  refs.main.appendChild(contentWrap);
  currentCleanup = step.render(contentWrap) || null;
}

state.subscribe(() => {
  // Navigations-Änderungen (currentStepIndex) müssen den Schritt neu
  // rendern; einzelne Antwort-Änderungen aktualisieren sich selbst
  // (siehe renderQuestion.js syncTiles) und lösen hier absichtlich KEINEN
  // vollständigen Re-Render aus, um z.B. den Fokus in Texteingaben nicht
  // zu verlieren. Die Sidebar wird jedoch immer aktualisiert (günstig).
  renderSidebar();
});

ensureSitzungInit();
initRedFlagWatcher();
render();
