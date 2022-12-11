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

  async function setUserInfo() {
    if (!user.value) return null;
    const db = useFirestore();
    const userData = await getDoc(doc(db, "User", user.value.uid));
    userInfo.value = { ...userData.data(), id: userData.id } as User;
  }

  watch(user.value as Object, () => {
    setUserInfo();
  });

  return {
    user,
    userInfo,
    hasSpotify,
    setUserInfo,
  };
});
