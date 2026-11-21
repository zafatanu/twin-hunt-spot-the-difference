// Scene 2 — Clockmaker's Enchanted Workshop.
//
// A walnut-paneled room: a brass wall clock with a pendulum, a cluster of gears
// on the right wall, an arched window, a shelf of potion bottles and a candle,
// a mechanical bird on a perch over the workbench, a drawer cabinet with books
// stacked on top, and a mouse on the floor holding its treasure.
//
// Every object is its own function, built from layered shapes, a gradient for
// shade and a soft highlight. The eight differences switch small parts of those
// objects through painter.var(name, normal, altered).

import { circleAt, ellipseAt, starPath, scatterMarks } from './render.js';

const W = 590;
const H = 350;

const P = {
  copper: '#B96D42',
  brass: '#D6AD55',
  walnut: '#50372C',
  emerald: '#547E65',
  cream: '#F1DDBB',
  teal: '#254A4C',
  walnutHigh: '#6B4A38',
  walnutLow: '#33221B',
  brassHigh: '#F0D08A',
  brassLow: '#8A6A2E',
  glow: '#FFD98A',
};

const DIFFERENCES = [
  { id: 'clock-hour', level: 'medium', x: 0.203, y: 0.251, r: 30, hint: 'The wall clock strikes a different hour.' },
  { id: 'gear-teeth', level: 'hard', x: 0.732, y: 0.223, r: 26, hint: 'The big gear grew two teeth fewer.' },
  { id: 'potion-colour', level: 'easy', x: 0.573, y: 0.443, r: 22, hint: 'One potion bottle changed colour.' },
  { id: 'bird-wings', level: 'medium', x: 0.415, y: 0.394, r: 24, hint: 'The mechanical bird raised its wings.' },
  { id: 'books-count', level: 'medium', x: 0.127, y: 0.634, r: 24, hint: 'The book stack lost its top book.' },
  { id: 'candle-flame', level: 'easy', x: 0.881, y: 0.389, r: 22, hint: 'The candle flame went out.' },
  { id: 'drawer-handle', level: 'hard', x: 0.2, y: 0.774, r: 20, hint: 'A drawer knob became a brass handle.' },
  { id: 'mouse-item', level: 'medium', x: 0.539, y: 0.886, r: 22, hint: 'The mouse swapped its cheese for a key.' },
];

export const WORKSHOP = {
  id: 'workshop',
  name: "Clockmaker's Enchanted Workshop",
  blurb: 'Gears, potions and a brass bird',
  palette: P,
  seed: 771203,
  paint: paintWorkshop,
  differences: DIFFERENCES,
};

export function paintWorkshop(painter) {
  const ctx = painter.ctx;
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  drawWall(painter);
  drawFloor(painter);
  drawWindow(painter);
  drawClock(painter);
  drawGears(painter);
  drawShelf(painter);
  drawBottle(painter, 338, 'blue');
  drawBottle(painter, 380, 'green');
  drawBottle(painter, 420, 'amber');
  drawCandle(painter);
  drawBench(painter);
  drawBird(painter);
  drawCabinet(painter);
  drawBooks(painter);
  drawTools(painter);
  drawMouse(painter);
  drawWatch(painter);
  ctx.restore();
  return [...painter.names];
}

function drawWatch(painter) {
  const ctx = painter.ctx;
  const x = 556;
  const y = 232;
  ctx.save();
  ctx.strokeStyle = P.brassLow;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x, 199);
  ctx.quadraticCurveTo(x + 4, 210, x, y - 12);
  ctx.stroke();
  const rim = ctx.createLinearGradient(x - 10, y - 10, x + 10, y + 10);
  rim.addColorStop(0, P.brassHigh);
  rim.addColorStop(1, P.brassLow);
  ctx.fillStyle = rim;
  circleAt(ctx, x, y, 11);
  ctx.fill();
  ctx.fillStyle = P.cream;
  circleAt(ctx, x, y, 8);
  ctx.fill();
  ctx.strokeStyle = P.walnut;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 4, y - 3);
  ctx.moveTo(x, y);
  ctx.lineTo(x - 2, y - 5);
  ctx.stroke();
  ctx.fillStyle = P.brassLow;
  ctx.fillRect(x - 2, y - 14, 4, 3);
  ctx.restore();
}

function drawWall(painter) {
  const ctx = painter.ctx;
  const wall = ctx.createLinearGradient(0, 0, 0, 290);
  wall.addColorStop(0, P.walnutHigh);
  wall.addColorStop(0.6, P.walnut);
  wall.addColorStop(1, P.walnutLow);
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, 290);
  ctx.strokeStyle = 'rgba(0,0,0,0.28)';
  ctx.lineWidth = 2;
  for (let px = 74; px < W; px += 74) {
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, 290);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(241,221,187,0.07)';
  ctx.lineWidth = 1;
  for (let px = 76; px < W; px += 74) {
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, 290);
    ctx.stroke();
  }
  scatterMarks(ctx, painter.dice, 0, 0, W, 290, 220, '#2A1B14', 0.25, 1.6);
  scatterMarks(ctx, painter.dice, 0, 0, W, 290, 90, P.cream, 0.05, 1.2);
}

function drawFloor(painter) {
  const ctx = painter.ctx;
  const floor = ctx.createLinearGradient(0, 290, 0, H);
  floor.addColorStop(0, '#5D4030');
  floor.addColorStop(1, '#2E1E16');
  ctx.fillStyle = floor;
  ctx.fillRect(0, 290, W, H - 290);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 4; i++) {
    const fy = 302 + i * 13;
    ctx.beginPath();
    ctx.moveTo(0, fy);
    ctx.lineTo(W, fy);
    ctx.stroke();
  }
  for (let i = 0; i < 9; i++) {
    const fx = 30 + i * 66 + (i % 2) * 24;
    ctx.beginPath();
    ctx.moveTo(fx, 290 + (i % 4) * 13);
    ctx.lineTo(fx, 303 + (i % 4) * 13);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(241,221,187,0.06)';
  ctx.fillRect(0, 290, W, 2);
}

function drawWindow(painter) {
  const ctx = painter.ctx;
  const x = 290;
  const y = 62;
  ctx.save();
  const night = ctx.createLinearGradient(x, y - 30, x, y + 30);
  night.addColorStop(0, '#1B3A44');
  night.addColorStop(1, P.teal);
  ctx.fillStyle = night;
  ctx.beginPath();
  ctx.moveTo(x - 26, y + 30);
  ctx.lineTo(x - 26, y - 4);
  ctx.arc(x, y - 4, 26, Math.PI, 0);
  ctx.lineTo(x + 26, y + 30);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = P.cream;
  for (let i = 0; i < 9; i++) {
    const sx = x - 20 + painter.dice.unit() * 40;
    const sy = y - 24 + painter.dice.unit() * 46;
    circleAt(ctx, sx, sy, 0.5 + painter.dice.unit() * 0.7);
    ctx.globalAlpha = 0.3 + painter.dice.unit() * 0.5;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const moonGlow = ctx.createRadialGradient(x + 10, y - 12, 1, x + 10, y - 12, 14);
  moonGlow.addColorStop(0, 'rgba(255,217,138,0.8)');
  moonGlow.addColorStop(1, 'rgba(255,217,138,0)');
  ctx.fillStyle = moonGlow;
  circleAt(ctx, x + 10, y - 12, 14);
  ctx.fill();
  ctx.fillStyle = P.glow;
  circleAt(ctx, x + 10, y - 12, 4.5);
  ctx.fill();
  ctx.strokeStyle = P.brassLow;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 28, y + 32);
  ctx.lineTo(x - 28, y - 4);
  ctx.arc(x, y - 4, 28, Math.PI, 0);
  ctx.lineTo(x + 28, y + 32);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.lineTo(x, y + 32);
  ctx.moveTo(x - 27, y + 8);
  ctx.lineTo(x + 27, y + 8);
  ctx.stroke();
  ctx.fillStyle = P.walnutLow;
  ctx.fillRect(x - 34, y + 30, 68, 6);
  ctx.restore();
}

function drawClock(painter) {
  const ctx = painter.ctx;
  const hour = painter.var('clock-hour', 3.25, 4.25);
  const x = 120;
  const y = 88;
  ctx.save();
  ctx.fillStyle = P.walnutLow;
  ctx.beginPath();
  ctx.moveTo(x - 16, y + 36);
  ctx.lineTo(x + 16, y + 36);
  ctx.lineTo(x + 12, y + 84);
  ctx.lineTo(x - 12, y + 84);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = P.brassLow;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x, y + 40);
  ctx.lineTo(x + 5, y + 72);
  ctx.stroke();
  const bob = ctx.createRadialGradient(x + 4, y + 72, 1, x + 5, y + 74, 8);
  bob.addColorStop(0, P.brassHigh);
  bob.addColorStop(1, P.brassLow);
  ctx.fillStyle = bob;
  circleAt(ctx, x + 5, y + 74, 7);
  ctx.fill();

  const rim = ctx.createLinearGradient(x - 40, y - 40, x + 40, y + 40);
  rim.addColorStop(0, P.brassHigh);
  rim.addColorStop(0.5, P.brass);
  rim.addColorStop(1, P.brassLow);
  ctx.fillStyle = rim;
  circleAt(ctx, x, y, 40);
  ctx.fill();
  const face = ctx.createRadialGradient(x - 8, y - 10, 4, x, y, 34);
  face.addColorStop(0, '#FBF0D8');
  face.addColorStop(1, P.cream);
  ctx.fillStyle = face;
  circleAt(ctx, x, y, 33);
  ctx.fill();
  ctx.strokeStyle = P.walnut;
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const long = i % 3 === 0;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (long ? 26 : 29), y + Math.sin(a) * (long ? 26 : 29));
    ctx.lineTo(x + Math.cos(a) * 31, y + Math.sin(a) * 31);
    ctx.stroke();
  }
  const ha = (hour / 12) * Math.PI * 2 - Math.PI / 2;
  const ma = (15 / 60) * Math.PI * 2 - Math.PI / 2;
  ctx.strokeStyle = P.walnut;
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(ha) * 17, y + Math.sin(ha) * 17);
  ctx.stroke();
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(ma) * 26, y + Math.sin(ma) * 26);
  ctx.stroke();
  ctx.fillStyle = P.copper;
  circleAt(ctx, x, y, 3);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.ellipse(x - 12, y - 16, 12, 6, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGear(ctx, x, y, r, teeth, base, dark) {
  const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
  g.addColorStop(0, base);
  g.addColorStop(1, dark);
  ctx.fillStyle = g;
  starPath(ctx, x, y, teeth, r, r * 0.8);
  ctx.fill();
  ctx.fillStyle = dark;
  circleAt(ctx, x, y, r * 0.56);
  ctx.fill();
  ctx.fillStyle = base;
  circleAt(ctx, x, y, r * 0.44);
  ctx.fill();
  ctx.fillStyle = dark;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    circleAt(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, r * 0.09);
    ctx.fill();
  }
  circleAt(ctx, x, y, r * 0.12);
  ctx.fill();
}

function drawGears(painter) {
  const ctx = painter.ctx;
  const teeth = painter.var('gear-teeth', 8, 6);
  ctx.save();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(432, 78);
  ctx.lineTo(482, 122);
  ctx.lineTo(404, 132);
  ctx.closePath();
  ctx.stroke();
  drawGear(ctx, 482, 122, 20, 7, P.copper, '#7A4526');
  drawGear(ctx, 404, 132, 15, 6, P.brass, P.brassLow);
  drawGear(ctx, 432, 78, 28, teeth, P.brass, P.brassLow);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.ellipse(424, 68, 8, 4, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawShelf(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const plank = ctx.createLinearGradient(0, 172, 0, 181);
  plank.addColorStop(0, P.walnutHigh);
  plank.addColorStop(1, P.walnutLow);
  ctx.fillStyle = plank;
  ctx.fillRect(300, 172, 262, 9);
  ctx.fillStyle = 'rgba(241,221,187,0.18)';
  ctx.fillRect(300, 172, 262, 2);
  ctx.fillStyle = P.walnutLow;
  for (const bx of [318, 430, 540]) {
    ctx.beginPath();
    ctx.moveTo(bx, 181);
    ctx.lineTo(bx + 14, 181);
    ctx.lineTo(bx, 199);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawBottle(painter, x, kind) {
  const ctx = painter.ctx;
  const purple = painter.var('potion-colour', false, kind === 'blue');
  const base = 172;
  ctx.save();
  let top;
  let bottom;
  if (kind === 'blue') {
    top = purple ? '#B07AD6' : '#6FA8DC';
    bottom = purple ? '#5E3A8A' : '#2F5878';
  } else if (kind === 'green') {
    top = '#7FBF9A';
    bottom = '#2E5A44';
  } else {
    top = '#E9B957';
    bottom = '#9A6A24';
  }
  ctx.fillStyle = '#8A6A4A';
  ctx.fillRect(x - 3.5, base - 42, 7, 6);
  ctx.fillStyle = 'rgba(241,221,187,0.35)';
  ctx.fillRect(x - 4, base - 36, 8, 3);
  const glass = ctx.createLinearGradient(x - 11, base - 33, x + 11, base);
  glass.addColorStop(0, top);
  glass.addColorStop(1, bottom);
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.moveTo(x - 4, base - 33);
  ctx.lineTo(x - 4, base - 24);
  ctx.quadraticCurveTo(x - 12, base - 18, x - 12, base - 8);
  ctx.quadraticCurveTo(x - 12, base, x, base);
  ctx.quadraticCurveTo(x + 12, base, x + 12, base - 8);
  ctx.quadraticCurveTo(x + 12, base - 18, x + 4, base - 24);
  ctx.lineTo(x + 4, base - 33);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x - 8, base - 18, 2.4, 12);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  circleAt(ctx, x + 3, base - 12, 1.4);
  ctx.fill();
  circleAt(ctx, x - 1, base - 7, 1);
  ctx.fill();
  ctx.fillStyle = P.cream;
  ctx.fillRect(x - 6, base - 16, 12, 5);
  ctx.strokeStyle = 'rgba(80,55,44,0.6)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x - 4, base - 14);
  ctx.lineTo(x + 4, base - 14);
  ctx.stroke();
  ctx.restore();
}

function drawCandle(painter) {
  const ctx = painter.ctx;
  const lit = painter.var('candle-flame', true, false);
  const x = 520;
  const base = 172;
  ctx.save();
  const dish = ctx.createLinearGradient(x - 12, base - 4, x + 12, base);
  dish.addColorStop(0, P.brassHigh);
  dish.addColorStop(1, P.brassLow);
  ctx.fillStyle = dish;
  ctx.beginPath();
  ctx.ellipse(x, base - 2, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  const wax = ctx.createLinearGradient(x - 5, 0, x + 5, 0);
  wax.addColorStop(0, '#FBF0D8');
  wax.addColorStop(0.5, P.cream);
  wax.addColorStop(1, '#C9AE82');
  ctx.fillStyle = wax;
  ctx.fillRect(x - 5, base - 32, 10, 30);
  ctx.beginPath();
  ctx.ellipse(x, base - 32, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#C9AE82';
  ctx.beginPath();
  ctx.moveTo(x - 5, base - 26);
  ctx.quadraticCurveTo(x - 7, base - 20, x - 5, base - 16);
  ctx.lineTo(x - 5, base - 26);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#50372C';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x, base - 33);
  ctx.lineTo(x, base - 37);
  ctx.stroke();
  if (lit) {
    const glow = ctx.createRadialGradient(x, base - 42, 1, x, base - 42, 18);
    glow.addColorStop(0, 'rgba(255,217,138,0.6)');
    glow.addColorStop(1, 'rgba(255,217,138,0)');
    ctx.fillStyle = glow;
    circleAt(ctx, x, base - 42, 18);
    ctx.fill();
    const flame = ctx.createLinearGradient(x, base - 50, x, base - 36);
    flame.addColorStop(0, '#FFE9A8');
    flame.addColorStop(1, '#E8734F');
    ctx.fillStyle = flame;
    ctx.beginPath();
    ctx.moveTo(x, base - 50);
    ctx.quadraticCurveTo(x + 5, base - 42, x, base - 36);
    ctx.quadraticCurveTo(x - 5, base - 42, x, base - 50);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFF6D8';
    ctx.beginPath();
    ctx.ellipse(x, base - 40, 1.6, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawBench(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const top = ctx.createLinearGradient(0, 250, 0, 262);
  top.addColorStop(0, P.walnutHigh);
  top.addColorStop(1, P.walnut);
  ctx.fillStyle = top;
  ctx.fillRect(180, 250, 244, 12);
  ctx.fillStyle = 'rgba(241,221,187,0.2)';
  ctx.fillRect(180, 250, 244, 2);
  const leg = ctx.createLinearGradient(0, 262, 0, 300);
  leg.addColorStop(0, P.walnut);
  leg.addColorStop(1, P.walnutLow);
  ctx.fillStyle = leg;
  ctx.fillRect(190, 262, 12, 38);
  ctx.fillRect(402, 262, 12, 38);
  ctx.fillRect(196, 284, 212, 6);
  scatterMarks(ctx, painter.dice, 184, 252, 236, 8, 40, '#2A1B14', 0.3, 1.2);
  ctx.restore();
}

function drawBird(painter) {
  const ctx = painter.ctx;
  const raised = painter.var('bird-wings', false, true);
  const x = 245;
  const y = 138;
  ctx.save();
  ctx.fillStyle = P.brassLow;
  ctx.fillRect(x - 2, 150, 4, 100);
  ctx.fillRect(x - 22, 148, 44, 4);
  ctx.fillStyle = 'rgba(240,208,138,0.5)';
  ctx.fillRect(x - 1, 150, 1.4, 100);
  ctx.strokeStyle = P.brassLow;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 8);
  ctx.lineTo(x - 4, 150);
  ctx.moveTo(x + 4, y + 8);
  ctx.lineTo(x + 4, 150);
  ctx.stroke();

  ctx.fillStyle = P.copper;
  ctx.beginPath();
  ctx.moveTo(x - 12, y + 2);
  ctx.lineTo(x - 24, y - 4);
  ctx.lineTo(x - 22, y + 6);
  ctx.closePath();
  ctx.fill();

  const body = ctx.createLinearGradient(x - 14, y - 10, x + 14, y + 10);
  body.addColorStop(0, P.brassHigh);
  body.addColorStop(0.55, P.brass);
  body.addColorStop(1, P.brassLow);
  ctx.fillStyle = body;
  ellipseAt(ctx, x, y, 14, 10);
  ctx.fill();
  ctx.fillStyle = P.brass;
  circleAt(ctx, x + 12, y - 9, 7);
  ctx.fill();
  ctx.fillStyle = P.copper;
  ctx.beginPath();
  ctx.moveTo(x + 18, y - 10);
  ctx.lineTo(x + 26, y - 7);
  ctx.lineTo(x + 18, y - 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = P.teal;
  circleAt(ctx, x + 13, y - 11, 1.6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(138,106,46,0.7)';
  ctx.lineWidth = 1;
  circleAt(ctx, x - 2, y + 1, 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 8, y + 5);
  ctx.lineTo(x + 6, y + 5);
  ctx.stroke();

  const wing = ctx.createLinearGradient(x, y - 16, x, y + 6);
  wing.addColorStop(0, P.copper);
  wing.addColorStop(1, '#7A4526');
  ctx.fillStyle = wing;
  if (raised) {
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 2);
    ctx.quadraticCurveTo(x - 16, y - 26, x - 2, y - 22);
    ctx.quadraticCurveTo(x + 4, y - 14, x + 4, y - 4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 2);
    ctx.quadraticCurveTo(x + 16, y - 24, x + 8, y - 24);
    ctx.quadraticCurveTo(x + 2, y - 16, x - 2, y - 4);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 4);
    ctx.quadraticCurveTo(x + 2, y - 8, x + 8, y - 2);
    ctx.quadraticCurveTo(x + 2, y + 6, x - 8, y + 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(240,208,138,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.quadraticCurveTo(x + 1, y - 2, x + 6, y);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.ellipse(x - 5, y - 5, 5, 2.4, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCabinet(painter) {
  const ctx = painter.ctx;
  const brassHandle = painter.var('drawer-handle', false, true);
  ctx.save();
  const body = ctx.createLinearGradient(30, 245, 150, 295);
  body.addColorStop(0, P.walnutHigh);
  body.addColorStop(1, P.walnutLow);
  ctx.fillStyle = body;
  ctx.fillRect(30, 245, 120, 50);
  ctx.fillStyle = 'rgba(241,221,187,0.16)';
  ctx.fillRect(30, 245, 120, 3);
  for (const [dx, dw] of [[36, 50], [92, 52]]) {
    const front = ctx.createLinearGradient(dx, 252, dx, 290);
    front.addColorStop(0, '#5D4030');
    front.addColorStop(1, '#3A271E');
    ctx.fillStyle = front;
    ctx.fillRect(dx, 252, dw, 38);
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(dx, 252, dw, 38);
  }
  ctx.fillStyle = '#8A5A38';
  circleAt(ctx, 61, 271, 4);
  ctx.fill();
  ctx.fillStyle = 'rgba(241,221,187,0.4)';
  circleAt(ctx, 60, 270, 1.4);
  ctx.fill();
  if (brassHandle) {
    const bar = ctx.createLinearGradient(108, 268, 128, 274);
    bar.addColorStop(0, P.brassHigh);
    bar.addColorStop(1, P.brassLow);
    ctx.fillStyle = bar;
    ctx.fillRect(108, 268, 20, 4);
    ctx.fillRect(109, 266, 3, 8);
    ctx.fillRect(124, 266, 3, 8);
  } else {
    ctx.fillStyle = '#8A5A38';
    circleAt(ctx, 118, 271, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(241,221,187,0.4)';
    circleAt(ctx, 117, 270, 1.4);
    ctx.fill();
  }
  ctx.fillStyle = P.walnutLow;
  ctx.fillRect(34, 295, 10, 5);
  ctx.fillRect(136, 295, 10, 5);
  ctx.restore();
}

function drawBook(painter, x, y, w, h, color) {
  const ctx = painter.ctx;
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = P.cream;
  ctx.fillRect(x + w - 5, y + 2, 4, h - 4);
  ctx.fillStyle = 'rgba(241,221,187,0.55)';
  ctx.fillRect(x + 6, y + h / 2 - 0.8, w - 18, 1.6);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x, y + h - 2, w, 2);
}

function drawBooks(painter) {
  const ctx = painter.ctx;
  const count = painter.var('books-count', 3, 2);
  ctx.save();
  drawBook(painter, 40, 233, 72, 12, P.emerald);
  drawBook(painter, 44, 221, 64, 12, '#8A3B4C');
  if (count === 3) drawBook(painter, 48, 209, 58, 12, P.teal);
  ctx.restore();
}

function drawTools(painter) {
  const ctx = painter.ctx;
  ctx.save();
  ctx.strokeStyle = '#8A5A38';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(214, 248);
  ctx.lineTo(238, 240);
  ctx.stroke();
  ctx.fillStyle = '#6E7A8A';
  ctx.fillRect(234, 232, 12, 9);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(234, 232, 12, 2);
  ctx.strokeStyle = P.copper;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(352, 248);
  ctx.lineTo(368, 242);
  ctx.stroke();
  ctx.strokeStyle = '#9AA4B0';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(368, 242);
  ctx.lineTo(376, 239);
  ctx.stroke();
  drawGear(ctx, 302, 242, 9, 6, P.brass, P.brassLow);
  drawGear(ctx, 322, 245, 6, 5, P.copper, '#7A4526');
  ctx.fillStyle = '#6E7A8A';
  for (let i = 0; i < 5; i++) {
    const sx = 260 + painter.dice.unit() * 70;
    const sy = 244 + painter.dice.unit() * 5;
    circleAt(ctx, sx, sy, 1);
    ctx.fill();
  }
  ctx.restore();
}

function drawMouse(painter) {
  const ctx = painter.ctx;
  const key = painter.var('mouse-item', false, true);
  const x = 300;
  const y = 312;
  ctx.save();
  ctx.strokeStyle = '#B08A8A';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(x - 12, y + 2);
  ctx.bezierCurveTo(x - 26, y + 6, x - 30, y - 6, x - 22, y - 8);
  ctx.stroke();
  const fur = ctx.createLinearGradient(x - 13, y - 8, x + 13, y + 8);
  fur.addColorStop(0, '#C9B8B0');
  fur.addColorStop(1, '#8A7A72');
  ctx.fillStyle = fur;
  ellipseAt(ctx, x, y, 13, 8);
  ctx.fill();
  ctx.fillStyle = '#B0A098';
  circleAt(ctx, x + 12, y - 3, 6);
  ctx.fill();
  ctx.fillStyle = '#C9B8B0';
  circleAt(ctx, x + 9, y - 9, 3.6);
  ctx.fill();
  ctx.fillStyle = '#E8A8A8';
  circleAt(ctx, x + 9, y - 9, 1.8);
  ctx.fill();
  ctx.fillStyle = P.teal;
  circleAt(ctx, x + 14, y - 4, 1.1);
  ctx.fill();
  ctx.fillStyle = '#E8A8A8';
  circleAt(ctx, x + 18, y - 2, 1.2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(80,55,44,0.5)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x + 17, y - 1);
  ctx.lineTo(x + 23, y - 3);
  ctx.moveTo(x + 17, y);
  ctx.lineTo(x + 23, y + 1);
  ctx.stroke();
  if (key) {
    ctx.strokeStyle = P.brass;
    ctx.lineWidth = 2;
    circleAt(ctx, x + 24, y + 1, 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 27, y + 1);
    ctx.lineTo(x + 35, y + 1);
    ctx.moveTo(x + 32, y + 1);
    ctx.lineTo(x + 32, y + 4);
    ctx.moveTo(x + 35, y + 1);
    ctx.lineTo(x + 35, y + 4);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#F5C85B';
    ctx.beginPath();
    ctx.moveTo(x + 21, y + 5);
    ctx.lineTo(x + 33, y + 5);
    ctx.lineTo(x + 33, y - 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#D9A03A';
    circleAt(ctx, x + 29, y + 2, 1.3);
    ctx.fill();
    circleAt(ctx, x + 31, y - 0.5, 0.9);
    ctx.fill();
  }
  ctx.restore();
}
