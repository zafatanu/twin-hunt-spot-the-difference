// The Canvas 2D painter Twin Hunt's scenes draw through.
//
// Every scene is painted twice per level: once as normal, once with the
// current difference switched in through painter.var(name, normal, altered).
// The Painter records every name a scene asks for, so a level knows exactly
// which difference names its scenes own. When painting the differences view it
// switches in only the chosen name, and every other var() call answers with its
// normal value. That makes each difference an independent variant of the same
// scene, and a screenshot of one name harmless.
//
// Every drawing argument is delegated untouched to the canvas context; these
// wrappers exist so the scene files read like the objects they paint.

import { Dice } from './random.js';

/** A linear gradient for fills and strokes. */
export function makeLinearGradient(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const stop of stops) g.addColorStop(stop[0], stop[1]);
  return g;
}

/** A radial glow from (x, y) out to (x, y). */
export function makeRadialGradient(ctx, x, y, radius, stops) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  for (const stop of stops) g.addColorStop(stop[0], stop[1]);
  return g;
}

/** A closed path through [x, y] points, smoothed with quadratic midpoints when smooth. */
export function polygon(ctx, points, smooth = false) {
  if (points.length < 2) return;
  ctx.beginPath();
  if (!smooth) {
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    return;
  }
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(points[points.length - 1], points[0]);
  ctx.moveTo(start[0], start[1]);
  for (let i = 0; i < points.length; i++) {
    const here = points[i];
    const next = points[(i + 1) % points.length];
    const m = mid(here, next);
    ctx.quadraticCurveTo(here[0], here[1], m[0], m[1]);
  }
  ctx.closePath();
}

/** A rounded rectangle path. */
export function roundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.arcTo(x + w, y, x + w, y + rad, rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.arcTo(x + w, y + h, x + w - rad, y + h, rad);
  ctx.lineTo(x + rad, y + h);
  ctx.arcTo(x, y + h, x, y + h - rad, rad);
  ctx.lineTo(x, y + rad);
  ctx.arcTo(x, y, x + rad, y, rad);
  ctx.closePath();
}

/** A star with `spikes` points, alternating outer and inner radius. */
export function starPath(ctx, x, y, spikes, outer, inner) {
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/** A circle path. */
export function circleAt(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
}

/** An ellipse path, optionally rotated. */
export function ellipseAt(ctx, x, y, rx, ry, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
  ctx.closePath();
}

/** Small texture marks inside a box: the grain that keeps a face from reading flat. */
export function scatterMarks(ctx, dice, x, y, w, h, count, color, alpha, size = 1.2) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  for (let i = 0; i < count; i++) {
    const px = x + dice.unit() * w;
    const py = y + dice.unit() * h;
    const r = 0.25 + dice.unit() * size;
    ctx.fillRect(px, py, r, r);
  }
  ctx.restore();
}

export class Painter {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Record<string, boolean>} variant names whose altered state is in
   * @param {number} seed
   * @param {number} width
   * @param {number} height
   */
  constructor(ctx, variant, seed, width, height) {
    this.ctx = ctx;
    this.variant = variant;
    this.seed = seed;
    this.width = width;
    this.height = height;
    this.names = new Set();
    this.dice = new Dice(seed);
  }

  /**
   * The value a difference chooses: normal unless its name is switched in.
   * Records the name, so the scene declares every difference it owns.
   */
  var(name, normal, altered) {
    this.names.add(name);
    return this.variant[name] === true ? altered : normal;
  }

  /**
   * A function body for a difference that paints extra or different detail:
   * run it only when the name is switched in; it records the name either way.
   */
  only(name, altered) {
    const on = this.variant[name] === true;
    this.names.add(name);
    if (on) altered();
    return on;
  }
}
