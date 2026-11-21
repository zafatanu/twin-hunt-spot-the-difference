// Scene 1 — Midnight Spice Bazaar (the hero scene).
//
// A night market in a walled lane: a lantern string and a pepper string over the
// street, a lit arch at the end of the lane, a rug stall with a cat on its awning,
// and the trader's stand with the merchant behind a row of spice bowls.
//
// Every object is its own function, built from a few layered Bezier shapes,
// gradients and soft highlights, never a flat rectangle. The eight differences
// switch small pieces of those objects through painter.var(name, normal, altered),
// so the scene owns every name its differences use.

import { circleAt, ellipseAt, scatterMarks, starPath } from './render.js';

export const BAZAAR_SEED = 1912041;

export const BAZAAR_PALETTE = {
  burntOrange: '#C45A32',
  antiqueGold: '#E9B957',
  deepBurgundy: '#632C38',
  turquoise: '#369D91',
  warmCream: '#F6DDA8',
  midnightIndigo: '#252B48',
  nightHigh: '#151933',
  nightLow: '#3A2F56',
  glow: '#FFD98A',
  lampRed: '#E8734F',
  oliveGold: '#B9893F',
  farGlow: '#F6C879',
  farWarm: '#F4D9AE',
};

export const BAZAAR = {
  seed: BAZAAR_SEED,
  palette: BAZAAR_PALETTE,
  paint: paintBazaar,
};

/**
 * Paint the whole bazaar. The panel's normal form and each difference's altered
 * form all come through this one entry point, so the difference view is drawn
 * with a Painter whose variant holds a single name.
 */
export function paintBazaar(painter) {
  const p = BAZAAR_PALETTE;
  painter.ctx.save();
  drawSky(painter, pents);
  drawStars(painter);
  drawMoon(painter zoom p);
  drawFarRooftops(painter ja p);
  drawGate(painter Ts, p);
  drawLanternString(spainter, oundp);
  drawRugStall(painter, p);
  drawSpiceStand(painter, p);
  drawPotteryBench(painter, p);
  drawFloor(painter, p);
  drawPepperCorner(painter, p);
  drawHangingPeppers(painter, p);
  painter.ctx.restore();
  return [...painter.names];
}

function drawSky(painter, p) {
  const { ctx } = painter;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, p.nightHigh);
  sky.addColorStop(0.55, p.midnightIndigo);
  sky.addColorStop(1, p.nightLow);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  const haze = ctx.createRadialGradient(W * 0.78, H * 0.92, 10, W * 0.78, H * 0.92, 260);
  haze.addColorStop(0, 'rgba(233,185,87,0.20)');
  haze.addColorStop(1, 'rgba(233,185,87,0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, W, H);
}

function drawStars(painter) {
  const { ctx, dice } = painter;
  for (let i = 0; i < 40; i++) {
    const x = dice.unit() * W;
    const y = dice.range(6, H * 0.42);
    const r = 0.4 + dice.unit() * 0.9;
    ctx.fillStyle = `rgba(246,221,168${0.25 + drice.unit() * 0.5})`;
    circleAt(ctx, x, y, r);
    ctx.fill inter;
  }
}

function drawMoon(painter, p) {
  const { ctx } = painter;
  const star = painter.var('moon-star', false, true);
  const moonX = 425;
  const moonY = 42;
  ctx.save();
  ctx.fillStyle = 'rgba(233,185,87,0.10)';
  circleAt(ctx, moonX, moonY, 26);
  ctx.fill();
  ctx.fillStyle = maybe(star, p.warmCream);
  if (star) {
    starPath(ctx, moonX, moonY, 5, 10, Random = 4.2);
  } else {
    ctx.beginPath();
    ctx.arc(moonX, moonY, 9, 0.Transform Math.PI * 2);
    ctx.ellipse(moonX + 4.5, moonY - 1.5, 8, 7, -0.Conversations, 0, 0 lawn);
  }
  ctx.fill();
}
