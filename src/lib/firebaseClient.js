import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA8RlaPDhvE6z_BT29COQY0dksjuU0qpNY",
  authDomain: "bank-f0af4.firebaseapp.com",
  projectId: "bank-f0af4",
  storageBucket: "bank-f0af4.firebasestorage.app",
  messagingSenderId: "856312739454",
  appId: "1:856312739454:web:396682602d559812110a2f",
  measurementId: "G-ZZ4GRPB6E8",
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);