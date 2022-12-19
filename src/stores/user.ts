import type { User } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import { useCurrentUser, useFirestore } from "vuefire";

export const useUserStore = defineStore("user", () => {
  const user = useCurrentUser();

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

  const getUserInfo = async (user: any): Promise<User> => {
    console.log("getting user");
    const db = useFirestore();
    const userData = await getDoc(doc(db, "User", user.value?.uid || ""));
    return { ...userData.data(), id: userData.id } as User;
  };

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
  };
});
