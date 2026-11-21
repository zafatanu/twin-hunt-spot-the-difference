// Twin Hunt's scenes: the places, in play order, as one small table each.
// A scene module exports its palette, its fixed seed and its paint function;
// the difference table lives with it in the same file. scenes.js only wires
// them together, so there is one place to add a scene and no import tangles.

import { BAZAAR } from './scenes-bazaar.js';
import { WORKSHOP } from './scenes-workshop.js';
import { TEA_GARDEN } from './scenes-tea-garden.js';
import { BAKERY } from './scenes-bakery.js';

export const PANEL_WIDTH = 590;
export const PANEL_HEIGHT = 350;

export const SCENES = [BAZAAR, WORKSHOP, TEA_GARDEN, BAKERY];

export function sceneById(id) {
  return SCENES.find((scene) => scene.id === id) ?? null;
}
