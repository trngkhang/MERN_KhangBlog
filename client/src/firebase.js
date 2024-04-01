// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "khangblog-ef2ac.firebaseapp.com",
  projectId: "khangblog-ef2ac",
  storageBucket: "khangblog-ef2ac.appspot.com",
  messagingSenderId: "40738910819",
  appId: "1:40738910819:web:9554223638972f0dfffe56",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
