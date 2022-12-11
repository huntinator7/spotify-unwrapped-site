import SpotifyWebApi from "spotify-web-api-node";
// @ts-ignore
import SpotifyWebApiServer from "spotify-web-api-node/src/server-methods";

(
  SpotifyWebApi as unknown as { _addMethods: (fncs: unknown) => void }
)._addMethods(SpotifyWebApiServer);

export const spotifyApi = new SpotifyWebApi({
  redirectUri: "http://localhost:5173/callback",
  clientId: "b777b1eb8ed24764b9d96adc9261beca",
});