const {test} = require('node:test');
const assert = require('node:assert/strict');
const {changedUrls} = require('./submit-indexnow');

test('initial publication sends all current pages', () => {
  assert.deepEqual(changedUrls({a: 'one', b: 'two'}, {}), ['a', 'b']);
});
test('subsequent publications send only new or changed pages', () => {
  assert.deepEqual(changedUrls({a: 'one', b: 'new', c: 'three'}, {a: 'one', b: 'old', removed: 'old'}), ['b', 'c']);
});
test('identical published content sends no repeated notifications', () => {
  assert.deepEqual(changedUrls({a: 'one'}, {a: 'one'}), []);
});
