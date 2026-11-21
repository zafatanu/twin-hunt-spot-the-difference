// Dev-only syntax checker for Twin Hunt's ES modules (not shipped under game/).
// Usage: node tools/check-syntax.mjs <file.js>...
// Dynamic-imports each file as a module and logs [ok]/[FAIL] per file to tools/check-syntax.log,
// which is read back instead of relying on the shell's stdout.
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const files = process.argv.slice(2);
const lines = [];
for (const file of files) {
  try {
    const mod = await import(pathToFileURL(resolve(file)).href);
    lines.push(`[ok] ${file} exports=${Object.keys(mod).join(',')}`);
  } catch (err) {
    lines.push(`[FAIL] ${file}: ${err.message}`);
  }
}
writeFileSync(new URL('./check-syntax.log', import.meta.url), lines.join('\n') + '\n');
