import { useUserStore } from "@/stores/user";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";
import { useFirestore } from "vuefire";

export async function getStoreItemInternalPaginated<T>(
  snapshot: Ref<QueryDocumentSnapshot<T>[] | null>,
  pageSize: number,
  itemCollection: string,
  order: [keyof T & string, "asc" | "desc"]
) {
  const db = useFirestore();
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  if (user.value) {
    console.log("getting items " + itemCollection);
    const page = snapshot.value?.at(-1);
    const qConstraints = [
      orderBy(order[0], order[1]),
      limit(pageSize),
      ...(page ? [startAfter(page)] : []),
    ];
    const q = query(
      collection(db, "User", user.value.uid ?? "", itemCollection),
      ...qConstraints
    );
    const res = await getDocs(q);
    console.log(res);
    return [
      ...(snapshot.value ?? []),
      ...res.docs,
    ] as QueryDocumentSnapshot<T>[];
  }
  return snapshot.value;
}
