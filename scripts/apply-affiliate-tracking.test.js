const {test} = require('node:test');
const assert = require('node:assert/strict');
const {applyAffiliateTracking, normalizePanelOrigin} = require('./apply-affiliate-tracking');

const html = '<!doctype html><html><body><main>Guide</main></body></html>';

test('adds the tracking script before the closing body and is idempotent', () => {
  const integrated = applyAffiliateTracking(html, 'https://panel.example');
  assert.match(integrated, /<script defer src="https:\/\/panel\.example\/tracking\.js"><\/script>\n<!-- pokisky-affiliate-tracking:end -->\n<\/body>/);
  assert.equal(applyAffiliateTracking(integrated, 'https://panel.example'), integrated);
});

test('updates the managed script when the panel origin changes', () => {
  const previous = applyAffiliateTracking(html, 'https://old-panel.example');
  const updated = applyAffiliateTracking(previous, 'https://new-panel.example');
  assert.match(updated, /https:\/\/new-panel\.example\/tracking\.js/);
  assert.doesNotMatch(updated, /old-panel/);
});

test('normalizes valid panel origins and rejects non-HTTPS or path-bearing values', () => {
  assert.equal(normalizePanelOrigin('https://panel.example/'), 'https://panel.example');
  assert.throws(() => normalizePanelOrigin('http://panel.example'), /HTTPS origin/);
  assert.throws(() => normalizePanelOrigin('https://panel.example/path'), /HTTPS origin/);
});

test('rejects HTML without a closing body tag', () => {
  assert.throws(() => applyAffiliateTracking('<html><head></head></html>', 'https://panel.example'), /closing body tag/);
});
