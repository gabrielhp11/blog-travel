# Search Engine Setup

## Google Search Console

The homepage already contains the Google site verification meta tag, and the matching verification HTML file is kept at the site root. These prove site ownership when added to the matching Search Console property; they do not submit the sitemap automatically.

After the latest version is deployed:

1. Open [Google Search Console](https://search.google.com/search-console/).
2. Add the URL-prefix property `https://blog-travel-eight.vercel.app/`.
3. Verify ownership with the existing HTML file or the existing meta tag. Keep the selected verification method in the deployed site.
4. Open **Sitemaps**, enter `sitemap.xml`, and submit it.
5. Use **URL inspection** for the homepage and a few published guides to request indexing and check whether Google can fetch each page.

To refresh the sitemap after page metadata changes, run `npm run seo:sitemap` and deploy the updated `sitemap.xml`.

## Current crawl files

- `robots.txt` allows crawling and advertises the sitemap.
- `sitemap.xml` lists the home page, disclosure page, and public catalog pages with self-referencing canonicals and no `noindex` directive.
- Pages with unconfirmed offer details remain crawlable but carry `noindex, follow`; do not block them in `robots.txt`, because search engines need to fetch the page to see that directive.

Search engines decide independently whether and when to index a submitted page. A successful sitemap submission is not an indexing or ranking guarantee.

## Bing Webmaster Tools

The site has been added to Bing Webmaster Tools. The verification file `BingSiteAuth.xml` is now in the project root. After deploying it, return to the Bing verification panel and choose **Verify**. Then open **Sitemaps** for this site and submit `https://blog-travel-eight.vercel.app/sitemap.xml`.

The Bing account was created using Google sign-in. Search Console data was not imported into Bing; importing it would require a separate Google data-access authorization.

## Deployment requirement

Search Console currently reports that it could not read the submitted sitemap. The updated local sitemap and the Bing verification file must be deployed at the production domain before their respective webmaster tools can read them. After deployment, confirm that `https://blog-travel-eight.vercel.app/sitemap.xml` opens as XML in a browser, then resubmit it in Google Search Console and submit it to Bing.
