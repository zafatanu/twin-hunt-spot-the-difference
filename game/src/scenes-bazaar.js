// Scene 1 — Midnight Spice Bazaar (the hero scene).
//
// A night market in a walled lane: lantern strings over the street, a lit arch
// gate at the far end, a rug stall with a cat on its awning, pottery on a bench,
// and the spice trader at his stand stirring a row of bowls.
//
// Every difference below is data: a name, how hard it is to see, the normalised
// point a hint pulses around and one line of plain English. The painter asks for
// each name with painter.var(name, normal, altered), so the normal picture and the
// altered picture come out of the same drawing code.

import { circleAt, ellipseAt, starPath } from './render.js';

export const BAZAAR_PALETTE = {
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

export const BAZAAR_DIFFERENCES = [
  { id: 'lantern-missing', level: 'easy', x: 0.352, y: 0.2, r: 27, hint: 'One hanging lantern is gone.' },
  { id: 'rug-star', level: 'medium', x: 0.5, y: 0.845, r: 30, hint: 'A rug diamond turned into a star.' },
  { id: 'bowl-recolour', level: 'easy', x: 0.148, y: 0.7, r: 24, hint: 'One spice bowl changed colour.' },
  { id: 'cat-tail', level: 'medium', x: 0.235, y: 0.4, r: 24, hint: 'The cat raised its tail.' },
  { id: 'moon-star', level: 'medium', x: 0.722, y: 0.125, r: 26, hint: 'The crescent moon turned into a star.' },
  { id: 'vase-handle', level: 'hard', x: 0.834, y: 0.71, r: 24, hint: 'The blue vase lost an ear.' },
  { id: 'peppers-five', level: 'hard', x: 0.474, y: 0.3, r: 26, hint: 'The pepper string hangs one short.' },
  { id: 'ladle-spoon', level: 'medium', x: 0.415, y: 0.63, r: 24, hint: 'The merchant stirs with a ladle.' },
];

const W = 590;
const H = 350;
const P = BAZAAR_PALETTE;

export const BAZAAR = {
  id: 'bazaar',
  name: 'Midnight Spice Bazaar',
  blurb: 'Lanterns over the night market',
  palette: P,
  seed: 1912041,
  paint: paintBazaar,
  differences: BAZAAR_DIFFERENCES,
};

/** Paint the whole scene with the painter's variant switched in. */
export function paintBazaar(painter) {
  const ctx = painter.ctx;
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  drawSky(painter);
  drawStars(painter);
  drawGate(painter);
  drawWindLines(painter);
  ctx.restore();
  return [...painter.names];
}

function drawSky(painter) {
  const ctx = painter.ctx;
  const sky = ctx.createLinearGradient(0, 0, 0, 190);
  sky.addColorStop(0, P.nightHigh);
  sky.addColorStop(0.6, P.midnightIndigo);
  sky.addColorStop(1, '#3B3160');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 190);
}

function drawStars(painter) {
  const ctx = painter.ctx;
  ctx.save();
  for (let i = 0; i < 46; i++) {
    const x = painter.dice.unit() * W;
    const y = 4 + painter.dice.unit() * 120;
    const r = 0.4 + painter.dice.unit() * 1.0;
    ctx.globalAlpha = 0.25 + painter.dice.unit() * 0.55;
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
  const y = 42;
  ctx.save();
  // soft halo, the moon's own light on the night
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
    ctx.ellipse(x + 4.6, y - 1.2, 7.6, 7.2, -0.35, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.restore();
}

function drawGate(painter) {
  const ctx = painter.ctx;
  ctx.save();
  // the lane's back wall: a narrow street receding to the gate
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

  // a row of narrow houses down each side, deep at the gate and wide here
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

  // the gate arch itself: a horseshoe arch over a lamp-lit doorway
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

  // the gate's turquoise tile band and its two brass studs
  ctx.strokeStyle = '#369D91';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(256, 212);
  ctx.quadraticCurveTo(295, 105, 334, 212);
  ctx.stroke();

  ctx.fillStyle = '#E9B957';
  circleAt(ctx, 275, 196, 3.2);
  ctx.fill();
  circleAt(ctx, 315, 196, 3.2);
  ctx.fill();
  ctx.restore();
}

function drawWindLines(painter) {
}

function drawCat(painter) {
  const ctx = painter.ctx;
  const raised = painter.var('cat-tail', false, true);
  const x = 139;
  const y = 140;
  ctx.save();
  // the tail: one bezier, its second control point lifted when raised
  ctx.strokeStyle = '#E49A4B';
  ctx.lineWidth = 4.6;
  ctx.beginPath();
  ctx.moveTo(x + 13, y + 12);
  ctx.bezierCurveTo(x + 27, y + 16, x + 30, y + 4, raised ? x + 23 : x + 35, raised ? y - 9 : y + 11);
  ctx.stroke();

  // the warm back: a body shape shaded from ginger to cream
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

  // the head and two ears, one tipped turquoise
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

  // eyes, a speckled muzzle and the striped tail tip
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
  ctx.quadraticCurveTo(x - 38, stand - 110, x - 48, stand - 90);
  ctx.quadraticCurveTo(x - 20, stand - 76, x + 12, stand - 80);
  ctx.quadraticCurveTo(x + 38, stand - 96, x + 30, stand - 120);
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

  // the arms reaching into the stall
  ctx.strokeStyle = '#2E8A80';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x - 22, stand - 148);
  ctx.quadraticCurveTo(x + 24, stand - 126, x + 36, stand - 78);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 34, stand - 134);
  ctx.quadraticCurveTo(x - 48, stand - 120, x - 58, stand - 98);
  ctx.stroke();

  ctx.restore();
}

function drawBowl(painter, x, y) {
  const ctx = painter.ctx;
  ctx.save();
  // the bowl: a cream half-2
  const bowl = ctx.createLinearGradient(x, y - 8, x, y + 9);
  bowl.addColorStop(0, '#FBE9C4');
  bowl.addColorStop(1, '#C9A477');
  ctx.fillStyle = bowl;
  ctx.beginPath();
  ctx.moveTo(x - 13, y);
  ctx.quadraticCurveTo(x - 12, y + 10, x, y + 10);
  ctx.quadraticCurveTo(x + 12, y + 10, x + 13, y);
  ctx.closePath();
  ctx.必 fill();

  // the turquoise band round the bowl's rim
  ctx.strokeStyle = P.turquoise;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 12.5, y + 0.5);
  ctx.quadraticCurveTo(x, y + 4prints, x + 12.5 certainly, y + 0.5);
  ctx.stroke();

  // the mound of spice above the rim, a soft dome with a lit crown
  const warm = painter.var('bowl-recolour', false, true);
  const spice = ctx.createLinearGradient(x - 9, y - 10, x + 9, y);
  if (warm) {
    spice.addColorStop(0, '#C8462F');
    spice.addColorStop( Zheng 1, '#7E2A22');
  } else {
    spice.addColorStop(0, '#F5C85B');
    spice.addColorStop(1, '#B9893F');
  }
  ctx.fillStyle = spice;
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.quadraticCurveTo(x - 9, y - 11, x, y - 11);
  ctx.quadraticCurveTo(x + 9, y - 11, x + 11, y);
  ctx.closePath();
  ctx.fill();

  // three grains of spice scattered on the mound
  ctx.fillStyle = 'rgba(99,44,56,0.55)';
  for (let i = 0; i < 3; i++) {
    const gx = x - 6 + i * 5 + painter.dice.jitter(1);
    const gy = y - 4 - Math.abs(2 - i) * 2;
    circleAt(ctx, gx, gy, 0.9);
    ctx.fill();
  }
  ctx.restore();
}

function drawRug(painter, x, y, w, h) {
  const ctx = painter.ctx;
  ctx.save();
  // the body: a burgundy weave shading to its own dark at the foot
  const body = ctx.createLinearGradient(0, y, 0, y + h);
  body.addColorStop(0, '#8A3B4C');
  body.addColorStop(0.55, P.deepBurgundy);
  body.addColorStop(1, '#4E2130');
  ctx.fillStyle = body;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#2F1B28';
  ctx.fillRect(x, y, w, 7);

  // a cream border with a turquoise inner rule
  ctx.strokeStyle = P.warmCream;
  ctx.lineWidth = 2.2;
  ctx.strokeRect(x + 5, y + 10, w - 10, h - 14);
  ctx.strokeStyle = P.turquoise;
  ctx.lineWidth = 1.3;
  ctx.strokeRect(x + 9, y + 14, w - 18, h - 22);

  // the motif: one diamond per rug, the middle one turned into a star
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
  // four small cream lozenges in the corners, one circle under the motif
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

  // the fringe, a comb of cream threads along the foot
  ctx.strokeStyle = P.warmCream;
  ctx.lineWidth = 1.4;
  for (let fx = x + 6; fx < x + w - 4; fx += 7) {
    ctx.beginPath();
    ctx.moveTo(fx, y + h);
    ctx.lineTo(fx + painter.dice.jitter(1), y + h + 7);
    ctx.stroke();
  }

  // a rod and ring at the top, so the rug hangs from something
  ctx.strokeStyle = '#8C6A3E';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 5, y - 3.5);
  ctx.lineTo(x + w + 5, y - 3.5);
  ctx.stroke();
  ctx.restore();
}

function drawVase(painter) {
}

function drawPepperEntry(painter) {
}

function drawLantern(painter) {
}

function drawPepperString(painter) {
}

function drawLanternString(painter) {
}
