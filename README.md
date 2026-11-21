# Twin Hunt — Spot the Difference

[![Owner](https://img.shields.io/badge/make.fun-zafatanu-E9B957)](https://github.com/zafatanu)
[![Repo](https://img.shields.io/badge/repo-twin--hunt--spot--the--difference-369D91)](https://github.com/zafatanu/twin-hunt-spot-the-difference)
[![Competition](https://img.shields.io/badge/competition-best--spot--the--difference--game--20261121--0451-C45A32)](https://github.com/zafatanu/twin-hunt-spot-the-difference)

Two night scenes, side by side. Find what moved, changed, or went missing before the clock
eats your stars.

## Play

Open `game/index.html` in a browser. There is no build step, no install and no network request:
the game is static files, drawn entirely with Canvas 2D, and every scene is generated from its own
fixed seed.

## The four pairs

| # | Scene | Blurb |
|---|-------|-------|
| 1 | Midnight Spice Bazaar | Lanterns over the night market |
| 2 | Clockmaker's Enchanted Workshop | Gears, potions and a brass bird |
| 3 | Floating Island Tea Garden | Koi, blossoms and sky-high tea |
| 4 | Golden Harvest Bakery | Warm loaves and sweet things |

Eight differences per pair, mixed easy, medium and hard. Click a difference on either panel (the
panels are twins, so the same spot works on both). A miss misses the counter and costs a strike; three of them
on one pair remove the crack at three stars. Three hints per level
ring the next unfound difference in turquoise for two seconds.

## Scoring

Each level is graded on time and strikes together: a clean run under a minute is three stars, under two
minutes is two, and anything slower is one. Best times are kept per scene for the level-select card.

## The entry directory

`node main.ts` writes one entry directory (set `MAKEFUN_OUTPUT_DIR`, default `./output`):

- `game/` — the playable game, copied from `game/` in this repository
- `screenshots/` — four renders at 1280x480, one per `?shot=1..4` view
- `dossier.json` — the source text and the images, via `vendor/makefun-game.ts`

`?shot=N` is the page's own staging hook: it boots into a frozen state and draws it once, so a
screenshot is a still of the game rather than a level played to a stop. The build is deterministic:
nothing reads the clock, the environment beyond `MAKEFUN_OUTPUT_DIR` / `MAKEFUN_CHROME`, or a random
number, so two runs write byte-identical trees.

Rendering needs a browser that can headless-screenshot a local page; `MAKEFUN_CHROME` points the build at it
(default `/home/hatch/.agent-browser/browsers/chrome-157.0.8103.78/chrome`, falling back to
`/opt/meta-chromium/chrome`).
