import { initializeApp } from "firebase/app";
const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const firebaseAuthDomain = import.meta.env.VITE_AUTH_DOMAIN;
const firebaseMessagingSendersId = import.meta.VITE_MESSAGING_SENDER_ID;
const firebaseAppId = import.meta.VITE_APP_ID;
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: "travel-freaks",
  storageBucket: "travel-freaks.appspot.com",
  messagingSenderId: firebaseMessagingSendersId,
  appId: firebaseAppId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
