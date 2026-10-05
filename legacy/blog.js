/**
 * Backward compatibility forwarder.
 * PokiSky now uses /assets/js/articles.js and /assets/js/main.js
 */
if (typeof blogArticles === 'undefined') {
  // If not already loaded via HTML script tags, load articles data
  const script = document.createElement('script');
  script.src = 'assets/js/articles.js';
  script.onload = () => {
    const mainScript = document.createElement('script');
    mainScript.src = 'assets/js/main.js';
    document.body.appendChild(mainScript);
  };
  document.head.appendChild(script);
}
