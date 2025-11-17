import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "cambiar este dato",
    authDomain: "cambiar este dato",
    projectId: "cambiar este dato",
    storageBucket: "cambiar este dato",
    messagingSenderId: "cambiar este dato",
    appId: "cambiar este dato"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app); // ✅ ¡Esto es necesario!
export { auth, db };