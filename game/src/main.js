// Twin Hunt — game state, level select, timer, hints and win flow.
//
// One level at a time: a scene, the differences found so far, the strike
// count, the hint budget and the count-up clock. The screen is in one of
// three modes: 'levels' (the four scene thumbnails), 'play' (the two
// side-by-side panels) or 'win' (stars, time, next level).
//
// ?shot=1..4 stages a frozen state of this same code for the screenshots:
// no input, a fixed clock text and preset found markers.

import { SCENES, PANEL_WIDTH, PANEL_HEIGHT } from './scenes.js';
import { Painter, drawMarker, drawHintRing } from './render.js';
import { attachInput } from './input.js';
import { createAudio } from './audio.js';

const MAX_STRIKES = 3;
const HINTS_PER_LEVEL = 3;
const HINT_MS = 2000;
const GOLD = '#E9B957';
const CREAM = '#F6DDA8';
const INK = '#1b1633';

const $ = (id) => document.getElementById(id);
const ui = {
  stage: $('stage'),
  levelName: $('levelName'),
  clock: $('clock'),
  swapClock: $('swapClock'),
  left: $('sceneLeft'),
  right: $('sceneRight'),
  panelLeft: $('panelLeft'),
  panelRight: $('panelRight'),
  remainingNum: $('remainingNum'),
  remainingWord: $('remainingWord'),
  counter: $('counter'),
  strikeDots: $('strikeDots'),
  scoreNum: $('scoreNum'),
  hintBtn: $('hintBtn'),
  hintLeft: $('hintLeft'),
  levelsBtn: $('levelsBtn'),
  overlay: $('overlay'),
};

const state = {
  mode: 'play',
  scene: SCENES[0],
  found: new Set(),
  strikes: 0,
  hints: HINTS_PER_LEVEL,
  hint: null,
  pointer: { x: 0, y: 0 },
  seconds: 0,
  ticking: false,
  tickAt: 0,
  shot: 0,
};

const audio = createAudio();

// --------------------------------------------------------------- staging

const SHOTS = {
  1: { scene: 'bazaar', found: ['bowl-recolour', 'ladle-spoon', 'cat-tail'], hint: 'moon-star', clock: '01:43' },
  2: { scene: 'bazaar', levels: true, progress: { bazaar: 63, workshop: 88 }, clock: '01:08' },
  3: { scene: 'workshop', found: ['clock-hour', 'bird-wings', 'candle-flame', 'books-count'], hint: 'gear-teeth', clock: '01:52' },
  4: { scene: 'tea-garden', found: ['koi-count', 'petal-missing', 'cup-handle', 'cloud-bumps', 'lantern-colour', 'butterfly-wings', 'frog-perch'], clock: '02:11' },
};

function stagedShot() {
  const q = new URLSearchParams(location.search);
  const n = Number(q.get('shot'));
  if (!Number.isInteger(n) || !(n in SHOTS)) return null;
  return { number: n, ...SHOTS[n] };
}

// --------------------------------------------------------------- painting

// One Painter per panel. The left paints every difference normal; the right
// switches in exactly the differences found so far, by name.
const painters = { left: new Painter(), right: new Painter() };

function paintPanel(canvas, side) {
  const painter = painters[side];
  painter.ctx = canvas.getContext('2d');
  painter.ctx.setTransform(1, 0, 0, 1, 0, 0);
  painter.ctx.clearRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
  painter.width = PANEL_WIDTH;
  painter.height = PANEL_HEIGHT;
  painter.seed = state.scene.seed;
  state.scene.paint(painter);
}

function foundList() {
  return [...state.found];
}

function paintMarkers() {
  const ctxL = ui.left.getContext('2d');
  const ctxR = ui.right.getContext('2d');
  const found = foundList();
  for (const d of found) {
    const diff = state.scene.differences.find((item) => item.id === d);
    if (diff === undefined) continue;
    const x = diff.x * PANEL_WIDTH;
    const y = diff.y * PANEL_HEIGHT;
    drawMarker(ctxL, x, y, diff.r);
    drawMarker(ctxR, x, y, diff.r);
  }
  if (state.hint !== null) {
    const hint = state.scene.differences.find((item) => item.id === state.hint);
    if (hint !== undefined) {
      const x = hint.x * PANEL_WIDTH;
      const y = hint.y * PANEL_HEIGHT;
      drawHintRing(ctxL, x, y, hint.r);
      drawHintRing(ctxR, x, y, hint.r);
    }
  }
}

// --------------------------------------------------------------- HUD

const pad2 = (n) => String(n).padStart(2, '0');

function clockText(seconds) {
  return `${pad2(Math.floor(seconds / 60))}:${pad2(seconds % 60)}`;
}

function starsFor(seconds, strikes) {
  if (seconds <= 60 && strikes === 0) return 3;
  if (seconds <= 120) return 2;
  return 1;
}

function remainingCount() {
  return state.scene.differences.length - state.found.size;
}

function renderHud() {
  const remaining = remainingCount();
  ui.levelName.textContent = state.scene.name;
  ui.remainingNum.textContent = String(remaining);
  ui.remainingWord.textContent = remaining === 0 ? 'all found!' : remaining === 1 ? 'last one to find' : 'to find';
  ui.counter.classList.toggle('counter-done', remaining === 0);
  ui.clock.textContent = clockText(state.seconds);
  ui.swapClock.textContent = clockText(state.seconds);
  ui.strikeDots.textContent = '●'.repeat(state.strikes) + '○'.repeat(MAX_STRIKES - state.strikes);
  ui.scoreNum.textContent = String(starsFor(state.seconds, state.strikes));
  ui.hintLeft.textContent = String(state.hints);
  ui.hintBtn.disabled = state.hints === 0 || remaining === 0 || state.mode !== 'play';
  ui.stage.dataset.mode = state.mode;
  ui.stage.dataset.win = state.mode === 'win' ? '1' : '';
}

function bumpCounter() {
  ui.counter.classList.remove('pop', 'shake');
  void ui.counter.offsetWidth;
  ui.counter.classList.add('pop');
}

function shakeCounter() {
  ui.counter.classList.remove('shake', 'pop');
  void ui.counter.offsetWidth;
  ui.counter.classList.add('shake');
}

function render() {
  paintPanel(ui.left, 'left');
  paintPanel(ui.right, 'right');
  paintMarkers();
  renderHud();
  if (state.mode === 'levels') renderLevels();
  else if (state.mode === 'win') renderWin();
  else ui.overlay.hidden = true;
}

// --------------------------------------------------------------- play flow

// scene id -> best (lowest) completion time in seconds, for level select.
const best = new Map();

function levelIndex() {
  return SCENES.findIndex((s) => s.id === state.scene.id);
}

function startLevel(scene, seconds = 0) {
  state.mode = 'play';
  state.scene = scene;
  state.found = new Set();
  state.strikes = 0;
  state.hints = HINTS_PER_LEVEL;
  state.hint = null;
  state.pointer = { x: PANEL_WIDTH / 2, y: PANEL_HEIGHT / 2 };
  state.seconds = seconds;
  state.ticking = false;
  state.tickAt = 0;
  ui.overlay.hidden = true;
  ui.overlay.innerHTML = '';
  state.scene;
  render();
}

function hitTest(x, y) {
  let bestHit = null;
  let bestDist = Infinity;
  for (const d of state.scene.differences) {
    if (state.found.has(d.id)) continue;
    const dx = x - d.x * PANEL_WIDTH;
    const dy = y - d.y * PANEL_HEIGHT;
    const dist = dx * dx + dy * dy;
    const reach = d.r * 1.35 + 8;
    if (dist <= reach * reach && dist < bestDist) {
      bestHit = d;
      bestDist = dist;
    }
  }
  return bestHit;
}

function findAt(x, y) {
  if (state.mode !== 'play') return;
  const hit = hitTest(x, y);
  if (hit === null) {
    miss(x, y);
    return;
  }
  state.found.add(hit.id);
  state.hint = null;
  startClock();
  audio.found();
  render();
  bumpCounter();
  if (remainingCount() === 0) setTimeout(winLevel, 500);
}

function miss(x, y) {
  state.strikes = Math.min(MAX_STRIKES, state.strikes + 1);
  audio.wrong();
  render();
  shakeCounter();
  spark(ui.left, x, y);
  spark(ui.right, x, y);
}

function spark(canvas, x, y) {
  const layer = canvas.parentElement;
  for (let i = 0; i < 6; i++) {
    const dot = document.createElement('span');
    dot.className = 'spark';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.setProperty('--dx', `${(i - 2.5) * 14}px`);
    dot.style.setProperty('--dy', `${-18 - i * 5}px`);
    layer.append(dot);
    setTimeout(() => dot.remove(), 600);
  }
}

function useHint() {
  if (state.mode !== 'play' || state.hints === 0 || state.shot !== 0) return;
  const unfound = state.scene.differences.filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return;
  state.hints -= 1;
  state.hint = unfound[0].id;
  audio.hint();
  render();
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => {
    state.hint = null;
    if (state.mode === 'play') render();
  }, HINT_MS);
}
let hintTimer = 0;

function startClock() {
  if (state.ticking || state.shot !== 0) return;
  state.ticking = true;
  state.tickAt = performance.now();
}

function winLevel() {
  if (state.shot !== 0) return;
  state.mode = 'win';
  state.ticking = false;
  const prev = best.get(state.scene.id);
  if (prev === undefined || state.seconds < prev) best.set(state.scene.id, state.seconds);
  audio.win();
  renderWin();
  renderHud();
}

// Win card choices; the level select draws its thumbnails into <canvas>.
const THUMB_SRC = [];

function buildThumbs() {
  THUMB_SRC.length = 0;
  for (const scene of SCENES) {
    const off = document.createElement('canvas');
    off.width = PANEL_WIDTH;
    off.height = PANEL_HEIGHT;
    const painter = new Painter();
    painter.ctx = off.getContext('2d');
    painter.width = PANEL_WIDTH;
    painter.height = PANEL_HEIGHT;
    painter.seed = scene.seed;
    scene.paint(painter);
    THUMB_SRC.push({ scene, src: off });
  }
}

function starsMarkup(n) {
  let out = '';
  for (let i = 0; i < 3; i++) out += `<span class="star${i < n ? ' on' : ''}">★</span>`;
  return out;
}

function renderWin() {
  const scene = state.scene;
  const n = starsFor(state.seconds, state.strikes);
  const i = levelIndex();
  const next = SCENES[i + 1];
  ui.overlay.hidden = false;
  ui.overlay.innerHTML = `
    <div class="win-card" data-win="1">
      <div class="win-eyebrow">PUZZLE SOLVED</div>
      <div class="win-stars" data-stars="${n}">${starsMarkup(n)}</div>
      <div class="win-title">${scene.name}</div>
      <div class="win-time">in <b>${clockText(state.seconds)}</b> · ${state.strikes} strike${state.strikes === 1 ? '' : 's'}</div>
      <div class="win-row">
        ${next ? `<button class="win-play" type="button" data-go="next">NEXT LEVEL ▸</button>` : ''}
        <button class="win-play ${next ? 'ghost' : ''}" type="button" data-go="replay">PLAY AGAIN</button>
        <button class="win-play ghost" type="button" data-go="levels">LEVEL SELECT</button>
      </div>
    </div>`;
}

function renderLevels() {
  ui.overlay.hidden = false;
  const cards = SCENES.map((scene, i) => {
    const done = best.has(scene.id);
    const active = state.shot === 2 && scene.id === state.scene.id;
    const level = scene.differences.map((d) => d.level).sort((a, b) => a.length - b.length);
    return `
      <button class="level-card${done ? ' done' : ''}${active ? ' active' : ''}" type="button" data-level="${i}" data-scene="${scene.id}">
        <span class="thumb"><canvas width="${PANEL_WIDTH}" height="${PANEL_HEIGHT}" data-thumb="${i}"></canvas><span class="thumb-check">✓</span></span>
        <span class="level-info">
          <span class="level-no">SCENE ${i + 1}</span>
          <span class="level-title">${scene.name}</span>
          <span class="level-blurb">${scene.blurb}</span>
          <span class="level-stars">${done ? starsMarkup(starsFor(best.get(scene.id), 0)) : '<span class="star">★</span><span class="star">★</span><span class="star">★</span>'}</span>
        </span>
        <span class="level-mix"><b>8</b> differences <i>${level[0]}</i><i>${level[4]}</i><i>${level[7]}</i></span>
      </button>`;
  }).join('');
  ui.overlay.innerHTML = `
    <div class="levels-card" data-levels="1">
      <div class="levels-head">
        <span class="levels-title">CHOOSE A PAIR</span>
      </div>
      <div class="levels-grid" data-count="4">${cards}</div>
      <div class="levels-foot">
        <span class="levels-best">BEST ${best.has(state.scene.id) ? clockText(best.get(state.scene.id)) : '--:--'}</span>
        <button class="levels-play" type="button" data-go="play">
          <span class="levels-play-scene">${state.scene.name}</span>
          <span class="levels-play-label">▶ PLAY</span>
        </button>
      </div>
    </div>`;

  for (const { scene, src } of THUMB_SRC) {
    const i = SCENES.indexOf(scene);
    const thumb = ui.overlay.querySelector(`[data-thumb="${i}"]`);
    if (thumb === null) continue;
    thumb.getContext('2d').drawImage(src, 0, 0);
  }
}
