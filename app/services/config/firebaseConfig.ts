import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCUbg8lGxn6OJugtQ_IVCdYxjCRS-LWIyo",
  authDomain: "app-food-cc2b8.firebaseapp.com",
  projectId: "app-food-cc2b8",
  storageBucket: "app-food-cc2b8.firebasestorage.app",
  messagingSenderId: "1087945813368",
  appId: "1:1087945813368:web:f137f33a5963e1de43ec8d",
  measurementId: "G-RWP2JPJVQG",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
