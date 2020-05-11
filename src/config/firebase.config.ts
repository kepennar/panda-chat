import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
};

firebase.initializeApp(firebaseConfig);
export const functions = firebase.functions();
export const db = firebase.firestore();

export const initDb = () => db.enablePersistence({ synchronizeTabs: true });
