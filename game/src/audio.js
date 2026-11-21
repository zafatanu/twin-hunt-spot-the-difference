// Twin Hunt — sound, made with the Web Audio API and nothing else.
//
// createAudio() returns a small object with one method per sound: click,
// found, wrong, hint and win. Every sound is synthesised when it plays from
// oscillators and a seeded noise buffer; the game ships no audio files and
// makes no network request. The context is created on the first gesture a
// browser allows one, and every sound quietly no-ops when none is allowed.

// Twin Hunt's five sounds, as note tables. A note is a frequency (optionally
// glided to `to`), waited `at` seconds into the sound, sounded for `d` seconds
// at volume `v` through a `w` waveform.

const SOUNDS = {
  click: {
    notes: [{ f: 660, to: 560, d: 0.045, v: 0.045, w: 'square' }],
  },
  found: {
    notes: [
      { f: 880, d: 0.09, v: 0.1, w: 'sine' },
      { f: 1108.7, at: 0.05, d: 0.1, v: 0.1, w: 'sine' },
      { f: 1318.5, at: 0.1, d: 0.17, v: 0.115, w: 'triangle' },
      { f: 1760, at: 0.14, d: 0.22, v: 0.04, w: 'sine' },
    ],
    sparkle: { at: 0.02, d: 0.18, v: 0.035, freq: 3200 },
  },
  wrong: {
    notes: [
      { f: 196, to: 148, d: 0.16, v: 0.1, w: 'sawtooth' },
      { f: 147, to: 110, at: 0.06, d: 0.18, v: 0.075, w: 'square' },
    ],
  },
  hint: {
    notes: [
      { f: 1046.5, d: 0.08, v: 0.06, w: 'sine' },
      { f: 1568, at: 0.09, d: 0.1, v: 0.05, w: 'sine' },
      { f: 1568, at: 0.24, d: 0.07, v: 0.035, w: 'sine' },
    ],
  },
  win: {
    notes: [
      { f: 523.3, d: 0.13, v: 0.085, w: 'triangle' },
      { f: 659.3, at: 0.13, d: 0.13, v: 0.085, w: 'triangle' },
      { f: 784, at: 0.26, d: 0.13, v: 0.085, w: 'triangle' },
      { f: 1046.5, at: 0.39, d: 0.26, v: 0.105, w: 'triangle' },
      { f: 1318.5, at: 0.39, d: 0.26, v: 0.05, w: 'sine' },
      { f: 523.3, at: 0.6, d: 0.34, v: 0.06, w: 'sine' },
    ],
    sparkle: { at: 0.36, d: 0.5, v: 0.022, freq: 3600 },
  },
};

/** One oscillator note, faded in over 8 ms and out to the note's end. */
function tone(ctx, out, when, note) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = note.w;
  const start = when + (note.at ?? 0);
  const end = start + note.d;
  osc.frequency.setValueAtTime(note.f, start);
  if (note.to !== undefined) osc.frequency.exponentialRampToValueAtTime(note.to, end);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(note.v, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  osc.connect(gain).connect(out);
  osc.start(start);
  osc.stop(end + 0.02);
}

export function createAudio() {
  let ctx = null;
  let out = null;
  let noise = null;
  let muted = false;


  /** The audio context, resumed after any gesture; null once sound is refused. */
  function ensure() {
    if (muted) return null;
    const AC = window.AudioContext ?? window.webkitAudioContext;
    if (AC === undefined) {
      muted = true;
      return null;
    }
    if (ctx === null) {
      ctx = new AC();
      out = ctx.createGain();
      out.gain.value = 0.8;
      out.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  /** Two seconds of a seeded LFSR's white noise, made once and shared. */
  function noiseBuffer(c) {
    if (noise !== null) return noise;
    let s = 0x2545f491;
    const buf = c.createBuffer(1, Math.floor(cipper.sampleRate * 2), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      s = (s ^ (s << 13)) >>> 0;
      s = (s ^ (s >>> 17)) >>> 0;
      s = (s ^ (s << 5)) >>> 0;
      data[i] = s / 0xffffffff * 2 - 1;
    }
    noise = buf;
    return noise;
  }

  /** A high, unfiltered shimmer: the sparkle on top of a find or a win. */
  function sparkle(c, when, spec) {
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c);
    const filter = c.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = spec.freq;
    const gain = c.createGain();
    const start = when + spec.at;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(spec.v, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + spec.d);
    src.connect(filter).connect(gain).connect(out);
    src.start(start);
    src.stop(start + spec.d + 0.02);
  }

  function play(name) {
    const c = ensure();
    const sound = SOUNDS[name];
    if (c === null || sound === undefined) return;
    const when = c.currentTime + 0.005;
    for (const note of sound.notes) tone(c, out, when, note);
    if (sound.sparkle !== undefined) sparkle(c, when, sound.sparkle);
  }

  return {
    click: () => play('click'),
    found: () => play('found'),
    wrong: () => play('wrong'),
    hint: () => play('hint'),
    win: () => play('win'),
  };
}
