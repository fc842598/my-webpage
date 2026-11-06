// Local-only component fixture: actual chat renderer/scroll handlers, synthetic
// long text, no accounts, storage access, API requests, or quota consumption.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'js/wentian-app.js'), 'utf8');
const names = [
  'escapeHtml', 'renderWentianSafeInlineMarkdown', 'splitWentianLongSentence',
  'splitWentianReplyParagraphs', 'renderWentianChatMessageContent',
  'isWentianChatNearBottom', 'updateWentianChatScrollButton',
  'syncWentianChatScrollState', 'scrollWentianChatToBottom',
  'bindWentianChatScrollBox', 'renderWentianMessages',
];
const functions = names.map(name => {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf('\nfunction ', start + 1);
  if (start < 0 || end < 0) throw new Error(`Missing production function: ${name}`);
  return source.slice(start, end);
}).join('\n');
const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Local synthetic chat scrolling QA</title>
<link rel="stylesheet" href="/css/wentian-app.css">
<style>
body{margin:0;background:#fbf7ef;overflow:auto}
.qa-shell{position:relative;width:min(390px,100%);height:700px;margin:0 auto}
#wentian-chat-messages{top:90px;left:4%;width:92%;height:450px}
.qa-controls{position:absolute;top:560px;left:16px;right:16px;display:flex;gap:12px}
.qa-controls button{padding:12px;font:inherit}
</style>
<main class="qa-shell"><h1 style="font-size:18px">合成长回答滚动测试（非模型回答）</h1>
<div id="wentian-chat-messages" class="wentian-chat-log" tabindex="0" role="log" aria-label="测试对话，可上下滚动"></div>
<div class="qa-controls"><button id="qa-append">追加测试段落</button>
<button id="wentian-chat-scroll-bottom">回到底部</button></div></main>
<script>
const wentianXuChat={messages:[],autoScroll:true,userPinned:false};
function isWentianEnglishMode(){return false}
function getWentianChatUserAvatarText(){return '测'}
${functions}
const paragraph='这是合成的长回答测试内容，不代表真实命盘或模型结论。请向上滚动检查前文，再追加段落，页面应保留阅读位置而不是跳回底部。';
wentianXuChat.messages=[{role:'assistant',text:Array.from({length:24},(_,i)=>'第'+(i+1)+'段：'+paragraph).join('\\n')}];
renderWentianMessages({forceScroll:true});
document.getElementById('qa-append').addEventListener('click',()=>{
  wentianXuChat.messages[0].text+='\\n追加段落：'+paragraph;
  renderWentianMessages();
});
document.getElementById('wentian-chat-scroll-bottom').addEventListener('click',()=>scrollWentianChatToBottom(true));
</script></html>`;
const assets = new Map([
  ['/css/wentian-app.css', ['css/wentian-app.css', 'text/css']],
  ['/images/wentian-prototype-assets/xu-dashi.webp', ['images/wentian-prototype-assets/xu-dashi.webp', 'image/webp']],
]);
const port = Number(process.argv[2] || 8772);
http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const asset = assets.get(pathname);
  if (asset) {
    res.writeHead(200, {'Content-Type': asset[1], 'Cache-Control': 'no-store'});
    res.end(fs.readFileSync(path.join(root, asset[0])));
    return;
  }
  if (pathname !== '/') { res.writeHead(404); res.end(); return; }
  res.writeHead(200, {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store'});
  res.end(html);
}).listen(port, '127.0.0.1', () => console.log(`Synthetic chat QA: http://127.0.0.1:${port}/`));
