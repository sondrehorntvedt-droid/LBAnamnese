/**
 * LINDEBERGS OS — Body-Map (Schmerz-Zeichentool)
 *
 * Einfaches, selbst gezeichnetes Körper-Umriss-Canvas (keine Fremd-
 * Bildassets — bewusst vermieden, da die im alten Prototyp eingebetteten
 * Anatomie-Illustrationen kommerzielle Stock-Grafiken ohne geklärte
 * Lizenz waren). Patient markiert Schmerzpunkte per Klick, zeichnet bei
 * Bedarf eine Ausstrahlungslinie.
 *
 * ROADMAP-NOTIZ: Der Praxisinhaber möchte langfristig ein detailliertes
 * 3D-Anatomiemodell (z.B. BioDigital Human, biodigital.com) integrieren.
 * Das ist ein kommerzieller Embed-Service und heute (vanilla Frontend,
 * kein Backend/Lizenzvertrag) nicht umsetzbar — dieses 2D-Canvas ist der
 * pragmatische Zwischenschritt mit identischer Dateninteraktion (Punkt/
 * Linie/Typ), sodass eine spätere 3D-Migration die gleichen Marker-Daten
 * weiterverwenden kann.
 */

const MARK_TYPES = [
  { value: "schmerz", label: "Schmerz", color: "#c4573f" },
  { value: "ausstrahlung", label: "Ausstrahlung", color: "#d9a63c" },
  { value: "verspannung", label: "Verspannung", color: "#4ea72e" },
  { value: "narbe", label: "Narbe / OP", color: "#1e241f" },
];

function drawBodyOutline(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = "#c9c4b6";
  ctx.fillStyle = "#f3f1eb";
  ctx.lineWidth = 2;

  const cx = w / 2;
  // Kopf
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.07, w * 0.09, h * 0.055, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Hals
  ctx.beginPath();
  ctx.rect(cx - w * 0.035, h * 0.12, w * 0.07, h * 0.03);
  ctx.fill();
  ctx.stroke();
  // Torso
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.22, h * 0.15);
  ctx.lineTo(cx + w * 0.22, h * 0.15);
  ctx.lineTo(cx + w * 0.16, h * 0.42);
  ctx.lineTo(cx - w * 0.16, h * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Becken
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.16, h * 0.42);
  ctx.lineTo(cx + w * 0.16, h * 0.42);
  ctx.lineTo(cx + w * 0.13, h * 0.49);
  ctx.lineTo(cx - w * 0.13, h * 0.49);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Arme (links/rechts aus Patientensicht gespiegelt zur Ansicht)
  [-1, 1].forEach((side) => {
    ctx.beginPath();
    ctx.moveTo(cx + side * w * 0.22, h * 0.16);
    ctx.lineTo(cx + side * w * 0.34, h * 0.4);
    ctx.lineTo(cx + side * w * 0.29, h * 0.42);
    ctx.lineTo(cx + side * w * 0.18, h * 0.19);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Hand
    ctx.beginPath();
    ctx.ellipse(cx + side * w * 0.32, h * 0.435, w * 0.035, h * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  // Beine
  [-1, 1].forEach((side) => {
    ctx.beginPath();
    ctx.moveTo(cx + side * w * 0.13, h * 0.49);
    ctx.lineTo(cx + side * w * 0.14, h * 0.8);
    ctx.lineTo(cx + side * w * 0.06, h * 0.95);
    ctx.lineTo(cx + side * w * 0.02, h * 0.95);
    ctx.lineTo(cx + side * w * 0.05, h * 0.49);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
}

function drawMarks(ctx, marks) {
  marks.forEach((m) => {
    const color = (MARK_TYPES.find((t) => t.value === m.type) || MARK_TYPES[0]).color;
    if (m.mode === "punkt" || m.points.length === 1) {
      const p = m.points[0];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      ctx.beginPath();
      m.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.85;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  });
}

/**
 * Baut ein Body-Map-Widget in `container`.
 * @param {HTMLElement} container
 * @param {{ getValue: () => Array, setValue: (marks: Array) => void }} accessors
 */
export function renderBodyMap(container, { getValue, setValue }) {
  const wrap = document.createElement("div");
  wrap.className = "card card--sunken";

  const toolbar = document.createElement("div");
  toolbar.style.display = "flex";
  toolbar.style.flexWrap = "wrap";
  toolbar.style.gap = "8px";
  toolbar.style.marginBottom = "12px";

  let activeType = "schmerz";
  let activeMode = "punkt";

  MARK_TYPES.forEach((t) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "badge";
    btn.style.cursor = "pointer";
    btn.style.border = "2px solid transparent";
    btn.style.background = t.color + "22";
    btn.style.color = t.color;
    btn.textContent = t.label;
    btn.addEventListener("click", () => {
      activeType = t.value;
      sync();
    });
    btn.dataset.type = t.value;
    toolbar.appendChild(btn);
  });

  const modeWrap = document.createElement("div");
  modeWrap.style.marginLeft = "auto";
  modeWrap.style.display = "flex";
  modeWrap.style.gap = "8px";
  ["punkt", "linie"].forEach((mode) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--ghost";
    btn.textContent = mode === "punkt" ? "● Punkt" : "／ Ausstrahlung (Linie)";
    btn.dataset.mode = mode;
    btn.addEventListener("click", () => {
      activeMode = mode;
      sync();
    });
    modeWrap.appendChild(btn);
  });
  toolbar.appendChild(modeWrap);

  function sync() {
    toolbar.querySelectorAll("[data-type]").forEach((b) => {
      b.style.border = b.dataset.type === activeType ? "2px solid currentColor" : "2px solid transparent";
    });
    modeWrap.querySelectorAll("[data-mode]").forEach((b) => {
      b.style.background = b.dataset.mode === activeMode ? "var(--color-sage-tint)" : "transparent";
    });
  }

  const canvasWrap = document.createElement("div");
  canvasWrap.style.position = "relative";
  canvasWrap.style.maxWidth = "320px";
  canvasWrap.style.margin = "0 auto";

  const canvas = document.createElement("canvas");
  const W = 320;
  const H = 640;
  canvas.width = W;
  canvas.height = H;
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.style.touchAction = "none";
  canvas.style.cursor = "crosshair";
  canvasWrap.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  function redrawCanvas() {
    ctx.clearRect(0, 0, W, H);
    drawBodyOutline(ctx, W, H);
    drawMarks(ctx, getValue() || []);
  }

  let drawingLine = null;

  function toCanvasCoords(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / rect.width) * W,
      y: ((evt.clientY - rect.top) / rect.height) * H,
    };
  }

  canvas.addEventListener("pointerdown", (evt) => {
    const p = toCanvasCoords(evt);
    if (activeMode === "punkt") {
      const marks = [...(getValue() || []), { type: activeType, mode: "punkt", points: [p] }];
      setValue(marks);
      redrawCanvas();
    } else {
      drawingLine = { type: activeType, mode: "linie", points: [p] };
      canvas.setPointerCapture(evt.pointerId);
    }
  });
  canvas.addEventListener("pointermove", (evt) => {
    if (!drawingLine) return;
    drawingLine.points.push(toCanvasCoords(evt));
    redrawCanvas();
    drawMarks(ctx, [drawingLine]);
  });
  canvas.addEventListener("pointerup", () => {
    if (!drawingLine) return;
    if (drawingLine.points.length > 1) {
      setValue([...(getValue() || []), drawingLine]);
    }
    drawingLine = null;
    redrawCanvas();
  });

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "btn btn--ghost";
  clearBtn.textContent = "Alle Markierungen löschen";
  clearBtn.style.marginTop = "12px";
  clearBtn.addEventListener("click", () => {
    setValue([]);
    redrawCanvas();
  });

  wrap.appendChild(toolbar);
  wrap.appendChild(canvasWrap);
  wrap.appendChild(clearBtn);
  container.appendChild(wrap);

  sync();
  redrawCanvas();
}
