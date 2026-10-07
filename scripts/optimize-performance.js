/** Remove font-provider round trips; preload only each layout's body face. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const manifest = JSON.parse(fs.readFileSync('assets/fonts/manifest.json', 'utf8'));
function htmlFiles(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return ['topics', 'guides'].includes(entry.name) || directory !== '.' ? htmlFiles(file) : [];
    return file.endsWith('.html') ? [file] : [];
  });
}
const cssHash = crypto.createHash('sha256').update(fs.readFileSync('assets/css/fonts.css')).digest('hex').slice(0, 10);
for (const file of htmlFiles('.')) {
  let html = fs.readFileSync(file, 'utf8');
  if (!/<head\b/i.test(html) || !/assets\/css\//.test(html)) continue;
  html = html.replace(/<link\b[^>]*(?:fonts\.(?:googleapis|gstatic)\.com|\/assets\/css\/fonts\.css|data-pokisky-font)[^>]*>\s*/gi, '');
  const family = /assets\/css\/review\.css/.test(html) ? 'Inter' : 'DM Sans';
  const font = manifest.find(face => face.family === family && face.subset === 'latin');
  const links = `<link rel="preload" href="/assets/fonts/${font.file}" as="font" type="font/woff2" crossorigin data-pokisky-font />\n<link rel="stylesheet" href="/assets/css/fonts.css?v=${cssHash}" />\n`;
  // A stable insertion point avoids moving whitespace on subsequent builds.
  html = html.replace(/(<link\b[^>]*href="[^"]*assets\/css\/(?!fonts\.css)[^"]*"[^>]*>)/i, links + '$1');
  fs.writeFileSync(file, html);
}
console.log('Applied local font loading to site pages.');
