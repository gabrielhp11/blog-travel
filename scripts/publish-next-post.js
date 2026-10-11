const fs = require('node:fs');
const {localDate, nextPost} = require('./editorial-publishing');
const file = 'content/editorial-posts.json';
const posts = JSON.parse(fs.readFileSync(file, 'utf8'));
const today = localDate();
const post = nextPost(posts, today);
if (process.argv.slice(2).some(arg => arg !== '--dry-run')) throw new Error('Only --dry-run is supported; production dates come from the Sao Paulo clock.');
if (!post) {
  console.log(`No publication due on ${today}; at most one editorial post per local day.`);
} else if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify({today, id: post.id, title: post.title, sourceProductId: post.sourceProductId, scheduledFor: post.scheduledFor}));
} else {
  post.publishedAt = today;
  fs.writeFileSync(file, JSON.stringify(posts, null, 2) + '\n');
  console.log(`Released ${post.title} on ${today}. Run seo:build and seo:check before commit/push.`);
}
