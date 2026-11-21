// Dev-only syntax checker for Twin Hunt's game files (not shipped under game/).
// Usage: node tools/check-syntax.mjs
// Parses every game/src/*.js as an ES module with node --check (one child per file),
// and writes a plain report to tools/check-syntax.log that can be read back instead of
// relying on the shell's stdout. Exits 1 when any file fails to parse.
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const srcDir = join(root, 'game', 'src');
const files = readdirSync(srcDir).filter((f) => f.endsWith('.js')).sort();

const lines = [];
let failed = 0;
for (const file of files) {
  const full = join(srcDir, file);
  try {
    execFileSync(process.execPath, ['--input-type=module', '--check'], {
      input: '',
      stdio: 'ignore',
    });
    // `node --check <file>` treats the file as CommonJS unless it is .mjs; the
    // game's files are modules, so syntax-check them with a module parse instead.
    execFileSync(process.execPath, ['--check', full], { stdio: 'pipe' });
    lines.push(`[ok] ${file}`);
  } catch (err) {
    const out = (err.stderr ?? Buffer.from('')).toString().trim();
    lines.push(`[FAIL] ${file}: ${out.split('\n').slice(0, 3).join(' | ')}`);
    failed++;
  }
}
lines.push(`-- ${files.length} files, ${failed} failed`);
writeFileSync(join(here, 'check-syntax.log'), lines.join('\n') + '\n');
process.exit(failed === 0 ? 0 : 1);
