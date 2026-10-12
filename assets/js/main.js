/** Enhance the crawlable library; search never transmits the visitor's query. */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('blog-grid');
  const cards = grid ? [...grid.querySelectorAll('.blog-post')] : [];
  const buttons = [...document.querySelectorAll('.topic-filter-btn')];
  const count = document.getElementById('guide-count');
  const empty = document.getElementById('catalog-empty');
  const filters = document.querySelector('.topic-filters');
  const search = document.getElementById('guide-search');
  const language = document.getElementById('guide-language');
  const tools = document.getElementById('catalog-search-tools');
  const reset = document.getElementById('catalog-reset');
  if (filters && cards.length) filters.hidden = false;
  if (tools && cards.length) tools.hidden = false;
  let selected = 'all';
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const searchable = cards.map(card => normalize(card.textContent || ''));
  function matches(card, filter) {
    const {topic, locale, europe, network} = card.dataset;
    if (filter === 'all') return true;
    if (filter === 'business') return topic === 'business' || topic === 'education';
    if (filter === 'europe') return europe === 'true' && locale.startsWith('en');
    if (filter === 'german') return locale.startsWith('de');
    if (filter === 'uk') return /united kingdom|\buk\b|ireland/i.test(card.dataset.market || '');
    if (filter === 'us') return /united states|\bus\b/i.test(card.dataset.market || '');
    return topic === filter;
  }
  function apply() {
    const words = normalize(search ? search.value : '').trim().split(/\s+/).filter(Boolean);
    const lang = language ? language.value : 'all';
    let visible = 0;
    cards.forEach((card,index) => {
      card.hidden = !matches(card,selected) || (lang !== 'all' && !card.dataset.locale.startsWith(lang)) || !words.every(word=>searchable[index].includes(word));
      if (!card.hidden) visible++;
    });
    buttons.forEach(button=>{
      const active = button.dataset.filter === selected;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    if (count) count.textContent = visible + (visible === 1 ? ' guide' : ' guides');
    if (empty) empty.hidden = visible > 0;
  }
  buttons.forEach(button => button.addEventListener('click', () => {selected=button.dataset.filter || 'all'; apply();}));
  if (search) search.addEventListener('input',apply);
  if (language) language.addEventListener('change',apply);
  if (reset) reset.addEventListener('click',()=>{selected='all'; if(search) search.value=''; if(language) language.value='all'; apply(); if(search) search.focus();});
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
});
