// Twin Hunt — click, tap and keyboard input.
//
// attachInput(handlers) binds the DOM to the game. It owns no game state:
// every gesture calls one handler, and main.js decides what it means.
//
// Mouse and touch: a click on either panel reports onFind(x, y) with the point
// in panel coordinates (0..590, 0..350), so the same spot works on both sides.
// A click on the HUD reports the matching button handler.
//
// Keyboard: arrows moves a cursor and Enter or Space selects at it, H asks for
// a hint, L returns to level select, N starts the next level, R replays. The
// cursor wraps at the edges and is drawn by the game on both panels.

export const PANEL_W = 590;
export const PANEL_H = 350;

export function attachInput(handlers) {
  const { refs, onFind, onCursor, onHint, onLevels, onPick, onNext, onReplay } = handlers;
  const { left, right, hintBtn, levelsBtn, overlay, stage } = refs;
  const pos = { x: PANEL_W / 2, y: PANEL_H / 2 };
  void stage;

  const pointOf = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * PANEL_W) / rect.width,
      y: ((event.clientY - rect.top) * PANEL_H) / rect.height,
    };
  };

  for (const canvas of [left, right]) {
    canvas.addEventListener('click', (event) => {
      const p = pointOf(canvas, event);
      pos.x = p.x;
      pos.y = p.y;
      onCursor({ ...pos, shown: false });
      onFind(p.x, p.y);
    });
    canvas.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch') return;
      const p = pointOf(canvas, event);
      pos.x = p.x;
      pos.y = p.y;
      onCursor({ ...pos, shown: true });
      onFind(p.x, p.y);
    });
  }

  hintBtn.addEventListener('click', () => onHint());
  levelsBtn.addEventListener('click', () => onLevels());

  bindKeyboard(handlers, pos);

  overlay.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (target === null) return;
    if (target.dataset.level !== undefined) {
      handlers.onPick(Number(target.dataset.level));
      return;
    }
    const go = target.dataset.go;
    if (go === undefined) return;
    if (go === 'play') onLevels();
    else if (go === 'levels') onLevels();
    else if (go === 'next') handlers.onNext();
    else if (go === 'replay') handlers.onReplay();
  });
}

export function bindKeyboard(handlers, at) {
  const step = 12;
  const wrap = (value, size) => ((value % size) + size) % size;
  const move = (dx, dy) => {
    at.x = wrap(at.x + dx * step, PANEL_W);
    at.y = wrap(at.y + dy * step, PANEL_H);
    handlers.onCursor({ ...at, shown: true });
  };
  const notice = () => handlers.onCursor({ ...at });

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'a') {
      event.preventDefault();
      move(-1, 0);
    } else if (key === 'ArrowRight' || key === 'd') {
      event.preventDefault();
      move(1, 0);
    } else if (key === 'ArrowUp' || key === 'w') {
      event.preventDefault();
      move(0, -1);
    } else if (key === 'ArrowDown' || key === 's') {
      event.preventDefault();
      move(0, 1);
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      handlers.onFind(cursor.x, cursor.y);
    } else if (key === 'h' || key === 'H') {
      handlers.onHint();
    } else if (key === 'l' || key === 'L') {
      handlers.onLevels();
    } else if (key === 'n' || key === 'N') {
      handlers.onNext();
    } else if (key === 'r' || key === 'R') {
      handlers.onReplay();
    }
  });
}

export function resetCursor(cursor) {
  cursor.x = PANEL_W / 2;
  cursor.y = PANEL_H / 2;
  cursor.shown = false;
}
