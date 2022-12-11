import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import type { User as UserType } from "@/types";

export const getUserInfo = async (user: any): Promise<UserType> => {
  console.log("getting user");
  const db = useFirestore();
  const userData = await getDoc(doc(db, "User", user.value?.uid || ""));
  return { ...userData.data(), id: userData.id } as UserType;
};
