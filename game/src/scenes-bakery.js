// Scene 4 — Golden Harvest Bakery.
//
// A warm bakehouse: a checkered floor, a window with a small visitor, a wall
// clock, oven mitts on a rail, a shelf of scored loaves, and a long counter
// with a croissant, a strawberry cake, a coffee cup and a jar of cookies.
//
// Every object is its own function, built from layered shapes, a gradient for
// shade and a soft highlight. The eight differences switch small parts of those
// objects through painter.var(name, normal, altered).

import { circleAt, ellipseAt, starPath, scatterMarks } from './render.js';

const W = 590;
const H = 350;

const P = {
  honey: '#D99B46',
  cinnamon: '#A65D3E',
  buttercream: '#F8E4B8',
  strawberry: '#D96D70',
  sage: '#82976B',
  chocolate: '#553A32',
  honeyHigh: '#F0C070',
  honeyLow: '#9A6A24',
  creamHigh: '#FFF6E0',
  sageDark: '#5E7050',
  wallLow: '#E8CFA0',
};

const DIFFERENCES = [
  { id: 'croissant-layers', level: 'medium', x: 0.271, y: 0.629, r: 24, hint: 'The croissant folded one layer more.' },
  { id: 'cake-berries', level: 'easy', x: 0.508, y: 0.56, r: 24, hint: 'The cake keeps one strawberry fewer.' },
  { id: 'loaf-score', level: 'hard', x: 0.136, y: 0.394, r: 24, hint: 'A loaf lost one scoring line.' },
  { id: 'foam-shape', level: 'medium', x: 0.712, y: 0.611, r: 22, hint: 'The coffee foam changed its shape.' },
  { id: 'mitt-missing', level: 'easy', x: 0.432, y: 0.177, r: 24, hint: 'One oven mitt is off the rail.' },
  { id: 'window-visitor', level: 'medium', x: 0.844, y: 0.366, r: 24, hint: 'A different visitor sits on the sill.' },
  { id: 'jar-cookies', level: 'hard', x: 0.881, y: 0.606, r: 24, hint: 'The cookie jar holds one cookie fewer.' },
  { id: 'clock-hands', level: 'medium', x: 0.153, y: 0.2, r: 26, hint: 'The wall clock shows another time.' },
];

export const BAKERY = {
  id: 'bakery',
  name: 'Golden Harvest Bakery',
  blurb: 'Warm loaves and sweet things',
  palette: P,
  seed: 881104,
  paint: paintBakery,
  differences: DIFFERENCES,
};

export function paintBakery(painter) {
  const ctx = painter.ctx;
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  drawWall(painter);
  drawFloor(painter);
  drawWindow(painter);
  drawClock(painter);
  drawBoard(painter);
  drawLamp(painter);
  drawMitts(painter);
  drawShelf(painter);
  drawLoaf(painter, 80, 140, painter.var('loaf-score', 3, 2));
  drawLoaf(painter, 152, 142, 3);
  drawBaguette(painter, 216, 140);
  drawCounter(painter);
  drawCroissant(painter);
  drawCake(painter);
  drawCoffee(painter);
  drawJar(painter);
  drawRollingPin(painter);
  drawTags(painter);
  ctx.restore();
  return [...painter.names];
}

function drawTags(painter) {
  const ctx = painter.ctx;
  ctx.save();
  for (const [tx, ty] of [[196, 224], [340, 224], [452, 224]]) {
    ctx.fillStyle = P.creamHigh;
    ctx.fillRect(tx, ty, 16, 9);
    ctx.strokeStyle = P.cinnamon;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(tx, ty, 16, 9);
    ctx.beginPath();
    ctx.moveTo(tx + 3, ty + 4);
    ctx.lineTo(tx + 13, ty + 4);
    ctx.moveTo(tx + 3, ty + 6.5);
    ctx.lineTo(tx + 10, ty + 6.5);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWall(painter) {
  const ctx = painter.ctx;
  const wall = ctx.createLinearGradient(0, 0, 0, 290);
  wall.addColorStop(0, P.creamHigh);
  wall.addColorStop(0.7, P.buttercream);
  wall.addColorStop(1, P.wallLow);
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, 290);
  ctx.strokeStyle = 'rgba(166,93,62,0.12)';
  ctx.lineWidth = 1;
  for (let py = 30; py < 250; py += 30) {
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(W, py);
    ctx.stroke();
  }
  ctx.fillStyle = P.sage;
  ctx.fillRect(0, 250, W, 40);
  ctx.fillStyle = P.sageDark;
  ctx.fillRect(0, 250, W, 4);
  ctx.strokeStyle = 'rgba(255,246,224,0.25)';
  ctx.lineWidth = 1.2;
  for (let px = 20; px < W; px += 40) {
    ctx.beginPath();
    ctx.moveTo(px, 254);
    ctx.lineTo(px, 290);
    ctx.stroke();
  }
  scatterMarks(ctx, painter.dice, 0, 0, W, 250, 120, P.cinnamon, 0.06, 1.2);
}

function drawFloor(painter) {
  const ctx = painter.ctx;
  ctx.save();
  ctx.fillStyle = '#C9A876';
  ctx.fillRect(0, 290, W, H - 290);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 15; col++) {
      if ((row + col) % 2 === 0) continue;
      ctx.fillStyle = 'rgba(85,58,50,0.35)';
      ctx.fillRect(col * 42 - row * 8, 290 + row * 20, 42, 20);
    }
  }
  ctx.fillStyle = 'rgba(255,246,224,0.15)';
  ctx.fillRect(0, 290, W, 2);
  ctx.restore();
}

function drawWindow(painter) {
  const ctx = painter.ctx;
  const x = 480;
  const y = 92;
  ctx.save();
  const glass = ctx.createLinearGradient(x - 40, y - 44, x + 40, y + 40);
  glass.addColorStop(0, '#B8DCE8');
  glass.addColorStop(1, '#82C5DB');
  ctx.fillStyle = glass;
  ctx.fillRect(x - 40, y - 44, 80, 84);
  ctx.fillStyle = 'rgba(255,246,224,0.5)';
  ctx.beginPath();
  ctx.moveTo(x - 30, y + 40);
  ctx.lineTo(x - 6, y - 44);
  ctx.lineTo(x + 6, y - 44);
  ctx.lineTo(x - 18, y + 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8FBF9A';
  ctx.beginPath();
  ctx.ellipse(x + 22, y + 26, 16, 8, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = P.chocolate;
  ctx.lineWidth = 5;
  ctx.strokeRect(x - 42, y - 46, 84, 88);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y - 44);
  ctx.lineTo(x, y + 40);
  ctx.moveTo(x - 40, y - 2);
  ctx.lineTo(x + 40, y - 2);
  ctx.stroke();
  ctx.fillStyle = P.cinnamon;
  ctx.fillRect(x - 50, y + 42, 100, 7);
  ctx.fillStyle = 'rgba(255,246,224,0.3)';
  ctx.fillRect(x - 50, y + 42, 100, 2);
  drawVisitor(painter, x + 18, y + 36);
  ctx.restore();
}

function drawVisitor(painter, x, y) {
  const ctx = painter.ctx;
  const butterfly = painter.var('window-visitor', false, true);
  ctx.save();
  if (butterfly) {
    const g = ctx.createLinearGradient(x - 8, y - 8, x + 8, y + 4);
    g.addColorStop(0, P.strawberry);
    g.addColorStop(1, '#A84A50');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x - 5, y - 4, 5.5, 4.4, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 5, y - 4, 5.5, 4.4, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - 4, y + 2, 3.6, 2.8, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 4, y + 2, 3.6, 2.8, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = P.chocolate;
    ctx.beginPath();
    ctx.ellipse(x, y - 1, 1.2, 4.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = P.chocolate;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y - 5);
    ctx.quadraticCurveTo(x - 3, y - 9, x - 4, y - 9);
    ctx.moveTo(x, y - 5);
    ctx.quadraticCurveTo(x + 3, y - 9, x + 4, y - 9);
    ctx.stroke();
  } else {
    const g = ctx.createLinearGradient(x - 8, y - 10, x + 8, y + 4);
    g.addColorStop(0, '#9AB08A');
    g.addColorStop(1, P.sageDark);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y - 3, 8, 6.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = P.sageDark;
    ctx.beginPath();
    ctx.moveTo(x - 7, y - 4);
    ctx.lineTo(x - 14, y - 8);
    ctx.lineTo(x - 12, y - 1);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#9AB08A';
    circleAt(ctx, x + 6, y - 8, 4.4);
    ctx.fill();
    ctx.fillStyle = P.honey;
    ctx.beginPath();
    ctx.moveTo(x + 10, y - 8);
    ctx.lineTo(x + 15, y - 6.4);
    ctx.lineTo(x + 10, y - 5.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = P.chocolate;
    circleAt(ctx, x + 7, y - 9, 1);
    ctx.fill();
    ctx.strokeStyle = P.chocolate;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 3);
    ctx.lineTo(x - 2, y + 6);
    ctx.moveTo(x + 2, y + 3);
    ctx.lineTo(x + 2, y + 6);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,246,224,0.4)';
    ctx.beginPath();
    ctx.ellipse(x - 2, y - 4, 3.4, 2, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawClock(painter) {
  const ctx = painter.ctx;
  const late = painter.var('clock-hands', false, true);
  const x = 90;
  const y = 70;
  ctx.save();
  const rim = ctx.createLinearGradient(x - 28, y - 28, x + 28, y + 28);
  rim.addColorStop(0, P.honeyHigh);
  rim.addColorStop(1, P.honeyLow);
  ctx.fillStyle = rim;
  circleAt(ctx, x, y, 28);
  ctx.fill();
  ctx.fillStyle = P.creamHigh;
  circleAt(ctx, x, y, 23);
  ctx.fill();
  ctx.strokeStyle = P.chocolate;
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * 18, y + Math.sin(a) * 18);
    ctx.lineTo(x + Math.cos(a) * 21, y + Math.sin(a) * 21);
    ctx.stroke();
  }
  const hour = late ? 8.33 : 10.17;
  const minute = late ? 20 : 10;
  const ha = (hour / 12) * Math.PI * 2 - Math.PI / 2;
  const ma = (minute / 60) * Math.PI * 2 - Math.PI / 2;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(ha) * 12, y + Math.sin(ha) * 12);
  ctx.stroke();
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(ma) * 18, y + Math.sin(ma) * 18);
  ctx.stroke();
  ctx.fillStyle = P.strawberry;
  circleAt(ctx, x, y, 2.2);
  ctx.fill();
  ctx.restore();
}

function drawBoard(painter) {
  const ctx = painter.ctx;
  const x = 360;
  const y = 88;
  ctx.save();
  ctx.fillStyle = P.chocolate;
  ctx.fillRect(x - 46, y - 34, 92, 68);
  ctx.fillStyle = '#3A2A24';
  ctx.fillRect(x - 41, y - 29, 82, 58);
  ctx.strokeStyle = 'rgba(255,246,224,0.75)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x - 30, y - 18);
  ctx.lineTo(x + 30, y - 18);
  ctx.stroke();
  ctx.lineWidth = 1.1;
  for (let i = 0; i < 3; i++) {
    const ly = y - 6 + i * 12;
    ctx.beginPath();
    ctx.moveTo(x - 30, ly);
    ctx.lineTo(x + 6 + painter.dice.unit() * 14, ly);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 22, ly);
    ctx.lineTo(x + 30, ly);
    ctx.stroke();
  }
  ctx.fillStyle = P.honey;
  ctx.fillRect(x - 46, y - 38, 92, 4);
  ctx.restore();
}

function drawLamp(painter) {
  const ctx = painter.ctx;
  const x = 300;
  ctx.save();
  ctx.strokeStyle = P.chocolate;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, 26);
  ctx.stroke();
  const shade = ctx.createLinearGradient(x - 16, 26, x + 16, 44);
  shade.addColorStop(0, P.honeyHigh);
  shade.addColorStop(1, P.honeyLow);
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.moveTo(x - 16, 44);
  ctx.quadraticCurveTo(x, 18, x + 16, 44);
  ctx.closePath();
  ctx.fill();
  const glow = ctx.createRadialGradient(x, 48, 2, x, 48, 26);
  glow.addColorStop(0, 'rgba(255,217,138,0.55)');
  glow.addColorStop(1, 'rgba(255,217,138,0)');
  ctx.fillStyle = glow;
  circleAt(ctx, x, 48, 26);
  ctx.fill();
  ctx.fillStyle = '#FFE9A8';
  circleAt(ctx, x, 46, 3.4);
  ctx.fill();
  ctx.restore();
}

function drawMitts(painter) {
  const ctx = painter.ctx;
  const missing = painter.var('mitt-missing', -1, 1);
  ctx.save();
  ctx.strokeStyle = P.chocolate;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(196, 40);
  ctx.lineTo(330, 40);
  ctx.stroke();
  ctx.fillStyle = P.chocolate;
  circleAt(ctx, 196, 40, 3);
  ctx.fill();
  circleAt(ctx, 330, 40, 3);
  ctx.fill();
  const colors = [P.strawberry, P.sage, P.honey];
  for (let i = 0; i < 3; i++) {
    if (i === missing) continue;
    const mx = 212 + i * 46;
    ctx.strokeStyle = 'rgba(85,58,50,0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(mx, 40);
    ctx.lineTo(mx, 48);
    ctx.stroke();
    const g = ctx.createLinearGradient(mx - 11, 48, mx + 11, 88);
    g.addColorStop(0, colors[i]);
    g.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(mx - 10, 50);
    ctx.lineTo(mx + 10, 50);
    ctx.lineTo(mx + 11, 80);
    ctx.quadraticCurveTo(mx + 11, 90, mx, 90);
    ctx.quadraticCurveTo(mx - 11, 90, mx - 11, 80);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = g;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(mx - 13, 64, 4.5, 7, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,246,224,0.5)';
    ctx.fillRect(mx - 10, 52, 20, 3);
    ctx.fillStyle = 'rgba(255,246,224,0.35)';
    circleAt(ctx, mx - 3, 68, 1.4);
    ctx.fill();
    circleAt(ctx, mx + 4, 76, 1.4);
    ctx.fill();
  }
  ctx.restore();
}

function drawShelf(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const plank = ctx.createLinearGradient(0, 152, 0, 161);
  plank.addColorStop(0, P.cinnamon);
  plank.addColorStop(1, '#6E3E2A');
  ctx.fillStyle = plank;
  ctx.fillRect(28, 152, 240, 9);
  ctx.fillStyle = 'rgba(255,246,224,0.25)';
  ctx.fillRect(28, 152, 240, 2);
  ctx.fillStyle = '#6E3E2A';
  for (const bx of [44, 140, 236]) {
    ctx.beginPath();
    ctx.moveTo(bx, 161);
    ctx.lineTo(bx + 14, 161);
    ctx.lineTo(bx, 179);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawLoaf(painter, x, y, scores) {
  const ctx = painter.ctx;
  ctx.save();
  const g = ctx.createLinearGradient(x - 26, y - 16, x + 26, y + 8);
  g.addColorStop(0, P.honeyHigh);
  g.addColorStop(0.6, P.honey);
  g.addColorStop(1, P.honeyLow);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, 27, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,246,224,0.3)';
  ctx.beginPath();
  ctx.ellipse(x - 8, y - 7, 12, 5, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7A4A20';
  ctx.lineWidth = 2;
  for (let i = 0; i < scores; i++) {
    const sx = x - 12 + i * 11;
    ctx.beginPath();
    ctx.moveTo(sx - 3, y - 8);
    ctx.quadraticCurveTo(sx + 2, y - 2, sx - 1, y + 5);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(122,74,32,0.4)';
  for (let i = 0; i < 6; i++) {
    circleAt(ctx, x - 18 + painter.dice.unit() * 36, y - 8 + painter.dice.unit() * 16, 0.8);
    ctx.fill();
  }
  ctx.restore();
}

function drawBaguette(painter, x, y) {
  const ctx = painter.ctx;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.12);
  const g = ctx.createLinearGradient(0, -9, 0, 9);
  g.addColorStop(0, P.honeyHigh);
  g.addColorStop(1, P.honeyLow);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7A4A20';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 4; i++) {
    const sx = -20 + i * 12;
    ctx.beginPath();
    ctx.moveTo(sx, -5);
    ctx.lineTo(sx + 6, 5);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCounter(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const top = ctx.createLinearGradient(0, 228, 0, 240);
  top.addColorStop(0, '#C9A876');
  top.addColorStop(1, '#9A7A4E');
  ctx.fillStyle = top;
  ctx.fillRect(36, 228, 520, 12);
  ctx.fillStyle = 'rgba(255,246,224,0.4)';
  ctx.fillRect(36, 228, 520, 2.4);
  const front = ctx.createLinearGradient(0, 240, 0, 292);
  front.addColorStop(0, P.cinnamon);
  front.addColorStop(1, '#6E3E2A');
  ctx.fillStyle = front;
  ctx.fillRect(42, 240, 508, 52);
  ctx.strokeStyle = 'rgba(85,58,50,0.5)';
  ctx.lineWidth = 1.4;
  for (let px = 90; px < 540; px += 64) {
    ctx.beginPath();
    ctx.moveTo(px, 240);
    ctx.lineTo(px, 292);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,246,224,0.12)';
  ctx.fillRect(42, 244, 508, 3);
  const glass = ctx.createLinearGradient(0, 196, 0, 228);
  glass.addColorStop(0, 'rgba(255,255,255,0.28)');
  glass.addColorStop(1, 'rgba(255,255,255,0.06)');
  ctx.fillStyle = glass;
  ctx.fillRect(120, 196, 340, 32);
  ctx.strokeStyle = 'rgba(255,246,224,0.5)';
  ctx.lineWidth = 1.4;
  ctx.strokeRect(120, 196, 340, 32);
  ctx.restore();
}

function drawCroissant(painter) {
  const ctx = painter.ctx;
  const layers = painter.var('croissant-layers', 3, 4);
  const x = 160;
  const y = 222;
  ctx.save();
  ctx.fillStyle = P.creamHigh;
  ctx.beginPath();
  ctx.ellipse(x, y + 5, 26, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  const g = ctx.createLinearGradient(x - 22, y - 12, x + 22, y + 4);
  g.addColorStop(0, P.honeyHigh);
  g.addColorStop(0.55, P.honey);
  g.addColorStop(1, P.honeyLow);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 22, y + 2);
  ctx.quadraticCurveTo(x - 16, y - 14, x, y - 12);
  ctx.quadraticCurveTo(x + 16, y - 14, x + 22, y + 2);
  ctx.quadraticCurveTo(x + 12, y - 2, x, y + 1);
  ctx.quadraticCurveTo(x - 12, y - 2, x - 22, y + 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#9A6A24';
  ctx.lineWidth = 1.6;
  for (let i = 1; i <= layers; i++) {
    const t = i / (layers + 1);
    const lx = x - 20 + t * 40;
    ctx.beginPath();
    ctx.moveTo(lx, y - 11 + Math.abs(t - 0.5) * 8);
    ctx.quadraticCurveTo(lx + 2, y - 4, lx - 1, y);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,246,224,0.35)';
  ctx.beginPath();
  ctx.ellipse(x - 6, y - 9, 7, 2.6, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCake(painter) {
  const ctx = painter.ctx;
  const berries = painter.var('cake-berries', 3, 2);
  const x = 300;
  const y = 214;
  ctx.save();
  ctx.fillStyle = P.creamHigh;
  ctx.beginPath();
  ctx.ellipse(x, y + 12, 30, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();
  const side = ctx.createLinearGradient(x - 24, y - 8, x + 24, y + 10);
  side.addColorStop(0, '#FFF0D0');
  side.addColorStop(1, '#E0C090');
  ctx.fillStyle = side;
  ctx.fillRect(x - 24, y - 8, 48, 18);
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 24, 5, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = P.strawberry;
  ctx.beginPath();
  ctx.ellipse(x, y - 8, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 5; i++) {
    const dx = x - 20 + i * 10;
    ctx.beginPath();
    ctx.ellipse(dx, y - 4 + (i % 2) * 3, 3.4, 4.4, 0, 0, Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,246,224,0.5)';
  ctx.fillRect(x - 24, y + 2, 48, 2);
  const spots = [[x - 12, y - 12], [x, y - 15], [x + 12, y - 12]];
  for (let i = 0; i < berries; i++) {
    const [bx, by] = spots[i];
    ctx.fillStyle = '#C8464F';
    ctx.beginPath();
    ctx.moveTo(bx, by + 5);
    ctx.quadraticCurveTo(bx - 5.5, by, bx - 4, by - 4);
    ctx.quadraticCurveTo(bx, by - 7, bx + 4, by - 4);
    ctx.quadraticCurveTo(bx + 5.5, by, bx, by + 5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = P.sage;
    ctx.beginPath();
    ctx.ellipse(bx, by - 5.5, 3, 1.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,246,224,0.7)';
    circleAt(ctx, bx - 1.6, by - 1, 0.6);
    ctx.fill();
    circleAt(ctx, bx + 1.6, by + 1, 0.6);
    ctx.fill();
  }
  ctx.restore();
}

function drawCoffee(painter) {
  const ctx = painter.ctx;
  const star = painter.var('foam-shape', false, true);
  const x = 420;
  const y = 222;
  ctx.save();
  ctx.fillStyle = P.creamHigh;
  ctx.beginPath();
  ctx.ellipse(x, y + 6, 18, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#E0C090';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(x + 12, y - 2, 5, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  const g = ctx.createLinearGradient(x - 11, y - 10, x + 11, y + 4);
  g.addColorStop(0, '#FFFFFF');
  g.addColorStop(1, '#D9C8B0');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 11, y - 9);
  ctx.quadraticCurveTo(x - 10, y + 4, x, y + 4);
  ctx.quadraticCurveTo(x + 10, y + 4, x + 11, y - 9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6B4226';
  ctx.beginPath();
  ctx.ellipse(x, y - 9, 11, 3.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = P.creamHigh;
  if (star) {
    starPath(ctx, x, y - 9, 5, 5.6, 2.4);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(x, y - 6);
    ctx.bezierCurveTo(x - 6, y - 11, x - 3, y - 14, x, y - 11);
    ctx.bezierCurveTo(x + 3, y - 14, x + 6, y - 11, x, y - 6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(x - 4, y - 16);
  ctx.quadraticCurveTo(x - 7, y - 22, x - 4, y - 27);
  ctx.moveTo(x + 4, y - 16);
  ctx.quadraticCurveTo(x + 7, y - 22, x + 4, y - 27);
  ctx.stroke();
  ctx.restore();
}

function drawJar(painter) {
  const ctx = painter.ctx;
  const count = painter.var('jar-cookies', 5, 4);
  const x = 520;
  const y = 226;
  ctx.save();
  ctx.fillStyle = 'rgba(200,220,230,0.4)';
  ctx.beginPath();
  ctx.moveTo(x - 16, y - 34);
  ctx.lineTo(x - 18, y - 4);
  ctx.quadraticCurveTo(x - 18, y + 2, x, y + 2);
  ctx.quadraticCurveTo(x + 18, y + 2, x + 18, y - 4);
  ctx.lineTo(x + 16, y - 34);
  ctx.closePath();
  ctx.fill();
  const spots = [[x - 8, y - 6], [x + 7, y - 8], [x - 2, y - 16], [x + 9, y - 20], [x - 9, y - 24]];
  for (let i = 0; i < count; i++) {
    const [cx, cy] = spots[i];
    const g = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 7);
    g.addColorStop(0, P.honeyHigh);
    g.addColorStop(1, P.honeyLow);
    ctx.fillStyle = g;
    circleAt(ctx, cx, cy, 6.4);
    ctx.fill();
    ctx.fillStyle = P.chocolate;
    circleAt(ctx, cx - 2, cy - 1, 1);
    ctx.fill();
    circleAt(ctx, cx + 2, cy + 2, 0.9);
    ctx.fill();
    circleAt(ctx, cx + 1, cy - 3, 0.8);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x - 13, y - 30);
  ctx.lineTo(x - 14, y - 8);
  ctx.stroke();
  const lid = ctx.createLinearGradient(x - 17, y - 40, x + 17, y - 34);
  lid.addColorStop(0, P.honeyHigh);
  lid.addColorStop(1, P.honeyLow);
  ctx.fillStyle = lid;
  ctx.fillRect(x - 17, y - 40, 34, 7);
  ctx.fillStyle = P.cinnamon;
  circleAt(ctx, x, y - 42, 2.6);
  ctx.fill();
  ctx.restore();
}

function drawRollingPin(painter) {
  const ctx = painter.ctx;
  const x = 76;
  const y = 224;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.08);
  const g = ctx.createLinearGradient(0, -6, 0, 6);
  g.addColorStop(0, '#E8CFA0');
  g.addColorStop(1, '#B08A5A');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9A7A4E';
  ctx.fillRect(-34, -2.4, 10, 4.8);
  ctx.fillRect(24, -2.4, 10, 4.8);
  ctx.fillStyle = 'rgba(255,246,224,0.4)';
  ctx.fillRect(-18, -3.4, 36, 1.8);
  ctx.restore();
}
