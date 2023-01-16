import { defineStore } from "pinia";
import { ref, watch, type Ref } from "vue";
import type { Album, PlayItem, Song, Artist } from "@/types";
import { getDoc, type QueryDocumentSnapshot } from "firebase/firestore";
import { cleanRef } from "@/scripts/firebase";
import { getStoreItemInternalPaginated } from "@/scripts/helpers/store";

export const useMostListenedStore = defineStore("mostListened", () => {
  const mostListenedSongsSnapshot: Ref<QueryDocumentSnapshot<Song>[] | null> =
    ref(null);

  const mostListenedSongs: Ref<Song[] | null> = ref(null);

  watch(mostListenedSongsSnapshot, (newVal) => {
    if (!newVal) {
      mostListenedSongs.value = null;
      return;
    }
    mostListenedSongs.value = newVal.map((v) => v.data());
  });

  async function getMostListenedSongsInternal() {
    const newSnapshot = await getStoreItemInternalPaginated<Song>(
      mostListenedSongsSnapshot,
      5,
      "UserSongs",
      ["listen_count", "desc"]
    );
    mostListenedSongsSnapshot.value = newSnapshot;
  }

  async function getMostListenedSongs() {
    if (mostListenedSongs.value) {
      return;
    } else {
      getMostListenedSongsInternal();
    }
  }

  async function refreshMostListenedSongs() {
    mostListenedSongs.value = [];
    await getMostListenedSongsInternal();
  }

  async function getMoreMostListenedSongs() {
    await getMostListenedSongsInternal();
  }

  async function getSongPlays(songId: string) {
    if (!mostListenedSongs.value) return;
    const index = mostListenedSongs.value.findIndex((s) => s.id === songId);
    if (index === -1) return;
    if (mostListenedSongs.value[index].plays) {
      console.log("already has plays");
      return;
    }
    const song = mostListenedSongs.value[index];
    const plays = await Promise.all(
      song.listens.map(async (l) => {
        return (await getDoc(cleanRef(l))).data() as PlayItem;
      })
    );
    mostListenedSongs.value[index].plays = plays.sort((a, b) =>
      a.played_at > b.played_at ? -1 : 1
    );
  }

  // ALBUMS

  const mostListenedAlbumsSnapshot: Ref<QueryDocumentSnapshot<Album>[] | null> =
    ref(null);

  const mostListenedAlbums: Ref<Album[] | null> = ref(null);

  watch(mostListenedAlbumsSnapshot, (newVal) => {
    if (!newVal) {
      mostListenedAlbums.value = null;
      return;
    }
    mostListenedAlbums.value = newVal.map((v) => ({ ...v.data(), oid: v.id }));
  });

  async function getMostListenedAlbumsInternal() {
    const newSnapshot = await getStoreItemInternalPaginated<Album>(
      mostListenedAlbumsSnapshot,
      5,
      "UserAlbums",
      ["listen_count", "desc"]
    );
    mostListenedAlbumsSnapshot.value = newSnapshot;
  }

  async function getMostListenedAlbums() {
    if (mostListenedAlbums.value) {
      return;
    } else {
      getMostListenedAlbumsInternal();
    }
  }

  async function getAlbumPlays(albumId: string) {
    if (!mostListenedAlbums.value) return;
    const index = mostListenedAlbums.value.findIndex((a) => a.id === albumId);
    if (index === -1) return;
    if (mostListenedAlbums.value[index].plays) {
      console.log("already has plays");
      return;
    }
    const album = mostListenedAlbums.value[index];
    const plays = await Promise.all(
      album.listens.map(async (l) => {
        return (await getDoc(cleanRef(l))).data() as PlayItem;
      })
    );
    mostListenedAlbums.value[index].plays = plays.sort((a, b) =>
      a.played_at > b.played_at ? -1 : 1
    );
  }

  async function getMoreMostListenedAlbums() {
    await getMostListenedAlbumsInternal();
  }

  // ARTISTS

  const mostListenedArtistsSnapshot: Ref<
    QueryDocumentSnapshot<Artist>[] | null
  > = ref(null);

  const mostListenedArtists: Ref<Artist[] | null> = ref(null);

  watch(mostListenedArtistsSnapshot, (newVal) => {
    if (!newVal) {
      mostListenedArtists.value = null;
      return;
    }
    mostListenedArtists.value = newVal.map((v) => ({ ...v.data(), oid: v.id }));
  });

  async function getMostListenedArtistsInternal() {
    const newSnapshot = await getStoreItemInternalPaginated<Artist>(
      mostListenedArtistsSnapshot,
      5,
      "UserArtists",
      ["listen_count", "desc"]
    );
    mostListenedArtistsSnapshot.value = newSnapshot;
  }

  async function getMostListenedArtists() {
    if (mostListenedArtists.value) {
      return;
    } else {
      getMostListenedArtistsInternal();
    }
  }

  async function getArtistPlays(artistId: string) {
    if (!mostListenedArtists.value) return;
    const index = mostListenedArtists.value.findIndex((a) => a.id === artistId);
    if (index === -1) return;
    if (mostListenedArtists.value[index].plays) {
      console.log("already has plays");
      return;
    }
    const artist = mostListenedArtists.value[index];
    const plays = await Promise.all(
      artist.listens.map(async (l) => {
        return (await getDoc(cleanRef(l))).data() as PlayItem;
      })
    );
    mostListenedArtists.value[index].plays = plays.sort((a, b) =>
      a.played_at > b.played_at ? -1 : 1
    );
  }

  async function getMoreMostListenedArtists() {
    await getMostListenedArtistsInternal();
  }

  return {
    mostListenedSongs,
    getMostListenedSongs,
    refreshMostListenedSongs,
    getMoreMostListenedSongs,
    getSongPlays,
    mostListenedAlbums,
    getMostListenedAlbums,
    getAlbumPlays,
    getMoreMostListenedAlbums,
    mostListenedArtists,
    getMostListenedArtists,
    getArtistPlays,
    getMoreMostListenedArtists,
  };
});
