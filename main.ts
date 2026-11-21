// Twin Hunt — the entry builder.
//
//   node main.ts
//
// Writes one entry directory (MAKEFUN_OUTPUT_DIR, or ./output by default):
//
//   game/          the playable game, copied from this repository's game/
//   screenshots/   four renders of it, one per ?shot=1..4 view the page stages
//   dossier.json   the source text and the images, via vendor/makefun-game.ts
//
// The screenshots are the part the build cannot copy: a browser has to play the
// page. So it starts the headless Chrome the bounty kit names with a remote
// debugging port, navigates one tab to file://.../game/index.html?shot=N, waits
// for the page to say it is staged (?shot= is the page's own staging hook), and
// reads the viewport back. Nothing consults the clock, the environment beyond
// MAKEFUN_OUTPUT_DIR and MAKEFUN_CHROME, or a random number; the browser runs
// with a fixed profile and a fixed window, so two runs write identical trees.

import { spawn, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildDossier } from './vendor/makefun-game.ts';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? join(ROOT, 'output');
const CHROME = process.env.MAKEFUN_CHROME ?? '/opt/meta-chromium/chrome';

/** The caps gate.json hands the scorer: the text, the images and the game tree. */
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

/** The window every render is taken at: the page's own 1280x480 pair of panels. */
const VIEW = { width: 1280, height: 480 };
/** JPEG qualities to try, in order, when a PNG lands over the cap. */
const QUALITIES = [85, 80, 72, 64, 56, 48, 30];
const PORT = 9377;

/** The four views, in name order (the dossier takes the first as the cover). */
const SHOTS = [
  { name: '1-bazaar', shot: 1, what: 'Midnight Spice Bazaar, 3 of 8 found' },
  { name: '2-levels', shot: 2, what: 'the four pairs, thumbnails side by side' },
  { name: '3-workshop', shot: 3, what: "Clockmaker's Workshop, 4 of 8 found" },
  { name: '4-tea-garden', shot: 4, what: 'Tea Garden at Dusk, 7 of 8 found' },
];

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

/** The files under `dir`, POSIX paths relative to it, in code-unit order; `base` carries the recursion. */
function walk(dir, base = '') {
  const out = [];
  for (const name of readdirSync(base === '' ? dir : join(dir, base)).sort()) {
    const rel = base === '' ? name : `${base}/${name}`;
    const abs = join(dir, rel);
    if (statSync(abs).isDirectory()) out.push(...walk(dir, rel));
    else out.push(rel);
  }
  return out;
}

/** A tree copied file by file, its directories created on the way (cpSync -r would also copy modes and times). */
function copyTree(from, to) {
  rmSync(to, { recursive: true, force: true });
  mkdirSync(to, { recursive: true });
  for (const rel of walk(from)) {
    mkdirSync(dirname(join(to, rel)), { recursive: true });
    writeFileSync(join(to, rel), readFileSync(join(from, rel)));
  }
}

// ---------------------------------------------------------------- the page
//
// game/src/main.js carries a `?shot=` staging hook (SHOTS, stagedShot, and
// state.shot) that no boot code calls yet, so the page plays a normal level and
// ignores ?shot=. The hook is exactly what the shots need; instead of changing
// the game on the way to a screenshot, the build patches one line of a copy of
// it. Nothing else in game/ is rewritten.

const PATCH_FROM = 'export function boot() {';
const PATCH_TO = [
  PATCH_FROM,
  '  const staged = stagedShot();',
  '  if (staged !== null) {',
  '    state.scene = sceneById(staged.scene) ?? state.scene;',
  '    state.found = new Set(staged.found ?? []);',
  '    state.hint = staged.hint ?? null;',
  '    state.hints = HINTS_PER_LEVEL - (staged.hint === null ? 0 : 1);',
  '    state.shot = staged.number;',
  '    state.mode = staged.levels === true ? \'levels\' : \'play\';',
  '    best.set(state.scene.id, staged.best);',
  '    buildThumbs();',
  '    return;',
  '  }',
].join('\n');

function writeStage() {
  const stage = join(OUT, '.stage');
  copyTree(join(OUT, 'game'), stage);
  const mainPath = join(stage, 'src', 'main.js');
  const src = readFileSync(mainPath, 'utf8');
  if (!src.includes(PATCH_FROM)) throw new Error('main.ts: game/src/main.js has no boot() to stage a shot in');
  writeFileSync(mainPath, src.replace(PATCH_FROM, PATCH_TO));
}

// ---------------------------------------------------------------- the shots

/**
 * The staged page's URL. Chrome is given the file itself and the shot through
 * ?shot=N; --window-size and --force-device-scale-factor fix the pixels.
 */
function shotUrl(shot) {
  const page = join(OUT, '.stage', 'index.html').split(sep$).join('/');
  return `file://${page}?shot=${shot}`;
}

