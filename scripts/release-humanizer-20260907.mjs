import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
const run = (exe, args) => execFileSync(exe, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, windowsHide: true });
const articles = [];
for (const suffix of ['a', 'b', 'c', 'd', 'e', 'f']) articles.push(...(await import(`../docs/article-drafts/humanizer-20260907-${suffix}.mjs`)).default);
const hubs = { '看盘方法': 'ziwei-learning-path', '大限流年': 'ziwei-cycles', '宫位组合': 'ziwei-palaces', '辅煞曜': 'ziwei-helper-malice-stars', '四化': 'ziwei-four-transformations', '主星细读': 'ziwei-main-stars', '财运事业': 'ziwei-money-career' };
const common = ['articles/index.html', 'articles/en/index.html', 'feed.xml', 'articles/en/feed.xml', 'sitemap.xml', 'sitemap-articles.xml', 'sitemap-en.xml', 'docs/article-drafts/humanizer-20260907-queue.md'];
for (const [i, article] of articles.entries()) {
  const files = [`articles/${article.slug}.html`, `articles/en/${article.slug}.html`];
  if (!existsSync(files[0])) {
    const now = new Date(Date.now() + 8 * 3600000).toISOString();
    run('node', ['scripts/publish-local-article-batch.mjs', '--source', 'docs/article-drafts/humanizer-20260907-source.md', '--queue', 'docs/article-drafts/humanizer-20260907-queue.md', '--count', '1', '--slug', article.slug, '--date', now.slice(0, 10), '--time', now.slice(11, 16), '--append-collections']);
  }
  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
    if (!html.includes(`https://yuetianai.com/${file}`)) throw new Error(`Missing URL: ${file}`);
  }
  run('git', ['add', '--', ...files, ...common, `articles/${hubs[article.category]}.html`]);
  run('git', ['diff', '--cached', '--check']);
  if (run('git', ['diff', '--cached', '--name-only']).trim()) run('git', ['commit', '-m', `Publish bilingual article ${i + 1}/30: ${article.slug}`]);
  console.log(`${i + 1}/30 ${article.slug}`);
}
