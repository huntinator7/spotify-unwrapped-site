import {
  doc,
  DocumentReference,
  getDoc,
  type DocumentData,
} from "firebase/firestore";
import { useFirestore } from "vuefire";
import type { User } from "@/types";
import { toRaw } from "vue";

export const getUserInfo = async (user: any): Promise<User> => {
  console.log("getting user");
  const db = useFirestore();
  const userData = await getDoc(doc(db, "User", user.value?.uid || ""));
  return { ...userData.data(), id: userData.id } as User;
};

export function cleanRef(ref: DocumentReference<DocumentData>) {
  const dereffedStore = toRaw(ref.firestore);
  const [path, ...pathSegments] = ref.path.split("/");
  return doc(dereffedStore, path, ...pathSegments);
}
