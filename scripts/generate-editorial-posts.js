const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {renderPost, catalogEntry} = require('./render-editorial-post');
const dataFile = 'assets/js/articles.js';
let catalogSource = fs.readFileSync(dataFile, 'utf8');
const catalog = vm.runInNewContext(`${catalogSource}\nblogArticles`);
const posts = JSON.parse(fs.readFileSync('content/editorial-posts.json', 'utf8')).filter(post => post.publishedAt);
const entries = [];
const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
for (const post of posts) {
  const source = catalog.find(article => article.id === post.sourceProductId && !article.hidden);
  if (!source) throw new Error('Unavailable registered item: ' + post.sourceProductId);
  fs.mkdirSync(path.dirname(post.file), {recursive: true});
  fs.writeFileSync(post.file, renderPost(post, source));
  entries.push(catalogEntry(post, source));
  const short = '/' + path.basename(post.file, '.html');
  for (const alias of [short, short + '.html']) {
    const destination = '/' + post.file.replace(/\.html$/, '');
    const existing = config.redirects.find(redirect => redirect.source === alias);
    if (existing && existing.destination !== destination) throw new Error('Alias conflict: ' + alias);
    if (!existing) config.redirects.push({source: alias, destination, permanent: true});
  }
}
const block = entries.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id - a.id).map(entry => JSON.stringify(entry, null, 2) + ',').join('\n');
catalogSource = catalogSource.replace(/\/\/ editorial-posts:start[\s\S]*?\/\/ editorial-posts:end/, '// editorial-posts:start\n' + block + '\n// editorial-posts:end');
if (!catalogSource.includes('// editorial-posts:start')) throw new Error('Missing editorial catalog marker');
fs.writeFileSync(dataFile, catalogSource);
fs.writeFileSync('vercel.json', JSON.stringify(config, null, 2) + '\n');
console.log(`Generated ${posts.length} released editorial posts; future drafts stay outside public pages, catalog and sitemap.`);
