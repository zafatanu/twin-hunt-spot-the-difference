// Dev-only concatenator (not shipped under game/).
// drift-append.mjs keeps scene art in bounded pieces: each piece is written to
// tools/chunks/<target>/NNN.txt with write_file, and this script splices it into
// tools/chunks/<target>/base.js in order (base.js starts as the file's header).
// Usage: node tools/drift-append.mjs <target>   -> writes tools/chunks/<target>.js
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const target = process.argv[2];
if (!target) throw new Error('usage: node tools/drift-append.mjs <target>');
const dir = new URL(`./chunks/${target}/`, import.meta.url);
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.txt'))
  .sort();
let body = readFileSync(join(dir.pathname, 'base.js'), 'utf8');
for (const f of files) {
  body += '\n';
  body += readFileSync(join(dir.pathname, f), 'utf8');
}
writeFileSync(new URL(`./chunks/${target}.js`, import.meta.url), body);
writeFileSync(new URL('./drift.log', import.meta.url), `${target}: ${files.join(', ')} -> ${body.split('\n').length} lines\n`);
