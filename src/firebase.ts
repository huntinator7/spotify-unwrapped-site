import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { firebaseConfig } from "./config";

export const firebaseApp = initializeApp(firebaseConfig);

export const cloudFunctions = getFunctions(firebaseApp);
