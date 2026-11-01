/** Keep contextual recommendations in the reader's language and topic. */
function sourceIds(article) {
  return [...(article.sourceProductIds || []), ...(article.sourceProductId == null ? [] : [article.sourceProductId])];
}

function relatedGuides(article, guides, {hubFor, localeOf}, limit = 3) {
  const language = localeOf(article).split('-')[0];
  const siblings = guides.filter(item => hubFor(item) === hubFor(article) && localeOf(item).split('-')[0] === language)
    .sort((a, b) => a.reviewUrl.localeCompare(b.reviewUrl, 'en'));
  const start = siblings.indexOf(article);
  // Rotate equally relevant neighbours rather than sending every page to the
  // first few catalog records. Keep the ordering deterministic between builds.
  const distance = item => (siblings.indexOf(item) - start + siblings.length) % siblings.length;
  const comparedIds = new Set(guides.filter(item => sourceIds(item).includes(article.id)).flatMap(sourceIds));
  const direct = item => sourceIds(article).includes(item.id) || sourceIds(item).includes(article.id);
  const score = item => (direct(item) ? 100 : 0)
    + (comparedIds.has(item.id) ? 50 : 0)
    + (item.topic === article.topic && item.subtopic === article.subtopic ? 20 : 0)
    + (item.topic === article.topic ? 5 : 0);
  // A shared directory alone does not make two guides useful alternatives.
  // When no contextual match exists, the page links to its topic directory.
  return siblings.filter(item => item !== article && (direct(item) || comparedIds.has(item.id) || item.subtopic === article.subtopic))
    .sort((a, b) => score(b) - score(a) || distance(a) - distance(b)).slice(0, limit);
}

module.exports = {relatedGuides, sourceIds};
