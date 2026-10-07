/** Enhance the static guide library without replacing its crawlable content. */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('blog-grid');
  const cards = grid ? [...grid.querySelectorAll('.blog-post')] : [];
  const buttons = [...document.querySelectorAll('.topic-filter-btn')];
  const count = document.getElementById('guide-count');
  const empty = document.getElementById('catalog-empty');
  const filters = document.querySelector('.topic-filters');
  if (filters && cards.length) filters.hidden = false;

  function matches(card, filter) {
    const {topic, locale, market, network} = card.dataset;
    if (filter === 'all') return true;
    if (filter === 'business') return topic === 'business' || topic === 'education';
    if (filter === 'europe') return market === 'Europe' && locale === 'en-GB';
    if (filter === 'digistore24') return network === 'digistore24';
    return topic === filter;
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    buttons.forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    let visible = 0;
    cards.forEach(card => {
      card.hidden = !matches(card, filter);
      if (!card.hidden) visible++;
    });
    if (count) count.textContent = visible + (visible === 1 ? ' guide' : ' guides');
    if (empty) empty.hidden = visible > 0;
  }));
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
});
