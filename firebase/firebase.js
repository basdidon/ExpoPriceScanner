import { initializeApp } from "firebase/app";
import { initializeFirestore} from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});