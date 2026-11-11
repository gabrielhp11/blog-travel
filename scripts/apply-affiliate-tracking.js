const fs = require('node:fs');
const path = require('node:path');

const defaultPanelOrigin = 'https://affiliate-panel-cyan.vercel.app';
const startMarker = '<!-- pokisky-affiliate-tracking:start -->';
const endMarker = '<!-- pokisky-affiliate-tracking:end -->';
const check = process.argv.includes('--check');

function normalizePanelOrigin(value = process.env.AFFILIATE_PANEL_ORIGIN || defaultPanelOrigin) {
  const parsed = new URL(value);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('AFFILIATE_PANEL_ORIGIN must be an HTTPS origin without a path, query, or fragment.');
  }
  return parsed.origin;
}

function applyAffiliateTracking(html, panelOrigin) {
  const origin = normalizePanelOrigin(panelOrigin);
  const withoutManagedBlock = html.replace(
    /<!-- pokisky-affiliate-tracking:start -->[\s\S]*?<!-- pokisky-affiliate-tracking:end -->\n?/gi,
    ''
  );
  const block = `${startMarker}\n<script defer src="${origin}/tracking.js"></script>\n${endMarker}\n`;
  if (!/<\/body\s*>/i.test(withoutManagedBlock)) throw new Error('HTML page has no closing body tag.');
  return withoutManagedBlock.replace(/<\/body\s*>/i, `${block}</body>`);
}

function files(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file) : file.endsWith('.html') ? [file] : [];
  });
}

function main() {
  const panelOrigin = normalizePanelOrigin();
  const pages = [...fs.readdirSync('.').filter(file => file.endsWith('.html')), ...files('topics'), ...files('guides')];
  let processed = 0;
  for (const file of pages) {
    const html = fs.readFileSync(file, 'utf8');
    if (!/<head\b/i.test(html)) continue;
    processed++;
    const next = applyAffiliateTracking(html, panelOrigin);
    if (check) {
      if (next !== html) throw new Error(`${file}: affiliate tracking script is missing, duplicated, or outdated.`);
    } else if (next !== html) {
      fs.writeFileSync(file, next);
    }
  }
  console.log(`${check ? 'Verified' : 'Applied'} affiliate tracking on ${processed} HTML pages.`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {applyAffiliateTracking, normalizePanelOrigin};
