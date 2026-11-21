// Scene 3 — Floating Island Tea Garden.
//
// A grass island adrift in a peach sky: a cherry tree with a paper lantern,
// a low tea table with pot and cup, a koi pond with lily pads, a frog, a
// butterfly, and a waterfall spilling off the island's rim into the clouds.
//
// Every object is its own function, built from layered shapes, a gradient for
// shade and a soft highlight. The eight differences switch small parts of those
// objects through painter.var(name, normal, altered).

import { circleAt, ellipseAt, scatterMarks } from './render.js';

const W = 590;
const H = 350;

const P = {
  peach: '#F2A77C',
  sakura: '#E99DB5',
  jade: '#579A77',
  sky: '#82C5DB',
  golden: '#F5CF73',
  lavender: '#9988C7',
  skyHigh: '#A8D8E8',
  jadeDark: '#3A6B50',
  sakuraDark: '#C4708F',
  rockDark: '#5E5480',
  cream: '#FFF4E0',
};

const DIFFERENCES = [
  { id: 'koi-count', level: 'medium', x: 0.737, y: 0.571, r: 26, hint: 'The pond keeps one koi fewer.' },
  { id: 'petal-missing', level: 'hard', x: 0.288, y: 0.3, r: 20, hint: 'One blossom lost a petal.' },
  { id: 'cup-handle', level: 'medium', x: 0.529, y: 0.531, r: 20, hint: 'The tea cup lost its handle.' },
  { id: 'cloud-bumps', level: 'easy', x: 0.203, y: 0.166, r: 26, hint: 'A cloud grew an extra bump.' },
  { id: 'lantern-colour', level: 'easy', x: 0.347, y: 0.434, r: 22, hint: 'The paper lantern changed colour.' },
  { id: 'butterfly-wings', level: 'medium', x: 0.407, y: 0.343, r: 22, hint: 'The butterfly folded its wings.' },
  { id: 'frog-perch', level: 'hard', x: 0.797, y: 0.531, r: 24, hint: 'The frog hopped to a different seat.' },
  { id: 'waterfall-streams', level: 'medium', x: 0.856, y: 0.8, r: 26, hint: 'The waterfall runs in one stream.' },
];

export const TEA_GARDEN = {
  id: 'tea-garden',
  name: 'Floating Island Tea Garden',
  blurb: 'Koi, blossoms and sky-high tea',
  palette: P,
  seed: 441907,
  paint: paintTeaGarden,
  differences: DIFFERENCES,
};

export function paintTeaGarden(painter) {
  const ctx = painter.ctx;
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  drawSky(painter);
  drawSun(painter);
  drawCloud(painter, 120, 58, 1, painter.var('cloud-bumps', 3, 4));
  drawCloud(painter, 430, 104, 0.8, 3);
  drawCloud(painter, 58, 132, 0.6, 2);
  drawFarIslands(painter);
  drawIsland(painter);
  drawPond(painter);
  drawWaterfall(painter);
  drawTree(painter);
  drawLantern(painter);
  drawStoneLantern(painter);
  drawTable(painter);
  drawTeapot(painter);
  drawCup(painter);
  drawKoi(painter);
  drawLilyPads(painter);
  drawFrog(painter);
  drawButterfly(painter, 240, 120, painter.var('butterfly-wings', true, false));
  drawButterfly(painter, 352, 88, true);
  drawPetals(painter);
  drawCloud(painter, 210, 336, 0.9, 3);
  drawCloud(painter, 420, 344, 0.7, 2);
  ctx.restore();
  return [...painter.names];
}

function drawSky(painter) {
  const ctx = painter.ctx;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, P.skyHigh);
  sky.addColorStop(0.45, P.sky);
  sky.addColorStop(0.8, P.peach);
  sky.addColorStop(1, '#E8926A');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
}

function drawSun(painter) {
  const ctx = painter.ctx;
  const x = 508;
  const y = 56;
  ctx.save();
  const halo = ctx.createRadialGradient(x, y, 4, x, y, 44);
  halo.addColorStop(0, 'rgba(245,207,115,0.7)');
  halo.addColorStop(1, 'rgba(245,207,115,0)');
  ctx.fillStyle = halo;
  circleAt(ctx, x, y, 44);
  ctx.fill();
  const disc = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, 18);
  disc.addColorStop(0, '#FFF0C0');
  disc.addColorStop(1, P.golden);
  ctx.fillStyle = disc;
  circleAt(ctx, x, y, 18);
  ctx.fill();
  ctx.restore();
}

function drawCloud(painter, x, y, s, bumps) {
  const ctx = painter.ctx;
  ctx.save();
  const g = ctx.createLinearGradient(x, y - 20 * s, x, y + 10 * s);
  g.addColorStop(0, '#FFFFFF');
  g.addColorStop(1, '#DCE8F0');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 34 * s, y + 6 * s);
  for (let i = 0; i < bumps; i++) {
    const bx = x - 26 * s + (i * 52 * s) / Math.max(1, bumps - 1);
    const br = (i === 0 || i === bumps - 1 ? 12 : 16) * s;
    ctx.arc(bx, y - (i === 0 || i === bumps - 1 ? 0 : 6 * s), br, Math.PI, 0);
  }
  ctx.lineTo(x + 34 * s, y + 6 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(153,136,199,0.18)';
  ctx.fillRect(x - 32 * s, y + 2 * s, 64 * s, 4 * s);
  ctx.restore();
}

function drawFarIslands(painter) {
  const ctx = painter.ctx;
  ctx.save();
  for (const [x, y, s] of [[58, 226, 0.5], [548, 168, 0.4]]) {
    ctx.fillStyle = P.rockDark;
    ctx.beginPath();
    ctx.moveTo(x - 30 * s, y);
    ctx.quadraticCurveTo(x, y + 44 * s, x + 30 * s, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = P.jade;
    ctx.beginPath();
    ctx.ellipse(x, y, 32 * s, 8 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6B4A38';
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(x, y - 2 * s);
    ctx.lineTo(x, y - 16 * s);
    ctx.stroke();
    ctx.fillStyle = P.sakura;
    circleAt(ctx, x, y - 20 * s, 8 * s);
    ctx.fill();
  }
  ctx.restore();
}

function drawIsland(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const rock = ctx.createLinearGradient(0, 210, 0, 335);
  rock.addColorStop(0, P.lavender);
  rock.addColorStop(1, P.rockDark);
  ctx.fillStyle = rock;
  ctx.beginPath();
  ctx.moveTo(65, 212);
  ctx.bezierCurveTo(120, 290, 220, 330, 295, 332);
  ctx.bezierCurveTo(370, 330, 470, 290, 525, 212);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,244,224,0.2)';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 5; i++) {
    const rx = 130 + i * 70;
    ctx.beginPath();
    ctx.moveTo(rx, 224);
    ctx.quadraticCurveTo(rx + painter.dice.jitter(14), 268, rx + painter.dice.jitter(20), 300);
    ctx.stroke();
  }
  const grass = ctx.createLinearGradient(0, 178, 0, 226);
  grass.addColorStop(0, '#7BB894');
  grass.addColorStop(0.6, P.jade);
  grass.addColorStop(1, P.jadeDark);
  ctx.fillStyle = grass;
  ctx.beginPath();
  ctx.ellipse(295, 208, 232, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,244,224,0.22)';
  ctx.beginPath();
  ctx.ellipse(295, 198, 210, 16, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = P.jadeDark;
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 26; i++) {
    const gx = 90 + painter.dice.unit() * 410;
    const gy = 196 + painter.dice.unit() * 22;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + painter.dice.jitter(2), gy - 4 - painter.dice.unit() * 3);
    ctx.stroke();
  }
  for (let i = 0; i < 7; i++) {
    const fx = 100 + painter.dice.unit() * 390;
    const fy = 200 + painter.dice.unit() * 18;
    ctx.fillStyle = i % 2 ? P.cream : P.golden;
    circleAt(ctx, fx, fy, 1.6);
    ctx.fill();
  }
  ctx.restore();
}

function drawPond(painter) {
  const ctx = painter.ctx;
  const x = 420;
  const y = 202;
  ctx.save();
  const water = ctx.createRadialGradient(x - 10, y - 4, 4, x, y, 62);
  water.addColorStop(0, '#B8E0EE');
  water.addColorStop(1, '#4E9AB8');
  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.ellipse(x, y, 62, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,244,224,0.5)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(x - 14 + i * 16, y - 4 + i * 4, 12 - i * 2, 2.4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#8A8AA0';
  for (const [sx, sy, sr] of [[362, 196, 5], [368, 208, 4], [474, 194, 5], [480, 206, 4], [420, 219, 4]]) {
    ctx.beginPath();
    ctx.ellipse(sx, sy, sr, sr * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.ellipse(sx - 1, sy - 1, sr * 0.5, sr * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8A8AA0';
  }
  ctx.restore();
}

function drawWaterfall(painter) {
  const ctx = painter.ctx;
  const streams = painter.var('waterfall-streams', 2, 1);
  const x = 500;
  ctx.save();
  const g = ctx.createLinearGradient(0, 214, 0, 344);
  g.addColorStop(0, 'rgba(184,224,238,0.95)');
  g.addColorStop(1, 'rgba(130,197,219,0.35)');
  ctx.fillStyle = g;
  const bands = streams === 2 ? [[x - 7, 6], [x + 4, 5]] : [[x - 5, 10]];
  for (const [bx, bw] of bands) {
    ctx.beginPath();
    ctx.moveTo(bx, 214);
    ctx.bezierCurveTo(bx - 3, 260, bx + 3, 300, bx - 2, 342);
    ctx.lineTo(bx + bw + 2, 342);
    ctx.bezierCurveTo(bx + bw + 3, 300, bx + bw - 3, 260, bx + bw, 214);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    const sy = 230 + i * 28;
    ctx.beginPath();
    ctx.moveTo(x - 5 + painter.dice.jitter(3), sy);
    ctx.lineTo(x - 5 + painter.dice.jitter(3), sy + 12);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.ellipse(x, 344, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTree(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const trunk = ctx.createLinearGradient(140, 120, 160, 200);
  trunk.addColorStop(0, '#7A5240');
  trunk.addColorStop(1, '#4E3226');
  ctx.fillStyle = trunk;
  ctx.beginPath();
  ctx.moveTo(146, 200);
  ctx.quadraticCurveTo(140, 160, 148, 128);
  ctx.lineTo(158, 130);
  ctx.quadraticCurveTo(156, 164, 162, 200);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4E3226';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(152, 140);
  ctx.quadraticCurveTo(176, 132, 196, 140);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(150, 132);
  ctx.quadraticCurveTo(130, 120, 118, 112);
  ctx.stroke();
  const canopy = [[118, 104, 24], [150, 92, 28], [182, 104, 24], [134, 122, 20], [168, 122, 20]];
  for (const [cx, cy, r] of canopy) {
    const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.2, cx, cy, r);
    g.addColorStop(0, '#F6C3D4');
    g.addColorStop(0.7, P.sakura);
    g.addColorStop(1, P.sakuraDark);
    ctx.fillStyle = g;
    circleAt(ctx, cx, cy, r);
    ctx.fill();
  }
  drawBlossom(painter, 132, 96, 4.2, 5);
  drawBlossom(painter, 158, 84, 4.2, 5);
  drawBlossom(painter, 170, 105, 4.6, painter.var('petal-missing', 5, 4));
  drawBlossom(painter, 110, 110, 4, 5);
  drawBlossom(painter, 186, 116, 4, 5);
  drawBlossom(painter, 146, 116, 3.8, 5);
  ctx.restore();
}

function drawBlossom(painter, x, y, r, petals) {
  const ctx = painter.ctx;
  ctx.save();
  ctx.fillStyle = P.cream;
  for (let i = 0; i < petals; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, r * 0.55, r * 0.38, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = P.golden;
  circleAt(ctx, x, y, r * 0.3);
  ctx.fill();
  ctx.restore();
}

function drawLantern(painter) {
  const ctx = painter.ctx;
  const yellow = painter.var('lantern-colour', false, true);
  const x = 205;
  const y = 152;
  ctx.save();
  ctx.strokeStyle = '#6B4A38';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(196, 140);
  ctx.lineTo(x, y - 18);
  ctx.stroke();
  const top = yellow ? '#FFE08A' : '#F09560';
  const bottom = yellow ? '#D9A03A' : '#B9482C';
  const g = ctx.createLinearGradient(x - 12, 0, x + 12, 0);
  g.addColorStop(0, bottom);
  g.addColorStop(0.5, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, 12, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(80,40,30,0.4)';
  ctx.lineWidth = 0.9;
  for (const dy of [-8, 0, 8]) {
    ctx.beginPath();
    ctx.ellipse(x, y + dy, 12 * Math.sqrt(1 - (dy / 16) ** 2), 2.6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#50372C';
  ctx.fillRect(x - 5, y - 19, 10, 4);
  ctx.fillRect(x - 5, y + 15, 10, 4);
  ctx.strokeStyle = '#D96D70';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x, y + 19);
  ctx.lineTo(x, y + 27);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x - 8, y - 10, 2.4, 16);
  ctx.restore();
}

function drawStoneLantern(painter) {
  const ctx = painter.ctx;
  const x = 232;
  const y = 196;
  ctx.save();
  const stone = ctx.createLinearGradient(x - 10, y - 34, x + 10, y);
  stone.addColorStop(0, '#B8B0C8');
  stone.addColorStop(1, '#7A7290');
  ctx.fillStyle = stone;
  ctx.fillRect(x - 8, y - 4, 16, 4);
  ctx.fillRect(x - 3, y - 18, 6, 14);
  ctx.fillRect(x - 9, y - 28, 18, 10);
  ctx.beginPath();
  ctx.moveTo(x - 13, y - 28);
  ctx.lineTo(x, y - 38);
  ctx.lineTo(x + 13, y - 28);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = P.golden;
  ctx.fillRect(x - 4, y - 26, 8, 6);
  ctx.fillStyle = 'rgba(255,244,224,0.4)';
  ctx.fillRect(x - 8, y - 28, 2, 10);
  ctx.restore();
}

function drawTable(painter) {
  const ctx = painter.ctx;
  ctx.save();
  const top = ctx.createLinearGradient(0, 188, 0, 198);
  top.addColorStop(0, '#8A5A38');
  top.addColorStop(1, '#5D3A24');
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.ellipse(290, 193, 46, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,244,224,0.25)';
  ctx.beginPath();
  ctx.ellipse(290, 191, 40, 5, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4E3226';
  ctx.fillRect(262, 196, 6, 14);
  ctx.fillRect(312, 196, 6, 14);
  ctx.restore();
}

function drawTeapot(painter) {
  const ctx = painter.ctx;
  const x = 272;
  const y = 180;
  ctx.save();
  const g = ctx.createLinearGradient(x - 12, y - 12, x + 12, y + 10);
  g.addColorStop(0, '#7BB894');
  g.addColorStop(0.6, P.jade);
  g.addColorStop(1, P.jadeDark);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 10, y - 4);
  ctx.quadraticCurveTo(x + 20, y - 8, x + 18, y - 12);
  ctx.lineTo(x + 15, y - 10);
  ctx.quadraticCurveTo(x + 14, y - 6, x + 8, y - 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = P.jadeDark;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(x - 12, y - 2, 6, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.fillStyle = P.jadeDark;
  ctx.beginPath();
  ctx.ellipse(x, y - 9, 7, 2.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = P.golden;
  circleAt(ctx, x, y - 12, 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(x - 5, y - 4, 4, 2.4, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x + 18, y - 14);
  ctx.quadraticCurveTo(x + 22, y - 20, x + 18, y - 26);
  ctx.stroke();
  ctx.restore();
}

function drawCup(painter) {
  const ctx = painter.ctx;
  const handle = painter.var('cup-handle', true, false);
  const x = 308;
  const y = 186;
  ctx.save();
  if (handle) {
    ctx.strokeStyle = P.cream;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(x + 8, y - 2, 4, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  const g = ctx.createLinearGradient(x - 7, y - 8, x + 7, y + 4);
  g.addColorStop(0, '#FFFFFF');
  g.addColorStop(1, '#D9C8B0');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 7, y - 7);
  ctx.quadraticCurveTo(x - 6, y + 4, x, y + 4);
  ctx.quadraticCurveTo(x + 6, y + 4, x + 7, y - 7);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8FBF9A';
  ctx.beginPath();
  ctx.ellipse(x, y - 7, 7, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = P.sakuraDark;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 5, y - 1);
  ctx.lineTo(x + 5, y - 1);
  ctx.stroke();
  ctx.restore();
}

function drawKoi(painter) {
  const ctx = painter.ctx;
  const count = painter.var('koi-count', 3, 2);
  const fish = [[400, 198, 0.3, '#F09560'], [430, 205, -0.2, '#FFF4E0'], [448, 196, 0.5, '#E8734F']];
  ctx.save();
  for (let i = 0; i < count; i++) {
    const [x, y, a, color] = fish[i];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 3.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-7, 0);
    ctx.lineTo(-12, -3.4);
    ctx.lineTo(-12, 3.4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(80,40,30,0.7)';
    circleAt(ctx, 5.4, -0.8, 0.8);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(1, -1, 3, 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawLilyPads(painter) {
  const ctx = painter.ctx;
  ctx.save();
  for (const [x, y, r] of [[390, 208, 9], [452, 210, 7]]) {
    const g = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, r);
    g.addColorStop(0, '#7BB894');
    g.addColorStop(1, P.jadeDark);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.55, 0, 0.35, Math.PI * 2 - 0.15);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = P.sakura;
  circleAt(ctx, 390, 205, 2.4);
  ctx.fill();
  ctx.fillStyle = P.golden;
  circleAt(ctx, 390, 205, 1);
  ctx.fill();
  ctx.restore();
}

function drawFrog(painter) {
  const ctx = painter.ctx;
  const onPad = painter.var('frog-perch', false, true);
  const x = onPad ? 390 : 470;
  const y = onPad ? 201 : 185;
  ctx.save();
  if (!onPad) {
    ctx.fillStyle = '#8A8AA0';
    ctx.beginPath();
    ctx.ellipse(470, 192, 13, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.ellipse(467, 189, 6, 3, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  const g = ctx.createLinearGradient(x - 8, y - 8, x + 8, y + 4);
  g.addColorStop(0, '#8FCF9A');
  g.addColorStop(1, '#3E7A50');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8FCF9A';
  circleAt(ctx, x - 4, y - 6, 2.6);
  ctx.fill();
  circleAt(ctx, x + 4, y - 6, 2.6);
  ctx.fill();
  ctx.fillStyle = '#2A2A3A';
  circleAt(ctx, x - 4, y - 6.4, 1.1);
  ctx.fill();
  circleAt(ctx, x + 4, y - 6.4, 1.1);
  ctx.fill();
  ctx.strokeStyle = '#2E5A44';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 3, y + 1);
  ctx.quadraticCurveTo(x, y + 3, x + 3, y + 1);
  ctx.stroke();
  ctx.fillStyle = '#3E7A50';
  ctx.beginPath();
  ctx.ellipse(x - 7, y + 4, 3, 1.6, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 7, y + 4, 3, 1.6, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawButterfly(painter, x, y, open) {
  const ctx = painter.ctx;
  ctx.save();
  ctx.translate(x, y);
  const g = ctx.createLinearGradient(-10, -8, 10, 8);
  g.addColorStop(0, P.lavender);
  g.addColorStop(1, '#6E5E9E');
  ctx.fillStyle = g;
  if (open) {
    ctx.beginPath();
    ctx.ellipse(-6, -3, 6.5, 5, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, -3, 6.5, 5, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-4.5, 4, 4.5, 3.4, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4.5, 4, 4.5, 3.4, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,244,224,0.6)';
    circleAt(ctx, -6, -3, 1.6);
    ctx.fill();
    circleAt(ctx, 6, -3, 1.6);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(-1.5, 0, 2.6, 8, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(1.5, 0, 2.6, 8, 0.12, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#4E3226';
  ctx.beginPath();
  ctx.ellipse(0, 0, 1.4, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4E3226';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.quadraticCurveTo(-3, -9, -4, -9);
  ctx.moveTo(0, -5);
  ctx.quadraticCurveTo(3, -9, 4, -9);
  ctx.stroke();
  ctx.restore();
}

function drawPetals(painter) {
  const ctx = painter.ctx;
  ctx.save();
  for (let i = 0; i < 10; i++) {
    const x = 100 + painter.dice.unit() * 200;
    const y = 130 + painter.dice.unit() * 90;
    ctx.fillStyle = i % 3 ? P.sakura : '#F6C3D4';
    ctx.globalAlpha = 0.5 + painter.dice.unit() * 0.5;
    ctx.beginPath();
    ctx.ellipse(x, y, 2.6, 1.5, painter.dice.unit() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  scatterMarks(ctx, painter.dice, 240, 190, 100, 16, 14, P.cream, 0.3, 1);
  ctx.restore();
}
