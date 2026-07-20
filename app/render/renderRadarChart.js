/**
 * LINDEBERGS OS — 7-Faktoren Spider-Chart (Canvas, ohne CDN-Dependency)
 */

const AXES = ["Relief", "Range", "Rhythm", "Regulation", "Re-Energize", "Relations", "Rise"];

function point(cx, cy, radius, angle) {
  return {
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
  };
}

export function renderRadarChart(canvas, profil) {
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.clientWidth || 320;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.36;
  const n = AXES.length;
  const angleStep = (Math.PI * 2) / n;

  // Grid rings
  ctx.strokeStyle = "#D6D2C6";
  ctx.lineWidth = 1;
  [2, 4, 6, 8, 10].forEach((ring) => {
    const r = (ring / 10) * maxRadius;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const p = point(cx, cy, r, i * angleStep);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  });

  // Axes + labels
  ctx.fillStyle = "#6B716E";
  ctx.font = "10px Marcellus, Georgia, serif";
  AXES.forEach((label, i) => {
    const angle = i * angleStep;
    const p = point(cx, cy, maxRadius, angle);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = "#D6D2C6";
    ctx.stroke();

    const labelPoint = point(cx, cy, maxRadius + 18, angle);
    const align = Math.abs(labelPoint.x - cx) < 4 ? "center" : labelPoint.x > cx ? "left" : "right";
    ctx.textAlign = align;
    // Label an den Canvas-Rand klemmen, damit lange Namen (z.B. „Relations")
    // nicht abgeschnitten werden.
    const w = ctx.measureText(label).width;
    let lx = labelPoint.x;
    if (align === "right" && lx - w < 2) lx = w + 2;
    else if (align === "left" && lx + w > size - 2) lx = size - 2 - w;
    else if (align === "center") lx = Math.max(w / 2 + 2, Math.min(size - w / 2 - 2, lx));
    ctx.fillText(label, lx, labelPoint.y + 4);
  });

  // Data polygon
  const values = AXES.map((label) => profil[label]);
  const hasAnyData = values.some((v) => v != null);
  if (hasAnyData) {
    ctx.beginPath();
    values.forEach((v, i) => {
      const r = ((v ?? 0) / 10) * maxRadius;
      const p = point(cx, cy, r, i * angleStep);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(116, 139, 116, 0.30)";
    ctx.fill();
    ctx.strokeStyle = "#50654E";
    ctx.lineWidth = 2;
    ctx.stroke();

    values.forEach((v, i) => {
      if (v == null) return;
      const r = (v / 10) * maxRadius;
      const p = point(cx, cy, r, i * angleStep);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#50654E";
      ctx.fill();
    });
  }
}
