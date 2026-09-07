import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Older one-off publishing scripts inserted articles into the first (hub) list.
// Move those cards without regenerating, removing, or changing article content.
export function normalizeEnglishIndex(html) {
  const groups = [...html.matchAll(/<details class="article-group"[^>]*>[\s\S]*?<\/details>/g)];
  const hub = groups.find(g => g[0].includes('<h2>Featured Topic Hubs</h2>'));
  const main = groups.find(g => g[0].includes('id="en-article-index"'));
  if (!hub || !main) throw new Error('Expected separate English hub and article groups');
  const cards = group => [...group.matchAll(/<article class="article-card"[\s\S]*?<\/article>/g)].map(m => m[0]);
  const hubCards = cards(hub[0]);
  const misplaced = hubCards.filter(card => !card.includes('class="tag">Featured Hub</span>'));
  const retained = hubCards.filter(card => card.includes('class="tag">Featured Hub</span>'));
  const articles = [...misplaced, ...cards(main[0])];
  const rebuild = (group, entries, countLabel) => {
    const start = group.indexOf('<div class="article-list">');
    if (start < 0) throw new Error('Missing article list');
    const prefix = group.slice(0, start).replace(/<span class="section-toggle">[\s\S]*?<\/span><\/span>/,
      `<span class="section-toggle"><span>${entries.length} ${countLabel}</span></span>`);
    const numbered = entries.map((card, i) => '          ' + card.replace(/data-index="[^"]*"/, `data-index="${String(i + 1).padStart(2, '0')}"`));
    return `${prefix}<div class="article-list">\n${numbered.join('\n')}\n          </div>\n        </details>`;
  };
  return html.replace(hub[0], rebuild(hub[0], retained, retained.length === 1 ? 'Hub' : 'Hubs'))
    .replace(main[0], rebuild(main[0], articles, 'Articles'));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes('--write')) {
  const file = new URL('../articles/en/index.html', import.meta.url);
  writeFileSync(file, normalizeEnglishIndex(readFileSync(file, 'utf8')), 'utf8');
  console.log('Normalized English article groups; all cards retained');
}
