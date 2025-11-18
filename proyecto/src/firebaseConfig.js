import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDCKG2Z-kx6cput7TXsLereA741k1ENxBg",
  authDomain: "anime-add54.firebaseapp.com",
  projectId: "anime-add54",
  storageBucket: "anime-add54.firebasestorage.app",
  messagingSenderId: "576239763868",
  appId: "1:576239763868:web:3132a0bb9e5195aa8b4859",
  measurementId: "G-6KVN00S4JG"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app); // ✅ ¡Esto es necesario!
export { auth, db };