const fs = require('node:fs');
const {siteUrl, planningPages, cleanPath, escapeHtml: esc, jsonLd, faqPage, renderFaqs, ogLocaleOf} = require('./site-data');

// English and German contain the same editorial comparison, not unrelated locale hubs.
const copy = {
  'en-GB': {
    home: 'Home', travel: 'Travel', skip: 'Skip to content', navigation: 'Main navigation', language: 'Read in your language',
    eyebrow: 'Europe travel connectivity', by: 'By', checked: 'Sources checked', date: '8 October 2026',
    lead: 'Airalo or Holafly for a Europe trip? Start with the countries you will visit, your existing roaming allowance and whether you need a laptop hotspot. A plan that fits those needs matters more than a “best eSIM” headline.',
    disclosure: 'This comparison uses public provider information, not a hands-on network test. Official source links below are untracked. Some links elsewhere on PokiSky are affiliate links.',
    caption: 'PokiSky editorial illustration; a planning concept, not a provider screenshot or coverage map.',
    alt: ['Travel notes for checking destinations, dates and booking terms', 'Route-planning illustration for matching countries to a data plan', 'Phone and itinerary illustration for planning connectivity'],
    toc: 'In this guide', tocItems: ['First check your home plan', 'Airalo and Holafly', 'Match a plan to your trip', 'Before departure', 'Frequently asked questions'],
    roamingTitle: 'Do you need a travel eSIM in Europe?',
    roaming: 'Your Europe explains that eligible EU roaming is subject to fair-use rules. Geographic Europe is not one roaming zone: check the UK and Switzerland with your operator. Satellite connections on ships or aircraft need separate checks.',
    roamingSource: 'Official EU roaming guidance',
    roamingAdvice: 'Compare the extra cost of using your current plan with the complete travel-eSIM price. If your allowance already covers your route and usage, an additional plan may add no value. Ask your operator about your exact tariff rather than assuming that a country name on an itinerary is enough.',
    compareTitle: 'Airalo vs Holafly: compare the actual Europe plan',
    airalo: 'Airalo’s Europe page lists 41 countries and offers fixed-data and unlimited options. Coverage and validity belong to the selected package; inspect it before paying.',
    airaloSource: 'Airalo Europe plans', airaloGuide: 'Read the Airalo buying guide',
    holafly: 'Holafly advertises unlimited data across 33 countries, with 1 GB of hotspot data per day and possible fair-use speed reductions. Its FAQ excludes domestic use, including the EU region for EU residents. Confirm eligibility with support before purchase.',
    holaflySource: 'Holafly Europe plans and FAQ', holaflyGuide: 'Read the Holafly buying guide',
    compareAdvice: 'Country totals alone do not tell you which option fits. Open both country lists beside your itinerary and check every stop, including overnight connections. Then compare the full cost for the same travel dates. This guide does not declare a cheapest provider or a speed winner.',
    scenariosTitle: 'Which option fits your itinerary?',
    scenarios: [
      ['A short city break', 'Write down what you need away from Wi-Fi: navigation, messages, tickets and occasional uploads. Compare that list with a fixed-data package and your current roaming allowance before paying for more data.'],
      ['Several countries on one trip', 'Make a route checklist, including stopovers. Compare a regional plan with separate destination plans using the total cost, installation work and validity dates. A larger country count is useful only when it includes your route.'],
      ['Working from a laptop', 'Treat hotspot allowance as a separate requirement. Record how much sharing you need and ask about the exact package’s limits. Arrange another connection for important meetings; an “unlimited” phone-data label is not a laptop-work guarantee.'],
      ['Travelling from an EU home address', 'Start with the allowance from your home operator. For any travel plan with residency restrictions, ask the provider whether your residence and route qualify. Resolve this before installation or payment.']
    ],
    exampleTitle: 'Example: London → Paris → Rome',
    example: 'Use this as a planning exercise, not a coverage confirmation: list the UK, France and Italy, count the full travel days, and mark any laptop use. Check those three countries in the selected plan, ask when validity begins, and compare the complete price with home roaming. If your itinerary changes, repeat the country check.',
    setupTitle: 'Your checklist before departure',
    setup: [
      'Confirm the exact phone model, regional variant and carrier-unlock status with the provider’s compatibility information.',
      'Save the selected country list, package description, refund terms and support contact with your booking notes.',
      'Read the installation instructions and activation trigger. Installation and the start of validity should be checked separately.',
      'Choose the correct mobile-data line and check automatic data switching and home-SIM roaming settings against your operator’s instructions.',
      'Download maps and essential tickets in advance, and plan a backup connection for tasks that cannot wait.'
    ],
    nextTitle: 'Continue planning your Europe trip',
    related: ['Airalo: compatibility and activation', 'Holafly: validity and setup', 'Omio: transport booking checks', 'Europe buying guides'],
    faqTitle: 'Europe eSIM questions',
    faqs: [
      {q: 'Is Airalo or Holafly better for Europe?', a: 'Choose using your itinerary, residence, usage and hotspot needs. Compare the selected packages and home roaming. We have not tested either network or established a universal winner.'},
      {q: 'Does a Europe eSIM cover the UK and Switzerland?', a: 'Check both countries in the exact package you select. A Europe label or a headline country count is not sufficient confirmation for your route.'},
      {q: 'What should I check for a 7-day Europe trip?', a: 'Count travel days, list all stops, estimate the mobile tasks you need and include hotspot use. Compare packages for the same dates and check the activation trigger before installation.'},
      {q: 'Can I use a travel eSIM for a laptop?', a: 'Check tethering permission and the sharing allowance for the exact plan. Phone data and hotspot data may have different limits. Plan another connection for important work.'}
    ],
    sourcesTitle: 'Sources and comparison method',
    method: 'We compared the public Europe-plan descriptions and the questions a traveller must resolve before ordering. We did not buy either plan, measure speeds or verify coverage at a particular address. Availability, prices and conditions can change. The scenarios are our editorial planning examples.',
    standards: 'Editorial standards & affiliate disclosure'
  },
  'de-DE': {
    home: 'Startseite', travel: 'Reisen', skip: 'Zum Inhalt', navigation: 'Hauptnavigation', language: 'Sprache wählen',
    eyebrow: 'Mobil online auf Europareisen', by: 'Von', checked: 'Quellen geprüft', date: '8. Oktober 2026',
    lead: 'Airalo oder Holafly für die Europareise? Beginnen Sie mit Ihren Reiseländern, dem Roaming Ihres vorhandenen Tarifs und der Frage, ob Sie einen Laptop-Hotspot benötigen. Ein passender Tarif ist wichtiger als ein pauschales Versprechen zur „besten eSIM“.',
    disclosure: 'Dieser Vergleich nutzt öffentliche Anbieterinformationen und keinen eigenen Netztest. Die unten verlinkten offiziellen Quellen enthalten kein Affiliate-Tracking. Einige andere Links auf PokiSky sind Affiliate-Links.',
    caption: 'Redaktionelle Illustration von PokiSky; Planungskonzept, keine Anbieteransicht oder Netzabdeckungskarte.',
    alt: ['Reisenotizen zum Prüfen von Zielen, Daten und Buchungsbedingungen', 'Routenplanung zum Abgleich der Reiseländer mit einem Datentarif', 'Smartphone und Reiseplan zur Vorbereitung der Internetverbindung'],
    toc: 'In diesem Ratgeber', tocItems: ['Vorhandenen Tarif prüfen', 'Airalo und Holafly', 'Tarif zur Reise auswählen', 'Vor der Abreise', 'Häufige Fragen'],
    roamingTitle: 'Brauchen Sie eine Reise-eSIM für Europa?',
    roaming: 'Your Europe erläutert, dass berechtigtes EU-Roaming Fair-Use-Regeln unterliegt. Das geografische Europa ist keine einheitliche Roamingzone: Prüfen Sie Großbritannien und die Schweiz bei Ihrem Mobilfunkanbieter. Satellitenverbindungen auf Schiffen oder in Flugzeugen sind gesondert zu prüfen.',
    roamingSource: 'Offizielle EU-Informationen zu Roaming',
    roamingAdvice: 'Vergleichen Sie die Zusatzkosten Ihres bestehenden Tarifs mit dem Gesamtpreis der Reise-eSIM. Deckt Ihr Datenvolumen bereits die Route und Ihre Nutzung ab, bringt ein zusätzlicher Tarif möglicherweise keinen Mehrwert. Fragen Sie nach Ihrem konkreten Vertrag, statt vom Ländernamen allein auf die Bedingungen zu schließen.',
    compareTitle: 'Airalo oder Holafly: den konkreten Europatarif vergleichen',
    airalo: 'Airalo nennt für Europa 41 Länder und bietet Tarife mit festem sowie unbegrenztem Datenvolumen. Länder und Gültigkeit gehören zum ausgewählten Paket; prüfen Sie es vor der Zahlung.',
    airaloSource: 'Europatarife von Airalo', airaloGuide: 'Airalo-Kaufhilfe lesen (Englisch)',
    holafly: 'Holafly bewirbt unbegrenzte Daten in 33 Ländern, mit 1 GB Hotspot-Daten täglich und möglichen Fair-Use-Drosselungen. Die FAQ schließt Inlandnutzung aus, einschließlich der EU-Region für EU-Einwohner. Klären Sie Ihre Berechtigung vor dem Kauf mit dem Support.',
    holaflySource: 'Holafly-Europatarife und FAQ', holaflyGuide: 'Holafly-Kaufhilfe lesen (Englisch)',
    compareAdvice: 'Die Länderanzahl allein entscheidet nicht über die Eignung. Öffnen Sie beide Länderlisten neben Ihrer Reiseroute und prüfen Sie jeden Halt einschließlich Zwischenübernachtungen. Vergleichen Sie anschließend den Gesamtpreis für dieselben Reisetage. Dieser Ratgeber bestimmt weder den günstigsten Anbieter noch einen Geschwindigkeitssieger.',
    scenariosTitle: 'Welcher Tarif passt zu Ihrer Reiseroute?',
    scenarios: [
      ['Ein kurzer Städtetrip', 'Notieren Sie, was Sie ohne WLAN brauchen: Navigation, Nachrichten, Tickets und gelegentliche Uploads. Vergleichen Sie diese Aufgaben mit einem festen Datenpaket und Ihrem vorhandenen Roamingvolumen, bevor Sie zusätzliche Daten bezahlen.'],
      ['Mehrere Länder auf einer Reise', 'Erstellen Sie eine Länderliste einschließlich Zwischenstopps. Vergleichen Sie einen Regionaltarif mit einzelnen Ländertarifen anhand der Gesamtkosten, des Installationsaufwands und der Gültigkeit. Mehr Länder helfen nur, wenn Ihre Route dazugehört.'],
      ['Arbeiten am Laptop', 'Prüfen Sie das Hotspot-Volumen getrennt. Notieren Sie Ihren Bedarf und fragen Sie nach den Grenzen des konkreten Pakets. Organisieren Sie für wichtige Besprechungen eine weitere Verbindung; unbegrenzte Smartphone-Daten garantieren keinen Laptop-Arbeitsplatz.'],
      ['Reisen mit Wohnsitz in der EU', 'Prüfen Sie zuerst das Roaming Ihres bestehenden Mobilfunkanbieters. Fragen Sie bei einem Reisetarif mit Wohnsitzbeschränkungen, ob Ihr Wohnsitz und Ihre Route zulässig sind. Klären Sie dies vor Installation oder Zahlung.']
    ],
    exampleTitle: 'Beispiel: London → Paris → Rom',
    example: 'Eine Planungshilfe, keine Bestätigung der Netzabdeckung: Notieren Sie Großbritannien, Frankreich und Italien, zählen Sie die vollständigen Reisetage und markieren Sie Laptop-Nutzung. Prüfen Sie diese drei Länder im ausgewählten Paket, den Beginn der Gültigkeit und den Gesamtpreis gegenüber Ihrem vorhandenen Roaming. Prüfen Sie bei einer Routenänderung die Länder erneut.',
    setupTitle: 'Checkliste vor der Abreise',
    setup: [
      'Prüfen Sie das genaue Smartphone-Modell, die regionale Variante und eine mögliche Netzsperre anhand der Kompatibilitätsinformationen des Anbieters.',
      'Speichern Sie Länderübersicht, Paketbeschreibung, Erstattungsbedingungen und Supportkontakt mit Ihren Reiseunterlagen.',
      'Lesen Sie Installationsanleitung und Aktivierungsbedingungen. Installation und Beginn der Gültigkeit sind getrennt zu prüfen.',
      'Wählen Sie die richtige Leitung für mobile Daten und prüfen Sie automatischen Datenwechsel sowie Roaming Ihrer bestehenden SIM anhand der Anbieteranleitung.',
      'Laden Sie Karten und wichtige Tickets vorab herunter und planen Sie eine Ersatzverbindung für Aufgaben, die nicht warten können.'
    ],
    nextTitle: 'Ihre Europareise weiter planen',
    related: ['Airalo: Kompatibilität und Aktivierung (Englisch)', 'Holafly: Gültigkeit und Einrichtung (Englisch)', 'Omio: Verkehrsmittel und Buchung (Englisch)', 'Europa-Ratgeber (Englisch)'],
    faqTitle: 'Fragen zur eSIM für Europa',
    faqs: [
      {q: 'Ist Airalo oder Holafly besser für Europa?', a: 'Entscheiden Sie anhand Ihrer Route, Ihres Wohnsitzes, Ihrer Nutzung und Ihres Hotspot-Bedarfs. Vergleichen Sie konkrete Pakete und vorhandenes Roaming. Wir haben keine Netztests durchgeführt und keinen pauschalen Sieger festgestellt.'},
      {q: 'Deckt eine Europa-eSIM Großbritannien und die Schweiz ab?', a: 'Prüfen Sie beide Länder im tatsächlich ausgewählten Paket. Die Bezeichnung Europa oder eine allgemeine Länderanzahl reicht nicht als Bestätigung für Ihre Route aus.'},
      {q: 'Was ist bei einer siebentägigen Europareise zu prüfen?', a: 'Zählen Sie die Reisetage, notieren Sie sämtliche Ziele und schätzen Sie mobile Aufgaben einschließlich Hotspot-Nutzung. Vergleichen Sie Pakete für dieselben Daten und prüfen Sie vor der Installation den Aktivierungsbeginn.'},
      {q: 'Kann ich eine Reise-eSIM für meinen Laptop nutzen?', a: 'Prüfen Sie die Erlaubnis für Tethering und das Hotspot-Volumen des konkreten Tarifs. Smartphone- und Hotspot-Daten können unterschiedliche Grenzen haben. Planen Sie für wichtige Arbeit eine weitere Verbindung.'}
    ],
    sourcesTitle: 'Quellen und Vergleichsmethode',
    method: 'Wir haben öffentliche Beschreibungen der Europatarife und die vor einer Bestellung relevanten Fragen verglichen. Wir haben keinen Tarif gekauft, keine Geschwindigkeit gemessen und keine Netzabdeckung an einer bestimmten Adresse geprüft. Verfügbarkeit, Preise und Bedingungen können sich ändern. Die Szenarien sind redaktionelle Planungsbeispiele.',
    standards: 'Redaktionsstandards und Affiliate-Hinweis'
  }
};

const ids = ['home-roaming', 'comparison', 'itinerary', 'departure', 'faq'];
const imagePaths = ['/assets/images/editorial/travel-checklist.svg', '/assets/images/products/airalo-support-1.svg', '/assets/images/products/holafly-support-2.svg'];
const sources = ['https://www.airalo.com/europe-esim', 'https://esim.holafly.com/esim-europe/', 'https://europa.eu/youreurope/citizens/consumers/internet-telecoms/mobile-roaming-costs/index_en.htm'];
const relatedPaths = ['/topics/travel/connectivity/airalo', '/topics/travel/connectivity/holafly', '/topics/travel/transport/omio', '/guides/europe'];
const sourceLink = (url, label) => `<a class="text-link" href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;

for (const page of planningPages) {
  const c = copy[page.lang];
  const url = siteUrl + cleanPath(page.file);
  const de = page.lang.startsWith('de');
  const figure = index => `<figure><img src="${imagePaths[index]}" alt="${esc(c.alt[index])}" width="960" height="600" loading="${index ? 'lazy' : 'eager'}" decoding="async" /><figcaption>${esc(c.caption)}</figcaption></figure>`;
  const graph = [
    {'@type': 'Article', mainEntityOfPage: url, headline: page.title, description: page.description, inLanguage: page.lang, dateModified: page.reviewed, image: imagePaths.map(path => siteUrl + path), author: {'@type': 'Organization', name: 'PokiSky Editorial Desk', url: siteUrl + '/affiliate-disclosure'}, publisher: {'@type': 'Organization', name: 'PokiSky', url: siteUrl + '/'}},
    {'@type': 'BreadcrumbList', itemListElement: [
      {'@type': 'ListItem', position: 1, name: c.home, item: siteUrl + '/'},
      {'@type': 'ListItem', position: 2, name: c.travel, item: siteUrl + '/guides/travel'},
      {'@type': 'ListItem', position: 3, name: page.title, item: url}
    ]}, faqPage(c.faqs)
  ];
  const html = `<!doctype html>
<html lang="${page.lang}"><head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(page.title)} | PokiSky</title><meta name="description" content="${esc(page.description)}" />
<meta name="dateModified" content="${page.reviewed}" /><link rel="canonical" href="${url}" />
${planningPages.map(other => `<link rel="alternate" hreflang="${other.hreflang}" href="${siteUrl + cleanPath(other.file)}" />`).join('\n')}
<meta property="og:type" content="article" /><meta property="og:site_name" content="PokiSky" /><meta property="og:locale" content="${ogLocaleOf(page.lang)}" />
<meta property="og:title" content="${esc(page.title)}" /><meta property="og:description" content="${esc(page.description)}" /><meta property="og:url" content="${url}" />
<meta property="og:image" content="${siteUrl}/assets/images/products/airalo.png" /><meta property="og:image:alt" content="${esc(c.caption)}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="stylesheet" href="/assets/css/main.css" /><link rel="stylesheet" href="/assets/css/planning.css" />
${jsonLd({'@context': 'https://schema.org', '@graph': graph})}
</head><body class="guide-index planning-page">
<a class="skip-link" href="#main-content">${c.skip}</a>
<header class="topbar"><div class="container nav"><a href="/" class="brand"><span class="brand-mark" aria-hidden="true">P</span><span>PokiSky</span></a><nav class="nav-links" aria-label="${c.navigation}"><a href="/guides/travel">${c.travel}</a><a href="${de ? '/guides/europe-de' : '/guides/europe'}">${de ? 'Deutsch-Ratgeber' : 'Europe guides'}</a><a href="/affiliate-disclosure">${de ? 'Redaktion' : 'Disclosure'}</a></nav></div></header>
<main id="main-content" class="container guide-directory">
<nav class="directory-breadcrumb" aria-label="${de ? 'Brotkrümelnavigation' : 'Breadcrumb'}"><a href="/">${c.home}</a><span aria-hidden="true">/</span><a href="/guides/travel">${c.travel}</a><span aria-hidden="true">/</span><span>eSIM</span></nav>
<nav class="language-switch" aria-label="${c.language}">${planningPages.map(other => `<a href="${cleanPath(other.file)}" lang="${other.lang}" hreflang="${other.hreflang}"${other === page ? ' aria-current="page"' : ''}>${other.hreflang === 'de' ? 'Deutsch' : 'English'}</a>`).join('')}</nav>
<section class="hero planning-hero"><div><p class="eyebrow">${c.eyebrow}</p><h1>${esc(page.title)}</h1><p class="lead">${esc(c.lead)}</p><p class="seo-author">${c.by} <a href="/affiliate-disclosure">PokiSky Editorial Desk</a> · ${c.checked}: <time datetime="${page.reviewed}">${c.date}</time></p></div>${figure(0)}</section>
<p class="planning-disclosure">${esc(c.disclosure)} <a href="/affiliate-disclosure">${c.standards}</a></p>
<nav class="planning-toc" aria-label="${c.toc}"><strong>${c.toc}</strong><ul>${ids.map((id, i) => `<li><a href="#${id}">${c.tocItems[i]}</a></li>`).join('')}</ul></nav>
<section id="home-roaming" class="guide-group planning-reading"><h2>${c.roamingTitle}</h2><p>${esc(c.roaming)} ${sourceLink(sources[2], c.roamingSource)}</p><p>${esc(c.roamingAdvice)}</p></section>
<section id="comparison" class="guide-group"><h2>${c.compareTitle}</h2><div class="planning-options"><article class="planning-card"><h3>Airalo</h3><p>${esc(c.airalo)}</p>${sourceLink(sources[0], c.airaloSource)}<p><a class="text-link" href="${relatedPaths[0]}" lang="en-GB">${c.airaloGuide} →</a></p>${figure(1)}</article><article class="planning-card"><h3>Holafly</h3><p>${esc(c.holafly)}</p>${sourceLink(sources[1], c.holaflySource)}<p><a class="text-link" href="${relatedPaths[1]}" lang="en-GB">${c.holaflyGuide} →</a></p>${figure(2)}</article></div><p class="planning-reading">${esc(c.compareAdvice)}</p></section>
<section id="itinerary" class="guide-group"><h2>${c.scenariosTitle}</h2><div class="planning-options">${c.scenarios.map(([title, text]) => `<article class="planning-card"><h3>${title}</h3><p>${esc(text)}</p></article>`).join('')}</div><aside class="planning-example"><h3>${c.exampleTitle}</h3><p>${esc(c.example)}</p></aside></section>
<section id="departure" class="guide-group planning-reading"><h2>${c.setupTitle}</h2><ol>${c.setup.map(text => `<li>${esc(text)}</li>`).join('')}</ol></section>
${renderFaqs(c.faqs, c.faqTitle)}
<section class="guide-group seo-related"><h2>${c.nextTitle}</h2><ul>${relatedPaths.map((path, i) => `<li><a class="text-link" href="${path}" lang="en">${c.related[i]} →</a></li>`).join('')}</ul></section>
<section class="guide-group planning-reading"><h2>${c.sourcesTitle}</h2><p>${esc(c.method)}</p><ul>${sources.map((source, i) => `<li>${sourceLink(source, [c.airaloSource, c.holaflySource, c.roamingSource][i])}</li>`).join('')}</ul></section>
</main><footer class="footer"><div class="container footer-inner"><span>PokiSky</span><a href="/affiliate-disclosure">${c.standards}</a></div></footer>
</body></html>\n`;
  fs.writeFileSync(page.file, html);
}
console.log('Generated two equivalent English/German Europe eSIM planning guides.');
