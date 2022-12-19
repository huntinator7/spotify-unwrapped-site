import type { DocumentReference } from "firebase/firestore";

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
