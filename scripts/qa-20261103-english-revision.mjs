import { readFileSync } from 'node:fs';

// Existing-page editorial correction only; do not add a new daily article.
const file = 'articles/en/ziwei-banlv-caiyun-fuqi-caibo.html';
const html = readFileSync(file, 'utf8');
const schema = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => JSON.parse(match[1])).find(item => item['@type'] === 'Article');
export const modified = '2026-11-03T21:20:00+08:00';
export const revisions = [{
  file,
  title: schema.headline,
  description: schema.description,
  body: `
<p>Money disagreements are often about different habits, not a lack of affection. In Zi Wei Dou Shu, read the Spouse Palace for relationship patterns, the Wealth Palace for income habits, and the Property Palace for how resources are kept. None of these can tell you a partner's actual income, debt, or account balance.</p>
<h2>Start With Financial Habits, Not Labels</h2>
<p>Wu Qu or Tian Fu in the Spouse Palace can be used as a prompt to discuss planning and responsibility. Tan Lang or Po Jun can raise questions about experimentation, spending, and appetite for change. Tai Yin may point the discussion toward security and saving; Tian Tong toward comfort and convenience; Zi Wei toward who makes the decisions. These are traditional reading themes, not proof of someone's behavior.</p>
<p>Hua Lu, often translated as an opportunity or resource theme, is not a guarantee of wealth. Hua Ji highlights friction or a recurring concern; it does not mean a partner is jealous, dishonest, or destined to have money trouble. Check the full chart and compare any interpretation with what the couple actually does.</p>
<h2>Four Patterns Worth Discussing</h2>
<ul>
<li><strong>Complementary habits:</strong> one person focuses on earning while the other tracks bills and savings. Agree on responsibilities so that neither person carries all the work.</li>
<li><strong>Similar habits:</strong> both enjoy spending or both avoid financial decisions. A shared routine can cover the tasks neither naturally takes on.</li>
<li><strong>Different priorities:</strong> one wants to try something new while the other values a larger safety buffer. Discuss limits and consent before making commitments.</li>
<li><strong>Separate management:</strong> each person manages personal spending, with a clear agreement about shared bills and access to essential information.</li>
</ul>
<h2>Separate Income From Keeping Money</h2>
<p>For example, a chart with Hua Lu in the Wealth Palace and Hua Ji in the Property Palace might be read as a contrast between bringing resources in and keeping them. In real life, test that idea against household costs, debt, irregular income, and spending records. Do not assume that a property purchase or a particular investment is right because of a chart.</p>
<p>Another example is a relationship in which one partner likes quick decisions and the other wants time to compare options. The useful question is not which person has the better chart. It is what decision process lets both people give informed consent.</p>
<h2>Turn the Reading Into a Conversation</h2>
<p>Discuss income, existing obligations, and spending expectations openly. Decide how shared expenses will be handled, what stays personal, and which commitments need both partners' agreement. A joint account is one possible arrangement, not a requirement for every couple. Willingness to spend is not a measure of love.</p>
<p>Use actual statements and agreements to check the story. For investment, credit, tax, or legal decisions, rely on qualified professionals and official product information. A favorable annual chart is not permission to take more financial risk.</p>
<h2>Reading Order</h2>
<ol>
<li>Locate the natal Spouse, Wealth, and Property Palaces and their main stars.</li>
<li>Read their connected and opposite palaces rather than treating one box as a verdict.</li>
<li>Check the natal Four Transformations for the broader pattern.</li>
<li>Compare the current ten-year cycle and annual cycle without treating timing as a guarantee.</li>
<li>Finish by comparing the interpretation with the couple's real habits, responsibilities, and agreed next steps.</li>
</ol>`,
}];
