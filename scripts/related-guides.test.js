const {test} = require('node:test');
const assert = require('node:assert/strict');
const {relatedGuides} = require('./related-guides');
const context = {hubFor: item => item.hub, localeOf: item => item.locale};
const guide = (id, extra = {}) => ({id, reviewUrl: `${id}.html`, hub: 'wellness', topic: 'wellness', subtopic: 'nutrition', locale: 'en-GB', ...extra});

test('recommendations keep language and hub, even when a different-language guide shares the subtopic', () => {
  const a = guide(1), b = guide(2, {locale: 'en-US'}), de = guide(3, {locale: 'de-DE'}), other = guide(4, {hub: 'courses'});
  assert.deepEqual(relatedGuides(a, [a, de, other, b], context), [b]);
});

test('product comparisons and editorial source guides link in both directions ahead of generic neighbours', () => {
  const a = guide(1), b = guide(2), comparison = guide(3, {sourceProductIds: [1, 2]}), editorial = guide(4, {sourceProductId: 1});
  const all = [a, b, comparison, editorial];
  assert.deepEqual(new Set(relatedGuides(a, all, context, 2)), new Set([comparison, editorial]));
  assert.deepEqual(new Set(relatedGuides(comparison, all, context, 2)), new Set([a, b]));
});

test('equally relevant guides form a deterministic cycle so later catalog entries also receive links', () => {
  const all = [1, 2, 3, 4, 5].map(id => guide(id));
  const targets = all.map(item => relatedGuides(item, all, context, 1)[0].id);
  assert.deepEqual(targets, [2, 3, 4, 5, 1]);
  assert.deepEqual(all.map(item => relatedGuides(item, [...all].reverse(), context, 1)[0].id), targets);
});

test('a published comparison connects its two products even when their subtopics differ', () => {
  const a = guide(1), generic = guide(2), b = guide(3, {subtopic: 'joint-health'}), comparison = guide(4, {sourceProductIds: [1, 3], subtopic: 'joint-health'});
  assert.deepEqual(relatedGuides(a, [a, generic, b, comparison], context, 2), [comparison, b]);
});

test('a broad directory does not create unrelated recommendations just to fill three slots', () => {
  const a = guide(1, {hub: 'courses', topic: 'education', subtopic: 'fitness-learning'});
  const b = guide(2, {hub: 'courses', topic: 'education', subtopic: 'pet-learning'});
  assert.deepEqual(relatedGuides(a, [a, b], context), []);
});
