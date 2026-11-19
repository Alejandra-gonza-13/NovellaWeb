import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getDatabase,
  ref,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "novella-bookstore.firebaseapp.com",
  databaseURL: "https://novella-bookstore-default-rtdb.firebaseio.com",
  projectId: "novella-bookstore",
  storageBucket: "novella-bookstore.firebasestorage.app",
  messagingSenderId: "41861244734",
  appId: "1:41861244734:web:4607b599e118d08a222e6f",
  measurementId: "G-PJMZNVG416"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

export const booksRef = ref(db, "books");
export const bookRef = (id) => ref(db, `books/${id}`);

export async function uploadImage(file) {
  const r = storageRef(storage, `book-covers/${crypto.randomUUID()}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

export async function deleteImage(url) {
  if (!url) return;
  try {
    await deleteObject(storageRef(storage, url));
  } catch (e) {
    console.warn("Image delete failed", e);
  }
}