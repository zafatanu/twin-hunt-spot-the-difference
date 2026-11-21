// Dev-only preview: paints each scene to a PNG via @napi-rs/canvas, so art can be
// checked without a browser.
// Usage: node tools/preview.mjs <sceneId> [out.png] [variant]
import { writeFileSync } from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';

const args = process.argv.slice(2);
const sceneId = args[0] || 'bazaar';
const outPath = args[1] || 'tools/preview.png';
const variantName = args[2] || '';

const { SCENES, PANEL_WIDTH, PANEL_HEIGHT } = await import('../game/src/scenes.js');
const { Painter } = await import('../game/src/render.js');
const scene = SCENES.find((s) => s.id === sceneId);
if (!scene) throw new Error('no scene ' + sceneId);

const canvas = createCanvas(PANEL_WIDTH, PANEL_HEIGHT);
const ctx = canvas.getContext('2d');
const variant = variantName ? { [variantName]: true } : {};
const painter = new Painter(ctx, variant, scene.seed, PANEL_WIDTH, PANEL_HEIGHT);
const names = scene.paint(painter);
writeFileSync(outPath, canvas.toBuffer('image/png'));
writeFileSync(
  new URL('./preview.log', import.meta.url),
  sceneId + ' ' + variantName + ' names=' + names.join(',') + ' bytes=' + (await import('node:fs')).statSync(outPath).size + '\n',
);
