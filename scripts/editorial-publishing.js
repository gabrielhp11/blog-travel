const timezone = 'America/Sao_Paulo';

function localDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(now);
  const get = name => parts.find(part => part.type === name).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function nextPost(posts, today = localDate()) {
  if (posts.some(post => post.publishedAt === today)) return null;
  return posts.filter(post => !post.publishedAt && post.scheduledFor <= today)
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor) || a.id - b.id)[0] || null;
}

module.exports = {timezone, localDate, nextPost};
