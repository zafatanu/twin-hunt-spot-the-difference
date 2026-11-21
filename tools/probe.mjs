import('../game/src/render.js')
  .then((m) => console.log('render ok:', Object.keys(m).join(', ')))
  .catch((e) => console.log('render FAIL:', e.message));
