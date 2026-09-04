const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const enDir = path.join(articlesDir, 'en');

// Get all CN article slugs
const cnFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html') && f !== 'index.html');
const results = [];

for (const file of cnFiles) {
  const slug = file.replace('.html', '');
  const cnPath = path.join(articlesDir, file);
  const enPath = path.join(enDir, file);
  const cnHtml = fs.readFileSync(cnPath, 'utf8');
  const enExists = fs.existsSync(enPath);
  const enHtml = enExists ? fs.readFileSync(enPath, 'utf8') : '';

  // Extract article content (between article tags)
  const cnArticleMatch = cnHtml.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  const cnArticle = cnArticleMatch ? cnArticleMatch[1] : '';
  // Strip HTML tags to get text
  const cnText = cnArticle.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const cnWordCount = cnText.length;

  // Count h2 sections
  const h2Count = (cnArticle.match(/<h2/g) || []).length;
  // Count ordered lists
  const olCount = (cnArticle.match(/<ol>/g) || []).length;
  // Count paragraphs
  const pCount = (cnArticle.match(/<p>/g) || []).length;
  // Count sidebar links
  const sidebarMatch = cnHtml.match(/<aside[^>]*class="[^"]*detail-rail[^"]*"[^>]*>([\s\S]*?)<\/aside>/);
  const sidebarLinks = sidebarMatch ? (sidebarMatch[1].match(/<a /g) || []).length : 0;

  // Technical checks
  const checks = {
    jsonLd: cnHtml.includes('"@type": "Article"'),
    breadcrumbList: cnHtml.includes('BreadcrumbList'),
    hreflangZh: cnHtml.includes('hreflang="zh-CN"'),
    hreflangEn: cnHtml.includes('hreflang="en"'),
    canonical: cnHtml.includes('rel="canonical"'),
    breadcrumb: cnHtml.includes('class="breadcrumb"'),
    bottomCta: cnHtml.includes('article-bottom-link'),
    analytics: cnHtml.includes('site-analytics.js'),
    ogImage: cnHtml.includes('triad-tian-bg.webp'),
    favicon: cnHtml.includes('wentian-brand-logo'),
    css: cnHtml.includes('articles.css'),
    datePublished: cnHtml.includes('datePublished'),
    noXX: !cnHtml.includes('data-index="XX"'),
    noPlaceholder: !cnHtml.includes('Lorem ipsum') && !cnHtml.includes('TODO') && !cnHtml.includes('undefined'),
    hasLead: cnHtml.includes('article-lead'),
    enVersion: enExists
  };

  // EN content length
  let enWordCount = 0;
  let enH2Count = 0;
  if (enExists) {
    const enArticleMatch = enHtml.match(/<article[^>]*>([\s\S]*?)<\/article>/);
    const enArticle = enArticleMatch ? enArticleMatch[1] : '';
    const enText = enArticle.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    enWordCount = enText.length;
    enH2Count = (enArticle.match(/<h2/g) || []).length;
  }

  // Check for very short paragraphs (less than 10 chars)
  const paragraphs = cnArticle.split(/<\/p>/).map(p => p.replace(/<[^>]+>/g, '').trim()).filter(p => p.length > 0);
  const shortParagraphs = paragraphs.filter(p => p.length < 15).length;

  // Check for duplicate sentences (first sentence repeated)
  const sentences = cnText.split(/[。！？]/).filter(s => s.trim().length > 10);
  const uniqueSentences = new Set(sentences.map(s => s.trim()));
  const duplicateRatio = sentences.length > 0 ? 1 - uniqueSentences.size / sentences.length : 0;

  // Check title length
  const titleMatch = cnHtml.match(/<h1[^>]*>(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : '';

  // Check date
  const dateMatch = cnHtml.match(/datetime="([^"]+)"/);
  const date = dateMatch ? dateMatch[1] : '';

  // Calculate scores
  // 1. Content length score (0-30): <500 chars=0, 500-1000=10, 1000-2000=20, 2000-3000=25, >3000=30
  let lengthScore = 0;
  if (cnWordCount >= 3000) lengthScore = 30;
  else if (cnWordCount >= 2000) lengthScore = 25;
  else if (cnWordCount >= 1000) lengthScore = 20;
  else if (cnWordCount >= 500) lengthScore = 10;
  else lengthScore = 0;

  // 2. Structure score (0-20): h2>=4=10, ol>=1=5, sidebar>=5=5
  let structureScore = 0;
  if (h2Count >= 4) structureScore += 10;
  else if (h2Count >= 2) structureScore += 5;
  if (olCount >= 1) structureScore += 5;
  if (sidebarLinks >= 5) structureScore += 5;
  else if (sidebarLinks >= 3) structureScore += 3;

  // 3. Technical score (0-25): each check ~1.8 points
  const checkKeys = Object.keys(checks);
  const passedChecks = checkKeys.filter(k => checks[k]).length;
  const techScore = Math.round((passedChecks / checkKeys.length) * 25);

  // 4. EN parity score (0-15): exists=5, enWordCount>=cnWordCount*0.6=5, enH2Count>=h2Count=5
  let enScore = 0;
  if (enExists) {
    enScore += 5;
    if (enWordCount >= cnWordCount * 0.6) enScore += 5;
    if (enH2Count >= h2Count) enScore += 5;
    else if (enH2Count >= h2Count - 1) enScore += 3;
  }

  // 5. Quality signals (0-10): no short paragraphs=5, no duplicates=5
  let qualityScore = 10;
  if (shortParagraphs > 2) qualityScore -= 3;
  if (duplicateRatio > 0.1) qualityScore -= 5;
  if (cnWordCount < 800) qualityScore -= 5;

  const totalScore = lengthScore + structureScore + techScore + enScore + Math.max(0, qualityScore);

  results.push({
    slug,
    title,
    date: date.substring(0, 10),
    cnWordCount,
    enWordCount,
    h2Count,
    olCount,
    pCount,
    sidebarLinks,
    shortParagraphs,
    duplicateRatio: Math.round(duplicateRatio * 100) / 100,
    checks,
    scores: { lengthScore, structureScore, techScore, enScore, qualityScore: Math.max(0, qualityScore), totalScore }
  });
}

// Sort by total score ascending (worst first)
results.sort((a, b) => a.scores.totalScore - b.scores.totalScore);

// Output bottom 30
console.log('=== BOTTOM 30 ARTICLES BY SCORE ===\n');
for (let i = 0; i < Math.min(30, results.length); i++) {
  const r = results[i];
  console.log(`#${i+1} [${r.scores.totalScore}/100] ${r.slug}`);
  console.log(`   Title: ${r.title}`);
  console.log(`   Date: ${r.date} | CN chars: ${r.cnWordCount} | EN chars: ${r.enWordCount} | H2: ${r.h2Count} | OL: ${r.olCount} | Sidebar: ${r.sidebarLinks}`);
  console.log(`   Scores: length=${r.scores.lengthScore} struct=${r.scores.structureScore} tech=${r.scores.techScore} en=${r.scores.enScore} quality=${r.scores.qualityScore}`);
  const failedChecks = Object.entries(r.checks).filter(([k,v]) => !v).map(([k]) => k);
  if (failedChecks.length > 0) console.log(`   Failed: ${failedChecks.join(', ')}`);
  console.log('');
}

// Stats
const totalArticles = results.length;
const avgScore = Math.round(results.reduce((s,r) => s + r.scores.totalScore, 0) / totalArticles);
const noEn = results.filter(r => !r.checks.enVersion).length;
const shortContent = results.filter(r => r.cnWordCount < 1000).length;
console.log(`=== STATS ===`);
console.log(`Total CN articles: ${totalArticles}`);
console.log(`Average score: ${avgScore}/100`);
console.log(`Articles without EN version: ${noEn}`);
console.log(`Articles with <1000 chars: ${shortContent}`);
console.log(`Score distribution: <50: ${results.filter(r=>r.scores.totalScore<50).length}, 50-69: ${results.filter(r=>r.scores.totalScore>=50&&r.scores.totalScore<70).length}, 70-89: ${results.filter(r=>r.scores.totalScore>=70&&r.scores.totalScore<90).length}, 90+: ${results.filter(r=>r.scores.totalScore>=90).length}`);
