const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {localDate, nextPost} = require('./editorial-publishing');
test('publication clock follows Sao Paulo across UTC midnight', () => {
  assert.equal(localDate(new Date('2026-10-12T02:59:00Z')), '2026-10-11');
  assert.equal(localDate(new Date('2026-10-12T03:00:00Z')), '2026-10-12');
});
test('daily release is idempotent, excludes future work and catches up one post at a time', () => {
  const posts = [{id:1, scheduledFor:'2026-10-11', publishedAt:'2026-10-11'}, {id:3, scheduledFor:'2026-10-13'}, {id:2, scheduledFor:'2026-10-12'}];
  assert.equal(nextPost(posts,'2026-10-11'), null);
  assert.equal(nextPost(posts,'2026-10-10'), null);
  assert.equal(nextPost(posts,'2026-10-20').id, 2);
  posts[2].publishedAt = '2026-10-20';
  assert.equal(nextPost(posts,'2026-10-20'), null);
  assert.equal(nextPost(posts,'2026-10-21').id, 3);
});
test('all prepared releases build valid public pages without early exposure', () => {
  const checkout = fs.mkdtempSync(path.join(os.tmpdir(), 'pokisky-release-test-'));
  try {
    const root = process.cwd();
    fs.cpSync(root, checkout, {recursive:true, filter: source => !['.git', 'node_modules', '.codex', '.agents', '.aws', '.cursor'].includes(path.relative(root,source).split(path.sep)[0])});
    fs.symlinkSync(path.join(root,'node_modules'), path.join(checkout,'node_modules'), 'dir');
    const file = path.join(checkout,'content/editorial-posts.json');
    const posts = JSON.parse(fs.readFileSync(file,'utf8'));
    // Replay the prepared sequence even after real scheduled runs have released it.
    const initial = posts.slice().sort((a,b) => a.scheduledFor.localeCompare(b.scheduledFor))[0];
    for (const post of posts) {
      post.publishedAt = post === initial ? post.scheduledFor : null;
      if (post !== initial) fs.rmSync(path.join(checkout,post.file),{force:true});
    }
    const configFile = path.join(checkout,'vercel.json');
    const config = JSON.parse(fs.readFileSync(configFile,'utf8'));
    const futurePaths = posts.filter(post => !post.publishedAt).map(post => '/' + post.file.replace(/\.html$/,''));
    config.redirects = config.redirects.filter(redirect => !futurePaths.includes(redirect.destination));
    fs.writeFileSync(configFile,JSON.stringify(config,null,2)+'\n');
    for (const today of posts.filter(post => !post.publishedAt).map(post => post.scheduledFor).sort()) {
      const post = nextPost(posts,today);
      assert.ok(post);
      post.publishedAt = today;
      fs.writeFileSync(file, JSON.stringify(posts,null,2)+'\n');
      execFileSync('npm',['run','seo:build'], {cwd:checkout,stdio:'pipe'});
      execFileSync('npm',['run','seo:check'], {cwd:checkout,stdio:'pipe'});
      assert.equal(nextPost(posts,today), null);
    }
    assert.equal(nextPost(posts,'2026-10-15'), null);
  } finally { fs.rmSync(checkout,{recursive:true,force:true}); }
});
