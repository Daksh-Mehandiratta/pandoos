interface LyricsResult {
  plain: string;
  synced: LyricsLine[] | null;
}

interface LyricsLine {
  time: number;   // milliseconds
  text: string;
}

interface LRCLIBResponse {
  plainLyrics?: string;
  syncedLyrics?: string;
}

function parseLRC(lrc: string): LyricsLine[] {
  const lines: LyricsLine[] = [];
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(lrc)) !== null) {
    const mins = parseInt(match[1] ?? '0', 10);
    const secs = parseInt(match[2] ?? '0', 10);
    const ms = parseInt((match[3] ?? '0').padEnd(3, '0'), 10);
    const text = (match[4] ?? '').trim();
    if (text) {
        lines.push({ time: (mins * 60 + secs) * 1000 + ms, text });
    }
  }

  return lines.sort((a, b) => a.time - b.time);
}

export async function fetchLyrics(
  title: string,
  artist: string
): Promise<LyricsResult> {
  try {
    // In dev, bypass proxy so `npm run dev` works natively.
    // In prod, Capacitor might block cross-origin, so use the proxy.
    const url = import.meta.env.DEV
      ? `https://lrclib.net/api/get?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`
      : `/api/lyrics?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;

    const res = await fetch(url, {
      headers: import.meta.env.DEV ? { 'User-Agent': 'PandoosMusic/1.0' } : undefined
    });

    if (!res.ok) return { plain: '', synced: null };

    const data = (await res.json()) as LRCLIBResponse;
    const synced = data.syncedLyrics ? parseLRC(data.syncedLyrics) : null;

    return {
      plain: data.plainLyrics ?? '',
      synced,
    };
  } catch {
    return { plain: '', synced: null };
  }
}

export type { LyricsResult, LyricsLine };
