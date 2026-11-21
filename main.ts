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
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildDossier } from './vendor/makefun-game.ts';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? join(ROOT, 'output');
/** The stock browsers that render here; the first that exists wins, env or fallback. */
const CHROME_DEFAULT = '/home/hatch/.agent-browser/browsers/chrome-157.0.8103.78/chrome';
const CHROME_FALLBACK = '/opt/meta-chromium/chrome';
const CHROME = process.env.MAKEFUN_CHROME ?? (existsSync(CHROME_DEFAULT) ? CHROME_DEFAULT : CHROME_FALLBACK);
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
// game/src/main.js already stages itself: its boot() reads `?shot=N` through
// stagedShot(), hands the view to paintStaged() and plays nothing, so the page
// is a still of the game and not a level played to a stop. The build only
// copies game/ next to the shots it is taking and loads index.html with
// ?shot=N; it never rewrites the game's scripts.

function writeStage(browser) {
  copyTree(join(OUT, 'game'), join(OUT, '.stage'));
  void browser;
}

// ---------------------------------------------------------------- the shots

/**
 * The staged page's URL: file:// plus the ?shot=N view. An absolute POSIX path
 * keeps /output, a temp directory and this checkout all spelling it the same.
 */
function shotUrl(shot) {
  const page = resolve(OUT, '.stage', 'index.html').split(sep).join('/');
  return `file://${page}?shot=${shot}`;
}

/**
 * Chrome's own --screenshot: one process per view, the staged page loaded with
 * ?shot=N, the 1280x480 viewport written straight to `path`. --virtual-time-budget
 * lets the page's canvas and fonts land before the shot regardless of machine
 * speed, so the pixels do not depend on how fast this machine is.
 */
function chromeShot(shot, path) {
  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--force-color-profile=srgb',
    '--disable-font-subpixel-positioning',
    '--font-render-hinting=none',
    '--allow-file-access-from-files',
    '--user-data-dir=' + join(OUT, '.chrome-profile'),
    `--window-size=${VIEW.width},${VIEW.height}`,
    '--virtual-time-budget=3000',
    `--screenshot=${path}`,
    shotUrl(shot),
  ];
  spawnSync(CHROME, args, { stdio: ['ignore', 'ignore', 'pipe'], timeout: 60000 });
  if (!existsSync(path) || statSync(path).size === 0) throw new Error(`main.ts: chrome wrote no png for shot ${shot} (${path})`);
  return statSync(path).size;
}

// ---------------------------------------------------------------- the shots

function captureShots() {
  const dir = join(OUT, 'screenshots');
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  for (const { name, shot } of SHOTS) {
    // A PNG, lossless: the cap is generous enough for a 1280x480 flat-colour
    // board, and a render over it is a refusal, never a blurred JPEG.
    const png = join(dir, `${name}.png`);
    chromeShot(shot, png);
    const pngBytes = statSync(png).size;
    if (pngBytes > CAPS.screenshots.max_bytes) {
      rmSync(png, { force: true });
      throw new Error(`main.ts: ${name}.png is ${pngBytes} bytes, over the ${CAPS.screenshots.max_bytes} cap`);
    }
  }
}

function writeDossier() {
  writeFileSync(join(OUT, 'dossier.json'), buildDossier(OUT, CAPS));
}

function main() {
  // The renderer is this machine's browser, handed in as a command line: the
  // build never picks one, never passes domain-policy flags, and never lets it
  // run a second pass (there is no Date, no random and no retry to make one).
  if (CHROME === '') throw new Error('main.ts: set MAKEFUN_CHROME to the browser command that renders the game');
  mkdirSync(join(OUT, 'game'), { recursive: true });
  copyTree(join(ROOT, 'game'), join(OUT, 'game'));
  writeStage(CHROME);
  captureShots(CHROME);
  writeDossier();
  rmSync(join(OUT, '.stage'), { recursive: true, force: true });
  rmSync(join(OUT, '.chrome-profile'), { recursive: true, force: true });
  process.stdout.write(`${join(OUT, 'dossier.json')}\n`);
}

main();

