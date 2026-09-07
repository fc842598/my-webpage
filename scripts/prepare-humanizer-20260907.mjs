import { readdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dir = path.join(root, 'docs/article-drafts');
const modules = readdirSync(dir).filter(name => /^humanizer-20260907-[a-f]\.mjs$/.test(name)).sort();
const articles = [];
for (const name of modules) articles.push(...(await import(pathToFileURL(path.join(dir, name)))).default);
const slugs = new Set();
for (const a of articles) {
  if (slugs.has(a.slug)) throw new Error(`Repeated slug: ${a.slug}`);
  slugs.add(a.slug);
  for (const key of ['title', 'body', 'enTitle', 'enDescription', 'enBody', 'category']) {
    if (!a[key]?.trim()) throw new Error(`${a.slug}: missing ${key}`);
  }
  if (/文稿里|讲义里|他说|天纪|倪海厦|source-extract|证据卡/.test(a.body + a.enBody)) throw new Error(`Source trace: ${a.slug}`);
}
const source = articles.map((a, i) => `## ${i + 1}. ${a.title}\nslug: \`${a.slug}\`\n\n正文草稿：\n${a.body}\n\n英文标题：${a.enTitle}\n英文描述：${a.enDescription}\n英文正文：\n${a.enBody}`).join('\n\n---\n\n');
const queue = '| 序号 | 状态 | slug | 标题 | 分类 |\n| --- | --- | --- | --- | --- |\n' + articles.map((a, i) => `| ${i + 1} | 待发布 | ${a.slug} | ${a.title} | ${a.category} |`).join('\n') + '\n';
writeFileSync(path.join(dir, 'humanizer-20260907-source.md'), source + '\n');
const queuePath = path.join(dir, 'humanizer-20260907-queue.md');
if (existsSync(queuePath) && /https?:/.test(readFileSync(queuePath, 'utf8'))) throw new Error('Do not overwrite a queue that has published entries.');
writeFileSync(queuePath, queue);
console.log(JSON.stringify(articles.map(a => ({ slug: a.slug, chineseCharacters: (a.body.match(/[\u3400-\u9fff]/g) || []).length, englishWords: a.enBody.split(/\s+/).length })), null, 2));
