import type { Track } from '@/types/track';

const BASE_TRACK = {
  duration: 0,
  source: 'youtube' as const,
};

export const MOOD_SEEDS: Record<string, Track[]> = {
  chill: [
    { ...BASE_TRACK, id: 'jfKfPfyJRdk', videoId: 'jfKfPfyJRdk', title: 'lofi hip hop radio - beats to relax/study to', artist: 'Lofi Girl', albumArt: 'https://img.youtube.com/vi/jfKfPfyJRdk/maxresdefault.jpg' },
    { ...BASE_TRACK, id: '5qap5aO4i9A', videoId: '5qap5aO4i9A', title: 'lofi hip hop radio - beats to sleep/chill to', artist: 'Lofi Girl', albumArt: 'https://img.youtube.com/vi/5qap5aO4i9A/maxresdefault.jpg' },
    { ...BASE_TRACK, id: 'DWcJFNfaw9c', videoId: 'DWcJFNfaw9c', title: 'chill vibes 🍃 - lofi hip hop mix', artist: 'Chillhop Music', albumArt: 'https://img.youtube.com/vi/DWcJFNfaw9c/maxresdefault.jpg' },
  ],
  energy: [
    { ...BASE_TRACK, id: 'hTWKbfoikeg', videoId: 'hTWKbfoikeg', title: 'Nirvana - Smells Like Teen Spirit', artist: 'Nirvana', albumArt: 'https://img.youtube.com/vi/hTWKbfoikeg/maxresdefault.jpg' },
    { ...BASE_TRACK, id: 'kJQP7kiw5Fk', videoId: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', artist: 'Luis Fonsi', albumArt: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg' },
    { ...BASE_TRACK, id: 'fKopy74weus', videoId: 'fKopy74weus', title: 'Imagine Dragons - Thunder', artist: 'Imagine Dragons', albumArt: 'https://img.youtube.com/vi/fKopy74weus/maxresdefault.jpg' },
  ],
  focus: [
    { ...BASE_TRACK, id: 'tNkZsRW7h2c', videoId: 'tNkZsRW7h2c', title: 'Deep Focus Music To Improve Concentration', artist: 'Greenred Productions', albumArt: 'https://img.youtube.com/vi/tNkZsRW7h2c/maxresdefault.jpg' },
    { ...BASE_TRACK, id: 'NDjwTX50E18', videoId: 'NDjwTX50E18', title: 'Hans Zimmer - Interstellar Main Theme', artist: 'Hans Zimmer', albumArt: 'https://img.youtube.com/vi/NDjwTX50E18/maxresdefault.jpg' },
  ],
  romantic: [
    { ...BASE_TRACK, id: '2Vv-BfVoq4g', videoId: '2Vv-BfVoq4g', title: 'Ed Sheeran - Perfect', artist: 'Ed Sheeran', albumArt: 'https://img.youtube.com/vi/2Vv-BfVoq4g/maxresdefault.jpg' },
    { ...BASE_TRACK, id: 'lp-EO5I60KA', videoId: 'lp-EO5I60KA', title: 'Ed Sheeran - Thinking Out Loud', artist: 'Ed Sheeran', albumArt: 'https://img.youtube.com/vi/lp-EO5I60KA/maxresdefault.jpg' },
  ],
  workout: [
    { ...BASE_TRACK, id: 'btPJPFnesV4', videoId: 'btPJPFnesV4', title: 'Survivor - Eye Of The Tiger', artist: 'Survivor', albumArt: 'https://img.youtube.com/vi/btPJPFnesV4/maxresdefault.jpg' },
    { ...BASE_TRACK, id: 'CSvFpBOe8eY', videoId: 'CSvFpBOe8eY', title: 'System Of A Down - Chop Suey!', artist: 'System Of A Down', albumArt: 'https://img.youtube.com/vi/CSvFpBOe8eY/maxresdefault.jpg' },
  ],
  heartbroken: [
    { ...BASE_TRACK, id: '1k8craCGpgs', videoId: '1k8craCGpgs', title: 'Adele - Someone Like You', artist: 'Adele', albumArt: 'https://img.youtube.com/vi/1k8craCGpgs/maxresdefault.jpg' },
    { ...BASE_TRACK, id: 'JqOaoKlXk3M', videoId: 'JqOaoKlXk3M', title: 'Olivia Rodrigo - drivers license', artist: 'Olivia Rodrigo', albumArt: 'https://img.youtube.com/vi/JqOaoKlXk3M/maxresdefault.jpg' },
  ],
  sleepy: [
    { ...BASE_TRACK, id: 'q76bMs-NwRk', videoId: 'q76bMs-NwRk', title: 'Weightless - Marconi Union', artist: 'Marconi Union', albumArt: 'https://img.youtube.com/vi/q76bMs-NwRk/maxresdefault.jpg' },
  ],
  latenight: [
    { ...BASE_TRACK, id: 'MV_3Dpw-BRY', videoId: 'MV_3Dpw-BRY', title: 'Kavinsky - Nightcall', artist: 'Kavinsky', albumArt: 'https://img.youtube.com/vi/MV_3Dpw-BRY/maxresdefault.jpg' },
    { ...BASE_TRACK, id: 'pBMMFZeFlzg', videoId: 'pBMMFZeFlzg', title: 'The Weeknd - Blinding Lights', artist: 'The Weeknd', albumArt: 'https://img.youtube.com/vi/pBMMFZeFlzg/maxresdefault.jpg' },
  ],
  happy: [
    { ...BASE_TRACK, id: 'ZbZSe6N_BXs', videoId: 'ZbZSe6N_BXs', title: 'Pharrell Williams - Happy', artist: 'Pharrell Williams', albumArt: 'https://img.youtube.com/vi/ZbZSe6N_BXs/maxresdefault.jpg' },
    { ...BASE_TRACK, id: 'ru0K8uYEZWw', videoId: 'ru0K8uYEZWw', title: 'Justin Timberlake - CAN\'T STOP THE FEELING!', artist: 'Justin Timberlake', albumArt: 'https://img.youtube.com/vi/ru0K8uYEZWw/maxresdefault.jpg' },
  ]
};
