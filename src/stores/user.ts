import type { MinimumUser, User } from "@/types";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import { useCurrentUser, useFirestore } from "vuefire";

export const useUserStore = defineStore("user", () => {
  const currentUser = useCurrentUser();
  const db = useFirestore();

  const testUser: MinimumUser = {
    uid: "vPXGkittqYRQMr9Z8egtGBQ2rOp2",
    providerData: [
      {
        email: "masquerading_user@unwrapp.app",
        displayName: "Masqueraded User",
        phoneNumber: "8005882300",
        photoURL:
          "https://i.kym-cdn.com/photos/images/newsfeed/001/207/210/b22.jpg",
        providerId: "1",
        uid: "vPXGkittqYRQMr9Z8egtGBQ2rOp2",
      },
    ],
  };

  const masqueraded = ref(false);
  const user = computed(() =>
    masqueraded.value ? testUser : currentUser.value
  );

  const userInfo: Ref<User | null> = ref(null);

  const hasSpotify: ComputedRef<boolean> = computed(() => {
    if (!userInfo.value) return false;
    return !!userInfo.value.refresh_token;
  });

  const userLastUpdated: ComputedRef<string> = computed(() =>
    !userInfo.value
      ? "Unknown"
      : new Date(userInfo.value.last_updated).toLocaleString()
  );

  const uniquePlayCount = ref(0);
  const uniqueSongCount = ref(0);
  const uniqueAlbumCount = ref(0);
  const uniqueArtistCount = ref(0);

  async function getUserInfo() {
    console.log("getting user");
    const userData = await getDoc(doc(db, "User", user.value?.uid || ""));
    userInfo.value = { ...userData.data(), id: userData.id } as User;
  }

  async function getCounts() {
    const collPlay = collection(db, "User", user.value?.uid ?? "", "Plays");
    uniquePlayCount.value = (await getCountFromServer(collPlay)).data().count;

    const collSong = collection(db, "User", user.value?.uid ?? "", "UserSongs");
    uniqueSongCount.value = (await getCountFromServer(collSong)).data().count;

    const collAlbum = collection(
      db,
      "User",
      user.value?.uid ?? "",
      "UserAlbums"
    );
    uniqueAlbumCount.value = (await getCountFromServer(collAlbum)).data().count;

    const collArtist = collection(
      db,
      "User",
      user.value?.uid ?? "",
      "UserArtists"
    );
    uniqueArtistCount.value = (
      await getCountFromServer(collArtist)
    ).data().count;
  }

  function enableMasqueraded() {
    masqueraded.value = true;
  }

  function disableMasqueraded() {
    masqueraded.value = false;
  }

  function toggleMasqueraded() {
    masqueraded.value = !masqueraded.value;
  }

  async function toggleAccountPublic() {
    if (userInfo.value && user.value) {
      await updateDoc(doc(db, "User", user.value.uid), {
        public: !userInfo.value.public,
      });
      await getUserInfo();
    }
  }

  watch(
    user,
    async () => {
      if (user.value) {
        await getUserInfo();
      }
    },
    { immediate: true }
  );

  return {
    user,
    userInfo,
    hasSpotify,
    userLastUpdated,
    getUserInfo,
    enableMasqueraded,
    disableMasqueraded,
    toggleMasqueraded,
    masqueraded,
    toggleAccountPublic,
    getCounts,
    uniquePlayCount,
    uniqueSongCount,
    uniqueAlbumCount,
    uniqueArtistCount,
  };
});
