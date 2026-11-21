// Dev-only parser for Twin Hunt's ES modules (not shipped under game/).
// Usage: node tools/parse-check.mjs a.js b.js ...
// Compiles each file as a module source (syntax only, nothing runs), and writes
// [ok]/[FAIL] lines with the offending line number to tools/parse-check.log.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SourceTextModule } from 'node:vm';

const out = [];
for (const file of process.argv.slice(2)) {
  const text = readFileSync(resolve(file), 'utf8');
  try {
    new SourceTextModule(text, { identifier: file });
    out.push(`[ok] ${file} lines=${text.split('\n').length}`);
  } catch (err) {
    const where = err.stack ? err.stack.split('\n').slice(0, 4).join(' | ') : String(err);
    out.push(`[FAIL] ${file}: ${where}`);
  }
}
writeFileSync(new URL('./parse-check.log', import.meta.url), out.join('\n') + '\n');
