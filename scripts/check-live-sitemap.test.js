const {test} = require('node:test');
const assert = require('node:assert/strict');
const {inspectPage, indexingBlocked} = require('./check-live-sitemap');
const url = 'https://blog-travel-eight.vercel.app/example';
const html = `<html><head><title>Example guide</title><link rel="canonical" href="${url}"></head><body><main><h1>Example</h1><p>Static buying information.</p></main></body></html>`;
const headers = extra => new Headers({'content-type': 'text/html; charset=utf-8', ...extra});

test('detects a technically eligible response without treating it as indexed', () => {
  assert.deepEqual(inspectPage(html, headers(), url), []);
  assert.equal(indexingBlocked('index, follow'), false);
});
test('recognises header restrictions and engine-specific meta restrictions', () => {
  assert.ok(inspectPage(html, headers({'x-robots-tag': 'googlebot: noindex'}), url).includes('X-Robots-Tag blocks indexing'));
  for (const name of ['robots', 'Googlebot', 'bingbot']) {
    const blocked = html.replace('</head>', `<meta name="${name}" content="none"></head>`);
    assert.ok(inspectPage(blocked, headers(), url).includes('Meta robots blocks indexing'));
  }
});
test('rejects conflicting canonical URLs and HTTP 200 error-like empty shells', () => {
  assert.ok(inspectPage(html.replace(url, url + '-other'), headers(), url).includes('Canonical differs from sitemap URL'));
  assert.ok(inspectPage('<title>Error</title>', headers(), url).includes('Missing static main content'));
  assert.ok(inspectPage(html, headers({'content-type': 'application/json'}), url).includes('Not HTML'));
});
