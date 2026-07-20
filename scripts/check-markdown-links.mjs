import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const ignored = new Set(['.git', '.next', 'node_modules', 'test-results', 'legacy']);

const markdownFiles = [];
const walk = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.isFile() && entry.name.endsWith('.md')) markdownFiles.push(absolute);
  }
};

walk(root);
const failures = [];
const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;

for (const file of markdownFiles) {
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(linkPattern)) {
    let target = match[1].trim().replace(/^<|>$/g, '').split(/\s+['"]/)[0];
    if (!target || /^(?:https?:|mailto:|tel:|#)/i.test(target)) continue;
    target = decodeURIComponent(target.split('#')[0].split('?')[0]);
    if (!target) continue;
    const resolved = path.resolve(path.dirname(file), target);
    if (!existsSync(resolved)) {
      const line = content.slice(0, match.index).split('\n').length;
      failures.push(`${path.relative(root, file)}:${line} -> ${target}`);
      continue;
    }
    statSync(resolved);
  }
}

if (failures.length) {
  console.error(`Broken local Markdown links:\n${failures.join('\n')}`);
  process.exit(1);
}

console.log(`Verified local links across ${markdownFiles.length} current Markdown files.`);
