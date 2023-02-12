import type { DocumentReference } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";

type ValueOf<T> = T[keyof T];

export type PlayItem = {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  album: { name: string; id: string; image: string };
  played_at: string;
  duration_ms: number;
  popularity: number;
  session?: DocumentReference;
};

export type Play = PlayItem & {
  id: string;
  stats: Stats;
};

export type User = {
  last_cursor?: string;
  refresh_token: string;
  created_date: string;
  last_updated: string;
  id: string;
  code_verifier: string;
  auth_code: string;
  spotify_state: string;
  public: boolean;
  name?: string;
  total_listen_time_ms: number;
  total_plays: number;
  spotify_scopes: string;
  available_months: AvailableMonth[];
};

interface Stats {
  playedAtFormatted: string;
}

export type SessionItem = {
  start_time: string;
  end_time: string;
  latest_play: DocumentReference;
  play_references: DocumentReference[];
  duration_ms: number;
};

export type Session = SessionItem & {
  id: string;
};

export type SessionDisplay = Session & {
  durationReadable?: string;
  plays?: PlayItem[];
  line: {
    top: string;
    height: string;
  };
};

type ListenInfo = {
  uid?: string;
  listens: DocumentReference[];
  listen_count: number;
  plays?: PlayItem[];
};

export type Song = SpotifyApi.TrackObjectFull & ListenInfo;

export type Album = SpotifyApi.AlbumObjectSimplified & ListenInfo;

export type Artist = SpotifyApi.ArtistObjectSimplified & ListenInfo;

export type ArtistFull = SpotifyApi.ArtistObjectFull & ListenInfo;

export type Month = {
  id: number;
  total_listen_time_ms: number;
  total_plays: number;
  total_songs: number;
  total_albums: number;
  total_artists: number;
  avg_minutes_per_day: number;
  most_listened_song: Song;
  most_listened_album: Album;
  most_listened_artist: ArtistFull;
  most_listened_day: {
    day: string;
    listen_time_ms: number;
  };
};

export type AvailableMonth = {
  collection: string;
  id: number;
  month: number;
  month_name: string;
};

export type Nullable<T> = T | null | undefined;

export type MinimumUser = { uid: string } & Partial<FirebaseUser>;

export const SpotifyScopeType = {
  RECENTLY_PLAYED: "user-read-recently-played",
  CREATE_PLAYLIST:
    "playlist-modify-private,playlist-modify-public,ugc-image-upload",
} as const;
export type SpotifyScopeType = ValueOf<typeof SpotifyScopeType>;
