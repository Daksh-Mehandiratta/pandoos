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

/**
 * Parse LRC format lyrics into timed lines.
 * LRC format: [mm:ss.xx] lyric line
 */
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

/**
 * Fetch lyrics from LRCLIB (free, no API key, synced LRC format supported).
 * Falls back to plain lyrics if synced are unavailable.
 * Server-proxied via /api/lyrics to avoid CORS issues in Capacitor WebView.
 */
export async function fetchLyrics(
  title: string,
  artist: string
): Promise<LyricsResult> {
  try {
    const res = await fetch(
      `/api/lyrics?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`
    );

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
