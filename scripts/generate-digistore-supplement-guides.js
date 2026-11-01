/** Render the ten source-reviewed Digistore24 guides; never infer affiliation or refresh review dates. */
const fs = require('node:fs');
const path = require('node:path');
const batch = JSON.parse(fs.readFileSync('content/digistore-supplements-20261031.json', 'utf8'));
const assets = JSON.parse(fs.readFileSync('docs/digistore-2026-10-31/downloaded-assets.json', 'utf8'));
const openingsFile = 'content/product-openings.json';
const decisionsFile = 'content/buying-decisions.json';
const manifestFile = 'assets/images/sources/manifest.json';
const openings = JSON.parse(fs.readFileSync(openingsFile, 'utf8'));
const decisions = JSON.parse(fs.readFileSync(decisionsFile, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const site = 'https://blog-travel-eight.vercel.app';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const table = (rows, headers, label) => `<div class="comparison-scroll" tabindex="0" role="region" aria-label="${esc(label)}"><table><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const json = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const entries = [];
const colors = [];
const redirects = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
for (const p of batch.products) {
  const de = p.locale.startsWith('de');
  const t = de ? {
    checked:'Quellen geprüft am 31. Oktober 2026', label:'Etikett', costs:'Kosten', wellness:'Nahrungsergänzung',
    facts:['Angabe','Veröffentlichtes Detail'], packs:['Bestellung','Produktpreis','Zusätzlicher Prüfpunkt'],
    packHeading:'Den gesamten Bestellbetrag und Lieferplan vergleichen', delivery:'Lieferung und Zieladresse', returns:'Rückgabe: Frist und Bedingungen getrennt lesen',
    questions:'Häufige Fragen', sources:'Quellen und redaktioneller Stand', next:'Das aktuelle Etikett mit der Bestellung abgleichen', cta:'Anbieterinformationen ansehen',
    sourceNote:'Quellenprüfung ist keine Produktprüfung oder unabhängige Bestätigung der Werbeaussagen. Preise sind datierte Angaben; eine vollständige Adress- und Steuerberechnung wurde nicht vorgenommen.',
    disclosure:'Diese Seite verwendet ungetrackte Links zum offiziellen Anbieter. PokiSky hat das Produkt nicht selbst getestet. Andere Seiten können Affiliate-Links enthalten.',
    standards:'Redaktion und Affiliate-Hinweis', primaryCaption:'Produktabbildung des Anbieters; keine eigene Produktprüfung.',
    labelCaption:'Veröffentlichte Etikett- oder Portionsabbildung des Anbieters. Zum Vergrößern öffnen.',
    supportCaption:'Weitere Produktabbildung des Anbieters; die dargestellte Menge ist keine Einnahmeempfehlung.',
    footer:'PokiSky · Quellenbasierte Einkaufsratgeber', decision:'Drei Fragen vor der Entscheidung', columns:['Ihre Frage','Was vergleichen?','Wann zunächst klären?'],
    decisionIntro:'Redaktionelle Vergleichsfragen, keine persönliche Einnahmeempfehlung.', decisionNext:'Prüfen Sie aktuelle Zusammensetzung, Eignung und den vollständigen Bestellbetrag.'
  } : {
    checked:'Sources checked 31 October 2026', label:'Label', costs:'Costs', wellness:'Wellness',
    facts:['Label entry','Published detail'], packs:['Package','Product amount','Additional check'],
    packHeading:'Compare the complete order, not only a unit price', delivery:'Delivery: confirm the actual destination quote', returns:'Returns: check the deadline and the procedure',
    questions:'Questions before choosing', sources:'Sources and review status', next:'Keep the current label beside the actual order', cta:'Read the supplier information',
    sourceNote:'Source review is not product testing or independent confirmation of advertising claims. Prices are dated observations, not a complete address-specific shipping and tax quote.',
    disclosure:'This page uses untracked official seller links. PokiSky has not personally tested the product. Other guides may contain affiliate links.',
    standards:'Editorial standards and affiliate disclosure', primaryCaption:'Supplier product artwork; PokiSky has not tested this product.',
    labelCaption:'Published supplier wrapper or serving artwork. Open the image to read the full panel.',
    supportCaption:'Additional supplier product artwork; the pictured quantity is not a usage recommendation.',
    footer:'PokiSky · Source-based buying guides', decision:'Three checks before you choose', columns:['Your question','What to compare','When to pause'],
    decisionIntro:'Editorial comparison questions, not individual use or dosing recommendations.', decisionNext:'Check the current formula, suitability and complete order commitment.'
  };
  const file = `topics/wellness/${p.subtopic}/${p.slug}.html`;
  const publicPath = '/' + file.replace(/\.html$/, '');
  const imgs = [1,2,3].map(n => assets.find(a=>a.slug===p.assetKey && a.position===n));
  if (imgs.some(x=>!x || !fs.existsSync(x.path.slice(1)))) throw Error('Missing reviewed asset: '+p.slug);
  if (new Set(imgs.map(x=>x.sha256)).size !== 3) throw Error('Duplicate product artwork: '+p.slug);
  const imageAlts = de ? [`${p.name}: Produktabbildung des Anbieters`,`${p.name}: veröffentlichtes Etikett oder Portionsangaben`,`${p.name}: weitere Verpackungs- oder Größenabbildung des Anbieters`] : [`${p.name}: supplier product artwork`,`${p.name}: published supplier label or serving panel`,`${p.name}: additional supplier package artwork`];
  const figure = (i,caption,hero=false)=>`<figure class="${hero?'product-card':'source-figure'}"><a href="${imgs[i].path}" target="_blank" rel="noopener"><img src="${imgs[i].path}" width="${imgs[i].width}" height="${imgs[i].height}" alt="${esc(imageAlts[i])}" loading="${hero?'eager':'lazy'}"${hero?' fetchpriority="high"':''} decoding="async"></a><figcaption>${esc(caption)}</figcaption></figure>`;
  const headline = esc(p.title);
  const html = `<!doctype html>
<html lang="${p.locale}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${headline} | PokiSky</title><meta name="description" content="${esc(p.intro)}"><meta name="robots" content="index, follow"><meta name="dateModified" content="${batch.reviewed}">
<link rel="canonical" href="${site+publicPath}"><meta property="og:type" content="article"><meta property="og:title" content="${headline}"><meta property="og:description" content="${esc(p.intro)}"><meta property="og:url" content="${site+publicPath}"><meta property="og:image" content="${site+imgs[0].path}"><meta property="og:image:alt" content="${esc(imageAlts[0])}">
<link rel="stylesheet" href="/assets/css/review.css"><link rel="stylesheet" href="/assets/css/editorial.css"><link rel="stylesheet" href="/assets/css/digistore-supplements.css"></head>
<body class="digistore-guide page-${p.slug}"><header class="topbar"><div class="container nav"><a class="brand" href="/"><span class="brand-mark">P</span><span>PokiSky</span></a><nav class="nav-links" aria-label="${de?'Navigation':'Navigation'}"><a href="/guides/wellness">${t.wellness}</a><a href="#ingredients">${t.label}</a><a href="#packs">${t.costs}</a></nav></div></header>
<main id="main-content"><section class="hero"><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/guides/wellness">${t.wellness}</a><span aria-hidden="true">/</span><span>${esc(p.name)}</span></nav><div class="hero-grid"><div class="hero-copy"><p class="eyebrow">${t.checked}</p><h1>${headline}</h1><p class="lead">${esc(p.intro)}</p><div class="compatibility"><p>${esc(p.highlights.join(' · '))}</p></div><div class="cta-row"><a class="btn btn-primary" href="${esc(p.offer)}" target="_blank" rel="noopener noreferrer">${t.cta}</a><a class="btn btn-secondary" href="#ingredients">${t.label}</a></div><p class="editorial-disclosure">${esc(t.disclosure)} <a href="/affiliate-disclosure">${t.standards}</a>.</p></div>${figure(0,t.primaryCaption,true)}</div></div></section>
<section id="ingredients"><div class="container"><p class="eyebrow">${t.label}</p><h2>${esc(p.labelHeading)}</h2><p>${esc(p.labelText)}</p>${table(p.labelRows,t.facts,p.labelHeading)}<p class="source-note">${esc(p.labelNote)}</p>${figure(1,t.labelCaption)}</div></section>
<section id="packs"><div class="container"><p class="eyebrow">${t.costs}</p><h2>${t.packHeading}</h2>${table(p.packs,t.packs,t.packHeading)}<p>${esc(p.costNote)}</p>${figure(2,t.supportCaption)}</div></section>
<section id="delivery"><div class="container reading"><h2>${t.delivery}</h2><p>${esc(p.delivery)}</p></div></section>
<section id="returns"><div class="container reading"><h2>${t.returns}</h2><p>${esc(p.returns)}</p></div></section>
<section id="limits"><div class="container reading"><h2>${esc(p.limitHeading)}</h2><p>${esc(p.limitText)}</p></div></section>
<section id="questions"><div class="container reading"><h2>${t.questions}</h2>${p.questions.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div></section>
<section id="sources"><div class="container reading"><h2>${t.sources}</h2><p>${esc(t.sourceNote)}</p><p>${de?'Anbieter':'Supplier'}: ${esc(p.seller)}.</p><ul>${p.sources.map(([label,url])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a></li>`).join('')}</ul><p class="editorial-source">${t.checked}. ${de?'Die Abbildungen stammen vom Anbieter; es wurden keine Verpackungen oder Ergebnisse erfunden.':'All three images are supplier artwork; no packaging or outcomes were invented.'}</p></div></section>
<section id="next"><div class="container cta-block"><div><h2>${t.next}</h2><p>${esc(t.decisionNext)}</p></div><a class="btn btn-primary" href="${esc(p.offer)}" target="_blank" rel="noopener noreferrer">${t.cta}</a></div></section>
</main><footer class="footer"><div class="container footer-inner"><span>${t.footer}</span><a href="/affiliate-disclosure">${t.standards}</a></div></footer></body></html>\n`;
  fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,html);
  openings[file]={description:p.intro,modified:batch.reviewed};
  decisions[file]={heading:t.decision,intro:t.decisionIntro,columns:t.columns,rows:p.decisions,next:t.decisionNext};
  for(const img of imgs){
    let record=manifest.find(r=>r.path===img.path);
    if(!record){record={...img,usedBy:[]};delete record.slug;delete record.position;manifest.push(record);}
    record.usedBy=[...new Set([...(record.usedBy||[]),file])];
  }
  entries.push({id:p.id,topic:'wellness',subtopic:p.subtopic,locale:p.locale,market:de?'Germany; confirm destination, shipping and selected billing plan':'United States buying context; verify the final eligible address and full quote',category:de?'Etikett und Kaufbedingungen':'Supplement label and purchase checks',audience:de?'Erwachsene in Deutschland, die Etikett und Bestellbedingungen vergleichen':'US adults comparing current supplement labels and purchase conditions',title:p.title,summary:p.intro,highlights:p.highlights,service:de?'Nahrungsergänzungsmittel':'Dietary supplement',ctaText:t.cta,reviewUrl:file,bookingUrl:publicPath,imageUrl:imgs[0].path.slice(1),imageAlt:imageAlts[0],imageType:'official',linkType:'official',network:'Digistore24',isDirectAffiliate:false,featured:false,publishedAt:'2026-11-01',affiliateStatus:'Untracked official seller link. Marketplace verified 2026-10-31; no newly approved partnership claimed.'});
  colors.push(`.page-${p.slug}{--accent:${p.palette[0]};--gold:${p.palette[0]};--bg:${p.palette[1]};--accent-soft:${p.palette[2]}}`);
  for(const alias of [`/${p.slug}`,`/${p.slug}.html`]){
    if(!redirects.redirects.some(r=>r.source===alias)) redirects.redirects.push({source:alias,destination:publicPath,permanent:true});
  }
}
let catalog=fs.readFileSync('assets/js/articles.js','utf8');
catalog=catalog.replace(/[\r\n]*\/\/ digistore-20261031:start[\s\S]*?\/\/ digistore-20261031:end[\r\n]*/,'\n');
const block='\n// digistore-20261031:start\n'+entries.map(e=>JSON.stringify(e,null,2)+',').join('\n')+'\n// digistore-20261031:end\n';
catalog=catalog.replace(/const blogArticles = \[\s*/,'const blogArticles = ['+block);
fs.writeFileSync('assets/js/articles.js',catalog);
json(openingsFile,openings);json(decisionsFile,decisions);json(manifestFile,manifest);json('vercel.json',redirects);
const css=`.digistore-guide{--ink:#233139;--muted:#5f6a70;--line:rgba(36,53,61,.16)}
.digistore-guide .topbar{background:var(--bg)}.digistore-guide h1{max-width:23ch;font-size:clamp(2rem,4vw,3.25rem)}
.digistore-guide .hero-grid>*{min-width:0}.digistore-guide .product-card{background:#fff;border-radius:18px;overflow:hidden;margin:0}
.digistore-guide .product-card img{display:block;width:100%;height:300px;object-fit:contain;padding:16px}
.digistore-guide figcaption{padding:16px;font-size:.82rem;line-height:1.55;color:var(--muted)}
.digistore-guide .compatibility{padding:18px 22px;margin:24px 0;background:var(--accent-soft);border-left:3px solid var(--accent)}.digistore-guide .compatibility p{margin:0}
.digistore-guide table{width:100%;border-collapse:collapse}.digistore-guide th,.digistore-guide td{padding:14px 12px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line);overflow-wrap:anywhere}
.digistore-guide .comparison-scroll{width:100%;overflow-x:auto;margin:24px 0}.digistore-guide section>.container>p{max-width:80ch}
.digistore-guide .source-figure{margin:32px 0 0;background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;max-width:100%}
.digistore-guide .source-figure img{display:block;width:100%;max-height:520px;object-fit:contain;height:auto;padding:12px}
.digistore-guide .reading{max-width:1000px}.digistore-guide .reading>p{max-width:78ch}.digistore-guide .reading h3{margin-top:28px}
.digistore-guide .editorial-disclosure{font-size:.85rem;line-height:1.65}.digistore-guide .editorial-disclosure a,.digistore-guide #sources a{text-decoration:underline}
.digistore-guide .source-note{padding:18px 22px;background:var(--accent-soft);border-radius:8px}.digistore-guide #sources li{margin:10px 0;overflow-wrap:anywhere}
@media(max-width:760px){.digistore-guide .nav{flex-wrap:wrap;gap:12px;padding-block:12px}.digistore-guide .nav-links{gap:14px;font-size:.8rem}.digistore-guide .product-card img{height:240px}.digistore-guide th,.digistore-guide td{padding:11px 8px;font-size:.9rem}.digistore-guide .cta-row{gap:10px}}
${colors.join('\n')}\n`;
fs.writeFileSync('assets/css/digistore-supplements.css',css);
console.log(`Generated ${entries.length} source-reviewed supplement guides with 30 pinned supplier images and untracked official links.`);
