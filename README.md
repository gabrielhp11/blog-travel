# Northstar Trips

A minimal travel blog built for direct affiliate conversion using GitHub Pages.

## Structure

- `index.html` — landing page and article grid
- `styles.css` — visual system and layout
- `script.js` — article data and affiliate link builder

## How to publish

1. Push this repository to GitHub.
2. Open the repository settings.
3. Go to Pages.
4. Select the default branch and root folder (`/`).
5. Save the site and wait for the GitHub Pages URL.

## Hooks for Travel Payouts

Replace `YOUR_MARKER_ID` in `script.js` with your affiliate marker.

Example:

```js
const AFFILIATE_MARKER = 'YOUR_MARKER_ID';
```

Then each article button redirects through Travel Payouts before the booking page.

## Notes

- Content is in English.
- Design is minimal and direct.
- Affiliate links are structured for purchase-driven traffic.
- You can swap the destination URLs for your exact offer pages.

## Example redirect

```text
https://www.travelpayouts.com/redirect/?marker=YOUR_MARKER_ID&url=https%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Fss%3DParis
```
