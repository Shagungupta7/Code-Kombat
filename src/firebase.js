// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { setDoc, getDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKy4LxCyiSSCFHrwGkqenbewA3W3t4cvo",
  authDomain: "code-kombat.firebaseapp.com",
  projectId: "code-kombat",
  storageBucket: "code-kombat.firebasestorage.app",
  messagingSenderId: "767870271269",
  appId: "1:767870271269:web:7b2179d9443089d383e4cc",
  measurementId: "G-VHB55Y9369"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const auth = getAuth(app);
export { auth, provider, db};