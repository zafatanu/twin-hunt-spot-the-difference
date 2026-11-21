// Seeded pseudo-random numbers for Twin Hunt.
// Every scene draws from its own fixed seed through mulberry32, so a scene
// renders the same pixels on every load. Math.random is never used by the game.

/**
 * mulberry32: a 32-bit seeded generator. Returns a function that yields floats in [0, 1).
 * @param {number} seed a 32-bit integer
 * @returns {() => number}
 */
export function mulberry32(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A small facade over mulberry32 with the helpers the scene painters need,
 * so each draw function asks for numbers in the same vocabulary.
 */
export class Dice {
  /** @param {number} seed */
  constructor(seed) {
    this.next = mulberry32(seed);
  }

  /** A float in [min, max). */
  range(min, max) {
    return min + (max - min) * this.next();
  }

  /** A float in [0, 1). */
  unit() {
    return this.next();
  }

  /** A whole number in [min, max]. */
  int(min, max) {
    return Math.floor(this.range(min, max + 1));
  }

  /** True with probability p. */
  chance(p) {
    return this.next() < p;
  }

  /** A float in [-spread, spread). */
  jitter(spread) {
    return (this.next() * 2 - 1) * spread;
  }

  /** One element of the list. */
  pick(list) {
    return list[Math.floor(this.next() * list.length)];
  }

  /** A new list in a shuffled order. */
  shuffled(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const a = out[i];
      out[i] = out[j];
      out[j] = a;
    }
    return out;
  }
}
