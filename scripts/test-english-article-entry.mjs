import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../pages/mingbook-onepage.html', import.meta.url), 'utf8');
const redirectScript = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
function redirect(referrer, search = '?source=article&article=test-guide&journey_id=test-journey') {
  let target;
  const location = {origin:'https://yuetianai.com',search,replace:value=>{target=value;}};
  vm.runInNewContext(redirectScript, {URL,URLSearchParams,document:{referrer},navigator:{userAgent:'Mobile'},window:{location}});
  return new URL(target,location.origin);
}
let result=redirect('https://yuetianai.com/articles/en/test-guide.html');
assert.equal(result.searchParams.get('lang'),'en');
assert.equal(result.pathname,'/pages/wentian-app.html');
assert.equal(result.hash,'#screen-26');
assert.equal(result.searchParams.get('article'),'test-guide');
assert.equal(result.searchParams.get('journey_id'),'test-journey');
assert.equal(redirect('https://yuetianai.com/articles/en/test.html','?language=zh-Hant&entry=member').searchParams.get('lang'),null);
assert.equal(redirect('https://yuetianai.com/articles/en/test.html','?entry=member').hash,'#screen-33');
for(const ref of ['', 'not a URL', 'https://other.example/articles/en/test.html', 'https://yuetianai.com/articles/test.html']) {
  assert.equal(redirect(ref).searchParams.get('lang'),null);
}
const analytics=readFileSync(new URL('../js/site-analytics.js',import.meta.url),'utf8');
assert.match(analytics,/target\.origin !== window\.location\.origin/);
assert.match(analytics,/target\.searchParams\.set\("lang", "en"\)/);
console.log('PASS fresh English article entry retains language and attribution without overriding explicit preferences');
