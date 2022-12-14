import SpotifyWebApi from "spotify-web-api-node";
// @ts-ignore
import SpotifyWebApiServer from "spotify-web-api-node/src/server-methods";
import { allowedDomains } from "./config";

(
  SpotifyWebApi as unknown as { _addMethods: (fncs: unknown) => void }
)._addMethods(SpotifyWebApiServer);

const redirectUri = allowedDomains.includes(window.location.origin)
  ? `${window.location.origin}/callback`
  : "none";

export const spotifyApi = new SpotifyWebApi({
  redirectUri,
  clientId: "b777b1eb8ed24764b9d96adc9261beca",
});
