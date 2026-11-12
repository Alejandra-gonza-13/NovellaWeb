import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    deleteUser
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8BSvUsiMU7NlerhAtf0Y6PXCZmvhNeaM",
  authDomain: "novella-bookstore.firebaseapp.com",
  projectId: "novella-bookstore",
  storageBucket: "novella-bookstore.firebasestorage.app",
  messagingSenderId: "41861244734",
  appId: "1:41861244734:web:4607b599e118d08a222e6f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.firebaseAuth = {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    deleteUser
};

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, deleteUser };