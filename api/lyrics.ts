export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title');
  const artist = searchParams.get('artist');

  if (!title || !artist) {
    return new Response(JSON.stringify({ error: 'Missing title or artist' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const lrcUrl = new URL('https://lrclib.net/api/get');
    lrcUrl.searchParams.set('track_name', title);
    lrcUrl.searchParams.set('artist_name', artist);

    const res = await fetch(lrcUrl.toString(), {
      headers: {
        'User-Agent': 'PandoosMusic/1.0 (https://github.com)',
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return new Response(JSON.stringify({ plainLyrics: '', syncedLyrics: null }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      }
      throw new Error(`LRCLIB returned ${res.status}`);
    }

    const data = await res.json();
    return new Response(JSON.stringify({
      plainLyrics: data.plainLyrics,
      syncedLyrics: data.syncedLyrics,
    }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=86400',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
