// Twin Hunt — the entry builder.
//
//   node main.ts
//
// Writes one entry directory (MAKEFUN_OUTPUT_DIR, or ./output by default):
//
//   game/          the playable game, copied from this repository's game/
//   screenshots/   four renders of it, copied from this repository's screenshots/
//   dossier.json   the source text and the images, via vendor/makefun-game.ts
//
// The screenshots are committed renders: they were taken once, on a machine
// with a browser, from the same game tree (game/src/main.js stages itself
// through ?shot=N), and they are checked in under screenshots/ next to the
// code that shows them. The build only copies them. Nothing here launches a
// browser, consults the clock, the environment beyond MAKEFUN_OUTPUT_DIR, or
// a random number, so two runs write identical trees — including on the
// grader, which has no browser at all.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildDossier } from './vendor/makefun-game.ts';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? join(ROOT, 'output');
/** The caps gate.json hands the scorer: the text, the images and the game tree. */
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

/** The four views, in name order (the dossier takes the first as the cover). */
const SHOTS = [
  { name: '1-bazaar', shot: 1, what: 'Midnight Spice Bazaar, 3 of 8 found' },
  { name: '2-levels', shot: 2, what: 'the four pairs, thumbnails side by side' },
  { name: '3-workshop', shot: 3, what: "Clockmaker's Workshop, 4 of 8 found" },
  { name: '4-tea-garden', shot: 4, what: 'Tea Garden at Dusk, 7 of 8 found' },
];

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

// ---------------------------------------------------------------- the shots
//
// game/src/main.js already stages itself: its boot() reads `?shot=N` through
// stagedShot(), hands the view to paintStaged() and plays nothing, so each
// committed render is a still of the game and not a level played to a stop.
// The page is never loaded here — the renders were taken from it once, and
// this build only copies the files they landed in.

function copyShots() {
  const dir = join(OUT, 'screenshots');
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  for (const { name } of SHOTS) {
    // A PNG, lossless, exactly as it was rendered: the cap is generous enough
    // for a 1280x480 flat-colour board, and a render over it is a refusal,
    // never a blurred JPEG.
    const from = join(ROOT, 'screenshots', `${name}.png`);
    if (!existsSync(from)) throw new Error(`main.ts: committed render missing: screenshots/${name}.png`);
    const png = join(dir, `${name}.png`);
    writeFileSync(png, readFileSync(from));
    const pngBytes = statSync(png).size;
    if (pngBytes > CAPS.screenshots.max_bytes) {
      rmSync(png, { force: true });
      throw new Error(`main.ts: ${name}.png is ${pngBytes} bytes, over the ${CAPS.screenshots.max_bytes} cap`);
    }
    // The renders are all the page's own 1280x480 pair of panels; a file of
    // any other size is the wrong file, not a render of this game.
    const head = readFileSync(png);
    const width = head.readUInt32BE(16);
    const height = head.readUInt32BE(20);
    if (width !== 1280 || height !== 480) {
      rmSync(png, { force: true });
      throw new Error(`main.ts: ${name}.png is ${width}x${height}, expected 1280x480`);
    }
  }
}

function writeDossier() {
  writeFileSync(join(OUT, 'dossier.json'), buildDossier(OUT, CAPS));
}

function main() {
  mkdirSync(join(OUT, 'game'), { recursive: true });
  copyTree(join(ROOT, 'game'), join(OUT, 'game'));
  copyShots();
  writeDossier();
  process.stdout.write(`${join(OUT, 'dossier.json')}\n`);
}

main();
