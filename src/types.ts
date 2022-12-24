import type { DocumentReference } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";

export type PlayItem = SpotifyApi.PlayHistoryObject;

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

export type Nullable<T> = T | null | undefined;

export type MinimumUser = { uid: string } & Partial<FirebaseUser>;
