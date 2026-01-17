import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzXo74cP_NyWYowOJSSqDhbKMECQ9wjjE",
  authDomain: "sistema-comandas-f9b26.firebaseapp.com",
  projectId: "sistema-comandas-f9b26",
  storageBucket: "sistema-comandas-f9b26.appspot.com",
  messagingSenderId: "99812665452",
  appId: "1:99812665452:web:b7a37fdb43ac46aa0d049",
  measurementId: "G-K8J6EME97"  
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);  
export default app;