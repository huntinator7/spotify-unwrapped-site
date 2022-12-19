import type { User } from "@/types";
import type { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import { useCurrentUser, useFirestore } from "vuefire";

export const useUserStore = defineStore("user", () => {
  const currentUser = useCurrentUser();

  const testUser: Partial<FirebaseUser> = {
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

  const getUserInfo = async (
    user: Ref<Partial<FirebaseUser> | null | undefined>
  ): Promise<User> => {
    console.log("getting user");
    const db = useFirestore();
    const userData = await getDoc(doc(db, "User", user.value?.uid || ""));
    return { ...userData.data(), id: userData.id } as User;
  };

  function enableMasqueraded() {
    masqueraded.value = true;
  }

  function disableMasqueraded() {
    masqueraded.value = false;
  }

  function toggleMasqueraded() {
    masqueraded.value = !masqueraded.value;
  }

  watch(
    user,
    async () => {
      if (user.value) {
        userInfo.value = await getUserInfo(user);
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
  };
});
