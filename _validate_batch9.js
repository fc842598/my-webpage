const fs = require('fs');
const path = require('path');

const slugs = [
  'ziwei-taifu-fenggao', 'ziwei-feilian-posui', 'ziwei-tianwu-tianyue',
  'ziwei-yinsha-xing', 'ziwei-tianshang-tianshi', 'ziwei-tianchu-xing',
  'ziwei-tianguan-tianfu', 'ziwei-tiancai-tianshou', 'ziwei-jiekong-xunkong',
  'ziwei-tiande-yuede'
];

let errors = [];

for (const slug of slugs) {
  const cnPath = path.join(__dirname, 'articles', `${slug}.html`);
  const enPath = path.join(__dirname, 'articles', 'en', `${slug}.html`);
  for (const [p, isEn] of [[cnPath, false], [enPath, true]]) {
    if (!fs.existsSync(p)) { errors.push(`MISSING: ${p}`); continue; }
    const html = fs.readFileSync(p, 'utf8');
    if (!html.includes('application/ld+json')) errors.push(`${slug} ${isEn?'EN':'CN'}: no JSON-LD`);
    if (!html.includes('hreflang')) errors.push(`${slug} ${isEn?'EN':'CN'}: no hreflang`);
    if (!html.includes(isEn ? 'hreflang="zh-CN"' : 'hreflang="en"')) errors.push(`${slug} ${isEn?'EN':'CN'}: missing alternate hreflang`);
    if (!html.includes('canonical')) errors.push(`${slug} ${isEn?'EN':'CN'}: no canonical`);
    if (!html.includes('datePublished')) errors.push(`${slug} ${isEn?'EN':'CN'}: no datePublished`);
    if (html.includes('XX')) errors.push(`${slug} ${isEn?'EN':'CN'}: contains placeholder XX`);
  }
}

const cnIndex = fs.readFileSync(path.join(__dirname, 'articles', 'index.html'), 'utf8');
const enIndex = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'index.html'), 'utf8');
const topic = fs.readFileSync(path.join(__dirname, 'articles', 'ziwei-helper-malice-stars.html'), 'utf8');
const cnFeed = fs.readFileSync(path.join(__dirname, 'feed.xml'), 'utf8');
const enFeed = fs.readFileSync(path.join(__dirname, 'articles', 'en', 'feed.xml'), 'utf8');
const cnSm = fs.readFileSync(path.join(__dirname, 'sitemap-articles.xml'), 'utf8');
const enSm = fs.readFileSync(path.join(__dirname, 'sitemap-en.xml'), 'utf8');

for (const slug of slugs) {
  if (!cnIndex.includes(`${slug}.html`)) errors.push(`CN index missing ${slug}`);
  if (!enIndex.includes(`${slug}.html`)) errors.push(`EN index missing ${slug}`);
  if (!topic.includes(`${slug}.html`)) errors.push(`Topic missing ${slug}`);
  if (!cnFeed.includes(`${slug}.html`)) errors.push(`CN feed missing ${slug}`);
  if (!enFeed.includes(`${slug}.html`)) errors.push(`EN feed missing ${slug}`);
  if (!cnSm.includes(`${slug}.html`)) errors.push(`CN sitemap missing ${slug}`);
  if (!enSm.includes(`${slug}.html`)) errors.push(`EN sitemap missing ${slug}`);
}

if (cnIndex.includes('XX')) errors.push('CN index contains XX');
if (enIndex.includes('XX')) errors.push('EN index contains XX');
if (topic.includes('XX')) errors.push('Topic contains XX');

const cnFeedCount = (cnFeed.match(/<item>/g) || []).length;
const enFeedCount = (enFeed.match(/<item>/g) || []).length;
if (cnFeedCount > 80) errors.push(`CN feed has ${cnFeedCount} items (>80)`);
if (enFeedCount > 80) errors.push(`EN feed has ${enFeedCount} items (>80)`);

if (errors.length === 0) {
  console.log('VALIDATION PASSED. All 10 articles, indexes, topic, feeds, sitemaps OK.');
  console.log(`CN feed: ${cnFeedCount} items, EN feed: ${enFeedCount} items`);
} else {
  console.log('VALIDATION FAILED:');
  errors.forEach(e => console.log('  - ' + e));
  process.exit(1);
}
