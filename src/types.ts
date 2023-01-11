import type { DocumentReference } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";

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
  listen_count?: number;
};

export type Song = SpotifyApi.TrackObjectFull & ListenInfo;

export type Album = SpotifyApi.AlbumObjectSimplified & ListenInfo;

export type Nullable<T> = T | null | undefined;

export type MinimumUser = { uid: string } & Partial<FirebaseUser>;

// This utility lets T be indexed by any (string) key
type Indexify<T> = T & { [str: string]: undefined };

// Where the magic happens ✨
export type AllFields<T, R> = {
  [K in keyof (T & R) & string]: Indexify<T | R>[K];
};
