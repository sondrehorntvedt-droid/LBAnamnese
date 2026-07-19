/**
 * LINDEBERGS OS — Gesundheits-Roadmap (grafische Zeitlinie)
 *
 * Zeichnet datierte Ereignisse (OP, Trauma, Diagnose) auf eine horizontale
 * Achse — grobe, schnell erfassbare Übersicht des Gesundheitsverlaufs.
 * Reines HTML/CSS (kein Canvas) → skaliert sauber und ist druckbar.
 */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

const TYP_FARBE = {
  OP: "var(--color-terracotta)",
  Trauma: "var(--color-status-yellow)",
  Diagnose: "var(--color-forest-500)",
};

export function renderTimeline(container, events) {
  container.innerHTML = "";
  if (!events.length) {
    container.appendChild(
      el("p", "field-hint", "Noch keine datierten Ereignisse erfasst. Diagnosen, Operationen und Unfälle mit Jahresangabe erscheinen hier als Zeitlinie.")
    );
    return;
  }

  // Legende
  const legende = el("div");
  legende.style.display = "flex";
  legende.style.gap = "16px";
  legende.style.flexWrap = "wrap";
  legende.style.marginBottom = "20px";
  Object.entries(TYP_FARBE).forEach(([typ, farbe]) => {
    const item = el("span", "field-hint");
    item.style.display = "inline-flex";
    item.style.alignItems = "center";
    item.style.gap = "6px";
    const dot = el("span");
    dot.style.width = "10px";
    dot.style.height = "10px";
    dot.style.borderRadius = "50%";
    dot.style.background = farbe;
    item.appendChild(dot);
    item.appendChild(el("span", null, typ));
    legende.appendChild(item);
  });
  container.appendChild(legende);

  // Vertikale Zeitachse (robust für viele Einträge, druckfreundlich).
  const rail = el("div");
  rail.style.position = "relative";
  rail.style.paddingLeft = "28px";
  rail.style.borderLeft = "2px solid var(--color-border)";
  rail.style.marginLeft = "8px";

  // Chronologisch aufsteigend sortieren (robust, auch wenn Quelle unsortiert).
  const datiert = events.filter((e) => e.jahr != null).slice().sort((a, b) => a.jahr - b.jahr);
  const undatiert = events.filter((e) => e.jahr == null);

  datiert.forEach((e) => {
    const row = el("div");
    row.style.position = "relative";
    row.style.marginBottom = "18px";

    const dot = el("span");
    dot.style.position = "absolute";
    dot.style.left = "-35px";
    dot.style.top = "2px";
    dot.style.width = "14px";
    dot.style.height = "14px";
    dot.style.borderRadius = "50%";
    // Ausgeheilte Ereignisse gedämpft, noch aktive kräftig (aus P-C-Flag).
    const farbe = TYP_FARBE[e.typ] || "var(--color-sage)";
    dot.style.background = e.aktiv === false ? "var(--color-border)" : farbe;
    dot.style.border = "2px solid var(--color-surface)";
    row.appendChild(dot);

    const jahr = el("div", "section-label", String(e.jahr));
    jahr.style.color = "var(--color-forest-800)";
    row.appendChild(jahr);
    const text = el("div", null, `${e.icon} ${e.text}`);
    text.style.fontSize = "var(--text-body)";
    row.appendChild(text);
    // Statuszeile: noch aktiv / ausgeheilt (falls bekannt).
    if (e.aktiv === true || e.aktiv === false) {
      const status = el("div", "field-hint", e.aktiv ? "heute noch symptomatisch" : "ausgeheilt");
      status.style.color = e.aktiv ? "var(--color-terracotta)" : "var(--color-text-muted)";
      status.style.fontSize = "0.75rem";
      row.appendChild(status);
    }
    rail.appendChild(row);
  });

  // „Heute"-Endpunkt als Orientierung.
  const heute = el("div");
  heute.style.position = "relative";
  const heuteDot = el("span");
  heuteDot.style.position = "absolute";
  heuteDot.style.left = "-35px";
  heuteDot.style.top = "2px";
  heuteDot.style.width = "14px";
  heuteDot.style.height = "14px";
  heuteDot.style.borderRadius = "50%";
  heuteDot.style.background = "var(--color-forest-800)";
  heuteDot.style.border = "2px solid var(--color-surface)";
  heute.appendChild(heuteDot);
  const heuteLabel = el("div", "section-label", "Heute");
  heuteLabel.style.color = "var(--color-forest-800)";
  heute.appendChild(heuteLabel);
  rail.appendChild(heute);

  container.appendChild(rail);

  if (undatiert.length) {
    container.appendChild(el("div", "section-label", "Ohne Jahresangabe"));
    const list = el("div", "field-stack");
    list.style.marginTop = "8px";
    undatiert.forEach((e) => list.appendChild(el("p", "field-hint", `${e.icon} ${e.text}`)));
    container.appendChild(list);
  }
}
