/** Shared browser icons for public guides, status pages and redirect aliases. */
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const check = process.argv.includes('--check');
const icons = [
  {rel: 'icon', type: 'image/x-icon', sizes: '16x16 32x32 48x48', href: '/favicon.ico'},
  {rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48.png'},
  {rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: '/favicon.svg'},
  {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'}
];
function files(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file) : file.endsWith('.html') ? [file] : [];
  });
}
const pages = [...fs.readdirSync('.').filter(file => file.endsWith('.html')), ...files('topics'), ...files('guides')];
const block = '\n<!-- pokisky-icons:start -->\n' + icons.map(icon => '<link ' + Object.entries(icon).map(([key, value]) => `${key}="${value}"`).join(' ') + ' />').join('\n') + '\n<!-- pokisky-icons:end -->\n';
let count = 0;
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  // Search-engine verification files are plain text; preserve them byte for byte.
  if (!/<head\b/i.test(html)) continue;
  count++;
  if (check) {
    const $ = cheerio.load(html);
    for (const icon of icons) {
      const matching = $('link').filter((i, el) => Object.entries(icon).every(([key, value]) => $(el).attr(key) === value));
      if (matching.length !== 1) throw new Error(`${file}: missing or duplicated favicon ${icon.href}`);
    }
  } else {
    const next = html.replace(/\n?<!-- pokisky-icons:start -->[\s\S]*?<!-- pokisky-icons:end -->\n?/g, '').replace(/<\/head>/i, block + '</head>').replace(/[ \t]+$/gm, '');
    if (next !== html) fs.writeFileSync(file, next);
  }
}
for (const icon of icons) if (!fs.existsSync(icon.href.slice(1))) throw new Error(`Missing icon: ${icon.href}`);
console.log(`${check ? 'Verified' : 'Applied'} PokiSky browser icons on ${count} HTML pages.`);
