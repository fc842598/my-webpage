const fs = require('fs');
const { execFileSync } = require('child_process');
const os = require('os');
const path = require('path');

function uploadFile(repoPath, localPath, message) {
  const content = fs.readFileSync(localPath).toString('base64');
  let sha = '';
  try {
    const res = execFileSync('gh', ['api', `repos/fc842598/my-webpage/contents/${repoPath}`, '--jq', '.sha'], { encoding: 'utf8', timeout: 15000 });
    sha = res.trim();
  } catch(e) {}

  const tmp = path.join(os.tmpdir(), 'gh_upload_body.json');
  const body = { message, content };
  if (sha) body.sha = sha;
  fs.writeFileSync(tmp, JSON.stringify(body));

  execFileSync('gh', ['api', `repos/fc842598/my-webpage/contents/${repoPath}`, '-X', 'PUT', '--input', tmp], { encoding: 'utf8' });
  console.log(`✓ ${repoPath}`);
}

uploadFile('pages/chart.html', 'pages/chart.html', 'feat: SVG sanyao lines + default test values');
uploadFile('css/chart.css',    'css/chart.css',    'feat: palace-grid position relative for SVG overlay');

console.log('All done!');
