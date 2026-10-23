import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const observers = [];
const storage = new Map();
const document = {
  cookie: '', visibilityState: 'visible',
  head: { appendChild() {} }, createElement: () => ({}), addEventListener() {},
};
const context = {
  document, URL, URLSearchParams, Date, console: { debug() {} },
  location: { hostname: 'localhost', pathname: '/pages/wentian-app.html', search: '?ga_debug=1' },
  localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
  crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000001' },
  IntersectionObserver: class {
    targets = [];
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.targets.push(target); }
    disconnect() { this.disconnected = true; }
    show(target, ratio = 1) {
      this.callback([{ target, isIntersecting: ratio > 0, intersectionRatio: ratio }]);
    }
  },
};
context.window = context;
vm.runInNewContext(readFileSync(new URL('../js/site-analytics.js', import.meta.url), 'utf8'), context);
const events = () => context.dataLayer.filter(item => item[0] === 'event').map(item => [item[1], item[2]]);
const count = name => events().filter(item => item[0] === name).length;
const entry = { isConnected: true };
const chat = { isConnected: true };
const options = { entry, chat, surface: 'wentian_mobile', chartKey: 'private-chart-1' };

context.yuetianObserveXuFunnel({});
assert.equal(observers.length, 0, 'No chart must not start funnel tracking');
context.yuetianObserveXuFunnel(options);
let observer = observers.at(-1);
observer.show(entry, 0);
observer.show(entry, 0.49);
assert.equal(count('xu_entry_view'), 0, 'Offscreen or mostly hidden buttons are not exposures');
observer.show(entry, 0.5);
observer.show(entry);
assert.equal(count('xu_entry_view'), 1, 'Repeated visibility callbacks count once');
context.yuetianObserveXuFunnel(options);
observer.show(chat);
assert.equal(count('xu_chat_enter'), 0, 'Stale observer cannot report entry after navigation');
observers.at(-1).show(entry);
assert.equal(count('xu_entry_view'), 1, 'Rerenders of the same chart do not inflate exposure');

context.yuetianTrackXuClick('wentian_mobile');
assert.equal(count('xu_entry_click'), 1);
context.yuetianObserveXuFunnel({ ...options, entry: null });
observer = observers.at(-1);
observer.show(chat, 0);
assert.equal(count('xu_chat_enter'), 0, 'A click alone must not count as entering chat');
observer.show(chat, 0.1);
observer.show(chat);
assert.equal(count('xu_chat_enter'), 1);
assert.equal(events().at(-1)[1].entry_location, 'chart_below', 'Attribute successful entry to the chart button');

context.yuetianObserveXuFunnel({ ...options, chartKey: 'private-chart-2' });
observer = observers.at(-1);
document.visibilityState = 'hidden';
observer.show(entry);
assert.equal(count('xu_entry_view'), 1, 'Background tabs do not count as viewed');
document.visibilityState = 'visible';
observer.show(entry);
observer.show(chat);
assert.equal(count('xu_entry_view'), 2, 'A new chart can record a new exposure');
assert.equal(events().at(-1)[1].entry_location, 'other', 'Previous chart clicks cannot attribute another chart');
assert.ok(!JSON.stringify(events()).includes('private-chart'), 'Chart identifiers stay out of GA4');

context.yuetianObserveXuFunnel({});
assert.ok(observers.at(-1).disconnected, 'Observers are disconnected when leaving the flow');
observer.show(chat);
assert.equal(count('xu_chat_enter'), 2);
context.IntersectionObserver = undefined;
assert.doesNotThrow(() => context.yuetianObserveXuFunnel(options), 'Analytics capability must not block the product');
console.log('PASS: Xu funnel visibility, click, entry, deduplication, navigation, and privacy checks');
