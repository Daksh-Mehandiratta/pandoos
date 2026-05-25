-- ============================================================
-- PANDOOS — ADD ONLY THESE 2 NEW TABLES
-- Your existing playlists, playlist_tracks, liked_songs are fine.
-- Just run this file to add followed_artists and now_playing.
-- ============================================================

-- 4. FOLLOWED ARTISTS (NEW)
create table if not exists followed_artists (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  artist_id text not null,
  name text not null,
  thumbnail_url text,
  followed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, artist_id)
);

create index if not exists followed_artists_user_id_idx on followed_artists(user_id);
alter table followed_artists disable row level security;


-- 5. NOW PLAYING — Cross-Device Sync (NEW)
create table if not exists now_playing (
  user_id text primary key,
  video_id text,
  title text,
  artist text,
  album_art text,
  is_playing boolean default false,
  progress float default 0,
  device_name text default 'Web',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table now_playing disable row level security;


-- ============================================================
-- ENABLE REALTIME (for cross-device sync to work instantly)
-- Run each line separately if you get errors
-- ============================================================
alter publication supabase_realtime add table liked_songs;
alter publication supabase_realtime add table playlists;
alter publication supabase_realtime add table playlist_tracks;
alter publication supabase_realtime add table followed_artists;
alter publication supabase_realtime add table now_playing;
