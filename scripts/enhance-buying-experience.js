/** Build a source-based decision entry and static contents without altering seller URLs. */
const fs = require('node:fs');
const cheerio = require('cheerio');
const {guides,hubs,planningPages,localeOf,escapeHtml:esc,cleanPath} = require('./site-data');
const copy = {
 fr:{quick:'En bref',overview:'Ce que ce guide explique',checks:'Avant de choisir',contents:'Dans ce guide',next:'Consulter l’offre actuelle',disclosure:'Nos guides et liens affiliés',note:'Vérifier la composition, le montant total, la livraison, les renouvellements éventuels et les conditions de retour avant de payer.',facts:'Points abordés dans ce guide'},
 en:{quick:'At a glance',overview:'What this guide covers',checks:'Before you choose',contents:'In this guide',next:'Compare the current offer',disclosure:'How our guides and affiliate links work',note:'Use the details below to check suitability. Confirm the seller’s current total, access or delivery, renewal and refund terms before paying.',facts:'Points covered in the guide'},
 de:{quick:'Auf einen Blick',overview:'Darum geht es',checks:'Vor der Entscheidung',contents:'In diesem Ratgeber',next:'Aktuelles Angebot vergleichen',disclosure:'Redaktion und Affiliate-Hinweis',note:'Prüfen Sie die Details unten und die aktuellen Kosten, den Zugang oder die Lieferung, Verlängerung und Rückgabebedingungen beim Anbieter.',facts:'Themen dieses Ratgebers'},
 pt:{quick:'Resumo para decidir',overview:'O que este guia explica',checks:'Antes de escolher',contents:'Neste guia',next:'Conferir a oferta atual',disclosure:'Como funcionam nossos guias e links de afiliado',note:'Use os detalhes abaixo para avaliar a adequação. Confira o custo total, acesso ou entrega, renovação e devolução diretamente com o vendedor antes de pagar.',facts:'Pontos abordados neste guia'}
};
const decisions=JSON.parse(fs.readFileSync('content/buying-decisions.json','utf8'));
const files=['index.html','affiliate-disclosure.html',...hubs.map(x=>x.file),...planningPages.map(x=>x.file),...guides.map(x=>x.reviewUrl)];
for (const file of files) {
 let html=fs.readFileSync(file,'utf8').replace(/\n?<!-- buying-experience:start -->[\s\S]*?<!-- buying-experience:end -->\n?/g,'');
 const $=cheerio.load(html,{sourceCodeLocationInfo:true}); const edits=[];
 const insert=(pos,value)=>edits.push({start:pos,end:pos,value});
 const guide=guides.find(g=>g.reviewUrl===file);
 const lang=(guide?localeOf(guide):$('html').attr('lang')||'en').slice(0,2); const t=copy[lang]||copy.en;
 if (!$('link[href="/assets/css/experience.css"]').length) insert($('head')[0].sourceCodeLocation.endTag.startOffset,'<link rel="stylesheet" href="/assets/css/experience.css" />\n');
 if (guide) {
  const main=$('main').first();
  if (!main.attr('id')) {
   const loc=main[0].sourceCodeLocation.startTag;
   edits.push({start:loc.startOffset,end:loc.endOffset,value:html.slice(loc.startOffset,loc.endOffset).replace(/>$/,' id="main-content">')});
  }
  if (!$('.skip-link').length) insert($('body')[0].sourceCodeLocation.startTag.endOffset,`\n<a class="skip-link" href="#${esc(main.attr('id')||'main-content')}">${lang==='de'?'Zum Inhalt':lang==='pt'?'Pular para o conteúdo':lang==='fr'?'Aller au contenu':'Skip to content'}</a>\n`);
  const headings=[]; const ids=new Set($('[id]').map((i,e)=>$(e).attr('id')).get());
  main.find('h2').each((i,e)=>{
   const h=$(e); if(h.closest('.hero,.seo-related,.offer-support-section').length || h.closest('section').find('.seo-context-gallery').length) return;
   let id=h.attr('id')||h.closest('section[id]').attr('id');
   if(!id) {id=`guide-section-${i+1}`; while(ids.has(id)) id+='-more'; ids.add(id);const loc=e.sourceCodeLocation.startTag;edits.push({start:loc.startOffset,end:loc.endOffset,value:html.slice(loc.startOffset,loc.endOffset).replace(/>$/,` id="${id}">`)});}
   if(!headings.some(x=>x.id===id)) headings.push({id,text:h.text().trim()});
  });
  const facts=(guide.highlights||[]).slice(0,3);
  const decision=decisions[file];
  const comparison=decision ? `<section class="decision-comparison" aria-labelledby="decision-scenarios"><h2 id="decision-scenarios">${esc(decision.heading)}</h2><p>${esc(decision.intro)}</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="${esc(decision.heading)}"><table><thead><tr>${decision.columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${decision.rows.map(row=>`<tr><th scope="row">${esc(row[0])}</th>${row.slice(1).map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="decision-takeaway">${esc(decision.next)}</p></section>` : '';
  if(decision) headings.unshift({id:'decision-scenarios',text:decision.heading});
  const hero=$('.hero').first();
  const cta=hero.find('a.btn[href]').filter((i,e)=>/^https?:\/\//.test($(e).attr('href'))).first();
  const offer=cta.length?`<a class="btn btn-primary" href="${esc(cta.attr('href'))}" target="_blank" rel="${esc(cta.attr('rel')||'noopener noreferrer')}">${t.next} <span aria-hidden="true">↗</span></a>`:guide.sourceProductId?`<a class="btn btn-primary" href="${esc(guide.bookingUrl)}">${lang==='en'?'Read the registered product guide':t.next} →</a>`:'';
  const block=`<!-- buying-experience:start --><section class="buying-experience" aria-labelledby="buying-summary"><div class="container"><div class="buying-summary"><div><p class="eyebrow">${t.quick}</p><h2 id="buying-summary">${t.overview}</h2><p>${esc(guide.summary)}</p>${facts.length?`<ul class="buying-facts" aria-label="${t.facts}">${facts.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:''}</div><div class="buying-next"><h3>${t.checks}</h3><p>${t.note}</p>${offer}<a class="buying-disclosure" href="/affiliate-disclosure">${t.disclosure}</a></div></div><nav class="guide-contents" aria-label="${t.contents}"><strong>${t.contents}</strong><ol>${headings.map(h=>`<li><a href="#${esc(h.id)}">${esc(h.text)}</a></li>`).join('')}</ol></nav>${comparison}</div></section><!-- buying-experience:end -->\n`;
  insert(hero.length?hero[0].sourceCodeLocation.endOffset:main[0].sourceCodeLocation.startTag.endOffset,'\n'+block);
 }
 edits.sort((a,b)=>b.start-a.start||b.end-a.end);
 for(const e of edits) html=html.slice(0,e.start)+e.value+html.slice(e.end);
 fs.writeFileSync(file,html);
}
console.log(`Enhanced navigation and buying explanations across ${guides.length} guides.`);
