export type Track = SpotifyApi.PlayHistoryObject & {
  id: string;
  stats: Record<string, string>;
};

export type User = {
  last_cursor?: string;
  refresh_token: string;
  created_date: string;
  last_updated: string;
  id: string;
  code_verifier: string;
  auth_code: string;
}
