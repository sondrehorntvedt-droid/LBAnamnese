/**
 * LINDEBERGS OS — Vitalitätsprofil (7 Faktoren, abgeleitet)
 *
 * KEIN eigener Frageblock mehr (Wunsch des Praxisinhabers: 7 Faktoren
 * nicht separat abfragen). Dieser Schritt zeigt nur das aus den bereits
 * gegebenen Antworten ABGELEITETE Spinnennetz — als motivierende
 * Rückmeldung an den Patienten. Die Faktor-Fragen selbst sind in den Fluss
 * eingewoben (siehe app/faktoren-mapping.js, FAKTOREN_WOVEN_FRAGEN).
 */
import { registerStep } from "../router.js";
import { renderRadarChart } from "../render/renderRadarChart.js";
import { compute7FaktorenAbgeleitet } from "../faktoren-mapping.js";
import { state } from "../state.js";

// Autoritative Bedeutungen (verbatim aus „Unsere Philosophie" — Lindebergs):
// jede englische Faktor-Bezeichnung ist mit ihrer deutschen Bedeutung gepaart.
const FAKTOR_META = [
  { key: "Relief", label: "Relief", bedeutung: "Symptomfreiheit", beschreibung: "Freisein von Schmerzen und Symptomen" },
  { key: "Range", label: "Range", bedeutung: "Bewegung", beschreibung: "Beweglichkeit, Kraft & Bewegungsfreiheit" },
  { key: "Rhythm", label: "Rhythm", bedeutung: "Rhythmus", beschreibung: "Schlaf, Erholung & natürliche Rhythmen" },
  { key: "Regulation", label: "Regulation", bedeutung: "Regulation", beschreibung: "Selbstregulation & inneres Gleichgewicht" },
  { key: "Re-Energize", label: "Re-Energize", bedeutung: "Energie", beschreibung: "Energie, Vitalität & Regeneration" },
  { key: "Relations", label: "Relations", bedeutung: "Verbundenheit", beschreibung: "Verbindung zu sich, anderen & Natur" },
  { key: "Rise", label: "Rise", bedeutung: "Wachstum", beschreibung: "Lebenssinn, Lernen & persönliches Wachstum" },
];

function bandFarbe(score) {
  if (score == null) return "var(--color-text-muted)";
  if (score <= 40) return "var(--color-status-red)";
  if (score <= 70) return "var(--color-status-yellow)";
  return "var(--color-status-green)";
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function registerSiebenFaktorenStep() {
  registerStep({
    id: "vitalitaetsprofil",
    // Erwachsenen-Modul: bei Säuglings-Anamnese (Eltern-Fragebogen) ausgeblendet.
    isVisible: (answers) => answers["PT-001"] !== "saeugling",
    group: "Ihr Vitalitätsprofil",
    eyebrow: "Ihr Profil",
    title: "Ihre 7 Faktoren der Gesundheit & Vitalität",
    subtitle:
      "Aus Ihren bisherigen Antworten ergibt sich dieses Bild — nicht nur körperlich, sondern als ganzer Mensch. Kein zusätzlicher Aufwand für Sie.",
    estMinutes: 1,
    tiers: ["ganzheitlich", "tiefenanalyse"],
    render(container) {
      function draw() {
        container.innerHTML = "";
        const profil = compute7FaktorenAbgeleitet(state.answers);

        const chartCard = el("div", "card");
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.maxWidth = "360px";
        canvas.style.display = "block";
        canvas.style.margin = "0 auto";
        chartCard.appendChild(canvas);
        container.appendChild(chartCard);

        // Chart erwartet 0–10; abgeleitete Werte sind 0–100 → skalieren.
        const chartProfil = {};
        FAKTOR_META.forEach((f) => {
          chartProfil[f.key] = profil[f.key] == null ? null : profil[f.key] / 10;
        });
        requestAnimationFrame(() => renderRadarChart(canvas, chartProfil));

        // Kompakte, farbige Balkenliste (statt großer Karten untereinander).
        const list = el("div", "card");
        list.style.marginTop = "16px";
        FAKTOR_META.forEach((f, i) => {
          const score = profil[f.key];
          const row = el("div");
          row.style.display = "grid";
          row.style.gridTemplateColumns = "120px 1fr 42px";
          row.style.alignItems = "center";
          row.style.gap = "10px";
          row.style.padding = "6px 0";
          if (i < FAKTOR_META.length - 1) row.style.borderBottom = "1px solid var(--color-border)";

          const name = el("div");
          name.appendChild(el("strong", null, f.label));
          const bed = el("span", "field-hint", " · " + f.bedeutung);
          bed.style.fontSize = "0.72rem";
          name.appendChild(bed);
          row.appendChild(name);

          const track = el("div");
          track.style.height = "8px";
          track.style.borderRadius = "999px";
          track.style.background = "var(--color-surface-sunken)";
          track.style.overflow = "hidden";
          const fill = el("div");
          fill.style.height = "100%";
          fill.style.width = (score == null ? 0 : score) + "%";
          fill.style.background = bandFarbe(score);
          fill.style.borderRadius = "999px";
          track.appendChild(fill);
          row.appendChild(track);

          const val = el("div", null, score == null ? "–" : `${Math.round(score)}%`);
          val.style.textAlign = "right";
          val.style.fontWeight = "var(--weight-semibold)";
          val.style.color = bandFarbe(score);
          val.style.fontSize = "var(--text-small)";
          row.appendChild(val);

          list.appendChild(row);
        });
        container.appendChild(list);
      }

      draw();
      return state.subscribe(draw);
    },
  });
}
