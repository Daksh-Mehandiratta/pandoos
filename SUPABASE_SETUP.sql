-- ============================================================
-- PANDOOS SUPABASE SETUP SQL
-- Paste this entire file into the Supabase Dashboard:
--   Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- 1. LIKED SONGS
-- ─────────────────────────────────────────────────────────────
create table if not exists liked_songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  video_id text not null,
  track_data jsonb not null,
  liked_at timestamptz default now(),
  unique(user_id, video_id)
);

alter table liked_songs enable row level security;

create policy "Users manage own liked songs"
  on liked_songs
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for fast lookup
create index if not exists idx_liked_songs_user on liked_songs(user_id, liked_at desc);


-- 2. PLAYLISTS
-- ─────────────────────────────────────────────────────────────
create table if not exists playlists (
  id text primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text default '',
  cover_url text default '',
  is_public boolean default false,
  track_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table playlists enable row level security;

create policy "Users manage own playlists"
  on playlists
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_playlists_user on playlists(user_id, updated_at desc);


-- 3. PLAYLIST TRACKS
-- ─────────────────────────────────────────────────────────────
create table if not exists playlist_tracks (
  id uuid primary key default gen_random_uuid(),
  playlist_id text references playlists(id) on delete cascade not null,
  track_data jsonb not null,
  position int default 0,
  added_at timestamptz default now()
);

alter table playlist_tracks enable row level security;

create policy "Users manage their playlist tracks"
  on playlist_tracks
  using (
    exists (
      select 1 from playlists
      where playlists.id = playlist_tracks.playlist_id
        and playlists.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from playlists
      where playlists.id = playlist_tracks.playlist_id
        and playlists.user_id = auth.uid()
    )
  );

create index if not exists idx_playlist_tracks_playlist on playlist_tracks(playlist_id, position);


-- 4. FOLLOWED ARTISTS
-- ─────────────────────────────────────────────────────────────
create table if not exists followed_artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  artist_id text not null,
  artist_data jsonb not null,
  followed_at timestamptz default now(),
  unique(user_id, artist_id)
);

alter table followed_artists enable row level security;

create policy "Users manage own followed artists"
  on followed_artists
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_followed_artists_user on followed_artists(user_id, followed_at desc);


-- 5. NOW PLAYING (Cross-Device Sync)
-- ─────────────────────────────────────────────────────────────
create table if not exists now_playing (
  user_id uuid primary key references auth.users,
  track_data jsonb,
  is_playing boolean default false,
  progress float default 0,
  device_name text default 'Web',
  updated_at timestamptz default now()
);

alter table now_playing enable row level security;

create policy "Users manage own now playing"
  on now_playing
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ============================================================
-- ENABLE REALTIME (required for cross-device sync to work)
-- Run each line separately if needed
-- ============================================================
alter publication supabase_realtime add table liked_songs;
alter publication supabase_realtime add table playlists;
alter publication supabase_realtime add table playlist_tracks;
alter publication supabase_realtime add table followed_artists;
alter publication supabase_realtime add table now_playing;
