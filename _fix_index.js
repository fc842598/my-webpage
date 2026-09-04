const fs = require('fs');
function renum(p) {
  let h = fs.readFileSync(p, 'utf8');
  let n = 0;
  h = h.replace(/data-index="(XX|\d+)"/g, () => { n++; return 'data-index="' + String(n).padStart(2, '0') + '"'; });
  fs.writeFileSync(p, h.replace(/\r\n/g, '\n'), 'utf8');
  console.log(p + ': ' + n + ' cards');
}
renum('articles/index.html');
renum('articles/en/index.html');
renum('articles/ziwei-helper-malice-stars.html');
