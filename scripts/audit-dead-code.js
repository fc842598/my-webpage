'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const SOURCE_EXTENSIONS = new Set(['.html', '.js', '.jsx', '.css']);
const ASSET_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);
const SOURCE_CANDIDATE_EXTENSIONS = new Set(['.js', '.jsx', '.css']);
const SOURCE_CANDIDATE_PREFIXES = [
  'css/',
  'js/',
  'pages/',
];
const EXCLUDED_PREFIXES = [
  '.codex/',
  '.codex-worktrees/',
  '.git/',
  'node_modules/',
  'output/',
  'tmp/',
  'vendor/',
];
const DYNAMIC_ASSET_PATTERNS = [
  /^images\/yijing-hexagrams\/\d{2}\.webp$/,
];

function toPosix(filePath) {
  return filePath.replace(/\\/g, '/');
}

function isExcluded(filePath) {
  const normalized = toPosix(filePath);
  return EXCLUDED_PREFIXES.some(prefix => normalized.startsWith(prefix));
}

function listTrackedFiles() {
  return execFileSync('git', ['ls-files'], { cwd: rootDir, encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean)
    .map(toPosix);
}

function getFileSize(filePath) {
  return fs.statSync(path.join(rootDir, filePath)).size;
}

function readText(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), 'utf8');
}

function isDynamicallyReferenced(filePath) {
  return DYNAMIC_ASSET_PATTERNS.some(pattern => pattern.test(filePath));
}

function hasTextReference(corpus, filePath) {
  const basename = path.posix.basename(filePath);
  return corpus.includes(filePath) || corpus.includes(basename);
}

function hasIncomingTextReference(corpusByFile, filePath) {
  const basename = path.posix.basename(filePath);
  const pathVariants = [
    filePath,
    `./${filePath}`,
    `../${filePath}`,
    basename,
  ];

  return corpusByFile.some(({ path: sourcePath, text }) => {
    if (sourcePath === filePath) return false;
    return pathVariants.some(variant => text.includes(variant));
  });
}

function main() {
  const tracked = listTrackedFiles()
    .filter(filePath => !isExcluded(filePath))
    .filter(filePath => fs.existsSync(path.join(rootDir, filePath)));
  const sourceFiles = tracked.filter(filePath => SOURCE_EXTENSIONS.has(path.extname(filePath).toLowerCase()));
  const assetFiles = tracked.filter(filePath => ASSET_EXTENSIONS.has(path.extname(filePath).toLowerCase()));
  const sourceCorpus = sourceFiles
    .map(filePath => readText(filePath))
    .join('\n');
  const corpusByFile = sourceFiles.map(filePath => ({
    path: filePath,
    text: readText(filePath),
  }));

  const largestFiles = tracked
    .map(filePath => ({
      path: filePath,
      kb: Number((getFileSize(filePath) / 1024).toFixed(1)),
    }))
    .sort((a, b) => b.kb - a.kb)
    .slice(0, 30);

  const unreferencedAssets = assetFiles
    .filter(filePath => !isDynamicallyReferenced(filePath))
    .filter(filePath => !hasTextReference(sourceCorpus, filePath))
    .map(filePath => ({
      path: filePath,
      kb: Number((getFileSize(filePath) / 1024).toFixed(1)),
    }))
    .sort((a, b) => b.kb - a.kb);

  const rootArtifacts = tracked
    .filter(filePath => !filePath.includes('/'))
    .filter(filePath => /^(output-|build_|go-|.*screen|qc$|OpenClawGateway\.cmd$|codex_elev_test\.bat$)/.test(filePath))
    .map(filePath => ({
      path: filePath,
      kb: Number((getFileSize(filePath) / 1024).toFixed(1)),
    }))
    .sort((a, b) => b.kb - a.kb);

  const unreferencedSourceFiles = tracked
    .filter(filePath => SOURCE_CANDIDATE_PREFIXES.some(prefix => filePath.startsWith(prefix)))
    .filter(filePath => SOURCE_CANDIDATE_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
    .filter(filePath => !hasIncomingTextReference(corpusByFile, filePath))
    .map(filePath => ({
      path: filePath,
      kb: Number((getFileSize(filePath) / 1024).toFixed(1)),
    }))
    .sort((a, b) => b.kb - a.kb);

  console.log(JSON.stringify({
    generatedAt: new Date().toISOString(),
    largestFiles,
    rootArtifacts,
    unreferencedAssets,
    unreferencedSourceFiles,
    notes: [
      'Review candidates before deletion.',
      'Dynamic assets are excluded from unreferencedAssets by explicit allowlist.',
      'unreferencedSourceFiles excludes HTML route entries and checks text references only.',
    ],
  }, null, 2));
}

main();
