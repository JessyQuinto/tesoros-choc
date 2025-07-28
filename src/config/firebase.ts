import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIO_k6kvxwkj38Bv2QwvpovWkC_QhL0SI",
  authDomain: "chocomarketlogin.firebaseapp.com",
  projectId: "chocomarketlogin",
  storageBucket: "chocomarketlogin.firebasestorage.app",
  messagingSenderId: "162904311998",
  appId: "1:162904311998:web:6c4935669b12795fabb6ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;