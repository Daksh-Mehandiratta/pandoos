export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const cacheKey = `pandoos:trending`;
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const ytApiKey = process.env.YOUTUBE_API_KEY;

  if (!ytApiKey) {
    return new Response(JSON.stringify({ error: 'Missing YT API key' }), { status: 500 });
  }

  // 1. Try Cache First
  if (upstashUrl && upstashToken) {
    try {
      const cacheRes = await fetch(`${upstashUrl}/get/${encodeURIComponent(cacheKey)}`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
      });
      if (cacheRes.ok) {
        const cacheData = await cacheRes.json();
        if (cacheData.result) {
          const items = typeof cacheData.result === 'string' ? JSON.parse(cacheData.result) : cacheData.result;
          return new Response(JSON.stringify({ items, cached: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          });
        }
      }
    } catch (e) {
      console.error('Redis read failed:', e);
    }
  }

  // 2. Fetch from YouTube
  try {
    const ytUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    ytUrl.searchParams.set('part', 'snippet');
    ytUrl.searchParams.set('chart', 'mostPopular');
    ytUrl.searchParams.set('videoCategoryId', '10'); // Music category
    ytUrl.searchParams.set('maxResults', '15');
    ytUrl.searchParams.set('key', ytApiKey);

    let ytRes = await fetch(ytUrl.toString());

    // Fallback logic for secondary key if primary fails with 403 (Quota Exceeded)
    if (!ytRes.ok && ytRes.status === 403 && process.env.YOUTUBE_API_KEY_2) {
      console.warn('Primary API Key failed with 403. Trying backup key...');
      ytUrl.searchParams.set('key', process.env.YOUTUBE_API_KEY_2);
      ytRes = await fetch(ytUrl.toString());
    }

    if (!ytRes.ok) throw new Error(`YouTube API returned ${ytRes.status}`);

    const data = await ytRes.json();
    
    // Map videos API shape to look like search shape for consistency
    const items = data.items.map((item: any) => ({
      id: { videoId: item.id },
      snippet: item.snippet
    }));

    // 3. Cache it (Trending updates slowly, cache for 12 hours)
    if (upstashUrl && upstashToken && items.length > 0) {
      fetch(`${upstashUrl}/set/${encodeURIComponent(cacheKey)}?ex=43200`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      }).catch((e) => console.error('Redis write failed:', e));
    }

    return new Response(JSON.stringify({ items, cached: false }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=43200, stale-while-revalidate=21600',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
