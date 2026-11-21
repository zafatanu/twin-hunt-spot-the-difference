// Scene 1 — Midnight Spice Bazaar (the hero scene).
//
// A night market in a walled lane: a lantern string and a pepper string over the
// street, a lit arch at the far end, a rug stall with a ginger cat on its awning,
// and the trader's stand where the merchant stirs a row of spice bowls.
//
// Every object is its own function, built from layered Bezier shapes, a gradient
// for shade and a soft highlight. The eight differences switch small parts of
// those objects through painter.var(name, normal, altered).

import { circleAt, ellipseAt, starPath } from './render.js';

const W = 590;
const H = 350;

const P = {
  burntOrange: '#C45A32',
  antiqueGold: '#E9B957',
  deepBurgundy: '#632C38',
  turquoise: '#369D91',
  warmCream: '#F6DDA8',
  midnightIndigo: '#252B48',
  nightHigh: '#141832',
  nightLow: '#3A3058',
  glow: '#FFD98A',
  lampRed: '#E8734F',
  oliveGold: '#B9893F',
  wallWarm: '#6B3B4E',
};

const DIFFERENCES = [
  { id: 'lantern-missing', level: 'easy', x: 0.352, y: 0.2, r: 27, hint: 'One hanging lantern is gone.' },
  { id: 'rug-star', level: 'medium', x: 0.5, y: 0.475, r: 30, hint: 'A rug diamond turned into a star.' },
  { id: 'bowl-recolour', level: 'easy', x: 0.148, y: 0.7, r: 24, hint: 'One spice bowl changed colour.' },
  { id: 'cat-tail', level: 'medium', x: 0.235, y: 0.275, r: 24, hint: 'The cat raised its tail.' },
  { id: 'moon-star', level: 'medium', x: 0.722, y: 0.075, r: 26, hint: 'The crescent moon turned into a star.' },
  { id: 'vase-handle', level: 'hard', x: 0.834, y: 0.71, r: 24, hint: 'The blue vase lost an ear.' },
  { id: 'peppers-five', level: 'hard', x: 0.407, y: 0.296, r: 26, hint: 'The pepper string hangs one short.' },
  { id: 'ladle-spoon', level: 'medium', x: 0.415, y: 0.63, r: 24, hint: 'The merchant stirs with a ladle.' },
];

export const BAZAAR = {
  id: 'bazaar',
  name: 'Midnight Spice Bazaar',
  blurb: 'Lanterns over the night market',
  palette: P,
  seed: 1912041,
  paint: paintBazaar,
  differences: DIFFERENCES,
};

export function paintBazaar(painter) {
  const ctx = painter.ctx;
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  drawSky(painter);
  drawStars(painter);
  drawGate(painter);
  drawFloor(painter);
  drawRugs(painter);
  drawMerchant(painter);
  drawCounter(painter);
  drawBowl(painter, 92, 258, 0);
  drawBowl(painter, 150, 262, 1);
  drawBowl(painter, 205, 259, 2);
  drawBowl(painter, 250, 260, 5);
  drawBowl(painter, 296, 261, 3);
  drawBowl(painter, 345, 258, 4);
  drawBench(painter);
  drawVase(painter);
  drawPepperString(painter);
  drawLanternString(painter);
  drawCat(painter);
  ctx.restore();
  return [...painter.names];
}

function drawSky(painter) {
  const ctx = painter.ctx;
  const sky = ctx.createLinearGradient(0, 0, 0, 200);
  sky.addColorStop(0, P.nightHigh);
  sky.addColorStop(0.62, P.midnightIndigo);
  sky.addColorStop(1, P.nightLow);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 200);
}

function drawGate(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const wall = ctx.createLinearGradient(0, 120, 0, 300);
  wall.addColorStop(0, '#5A3550');
  wall.addColorStop(1, '#33304F');
  ctx.fillStyle = wall;
  ctx.beginPath();
  ctx.moveTo(150, 130);
  ctx.lineTo(440, 130);
  ctx.lineTo(500, 300);
  ctx.lineTo(90, 300);
  ctx.closePath();
  ctx.fill();
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const t = i / 3;
      const x = 295 + side * (26 + t * 150);
      const w = 26 + t * 60;
      const top = 150 - t * 34;
      const body = ctx.createLinearGradient(x, top, x, 300);
      body.addColorStop(0, '#7C4153');
      body.addColorStop(1, '#3A2A45');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.moveTo(x - w / 2, 300);
      ctx.lineTo(x - w / 2, top + 12);
      ctx.quadraticCurveTo(x, top - 6, x + w / 2, top + 12);
      ctx.lineTo(x + w / 2, 300);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255,217,138,0.55)';
      ctx.fillRect(x - w * 0.18, top + 40, w * 0.14, w * 0.2);
      ctx.fillRect(x + w * 0.08, top + 66, w * 0.14, w * 0.2);
    }
  }
  ctx.fillStyle = '#2A2440';
  ctx.beginPath();
  ctx.moveTo(250, 210);
  ctx.lineTo(250, 152);
  ctx.quadraticCurveTo(295, 110, 340, 152);
  ctx.lineTo(340, 300);
  ctx.lineTo(250, 300);
  ctx.closePath();
  ctx.fill();
  const door = ctx.createLinearGradient(0, 130, 0, 230);
  door.addColorStop(0, '#FFD98A');
  door.addColorStop(1, 'rgba(233,185,87,0.15)');
  ctx.fillStyle = door;
  ctx.beginPath();
  ctx.moveTo(258, 210);
  ctx.lineTo(258, 160);
  ctx.quadraticCurveTo(295, 122, 332, 160);
  ctx.lineTo(332, 210);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = P.turquoise;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(256, 212);
  ctx.quadraticCurveTo(295, 105, 334, 212);
  ctx.stroke();
  ctx.fillStyle = P.antiqueGold;
  circleAt(ctx, 275, 196, 3.2);
  ctx.fill();
  circleAt(ctx, 315, 196, 3.2);
  ctx.fill();
  ctx.restore();
}

function drawRugs(painter) {
  const ctx = painter.ctx;
  // the stall awning the rugs hang from: a burgundy scolloped edge
  const awning = ctx.createLinearGradient(0, 60, 0, 100);
  awning.addColorStop(0, '#7A3546');
  awning.addColorStop(1, P.deepBurgundy);
  ctx.fillStyle = awning;
  ctx.beginPath();
  ctx.moveTo(12, 58);
  ctx.lineTo(360, 58);
  for (let sx = 360; sx > 12; sx -= 29) {
    ctx.quadraticCurveTo(sx - 14.5, 108, sx - 29, 92);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(233,185,87,0.35)';
  ctx.fillRect(12, 62, 348, 3);

  drawRug(painter, 26, 92, 66, 150);
  drawRug(painter, 148, 92, 66, 150);
  drawRug(painter, 270, 92, 66, 150);
}

function drawRug(painter, x, y, w, h) {
  const ctx = painter.ctx;
  ctx.save();
  const body = ctx.createLinearGradient(0, y, 0, y + h);
  body.addColorStop(0, '#8A3B4C');
  body.addColorStop(0.55, P.deepBurgundy);
  body.addColorStop(1, '#4E2130');
  ctx.fillStyle = body;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#2F1B28';
  ctx.fillRect(x, y, w, 7);

  ctx.strokeStyle = P.warmCream;
  ctx.lineWidth = 2.2;
  ctx.strokeRect(x + 5, y + 10, w - 10, h - 14);
  ctx.strokeStyle = P.turquoise;
  ctx.lineWidth = 1.3;
  ctx.strokeRect(x + 9, y + 14, w - 18, h - 22);

  const cx = x + w / 2;
  const cy = y + h / 2 - 1;
  ctx.fillStyle = P.antiqueGold;
  if (painter.var('rug-star', false, true)) {
    starPath(ctx, cx, cy, 4, 15, 5.5);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 13);
    ctx.lineTo(cx + 7.5, cy);
    ctx.lineTo(cx, cy + 13);
    ctx.lineTo(cx - 7.5, cy);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = P.warmCream;
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * w * 0.24, cy + dy * h * 0.2 - 4);
    ctx.lineTo(cx + dx * w * 0.26, cy + dy * h * 0.2);
    ctx.lineTo(cx + dx * w * 0.24, cy + dy * h * 0.2 + 4);
    ctx.lineTo(cx + dx * w * 0.22, cy + dy * h * 0.2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(246,221,168,0.35)';
  ctx.lineWidth = 1;
  circleAt(ctx, cx, cy, 19);
  ctx.stroke();

  ctx.strokeStyle = P.warmCream;
  ctx.lineWidth = 1.4;
  for (let fx = x + 6; fx < x + w - 4; fx += 7) {
    ctx.beginPath();
    ctx.moveTo(fx, y + h);
    ctx.lineTo(fx + painter.dice.jitter(1), y + h + 7);
    ctx.stroke();
  }

  ctx.strokeStyle = '#8C6A3E';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 5, y - 3.5);
  ctx.lineTo(x + w + 5, y - 3.5);
  ctx.stroke();
  ctx.restore();
}

function drawMerchant(painter) {
  const ctx = painter.ctx;
  const ladle = painter.var('ladle-spoon', false, true);
  const x = 210;
  const stand = 250;
  ctx.save();

  // the robe: a long wedge of turquoise and burgundy, shaded down its fold
  const robe = ctx.createLinearGradient(x - 50, stand - 170, x + 50, stand - 40);
  robe.addColorStop(0, '#2E8A80');
  robe.addColorStop(0.62, P.turquoise);
  robe.addColorStop(1, '#1F665E');
  ctx.fillStyle = robe;
  ctx.beginPath();
  ctx.moveTo(x - 22, stand - 150);
  ctx.quadraticCurveTo(x - 40, stand - 110, x - 48, stand + 18);
  ctx.quadraticCurveTo(x - 20, stand + 26, x + 12, stand + 22);
  ctx.quadraticCurveTo(x + 38, stand + 10, x + 30, stand - 120);
  ctx.quadraticCurveTo(x + 22, stand - 156, x - 22, stand - 150);
  ctx.closePath();
  ctx.fill();

  // a burgundy sash across the robe
  ctx.strokeStyle = P.deepBurgundy;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x - 34, stand - 116);
  ctx.quadraticCurveTo(x - 8, stand - 101, x + 22, stand - 112);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(233,185,87,0.65)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x - 33, stand - 118);
  ctx.quadraticCurveTo(x - 8, stand - 104, x + 21, stand - 114);
  ctx.stroke();

  // the head: a warm oval, a turban and a short beard
  const skin = ctx.createLinearGradient(x - 12, stand - 176, x + 8, stand - 156);
  skin.addColorStop(0, '#E8B98A');
  skin.addColorStop(1, '#C08A5E');
  ctx.fillStyle = skin;
  ellipseAt(ctx, x - 4, stand - 163, 8.5, 9.5);
  ctx.fill();

  ctx.fillStyle = '#D9CFC2';
  ctx.beginPath();
  ctx.ellipse(x - 4, stand - 171, 10, 5.4, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#B9A98F';
  ctx.beginPath();
  ctx.ellipse(x - 4, stand - 170, 10.5, 2.4, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5A3A2E';
  ctx.beginPath();
  ctx.ellipse(x - 4, stand - 155.5, 5.2, 4.4, 0, 0, Math.PI);
  ctx.fill();

  ctx.fillStyle = P.midnightIndigo;
  circleAt(ctx, x - 7.2, stand - 165.3, 0.9);
  ctx.fill();
  circleAt(ctx, x - 1.1, stand - 165.3, 0.9);
  ctx.fill();

  // the arms: the right reaches over the bowls holding the utensil,
  // the left rests on the counter's edge
  ctx.strokeStyle = '#2E8A80';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x - 40, stand - 128);
  ctx.quadraticCurveTo(x - 60, stand - 100, x - 62, stand + 16);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 22, stand - 150);
  ctx.quadraticCurveTo(x + 24, stand - 126, x + 34, stand - 74);
  ctx.stroke();
  // the hands
  ctx.fillStyle = '#C08A5E';
  circleAt(ctx, x + 34, stand - 74, 4.4);
  ctx.fill();
  circleAt(ctx, x - 62, stand + 16, 4);
  ctx.fill();

  // the utensil: a wooden ladle with a deep cup, or a small shallow spoon
  ctx.strokeStyle = '#8A5A38';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(x + 34, stand - 74);
  ctx.lineTo(x + 34, ladle ? 236 : 238);
  ctx.stroke();
  ctx.fillStyle = ladle ? '#A9764A' : '#C9A477';
  ctx.beginPath();
  if (ladle) {
    ctx.ellipse(x + 34, 236, 5.6, 7, 0, 0, Math.PI);
    ctx.closePath();
  } else {
    ctx.ellipse(x + 34, 240, 3.4, 1.8, 0, 0, Math.PI * 2);
  }
  ctx.fill();

  ctx.restore();
}

function drawCounter(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const top = ctx.createLinearGradient(0, 271, 0, 281);
  top.addColorStop(0, '#8A5A38');
  top.addColorStop(1, '#5D3A24');
  ctx.fillStyle = top;
  ctx.fillRect(58, 271, 318, 10);
  ctx.fillStyle = 'rgba(246,221,168,0.25)';
  ctx.fillRect(58, 271, 318, 2);
  const front = ctx.createLinearGradient(0, 281, 0, 298);
  front.addColorStop(0, '#6B4227');
  front.addColorStop(1, '#3A2418');
  ctx.fillStyle = front;
  ctx.fillRect(64, 281, 306, 17);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1;
  for (let px = 116; px < 360; px += 52) {
    ctx.beginPath();
    ctx.moveTo(px, 281);
    ctx.lineTo(px, 298);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBowl(painter, x, y, spiceIndex) {
  const ctx = painter.ctx;
  const warm = painter.var('bowl-recolour', false, spiceIndex === 2);
  ctx.save();

  // the cream foot of the bowl, then the bowl itself
  ctx.fillStyle = '#B89770';
  ctx.beginPath();
  ctx.ellipse(x, y + 9, 5.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  const bowl = ctx.createLinearGradient(x - 13, y - 4, x + 13, y + 8);
  bowl.addColorStop(0, '#FFF2D6');
  bowl.addColorStop(0.55, '#F0DCB6');
  bowl.addColorStop(1, '#A9835A');
  ctx.fillStyle = bowl;
  ctx.beginPath();
  ctx.moveTo(x - 13, y - 4);
  ctx.quadraticCurveTo(x - 11, y + 9, x, y + 9);
  ctx.quadraticCurveTo(x + 11, y + 9, x + 13, y - 4);
  ctx.quadraticCurveTo(x, y + 2, x - 13, y - 4);
  ctx.closePath();
  ctx.fill();

  // the turquoise band round the bowl's rim
  ctx.strokeStyle = P.turquoise;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x - 12.6, y - 4);
  ctx.quadraticCurveTo(x, y + 2, x + 12.6, y - 4);
  ctx.stroke();

  // the mound of spice: a soft dome, golden or deep red, with a lit crown
  const spice = ctx.createLinearGradient(x - 9, y - 14, x + 9, y - 4);
  if (warm) {
    spice.addColorStop(0, '#C8462F');
    spice.addColorStop(1, '#7E2A22');
  } else {
    spice.addColorStop(0, '#F5C85B');
    spice.addColorStop(1, '#B9893F');
  }
  ctx.fillStyle = spice;
  ctx.beginPath();
  ctx.moveTo(x - 11, y - 4);
  ctx.quadraticCurveTo(x - 9, y - 15, x, y - 15);
  ctx.quadraticCurveTo(x + 9, y - 15, x + 11, y - 4);
  ctx.closePath();
  ctx.fill();

  // three grains of spice scattered on the mound
  ctx.fillStyle = 'rgba(99,44,56,0.55)';
  for (let i = 0; i < 3; i++) {
    const gx = x - 6 + i * 5 + painter.dice.jitter(1);
    const gy = y - 8 - Math.abs(2 - i) * 2;
    circleAt(ctx, gx, gy, 0.9);
    ctx.fill();
  }
  ctx.restore();
}

function drawStars(painter) {
  const ctx = painter.ctx;
  ctx.save();
  for (let i = 0; i < 40; i++) {
    const x = painter.dice.unit() * W;
    const y = 4 + painter.dice.unit() * 120;
    const r = 0.4 + painter.dice.unit() * 0.8;
    ctx.globalAlpha = 0.2 + painter.dice.unit() * 0.55;
    ctx.fillStyle = P.warmCream;
    circleAt(ctx, x, y, r);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  drawMoon(painter);
  ctx.restore();
}

function drawMoon(painter) {
  const ctx = painter.ctx;
  const star = painter.var('moon-star', false, true);
  const x = 426;
  const y = 26;
  ctx.save();
  const halo = ctx.createRadialGradient(x, y, 2, x, y, 26);
  halo.addColorStop(0, 'rgba(255,217,138,0.55)');
  halo.addColorStop(1, 'rgba(255,217,138,0)');
  ctx.fillStyle = halo;
  circleAt(ctx, x, y, 26);
  ctx.fill();
  ctx.fillStyle = P.warmCream;
  if (star) {
    starPath(ctx, x, y, 5, 11, 4.6);
  } else {
    ctx.beginPath();
    ctx.arc(x, y, 8.5, 0, Math.PI * 2);
    ctx.ellipse(x + 4.6, y - 1.2, 7.6, 7.2, -0.35, 0, Math.PI * 2, true);
  }
  ctx.fill();
  ctx.restore();
}

function drawCat(painter) {
  const ctx = painter.ctx;
  const raised = painter.var('cat-tail', false, true);
  const x = 139;
  const y = 88;
  ctx.save();
  // the tail: one bezier, its end lifted when raised
  ctx.strokeStyle = '#E49A4B';
  ctx.lineWidth = 4.6;
  ctx.beginPath();
  ctx.moveTo(x + 13, y + 12);
  ctx.bezierCurveTo(x + 27, y + 16, x + 30, y + 4, raised ? x + 23 : x + 35, raised ? y - 9 : y + 11);
  ctx.stroke();

  // the body: a ginger loaf shaded to its own dark at the paws
  const fur = ctx.createLinearGradient(x - 8, y, x + 10, y + 20);
  fur.addColorStop(0, '#F2A85C');
  fur.addColorStop(1, '#B5642C');
  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.moveTo(x - 9, y + 20);
  ctx.quadraticCurveTo(x - 10, y + 4, x + 1, y + 3);
  ctx.quadraticCurveTo(x + 10, y + 4, x + 11, y + 15);
  ctx.quadraticCurveTo(x + 12, y + 21, x + 5, y + 21);
  ctx.lineTo(x - 9, y + 21);
  ctx.closePath();
  ctx.fill();

  // the head and two ears
  ctx.fillStyle = '#F2A85C';
  circleAt(ctx, x - 6, y + 2, 6.2);
  ctx.fill();
  ctx.fillStyle = '#D9852F';
  ctx.beginPath();
  ctx.moveTo(x - 11, y - 1);
  ctx.lineTo(x - 9, y - 7);
  ctx.lineTo(x - 5, y - 3);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 3, y - 4);
  ctx.lineTo(x - 1, y - 8);
  ctx.lineTo(x + 2, y - 3);
  ctx.closePath();
  ctx.fill();

  // eyes and a cream muzzle
  ctx.fillStyle = P.midnightIndigo;
  circleAt(ctx, x - 8, y + 2, 0.9);
  ctx.fill();
  circleAt(ctx, x - 4, y + 2, 0.9);
  ctx.fill();
  ctx.fillStyle = P.warmCream;
  circleAt(ctx, x - 6, y + 4.3, 1.6);
  ctx.fill();
  ctx.restore();
}

function drawBench(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const bench = ctx.createLinearGradient(0, 250, 0, 330);
  bench.addColorStop(0, '#4A3350');
  bench.addColorStop(1, '#241C33');
  ctx.fillStyle = bench;
  ctx.beginPath();
  ctx.moveTo(372, 250);
  ctx.quadraticCurveTo(496, 238, 590, 252);
  ctx.lineTo(590, 330);
  ctx.quadraticCurveTo(500, 322, 380, 318);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(246,221,168,0.22)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(372, 256);
  ctx.quadraticCurveTo(496, 244, 590, 258);
  ctx.stroke();

  ctx.fillStyle = '#5D2F42';
  ctx.beginPath();
  ctx.moveTo(378, 270);
  ctx.lineTo(590, 276);
  ctx.lineTo(590, 284);
  ctx.lineTo(378, 278);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawVase(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const handle = painter.var('vase-handle', true, false);
  const vase = ctx.createLinearGradient(462, 0, 522, 0);
  vase.addColorStop(0, '#7FB6D6');
  vase.addColorStop(0.55, '#C6E2F0');
  vase.addColorStop(1, '#4E86A8');
  ctx.fillStyle = vase;
  ctx.beginPath();
  ctx.moveTo(480, 298);
  ctx.lineTo(492, 232);
  ctx.lineTo(487, 218);
  ctx.lineTo(473, 212);
  ctx.lineTo(473, 206);
  ctx.lineTo(497, 206);
  ctx.lineTo(497, 212);
  ctx.lineTo(491, 218);
  ctx.lineTo(505, 232);
  ctx.lineTo(498, 298);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#2F5878';
  for (let i = 0; i < 4; i++) {
    circleAt(ctx, 486 + (i % 3) * 4, 244 + Math.floor(i / 3) * 9, 1.2);
    ctx.fill();
  }
  ctx.strokeStyle = '#2F5878';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(482, 268);
  ctx.lineTo(494, 268);
  ctx.moveTo(481, 280);
  ctx.lineTo(495, 280);
  ctx.stroke();

  ctx.strokeStyle = '#4E86A8';
  ctx.lineWidth = 4;
  if (handle) {
    ctx.beginPath();
    ctx.arc(499, 244, 7, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(471, 244, 7, Math.PI / 2, (Math.PI * 3) / 2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(499, 244, 7, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFloor(painter) {
  const ctx = painter.ctx;
  const floor = ctx.createLinearGradient(0, 296, 0, H);
  floor.addColorStop(0, '#2A2138');
  floor.addColorStop(1, '#171222');
  ctx.fillStyle = floor;
  ctx.fillRect(0, 296, W, H - 296);
  ctx.strokeStyle = 'rgba(233,185,87,0.10)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i++) {
    const fx = 20 + i * 92;
    ctx.beginPath();
    ctx.moveTo(fx, 296);
    ctx.lineTo(fx + i * 6 - 18, H);
    ctx.stroke();
  }
}

function drawLanternString(painter) {
  const ctx = painter.ctx;
  const missing = painter.var('lantern-missing', -1, 1);
  ctx.save();

  const pipe = ctx.createLinearGradient(0, 38, 0, 47);
  pipe.addColorStop(0, '#5A5F7A');
  pipe.addColorStop(1, '#232840');
  ctx.fillStyle = pipe;
  ctx.fillRect(10, 38, W - 20, 9);

  ctx.strokeStyle = 'rgba(246,221,168,0.65)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(14, 39.4);
  ctx.lineTo(W - 14, 39.4);
  ctx.stroke();

  ctx.fillStyle = '#A8863F';
  ctx.fillRect(6, 35, 6, 15);
  ctx.fillRect(W - 12, 35, 6, 15);
  ctx.fillStyle = 'rgba(233,185,87,0.6)';
  ctx.fillRect(7, 36, 2, 13);
  ctx.fillRect(W - 11, 36, 2, 13);

  for (let i = 0; i < 5; i++) {
    if (i === missing) continue;
    const lx = 78 + i * 110;
    ctx.strokeStyle = '#8E8B96';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lx, 47);
    ctx.lineTo(lx + painter.dice.jitter(1), 57);
    ctx.stroke();
    drawLantern(painter, lx, 57);
  }
  ctx.restore();
}

function drawLantern(painter, cx, top) {
  const ctx = painter.ctx;
  const w = 38;
  const h = 48;
  drawLanternBody(ctx, cx, top, w, h);
  ctx.strokeStyle = '#7A4A1E';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(cx, top + h + 2);
  ctx.lineTo(cx + painter.dice.jitter(1), top + h + 14);
  ctx.stroke();
}

function drawLanternBody(ctx, cx, top, w, h) {
  ctx.fillStyle = '#7A4A1E';
  ctx.fillRect(cx - 5, top - 4, 10, 5);
  const body = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
  body.addColorStop(0, '#B9482C');
  body.addColorStop(0.5, '#F09560');
  body.addColorStop(1, '#9C3A2A');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, top + 5);
  ctx.bezierCurveTo(cx - w / 2 - 4, top + h * 0.62, cx - w * 0.3, top + h, cx, top + h);
  ctx.bezierCurveTo(cx + w * 0.3, top + h, cx + w / 2 + 4, top + h * 0.62, cx + w / 2, top + 5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(122,74,30,0.5)';
  ctx.lineWidth = 1;
  for (const dx of [-7, 7]) {
    ctx.beginPath();
    ctx.moveTo(cx + dx, top + 6);
    ctx.quadraticCurveTo(cx + dx * 1.35, top + h * 0.55, cx + dx, top + h - 2);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(233,185,87,0.7)';
  ctx.fillRect(cx - w / 2 + 4, top + 8, 2.4, h * 0.55);
  ctx.fillStyle = '#7A4A1E';
  ctx.fillRect(cx - 4, top + h - 1, 8, 3);
}

function drawPepperString(painter) {
  const ctx = painter.ctx;
  const short = painter.var('peppers-five', false, true);
  ctx.save();
  ctx.strokeStyle = '#4A2E38';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(140, 86);
  ctx.quadraticCurveTo(240, 100, 340, 86);
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    if (short && i === 2) continue;
    drawPepperBunch(ctx, 160 + i * 40, 100);
  }
  ctx.restore();
}

function drawPepperBunch(ctx, x, top) {
  ctx.strokeStyle = '#4A2E38';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x, top - 12);
  ctx.lineTo(x, top + 4);
  ctx.stroke();
  for (let k = 0; k < 3; k++) {
    const dx = (k - 1) * 4;
    const len = 14 + Math.abs(k - 1) * -3;
    const lx = x + dx;
    const pepper = ctx.createLinearGradient(lx - 2, top, lx + 2, top + len);
    pepper.addColorStop(0, '#E8714F');
    pepper.addColorStop(1, '#9E2F28');
    ctx.fillStyle = pepper;
    ctx.beginPath();
    ctx.moveTo(lx - 2.1, top + 3);
    ctx.quadraticCurveTo(lx - 2.6, top + len - 2, lx, top + len);
    ctx.quadraticCurveTo(lx + 2.6, top + len - 2, lx + 2.1, top + 3);
    ctx.closePath();
    ctx.fill();
  }
}
