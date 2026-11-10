import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('js/wentian-app.js', 'utf8');
const context = vm.createContext({});
for (const name of ['splitWentianLongSentence', 'splitWentianReplyParagraphs']) {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf('\nfunction ', start + 1);
  assert(start >= 0 && end > start, name);
  vm.runInContext(source.slice(start, end), context);
}
const first = 'Life Palace: compare the major stars, their actual transformations, and the related palaces before discussing practical choices. A long English sentence should wrap naturally on screen, not acquire a paragraph break at every comma.';
const second = 'Career Palace: distinguish chart observations from practical suggestions, then explain the current timing layer in ordinary English.';
const paragraphText = `${first}\n\n${second}`;
assert.deepEqual(Array.from(context.splitWentianReplyParagraphs(paragraphText)), [first, second]);
assert.deepEqual(Array.from(context.splitWentianReplyParagraphs(first)), [first]);
const glossary = 'The Life Palace (命宫) is a chart location, not a factual personality diagnosis, and the whole arrangement should be read before drawing a conclusion.';
assert.deepEqual(Array.from(context.splitWentianReplyParagraphs(glossary)), [glossary]);
const chinese = '请先看命宫，再看财帛宫与事业宫。接着对照本命、大限和流年的不同层次，不要混在一起。';
assert(context.splitWentianReplyParagraphs(chinese).length > 1, 'keep existing Chinese sentence grouping');
assert.deepEqual(Array.from(context.splitWentianReplyParagraphs('')), ['']);
console.log('CHAT_ENGLISH_PARAGRAPHS_OK: preserve English blocks, glossary, punctuation; retain Chinese grouping');
